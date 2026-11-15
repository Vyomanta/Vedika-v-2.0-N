export const s0 = ({isMobile}) => (`
        .box-container {
          width: 100%;
          max-width: 100%;
          height: 100%;
          max-height: 100%;
          display: flex;
          align-items: stretch;
          background: #07080B;
          overflow: hidden;
          position: relative;
          box-sizing: border-box;
        }

        /* Seamless Cosmic Gold Ambient Background */
        .quizzes-ambient-bg {
          position: absolute;
          inset: 0;
          pointer-events: none;
          z-index: 0;
          background: 
            radial-gradient(ellipse 65% 60% at 82% 48%, rgba(245, 158, 11, 0.20) 0%, rgba(217, 119, 6, 0.05) 45%, transparent 75%),
            radial-gradient(circle 380px at 15% 82%, rgba(245, 158, 11, 0.09) 0%, transparent 62%),
            radial-gradient(circle 260px at 45% 18%, rgba(251, 191, 36, 0.06) 0%, transparent 55%),
            #07080B;
          overflow: hidden;
        }


        /* Seamless Cosmic Purple Ambient Background */
        .assignments-ambient-bg {
          position: absolute;
          inset: 0;
          pointer-events: none;
          z-index: 0;
          background: 
            radial-gradient(ellipse 65% 60% at 20% 50%, rgba(168, 85, 247, 0.22) 0%, rgba(126, 34, 206, 0.06) 45%, transparent 75%),
            radial-gradient(circle 380px at 85% 80%, rgba(168, 85, 247, 0.12) 0%, transparent 62%),
            radial-gradient(circle 280px at 55% 15%, rgba(192, 132, 252, 0.08) 0%, transparent 55%),
            #090714;
          overflow: hidden;
        }


        /* DEFAULT STATE: QUIZZES ACTIVE */
        .box1-content {
          background: transparent !important;
          flex: 6.2 !important;
          max-width: 65% !important;
          display: flex;
          flex-direction: column;
          opacity: 1 !important;
          min-width: 0;
          overflow-y: auto;
          overflow-x: hidden;
          padding: ${isMobile ? '16px 12px' : '22px 28px 20px 24px'};
          box-sizing: border-box;
          pointer-events: auto !important;
          position: relative;
          z-index: 1;
          transition: all 0.5s cubic-bezier(0.16, 1, 0.3, 1);
        }

        .box1-side {
          background: transparent !important;
          border-left: none !important;
          flex: 3.8 !important;
          max-width: 38% !important;
          opacity: 1 !important;
          min-width: 0;
          padding: ${isMobile ? '12px 10px' : '16px 10px 20px 0'};
          pointer-events: auto !important;
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
          box-sizing: border-box;
          position: relative;
          z-index: 1;
          transition: all 0.5s cubic-bezier(0.16, 1, 0.3, 1);
        }

        /* COLLAPSED ASSIGNMENTS IN DEFAULT STATE */
        .box2-side {
          background: transparent !important;
          border-right: none !important;
          border-left: none !important;
          flex: 0 0 0% !important;
          max-width: 0px !important;
          width: 0px !important;
          opacity: 0 !important;
          min-width: 0 !important;
          padding: 0 !important;
          margin: 0 !important;
          border: none !important;
          pointer-events: none !important;
          overflow: hidden;
          transition: all 0.5s cubic-bezier(0.16, 1, 0.3, 1);
        }

        .box2-content {
          background: transparent !important;
          border-right: none !important;
          border-left: none !important;
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
          transition: all 0.5s cubic-bezier(0.16, 1, 0.3, 1);
        }

        /* RIGHT-OPEN STATE: ASSIGNMENTS ACTIVE */
        .box-container.right-open {
          background: #090714 !important;
        }

        .box-container.right-open .box1-content,
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
          flex: 3.8 !important;
          max-width: 38% !important;
          background: transparent !important;
          border-right: none !important;
          border-left: none !important;
          opacity: 1 !important;
          min-width: 0 !important;
          padding: ${isMobile ? '12px 10px' : '16px 0 20px 10px'} !important;
          pointer-events: auto !important;
          display: flex !important;
          flex-direction: column !important;
          align-items: center !important;
          justifyContent: center !important;
          box-sizing: border-box !important;
          position: relative !important;
          z-index: 1 !important;
          transition: all 0.5s cubic-bezier(0.16, 1, 0.3, 1) !important;
        }

        .box-container.right-open .box2-content {
          flex: 6.2 !important;
          max-width: 65% !important;
          background: transparent !important;
          border-right: none !important;
          border-left: none !important;
          opacity: 1 !important;
          min-width: 0 !important;
          padding: ${isMobile ? '16px 12px' : '22px 28px 20px 24px'} !important;
          pointer-events: auto !important;
          display: flex !important;
          flex-direction: column !important;
          box-sizing: border-box !important;
          position: relative !important;
          z-index: 1 !important;
          overflow-y: auto !important;
          overflow-x: hidden !important;
          transition: all 0.5s cubic-bezier(0.16, 1, 0.3, 1) !important;
        }

        @keyframes botFloatBounce {
          0%, 100% { transform: translateY(0px) rotate(0deg); }
          50% { transform: translateY(-7px) rotate(0.6deg); }
        }

        @media (max-width: 960px) {
          .box-container {
            height: calc(100dvh - 56px) !important;
            max-height: calc(100dvh - 56px) !important;
          }
          .box1-side,
          .box2-side,
          .box-container.right-open .box2-side,
          .box-container.right-open .box1-side {
            display: none !important;
          }
          .box1-content, .box-container.right-open .box2-content {
            flex: 1 !important;
            max-width: 100% !important;
            padding: 14px 12px 24px 12px !important;
            overflow-y: auto !important;
            -webkit-overflow-scrolling: touch;
          }
        }

        @media (max-width: 640px) {
          .box1-content, .box-container.right-open .box2-content {
            padding: 10px 8px 24px 8px !important;
          }
        }
      `);
