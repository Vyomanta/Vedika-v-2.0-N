const styles = {
  s0: { padding: 'clamp(14px, 3.5vw, 24px)', maxWidth: 900, margin: '0 auto', boxSizing: 'border-box', fontFamily: 'var(--font-outfit), sans-serif' },
  s1: { display: 'flex', flexDirection: 'column', gap: 16, marginBottom: 36 },
  s2: { textAlign: 'center' },
  s3: {
        display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(min(270px, 100%), 1fr))', gap: 'clamp(16px, 3vw, 24px)'
      },
  s4: { position: 'absolute', inset: 0, background: 'rgba(0,0,0,0.15)', backdropFilter: 'blur(1px)' },
  s5: { position: 'relative', zIndex: 1, display: 'flex', flexDirection: 'column', gap: 12 },
  s6: {
                width: 48, height: 48, borderRadius: '50%', background: 'rgba(255, 255, 255, 0.15)',
                display: 'flex', alignItems: 'center', justifyContent: 'center'
              },
  s7: { color: '#fff', fontSize: 22, fontWeight: 700, margin: 0, letterSpacing: '-0.02em' },
  s8: { color: 'rgba(255, 255, 255, 0.85)', fontSize: 13.5, margin: 0, lineHeight: 1.4 },
  s9: {
              position: 'relative', zIndex: 1, display: 'inline-flex', alignItems: 'center', gap: 8,
              color: '#000', fontSize: 13.5, fontWeight: 700, background: '#fff', padding: '8px 16px',
              borderRadius: 8, marginTop: 16, width: 'fit-content'
            }
};
export default styles;
