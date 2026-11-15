const styles = {
  s0: { padding: 'clamp(14px, 3.5vw, 24px)', maxWidth: 1200, margin: '0 auto', boxSizing: 'border-box', fontFamily: 'var(--font-outfit), sans-serif' },
  s1: { display: 'flex', flexDirection: 'column', gap: 16, marginBottom: 32 },
  s2: { textAlign: 'center' },
  s3: { display: 'flex', flexDirection: 'column', gap: 16, marginBottom: 24 },
  s4: { position: 'relative', width: '100%' },
  s5: { position: 'absolute', left: 16, top: '50%', transform: 'translateY(-50%)' },
  s6: {
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(min(170px, 100%), 1fr))',
          gap: 12,
          alignItems: 'center'
        },
  s7: { display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 12, padding: '80px 0' },
  s8: { marginBottom: 12 },
  s9: { marginBottom: 12 },
  s10: {
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fill, minmax(min(220px, 100%), 1fr))',
          gap: 20,
          marginBottom: 32
        },
  s11: { width: '100%', height: '100%', objectFit: 'cover' },
  s12: { padding: 14, display: 'flex', flexDirection: 'column', justifyContent: 'space-between', flex: 1 },
  s13: { display: 'flex', gap: 8 },
  s14: { display: 'flex', flexDirection: 'column', gap: 12, marginBottom: 32 },
  s15: {
                  width: 48, height: 64, borderRadius: 6, background: 'rgba(255,255,255,0.03)',
                  cursor: 'pointer', overflow: 'hidden', flexShrink: 0, display: 'flex', alignItems: 'center', justifyContent: 'center'
                },
  s16: { width: '100%', height: '100%', objectFit: 'cover' },
  s17: { flex: 1, minWidth: 0 },
  s18: { display: 'flex', gap: 8 },
  s19: { display: 'flex', justifyContent: 'center', alignItems: 'center', gap: 8 }
};
export default styles;
