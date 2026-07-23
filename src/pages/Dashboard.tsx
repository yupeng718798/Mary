const stats = [
  { title: 'Medical Records', count: 3, desc: 'reports analyzed', icon: '📄', color: '#dbeafe' },
  { title: 'Upcoming Consultation', count: 1, desc: 'Tomorrow 10:00 AM', icon: '💬', color: '#dcfce7' },
  { title: 'Medication', count: 2, desc: 'active medications', icon: '💊', color: '#fef3c7' },
];

const agents = [
  { name: 'Medical Analysis Agent', desc: 'Your latest blood report has been summarized', icon: '🧠', color: '#3b82f6' },
  { name: 'Consultation Agent', desc: 'Prepare questions for doctor', icon: '🩺', color: '#10b981' },
  { name: 'Medication Agent', desc: 'Reminder at 8:00 PM', icon: '💊', color: '#f59e0b' },
];

export default function Dashboard() {
  return (
    <div>
      <h2 style={{ fontSize: '28px', fontWeight: 'bold', marginBottom: '8px', color: '#1e293b' }}>
        Welcome back, John
      </h2>
      <p style={{ color: '#64748b', marginBottom: '32px' }}>Your AI Health Assistant</p>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '24px', marginBottom: '32px' }}>
        {stats.map((stat) => (
          <div key={stat.title} style={{
            backgroundColor: 'white',
            padding: '24px',
            borderRadius: '12px',
            boxShadow: '0 1px 3px rgba(0,0,0,0.1)',
          }}>
            <div style={{ fontSize: '32px', marginBottom: '12px' }}>{stat.icon}</div>
            <h3 style={{ fontSize: '18px', fontWeight: '600', marginBottom: '4px' }}>{stat.title}</h3>
            <p style={{ fontSize: '28px', fontWeight: 'bold', color: '#3b82f6', marginBottom: '4px' }}>{stat.count}</p>
            <p style={{ color: '#64748b', fontSize: '14px' }}>{stat.desc}</p>
          </div>
        ))}
      </div>

      <h3 style={{ fontSize: '20px', fontWeight: '600', marginBottom: '16px', color: '#1e293b' }}>AI Agents</h3>
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '24px' }}>
        {agents.map((agent) => (
          <div key={agent.name} style={{
            backgroundColor: 'white',
            padding: '24px',
            borderRadius: '12px',
            boxShadow: '0 1px 3px rgba(0,0,0,0.1)',
            borderLeft: `4px solid ${agent.color}`,
          }}>
            <div style={{ fontSize: '32px', marginBottom: '12px' }}>{agent.icon}</div>
            <h4 style={{ fontSize: '16px', fontWeight: '600', marginBottom: '8px' }}>{agent.name}</h4>
            <p style={{ color: '#64748b', fontSize: '14px' }}>{agent.desc}</p>
          </div>
        ))}
      </div>
    </div>
  );
}
