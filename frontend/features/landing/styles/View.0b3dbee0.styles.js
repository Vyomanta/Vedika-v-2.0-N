export const s0 = ({activeSample,key}) => ({
                  background: activeSample === key ? 'rgba(56, 189, 248, 0.2)' : 'rgba(255,255,255,0.05)',
                  border: activeSample === key ? '1px solid #38BDF8' : '1px solid rgba(255,255,255,0.1)',
                  color: activeSample === key ? '#38BDF8' : '#94A3B8',
                  fontSize: 12,
                  padding: '6px 12px',
                  borderRadius: 6,
                  cursor: 'pointer',
                  transition: 'all 0.2s'
                });
