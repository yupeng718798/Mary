import { useEffect, useState, type ChangeEvent, type FormEvent } from 'react';
import { useApp } from '../context/AppContext';
import { medicalApi } from '../api/services';
import type { MedicalRecord, MedicalAnalysis } from '../api/services';

export default function MedicalRecords() {
  const { userId } = useApp();
  const [records, setRecords] = useState<MedicalRecord[]>([]);
  const [analyses, setAnalyses] = useState<Record<string, MedicalAnalysis>>({});
  const [loading, setLoading] = useState(true);

  const [title, setTitle] = useState('');
  const [recordType, setRecordType] = useState('blood_test');
  const [file, setFile] = useState<File | null>(null);
  const [uploading, setUploading] = useState(false);
  const [analyzingId, setAnalyzingId] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let cancelled = false;
    (async () => {
      try {
        const recs = await medicalApi.list(userId);
        if (cancelled) return;
        setRecords(recs);
        const map: Record<string, MedicalAnalysis> = {};
        await Promise.all(
          recs.map(async (r) => {
            try {
              const list = await medicalApi.getAnalyses(r.id);
              if (list && list.length) map[r.id] = list[0];
            } catch {
              // ignore
            }
          })
        );
        if (cancelled) return;
        setAnalyses(map);
      } catch (err: any) {
        if (!cancelled) setError(err?.response?.data?.detail || err?.message || 'Failed to load records');
      } finally {
        if (!cancelled) setLoading(false);
      }
    })();
    return () => {
      cancelled = true;
    };
  }, [userId]);

  const handleFileChange = (e: ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      setFile(e.target.files[0]);
    }
  };

  const handleUpload = async (e: FormEvent) => {
    e.preventDefault();
    if (!title.trim()) {
      setError('Title is required');
      return;
    }
    setUploading(true);
    setError(null);
    try {
      const formData = new FormData();
      formData.append('user_id', userId);
      formData.append('title', title);
      formData.append('record_type', recordType);
      if (file) formData.append('file', file);

      const newRecord = await medicalApi.upload(formData);
      setRecords((prev) => [newRecord, ...prev]);
      setTitle('');
      setFile(null);
      (document.getElementById('file-input') as HTMLInputElement | null)?.value &&
        ((document.getElementById('file-input') as HTMLInputElement).value = '');
    } catch (err: any) {
      setError(err?.response?.data?.detail || err?.message || 'Upload failed');
    } finally {
      setUploading(false);
    }
  };

  const handleAnalyze = async (recordId: string) => {
    setAnalyzingId(recordId);
    setError(null);
    try {
      const analysis = await medicalApi.analyze(recordId);
      setAnalyses((prev) => ({ ...prev, [recordId]: analysis }));
      setRecords((prev) => prev.map((r) => (r.id === recordId ? { ...r, status: 'analyzed' } : r)));
    } catch (err: any) {
      setError(err?.response?.data?.detail || err?.message || 'Analyze failed');
    } finally {
      setAnalyzingId(null);
    }
  };

  if (loading) return <div style={{ padding: '32px', color: '#64748b' }}>Loading records...</div>;

  return (
    <div>
      <h2 style={{ fontSize: '28px', fontWeight: 'bold', marginBottom: '24px', color: '#1e293b' }}>
        Medical Records
      </h2>

      {error && (
        <div style={{ backgroundColor: '#fee2e2', color: '#991b1b', padding: '12px 16px', borderRadius: '8px', marginBottom: '16px' }}>
          {error}
        </div>
      )}

      <form onSubmit={handleUpload} style={{
        backgroundColor: 'white',
        padding: '32px',
        borderRadius: '12px',
        marginBottom: '24px',
        border: '2px dashed #d1d5db',
      }}>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '16px', marginBottom: '16px' }}>
          <div>
            <label style={{ display: 'block', marginBottom: '6px', fontSize: '14px', fontWeight: '500' }}>Title</label>
            <input
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="e.g. Blood Test 2026-07"
              style={{ width: '100%', padding: '10px', border: '1px solid #d1d5db', borderRadius: '8px', boxSizing: 'border-box' }}
            />
          </div>
          <div>
            <label style={{ display: 'block', marginBottom: '6px', fontSize: '14px', fontWeight: '500' }}>Type</label>
            <select
              value={recordType}
              onChange={(e) => setRecordType(e.target.value)}
              style={{ width: '100%', padding: '10px', border: '1px solid #d1d5db', borderRadius: '8px', boxSizing: 'border-box', backgroundColor: 'white' }}
            >
              <option value="blood_test">Blood Test</option>
              <option value="xray">X-Ray</option>
              <option value="physical">Physical Exam</option>
              <option value="report">General Report</option>
            </select>
          </div>
          <div>
            <label style={{ display: 'block', marginBottom: '6px', fontSize: '14px', fontWeight: '500' }}>File (optional)</label>
            <input
              id="file-input"
              type="file"
              onChange={handleFileChange}
              accept=".pdf,.txt,.jpg,.jpeg,.png"
              style={{ width: '100%', fontSize: '14px' }}
            />
          </div>
        </div>
        <button
          type="submit"
          disabled={uploading}
          style={{
            padding: '12px 24px',
            backgroundColor: uploading ? '#93c5fd' : '#3b82f6',
            color: 'white',
            border: 'none',
            borderRadius: '8px',
            cursor: uploading ? 'not-allowed' : 'pointer',
            fontWeight: '600',
          }}
        >
          {uploading ? 'Uploading...' : '+ Upload & Save'}
        </button>
      </form>

      <h3 style={{ fontSize: '20px', fontWeight: '600', marginBottom: '16px' }}>Recent Records ({records.length})</h3>

      {records.length === 0 && (
        <div style={{ backgroundColor: 'white', padding: '32px', borderRadius: '12px', color: '#64748b', textAlign: 'center' }}>
          No records yet. Upload your first medical record above.
        </div>
      )}

      {records.map((record) => {
        const analysis = analyses[record.id];
        return (
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
                backgroundColor: record.status === 'analyzed' ? '#dcfce7' : '#fef3c7',
                color: record.status === 'analyzed' ? '#166534' : '#92400e',
                borderRadius: '20px',
                fontSize: '12px',
                fontWeight: '600',
              }}>{record.status}</span>
            </div>
            <p style={{ color: '#64748b', fontSize: '14px', marginBottom: '8px' }}>
              {record.record_type} · {record.upload_date ? new Date(record.upload_date).toLocaleString() : ''}
            </p>

            {analysis ? (
              <div style={{
                backgroundColor: '#f8fafc',
                padding: '16px',
                borderRadius: '8px',
                marginBottom: '12px',
                borderLeft: '3px solid #3b82f6',
              }}>
                <p style={{ fontSize: '14px', color: '#374151', marginBottom: '4px' }}>
                  <strong>Risk Level:</strong>{' '}
                  <span style={{
                    color: analysis.risk_level === 'high' ? '#dc2626' : analysis.risk_level === 'medium' ? '#d97706' : '#16a34a',
                    fontWeight: '600',
                  }}>
                    {analysis.risk_level}
                  </span>
                </p>
                <p style={{ fontSize: '14px', color: '#374151', marginBottom: '4px' }}>
                  <strong>AI Summary:</strong> {analysis.summary}
                </p>
              </div>
            ) : (
              <button
                onClick={() => handleAnalyze(record.id)}
                disabled={analyzingId === record.id}
                style={{
                  padding: '8px 16px',
                  backgroundColor: analyzingId === record.id ? '#93c5fd' : '#3b82f6',
                  color: 'white',
                  border: 'none',
                  borderRadius: '6px',
                  cursor: analyzingId === record.id ? 'not-allowed' : 'pointer',
                  fontWeight: '500',
                  marginBottom: '12px',
                }}
              >
                {analyzingId === record.id ? 'Analyzing with AI...' : '🤖 Analyze with AI'}
              </button>
            )}
          </div>
        );
      })}
    </div>
  );
}
