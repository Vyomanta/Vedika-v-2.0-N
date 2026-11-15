export const s0 = ({T}) => ({
      background: T.s1,
      border: `1px solid ${T.border}`,
      borderRadius: 14,
      marginTop: 20,
      overflow: 'hidden',
      boxShadow: '0 4px 16px rgba(0,0,0,0.2)'
    });

export const s1 = ({T,isOpen}) => ({
          padding: '14px 20px',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          cursor: 'pointer',
          background: T.s2,
          borderBottom: isOpen ? `1px solid ${T.border}` : 'none'
        });

export const s2 = ({T}) => ({
            width: 28, height: 28, borderRadius: 6,
            background: `${T.purple}20`,
            border: `1px solid ${T.purple}40`,
            display: 'flex', alignItems: 'center', justifyContent: 'center'
          });

export const s3 = ({T}) => ({ color: T.text, fontSize: 14, fontWeight: 700, margin: 0 });

export const s4 = ({T}) => ({ fontSize: 11.5, color: T.muted });

export const s5 = ({T,explaining}) => ({
              background: T.purple,
              color: '#fff',
              border: 'none',
              padding: '6px 14px',
              borderRadius: 8,
              fontSize: 12,
              fontWeight: 600,
              cursor: explaining ? 'not-allowed' : 'pointer',
              display: 'flex',
              alignItems: 'center',
              gap: 6
            });

export const s6 = ({activeTab,T}) => ({
                background: activeTab === 'explain' ? `${T.purple}20` : 'transparent',
                border: `1px solid ${activeTab === 'explain' ? T.purple : T.border}`,
                color: activeTab === 'explain' ? T.purple : T.muted,
                padding: '6px 14px',
                borderRadius: 8,
                fontSize: 12,
                fontWeight: 600,
                cursor: 'pointer'
              });

export const s7 = ({activeTab,T}) => ({
                background: activeTab === 'chat' ? `${T.purple}20` : 'transparent',
                border: `1px solid ${activeTab === 'chat' ? T.purple : T.border}`,
                color: activeTab === 'chat' ? T.purple : T.muted,
                padding: '6px 14px',
                borderRadius: 8,
                fontSize: 12,
                fontWeight: 600,
                cursor: 'pointer'
              });

export const s8 = ({T}) => ({ display: 'flex', alignItems: 'center', gap: 8, fontSize: 12, color: T.purple, fontWeight: 700 });

export const s9 = ({T}) => ({
                    background: T.s2,
                    border: `1px solid ${T.border}`,
                    borderRadius: 10,
                    padding: 14
                  });

export const s10 = ({T}) => ({ color: T.text, fontSize: 13, fontWeight: 700, margin: '0 0 4px 0' });

export const s11 = ({T}) => ({ color: T.muted, fontSize: 13, lineHeight: 1.5, margin: 0 });

export const s12 = ({T}) => ({ color: T.text, fontSize: 13, fontWeight: 700, margin: '0 0 6px 0' });

export const s13 = ({T}) => ({ color: T.text, fontSize: 13, lineHeight: 1.6, margin: 0 });

export const s14 = ({T}) => ({ color: T.text, fontSize: 13, fontWeight: 700, margin: '0 0 6px 0' });

export const s15 = ({T}) => ({ margin: 0, paddingLeft: 18, color: T.muted, fontSize: 12.5, lineHeight: 1.6 });

export const s16 = ({T}) => ({ fontSize: 12, color: T.muted, fontStyle: 'italic', borderLeft: `2px solid ${T.purple}`, paddingLeft: 10 });

export const s17 = ({T}) => ({ textAlign: 'center', padding: '24px 0', color: T.muted, fontSize: 13 });

export const s18 = ({T}) => ({ textAlign: 'center', padding: '20px 0', color: T.muted, fontSize: 12.5 });

export const s19 = ({msg}) => ({
                        alignSelf: msg.role === 'user' ? 'flex-end' : 'flex-start',
                        background: msg.role === 'user' 
                          ? 'linear-gradient(135deg, #4F46E5 0%, #6366F1 25%, #7C3AED 55%, #9333EA 80%, #C026D3 100%)' 
                          : 'linear-gradient(135deg, rgba(10, 77, 74, 0.95) 0%, rgba(12, 80, 95, 0.95) 32%, rgba(16, 68, 107, 0.95) 68%, rgba(24, 40, 72, 0.95) 100%)',
                        color: '#F8FAFC',
                        border: msg.role === 'user' ? '1px solid rgba(255, 255, 255, 0.18)' : '1px solid rgba(56, 189, 248, 0.25)',
                        boxShadow: msg.role === 'user' ? '0 6px 20px -4px rgba(124, 58, 237, 0.3), 0 2px 6px rgba(0, 0, 0, 0.22)' : '0 10px 32px -4px rgba(0, 0, 0, 0.65), 0 0 20px rgba(12, 80, 95, 0.16), inset 0 1px 1px rgba(255, 255, 255, 0.12)',
                        padding: '8px 14px',
                        borderRadius: msg.role === 'user' ? '14px 14px 4px 14px' : '14px',
                        maxWidth: '85%',
                        fontSize: 12.5,
                        lineHeight: 1.5
                      });

export const s20 = ({T}) => ({ alignSelf: 'flex-start', color: T.muted, fontSize: 12, display: 'flex', alignItems: 'center', gap: 6 });

export const s21 = ({T}) => ({
                    flex: 1,
                    background: T.s2,
                    border: `1px solid ${T.border}`,
                    borderRadius: 8,
                    padding: '8px 12px',
                    color: T.text,
                    fontSize: 12.5,
                    outline: 'none'
                  });

export const s22 = ({T,chatQuestion,chatLoading}) => ({
                    background: T.purple,
                    color: '#fff',
                    border: 'none',
                    borderRadius: 8,
                    padding: '8px 16px',
                    fontSize: 12.5,
                    fontWeight: 600,
                    cursor: !chatQuestion.trim() || chatLoading ? 'not-allowed' : 'pointer',
                    display: 'flex',
                    alignItems: 'center',
                    gap: 4
                  });
