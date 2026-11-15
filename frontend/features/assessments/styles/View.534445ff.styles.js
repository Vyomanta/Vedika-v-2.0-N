export const s0 = ({containerPadding}) => ({
      padding: containerPadding,
      maxWidth: 1200,
      margin: '0 auto',
      fontFamily: 'var(--font-outfit), sans-serif'
    });

export const s1 = ({isMobile}) => ({
        display: 'flex',
        flexDirection: isMobile ? 'column' : 'row',
        justifyContent: 'space-between',
        alignItems: isMobile ? 'flex-start' : 'center',
        gap: 16,
        marginBottom: 24
      });

export const s2 = ({T,isMobile}) => ({ color: T.text, fontSize: isMobile ? 22 : 28, fontWeight: 700, margin: 0, letterSpacing: '-0.04em' });

export const s3 = ({T}) => ({ color: T.muted, fontSize: 13.5, margin: '4px 0 0' });

export const s4 = ({T}) => ({
            background: T.purple,
            color: '#fff',
            border: 'none',
            padding: '9px 16px',
            borderRadius: 8,
            fontSize: 13,
            fontWeight: 600,
            cursor: 'pointer',
            display: 'flex',
            alignItems: 'center',
            gap: 6,
            boxShadow: '0 4px 12px rgba(155, 110, 248, 0.2)'
          });

export const s5 = ({T}) => ({
        display: 'flex',
        borderBottom: `1px solid ${T.border}`,
        gap: 20,
        marginBottom: 20
      });

export const s6 = ({activeTab,T}) => ({
            background: 'none',
            border: 'none',
            borderBottom: `2px solid ${activeTab === 'list' ? T.purple : 'transparent'}`,
            color: activeTab === 'list' ? T.text : T.muted,
            padding: '10px 4px',
            fontSize: 14,
            fontWeight: activeTab === 'list' ? 600 : 400,
            cursor: 'pointer',
            transition: 'all 0.2s'
          });

export const s7 = ({activeTab,T}) => ({
            background: 'none',
            border: 'none',
            borderBottom: `2px solid ${activeTab === 'submissions' ? T.purple : 'transparent'}`,
            color: activeTab === 'submissions' ? T.text : T.muted,
            padding: '10px 4px',
            fontSize: 14,
            fontWeight: activeTab === 'submissions' ? 600 : 400,
            cursor: 'pointer',
            transition: 'all 0.2s',
            display: 'flex',
            alignItems: 'center',
            gap: 8
          });

export const s8 = ({T}) => ({
              background: T.purple,
              color: '#fff',
              fontSize: 10,
              padding: '1px 6px',
              borderRadius: 10,
              fontWeight: 700
            });

export const s9 = ({T}) => ({
              marginLeft: 'auto',
              background: 'rgba(155, 110, 248, 0.1)',
              border: `1px solid ${T.purple}40`,
              color: T.purple,
              padding: '4px 12px',
              borderRadius: 6,
              fontSize: 12,
              fontWeight: 600,
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              gap: 6
            });

export const s10 = ({T}) => ({
            width: 32,
            height: 32,
            borderRadius: '50%',
            border: '2px solid rgba(155, 110, 248, 0.2)',
            borderTopColor: T.purple,
            animation: 'spin 1s linear infinite'
          });

export const s11 = ({T}) => ({
            background: T.s1,
            border: `1px solid ${T.border}`,
            borderRadius: 14,
            padding: '64px 20px',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            textAlign: 'center',
            minHeight: 280
          });

export const s12 = ({T}) => ({ color: T.text, fontSize: 16, margin: '0 0 6px 0' });

export const s13 = ({T}) => ({ color: T.muted, fontSize: 13, maxWidth: 300, margin: '0 0 16px 0' });

export const s14 = ({T}) => ({
                background: T.purple,
                color: '#fff',
                border: 'none',
                padding: '9px 16px',
                borderRadius: 8,
                fontSize: 12.5,
                fontWeight: 600,
                cursor: 'pointer'
              });

export const s15 = ({selectedCategory,cat,T}) => ({
                    background: selectedCategory === cat ? T.purple : T.s2,
                    color: selectedCategory === cat ? '#fff' : T.text,
                    border: selectedCategory === cat ? `1px solid ${T.purple}` : `1px solid ${T.border}`,
                    padding: '6px 14px',
                    borderRadius: 20,
                    fontSize: 12,
                    fontWeight: 600,
                    cursor: 'pointer',
                    whiteSpace: 'nowrap',
                    transition: 'all 0.15s'
                  });

export const s16 = ({T}) => ({
              display: 'flex',
              flexWrap: 'wrap',
              alignItems: 'center',
              justifyContent: 'space-between',
              gap: 12,
              marginBottom: 20,
              padding: '12px 16px',
              background: T.s1,
              border: `1px solid ${T.border}`,
              borderRadius: 10
            });

export const s17 = ({T}) => ({ fontSize: 13, fontWeight: 600, color: T.text });

export const s18 = ({T}) => ({
                    background: T.s2,
                    border: `1px solid ${T.border}`,
                    borderRadius: 6,
                    color: T.text,
                    fontSize: 12.5,
                    padding: '6px 10px',
                    outline: 'none'
                  });

export const s19 = ({T}) => ({
                    background: T.s2,
                    border: `1px solid ${T.border}`,
                    borderRadius: 6,
                    color: T.text,
                    fontSize: 12.5,
                    padding: '6px 10px',
                    outline: 'none'
                  });

export const s20 = ({T}) => ({
                      background: 'none',
                      border: 'none',
                      color: T.purple,
                      fontSize: 12,
                      cursor: 'pointer',
                      padding: '4px 6px',
                      textDecoration: 'underline'
                    });

export const s21 = ({T}) => ({
                background: T.s1,
                border: `1px solid ${T.border}`,
                borderRadius: 14,
                padding: '40px 20px',
                textAlign: 'center'
              });

export const s22 = ({T}) => ({ color: T.text, fontSize: 14, margin: '0 0 6px' });

export const s23 = ({T}) => ({ color: T.muted, fontSize: 12.5, margin: 0 });

export const s24 = ({isMobile}) => ({ display: 'grid', gridTemplateColumns: isMobile ? '1fr' : 'repeat(auto-fill, minmax(360px, 1fr))', gap: 20 });

export const s25 = ({T}) => ({
                      background: T.s1,
                      border: `1px solid ${T.border}`,
                      borderRadius: 12,
                      padding: 20,
                      display: 'flex',
                      flexDirection: 'column',
                      justifyContent: 'space-between'
                    });

export const s26 = ({T}) => ({ color: T.text, fontSize: 15.5, fontWeight: 700, margin: 0, lineHeight: 1.3 });

export const s27 = ({T}) => ({ background: 'transparent', border: 'none', cursor: 'pointer', color: T.muted, padding: 3, borderRadius: 4 });

export const s28 = ({T}) => ({ background: 'transparent', border: 'none', cursor: 'pointer', color: T.muted, padding: 3, borderRadius: 4 });

export const s29 = ({T}) => ({
                            fontSize: 9.5,
                            background: `${T.accent}14`,
                            border: `1px solid ${T.accent}30`,
                            color: T.accent,
                            padding: '3px 8px',
                            borderRadius: 4,
                            fontWeight: 700,
                            whiteSpace: 'nowrap',
                            display: 'inline-block'
                          });

export const s30 = ({T}) => ({
                            fontSize: 9.5,
                            background: `${T.purple}15`,
                            border: `1px solid ${T.purple}25`,
                            color: T.purple,
                            padding: '3px 8px',
                            borderRadius: 4,
                            maxWidth: 160,
                            overflow: 'hidden',
                            textOverflow: 'ellipsis',
                            whiteSpace: 'nowrap',
                            display: 'inline-block'
                          });

export const s31 = ({T}) => ({ fontSize: 9.5, background: `${T.accent}15`, border: `1px solid ${T.accent}25`, color: T.accent, padding: '3px 8px', borderRadius: 4, whiteSpace: 'nowrap' });

export const s32 = ({T}) => ({ fontSize: 9.5, background: `${T.green}15`, border: `1px solid ${T.green}25`, color: T.green, padding: '3px 8px', borderRadius: 4, whiteSpace: 'nowrap' });

export const s33 = ({T}) => ({ fontSize: 12, color: T.muted, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' });

export const s34 = ({T}) => ({ fontWeight: 600, color: T.purple });

export const s35 = ({T}) => ({ color: T.muted, fontSize: 12.5, lineHeight: 1.5, marginBottom: 14, overflow: 'hidden', display: '-webkit-box', WebkitLineClamp: 3, WebkitBoxOrient: 'vertical' });

export const s36 = ({T}) => ({ borderTop: `1px solid ${T.border}`, paddingTop: 12, display: 'flex', justifyContent: 'space-between', alignItems: 'center' });

export const s37 = ({T}) => ({ fontSize: 11, color: T.muted });

export const s38 = ({T}) => ({
            background: T.s1,
            border: `1px solid ${T.border}`,
            borderRadius: 14,
            padding: '64px 20px',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            textAlign: 'center',
            minHeight: 280
          });

export const s39 = ({T}) => ({ color: T.text, fontSize: 16, margin: '0 0 6px 0' });

export const s40 = ({T}) => ({ color: T.muted, fontSize: 13, maxWidth: 300, margin: 0 });

export const s41 = ({T}) => ({
                  background: T.s1,
                  border: `1px solid ${T.border}`,
                  borderRadius: 12,
                  padding: 18,
                  display: 'flex',
                  flexDirection: 'column',
                  gap: 12
                });

export const s42 = ({T}) => ({ color: T.text, fontSize: 15, fontWeight: 700, margin: 0 });

export const s43 = ({T}) => ({ display: 'flex', flexWrap: 'wrap', alignItems: 'center', gap: 8, marginTop: 6, fontSize: 12, color: T.muted });

export const s44 = ({T}) => ({ display: 'flex', alignItems: 'center', gap: 4, color: T.text, fontWeight: 600 });

export const s45 = ({T}) => ({
                    background: T.s2,
                    border: `1px solid ${T.border}`,
                    padding: 12,
                    borderRadius: 8,
                    fontSize: 12.5,
                    fontFamily: 'monospace',
                    color: T.text,
                    whiteSpace: 'pre-wrap',
                    maxHeight: 180,
                    overflowY: 'auto',
                    wordBreak: 'break-word'
                  });

export const s46 = ({T}) => ({
                  display: 'flex',
                  flexWrap: 'wrap',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  gap: 10,
                  borderTop: `1px solid ${T.border}`,
                  paddingTop: 12,
                  marginTop: 4
                });

export const s47 = ({T}) => ({ fontSize: 11, fontWeight: 700, color: T.purple, background: `${T.purple}15`, border: `1px solid ${T.purple}30`, padding: '4px 10px', borderRadius: 6, whiteSpace: 'nowrap' });

export const s48 = ({sub,T}) => ({
                      fontSize: 11,
                      fontWeight: 700,
                      padding: '4px 10px',
                      borderRadius: 6,
                      whiteSpace: 'nowrap',
                      background: sub.status === 'Pass' ? `${T.green}18` : sub.status === 'Fail' ? `${T.red}18` : `${T.amber}18`,
                      border: `1px solid ${sub.status === 'Pass' ? T.green : sub.status === 'Fail' ? T.red : T.amber}25`,
                      color: sub.status === 'Pass' ? T.green : sub.status === 'Fail' ? T.red : T.amber
                    });

export const s49 = ({T,evaluatingId,sub}) => ({
                        background: 'linear-gradient(135deg, rgba(155, 110, 248, 0.15), rgba(91, 140, 248, 0.15))',
                        border: `1px solid ${T.purple}40`,
                        color: T.purple,
                        padding: '6px 14px',
                        borderRadius: 6,
                        fontSize: 12,
                        fontWeight: 600,
                        whiteSpace: 'nowrap',
                        cursor: evaluatingId === sub.id ? 'wait' : 'pointer',
                        display: 'flex',
                        alignItems: 'center',
                        gap: 6
                      });

export const s50 = ({T}) => ({
                        background: 'rgba(91, 140, 248, 0.1)',
                        border: `1px solid rgba(91, 140, 248, 0.25)`,
                        color: T.accent,
                        padding: '6px 14px',
                        borderRadius: 6,
                        fontSize: 12,
                        fontWeight: 600,
                        whiteSpace: 'nowrap',
                        cursor: 'pointer',
                        display: 'flex',
                        alignItems: 'center',
                        gap: 5
                      });

export const s51 = ({T}) => ({
            background: T.s1,
            border: `1px solid ${T.border}`,
            borderRadius: 16,
            width: '100%',
            maxWidth: 640,
            maxHeight: 'calc(100vh - 100px)',
            overflowY: 'auto',
            boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.75)',
          });

export const s52 = ({T}) => ({
              padding: '16px 20px',
              borderBottom: `1px solid ${T.border}`,
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
              position: 'sticky',
              top: 0,
              background: T.s1,
              zIndex: 10
            });

export const s53 = ({T}) => ({ margin: 0, color: T.text, fontSize: 16, fontWeight: 700 });

export const s54 = ({T}) => ({ background: 'transparent', border: 'none', cursor: 'pointer', color: T.muted, padding: 0 });

export const s55 = ({T}) => ({ fontSize: 12, fontWeight: 600, color: T.text });

export const s56 = ({T}) => ({
                    background: T.s2,
                    border: `1px solid ${T.border}`,
                    borderRadius: 8,
                    padding: '9px 12px',
                    color: T.text,
                    fontSize: 13,
                    outline: 'none',
                    fontFamily: 'inherit'
                  });

export const s57 = ({isMobile}) => ({ display: 'grid', gridTemplateColumns: isMobile ? '1fr' : '1fr 1fr', gap: 12 });

export const s58 = ({T}) => ({ fontSize: 12, fontWeight: 600, color: T.text });

export const s59 = ({T}) => ({
                      background: T.s2,
                      border: `1px solid ${T.border}`,
                      borderRadius: 8,
                      padding: '9px 12px',
                      color: T.text,
                      fontSize: 13,
                      outline: 'none',
                      fontFamily: 'inherit'
                    });

export const s60 = ({T}) => ({ fontSize: 12, fontWeight: 600, color: T.text });

export const s61 = ({T,currentAssignment}) => ({
                      background: T.s2,
                      border: `1px solid ${T.border}`,
                      borderRadius: 8,
                      padding: '9px 12px',
                      color: T.text,
                      fontSize: 13,
                      outline: 'none',
                      fontFamily: 'inherit',
                      opacity: currentAssignment.course === 'CUSTOM' ? 0.6 : 1
                    });

export const s62 = ({T}) => ({ fontSize: 12, fontWeight: 600, color: T.text });

export const s63 = ({T}) => ({
                    background: T.s2,
                    border: `1px solid ${T.border}`,
                    borderRadius: 8,
                    padding: '9px 12px',
                    color: T.text,
                    fontSize: 13,
                    outline: 'none',
                    fontFamily: 'inherit'
                  });

export const s64 = ({T}) => ({ fontSize: 12, fontWeight: 600, color: T.purple });

export const s65 = ({T}) => ({
                      background: T.s2,
                      border: `1px solid ${T.purple}40`,
                      borderRadius: 8,
                      padding: '9px 12px',
                      color: T.text,
                      fontSize: 13,
                      outline: 'none',
                      fontFamily: 'inherit'
                    });

export const s66 = ({T}) => ({ display: 'flex', flexDirection: 'column', gap: 10, background: T.s2, border: `1px solid ${T.border}`, padding: 14, borderRadius: 10 });

export const s67 = ({T}) => ({ fontSize: 12, fontWeight: 700, color: T.text, display: 'flex', alignItems: 'center', gap: 6 });

export const s68 = ({T}) => ({ background: `${T.purple}20`, border: `1px solid ${T.purple}40`, color: T.purple, padding: '4px 10px', borderRadius: 6, fontSize: 11.5, fontWeight: 600, cursor: 'pointer' });

export const s69 = ({T}) => ({ background: T.s1, border: `1px solid ${T.border}`, borderRadius: 8, padding: 12, display: 'flex', flexDirection: 'column', gap: 8 });

export const s70 = ({T}) => ({ fontSize: 12, fontWeight: 700, color: T.purple });

export const s71 = ({T}) => ({ background: 'transparent', border: 'none', color: T.red, cursor: 'pointer', padding: 2 });

export const s72 = ({T}) => ({
                        background: T.s2,
                        border: `1px solid ${T.border}`,
                        borderRadius: 6,
                        padding: '8px 10px',
                        color: T.text,
                        fontSize: 12.5,
                        outline: 'none',
                        fontFamily: 'inherit',
                        minHeight: 65,
                        resize: 'vertical'
                      });

export const s73 = ({T}) => ({
                          background: T.s2,
                          border: `1px solid ${T.border}`,
                          borderRadius: 6,
                          padding: '8px 10px',
                          color: T.text,
                          fontSize: 12,
                          outline: 'none',
                          fontFamily: 'monospace',
                          minHeight: 50,
                          resize: 'vertical'
                        });

export const s74 = ({T}) => ({ display: 'flex', flexDirection: 'column', gap: 8, background: T.s2, border: `1px solid ${T.border}`, padding: 14, borderRadius: 10 });

export const s75 = ({T}) => ({ fontSize: 12, fontWeight: 700, color: T.purple, display: 'flex', alignItems: 'center', gap: 6 });

export const s76 = ({T}) => ({ background: `${T.purple}20`, border: `1px solid ${T.purple}40`, color: T.purple, padding: '3px 8px', borderRadius: 4, fontSize: 11, fontWeight: 600, cursor: 'pointer' });

export const s77 = ({T}) => ({ margin: 0, fontSize: 11, color: T.muted });

export const s78 = ({T}) => ({ fontSize: 11, color: T.muted, width: 16 });

export const s79 = ({T}) => ({
                        flex: 1,
                        background: T.s1,
                        border: `1px solid ${T.border}`,
                        borderRadius: 6,
                        padding: '6px 10px',
                        color: T.text,
                        fontSize: 12.5,
                        outline: 'none'
                      });

export const s80 = ({T}) => ({ background: 'transparent', border: 'none', color: T.red, cursor: 'pointer', padding: 4 });

export const s81 = ({T}) => ({ fontSize: 12, fontWeight: 600, color: T.text });

export const s82 = ({T}) => ({ width: 65, background: T.s1, border: `1px solid ${T.border}`, borderRadius: 6, padding: '4px 8px', color: T.text, fontSize: 12, outline: 'none' });

export const s83 = ({T}) => ({ fontSize: 12, fontWeight: 600, color: T.purple });

export const s84 = ({T}) => ({ width: 65, background: T.s1, border: `1px solid ${T.purple}40`, borderRadius: 6, padding: '4px 8px', color: T.text, fontSize: 12, outline: 'none' });

export const s85 = ({T}) => ({ accentColor: T.purple });

export const s86 = ({T}) => ({ fontSize: 12, fontWeight: 600, color: T.text, cursor: 'pointer' });

export const s87 = ({T}) => ({
                      background: T.s2,
                      border: `1px solid ${T.border}`,
                      borderRadius: 8,
                      padding: '9px 12px',
                      color: T.text,
                      fontSize: 13,
                      outline: 'none',
                      fontFamily: 'inherit',
                      minHeight: 80,
                      marginTop: 6,
                      resize: 'vertical'
                    });

export const s88 = ({T}) => ({
                display: 'flex',
                justifyContent: 'flex-end',
                gap: 10,
                borderTop: `1px solid ${T.border}`,
                paddingTop: 16,
                marginTop: 8
              });

export const s89 = ({T}) => ({
                    background: 'transparent',
                    border: `1px solid ${T.border}`,
                    color: T.text,
                    padding: '8px 16px',
                    borderRadius: 8,
                    fontSize: 12.5,
                    cursor: 'pointer'
                  });

export const s90 = ({T}) => ({
                    background: T.purple,
                    color: '#fff',
                    border: 'none',
                    padding: '8px 16px',
                    borderRadius: 8,
                    fontSize: 12.5,
                    fontWeight: 600,
                    cursor: 'pointer'
                  });

export const s91 = ({T}) => ({
            background: T.s1,
            border: `1px solid ${T.border}`,
            borderRadius: 16,
            width: '100%',
            maxWidth: 640,
            maxHeight: 'calc(100vh - 100px)',
            overflowY: 'auto',
            boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.75)',
          });

export const s92 = ({T}) => ({
              padding: '16px 20px',
              borderBottom: `1px solid ${T.border}`,
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
              position: 'sticky',
              top: 0,
              background: T.s1,
              zIndex: 10
            });

export const s93 = ({T}) => ({ margin: 0, color: T.text, fontSize: 16, fontWeight: 700 });

export const s94 = ({T}) => ({ background: 'transparent', border: 'none', cursor: 'pointer', color: T.muted, padding: 0 });

export const s95 = ({T}) => ({ fontSize: 12, color: T.muted, fontWeight: 600 });

export const s96 = ({T}) => ({
                  marginTop: 6,
                  background: T.s2,
                  border: `1px solid ${T.border}`,
                  padding: 12,
                  borderRadius: 8,
                  fontFamily: 'monospace',
                  fontSize: 12.5,
                  maxHeight: 160,
                  overflowY: 'auto',
                  color: T.text,
                  whiteSpace: 'pre-wrap'
                });

export const s97 = ({T}) => ({ background: T.s2, border: `1px solid ${T.purple}40`, borderRadius: 10, padding: 14, display: 'flex', flexDirection: 'column', gap: 10 });

export const s98 = ({T}) => ({ fontSize: 13, fontWeight: 700, color: T.purple, display: 'flex', alignItems: 'center', gap: 6 });

export const s99 = ({gradingForm,T}) => ({
                      fontSize: 11, fontWeight: 700, padding: '2px 8px', borderRadius: 4,
                      background: gradingForm.status === 'Pass' ? `${T.green}18` : `${T.red}18`,
                      color: gradingForm.status === 'Pass' ? T.green : T.red,
                      border: `1px solid ${gradingForm.status === 'Pass' ? T.green : T.red}30`
                    });

export const s100 = ({T}) => ({ fontSize: 11.5, fontWeight: 700, color: T.text });

export const s101 = ({T}) => ({ background: T.s1, border: `1px solid ${T.border}`, borderRadius: 8, padding: 10, fontSize: 12 });

export const s102 = ({T}) => ({ fontWeight: 600, color: T.text });

export const s103 = ({cb,T}) => ({
                              fontSize: 10, fontWeight: 700, padding: '1px 6px', borderRadius: 4,
                              color: cb.status === 'Passed' ? T.green : cb.status === 'Partial' ? T.amber : T.red,
                              background: cb.status === 'Passed' ? `${T.green}15` : cb.status === 'Partial' ? `${T.amber}15` : `${T.red}15`
                            });

export const s104 = ({T}) => ({ margin: '4px 0 0', color: T.muted, fontSize: 11, fontStyle: 'italic' });

export const s105 = ({T}) => ({ margin: '4px 0 0', color: T.text, fontSize: 11.5 });

export const s106 = ({T}) => ({ fontSize: 12, fontWeight: 600, color: T.text });

export const s107 = ({T}) => ({
                      background: T.s2,
                      border: `1px solid ${T.border}`,
                      borderRadius: 8,
                      padding: '9px 12px',
                      color: T.text,
                      fontSize: 13,
                      outline: 'none',
                      fontFamily: 'inherit'
                    });

export const s108 = ({T}) => ({ fontSize: 12, fontWeight: 600, color: T.text });

export const s109 = ({T}) => ({
                      background: T.s2,
                      border: `1px solid ${T.border}`,
                      borderRadius: 8,
                      padding: '9px 12px',
                      color: T.text,
                      fontSize: 13,
                      outline: 'none',
                      fontFamily: 'inherit'
                    });

export const s110 = ({T}) => ({ fontSize: 12, fontWeight: 600, color: T.text });

export const s111 = ({T}) => ({
                    background: T.s2,
                    border: `1px solid ${T.border}`,
                    borderRadius: 8,
                    padding: '9px 12px',
                    color: T.text,
                    fontSize: 13,
                    outline: 'none',
                    fontFamily: 'inherit',
                    minHeight: 90,
                    resize: 'vertical'
                  });

export const s112 = ({T}) => ({
                display: 'flex',
                justifyContent: 'flex-end',
                gap: 10,
                borderTop: `1px solid ${T.border}`,
                paddingTop: 16,
                marginTop: 8
              });

export const s113 = ({T}) => ({
                    background: 'transparent',
                    border: `1px solid ${T.border}`,
                    color: T.text,
                    padding: '8px 16px',
                    borderRadius: 8,
                    fontSize: 12.5,
                    cursor: 'pointer'
                  });

export const s114 = ({T}) => ({
                    background: T.purple,
                    color: '#fff',
                    border: 'none',
                    padding: '8px 16px',
                    borderRadius: 8,
                    fontSize: 12.5,
                    fontWeight: 600,
                    cursor: 'pointer'
                  });
