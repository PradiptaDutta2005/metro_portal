import os

from apscheduler.schedulers.background import BackgroundScheduler
from dl_model.services.training_service import (
    load_trained_model,
    start_scheduler,
    train_model,
)
from dotenv import load_dotenv
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

load_dotenv()

# Import your existing routers
from auth import routes as auth_routes
from chatbot.routes import router as chatbot_router
from complaints import routes as complaints_router
from dl_model.routes import router as dl_model_router
from dl_model.services.metrics import router as metrics_router
from footer.contact_routes import router as contact_router
from job_distributor.api import router as job_distributor_router
from validation.routes import router as validation_router
from engineer.routes import router as engineer_router
from locopilot.routes import router as locopilot_router

# --- FastAPI instance ---
app = FastAPI(title="MetroSaathi")

# --- CORS middleware ---
origins = ["http://localhost:3000"]
app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Scheduler setup
scheduler = BackgroundScheduler(timezone="UTC")
TRAIN_TIME = os.getenv("TRAIN_TIME_UTC", "02:00")  # e.g., 02:00 UTC
hour, minute = map(int, TRAIN_TIME.split(":"))


@scheduler.scheduled_job("cron", hour=hour, minute=minute)
def scheduled_training():
    train_model()


@app.on_event("startup")
async def startup_event():
    start_scheduler()
    # Load latest trained model into memory
    global model
    try:
        model = load_trained_model()
        print("✅ Loaded latest trained model at startup")
    except Exception:
        print("⚠️ No trained model found yet. Will train at scheduled time.")


app.include_router(auth_routes.router)
app.include_router(chatbot_router, prefix="/api")
app.include_router(dl_model_router, prefix="/api/dl_model")
app.include_router(job_distributor_router, prefix="/api/job_distributor")
app.include_router(metrics_router, prefix="/api/dl_model")
app.include_router(complaints_router.router)
app.include_router(contact_router, prefix="/api")
app.include_router(validation_router, prefix="/api/validation")
app.include_router(engineer_router, prefix="/api")
app.include_router(locopilot_router)
