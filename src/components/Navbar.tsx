export default function Navbar() {
  return (
    <header style={{
      height: '64px',
      backgroundColor: 'white',
      borderBottom: '1px solid #e2e8f0',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'space-between',
      padding: '0 32px',
      position: 'fixed',
      top: 0,
      left: '240px',
      right: 0,
      zIndex: 100,
    }}>
      <h1 style={{ fontSize: '20px', fontWeight: '600', color: '#1e293b' }}>
        Healthcare AI Dashboard
      </h1>
      <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
        <span style={{ color: '#64748b' }}>Welcome, John</span>
        <div style={{
          width: '36px',
          height: '36px',
          borderRadius: '50%',
          backgroundColor: '#3b82f6',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          color: 'white',
          fontWeight: 'bold',
        }}>J</div>
      </div>
    </header>
  );
}
