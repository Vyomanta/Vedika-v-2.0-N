'use client';
import dynamic from 'next/dynamic';
import * as featureStyleFunctions from '@/features/code-puzzles/styles/CodePuzzle.cd651dd1.styles.js';

import inlineStyles from '@/features/code-puzzles/styles/CodePuzzle.styles';
import '@/features/code-puzzles/styles/CodePuzzle.css';
import { useState, useEffect, useRef, useCallback, useMemo } from 'react';
import { useRouter } from 'next/navigation';
const CodeMirror = dynamic(() => import('@uiw/react-codemirror'), { ssr: false });
import { python } from '@codemirror/lang-python';
import { html } from '@codemirror/lang-html';
import { usePyodide } from '@/hooks/usePyodide';
import {
  Play, RotateCcw, Save, Download, Check, Copy, ChevronLeft, ChevronRight,
  ChevronDown, ChevronUp, X, Plus, Terminal as TerminalIcon, CheckSquare,
  Eye, FileText, Code, Settings, Sparkles, Loader2, Target,
  FileCode, FolderTree, RefreshCw, ExternalLink, Monitor, Tablet,
  Smartphone, Award, AlertCircle, HelpCircle, Lightbulb, Zap, Globe,
  BookOpen, Trash2, Brain, Home
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { StateField, StateEffect } from "@codemirror/state";
import { EditorView, Decoration, WidgetType, keymap } from "@codemirror/view";
import { indentUnit, indentOnInput } from '@codemirror/language';
import { indentWithTab } from '@codemirror/commands';
import { Terminal } from 'xterm';
import { FitAddon } from 'xterm-addon-fit';
import 'xterm/css/xterm.css';
import { getMascotBridge } from '@/lib/mascotBridge';
import { useMediaQuery, isMobileMQ, isTabletMQ } from '@/lib/useMediaQuery';
import {setErrorEffect,ErrorWidget,errorDecorationField,CustomDropdown,FACULTY_PUZZLES,WEB_PUZZLES,isLineIncompleteInProgress,getVariableBestPracticeTip,validatePythonStepLocally} from '@/features/code-puzzles/components/features-code-puzzles-components-CodePuzzle.support.jsx';
import {useCodePuzzleModel} from '@/features/code-puzzles/hooks/features-code-puzzles-components-CodePuzzle.jsx';
export default function CodePuzzle() {
const {router,navigateOut,handleBackToVedikaAI,category,setCategory,puzzleSource,setPuzzleSource,facultyPuzzleIndex,setFacultyPuzzleIndex,webPuzzleIndex,setWebPuzzleIndex,aiDifficulty,setAiDifficulty,customFacultyPuzzles,setCustomFacultyPuzzles,allFacultyPuzzles,aiGeneratedPuzzle,setAiGeneratedPuzzle,isGeneratingPuzzle,setIsGeneratingPuzzle,activePuzzle,activeWebPuzzle,pythonFiles,setPythonFiles,activePythonFile,setActivePythonFile,openPythonTabs,setOpenPythonTabs,webFiles,setWebFiles,activeWebFile,setActiveWebFile,openWebTabs,setOpenWebTabs,currentFiles,activeFileName,openTabs,activeFile,isExplorerOpen,setIsExplorerOpen,activeActivityIcon,setActiveActivityIcon,isCreatingFile,setIsCreatingFile,newFileName,setNewFileName,cursorPos,setCursorPos,compiledWebTime,setCompiledWebTime,previewDevice,setPreviewDevice,webCompileSuccess,setWebCompileSuccess,currentStepIndex,setCurrentStepIndex,isValidating,setIsValidating,validationError,setValidationError,stepPassed,setStepPassed,stepSuggestion,setStepSuggestion,activeRightTab,setActiveRightTab,activeBottomTab,setActiveBottomTab,isConstraintsOpen,setIsConstraintsOpen,copiedField,setCopiedField,saveToast,setSaveToast,traceData,setTraceData,currentStep,setCurrentStep,isPlaying,setIsPlaying,isTracing,setIsTracing,traceError,setTraceError,playSpeed,setPlaySpeed,testResults,setTestResults,isRunningTests,setIsRunningTests,rawOutputLog,setRawOutputLog,terminalElRef,terminalInstanceRef,fitAddonRef,playIntervalRef,editorViewRef,debounceTimerRef,isMobile,isTablet,mobileActiveView,setMobileActiveView,bottomSplitPercent,setBottomSplitPercent,isTerminalCollapsed,setIsTerminalCollapsed,rightPanelWidth,setRightPanelWidth,isDraggingBottomRef,isDraggingRightRef,centerContainerRef,validateStepRef,handleAskVedikaCodeCheck,handleCodeChange,handleSelectFile,handleCreateFile,handleCloseTab,handleDeleteFile,handleCategoryChange,editorExtensions,compiledWebContent,initTerminal,waitingForInputRef,stdinLineRef,sendStdinRef,onStdout,onStderr,onReady,onFinish,onError,onTraceResult,onStdinRequest,isReady,isRunning,runCode,runTrace,stopCode,sendStdin,validateStep,handleManualCheck,handleNextStep,handleResetSteps,handleGenerateAiPuzzle,handleRunCode,handleVisualizeCode,handleResetCode,handleDownloadCode,handleCopyText,handleRunAllTests,handleBottomMouseDown,renderWebPreview,renderArrayVisualizer,render2DVisualizer}=useCodePuzzleModel();
return (
    <div style={inlineStyles.s36}>

      {/* ── TOP HEADER BAR ── */}
      <div style={featureStyleFunctions.s0({isMobile})}>
        {/* Left: < Back Button & Tabs Switcher / Sandbox & Puzzle Selector */}
        <div style={featureStyleFunctions.s1({isMobile})}>
          {/* < Back Button -> Clearly labeled "< Back" */}
          <button
            type="button"
            onClick={handleBackToVedikaAI}
            title="Back to Vedika AI Hub"
            aria-label="Back to Vedika AI Hub"
            style={featureStyleFunctions.s2({isMobile})}
          >
            <ChevronLeft size={isMobile ? 14 : 15} />
            <span>Back</span>
          </button>

          {/* Sandbox & Exercise Selector (No redundant Courses > Vedika AI Hub breadcrumbs) */}
          <div style={featureStyleFunctions.s3({isMobile})}>
            <CustomDropdown
              value={category}
              onChange={handleCategoryChange}
              color={category === 'html' ? '#38BDF8' : '#A855F7'}
              minWidth={isMobile ? 74 : 125}
              maxWidth={isMobile ? 90 : 160}
              options={[
                { value: 'programming', label: isMobile ? 'Python' : 'Python 3.11' },
                { value: 'html', label: isMobile ? 'Web' : 'HTML / Web' }
              ]}
            />

            {!isMobile && <ChevronRight size={13} color="#64748B" style={inlineStyles.s37} />}

            {category === 'html' ? (
              <CustomDropdown
                value={webPuzzleIndex}
                onChange={idx => {
                  setWebPuzzleIndex(idx);
                  const wp = WEB_PUZZLES[idx];
                  setWebFiles([
                    { name: 'index.html', language: 'html', content: wp.html, isDefault: true },
                    { name: 'style.css', language: 'css', content: wp.css, isDefault: true },
                    { name: 'script.js', language: 'javascript', content: wp.js, isDefault: true }
                  ]);
                  setActiveWebFile('index.html');
                  setOpenWebTabs(['index.html', 'style.css', 'script.js']);
                  setCurrentStepIndex(0);
                  setStepPassed(false);
                  setStepSuggestion('');
                  setValidationError(null);
                  setCompiledWebTime(Date.now());
                }}
                color="#38BDF8"
                minWidth={isMobile ? 110 : 180}
                maxWidth={isMobile ? 140 : 360}
                options={WEB_PUZZLES.map((wp, idx) => ({ value: idx, label: `${idx + 1}. ${wp.title}` }))}
              />
            ) : (
              <CustomDropdown
                value={facultyPuzzleIndex}
                onChange={idx => {
                  setPuzzleSource('faculty');
                  setFacultyPuzzleIndex(idx);
                  const p = allFacultyPuzzles[idx] || allFacultyPuzzles[0];
                  setPythonFiles(prev => prev.map(f => f.name === 'main.py' ? { ...f, content: p.starterCode } : f));
                  setCurrentStepIndex(0);
                  setStepPassed(false);
                  setStepSuggestion('');
                  setValidationError(null);
                }}
                color="#A855F7"
                minWidth={isMobile ? 110 : 180}
                maxWidth={isMobile ? 140 : 360}
                options={allFacultyPuzzles.map((p, idx) => ({ value: idx, label: `${idx + 1}. ${p.title}` }))}
              />
            )}
          </div>
        </div>

        {/* Right: Actions (Courses, Download [Auto-saved], Reset, Ask Vedika) */}
        <div style={featureStyleFunctions.s4({isMobile})}>
          {/* Courses Quick Navigation Button */}
          {!isMobile && (
            <button
              type="button"
              onClick={() => {
                if (typeof window !== 'undefined') {
                  localStorage.removeItem('selected_course_id');
                  window.dispatchEvent(new CustomEvent('reset_courses_view'));
                }
                navigateOut('/courses');
              }}
              style={inlineStyles.s38}
              title="Navigate to Courses"
            >
              <BookOpen size={14} color="#38BDF8" />
              <span>Courses</span>
            </button>
          )}

          {/* Download Active File Button (Changes auto-saved automatically) */}
          <button
            type="button"
            onClick={handleDownloadCode}
            style={featureStyleFunctions.s5({isMobile,saveToast})}
            title={`Auto-saved • Download ${activeFile?.name || 'current file'}`}
          >
            {saveToast ? <Check size={14} color="#34D399" /> : <Download size={14} color="#38BDF8" />}
            {!isMobile && <span>{saveToast ? `Downloaded ${activeFile?.name}` : `Download (${activeFile?.name || 'file'})`}</span>}
          </button>

          {/* Reset Button */}
          <button
            type="button"
            onClick={handleResetCode}
            style={featureStyleFunctions.s6({isMobile})}
            title="Reset code to starter template"
          >
            <RotateCcw size={isMobile ? 13 : 14} />
            {!isMobile && <span>Reset</span>}
          </button>

          {/* Ask Vedika Code Help Button */}
          <button
            type="button"
            onClick={handleAskVedikaCodeCheck}
            style={featureStyleFunctions.s7({isMobile})}
            title="Ask Vedika AI Tutor to inspect your code, explain errors, and guide your fix"
          >
            <Sparkles size={13} color="#FBBF24" />
            {!isMobile && <span>Ask Vedika</span>}
          </button>
        </div>
      </div>

      {/* ── MAIN IDE WORKSPACE GRID ── */}
      <div style={inlineStyles.s39}>

        {/* ── 1. LEFT ACTIVITY BAR (44px width) ── */}
        <div style={featureStyleFunctions.s8({isMobile})}>
          {/* Files Icon Toggle */}
          <button
            onClick={() => {
              if (activeActivityIcon === 'files') {
                setIsExplorerOpen(!isExplorerOpen);
              } else {
                setActiveActivityIcon('files');
                setIsExplorerOpen(true);
              }
            }}
            title="Files Explorer"
            style={featureStyleFunctions.s9({activeActivityIcon,isExplorerOpen})}
          >
            <FileCode size={18} />
          </button>

          {/* Tree / Catalog Icon */}
          <button
            onClick={() => {
              setActiveActivityIcon('tree');
              setIsExplorerOpen(true);
            }}
            title="Catalog / Puzzles List"
            style={featureStyleFunctions.s10({activeActivityIcon,isExplorerOpen})}
          >
            <FolderTree size={18} />
          </button>
        </div>

        {/* ── 2. COLLAPSIBLE FILE EXPLORER (210px width) ── */}
        <div style={featureStyleFunctions.s11({isMobile,isExplorerOpen})}>
          {isExplorerOpen && (
            <div style={featureStyleFunctions.s12({isMobile})}>
              {/* Explorer Header */}
              <div style={inlineStyles.s40}>
                <span style={inlineStyles.s41}>
                  {activeActivityIcon === 'files' ? (category === 'html' ? 'WEB FILES' : 'PYTHON FILES') : 'CATALOG'}
                </span>
                
                {activeActivityIcon === 'files' && (
                  <div style={inlineStyles.s42}>
                    <button
                      onClick={() => setIsCreatingFile(true)}
                      title="Add File"
                      style={inlineStyles.s43}
                    >
                      <Plus size={14} />
                    </button>
                    <button
                      onClick={() => setIsExplorerOpen(false)}
                      title="Collapse Sidebar"
                      style={inlineStyles.s44}
                    >
                      <ChevronLeft size={14} />
                    </button>
                  </div>
                )}
              </div>

              {/* View 1: Files List */}
              {activeActivityIcon === 'files' && (
                <div style={inlineStyles.s45}>
                  {/* Inline New File Input */}
                  {isCreatingFile && (
                    <div style={inlineStyles.s46}>
                      <input
                        autoFocus
                        type="text"
                        placeholder={category === 'html' ? "e.g. script2.js" : "e.g. helper.py"}
                        value={newFileName}
                        onChange={e => setNewFileName(e.target.value)}
                        onKeyDown={e => {
                          if (e.key === 'Enter') handleCreateFile();
                          if (e.key === 'Escape') setIsCreatingFile(false);
                        }}
                        onBlur={() => {
                          if (!newFileName.trim()) setIsCreatingFile(false);
                        }}
                        style={inlineStyles.s47}
                      />
                    </div>
                  )}

                  {/* File Items */}
                  {currentFiles.map((file) => {
                    const isActive = activeFileName === file.name;
                    const isPy = file.name.endsWith('.py');
                    const isHtml = file.name.endsWith('.html') || file.name.endsWith('.htm');
                    const isCss = file.name.endsWith('.css');
                    const isJs = file.name.endsWith('.js');

                    return (
                      <div
                        key={file.name}
                        onClick={() => handleSelectFile(file.name)}
                        style={featureStyleFunctions.s13({isActive})}
                      >
                        <div style={inlineStyles.s48}>
                          {isPy && <Code size={14} color={isActive ? "#A855F7" : "#38BDF8"} />}
                          {isHtml && <Globe size={14} color={isActive ? "#38BDF8" : "#E2E8F0"} />}
                          {isCss && <FileCode size={14} color={isActive ? "#F472B6" : "#A855F7"} />}
                          {isJs && <Code size={14} color={isActive ? "#FBBF24" : "#F59E0B"} />}
                          {!isPy && !isHtml && !isCss && !isJs && <FileText size={14} color="#94A3B8" />}
                          <span style={inlineStyles.s49}>
                            {file.name}
                          </span>
                        </div>

                        {file.name !== 'main.py' && file.name !== 'index.html' && (
                          <button
                            onClick={(e) => handleDeleteFile(file.name, e)}
                            title={`Delete ${file.name}`}
                            style={inlineStyles.s50}
                            onMouseEnter={e => { e.currentTarget.style.color = '#EF4444'; e.currentTarget.style.background = 'rgba(239, 68, 68, 0.12)'; }}
                            onMouseLeave={e => { e.currentTarget.style.color = '#64748B'; e.currentTarget.style.background = 'transparent'; }}
                          >
                            <Trash2 size={13} />
                          </button>
                        )}
                      </div>
                    );
                  })}
                </div>
              )}

              {/* View 2: Puzzles Catalog */}
              {activeActivityIcon === 'tree' && (
                <div style={inlineStyles.s51}>
                  <div style={inlineStyles.s52}>
                    {category === 'html' ? 'Web Challenges' : 'Python Faculty Challenges'}
                  </div>
                  <div style={inlineStyles.s53}>
                    {category === 'html' ? (
                      WEB_PUZZLES.map((wp, idx) => (
                        <div
                          key={wp.id}
                          onClick={() => {
                            setWebPuzzleIndex(idx);
                            setWebFiles([
                              { name: 'index.html', language: 'html', content: wp.html, isDefault: true },
                              { name: 'style.css', language: 'css', content: wp.css, isDefault: true },
                              { name: 'script.js', language: 'javascript', content: wp.js, isDefault: true }
                            ]);
                            setActiveWebFile('index.html');
                            setOpenWebTabs(['index.html', 'style.css', 'script.js']);
                            setCompiledWebTime(Date.now());
                          }}
                          style={featureStyleFunctions.s14({webPuzzleIndex,idx})}
                        >
                          <div style={inlineStyles.s54}>{idx + 1}. {wp.title}</div>
                          <div style={inlineStyles.s55}>{wp.difficulty}</div>
                        </div>
                      ))
                    ) : (
                      allFacultyPuzzles.map((p, idx) => (
                        <div
                          key={p.id}
                          onClick={() => {
                            setPuzzleSource('faculty');
                            setFacultyPuzzleIndex(idx);
                            setPythonFiles(prev => prev.map(f => f.name === 'main.py' ? { ...f, content: p.starterCode } : f));
                          }}
                          style={featureStyleFunctions.s15({puzzleSource,facultyPuzzleIndex,idx})}
                        >
                          <div style={inlineStyles.s56}>{idx + 1}. {p.title}</div>
                          <div style={inlineStyles.s57}>{p.difficulty}</div>
                        </div>
                      ))
                    )}
                  </div>
                </div>
              )}
            </div>
          )}
        </div>

        {/* ── 3. CENTER WORKSPACE (Editor + Bottom Panel) ── */}
        <div
          ref={centerContainerRef}
          style={featureStyleFunctions.s16({isMobile,mobileActiveView})}
        >
          {/* Top: Editor Canvas & Multi-Tabs */}
          <div style={featureStyleFunctions.s17({isMobile,mobileActiveView})}>
            {/* Editor Tab Bar */}
            <div style={inlineStyles.s58}>
              {openTabs.map((tabName) => {
                const isActive = activeFileName === tabName;
                const isPy = tabName.endsWith('.py');
                const isHtml = tabName.endsWith('.html');
                const isCss = tabName.endsWith('.css');
                const isJs = tabName.endsWith('.js');

                return (
                  <div
                    key={tabName}
                    onClick={() => handleSelectFile(tabName)}
                    style={featureStyleFunctions.s18({isActive})}
                  >
                    {isPy && <Code size={13} color={isActive ? "#A855F7" : "#64748B"} />}
                    {isHtml && <Globe size={13} color={isActive ? "#38BDF8" : "#64748B"} />}
                    {isCss && <FileCode size={13} color={isActive ? "#F472B6" : "#64748B"} />}
                    {isJs && <Code size={13} color={isActive ? "#FBBF24" : "#64748B"} />}
                    {!isPy && !isHtml && !isCss && !isJs && <FileText size={13} color="#64748B" />}
                    <span style={inlineStyles.s59}>{tabName}</span>

                    {openTabs.length > 1 && (
                      <button
                        onClick={(e) => handleCloseTab(tabName, e)}
                        title="Close Tab"
                        style={inlineStyles.s60}
                      >
                        <X size={12} />
                      </button>
                    )}
                  </div>
                );
              })}

              {/* Plus Button to add file tab */}
              <button
                onClick={() => {
                  setIsExplorerOpen(true);
                  setIsCreatingFile(true);
                }}
                title="New File Tab"
                style={inlineStyles.s61}
              >
                <Plus size={14} />
              </button>
            </div>

            {/* Unified CodeMirror Editor Canvas */}
            <div style={inlineStyles.s62}>
              
              <CodeMirror
                key={activeFileName}
                value={activeFile.content || ''}
                height="100%"
                extensions={editorExtensions}
                theme="dark"
                indentWithTab={true}
                basicSetup={{
                  lineNumbers: true,
                  highlightActiveLineGutter: true,
                  highlightSpecialChars: true,
                  history: true,
                  foldGutter: true,
                  drawSelection: true,
                  indentOnInput: true,
                  syntaxHighlighting: true,
                  bracketMatching: true,
                  closeBrackets: true,
                  autocompletion: true,
                  tabSize: 4
                }}
                onChange={handleCodeChange}
                onCreateEditor={(view) => {
                  editorViewRef.current = view;
                }}
                onUpdate={(viewUpdate) => {
                  const head = viewUpdate.state.selection.main.head;
                  const line = viewUpdate.state.doc.lineAt(head);
                  setCursorPos({ line: line.number, col: head - line.from + 1 });
                }}
                style={inlineStyles.s63}
              />
            </div>

            {/* Mobile In-Editor Step HUD Banner (Step count, Title/Description & Check/Next button) */}
            {isMobile && category === 'programming' && activePuzzle?.steps && (
              <div style={featureStyleFunctions.s19({stepPassed,validationError})}>
                <div style={inlineStyles.s64}>
                  <span style={featureStyleFunctions.s20({stepPassed,validationError})}>
                    Step {currentStepIndex + 1}/{activePuzzle.steps.length}
                  </span>
                  <span style={featureStyleFunctions.s21({stepPassed,validationError})}>
                    {validationError ? `Line ${validationError.line}: ${validationError.message}` : (activePuzzle.steps[currentStepIndex]?.shortTitle || activePuzzle.steps[currentStepIndex]?.description || '')}
                  </span>
                </div>

                {stepPassed ? (
                  <button
                    onClick={handleNextStep}
                    style={inlineStyles.s65}
                  >
                    <span>Next</span>
                    <ChevronRight size={12} />
                  </button>
                ) : (
                  <button
                    onClick={handleManualCheck}
                    disabled={isValidating || !activePuzzle}
                    style={featureStyleFunctions.s22({isValidating,activePuzzle})}
                  >
                    {isValidating ? <Loader2 size={11} style={inlineStyles.s66} /> : <Check size={11} color="#22C5A0" strokeWidth={3} />}
                    <span>Check</span>
                  </button>
                )}
              </div>
            )}

            {/* Editor Action Toolbar (Run Code, Visualize Code, Check Step) */}
            <div style={featureStyleFunctions.s23({isMobile})}>
              <div style={inlineStyles.s67}>
                <button
                  onClick={handleRunCode}
                  disabled={category === 'programming' && (!isReady || isRunning)}
                  style={featureStyleFunctions.s24({category,isReady,isRunning})}
                >
                  <Play size={12} fill="#000" />
                  <span>{category === 'html' ? (webCompileSuccess ? (isMobile ? 'Updated' : 'Live Updated!') : (isMobile ? 'Preview' : 'Run Web Preview')) : (isRunning ? 'Running...' : 'Run Code')}</span>
                </button>

                {category === 'programming' && (
                  <button
                    onClick={handleVisualizeCode}
                    disabled={!isReady || isRunning || isTracing || !activePuzzle}
                    style={featureStyleFunctions.s25({isReady,isRunning,isTracing,activePuzzle})}
                  >
                    <Zap size={12} fill="currentColor" />
                    <span>{isMobile ? 'Visualize' : 'Visualize Code'}</span>
                  </button>
                )}
              </div>

              <div style={inlineStyles.s68}>
                <button
                  onClick={handleManualCheck}
                  disabled={isValidating || !activePuzzle}
                  style={featureStyleFunctions.s26({isValidating,activePuzzle})}
                >
                  {isValidating ? <Loader2 size={12} style={inlineStyles.s69} /> : <Check size={12} color="#22C5A0" strokeWidth={3} />}
                  <span>Check Step</span>
                </button>

                {!isMobile && (
                  <div style={inlineStyles.s70}>
                    <span>Ln {cursorPos.line}, Col {cursorPos.col}</span>
                    <span>Spaces: 4</span>
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Horizontal Resizer & Bottom Terminal (Only rendered in Python/programming mode, completely omitted in HTML mode) */}
          {category !== 'html' && (
            <>
              {/* Horizontal Resizer Bar */}
              {!isTerminalCollapsed && !isMobile && (
                <div
                  onMouseDown={handleBottomMouseDown}
                  style={featureStyleFunctions.s27({isDraggingBottomRef})}
                />
              )}

              {/* ── 4. BOTTOM PANEL (Console Terminal) ── */}
              <div style={featureStyleFunctions.s28({isMobile,isTerminalCollapsed,bottomSplitPercent,mobileActiveView})}>
                {/* Panel Header */}
                <div style={featureStyleFunctions.s29({isTerminalCollapsed})}>
                  {/* Header Title */}
                  <div style={inlineStyles.s71}>
                    <TerminalIcon size={14} color="#A855F7" />
                    <span style={inlineStyles.s72}>
                      Console Terminal
                    </span>
                  </div>

                  {/* Right Actions: Collapse/Expand Toggle + Clear Console */}
                  <div style={inlineStyles.s73}>
                    <button
                      onClick={() => setIsTerminalCollapsed(prev => !prev)}
                      title={isTerminalCollapsed ? "Expand Terminal" : "Collapse Terminal"}
                      style={inlineStyles.s74}
                      onMouseEnter={e => { e.currentTarget.style.color = '#F1F5F9'; e.currentTarget.style.background = 'rgba(255, 255, 255, 0.1)'; }}
                      onMouseLeave={e => { e.currentTarget.style.color = '#94A3B8'; e.currentTarget.style.background = 'rgba(255, 255, 255, 0.05)'; }}
                    >
                      {isTerminalCollapsed ? <ChevronUp size={12} /> : <ChevronDown size={12} />}
                      <span>{isTerminalCollapsed ? 'Expand' : 'Collapse'}</span>
                    </button>

                    <button
                      onClick={() => {
                        if (terminalInstanceRef.current) terminalInstanceRef.current.clear();
                        setRawOutputLog('');
                      }}
                      style={inlineStyles.s75}
                      onMouseEnter={e => e.currentTarget.style.color = '#F1F5F9'}
                      onMouseLeave={e => e.currentTarget.style.color = '#64748B'}
                    >
                      <RotateCcw size={12} />
                      <span>Clear</span>
                    </button>
                  </div>
                </div>

                {/* Terminal Console Body (hidden when collapsed) */}
                {!isTerminalCollapsed && (
                  <div
                    style={inlineStyles.s76}
                  >
                    <div ref={terminalElRef} style={inlineStyles.s77} />
                  </div>
                )}
              </div>
            </>
          )}
        </div>

        {/* Vertical Resizer Bar for Right Panel */}
        {!isMobile && (
          <div
            onMouseDown={(e) => {
              e.preventDefault();
              isDraggingRightRef.current = true;
              const onMouseMove = (moveEvent) => {
                if (!isDraggingRightRef.current) return;
                const newW = window.innerWidth - moveEvent.clientX;
                setRightPanelWidth(Math.max(340, Math.min(700, newW)));
              };
              const onMouseUp = () => {
                isDraggingRightRef.current = false;
                document.removeEventListener('mousemove', onMouseMove);
                document.removeEventListener('mouseup', onMouseUp);
              };
              document.addEventListener('mousemove', onMouseMove);
              document.addEventListener('mouseup', onMouseUp);
            }}
            style={inlineStyles.s78}
          />
        )}

        {/* ── 5. RIGHT MULTI-TAB PANEL ── */}
        <div style={featureStyleFunctions.s30({isMobile,isTablet,rightPanelWidth,mobileActiveView})}>
          {/* Right Panel Tab Bar */}
          {/* Right Panel Tab Bar */}
          <div style={inlineStyles.s79}>
            {(category === 'html' ? [
              { id: 'preview', label: 'Live Preview', icon: Globe },
              { id: 'guide', label: 'Guide Wizard', icon: BookOpen }
            ] : [
              { id: 'guide', label: 'Guide Wizard', icon: BookOpen },
              { id: 'visualizer', label: 'Variables Visualizer', icon: Zap }
            ]).map(tab => {
              const isActive = activeRightTab === tab.id;
              const Icon = tab.icon;
              const activeColor = tab.id === 'visualizer' ? '#F5A95B' : tab.id === 'preview' ? '#38BDF8' : '#5B8CF8';
              return (
                <button
                  key={tab.id}
                  onClick={() => setActiveRightTab(tab.id)}
                  style={featureStyleFunctions.s31({isActive,activeColor})}
                >
                  <Icon size={13} fill={tab.id === 'visualizer' && isActive ? 'currentColor' : 'none'} />
                  <span>{tab.label}</span>
                </button>
              );
            })}
          </div>

          {/* Right Panel Content Scroll Area */}
          <div className="guide-wizard-panel" style={featureStyleFunctions.s32({activeRightTab})}>

            {/* ── TAB: LIVE PREVIEW (For HTML / Web) ── */}
            {category === 'html' && activeRightTab === 'preview' && (
              <div style={inlineStyles.s80}>
                {renderWebPreview(true)}
              </div>
            )}

            {/* ── TAB: GUIDE WIZARD (Python) ── */}
            {activeRightTab === 'guide' && category === 'programming' && (
              <div style={inlineStyles.s81}>
                {/* 1. Exercise Provider Card */}
                <div style={inlineStyles.s82}>
                  <span style={inlineStyles.s83}>Exercise Provider:</span>
                  <CustomDropdown
                    value={puzzleSource}
                    onChange={(src) => {
                      setPuzzleSource(src);
                      setValidationError(null);
                      setStepPassed(false);
                      if (src === 'faculty') {
                        const p = allFacultyPuzzles[facultyPuzzleIndex] || allFacultyPuzzles[0];
                        setPythonFiles(prev => prev.map(f => f.name === 'main.py' ? { ...f, content: p.starterCode } : f));
                      } else if (aiGeneratedPuzzle) {
                        setPythonFiles(prev => prev.map(f => f.name === 'main.py' ? { ...f, content: aiGeneratedPuzzle.starterCode } : f));
                      }
                      setCurrentStepIndex(0);
                    }}
                    color="#5B8CF8"
                    minWidth={170}
                    options={[
                      { value: 'faculty', label: '🏫 Given by Faculty' },
                      { value: 'ai', label: '🤖 Given by AI TUTOR' }
                    ]}
                  />
                </div>

                {/* 2. AI Generator Panel (Only shown if puzzleSource === 'ai') */}
                {puzzleSource === 'ai' && (
                  <div style={inlineStyles.s84}>
                    <div style={inlineStyles.s85}>
                      <Sparkles size={15} color="#5B8CF8" />
                      <span style={inlineStyles.s86}>
                        AI Tutor Config
                      </span>
                    </div>

                    <div style={inlineStyles.s87}>
                      <div style={inlineStyles.s88}>
                        <span style={inlineStyles.s89}>Difficulty Level</span>
                        <CustomDropdown
                          value={aiDifficulty}
                          onChange={setAiDifficulty}
                          color="#5B8CF8"
                          minWidth={140}
                          options={[
                            { value: 'beginner', label: '🟢 Beginner' },
                            { value: 'intermediate', label: '🟡 Intermediate' },
                            { value: 'advanced', label: '🔴 Advanced' }
                          ]}
                        />
                      </div>

                      <button
                        onClick={handleGenerateAiPuzzle}
                        disabled={isGeneratingPuzzle}
                        style={featureStyleFunctions.s33({isGeneratingPuzzle})}
                      >
                        {isGeneratingPuzzle ? <Loader2 size={12} style={inlineStyles.s90} /> : <Sparkles size={12} fill="currentColor" />}
                        <span>Generate AI Puzzle</span>
                      </button>
                    </div>
                  </div>
                )}

                {/* AI Loader */}
                {isGeneratingPuzzle && (
                  <div style={inlineStyles.s91}>
                    <Loader2 size={24} style={inlineStyles.s92} color="#5B8CF8" />
                    <span style={inlineStyles.s93}>AI is composing your coding challenge...</span>
                    <span style={inlineStyles.s94}>Creating dynamic step instructions, initial starter templates, and testing validations.</span>
                  </div>
                )}

                {/* Placeholder when no AI puzzle loaded */}
                {!isGeneratingPuzzle && puzzleSource === 'ai' && !aiGeneratedPuzzle && (
                  <div style={inlineStyles.s95}>
                    <HelpCircle size={24} color="#647298" />
                    <span style={inlineStyles.s96}>No AI Puzzle Generated Yet</span>
                    <span style={inlineStyles.s97}>Select a difficulty level above and click <strong>Generate AI Puzzle</strong> to begin learning.</span>
                  </div>
                )}

                {/* 3. Problem Objective Card */}
                {!isGeneratingPuzzle && activePuzzle && (
                  <div style={inlineStyles.s98}>
                    <div style={inlineStyles.s99}>
                      <div style={inlineStyles.s100}>
                        <Award size={16} color="#5B8CF8" />
                        <span style={inlineStyles.s101}>
                          Problem Objective
                        </span>
                      </div>
                      <span style={inlineStyles.s102}>
                        {activePuzzle.difficulty || 'Easy'}
                      </span>
                    </div>

                    <h3 style={inlineStyles.s103}>
                      {puzzleSource === 'faculty' ? `${facultyPuzzleIndex + 1}. ` : ''}{activePuzzle.title}
                    </h3>
                    
                    <p style={inlineStyles.s104}>
                      {activePuzzle.description}
                    </p>

                    {/* Sample Input / Output / Constraints */}
                    <div style={inlineStyles.s105}>
                      <div style={inlineStyles.s106}>
                        <div style={inlineStyles.s107}>
                          <span style={inlineStyles.s108}>
                            Sample Input
                          </span>
                          <button
                            onClick={() => handleCopyText(activePuzzle?.sampleInput || '', 'input')}
                            title="Copy Input"
                            style={featureStyleFunctions.s34({copiedField})}
                          >
                            {copiedField === 'input' ? <Check size={12} /> : <Copy size={12} />}
                          </button>
                        </div>
                        <div style={inlineStyles.s109}>
                          {activePuzzle?.sampleInput || 'arr = [12, 3, 45, 7, 23, 19]'}
                        </div>
                      </div>

                      <div style={inlineStyles.s110}>
                        <div style={inlineStyles.s111}>
                          <span style={inlineStyles.s112}>
                            Expected Output
                          </span>
                          <button
                            onClick={() => handleCopyText(activePuzzle?.sampleOutput || '', 'output')}
                            title="Copy Output"
                            style={featureStyleFunctions.s35({copiedField})}
                          >
                            {copiedField === 'output' ? <Check size={12} /> : <Copy size={12} />}
                          </button>
                        </div>
                        <div style={inlineStyles.s113}>
                          {activePuzzle?.sampleOutput || '45'}
                        </div>
                      </div>

                      {/* Constraints Accordion */}
                      {activePuzzle?.constraints && activePuzzle.constraints.length > 0 && (
                        <div style={inlineStyles.s114}>
                          <button
                            onClick={() => setIsConstraintsOpen(!isConstraintsOpen)}
                            style={inlineStyles.s115}
                          >
                            <span>Constraints</span>
                            <ChevronDown size={13} style={featureStyleFunctions.s36({isConstraintsOpen})} />
                          </button>

                          {isConstraintsOpen && (
                            <div style={inlineStyles.s116}>
                              {activePuzzle.constraints.map((c, i) => (
                                <div key={i} style={inlineStyles.s117}>
                                  • {c}
                                </div>
                              ))}
                            </div>
                          )}
                        </div>
                      )}
                    </div>
                  </div>
                )}

                {/* 4. Step-by-Step Guidance Stack */}
                {!isGeneratingPuzzle && activePuzzle && (
                  <div style={inlineStyles.s118}>
                    <div style={inlineStyles.s119}>
                      <span style={inlineStyles.s120}>
                        Step-by-step guidance ({currentStepIndex + 1}/{activePuzzle.steps.length})
                      </span>
                      <button
                        onClick={handleResetSteps}
                        style={inlineStyles.s121}
                      >
                        Reset Steps
                      </button>
                    </div>

                    {activePuzzle.steps.map((step, idx) => {
                      const isCompleted = idx < currentStepIndex;
                      const isActive = idx === currentStepIndex;
                      const isLocked = idx > currentStepIndex;

                      let stepBorderColor = 'rgba(255,255,255,0.05)';
                      let stepBg = 'rgba(255,255,255,0.01)';
                      let numBg = 'rgba(255,255,255,0.06)';
                      let numColor = '#647298';

                      if (isCompleted) {
                        stepBorderColor = 'rgba(34, 197, 160, 0.25)';
                        stepBg = 'rgba(34, 197, 160, 0.03)';
                        numBg = '#22C5A0';
                        numColor = '#000';
                      } else if (isActive) {
                        if (validationError) {
                          stepBorderColor = 'rgba(245, 91, 107, 0.35)';
                          stepBg = 'rgba(245, 91, 107, 0.04)';
                          numBg = '#F55B6B';
                          numColor = '#fff';
                        } else if (stepPassed) {
                          stepBorderColor = 'rgba(34, 197, 160, 0.45)';
                          stepBg = 'rgba(34, 197, 160, 0.05)';
                          numBg = '#22C5A0';
                          numColor = '#000';
                        } else {
                          stepBorderColor = 'rgba(91, 140, 248, 0.35)';
                          stepBg = 'rgba(91, 140, 248, 0.04)';
                          numBg = '#5B8CF8';
                          numColor = '#000';
                        }
                      }

                      return (
                        <div
                          key={step.id}
                          style={featureStyleFunctions.s37({stepBg,stepBorderColor,isLocked})}
                        >
                          {/* Step Index Circle */}
                          <div style={featureStyleFunctions.s38({numBg,numColor})}>
                            {isCompleted ? <Check size={11} strokeWidth={3} /> : idx + 1}
                          </div>

                          <div style={inlineStyles.s122}>
                            <div style={inlineStyles.s123}>
                              <span style={featureStyleFunctions.s39({isCompleted,isActive,validationError})}>
                                {step.shortTitle}
                              </span>
                              {isActive && (
                                <span style={featureStyleFunctions.s40({validationError,stepPassed})}>
                                  {validationError ? 'Invalid' : stepPassed ? 'Passed' : 'Active'}
                                </span>
                              )}
                            </div>

                            <p style={featureStyleFunctions.s41({isLocked,isCompleted})}>
                              {step.description}
                            </p>

                            {/* In-step error message */}
                            {isActive && validationError && (
                              <div style={inlineStyles.s124}>
                                <AlertCircle size={12} color="#F55B6B" style={inlineStyles.s125} />
                                <span style={inlineStyles.s126}>
                                  Line {validationError.line}: {validationError.message}
                                </span>
                              </div>
                            )}

                            {/* Best-Practice Variable Naming Tip (Non-blocking) */}
                            {isActive && stepPassed && stepSuggestion && (
                              <div style={inlineStyles.s127}>
                                <Lightbulb size={12} color="#FBBF24" style={inlineStyles.s128} />
                                <span style={inlineStyles.s129}>
                                  {stepSuggestion}
                                </span>
                              </div>
                            )}

                            {/* Step passed Next button */}
                            {isActive && stepPassed && (
                              <div style={inlineStyles.s130}>
                                <button
                                  onClick={handleNextStep}
                                  style={inlineStyles.s131}
                                >
                                  Next Step
                                  <ChevronRight size={11} />
                                </button>
                              </div>
                            )}

                            {/* Final subtle celebration card */}
                            {isActive && idx === activePuzzle.steps.length - 1 && stepPassed && (
                              <div style={inlineStyles.s132}>
                                <div style={inlineStyles.s133}>
                                  <div style={inlineStyles.s134}>
                                    <Sparkles size={14} fill="#34D399" />
                                    <span>PUZZLE MASTERED!</span>
                                  </div>
                                  <span style={inlineStyles.s135}>
                                    +50 XP
                                  </span>
                                </div>
                                <span style={inlineStyles.s136}>
                                  Outstanding work! Your algorithm logic and variable references are completely verified and bug-free.
                                </span>
                                <div style={inlineStyles.s137}>
                                  <button
                                    type="button"
                                    onClick={handleRunCode}
                                    style={inlineStyles.s138}
                                  >
                                    <Play size={11} fill="currentColor" />
                                    <span>Run & Test Code</span>
                                  </button>
                                  <button
                                    type="button"
                                    onClick={() => {
                                      const nextIdx = (facultyPuzzleIndex + 1) % allFacultyPuzzles.length;
                                      setPuzzleSource('faculty');
                                      setFacultyPuzzleIndex(nextIdx);
                                      const nextP = allFacultyPuzzles[nextIdx];
                                      if (nextP) {
                                        setPythonFiles(prev => prev.map(f => f.name === 'main.py' ? { ...f, content: nextP.starterCode } : f));
                                      }
                                      setCurrentStepIndex(0);
                                      setStepPassed(false);
                                      setStepSuggestion('');
                                      setValidationError(null);
                                    }}
                                    style={inlineStyles.s139}
                                  >
                                    <span>Next Puzzle</span>
                                    <ChevronRight size={12} />
                                  </button>
                                </div>
                              </div>
                            )}
                          </div>
                        </div>
                      );
                    })}

                    {/* Check Current Step Button */}
                    <div style={inlineStyles.s140}>
                      <button
                        onClick={handleManualCheck}
                        disabled={isValidating}
                        style={featureStyleFunctions.s42({isValidating})}
                      >
                        {isValidating ? <Loader2 size={13} style={inlineStyles.s141} /> : <Check size={13} strokeWidth={3} />}
                        <span>Check Current Step</span>
                      </button>
                    </div>
                  </div>
                )}
              </div>
            )}

            {/* ── TAB: GUIDE WIZARD (HTML / Web) ── */}
            {activeRightTab === 'guide' && category === 'html' && (
              <div style={inlineStyles.s142}>
                {/* Web Problem Statement */}
                <div style={inlineStyles.s143}>
                  <div style={inlineStyles.s144}>
                    <div style={inlineStyles.s145}>
                      <Globe size={16} color="#38BDF8" />
                      <span style={inlineStyles.s146}>
                        Web Milestone Challenge
                      </span>
                    </div>
                    <span style={inlineStyles.s147}>
                      {activeWebPuzzle?.difficulty || 'Easy'}
                    </span>
                  </div>

                  <h3 style={inlineStyles.s148}>
                    {webPuzzleIndex + 1}. {activeWebPuzzle?.title}
                  </h3>

                  <p style={inlineStyles.s149}>
                    {activeWebPuzzle?.description}
                  </p>
                </div>

                {/* Web Sandbox Note */}
                <div style={inlineStyles.s150}>
                  💡 Switch to the <strong>Live Preview</strong> tab above to view your running application, or click <strong>Run Web Preview</strong> below the editor.
                </div>

                {/* Web Step-by-Step Guidance */}
                <div style={inlineStyles.s151}>
                  <div style={inlineStyles.s152}>
                    <span style={inlineStyles.s153}>
                      Milestones ({currentStepIndex + 1}/{(activeWebPuzzle?.steps || []).length})
                    </span>
                    <button
                      onClick={handleResetSteps}
                      style={inlineStyles.s154}
                    >
                      Reset Steps
                    </button>
                  </div>

                  {(activeWebPuzzle?.steps || []).map((step, idx) => {
                    const isCompleted = idx < currentStepIndex;
                    const isActive = idx === currentStepIndex;
                    const isLocked = idx > currentStepIndex;

                    return (
                      <div
                        key={step.id}
                        style={featureStyleFunctions.s43({isCompleted,isActive,isLocked})}
                      >
                        <div style={featureStyleFunctions.s44({isCompleted,isActive})}>
                          {isCompleted ? <Check size={11} strokeWidth={3} /> : idx + 1}
                        </div>

                        <div style={inlineStyles.s155}>
                          <div style={inlineStyles.s156}>
                            <span style={featureStyleFunctions.s45({isCompleted,isActive})}>
                              {step.shortTitle}
                            </span>
                            {isActive && (
                              <span style={featureStyleFunctions.s46({stepPassed})}>
                                {stepPassed ? 'Passed' : 'Active'}
                              </span>
                            )}
                          </div>

                          <p style={featureStyleFunctions.s47({isLocked,isCompleted})}>
                            {step.description}
                          </p>

                          {isActive && stepPassed && (
                            <div style={inlineStyles.s157}>
                              <button
                                onClick={handleNextStep}
                                style={inlineStyles.s158}
                              >
                                Next Step
                                <ChevronRight size={11} />
                              </button>
                            </div>
                          )}
                        </div>
                      </div>
                    );
                  })}

                  <div style={inlineStyles.s159}>
                    <button
                      onClick={handleManualCheck}
                      disabled={isValidating}
                      style={featureStyleFunctions.s48({isValidating})}
                    >
                      {isValidating ? <Loader2 size={13} style={inlineStyles.s160} /> : <Check size={13} />}
                      <span>Check Current Step</span>
                    </button>
                  </div>
                </div>
              </div>
            )}

            {/* ── TAB: Variables Visualizer (Python) ── */}
            {category === 'programming' && activeRightTab === 'visualizer' && (
              <div style={inlineStyles.s161}>
                {traceData && traceData.length > 0 ? (
                  <>
                    {/* Visualizer Timeline Scrubber */}
                    <div style={inlineStyles.s162}>
                      <div style={inlineStyles.s163}>
                        <div style={inlineStyles.s164}>
                          <button
                            onClick={() => setCurrentStep(prev => Math.max(0, prev - 1))}
                            disabled={currentStep === 0}
                            style={featureStyleFunctions.s49({currentStep})}
                          >
                            &lt;
                          </button>
                          <button
                            onClick={() => setIsPlaying(!isPlaying)}
                            style={inlineStyles.s165}
                          >
                            {isPlaying ? 'Pause' : 'Play'}
                          </button>
                          <button
                            onClick={() => setCurrentStep(prev => Math.min(traceData.length - 1, prev + 1))}
                            disabled={currentStep === traceData.length - 1}
                            style={featureStyleFunctions.s50({currentStep,traceData})}
                          >
                            &gt;
                          </button>

                          <button
                            onClick={() => {
                              setPlaySpeed(prev => {
                                if (prev === 1500) return 1000;
                                if (prev === 1000) return 500;
                                return 1500;
                              });
                            }}
                            style={inlineStyles.s166}
                          >
                            {playSpeed === 500 ? '2x' : playSpeed === 1000 ? '1.5x' : '1x'}
                          </button>
                        </div>
                        <span style={inlineStyles.s167}>
                          Step {currentStep + 1} / {traceData.length}
                        </span>
                      </div>

                      <input
                        type="range"
                        min={0}
                        max={traceData.length - 1}
                        value={currentStep}
                        onChange={e => setCurrentStep(Number(e.target.value))}
                        style={inlineStyles.s168}
                      />
                    </div>

                    {render2DVisualizer()}
                  </>
                ) : (
                  <div style={inlineStyles.s169}>
                    <Zap size={24} color="#F5A95B" />
                    <span style={inlineStyles.s170}>No Execution Trace Recorded Yet</span>
                    <span style={inlineStyles.s171}>
                      Click <strong>Visualize Code</strong> below the editor to run and inspect your algorithm memory in real time.
                    </span>
                  </div>
                )}
              </div>
            )}
          </div>
        </div>
      </div>

      {/* ── 6. MOBILE DEDICATED BOTTOM DOCK (Code | Console | Guide | Visualizer) ── */}
      {isMobile && (
        <nav
          aria-label="Mobile Navigation Dock"
          style={inlineStyles.s172}
        >
          {[
            { id: 'editor', label: 'Code', icon: Code, color: '#A855F7' },
            { id: 'console', label: 'Terminal', icon: TerminalIcon, color: '#38BDF8', badge: rawOutputLog?.includes('[Error]') || rawOutputLog?.includes('Traceback') },
            { id: 'guide', label: 'Guide', icon: BookOpen, color: '#5B8CF8', badge: stepPassed },
            {
              id: category === 'html' ? 'preview' : 'visualizer',
              label: category === 'html' ? 'Preview' : 'Visualizer',
              icon: category === 'html' ? Globe : Zap,
              color: category === 'html' ? '#38BDF8' : '#F5A95B',
              badge: isTracing || isRunning
            }
          ].map(tab => {
            const isActive = mobileActiveView === tab.id;
            const Icon = tab.icon;
            return (
              <button
                key={tab.id}
                onClick={() => {
                  setMobileActiveView(tab.id);
                  if (tab.id === 'guide') {
                    setActiveRightTab('guide');
                  } else if (tab.id === 'visualizer') {
                    setActiveRightTab('visualizer');
                  } else if (tab.id === 'preview') {
                    setActiveRightTab('preview');
                  } else if (tab.id === 'console') {
                    setIsTerminalCollapsed(false);
                    setTimeout(() => fitAddonRef.current?.fit(), 120);
                  }
                }}
                style={featureStyleFunctions.s51({isActive,tab})}
              >
                <div style={inlineStyles.s173}>
                  <Icon size={15} fill={(tab.id === 'visualizer' && isActive) ? tab.color : 'none'} />
                  {tab.badge && (
                    <span style={featureStyleFunctions.s52({tab})} />
                  )}
                </div>
                <span>{tab.label}</span>
              </button>
            );
          })}
        </nav>
      )}
    </div>
  );

}
