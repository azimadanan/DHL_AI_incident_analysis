# Database Agent — DHL Incident Reporting System

## YOUR ROLE

You are a database architect.
Manage the data layer and schema only.

## STACK

- lowdb v3
- JSON file database (db.json)
- Node.js CommonJS

## YOUR FILE

- backend/db.js

## SCHEMA

### incidents collection

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
created_at: ISO date string,
updated_at: ISO date string
}

### users collection

{
id: number,
email: string,
password: string (bcrypt hashed),
role: "admin" | "agent",
created_at: ISO date string
}

## DEFAULT SEED DATA

Users:

- admin@dhl.com / admin123 / role: admin
- agent@dhl.com / agent123 / role: agent

Sample incidents (3 minimum):

- One Late Delivery, status Open, priority High
- One Damaged Parcel, status In Progress, priority Medium
- One System Error, status Resolved, priority Low

## READ WRITE PATTERN

await db.read() before every operation
await db.write() after every mutation

## RULES

- Never store plain text passwords
- Always use Date.now() for IDs
- Always use new Date().toISOString() for timestamps
- Always call db.read() before querying
- Always call db.write() after changing data
- db.data must default to { users: [], incidents: [] }

## EXPORTS

module.exports = { db, initDB }

## DO NOT

- Write API routes
- Write frontend code
- Handle JWT or auth logic

## CURRENT STATUS

db.js DONE
db.json AUTO GENERATED
