import os

import google.generativeai as genai
from dotenv import load_dotenv
from fastapi import APIRouter
from pydantic import BaseModel

# Load environment variables
load_dotenv()

GEMINI_API_KEY = os.getenv("GEMINI_API_KEY")

if not GEMINI_API_KEY:
    raise ValueError("GEMINI_API_KEY not found in environment variables.")

# Configure Gemini
genai.configure(api_key=GEMINI_API_KEY)

router = APIRouter()

# Mock knowledge base (later replace with vector DB / RAG)
FAQS = {
    "ticket": "You can purchase metro tickets using smart cards or QR codes at stations.",
    "fare": "Metro fare in India varies by city, distance, and ticket type. For example, Kochi Metro ranges from ₹10 to ₹60.",
    "contact": "For issues, passengers can contact the metro helpline or customer care available at stations.",
}


class ChatRequest(BaseModel):
    message: str


class ChatResponse(BaseModel):
    response: str


@router.post("/chat", response_model=ChatResponse)
async def chat(request: ChatRequest):
    user_msg = request.message.lower()

    # First try simple FAQ match
    for keyword, answer in FAQS.items():
        if keyword in user_msg:
            return ChatResponse(response=answer)

    # If not found in FAQ, fall back to Gemini
    try:
        model = genai.GenerativeModel("gemini-2.0-flash")
        prompt = (
            "You are an assistant for Indian Metro Rail systems called MetroSaathi"
            "(specialising only in Kochi Metro Railway Limited). Every single question is to be answered according to the standards set by Kochi Metro Railway  "
            "Answer the user's query clearly, factually, and concisely. "
            "If the query is unrelated to Indian metro systems, politely decline. "
            "Use the following context if anything is asked regarding our application named StationSync:"
            "\n\nContext: StationSync is a modern, responsive, robust application made for metro rail employees, admins, supervisors, maintainers and other staff to efficiently manage day-to-day carshed tasks like rake fitness checking, automated job card creation, etc."
            f"\n\nUser query: {request.message}"
        )
        response = model.generate_content(prompt)
        return ChatResponse(response=response.text)

    except Exception as e:
        return ChatResponse(response=f"⚠️ Error contacting Gemini API: {str(e)}")
