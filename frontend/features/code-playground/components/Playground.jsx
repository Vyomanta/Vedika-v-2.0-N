'use client';
import * as featureStyleFunctions from '@/features/code-playground/styles/Playground.60a1b9bc.styles.js';

import inlineStyles from '@/features/code-playground/styles/Playground.styles';
import '@/features/code-playground/styles/Playground.css';
import { useState, useEffect, useRef } from 'react';
import CodeMirror from '@uiw/react-codemirror';
import { python } from '@codemirror/lang-python';
import { usePyodide } from '@/hooks/usePyodide';
import { Play, Square, Trash2, CheckCircle, Loader2, ChevronLeft, ChevronRight, Pause, BookOpen, AlertCircle, X, GitFork, Layers, Columns } from 'lucide-react';
import CodeFlowchartVisualizer from '@/components/CodeFlowchartVisualizer';
import { motion, AnimatePresence } from 'framer-motion';
import { Terminal } from 'xterm';
import { FitAddon } from 'xterm-addon-fit';
import 'xterm/css/xterm.css';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import { T } from '@/shared/design-system/theme';
import { BUG_ANALYSIS_SYSTEM, BUG_TIPS_SYSTEM, BUG_FIX_METHODS_SYSTEM, FIX_EXPLANATION_SYSTEM, SOCRATIC_HELP_SYSTEM } from '@/features/tutoring/domain/prompts';
import {usePlaygroundModel} from '@/features/code-playground/hooks/features-code-playground-components-Playground.jsx';
export default function Playground({
  initialCode = '# Write your Python code here\nprint("Hello World!")\n',
  codeOverride = null,
  explanationOverride = null,
  onTraceComplete = null,
  onCodeChange = null,
  codingExercise = null,
  onVerifySuccess = null
}) {
const {getInitialCode,code,setCode,activeTab,setActiveTab,explanation,setExplanation,isGeneratingExplanation,setIsGeneratingExplanation,pendingTraceCode,setPendingTraceCode,assertionResults,setAssertionResults,verifyState,setVerifyState,traceError,setTraceError,isMobile,setIsMobile,handleCodeChange,traceData,setTraceData,currentStep,setCurrentStep,isPlaying,setIsPlaying,isTracing,setIsTracing,playSpeed,setPlaySpeed,selectedTutorAction,setSelectedTutorAction,vizZoom,setVizZoom,vizViewMode,setVizViewMode,terminalElRef,terminalInstanceRef,fitAddonRef,playIntervalRef,editorViewRef,editorPanelRef,stdinLineRef,waitingForInputRef,sendStdinRef,mainSplitPercent,setMainSplitPercent,leftSplitPercent,setLeftSplitPercent,rightSplitPercent,setRightSplitPercent,isDraggingMainRef,isDraggingLeftRef,isDraggingRightRef,containerRef,handleMainMouseDown,handleMainMouseMove,handleMainMouseUp,handleLeftMouseDown,handleLeftMouseMove,handleLeftMouseUp,handleRightMouseDown,handleRightMouseMove,handleRightMouseUp,onStdout,onStderr,onReady,onFinish,onError,onStdinRequest,validateTraceData,onTraceResult,isReady,isRunning,runCode,runTrace,stopCode,sendStdin,generateExplanationForCode,handleTabClick,handleRun,handleVerify,handleClear,renderArrayVisualizer,getTraceStepDetails,renderVariables}=usePlaygroundModel({initialCode,codeOverride,explanationOverride,onTraceComplete,onCodeChange,codingExercise,onVerifySuccess});
return (
    <div style={featureStyleFunctions.s0({isMobile})}>
      {/* Playground Header */}
      <div style={featureStyleFunctions.s1({isMobile})}>
        {/* Execution Actions */}
        <div style={inlineStyles.s37}>
          <button
            onClick={handleRun}
            disabled={!isReady || isRunning || isTracing}
            style={featureStyleFunctions.s2({isReady,isRunning,isTracing})}
          >
            {isRunning && activeTab === 'console' && verifyState !== 'verifying' ? <Loader2 size={13} style={inlineStyles.s38} /> : <Play size={13} fill="#000" />}
            Run
          </button>

          {codingExercise?.hasExercise && (
            <button
              onClick={handleVerify}
              disabled={!isReady || isRunning || isTracing}
              style={featureStyleFunctions.s3({isReady,isRunning,isTracing})}
            >
              {verifyState === 'verifying' ? <Loader2 size={13} style={inlineStyles.s39} /> : <CheckCircle size={13} />}
              Verify Solution
            </button>
          )}
        </div>

        {/* Status Indicator */}
        <div style={inlineStyles.s40}>
          <div style={inlineStyles.s41}>
            {!isReady ? (
              <>
                <Loader2 size={13} style={inlineStyles.s42} />
                <span>Loading Environment...</span>
              </>
            ) : isRunning ? (
              <>
                <Loader2 size={13} style={inlineStyles.s43} />
                <span style={inlineStyles.s44}>{verifyState === 'verifying' ? 'Verifying...' : 'Running Code...'}</span>
              </>
            ) : isTracing ? (
              <>
                <Loader2 size={13} style={inlineStyles.s45} />
                <span style={inlineStyles.s46}>Generating Trace...</span>
              </>
            ) : isGeneratingExplanation ? (
              <>
                <Loader2 size={13} style={inlineStyles.s47} />
                <span style={inlineStyles.s48}>Explaining Code...</span>
              </>
            ) : (
              <>
                <CheckCircle size={13} style={inlineStyles.s49} />
                <span style={inlineStyles.s50}>Environment Ready</span>
              </>
            )}
          </div>
        </div>
      </div>

      {/* Main Split Area */}
      <div ref={containerRef} style={featureStyleFunctions.s4({isMobile})}>
        
        {/* LEFT COLUMN: Code Editor & Console Terminal */}
        <div style={featureStyleFunctions.s5({isMobile,mainSplitPercent})}>
          {/* Top Half: Code Editor */}
          <div style={featureStyleFunctions.s6({isMobile,leftSplitPercent})}>
            <div style={inlineStyles.s51}>
              <span style={inlineStyles.s52}>Source Code Editor</span>
              <div style={inlineStyles.s53}>
                {codingExercise?.hasExercise && (
                  <button
                    onClick={handleVerify}
                    disabled={!isReady || isRunning}
                    style={inlineStyles.s54}
                  >
                    {verifyState === 'verifying' ? 'Verifying...' : 'Verify Code'}
                  </button>
                )}
              </div>
            </div>
            <div style={inlineStyles.s55}>
              <CodeMirror
                value={code}
                theme="dark"
                extensions={[python()]}
                onChange={(value) => handleCodeChange(value)}
                onCreateEditor={(view) => {
                  editorViewRef.current = view;
                }}
                style={inlineStyles.s56}
              />
            </div>
          </div>

          {/* Left Column Vertical Resizer Handle */}
          {!isMobile && (
            <div
              onMouseDown={handleLeftMouseDown}
              style={featureStyleFunctions.s7({isDraggingLeftRef})}
              onMouseEnter={e => e.currentTarget.style.background = 'rgba(91, 140, 248, 0.3)'}
              onMouseLeave={e => {
                if (!isDraggingLeftRef.current) {
                  e.currentTarget.style.background = 'rgba(255, 255, 255, 0.08)';
                }
              }}
            />
          )}

          {/* Bottom Half: Console Terminal */}
          <div style={featureStyleFunctions.s8({isMobile,leftSplitPercent})}>
            <div style={inlineStyles.s57}>
              <span style={inlineStyles.s58}>Output Console</span>
              <button
                onClick={handleClear}
                style={inlineStyles.s59}
                title="Clear Console"
              >
                <Trash2 size={11} />
              </button>
            </div>
            <div
              ref={terminalElRef}
              style={inlineStyles.s60}
            />
          </div>
        </div>

        {/* Main Horizontal Split Resizer Handle */}
        {!isMobile && (
          <div
            onMouseDown={handleMainMouseDown}
            style={featureStyleFunctions.s9({isDraggingMainRef})}
            onMouseEnter={e => e.currentTarget.style.background = 'rgba(91, 140, 248, 0.3)'}
            onMouseLeave={e => {
              if (!isDraggingMainRef.current) {
                e.currentTarget.style.background = 'rgba(255, 255, 255, 0.08)';
              }
            }}
          />
        )}

        {/* RIGHT COLUMN: Visualizer & Explanation Pane */}
        <div style={featureStyleFunctions.s10({isMobile,mainSplitPercent})}>
          {/* Top Half: Visualizer panel */}
          <div style={featureStyleFunctions.s11({rightSplitPercent})}>
            {/* Visualizer header controls */}
            <div style={inlineStyles.s61}>
              {traceData ? (
                <>
                  <div style={inlineStyles.s62}>
                    <button
                      onClick={() => setIsPlaying(!isPlaying)}
                      style={inlineStyles.s63}
                    >
                      {isPlaying ? <Pause size={10} fill="#000" /> : <Play size={10} fill="#000" />}
                      {isPlaying ? 'Pause' : 'Auto Play'}
                    </button>
                    <button
                      onClick={() => {
                        setPlaySpeed(prev => {
                          if (prev === 1500) return 1000;
                          if (prev === 1000) return 500;
                          return 1500;
                        });
                      }}
                      style={inlineStyles.s64}
                    >
                      {playSpeed === 1500 ? '1.0x' : playSpeed === 1000 ? '1.5x' : '2.0x'}
                    </button>

                    {/* Zoom controls */}
                    <div style={inlineStyles.s65}>
                      <button
                        onClick={() => setVizZoom(z => Math.min(z + 0.15, 2.5))}
                        style={inlineStyles.s66}
                        title="Zoom In"
                      >+</button>
                      <span style={inlineStyles.s67}>{Math.round(vizZoom * 100)}%</span>
                      <button
                        onClick={() => setVizZoom(z => Math.max(z - 0.15, 0.4))}
                        style={inlineStyles.s68}
                        title="Zoom Out"
                      >−</button>
                      <button
                        onClick={() => setVizZoom(1)}
                        style={inlineStyles.s69}
                        title="Reset Zoom"
                      >↺</button>
                    </div>

                    <div style={inlineStyles.s70}>
                      <button
                        disabled={currentStep === 0}
                        onClick={() => { setIsPlaying(false); setCurrentStep(prev => prev - 1); }}
                        style={featureStyleFunctions.s12({currentStep})}
                      >
                        <ChevronLeft size={12} />
                      </button>
                      <button
                        disabled={currentStep === traceData.length - 1}
                        onClick={() => { setIsPlaying(false); setCurrentStep(prev => prev + 1); }}
                        style={featureStyleFunctions.s13({currentStep,traceData})}
                      >
                        <ChevronRight size={12} />
                      </button>
                    </div>
                  </div>
                  <div style={inlineStyles.s71}>
                    <div className="viz-mode-toggle">
                      <button
                        type="button"
                        className={`viz-mode-btn ${vizViewMode === 'flowchart' ? 'active' : ''}`}
                        onClick={() => setVizViewMode('flowchart')}
                        title="Flowchart Control Flow Graph (Mermaid.js)"
                      >
                        <GitFork size={11} />
                        <span>Flowchart</span>
                      </button>
                      <button
                        type="button"
                        className={`viz-mode-btn ${vizViewMode === 'memory' ? 'active' : ''}`}
                        onClick={() => setVizViewMode('memory')}
                        title="Variables & Array Memory View"
                      >
                        <Layers size={11} />
                        <span>Variables</span>
                      </button>
                      <button
                        type="button"
                        className={`viz-mode-btn ${vizViewMode === 'both' ? 'active' : ''}`}
                        onClick={() => setVizViewMode('both')}
                        title="Split View: Flowchart + Memory"
                      >
                        <Columns size={11} />
                        <span>Split</span>
                      </button>
                    </div>
                    <span style={inlineStyles.s72}>
                      Step {currentStep + 1} of {traceData.length}
                    </span>
                  </div>
                </>
              ) : (
                <span style={inlineStyles.s73}>
                  Execution Visualizer
                </span>
              )}
            </div>

            {/* Timeline Scrubber (if trace exists) */}
            {traceData && (
              <div style={inlineStyles.s74}>
                <span style={inlineStyles.s75}>01</span>
                <input 
                  type="range"
                  min={0}
                  max={traceData.length - 1}
                  value={currentStep}
                  onChange={(e) => {
                    setIsPlaying(false);
                    setCurrentStep(parseInt(e.target.value));
                  }}
                  style={inlineStyles.s76}
                />
                <span style={inlineStyles.s77}>
                  {String(traceData.length).padStart(2, '0')}
                </span>
              </div>
            )}

            {/* Variable memory values scrolling track */}
            <div style={inlineStyles.s78} className="sandbox-scroll">
              {traceError && (
                <div style={inlineStyles.s79}>
                  <div style={inlineStyles.s80}>⚠️</div>
                  <h3 style={inlineStyles.s81}>Visualizer Blocked</h3>
                  <p style={inlineStyles.s82}>{traceError}</p>
                </div>
              )}
              {isTracing && (
                <div style={inlineStyles.s83}>
                  <Loader2 size={24} style={inlineStyles.s84} />
                  <span style={inlineStyles.s85}>Generating step-by-step trace timeline...</span>
                </div>
              )}
              {!isTracing && !traceData && !traceError && (
                <div style={inlineStyles.s86}>
                  <Play size={24} color="#F5A95B" />
                  <span style={inlineStyles.s87}>
                    Run your code first to generate a trace timeline and inspect Python execution step-by-step.
                  </span>
                </div>
              )}
              {traceData && (
                <div style={featureStyleFunctions.s14({vizZoom})}>
                  {vizViewMode === 'flowchart' && (
                    <CodeFlowchartVisualizer
                      code={code}
                      currentStep={currentStep}
                      traceData={traceData}
                    />
                  )}
                  {vizViewMode === 'memory' && (
                    renderVariables()
                  )}
                  {vizViewMode === 'both' && (
                    <div style={featureStyleFunctions.s15({isMobile})}>
                      <CodeFlowchartVisualizer
                        code={code}
                        currentStep={currentStep}
                        traceData={traceData}
                      />
                      <div>
                        {renderVariables()}
                      </div>
                    </div>
                  )}
                </div>
              )}
            </div>
          </div>

          {/* Right Column Vertical Resizer Handle */}
          {!isMobile && (
            <div
              onMouseDown={handleRightMouseDown}
              style={featureStyleFunctions.s16({isDraggingRightRef})}
              onMouseEnter={e => e.currentTarget.style.background = 'rgba(245, 169, 91, 0.3)'}
              onMouseLeave={e => {
                if (!isDraggingRightRef.current) {
                  e.currentTarget.style.background = 'rgba(255, 255, 255, 0.08)';
                }
              }}
            />
          )}

          {/* Bottom Half: Explanation and Tutor features */}
          <div style={featureStyleFunctions.s17({rightSplitPercent})}>
            {/* Tab Selection Header */}
            <div style={inlineStyles.s88}>
              <button
                onClick={() => handleTabClick('explanation')}
                style={featureStyleFunctions.s18({activeTab,rightSplitPercent})}
              >
                Tutor Explanation
              </button>
              {codingExercise?.hasExercise && (
                <button
                  onClick={() => handleTabClick('instructions')}
                  style={featureStyleFunctions.s19({activeTab,rightSplitPercent})}
                >
                  Instructions & Test Cases
                </button>
              )}
              
              {/* Collapse Button */}
              {rightSplitPercent < 100 && (
                <button
                  onClick={() => setRightSplitPercent(100)}
                  title="Collapse Explanation Pane"
                  style={inlineStyles.s89}
                  onMouseEnter={e => e.currentTarget.style.color = '#F55B6B'}
                  onMouseLeave={e => e.currentTarget.style.color = '#647298'}
                >
                  ✕ Collapse
                </button>
              )}
            </div>

            {/* Content scroll area */}
            <div style={featureStyleFunctions.s20({rightSplitPercent})} className="sandbox-scroll tab-pane">
              {/* Tab 1: Explanation tab */}
              {(!codingExercise?.hasExercise || activeTab === 'explanation') && (
                <div style={inlineStyles.s90}>
                  {/* Tutor Command Options Dropdown */}
                  <div style={inlineStyles.s91}>
                    <span style={inlineStyles.s92}>Tutor Action:</span>
                    <select
                      value={selectedTutorAction}
                      onChange={(e) => {
                        const val = e.target.value;
                        setSelectedTutorAction(val);
                        generateExplanationForCode(code, val);
                      }}
                      style={inlineStyles.s93}
                    >
                      <option value="default">📖 Standard Code Explanation</option>
                      <option value="analyze">🔍 Code Analysis & Complexity</option>
                      <option value="tips">💡 Bug Correction Tips</option>
                      <option value="fix">🛠️ Bug Fixing Methods</option>
                      <option value="explain">📖 Why It Works</option>
                    </select>
                  </div>

                  <div>
                    {!explanation && !isGeneratingExplanation ? (
                      <div style={inlineStyles.s94}>
                        <BookOpen size={20} color="#22C5A0" />
                        <span style={inlineStyles.s95}>
                          Select an action from the dropdown or click Run to trigger explanations.
                        </span>
                      </div>
                    ) : isGeneratingExplanation && !explanation ? (
                      <div style={inlineStyles.s96}>
                        <Loader2 size={20} style={inlineStyles.s97} color="#22C5A0" />
                        <span style={inlineStyles.s98}>Generating tutor response...</span>
                      </div>
                    ) : (
                      <div className="md-content" style={inlineStyles.s99}>
                        <ReactMarkdown remarkPlugins={[remarkGfm]}>
                          {explanation}
                        </ReactMarkdown>
                      </div>
                    )}
                  </div>
                </div>
              )}

              {/* Tab 2: Instructions and Test cases (only if exercise is active) */}
              {codingExercise?.hasExercise && activeTab === 'instructions' && (
                <div style={inlineStyles.s100}>
                  <div>
                    <h5 style={inlineStyles.s101}>
                      Instructions
                    </h5>
                    <div style={inlineStyles.s102} className="md-content">
                      <ReactMarkdown remarkPlugins={[remarkGfm]}>
                        {codingExercise.instruction || "*No instructions provided.*"}
                      </ReactMarkdown>
                    </div>
                  </div>

                  <div style={inlineStyles.s103}>
                    <h5 style={inlineStyles.s104}>
                      Test Cases & Assertions
                    </h5>
                    <div style={inlineStyles.s105}>
                      {verifyState === 'success' && (
                        <div style={inlineStyles.s106}>
                          <CheckCircle size={14} />
                          <span>All test cases passed! 🎉</span>
                        </div>
                      )}
                      {verifyState === 'failed' && (
                        <div style={inlineStyles.s107}>
                          <AlertCircle size={14} />
                          <span>Some assertions failed.</span>
                        </div>
                      )}
                      {(codingExercise.testCases || []).map((tc, tcIdx) => {
                        const tcResult = assertionResults.find(r => r.expr === tc);
                        let status = 'idle';
                        if (verifyState === 'verifying') status = 'verifying';
                        else if (tcResult) status = tcResult.passed ? 'passed' : 'failed';

                        return (
                          <div key={tcIdx} style={inlineStyles.s108}>
                            <div style={inlineStyles.s109}>
                              {status === 'verifying' && <Loader2 size={12} style={inlineStyles.s110} />}
                              {status === 'passed' && <CheckCircle size={12} color="#22C5A0" />}
                              {status === 'failed' && <X size={12} color="#F55B6B" />}
                              {status === 'idle' && <div style={inlineStyles.s111} />}
                              <span style={featureStyleFunctions.s21({status})}>
                                {tc}
                              </span>
                            </div>
                            {tcResult && !tcResult.passed && tcResult.msg && (
                              <span style={inlineStyles.s112}>
                                Error: {tcResult.msg}
                              </span>
                            )}
                          </div>
                        );
                      })}
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>

      </div>

      
    </div>
  );

}
