export const s0 = ({containerPadding}) => ({
      padding: containerPadding,
      maxWidth: 1200,
      margin: '0 auto',
      fontFamily: 'var(--font-outfit), sans-serif'
    });

export const s1 = ({T,isMobile}) => ({ color: T.text, fontSize: isMobile ? 22 : 28, fontWeight: 700, margin: 0, letterSpacing: '-0.04em' });

export const s2 = ({T}) => ({ color: T.muted, fontSize: 13.5, margin: '4px 0 0' });

export const s3 = ({T}) => ({
              background: 'transparent',
              color: T.text,
              border: `1px solid ${T.border}`,
              padding: '9px 16px',
              borderRadius: 8,
              fontSize: 13,
              fontWeight: 600,
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              gap: 6,
              transition: 'all 0.2s'
            });

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
        background: T.s1,
        border: `1px solid ${T.border}`,
        borderRadius: 12,
        padding: 16,
        marginBottom: 20,
        display: 'flex',
        flexWrap: 'wrap',
        gap: 12,
        alignItems: 'center'
      });

export const s6 = ({T}) => ({
              width: '100%',
              background: T.s2,
              border: `1px solid ${T.border}`,
              borderRadius: 8,
              padding: '8px 12px 8px 36px',
              color: T.text,
              fontSize: 13,
              fontFamily: 'inherit',
              outline: 'none'
            });

export const s7 = ({T}) => ({
            background: T.s2,
            border: `1px solid ${T.border}`,
            borderRadius: 8,
            padding: '8px 12px',
            color: T.text,
            fontSize: 13,
            outline: 'none',
            fontFamily: 'inherit',
            minWidth: 140
          });

export const s8 = ({T}) => ({
            background: T.s2,
            border: `1px solid ${T.border}`,
            borderRadius: 8,
            padding: '8px 12px',
            color: T.text,
            fontSize: 13,
            outline: 'none',
            fontFamily: 'inherit',
            minWidth: 120
          });

export const s9 = ({T}) => ({
          background: T.s1,
          border: `1px solid ${T.border}`,
          borderRadius: 14,
          padding: '64px 20px',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          textAlign: 'center'
        });

export const s10 = ({T}) => ({ color: T.text, fontSize: 16, margin: '0 0 6px 0' });

export const s11 = ({T}) => ({ color: T.muted, fontSize: 13, maxWidth: 300, margin: '0 0 16px 0' });

export const s12 = ({T}) => ({
              background: T.purple,
              color: '#fff',
              border: 'none',
              padding: '8px 16px',
              borderRadius: 6,
              fontSize: 12,
              fontWeight: 600,
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              gap: 4
            });

export const s13 = ({T}) => ({
            background: T.s1,
            border: `1px solid ${T.border}`,
            borderRadius: 12,
            overflowX: 'auto',
            marginBottom: 20
          });

export const s14 = ({T}) => ({ borderBottom: `1px solid ${T.border}`, color: T.muted, fontSize: 11.5, textTransform: 'uppercase', letterSpacing: '0.05em' });

export const s15 = ({T}) => ({ borderBottom: `1px solid ${T.border}`, transition: 'background 0.2s', ':hover': { background: 'rgba(255,255,255,0.01)' } });

export const s16 = ({T}) => ({ padding: '16px 20px', color: T.text, fontWeight: 600 });

export const s17 = ({T}) => ({ padding: '16px 20px', color: T.muted });

export const s18 = ({T}) => ({ padding: '16px 20px', color: T.muted });

export const s19 = ({T}) => ({ padding: '16px 20px', color: T.text, fontWeight: 500 });

export const s20 = ({isPublished,T}) => ({
                          display: 'inline-block',
                          fontSize: 10.5,
                          fontWeight: 700,
                          padding: '3px 9px',
                          borderRadius: 20,
                          textTransform: 'capitalize',
                          background: isPublished ? 'rgba(34, 197, 160, 0.12)' : 'rgba(100, 114, 152, 0.15)',
                          color: isPublished ? T.green : T.muted,
                          border: `1px solid ${isPublished ? 'rgba(34, 197, 160, 0.25)' : 'rgba(100, 114, 152, 0.3)'}`
                        });

export const s21 = ({T}) => ({ padding: '16px 20px', color: T.muted });

export const s22 = ({T}) => ({
                              background: 'transparent', border: 'none', cursor: 'pointer',
                              color: T.muted, padding: 4, borderRadius: 4, transition: 'all 0.2s'
                            });

export const s23 = ({T}) => ({
                              background: 'transparent', border: 'none', cursor: 'pointer',
                              color: T.muted, padding: 4, borderRadius: 4, transition: 'all 0.2s'
                            });

export const s24 = ({T}) => ({
                              background: 'transparent', border: 'none', cursor: 'pointer',
                              color: T.muted, padding: 4, borderRadius: 4, transition: 'all 0.2s'
                            });

export const s25 = ({T}) => ({
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            fontSize: 12.5,
            color: T.muted
          });

export const s26 = ({currentPage,T}) => ({
                  background: 'transparent',
                  border: 'none',
                  color: currentPage === 1 ? T.dim : T.text,
                  cursor: currentPage === 1 ? 'not-allowed' : 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  gap: 4
                });

export const s27 = ({T}) => ({
                background: `${T.purple}20`,
                border: `1px solid ${T.purple}40`,
                color: T.purple,
                fontWeight: 700,
                width: 28,
                height: 28,
                borderRadius: 6,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center'
              });

export const s28 = ({currentPage,totalPages,T}) => ({
                  background: 'transparent',
                  border: 'none',
                  color: currentPage === totalPages ? T.dim : T.text,
                  cursor: currentPage === totalPages ? 'not-allowed' : 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  gap: 4
                });

export const s29 = ({T}) => ({
            background: T.s1,
            border: `1px solid ${T.border}`,
            borderRadius: 16,
            width: '100%',
            maxWidth: 500,
            boxShadow: '0 20px 40px rgba(0,0,0,0.5)',
            overflow: 'hidden'
          });

export const s30 = ({T}) => ({
              padding: '16px 20px',
              borderBottom: `1px solid ${T.border}`,
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center'
            });

export const s31 = ({T}) => ({ margin: 0, color: T.text, fontSize: 16, fontWeight: 700 });

export const s32 = ({T}) => ({ background: 'transparent', border: 'none', cursor: 'pointer', color: T.muted, padding: 0 });

export const s33 = ({T}) => ({ fontSize: 12, fontWeight: 600, color: T.text });

export const s34 = ({T}) => ({
                    background: T.s2,
                    border: `1px solid ${T.border}`,
                    borderRadius: 8,
                    padding: '9px 12px',
                    color: T.text,
                    fontSize: 13,
                    outline: 'none',
                    fontFamily: 'inherit'
                  });

export const s35 = ({T}) => ({ fontSize: 12, fontWeight: 600, color: T.text });

export const s36 = ({T}) => ({
                      background: T.s2,
                      border: `1px solid ${T.border}`,
                      borderRadius: 8,
                      padding: '9px 12px',
                      color: T.text,
                      fontSize: 13,
                      outline: 'none',
                      fontFamily: 'inherit'
                    });

export const s37 = ({T}) => ({ fontSize: 12, fontWeight: 600, color: T.text });

export const s38 = ({T}) => ({
                      background: T.s2,
                      border: `1px solid ${T.border}`,
                      borderRadius: 8,
                      padding: '9px 12px',
                      color: T.text,
                      fontSize: 13,
                      outline: 'none',
                      fontFamily: 'inherit'
                    });

export const s39 = ({T}) => ({ fontSize: 12, fontWeight: 600, color: T.text });

export const s40 = ({T}) => ({
                      background: T.s2,
                      border: `1px solid ${T.border}`,
                      borderRadius: 8,
                      padding: '9px 12px',
                      color: T.text,
                      fontSize: 13,
                      outline: 'none',
                      fontFamily: 'inherit'
                    });

export const s41 = ({T}) => ({ fontSize: 12, fontWeight: 600, color: T.text });

export const s42 = ({T}) => ({
                      background: T.s2,
                      border: `1px solid ${T.border}`,
                      borderRadius: 8,
                      padding: '9px 12px',
                      color: T.text,
                      fontSize: 13,
                      outline: 'none',
                      fontFamily: 'inherit'
                    });

export const s43 = ({T}) => ({ fontSize: 12, fontWeight: 600, color: T.text });

export const s44 = ({T}) => ({
                    background: T.s2,
                    border: `1px solid ${T.border}`,
                    borderRadius: 8,
                    padding: '9px 12px',
                    color: T.text,
                    fontSize: 13,
                    outline: 'none',
                    fontFamily: 'inherit',
                    resize: 'vertical'
                  });

export const s45 = ({T}) => ({ fontSize: 12, fontWeight: 600, color: T.text });

export const s46 = ({T}) => ({
                    background: T.s2,
                    border: `1px solid ${T.border}`,
                    borderRadius: 8,
                    padding: '9px 12px',
                    color: T.text,
                    fontSize: 13,
                    outline: 'none',
                    fontFamily: 'inherit'
                  });

export const s47 = ({T}) => ({ fontSize: 12, fontWeight: 600, color: T.text });

export const s48 = ({T}) => ({
                    background: T.s2,
                    border: `1px solid ${T.border}`,
                    borderRadius: 8,
                    padding: '9px 12px',
                    color: T.text,
                    fontSize: 13,
                    outline: 'none',
                    fontFamily: 'inherit'
                  });

export const s49 = ({T}) => ({
                display: 'flex',
                justifyContent: 'flex-end',
                gap: 10,
                borderTop: `1px solid ${T.border}`,
                paddingTop: 16,
                marginTop: 8
              });

export const s50 = ({T}) => ({
                    background: 'transparent',
                    border: `1px solid ${T.border}`,
                    color: T.text,
                    padding: '8px 16px',
                    borderRadius: 8,
                    fontSize: 12.5,
                    cursor: 'pointer'
                  });

export const s51 = ({T}) => ({
                    background: T.purple,
                    color: '#fff',
                    border: 'none',
                    padding: '8px 16px',
                    borderRadius: 8,
                    fontSize: 12.5,
                    fontWeight: 600,
                    cursor: 'pointer'
                  });

export const s52 = ({T}) => ({
            background: T.s1,
            border: `1px solid ${T.border}`,
            borderRadius: 16,
            width: '100%',
            maxWidth: 550,
            boxShadow: '0 20px 40px rgba(0,0,0,0.5)',
            overflow: 'hidden'
          });

export const s53 = ({T}) => ({
              padding: '16px 20px',
              borderBottom: `1px solid ${T.border}`,
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center'
            });

export const s54 = ({T}) => ({ margin: 0, color: T.text, fontSize: 16, fontWeight: 700 });

export const s55 = ({T}) => ({ background: 'transparent', border: 'none', cursor: 'pointer', color: T.muted, padding: 0 });

export const s56 = ({T}) => ({ color: T.muted, fontSize: 13, margin: 0, lineHeight: '1.5' });

export const s57 = ({T}) => ({
                    background: `${T.purple}08`,
                    border: `1px dashed ${T.purple}30`,
                    borderRadius: 10,
                    padding: 12,
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center'
                  });

export const s58 = ({T}) => ({ color: T.text, fontSize: 13, fontWeight: 600 });

export const s59 = ({T}) => ({ color: T.muted, fontSize: 11.5 });

export const s60 = ({T}) => ({
                        background: T.s2,
                        color: T.purple,
                        border: `1px solid ${T.border}`,
                        padding: '6px 12px',
                        borderRadius: 6,
                        fontSize: 12,
                        fontWeight: 600,
                        textDecoration: 'none',
                        display: 'flex',
                        alignItems: 'center',
                        gap: 6,
                        transition: 'all 0.2s'
                      });

export const s61 = ({importFile,T}) => ({
                      border: `2px dashed ${importFile ? T.purple : T.border}`,
                      borderRadius: 12,
                      padding: '30px 20px',
                      textAlign: 'center',
                      background: importFile ? `${T.purple}04` : T.s2,
                      cursor: 'pointer',
                      position: 'relative',
                      transition: 'all 0.2s'
                    });

export const s62 = ({T}) => ({ color: T.purple, fontWeight: 600, fontSize: 13 });

export const s63 = ({T}) => ({ color: T.muted, fontSize: 13 });

export const s64 = ({T}) => ({ color: T.dim, fontSize: 11 });

export const s65 = ({T}) => ({
                          background: `${T.purple}15`,
                          padding: 10,
                          borderRadius: 8,
                          color: T.purple
                        });

export const s66 = ({T}) => ({ color: T.text, fontWeight: 600, fontSize: 13.5, maxWidth: '90%', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' });

export const s67 = ({T}) => ({ color: T.muted, fontSize: 12 });

export const s68 = ({T}) => ({
                            background: 'transparent',
                            color: T.red,
                            border: 'none',
                            fontSize: 12,
                            fontWeight: 600,
                            cursor: 'pointer',
                            marginTop: 4
                          });

export const s69 = ({T}) => ({
                      background: 'rgba(239, 68, 68, 0.08)',
                      border: '1px solid rgba(239, 68, 68, 0.2)',
                      borderRadius: 8,
                      padding: '10px 14px',
                      display: 'flex',
                      alignItems: 'flex-start',
                      gap: 8,
                      color: T.red,
                      fontSize: 12.5,
                      lineHeight: '1.4'
                    });

export const s70 = ({T}) => ({
                    display: 'flex',
                    justifyContent: 'flex-end',
                    gap: 10,
                    borderTop: `1px solid ${T.border}`,
                    paddingTop: 16,
                    marginTop: 8
                  });

export const s71 = ({T,importLoading}) => ({
                        background: 'transparent',
                        border: `1px solid ${T.border}`,
                        color: T.text,
                        padding: '8px 16px',
                        borderRadius: 8,
                        fontSize: 12.5,
                        cursor: importLoading ? 'not-allowed' : 'pointer'
                      });

export const s72 = ({T,importFile,importLoading}) => ({
                        background: T.purple,
                        color: '#fff',
                        border: 'none',
                        padding: '8px 16px',
                        borderRadius: 8,
                        fontSize: 12.5,
                        fontWeight: 600,
                        cursor: (!importFile || importLoading) ? 'not-allowed' : 'pointer',
                        opacity: (!importFile || importLoading) ? 0.6 : 1,
                        display: 'flex',
                        alignItems: 'center',
                        gap: 6
                      });

export const s73 = ({T}) => ({
                      background: 'rgba(34, 197, 160, 0.12)',
                      color: T.green,
                      padding: 12,
                      borderRadius: '50%',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center'
                    });

export const s74 = ({T}) => ({ color: T.text, fontSize: 16, fontWeight: 700, margin: '0 0 4px 0' });

export const s75 = ({T}) => ({ color: T.muted, fontSize: 13, margin: 0 });

export const s76 = ({T}) => ({
                    background: T.s2,
                    border: `1px solid ${T.border}`,
                    borderRadius: 12,
                    overflow: 'hidden'
                  });

export const s77 = ({T}) => ({
                      padding: '10px 14px',
                      background: 'rgba(255, 255, 255, 0.02)',
                      borderBottom: `1px solid ${T.border}`,
                      color: T.text,
                      fontSize: 12,
                      fontWeight: 600
                    });

export const s78 = ({idx,importResult,T}) => ({
                            padding: '8px 14px',
                            display: 'flex',
                            justifyContent: 'space-between',
                            alignItems: 'center',
                            borderBottom: idx === importResult.imported.length - 1 ? 'none' : `1px solid ${T.border}30`
                          });

export const s79 = ({T}) => ({ color: T.text, fontSize: 12.5, fontWeight: 600, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' });

export const s80 = ({T}) => ({ color: T.dim, fontSize: 11 });

export const s81 = ({T}) => ({
                              fontSize: 10.5,
                              color: T.purple,
                              background: `${T.purple}15`,
                              padding: '2px 6px',
                              borderRadius: 4,
                              fontWeight: 600
                            });

export const s82 = ({T}) => ({
                              fontSize: 10.5,
                              color: T.accent,
                              background: `${T.accent}15`,
                              padding: '2px 6px',
                              borderRadius: 4,
                              fontWeight: 600
                            });

export const s83 = ({T}) => ({
                    display: 'flex',
                    justifyContent: 'flex-end',
                    borderTop: `1px solid ${T.border}`,
                    paddingTop: 16,
                    marginTop: 8
                  });

export const s84 = ({T}) => ({
                        background: T.purple,
                        color: '#fff',
                        border: 'none',
                        padding: '8px 24px',
                        borderRadius: 8,
                        fontSize: 12.5,
                        fontWeight: 600,
                        cursor: 'pointer'
                      });
