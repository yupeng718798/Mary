import { useEffect, useState } from 'react';
import { useApp } from '../context/AppContext';
import { profileApi } from '../api/services';
import type { Profile as ProfileType } from '../api/services';

export default function Profile() {
  const { userId } = useApp();
  const [profile, setProfile] = useState<ProfileType | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let cancelled = false;
    const load = async () => {
      try {
        const data = await profileApi.get(userId);
        if (!cancelled) setProfile(data);
      } catch (err: any) {
        if (cancelled) return;
        setError(err?.response?.data?.detail || err?.message || 'Failed to load profile');
      } finally {
        if (!cancelled) setLoading(false);
      }
    };
    load();
    return () => {
      cancelled = true;
    };
  }, [userId]);

  const handleSave = async () => {
    if (!profile) return;
    setSaving(true);
    setError(null);
    try {
      const updated = await profileApi.update(userId, {
        full_name: profile.full_name,
        phone: profile.phone,
        emergency_contact: profile.emergency_contact,
        language: profile.language,
      });
      setProfile(updated);
    } catch (err: any) {
      setError(err?.response?.data?.detail || err?.message || 'Failed to save');
    } finally {
      setSaving(false);
    }
  };

  if (loading) return <div style={{ padding: '32px', color: '#64748b' }}>Loading profile...</div>;

  const fields: Array<{ label: string; key: keyof ProfileType; type?: string }> = [
    { label: 'Name', key: 'full_name' },
    { label: 'Phone', key: 'phone' },
    { label: 'Emergency Contact', key: 'emergency_contact' },
    { label: 'Language', key: 'language' },
  ];

  return (
    <div>
      <h2 style={{ fontSize: '28px', fontWeight: 'bold', marginBottom: '24px', color: '#1e293b' }}>
        Profile
      </h2>

      {error && (
        <div style={{ backgroundColor: '#fee2e2', color: '#991b1b', padding: '12px 16px', borderRadius: '8px', marginBottom: '16px' }}>
          {error}
        </div>
      )}

      <div style={{ backgroundColor: 'white', padding: '32px', borderRadius: '12px', maxWidth: '600px' }}>
        {fields.map((field) => (
          <div key={field.key as string} style={{ marginBottom: '20px' }}>
            <label style={{ display: 'block', marginBottom: '6px', fontSize: '14px', fontWeight: '500', color: '#64748b' }}>
              {field.label}
            </label>
            <input
              value={(profile?.[field.key] as string) ?? ''}
              onChange={(e) => setProfile({ ...profile!, [field.key]: e.target.value })}
              style={{
                width: '100%',
                padding: '12px',
                border: '1px solid #d1d5db',
                borderRadius: '8px',
                fontSize: '16px',
                boxSizing: 'border-box',
              }}
            />
          </div>
        ))}

        <button
          onClick={handleSave}
          disabled={saving}
          style={{
            padding: '12px 24px',
            backgroundColor: saving ? '#93c5fd' : '#3b82f6',
            color: 'white',
            border: 'none',
            borderRadius: '8px',
            cursor: saving ? 'not-allowed' : 'pointer',
            fontWeight: '600',
          }}
        >
          {saving ? 'Saving...' : 'Save Changes'}
        </button>
      </div>
    </div>
  );
}
