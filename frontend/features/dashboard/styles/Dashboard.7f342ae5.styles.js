export const s0 = ({rPad}) => ({ padding: `8px ${rPad}px 32px`, fontFamily: 'var(--font-outfit), sans-serif', maxWidth: 1400, margin: '0 auto' });

export const s1 = ({isMobile}) => ({
        display: 'grid',
        gridTemplateColumns: isMobile ? '1fr' : '1.14fr 0.86fr',
        alignItems: 'center',
        gap: isMobile ? 20 : 36,
        padding: isMobile ? '8px 0' : '4px 0 8px 0',
        minHeight: isMobile ? 'auto' : 540,
        height: isMobile ? 'auto' : 'calc(100vh - 88px)',
        maxHeight: isMobile ? 'none' : 'calc(100vh - 88px)',
        marginBottom: 24,
        position: 'relative'
      });

export const s2 = ({isMobile}) => ({
          zIndex: 2,
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'center',
          alignItems: isMobile ? 'center' : 'flex-start',
          textAlign: isMobile ? 'center' : 'left',
          paddingLeft: isMobile ? 0 : 'clamp(24px, 4vw, 92px)',
          gap: isMobile ? 8 : 12
        });

export const s3 = ({isMobile}) => (`
            @keyframes maskSlideInRight {
              0% {
                transform: translate3d(108%, 0, 0);
              }
              100% {
                transform: translate3d(0, 0, 0);
              }
            }
            @keyframes maskSlideInLeft {
              0% {
                transform: translate3d(-108%, 0, 0);
              }
              100% {
                transform: translate3d(0, 0, 0);
              }
            }
            .hero-title-h1 {
              margin: 0;
              padding: 0;
              display: flex;
              flex-direction: column;
              gap: 4px;
              user-select: none;
            }
            .hero-title-row {
              display: flex;
              align-items: baseline;
              flex-wrap: nowrap;
            }
            .hero-title-row-2 {
              padding-left: ${isMobile ? '0px' : 'clamp(20px, 2.6vw, 46px)'};
            }
            .title-charts-cont {
              display: inline-flex;
              overflow: hidden;
              position: relative;
              vertical-align: top;
            }
            .title-charts-cont u {
              display: inline-flex;
              text-decoration: none;
              overflow: hidden;
              position: relative;
              padding: 4px 0;
              margin: -4px 0;
            }
            .title-charts-cont span {
              display: inline-block;
              will-change: transform;
              -webkit-transform: translate3d(0, 0, 0);
              transform: translate3d(0, 0, 0);
              backface-visibility: hidden;
              -webkit-backface-visibility: hidden;
            }
            /* Syllable animation definitions matching Codepen CustomEase: cubic-bezier(0.52, 0, 0.48, 1) */
            .syl-ve {
              animation: maskSlideInRight 1.5s cubic-bezier(0.52, 0, 0.48, 1) 0.04s both;
            }
            .syl-di {
              animation: maskSlideInLeft 1.5s cubic-bezier(0.52, 0, 0.48, 1) 0.22s both;
            }
            .syl-ka {
              animation: maskSlideInRight 1.5s cubic-bezier(0.52, 0, 0.48, 1) 0.40s both;
            }
            .syl-ai {
              animation: maskSlideInLeft 1.5s cubic-bezier(0.52, 0, 0.48, 1) 0.18s both;
            }
            .syl-tu {
              animation: maskSlideInRight 1.5s cubic-bezier(0.52, 0, 0.48, 1) 0.36s both;
            }
            .syl-tor {
              animation: maskSlideInLeft 1.5s cubic-bezier(0.52, 0, 0.48, 1) 0.54s both;
            }
            .row2-gradient-text {
              background: linear-gradient(135deg, #FFFFFF 0%, #D8B4FE 45%, #818CF8 100%);
              -webkit-background-clip: text;
              -webkit-text-fill-color: transparent;
              filter: drop-shadow(0 6px 28px rgba(168, 85, 247, 0.35));
            }
            [data-theme="light"] .row2-gradient-text {
              background: linear-gradient(135deg, #4338CA 0%, #7C3AED 50%, #9333EA 100%);
              -webkit-background-clip: text;
              -webkit-text-fill-color: transparent;
              filter: drop-shadow(0 4px 20px rgba(124, 58, 237, 0.25));
            }
          `);

export const s4 = ({isMobile}) => ({
                fontSize: isMobile ? 'clamp(30px, 9.2vw, 52px)' : 'clamp(82px, 8.8vw, 138px)',
                fontWeight: 900,
                lineHeight: 0.94,
                letterSpacing: '-0.035em',
                color: 'var(--text, #FFFFFF)',
                fontFamily: "'Plus Jakarta Sans', 'Syne', var(--font-outfit), -apple-system, sans-serif",
                textTransform: 'uppercase',
                textShadow: '0 4px 35px rgba(255, 255, 255, 0.18)'
              });

export const s5 = ({isMobile}) => ({
                fontSize: isMobile ? 'clamp(22px, 6.5vw, 38px)' : 'clamp(72px, 7.8vw, 122px)',
                fontWeight: 850,
                lineHeight: 0.98,
                letterSpacing: '-0.03em',
                fontFamily: "'Plus Jakarta Sans', 'Syne', var(--font-outfit), -apple-system, sans-serif",
                textTransform: 'uppercase'
              });

export const s6 = ({isMobile}) => ({ marginRight: isMobile ? '12px' : 'clamp(16px, 2vw, 32px)' });

export const s7 = ({isMobile}) => ({
          zIndex: 2,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          width: '100%',
          height: isMobile ? 380 : 'calc(100vh - 100px)',
          maxHeight: isMobile ? 380 : 'calc(100vh - 100px)',
          position: 'relative'
        });

export const s8 = ({isMobile}) => ({ color: 'var(--text)', fontSize: isMobile ? 22 : 30, fontWeight: 800, margin: 0, letterSpacing: '-0.04em', display: 'flex', alignItems: 'center', gap: 10 });

export const s9 = ({isMobile}) => ({ color: 'var(--muted)', marginTop: 6, fontSize: isMobile ? 13.5 : 14.5 });

export const s10 = ({mainGridCols}) => ({ display: 'grid', gridTemplateColumns: mainGridCols, gap: 24, alignItems: 'start' });

export const s11 = ({statCols}) => ({ display: 'grid', gridTemplateColumns: statCols, gap: 14 });

export const s12 = ({color}) => ({ width: 28, height: 28, borderRadius: 8, background: `${color}15`, display: 'flex', alignItems: 'center', justifyContent: 'center' });

export const s13 = ({activeCourse}) => ({ background: 'var(--accent)', height: '100%', borderRadius: 99, width: `${activeCourse.progressPercent}%`, transition: 'width 0.5s' });

export const s14 = ({bottomCols}) => ({ display: 'grid', gridTemplateColumns: bottomCols, gap: 16 });

export const s15 = ({bottomCols}) => ({ display: 'grid', gridTemplateColumns: bottomCols, gap: 16 });

export const s16 = ({course}) => ({ background: 'var(--accent)', height: 6, borderRadius: 99, width: `${course.progressPercent}%`, transition: 'width 0.5s' });

export const s17 = ({task}) => ({
                    display: 'flex',
                    alignItems: 'center',
                    gap: 10,
                    padding: '10px 12px',
                    borderRadius: 10,
                    background: task.completed ? 'rgba(34, 197, 160, 0.05)' : 'var(--s2)',
                    border: `1px solid ${task.completed ? 'rgba(34, 197, 160, 0.2)' : 'var(--border)'}`,
                    cursor: 'pointer',
                    transition: 'all 0.15s'
                  });

export const s18 = ({task}) => ({
                    width: 18,
                    height: 18,
                    borderRadius: 4,
                    border: `2px solid ${task.completed ? 'var(--green)' : 'var(--muted)'}`,
                    background: task.completed ? 'var(--green)' : 'transparent',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    color: '#000',
                    fontSize: 11,
                    fontWeight: 900,
                    transition: 'all 0.15s'
                  });

export const s19 = ({task}) => ({
                    fontSize: 13,
                    color: task.completed ? 'var(--muted)' : 'var(--text)',
                    textDecoration: task.completed ? 'line-through' : 'none',
                    fontWeight: 500
                  });

export const s20 = ({optBg,optBorder,optColor,quizSubmitted}) => ({
                      background: optBg,
                      border: `1px solid ${optBorder}`,
                      borderRadius: 10,
                      padding: '10px 12px',
                      color: optColor,
                      fontSize: 12.5,
                      fontWeight: 500,
                      textAlign: 'left',
                      cursor: quizSubmitted ? 'default' : 'pointer',
                      transition: 'all 0.15s',
                      outline: 'none',
                      fontFamily: 'inherit'
                    });

export const s21 = ({selectedQuizOption,correctAnswerIdx}) => ({
                marginTop: 14,
                padding: '12px',
                borderRadius: 8,
                background: selectedQuizOption === correctAnswerIdx ? 'rgba(34, 197, 160, 0.08)' : 'rgba(245, 91, 107, 0.08)',
                fontSize: 12,
                color: selectedQuizOption === correctAnswerIdx ? 'var(--green)' : 'var(--red)',
                lineHeight: 1.4
              });

export const s22 = ({conceptFlipped}) => ({
                background: conceptFlipped ? 'rgba(245, 169, 91, 0.08)' : 'var(--s2)',
                border: `1px solid ${conceptFlipped ? 'var(--amber)' : 'var(--border)'}`,
                borderRadius: 12,
                padding: '24px 16px',
                minHeight: 130,
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                justifyContent: 'center',
                textAlign: 'center',
                transition: 'all 0.3s ease',
                transformStyle: 'preserve-3d'
              });

export const s23 = ({conceptFlipped}) => ({ color: 'var(--text)', fontSize: conceptFlipped ? 13 : 15, fontWeight: conceptFlipped ? 500 : 700, margin: 0, lineHeight: 1.5 });
