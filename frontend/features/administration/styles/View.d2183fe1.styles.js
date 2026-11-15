export const s0 = ({loading}) => ({
              marginTop: 10,
              padding: '12px',
              borderRadius: 12,
              background: loading ? '#64748B' : 'linear-gradient(135deg, #A855F7 0%, #7C3AED 100%)',
              border: 'none',
              color: '#FFFFFF',
              fontSize: 14,
              fontWeight: 700,
              cursor: loading ? 'not-allowed' : 'pointer',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: 8,
              boxShadow: '0 4px 18px rgba(168, 85, 247, 0.4)',
              transition: 'all 0.2s'
            });
