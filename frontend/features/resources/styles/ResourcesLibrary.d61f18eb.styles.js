export const s0 = ({T}) => ({
            display: 'inline-flex', alignItems: 'center', gap: 8,
            background: 'transparent', border: 'none', color: T.muted,
            fontSize: 14, cursor: 'pointer', fontWeight: 500, width: 'fit-content'
          });

export const s1 = ({T}) => ({
            fontSize: 'clamp(24px, 6vw, 36px)', fontWeight: 800, color: T.text, margin: '0 0 10px 0', letterSpacing: '-0.03em',
            background: `linear-gradient(to right, #60A5FA 0%, #8B5CF6 100%)`,
            WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent'
          });

export const s2 = ({T}) => ({ color: T.muted, fontSize: 'clamp(13.5px, 3.5vw, 16px)', margin: 0, maxWidth: 600, marginLeft: 'auto', marginRight: 'auto' });

export const s3 = ({T}) => ({
              width: '100%', padding: '14px 16px 14px 48px',
              background: T.s1, border: `1px solid ${T.border}`, borderRadius: 12,
              color: T.text, fontSize: 14, outline: 'none', transition: 'border-color 0.2s',
              fontFamily: 'inherit'
            });

export const s4 = ({T}) => ({
              padding: '12px 16px', background: T.s1, border: `1px solid ${T.border}`, borderRadius: 8,
              color: T.text, fontSize: 13.5, outline: 'none', cursor: 'pointer', fontFamily: 'inherit'
            });

export const s5 = ({T}) => ({
              padding: '12px 16px', background: T.s1, border: `1px solid ${T.border}`, borderRadius: 8,
              color: T.text, fontSize: 13.5, outline: 'none', cursor: 'pointer', fontFamily: 'inherit'
            });

export const s6 = ({T}) => ({
              padding: '12px 16px', background: T.s1, border: `1px solid ${T.border}`, borderRadius: 8,
              color: T.text, fontSize: 13.5, outline: 'none', cursor: 'pointer', fontFamily: 'inherit'
            });

export const s7 = ({T}) => ({
            display: 'flex', background: T.s1, border: `1px solid ${T.border}`, borderRadius: 8,
            padding: 4, width: 'fit-content', justifySelf: 'end'
          });

export const s8 = ({viewMode,T}) => ({
                background: viewMode === 'grid' ? T.accent : 'transparent',
                color: viewMode === 'grid' ? '#000' : T.muted,
                border: 'none', borderRadius: 6, padding: '8px 12px', cursor: 'pointer', display: 'flex'
              });

export const s9 = ({viewMode,T}) => ({
                background: viewMode === 'list' ? T.accent : 'transparent',
                color: viewMode === 'list' ? '#000' : T.muted,
                border: 'none', borderRadius: 6, padding: '8px 12px', cursor: 'pointer', display: 'flex'
              });

export const s10 = ({T}) => ({ color: T.muted, fontSize: 13 });

export const s11 = ({T}) => ({
            width: 32, height: 32, borderRadius: '50%',
            border: `2px solid ${T.border}`, borderTopColor: T.accent, animation: 'spin 1s linear infinite'
          });

export const s12 = ({T}) => ({ fontSize: 13, color: T.muted });

export const s13 = ({T}) => ({ textAlign: 'center', padding: '60px 20px', background: T.s1, borderRadius: 16, border: `1px solid ${T.border}`, maxWidth: 600, margin: '20px auto' });

export const s14 = ({T}) => ({ color: T.text, fontSize: 16, fontWeight: 700, margin: '0 0 8px 0' });

export const s15 = ({T}) => ({ color: T.muted, fontSize: 13.5, margin: '0 0 16px 0', lineHeight: 1.5 });

export const s16 = ({T}) => ({ fontSize: 12, color: T.muted, background: 'rgba(239, 68, 68, 0.05)', padding: '12px 16px', borderRadius: 8, border: '1px dashed rgba(239, 68, 68, 0.2)', textAlign: 'left' });

export const s17 = ({T}) => ({ textAlign: 'center', padding: '80px 20px', background: T.s1, borderRadius: 16, border: `1px solid ${T.border}` });

export const s18 = ({T}) => ({ color: T.text, fontSize: 16, fontWeight: 700, margin: '0 0 4px 0' });

export const s19 = ({T}) => ({ color: T.muted, fontSize: 13, margin: 0 });

export const s20 = ({T}) => ({
                background: T.s1, border: `1px solid ${T.border}`, borderRadius: 12, overflow: 'hidden',
                display: 'flex', flexDirection: 'column', height: '100%'
              });

export const s21 = ({T}) => ({
                  aspectRatio: '3/4', background: 'rgba(91, 140, 248, 0.05)', position: 'relative',
                  cursor: 'pointer', overflow: 'hidden', borderBottom: `1px solid ${T.border}`,
                  display: 'flex', alignItems: 'center', justifyContent: 'center'
                });

export const s22 = ({T}) => ({
                  position: 'absolute', bottom: 0, left: 0, right: 0, padding: 8,
                  background: 'linear-gradient(to top, rgba(0,0,0,0.8) 0%, transparent 100%)',
                  fontSize: 10.5, color: T.text, fontWeight: 600, textOverflow: 'ellipsis', overflow: 'hidden', whiteSpace: 'nowrap'
                });

export const s23 = ({T}) => ({
                      fontSize: 14, fontWeight: 700, color: T.text, margin: '0 0 6px 0', cursor: 'pointer',
                      lineHeight: 1.3, display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical',
                      overflow: 'hidden', minHeight: 36
                    });

export const s24 = ({T}) => ({ fontSize: 11.5, color: T.muted, marginBottom: 12, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' });

export const s25 = ({T}) => ({
                      flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 6,
                      background: T.accent, border: 'none', borderRadius: 6, padding: '7px 0',
                      color: '#000', fontSize: 12.5, fontWeight: 700, cursor: 'pointer'
                    });

export const s26 = ({T}) => ({
                      background: T.s3, border: `1px solid ${T.border}`, borderRadius: 6, width: 32,
                      display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#fff', cursor: 'pointer'
                    });

export const s27 = ({T}) => ({
                background: T.s1, border: `1px solid ${T.border}`, borderRadius: 12, padding: 14,
                display: 'flex', gap: 16, alignItems: 'center'
              });

export const s28 = ({T}) => ({
                    fontSize: 14.5, fontWeight: 700, color: T.text, margin: '0 0 4px 0', cursor: 'pointer',
                    overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap'
                  });

export const s29 = ({T}) => ({ fontSize: 11.5, color: T.muted });

export const s30 = ({T}) => ({
                    display: 'flex', alignItems: 'center', gap: 6, background: T.accent, border: 'none',
                    borderRadius: 6, padding: '7px 14px', color: '#000', fontSize: 12.5, fontWeight: 700, cursor: 'pointer'
                  });

export const s31 = ({T}) => ({
                    background: T.s3, border: `1px solid ${T.border}`, borderRadius: 6, width: 32, height: 32,
                    display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#fff', cursor: 'pointer'
                  });

export const s32 = ({T,currentPage}) => ({
              padding: 8, background: T.s1, border: `1px solid ${T.border}`, borderRadius: 8,
              color: currentPage === 1 ? T.dim : T.text, cursor: currentPage === 1 ? 'not-allowed' : 'pointer', display: 'flex'
            });

export const s33 = ({T}) => ({ fontSize: 13.5, color: T.muted });

export const s34 = ({T,currentPage,totalPages}) => ({
              padding: 8, background: T.s1, border: `1px solid ${T.border}`, borderRadius: 8,
              color: currentPage === totalPages ? T.dim : T.text, cursor: currentPage === totalPages ? 'not-allowed' : 'pointer', display: 'flex'
            });
