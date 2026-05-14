import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import api from '../api'

const CATEGORIES = [
  'Late Delivery',
  'Damaged Parcel',
  'Address Issue',
  'System Error',
  'Customer Complaint',
]

const CAT_COLORS = {
  'Late Delivery': '#E74C3C',
  'Damaged Parcel': '#F39C12',
  'Address Issue': '#3498DB',
  'System Error': '#6C63FF',
  'Customer Complaint': '#9B59B6',
}

export default function CategoryBreakdown() {
  const [report, setReport] = useState(null)
  const [incidents, setIncidents] = useState([])
  const [loading, setLoading] = useState(true)
  const navigate = useNavigate()
  const today = new Date().toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })

  useEffect(() => { loadData() }, [])

  async function loadData() {
    try {
      const [reportRes, incidentsRes] = await Promise.all([
        api.get('/reports'),
        api.get('/incidents')
      ])
      setReport(reportRes.data)
      setIncidents(incidentsRes.data)
    } catch (e) { console.error(e) }
    setLoading(false)
  }

  if (loading) return <div style={{ padding: 64, textAlign: 'center', color: '#999' }}>Loading category breakdown...</div>
  if (!report) return null

  const total = report.total || 1

  // Compute resolution rate per category
  const categoryData = CATEGORIES.map(cat => {
    const count = report.by_category?.[cat] || 0
    const pct = total > 0 ? Math.round((count / total) * 100) : 0
    const catIncidents = incidents.filter(i => i.category === cat)
    const resolved = catIncidents.filter(i => i.status === 'Resolved').length
    const resolutionRate = catIncidents.length > 0 ? Math.round((resolved / catIncidents.length) * 100) : 0
    return { name: cat, count, pct, resolutionRate, resolved, total: catIncidents.length }
  }).sort((a, b) => b.count - a.count)

  const maxCount = categoryData[0]?.count || 1

  // Overall resolution rate
  const totalResolved = incidents.filter(i => i.status === 'Resolved').length
  const overallResRate = incidents.length > 0 ? Math.round((totalResolved / incidents.length) * 100) : 0

  return (
    <div style={styles.page}>
      {/* Breadcrumb */}
      <div style={styles.breadcrumb}>
        <span style={styles.breadcrumbLink} onClick={() => navigate('/')}>Dashboard</span>
        <span className="material-symbols-outlined" style={{ fontSize: '16px', color: '#bbb' }}>chevron_right</span>
        <span style={styles.breadcrumbLink} onClick={() => navigate('/reports')}>Reports</span>
        <span className="material-symbols-outlined" style={{ fontSize: '16px', color: '#bbb' }}>chevron_right</span>
        <span style={styles.breadcrumbActive}>Category Breakdown</span>
      </div>

      <header style={styles.header}>
        <div>
          <h2 style={styles.title}>Category Breakdown</h2>
          <p style={styles.subtitle}>{today}</p>
        </div>
        <button
          style={styles.exportBtn}
          onMouseEnter={e => e.currentTarget.style.background = '#B0000E'}
          onMouseLeave={e => e.currentTarget.style.background = '#D40511'}
        >
          <span className="material-symbols-outlined" style={{ fontSize: '18px' }}>download</span>
          Export Report
        </button>
      </header>

      {/* Summary Row */}
      <section style={styles.summaryRow}>
        <div style={styles.summaryCard}>
          <div style={{ ...styles.summaryIconWrap, background: '#6C63FF15' }}>
            <span className="material-symbols-outlined" style={{ color: '#6C63FF', fontSize: '20px' }}>analytics</span>
          </div>
          <div>
            <span style={styles.summaryLabel}>TOTAL INCIDENTS</span>
            <span style={styles.summaryValue}>{report.total}</span>
          </div>
        </div>
        <div style={styles.summaryCard}>
          <div style={{ ...styles.summaryIconWrap, background: '#27AE6015' }}>
            <span className="material-symbols-outlined" style={{ color: '#27AE60', fontSize: '20px' }}>check_circle</span>
          </div>
          <div>
            <span style={styles.summaryLabel}>OVERALL RESOLUTION RATE</span>
            <span style={{ ...styles.summaryValue, color: '#27AE60' }}>{overallResRate}%</span>
          </div>
        </div>
        <div style={styles.summaryCard}>
          <div style={{ ...styles.summaryIconWrap, background: '#E74C3C15' }}>
            <span className="material-symbols-outlined" style={{ color: '#E74C3C', fontSize: '20px' }}>category</span>
          </div>
          <div>
            <span style={styles.summaryLabel}>CATEGORIES TRACKED</span>
            <span style={styles.summaryValue}>{CATEGORIES.length}</span>
          </div>
        </div>
      </section>

      {/* Category Table */}
      <section style={styles.tableCard}>
        <div style={styles.tableHeader}>
          <h3 style={styles.tableTitle}>Detailed Category Analysis</h3>
        </div>
        <div style={{ overflowX: 'auto' }}>
          <table style={styles.table}>
            <thead>
              <tr>
                <th style={styles.th}>Category</th>
                <th style={styles.th}>Count</th>
                <th style={styles.th}>Percentage</th>
                <th style={{ ...styles.th, minWidth: '200px' }}>Distribution</th>
                <th style={styles.th}>Resolved</th>
                <th style={styles.th}>Resolution Rate</th>
              </tr>
            </thead>
            <tbody>
              {categoryData.map((cat, i) => (
                <tr
                  key={cat.name}
                  style={{
                    ...styles.tr,
                    borderBottom: i < categoryData.length - 1 ? '1px solid #f5f5f5' : 'none',
                  }}
                >
                  <td style={styles.td}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                      <span style={{
                        width: '8px', height: '8px', borderRadius: '50%',
                        background: CAT_COLORS[cat.name] || '#6C63FF', flexShrink: 0,
                      }} />
                      <span style={{ fontWeight: 600, fontSize: '13px' }}>{cat.name}</span>
                    </div>
                  </td>
                  <td style={{ ...styles.td, fontWeight: 700, fontSize: '14px' }}>{cat.count}</td>
                  <td style={{ ...styles.td, fontWeight: 600, color: '#888' }}>{cat.pct}%</td>
                  <td style={styles.td}>
                    <div style={styles.barTrack}>
                      <div style={{
                        height: '100%',
                        width: cat.count > 0 ? `${(cat.count / maxCount) * 100}%` : '0%',
                        background: CAT_COLORS[cat.name] || '#6C63FF',
                        borderRadius: '4px',
                        transition: 'width 0.6s ease',
                        minWidth: cat.count > 0 ? '4px' : '0',
                      }} />
                    </div>
                  </td>
                  <td style={{ ...styles.td, color: '#27AE60', fontWeight: 600 }}>
                    {cat.resolved}/{cat.total}
                  </td>
                  <td style={styles.td}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                      <div style={{
                        width: '60px', height: '6px', background: '#f5f5f5',
                        borderRadius: '3px', overflow: 'hidden',
                      }}>
                        <div style={{
                          height: '100%',
                          width: `${cat.resolutionRate}%`,
                          background: cat.resolutionRate >= 50 ? '#27AE60' : '#F39C12',
                          borderRadius: '3px',
                        }} />
                      </div>
                      <span style={{
                        fontSize: '12px', fontWeight: 700,
                        color: cat.resolutionRate >= 50 ? '#27AE60' : '#F39C12',
                      }}>
                        {cat.resolutionRate}%
                      </span>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>

      <footer style={styles.footer}>
        <span className="material-symbols-outlined" style={{ fontSize: '14px' }}>sync</span>
        Last updated: Just now
      </footer>
    </div>
  )
}

const styles = {
  page: {
    padding: '24px 32px',
    maxWidth: '1440px',
    margin: '0 auto',
  },
  breadcrumb: {
    display: 'flex',
    alignItems: 'center',
    gap: '4px',
    marginBottom: '16px',
  },
  breadcrumbLink: { fontSize: '12px', color: '#888', cursor: 'pointer' },
  breadcrumbActive: { fontSize: '12px', fontWeight: 600, color: 'var(--on-surface)' },
  header: {
    display: 'flex',
    flexWrap: 'wrap',
    alignItems: 'center',
    justifyContent: 'space-between',
    gap: '16px',
    marginBottom: '24px',
  },
  title: {
    fontSize: '22px', fontWeight: 700, color: 'var(--on-surface)', margin: 0,
  },
  subtitle: { fontSize: '13px', color: '#888', marginTop: '4px' },
  exportBtn: {
    display: 'flex', alignItems: 'center', gap: '8px',
    padding: '10px 24px', background: '#D40511',
    color: '#fff', fontWeight: 600, fontSize: '13px',
    borderRadius: '10px', border: 'none', cursor: 'pointer',
    boxShadow: '0 2px 8px rgba(212,5,17,0.3)',
    transition: 'all 0.2s',
  },
  summaryRow: {
    display: 'grid',
    gridTemplateColumns: 'repeat(3, 1fr)',
    gap: '16px',
    marginBottom: '24px',
  },
  summaryCard: {
    background: '#fff',
    borderRadius: '14px',
    boxShadow: 'var(--shadow-card)',
    border: '1px solid var(--border-subtle)',
    padding: '20px',
    display: 'flex',
    alignItems: 'center',
    gap: '16px',
  },
  summaryIconWrap: {
    width: '44px', height: '44px', borderRadius: '12px',
    display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0,
  },
  summaryLabel: {
    fontSize: '11px', fontWeight: 600, letterSpacing: '0.05em',
    textTransform: 'uppercase', color: '#888', display: 'block',
  },
  summaryValue: {
    fontSize: '24px', fontWeight: 700, color: 'var(--on-surface)', display: 'block', marginTop: '4px',
  },
  tableCard: {
    background: '#fff',
    borderRadius: '14px',
    boxShadow: 'var(--shadow-card)',
    border: '1px solid var(--border-subtle)',
    overflow: 'hidden',
    marginBottom: '16px',
  },
  tableHeader: {
    padding: '16px 20px',
    borderBottom: '1px solid var(--border-subtle)',
  },
  tableTitle: {
    fontSize: '15px', fontWeight: 600, margin: 0, color: 'var(--on-surface)',
  },
  table: {
    width: '100%',
    borderCollapse: 'collapse',
  },
  th: {
    textAlign: 'left',
    padding: '12px 16px',
    fontSize: '11px',
    fontWeight: 600,
    letterSpacing: '0.08em',
    textTransform: 'uppercase',
    color: '#999',
    background: '#fafafa',
    borderBottom: '1px solid var(--border-subtle)',
    whiteSpace: 'nowrap',
  },
  tr: {
    transition: 'background 0.1s',
  },
  td: {
    padding: '14px 16px',
    fontSize: '13px',
    color: '#444',
    whiteSpace: 'nowrap',
  },
  barTrack: {
    width: '100%', height: '16px', background: '#f5f5f5',
    borderRadius: '6px', overflow: 'hidden',
  },
  footer: {
    display: 'flex', alignItems: 'center', justifyContent: 'flex-end',
    gap: '4px', paddingTop: '12px', borderTop: '1px solid var(--border-subtle)',
    fontSize: '12px', color: '#999',
  },
}
