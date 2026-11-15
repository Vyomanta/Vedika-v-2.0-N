const styles = {
  s0: {
            filter: 'drop-shadow(0 2px 8px rgba(0, 0, 0, 0.75)) drop-shadow(0 0 4px rgba(255, 255, 255, 0.4))',
            display: 'block'
          },
  s1: {
          position: 'absolute',
          left: 12,
          top: 4,
          display: 'flex',
          alignItems: 'center',
          gap: 6,
          background: 'rgba(8, 12, 24, 0.92)',
          border: '1px solid rgba(255, 255, 255, 0.18)',
          borderRadius: 20,
          padding: '3px 9px',
          boxShadow: '0 8px 24px -4px rgba(0, 0, 0, 0.8), 0 0 12px rgba(255, 255, 255, 0.08)',
          backdropFilter: 'blur(12px)',
          WebkitBackdropFilter: 'blur(12px)',
          whiteSpace: 'nowrap',
          userSelect: 'none'
        },
  s2: {
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            width: 12,
            height: 12,
            borderRadius: '50%',
            background: 'rgba(255, 255, 255, 0.15)',
            border: '1px solid rgba(255, 255, 255, 0.3)'
          },
  s3: {
            fontSize: 10.5,
            fontWeight: 700,
            color: '#FFFFFF',
            letterSpacing: '0.02em'
          },
  s4: {
              fontSize: 9.5,
              fontWeight: 500,
              color: '#94A3B8',
              paddingLeft: 4,
              borderLeft: '1px solid rgba(255, 255, 255, 0.15)'
            }
};
export default styles;
