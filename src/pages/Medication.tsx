import { useState } from 'react';

const medications = [
  { name: 'Panadol', dosage: '500mg', frequency: 'Every 8 hours', reminder: '08:00 PM' },
  { name: 'Vitamin D', dosage: '1000 IU', frequency: 'Once daily', reminder: '09:00 AM' },
];

export default function Medication() {
  const [mood, setMood] = useState('');

  return (
    <div>
      <h2 style={{ fontSize: '28px', fontWeight: 'bold', marginBottom: '24px', color: '#1e293b' }}>
        Medication Management
      </h2>

      <div style={{ backgroundColor: 'white', padding: '24px', borderRadius: '12px', marginBottom: '24px' }}>
        <h3 style={{ fontSize: '18px', fontWeight: '600', marginBottom: '16px' }}>Current Medication</h3>
        {medications.map((med) => (
          <div key={med.name} style={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            padding: '16px',
            backgroundColor: '#f8fafc',
            borderRadius: '8px',
            marginBottom: '12px',
          }}>
            <div>
              <p style={{ fontWeight: '600' }}>{med.name}</p>
              <p style={{ color: '#64748b', fontSize: '14px' }}>{med.dosage} · {med.frequency}</p>
            </div>
            <div style={{
              padding: '6px 12px',
              backgroundColor: '#dbeafe',
              color: '#1e40af',
              borderRadius: '6px',
              fontSize: '14px',
              fontWeight: '500',
            }}>
              ⏰ {med.reminder}
            </div>
          </div>
        ))}
      </div>

      <div style={{ backgroundColor: 'white', padding: '24px', borderRadius: '12px' }}>
        <h3 style={{ fontSize: '18px', fontWeight: '600', marginBottom: '16px' }}>Symptom Diary</h3>
        <p style={{ color: '#64748b', marginBottom: '16px' }}>How do you feel today?</p>
        <div style={{ display: 'flex', gap: '16px', marginBottom: '16px' }}>
          {['😀', '😐', '😞'].map((emoji) => (
            <button
              key={emoji}
              onClick={() => setMood(emoji)}
              style={{
                fontSize: '32px',
                padding: '12px',
                border: mood === emoji ? '2px solid #3b82f6' : '2px solid transparent',
                borderRadius: '12px',
                backgroundColor: mood === emoji ? '#eff6ff' : '#f8fafc',
                cursor: 'pointer',
              }}
            >
              {emoji}
            </button>
          ))}
        </div>
        <button style={{
          padding: '10px 20px',
          backgroundColor: '#3b82f6',
          color: 'white',
          border: 'none',
          borderRadius: '8px',
          cursor: 'pointer',
          fontWeight: '600',
        }}>
          Save
        </button>
      </div>
    </div>
  );
}
