export const s0 = ({T}) => ({
        position: 'fixed', top: 0, left: 0, right: 0, height: 48,
        background: T.s1, borderBottom: `1px solid ${T.border}`,
        display: 'flex', alignItems: 'center', justifyContent: 'space-between',
        padding: '0 16px', zIndex: 100
      });

export const s1 = ({T}) => ({ width: 24, height: 24, borderRadius: 6, background: `${T.purple}22`, display: 'flex', alignItems: 'center', justifyContent: 'center' });

export const s2 = ({T}) => ({ color: T.text, fontWeight: 700, fontSize: 14 });

export const s3 = ({T}) => ({ background: 'transparent', border: 'none', color: T.muted, cursor: 'pointer', display: 'flex', alignItems: 'center' });

export const s4 = ({T}) => ({ background: 'transparent', border: 'none', color: T.muted, cursor: 'pointer', display: 'flex', alignItems: 'center' });

export const s5 = ({isCollapsed,T}) => ({
      width: isCollapsed ? 70 : 240, minHeight: '100vh', background: T.s1,
      borderRight: `1px solid ${T.border}`, display: 'flex',
      flexDirection: 'column', padding: '20px 0', flexShrink: 0,
      position: 'relative', transition: 'width 0.2s ease'
    });

export const s6 = ({T}) => ({
          position: 'absolute',
          top: 26,
          right: -12,
          width: 24,
          height: 24,
          borderRadius: '50%',
          background: T.s1,
          border: `1px solid ${T.border}`,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          cursor: 'pointer',
          color: T.muted,
          boxShadow: '0 2px 8px rgba(0,0,0,0.15)',
          zIndex: 100,
          transition: 'all 0.2s'
        });

export const s7 = ({isCollapsed,T}) => ({ padding: isCollapsed ? '0 0 12px' : '0 20px 16px', borderBottom: `1px solid ${T.border}`, marginBottom: 12, display: 'flex', flexDirection: 'column', alignItems: 'center' });

export const s8 = ({isCollapsed}) => ({ display: 'flex', alignItems: 'center', justifyContent: isCollapsed ? 'center' : 'space-between', width: '100%' });

export const s9 = ({isCollapsed}) => ({ display: 'flex', alignItems: 'center', gap: 10, justifyContent: isCollapsed ? 'center' : 'flex-start', width: '100%' });

export const s10 = ({T}) => ({ width: 36, height: 36, borderRadius: 10, background: `${T.purple}22`, border: `1px solid ${T.purple}40`, display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 });

export const s11 = ({T}) => ({ color: T.text, fontWeight: 700, fontSize: 15, letterSpacing: '-0.02em' });

export const s12 = ({T}) => ({ color: T.muted, fontSize: 11 });

export const s13 = ({T}) => ({
                background: 'transparent',
                border: 'none',
                color: T.muted,
                cursor: 'pointer',
                padding: 6,
                display: 'flex',
                alignItems: 'center',
                borderRadius: 8,
                transition: 'all 0.2s',
                background: `${T.purple}12`,
                border: `1px solid ${T.border}`
              });

export const s14 = ({T}) => ({
              background: 'transparent',
              border: 'none',
              color: T.muted,
              cursor: 'pointer',
              padding: 6,
              display: 'flex',
              alignItems: 'center',
              borderRadius: 8,
              transition: 'all 0.2s',
              background: `${T.purple}12`,
              border: `1px solid ${T.border}`,
              marginTop: 10
            });

export const s15 = ({isCollapsed}) => ({ padding: '0 12px', display: 'flex', flexDirection: 'column', alignItems: isCollapsed ? 'center' : 'stretch', gap: 2 });

export const s16 = ({isCollapsed,active,T,disabled}) => ({
                width: isCollapsed ? 42 : '100%',
                height: isCollapsed ? 42 : 'auto',
                display: 'flex',
                alignItems: 'center',
                justifyContent: isCollapsed ? 'center' : 'flex-start',
                gap: isCollapsed ? 0 : 11,
                padding: isCollapsed ? '0' : '9px 12px',
                borderRadius: 8,
                background: active ? `${T.purple}15` : 'transparent',
                border: 'none',
                color: active ? T.purple : disabled ? T.dim : T.muted,
                cursor: disabled ? 'not-allowed' : 'pointer',
                fontSize: 13,
                fontWeight: active ? 600 : 400,
                textAlign: 'left',
                transition: 'all 0.15s',
                fontFamily: 'inherit',
                opacity: disabled ? 0.6 : 1
              });

export const s17 = ({T}) => ({ fontSize: 9, background: T.s3, color: T.dim, padding: '1px 5px', borderRadius: 4, marginLeft: 'auto' });

export const s18 = ({T,isCollapsed}) => ({ padding: '14px 12px', borderTop: `1px solid ${T.border}`, display: 'flex', flexDirection: 'column', alignItems: isCollapsed ? 'center' : 'stretch', gap: 10 });

export const s19 = ({isCollapsed}) => ({ display: 'flex', flexDirection: isCollapsed ? 'column' : 'row', alignItems: 'center', justifyContent: isCollapsed ? 'center' : 'space-between', width: '100%', gap: isCollapsed ? 12 : 9 });

export const s20 = ({isCollapsed}) => ({ display: 'flex', flexDirection: isCollapsed ? 'column' : 'row', alignItems: 'center', gap: isCollapsed ? 6 : 9 });

export const s21 = ({T}) => ({
              width: 30, height: 30, borderRadius: '50%', background: `${T.purple}30`,
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              fontSize: 12, color: T.purple, fontWeight: 700, flexShrink: 0
            });

export const s22 = ({T}) => ({ color: T.text, fontSize: 13, fontWeight: 500 });

export const s23 = ({T}) => ({ color: T.muted, fontSize: 11 });

export const s24 = ({T}) => ({
              background: 'transparent',
              border: 'none',
              color: T.muted,
              cursor: 'pointer',
              padding: 4,
              display: 'flex',
              alignItems: 'center',
              borderRadius: 4,
              transition: 'all 0.2s',
            });

export const s25 = ({T}) => ({ padding: '12px 18px 0', borderTop: `1px solid ${T.border}`, display: 'flex', justifyContent: 'space-between', alignItems: 'center' });

export const s26 = ({T}) => ({
              background: 'transparent', border: 'none', color: T.muted, display: 'flex',
              alignItems: 'center', gap: 8, fontSize: 12, cursor: 'pointer', padding: 0
            });

export const s27 = ({T}) => ({ color: T.dim, fontSize: 10 });

export const s28 = ({T}) => ({ padding: '12px 0 0', borderTop: `1px solid ${T.border}`, display: 'flex', justifyContent: 'center' });

export const s29 = ({T}) => ({
              background: 'transparent', border: 'none', color: T.muted, display: 'flex',
              alignItems: 'center', cursor: 'pointer', padding: 4
            });
