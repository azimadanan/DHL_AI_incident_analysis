# AI LLM Agent — DHL Incident Reporting System

## YOUR ROLE

You are an AI/ML integration engineer.
Build the local incident classification service only.

## STACK

- @xenova/transformers
- Model:Xenova/distilbart-mnli-12-3
- Zero-shot classification
- Runs on CPU locally
- No internet needed after first download
- Size: 85MB cached

## YOUR FILE

- backend/ai.js

## INPUT

raw_content string (any messy text from any source)

## OUTPUT (always this exact shape, no exceptions)

{
title: string,
summary: string,
category: string,
priority: string,
is_duplicate: false,
duplicate_reason: ""
}

## CATEGORIES (exact strings, case sensitive)

"Late Delivery"
"Damaged Parcel"
"Address Issue"
"System Error"
"Customer Complaint"

## PRIORITY LEVELS

"High"
"Medium"
"Low"

## CLASSIFICATION LOGIC

Category — use zero-shot with these labels:

- Late Delivery
- Damaged Parcel
- Address Issue
- System Error
- Customer Complaint

Priority — use zero-shot with these labels:

- urgent critical issue requiring immediate action
- standard medium priority incident
- low priority minor issue or inquiry

Map results:
urgent critical → High
standard medium → Medium
low priority → Low

## TITLE GENERATION (rule based)

Extract tracking number pattern: #DHL-XXXX or #XXXX

Map category to title:
Late Delivery → Late Delivery {tracking} Customer Report
Damaged Parcel → Damaged Parcel {tracking} Reported
Address Issue → Delivery Address Issue Reported
System Error → System Error Reported By Customer
Complaint → Customer Complaint Requires Attention

## SUMMARY GENERATION (rule based)

Clean input: remove extra spaces and newlines
Take first 280 characters
Wrap: Incident reported: {text}. This incident
has been logged and requires follow-up.

## MODEL LOADING (singleton pattern)

let classifier = null

async function loadModel() {
if (!classifier) {
console.log('Loading AI model...')
classifier = await pipeline(
'zero-shot-classification',
'Xenova/distilbart-mnli-12-3'
)
console.log('AI model ready')
}
return classifier
}

First load: 60-90 seconds (downloads model)
After first load: 1-2 seconds per request

## FALLBACK (if model fails)

Use keyword matching on raw text:

late, delay, not arrived, not delivered → Late Delivery
damage, broken, crushed, wet, missing → Damaged Parcel
address, wrong, location, return → Address Issue
system, error, portal, tracking → System Error
default → Customer Complaint

Priority fallback:
refund, legal, angry, urgent, critical → High
single customer, delay, minor → Medium
inquiry, feedback, question → Low

## EXPORTS

module.exports = { analyzeIncident }

## RULES

- Load model lazily on first call
- Use CommonJS require and module.exports
- Never throw uncaught errors
- Always return exact output shape even on error
- Never call external APIs (Gemini, OpenAI, HuggingFace)
- Cache model in module level variable

## DO NOT

- Write API routes
- Write frontend code
- Call any paid external AI API
- Return different output shapes

## CURRENT STATUS

ai.js IN PROGRESS
Model Downloads on first server start
