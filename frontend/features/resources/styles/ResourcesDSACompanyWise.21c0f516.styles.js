export const s0 = ({T}) => ({
          width: 32, height: 32, borderRadius: '50%',
          border: `2px solid ${T.border}`, borderTopColor: T.accent, animation: 'spin 1s linear infinite'
        });

export const s1 = ({T}) => ({ fontSize: 13, color: T.muted });

export const s2 = ({T}) => ({
            display: 'inline-flex', alignItems: 'center', gap: 8,
            background: 'transparent', border: 'none', color: T.muted,
            fontSize: 14, cursor: 'pointer', fontWeight: 500, width: 'fit-content'
          });

export const s3 = ({T}) => ({
            fontSize: 'clamp(22px, 5.5vw, 32px)', fontWeight: 800, color: T.text, margin: '0 0 6px 0', letterSpacing: '-0.03em',
            background: `linear-gradient(to right, #60A5FA 0%, #A7F3D0 100%)`,
            WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent'
          });

export const s4 = ({T}) => ({ color: T.muted, fontSize: 'clamp(13.5px, 3.5vw, 15px)', margin: 0 });

export const s5 = ({T}) => ({
                width: '100%', padding: '12px 14px 12px 42px',
                background: T.s1, border: `1px solid ${T.border}`, borderRadius: 10,
                color: T.text, fontSize: 13.5, outline: 'none', fontFamily: 'inherit'
              });

export const s6 = ({T}) => ({
                  background: T.s1, border: `1px solid ${T.border}`, borderRadius: 12, padding: 20,
                  cursor: 'pointer', display: 'flex', flexDirection: 'column', gap: 12
                });

export const s7 = ({T}) => ({
                    width: 40, height: 40, borderRadius: '50%', background: 'rgba(91, 140, 248, 0.12)',
                    display: 'flex', alignItems: 'center', justifyCenter: 'center', color: T.accent, flexShrink: 0, paddingLeft: 10
                  });

export const s8 = ({T}) => ({ fontSize: 16, fontWeight: 700, color: T.text, margin: 0 });

export const s9 = ({T}) => ({ fontSize: 12, color: T.muted, margin: '2px 0 0 0' });

export const s10 = ({T,currentPage}) => ({
                  padding: '8px 16px', background: T.s1, border: `1px solid ${T.border}`, borderRadius: 8,
                  color: currentPage === 1 ? T.dim : T.text, cursor: currentPage === 1 ? 'not-allowed' : 'pointer', fontFamily: 'inherit'
                });

export const s11 = ({T}) => ({ fontSize: 13.5, color: T.muted });

export const s12 = ({T,currentPage,totalPages}) => ({
                  padding: '8px 16px', background: T.s1, border: `1px solid ${T.border}`, borderRadius: 8,
                  color: currentPage === totalPages ? T.dim : T.text, cursor: currentPage === totalPages ? 'not-allowed' : 'pointer', fontFamily: 'inherit'
                });

export const s13 = ({T}) => ({
                width: '100%', padding: '12px 14px 12px 42px',
                background: T.s1, border: `1px solid ${T.border}`, borderRadius: 10,
                color: T.text, fontSize: 13.5, outline: 'none', fontFamily: 'inherit'
              });

export const s14 = ({T}) => ({
            background: T.s1, border: `1px solid ${T.border}`, borderRadius: 16, overflow: 'hidden',
            display: 'flex', flexDirection: 'column'
          });

export const s15 = ({T}) => ({ padding: '48px', textAlign: 'center', color: T.muted });

export const s16 = ({idx,paginatedQuestions,T}) => ({
                      padding: '14px 16px', borderBottom: idx === paginatedQuestions.length - 1 ? 'none' : `1px solid ${T.border}`,
                      display: 'flex', justifyContent: 'space-between', alignItems: 'center', gap: 12, flexWrap: 'wrap'
                    });

export const s17 = ({T}) => ({ fontSize: 15, fontWeight: 700, color: T.text, margin: '0 0 6px 0' });

export const s18 = ({getDifficultyColor,q}) => ({ fontSize: 11.5, fontWeight: 600, color: getDifficultyColor(q.Difficulty) });

export const s19 = ({T}) => ({ color: T.dim });

export const s20 = ({T}) => ({ fontSize: 11.5, color: T.muted });

export const s21 = ({T}) => ({ color: T.dim });

export const s22 = ({T}) => ({ fontSize: 11.5, color: T.accent, fontWeight: 600 });

export const s23 = ({T}) => ({
                        background: T.s3, border: `1px solid ${T.border}`, color: T.text,
                        textDecoration: 'none', borderRadius: 8, padding: '8px 14px', fontSize: 12.5,
                        fontWeight: 600, display: 'flex', alignItems: 'center', gap: 6, cursor: 'pointer'
                      });

export const s24 = ({T,questionsCurrentPage}) => ({
                  padding: '8px 16px', background: T.s1, border: `1px solid ${T.border}`, borderRadius: 8,
                  color: questionsCurrentPage === 1 ? T.dim : T.text, cursor: questionsCurrentPage === 1 ? 'not-allowed' : 'pointer', fontFamily: 'inherit'
                });

export const s25 = ({T}) => ({ fontSize: 13.5, color: T.muted });

export const s26 = ({T,questionsCurrentPage,questionsTotalPages}) => ({
                  padding: '8px 16px', background: T.s1, border: `1px solid ${T.border}`, borderRadius: 8,
                  color: questionsCurrentPage === questionsTotalPages ? T.dim : T.text, cursor: questionsCurrentPage === questionsTotalPages ? 'not-allowed' : 'pointer', fontFamily: 'inherit'
                });
