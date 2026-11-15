const styles = {
  s0: { padding: 'clamp(14px, 3.5vw, 24px)', maxWidth: 1200, margin: '0 auto', boxSizing: 'border-box', fontFamily: 'var(--font-outfit), sans-serif' },
  s1: { display: 'flex', flexDirection: 'column', gap: 16, marginBottom: 32 },
  s2: { textAlign: 'center' },
  s3: {
        display: 'flex', flexWrap: 'wrap', gap: 16, marginBottom: 28, maxWidth: 800, marginLeft: 'auto', marginRight: 'auto'
      },
  s4: { position: 'relative', flex: 1, minWidth: 260 },
  s5: { position: 'absolute', left: 14, top: '50%', transform: 'translateY(-50%)' },
  s6: {
        display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(min(200px, 100%), 1fr))', gap: 16, marginBottom: 36
      },
  s7: { width: 40, height: 40, borderRadius: '50%', background: 'rgba(59, 130, 246, 0.12)', display: 'flex', alignItems: 'center', justifyCenter: 'center', color: '#3B82F6', flexShrink: 0, paddingLeft: 10 },
  s8: { width: 40, height: 40, borderRadius: '50%', background: 'rgba(16, 185, 129, 0.12)', display: 'flex', alignItems: 'center', justifyCenter: 'center', color: '#10B981', flexShrink: 0, paddingLeft: 10 },
  s9: { width: 40, height: 40, borderRadius: '50%', background: 'rgba(139, 92, 246, 0.12)', display: 'flex', alignItems: 'center', justifyCenter: 'center', color: '#8B5CF6', flexShrink: 0, paddingLeft: 10 },
  s10: { marginBottom: 40 },
  s11: {
              display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(min(260px, 100%), 1fr))', gap: 16
            },
  s12: { display: 'flex', flexWrap: 'wrap', gap: 6, marginTop: 12 },
  s13: {
              display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(min(260px, 100%), 1fr))', gap: 16
            },
  s14: { display: 'flex', flexWrap: 'wrap', gap: 6, marginTop: 12 }
};
export default styles;
