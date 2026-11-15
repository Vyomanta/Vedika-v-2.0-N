export const s1 = ({isMobile}) => ({ marginBottom: isMobile ? 8 : 16 });

export const s2 = ({isMobile}) => ({
                  color: '#FFFFFF',
                  fontSize: isMobile ? 22 : 32,
                  fontWeight: 850,
                  margin: 0,
                  letterSpacing: '-0.03em',
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: 10
                });

export const s3 = ({isMobile}) => ({ color: '#94A3B8', fontSize: isMobile ? 12.5 : 13.5, margin: '6px 0 0', fontWeight: 500 });

export const s4 = ({isMobile}) => ({
                    display: 'grid',
                    gridTemplateColumns: isMobile ? '1fr' : 'repeat(3, minmax(0, 1fr))',
                    gap: 14,
                    alignItems: 'stretch',
                    width: '100%',
                    boxSizing: 'border-box'
                  });

export const s5 = ({qStatus}) => ({
                                background: qStatus.status === 'Passed'
                                  ? 'rgba(255, 255, 255, 0.06)'
                                  : 'linear-gradient(135deg, #FDE68A 0%, #F59E0B 100%)',
                                color: qStatus.status === 'Passed' ? '#FFFFFF' : '#000000',
                                border: qStatus.status === 'Passed' ? '1px solid rgba(255, 255, 255, 0.15)' : 'none',
                                padding: '6px 14px',
                                borderRadius: 8,
                                fontSize: 11.5,
                                fontWeight: 750,
                                cursor: 'pointer',
                                display: 'flex',
                                alignItems: 'center',
                                gap: 4,
                                boxShadow: 'none',
                                transform: 'none',
                                transition: 'none'
                              });