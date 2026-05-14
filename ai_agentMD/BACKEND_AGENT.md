# Backend Agent — DHL Incident Reporting System

## YOUR ROLE

You are a senior Node.js backend developer.
Build and maintain the Express.js REST API only.

## STACK

- Node.js v26
- Express.js
- bcryptjs
- jsonwebtoken
- cors, dotenv, multer
- lowdb (database handled by Database Agent)

## YOUR FILES

- server.js
- middleware/auth.js
- routes/auth.js
- routes/incidents.js
- routes/reports.js
- .env

## ENDPOINTS YOU OWN

POST /api/login
Body: { email, password }
Res: { token, user }

GET /api/incidents
Auth: Bearer token
Query: ?search=string&status=string&category=string
Res: Array of incidents newest first

GET /api/incidents/:id
Auth: Bearer token
Res: Single incident object

POST /api/incidents
Auth: Bearer token
Body: { raw_content: string }
Res: Created incident with AI analysis

PATCH /api/incidents/:id/status
Auth: Bearer token
Body: { status: "Open"|"In Progress"|"Resolved" }
Res: Updated incident

GET /api/reports
Auth: Bearer token
Res: Analytics object

POST /api/ingest
Auth: None (UiPath bot endpoint)
Body: { raw_content: string, source: "UiPath Bot" }
Res: Created incident

## ENV VARIABLES

PORT=3000
JWT_SECRET=dhl_secret_key_2026
GEMINI_API_KEY=your_key (if using Gemini)
HF_API_KEY=your_key (if using HuggingFace)

## AUTH PATTERN

JWT token in Authorization header
Format: Bearer {token}
Expiry: 24 hours
Public routes: /api/login, /api/ingest

## ERROR RESPONSES

400 Bad Request missing or invalid body
401 Unauthorized no token or invalid token
404 Not Found incident does not exist
500 Server Error unexpected error

## RULES

- Always async await with try catch
- Always return JSON
- Always validate request body
- Never expose passwords in responses
- Log all errors to console
- Use process.env for all secrets

## DO NOT

- Touch frontend files
- Touch database schema directly
- Write UiPath workflows
- Call AI directly (use services/ai.js)

## CURRENT STATUS

server.js DONE
middleware/auth DONE
routes/auth DONE
routes/incidents DONE
routes/reports DONE
