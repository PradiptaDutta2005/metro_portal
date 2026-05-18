# dl_model/services/metrics.py
import json
import os
from typing import Optional

from dl_model.schemas.db_schema import InputRecord
from dl_model.services.db_service import SessionLocal
from fastapi import APIRouter
from job_distributor.models import JobCard, User
from sqlalchemy import func
from sqlalchemy.orm import Session

router = APIRouter()

BASE_DIR = os.path.dirname(os.path.dirname(os.path.dirname(os.path.abspath(__file__))))
MODEL_PATH = os.path.join(BASE_DIR, "model.h5")
METRICS_JSON_PATH = os.path.join(BASE_DIR, "training_metrics.json")


def safe_load_train_metrics() -> dict:
    """Read training_metrics.json if present, return dict or {}."""
    if not os.path.exists(METRICS_JSON_PATH):
        return {}
    try:
        with open(METRICS_JSON_PATH, "r", encoding="utf-8") as f:
            return json.load(f)
    except Exception as exc:
        print("Failed to read training_metrics.json:", exc)
        return {}


@router.get("/metrics-json")
def metrics_json():
    """Return structured JSON metrics for the dashboard."""
    response = {}

    # --- DL model metrics ---
    train_metrics = safe_load_train_metrics()
    if train_metrics:
        try:
            response["dl_model_accuracy"] = float(
                train_metrics.get("val_accuracy", 0.0) or 0.0
            )
        except Exception:
            response["dl_model_accuracy"] = 0.0
        response["dl_model_trained_at"] = train_metrics.get("trained_at")
    else:
        response["dl_model_accuracy"] = 0.0
        response["dl_model_trained_at"] = None

    response["dl_model_exists"] = os.path.exists(MODEL_PATH)

    # --- Rakes metrics ---
    db: Optional[Session] = None
    total_rakes = 0
    unfit_rakes = 0
    try:
        db = SessionLocal()
        total_rakes = db.query(InputRecord).count()
        unfit_rakes = (
            db.query(InputRecord).filter(InputRecord.label_text == "UNFIT").count()
        )
        if unfit_rakes == 0:
            unfit_rakes = db.query(InputRecord).filter(InputRecord.label == 0).count()

        # --- JobCard / User metrics ---

        engineer_jobs = (
            db.query(User.username, func.count(JobCard.id))
            .outerjoin(JobCard, User.id == JobCard.assigned_to)  # LEFT JOIN
            .filter(User.role == "engineer")
            .group_by(User.username)
            .all()
        )

        response["engineer_jobs"] = [
            {"engineer": row[0], "jobs": row[1]} for row in engineer_jobs
        ]
        response["engineers_active"] = len([row for row in engineer_jobs if row[1] > 0])

        response["engineer_jobs"] = [
            {"engineer": row[0], "jobs": row[1]} for row in engineer_jobs
        ]

        # Engineers active = number of engineers with ≥1 job
        response["engineers_active"] = len(engineer_jobs)

        # Pending/unassigned jobs (no assigned_to OR status is pending/unassigned)
        response["jobs_pending"] = (
            db.query(JobCard)
            .filter(
                (JobCard.assigned_to == None)
                | (JobCard.status.in_(["pending", "unassigned"]))
            )
            .count()
        )

    except Exception as exc:
        print("DB query error:", exc)
    finally:
        if db:
            db.close()

    response["rakes_total"] = total_rakes
    response["rakes_unfit"] = unfit_rakes
    response["rakes_fit"] = max(total_rakes - unfit_rakes, 0)

    return response
