from typing import Optional

from fastapi import APIRouter, Depends, HTTPException
from job_distributor.tasks import assign_existing_job, assign_unassigned_jobs
from pydantic import BaseModel
from sqlalchemy.orm import Session

from .db import get_db
from .models import JobCard, User

router = APIRouter()

class ReassignBody(BaseModel):
    job_id: int
    user_id: int
# --- List Jobs ---
# --- List Jobs ---
@router.get("/jobs")
def list_jobs(status: Optional[str] = None, db: Session = Depends(get_db)):
    q = (
        db.query(JobCard)
        .join(User, JobCard.assigned_to == User.id, isouter=True)
        .filter((User.role == "engineer") | (JobCard.assigned_to == None))
    )

    if status:
        q = q.filter(JobCard.status == status)

    jobs = q.all()

    results = []
    for j in jobs:
        # Extract issues (very simple: just collect feature names from reasons if they exist)
        issues = []
        if j.reasons:
            try:
                for r in j.reasons:
                    if isinstance(r, dict):
                        issues.append(r.get("feature"))
            except Exception:
                pass

        results.append(
            {
                "id": j.id,
                "status": j.status,
                "assigned_to": j.assigned_to,
                "title": j.title,
                "priority": j.priority,
                "issues": issues,  # 👈 frontend can display this
            }
        )

    return results


@router.post("/jobs/reassign")
def reassign(body: ReassignBody, db: Session = Depends(get_db)):
    job = db.query(JobCard).filter(JobCard.id == body.job_id).one_or_none()
    if not job:
        raise HTTPException(404, "Job not found")

    user = (
        db.query(User)
        .filter(User.id == body.user_id, User.role == "engineer")
        .one_or_none()
    )
    if not user:
        raise HTTPException(400, "Assigned user must be an engineer")

    job.assigned_to = body.user_id
    job.status = "assigned"
    db.add(job)
    db.commit()
    db.refresh(job)

    # 👇 use correct attribute from your User model
    return {
        "ok": True,
        "job_id": job.id,
        "assigned_to": user.name,   # or user.email if that’s what you want
    }


# --- Assign All Unassigned ---
@router.post("/jobs/assign-unassigned")
def assign_all_unassigned():
    """Assign all backlog jobs that are still unassigned"""
    task = assign_unassigned_jobs.delay()
    return {"ok": True, "task_id": task.id}
