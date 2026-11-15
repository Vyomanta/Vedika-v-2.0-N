export const s0 = ({isCollapsed,T}) => ({
      width: isCollapsed ? 70 : 220,
      height: '100vh',
      maxHeight: '100vh',
      background: T.s1,
      borderRight: `1px solid ${T.border}`,
      display: 'flex',
      flexDirection: 'column',
      padding: '14px 0',
      flexShrink: 0,
      position: 'relative',
      transition: 'width 0.2s ease',
      overflow: 'visible'
    });

export const s1 = ({T}) => ({
          position: 'absolute',
          top: 18,
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

export const s2 = ({isCollapsed,T}) => ({ padding: isCollapsed ? '0 0 10px' : '0 16px 14px', borderBottom: `1px solid ${T.border}`, marginBottom: 12, display: 'flex', flexDirection: 'column', alignItems: 'center', flexShrink: 0 });

export const s3 = ({isCollapsed}) => ({ display: 'flex', alignItems: 'center', justifyContent: isCollapsed ? 'center' : 'space-between', width: '100%' });

export const s4 = ({isCollapsed}) => ({ display: 'flex', alignItems: 'center', gap: 10, justifyContent: isCollapsed ? 'center' : 'flex-start', width: '100%' });

export const s5 = ({T}) => ({ width: 36, height: 36, borderRadius: 10, background: `${T.accent}22`, border: `1px solid ${T.accent}40`, display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 });

export const s6 = ({T}) => ({ color: T.text, fontWeight: 700, fontSize: 15, letterSpacing: '-0.02em' });

export const s7 = ({T}) => ({ color: T.muted, fontSize: 11 });

export const s8 = ({T}) => ({
                background: 'transparent',
                border: 'none',
                color: T.muted,
                cursor: 'pointer',
                padding: 6,
                display: 'flex',
                alignItems: 'center',
                borderRadius: 8,
                transition: 'all 0.2s',
                background: `${T.accent}12`,
                border: `1px solid ${T.border}`
              });

export const s9 = ({T}) => ({
              background: 'transparent',
              border: 'none',
              color: T.muted,
              cursor: 'pointer',
              padding: 6,
              display: 'flex',
              alignItems: 'center',
              borderRadius: 8,
              transition: 'all 0.2s',
              background: `${T.accent}12`,
              border: `1px solid ${T.border}`,
              marginTop: 10
            });

export const s10 = ({isCollapsed}) => ({ 
          flex: 1, 
          padding: '0 12px', 
          display: 'flex', 
          flexDirection: 'column', 
          alignItems: isCollapsed ? 'center' : 'stretch', 
          overflowY: 'auto',
          msOverflowStyle: 'none',
          scrollbarWidth: 'none'
        });

export const s11 = ({T}) => ({
                  width: 42,
                  height: 42,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  borderRadius: 9,
                  background: `${T.accent}18`,
                  border: `1px solid ${T.accent}30`,
                  color: T.accent,
                  cursor: 'pointer',
                  marginBottom: 10,
                  transition: 'all 0.2s',
                  flexShrink: 0,
                });

export const s12 = ({T,dropdownOpen}) => ({
                  width: '100%',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  padding: '10px 13px',
                  borderRadius: 9,
                  background: `${T.accent}12`,
                  border: `1px solid ${T.accent}30`,
                  color: T.accent,
                  cursor: 'pointer',
                  fontSize: 13.5,
                  fontWeight: 600,
                  letterSpacing: '-0.01em',
                  transition: 'all 0.2s',
                  fontFamily: 'inherit',
                  marginBottom: dropdownOpen ? 4 : 8,
                  flexShrink: 0,
                });

export const s13 = ({dropdownOpen}) => ({
                    transform: dropdownOpen ? 'rotate(180deg)' : 'rotate(0deg)',
                    transition: 'transform 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
                  });

export const s14 = ({dropdownOpen,T}) => ({
                maxHeight: dropdownOpen ? '420px' : '0px',
                opacity: dropdownOpen ? 1 : 0,
                overflow: 'hidden',
                transition: 'max-height 0.35s cubic-bezier(0.4, 0, 0.2, 1), opacity 0.25s ease, margin 0.35s cubic-bezier(0.4, 0, 0.2, 1)',
                display: 'flex',
                flexDirection: 'column',
                gap: 4,
                marginTop: dropdownOpen ? 4 : 0,
                marginBottom: dropdownOpen ? 12 : 0,
                paddingBottom: dropdownOpen ? 12 : 0,
                borderBottom: dropdownOpen ? `1px solid ${T.border}` : 'none',
                flexShrink: 0,
              });

export const s15 = ({active,T}) => ({
                        width: '100%',
                        display: 'flex',
                        alignItems: 'center',
                        gap: 11,
                        padding: '9px 13px',
                        borderRadius: 8,
                        background: active ? `${T.accent}12` : 'transparent',
                        border: 'none',
                        color: active ? T.accent : T.muted,
                        cursor: 'pointer',
                        fontSize: 13,
                        fontWeight: active ? 600 : 400,
                        textAlign: 'left',
                        fontFamily: 'inherit',
                        transition: 'all 0.15s',
                      });

export const s16 = ({T}) => ({
                    width: 32,
                    height: 32,
                    borderRadius: 8,
                    border: `1px dashed ${T.border}`,
                    background: 'transparent',
                    color: T.muted,
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    cursor: 'pointer',
                    transition: 'all 0.2s',
                  });

export const s17 = ({isActive,T}) => ({
                        width: 32,
                        height: 32,
                        borderRadius: 8,
                        border: 'none',
                        background: isActive ? `${T.accent}15` : 'transparent',
                        color: isActive ? T.text : T.muted,
                        cursor: 'pointer',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        transition: 'all 0.15s',
                      });

export const s18 = ({isVoice,T}) => ({
                        width: 20,
                        height: 20,
                        borderRadius: 6,
                        background: isVoice ? `${T.accent}20` : `${T.purple}20`,
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                      });

export const s19 = ({T}) => ({
                    width: '100%',
                    padding: '8px 12px',
                    borderRadius: 8,
                    border: `1px dashed ${T.border}`,
                    background: 'transparent',
                    color: T.muted,
                    fontSize: 12.5,
                    fontWeight: 500,
                    cursor: 'pointer',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    gap: 6,
                    marginTop: 8,
                    marginBottom: 16,
                    transition: 'all 0.2s',
                    fontFamily: 'inherit',
                    flexShrink: 0,
                  });

export const s20 = ({T}) => ({
                          fontSize: 9.5,
                          color: T.dim,
                          fontWeight: 700,
                          letterSpacing: '0.08em',
                          textTransform: 'uppercase',
                          padding: '0 6px',
                          marginBottom: 6,
                        });

export const s21 = ({isActive,T}) => ({
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
                                  gap: 8,
                                  textAlign: 'left',
                                  fontFamily: 'inherit',
                                  transition: 'all 0.15s',
                                });

export const s22 = ({isVoice,T}) => ({
                                  width: 20,
                                  height: 20,
                                  borderRadius: 6,
                                  background: isVoice ? `${T.accent}20` : `${T.purple}20`,
                                  display: 'flex',
                                  alignItems: 'center',
                                  justifyContent: 'center',
                                  flexShrink: 0,
                                });

export const s23 = ({isActive}) => ({
                                  overflow: 'hidden',
                                  textOverflow: 'ellipsis',
                                  whiteSpace: 'nowrap',
                                  fontWeight: isActive ? 600 : 400,
                                  flex: 1,
                                });

export const s24 = ({T}) => ({ fontSize: 9, color: T.dim, flexShrink: 0 });

export const s25 = ({T}) => ({ color: T.dim, fontSize: 11, textAlign: 'center', padding: '24px 0' });

export const s26 = ({isCollapsed,active,T}) => ({
                  width: isCollapsed ? 42 : '100%',
                  height: isCollapsed ? 42 : 'auto',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: isCollapsed ? 'center' : 'flex-start',
                  gap: isCollapsed ? 0 : 11,
                  padding: isCollapsed ? '0' : '10px 13px',
                  borderRadius: 9,
                  marginBottom: 3,
                  background: active ? `${T.accent}18` : 'transparent',
                  border: active ? `1px solid ${T.accent}30` : '1px solid transparent',
                  color: active ? T.accent : T.muted,
                  cursor: 'pointer',
                  fontSize: 13.5,
                  fontWeight: active ? 600 : 400,
                  letterSpacing: '-0.01em',
                  transition: 'all 0.15s',
                  fontFamily: 'inherit',
                  flexShrink: 0,
                });

export const s27 = ({T,isCollapsed}) => ({ padding: '14px 12px', borderTop: `1px solid ${T.border}`, display: 'flex', flexDirection: 'column', alignItems: isCollapsed ? 'center' : 'stretch', gap: 10, flexShrink: 0 });

export const s28 = ({isCollapsed}) => ({ display: 'flex', flexDirection: isCollapsed ? 'column' : 'row', alignItems: 'center', justifyContent: isCollapsed ? 'center' : 'space-between', width: '100%', gap: isCollapsed ? 12 : 9 });

export const s29 = ({isCollapsed}) => ({ display: 'flex', flexDirection: isCollapsed ? 'column' : 'row', alignItems: 'center', gap: isCollapsed ? 6 : 9 });

export const s30 = ({T}) => ({ width: 30, height: 30, borderRadius: '50%', background: `${T.purple}30`, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 12, color: T.purple, fontWeight: 700, flexShrink: 0 });

export const s31 = ({T}) => ({ color: T.text, fontSize: 13, fontWeight: 500 });

export const s32 = ({T}) => ({ color: T.muted, fontSize: 11 });

export const s33 = ({T}) => ({
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
