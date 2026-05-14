import { Outlet } from 'react-router-dom'
import Sidebar from './Sidebar'

export default function Layout() {
  return (
    <div style={styles.shell}>
      {/* Desktop Sidebar */}
      <Sidebar />

      {/* Mobile Top Bar */}
      <header style={styles.mobileHeader} className="mobile-header">
        <div style={styles.mobileTitle}>Incident System</div>
      </header>

      {/* Main Content Area */}
      <main style={styles.main}>
        <Outlet />
      </main>

      <style>{`
        .mobile-header { display: none; }
        @media (max-width: 768px) {
          .mobile-header {
            display: flex !important;
            position: sticky;
            top: 0;
            z-index: 50;
          }
        }
      `}</style>
    </div>
  )
}

const styles = {
  shell: {
    display: 'flex',
    minHeight: '100vh',
  },
  mobileHeader: {
    display: 'none',
    width: '100%',
    height: '52px',
    background: '#D40511',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: '0 16px',
  },
  mobileTitle: {
    fontSize: '16px',
    fontWeight: 700,
    color: '#fff',
  },
  main: {
    flex: 1,
    overflow: 'auto',
    background: 'var(--background)',
  },
}
