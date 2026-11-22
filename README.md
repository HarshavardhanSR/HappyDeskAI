# HappyDeskAI

Maintained by Harshavardhan SR.

HappyDeskAI is an AI-powered finance workspace that helps small businesses bring financial insights, forecasting, and day-to-day operations together. It provides a financial dashboard, a conversational CFO assistant, cash flow forecasting, proactive alerts, budgeting, and reporting. The application is a FastAPI backend in `CFO/backend` with a Next.js frontend in `CFO/frontend`.

## Repository layout

`CFO/` contains the FastAPI backend and Next.js frontend.

Clone with:

```bash
git clone https://github.com/HarshavardhanSR/HappyDeskAI.git
```

## Setup and running

Full setup and run instructions are in [CFO/README.md](CFO/README.md). The backend and frontend setup commands are:

Backend (from the repository root):

```bash
cd CFO/backend
python -m venv .venv
.venv\Scripts\activate   # Windows
# source .venv/bin/activate  # macOS/Linux
pip install -r requirements.txt
cp .env.example .env
alembic upgrade head
python seed_demo.py
uvicorn main:app --reload --port 8000
```

Frontend (from the repository root):

```bash
cd CFO/frontend
npm install
cp .env.example .env.local
npm run dev
```

The app will be available at `http://localhost:3000`.

## Configuration

The backend and frontend each include a `.env.example` file in `CFO/backend` and `CFO/frontend`. Copy each one to `.env` (for the frontend, `.env.local` as shown above) and fill in your own values locally. Do not commit real secrets.
