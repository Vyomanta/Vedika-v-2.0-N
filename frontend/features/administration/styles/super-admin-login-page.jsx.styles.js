export default {
s0:{
      minHeight: '100vh',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      background: 'radial-gradient(ellipse at 50% 20%, #1e1136 0%, #080c16 70%, #03060c 100%)',
      fontFamily: 'var(--font-outfit), "Segoe UI", sans-serif',
      color: '#F8FAFC',
      padding: '20px',
      position: 'relative',
      overflow: 'hidden'
    },
s1:{
        position: 'absolute',
        top: '10%',
        left: '20%',
        width: 380,
        height: 380,
        borderRadius: '50%',
        background: 'radial-gradient(circle, rgba(168, 85, 247, 0.15) 0%, transparent 70%)',
        filter: 'blur(60px)',
        pointerEvents: 'none'
      },
s2:{
        position: 'absolute',
        bottom: '10%',
        right: '20%',
        width: 320,
        height: 320,
        borderRadius: '50%',
        background: 'radial-gradient(circle, rgba(59, 130, 246, 0.12) 0%, transparent 70%)',
        filter: 'blur(50px)',
        pointerEvents: 'none'
      },
s3:{
        width: '100%',
        maxWidth: 440,
        background: 'rgba(15, 23, 42, 0.8)',
        backdropFilter: 'blur(24px)',
        WebkitBackdropFilter: 'blur(24px)',
        border: '1px solid rgba(168, 85, 247, 0.35)',
        borderRadius: 24,
        padding: '36px 32px',
        boxShadow: '0 24px 64px rgba(0, 0, 0, 0.6), 0 0 32px rgba(168, 85, 247, 0.15)',
        position: 'relative',
        zIndex: 1
      },
s4:{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 20 },
s5:{
            width: 44,
            height: 44,
            borderRadius: 14,
            background: 'linear-gradient(135deg, #A855F7 0%, #7C3AED 100%)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            boxShadow: '0 0 20px rgba(168, 85, 247, 0.4)'
          },
s6:{
              display: 'inline-flex',
              alignItems: 'center',
              gap: 5,
              fontSize: 10,
              fontWeight: 800,
              letterSpacing: '0.08em',
              color: '#C084FC',
              textTransform: 'uppercase',
              background: 'rgba(168, 85, 247, 0.15)',
              padding: '2px 8px',
              borderRadius: 6,
              marginBottom: 2
            },
s7:{ fontSize: 20, fontWeight: 800, margin: 0, color: '#fff', letterSpacing: '-0.02em' },
s8:{ fontSize: 13, color: '#94A3B8', margin: '0 0 24px', lineHeight: 1.5 },
s9:{
            display: 'flex',
            alignItems: 'center',
            gap: 10,
            padding: '12px 14px',
            borderRadius: 12,
            background: 'rgba(239, 68, 68, 0.12)',
            border: '1px solid rgba(239, 68, 68, 0.35)',
            color: '#FCA5A5',
            fontSize: 12.5,
            marginBottom: 20
          },
s10:{ flexShrink: 0 },
s11:{ display: 'flex', flexDirection: 'column', gap: 16 },
s12:{ display: 'block', fontSize: 11, fontWeight: 700, color: '#94A3B8', marginBottom: 6, letterSpacing: '0.04em' },
s13:{
              display: 'flex',
              alignItems: 'center',
              gap: 10,
              background: 'rgba(2, 6, 23, 0.6)',
              border: '1px solid rgba(255, 255, 255, 0.14)',
              borderRadius: 12,
              padding: '10px 14px'
            },
s14:{
                  flex: 1,
                  background: 'transparent',
                  border: 'none',
                  outline: 'none',
                  color: '#F8FAFC',
                  fontSize: 13.5,
                  fontFamily: 'inherit'
                },
s15:{ display: 'block', fontSize: 11, fontWeight: 700, color: '#94A3B8', marginBottom: 6, letterSpacing: '0.04em' },
s16:{
              display: 'flex',
              alignItems: 'center',
              gap: 10,
              background: 'rgba(2, 6, 23, 0.6)',
              border: '1px solid rgba(255, 255, 255, 0.14)',
              borderRadius: 12,
              padding: '10px 14px'
            },
s17:{
                  flex: 1,
                  background: 'transparent',
                  border: 'none',
                  outline: 'none',
                  color: '#F8FAFC',
                  fontSize: 13.5,
                  fontFamily: 'inherit'
                },
s18:{
                  background: 'none',
                  border: 'none',
                  color: '#64748B',
                  cursor: 'pointer',
                  fontSize: 11,
                  fontWeight: 600,
                  padding: 2
                },
s19:{ animation: 'spin 1s linear infinite' },
s20:{ marginTop: 24, textAlign: 'center' },
s21:{
              background: 'none',
              border: 'none',
              color: '#64748B',
              fontSize: 12,
              cursor: 'pointer',
              textDecoration: 'underline'
            }
};
