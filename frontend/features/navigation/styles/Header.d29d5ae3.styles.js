export const s0 = ({coursesDropdownOpen}) => ({ opacity: 0.7, transform: coursesDropdownOpen ? 'rotate(180deg)' : 'none', transition: 'transform 0.2s' });

export const s1 = ({mobileCoursesOpen}) => ({
                transform: mobileCoursesOpen ? 'rotate(180deg)' : 'none',
                transition: 'transform 0.2s ease',
                color: '#94a3b8'
              });

export const s2 = ({pathname,item}) => ({
                    display: 'flex',
                    alignItems: 'center',
                    gap: 10,
                    padding: '8px 10px',
                    borderRadius: 8,
                    background: pathname === item.path ? 'rgba(56, 189, 248, 0.14)' : 'rgba(255, 255, 255, 0.03)',
                    border: pathname === item.path ? '1px solid rgba(56, 189, 248, 0.35)' : '1px solid transparent',
                    color: pathname === item.path ? '#38bdf8' : '#e2e8f0',
                    cursor: 'pointer',
                    textAlign: 'left',
                    width: '100%',
                    boxSizing: 'border-box',
                    transition: 'all 0.15s ease'
                  });

export const s3 = ({isTopNavVisible,mobileMenuOpen}) => ({ pointerEvents: (isTopNavVisible || mobileMenuOpen) ? 'none' : 'auto' });
