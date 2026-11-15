export const s0 = ({isMobile,isCollapsed,T}) => ({
      width: isMobile ? 260 : (isCollapsed ? 70 : 240), minHeight: isMobile ? '100%' : '100vh',
      background: T.s1, borderRight: `1px solid ${T.border}`,
      display: 'flex', flexDirection: 'column', flexShrink: 0, height: isMobile ? '100%' : undefined,
      position: 'relative', transition: 'width 0.2s ease'
    });

export const s1 = ({T}) => ({
            position: 'absolute',
            top: 24,
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
            boxShadow: '0 2px 8px rgba(0,0,0,0.12)',
            zIndex: 100,
            transition: 'all 0.2s'
          });

export const s2 = ({isCollapsed,isMobile,T}) => ({ padding: isCollapsed && !isMobile ? '18px 10px 14px' : '18px 16px 14px', borderBottom: `1px solid ${T.border}` });

export const s3 = ({isCollapsed,isMobile}) => ({ display: 'flex', alignItems: 'center', justifyContent: (isCollapsed && !isMobile) ? 'center' : 'space-between', marginBottom: 12 });

export const s4 = ({T}) => ({
            display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8,
            background: 'none', border: 'none', color: T.muted, cursor: 'pointer',
            fontSize: 12, padding: 0, fontFamily: 'inherit',
          });

export const s5 = ({T}) => ({ background: 'none', border: 'none', color: T.muted, cursor: 'pointer', padding: 4 });

export const s6 = ({isCollapsed,isMobile}) => ({ display: 'flex', alignItems: 'center', justifyContent: (isCollapsed && !isMobile) ? 'center' : 'flex-start', gap: 10 });

export const s7 = ({T}) => ({ width: 34, height: 34, borderRadius: 10, background: `${T.purple}22`, border: `1px solid ${T.purple}40`, display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 });

export const s8 = ({T}) => ({ color: T.text, fontWeight: 700, fontSize: 14, letterSpacing: '-0.02em' });

export const s9 = ({T}) => ({ color: T.muted, fontSize: 10 });

export const s10 = ({isCollapsed,isMobile}) => ({ flex: 1, padding: isCollapsed && !isMobile ? '12px 6px' : '12px 10px', overflowY: 'auto' });

export const s11 = ({T}) => ({ fontSize: 10, color: T.dim, fontWeight: 600, letterSpacing: '0.08em', textTransform: 'uppercase', padding: '0 6px', marginBottom: 6 });

export const s12 = ({isActive,T,isCollapsed,isMobile}) => ({
                      width: '100%',
                      padding: '8px 10px',
                      borderRadius: 8,
                      border: 'none',
                      background: isActive ? `${T.accent}15` : 'transparent',
                      color: isActive ? T.text : T.muted,
                      cursor: 'pointer',
                      fontSize: 12,
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: (isCollapsed && !isMobile) ? 'center' : 'flex-start',
                      gap: 8,
                      fontFamily: 'inherit',
                      transition: 'all 0.15s',
                    });

export const s13 = ({isVoice,T}) => ({ width: 20, height: 20, borderRadius: 6, background: isVoice ? `${T.accent}20` : `${T.purple}20`, display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 });

export const s14 = ({isActive}) => ({ overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap', fontWeight: isActive ? 600 : 400, flex: 1 });

export const s15 = ({T}) => ({ fontSize: 9, color: T.dim, flexShrink: 0 });

export const s16 = ({T}) => ({ color: T.dim, fontSize: 11, textAlign: 'center', padding: '24px 0' });

export const s17 = ({T,isCollapsed,isMobile}) => ({ padding: '12px 18px', borderTop: `1px solid ${T.border}`, display: 'flex', justifyContent: (isCollapsed && !isMobile) ? 'center' : 'flex-start' });

export const s18 = ({T}) => ({ width: 32, height: 32, display: 'flex', alignItems: 'center', justifyContent: 'center', borderRadius: 8, border: 'none', background: 'transparent', color: T.muted, cursor: 'pointer', fontFamily: 'inherit', transition: 'all 0.15s' });

export const s19 = ({mobileTopOffset,T}) => ({
            position: 'fixed', top: mobileTopOffset || 12, left: 12, zIndex: 999,
            width: 40, height: 40, borderRadius: 10,
            background: T.s2, border: `1px solid ${T.border}`,
            color: T.text, cursor: 'pointer', display: 'flex',
            alignItems: 'center', justifyContent: 'center',
          });
