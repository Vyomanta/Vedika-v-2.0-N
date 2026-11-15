export const s0 = ({isMobile}) => (`
          .box-container {
            width: 100%;
            max-width: 100%;
            height: 100%;
            max-height: 100%;
            display: flex;
            align-items: stretch;
            border-radius: 0;
            border: none;
            background: #090D18;
            overflow: hidden;
            position: relative;
            box-sizing: border-box;
            transition: box-shadow 0.45s ease;
          }

          .box-container.right-open {
            box-shadow: none;
          }

          .box1-content,
          .box1-side,
          .box2-content,
          .box2-side {
            transition: all 0.5s cubic-bezier(0.16, 1, 0.3, 1);
            overflow: hidden;
            position: relative;
            box-sizing: border-box;
          }

          .box1-side,
          .box2-side {
            display: flex;
            flex-direction: column;
            align-items: center;
            justify-content: space-between;
          }

          /* ACADEMIC VIVA VIEW (DEFAULT) */
          .box1-content {
            background: #090D18;
            flex: 7 !important;
            max-width: 74% !important;
            display: flex;
            flex-direction: column;
            opacity: 1 !important;
            min-width: 0;
            overflow-y: auto;
            padding: ${isMobile ? '16px 12px' : '26px 44px 26px 44px'};
            box-sizing: border-box;
            pointer-events: auto !important;
          }

          .box1-side {
            background: linear-gradient(180deg, rgba(20, 16, 44, 0.94) 0%, rgba(9, 13, 26, 0.98) 100%);
            border-left: 1px solid rgba(124, 58, 237, 0.2);
            flex: 3 !important;
            max-width: 26% !important;
            opacity: 1 !important;
            min-width: 0;
            padding: 24px 22px;
            pointer-events: auto !important;
          }

          /* TECHNICAL INTERVIEW VIEW (COLLAPSED IN DEFAULT) */
          .box2-side {
            background: linear-gradient(180deg, rgba(10, 24, 44, 0.94) 0%, rgba(7, 13, 24, 0.98) 100%);
            border-right: none !important;
            flex: 0 0 0% !important;
            max-width: 0px !important;
            width: 0px !important;
            opacity: 0 !important;
            min-width: 0 !important;
            padding: 0 !important;
            margin: 0 !important;
            border: none !important;
            pointer-events: none !important;
          }

          .box2-content {
            background: #070B14;
            flex: 0 0 0% !important;
            max-width: 0px !important;
            width: 0px !important;
            opacity: 0 !important;
            min-width: 0 !important;
            padding: 0 !important;
            margin: 0 !important;
            border: none !important;
            pointer-events: none !important;
            overflow-y: auto;
            display: flex;
            flex-direction: column;
            box-sizing: border-box;
          }

          /* RIGHT-OPEN STATE (TECHNICAL INTERVIEW ACTIVE) */
          .box-container.right-open .box1-content {
            flex: 0 0 0% !important;
            max-width: 0px !important;
            width: 0px !important;
            padding: 0 !important;
            margin: 0 !important;
            border: none !important;
            opacity: 0 !important;
            pointer-events: none !important;
          }

          .box-container.right-open .box1-side {
            flex: 0 0 0% !important;
            max-width: 0px !important;
            width: 0px !important;
            padding: 0 !important;
            margin: 0 !important;
            border: none !important;
            opacity: 0 !important;
            pointer-events: none !important;
          }

          .box-container.right-open .box2-side {
            flex: 3 !important;
            max-width: 26% !important;
            opacity: 1 !important;
            padding: 24px 22px !important;
            border-right: 1px solid rgba(14, 165, 233, 0.2) !important;
            pointer-events: auto !important;
          }

          .box-container.right-open .box2-content {
            flex: 7 !important;
            max-width: 74% !important;
            opacity: 1 !important;
            padding: ${isMobile ? '16px 12px' : '26px 44px 26px 44px'} !important;
            pointer-events: auto !important;
          }

          @keyframes heroFloat {
            0%, 100% {
              transform: translateY(0px) scale(1.18);
            }
            50% {
              transform: translateY(-4px) scale(1.22);
            }
          }

          @keyframes botFloatBounce {
            0%, 100% {
              transform: translateY(0px) rotate(0deg);
            }
            50% {
              transform: translateY(-8px) rotate(0.8deg);
            }
          }

          @keyframes pulseGlowRing {
            0%, 100% {
              transform: scale(0.95);
              opacity: 0.3;
            }
            50% {
              transform: scale(1.08);
              opacity: 0.7;
            }
          }

          @media (max-width: 960px) {
            .box-container {
              border-radius: 0;
              border: none;
              width: 100% !important;
              max-width: 100% !important;
              height: 100%;
              max-height: 100%;
            }
            .box1-side,
            .box2-side,
            .box-container .box1-side,
            .box-container .box2-side,
            .box-container.right-open .box1-side,
            .box-container.right-open .box2-side {
              display: none !important;
              width: 0px !important;
              max-width: 0px !important;
              flex: 0 0 0% !important;
              border: none !important;
              padding: 0 !important;
              margin: 0 !important;
              opacity: 0 !important;
              pointer-events: none !important;
            }
            .box1-content,
            .box-container .box1-content {
              display: flex !important;
              flex-direction: column !important;
              flex: 1 1 100% !important;
              width: 100% !important;
              max-width: 100% !important;
              min-width: 100% !important;
              opacity: 1 !important;
              pointer-events: auto !important;
              padding: 10px 14px 12px !important;
              border: none !important;
              height: 100% !important;
              max-height: 100% !important;
              overflow: hidden !important;
              box-sizing: border-box !important;
            }
            .box2-content,
            .box-container .box2-content {
              display: none !important;
              width: 0px !important;
              max-width: 0px !important;
              flex: 0 0 0% !important;
              border: none !important;
              opacity: 0 !important;
              pointer-events: none !important;
            }
            .box-container.right-open .box1-content {
              display: none !important;
              width: 0px !important;
              max-width: 0px !important;
              flex: 0 0 0% !important;
              border: none !important;
              opacity: 0 !important;
              pointer-events: none !important;
            }
            .box-container.right-open .box2-content {
              display: flex !important;
              flex-direction: column !important;
              flex: 1 1 100% !important;
              width: 100% !important;
              max-width: 100% !important;
              min-width: 100% !important;
              opacity: 1 !important;
              pointer-events: auto !important;
              padding: 10px 14px 12px !important;
              border: none !important;
              height: 100% !important;
              max-height: 100% !important;
              overflow: hidden !important;
              box-sizing: border-box !important;
            }
            .step-progress-wrapper {
              margin: 46px 0 24px 0 !important;
            }
            .step-circle .step-caption {
              font-size: 10.5px !important;
              bottom: -20px !important;
            }
            .hero-actor-container {
              bottom: 12px !important;
              width: 30px !important;
              height: 30px !important;
              margin-left: -15px !important;
            }
            .hero-sprite-frame {
              width: 30px !important;
              height: 30px !important;
              background-size: 180px 30px !important;
            }
            .hero-sprite-frame.playing {
              animation: playHeroLandingSpriteMobile 1.0s steps(5) forwards !important;
            }
            .hero-sprite-frame.settled {
              background-position: -150px 0px !important;
            }
            @keyframes playHeroLandingSpriteMobile {
              0% { background-position: 0px 0px; }
              100% { background-position: -150px 0px; }
            }

            /* Mobile Flight Trajectories: Gentle horizontal glide without flying up near the Back button */
            .hero-actor-container.ironman.entering {
              animation: ironmanRealisticFlightMobile 1.0s cubic-bezier(0.25, 1, 0.5, 1) forwards !important;
            }
            @keyframes ironmanRealisticFlightMobile {
              0% { transform: translate3d(-14px, 0px, 0) scale(0.9); opacity: 0; }
              100% { transform: translate3d(0, 0, 0) scale(1); opacity: 1; }
            }

            .hero-actor-container.batman.entering {
              animation: batmanRealisticGlideMobile 1.0s cubic-bezier(0.25, 1, 0.5, 1) forwards !important;
            }
            @keyframes batmanRealisticGlideMobile {
              0% { transform: translate3d(0, 0px, 0) scale(0.9); opacity: 0; }
              100% { transform: translate3d(0, 0, 0) scale(1); opacity: 1; }
            }

            .hero-actor-container.doctorstrange.entering {
              animation: doctorStrangeRealisticEmergenceMobile 1.0s cubic-bezier(0.25, 1, 0.5, 1) forwards !important;
            }
            @keyframes doctorStrangeRealisticEmergenceMobile {
              0% { transform: translate3d(0, 0px, 0) scale(0.9); opacity: 0; }
              100% { transform: translate3d(0, 0, 0) scale(1); opacity: 1; }
            }

            .hero-actor-container.superman.entering {
              animation: supermanRealisticSonicLandingMobile 1.0s cubic-bezier(0.25, 1, 0.5, 1) forwards !important;
            }
            @keyframes supermanRealisticSonicLandingMobile {
              0% { transform: translate3d(14px, 0px, 0) scale(0.9); opacity: 0; }
              100% { transform: translate3d(0, 0, 0) scale(1); opacity: 1; }
            }

            .mobile-particle-stage {
              display: flex;
              flex-direction: column;
              align-items: center;
              justify-content: center;
              position: relative;
              width: 100%;
              height: 185px;
              margin: 4px 0 2px 0 !important;
              flex-shrink: 0;
            }
            .mobile-particle-stage.fixed-stage {
              height: 185px;
              margin: 4px 0 2px 0 !important;
              flex-shrink: 0;
            }
            .mobile-particle-aura {
              position: absolute;
              width: 195px !important;
              height: 195px !important;
              border-radius: 50%;
              filter: blur(28px);
              pointer-events: none;
            }
            .mobile-mode-switch-btn {
              width: 100%;
              margin-top: 6px;
              padding: 10px 18px;
              border-radius: 12px;
              font-size: 0.86rem;
              font-weight: 700;
              display: flex;
              align-items: center;
              justify-content: center;
              gap: 8px;
              cursor: pointer;
              transition: all 0.2s cubic-bezier(0.16, 1, 0.3, 1);
              outline: none;
            }
            .mobile-mode-switch-btn.interview-style {
              background: linear-gradient(135deg, #0284C7 0%, #0EA5E9 100%);
              color: #FFFFFF;
              border: 1px solid rgba(56, 189, 248, 0.4);
              box-shadow: 0 4px 16px rgba(14, 165, 233, 0.35);
            }
            .mobile-mode-switch-btn.interview-style:hover {
              background: linear-gradient(135deg, #0EA5E9 0%, #38BDF8 100%);
              box-shadow: 0 6px 20px rgba(14, 165, 233, 0.55);
              transform: translateY(-1px);
            }
            .mobile-mode-switch-btn.viva-style {
              background: linear-gradient(135deg, #6D28D9 0%, #7C3AED 100%);
              color: #FFFFFF;
              border: 1px solid rgba(168, 85, 247, 0.4);
              box-shadow: 0 4px 16px rgba(124, 58, 237, 0.35);
            }
            .mobile-mode-switch-btn.viva-style:hover {
              background: linear-gradient(135deg, #7C3AED 0%, #8B5CF6 100%);
              box-shadow: 0 6px 20px rgba(124, 58, 237, 0.55);
              transform: translateY(-1px);
            }
          }

          /* ============================================================== */
          /* HORIZONTAL 4-STEP PROGRESS BAR (SUPERHERO VEDIKA BOTS)        */
          /* ============================================================== */
          .step-progress-wrapper {
            display: flex;
            justify-content: center;
            align-items: center;
            width: 100%;
            margin: 50px 0 46px 0;
            position: relative;
            flex-shrink: 0;
          }

          .step-progress-container {
            display: flex;
            justify-content: space-between;
            align-items: center;
            position: relative;
            width: 100%;
            max-width: 480px;
            padding: 0 14px;
            box-sizing: border-box;
          }

          .step-progress-container::before {
            content: "";
            background-color: rgba(255, 255, 255, 0.14);
            position: absolute;
            top: 50%;
            left: 21px;
            right: 21px;
            transform: translateY(-50%);
            height: 4px;
            z-index: 0;
            border-radius: 2px;
          }

          .step-progress-bar {
            position: absolute;
            top: 50%;
            left: 21px;
            transform: translateY(-50%);
            height: 4px;
            z-index: 0;
            transition: width 0.4s cubic-bezier(0.4, 0, 0.2, 1);
            border-radius: 2px;
          }

          .step-progress-bar.viva-bar {
            background: linear-gradient(90deg, #7C3AED, #C084FC);
            box-shadow: 0 0 14px rgba(168, 85, 247, 0.65);
          }

          .step-progress-bar.interview-bar {
            background: linear-gradient(90deg, #0EA5E9, #38BDF8);
            box-shadow: 0 0 14px rgba(14, 165, 233, 0.65);
          }

          .step-circle {
            background: #1E293B;
            border-radius: 50%;
            height: 14px;
            width: 14px;
            display: flex;
            align-items: center;
            justify-content: center;
            border: 3px solid rgba(255, 255, 255, 0.25);
            transition: all 0.4s ease;
            position: relative;
            z-index: 1;
            cursor: pointer;
          }

          .step-circle.active.viva-circle {
            border-color: #A855F7;
            background-color: #FFFFFF;
            box-shadow: 0 0 16px rgba(168, 85, 247, 0.85);
            transform: scale(1.18);
          }

          .step-circle.active.interview-circle {
            border-color: #38BDF8;
            background-color: #FFFFFF;
            box-shadow: 0 0 16px rgba(14, 165, 233, 0.85);
            transform: scale(1.18);
          }

          /* ======================================================= */
          /* SUPERHERO REALISTIC SPRITE SHEET SEQUENTIAL SYSTEM      */
          /* ======================================================= */
          .hero-actor-container {
            position: absolute;
            bottom: 22px;
            left: 50%;
            margin-left: -25px;
            width: 50px;
            height: 50px;
            pointer-events: none;
            z-index: 2;
            will-change: transform, opacity;
            transform-origin: bottom center;
          }

          .hero-sprite-frame {
            width: 50px;
            height: 50px;
            background-size: 300px 50px;
            background-repeat: no-repeat;
            display: block;
            image-rendering: -webkit-optimize-contrast;
            pointer-events: none;
            user-select: none;
          }

          .hero-sprite-frame.ironman {
            background-image: url('/spritesheet-ironman.png');
          }
          .hero-sprite-frame.batman {
            background-image: url('/spritesheet-batman.png');
          }
          .hero-sprite-frame.doctorstrange {
            background-image: url('/spritesheet-doctorstrange.png');
          }
          .hero-sprite-frame.superman {
            background-image: url('/spritesheet-superman.png');
          }

          /* 6-Frame Sequential Playback: Dive -> Flare -> Touchdown -> Impact Shockwave -> Rise -> Hero Stance */
          .hero-sprite-frame.playing {
            animation: playHeroLandingSprite 1.0s steps(5) forwards;
          }

          .hero-sprite-frame.settled {
            background-position: -250px 0px;
          }

          @keyframes playHeroLandingSprite {
            0% { background-position: 0px 0px; }
            100% { background-position: -250px 0px; }
          }

          /* --- 1. IRON MAN: DIVE & REPULSOR SLAM LANDING TRAJECTORY --- */
          .hero-actor-container.ironman.entering {
            animation: ironmanRealisticFlight 1.0s cubic-bezier(0.25, 1, 0.5, 1) forwards;
          }

          @keyframes ironmanRealisticFlight {
            0% {
              transform: translate3d(-48px, -36px, 0) scale(0.85);
              opacity: 0;
            }
            30% {
              opacity: 1;
              transform: translate3d(-18px, -14px, 0) scale(0.96);
            }
            58% {
              /* Touchdown impact aligns with Frame 3 repulsor shockwave */
              transform: translate3d(0px, 0px, 0) scale(1.02);
            }
            75% {
              transform: translate3d(0px, 0px, 0) scale(0.99);
            }
            100% {
              transform: translate3d(0px, 0px, 0) scale(1);
              opacity: 1;
            }
          }

          /* --- 2. BATMAN: SHADOW DROP & BAT WINGS GLIDE LANDING TRAJECTORY --- */
          .hero-actor-container.batman.entering {
            animation: batmanRealisticGlide 1.0s cubic-bezier(0.25, 1, 0.5, 1) forwards;
          }

          @keyframes batmanRealisticGlide {
            0% {
              transform: translate3d(0px, -48px, 0) scale(0.88);
              opacity: 0;
            }
            35% {
              opacity: 1;
              transform: translate3d(0px, -18px, 0) scale(0.96);
            }
            60% {
              /* Touchdown aligns with Frame 3 cape wrap crouch */
              transform: translate3d(0px, 0px, 0) scale(1.02);
            }
            78% {
              transform: translate3d(0px, 0px, 0) scale(0.99);
            }
            100% {
              transform: translate3d(0px, 0px, 0) scale(1);
              opacity: 1;
            }
          }

          /* --- 3. DOCTOR STRANGE: FIERY PORTAL EMERGENCE TRAJECTORY --- */
          .hero-actor-container.doctorstrange.entering {
            animation: doctorStrangeRealisticEmergence 1.0s cubic-bezier(0.25, 1, 0.5, 1) forwards;
          }

          @keyframes doctorStrangeRealisticEmergence {
            0% {
              transform: translate3d(0px, -12px, 0) scale(0.85);
              opacity: 0;
            }
            25% {
              opacity: 1;
              transform: translate3d(0px, -6px, 0) scale(0.96);
            }
            58% {
              /* Steps through threshold into rune splash touchdown */
              transform: translate3d(0px, 0px, 0) scale(1.02);
            }
            80% {
              transform: translate3d(0px, -2px, 0) scale(1);
            }
            100% {
              transform: translate3d(0px, 0px, 0) scale(1);
              opacity: 1;
            }
          }

          /* --- 4. SUPERMAN: SUPERSONIC SLAM TRAJECTORY --- */
          .hero-actor-container.superman.entering {
            animation: supermanRealisticSonicLanding 1.0s cubic-bezier(0.25, 1, 0.5, 1) forwards;
          }

          @keyframes supermanRealisticSonicLanding {
            0% {
              transform: translate3d(45px, -36px, 0) scale(0.85);
              opacity: 0;
            }
            30% {
              opacity: 1;
              transform: translate3d(18px, -14px, 0) scale(0.96);
            }
            55% {
              /* Ground slam impact synchronized with Frame 2/3 crater shockwave */
              transform: translate3d(0px, 0px, 0) scale(1.04);
            }
            75% {
              transform: translate3d(0px, 0px, 0) scale(0.99);
            }
            100% {
              transform: translate3d(0px, 0px, 0) scale(1);
              opacity: 1;
            }
          }

          /* --- AMBIENT IDLE DOCKING STATES --- */
          .hero-actor-container.idle.ironman,
          .hero-actor-container.idle.doctorstrange {
            animation: heroSmoothHover 2.8s ease-in-out infinite;
          }

          .hero-actor-container.idle.batman,
          .hero-actor-container.idle.superman {
            animation: heroSmoothStance 3.2s ease-in-out infinite;
          }

          @keyframes heroSmoothHover {
            0%, 100% { transform: translate3d(0, 0px, 0); }
            50% { transform: translate3d(0, -4px, 0); }
          }
          @keyframes heroSmoothStance {
            0%, 100% { transform: translate3d(0, 0px, 0) scale(1); }
            50% { transform: translate3d(0, -1.5px, 0) scale(1.02); }
          }

          /* Locked Stepper Circle Styling */
          .step-circle.locked-circle {
            background: rgba(15, 23, 42, 0.8) !important;
            border: 2px dashed rgba(255, 255, 255, 0.2) !important;
            box-shadow: none !important;
            cursor: not-allowed !important;
            opacity: 0.5;
            transform: scale(0.95);
            transition: all 0.3s ease;
          }
          .step-circle.locked-circle:hover {
            border-color: rgba(255, 255, 255, 0.35) !important;
            opacity: 0.65;
          }
          .step-caption.locked-caption {
            color: #475569 !important;
            opacity: 0.65;
          }

          .step-circle .step-caption {
            position: absolute;
            font-size: 13px;
            font-weight: 700;
            bottom: -28px;
            left: 50%;
            transform: translateX(-50%);
            white-space: nowrap;
            pointer-events: none;
            transition: all 0.3s ease;
            letter-spacing: 0.01em;
          }

          .step-btn {
            border: 0;
            border-radius: 12px;
            cursor: pointer;
            font-family: inherit;
            font-size: 0.84rem;
            font-weight: 700;
            padding: 8px 22px;
            display: inline-flex;
            align-items: center;
            justify-content: center;
            gap: 6px;
            transition: all 0.2s ease;
          }

          .step-btn.viva-btn {
            background: #7C3AED;
            color: #FFFFFF;
            box-shadow: 0 4px 16px rgba(124, 58, 237, 0.4);
          }
          .step-btn.viva-btn:hover:not(:disabled) {
            background: #8B5CF6;
            box-shadow: 0 6px 20px rgba(124, 58, 237, 0.6);
            transform: translateY(-1px);
          }

          .step-btn.interview-btn {
            background: #0EA5E9;
            color: #FFFFFF;
            box-shadow: 0 4px 16px rgba(14, 165, 233, 0.4);
          }
          .step-btn.interview-btn:hover:not(:disabled) {
            background: #38BDF8;
            box-shadow: 0 6px 20px rgba(14, 165, 233, 0.6);
            transform: translateY(-1px);
          }

          .step-btn.prev-btn {
            background: rgba(255, 255, 255, 0.06);
            border: 1px solid rgba(255, 255, 255, 0.12);
            color: #CBD5E1;
          }
          .step-btn.prev-btn:hover:not(:disabled) {
            background: rgba(255, 255, 255, 0.12);
            color: #FFFFFF;
          }

          .step-btn:active:not(:disabled) {
            transform: scale(0.95);
          }

          .step-btn:disabled {
            background: rgba(255, 255, 255, 0.05) !important;
            border-color: rgba(255, 255, 255, 0.06) !important;
            color: #475569 !important;
            cursor: not-allowed;
            box-shadow: none !important;
            transform: none !important;
          }
        `);

export const s1 = ({isMobile}) => ({
              display: 'flex',
              justifyContent: 'flex-start',
              alignItems: 'center',
              marginBottom: isMobile ? 12 : 6,
              paddingTop: isMobile ? 4 : 0,
              flexShrink: 0,
              position: 'relative',
              zIndex: 10
            });

export const s2 = ({setupStep}) => ({ width: `calc((100% - 42px) * ${((setupStep - 1) / 3)})` });

export const s3 = ({isCurrent,isPassed}) => ({
                          color: isCurrent ? '#FFFFFF' : isPassed ? '#C4B5FD' : '#64748B',
                          textShadow: isCurrent ? '0 0 10px rgba(168, 85, 247, 0.5)' : 'none'
                        });

export const s4 = ({isMobile}) => ({ flex: 1, minHeight: 0, overflowY: isMobile ? 'auto' : 'visible', display: 'flex', flexDirection: 'column' });

export const s5 = ({isMobile}) => ({ display: 'flex', flexDirection: 'column', flex: 1, justifyContent: isMobile ? 'flex-start' : 'space-between', gap: isMobile ? 18 : 0, minHeight: 0 });

export const s6 = ({isMobile}) => ({
                    fontSize: isMobile ? '1.35rem' : '1.6rem',
                    fontWeight: 800,
                    color: '#FFFFFF',
                    margin: '0 0 4px 0',
                    letterSpacing: '-0.01em'
                  });

export const s7 = ({isMobile}) => ({
                      marginTop: 8,
                      padding: isMobile ? '10px 12px' : '16px 20px',
                      borderRadius: 14,
                      background: 'rgba(124, 58, 237, 0.06)',
                      border: '1px solid rgba(124, 58, 237, 0.2)',
                      display: 'flex',
                      flexDirection: 'column',
                      gap: 8,
                      cursor: isMobile ? 'pointer' : 'default',
                      transition: 'all 0.2s ease'
                    });

export const s8 = ({isMobile}) => ({ display: 'flex', flexDirection: 'column', flex: 1, justifyContent: isMobile ? 'flex-start' : 'space-between', gap: isMobile ? 12 : 0, minHeight: 0 });

export const s9 = ({isMobile}) => ({
                    fontSize: isMobile ? '1.30rem' : '1.5rem',
                    fontWeight: 800,
                    color: '#FFFFFF',
                    margin: '0 0 4px 0',
                    letterSpacing: '-0.01em'
                  });

export const s10 = ({isMobile}) => ({
                    fontSize: isMobile ? '0.78rem' : '0.84rem',
                    color: '#94A3B8',
                    margin: '0 0 12px 0'
                  });

export const s11 = ({isMobile}) => ({ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: isMobile ? 6 : 10 });

export const s12 = ({isMobile,isSelected}) => ({
                                padding: isMobile ? '9px 6px' : '12px 14px',
                                borderRadius: 12,
                                background: isSelected ? 'rgba(124, 58, 237, 0.22)' : 'rgba(255, 255, 255, 0.03)',
                                border: isSelected ? '1.5px solid #7C3AED' : '1px solid rgba(255, 255, 255, 0.08)',
                                cursor: 'pointer',
                                textAlign: isMobile ? 'center' : 'left',
                                transition: 'all 0.15s ease',
                                boxShadow: isSelected ? '0 0 14px rgba(124, 58, 237, 0.3)' : 'none'
                              });

export const s13 = ({isMobile,isSelected}) => ({ fontWeight: 700, fontSize: isMobile ? '0.76rem' : '0.86rem', color: isSelected ? '#FFFFFF' : '#E2E8F0' });

export const s14 = ({isMobile}) => ({ fontSize: isMobile ? '0.62rem' : '0.72rem', color: '#94A3B8', marginTop: 2, lineHeight: 1.2 });

export const s15 = ({isMobile}) => ({ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: isMobile ? 6 : 10 });

export const s16 = ({isMobile,isSelected}) => ({
                                padding: isMobile ? '9px 6px' : '12px 14px',
                                borderRadius: 12,
                                background: isSelected ? 'rgba(124, 58, 237, 0.22)' : 'rgba(255, 255, 255, 0.03)',
                                border: isSelected ? '1.5px solid #7C3AED' : '1px solid rgba(255, 255, 255, 0.08)',
                                cursor: 'pointer',
                                textAlign: isMobile ? 'center' : 'left',
                                transition: 'all 0.15s ease',
                                boxShadow: isSelected ? '0 0 14px rgba(124, 58, 237, 0.3)' : 'none'
                              });

export const s17 = ({isMobile,isSelected}) => ({ fontWeight: 700, fontSize: isMobile ? '0.76rem' : '0.86rem', color: isSelected ? '#FFFFFF' : '#E2E8F0' });

export const s18 = ({isMobile}) => ({ fontSize: isMobile ? '0.62rem' : '0.72rem', color: '#94A3B8', marginTop: 2, lineHeight: 1.2 });

export const s19 = ({isMobile}) => ({ display: 'flex', flexDirection: 'column', flex: 1, justifyContent: isMobile ? 'flex-start' : 'space-between', gap: isMobile ? 12 : 0, minHeight: 0 });

export const s20 = ({isMobile}) => ({
                    fontSize: isMobile ? '1.30rem' : '1.5rem',
                    fontWeight: 800,
                    color: '#FFFFFF',
                    margin: '0 0 4px 0',
                    letterSpacing: '-0.01em'
                  });

export const s21 = ({isMobile}) => ({
                    fontSize: isMobile ? '0.78rem' : '0.84rem',
                    color: '#94A3B8',
                    margin: '0 0 12px 0'
                  });

export const s22 = ({isMobile}) => ({ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: isMobile ? 8 : 10 });

export const s23 = ({isMobile,executionMode}) => ({
                            padding: isMobile ? '9px 10px' : '12px 14px',
                            borderRadius: 12,
                            background: executionMode === 'live' ? 'rgba(124, 58, 237, 0.22)' : 'rgba(255, 255, 255, 0.03)',
                            border: executionMode === 'live' ? '1.5px solid #7C3AED' : '1px solid rgba(255, 255, 255, 0.08)',
                            cursor: 'pointer',
                            boxShadow: executionMode === 'live' ? '0 0 14px rgba(124, 58, 237, 0.3)' : 'none',
                            transition: 'all 0.15s ease'
                          });

export const s24 = ({isMobile}) => ({ display: 'flex', alignItems: 'center', gap: 6, fontWeight: 700, color: '#FFFFFF', fontSize: isMobile ? '0.78rem' : '0.86rem' });

export const s25 = ({isMobile}) => ({ fontSize: isMobile ? '0.62rem' : '0.72rem', color: '#94A3B8', marginTop: 3, lineHeight: 1.3 });

export const s26 = ({isMobile,executionMode}) => ({
                            padding: isMobile ? '9px 10px' : '12px 14px',
                            borderRadius: 12,
                            background: executionMode === 'turn' ? 'rgba(124, 58, 237, 0.22)' : 'rgba(255, 255, 255, 0.03)',
                            border: executionMode === 'turn' ? '1.5px solid #7C3AED' : '1px solid rgba(255, 255, 255, 0.08)',
                            cursor: 'pointer',
                            boxShadow: executionMode === 'turn' ? '0 0 14px rgba(124, 58, 237, 0.3)' : 'none',
                            transition: 'all 0.15s ease'
                          });

export const s27 = ({isMobile}) => ({ display: 'flex', alignItems: 'center', gap: 6, fontWeight: 700, color: '#FFFFFF', fontSize: isMobile ? '0.78rem' : '0.86rem' });

export const s28 = ({isMobile}) => ({ fontSize: isMobile ? '0.62rem' : '0.72rem', color: '#94A3B8', marginTop: 3, lineHeight: 1.3 });

export const s29 = ({isMobile}) => ({ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: isMobile ? 6 : 10 });

export const s30 = ({isMobile,isSelected}) => ({
                                padding: isMobile ? '9px 6px' : '12px 14px',
                                borderRadius: 12,
                                background: isSelected ? 'rgba(124, 58, 237, 0.22)' : 'rgba(255, 255, 255, 0.03)',
                                border: isSelected ? '1.5px solid #7C3AED' : '1px solid rgba(255, 255, 255, 0.08)',
                                cursor: 'pointer',
                                textAlign: isMobile ? 'center' : 'left',
                                transition: 'all 0.15s ease',
                                boxShadow: isSelected ? '0 0 14px rgba(124, 58, 237, 0.3)' : 'none'
                              });

export const s31 = ({isMobile,isSelected}) => ({ fontWeight: 700, fontSize: isMobile ? '0.76rem' : '0.86rem', color: isSelected ? '#FFFFFF' : '#E2E8F0' });

export const s32 = ({isMobile}) => ({ fontSize: isMobile ? '0.62rem' : '0.72rem', color: '#94A3B8', marginTop: 2, lineHeight: 1.2 });

export const s33 = ({isMobile}) => ({ display: 'flex', flexDirection: 'column', flex: 1, justifyContent: isMobile ? 'flex-start' : 'space-between', gap: isMobile ? 12 : 0, minHeight: 0 });

export const s34 = ({isMobile}) => ({
                    fontSize: isMobile ? '1.25rem' : '1.45rem',
                    fontWeight: 800,
                    color: '#FFFFFF',
                    margin: '0 0 2px 0',
                    letterSpacing: '-0.01em'
                  });

export const s35 = ({isMobile}) => ({
                    fontSize: isMobile ? '0.78rem' : '0.82rem',
                    color: '#94A3B8',
                    margin: '0 0 10px 0'
                  });

export const s36 = ({isMobile}) => ({
                    padding: isMobile ? '9px 12px' : '11px 16px',
                    borderRadius: 12,
                    background: 'rgba(255, 255, 255, 0.03)',
                    border: '1px solid rgba(124, 58, 237, 0.3)',
                    boxShadow: '0 4px 16px rgba(0, 0, 0, 0.2)',
                    marginBottom: 8
                  });

export const s37 = ({isMobile}) => ({ display: 'grid', gridTemplateColumns: isMobile ? '1fr 1fr' : 'repeat(2, 1fr)', gap: '4px 10px' });

export const s38 = ({isMobile}) => ({ fontSize: isMobile ? '0.78rem' : '0.84rem', fontWeight: 700, color: '#FFFFFF' });

export const s39 = ({isMobile}) => ({ fontSize: isMobile ? '0.78rem' : '0.84rem', fontWeight: 700, color: '#A78BFA', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap', display: 'block' });

export const s40 = ({isMobile}) => ({ fontSize: isMobile ? '0.78rem' : '0.84rem', fontWeight: 700, color: '#FFFFFF' });

export const s41 = ({difficulty}) => ({
                          fontSize: '0.72rem',
                          fontWeight: 700,
                          padding: '1px 6px',
                          borderRadius: 6,
                          background: difficulty === 'Easy' ? 'rgba(16, 185, 129, 0.2)' : difficulty === 'Medium' ? 'rgba(245, 158, 11, 0.2)' : 'rgba(239, 68, 68, 0.2)',
                          color: difficulty === 'Easy' ? '#10B981' : difficulty === 'Medium' ? '#F59E0B' : '#EF4444',
                          display: 'inline-block',
                          marginTop: 1
                        });

export const s42 = ({isMobile}) => ({ fontSize: isMobile ? '0.76rem' : '0.82rem', fontWeight: 600, color: '#E2E8F0' });

export const s43 = ({isMobile}) => ({ fontSize: isMobile ? '0.76rem' : '0.82rem', fontWeight: 600, color: '#E2E8F0' });

export const s44 = ({isMobile}) => ({
                    padding: isMobile ? '6px 10px' : '8px 12px',
                    borderRadius: 10,
                    background: 'rgba(255, 255, 255, 0.02)',
                    border: '1px solid rgba(255, 255, 255, 0.06)',
                    display: 'flex',
                    flexDirection: 'column',
                    gap: 4
                  });

export const s45 = ({isMobile}) => ({ display: 'flex', alignItems: 'center', gap: 6, fontSize: isMobile ? '0.72rem' : '0.76rem', color: '#CBD5E1' });

export const s46 = ({isMobile}) => ({ display: 'flex', alignItems: 'center', gap: 6, fontSize: isMobile ? '0.72rem' : '0.76rem', color: '#CBD5E1' });

export const s47 = ({isMobile}) => ({ display: 'flex', alignItems: 'center', gap: 6, fontSize: isMobile ? '0.72rem' : '0.76rem', color: '#CBD5E1' });

export const s48 = ({isMobile}) => ({
              marginTop: 'auto',
              flexShrink: 0,
              paddingTop: 8,
              paddingBottom: isMobile ? 6 : 0,
              display: 'flex',
              flexDirection: 'column',
              gap: 6,
              zIndex: 10
            });

export const s49 = ({setupStep}) => ({
                display: 'flex',
                justifyContent: setupStep === 1 ? 'flex-end' : 'space-between',
                alignItems: 'center',
                gap: 10
              });

export const s50 = ({interviewStep}) => ({ width: `calc((100% - 42px) * ${((interviewStep - 1) / 3)})` });

export const s51 = ({isCurrent,isPassed}) => ({
                      color: isCurrent ? '#FFFFFF' : isPassed ? '#7DD3FC' : '#64748B',
                      textShadow: isCurrent ? '0 0 10px rgba(14, 165, 233, 0.5)' : 'none'
                    });

export const s52 = ({isMobile}) => ({ flex: 1, minHeight: 0, overflowY: isMobile ? 'auto' : 'visible', display: 'flex', flexDirection: 'column' });

export const s53 = ({isMobile}) => ({ display: 'flex', flexDirection: 'column', flex: 1, justifyContent: isMobile ? 'flex-start' : 'space-between', gap: isMobile ? 12 : 0, minHeight: 0 });

export const s54 = ({isMobile}) => ({
                fontSize: isMobile ? '1.30rem' : '1.85rem',
                fontWeight: 800,
                margin: 0,
                color: '#F8FAFC',
                letterSpacing: '-0.02em',
                lineHeight: 1.2
              });

export const s55 = ({isMobile}) => ({
                fontSize: isMobile ? '0.78rem' : '0.88rem',
                color: '#94A3B8',
                marginTop: 4,
                marginBottom: 14
              });

export const s56 = ({isMobile}) => ({
                  marginTop: 6,
                  padding: isMobile ? '10px 12px' : '16px 20px',
                  borderRadius: 14,
                  background: 'rgba(14, 165, 233, 0.05)',
                  border: '1px solid rgba(14, 165, 233, 0.2)',
                  display: 'flex',
                  flexDirection: 'column',
                  gap: 8,
                  cursor: isMobile ? 'pointer' : 'default',
                  transition: 'all 0.2s ease'
                });

export const s57 = ({isMobile}) => ({ display: 'flex', flexDirection: 'column', flex: 1, justifyContent: isMobile ? 'flex-start' : 'space-between', gap: isMobile ? 12 : 0, minHeight: 0 });

export const s58 = ({isMobile}) => ({
                fontSize: isMobile ? '1.30rem' : '1.85rem',
                fontWeight: 800,
                margin: 0,
                color: '#F8FAFC',
                letterSpacing: '-0.02em',
                lineHeight: 1.2
              });

export const s59 = ({isMobile}) => ({
                fontSize: isMobile ? '0.78rem' : '0.88rem',
                color: '#94A3B8',
                marginTop: 4,
                marginBottom: 12
              });

export const s60 = ({isMobile}) => ({ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: isMobile ? 6 : 10 });

export const s61 = ({isMobile,isSel}) => ({
                            padding: isMobile ? '9px 6px' : '12px 14px',
                            borderRadius: 12,
                            cursor: 'pointer',
                            textAlign: isMobile ? 'center' : 'left',
                            background: isSel ? 'rgba(14, 165, 233, 0.18)' : 'rgba(255, 255, 255, 0.03)',
                            border: isSel ? '1.5px solid #0EA5E9' : '1px solid rgba(255, 255, 255, 0.08)',
                            transition: 'all 0.2s ease',
                            boxShadow: isSel ? '0 0 14px rgba(14, 165, 233, 0.3)' : 'none'
                          });

export const s62 = ({isMobile,isSel}) => ({ fontSize: isMobile ? '0.76rem' : '0.86rem', fontWeight: 700, color: isSel ? '#38BDF8' : '#F8FAFC' });

export const s63 = ({isMobile}) => ({ fontSize: isMobile ? '0.62rem' : '0.72rem', color: '#64748B', marginTop: 2, lineHeight: 1.2 });

export const s64 = ({isMobile,isSel}) => ({
                            padding: isMobile ? '5px 12px' : '8px 16px',
                            borderRadius: 9999,
                            fontSize: isMobile ? '0.76rem' : '0.84rem',
                            fontWeight: 700,
                            cursor: 'pointer',
                            background: isSel ? 'rgba(14, 165, 233, 0.25)' : 'rgba(255, 255, 255, 0.04)',
                            border: isSel ? '1.5px solid #0EA5E9' : '1px solid rgba(255, 255, 255, 0.08)',
                            color: isSel ? '#38BDF8' : '#CBD5E1',
                            boxShadow: isSel ? '0 0 12px rgba(14, 165, 233, 0.35)' : 'none',
                            transition: 'all 0.2s ease'
                          });

export const s65 = ({isMobile}) => ({ display: 'flex', flexDirection: 'column', flex: 1, justifyContent: isMobile ? 'flex-start' : 'space-between', gap: isMobile ? 12 : 0, minHeight: 0 });

export const s66 = ({isMobile}) => ({
                fontSize: isMobile ? '1.30rem' : '1.85rem',
                fontWeight: 800,
                margin: 0,
                color: '#F8FAFC',
                letterSpacing: '-0.02em',
                lineHeight: 1.2
              });

export const s67 = ({isMobile}) => ({
                fontSize: isMobile ? '0.78rem' : '0.88rem',
                color: '#94A3B8',
                marginTop: 4,
                marginBottom: 12
              });

export const s68 = ({isMobile}) => ({ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: isMobile ? 6 : 10 });

export const s69 = ({isMobile,isSel}) => ({
                            padding: isMobile ? '9px 6px' : '12px 14px',
                            borderRadius: 12,
                            cursor: 'pointer',
                            textAlign: isMobile ? 'center' : 'left',
                            background: isSel ? 'rgba(14, 165, 233, 0.18)' : 'rgba(255, 255, 255, 0.03)',
                            border: isSel ? '1.5px solid #0EA5E9' : '1px solid rgba(255, 255, 255, 0.08)',
                            transition: 'all 0.2s ease',
                            boxShadow: isSel ? '0 0 14px rgba(14, 165, 233, 0.3)' : 'none'
                          });

export const s70 = ({isMobile,isSel}) => ({ fontSize: isMobile ? '0.76rem' : '0.86rem', fontWeight: 700, color: isSel ? '#38BDF8' : '#F8FAFC' });

export const s71 = ({isMobile}) => ({ fontSize: isMobile ? '0.62rem' : '0.72rem', color: '#64748B', marginTop: 2, lineHeight: 1.2 });

export const s72 = ({isMobile}) => ({ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: isMobile ? 8 : 10 });

export const s73 = ({isMobile,executionMode}) => ({
                        padding: isMobile ? '9px 10px' : '12px 14px',
                        borderRadius: 12,
                        background: executionMode === 'live' ? 'rgba(14, 165, 233, 0.18)' : 'rgba(255, 255, 255, 0.03)',
                        border: executionMode === 'live' ? '1.5px solid #0EA5E9' : '1px solid rgba(255, 255, 255, 0.08)',
                        cursor: 'pointer',
                        boxShadow: executionMode === 'live' ? '0 0 14px rgba(14, 165, 233, 0.3)' : 'none',
                        transition: 'all 0.15s ease'
                      });

export const s74 = ({isMobile}) => ({ display: 'flex', alignItems: 'center', gap: 6, fontWeight: 700, color: '#FFFFFF', fontSize: isMobile ? '0.78rem' : '0.86rem' });

export const s75 = ({isMobile}) => ({ fontSize: isMobile ? '0.62rem' : '0.72rem', color: '#94A3B8', marginTop: 3, lineHeight: 1.3 });

export const s76 = ({isMobile,executionMode}) => ({
                        padding: isMobile ? '9px 10px' : '12px 14px',
                        borderRadius: 12,
                        background: executionMode === 'turn' ? 'rgba(14, 165, 233, 0.18)' : 'rgba(255, 255, 255, 0.03)',
                        border: executionMode === 'turn' ? '1.5px solid #0EA5E9' : '1px solid rgba(255, 255, 255, 0.08)',
                        cursor: 'pointer',
                        boxShadow: executionMode === 'turn' ? '0 0 14px rgba(14, 165, 233, 0.3)' : 'none',
                        transition: 'all 0.15s ease'
                      });

export const s77 = ({isMobile}) => ({ display: 'flex', alignItems: 'center', gap: 6, fontWeight: 700, color: '#FFFFFF', fontSize: isMobile ? '0.78rem' : '0.86rem' });

export const s78 = ({isMobile}) => ({ fontSize: isMobile ? '0.62rem' : '0.72rem', color: '#94A3B8', marginTop: 3, lineHeight: 1.3 });

export const s79 = ({isMobile}) => ({ display: 'flex', flexDirection: 'column', flex: 1, justifyContent: isMobile ? 'flex-start' : 'space-between', gap: isMobile ? 12 : 0, minHeight: 0 });

export const s80 = ({isMobile}) => ({
                fontSize: isMobile ? '1.30rem' : '1.85rem',
                fontWeight: 800,
                margin: 0,
                color: '#F8FAFC',
                letterSpacing: '-0.02em',
                lineHeight: 1.2
              });

export const s81 = ({isMobile}) => ({
                fontSize: isMobile ? '0.78rem' : '0.88rem',
                color: '#94A3B8',
                marginTop: 4,
                marginBottom: 12
              });

export const s82 = ({isMobile}) => ({
                padding: isMobile ? '10px 14px' : '16px 20px',
                borderRadius: 14,
                background: 'rgba(14, 165, 233, 0.05)',
                border: '1px solid rgba(14, 165, 233, 0.25)',
                marginBottom: 10
              });

export const s83 = ({isMobile}) => ({ display: 'grid', gridTemplateColumns: isMobile ? '1fr 1fr' : 'repeat(2, 1fr)', gap: '6px 12px' });

export const s84 = ({isMobile}) => ({ fontSize: isMobile ? '0.80rem' : '0.9rem', fontWeight: 700, color: '#38BDF8', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap', display: 'block' });

export const s85 = ({isMobile}) => ({ fontSize: isMobile ? '0.80rem' : '0.9rem', fontWeight: 700, color: '#F1F5F9' });

export const s86 = ({isMobile}) => ({ fontSize: isMobile ? '0.80rem' : '0.9rem', fontWeight: 700, color: '#F1F5F9' });

export const s87 = ({isMobile}) => ({ fontSize: isMobile ? '0.78rem' : '0.84rem', fontWeight: 600, color: '#E2E8F0' });

export const s88 = ({isMobile}) => ({
                padding: isMobile ? '8px 12px' : '12px 16px',
                borderRadius: 12,
                background: 'rgba(255, 255, 255, 0.02)',
                border: '1px solid rgba(255, 255, 255, 0.06)',
                display: 'flex',
                flexDirection: 'column',
                gap: 5
              });

export const s89 = ({isMobile}) => ({ display: 'flex', alignItems: 'center', gap: 6, fontSize: isMobile ? '0.74rem' : '0.8rem', color: '#CBD5E1' });

export const s90 = ({isMobile}) => ({ display: 'flex', alignItems: 'center', gap: 6, fontSize: isMobile ? '0.74rem' : '0.8rem', color: '#CBD5E1' });

export const s91 = ({isMobile}) => ({ display: 'flex', alignItems: 'center', gap: 6, fontSize: isMobile ? '0.74rem' : '0.8rem', color: '#CBD5E1' });

export const s92 = ({isMobile}) => ({
      width: '100%',
      minHeight: '100%',
      height: '100%',
      overflowY: 'auto',
      background: 'var(--bg)',
      color: 'var(--text)',
      fontFamily: 'var(--font-outfit), sans-serif',
      padding: isMobile ? '12px 10px 32px 10px' : '16px 20px 40px 20px',
      boxSizing: 'border-box'
    });

export const s93 = ({}) => ({
          display: 'flex',
          flexWrap: 'wrap',
          alignItems: 'center',
          justifyContent: 'space-between',
          borderBottom: `1px solid var(--border)`,
          paddingBottom: 10,
          gap: 10
        });

export const s94 = ({}) => ({
                padding: '8px 10px',
                borderRadius: 12,
                background: 'var(--s2)',
                border: `1px solid var(--border)`,
                color: 'var(--muted)',
                display: 'inline-flex',
                alignItems: 'center',
                justifyContent: 'center',
                cursor: 'pointer',
                transition: 'all 0.2s ease'
              });

export const s95 = ({isMobile}) => ({
                margin: 0,
                fontSize: isMobile ? '1.25rem' : '1.5rem',
                fontWeight: 800,
                background: 'linear-gradient(135deg, var(--purple) 0%, var(--accent) 100%)',
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent',
                display: 'flex',
                alignItems: 'center',
                gap: 8
              });

export const s96 = ({sessionTimeRemaining}) => ({
                padding: '6px 14px',
                borderRadius: 12,
                background: sessionTimeRemaining < 180 ? 'rgba(239, 68, 68, 0.15)' : 'var(--s2)',
                border: `1px solid ${sessionTimeRemaining < 180 ? '#EF4444' : 'var(--border)'}`,
                fontSize: '0.85rem',
                fontWeight: 800,
                color: sessionTimeRemaining < 180 ? '#EF4444' : 'var(--text)',
                display: 'flex',
                alignItems: 'center',
                gap: 6
              });

export const s97 = ({sessionTimeRemaining}) => ({ color: sessionTimeRemaining < 180 ? '#EF4444' : 'var(--purple)' });

export const s98 = ({isMobile}) => ({
                background: 'var(--s1)',
                border: '1px solid var(--border)',
                borderRadius: 20,
                padding: isMobile ? '16px 14px' : '24px 26px',
                display: 'flex',
                flexDirection: 'column',
                gap: 20
              });

export const s99 = ({accuracy}) => ({ fontSize: '1.4rem', fontWeight: 900, color: accuracy >= 70 ? '#10B981' : accuracy >= 50 ? 'var(--amber)' : '#EF4444' });

export const s100 = ({isCorrect,isUnanswered}) => ({
                            background: 'var(--s2)',
                            border: `1px solid ${isCorrect ? 'rgba(16, 185, 129, 0.4)' : isUnanswered ? 'var(--border)' : 'rgba(239, 68, 68, 0.4)'}`,
                            borderRadius: 14,
                            padding: '14px 16px',
                            display: 'flex',
                            flexDirection: 'column',
                            gap: 10
                          });

export const s101 = ({isCorrect,isUnanswered}) => ({
                              padding: '2px 8px',
                              borderRadius: 6,
                              fontSize: '0.75rem',
                              fontWeight: 800,
                              background: isCorrect ? 'rgba(16, 185, 129, 0.15)' : isUnanswered ? 'var(--s1)' : 'rgba(239, 68, 68, 0.15)',
                              color: isCorrect ? '#10B981' : isUnanswered ? 'var(--muted)' : '#EF4444'
                            });

export const s102 = ({isMobile}) => ({ display: 'grid', gridTemplateColumns: isMobile ? '1fr' : '1fr 1fr', gap: 8, marginTop: 4 });

export const s103 = ({bg,border,color}) => ({
                                    padding: '8px 12px',
                                    borderRadius: 8,
                                    background: bg,
                                    border: `1px solid ${border}`,
                                    color: color,
                                    fontSize: '0.8rem',
                                    fontWeight: 600,
                                    display: 'flex',
                                    alignItems: 'center',
                                    justifyContent: 'space-between'
                                  });

export const s104 = ({}) => ({
                  background: 'var(--s1)',
                  border: `1px solid var(--border)`,
                  borderRadius: 16,
                  padding: '12px 18px',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  flexWrap: 'wrap',
                  gap: 10
                });

export const s105 = ({currentAptQuestion}) => ({
                      padding: '4px 10px',
                      borderRadius: 8,
                      background: currentAptQuestion.difficulty === 'Easy' ? 'rgba(16, 185, 129, 0.15)' : currentAptQuestion.difficulty === 'Medium' ? 'rgba(139, 92, 246, 0.15)' : 'rgba(245, 158, 11, 0.15)',
                      color: currentAptQuestion.difficulty === 'Easy' ? '#10B981' : currentAptQuestion.difficulty === 'Medium' ? 'var(--purple)' : 'var(--amber)',
                      fontSize: '0.75rem',
                      fontWeight: 800,
                      border: `1px solid ${currentAptQuestion.difficulty === 'Easy' ? '#10B98140' : currentAptQuestion.difficulty === 'Medium' ? 'var(--purple)40' : 'var(--amber)40'}`
                    });

export const s106 = ({aptTimer}) => ({
                      padding: '6px 14px',
                      borderRadius: 10,
                      background: aptTimer < 30 ? 'rgba(239, 68, 68, 0.15)' : aptTimer < 60 ? 'rgba(245, 158, 11, 0.15)' : 'var(--s2)',
                      border: `1px solid ${aptTimer < 30 ? '#EF4444' : aptTimer < 60 ? 'var(--amber)' : 'var(--border)'}`,
                      color: aptTimer < 30 ? '#EF4444' : aptTimer < 60 ? 'var(--amber)' : 'var(--text)',
                      fontSize: '0.85rem',
                      fontWeight: 800,
                      display: 'flex',
                      alignItems: 'center',
                      gap: 6
                    });

export const s107 = ({aptTimer}) => ({ color: aptTimer < 30 ? '#EF4444' : 'var(--purple)' });

export const s108 = ({bg,color,border,exists}) => ({
                          minWidth: 32,
                          height: 32,
                          borderRadius: 8,
                          background: bg,
                          color: color,
                          border: `1px solid ${border}`,
                          fontSize: '0.75rem',
                          fontWeight: 800,
                          cursor: exists ? 'pointer' : 'not-allowed',
                          display: 'inline-flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          opacity: exists ? 1 : 0.4,
                          flexShrink: 0
                        });

export const s109 = ({isMobile}) => ({
                  background: 'var(--s1)',
                  border: `1px solid var(--border)`,
                  borderRadius: 20,
                  padding: isMobile ? '16px 14px' : '22px 24px',
                  boxShadow: '0 8px 32px rgba(0, 0, 0, 0.04)',
                  display: 'flex',
                  flexDirection: 'column',
                  gap: 16
                });

export const s110 = ({isMobile}) => ({
                    display: 'grid',
                    gridTemplateColumns: isMobile ? '1fr' : '1fr 1fr',
                    gap: 12,
                    marginTop: 8
                  });

export const s111 = ({btnBg,btnBorder,btnColor,isAnswerRevealed}) => ({
                            padding: '14px 16px',
                            borderRadius: 12,
                            background: btnBg,
                            border: `2px solid ${btnBorder}`,
                            color: btnColor,
                            fontSize: '0.9rem',
                            fontWeight: 700,
                            textAlign: 'left',
                            cursor: isAnswerRevealed ? 'default' : 'pointer',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'space-between',
                            transition: 'all 0.15s ease'
                          });

export const s112 = ({btnBorder}) => ({
                              width: 24,
                              height: 24,
                              borderRadius: '50%',
                              background: 'var(--s1)',
                              border: `1px solid ${btnBorder}`,
                              display: 'inline-flex',
                              alignItems: 'center',
                              justifyContent: 'center',
                              fontSize: '0.75rem',
                              fontWeight: 800
                            });

export const s113 = ({}) => ({
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    flexWrap: 'wrap',
                    gap: 10,
                    borderTop: `1px solid var(--border)`,
                    paddingTop: 16,
                    marginTop: 6
                  });

export const s114 = ({showAptHint}) => ({
                          padding: '8px 14px',
                          borderRadius: 10,
                          background: showAptHint ? 'rgba(245, 158, 11, 0.15)' : 'var(--s2)',
                          border: `1px solid ${showAptHint ? 'var(--amber)' : 'var(--border)'}`,
                          color: showAptHint ? 'var(--amber)' : 'var(--text)',
                          fontSize: '0.8rem',
                          fontWeight: 700,
                          cursor: 'pointer',
                          display: 'flex',
                          alignItems: 'center',
                          gap: 6
                        });

export const s115 = ({showAptSolution}) => ({
                          padding: '8px 14px',
                          borderRadius: 10,
                          background: showAptSolution ? 'rgba(239, 68, 68, 0.15)' : 'var(--s2)',
                          border: `1px solid ${showAptSolution ? '#EF4444' : 'var(--border)'}`,
                          color: showAptSolution ? '#EF4444' : 'var(--muted)',
                          fontSize: '0.8rem',
                          fontWeight: 700,
                          cursor: showAptSolution ? 'default' : 'pointer',
                          display: 'flex',
                          alignItems: 'center',
                          gap: 6
                        });

export const s116 = ({aptSession}) => ({
                          padding: '8px 16px',
                          borderRadius: 10,
                          background: 'var(--s2)',
                          color: 'var(--text)',
                          border: '1px solid var(--border)',
                          fontSize: '0.85rem',
                          fontWeight: 800,
                          cursor: aptSession.currentIndex === 0 ? 'not-allowed' : 'pointer',
                          opacity: aptSession.currentIndex === 0 ? 0.5 : 1
                        });

export const s117 = ({generatingAiAptitude}) => ({
                            padding: '8px 16px',
                            borderRadius: 10,
                            background: 'linear-gradient(135deg, var(--amber) 0%, var(--purple) 100%)',
                            color: '#FFFFFF',
                            border: 'none',
                            fontSize: '0.85rem',
                            fontWeight: 800,
                            cursor: generatingAiAptitude ? 'not-allowed' : 'pointer',
                            display: 'flex',
                            alignItems: 'center',
                            gap: 6,
                            opacity: generatingAiAptitude ? 0.7 : 1,
                            boxShadow: '0 4px 14px rgba(245, 158, 11, 0.3)'
                          });

export const s118 = ({isMobile}) => ({
              background: 'var(--s1)',
              border: `1px solid var(--border)`,
              borderRadius: 24,
              padding: isMobile ? '20px 14px' : '28px 24px',
              boxShadow: '0 8px 32px rgba(0, 0, 0, 0.05)',
              display: 'flex',
              flexDirection: 'column',
              gap: 20
            });

export const s119 = ({}) => ({
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                flexWrap: 'wrap',
                gap: 10,
                borderBottom: `1px solid var(--border)`,
                paddingBottom: 14
              });

export const s120 = ({liveConnectionStatus}) => ({
                    width: 10,
                    height: 10,
                    borderRadius: '50%',
                    background: liveConnectionStatus === 'tutor-speaking' 
                      ? 'var(--purple)' 
                      : liveConnectionStatus === 'connected' 
                      ? '#10B981' 
                      : liveConnectionStatus === 'connecting' 
                      ? '#F59E0B' 
                      : 'var(--muted)',
                    animation: (liveConnectionStatus === 'tutor-speaking' || liveConnectionStatus === 'connected') ? 'pulse 1s infinite' : 'none'
                  });

export const s121 = ({liveConnectionStatus}) => ({
                    fontSize: '0.85rem',
                    fontWeight: 700,
                    color: liveConnectionStatus === 'tutor-speaking' ? 'var(--purple)' : liveConnectionStatus === 'connected' ? '#10B981' : (liveConnectionStatus === 'error' ? 'var(--red, #ef4444)' : 'var(--text)')
                  });

export const s122 = ({isScratchpadOpen}) => ({
                      padding: '5px 12px',
                      borderRadius: 8,
                      background: isScratchpadOpen ? 'rgba(139, 92, 246, 0.2)' : 'var(--s2)',
                      color: isScratchpadOpen ? 'var(--purple)' : 'var(--text)',
                      border: `1px solid ${isScratchpadOpen ? 'var(--purple)' : 'var(--border)'}`,
                      fontSize: '0.725rem',
                      fontWeight: 700,
                      cursor: 'pointer',
                      display: 'flex',
                      alignItems: 'center',
                      gap: 6,
                      transition: 'all 0.15s ease'
                    });

export const s123 = ({isTranscriptOpen}) => ({
                      padding: '5px 12px',
                      borderRadius: 8,
                      background: isTranscriptOpen ? 'rgba(16, 185, 129, 0.2)' : 'var(--s2)',
                      color: isTranscriptOpen ? '#10B981' : 'var(--text)',
                      border: `1px solid ${isTranscriptOpen ? '#10B981' : 'var(--border)'}`,
                      fontSize: '0.725rem',
                      fontWeight: 700,
                      cursor: 'pointer',
                      display: 'flex',
                      alignItems: 'center',
                      gap: 6,
                      transition: 'all 0.15s ease'
                    });

export const s124 = ({difficulty}) => ({
                    padding: '3px 8px',
                    borderRadius: 6,
                    background: difficulty === 'Easy' ? 'rgba(16, 185, 129, 0.15)' : difficulty === 'Hard' ? 'rgba(239, 68, 68, 0.15)' : 'rgba(79, 131, 246, 0.15)',
                    color: difficulty === 'Easy' ? '#10B981' : difficulty === 'Hard' ? '#EF4444' : 'var(--accent)',
                    fontSize: '0.7rem',
                    fontWeight: 700
                  });

export const s125 = ({scratchpadText}) => ({
                        padding: '6px 14px',
                        borderRadius: 8,
                        background: 'linear-gradient(135deg, var(--purple) 0%, var(--accent) 100%)',
                        color: '#FFFFFF',
                        border: 'none',
                        fontSize: '0.725rem',
                        fontWeight: 700,
                        cursor: scratchpadText.trim() ? 'pointer' : 'not-allowed',
                        opacity: scratchpadText.trim() ? 1 : 0.5,
                        display: 'flex',
                        alignItems: 'center',
                        gap: 6
                      });

export const s126 = ({isTranscriptOpen,isMobile}) => ({
                display: 'grid',
                gridTemplateColumns: (isTranscriptOpen && !isMobile) ? '1fr 340px' : '1fr',
                gap: 20,
                alignItems: 'start',
                minHeight: 340
              });

export const s127 = ({isMobile}) => ({
                  display: 'flex',
                  flexDirection: 'column',
                  alignItems: 'center',
                  justifyContent: 'center',
                  padding: isMobile ? '20px 12px' : '28px 20px',
                  background: 'var(--s2)',
                  borderRadius: 20,
                  border: '1px solid var(--border)',
                  gap: 18,
                  position: 'relative',
                  minHeight: 340
                });

export const s128 = ({isMobile,liveConnectionStatus,isSpeaking,isRecording}) => ({
                    maxWidth: isMobile ? '95%' : '80%',
                    width: '100%',
                    background: 'var(--s1)',
                    border: (liveConnectionStatus === 'tutor-speaking' || isSpeaking)
                      ? '1px solid rgba(139, 92, 246, 0.5)'
                      : (isRecording || liveConnectionStatus === 'connected')
                      ? '1px solid rgba(16, 185, 129, 0.5)'
                      : '1px solid var(--border)',
                    borderRadius: 18,
                    padding: '16px 20px',
                    boxShadow: (liveConnectionStatus === 'tutor-speaking' || isSpeaking)
                      ? '0 8px 24px rgba(139, 92, 246, 0.15)'
                      : '0 4px 16px rgba(0, 0, 0, 0.05)',
                    display: 'flex',
                    flexDirection: 'column',
                    gap: 6,
                    textAlign: 'center',
                    position: 'relative',
                    transition: 'all 0.2s ease'
                  });

export const s129 = ({isMobile}) => ({
                      margin: 0,
                      fontSize: isMobile ? '0.9rem' : '1.025rem',
                      fontWeight: 600,
                      color: 'var(--text)',
                      lineHeight: 1.55
                    });

export const s130 = ({isMobile,liveConnectionStatus}) => ({
                      width: isMobile ? 120 : 140,
                      height: isMobile ? 120 : 140,
                      borderRadius: '50%',
                      background: liveConnectionStatus === 'error' ? 'rgba(239, 68, 68, 0.12)' : (liveConnectionStatus === 'connected' ? 'rgba(16, 185, 129, 0.12)' : 'rgba(139, 92, 246, 0.12)'),
                      border: `2px solid ${liveConnectionStatus === 'error' ? 'var(--red, #ef4444)' : (liveConnectionStatus === 'connected' ? '#10B981' : 'var(--purple)')}`,
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      margin: '12px auto',
                      cursor: (liveConnectionStatus === 'error' || liveConnectionStatus === 'disconnected') ? 'pointer' : 'default',
                      boxShadow: liveConnectionStatus === 'connected' ? '0 0 20px rgba(16, 185, 129, 0.25)' : (liveConnectionStatus === 'tutor-speaking' ? '0 0 20px rgba(139, 92, 246, 0.25)' : 'none'),
                      transition: 'all 0.2s ease'
                    });

export const s131 = ({liveConnectionStatus}) => ({ fontSize: '0.75rem', color: liveConnectionStatus === 'error' ? 'var(--red, #ef4444)' : 'var(--muted)', marginTop: 4 });

export const s132 = ({isCandidate}) => ({ fontSize: '0.65rem', fontWeight: 700, color: isCandidate ? '#10B981' : 'var(--purple)' });

export const s133 = ({isCandidate}) => ({
                              padding: '8px 12px',
                              borderRadius: 10,
                              background: isCandidate ? 'rgba(16, 185, 129, 0.1)' : 'var(--s1)',
                              border: '1px solid var(--border)',
                              fontSize: '0.8rem',
                              color: 'var(--text)'
                            });

export const s134 = ({}) => ({
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                flexWrap: 'wrap',
                gap: 12,
                borderTop: `1px solid var(--border)`,
                paddingTop: 16
              });

export const s135 = ({}) => ({
                      padding: '10px 14px',
                      borderRadius: 12,
                      background: 'var(--s2)',
                      color: 'var(--muted)',
                      border: `1px solid var(--border)`,
                      fontSize: '0.825rem',
                      fontWeight: 600,
                      cursor: 'pointer',
                      display: 'flex',
                      alignItems: 'center',
                      gap: 6
                    });

export const s136 = ({isMobile}) => ({
              background: 'var(--s1)',
              border: `1px solid var(--border)`,
              borderRadius: 24,
              padding: isMobile ? '20px 16px' : '28px 24px',
              boxShadow: '0 8px 32px rgba(0, 0, 0, 0.05)',
              position: 'relative',
              display: 'flex',
              flexDirection: 'column',
              gap: 16
            });

export const s137 = ({}) => ({
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                borderBottom: `1px solid var(--border)`,
                paddingBottom: 12
              });

export const s138 = ({currentQuestionType}) => ({
                    padding: '4px 10px',
                    borderRadius: 8,
                    background: currentQuestionType === 'follow_up' ? 'rgba(59, 130, 246, 0.15)' : 'rgba(139, 92, 246, 0.15)',
                    color: currentQuestionType === 'follow_up' ? '#60A5FA' : 'var(--purple)',
                    fontSize: '0.75rem',
                    fontWeight: 800,
                    letterSpacing: '0.05em'
                  });

export const s139 = ({difficulty}) => ({
                    padding: '3px 8px',
                    borderRadius: 6,
                    background: difficulty === 'Easy' ? 'rgba(16, 185, 129, 0.15)' : difficulty === 'Hard' ? 'rgba(239, 68, 68, 0.15)' : 'rgba(79, 131, 246, 0.15)',
                    color: difficulty === 'Easy' ? '#10B981' : difficulty === 'Hard' ? '#EF4444' : 'var(--accent)',
                    fontSize: '0.7rem',
                    fontWeight: 700
                  });

export const s140 = ({turnTimeRemaining}) => ({ fontSize: '0.75rem', color: turnTimeRemaining < 20 ? '#EF4444' : 'var(--muted)', fontWeight: turnTimeRemaining < 20 ? 700 : 500 });

export const s141 = ({}) => ({
                      padding: '6px 12px',
                      background: 'rgba(139, 92, 246, 0.12)',
                      border: `1px solid var(--purple)`,
                      color: 'var(--purple)',
                      borderRadius: 8,
                      fontSize: '0.75rem',
                      fontWeight: 700,
                      cursor: 'pointer',
                      display: 'flex',
                      alignItems: 'center',
                      gap: 5,
                      transition: 'all 0.15s ease'
                    });

export const s142 = ({ttsEnabled}) => ({
                      padding: '6px 10px',
                      background: 'var(--s2)',
                      border: `1px solid var(--border)`,
                      color: ttsEnabled ? 'var(--accent)' : 'var(--muted)',
                      borderRadius: 8,
                      fontSize: '0.75rem',
                      fontWeight: 600,
                      cursor: 'pointer',
                      display: 'flex',
                      alignItems: 'center',
                      gap: 6
                    });

export const s143 = ({turnTimeRemaining}) => ({
                  height: '100%',
                  width: `${(turnTimeRemaining / 90) * 100}%`,
                  background: turnTimeRemaining < 20 ? '#EF4444' : turnTimeRemaining < 40 ? '#F59E0B' : 'var(--purple)',
                  transition: 'width 1s linear'
                });

export const s144 = ({}) => ({
                  fontSize: '0.75rem',
                  color: 'var(--muted)',
                  background: 'var(--s2)',
                  padding: '5px 12px',
                  borderRadius: 10,
                  width: 'fit-content',
                  border: `1px solid var(--border)`,
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: 6
                });

export const s145 = ({isMobile}) => ({
                margin: 0,
                fontSize: isMobile ? '1.15rem' : '1.35rem',
                fontWeight: 700,
                color: 'var(--text)',
                lineHeight: 1.5
              });

export const s146 = ({isMobile}) => ({
              background: 'var(--s1)',
              border: `1px solid var(--border)`,
              borderRadius: 24,
              padding: isMobile ? '20px 16px' : '28px 24px',
              display: 'flex',
              flexDirection: 'column',
              gap: 20
            });

export const s147 = ({isRecording}) => ({
                  display: 'flex',
                  flexDirection: 'column',
                  alignItems: 'center',
                  justifyContent: 'center',
                  padding: '24px 16px',
                  background: 'var(--s2)',
                  borderRadius: 20,
                  border: `1px solid ${isRecording ? 'var(--purple)' : 'var(--border)'}`,
                  gap: 14,
                  transition: 'all 0.2s ease'
                });

export const s148 = ({isRecording}) => ({
                      width: 72,
                      height: 72,
                      borderRadius: '50%',
                      border: 'none',
                      background: isRecording
                        ? 'linear-gradient(135deg, #EF4444 0%, #DC2626 100%)'
                        : 'linear-gradient(135deg, #8B5CF6 0%, #6366F1 100%)',
                      color: '#FFFFFF',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      cursor: 'pointer',
                      boxShadow: isRecording
                        ? '0 0 24px rgba(239, 68, 68, 0.6)'
                        : '0 4px 20px rgba(139, 92, 246, 0.3)',
                      transition: 'all 0.2s ease'
                    });

export const s149 = ({isRecording}) => ({ fontSize: '0.85rem', fontWeight: 700, color: isRecording ? '#EF4444' : 'var(--text)' });

export const s150 = ({}) => ({
                    width: '100%',
                    background: 'var(--s2)',
                    border: `1px solid var(--border)`,
                    borderRadius: 16,
                    padding: 14,
                    fontSize: '0.875rem',
                    color: 'var(--text)',
                    outline: 'none',
                    boxSizing: 'border-box',
                    resize: 'vertical'
                  });

export const s151 = ({statusMessage}) => ({ 
                  fontSize: '0.8rem', 
                  color: statusMessage?.startsWith('⚠️') ? '#F59E0B' : 'var(--muted)',
                  fontWeight: statusMessage?.startsWith('⚠️') ? 600 : 400
                });

export const s152 = ({loading}) => ({
                        padding: '10px 18px',
                        background: 'var(--s2)',
                        color: 'var(--muted)',
                        border: `1px solid var(--border)`,
                        borderRadius: 14,
                        fontSize: '0.825rem',
                        fontWeight: 600,
                        cursor: loading ? 'not-allowed' : 'pointer',
                        transition: 'all 0.15s ease'
                      });

export const s153 = ({currentQIndex,loading}) => ({
                      padding: '12px 24px',
                      background: currentQIndex >= 4 
                        ? 'linear-gradient(135deg, var(--purple) 0%, var(--accent) 100%)' 
                        : 'var(--purple)',
                      color: '#FFFFFF',
                      border: 'none',
                      borderRadius: 14,
                      fontSize: '0.85rem',
                      fontWeight: 800,
                      cursor: loading ? 'not-allowed' : 'pointer',
                      display: 'flex',
                      alignItems: 'center',
                      gap: 8,
                      boxShadow: currentQIndex >= 4 
                        ? '0 0 20px rgba(139, 92, 246, 0.45)' 
                        : '0 4px 14px rgba(139, 92, 246, 0.25)',
                      opacity: loading ? 0.5 : 1,
                      transition: 'all 0.15s ease'
                    });

export const s154 = ({isMobile}) => ({
            background: 'var(--s1)',
            border: `1px solid var(--border)`,
            borderRadius: 28,
            padding: isMobile ? '32px 18px' : '48px 36px',
            boxShadow: '0 16px 48px rgba(0, 0, 0, 0.12)',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            textAlign: 'center',
            gap: 28,
            maxWidth: 720,
            margin: '0 auto',
            width: '100%',
            boxSizing: 'border-box'
          });

export const s155 = ({difficulty}) => ({
                  padding: '2px 8px',
                  borderRadius: 6,
                  background: difficulty === 'Easy' ? 'rgba(16, 185, 129, 0.15)' : difficulty === 'Hard' ? 'rgba(239, 68, 68, 0.15)' : 'rgba(79, 131, 246, 0.15)',
                  color: difficulty === 'Easy' ? '#10B981' : difficulty === 'Hard' ? '#EF4444' : 'var(--accent)',
                  fontSize: '0.7rem',
                  fontWeight: 800
                });

export const s156 = ({isMobile}) => ({ margin: 0, fontSize: isMobile ? '1.35rem' : '1.65rem', fontWeight: 800, color: 'var(--text)' });

export const s157 = ({analysisStep}) => ({
                width: `${Math.min(100, Math.max(15, (analysisStep + 1) * 22))}%`,
                height: '100%',
                background: 'linear-gradient(90deg, var(--purple) 0%, var(--accent) 100%)',
                borderRadius: 4,
                transition: 'width 0.6s cubic-bezier(0.4, 0, 0.2, 1)'
              });

export const s158 = ({isCurrent,isDone,sIdx,analysisStep}) => ({
                      padding: '12px 16px',
                      borderRadius: 14,
                      background: isCurrent ? 'rgba(139, 92, 246, 0.08)' : 'var(--s2)',
                      border: `1px solid ${isCurrent ? 'var(--purple)' : isDone ? 'rgba(16, 185, 129, 0.3)' : 'var(--border)'}`,
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'space-between',
                      transition: 'all 0.2s ease',
                      opacity: sIdx > analysisStep ? 0.45 : 1
                    });

export const s159 = ({isDone,isCurrent}) => ({ color: isDone ? '#10B981' : isCurrent ? 'var(--purple)' : 'var(--muted)' });

export const s160 = ({isCurrent}) => ({ fontSize: '0.8rem', fontWeight: isCurrent ? 700 : 500, color: isCurrent ? 'var(--text)' : 'var(--muted)' });

export const s161 = ({isMobile}) => ({
              background: 'var(--s1)',
              border: `1px solid var(--border)`,
              borderRadius: 24,
              padding: isMobile ? 24 : 36,
              boxShadow: '0 8px 32px rgba(0, 0, 0, 0.05)',
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              textAlign: 'center',
              gap: 18
            });

export const s162 = ({difficulty}) => ({
                    padding: '2px 8px',
                    borderRadius: 6,
                    background: difficulty === 'Easy' ? 'rgba(16, 185, 129, 0.15)' : difficulty === 'Hard' ? 'rgba(239, 68, 68, 0.15)' : 'rgba(79, 131, 246, 0.15)',
                    color: difficulty === 'Easy' ? '#10B981' : difficulty === 'Hard' ? '#EF4444' : 'var(--accent)',
                    fontSize: '0.7rem',
                    fontWeight: 800
                  });

export const s163 = ({}) => ({
                  padding: '12px 24px',
                  borderRadius: 16,
                  background: 'var(--s2)',
                  border: `1px solid var(--border)`,
                  textAlign: 'center'
                });

export const s164 = ({scorecard}) => ({ fontSize: '1.75rem', fontWeight: 900, color: scorecard.overallScore >= 70 ? '#10B981' : scorecard.overallScore >= 50 ? 'var(--accent)' : '#EF4444' });

export const s165 = ({}) => ({
                  padding: '12px 24px',
                  borderRadius: 16,
                  background: 'var(--s2)',
                  border: `1px solid var(--border)`,
                  textAlign: 'center'
                });

export const s166 = ({scorecard}) => ({ fontSize: '1.75rem', fontWeight: 900, color: scorecard.letterGrade.startsWith('A') ? '#10B981' : scorecard.letterGrade.startsWith('B') ? 'var(--accent)' : '#EF4444' });

export const s167 = ({}) => ({
                  padding: '12px 24px',
                  borderRadius: 16,
                  background: 'var(--s2)',
                  border: `1px solid var(--border)`,
                  textAlign: 'center'
                });

export const s168 = ({}) => ({
                margin: 0,
                fontSize: '0.875rem',
                color: 'var(--text)',
                maxWidth: 680,
                lineHeight: 1.6,
                background: 'var(--s2)',
                padding: '14px 18px',
                borderRadius: 14,
                border: `1px solid var(--border)`
              });

export const s169 = ({isMobile}) => ({
              display: 'grid',
              gridTemplateColumns: isMobile ? '1fr' : '1fr 1fr 1fr',
              gap: 16
            });

export const s170 = ({}) => ({
                    padding: 18,
                    borderRadius: 18,
                    background: 'var(--s1)',
                    border: `1px solid var(--border)`,
                    display: 'flex',
                    flexDirection: 'column',
                    gap: 10
                  });

export const s171 = ({isUnscored}) => ({ fontSize: '0.85rem', fontWeight: 800, color: isUnscored ? 'var(--muted)' : 'var(--purple)' });

export const s172 = ({isUnscored,dimVal}) => ({
                        width: isUnscored ? '0%' : `${(dimVal.score / 10) * 100}%`,
                        height: '100%',
                        background: 'linear-gradient(90deg, var(--purple) 0%, var(--accent) 100%)',
                        borderRadius: 3
                      });

export const s173 = ({isMobile}) => ({
                          background: 'var(--s1)',
                          border: `1px solid var(--border)`,
                          borderRadius: 20,
                          padding: isMobile ? '18px 14px' : '24px 22px',
                          boxShadow: '0 4px 20px rgba(0, 0, 0, 0.04)',
                          display: 'flex',
                          flexDirection: 'column',
                          gap: 16
                        });

export const s174 = ({}) => ({
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'space-between',
                          borderBottom: `1px solid var(--border)`,
                          paddingBottom: 12,
                          flexWrap: 'wrap',
                          gap: 8
                        });

export const s175 = ({isFollowUp}) => ({
                              padding: '3px 10px',
                              borderRadius: 8,
                              background: isFollowUp ? 'rgba(59, 130, 246, 0.15)' : 'rgba(139, 92, 246, 0.15)',
                              color: isFollowUp ? '#60A5FA' : 'var(--purple)',
                              fontSize: '0.75rem',
                              fontWeight: 800,
                              letterSpacing: '0.04em'
                            });

export const s176 = ({}) => ({
                                fontSize: '0.75rem',
                                color: 'var(--muted)',
                                fontWeight: 600,
                                background: 'var(--s2)',
                                padding: '2px 8px',
                                borderRadius: 6,
                                border: `1px solid var(--border)`
                              });

export const s177 = ({scoreBg,scoreColor}) => ({
                            padding: '4px 12px',
                            borderRadius: 10,
                            background: scoreBg,
                            color: scoreColor,
                            fontSize: '0.8rem',
                            fontWeight: 800,
                            display: 'inline-flex',
                            alignItems: 'center',
                            gap: 4
                          });

export const s178 = ({}) => ({
                          background: 'var(--s2)',
                          border: `1px solid var(--border)`,
                          borderRadius: 14,
                          padding: '12px 16px',
                          display: 'flex',
                          flexDirection: 'column',
                          gap: 4
                        });

export const s179 = ({turn}) => ({
                            fontSize: '0.875rem',
                            color: turn.candidateAnswer?.includes('Skipped') ? 'var(--muted)' : 'var(--text)',
                            fontStyle: turn.candidateAnswer?.includes('Skipped') ? 'italic' : 'normal',
                            lineHeight: 1.5
                          });

export const s180 = ({isMobile}) => ({
                          display: 'grid',
                          gridTemplateColumns: isMobile ? '1fr' : '1fr 1fr',
                          gap: 12
                        });

export const s181 = ({isMobile}) => ({
              display: 'grid',
              gridTemplateColumns: isMobile ? '1fr' : '1fr 1fr',
              gap: 16
            });

export const s182 = ({}) => ({
                padding: 20,
                borderRadius: 20,
                background: 'var(--s1)',
                border: `1px solid var(--border)`,
                display: 'flex',
                flexDirection: 'column',
                gap: 12
              });

export const s183 = ({}) => ({
                padding: 20,
                borderRadius: 20,
                background: 'var(--s1)',
                border: `1px solid var(--border)`,
                display: 'flex',
                flexDirection: 'column',
                gap: 12
              });

export const s184 = ({}) => ({
                  padding: '12px 24px',
                  background: 'var(--s2)',
                  color: 'var(--text)',
                  border: `1px solid var(--border)`,
                  borderRadius: 16,
                  fontSize: '0.85rem',
                  fontWeight: 700,
                  cursor: 'pointer',
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: 8
                });
