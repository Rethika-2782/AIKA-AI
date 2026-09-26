## Problem Statement Alignment: AI for Legal Assistance & Access
LEXORA AI directly addresses the challenge of making legal assistance accessible through AI. It provides simple explanations, risk analysis, and actionable insights for people facing legal issues, bridging the gap between complex legal jargon and everyday understanding.

# LEXORA AI

**Global AI-Powered Legal Access & Assistance Platform**

> Understand the law. Know your options. Take the next step.

LEXORA AI is a MERN-stack prototype that helps users organize legal situations, understand them in plain language, prepare evidence, create an ActionPath, prepare questions for a professional, and generate editable document drafts. It is **not a substitute for a qualified legal professional**.

## Stack

- Frontend: React + Vite + Tailwind CSS + Framer Motion + Lucide React
- Backend: Node.js + Express
- Database: MongoDB + Mongoose
- Auth: JWT + bcrypt
- GenAI: Google Gemini API
- API: REST

## Project structure

```text
lexora-ai/
├── frontend/
│   ├── src/
│   │   ├── components/
│   │   ├── layouts/
│   │   ├── pages/
│   │   ├── services/
│   │   ├── App.jsx
│   │   ├── main.jsx
│   │   └── index.css
│   ├── package.json
│   ├── vite.config.js
│   └── index.html
├── backend/
│   ├── src/
│   │   ├── config/
│   │   ├── controllers/
│   │   ├── middleware/
│   │   ├── models/
│   │   ├── prompts/
│   │   ├── routes/
│   │   ├── services/
│   │   └── server.js
│   ├── package.json
│   └── .env.example
├── .gitignore
└── README.md
```

## 1. Requirements

Install:

- Node.js 20+
- MongoDB Community Server **or** MongoDB Atlas
- VS Code

MongoDB Compass is optional and can be used to inspect the database.

## 2. Install

Open the project in VS Code and run:

```bash
cd backend
npm install

cd ../frontend
npm install
```

## 3. Environment variables

Copy:

```text
backend/.env.example
```

to:

```text
backend/.env
```

Set:

```env
PORT=5000
MONGODB_URI=mongodb://127.0.0.1:27017/lexora_ai
JWT_SECRET=replace_with_a_long_random_secret
GEMINI_API_KEY=your_gemini_api_key
CLIENT_URL=http://localhost:5173
```

For MongoDB Atlas, replace `MONGODB_URI` with your Atlas connection string.

Get a Gemini API key from Google AI Studio. Never put the key in the React frontend and never commit `.env`.

## 4. Run

Terminal 1:

```bash
cd backend
npm run dev
```

Terminal 2:

```bash
cd frontend
npm run dev
```

Open:

```text
http://localhost:5173
```

Backend health check:

```text
http://localhost:5000/api/health
```

## Demo account

The backend automatically creates this account if it does not exist:

```text
Email: demo@lexora.ai
Password: LexoraDemo@123
```

This is a prototype/demo credential. Change or remove it before production deployment.

## MongoDB Compass

Connect Compass to:

```text
mongodb://127.0.0.1:27017
```

Database:

```text
lexora_ai
```

Collections are created as data is inserted:

- users
- cases
- documents
- consultations
- evidenceitems

## Main API routes

```text
POST /api/auth/register
POST /api/auth/login
GET  /api/auth/me

POST /api/ai/analyze
POST /api/ai/explain
POST /api/ai/generate-document

GET    /api/cases
POST   /api/cases
GET    /api/cases/:id
PUT    /api/cases/:id
DELETE /api/cases/:id

GET    /api/documents
POST   /api/documents
DELETE /api/documents/:id

GET /api/health
```

## Demo flow

1. Login with the demo account.
2. Select a jurisdiction.
3. Enter a situation such as:
   - `My landlord has not returned my security deposit after I moved out.`
   - `My employer has not paid my salary for two months.`
   - `I received a legal notice and I don't understand what it means.`
4. Click **Analyze Situation**.
5. Review Case Intelligence.
6. Check/uncheck evidence.
7. Review ActionPath and questions.
8. Generate a document in Draft Studio.
9. Save the case.
10. Open it again from My Cases.
11. Try Legal Simplifier with a legal clause.
12. Try the out-of-scope weather example.

## Responsible AI

LEXORA uses a backend system prompt designed to:

- avoid claiming to be a lawyer
- avoid guaranteed outcomes
- avoid fabricated statutes, cases or citations
- identify uncertainty
- respect selected jurisdiction
- ask for missing information
- encourage qualified professional assistance when appropriate

All AI output should be reviewed critically and is not legal advice.

## Important production work still needed

This prototype intentionally keeps the competition MVP manageable. A production release should add verified jurisdiction-specific legal sources, citation verification, stronger document security, audit logging, rate limiting, abuse prevention, privacy controls, human review pathways and professional/legal-aid integrations.

