export const s0 = ({T}) => ({
      position: 'fixed',
      top: 0,
      right: 0,
      bottom: 0,
      width: '100%',
      maxWidth: 440,
      background: T.s1 || '#0c0f1d',
      borderLeft: `1px solid ${T.border || 'rgba(255,255,255,0.08)'}`,
      boxShadow: '-10px 0 30px rgba(0,0,0,0.5)',
      display: 'flex',
      flexDirection: 'column',
      zIndex: 9999,
      fontFamily: 'var(--font-outfit), sans-serif'
    });

export const s1 = ({T}) => ({
        padding: '14px 18px',
        borderBottom: `1px solid ${T.border || 'rgba(255,255,255,0.08)'}`,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        background: T.s2 || '#13172b'
      });

export const s2 = ({T}) => ({
            width: 32,
            height: 32,
            borderRadius: 8,
            background: `${T.purple || '#7C3AED'}20`,
            border: `1px solid ${T.purple || '#7C3AED'}50`,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            color: T.purple || '#7C3AED'
          });

export const s3 = ({T}) => ({ color: T.text || '#fff', fontSize: 13, fontWeight: 700 });

export const s4 = ({T}) => ({ color: T.muted || '#8892b0', fontSize: 11 });

export const s5 = ({T}) => ({
              background: 'transparent',
              border: 'none',
              color: T.muted || '#8892b0',
              cursor: 'pointer',
              padding: 6,
              borderRadius: 6,
              display: 'flex'
            });

export const s6 = ({T}) => ({
          display: 'flex',
          borderBottom: `1px solid ${T.border || 'rgba(255,255,255,0.08)'}`,
          background: T.s1 || '#0c0f1d'
        });

export const s7 = ({activeSubTab,T}) => ({
              flex: 1,
              padding: '9px 12px',
              fontSize: 12,
              fontWeight: 600,
              background: activeSubTab === 'chat' ? (T.s2 || '#13172b') : 'transparent',
              color: activeSubTab === 'chat' ? (T.purple || '#7C3AED') : (T.muted || '#8892b0'),
              border: 'none',
              borderBottom: activeSubTab === 'chat' ? `2px solid ${T.purple || '#7C3AED'}` : '2px solid transparent',
              cursor: 'pointer'
            });

export const s8 = ({activeSubTab,T}) => ({
              flex: 1,
              padding: '9px 12px',
              fontSize: 12,
              fontWeight: 600,
              background: activeSubTab === 'viva' ? (T.s2 || '#13172b') : 'transparent',
              color: activeSubTab === 'viva' ? (T.purple || '#7C3AED') : (T.muted || '#8892b0'),
              border: 'none',
              borderBottom: activeSubTab === 'viva' ? `2px solid ${T.purple || '#7C3AED'}` : '2px solid transparent',
              cursor: 'pointer'
            });

export const s9 = ({T}) => ({ color: T.muted || '#8892b0', fontSize: 12, marginBottom: 4 });

export const s10 = ({T}) => ({
                background: T.s2 || '#13172b',
                border: `1px solid ${T.border || 'rgba(255,255,255,0.08)'}`,
                padding: '12px 14px',
                borderRadius: 8,
                cursor: 'pointer',
                transition: 'all 0.2s',
                display: 'flex',
                alignItems: 'flex-start',
                gap: 8
              });

export const s11 = ({T}) => ({ color: T.purple || '#7C3AED', fontWeight: 700, fontSize: 12 });

export const s12 = ({T}) => ({ flex: 1, color: T.text || '#fff', fontSize: 12.5, lineHeight: 1.4 });

export const s13 = ({msg,T}) => ({
                alignSelf: msg.sender === 'user' ? 'flex-end' : 'flex-start',
                maxWidth: '90%',
                background: msg.sender === 'user' ? (T.purple || '#7C3AED') : (T.s2 || '#13172b'),
                color: '#fff',
                padding: '12px 14px',
                borderRadius: 10,
                border: msg.sender === 'user' ? 'none' : `1px solid ${T.border || 'rgba(255,255,255,0.08)'}`
              });

export const s14 = ({T}) => ({ color: T.purple || '#7C3AED' });

export const s15 = ({T}) => ({
              alignSelf: 'flex-start',
              padding: '10px 14px',
              borderRadius: 8,
              background: T.s2 || '#13172b',
              border: `1px solid ${T.border || 'rgba(255,255,255,0.08)'}`,
              color: T.purple || '#7C3AED',
              fontSize: 12,
              display: 'flex',
              alignItems: 'center',
              gap: 8
            });

export const s16 = ({T}) => ({
          padding: 12,
          borderTop: `1px solid ${T.border || 'rgba(255,255,255,0.08)'}`,
          background: T.s2 || '#13172b',
          display: 'flex',
          gap: 8
        });

export const s17 = ({T}) => ({
            flex: 1,
            background: T.s1 || '#0c0f1d',
            border: `1px solid ${T.border || 'rgba(255,255,255,0.12)'}`,
            borderRadius: 8,
            padding: '9px 12px',
            color: T.text || '#fff',
            fontSize: 12.5,
            outline: 'none'
          });

export const s18 = ({query,isThinking,T}) => ({
            background: query.trim() && !isThinking ? (T.purple || '#7C3AED') : (T.s1 || '#1c223a'),
            color: '#fff',
            border: 'none',
            borderRadius: 8,
            padding: '0 14px',
            cursor: query.trim() && !isThinking ? 'pointer' : 'default',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            transition: 'all 0.2s'
          });
