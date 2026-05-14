import { NavLink, useNavigate } from 'react-router-dom'

const DHL_LOGO = 'https://lh3.googleusercontent.com/aida-public/AB6AXuAaNPqYkfrZR2F_zoUsrtpdKGErVDGcjveM-3DjV_gedqOqg6w2vocb8b4hg2aVrxcENNfxKxAKKRmQkyhhWoBVbyCM8CDizCuIr4h5QVis1ki0uZlHV9UKZC-UFpP_KO17tm4qw_o1tx2u50C2U1Ew-1OHLyLHaM-Wli5lq_lDMqaZ563_QmL_FoJrzFmM4X0epPOtdqGMCt_0H_hs_CWbhz1VjHTdfeo2XMz0EhnN5_nIgztujWHN24jliRAAAzQ4JhIjxM4665Wv1w'

const navItems = [
  { path: '/', icon: 'dashboard', label: 'Dashboard' },
  { path: '/submit', icon: 'report_problem', label: 'New Incident' },
  { path: '/reports', icon: 'assessment', label: 'Reports' },
  { path: '/reports/category', icon: 'category', label: 'Category Report' },
  { path: '/settings', icon: 'settings', label: 'Settings' },
]

export default function Sidebar() {
  const navigate = useNavigate()

  function logout() {
    localStorage.clear()
    navigate('/login')
  }

  return (
    <nav style={styles.sidebar}>
      {/* Brand */}
      <div style={styles.brand}>
        <img src={DHL_LOGO} alt="DHL Logo" style={styles.logo} />
        <p style={styles.subtitle}>Incident Management</p>
      </div>

      {/* Nav Links */}
      <ul style={styles.navList}>
        {navItems.map(item => (
          <li key={item.path} style={styles.navItem}>
            <NavLink
              to={item.path}
              end={item.path === '/'}
              style={({ isActive }) => ({
                ...styles.navLink,
                ...(isActive ? styles.navLinkActive : {})
              })}
            >
              <span
                className="material-symbols-outlined"
                style={{ fontSize: '20px', fontVariationSettings: "'FILL' 0" }}
              >
                {item.icon}
              </span>
              <span>{item.label}</span>
            </NavLink>
          </li>
        ))}
      </ul>

      {/* Logout */}
      <div style={styles.logoutArea}>
        <button onClick={logout} style={styles.logoutBtn}>
          <span className="material-symbols-outlined" style={{ fontSize: '20px' }}>logout</span>
          <span>Logout</span>
        </button>
      </div>
    </nav>
  )
}

const styles = {
  sidebar: {
    width: '256px',
    height: '100vh',
    position: 'sticky',
    top: 0,
    flexShrink: 0,
    background: '#1a1a2e',
    display: 'flex',
    flexDirection: 'column',
    padding: '24px 0',
    zIndex: 40,
  },
  brand: {
    padding: '0 20px',
    marginBottom: '32px',
  },
  logo: {
    height: '32px',
    width: 'auto',
    objectFit: 'contain',
    marginBottom: '8px',
  },
  subtitle: {
    fontSize: '11px',
    fontWeight: 500,
    color: 'rgba(255,255,255,0.5)',
    margin: 0,
  },
  navList: {
    listStyle: 'none',
    display: 'flex',
    flexDirection: 'column',
    gap: '2px',
    flex: 1,
    padding: 0,
    margin: 0,
  },
  navItem: {},
  navLink: {
    display: 'flex',
    alignItems: 'center',
    gap: '12px',
    padding: '10px 20px',
    color: 'rgba(255,255,255,0.65)',
    fontSize: '13px',
    fontWeight: 500,
    textDecoration: 'none',
    borderLeft: '3px solid transparent',
    transition: 'all 0.15s',
    width: '100%',
    cursor: 'pointer',
    background: 'none',
  },
  navLinkActive: {
    borderLeftColor: '#FECB00',
    background: 'rgba(255,255,255,0.08)',
    color: '#FECB00',
    fontWeight: 600,
  },
  logoutArea: {
    padding: '0',
    marginTop: 'auto',
  },
  logoutBtn: {
    display: 'flex',
    alignItems: 'center',
    gap: '12px',
    padding: '10px 20px',
    color: 'rgba(255,255,255,0.65)',
    fontSize: '13px',
    fontWeight: 500,
    textDecoration: 'none',
    borderLeft: '3px solid transparent',
    width: '100%',
    cursor: 'pointer',
    background: 'none',
    border: 'none',
  },
}
