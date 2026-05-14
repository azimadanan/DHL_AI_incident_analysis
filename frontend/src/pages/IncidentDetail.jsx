import { useEffect, useState } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import api from '../api'

function formatIncidentId(id) {
  const year = new Date().getFullYear()
  const short = String(id).slice(-4)
  return 'INC-' + year + '-' + short
}

const STATUS_MAP = {
  Open: { color: '#E74C3C', icon: 'warning', bg: '#FEF2F2' },
  'In Progress': { color: '#F39C12', icon: 'hourglass_top', bg: '#FFF8E1' },
  Resolved: { color: '#27AE60', icon: 'check_circle', bg: '#E8F5E9' },
}

const PRIORITY_MAP = {
  High: '#E74C3C',
  Medium: '#F39C12',
  Low: '#27AE60',
}

export default function IncidentDetail() {
  const { id } = useParams()
  const navigate = useNavigate()
  const [incident, setIncident] = useState(null)
  const [loading, setLoading] = useState(true)
  const [updating, setUpdating] = useState(false)

  useEffect(() => { loadIncident() }, [id])

  async function loadIncident() {
    setLoading(true)
    try {
      const res = await api.get(`/incidents/${id}`)
      setIncident(res.data)
    } catch {
      navigate('/')
    }
    setLoading(false)
  }

  async function updateStatus(newStatus) {
    setUpdating(true)
    try {
      const res = await api.patch(`/incidents/${id}/status`, { status: newStatus })
      setIncident(res.data)
    } catch (e) {
      console.error(e)
    }
    setUpdating(false)
  }

  if (loading) return (
    <div style={{ padding: '64px', textAlign: 'center', color: '#999' }}>Loading incident...</div>
  )
  if (!incident) return null

  const sm = STATUS_MAP[incident.status] || STATUS_MAP.Open

  return (
    <div style={styles.page}>
      {/* Breadcrumb */}
      <div style={styles.breadcrumb}>
        <span style={styles.breadcrumbLink} onClick={() => navigate('/')}>Dashboard</span>
        <span className="material-symbols-outlined" style={{ fontSize: '16px', color: '#bbb' }}>chevron_right</span>
        <span style={styles.breadcrumbActive}>{formatIncidentId(incident.id)}</span>
      </div>

      {/* Header */}
      <header style={styles.header}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
          <button onClick={() => navigate('/')} style={styles.backIcon}>
            <span className="material-symbols-outlined" style={{ fontSize: '18px' }}>arrow_back</span>
          </button>
          <div>
            <h2 style={styles.title}>{incident.title || 'Untitled Incident'}</h2>
            <p style={styles.subtitle}>
              {formatIncidentId(incident.id)} • {incident.source || 'Manual'} • {new Date(incident.created_at).toLocaleString()}
            </p>
          </div>
        </div>
        <span style={{
          ...styles.statusPillLg,
          color: sm.color,
          background: sm.bg,
        }}>
          <span className="material-symbols-outlined" style={{ fontSize: '16px' }}>{sm.icon}</span>
          {incident.status}
        </span>
      </header>

      {/* Duplicate Warning */}
      {incident.is_duplicate && (
        <div style={styles.dupBanner}>
          <span className="material-symbols-outlined" style={{ fontSize: '20px' }}>content_copy</span>
          <div>
            <strong>Potential Duplicate Detected</strong>
            <p style={{ margin: '4px 0 0', fontSize: '13px', opacity: 0.9 }}>{incident.duplicate_reason}</p>
          </div>
        </div>
      )}

      {/* Main Grid */}
      <div style={styles.grid}>
        {/* Left Column */}
        <div style={styles.leftCol}>
          {/* AI Summary */}
          <div style={styles.card}>
            <div style={styles.cardHeader}>
              <span className="material-symbols-outlined" style={{ color: 'var(--primary)', fontSize: '20px' }}>smart_toy</span>
              <h3 style={styles.cardTitle}>AI Analysis Summary</h3>
            </div>
            <div style={styles.summaryPanel}>
              <p
                style={styles.summaryText}
                dangerouslySetInnerHTML={{ __html: incident.summary || 'No AI summary generated.' }}
              />
            </div>
          </div>

          {/* Raw Payload */}
          <div style={styles.card}>
            <div style={styles.cardHeader}>
              <span className="material-symbols-outlined" style={{ color: '#888', fontSize: '20px' }}>description</span>
              <h3 style={styles.cardTitle}>Raw Incident Payload</h3>
            </div>
            <pre style={styles.rawBlock}>{incident.raw_content}</pre>
          </div>
        </div>

        {/* Right Column */}
        <div style={styles.rightCol}>
          {/* Details */}
          <div style={styles.card}>
            <div style={styles.cardHeader}>
              <span className="material-symbols-outlined" style={{ color: 'var(--primary)', fontSize: '20px' }}>info</span>
              <h3 style={styles.cardTitle}>Incident Details</h3>
            </div>
            <div style={styles.detailGrid}>
              <div style={styles.detailItem}>
                <span style={styles.detailLabel}>CATEGORY</span>
                <span style={styles.categoryBadge}>{incident.category || 'N/A'}</span>
              </div>
              <div style={styles.detailItem}>
                <span style={styles.detailLabel}>PRIORITY</span>
                <span style={{ fontWeight: 700, fontSize: '13px', color: PRIORITY_MAP[incident.priority] || '#888' }}>
                  {incident.priority || 'N/A'}
                </span>
              </div>
              <div style={styles.detailItem}>
                <span style={styles.detailLabel}>SOURCE</span>
                <span style={{ fontSize: '13px' }}>{incident.source || 'Manual'}</span>
              </div>
              <div style={styles.detailItem}>
                <span style={styles.detailLabel}>CREATED</span>
                <span style={{ fontSize: '13px' }}>{new Date(incident.created_at).toLocaleString()}</span>
              </div>
              <div style={styles.detailItem}>
                <span style={styles.detailLabel}>LAST UPDATED</span>
                <span style={{ fontSize: '13px' }}>{new Date(incident.updated_at).toLocaleString()}</span>
              </div>
              {incident.created_by && (
                <div style={styles.detailItem}>
                  <span style={styles.detailLabel}>SUBMITTED BY</span>
                  <span style={{ fontSize: '13px' }}>{incident.created_by}</span>
                </div>
              )}
            </div>
          </div>

          {/* Status Workflow */}
          <div style={styles.card}>
            <div style={styles.cardHeader}>
              <span className="material-symbols-outlined" style={{ color: '#F39C12', fontSize: '20px' }}>swap_horiz</span>
              <h3 style={styles.cardTitle}>Status Workflow</h3>
            </div>
            <div style={styles.workflowBtns}>
              {['Open', 'In Progress', 'Resolved'].map(status => {
                const s = STATUS_MAP[status]
                const isActive = incident.status === status
                return (
                  <button
                    key={status}
                    onClick={() => updateStatus(status)}
                    disabled={isActive || updating}
                    style={{
                      ...styles.workflowBtn,
                      background: isActive ? s.bg : '#fff',
                      color: isActive ? s.color : '#888',
                      border: `1px solid ${isActive ? s.color : 'var(--border-subtle)'}`,
                      fontWeight: isActive ? 700 : 500,
                    }}
                  >
                    <span className="material-symbols-outlined" style={{ fontSize: '18px' }}>{s.icon}</span>
                    {status}
                  </button>
                )
              })}
            </div>
          </div>
        </div>
      </div>
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
  breadcrumbLink: {
    fontSize: '12px',
    color: '#888',
    cursor: 'pointer',
  },
  breadcrumbActive: {
    fontSize: '12px',
    fontWeight: 600,
    color: 'var(--on-surface)',
  },
  header: {
    display: 'flex',
    flexWrap: 'wrap',
    alignItems: 'center',
    justifyContent: 'space-between',
    gap: '16px',
    marginBottom: '20px',
  },
  backIcon: {
    width: '36px',
    height: '36px',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    background: '#fff',
    border: '1px solid var(--border-subtle)',
    borderRadius: '10px',
    cursor: 'pointer',
    color: 'var(--on-surface)',
    boxShadow: 'var(--shadow-card)',
  },
  title: {
    fontSize: '20px',
    fontWeight: 700,
    color: 'var(--on-surface)',
    margin: 0,
  },
  subtitle: {
    fontSize: '12px',
    color: '#888',
    marginTop: '4px',
  },
  statusPillLg: {
    display: 'inline-flex',
    alignItems: 'center',
    gap: '6px',
    padding: '6px 14px',
    borderRadius: '8px',
    fontSize: '12px',
    fontWeight: 600,
  },
  dupBanner: {
    display: 'flex',
    gap: '12px',
    alignItems: 'flex-start',
    padding: '14px 16px',
    background: '#FFF8E1',
    border: '1px solid #F39C12',
    borderRadius: '12px',
    color: '#92400E',
    marginBottom: '20px',
  },
  grid: {
    display: 'grid',
    gridTemplateColumns: '1fr 360px',
    gap: '20px',
    alignItems: 'start',
  },
  leftCol: {
    display: 'flex',
    flexDirection: 'column',
    gap: '20px',
  },
  rightCol: {
    display: 'flex',
    flexDirection: 'column',
    gap: '20px',
  },
  card: {
    background: '#fff',
    borderRadius: '14px',
    boxShadow: 'var(--shadow-card)',
    border: '1px solid var(--border-subtle)',
    padding: '20px 24px',
  },
  cardHeader: {
    display: 'flex',
    alignItems: 'center',
    gap: '8px',
    marginBottom: '16px',
    paddingBottom: '12px',
    borderBottom: '1px solid var(--border-subtle)',
  },
  cardTitle: {
    fontSize: '14px',
    fontWeight: 600,
    margin: 0,
    color: 'var(--on-surface)',
  },
  summaryPanel: {
    borderLeft: '3px solid #FECB00',
    paddingLeft: '16px',
  },
  summaryText: {
    fontSize: '13px',
    lineHeight: '1.7',
    color: '#555',
  },
  rawBlock: {
    background: '#1a1a2e',
    borderRadius: '10px',
    padding: '16px',
    fontSize: '12px',
    lineHeight: '1.6',
    fontFamily: "'JetBrains Mono', monospace",
    whiteSpace: 'pre-wrap',
    wordBreak: 'break-word',
    maxHeight: '400px',
    overflow: 'auto',
    margin: 0,
    color: '#e0e0e0',
  },
  detailGrid: {
    display: 'flex',
    flexDirection: 'column',
    gap: '0',
  },
  detailItem: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: '10px 0',
    borderBottom: '1px solid #f5f5f5',
  },
  detailLabel: {
    fontSize: '11px',
    fontWeight: 600,
    letterSpacing: '0.08em',
    color: '#999',
  },
  categoryBadge: {
    display: 'inline-block',
    padding: '3px 10px',
    background: '#f5f5f5',
    border: '1px solid #eee',
    borderRadius: '6px',
    fontSize: '11px',
    fontWeight: 600,
  },
  workflowBtns: {
    display: 'flex',
    flexDirection: 'column',
    gap: '8px',
  },
  workflowBtn: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    gap: '8px',
    padding: '10px',
    borderRadius: '10px',
    fontSize: '13px',
    cursor: 'pointer',
    transition: 'all 0.15s',
    width: '100%',
  },
}