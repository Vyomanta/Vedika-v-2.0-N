export const s17 = ({isMobile}) => ({
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

export const s18 = ({existingUserSub,selectedAssignment}) => ({
                      padding: '10px 14px',
                      borderRadius: 10,
                      marginBottom: 14,
                      background: (existingUserSub.status === 'Pass' || (existingUserSub.score !== undefined && existingUserSub.score >= (selectedAssignment.pass_threshold || 70)))
                        ? 'rgba(16, 185, 129, 0.1)'
                        : (existingUserSub.status === 'Fail')
                        ? 'rgba(239, 68, 68, 0.1)'
                        : 'rgba(168, 85, 247, 0.1)',
                      border: `1px solid ${
                        (existingUserSub.status === 'Pass' || (existingUserSub.score !== undefined && existingUserSub.score >= (selectedAssignment.pass_threshold || 70)))
                          ? 'rgba(16, 185, 129, 0.3)'
                          : (existingUserSub.status === 'Fail')
                          ? 'rgba(239, 68, 68, 0.3)'
                          : 'rgba(168, 85, 247, 0.3)'
                      }`
                    });

export const s19 = ({existingUserSub}) => ({ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: existingUserSub.comments ? 4 : 0 });

export const s20 = ({existingUserSub,selectedAssignment}) => ({ fontSize: 12, fontWeight: 700, color: (existingUserSub.status === 'Pass' || (existingUserSub.score !== undefined && existingUserSub.score >= (selectedAssignment.pass_threshold || 70))) ? '#10B981' : (existingUserSub.status === 'Fail') ? '#EF4444' : '#C084FC' });

export const s21 = ({activeAssignmentQIdx,qIdx}) => ({
                            padding: '4px 12px',
                            borderRadius: 6,
                            fontSize: 11.5,
                            fontWeight: 600,
                            background: activeAssignmentQIdx === qIdx ? 'linear-gradient(135deg, #C084FC 0%, #A855F7 100%)' : 'rgba(255, 255, 255, 0.05)',
                            color: '#FFFFFF',
                            border: 'none',
                            cursor: 'pointer',
                            boxShadow: 'none', transform: 'none', transition: 'none'
                          });

export const s22 = ({selectedAssignment}) => ({
                          width: '100%',
                          padding: 16,
                          borderRadius: 10,
                          background: 'rgba(12, 8, 22, 0.95)',
                          border: '1.5px solid rgba(168, 85, 247, 0.35)',
                          color: '#FFFFFF',
                          fontSize: 13.5,
                          lineHeight: 1.6,
                          whiteSpace: 'pre-wrap',
                          fontFamily: selectedAssignment.type === 'Code' ? 'monospace' : 'inherit',
                          minHeight: 120,
                          boxSizing: 'border-box'
                        });

export const s23 = ({submittingAssignment}) => ({
                            background: 'linear-gradient(135deg, #C084FC 0%, #A855F7 100%)',
                            color: '#FFFFFF',
                            border: 'none',
                            padding: '7px 18px',
                            borderRadius: 8,
                            fontSize: 12,
                            fontWeight: 700,
                            cursor: submittingAssignment ? 'not-allowed' : 'pointer',
                            display: 'flex',
                            alignItems: 'center',
                            gap: 6,
                            boxShadow: 'none', transform: 'none', transition: 'none'
                          });