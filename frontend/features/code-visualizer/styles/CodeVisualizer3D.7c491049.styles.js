export const s0 = ({actionType}) => ({
                        background: actionType === 'SWAP' ? '#EF4444' : '#10B981',
                        color: '#ffffff',
                        fontSize: 8.5,
                        fontWeight: 800,
                        padding: '1px 5px',
                        borderRadius: 3,
                        fontFamily: 'monospace',
                        boxShadow: '0 2px 4px rgba(0,0,0,0.15)',
                        animation: 'bounce 0.8s infinite alternate'
                      });

export const s1 = ({selectedElement}) => ({ color: selectedElement.isPointed ? '#F87171' : '#8892B0' });

export const s2 = ({v}) => ({
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                  background: v.isChanged ? 'rgba(251, 191, 36, 0.1)' : 'rgba(255, 255, 255, 0.03)',
                  border: v.isChanged ? '1px solid rgba(251, 191, 36, 0.4)' : '1px solid rgba(255, 255, 255, 0.05)',
                  borderRadius: 6,
                  padding: '4px 8px',
                  transition: 'all 0.3s'
                });

export const s3 = ({v}) => ({
                    fontSize: 11,
                    fontFamily: 'monospace',
                    fontWeight: 800,
                    color: v.isChanged ? '#FBBF24' : (v.type === 'number' ? '#38BDF8' : (v.type === 'boolean' ? '#34D399' : '#F8FAFC'))
                  });
