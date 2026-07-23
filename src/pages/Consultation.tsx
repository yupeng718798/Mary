import { useEffect, useState } from 'react';
import { useApp } from '../context/AppContext';
import { consultationApi } from '../api/services';
import type { Consultation } from '../api/services';

export default function Consultation() {
  const { userId } = useApp();
  const [symptoms, setSymptoms] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [history, setHistory] = useState<Consultation[]>([]);
  const [current, setCurrent] = useState<Consultation | null>(null);

  useEffect(() => {
    let cancelled = false;
    const load = async () => {
      try {
        const list = await consultationApi.list(userId);
        if (!cancelled) setHistory(list);
      } catch {
        // ignore
      }
    };
    load();
    return () => {
      cancelled = true;
    };
  }, [userId]);

  const handleAnalyze = async () => {
    if (!symptoms.trim()) {
      setError('Please describe your symptoms first');
      return;
    }
    setLoading(true);
    setError(null);
    setCurrent(null);
    try {
      const result = await consultationApi.create(userId, symptoms);
      setCurrent(result);
      setHistory((prev) => [result, ...prev]);
    } catch (err: any) {
      setError(err?.response?.data?.detail || err?.message || 'Failed to analyze symptoms');
    } finally {
      setLoading(false);
    }
  };

  const questions = current?.ai_questions
    ? current.ai_questions
        .split('\n')
        .map((q) => q.trim())
        .filter((q) => q.length > 0)
    : [];

  return (
    <div>
      <h2 style={{ fontSize: '28px', fontWeight: 'bold', marginBottom: '24px', color: '#1e293b' }}>
        Doctor Consultation
      </h2>

      {error && (
        <div style={{ backgroundColor: '#fee2e2', color: '#991b1b', padding: '12px 16px', borderRadius: '8px', marginBottom: '16px' }}>
          {error}
        </div>
      )}

      <div style={{ backgroundColor: 'white', padding: '24px', borderRadius: '12px', marginBottom: '24px' }}>
        <label style={{ display: 'block', marginBottom: '8px', fontWeight: '600' }}>What symptoms do you have?</label>
        <textarea
          value={symptoms}
          onChange={(e) => setSymptoms(e.target.value)}
          placeholder="I have headache for three days..."
          style={{
            width: '100%',
            padding: '12px',
            border: '1px solid #d1d5db',
            borderRadius: '8px',
            minHeight: '100px',
            fontSize: '16px',
            boxSizing: 'border-box',
            marginBottom: '16px',
          }}
        />
        <button
          onClick={handleAnalyze}
          disabled={loading}
          style={{
            padding: '12px 24px',
            backgroundColor: loading ? '#93c5fd' : '#3b82f6',
            color: 'white',
            border: 'none',
            borderRadius: '8px',
            cursor: loading ? 'not-allowed' : 'pointer',
            fontWeight: '600',
          }}
        >
          {loading ? '🤖 Analyzing with AI...' : 'Analyze Symptoms'}
        </button>
      </div>

      {questions.length > 0 && (
        <div style={{ backgroundColor: 'white', padding: '24px', borderRadius: '12px', marginBottom: '24px' }}>
          <h3 style={{ fontSize: '18px', fontWeight: '600', marginBottom: '16px' }}>
            🧠 Mary AI Suggested Questions
          </h3>
          {questions.map((q, i) => (
            <div key={i} style={{
              padding: '12px 16px',
              backgroundColor: '#eff6ff',
              borderRadius: '8px',
              marginBottom: '8px',
              borderLeft: '3px solid #3b82f6',
            }}>
              {q}
            </div>
          ))}
          {current && (
            <p style={{ color: '#64748b', fontSize: '12px', marginTop: '12px' }}>
              Saved as consultation #{current.id.slice(0, 8)}...
            </p>
          )}
        </div>
      )}

      {history.length > 0 && (
        <div style={{ backgroundColor: 'white', padding: '24px', borderRadius: '12px' }}>
          <h3 style={{ fontSize: '18px', fontWeight: '600', marginBottom: '16px' }}>Previous Consultations</h3>
          {history.slice(0, 5).map((c) => (
            <div key={c.id} style={{
              padding: '12px 16px',
              backgroundColor: '#f8fafc',
              borderRadius: '8px',
              marginBottom: '8px',
              borderLeft: '3px solid #10b981',
            }}>
              <div style={{ fontSize: '14px', fontWeight: '600' }}>
                {c.symptoms.length > 80 ? c.symptoms.slice(0, 80) + '...' : c.symptoms}
              </div>
              <div style={{ fontSize: '12px', color: '#64748b', marginTop: '4px' }}>
                {c.status} · {c.created_at ? new Date(c.created_at).toLocaleString() : ''}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
