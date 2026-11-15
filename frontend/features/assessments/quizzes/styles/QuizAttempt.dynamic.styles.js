export const s11 = ({isMobile}) => ({
          position: 'fixed',
          top: 0, left: 0, right: 0, bottom: 0,
          background: 'rgba(7, 8, 15, 0.88)',
          backdropFilter: 'blur(6px)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          zIndex: 9999,
          padding: isMobile ? '70px 14px 20px 14px' : '76px 24px 30px 24px',
          boxSizing: 'border-box'
        });

export const s12 = ({quizScore}) => ({
                    width: 56, height: 56, borderRadius: '50%',
                    background: quizScore.passed ? 'rgba(16, 185, 129, 0.15)' : 'rgba(239, 68, 68, 0.15)',
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                    margin: '0 auto 16px'
                  });

export const s13 = ({isSelected}) => ({
                            background: isSelected ? 'rgba(124, 58, 237, 0.2)' : 'rgba(255, 255, 255, 0.03)',
                            border: `1.5px solid ${isSelected ? '#7C3AED' : 'rgba(255, 255, 255, 0.08)'}`,
                            borderRadius: 10,
                            padding: '12px 16px',
                            color: isSelected ? '#C4B5FD' : '#E2E8F0',
                            fontSize: 13,
                            cursor: 'pointer',
                            textAlign: 'left',
                            display: 'flex',
                            alignItems: 'center',
                            gap: 10
                          });

export const s14 = ({isSelected}) => ({
                            width: 18, height: 18, borderRadius: '50%',
                            border: `2px solid ${isSelected ? '#A855F7' : '#64748B'}`,
                            display: 'flex', alignItems: 'center', justifyContent: 'center'
                          });

export const s15 = ({currentQuizQIdx}) => ({
                        background: 'transparent', border: '1px solid rgba(255, 255, 255, 0.15)',
                        color: '#FFFFFF', padding: '6px 14px', borderRadius: 8,
                        fontSize: 12, cursor: currentQuizQIdx === 0 ? 'not-allowed' : 'pointer',
                        opacity: currentQuizQIdx === 0 ? 0.4 : 1
                      });

export const s16 = ({submittingQuiz,quizAnswers}) => ({
                          background: '#10B981', color: '#FFFFFF', border: 'none',
                          padding: '6px 18px', borderRadius: 8, fontSize: 12,
                          fontWeight: 700, cursor: submittingQuiz || quizAnswers.includes(null) ? 'not-allowed' : 'pointer',
                          opacity: submittingQuiz || quizAnswers.includes(null) ? 0.5 : 1
                        });