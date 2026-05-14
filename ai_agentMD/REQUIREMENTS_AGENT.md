# Requirements Agent — DHL Incident Reporting System

## YOUR ROLE

You are a business analyst and requirements engineer.
You understand the DHL competition problem deeply.
Use this file to give any AI agent full context
before starting a task.

## COMPETITION DETAILS

Name: DHL Digital Automation Challenge 3.0
Short name: DAC 3.0
Organizer: DHL Asia Pacific Shared Services (APSSC)
University: Universiti Teknologi Malaysia (UTM)
Scenario: Scenario 2 — Incident Reporting System
Developer: Solo UTM student
Deadline: Friday May 16 2026
Theme: Turn Chaos into Genius

## THE BUSINESS PROBLEM

DHL Customer Support teams receive incident reports
daily from multiple inconsistent channels:

- Email inboxes
- WhatsApp and Teams messages
- Phone call notes
- Photos of damaged packages
- Handwritten warehouse notes

Incident types:

- Late deliveries
- Damaged parcels
- Wrong or undeliverable addresses
- System and tracking errors
- General customer complaints

Current pain points for DHL:

- Cannot identify the real issue quickly
- Cannot assign to correct department
- Cannot prioritize incidents correctly
- Cannot track resolution progress
- Cannot produce management reports

Business impact:

- Slow response times
- Repeated manual work
- Inconsistent customer service quality

## SOLUTION OBJECTIVE

Build an Incident Reporting System that automates:

- Collecting raw messy incident reports
- Understanding and classifying with AI
- Assigning priority and category automatically
- Tracking through Open In Progress Resolved workflow
- Generating summary reports for management

## MVP REQUIREMENTS

### Web App — MANDATORY

Secured website with login
Upload raw information
Workflow with incident status
Manage and search incidents

### RPA UiPath — MANDATORY

Fetch raw inputs from files or email
Process and send to web app
Update the website automatically
Generate error and summary reports

### LLM — OPTIONAL but adds marks

Extract the key problem from messy text
Rewrite messy content into clean summary
Detect duplicate incidents
Suggest incident classification

## JUDGING CRITERIA (in priority order)

1. Functionality and Efficiency
   Does it work end to end?
   Does automation reduce manual work?
   Is the pipeline seamless?

2. Innovation and Creativity
   Is the workflow original?
   Does it go beyond basic requirements?
   Is there inventive thinking?

3. User Experience
   Is the interface clean and intuitive?
   Is it built with end users in mind?
   Is navigation smooth?

4. Robustness and Scalability
   Does it handle errors without crashing?
   Can it handle many incidents?
   Is it stable?

5. Presentation and Communication
   Can the demo be shown clearly?
   Is the impact well explained?
   Is the story coherent?

## USER STORIES

As a DHL support agent I want to:

- Login securely to the system
- Paste raw messy incident text and have AI clean it
- See all incidents in a dashboard
- Search and filter incidents
- Update incident status as I work on it
- See reports on incident trends

As a UiPath bot I want to:

- Watch a folder for new text files
- Read the file content automatically
- Send it to the API for AI processing
- Move the file to processed or errors folder
- Generate an Excel report of all incidents

As a DHL manager I want to:

- See total incidents by status
- See breakdown by category
- See breakdown by priority
- Export reports

## INCIDENT WORKFLOW

Open → In Progress → Resolved

Open: Newly created, not yet assigned
In Progress: Being worked on by support team
Resolved: Issue fixed and closed

## INCIDENT CATEGORIES

Late Delivery
Damaged Parcel
Address Issue
System Error
Customer Complaint

## PRIORITY LEVELS

High: Urgent, multiple customers, legal threats,
system outages, perishables, medical
Medium: Single customer, standard delay, minor damage
Low: Inquiry, feedback, minor inconvenience

## DEMO SCRIPT FOR JUDGES

1. Login with admin@dhl.com and admin123
2. Show dashboard with existing incidents
3. Drop test txt file into incoming folder
4. Run UiPath IngestBot
5. Bot reads file and sends to API
6. Refresh dashboard — new incident appears
7. Click incident — show AI summary and category
8. Update status Open to In Progress to Resolved
9. Go to Reports — show analytics breakdown
10. Run UiPath ReportBot — Excel file generated
11. Open Excel to show report output

## SUCCESS CRITERIA

Every MVP item from the competition slide is working
UiPath bot runs and feeds incidents automatically
AI classifies and summarizes every incident
Dashboard shows real time incident data
Reports show meaningful analytics
Demo runs end to end without errors

## TECHNICAL CONSTRAINTS

Must use UiPath Studio (mandatory per competition)
Must use Visual Studio 2022 (mandatory per competition)
Can use React or ASP.NET for web (we chose React)
LLM is optional but recommended for extra marks
Solo developer with Friday deadline
