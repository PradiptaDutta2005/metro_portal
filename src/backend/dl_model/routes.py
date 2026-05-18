# dl_model/services/training_service.py
import datetime
import json
import os
import random
from typing import Optional

import numpy as np
import tensorflow as tf
from apscheduler.schedulers.background import BackgroundScheduler
from celery import Celery
from dl_model.schemas.db_schema import InputRecord
from dl_model.services.db_service import SessionLocal
from dotenv import load_dotenv
from fastapi import APIRouter, HTTPException
from job_distributor.tasks import create_job_for_input
from pydantic import BaseModel
from sqlalchemy.orm import Session

# new import for validation record creation
from validation.service import create_validation_record

load_dotenv()
router = APIRouter()

SEED = 42
np.random.seed(SEED)
tf.random.set_seed(SEED)
random.seed(SEED)
os.environ["PYTHONHASHSEED"] = str(SEED)

# Model path inside dl_model folder
BASE_DIR = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
MODEL_PATH = os.path.join(BASE_DIR, "model.h5")


class SubmitInput(BaseModel):
    """Pydantic model for /submit payload."""

    id: int
    H1: float
    DV_pressure: float
    Reservoirs: float
    Oil_temperature: float
    Motor_current: float
    COMP: Optional[str] = None
    DV_electric: Optional[str] = None
    Towers: Optional[str] = None
    MPG: float
    LPS: Optional[str] = None
    Pressure_switch: Optional[str] = None
    Oil_level: float
    Caudal_impulses: float
    engineer: Optional[str] = None


def train_model() -> None:
    """
    Fetch labeled data from Postgres (dl_inputs) and train model.

    - Skip rows with missing labels.
    - Accept numeric label column `label` (0/1) or textual `label_text` ('FIT'/'UNFIT').
    - Require at least 2 classes to train; otherwise log and return.
    """
    db: Session = SessionLocal()
    try:
        all_rows = db.query(InputRecord).all()
    finally:
        db.close()

    if not all_rows:
        print("⚠️ No data available for training")
        return

    # Build (features, label) pairs while handling missing labels
    data_X = []
    data_y = []

    for r in all_rows:
        # Prefer numeric label if present
        lbl = getattr(r, "label", None)
        if lbl is None:
            # fallback to textual label_text if present
            txt = getattr(r, "label_text", None)
            if txt is not None:
                txt = str(txt).strip().lower()
                if txt in ("fit", "1", "true", "yes"):
                    lbl = 1
                elif txt in ("unfit", "0", "false", "no"):
                    lbl = 0
                else:
                    # unknown/ambiguous textual label -> skip
                    lbl = None

        # If still None -> skip this row
        if lbl is None:
            continue

        # Extract features - ensure numeric fields are present
        try:
            feats = [
                float(r.H1),
                float(r.DV_pressure),
                float(r.Reservoirs),
                float(r.Oil_temperature),
                float(r.Motor_current),
                float(r.MPG),
                float(r.Oil_level),
                float(r.Caudal_impulses),
            ]
        except Exception as ex:
            # skip rows with bad feature values but log
            print(
                f"Skipping row id={getattr(r, 'id', None)} due to feature error: {ex}"
            )
            continue

        data_X.append(feats)
        data_y.append(int(lbl))

    if not data_X:
        print("⚠️ After filtering, no labeled rows are available for training")
        return

    X = np.array(data_X, dtype=np.float32)
    y = np.array(data_y, dtype=np.float32).reshape(-1, 1)

    # Check class balance: need at least two classes to train a classifier
    unique_classes, counts = np.unique(y, return_counts=True)
    if unique_classes.size < 2:
        print(
            f"⚠️ Need >=2 classes to train (found classes: {unique_classes}, counts: {counts})."
        )
        return

    # If any class has fewer than 2 samples, we cannot stratify; fall back to non-stratified split
    from sklearn.model_selection import (  # local import to keep top-level light
        train_test_split,
    )

    stratify_arg = y if np.all(counts >= 2) else None
    if stratify_arg is None:
        print(
            "⚠️ Some classes have <2 samples — performing train/val split without stratify."
        )

    X_train, X_val, y_train, y_val = train_test_split(
        X, y, test_size=0.2, random_state=SEED, stratify=stratify_arg
    )

    # Define simple NN — replace with your real architecture if needed
    model = tf.keras.Sequential(
        [
            tf.keras.layers.Input(shape=(X.shape[1],)),
            tf.keras.layers.Dense(
                64,
                activation="relu",
                kernel_regularizer=tf.keras.regularizers.l2(0.001),
            ),
            tf.keras.layers.Dropout(0.3),
            tf.keras.layers.Dense(
                32,
                activation="relu",
                kernel_regularizer=tf.keras.regularizers.l2(0.001),
            ),
            tf.keras.layers.Dropout(0.2),
            tf.keras.layers.Dense(1, activation="sigmoid"),
        ]
    )

    model.compile(
        optimizer=tf.keras.optimizers.Adam(learning_rate=5e-4),
        loss="binary_crossentropy",
        metrics=["accuracy"],
    )

    callback_list = [
        tf.keras.callbacks.EarlyStopping(
            monitor="val_accuracy", patience=5, restore_best_weights=True
        ),
        tf.keras.callbacks.ModelCheckpoint(
            MODEL_PATH, monitor="val_accuracy", save_best_only=True
        ),
    ]

    model.fit(
        X_train,
        y_train,
        epochs=20,
        batch_size=32,
        validation_data=(X_val, y_val),
        callbacks=callback_list,
        verbose=1,
    )

    # evaluate
    val_loss, val_acc = model.evaluate(X_val, y_val, verbose=0)
    print(f"Validation acc: {val_acc:.4f}")

    # Save trained model
    model.save(MODEL_PATH)

    # Save training metrics to disk (for /dl/status or responses)
    metrics = {
        "val_accuracy": float(val_acc),
        "trained_at": datetime.datetime.utcnow().isoformat(),
        "n_rows": int(len(X)),
        "class_counts": {
            int(c): int(v) for c, v in zip(unique_classes.tolist(), counts.tolist())
        },
    }
    metrics_path = os.path.join(BASE_DIR, "training_metrics.json")
    with open(metrics_path, "w") as f:
        json.dump(metrics, f)

    print(f"✅ Model retrained and saved at {MODEL_PATH} - val_acc={val_acc:.4f}")


def load_trained_model():
    """Load trained model from disk, return None if missing."""
    if not os.path.exists(MODEL_PATH):
        print("⚠️ No trained model found yet")
        return None
    return tf.keras.models.load_model(MODEL_PATH)


def load_train_metrics():
    """Return training metrics dict read from training_metrics.json if present."""
    metrics_path = os.path.join(BASE_DIR, "training_metrics.json")
    if not os.path.exists(metrics_path):
        return {}
    with open(metrics_path) as f:
        return json.load(f)


def start_scheduler() -> None:
    """Start a background scheduler that trains the model once daily at TRAIN_TIME (UTC)."""
    train_time = os.getenv("TRAIN_TIME", "00:00")  # default midnight UTC
    hour, minute = map(int, train_time.split(":"))

    scheduler = BackgroundScheduler(timezone="UTC")
    scheduler.add_job(train_model, "cron", hour=hour, minute=minute)
    scheduler.start()
    print(
        f"⏰ Scheduler started — model will retrain daily at {hour:02d}:{minute:02d} UTC"
    )


@router.get("/status")
def status():
    """Health/status endpoint for the DL model."""
    model = load_trained_model()
    return {
        "scheduler": os.getenv("TRAIN_TIME", "00:00") + " UTC (scheduled)",
        "trained_model_exists": model is not None,
        "val_accuracy": load_train_metrics().get("val_accuracy"),
    }


@router.post("/submit")
def submit(input_data: SubmitInput):
    """
    Insert new dl_inputs row, run the trained DL model synchronously on the new row,
    return a structured report for frontend/PDF generation.

    This endpoint:
    - inserts a new InputRecord,
    - runs inference using the trained model,
    - persists prediction into label_text and label for metrics,
    - enqueues a job via Celery when predicted_label == "UNFIT",
    - returns a `report` dict consumed by frontend / PDF generator.
    """
    # 1) Insert record
    db: Session = SessionLocal()
    try:
        record = InputRecord(
            H1=input_data.H1,
            DV_pressure=input_data.DV_pressure,
            Reservoirs=input_data.Reservoirs,
            Oil_temperature=input_data.Oil_temperature,
            Motor_current=input_data.Motor_current,
            COMP=input_data.COMP,
            DV_electric=input_data.DV_electric,
            Towers=input_data.Towers,
            MPG=input_data.MPG,
            LPS=input_data.LPS,
            Pressure_switch=input_data.Pressure_switch,
            Oil_level=input_data.Oil_level,
            Caudal_impulses=input_data.Caudal_impulses,
            engineer=input_data.engineer,
        )
        db.add(record)
        db.commit()
        db.refresh(record)
    except Exception as e:
        db.rollback()
        raise HTTPException(status_code=500, detail=f"DB insert failed: {e}")
    finally:
        db.close()

    # 2) Load model and run inference
    model = load_trained_model()
    if model is None:
        raise HTTPException(
            status_code=503,
            detail="No trained DL model available. Train model first (/dl/train-now).",
        )

    db2: Session = SessionLocal()
    try:
        rec = db2.query(InputRecord).filter(InputRecord.id == record.id).one_or_none()
        if rec is None:
            raise HTTPException(
                status_code=500, detail="Inserted record not found for inference"
            )

        # Build features in the same order as training
        features = [
            rec.H1,
            rec.DV_pressure,
            rec.Reservoirs,
            rec.Oil_temperature,
            rec.Motor_current,
            rec.MPG,
            rec.Oil_level,
            rec.Caudal_impulses,
        ]
        X = np.array([features], dtype=np.float32)

        prob = float(model.predict(X, verbose=0)[0][0])
        predicted_label = "FIT" if prob >= 0.5 else "UNFIT"

        # --- Build report_lines + maintenance_actions ---
        # Example simple standards (replace with real ones or load dynamically)
        standards = {
            "H1": (9, 12),
            "DV_pressure": (5, 25),
            "Reservoirs": (10, 20),
            "Oil_temperature": (40, 70),
            "Motor_current": (0, 10),
            "MPG": (0, 10),
            "Oil_level": (80, 100),
            "Caudal_impulses": (500, 2000),
        }

        report_lines = []
        maintenance_actions = []

        for param, (low, high) in standards.items():
            entered = getattr(rec, param)
            if entered is None:
                continue

            status = "OK" if low <= entered <= high else "NOT_OK"
            line = {
                "param": param,
                "entered": entered,
                "standard": [low, high],
                "status": status,
            }
            report_lines.append(line)

            if status == "NOT_OK":
                maintenance_actions.append(
                    {
                        "param": param,
                        "entered": entered,
                        "standard": [low, high],
                    }
                )

        # 3) Persist prediction into db (label_text and label) for metrics
        try:
            db3: Session = SessionLocal()
            rec_for_update = (
                db3.query(InputRecord).filter(InputRecord.id == record.id).one_or_none()
            )
            if rec_for_update is not None:
                rec_for_update.label_text = predicted_label
                rec_for_update.label = 1 if predicted_label == "FIT" else 0
                db3.add(rec_for_update)
                db3.commit()
            db3.close()
        except Exception as e:
            # do not fail inference response if metrics persistence fails
            print("Warning: could not persist prediction:", e)

        # 4) Build response for frontend
        response = {
            "report": {
                "rakeId": rec.id,  # present DB id, frontend expects rakeId
                "engineer": rec.engineer,
                "overall_status": predicted_label,
                "report_lines": report_lines,
                "maintenance_actions": maintenance_actions,
            }
        }
        failed_params = [line["param"] for line in report_lines if line["status"] == "NOT_OK"]

        # Create validation record only when DL flagged UNFIT
        if predicted_label == "UNFIT":
            try:
                val_rec = create_validation_record(
                    dl_input_id=rec.id,
                    rake_identifier=str(rec.id),  # or rec.rake_id if present
                    dl_probability=prob,
                    issues=failed_params,
                    dl_payload={"report_lines": report_lines, "maintenance_actions": maintenance_actions},
                )
                # attach validation id into response for frontend convenience
                response["report"]["validation_id"] = getattr(val_rec, "id", None)
            except Exception as e:
                print("Warning: could not create validation record:", e)

        # 5) Enqueue job if UNFIT (Celery)
        if predicted_label == "UNFIT":
            try:
                task = create_job_for_input.delay(rec.id)
                response["report"]["job_enqueued"] = True
                response["report"]["task_id"] = task.id
            except Exception as e:
                response["report"]["job_enqueued"] = False
                response["report"]["enqueue_error"] = str(e)
        else:
            response["report"]["job_enqueued"] = False

        # include probability for caller convenience (preserve old behavior for debugging)
        response["probability"] = prob
        response["prediction"] = predicted_label

        return response

    except HTTPException:
        raise
    except Exception as e:
        # unexpected error during inference
        raise HTTPException(status_code=500, detail=f"Inference failed: {e}")
    finally:
        db2.close()


@router.post("/train-now")
def train_now():
    """Manual training trigger (use from Postman to force training now)."""
    try:
        train_model()  # synchronous blocking call
        return {
            "ok": True,
            "msg": "Training run completed (or scheduled training started)",
        }
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))
