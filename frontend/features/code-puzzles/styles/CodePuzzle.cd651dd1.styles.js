export const s0 = ({isMobile}) => ({
        height: isMobile ? 42 : 48,
        minHeight: isMobile ? 42 : 48,
        background: '#07090F',
        borderBottom: '1px solid rgba(255, 255, 255, 0.08)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        padding: isMobile ? '0 10px' : '0 16px',
        flexWrap: 'nowrap',
        gap: isMobile ? 6 : 8,
        flexShrink: 0,
        zIndex: 20
      });

export const s1 = ({isMobile}) => ({ display: 'flex', alignItems: 'center', gap: isMobile ? 5 : 8, minWidth: 0, overflow: 'visible' });

export const s2 = ({isMobile}) => ({
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: 4,
              height: isMobile ? 28 : 30,
              padding: isMobile ? '0 8px' : '0 11px',
              borderRadius: 8,
              background: 'rgba(255, 255, 255, 0.05)',
              border: '1px solid rgba(255, 255, 255, 0.12)',
              color: '#E2E8F0',
              fontSize: 12,
              fontWeight: 600,
              cursor: 'pointer',
              flexShrink: 0
            });

export const s3 = ({isMobile}) => ({ display: 'flex', alignItems: 'center', gap: isMobile ? 5 : 6, minWidth: 0 });

export const s4 = ({isMobile}) => ({ display: 'flex', alignItems: 'center', gap: isMobile ? 5 : 8, flexShrink: 0 });

export const s5 = ({isMobile,saveToast}) => ({
              display: 'flex',
              alignItems: 'center',
              gap: 6,
              padding: isMobile ? '5px 8px' : '6px 12px',
              borderRadius: 8,
              background: 'rgba(255, 255, 255, 0.04)',
              border: '1px solid rgba(255, 255, 255, 0.08)',
              color: saveToast ? '#34D399' : '#CBD5E1',
              fontSize: 12,
              fontWeight: 600,
              cursor: 'pointer'
            });

export const s6 = ({isMobile}) => ({
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              width: isMobile ? 28 : 'auto',
              height: isMobile ? 28 : 'auto',
              padding: isMobile ? 0 : '6px 12px',
              gap: 6,
              borderRadius: 8,
              background: 'rgba(255, 255, 255, 0.04)',
              border: '1px solid rgba(255, 255, 255, 0.08)',
              color: '#CBD5E1',
              fontSize: 12,
              fontWeight: 600,
              cursor: 'pointer'
            });

export const s7 = ({isMobile}) => ({
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              width: isMobile ? 28 : 'auto',
              height: isMobile ? 28 : 'auto',
              padding: isMobile ? 0 : '6px 13px',
              gap: 6,
              borderRadius: 8,
              background: 'linear-gradient(135deg, rgba(245, 158, 11, 0.16), rgba(217, 119, 6, 0.22))',
              border: '1px solid rgba(245, 158, 11, 0.45)',
              color: '#FBBF24',
              fontSize: 12,
              fontWeight: 600,
              cursor: 'pointer'
            });

export const s8 = ({isMobile}) => ({
          width: isMobile ? 0 : 44,
          display: isMobile ? 'none' : 'flex',
          flexShrink: 0,
          background: '#07090F',
          borderRight: '1px solid rgba(255, 255, 255, 0.08)',
          flexDirection: 'column',
          alignItems: 'center',
          padding: '10px 0',
          gap: 12,
          zIndex: 10
        });

export const s9 = ({activeActivityIcon,isExplorerOpen}) => ({
              width: 32,
              height: 32,
              borderRadius: 8,
              background: (activeActivityIcon === 'files' && isExplorerOpen) ? 'rgba(168, 85, 247, 0.18)' : 'transparent',
              border: (activeActivityIcon === 'files' && isExplorerOpen) ? '1px solid rgba(168, 85, 247, 0.35)' : 'none',
              color: (activeActivityIcon === 'files' && isExplorerOpen) ? '#A855F7' : '#64748B',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              transition: 'all 0.15s ease'
            });

export const s10 = ({activeActivityIcon,isExplorerOpen}) => ({
              width: 32,
              height: 32,
              borderRadius: 8,
              background: (activeActivityIcon === 'tree' && isExplorerOpen) ? 'rgba(168, 85, 247, 0.18)' : 'transparent',
              border: (activeActivityIcon === 'tree' && isExplorerOpen) ? '1px solid rgba(168, 85, 247, 0.35)' : 'none',
              color: (activeActivityIcon === 'tree' && isExplorerOpen) ? '#A855F7' : '#64748B',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              transition: 'all 0.15s ease'
            });

export const s11 = ({isMobile,isExplorerOpen}) => ({
          position: isMobile ? 'absolute' : 'relative',
          left: 0,
          top: isMobile ? 0 : 'auto',
          bottom: isMobile ? 0 : 'auto',
          zIndex: isMobile ? 35 : 'auto',
          width: isExplorerOpen ? (isMobile ? 240 : 210) : 0,
          boxShadow: (isMobile && isExplorerOpen) ? '12px 0 40px rgba(0, 0, 0, 0.85)' : 'none',
          transition: 'width 0.2s cubic-bezier(0.16, 1, 0.3, 1)',
          background: '#0A0E1A',
          borderRight: isExplorerOpen ? '1px solid rgba(255, 255, 255, 0.08)' : 'none',
          overflow: 'hidden',
          display: 'flex',
          flexDirection: 'column',
          flexShrink: 0,
          userSelect: 'none'
        });

export const s12 = ({isMobile}) => ({ display: 'flex', flexDirection: 'column', height: '100%', width: isMobile ? 240 : 210 });

export const s13 = ({isActive}) => ({
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'space-between',
                          padding: '7px 10px',
                          borderRadius: 8,
                          background: isActive ? 'rgba(168, 85, 247, 0.16)' : 'transparent',
                          border: isActive ? '1px solid rgba(168, 85, 247, 0.35)' : '1px solid transparent',
                          color: isActive ? '#F8FAFC' : '#94A3B8',
                          fontSize: 12.5,
                          fontWeight: isActive ? 600 : 500,
                          cursor: 'pointer',
                          transition: 'all 0.15s ease'
                        });

export const s14 = ({webPuzzleIndex,idx}) => ({
                            padding: '8px 10px',
                            borderRadius: 8,
                            background: webPuzzleIndex === idx ? 'rgba(56, 189, 248, 0.16)' : 'transparent',
                            border: webPuzzleIndex === idx ? '1px solid rgba(56, 189, 248, 0.35)' : '1px solid transparent',
                            color: webPuzzleIndex === idx ? '#F8FAFC' : '#94A3B8',
                            fontSize: 12,
                            cursor: 'pointer'
                          });

export const s15 = ({puzzleSource,facultyPuzzleIndex,idx}) => ({
                            padding: '8px 10px',
                            borderRadius: 8,
                            background: (puzzleSource === 'faculty' && facultyPuzzleIndex === idx) ? 'rgba(168, 85, 247, 0.16)' : 'transparent',
                            border: (puzzleSource === 'faculty' && facultyPuzzleIndex === idx) ? '1px solid rgba(168, 85, 247, 0.35)' : '1px solid transparent',
                            color: (puzzleSource === 'faculty' && facultyPuzzleIndex === idx) ? '#F8FAFC' : '#94A3B8',
                            fontSize: 12,
                            cursor: 'pointer'
                          });

export const s16 = ({isMobile,mobileActiveView}) => ({
            flex: 1,
            display: (isMobile && (mobileActiveView === 'guide' || mobileActiveView === 'visualizer' || mobileActiveView === 'preview')) ? 'none' : 'flex',
            flexDirection: 'column',
            overflow: 'hidden',
            minHeight: 0,
            background: '#07090F'
          });

export const s17 = ({isMobile,mobileActiveView}) => ({
            flex: 1,
            display: (isMobile && mobileActiveView === 'console') ? 'none' : 'flex',
            flexDirection: 'column',
            overflow: 'hidden',
            minHeight: 0
          });

export const s18 = ({isActive}) => ({
                      display: 'flex',
                      alignItems: 'center',
                      gap: 8,
                      height: 28,
                      padding: '0 10px',
                      borderRadius: 6,
                      background: isActive ? '#07090F' : 'transparent',
                      borderBottom: isActive ? '2px solid #A855F7' : '2px solid transparent',
                      color: isActive ? '#F8FAFC' : '#64748B',
                      fontSize: 12,
                      fontWeight: isActive ? 600 : 500,
                      cursor: 'pointer',
                      userSelect: 'none',
                      transition: 'all 0.15s ease'
                    });

export const s19 = ({stepPassed,validationError}) => ({
                background: stepPassed ? 'rgba(34, 197, 160, 0.12)' : validationError ? 'rgba(245, 91, 107, 0.12)' : 'rgba(91, 140, 248, 0.08)',
                borderTop: '1px solid rgba(255, 255, 255, 0.08)',
                borderBottom: '1px solid rgba(255, 255, 255, 0.04)',
                padding: '6px 10px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                gap: 8,
                flexShrink: 0
              });

export const s20 = ({stepPassed,validationError}) => ({
                    fontSize: 10,
                    fontWeight: 800,
                    padding: '2px 6px',
                    borderRadius: 4,
                    background: stepPassed ? '#22C5A0' : validationError ? '#F55B6B' : '#5B8CF8',
                    color: '#000',
                    flexShrink: 0
                  });

export const s21 = ({stepPassed,validationError}) => ({
                    fontSize: 11.5,
                    color: stepPassed ? '#22C5A0' : validationError ? '#F55B6B' : '#E2E8F0',
                    fontWeight: 600,
                    whiteSpace: 'nowrap',
                    overflow: 'hidden',
                    textOverflow: 'ellipsis'
                  });

export const s22 = ({isValidating,activePuzzle}) => ({
                      background: 'rgba(255, 255, 255, 0.08)',
                      border: '1px solid rgba(255, 255, 255, 0.2)',
                      color: '#E2E8F0',
                      padding: '4px 10px',
                      borderRadius: 6,
                      fontSize: 11,
                      fontWeight: 700,
                      cursor: (isValidating || !activePuzzle) ? 'not-allowed' : 'pointer',
                      display: 'flex',
                      alignItems: 'center',
                      gap: 4,
                      flexShrink: 0
                    });

export const s23 = ({isMobile}) => ({
              height: isMobile ? 'auto' : 40,
              minHeight: 40,
              background: '#080A12',
              borderTop: '1px solid rgba(255, 255, 255, 0.08)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              padding: isMobile ? '6px 8px' : '0 12px',
              flexWrap: isMobile ? 'wrap' : 'nowrap',
              gap: 8,
              flexShrink: 0
            });

export const s24 = ({category,isReady,isRunning}) => ({
                    background: '#22C5A0',
                    color: '#000',
                    border: 'none',
                    padding: '5px 12px',
                    borderRadius: 6,
                    fontSize: 12,
                    fontWeight: 700,
                    cursor: (category === 'programming' && (!isReady || isRunning)) ? 'not-allowed' : 'pointer',
                    display: 'flex',
                    alignItems: 'center',
                    gap: 5,
                    opacity: (category === 'programming' && (!isReady || isRunning)) ? 0.6 : 1
                  });

export const s25 = ({isReady,isRunning,isTracing,activePuzzle}) => ({
                      background: 'rgba(168, 85, 247, 0.18)',
                      border: '1px solid rgba(168, 85, 247, 0.4)',
                      color: '#C084FC',
                      padding: '5px 12px',
                      borderRadius: 6,
                      fontSize: 12,
                      fontWeight: 700,
                      cursor: (!isReady || isRunning || isTracing || !activePuzzle) ? 'not-allowed' : 'pointer',
                      display: 'flex',
                      alignItems: 'center',
                      gap: 5,
                      opacity: (!isReady || isRunning || isTracing || !activePuzzle) ? 0.6 : 1
                    });

export const s26 = ({isValidating,activePuzzle}) => ({
                    background: 'rgba(255, 255, 255, 0.05)',
                    border: '1px solid rgba(255, 255, 255, 0.15)',
                    color: '#E2E8F0',
                    padding: '5px 12px',
                    borderRadius: 6,
                    fontSize: 11.5,
                    fontWeight: 700,
                    cursor: (isValidating || !activePuzzle) ? 'not-allowed' : 'pointer',
                    display: 'flex',
                    alignItems: 'center',
                    gap: 5
                  });

export const s27 = ({isDraggingBottomRef}) => ({
                    height: 5,
                    background: isDraggingBottomRef.current ? 'rgba(168, 85, 247, 0.5)' : 'rgba(255, 255, 255, 0.08)',
                    cursor: 'row-resize',
                    width: '100%',
                    flexShrink: 0,
                    zIndex: 10,
                    transition: 'background 0.15s'
                  });

export const s28 = ({isMobile,isTerminalCollapsed,bottomSplitPercent,mobileActiveView}) => ({
                height: isMobile ? '100%' : (isTerminalCollapsed ? 36 : `${bottomSplitPercent}%`),
                flex: isMobile ? 1 : 'none',
                display: (isMobile && mobileActiveView !== 'console') ? 'none' : 'flex',
                flexDirection: 'column',
                background: '#07090F',
                overflow: 'hidden',
                flexShrink: 0,
                transition: isMobile ? 'none' : 'height 0.2s cubic-bezier(0.16, 1, 0.3, 1)'
              });

export const s29 = ({isTerminalCollapsed}) => ({
                  height: 36,
                  background: '#090C15',
                  borderBottom: isTerminalCollapsed ? 'none' : '1px solid rgba(255, 255, 255, 0.08)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  padding: '0 14px',
                  flexShrink: 0
                });

export const s30 = ({isMobile,isTablet,rightPanelWidth,mobileActiveView}) => ({
          width: isMobile ? '100%' : (isTablet ? 360 : rightPanelWidth),
          background: '#090C15',
          borderLeft: isMobile ? 'none' : '1px solid rgba(255, 255, 255, 0.08)',
          display: (isMobile && (mobileActiveView === 'editor' || mobileActiveView === 'console')) ? 'none' : 'flex',
          flexDirection: 'column',
          overflow: 'hidden',
          flexShrink: 0
        });

export const s31 = ({isActive,activeColor}) => ({
                    flex: 1,
                    height: 30,
                    borderRadius: 6,
                    background: isActive ? `${activeColor}15` : 'transparent',
                    border: isActive ? `1px solid ${activeColor}40` : '1px solid transparent',
                    color: isActive ? activeColor : '#64748B',
                    fontSize: 12.5,
                    fontWeight: isActive ? 700 : 600,
                    cursor: 'pointer',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    gap: 6,
                    transition: 'all 0.15s ease'
                  });

export const s32 = ({activeRightTab}) => ({ flex: 1, overflowY: 'auto', padding: activeRightTab === 'preview' ? 10 : 16, fontFamily: "'Plus Jakarta Sans', var(--font-outfit), 'Inter', sans-serif" });

export const s33 = ({isGeneratingPuzzle}) => ({
                          background: '#5B8CF8',
                          color: '#000',
                          border: 'none',
                          padding: '8px 16px',
                          borderRadius: 6,
                          fontSize: 12,
                          fontWeight: 700,
                          cursor: isGeneratingPuzzle ? 'not-allowed' : 'pointer',
                          display: 'flex',
                          alignItems: 'center',
                          gap: 5,
                          marginTop: 15,
                          opacity: isGeneratingPuzzle ? 0.6 : 1
                        });

export const s34 = ({copiedField}) => ({ background: 'none', border: 'none', color: copiedField === 'input' ? '#34D399' : '#64748B', cursor: 'pointer', padding: 0 });

export const s35 = ({copiedField}) => ({ background: 'none', border: 'none', color: copiedField === 'output' ? '#34D399' : '#64748B', cursor: 'pointer', padding: 0 });

export const s36 = ({isConstraintsOpen}) => ({ transform: isConstraintsOpen ? 'rotate(180deg)' : 'none', transition: 'transform 0.2s' });

export const s37 = ({stepBg,stepBorderColor,isLocked}) => ({
                            padding: 12,
                            background: stepBg,
                            border: `1px solid ${stepBorderColor}`,
                            borderRadius: 8,
                            opacity: isLocked ? 0.4 : 1,
                            display: 'flex',
                            gap: 12,
                            transition: 'all 0.2s',
                            position: 'relative'
                          });

export const s38 = ({numBg,numColor}) => ({
                            width: 22,
                            height: 22,
                            borderRadius: '50%',
                            background: numBg,
                            color: numColor,
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            fontSize: 11,
                            fontWeight: 800,
                            flexShrink: 0,
                            transition: 'all 0.2s'
                          });

export const s39 = ({isCompleted,isActive,validationError}) => ({
                                fontSize: 12.5,
                                fontWeight: 700,
                                color: isCompleted ? '#22C5A0' : isActive ? (validationError ? '#F55B6B' : '#F8FAFC') : '#647298'
                              });

export const s40 = ({validationError,stepPassed}) => ({
                                  fontSize: 9.5,
                                  fontWeight: 800,
                                  textTransform: 'uppercase',
                                  color: validationError ? '#F55B6B' : stepPassed ? '#22C5A0' : '#5B8CF8'
                                });

export const s41 = ({isLocked,isCompleted}) => ({
                              fontSize: 12,
                              color: isLocked ? '#3A4560' : isCompleted ? '#8892B0' : '#DDE3F2',
                              margin: 0,
                              lineHeight: 1.45
                            });

export const s42 = ({isValidating}) => ({
                          width: '100%',
                          padding: '9px 16px',
                          background: 'linear-gradient(135deg, #5B8CF8, #3B82F6)',
                          border: 'none',
                          borderRadius: 8,
                          color: '#000',
                          fontSize: 12.5,
                          fontWeight: 700,
                          cursor: isValidating ? 'not-allowed' : 'pointer',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          gap: 6
                        });

export const s43 = ({isCompleted,isActive,isLocked}) => ({
                          padding: 12,
                          background: isCompleted ? 'rgba(34, 197, 160, 0.03)' : isActive ? 'rgba(56, 189, 248, 0.05)' : 'rgba(255, 255, 255, 0.01)',
                          border: isCompleted ? '1px solid rgba(34, 197, 160, 0.25)' : isActive ? '1px solid rgba(56, 189, 248, 0.35)' : '1px solid rgba(255, 255, 255, 0.05)',
                          borderRadius: 8,
                          opacity: isLocked ? 0.4 : 1,
                          display: 'flex',
                          gap: 12,
                          transition: 'all 0.2s'
                        });

export const s44 = ({isCompleted,isActive}) => ({
                          width: 22,
                          height: 22,
                          borderRadius: '50%',
                          background: isCompleted ? '#22C5A0' : isActive ? '#38BDF8' : 'rgba(255,255,255,0.06)',
                          color: isCompleted ? '#000' : isActive ? '#000' : '#647298',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          fontSize: 11,
                          fontWeight: 800,
                          flexShrink: 0
                        });

export const s45 = ({isCompleted,isActive}) => ({ fontSize: 12.5, fontWeight: 700, color: isCompleted ? '#22C5A0' : isActive ? '#38BDF8' : '#647298' });

export const s46 = ({stepPassed}) => ({ fontSize: 9.5, fontWeight: 800, textTransform: 'uppercase', color: stepPassed ? '#22C5A0' : '#38BDF8' });

export const s47 = ({isLocked,isCompleted}) => ({ fontSize: 12, color: isLocked ? '#3A4560' : isCompleted ? '#8892B0' : '#DDE3F2', margin: 0, lineHeight: 1.45 });

export const s48 = ({isValidating}) => ({
                        width: '100%',
                        padding: '9px 16px',
                        background: 'linear-gradient(135deg, #38BDF8, #2563EB)',
                        border: 'none',
                        borderRadius: 8,
                        color: '#FFF',
                        fontSize: 12.5,
                        fontWeight: 700,
                        cursor: isValidating ? 'not-allowed' : 'pointer',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        gap: 6
                      });

export const s49 = ({currentStep}) => ({ background: 'rgba(255,255,255,0.06)', border: 'none', borderRadius: 4, color: '#FFF', padding: '4px 8px', cursor: currentStep === 0 ? 'not-allowed' : 'pointer', opacity: currentStep === 0 ? 0.5 : 1 });

export const s50 = ({currentStep,traceData}) => ({ background: 'rgba(255,255,255,0.06)', border: 'none', borderRadius: 4, color: '#FFF', padding: '4px 8px', cursor: currentStep === traceData.length - 1 ? 'not-allowed' : 'pointer', opacity: currentStep === traceData.length - 1 ? 0.5 : 1 });

export const s51 = ({isActive,tab}) => ({
                  flex: 1,
                  height: 38,
                  display: 'flex',
                  flexDirection: 'column',
                  alignItems: 'center',
                  justifyContent: 'center',
                  gap: 3,
                  background: isActive ? `${tab.color}18` : 'transparent',
                  border: isActive ? `1px solid ${tab.color}44` : '1px solid transparent',
                  borderRadius: 8,
                  color: isActive ? tab.color : '#64748B',
                  fontSize: 10.5,
                  fontWeight: isActive ? 700 : 500,
                  cursor: 'pointer',
                  position: 'relative',
                  transition: 'all 0.15s ease'
                });

export const s52 = ({tab}) => ({
                      position: 'absolute',
                      top: -3,
                      right: -5,
                      width: 6,
                      height: 6,
                      borderRadius: '50%',
                      background: tab.id === 'guide' ? '#22C5A0' : tab.id === 'console' ? '#EF4444' : '#F5A95B',
                      boxShadow: `0 0 6px ${tab.id === 'guide' ? '#22C5A0' : tab.id === 'console' ? '#EF4444' : '#F5A95B'}`
                    });
