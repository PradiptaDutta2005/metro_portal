import logging

from sqlalchemy import func

from .config import ASSIGNMENT_MAX_TASKS
from .db import SessionLocal
from .models import JobCard, User

logger = logging.getLogger(__name__)


def assign_job_to_engineer(job_id: int):
    db = SessionLocal()
    try:
        # 1. Fetch engineers
        engineers = db.query(User).filter(User.role == "engineer").all()
        if not engineers:
            msg = f"No engineers available for job_id={job_id}"
            logger.warning(msg)
            return {"ok": False, "reason": msg}

        # 2. Compute load per engineer
        loads = []
        for eng in engineers:
            cnt = (
                db.query(func.count(JobCard.id))
                .filter(
                    JobCard.assigned_to == eng.id,
                    JobCard.status.in_(["assigned", "in_progress"]),
                )
                .scalar()
            )
            loads.append((eng, cnt))

        # 3. Pick engineers under capacity
        free = [(e, c) for e, c in loads if c < ASSIGNMENT_MAX_TASKS]
        if not free:
            free = sorted(loads, key=lambda x: x[1])[:1]

        # 4. Choose least loaded
        chosen, cur_cnt = sorted(free, key=lambda x: x[1])[0]

        # 5. Update job
        job = db.query(JobCard).filter(JobCard.id == job_id).one_or_none()
        if job is None:
            msg = f"Job {job_id} not found"
            logger.error(msg)
            return {"ok": False, "reason": msg}

        job.assigned_to = chosen.id
        job.status = "assigned"
        db.add(job)
        db.commit()
        db.refresh(job)

        result = {
            "ok": True,
            "job_id": job_id,
            "assigned_to": chosen.id,
        }

        logger.info(
            f"✅ Assigned job {job_id} to engineer id={chosen.id} (current load={cur_cnt})"
        )
        return result

    except Exception as e:
        db.rollback()
        logger.exception(f"❌ Failed to assign job {job_id}: {e}")
        return {"ok": False, "reason": str(e)}
    finally:
        db.close()
