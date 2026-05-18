Metro Portal 🚇

A modern smart metro management and passenger assistance platform built using Next.js and FastAPI.

The platform provides dashboards for passengers, engineers, maintainers, loco pilots, and metro employees with features like complaint management, train scheduling, AI-based prediction systems, monitoring dashboards, multilingual support, and real-time services.

Features
➜ Passenger Dashboard  
➜ Engineer Dashboard  
➜ Maintainer Dashboard  
➜ Loco Pilot Dashboard  
➜ Employee Dashboard  
➜ AI Predictor Module  
➜ Metro Schedule Management  
➜ Complaint & Helpline System   
➜ Monitoring Dashboard  
➜ Authentication System  
➜ Responsive UI  
Tech Stack
Frontend:
Next.js
Backend:
FastAPI
Python
Uvicorn
Database
Postgresql
Installation
Clone Repository
git clone https://github.com/PradiptaDutta2005/metro_portal.git

cd metro_portal
Frontend Setup (Next.js)

Install dependencies:

npm install

Run development server:

npm run dev

Frontend runs on:

http://localhost:3000
Backend Setup (FastAPI)

Create virtual environment:

python -m venv venv

Activate environment:

Windows
venv\Scripts\activate
Linux/Mac
source venv/bin/activate

Install dependencies:

pip install -r requirements.txt

Run FastAPI server:

uvicorn main:app --host 0.0.0.0 --reload

Backend runs on:

http://127.0.0.1:8000
Environment Variables

Create a .env file:

Frontend Production Build
npm run build
Start Production Server
npm start
Deployment
Frontend Deployment

Deploy frontend on:

Vercel
Backend Deployment

Deploy FastAPI backend on:
Render
Future Improvements
Real-time metro notifications
Live train tracking
Smart ticket integration
IoT integration
Cloud monitoring dashboard
