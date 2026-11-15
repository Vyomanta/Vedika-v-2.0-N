export const s0 = ({containerPadding}) => ({
      padding: containerPadding,
      maxWidth: 1200,
      margin: '0 auto',
      fontFamily: 'var(--font-outfit), sans-serif'
    });

export const s1 = ({T,isMobile}) => ({ color: T.text, fontSize: isMobile ? 22 : 28, fontWeight: 700, margin: 0, letterSpacing: '-0.04em' });

export const s2 = ({T}) => ({ color: T.muted, fontSize: 13.5, margin: '4px 0 0' });

export const s3 = ({T}) => ({
            width: 32,
            height: 32,
            borderRadius: '50%',
            border: `2px solid ${T.border}`,
            borderTopColor: T.purple,
            animation: 'spin 1s linear infinite'
          });

export const s4 = ({isMobile}) => ({
            display: 'grid',
            gridTemplateColumns: isMobile ? '1fr' : 'repeat(4, 1fr)',
            gap: 16,
            marginBottom: 28
          });

export const s5 = ({T}) => ({
                background: T.s1,
                border: `1px solid ${T.border}`,
                borderRadius: 14,
                padding: 20,
                display: 'flex',
                alignItems: 'center',
                gap: 16
              });

export const s6 = ({color}) => ({
                  width: 48,
                  height: 48,
                  borderRadius: 12,
                  background: `${color}12`,
                  border: `1px solid ${color}20`,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center'
                });

export const s7 = ({T}) => ({ fontSize: 12, color: T.muted, fontWeight: 500 });

export const s8 = ({T}) => ({ fontSize: 24, fontWeight: 700, color: T.text, letterSpacing: '-0.03em', margin: '2px 0' });

export const s9 = ({T}) => ({ fontSize: 11, color: T.green });

export const s10 = ({isMobile}) => ({
            display: 'grid',
            gridTemplateColumns: isMobile ? '1fr' : '1.5fr 1fr',
            gap: 20,
            marginBottom: 28
          });

export const s11 = ({T}) => ({
              background: T.s1,
              border: `1px solid ${T.border}`,
              borderRadius: 14,
              padding: 20,
              display: 'flex',
              flexDirection: 'column'
            });

export const s12 = ({T}) => ({ margin: 0, color: T.text, fontSize: 14.5, fontWeight: 700 });

export const s13 = ({T}) => ({ margin: '2px 0 0 0', color: T.muted, fontSize: 11.5 });

export const s14 = ({T}) => ({ display: 'flex', alignItems: 'center', gap: 6, fontSize: 11.5, color: T.green, background: `${T.green}12`, padding: '4px 8px', borderRadius: 20 });

export const s15 = ({hoveredMonth,width,height,T}) => ({
                    position: 'absolute',
                    left: `${(hoveredMonth.x / width) * 100}%`,
                    top: `${(hoveredMonth.y / height) * 100 - 35}%`,
                    transform: 'translateX(-50%)',
                    background: T.s3,
                    border: `1px solid ${T.purple}40`,
                    padding: '4px 8px',
                    borderRadius: 6,
                    pointerEvents: 'none',
                    boxShadow: '0 4px 10px rgba(0,0,0,0.5)',
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                    zIndex: 10
                  });

export const s16 = ({T}) => ({ fontSize: 9.5, color: T.muted });

export const s17 = ({T}) => ({ fontSize: 11, fontWeight: 700, color: T.text });

export const s18 = ({T}) => ({
              background: T.s1,
              border: `1px solid ${T.border}`,
              borderRadius: 14,
              padding: 20,
              display: 'flex',
              flexDirection: 'column'
            });

export const s19 = ({T}) => ({ margin: '0 0 4px 0', color: T.text, fontSize: 14.5, fontWeight: 700 });

export const s20 = ({T}) => ({ margin: '0 0 16px 0', color: T.muted, fontSize: 11.5 });

export const s21 = ({isMobile}) => ({
                display: 'flex',
                flexDirection: isMobile ? 'column' : 'row',
                alignItems: 'center',
                justifyContent: 'center',
                gap: 20,
                flex: 1
              });

export const s22 = ({T}) => ({ fontSize: 10, color: T.muted, textTransform: 'uppercase' });

export const s23 = ({T}) => ({ fontSize: 16, fontWeight: 800, color: T.text, marginTop: 1 });

export const s24 = ({hoveredSegment,idx}) => ({
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'space-between',
                        padding: '6px 8px',
                        borderRadius: 6,
                        background: hoveredSegment === idx ? 'rgba(255,255,255,0.02)' : 'transparent',
                        cursor: 'pointer',
                        transition: 'all 0.15s'
                      });

export const s25 = ({cat}) => ({ width: 10, height: 10, borderRadius: '50%', background: cat.color });

export const s26 = ({hoveredSegment,idx,T}) => ({ fontSize: 12.5, color: hoveredSegment === idx ? T.text : T.muted });

export const s27 = ({T}) => ({ fontSize: 12, fontWeight: 700, color: T.text });

export const s28 = ({T}) => ({
            background: T.s1,
            border: `1px solid ${T.border}`,
            borderRadius: 14,
            padding: 20
          });

export const s29 = ({T}) => ({ margin: 0, color: T.text, fontSize: 14.5, fontWeight: 700 });

export const s30 = ({T}) => ({ margin: '2px 0 0 0', color: T.muted, fontSize: 11.5 });

export const s31 = ({T}) => ({ borderBottom: `1px solid ${T.border}`, color: T.muted, fontSize: 11, textTransform: 'uppercase', letterSpacing: '0.04em' });

export const s32 = ({idx,topCoursesList,T}) => ({
                      borderBottom: idx === topCoursesList.length - 1 ? 'none' : `1px solid ${T.border}`,
                      transition: 'background 0.2s',
                      ':hover': { background: 'rgba(255,255,255,0.01)' }
                    });

export const s33 = ({T}) => ({ padding: '14px', color: T.text, fontWeight: 600 });

export const s34 = ({T}) => ({ padding: '14px', color: T.muted });

export const s35 = ({T}) => ({ color: T.text, fontWeight: 500 });

export const s36 = ({T}) => ({ width: 60, height: 6, background: T.s3, borderRadius: 3, overflow: 'hidden' });

export const s37 = ({c,T}) => ({ width: c.rate, height: '100%', background: T.green });

export const s38 = ({T}) => ({ color: T.green, fontWeight: 600 });

export const s39 = ({T}) => ({ padding: '14px', textAlign: 'right', color: T.amber, fontWeight: 700 });

export const s40 = ({T}) => ({
            background: T.s1,
            border: `1px solid ${T.border}`,
            borderRadius: 14,
            padding: 20,
            marginTop: 28
          });

export const s41 = ({T}) => ({ margin: 0, color: T.text, fontSize: 14.5, fontWeight: 700 });

export const s42 = ({T}) => ({ margin: '2px 0 0 0', color: T.muted, fontSize: 11.5 });

export const s43 = ({T}) => ({ padding: '4px 10px', background: `${T.purple}12`, border: `1px solid ${T.purple}30`, borderRadius: 10, fontSize: 12 });

export const s44 = ({T}) => ({ color: T.muted });

export const s45 = ({T}) => ({ color: T.purple });

export const s46 = ({T}) => ({ padding: '4px 10px', background: `${T.green}12`, border: `1px solid ${T.green}30`, borderRadius: 10, fontSize: 12 });

export const s47 = ({T}) => ({ color: T.muted });

export const s48 = ({T}) => ({ color: T.green });

export const s49 = ({T}) => ({ textAlign: 'center', padding: '24px 0', color: T.muted, fontSize: 13 });

export const s50 = ({T}) => ({ borderBottom: `1px solid ${T.border}`, color: T.muted, fontSize: 11, textTransform: 'uppercase', letterSpacing: '0.04em' });

export const s51 = ({idx,consumptionUsers,T}) => ({
                        borderBottom: idx === consumptionUsers.length - 1 ? 'none' : `1px solid ${T.border}`,
                        transition: 'background 0.2s'
                      });

export const s52 = ({T}) => ({ padding: '14px', color: T.text, fontWeight: 600 });

export const s53 = ({T}) => ({ padding: '14px', color: T.text, fontWeight: 500 });

export const s54 = ({T}) => ({ padding: '14px', color: T.muted });

export const s55 = ({T}) => ({ color: T.text, fontWeight: 500 });

export const s56 = ({T}) => ({ padding: '14px', textAlign: 'right', color: T.green, fontWeight: 700 });
