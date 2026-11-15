export const s0 = ({isViewportLocked,isLabPage,isHomePage}) => ({
        display: 'flex',
        flexDirection: 'column',
        height: (isViewportLocked || isLabPage) ? '100dvh' : 'auto',
        minHeight: '100dvh',
        maxHeight: (isViewportLocked || isLabPage) ? '100dvh' : 'none',
        background: isHomePage ? '#02050c' : 'var(--bg)',
        color: isHomePage ? '#f8fafc' : 'var(--text)',
        width: '100%',
        position: 'relative',
        overflow: (isViewportLocked || isLabPage) ? 'hidden' : 'visible'
      });

export const s1 = ({isLabPage,isViewportLocked,isAskVedika,isHomePage}) => ({
          position: 'relative',
          width: '100%',
          boxSizing: 'border-box',
          overflowY: isLabPage ? 'auto' : (isViewportLocked ? 'hidden' : 'auto'),
          overflowX: 'hidden',
          height: isAskVedika ? '100dvh' : 'calc(100dvh - 54px)',
          maxHeight: isAskVedika ? '100dvh' : 'calc(100dvh - 54px)',
          minHeight: 'calc(100dvh - 54px)',
          marginTop: isAskVedika ? 0 : '54px',
          paddingTop: 0,
          background: isHomePage ? '#02050c' : 'var(--bg)'
        });
