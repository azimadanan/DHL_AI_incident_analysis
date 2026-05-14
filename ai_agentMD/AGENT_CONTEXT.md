# DHL DAC 3.0 — Incident Reporting System

# AI Agent Context File

# Last Updated: May 14, 2026

# UI Design: Completed by AI Design Agent (Figma/v0)

---

## 1. WHAT IS THIS PROJECT

Competition: DHL Digital Automation Challenge 3.0 (DAC 3.0)
Organizer: DHL Asia Pacific Shared Services (APSSC)
University: Universiti Teknologi Malaysia (UTM)
Scenario: Scenario 2 — Incident Reporting System
Developer: Solo student
Deadline: Friday May 16, 2026
Theme: Turn Chaos into Genius

---

## 2. THE PROBLEM DHL HAS

DHL Customer Support receives incident reports daily
from multiple messy inconsistent channels:

Sources:

- Email inboxes
- WhatsApp and Teams chat messages
- Phone call notes
- Photos and screenshots of damaged packages
- Handwritten notes from warehouse staff

Types of incidents:

- Late deliveries
- Damaged parcels
- Wrong or undeliverable addresses
- System and tracking errors
- General customer complaints

What makes this hard for DHL:

- Cannot quickly identify the real issue
- Cannot assign to the correct department
- Cannot prioritize correctly
- Cannot track resolution progress
- Cannot produce management reports

Result:

- Slow response times
- Repeated manual work
- Inconsistent customer service quality

---

## 3. MVP REQUIREMENTS FROM COMPETITION

### Web App — MANDATORY

- Secured website with login
- Upload raw information
- Workflow with incident status
- Manage and search incidents

### RPA UiPath — MANDATORY

- Fetch raw inputs from files
- Process and send to web app
- Update the website automatically
- Generate error and summary reports

### LLM — OPTIONAL (adds marks)

- Extract the key problem
- Rewrite messy content into clean summary
- Detect duplicate incidents
- Suggest incident classification

---

## 4. JUDGING CRITERIA

### Functionality and Efficiency

Does the system work end to end?
Does automation reduce manual work?

### Innovation and Creativity

Is the automation workflow original?
Does it go beyond basic requirements?

### User Experience

Is the interface intuitive and clean?
Is navigation smooth with no confusion?

### Robustness and Scalability

Does it handle errors without crashing?
Can it handle many incidents?

### Presentation and Communication

Can the developer demo it clearly?
Is the solution story coherent?

---

## 5. TECH STACK

Frontend:

- React 18 + Vite
- react-router-dom
- axios
- Inline styles only — no CSS frameworks
- Running at: http://localhost:5173

Backend:

- Node.js v26 + Express
- lowdb v3 (JSON file database)
- bcryptjs
- jsonwebtoken
- cors, dotenv, multer
- @xenova/transformers (local AI)
- Running at: http://localhost:3000

RPA:

- UiPath Studio Community Edition 2026
- Two workflows: IngestBot and ReportBot

---

## 6. ALL PAGES (INCLUDING AI AGENT ADDITIONS)

### Original pages (core MVP):

Login /login
Dashboard /
Submit Incident /submit
Incident Detail /incidents/:id
Reports /reports

### Pages added by AI design agent:

Forgot Password /forgot-password
Settings /settings
Category Breakdown /reports/category

---

## 7. PAGE DETAILS

### Login — /login

Public page, no auth required
Fields: email, password
Default: admin@dhl.com / admin123
On success: save JWT to localStorage, go to /
On fail: show error message
Extra: Forgot Password link → /forgot-password
API: POST /api/login

### Forgot Password — /forgot-password

Public page, no auth required
Field: email address
Button: Reset Password
NOTE: This is UI only for now
No backend endpoint needed for demo
Just show success message on submit
Back link → /login

### Dashboard — /

Protected, JWT required
Shows: 4 stat cards, incidents table, search, filter
Stat cards: Total, Open, In Progress, Resolved
Table columns: ID, Title, Category, Priority, Status, Date, Action
Search: filters by title, category, summary
Filter: by status dropdown, by category dropdown
Action button: View → /incidents/:id
Top right: New Incident button → /submit
API: GET /api/incidents?search=&status=

### Submit Incident — /submit

Protected, JWT required
Two column layout: form left, tips right
Textarea: paste raw messy text
Character counter below textarea
Submit button: calls AI analysis
Loading state: Analyzing with AI...
Success: redirect to dashboard
Tips panel: shows accepted input types + example
API: POST /api/incidents { raw_content }

### Incident Detail — /incidents/:id

Protected, JWT required
Shows: AI generated title as page heading
Status badge top right
Info grid: Category, Priority, Source, Created, Updated
AI Summary panel with yellow left border accent
Duplicate warning box if is_duplicate is true
Raw Input panel in monospace dark background
Status workflow buttons: Open, In Progress, Resolved
Active status button highlighted in red
API: GET /api/incidents/:id
API: PATCH /api/incidents/:id/status { status }

### Reports — /reports

Protected, JWT required
4 stat cards same as dashboard
Incidents by Category: horizontal bar chart
Priority Breakdown: colored bars High Medium Low
Export Report button top right (UI only)
API: GET /api/reports

### Category Breakdown Report — /reports/category

Protected, JWT required
Detailed breakdown of incidents per category
Table with columns: Category, Count, Percentage, Trend
Bar visualization per row
Export button
Resolution rate percentage display
API: GET /api/reports (reuse same endpoint)

### Settings — /settings

Protected, JWT required
Two sections:

My Profile section:

- Full Name field (display only)
- Email field (display only)
- Role badge (ADMIN)
- Edit Profile button (UI only)

Notification Settings section:

- Toggle: Email notifications
- Toggle: New incident alerts
- Toggle: Status change alerts
- Save Settings button (UI only)

Customer Support section:

- Support contact info
- Documentation link

NOTE: Settings page is UI only
No backend needed for demo
Show success toast on save

---

## 8. ALL BACKEND API ENDPOINTS

Base URL: http://localhost:3000

### POST /api/login

Auth: None
Body: { email, password }
Response: { token, user: { id, email, role } }

### GET /api/incidents

Auth: Bearer token
Query: ?search=string&status=Open&category=Late Delivery
Response: Array of incident objects newest first

### GET /api/incidents/:id

Auth: Bearer token
Response: Single incident object

### POST /api/incidents

Auth: Bearer token
Body: { raw_content: string }
Response: Created incident with AI analysis

### PATCH /api/incidents/:id/status

Auth: Bearer token
Body: { status: "Open" | "In Progress" | "Resolved" }
Response: Updated incident object

### GET /api/reports

Auth: Bearer token
Response:
{
total: number,
by_status: {
Open: number,
In Progress: number,
Resolved: number
},
by_category: {
Late Delivery: number,
Damaged Parcel: number,
Address Issue: number,
System Error: number,
Customer Complaint: number
},
by_priority: {
High: number,
Medium: number,
Low: number
}
}

### POST /api/ingest

Auth: None (UiPath bot only)
Body: { raw_content: string, source: "UiPath Bot" }
Response: Created incident object

---

## 9. DATABASE SCHEMA

### incidents

{
id: number (Date.now()),
raw_content: string,
title: string,
summary: string,
category: "Late Delivery" |
"Damaged Parcel" |
"Address Issue" |
"System Error" |
"Customer Complaint",
priority: "High" | "Medium" | "Low",
is_duplicate: boolean,
duplicate_reason: string,
status: "Open" | "In Progress" | "Resolved",
source: "Manual" | "UiPath Bot",
created_at: ISO string,
updated_at: ISO string
}

### users

{
id: number,
email: string,
password: string (bcrypt hashed),
role: "admin" | "agent",
created_at: ISO string
}

---

## 10. FRONTEND FILE STRUCTURE

frontend/src/
├── App.jsx
├── main.jsx
├── components/
│ └── Layout.jsx
└── pages/
├── Login.jsx
├── ForgotPassword.jsx
├── Dashboard.jsx
├── SubmitIncident.jsx
├── IncidentDetail.jsx
├── Reports.jsx
├── CategoryBreakdown.jsx
└── Settings.jsx

---

## 11. APP ROUTING

/login → Login (public)
/forgot-password → ForgotPassword (public)
/ → Dashboard (protected)
/submit → SubmitIncident (protected)
/incidents/:id → IncidentDetail (protected)
/reports → Reports (protected)
/reports/category → CategoryBreakdown (protected)
/settings → Settings (protected)

Protected route pattern:
Check localStorage for token
If no token redirect to /login

---

## 12. DHL BRAND DESIGN SYSTEM

### Colors

DHL Red: #D40511
DHL Yellow: #FFCC00
White: #FFFFFF
Page background: #F4F4F4
Sidebar dark: #1C1C1C
Sidebar text: #CCCCCC
Sidebar active: #FFCC00
Card border: #E0E0E0
Text primary: #1C1C1C
Text secondary: #6B6B6B
Text muted: #9E9E9E
Table row hover: #FFFBEA
Input border: #CCCCCC

### Status colors

Open: bg #FFF0F0 text #B00000 dot #D40511
In Progress: bg #FFF8EC text #B35C00 dot #E8820C
Resolved: bg #F0F8F0 text #1B5E20 dot #2E7D32

### Priority colors

High: #D40511
Medium: #E8820C
Low: #2E7D32

### Typography

Font: Arial, Helvetica, sans-serif
Page title: 20px weight 600 #1C1C1C
Section label: 11px weight 600 uppercase #6B6B6B
Body: 14px weight 400 #3D3D3D
Table header: 11px weight 600 uppercase #6B6B6B

### Component specs

Button primary: bg #D40511 white text 2px radius
Button secondary: white bg #D40511 border and text
Input: 1px #CCCCCC border 2px radius 36px height
Card: white 1px #E0E0E0 border 2px radius no shadow
Sidebar: 220px fixed #1C1C1C

### Layout

Sidebar 220px fixed left dark
Header 52px white border bottom
Content margin-left 220px padding 24px bg #F4F4F4

### Design rules

- 2px border radius maximum
- No box shadows
- No gradients
- Red only for primary buttons and alerts
- Yellow only for sidebar active and hover
- Uppercase section labels
- Flat stat cards with colored left border only

---

## 13. AI CLASSIFICATION

Package: @xenova/transformers
Model: Xenova/nli-deberta-v3-small
Type: Zero-shot classification
Runs: Locally, no internet after first download
Size: 85MB cached after first run

Output shape (always exact):
{
title: string 5-8 words,
summary: string 2-3 sentences,
category: string one of 5 categories,
priority: "High" | "Medium" | "Low",
is_duplicate: false,
duplicate_reason: ""
}

---

## 14. UIPATH BOT DESIGN

Folder structure:
C:\DHL_Incidents\
├── incoming\
├── processed\
├── errors\
└── reports\

IngestBot steps:

1. Get files from incoming folder
2. For each txt file read content
3. HTTP POST to /api/ingest
4. Move to processed or errors folder
5. Log result

ReportBot steps:

1. HTTP GET /api/reports with auth header
2. Parse JSON
3. Write to Excel file in reports folder
4. Log success

---

## 15. INCIDENT ID FORMAT

From the design screenshots the incident ID format is:
INC-2023-8472 style

Backend currently uses Date.now() number as ID.

For display in UI format as:
INC- + year + - + last 4 digits of id
Example: INC-2026-4521

Add this helper function in frontend:
function formatIncidentId(id) {
const year = new Date().getFullYear()
const short = String(id).slice(-4)
return "INC-" + year + "-" + short
}

---

## 16. PROJECT STATUS

Backend API: DONE
Database: DONE
Login page: DONE
Dashboard: DONE
Submit Incident: DONE
Incident Detail: DONE
Reports: DONE
UI DHL brand design: DONE
Forgot Password page: NEEDS IMPLEMENTATION
Settings page: NEEDS IMPLEMENTATION
Category Breakdown page: NEEDS IMPLEMENTATION
Local AI model: IN PROGRESS
UiPath IngestBot: NOT BUILT
UiPath ReportBot: NOT BUILT
Demo preparation: NOT DONE

---

## 17. DEMO SCRIPT FOR JUDGES

Step 1: Open localhost:5173
Step 2: Login with admin@dhl.com and admin123
Step 3: Show dashboard with existing incidents
Step 4: Drop test.txt into C:\DHL_Incidents\incoming
Step 5: Run UiPath IngestBot
Step 6: Bot reads file and POSTs to API
Step 7: Refresh dashboard — new incident appears
Step 8: Click incident — show AI summary and category
Step 9: Update status Open to In Progress to Resolved
Step 10: Go to Reports — show analytics
Step 11: Run UiPath ReportBot — Excel generated
Step 12: Show Settings page as bonus feature

---

## 18. RULES FOR ALL AI AGENTS

- Output complete files only, never truncated
- No placeholder comments
- Every file must work pasted into VS Code
- async await with try catch everywhere
- JSON responses from all backend endpoints
- No new npm packages without asking
- Inline styles only in React
- Never break existing working endpoints
- Never change field names already used in UI
- JWT auth on all protected routes
- react-router-dom for all navigation
- axios for all API calls
- Match DHL design tokens exactly
- Format incident IDs as INC-YYYY-XXXX in display
