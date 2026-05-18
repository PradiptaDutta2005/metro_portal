import os
import smtplib
from email.mime.multipart import MIMEMultipart
from email.mime.text import MIMEText

from fastapi import APIRouter, HTTPException, Request
from pydantic import BaseModel, EmailStr

router = APIRouter()

# Load env vars (already assumed available)
USR_EMAIL = os.getenv("USR_EMAIL")
USR_PASSWORD = os.getenv("USR_PASSWORD")


class ContactRequest(BaseModel):
    name: str
    email: EmailStr
    message: str


@router.post("/contact")
async def contact(request: ContactRequest):
    try:
        # --- Build Email ---
        msg = MIMEMultipart()
        msg["From"] = request.email
        msg["To"] = USR_EMAIL
        msg["Subject"] = f"Contact Form Submission from {request.name}"

        body = f"""You have received a new message from your portfolio contact form:

Name: {request.name}
Email: {request.email}

Message:
{request.message}
"""
        msg.attach(MIMEText(body, "plain"))

        # --- SMTP (Gmail example) ---
        server = smtplib.SMTP("smtp.gmail.com", 587)
        server.starttls()
        server.login(USR_EMAIL, USR_PASSWORD)
        server.sendmail(request.email, USR_EMAIL, msg.as_string())
        server.quit()

        return {"message": "Email sent successfully!"}

    except Exception as e:
        print("SMTP error:", e)
        raise HTTPException(status_code=500, detail="Failed to send email.")
