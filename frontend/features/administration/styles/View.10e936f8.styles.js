export const s0 = ({health}) => ({
              width: 7,
              height: 7,
              borderRadius: '50%',
              background: health?.redis?.status === 'healthy' ? '#10B981' : '#F59E0B',
              boxShadow: `0 0 8px ${health?.redis?.status === 'healthy' ? '#10B981' : '#F59E0B'}`
            });

export const s1 = ({refreshing}) => ({
              padding: '6px 12px',
              borderRadius: 8,
              background: 'rgba(255, 255, 255, 0.06)',
              border: '1px solid rgba(255, 255, 255, 0.12)',
              color: '#CBD5E1',
              cursor: refreshing ? 'not-allowed' : 'pointer',
              display: 'flex',
              alignItems: 'center',
              gap: 6,
              fontSize: 12,
              fontWeight: 600,
              transition: 'all 0.15s'
            });

export const s2 = ({refreshing}) => ({ animation: refreshing ? 'spin 1s linear infinite' : 'none' });

export const s3 = ({isSel}) => ({
                  display: 'flex',
                  alignItems: 'center',
                  gap: 8,
                  padding: '9px 16px',
                  borderRadius: 10,
                  background: isSel ? 'rgba(168, 85, 247, 0.2)' : 'transparent',
                  border: isSel ? '1px solid #A855F7' : '1px solid transparent',
                  color: isSel ? '#FFFFFF' : '#94A3B8',
                  fontSize: 13,
                  fontWeight: isSel ? 700 : 500,
                  cursor: 'pointer',
                  transition: 'all 0.15s'
                });

export const s4 = ({isSel}) => ({
                    fontSize: 10,
                    padding: '2px 6px',
                    borderRadius: 10,
                    background: isSel ? '#A855F7' : 'rgba(255, 255, 255, 0.08)',
                    color: isSel ? '#fff' : '#94A3B8'
                  });

export const s5 = ({isSuspended}) => ({
                        borderBottom: '1px solid rgba(255, 255, 255, 0.05)',
                        opacity: isSuspended ? 0.65 : 1,
                        transition: 'background 0.15s'
                      });

export const s6 = ({org}) => ({
                            display: 'inline-block',
                            padding: '3px 8px',
                            borderRadius: 6,
                            fontSize: 11,
                            fontWeight: 700,
                            textTransform: 'uppercase',
                            background: org.plan === 'enterprise' ? 'rgba(168, 85, 247, 0.2)' : org.plan === 'pro' ? 'rgba(59, 130, 246, 0.2)' : 'rgba(255, 255, 255, 0.08)',
                            color: org.plan === 'enterprise' ? '#C084FC' : org.plan === 'pro' ? '#60A5FA' : '#CBD5E1',
                            border: `1px solid ${org.plan === 'enterprise' ? 'rgba(168, 85, 247, 0.4)' : org.plan === 'pro' ? 'rgba(59, 130, 246, 0.4)' : 'rgba(255, 255, 255, 0.15)'}`
                          });

export const s7 = ({seatPct}) => ({
                              width: `${seatPct}%`,
                              height: '100%',
                              background: seatPct > 90 ? '#EF4444' : seatPct > 75 ? '#F59E0B' : '#10B981'
                            });

export const s8 = ({voicePct}) => ({
                              width: `${voicePct}%`,
                              height: '100%',
                              background: voicePct > 90 ? '#EF4444' : voicePct > 70 ? '#F59E0B' : '#A855F7'
                            });

export const s9 = ({isSuspended}) => ({
                              padding: '4px 10px',
                              borderRadius: 16,
                              fontSize: 11,
                              fontWeight: 700,
                              cursor: 'pointer',
                              display: 'inline-flex',
                              alignItems: 'center',
                              gap: 5,
                              border: isSuspended ? '1px solid rgba(239, 68, 68, 0.4)' : '1px solid rgba(16, 185, 129, 0.4)',
                              background: isSuspended ? 'rgba(239, 68, 68, 0.15)' : 'rgba(16, 185, 129, 0.15)',
                              color: isSuspended ? '#FCA5A5' : '#6EE7B7'
                            });

export const s10 = ({isSuspended}) => ({ width: 6, height: 6, borderRadius: '50%', background: isSuspended ? '#EF4444' : '#10B981' });

export const s11 = ({voicePct}) => ({ width: `${voicePct}%`, height: '100%', background: voicePct > 85 ? '#EF4444' : '#10B981' });

export const s12 = ({tokensPct}) => ({ width: `${tokensPct}%`, height: '100%', background: tokensPct > 85 ? '#EF4444' : '#F59E0B' });
