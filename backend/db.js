const { Low } = require('lowdb')
const { JSONFile } = require('lowdb/node')
const path = require('path')
const bcrypt = require('bcryptjs')

const file = path.join(__dirname, 'db.json')
const adapter = new JSONFile(file)
const db = new Low(adapter, { users: [], incidents: [] })

async function initDB() {
  await db.read()
  db.data = db.data || { users: [], incidents: [] }

  let changed = false;

  if (db.data.users.length === 0) {
    db.data.users.push({
      id: Date.now(),
      email: 'admin@dhl.com',
      password: await bcrypt.hash('admin123', 10),
      role: 'admin',
      created_at: new Date().toISOString()
    });
    db.data.users.push({
      id: Date.now() + 1,
      email: 'agent@dhl.com',
      password: await bcrypt.hash('agent123', 10),
      role: 'agent',
      created_at: new Date().toISOString()
    });
    console.log('Default users created: admin@dhl.com and agent@dhl.com');
    changed = true;
  }

  if (db.data.incidents.length === 0) {
    db.data.incidents.push({
      id: Date.now(),
      raw_content: "Customer complained about late delivery for package DHL-1234.",
      title: "Late Delivery DHL-1234 Customer Report",
      summary: "Incident reported: Customer complained about late delivery for package DHL-1234. This incident has been logged and requires follow-up.",
      category: "Late Delivery",
      priority: "High",
      is_duplicate: false,
      duplicate_reason: "",
      status: "Open",
      source: "Manual",
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString()
    });
    db.data.incidents.push({
      id: Date.now() + 1,
      raw_content: "The package DHL-5678 arrived crushed and wet.",
      title: "Damaged Parcel DHL-5678 Reported",
      summary: "Incident reported: The package DHL-5678 arrived crushed and wet. This incident has been logged and requires follow-up.",
      category: "Damaged Parcel",
      priority: "Medium",
      is_duplicate: false,
      duplicate_reason: "",
      status: "In Progress",
      source: "Manual",
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString()
    });
    db.data.incidents.push({
      id: Date.now() + 2,
      raw_content: "Tracking portal is down and shows error 500.",
      title: "System Error Reported By Customer",
      summary: "Incident reported: Tracking portal is down and shows error 500. This incident has been logged and requires follow-up.",
      category: "System Error",
      priority: "Low",
      is_duplicate: false,
      duplicate_reason: "",
      status: "Resolved",
      source: "Manual",
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString()
    });
    console.log('Sample incidents created');
    changed = true;
  }

  if (changed) {
    await db.write();
  }
}

module.exports = { db, initDB }