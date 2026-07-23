import { useState } from 'react';

export default function Consultation() {
  const [symptoms, setSymptoms] = useState('');
  const [questions, setQuestions] = useState<string[]>([]);

  const handleAnalyze = () => {
    if (symptoms.trim()) {
      setQuestions([
        'When did symptoms start?',
        'Any medication currently taken?',
        'Any known allergies?',
        'Rate pain level 1-10',
      ]);
    }
  };

  return (
    <div>
      <h2 style={{ fontSize: '28px', fontWeight: 'bold', marginBottom: '24px', color: '#1e293b' }}>
        Doctor Consultation
      </h2>

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
          Analyze Symptoms
        </button>
      </div>

      {questions.length > 0 && (
        <div style={{ backgroundColor: 'white', padding: '24px', borderRadius: '12px' }}>
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
              {i + 1}. {q}
            </div>
          ))}
          <button style={{
            marginTop: '16px',
            padding: '12px 24px',
            backgroundColor: '#10b981',
            color: 'white',
            border: 'none',
            borderRadius: '8px',
            cursor: 'pointer',
            fontWeight: '600',
          }}>
            Generate Doctor Notes
          </button>
        </div>
      )}
    </div>
  );
}
