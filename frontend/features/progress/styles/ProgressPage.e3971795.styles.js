export const s0 = ({isMobile}) => ({ padding: isMobile ? '20px 16px' : '32px 36px', maxWidth: 860, fontFamily: 'var(--font-outfit), sans-serif', margin: '0 auto', textAlign: 'center', minHeight: '80vh', display: 'flex', flexDirection: 'column', justifyContent: 'center' });

export const s1 = ({T}) => ({ color: T.text, fontSize: 22, fontWeight: 700, margin: '0 0 6px', letterSpacing: '-0.03em' });

export const s2 = ({T}) => ({ background: T.s2, border: `1px solid ${T.border}`, borderRadius: 16, padding: '48px 24px', marginTop: 24 });

export const s3 = ({T}) => ({ color: T.text, fontSize: 16, fontWeight: 600, margin: '0 0 6px 0' });

export const s4 = ({T}) => ({ color: T.muted, fontSize: 13.5, maxWidth: 360, margin: '0 auto 20px' });

export const s5 = ({T}) => ({ background: T.accent, color: '#faf7f7ff', border: 'none', padding: '10px 20px', borderRadius: 8, fontSize: 13, fontWeight: 700, cursor: 'pointer', display: 'inline-flex', alignItems: 'center', gap: 5, textDecoration: 'none' });

export const s6 = ({isMobile}) => ({ padding: isMobile ? '14px 12px 32px' : '32px 36px', maxWidth: 860, fontFamily: 'var(--font-outfit), sans-serif', margin: '0 auto', boxSizing: 'border-box' });

export const s7 = ({T}) => ({
            display: 'inline-flex',
            alignItems: 'center',
            gap: 6,
            padding: '6px 12px',
            borderRadius: 8,
            background: T.s2,
            border: `1px solid ${T.border}`,
            color: T.text,
            fontSize: 12.5,
            fontWeight: 600,
            cursor: 'pointer'
          });

export const s8 = ({T,isMobile}) => ({ color: T.text, fontSize: isMobile ? 20 : 22, fontWeight: 700, margin: 0, letterSpacing: '-0.03em' });

export const s9 = ({T,isMobile}) => ({ color: T.muted, margin: '0 0 18px', fontSize: isMobile ? 13 : 14 });

export const s10 = ({T}) => ({ color: T.accent, fontWeight: 600 });

export const s11 = ({T}) => ({ fontSize: 12.5, color: T.muted, fontWeight: 500 });

export const s12 = ({T,isMobile}) => ({
              background: T.s3,
              border: `1px solid ${T.border}`,
              color: T.text,
              padding: isMobile ? '7px 10px' : '8px 14px',
              borderRadius: 8,
              fontSize: 12.5,
              fontFamily: 'inherit',
              fontWeight: 600,
              cursor: 'pointer',
              outline: 'none',
              maxWidth: '100%',
              width: isMobile ? '100%' : 'auto',
              minWidth: isMobile ? '100%' : 200
            });

export const s13 = ({T}) => ({ background: T.s1 });

export const s14 = ({statCols,isMobile}) => ({ display: 'grid', gridTemplateColumns: statCols, gap: isMobile ? 8 : 12, marginBottom: 18 });

export const s15 = ({T,isMobile}) => ({ background: T.s2, border: `1px solid ${T.border}`, borderRadius: 12, padding: isMobile ? '12px 10px' : '16px' });

export const s16 = ({isMobile,T}) => ({ fontSize: isMobile ? 11 : 12, color: T.muted });

export const s17 = ({color}) => ({ width: 22, height: 22, borderRadius: 6, background: `${color}18`, display: 'flex', alignItems: 'center', justifyContent: 'center' });

export const s18 = ({isMobile,T}) => ({ fontSize: isMobile ? 20 : 24, fontWeight: 700, color: T.text, letterSpacing: '-0.04em' });

export const s19 = ({T}) => ({ fontSize: 10.5, color: T.muted, marginTop: 2 });

export const s20 = ({T,isMobile}) => ({ background: T.s2, border: `1px solid ${T.border}`, borderRadius: 12, padding: isMobile ? '14px 12px' : '20px', marginBottom: 16 });

export const s21 = ({T}) => ({ fontSize: 13, fontWeight: 600, color: T.text, marginBottom: 12, display: 'flex', alignItems: 'center', gap: 6 });

export const s22 = ({isMobile,T}) => ({ display: 'flex', justifyContent: 'space-between', alignItems: isMobile ? 'flex-start' : 'center', flexDirection: isMobile ? 'column' : 'row', gap: 6, background: T.s3, padding: isMobile ? '10px 10px' : '10px 14px', borderRadius: 8 });

export const s23 = ({T}) => ({ fontSize: 12, fontWeight: 600, color: T.text });

export const s24 = ({T}) => ({ fontSize: 11, color: T.muted, marginTop: 3 });

export const s25 = ({isMobile,sub,T}) => ({
                  fontSize: 10,
                  fontWeight: 700,
                  padding: '2px 8px',
                  borderRadius: 4,
                  alignSelf: isMobile ? 'flex-start' : 'auto',
                  background: sub.status === 'Pass' ? `${T.green}18` : sub.status === 'Fail' ? `${T.red}18` : `${T.amber}18`,
                  color: sub.status === 'Pass' ? T.green : sub.status === 'Fail' ? T.red : T.amber
                });

export const s26 = ({T,isMobile}) => ({ background: T.s2, border: `1px solid ${T.border}`, borderRadius: 12, padding: isMobile ? '14px 12px' : '20px', marginBottom: 16 });

export const s27 = ({T}) => ({ fontSize: 13, fontWeight: 600, color: T.text, marginBottom: 12 });

export const s28 = ({T}) => ({ fontSize: 12.5, color: T.text, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap', maxWidth: '75%' });

export const s29 = ({T}) => ({ fontSize: 11.5, color: T.muted, flexShrink: 0 });

export const s30 = ({T}) => ({ background: T.s3, borderRadius: 99, height: 6 });

export const s31 = ({mod,T,modPct}) => ({ background: mod.accent || T.accent, height: 6, borderRadius: 99, width: `${modPct}%`, transition: 'width 0.5s' });

export const s32 = ({T,isMobile}) => ({ background: T.s2, border: `1px solid ${T.border}`, borderRadius: 12, padding: isMobile ? '14px 12px' : '20px' });

export const s33 = ({T}) => ({ fontSize: 13, fontWeight: 600, color: T.text, marginBottom: 12 });

export const s34 = ({T}) => ({ fontSize: 12, color: T.muted, textAlign: 'center', padding: '10px 0' });

export const s35 = ({lessonCols}) => ({ display: 'grid', gridTemplateColumns: lessonCols, gap: 6 });

export const s36 = ({completed,l,T,isMobile}) => ({
                  background: completed[l.id] ? `${T.green}18` : T.s3,
                  border: `1px solid ${completed[l.id] ? T.green + '40' : T.border}`,
                  borderRadius: 7, padding: isMobile ? '6px 4px' : '8px', textAlign: 'center',
                  minWidth: 0,
                  overflow: 'hidden'
                });

export const s37 = ({completed,l,T}) => ({ fontSize: 9.5, color: completed[l.id] ? T.green : T.muted, lineHeight: 1.2, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' });
