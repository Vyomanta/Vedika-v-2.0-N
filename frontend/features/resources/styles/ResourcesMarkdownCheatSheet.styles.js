const styles = {
  s0: { position: 'relative', marginTop: 8, marginBottom: 8 },
  s1: { display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 12, padding: '80px 0', fontFamily: 'var(--font-outfit), sans-serif' },
  s2: { padding: 'clamp(14px, 3.5vw, 24px)', maxWidth: 1200, margin: '0 auto', boxSizing: 'border-box', fontFamily: 'var(--font-outfit), sans-serif' },
  s3: { display: 'flex', flexDirection: 'column', gap: 16, marginBottom: 32 },
  s4: { textAlign: 'center' },
  s5: { display: 'flex', flexWrap: 'wrap', justifyContent: 'center', gap: 8, marginTop: 12 },
  s6: { display: 'flex', flexDirection: 'column', gap: 32 },
  s7: {
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fit, minmax(min(280px, 100%), 1fr))',
              gap: 16
            },
  s8: { display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 12 },
  s9: { display: 'flex', flexDirection: 'column', gap: 6 }
};
export default styles;
