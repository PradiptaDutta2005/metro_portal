import datetime
import json
import os
import random

import numpy as np
import tensorflow as tf
from apscheduler.schedulers.background import BackgroundScheduler
from dl_model.schemas.db_schema import InputRecord
from dl_model.services.db_service import SessionLocal
from dotenv import load_dotenv
from sklearn.model_selection import train_test_split
from sqlalchemy.orm import Session

load_dotenv()

TRAIN_TIME = os.getenv("TRAIN_TIME")

SEED = 42
np.random.seed(SEED)
tf.random.set_seed(SEED)
random.seed(SEED)
os.environ["PYTHONHASHSEED"] = str(SEED)

# Save model in backend root, not inside services/
BACKEND_DIR = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
MODEL_PATH = os.path.join(BACKEND_DIR, "model.h5")


def train_model():
    """Fetch labeled data from Postgres (dl_inputs) and train model."""
    db: Session = SessionLocal()
    try:
        # only rows that have a numeric label
        records = db.query(InputRecord).filter(InputRecord.label != None).all()
    finally:
        db.close()

    if not records:
        print("⚠️ No labeled data available for training")
        return

    # Build X and y
    X = np.array(
        [
            [
                r.H1,
                r.DV_pressure,
                r.Reservoirs,
                r.Oil_temperature,
                r.Motor_current,
                r.MPG,
                r.Oil_level,
                r.Caudal_impulses,
            ]
            for r in records
        ],
        dtype=np.float32,
    )

    y = np.array([int(r.label) for r in records], dtype=np.float32).reshape(-1, 1)

    # Sanity: ensure we have at least two classes
    if len(set(y.flatten().tolist())) < 2:
        print("⚠️ Need examples of both FIT and UNFIT to train. Add more labeled data.")
        return

    # split
    X_train, X_val, y_train, y_val = train_test_split(
        X, y, test_size=0.2, random_state=SEED, stratify=y
    )

    # model architecture (same as before)
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

    # Train (adjust epochs as you collect more data)
    callback_list = [
        tf.keras.callbacks.EarlyStopping(
            monitor="val_accuracy", patience=8, restore_best_weights=True
        ),
        tf.keras.callbacks.ModelCheckpoint(
            MODEL_PATH, monitor="val_accuracy", save_best_only=True
        ),
    ]

    history = model.fit(
        X_train,
        y_train,
        epochs=25,
        batch_size=64,
        validation_data=(X_val, y_val),
        callbacks=callback_list,
        verbose=1,
    )

    # evaluate
    val_loss, val_acc = model.evaluate(X_val, y_val, verbose=0)

    # Save model
    model.save(MODEL_PATH)

    # Save training metrics to file for /dl/status or reference
    metrics = {
        "val_accuracy": float(val_acc),
        "trained_at": datetime.datetime.utcnow().isoformat(),
    }
    metrics_path = os.path.join(BACKEND_DIR, "training_metrics.json")
    with open(metrics_path, "w") as f:
        json.dump(metrics, f)

    print(f"✅ Model retrained and saved at {MODEL_PATH} — val_acc={val_acc:.4f}")


def load_trained_model():
    """Load the latest trained model from disk for inference."""
    if not os.path.exists(MODEL_PATH):
        raise FileNotFoundError(
            f"⚠️ Trained model not found at {MODEL_PATH}. Run training first."
        )
    return tf.keras.models.load_model(MODEL_PATH)


def start_scheduler():
    """Start background scheduler that retrains model every night at TRAIN_TIME (UTC)."""
    train_time = os.getenv("TRAIN_TIME")  # default = midnight UTC
    hour, minute = map(int, train_time.split(":"))

    scheduler = BackgroundScheduler(timezone="UTC")
    scheduler.add_job(train_model, "cron", hour=hour, minute=minute)
    scheduler.start()
    print(f"🕒 Scheduler started — model will retrain daily at {train_time} UTC")
