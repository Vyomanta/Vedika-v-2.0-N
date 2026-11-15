export const s0 = ({containerPadding}) => ({ padding: containerPadding, maxWidth: 900, margin: '0 auto', fontFamily: 'var(--font-outfit), sans-serif' });

export const s1 = ({T}) => ({
          display: 'flex', alignItems: 'center', gap: 6, background: 'none', border: 'none',
          color: T.muted, cursor: 'pointer', fontSize: 13, marginBottom: 20, padding: 0
        });

export const s2 = ({T}) => ({ fontSize: 11.5, color: T.purple, background: `${T.purple}15`, padding: '3px 10px', borderRadius: 20, fontWeight: 600 });

export const s3 = ({T}) => ({ color: T.text, fontSize: 24, fontWeight: 700, margin: '6px 0 4px 0', letterSpacing: '-0.03em' });

export const s4 = ({T}) => ({ color: T.muted, fontSize: 13.5, margin: 0 });

export const s5 = ({T}) => ({
              background: T.green, color: '#000', border: 'none', padding: '9px 16px',
              borderRadius: 8, fontSize: 13, fontWeight: 700, cursor: 'pointer',
              display: 'flex', alignItems: 'center', gap: 6, boxShadow: '0 4px 12px rgba(34, 197, 160, 0.15)'
            });

export const s6 = ({T}) => ({ display: 'flex', borderBottom: `1px solid ${T.border}`, marginBottom: 24 });

export const s7 = ({activeTab,T}) => ({
            background: 'none', border: 'none', color: activeTab === 'syllabus' ? T.accent : T.muted,
            padding: '10px 16px', fontSize: 13.5, fontWeight: 600, cursor: 'pointer',
            borderBottom: `2px solid ${activeTab === 'syllabus' ? T.accent : 'transparent'}`,
            transition: 'all 0.2s'
          });

export const s8 = ({T}) => ({ background: T.s1, border: `1px solid ${T.border}`, borderRadius: 14, padding: '48px 20px', textAlign: 'center' });

export const s9 = ({T}) => ({ color: T.text, fontSize: 16, fontWeight: 600, margin: '0 0 6px 0' });

export const s10 = ({T}) => ({ color: T.muted, fontSize: 13, maxWidth: 300, margin: '0 auto 20px' });

export const s11 = ({T}) => ({
                  background: T.purple, color: '#fff', border: 'none', padding: '8px 16px',
                  borderRadius: 8, fontSize: 12.5, fontWeight: 600, cursor: 'pointer'
                });

export const s12 = ({T}) => ({ background: T.s1, border: `1px solid ${T.border}`, borderRadius: 14, overflow: 'hidden' });

export const s13 = ({T}) => ({
                      padding: '14px 20px', background: T.s2, borderBottom: `1px solid ${T.border}`,
                      display: 'flex', alignItems: 'center', justifyContent: 'space-between'
                    });

export const s14 = ({T}) => ({ color: T.muted });

export const s15 = ({T}) => ({ fontSize: 12.5, fontWeight: 700, color: T.muted });

export const s16 = ({T}) => ({ color: T.text, fontSize: 14.5, fontWeight: 600, margin: '2px 0 0 0' });

export const s17 = ({T}) => ({
                            background: 'transparent', border: `1px solid ${T.border}`, color: T.text,
                            padding: '5px 10px', borderRadius: 6, fontSize: 11.5, fontWeight: 600, cursor: 'pointer',
                            display: 'flex', alignItems: 'center', gap: 4
                          });

export const s18 = ({T}) => ({ background: 'transparent', border: 'none', color: T.muted, cursor: 'pointer', padding: 4 });

export const s19 = ({T}) => ({ background: 'transparent', border: 'none', color: T.muted, cursor: 'pointer', padding: 4 });

export const s20 = ({T}) => ({ padding: '20px 24px', color: T.muted, fontSize: 12.5, textAlign: 'center' });

export const s21 = ({lIdx,chapter,T}) => ({
                                    display: 'flex', alignItems: 'center', justifyContent: 'space-between',
                                    padding: '12px 24px', borderBottom: lIdx < chapter.lessons.length - 1 ? `1px solid ${T.border}` : 'none'
                                  });

export const s22 = ({T}) => ({ width: 6, height: 6, borderRadius: '50%', background: T.accent });

export const s23 = ({T}) => ({ color: T.text, fontSize: 13.5, fontWeight: 500, margin: 0 });

export const s24 = ({T}) => ({ display: 'flex', gap: 8, marginTop: 2, fontSize: 11, color: T.muted });

export const s25 = ({T}) => ({ color: T.accent, fontWeight: 600 });

export const s26 = ({T}) => ({ color: T.green, fontWeight: 600 });

export const s27 = ({T}) => ({ background: 'transparent', border: 'none', color: T.muted, cursor: 'pointer', padding: 4 });

export const s28 = ({T}) => ({ background: 'transparent', border: 'none', color: T.muted, cursor: 'pointer', padding: 4 });

export const s29 = ({T}) => ({
                  width: '100%', padding: '12px', background: 'transparent', border: `1px dashed ${T.border}`,
                  borderRadius: 12, color: T.muted, fontSize: 13, fontWeight: 600, cursor: 'pointer',
                  display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 6, transition: 'all 0.2s'
                });

export const s30 = ({T}) => ({ background: T.s1, border: `1px solid ${T.border}`, borderRadius: 16, width: '100%', maxWidth: 460, padding: 24 });

export const s31 = ({T}) => ({ color: T.text, fontSize: 16, fontWeight: 700, margin: '0 0 16px 0' });

export const s32 = ({T}) => ({ color: T.text, fontSize: 12.5, fontWeight: 500 });

export const s33 = ({T}) => ({
                  width: '100%', background: T.s2, border: `1px solid ${T.border}`, borderRadius: 8,
                  padding: '10px 12px', color: T.text, fontSize: 13, fontFamily: 'inherit', outline: 'none'
                });

export const s34 = ({T}) => ({ color: T.text, fontSize: 12, fontWeight: 500 });

export const s35 = ({T}) => ({
                    width: '100%', background: T.s2, border: `1px solid ${T.border}`, borderRadius: 8,
                    padding: '8px 12px', color: T.text, fontSize: 13, outline: 'none'
                  });

export const s36 = ({T}) => ({ color: T.text, fontSize: 12, fontWeight: 500 });

export const s37 = ({T}) => ({
                    width: '100%', background: T.s2, border: `1px solid ${T.border}`, borderRadius: 8,
                    padding: '8px 12px', color: T.text, fontSize: 13, outline: 'none'
                  });

export const s38 = ({T}) => ({ color: T.text, fontSize: 12.5, fontWeight: 500 });

export const s39 = ({T}) => ({
                  width: '100%', background: T.s2, border: `1px solid ${T.border}`, borderRadius: 8,
                  padding: '10px 12px', color: T.text, fontSize: 13, fontFamily: 'inherit', outline: 'none', resize: 'vertical'
                });

export const s40 = ({T}) => ({ background: 'transparent', border: `1px solid ${T.border}`, color: T.text, padding: '8px 16px', borderRadius: 8, fontSize: 12.5, cursor: 'pointer' });

export const s41 = ({T}) => ({ background: T.purple, color: '#fff', border: 'none', padding: '8px 18px', borderRadius: 8, fontSize: 12.5, fontWeight: 600, cursor: 'pointer' });

export const s42 = ({T}) => ({ background: T.s1, border: `1px solid ${T.border}`, borderRadius: 16, width: '100%', maxWidth: 640, padding: 24, margin: 'auto' });

export const s43 = ({T}) => ({ color: T.text, fontSize: 16, fontWeight: 700, margin: '0 0 16px 0', display: 'flex', alignItems: 'center', gap: 8 });

export const s44 = ({T}) => ({ display: 'flex', borderBottom: `1px solid ${T.border}`, marginBottom: 16, gap: 4, overflowX: 'auto' });

export const s45 = ({activeLessonTab,tab,T}) => ({
                    background: 'transparent',
                    border: 'none',
                    borderBottom: activeLessonTab === tab.id ? `2px solid ${T.purple}` : 'none',
                    color: activeLessonTab === tab.id ? T.text : T.muted,
                    padding: '8px 12px',
                    fontSize: 12.5,
                    fontWeight: 600,
                    cursor: 'pointer',
                    outline: 'none',
                    whiteSpace: 'nowrap'
                  });

export const s46 = ({isMobile}) => ({ display: 'grid', gridTemplateColumns: isMobile ? '1fr' : '2fr 1fr', gap: 14, marginBottom: 14 });

export const s47 = ({T}) => ({ color: T.text, fontSize: 12, fontWeight: 500 });

export const s48 = ({T}) => ({
                        width: '100%', background: T.s2, border: `1px solid ${T.border}`, borderRadius: 8,
                        padding: '8px 12px', color: T.text, fontSize: 13, fontFamily: 'inherit', outline: 'none'
                      });

export const s49 = ({T}) => ({ color: T.text, fontSize: 12, fontWeight: 500 });

export const s50 = ({T}) => ({
                        width: '100%', background: T.s2, border: `1px solid ${T.border}`, borderRadius: 8,
                        padding: '8px 12px', color: T.text, fontSize: 13, fontFamily: 'inherit', outline: 'none'
                      });

export const s51 = ({T}) => ({ color: T.text, fontSize: 12, fontWeight: 500 });

export const s52 = ({T}) => ({
                      width: '100%', background: T.s2, border: `1px solid ${T.border}`, borderRadius: 8,
                      padding: '8px 12px', color: T.text, fontSize: 13, fontFamily: 'inherit', outline: 'none'
                    });

export const s53 = ({T}) => ({ color: T.text, fontSize: 12, fontWeight: 500 });

export const s54 = ({T}) => ({
                      width: '100%', background: T.s2, border: `1px solid ${T.border}`, borderRadius: 8,
                      padding: '8px 12px', color: T.text, fontSize: 13, fontFamily: 'inherit', outline: 'none'
                    });

export const s55 = ({T}) => ({ color: T.text, fontSize: 12, fontWeight: 500 });

export const s56 = ({T}) => ({
                      width: '100%', background: T.s2, border: `1px solid ${T.border}`, borderRadius: 8,
                      padding: '8px 12px', color: T.text, fontSize: 12.5, fontFamily: 'inherit', outline: 'none'
                    });

export const s57 = ({T}) => ({ color: T.text, fontSize: 12, fontWeight: 500 });

export const s58 = ({T}) => ({
                    width: '100%', background: T.s2, border: `1px solid ${T.border}`, borderRadius: 8,
                    padding: '10px 14px', color: T.text, fontSize: 13, fontFamily: 'inherit', outline: 'none', resize: 'vertical'
                  });

export const s59 = ({T}) => ({ color: T.text, fontSize: 13, fontWeight: 600, cursor: 'pointer' });

export const s60 = ({T}) => ({ display: 'flex', flexDirection: 'column', gap: 12, background: T.s2, border: `1px solid ${T.border}`, borderRadius: 10, padding: 16, maxHeight: 350, overflowY: 'auto' });

export const s61 = ({T}) => ({ color: T.text, fontSize: 12, fontWeight: 500 });

export const s62 = ({T}) => ({
                          width: '100%', background: T.s3, border: `1px solid ${T.border}`, borderRadius: 8,
                          padding: '8px 12px', color: T.text, fontSize: 13, outline: 'none'
                        });

export const s63 = ({T}) => ({ color: T.text, fontSize: 12, fontWeight: 500 });

export const s64 = ({T}) => ({
                          width: '100%', background: T.s3, border: `1px solid ${T.border}`, borderRadius: 8,
                          padding: '8px 12px', color: T.text, fontSize: 12.5, fontFamily: 'inherit', outline: 'none', resize: 'vertical'
                        });

export const s65 = ({T}) => ({ color: T.text, fontSize: 12, fontWeight: 500 });

export const s66 = ({T}) => ({
                          width: '100%', background: '#090D16', border: `1px solid ${T.border}`, borderRadius: 8,
                          padding: '8px 12px', color: '#5BF8A9', fontSize: 12.5, fontFamily: 'monospace', outline: 'none', resize: 'vertical'
                        });

export const s67 = ({T}) => ({ color: T.text, fontSize: 12, fontWeight: 500 });

export const s68 = ({T}) => ({
                          width: '100%', background: '#090D16', border: `1px solid ${T.border}`, borderRadius: 8,
                          padding: '8px 12px', color: '#5B8CF8', fontSize: 12.5, fontFamily: 'monospace', outline: 'none', resize: 'vertical'
                        });

export const s69 = ({T}) => ({ color: T.text, fontSize: 12, fontWeight: 500 });

export const s70 = ({T}) => ({
                          width: '100%', background: '#090D16', border: `1px solid ${T.border}`, borderRadius: 8,
                          padding: '8px 12px', color: '#F5A95B', fontSize: 12.5, fontFamily: 'monospace', outline: 'none', resize: 'vertical'
                        });

export const s71 = ({T}) => ({ borderTop: `1px solid ${T.border}`, pt: 14, marginTop: 4, marginBottom: 20 });

export const s72 = ({T}) => ({ fontSize: 13, fontWeight: 700, color: T.text, display: 'flex', alignItems: 'center', gap: 6 });

export const s73 = ({T}) => ({
                        background: 'transparent', border: `1px solid rgba(155, 110, 248, 0.3)`, color: T.purple,
                        padding: '4px 10px', borderRadius: 6, fontSize: 11.5, fontWeight: 600, cursor: 'pointer'
                      });

export const s74 = ({T}) => ({ background: T.s2, border: `1px solid rgba(155, 110, 248, 0.25)`, borderRadius: 10, padding: 14, marginBottom: 12 });

export const s75 = ({T}) => ({ fontSize: 12, fontWeight: 600, color: T.purple });

export const s76 = ({T}) => ({ background: 'transparent', border: 'none', color: T.muted, cursor: 'pointer' });

export const s77 = ({T}) => ({ width: '100%', background: T.s3, border: `1px solid ${T.border}`, borderRadius: 6, padding: '7px 10px', color: T.text, fontSize: 12.5, outline: 'none' });

export const s78 = ({T}) => ({ width: '100%', background: T.s3, border: `1px solid ${T.border}`, borderRadius: 6, padding: '6px 8px', color: T.text, fontSize: 12, outline: 'none' });

export const s79 = ({T}) => ({ width: '100%', background: T.s3, border: `1px solid ${T.border}`, borderRadius: 6, padding: '6px 8px', color: T.text, fontSize: 12, outline: 'none' });

export const s80 = ({T}) => ({ width: '100%', background: T.s3, border: `1px solid ${T.border}`, borderRadius: 6, padding: '6px 8px', color: T.text, fontSize: 12, outline: 'none' });

export const s81 = ({T}) => ({ width: '100%', background: T.s3, border: `1px solid ${T.border}`, borderRadius: 6, padding: '6px 8px', color: T.text, fontSize: 12, outline: 'none' });

export const s82 = ({T}) => ({ fontSize: 11.5, color: T.muted });

export const s83 = ({T}) => ({ background: T.s3, border: `1px solid ${T.border}`, color: T.text, borderRadius: 6, padding: '4px 8px', fontSize: 12, outline: 'none' });

export const s84 = ({T}) => ({
                              marginLeft: 'auto', background: T.purple, color: '#fff', border: 'none',
                              padding: '6px 12px', borderRadius: 6, fontSize: 11.5, fontWeight: 600, cursor: 'pointer'
                            });

export const s85 = ({T}) => ({ display: 'flex', justifyContent: 'space-between', alignItems: 'center', background: T.s2, border: `1px solid ${T.border}`, borderRadius: 8, padding: '8px 12px' });

export const s86 = ({T}) => ({ fontSize: 12.5, color: T.text });

export const s87 = ({T}) => ({ color: T.green, fontSize: 11, marginLeft: 8 });

export const s88 = ({T}) => ({ background: 'transparent', border: 'none', color: T.muted, cursor: 'pointer', padding: 4 });

export const s89 = ({T}) => ({ borderTop: `1px solid ${T.border}`, padding: '14px 0 0 0', marginTop: 16, display: 'flex', justifyContent: 'flex-end', gap: 10 });

export const s90 = ({T}) => ({ background: 'transparent', border: `1px solid ${T.border}`, color: T.text, padding: '8px 16px', borderRadius: 8, fontSize: 12.5, cursor: 'pointer' });

export const s91 = ({T}) => ({ background: T.purple, color: '#fff', border: 'none', padding: '8px 18px', borderRadius: 8, fontSize: 12.5, fontWeight: 600, cursor: 'pointer' });

export const s92 = ({T}) => ({
          position: 'fixed', bottom: 24, right: 24, background: T.green, color: '#000',
          padding: '12px 24px', borderRadius: 8, fontSize: 13.5, fontWeight: 700,
          boxShadow: '0 8px 24px rgba(34, 197, 160, 0.25)', zIndex: 10000,
          animation: 'card-enter 0.3s ease'
        });
