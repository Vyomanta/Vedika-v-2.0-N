export const s6 = ({isMobile}) => ({ marginBottom: isMobile ? 8 : 16 });

export const s7 = ({isMobile}) => ({
                  color: '#FFFFFF',
                  fontSize: isMobile ? 22 : 32,
                  fontWeight: 850,
                  margin: 0,
                  letterSpacing: '-0.03em',
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: 10
                });

export const s8 = ({isMobile}) => ({ color: '#94A3B8', fontSize: isMobile ? 12.5 : 13.5, margin: '6px 0 0', fontWeight: 500 });

export const s9 = ({isMobile}) => ({
                    display: 'grid',
                    gridTemplateColumns: isMobile ? '1fr' : 'repeat(3, minmax(0, 1fr))',
                    gap: 14,
                    alignItems: 'stretch',
                    width: '100%',
                    boxSizing: 'border-box'
                  });

export const s10 = ({aStatus}) => ({
                                background: aStatus.status !== 'Not Submitted'
                                  ? 'rgba(255, 255, 255, 0.06)'
                                  : 'linear-gradient(135deg, #C084FC 0%, #A855F7 100%)',
                                color: '#FFFFFF',
                                border: aStatus.status !== 'Not Submitted' ? '1px solid rgba(255, 255, 255, 0.15)' : 'none',
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