require('dotenv').config()
const express = require('express')
const cors = require('cors')
const bcrypt = require('bcryptjs')
const jwt = require('jsonwebtoken')
const { db, initDB } = require('./db')
const { analyzeIncident } = require('./ai')

const app = express()
app.use(cors())
app.use(express.json())

// ──────────────────────────────────────────────
// AUTH MIDDLEWARE
// ──────────────────────────────────────────────
function authMiddleware(req, res, next) {
  const token = req.headers.authorization?.split(' ')[1]
  if (!token) return res.status(401).json({ error: 'No token' })
  try {
    req.user = jwt.verify(token, process.env.JWT_SECRET)
    next()
  } catch {
    res.status(401).json({ error: 'Invalid token' })
  }
}

// ──────────────────────────────────────────────
// AUTH ROUTES
// ──────────────────────────────────────────────

// Login
app.post('/api/login', async (req, res) => {
  try {
    await db.read()
    const { email, password } = req.body
    const user = db.data.users.find(u => u.email === email)
    if (!user || !(await bcrypt.compare(password, user.password))) {
      return res.status(401).json({ error: 'Invalid credentials' })
    }
    const token = jwt.sign(
      { id: user.id, email: user.email, role: user.role },
      process.env.JWT_SECRET,
      { expiresIn: '24h' }
    )
    res.json({
      token,
      user: {
        id: user.id,
        email: user.email,
        role: user.role
      }
    })
  } catch (e) {
    console.error('Login error:', e.message)
    res.status(500).json({ error: 'Server error' })
  }
})

// ──────────────────────────────────────────────
// INCIDENT ROUTES
// ──────────────────────────────────────────────

// Get all incidents
app.get('/api/incidents', authMiddleware, async (req, res) => {
  try {
    await db.read()
    let incidents = db.data.incidents || []
    if (req.query.search) {
      const s = req.query.search.toLowerCase()
      incidents = incidents.filter(i =>
        i.title?.toLowerCase().includes(s) ||
        i.category?.toLowerCase().includes(s) ||
        i.summary?.toLowerCase().includes(s) ||
        i.raw_content?.toLowerCase().includes(s)
      )
    }
    if (req.query.status) {
      incidents = incidents.filter(i => i.status === req.query.status)
    }
    if (req.query.category) {
      incidents = incidents.filter(i => i.category === req.query.category)
    }
    if (req.query.priority) {
      incidents = incidents.filter(i => i.priority === req.query.priority)
    }
    res.json(incidents.reverse())
  } catch (e) {
    console.error('Get incidents error:', e.message)
    res.status(500).json({ error: 'Server error' })
  }
})

// Get single incident
app.get('/api/incidents/:id', authMiddleware, async (req, res) => {
  try {
    await db.read()
    const incident = db.data.incidents.find(i => i.id == req.params.id)
    if (!incident) return res.status(404).json({ error: 'Not found' })
    res.json(incident)
  } catch (e) {
    console.error('Get incident error:', e.message)
    res.status(500).json({ error: 'Server error' })
  }
})

// Create incident (with AI analysis)
app.post('/api/incidents', authMiddleware, async (req, res) => {
  try {
    await db.read()
    const { raw_content } = req.body
    if (!raw_content) return res.status(400).json({ error: 'raw_content required' })

    let aiResult = {}
    try {
      aiResult = await analyzeIncident(raw_content, db.data.incidents)
    } catch (e) {
      console.error('Gemini error:', e.message)
      aiResult = {
        title: 'Incident Report',
        summary: raw_content.substring(0, 200),
        category: 'Customer Complaint',
        priority: 'Medium',
        is_duplicate: false,
        duplicate_reason: ''
      }
    }

    const incident = {
      id: Date.now(),
      raw_content,
      ...aiResult,
      status: 'Open',
      source: 'Manual',
      created_by: req.user.email,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString()
    }

    db.data.incidents.push(incident)
    await db.write()
    res.status(201).json(incident)
  } catch (e) {
    console.error('Create incident error:', e.message)
    res.status(500).json({ error: 'Server error' })
  }
})

// Update incident status
app.patch('/api/incidents/:id/status', authMiddleware, async (req, res) => {
  try {
    await db.read()
    const incident = db.data.incidents.find(i => i.id == req.params.id)
    if (!incident) return res.status(404).json({ error: 'Not found' })
    incident.status = req.body.status
    incident.updated_at = new Date().toISOString()
    await db.write()
    res.json(incident)
  } catch (e) {
    console.error('Update status error:', e.message)
    res.status(500).json({ error: 'Server error' })
  }
})

// ──────────────────────────────────────────────
// REPORTS
// ──────────────────────────────────────────────
app.get('/api/reports', authMiddleware, async (req, res) => {
  try {
    await db.read()
    const incidents = db.data.incidents || []
    const report = {
      total: incidents.length,
      by_status: {
        Open: incidents.filter(i => i.status === 'Open').length,
        'In Progress': incidents.filter(i => i.status === 'In Progress').length,
        Resolved: incidents.filter(i => i.status === 'Resolved').length
      },
      by_category: {},
      by_priority: { High: 0, Medium: 0, Low: 0 }
    }
    incidents.forEach(i => {
      if (i.category) report.by_category[i.category] = (report.by_category[i.category] || 0) + 1
      if (i.priority) report.by_priority[i.priority] = (report.by_priority[i.priority] || 0) + 1
    })
    res.json(report)
  } catch (e) {
    console.error('Reports error:', e.message)
    res.status(500).json({ error: 'Server error' })
  }
})

// ──────────────────────────────────────────────
// UiPath INGEST (no auth)
// ──────────────────────────────────────────────
app.post('/api/ingest', async (req, res) => {
  try {
    await db.read()
    const { raw_content, source } = req.body
    if (!raw_content) return res.status(400).json({ error: 'raw_content required' })

    let aiResult = {}
    try {
      aiResult = await analyzeIncident(raw_content, db.data.incidents)
    } catch (e) {
      aiResult = {
        title: 'Auto Ingested Incident',
        summary: raw_content.substring(0, 200),
        category: 'Customer Complaint',
        priority: 'Medium',
        is_duplicate: false,
        duplicate_reason: ''
      }
    }

    const incident = {
      id: Date.now(),
      raw_content,
      source: source || 'UiPath Bot',
      ...aiResult,
      status: 'Open',
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString()
    }

    db.data.incidents.push(incident)
    await db.write()
    res.status(201).json(incident)
  } catch (e) {
    console.error('Ingest error:', e.message)
    res.status(500).json({ error: 'Server error' })
  }
})

// ──────────────────────────────────────────────
// START SERVER
// ──────────────────────────────────────────────
const PORT = process.env.PORT || 3000
initDB().then(() => {
  app.listen(PORT, () => console.log(`Server running on http://localhost:${PORT}`))
})