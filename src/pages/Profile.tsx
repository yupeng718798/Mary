export default function Profile() {
  return (
    <div>
      <h2 style={{ fontSize: '28px', fontWeight: 'bold', marginBottom: '24px', color: '#1e293b' }}>
        Profile
      </h2>

      <div style={{ backgroundColor: 'white', padding: '32px', borderRadius: '12px', maxWidth: '600px' }}>
        {[
          { label: 'Name', value: 'John Smith' },
          { label: 'Age', value: '32' },
          { label: 'Email', value: 'john@example.com' },
          { label: 'Emergency Contact', value: '+61 400 123 456' },
          { label: 'Medical Preference', value: 'General Practitioner' },
          { label: 'Language', value: 'English' },
        ].map((field) => (
          <div key={field.label} style={{ marginBottom: '20px' }}>
            <label style={{ display: 'block', marginBottom: '6px', fontSize: '14px', fontWeight: '500', color: '#64748b' }}>
              {field.label}
            </label>
            <input
              defaultValue={field.value}
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

        <button style={{
          padding: '12px 24px',
          backgroundColor: '#3b82f6',
          color: 'white',
          border: 'none',
          borderRadius: '8px',
          cursor: 'pointer',
          fontWeight: '600',
        }}>
          Save Changes
        </button>
      </div>
    </div>
  );
}
