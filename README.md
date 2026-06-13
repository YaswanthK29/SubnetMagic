# SubnetMagic

A portfolio-quality interactive CCNA subnetting learning platform.

## Features

- **Subnet Calculator** — Magic number method with step-by-step breakdown and visual block boundaries
- **VLSM Allocator** — Variable-length subnet masking with visual allocation cards
- **Wildcard Calculator** — Subnet mask to wildcard conversion with teaching steps
- **Quiz Mode** — Random subnet questions with instant validation and explanations

## Tech Stack

| Layer | Stack |
|-------|-------|
| Frontend | React, TypeScript, Vite, TailwindCSS, Framer Motion, React Router, Axios |
| Backend | Python, FastAPI |

## Getting Started

### Backend

```bash
cd backend
pip install -r requirements.txt
uvicorn app.main:app --reload --port 8001
```

### Frontend

```bash
cd frontend
npm install
npm run dev
```

Open [http://localhost:5173](http://localhost:5173)

## API Endpoints

| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | `/api/subnet` | Calculate subnet details |
| POST | `/api/wildcard` | Convert mask to wildcard |
| POST | `/api/vlsm` | VLSM allocation |
| POST | `/api/quiz` | Generate quiz question |
| POST | `/api/quiz/validate` | Validate quiz answer |
