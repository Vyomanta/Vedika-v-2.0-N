export const s0 = ({T}) => ({
          flex: 1, display: 'flex', flexDirection: 'column',
          alignItems: 'center', justifyContent: 'center', color: T.dim, gap: 8
        });

export const s1 = ({isStudent}) => ({
              display: 'flex', gap: 12, maxWidth: '80%',
              alignSelf: isStudent ? 'flex-end' : 'flex-start',
              flexDirection: isStudent ? 'row-reverse' : 'row'
            });

export const s2 = ({isStudent,T}) => ({
                width: 34, height: 34, borderRadius: '50%', flexShrink: 0,
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                background: isStudent ? T.s3 : T.purple,
                border: isStudent ? `1px solid ${T.border}` : 'none',
                marginTop: 2
              });

export const s3 = ({T}) => ({ color: T.muted });

export const s4 = ({isStudent,T}) => ({
                  fontSize: 10, fontWeight: 700, letterSpacing: '0.05em',
                  color: isStudent ? T.muted : T.purple,
                  textAlign: isStudent ? 'right' : 'left'
                });

export const s5 = ({isStudent,T}) => ({
                  display: 'inline-block', padding: '10px 14px',
                  borderRadius: isStudent ? '12px 12px 4px 12px' : '12px 12px 12px 4px',
                  background: isStudent ? T.s2 : T.s3,
                  border: isStudent ? `1px solid ${T.border}` : `1px solid ${T.border}`,
                  color: T.text, fontSize: 13, lineHeight: 1.6
                });

export const s6 = ({T}) => ({ fontSize: 10, color: T.dim });
