export default {
s0:{
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          height: '100%',
          minHeight: '60vh',
          padding: '32px 20px',
          textAlign: 'center',
          background: 'var(--bg)',
          color: 'var(--text)'
        },
s1:{
            background: 'var(--s1)',
            border: '1px solid var(--border)',
            borderRadius: 20,
            padding: '36px 28px',
            maxWidth: 480,
            boxShadow: '0 12px 40px rgba(0,0,0,0.25)'
          },
s2:{ fontSize: 36, marginBottom: 12 },
s3:{ fontSize: 18, fontWeight: 700, margin: '0 0 8px 0', color: 'var(--text)' },
s4:{ fontSize: 13, color: 'var(--muted)', margin: '0 0 20px 0', lineHeight: 1.6 },
s5:{ display: 'flex', gap: 10, justifyContent: 'center' },
s6:{
                  background: 'var(--accent)',
                  color: '#ffffff',
                  border: 'none',
                  padding: '10px 24px',
                  borderRadius: 10,
                  fontSize: 13,
                  fontWeight: 600,
                  cursor: 'pointer',
                  transition: 'opacity 0.2s'
                },
s7:{
                  background: 'var(--s2)',
                  color: 'var(--text)',
                  border: '1px solid var(--border)',
                  padding: '10px 20px',
                  borderRadius: 10,
                  fontSize: 13,
                  fontWeight: 600,
                  cursor: 'pointer'
                }
};
