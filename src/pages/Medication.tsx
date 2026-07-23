import { useEffect, useState } from 'react';
import { useApp } from '../context/AppContext';
import { medicationApi, diaryApi } from '../api/services';
import type { Medication, SymptomDiary } from '../api/services';

const MOODS = ['😀', '😐', '😞'];

export default function Medication() {
  const { userId } = useApp();
  const [medications, setMedications] = useState<Medication[]>([]);
  const [diary, setDiary] = useState<SymptomDiary[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const [mood, setMood] = useState('');
  const [symptomText, setSymptomText] = useState('');
  const [severity, setSeverity] = useState(5);
  const [savingDiary, setSavingDiary] = useState(false);

  const [newName, setNewName] = useState('');
  const [newDosage, setNewDosage] = useState('');
  const [newFrequency, setNewFrequency] = useState('');
  const [newReminder, setNewReminder] = useState('');
  const [addingMed, setAddingMed] = useState(false);

  useEffect(() => {
    let cancelled = false;
    (async () => {
      try {
        const [meds, diaryEntries] = await Promise.all([
          medicationApi.list(userId).catch(() => []),
          diaryApi.list(userId).catch(() => []),
        ]);
        if (cancelled) return;
        setMedications(meds);
        setDiary(diaryEntries);
      } catch (err: any) {
        if (!cancelled) setError(err?.response?.data?.detail || err?.message || 'Failed to load data');
      } finally {
        if (!cancelled) setLoading(false);
      }
    })();
    return () => {
      cancelled = true;
    };
  }, [userId]);

  const handleAddMed = async () => {
    if (!newName.trim() || !newDosage.trim() || !newFrequency.trim()) {
      setError('Name, dosage, and frequency are required');
      return;
    }
    setAddingMed(true);
    setError(null);
    try {
      const reminderTime = newReminder || undefined;
      const newMed = await medicationApi.add({
        user_id: userId,
        medicine_name: newName,
        dosage: newDosage,
        frequency: newFrequency,
        reminder_time: reminderTime,
      });
      setMedications((prev) => [newMed, ...prev]);
      setNewName('');
      setNewDosage('');
      setNewFrequency('');
      setNewReminder('');
    } catch (err: any) {
      setError(err?.response?.data?.detail || err?.message || 'Failed to add medication');
    } finally {
      setAddingMed(false);
    }
  };

  const handleRemoveMed = async (id: string) => {
    try {
      await medicationApi.remove(id);
      setMedications((prev) => prev.filter((m) => m.id !== id));
    } catch (err: any) {
      setError(err?.response?.data?.detail || err?.message || 'Failed to remove medication');
    }
  };

  const handleSaveDiary = async () => {
    if (!symptomText.trim() || !mood) {
      setError('Describe your symptom and select a mood');
      return;
    }
    setSavingDiary(true);
    setError(null);
    try {
      const entry = await diaryApi.add({
        user_id: userId,
        symptom: symptomText,
        mood,
        severity,
      });
      setDiary((prev) => [entry, ...prev]);
      setSymptomText('');
      setSeverity(5);
      setMood('');
    } catch (err: any) {
      setError(err?.response?.data?.detail || err?.message || 'Failed to save diary');
    } finally {
      setSavingDiary(false);
    }
  };

  if (loading) return <div style={{ padding: '32px', color: '#64748b' }}>Loading...</div>;

  return (
    <div>
      <h2 style={{ fontSize: '28px', fontWeight: 'bold', marginBottom: '24px', color: '#1e293b' }}>
        Medication Management
      </h2>

      {error && (
        <div style={{ backgroundColor: '#fee2e2', color: '#991b1b', padding: '12px 16px', borderRadius: '8px', marginBottom: '16px' }}>
          {error}
        </div>
      )}

      <div style={{ backgroundColor: 'white', padding: '24px', borderRadius: '12px', marginBottom: '24px' }}>
        <h3 style={{ fontSize: '18px', fontWeight: '600', marginBottom: '16px' }}>Add Medication</h3>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '12px', marginBottom: '12px' }}>
          <input
            value={newName}
            onChange={(e) => setNewName(e.target.value)}
            placeholder="Name (e.g. Panadol)"
            style={{ padding: '10px', border: '1px solid #d1d5db', borderRadius: '8px', boxSizing: 'border-box' }}
          />
          <input
            value={newDosage}
            onChange={(e) => setNewDosage(e.target.value)}
            placeholder="Dosage (e.g. 500mg)"
            style={{ padding: '10px', border: '1px solid #d1d5db', borderRadius: '8px' }}
          />
          <input
            value={newFrequency}
            onChange={(e) => setNewFrequency(e.target.value)}
            placeholder="Frequency (e.g. Every 8 hours)"
            style={{ padding: '10px', border: '1px solid #d1d5db', borderRadius: '8px' }}
          />
          <input
            type="time"
            value={newReminder}
            onChange={(e) => setNewReminder(e.target.value)}
            style={{ padding: '10px', border: '1px solid #d1d5db', borderRadius: '8px' }}
          />
        </div>
        <button
          onClick={handleAddMed}
          disabled={addingMed}
          style={{
            padding: '10px 20px',
            backgroundColor: addingMed ? '#93c5fd' : '#3b82f6',
            color: 'white',
            border: 'none',
            borderRadius: '8px',
            cursor: addingMed ? 'not-allowed' : 'pointer',
            fontWeight: '600',
          }}
        >
          {addingMed ? 'Adding...' : '+ Add Medication'}
        </button>
      </div>

      <div style={{ backgroundColor: 'white', padding: '24px', borderRadius: '12px', marginBottom: '24px' }}>
        <h3 style={{ fontSize: '18px', fontWeight: '600', marginBottom: '16px' }}>Current Medication ({medications.length})</h3>
        {medications.length === 0 && (
          <p style={{ color: '#64748b' }}>No medications yet. Add one above.</p>
        )}
        {medications.map((med) => (
          <div key={med.id} style={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            padding: '16px',
            backgroundColor: '#f8fafc',
            borderRadius: '8px',
            marginBottom: '12px',
          }}>
            <div>
              <p style={{ fontWeight: '600' }}>{med.medicine_name}</p>
              <p style={{ color: '#64748b', fontSize: '14px' }}>{med.dosage} · {med.frequency}</p>
            </div>
            <div style={{ display: 'flex', gap: '8px', alignItems: 'center' }}>
              {med.reminder_time && (
                <div style={{
                  padding: '6px 12px',
                  backgroundColor: '#dbeafe',
                  color: '#1e40af',
                  borderRadius: '6px',
                  fontSize: '14px',
                  fontWeight: '500',
                }}>
                  ⏰ {med.reminder_time}
                </div>
              )}
              <button
                onClick={() => handleRemoveMed(med.id)}
                style={{
                  padding: '6px 12px',
                  backgroundColor: '#fee2e2',
                  color: '#991b1b',
                  border: 'none',
                  borderRadius: '6px',
                  cursor: 'pointer',
                  fontSize: '14px',
                }}
              >
                Remove
              </button>
            </div>
          </div>
        ))}
      </div>

      <div style={{ backgroundColor: 'white', padding: '24px', borderRadius: '12px' }}>
        <h3 style={{ fontSize: '18px', fontWeight: '600', marginBottom: '16px' }}>Symptom Diary</h3>
        <p style={{ color: '#64748b', marginBottom: '16px' }}>How do you feel today?</p>
        <textarea
          value={symptomText}
          onChange={(e) => setSymptomText(e.target.value)}
          placeholder="Describe your symptom..."
          style={{
            width: '100%',
            padding: '12px',
            border: '1px solid #d1d5db',
            borderRadius: '8px',
            minHeight: '80px',
            fontSize: '14px',
            boxSizing: 'border-box',
            marginBottom: '12px',
          }}
        />
        <div style={{ display: 'flex', gap: '16px', marginBottom: '16px', alignItems: 'center' }}>
          {MOODS.map((emoji) => (
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
          <div style={{ marginLeft: '16px' }}>
            <label style={{ fontSize: '14px', color: '#64748b', marginRight: '8px' }}>Severity: {severity}</label>
            <input
              type="range"
              min="1"
              max="10"
              value={severity}
              onChange={(e) => setSeverity(Number(e.target.value))}
            />
          </div>
        </div>
        <button
          onClick={handleSaveDiary}
          disabled={savingDiary}
          style={{
            padding: '10px 20px',
            backgroundColor: savingDiary ? '#93c5fd' : '#3b82f6',
            color: 'white',
            border: 'none',
            borderRadius: '8px',
            cursor: savingDiary ? 'not-allowed' : 'pointer',
            fontWeight: '600',
          }}
        >
          {savingDiary ? 'Saving...' : 'Save Entry'}
        </button>

        {diary.length > 0 && (
          <div style={{ marginTop: '24px' }}>
            <h4 style={{ fontSize: '16px', fontWeight: '600', marginBottom: '12px' }}>Recent Entries</h4>
            {diary.slice(0, 5).map((entry) => (
              <div key={entry.id} style={{
                padding: '10px 14px',
                backgroundColor: '#f8fafc',
                borderRadius: '8px',
                marginBottom: '6px',
                display: 'flex',
                justifyContent: 'space-between',
              }}>
                <span style={{ fontSize: '14px' }}>
                  {entry.mood} {entry.symptom}
                </span>
                <span style={{ fontSize: '12px', color: '#64748b' }}>
                  Severity: {entry.severity} · {entry.created_at ? new Date(entry.created_at).toLocaleString() : ''}
                </span>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
