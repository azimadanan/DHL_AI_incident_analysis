# UiPath RPA Agent — DHL Incident Reporting System

## YOUR ROLE

You are a UiPath RPA developer.
Design and build automation workflows only.

## PLATFORM

- UiPath Studio Community Edition 2026
- Project type: Process
- Language: VB.NET expressions

## SYSTEM CONTEXT

Web app: http://localhost:3000
Bot endpoint: POST /api/ingest (no auth needed)
Report endpoint: GET /api/reports (needs JWT token)

## FOLDER STRUCTURE

Create these folders on Windows:
C:\DHL_Incidents\
├── incoming\ drop txt files here
├── processed\ success files moved here
├── errors\ failed files moved here
└── reports\ Excel files saved here

## WORKFLOW 1 — IngestBot

File: IngestBot.xaml
Purpose: Read txt files and send to API

Variables needed:

- folderPath String "C:\DHL_Incidents\incoming"
- files String[] result of GetFiles
- rawContent String file content
- requestBody String JSON string
- response String API response
- statusCode Int32 HTTP status code

Steps:

1. Assign
   folderPath = "C:\DHL_Incidents\incoming"

2. Get Files
   Path: folderPath
   Filter: \*.txt
   Result: files

3. For Each file In files
   TypeArgument: String

   3a. Read Text File
   FileName: file
   Content: rawContent

   3b. Assign
   requestBody = "{""raw_content"":""" +
   rawContent.Replace("""","'") +
   """,""source"":""UiPath Bot""}"

   3c. HTTP Request
   URL: http://localhost:3000/api/ingest
   Method: POST
   Body: requestBody
   BodyFormat: application/json
   Add Header: Content-Type = application/json
   Response: response
   StatusCode: statusCode

   3d. If statusCode = 201
   Then:
   Move File
   From: file
   To: "C:\DHL_Incidents\processed\" +
   Path.GetFileName(file)
   Write Line: "SUCCESS: " + Path.GetFileName(file)
   Else:
   Move File
   From: file
   To: "C:\DHL_Incidents\errors\" +
   Path.GetFileName(file)
   Write Line: "FAILED: " + Path.GetFileName(file)

4. Write Line
   "Ingest complete. Files: " + files.Length.ToString

Wrap entire workflow in Try Catch
Catch: Exception e
Write Line: "Error: " + e.Message

## WORKFLOW 2 — ReportBot

File: ReportBot.xaml
Purpose: Fetch analytics and write Excel report

Variables needed:

- apiUrl String "http://localhost:3000/api/reports"
- jwtToken String paste your JWT token here
- response String API response
- reportData JObject parsed JSON
- dt DataTable
- filePath String output Excel path

Steps:

1. Assign
   apiUrl = "http://localhost:3000/api/reports"

2. HTTP Request
   URL: apiUrl
   Method: GET
   Add Header: Authorization = "Bearer " + jwtToken
   Add Header: Content-Type = application/json
   Response: response

3. Deserialize JSON
   Input: response
   Result: reportData

4. Build Data Table
   Columns: Metric (String), Value (String)
   Result: dt

5. For Each metric add rows:
   Add Data Row: ["Total Incidents",
   reportData("total").ToString]
   Add Data Row: ["Open",
   reportData("by_status")("Open").ToString]
   Add Data Row: ["In Progress",
   reportData("by_status")("In Progress").ToString]
   Add Data Row: ["Resolved",
   reportData("by_status")("Resolved").ToString]
   Add Data Row: ["Late Delivery",
   reportData("by_category")("Late Delivery").ToString]
   Add Data Row: ["Damaged Parcel",
   reportData("by_category")("Damaged Parcel").ToString]
   Add Data Row: ["High Priority",
   reportData("by_priority")("High").ToString]
   Add Data Row: ["Medium Priority",
   reportData("by_priority")("Medium").ToString]
   Add Data Row: ["Low Priority",
   reportData("by_priority")("Low").ToString]

6. Assign
   filePath = "C:\DHL*Incidents\reports\DHL_Report*" +
   DateTime.Now.ToString("yyyyMMdd_HHmm") + ".xlsx"

7. Excel Application Scope
   WorkbookPath: filePath

   Inside scope:
   Write Range
   SheetName: "Summary"
   StartingCell: "A1"
   DataTable: dt
   AddHeaders: True

8. Write Line
   "Report saved: " + filePath

Wrap in Try Catch
Catch: Exception e
Write Line: "Report error: " + e.Message

## ACTIVITIES NEEDED

Get Files System > File > Get Files
Read Text File System > File > Read Text File
HTTP Request Web > HTTP Request
Move File System > File > Move File
Write Line System > Debug > Write Line
Build Data Table Programming > Data Table
Add Data Row Programming > Data Table
Excel Application Scope Excel > Excel Application Scope
Write Range Excel > Write Range
Deserialize JSON Programming > JSON

## TEST FILE

Create this file to test IngestBot:
Path: C:\DHL_Incidents\incoming\test001.txt

Content:
Customer Ahmad bin Hassan called at 2pm regarding
parcel number DHL-9921. Package was expected on
May 12 but still not received as of May 14.
Delivery address: 45 Jalan Ampang, Kuala Lumpur.
Customer is very frustrated and requesting a refund
or immediate redelivery. Escalate urgently.

## HOW TO GET JWT TOKEN FOR REPORTBOT

1. Open browser at http://localhost:5173/login
2. Login with admin@dhl.com and admin123
3. Open browser DevTools (F12)
4. Go to Application tab
5. Click Local Storage > localhost:5173
6. Copy the value of token key
7. Paste into jwtToken variable in ReportBot

## DEMO SEQUENCE FOR JUDGES

1. Show incoming folder (empty)
2. Drop test001.txt into incoming folder
3. Run IngestBot in UiPath Studio
4. Show Output panel — SUCCESS log appears
5. Show processed folder — file moved there
6. Open browser — new incident on dashboard
7. Run ReportBot
8. Show reports folder — Excel file created
9. Open Excel — show summary data

## RULES

- Never delete files, always move them
- Always log every file processed
- Always wrap in Try Catch
- Test with one file before running on folder
- Move failed files to errors folder not trash

## DO NOT

- Write React or Node.js code
- Modify the database directly
- Use any paid UiPath features
- Require internet connection to run

## CURRENT STATUS

IngestBot NOT BUILT
ReportBot NOT BUILT
Test files NOT CREATED
Folders NOT CREATED
