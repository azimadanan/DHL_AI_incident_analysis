async function analyzeIncident(rawText, existingIncidents = []) {
  const apiKey = process.env.GEMINI_API_KEY
  const url = `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent?key=${apiKey}`

  // Build duplicate-detection context from existing incidents
  let duplicateContext = ''
  if (existingIncidents.length > 0) {
    const recent = existingIncidents.slice(-20).map(i =>
      `[ID:${i.id}] Title: ${i.title} | Category: ${i.category} | Summary: ${i.summary?.substring(0, 100)}`
    ).join('\n')
    duplicateContext = `\n\n## EXISTING INCIDENTS (check for duplicates)\n${recent}`
  }

  const prompt = `You are an intelligent incident classification and summarization agent for DHL's Customer Support team. Your job is to process raw, messy incident reports and transform them into clean, structured data.

## CONTEXT
DHL Customer Support teams receive high volumes of incident reports daily through multiple inconsistent channels:
- Email inboxes
- WhatsApp/Teams chat messages
- Phone call notes
- Images/screenshots of damaged packages
- Handwritten instructions from warehouse teams

## YOUR TASKS
When given a raw incident report, you must:
1. EXTRACT the key problem from messy, unstructured input
2. REWRITE the content into a clean, professional summary (2-3 sentences)
3. CLASSIFY the incident into the correct category
4. ASSIGN a priority level based on urgency and impact
5. DETECT if this is a duplicate of an existing incident
6. GENERATE a clear, concise title for the incident

## OUTPUT FORMAT
Respond with ONLY valid JSON. No markdown, no code blocks, no extra text. Exactly this structure:
{
  "title": "Short 5-8 word title describing the incident",
  "summary": "2-3 professional sentences clearly describing the issue, who is affected, and what needs to happen",
  "category": "one of: Late Delivery | Damaged Parcel | Address Issue | System Error | Customer Complaint",
  "priority": "High | Medium | Low",
  "is_duplicate": false,
  "duplicate_reason": ""
}

## CLASSIFICATION RULES

### Category:
- "Late Delivery" — parcel has not arrived by expected date, delayed shipment
- "Damaged Parcel" — package arrived broken, wet, crushed, or contents missing
- "Address Issue" — wrong address, undeliverable location, customer moved
- "System Error" — tracking not updating, portal down, scan errors, IT issues
- "Customer Complaint" — general dissatisfaction, rude driver, poor service, billing

### Priority:
- "High" — affects multiple customers, time-sensitive (perishables, medical), customer threatening legal action, major system outage, high-value goods damaged
- "Medium" — single customer affected, delivery 1-3 days late, minor damage, standard complaint
- "Low" — inquiry, feedback, minor inconvenience, resolved but logging required

## DUPLICATE DETECTION
If the incident appears to describe the same issue as an existing incident (same tracking number, same address, same customer name, very similar description), set is_duplicate to true and explain why in duplicate_reason.
${duplicateContext}

## TONE & STYLE RULES
- Always professional and neutral
- Never include personal opinions
- Summarize facts only — do not invent details not present in the raw input
- If information is missing, summarize what is available
- Use proper English regardless of how messy the input is

## IMPORTANT RULES
- NEVER return anything except valid JSON
- NEVER add markdown code blocks
- NEVER make up tracking numbers or details not in the input
- NEVER change the JSON structure
- ALWAYS fill every field — never leave a field empty except duplicate_reason when is_duplicate is false
- If the input is completely unclear, still return your best classification based on available context

## RAW INCIDENT REPORT TO ANALYZE:
${rawText}`

  const requestBody = JSON.stringify({
    contents: [{ parts: [{ text: prompt }] }],
    generationConfig: {
      temperature: 0.2,
      topP: 0.8,
      maxOutputTokens: 1024
    }
  })

  // Retry with exponential backoff for rate limiting
  let response
  const maxRetries = 3
  for (let attempt = 0; attempt <= maxRetries; attempt++) {
    response = await fetch(url, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: requestBody
    })

    if (response.ok) break

    if (response.status === 429 && attempt < maxRetries) {
      const waitMs = Math.pow(2, attempt) * 5000 // 5s, 10s, 20s
      console.log(`Gemini rate limited, retrying in ${waitMs / 1000}s (attempt ${attempt + 1}/${maxRetries})...`)
      await new Promise(resolve => setTimeout(resolve, waitMs))
      continue
    }

    const errorBody = await response.text()
    throw new Error(`Gemini API error (${response.status}): ${errorBody}`)
  }

  const data = await response.json()

  if (!data.candidates || !data.candidates[0]?.content?.parts?.[0]?.text) {
    throw new Error('Gemini returned an unexpected response structure')
  }

  const text = data.candidates[0].content.parts[0].text
  // Strip any accidental markdown code fences
  const clean = text.replace(/```json\s*/gi, '').replace(/```\s*/g, '').trim()

  let parsed
  try {
    parsed = JSON.parse(clean)
  } catch (e) {
    // Try to extract JSON from the response if there's extra text
    const jsonMatch = clean.match(/\{[\s\S]*\}/)
    if (jsonMatch) {
      parsed = JSON.parse(jsonMatch[0])
    } else {
      throw new Error(`Failed to parse Gemini response as JSON: ${clean.substring(0, 200)}`)
    }
  }

  // Validate required fields and enforce allowed values
  const validCategories = ['Late Delivery', 'Damaged Parcel', 'Address Issue', 'System Error', 'Customer Complaint']
  const validPriorities = ['High', 'Medium', 'Low']

  const result = {
    title: typeof parsed.title === 'string' ? parsed.title : 'Incident Report',
    summary: typeof parsed.summary === 'string' ? parsed.summary : rawText.substring(0, 200),
    category: validCategories.includes(parsed.category) ? parsed.category : 'Customer Complaint',
    priority: validPriorities.includes(parsed.priority) ? parsed.priority : 'Medium',
    is_duplicate: typeof parsed.is_duplicate === 'boolean' ? parsed.is_duplicate : false,
    duplicate_reason: typeof parsed.duplicate_reason === 'string' ? parsed.duplicate_reason : ''
  }

  return result
}

module.exports = { analyzeIncident }