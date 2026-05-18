import os

from dotenv import load_dotenv

load_dotenv()

DATABASE_URL = os.getenv("DATABASE_URL")
REDIS_URL = os.getenv("REDIS_URL", "redis://redis:6379/0")
BACKEND_DIR = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
MODEL_PATH = os.path.join(BACKEND_DIR, "model.h5")
ASSIGNMENT_MAX_TASKS = int(
    os.getenv("ASSIGNMENT_MAX_TASKS", "3")
)  # max tasks per engineer
