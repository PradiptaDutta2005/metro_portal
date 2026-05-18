import logging
import math

import numpy as np
import pandas as pd
import tensorflow as tf
from sqlalchemy import text

from .assigner import assign_job_to_engineer
from .celery_app import celery
from .config import MODEL_PATH
from .db import SessionLocal
from .explainers import quick_explain, shap_explain
from .models import JobCard

logger = logging.getLogger(__name__)

# load model lazily to avoid startup overhead
_model = None


def make_json_safe(obj):
    if obj is None:
        return None
    if isinstance(obj, (np.floating, float)):
        if math.isnan(obj) or math.isinf(obj):
            return None  # or "NaN"
        return float(obj)
    if isinstance(obj, (np.integer, int)):
        return int(obj)
    if isinstance(obj, (list, tuple)):
        return [make_json_safe(x) for x in obj]
    if isinstance(obj, dict):
        return {k: make_json_safe(v) for k, v in obj.items()}
    return obj


def get_model():
    global _model
    if _model is None:
        if not tf.io.gfile.exists(MODEL_PATH):
            raise RuntimeError("Model file not found")
        _model = tf.keras.models.load_model(MODEL_PATH)
    return _model


@celery.task(name="job_distributor.assign_existing_job", bind=True)
def assign_existing_job(self, job_id: int):
    """
    Assign an existing job card (already in DB).
    Useful for backlog jobs that don't have assigned engineers yet.
    """
    db = SessionLocal()
    try:
        job = db.query(JobCard).filter(JobCard.id == job_id).first()
        if not job:
            return {"ok": False, "reason": f"job_id {job_id} not found"}

        if job.assigned_to:
            return {"ok": False, "reason": f"job_id {job_id} already assigned"}

        assign_result = assign_job_to_engineer(job.id)

        return {"ok": True, "job_id": job.id, "assigned": assign_result}
    except Exception:
        db.rollback()
        raise
    finally:
        db.close()


@celery.task(name="job_distributor.assign_unassigned_jobs", bind=True)
def assign_unassigned_jobs(self):
    """
    Assign all unassigned jobs in job_cards to engineers.
    """
    db = SessionLocal()
    try:
        unassigned = (
            db.execute(text("SELECT id FROM job_cards WHERE assigned_to IS NULL"))
            .mappings()
            .all()
        )
        results = []
        for row in unassigned:
            job_id = row["id"]
            result = assign_job_to_engineer(job_id)
            results.append({"job_id": job_id, "assigned": result})
        return {"ok": True, "results": results}
    except Exception as e:
        db.rollback()
        raise
    finally:
        db.close()


@celery.task(name="job_distributor.create_job_for_input", bind=True)
def create_job_for_input(self, dl_input_id):
    """
    Entry task: given a dl_inputs.id, load the record, run model inference,
    if unfit => create job_card (with reasons + suggested actions) and call assigner.
    """
    db = SessionLocal()
    try:
        # 1) Fetch input row
        input_row = (
            db.execute(
                text("SELECT * FROM dl_inputs WHERE id = :id"), {"id": dl_input_id}
            )
            .mappings()
            .fetchone()
        )
        if input_row is None:
            return {"ok": False, "reason": f"dl_input {dl_input_id} not found"}

        # 2) Features (match training order)
        feature_cols = [
            "h1",
            "dv_pressure",
            "reservoirs",
            "oil_temperature",
            "motor_current",
            "mpg",
            "oil_level",
            "caudal_impulses",
        ]
        X_row = pd.Series({f: input_row[f] for f in feature_cols})
        X_df = pd.DataFrame([X_row.values], columns=feature_cols)

        # 3) Run prediction
        model = get_model()
        prob = float(model.predict(X_df, verbose=0)[0][0])
        predicted_unfit = prob < 0.75  # keep threshold consistent with /submit

        if not predicted_unfit:
            return {"ok": False, "reason": "Rake predicted FIT", "prob": prob}

        # 4) Explain reasons (prefer SHAP, fallback to quick_explain)
        try:
            reasons = shap_explain(model, X_df)
        except Exception:
            reasons = None
        if not reasons:
            reasons = quick_explain(X_row, X_df.mean().iloc[0:], X_df.std().iloc[0:])

        # 5) Suggested actions (based on reasons)
        suggested_actions = [
            f"Check and calibrate {r['feature']} (observed {r.get('value')} vs expected {r.get('expected', 'range')})"
            for r in reasons
        ]

        # 6) Create JobCard in DB
        job = JobCard(
            dl_input_id=dl_input_id,
            status="pending",
            title=f"Rake {dl_input_id} – UNFIT (prob={prob:.2f})",
            description=f"Automatically generated job: predicted UNFIT with probability {prob:.2f}",
            reasons=make_json_safe(reasons),
            suggested_actions=make_json_safe(suggested_actions),
            meta_info=make_json_safe({"prob": prob}),
        )
        db.add(job)
        db.commit()
        db.refresh(job)

        # 7) Assign to engineer via assigner
        assign_result = assign_job_to_engineer(job.id)
        logger.info(f"✅ Created job_card id={job.id} for dl_input_id={dl_input_id}")

        return {
            "ok": True,
            "job_id": job.id,
            "prob": prob,
            "reasons": reasons,
            "suggested_actions": suggested_actions,
            "assigned": assign_result,
        }

    except Exception as e:
        db.rollback()
        logger.exception(f"❌ Failed to create job for dl_input_id={dl_input_id}: {e}")
        raise e
    finally:
        db.close()
