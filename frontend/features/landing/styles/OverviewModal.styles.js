const styles = {
  s0: {
        position: 'fixed',
        inset: 0,
        zIndex: 9999,
        background: 'rgba(0, 0, 0, 0.72)',
        backdropFilter: 'blur(10px)',
        WebkitBackdropFilter: 'blur(10px)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        padding: 16,
        animation: 'fadeIn 0.2s ease-out'
      },
  s1: { display: 'flex', alignItems: 'center', gap: 10, minWidth: 0 },
  s2: { minWidth: 0 },
  s3: { display: 'flex', alignItems: 'center', gap: 8 },
  s4: {
          padding: '20px',
          overflowY: 'auto',
          display: 'flex',
          flexDirection: 'column',
          gap: 18
        },
  s5: { display: 'flex', flexDirection: 'column', gap: 8 },
  s6: { display: 'flex', alignItems: 'center', gap: 8 }
};
export default styles;
