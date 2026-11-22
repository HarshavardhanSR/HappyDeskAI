# HappyDeskAI

HappyDeskAI is a finance workspace for small businesses. It combines cash-flow forecasts, budgets, transactions, alerts, reports, and an AI finance assistant in one web application.

The repository contains a Next.js frontend and a FastAPI backend. This guide covers local setup and deployment using Vercel (frontend) and Render (backend).

## Features

- Financial dashboard, transaction management, budgets, and goals
- Cash-flow forecasting, anomaly detection, and alerts
- AI-assisted finance questions and reporting
- Vendor, invoice, tax, approval, and scenario-planning workflows
- Clerk authentication, PostgreSQL persistence, Redis caching, and optional Plaid integration

## Repository layout

```text
.
├── .gitignore
├── README.md
└── CFO/
    ├── backend/   # FastAPI API and database migrations
    │   └── uploads/ # Sample CSVs; never add customer exports
    ├── frontend/  # Next.js web application
    └── tests/     # Scenario tests and test data
```

## Requirements

- Python 3.11 or newer
- Node.js 20.9 or newer
- PostgreSQL with the `pgvector` extension available
- Redis
- Clerk and OpenAI accounts for authentication and AI features

Plaid, email, Slack, and object-storage credentials are optional unless you enable those integrations. Never commit real credentials or customer data.

## Run locally

### 1. Get the code

```bash
git clone https://github.com/HarshavardhanSR/HappyDeskAI.git
cd HappyDeskAI
```

Create a PostgreSQL database and Redis instance, then configure the backend and frontend separately.

### 2. Configure and run the backend

```powershell
cd CFO\backend
python -m venv .venv
.\.venv\Scripts\Activate.ps1
pip install -r requirements.txt
Copy-Item .env.example .env
```

On macOS or Linux, activate the environment with `source .venv/bin/activate` and copy the template with `cp .env.example .env`.

Edit `CFO/backend/.env`. At minimum, set:

- `DATABASE_URL` to your PostgreSQL connection string (the app uses `postgresql+asyncpg://`)
- `REDIS_URL` to your Redis connection string
- `CLERK_SECRET_KEY`, `CLERK_PUBLISHABLE_KEY`, `CLERK_ISSUER`, and `CLERK_JWKS_URL` from your Clerk application
- `OPENAI_API_KEY` for AI chat
- `WEBHOOK_ENCRYPTION_KEY` to a newly generated Fernet key
- `CORS_ORIGINS` to a JSON array containing the frontend origin, for example `["http://localhost:3000"]`
- `APP_BASE_URL` to the frontend origin

Apply database migrations and start the API:

```powershell
alembic upgrade head
python seed_demo.py
uvicorn main:app --reload --port 8000
```

`seed_demo.py` is optional and adds fictional demo data. The API health check is at `http://localhost:8000/api/v1/health`; interactive API documentation is at `http://localhost:8000/docs`.

### 3. Configure and run the frontend

In a second terminal, from the repository root:

```powershell
cd CFO\frontend
npm ci
Copy-Item .env.example .env.local
npm run dev
```

On macOS or Linux, use `cp .env.example .env.local` instead. Set the Clerk keys in `.env.local`. The local API settings should point to `http://localhost:8000` and `http://localhost:8000/api/v1`.

Open `http://localhost:3000`.

## Deploy to Vercel and Render

Deploy the frontend and backend as separate services from the same GitHub repository. You will also need hosted PostgreSQL with `pgvector` and hosted Redis. Neon and Upstash are examples; choose providers that meet your availability, security, and budget requirements.

### Backend on Render

1. Create a Render Web Service from this repository and select the `main` branch.
2. Set **Root Directory** to `CFO/backend`.
3. Use `pip install -r requirements.txt` as the build command.
4. Use `uvicorn main:app --host 0.0.0.0 --port $PORT` as the start command.
5. Set the health-check path to `/api/v1/health`.
6. Add the backend variables listed in `CFO/backend/.env.example` to Render's environment settings. Use production values, set `DEBUG=false`, and do not use localhost URLs.
7. Set `CORS_ORIGINS` to a JSON array containing the final Vercel URL, and set `APP_BASE_URL` to that URL.
8. Run `alembic upgrade head` from the backend service directory before sending traffic to a new database.

Generate a unique `WEBHOOK_ENCRYPTION_KEY` and `KEY_DERIVATION_SALT` for each environment. Set `PLAID_*`, email, and Slack variables only when those integrations are configured.

The default upload directory is local to the backend instance. Hosted instance filesystems may be temporary; attach a persistent disk and set `UPLOAD_DIR` to its mount path before relying on uploaded files. The optional S3 backend needs additional setup and is not enabled by the default dependencies.

### Frontend on Vercel

1. Import the same GitHub repository as a Vercel project.
2. Set **Root Directory** to `CFO/frontend` and use the Next.js framework preset.
3. Add these environment variables in Vercel:
   - `NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY`
   - `CLERK_SECRET_KEY`
   - `NEXT_PUBLIC_API_URL=https://<your-render-service>.onrender.com/api/v1`
   - `BACKEND_URL=https://<your-render-service>.onrender.com`
4. Add the Vercel production URL to the Clerk application's allowed origins and redirect URLs.
5. After deployment, confirm that the Render `CORS_ORIGINS` includes the exact Vercel origin and redeploy the backend if needed.

Vercel and Render can deploy automatically when changes are pushed to the connected branch. Set credentials in each provider's environment settings or GitHub Actions secrets, never in the repository.

## Tests

Run the frontend test suite with:

```powershell
cd CFO\frontend
npm ci
npm test
```

Backend tests are in `CFO/backend/tests`; they require the backend test dependencies and configured PostgreSQL/Redis services.

## Security and project use

Do not use real financial data until you have reviewed the application's security, access controls, backups, and compliance requirements for your deployment. Keep `.env`, `.env.local`, API keys, and uploaded customer files out of Git.

There is currently no `LICENSE` file in this repository. Ask the repository owner before redistributing or reusing the code.
