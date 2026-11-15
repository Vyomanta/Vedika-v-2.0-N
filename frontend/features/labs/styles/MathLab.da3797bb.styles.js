export const s0 = ({drawTool}) => ({
                    cursor: drawTool === 'select' ? 'crosshair' : drawTool === 'pen' ? 'crosshair' : 'default'
                  });

export const s1 = ({cropBox}) => ({
                      position: 'absolute',
                      top: Math.max(12, cropBox.y - 42),
                      left: Math.max(12, cropBox.x),
                      zIndex: 20,
                      background: 'linear-gradient(135deg, #EC4899 0%, #A855F7 100%)',
                      color: '#FFF',
                      border: 'none',
                      padding: '8px 14px',
                      borderRadius: 20,
                      fontSize: 12,
                      fontWeight: 700,
                      cursor: 'pointer',
                      boxShadow: '0 4px 16px rgba(236, 72, 153, 0.5)',
                      display: 'flex',
                      alignItems: 'center',
                      gap: 6
                    });

export const s2 = ({plotMode,m}) => ({
                        flex: 1,
                        padding: '6px 10px',
                        borderRadius: 10,
                        border: plotMode === m.id ? '1px solid #A855F7' : '1px solid rgba(255,255,255,0.08)',
                        background: plotMode === m.id ? 'rgba(168, 85, 247, 0.2)' : 'rgba(255,255,255,0.04)',
                        color: plotMode === m.id ? '#FFFFFF' : '#94A3B8',
                        fontSize: 12,
                        fontWeight: 600,
                        cursor: 'pointer',
                        whiteSpace: 'nowrap',
                        textAlign: 'center'
                      });

export const s3 = ({showVisualConcepts}) => ({
                        transform: showVisualConcepts ? 'rotate(180deg)' : 'rotate(0deg)',
                        transition: 'transform 0.2s ease'
                      });

export const s4 = ({visualizerSubTab,id}) => ({
                              display: 'flex',
                              alignItems: 'center',
                              gap: 6,
                              padding: '6px 10px',
                              borderRadius: 8,
                              border: 'none',
                              background: visualizerSubTab === id ? 'rgba(168, 85, 247, 0.25)' : 'rgba(255, 255, 255, 0.04)',
                              color: visualizerSubTab === id ? '#C084FC' : '#94A3B8',
                              fontWeight: 600,
                              fontSize: 12,
                              cursor: 'pointer',
                              whiteSpace: 'nowrap'
                            });

export const s5 = ({isListening}) => ({
                    flex: 1,
                    padding: '12px 14px',
                    borderRadius: 14,
                    background: 'rgba(255, 255, 255, 0.05)',
                    border: isListening ? '1.5px solid #EC4899' : '1px solid rgba(255, 255, 255, 0.12)',
                    color: '#FFF',
                    fontSize: 13.5,
                    outline: 'none',
                    transition: 'border-color 0.2s ease'
                  });

export const s6 = ({isListening}) => ({
                    padding: '0 14px',
                    borderRadius: 14,
                    border: isListening ? '1.5px solid #EC4899' : '1px solid rgba(168, 85, 247, 0.3)',
                    background: isListening ? 'linear-gradient(135deg, #EC4899 0%, #A855F7 100%)' : 'rgba(168, 85, 247, 0.12)',
                    color: '#FFF',
                    cursor: 'pointer',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    boxShadow: isListening ? '0 0 16px rgba(236, 72, 153, 0.5)' : 'none',
                    transition: 'all 0.2s ease'
                  });

export const s7 = ({isTutorThinking}) => ({
                    padding: '0 18px',
                    borderRadius: 14,
                    border: 'none',
                    background: 'linear-gradient(135deg, #A855F7 0%, #EC4899 100%)',
                    color: '#FFF',
                    fontWeight: 700,
                    fontSize: 13.5,
                    cursor: isTutorThinking ? 'not-allowed' : 'pointer',
                    display: 'flex',
                    alignItems: 'center',
                    gap: 6,
                    boxShadow: '0 0 18px rgba(236, 72, 153, 0.45)',
                    transition: 'all 0.2s ease'
                  });
