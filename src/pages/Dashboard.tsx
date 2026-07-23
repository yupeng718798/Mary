import { useEffect, useState } from 'react';
import { useApp } from '../context/AppContext';
import {
  medicalApi,
  consultationApi,
  medicationApi,
} from '../api/services';
import type { MedicalRecord, Consultation, Medication } from '../api/services';

export default function Dashboard() {
  const { userId, userName, bootstrapError } = useApp();
  const [records, setRecords] = useState<MedicalRecord[]>([]);
  const [consultations, setConsultations] = useState<Consultation[]>([]);
  const [medications, setMedications] = useState<Medication[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let cancelled = false;
    const load = async () => {
      try {
        const [recs, cons, meds] = await Promise.all([
          medicalApi.list(userId).catch(() => []),
          consultationApi.list(userId).catch(() => []),
          medicationApi.list(userId).catch(() => []),
        ]);
        if (cancelled) return;
        setRecords(recs);
        setConsultations(cons);
        setMedications(meds);
      } finally {
        if (!cancelled) setLoading(false);
      }
    };
    load();
    return () => {
      cancelled = true;
    };
  }, [userId]);

  const stats = [
    { title: 'Medical Records', count: records.length, desc: `${records.filter(r => r.status === 'analyzed').length} analyzed`, icon: '📄', color: '#dbeafe' },
    { title: 'Consultations', count: consultations.length, desc: consultations.length ? 'Doctor prep ready' : 'No consultations yet', icon: '💬', color: '#dcfce7' },
    { title: 'Medications', count: medications.length, desc: medications.length ? 'active medications' : 'No medications', icon: '💊', color: '#fef3c7' },
  ];

  return (
    <div>
      <h2 style={{ fontSize: '28px', fontWeight: 'bold', marginBottom: '8px', color: '#1e293b' }}>
        Welcome back, {userName}
      </h2>
      <p style={{ color: '#64748b', marginBottom: '32px' }}>Your AI Health Assistant</p>

      {bootstrapError && (
        <div style={{
          backgroundColor: '#fee2e2',
          color: '#991b1b',
          padding: '12px 16px',
          borderRadius: '8px',
          marginBottom: '24px',
          fontSize: '14px',
        }}>
          ⚠️ Backend connection failed: {bootstrapError}
          <div style={{ fontSize: '12px', marginTop: '4px', color: '#b91c1c' }}>
            {loading ? 'Loading...' : 'Please start the backend or verify the API URL in VITE_API_BASE_URL'}
          </div>
        </div>
      )}

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
        <div style={{
          backgroundColor: 'white',
          padding: '24px',
          borderRadius: '12px',
          boxShadow: '0 1px 3px rgba(0,0,0,0.1)',
          borderLeft: '4px solid #3b82f6',
        }}>
          <div style={{ fontSize: '32px', marginBottom: '12px' }}>🧠</div>
          <h4 style={{ fontSize: '16px', fontWeight: '600', marginBottom: '8px' }}>Medical Analysis Agent</h4>
          <p style={{ color: '#64748b', fontSize: '14px' }}>
            {records.length ? `Latest: ${records[0].title} (${records[0].status})` : 'Upload a record to begin'}
          </p>
        </div>

        <div style={{
          backgroundColor: 'white',
          padding: '24px',
          borderRadius: '12px',
          boxShadow: '0 1px 3px rgba(0,0,0,0.1)',
          borderLeft: '4px solid #10b981',
        }}>
          <div style={{ fontSize: '32px', marginBottom: '12px' }}>🩺</div>
          <h4 style={{ fontSize: '16px', fontWeight: '600', marginBottom: '8px' }}>Consultation Agent</h4>
          <p style={{ color: '#64748b', fontSize: '14px' }}>
            {consultations.length ? 'Questions prepared for doctor' : 'Describe symptoms to generate questions'}
          </p>
        </div>

        <div style={{
          backgroundColor: 'white',
          padding: '24px',
          borderRadius: '12px',
          boxShadow: '0 1px 3px rgba(0,0,0,0.1)',
          borderLeft: '4px solid #f59e0b',
        }}>
          <div style={{ fontSize: '32px', marginBottom: '12px' }}>💊</div>
          <h4 style={{ fontSize: '16px', fontWeight: '600', marginBottom: '8px' }}>Medication Agent</h4>
          <p style={{ color: '#64748b', fontSize: '14px' }}>
            {medications.length
              ? `Reminder: ${medications[0].reminder_time || 'scheduled'}`
              : 'Add medications to get reminders'}
          </p>
        </div>
      </div>
    </div>
  );
}
