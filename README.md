# CloudWise AI

**Autonomous FinOps Copilot for AWS Infrastructure**

CloudWise AI connects to your AWS account, discovers infrastructure, analyzes costs,
detects anomalies, forecasts spending, generates optimization recommendations, and
explains it all in plain English via an AI Copilot.

> Built for a 5-day hackathon sprint (June 11–15) by team **ideaforge**.

---

## Tech Stack

| Layer      | Technology |
|------------|------------|
| Frontend   | React 19 + TypeScript + Vite + Tailwind CSS v4 + TanStack Query + Recharts |
| Backend    | Python 3.11 + FastAPI + SQLAlchemy 2 + Alembic + Pydantic v2 |
| Database   | PostgreSQL 16 (Production) / SQLite (Local Dev Auto-Fallback) |
| AWS        | Boto3 (Cost Explorer, CloudWatch, EC2, EBS) |
| ML         | scikit-learn (Isolation Forest), Prophet (forecasting) |
| AI         | Groq API — Llama 3.3 70B (Copilot) |
| Auth       | JWT + Argon2 password hashing |
| Deployment | Railway (backend + DB), Vercel (frontend) |

---

## Project Structure

```
cloudwise-ai/
├── frontend/          React + TypeScript app
├── backend/           FastAPI app
├── docs/              PRD, TRD, AFD, UI/UX Brief, Schema, Security Policy, Implementation Plan
└── docker-compose.yml Local dev environment (Postgres + Backend)
```

---

## Getting Started (Local Development)

### Prerequisites
- Python 3.11+
- Node.js 22+
- An AWS account with read-only IAM credentials (for AWS features)
- A Groq API key (for Copilot — free at https://console.groq.com)

---

### 1. Backend

#### First-Time Setup (one-time, ~5-10 min due to ML library downloads)

```bash
cd backend
cp .env.example .env          # fill in GROQ_API_KEY for AI Copilot

python -m venv venv
# Activate the virtual environment
source venv/bin/activate       # macOS/Linux
# OR
venv\Scripts\activate          # Windows

pip install -r requirements.txt   # ⏳ Downloads ~48MB of ML libs (one time only)

# Run database migrations (creates SQLite db locally)
alembic upgrade head
```

#### Every Subsequent Run (fast, no downloads — starts in seconds)

```bash
cd backend
source venv/bin/activate       # macOS/Linux
# OR
venv\Scripts\activate          # Windows

uvicorn app.main:app --reload --port 8000
```

> **💡 Tip:** You do NOT need to re-run `pip install` or `alembic upgrade head`
> unless `requirements.txt` or a migration file has changed. The virtual
> environment persists in `backend/venv/` between restarts.

API docs available at `http://localhost:8000/docs`

---

### 2. Frontend

#### First-Time Setup

```bash
cd frontend
cp .env.example .env           # set VITE_API_URL=http://localhost:8000/api/v1
npm install
```

#### Every Subsequent Run

```bash
cd frontend
npm run dev
```

App available at `http://localhost:5173`

---

## How to Test

1. Navigate to `http://localhost:5173` in your browser.
2. Sign up for a new account.
3. You will be taken to the Onboarding Wizard. Click **Connect AWS Account**.
4. The dashboard will populate with mock KPI metrics (Spend, Savings, Health Score) and a cost trend chart.
5. Visit the **Resources** and **Recommendations** pages to view rightsizing intelligence.
6. Visit the **AI Copilot** page and ask questions about your cloud environment.

---

## Core Features (MVP)

- ✅ User authentication (JWT, Argon2)
- ✅ AWS account connection UI (IAM role-based)
- ✅ Resource discovery UI & Backend integrations (EC2, EBS)
- ✅ Cost analysis & Cloud Health Score
- ✅ Recommendation engine (idle/unattached resource detection)
- ✅ Spend forecasting (Prophet)
- ✅ AI Copilot (Groq Llama API integration)
- ✅ Downloadable PDF reports

---

## Security

See [Security Policy](./docs/Security_Policy_v1.0.md). Key practices:
- Passwords hashed with Argon2, never stored in plaintext
- JWT-based authentication
- AWS access via read-only IAM roles only — no long-term credentials stored
- Rate limiting on auth and AI endpoints
- Security headers (HSTS, CSP, X-Frame-Options, etc.)

---

## License

MIT
