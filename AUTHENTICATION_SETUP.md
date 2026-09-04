# CrisisGuard AI Authentication Setup

## Local Node fullstack app

```bash
npm install
npm run dev
```

Open `http://localhost:3000`.

The Node dev server stores persistent local account and consultation data in `./crisisguard.local-db.json` by default. Override it with:

```bash
CRISISGUARD_DB_FILE=./path/to/crisisguard.local-db.json npm run dev
```

## FastAPI backend

```bash
cd backend
python -m venv venv
venv\Scripts\activate
pip install -r requirements.txt
alembic upgrade head
uvicorn app.main:app --reload --port 8000
```

The FastAPI backend defaults to SQLite with `DATABASE_URL=sqlite+aiosqlite:///./crisisguard.db`. Set `DATABASE_URL` to the Neon/PostgreSQL connection string for production.

## Password Reset Email

Password-reset tokens are expiring, single-use, and stored only as SHA-256 hashes. Delivery is disabled until these environment variables are set:

```bash
APP_ORIGIN=http://localhost:3000
RESEND_API_KEY=your_resend_api_key
EMAIL_FROM=CrisisGuard AI <no-reply@example.com>
```

When email delivery is not configured, the forgot-password endpoint still returns a generic response and does not expose whether the email exists.
