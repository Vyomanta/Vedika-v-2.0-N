export const s0 = ({isMobile,inline,T}) => ({
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          padding: isMobile ? '0 10px' : '0 24px',
          height: isMobile ? 52 : 56,
          background: inline ? 'rgba(15, 23, 42, 0.85)' : T.s1,
          backdropFilter: 'blur(16px)',
          WebkitBackdropFilter: 'blur(16px)',
          borderBottom: `1px solid ${T.border}`,
          flexShrink: 0,
          zIndex: 10
        });

export const s1 = ({isMobile}) => ({ display: 'flex', alignItems: 'center', gap: isMobile ? 8 : 12 });

export const s2 = ({isMobile,T}) => ({ fontSize: isMobile ? 13.5 : 15, fontWeight: 700, color: T.text, margin: 0, display: 'flex', alignItems: 'center', gap: 6 });

export const s3 = ({connectionStatus,isActive,T}) => ({
                width: 7,
                height: 7,
                borderRadius: '50%',
                background: connectionStatus === 'tutor-speaking'
                  ? '#A855F7'
                  : isActive
                  ? T.green
                  : connectionStatus === 'connecting'
                  ? T.amber
                  : T.dim,
                boxShadow: isActive ? `0 0 8px ${connectionStatus === 'tutor-speaking' ? '#A855F7' : T.green}` : 'none',
                animation: connectionStatus === 'connecting' || connectionStatus === 'tutor-speaking' ? 'pulse 1.5s infinite' : 'none'
              });

export const s4 = ({isMobile,T,isActive}) => ({
                background: 'rgba(15, 23, 42, 0.8)',
                color: '#CBD5E1',
                fontSize: isMobile ? 10.5 : 11.5,
                fontWeight: 600,
                border: `1px solid ${T.border}`,
                borderRadius: 8,
                padding: '4px 6px',
                maxWidth: isMobile ? 85 : 'none',
                cursor: isActive ? 'not-allowed' : 'pointer',
                outline: 'none',
                fontFamily: 'inherit',
                opacity: isActive ? 0.6 : 1
              });

export const s5 = ({isMobile,T,isActive}) => ({
                background: 'rgba(15, 23, 42, 0.8)',
                color: '#CBD5E1',
                fontSize: isMobile ? 10.5 : 11.5,
                fontWeight: 600,
                border: `1px solid ${T.border}`,
                borderRadius: 8,
                padding: '4px 6px',
                maxWidth: isMobile ? 95 : 'none',
                cursor: isActive ? 'not-allowed' : 'pointer',
                outline: 'none',
                fontFamily: 'inherit',
                opacity: isActive ? 0.6 : 1
              });

export const s6 = ({isMobile,conversation,T,inline}) => ({
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          padding: isMobile ? '12px 14px 18px' : '18px 24px 24px',
          flex: conversation.length === 0 ? 1 : undefined,
          justifyContent: conversation.length === 0 ? 'center' : undefined,
          borderTop: conversation.length > 0 ? `1px solid ${T.border}` : 'none',
          background: inline ? 'rgba(10, 15, 28, 0.45)' : T.s1,
          backdropFilter: 'blur(20px)',
          WebkitBackdropFilter: 'blur(20px)'
        });

export const s7 = ({isMobile,isActive}) => ({
            fontSize: isMobile ? 12 : 13,
            color: isActive ? '#E2E8F0' : '#94A3B8',
            textAlign: 'center',
            margin: '0 0 12px',
            fontWeight: 500,
            maxWidth: 500,
            lineHeight: 1.5
          });

export const s8 = ({T}) => ({
              display: 'flex',
              alignItems: 'center',
              gap: 6,
              padding: '5px 14px',
              background: 'rgba(15, 23, 42, 0.75)',
              borderRadius: 20,
              marginBottom: 12,
              border: `1px solid ${T.border}`,
              boxShadow: '0 4px 12px rgba(0, 0, 0, 0.3)'
            });

export const s9 = ({isMobile}) => ({
            position: 'relative',
            width: isMobile ? 80 : 100,
            height: isMobile ? 80 : 100,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            marginBottom: 14
          });

export const s10 = ({connectionStatus,isActive}) => ({
              position: 'absolute',
              inset: -8,
              borderRadius: '50%',
              background: connectionStatus === 'tutor-speaking'
                ? 'radial-gradient(circle, rgba(168, 85, 247, 0.4) 0%, rgba(124, 58, 237, 0.1) 70%, transparent 100%)'
                : isActive
                ? 'radial-gradient(circle, rgba(16, 185, 129, 0.3) 0%, rgba(16, 185, 129, 0.05) 70%, transparent 100%)'
                : 'radial-gradient(circle, rgba(168, 85, 247, 0.15) 0%, transparent 70%)',
              border: isActive ? '1px solid rgba(168, 85, 247, 0.3)' : '1px solid rgba(255, 255, 255, 0.08)',
              animation: isActive ? 'pulse 2s infinite ease-in-out' : 'none',
              pointerEvents: 'none'
            });

export const s11 = ({isMuted,T}) => ({
                  width: 38,
                  height: 38,
                  borderRadius: '50%',
                  border: isMuted ? '1px solid rgba(239, 68, 68, 0.5)' : `1px solid ${T.border}`,
                  background: isMuted ? 'rgba(239, 68, 68, 0.15)' : 'rgba(255, 255, 255, 0.06)',
                  color: isMuted ? '#EF4444' : '#CBD5E1',
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  fontFamily: 'inherit',
                  transition: 'all 0.15s'
                });

export const s12 = ({isActive}) => ({
                padding: '9px 24px',
                borderRadius: 24,
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                gap: 8,
                fontFamily: 'inherit',
                fontWeight: 700,
                fontSize: 12,
                letterSpacing: '0.04em',
                transition: 'all 0.2s',
                background: isActive
                  ? 'rgba(239, 68, 68, 0.18)'
                  : 'linear-gradient(135deg, #A855F7 0%, #7C3AED 100%)',
                color: isActive ? '#F87171' : '#FFFFFF',
                border: isActive ? '1px solid rgba(239, 68, 68, 0.45)' : 'none',
                boxShadow: isActive ? 'none' : '0 4px 18px rgba(168, 85, 247, 0.35)'
              });

export const s13 = ({T}) => ({
                  width: 38,
                  height: 38,
                  borderRadius: '50%',
                  border: `1px solid ${T.border}`,
                  background: 'rgba(255, 255, 255, 0.06)',
                  color: '#94A3B8',
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  fontFamily: 'inherit',
                  transition: 'all 0.15s'
                });

export const s14 = ({isMobile}) => ({
              position: 'fixed',
              top: 0,
              left: isMobile ? 0 : 260,
              width: isMobile ? 200 : 400,
              height: isMobile ? 200 : 400,
              background: 'rgba(168, 85, 247, 0.08)',
              borderRadius: '50%',
              filter: 'blur(100px)',
              pointerEvents: 'none',
              transform: 'translate(-50%, -50%)',
              zIndex: -1
            });

export const s15 = ({isMobile}) => ({
              position: 'fixed',
              bottom: 0,
              right: 0,
              width: isMobile ? 150 : 300,
              height: isMobile ? 150 : 300,
              background: 'rgba(16, 185, 129, 0.05)',
              borderRadius: '50%',
              filter: 'blur(80px)',
              pointerEvents: 'none',
              transform: 'translate(30%, 30%)',
              zIndex: -1
            });
