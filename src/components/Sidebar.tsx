import { Link, useLocation } from 'react-router-dom';

const menuItems = [
  { path: '/dashboard', label: 'Dashboard', icon: '📊' },
  { path: '/records', label: 'Medical Records', icon: '📄' },
  { path: '/consultation', label: 'Consultation', icon: '💬' },
  { path: '/medication', label: 'Medication', icon: '💊' },
  { path: '/profile', label: 'Profile', icon: '👤' },
];

export default function Sidebar() {
  const location = useLocation();

  return (
    <aside style={{
      width: '240px',
      height: '100vh',
      backgroundColor: '#1e293b',
      color: 'white',
      padding: '24px',
      position: 'fixed',
      left: 0,
      top: 0,
    }}>
      <div style={{ fontSize: '24px', fontWeight: 'bold', marginBottom: '32px' }}>
        Mary <span style={{ fontSize: '16px' }}>🩺</span>
      </div>
      <nav>
        {menuItems.map((item) => (
          <Link
            key={item.path}
            to={item.path}
            style={{
              display: 'flex',
              alignItems: 'center',
              padding: '12px 16px',
              marginBottom: '8px',
              borderRadius: '8px',
              textDecoration: 'none',
              color: location.pathname === item.path ? 'white' : '#94a3b8',
              backgroundColor: location.pathname === item.path ? '#3b82f6' : 'transparent',
              transition: 'all 0.2s',
            }}
          >
            <span style={{ marginRight: '12px', fontSize: '20px' }}>{item.icon}</span>
            {item.label}
          </Link>
        ))}
      </nav>
    </aside>
  );
}
