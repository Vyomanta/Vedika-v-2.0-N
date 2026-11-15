export const s0 = ({opacity}) => ({
          position: 'absolute',
          inset: 0,
          overflow: 'hidden',
          background: '#040711',
          pointerEvents: 'none',
          zIndex: 0,
          opacity: opacity,
          transition: 'opacity 0.6s ease'
        });

export const s1 = ({waveConfig}) => ({
            position: 'absolute',
            top: `${waveConfig.wave1.top}vh`,
            left: `${waveConfig.wave1.left}vw`,
            width: `${waveConfig.wave1.width}vw`,
            minWidth: '2000px',
            height: `${waveConfig.wave1.height}vh`,
            opacity: waveConfig.wave1.opacity,
            transform: `rotate(${waveConfig.wave1.rot}deg) scale(${waveConfig.wave1.scale})`,
            transformOrigin: '0% 0%',
            filter: `blur(${waveConfig.wave1.blur}px)`,
            pointerEvents: 'none',
            maskImage: 'linear-gradient(to right, transparent 0%, rgba(0,0,0,0.5) 8%, black 16%, black 84%, rgba(0,0,0,0.5) 92%, transparent 100%)',
            WebkitMaskImage: 'linear-gradient(to right, transparent 0%, rgba(0,0,0,0.5) 8%, black 16%, black 84%, rgba(0,0,0,0.5) 92%, transparent 100%)',
            transition: 'none',
          });

export const s2 = ({waveConfig}) => ({
            position: 'absolute',
            bottom: `${waveConfig.wave2.bottom}vh`,
            right: `${waveConfig.wave2.right}vw`,
            width: `${waveConfig.wave2.width}vw`,
            minWidth: '2200px',
            height: `${waveConfig.wave2.height}vh`,
            opacity: waveConfig.wave2.opacity,
            transform: `rotate(${waveConfig.wave2.rot}deg) scale(${waveConfig.wave2.scale})`,
            transformOrigin: '100% 100%',
            filter: `blur(${waveConfig.wave2.blur}px)`,
            pointerEvents: 'none',
            maskImage: 'linear-gradient(to right, transparent 0%, rgba(0,0,0,0.5) 8%, black 16%, black 84%, rgba(0,0,0,0.5) 92%, transparent 100%)',
            WebkitMaskImage: 'linear-gradient(to right, transparent 0%, rgba(0,0,0,0.5) 8%, black 16%, black 84%, rgba(0,0,0,0.5) 92%, transparent 100%)',
            transition: 'none',
          });
