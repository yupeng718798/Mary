import { useState } from 'react';

const records = [
  {
    id: 1,
    title: 'Blood Test',
    date: '2026-07-20',
    summary: 'Your cholesterol level is slightly elevated. Consider dietary changes.',
    status: 'Analyzed',
  },
  {
    id: 2,
    title: 'X-Ray Report',
    date: '2026-07-15',
    summary: 'Chest X-Ray shows normal lung function. No abnormalities detected.',
    status: 'Analyzed',
  },
  {
    id: 3,
    title: 'Annual Physical',
    date: '2026-06-30',
    summary: 'All vital signs within normal range. Continue current exercise routine.',
    status: 'Analyzed',
  },
];

export default function MedicalRecords() {
  const [uploaded, setUploaded] = useState(false);

  return (
    <div>
      <h2 style={{ fontSize: '28px', fontWeight: 'bold', marginBottom: '24px', color: '#1e293b' }}>
        Medical Records
      </h2>

      <div style={{
        backgroundColor: 'white',
        padding: '32px',
        borderRadius: '12px',
        marginBottom: '24px',
        border: '2px dashed #d1d5db',
        textAlign: 'center',
      }}>
        <div style={{ fontSize: '48px', marginBottom: '12px' }}>📤</div>
        <p style={{ color: '#64748b', marginBottom: '16px' }}>Upload Medical File (PDF)</p>
        <button
          onClick={() => setUploaded(!uploaded)}
          style={{
            padding: '12px 24px',
            backgroundColor: '#3b82f6',
            color: 'white',
            border: 'none',
            borderRadius: '8px',
            cursor: 'pointer',
            fontWeight: '600',
          }}
        >
          {uploaded ? 'File Uploaded ✓' : '+ Upload PDF'}
        </button>
      </div>

      <h3 style={{ fontSize: '20px', fontWeight: '600', marginBottom: '16px' }}>Recent Records</h3>
      {records.map((record) => (
        <div key={record.id} style={{
          backgroundColor: 'white',
          padding: '24px',
          borderRadius: '12px',
          marginBottom: '16px',
          boxShadow: '0 1px 3px rgba(0,0,0,0.1)',
        }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '12px' }}>
            <h4 style={{ fontSize: '18px', fontWeight: '600' }}>{record.title}</h4>
            <span style={{
              padding: '4px 12px',
              backgroundColor: '#dcfce7',
              color: '#166534',
              borderRadius: '20px',
              fontSize: '12px',
              fontWeight: '600',
            }}>{record.status}</span>
          </div>
          <p style={{ color: '#64748b', fontSize: '14px', marginBottom: '8px' }}>{record.date}</p>
          <div style={{
            backgroundColor: '#f8fafc',
            padding: '16px',
            borderRadius: '8px',
            marginBottom: '12px',
          }}>
            <p style={{ fontSize: '14px', color: '#374151' }}><strong>AI Summary:</strong> {record.summary}</p>
          </div>
          <button style={{
            padding: '8px 16px',
            backgroundColor: '#f3f4f6',
            border: 'none',
            borderRadius: '6px',
            cursor: 'pointer',
            fontWeight: '500',
          }}>View Report</button>
        </div>
      ))}
    </div>
  );
}
