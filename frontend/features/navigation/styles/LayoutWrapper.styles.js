const styles = {
  s0: {
        display: 'flex',
        width: '100vw',
        minWidth: '100vw',
        minHeight: '100vh',
        background: 'var(--bg)',
        alignItems: 'center',
        justifyContent: 'center',
        color: 'var(--text)',
        fontFamily: 'var(--font-outfit), sans-serif',
        position: 'fixed',
        top: 0,
        left: 0,
        zIndex: 9999
      },
  s1: { display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 12 },
  s2: {
            width: 32,
            height: 32,
            borderRadius: '50%',
            border: '2px solid var(--border)',
            borderTopColor: 'var(--accent)',
            animation: 'spin 1s linear infinite'
          },
  s3: { fontSize: 14, color: 'var(--muted)' },
  s4: { minHeight: '100vh', background: 'var(--bg)', color: 'var(--text)' },
  s5: { display: 'flex', minHeight: '100vh', background: 'var(--bg)', color: 'var(--text)', width: '100%' },
  s6: { flex: 1, overflowY: 'auto', maxHeight: '100vh' }
};
export default styles;
