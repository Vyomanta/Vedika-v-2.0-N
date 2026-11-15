const styles = {
  s0: {
        display: 'flex',
        flexDirection: 'column',
        gap: 12,
        width: '100%',
        height: '100%',
        justifyContent: 'center', // Vertically centered so no empty gap below
        alignItems: 'center',
        padding: '6px 0',
        boxSizing: 'border-box',
        position: 'relative'
      },
  s1: {
                      position: 'absolute',
                      top: -16,
                      left: -1,
                      width: 16,
                      height: 16,
                      pointerEvents: 'none',
                      overflow: 'visible',
                      zIndex: 25
                    },
  s2: {
                      position: 'absolute',
                      bottom: -16,
                      left: -1,
                      width: 16,
                      height: 16,
                      pointerEvents: 'none',
                      overflow: 'visible',
                      zIndex: 25
                    },
  s3: { position: 'relative', display: 'flex', alignItems: 'center', justifyContent: 'center' },
  s4: {
      display: 'flex',
      alignItems: 'center',
      gap: 8,
      width: '100%'
    },
  s5: { display: 'flex', alignItems: 'center', gap: 5 }
};
export default styles;
