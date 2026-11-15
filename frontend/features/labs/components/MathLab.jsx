'use client';
import * as featureStyleFunctions from '@/features/labs/styles/MathLab.da3797bb.styles.js';

import inlineStyles from '@/features/labs/styles/MathLab.styles';
import React, { useState, useEffect, useRef, Component } from 'react';
import { useRouter } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import remarkMath from 'remark-math';
import rehypeKatex from 'rehype-katex';
import 'katex/dist/katex.min.css';
import {
  Calculator, Edit3, Eraser, Trash2, RotateCcw, Play, Sparkles,
  Sliders, Activity, HelpCircle, Compass, Zap, Lightbulb, ChevronRight, ChevronDown, X,
  TrendingUp, Circle, Triangle, Layers, ZoomIn, ZoomOut, RefreshCw, Send, Image as ImageIcon,
  Crop, Mic, MicOff, Square, CheckCircle2, Award, Box, Volume2,
  Maximize2, Minimize2, PenLine, LineChart, ArrowLeft
} from 'lucide-react';
import { T } from '@/shared/design-system/theme';
import { getMascotBridge } from '@/lib/mascotBridge';
import MathEquationRenderer from '@/components/labs/MathEquationRenderer';
import DynamicMathVisualizer from '@/components/labs/DynamicMathVisualizer';
import { useMediaQuery, isMobileMQ, isTabletMQ } from '@/lib/useMediaQuery';
import '@/features/labs/styles/MathLab.css';
import {preprocessLaTeX,calcGcd,parseMathEquation,SafeMathRenderer,CustomMathMarkdown} from '@/features/labs/components/features-labs-components-MathLab.support.jsx';
import {useMathLabModel} from '@/features/labs/hooks/features-labs-components-MathLab.jsx';
export default function MathLab() {
const {router,isMobile,isTablet,isStacked,activeTab,setActiveTab,visualizerSubTab,setVisualizerSubTab,canvasRef,cropStartRef,isDrawing,setIsDrawing,drawTool,setDrawTool,penColor,setPenColor,penWidth,setPenWidth,hasDrawn,setHasDrawn,cropBox,setCropBox,isWhiteboardExpanded,setIsWhiteboardExpanded,canvasSize,setCanvasSize,graphCanvasSize,setGraphCanvasSize,showVisualConcepts,setShowVisualConcepts,showOcrCard,setShowOcrCard,equationText,setEquationText,recognizedText,setRecognizedText,isRecognizing,setIsRecognizing,aiExplanation,setAiExplanation,paramA,setParamA,paramB,setParamB,paramC,setParamC,paramD,setParamD,plotMode,setPlotMode,graphCanvasRef,zoomScale,setZoomScale,hoverCoord,setHoverCoord,tutorQuery,setTutorQuery,tutorResponse,setTutorResponse,isTutorThinking,setIsTutorThinking,isListening,setIsListening,parsedVisualSpec,setParsedVisualSpec,recognitionRef,tutorResponseRef,pythA,setPythA,pythB,setPythB,trigAngle,setTrigAngle,calcX0,setCalcX0,calcFunc,setCalcFunc,vecU,setVecU,vecV,setVecV,clearWhiteboard,clearCropSelection,switchTool,getCanvasCoords,startDrawing,draw,stopDrawing,handleRecognizeCanvas,toggleListening,handleGraphMouseMove,handleAskTutor,getFormattedFormula}=useMathLabModel();
return (
    <div className={`math-lab-container ${activeTab === 'ai_solver' ? 'tab-ai_solver' : ''}`}>
      <div className="math-lab-inner">

        {/* TOP ROW: Header on Left, Tab Switcher on Right (Desktop) / Stacked (Mobile) */}
        <div className="math-lab-top-row">
          {/* 1. HEADER (matching image: Back + Badge + Title + Subtitle) */}
          <header className="math-lab-header">
            <button
              type="button"
              onClick={() => router.push('/vedika-labs')}
              style={inlineStyles.s3}
              onMouseEnter={(e) => {
                e.currentTarget.style.background = 'rgba(168, 85, 247, 0.2)';
                e.currentTarget.style.borderColor = '#A855F7';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.background = 'rgba(255, 255, 255, 0.06)';
                e.currentTarget.style.borderColor = 'rgba(168, 85, 247, 0.35)';
              }}
              title="Back to Vedika Labs"
            >
              <ArrowLeft size={14} color="#C084FC" />
              <span>Back</span>
            </button>
            <div className="math-lab-badge">
              <Calculator size={26} color="#FFF" />
            </div>
            <div className="math-lab-titles">
              <h1 className="math-lab-title">Vedika Math Lab</h1>
              <p className="math-lab-subtitle">
                Smart Crop Selection OCR & Interactive Visual Experiments
              </p>
            </div>
          </header>

          {/* 2. TAB SWITCHER CAPSULE (Whiteboard / Graph / AI Math Solve) */}
          <div className="math-lab-tabs-bar" role="tablist">
            <button
              role="tab"
              aria-selected={activeTab === 'whiteboard'}
              className={`math-lab-tab ${activeTab === 'whiteboard' ? 'active' : ''}`}
              onClick={() => setActiveTab('whiteboard')}
            >
              <PenLine size={15} />
              <span>Whiteboard</span>
            </button>
            <button
              role="tab"
              aria-selected={activeTab === 'graph'}
              className={`math-lab-tab ${activeTab === 'graph' ? 'active' : ''}`}
              onClick={() => setActiveTab('graph')}
            >
              <LineChart size={15} />
              <span>Graph</span>
            </button>
            <button
              role="tab"
              aria-selected={activeTab === 'ai_solver'}
              className={`math-lab-tab ${activeTab === 'ai_solver' ? 'active' : ''}`}
              onClick={() => setActiveTab('ai_solver')}
            >
              <Sparkles size={15} />
              <span>AI Math Solve</span>
            </button>
          </div>
        </div>

        {/* 3. TAB CONTENT */}
        {activeTab === 'whiteboard' && (
          <div className="math-tab-content-pane">

            {/* SMART HANDWRITING WHITEBOARD CARD */}
            <section className="math-whiteboard-card" aria-label="Smart Handwriting Whiteboard">

              {/* Whiteboard Bar: Title + Drawing Tools + Desktop Recognize Action */}
              <div className="math-whiteboard-bar">
                <div className="math-card-header-left">
                  <PenLine size={18} color="#C084FC" />
                  <span className="math-card-title">Smart Handwriting Whiteboard</span>
                </div>

                {/* Toolbar: Pen, Select, Eraser, Trash */}
                <div className="math-toolbar" role="toolbar" aria-label="Drawing tools">
                  <button
                    type="button"
                    className={`math-tool-btn ${drawTool === 'pen' ? 'active-pen' : ''}`}
                    onClick={() => switchTool('pen')}
                    title="Draw handwriting pen"
                  >
                    <PenLine size={15} />
                    <span>Pen</span>
                  </button>

                  <button
                    type="button"
                    className={`math-tool-btn ${drawTool === 'select' ? 'active-select' : ''}`}
                    onClick={() => switchTool('select')}
                    title="Crop selection box"
                  >
                    <Crop size={15} />
                    <span>Select</span>
                  </button>

                  <button
                    type="button"
                    className={`math-tool-btn ${drawTool === 'eraser' ? 'active-eraser' : ''}`}
                    onClick={() => switchTool('eraser')}
                    title="Erase handwriting strokes"
                  >
                    <Eraser size={15} />
                    <span>Eraser</span>
                  </button>

                  <button
                    type="button"
                    className="math-tool-trash-btn"
                    onClick={clearWhiteboard}
                    title="Clear entire whiteboard"
                    aria-label="Clear whiteboard"
                  >
                    <Trash2 size={16} />
                  </button>
                </div>

                {/* Desktop-Only Inline Quick Recognize Button */}
                <button
                  type="button"
                  className="math-recognize-inline-btn"
                  onClick={() => handleRecognizeCanvas(cropBox.isSelected)}
                  disabled={isRecognizing}
                >
                  <Sparkles size={16} />
                  <span>
                    {isRecognizing
                      ? 'Analyzing...'
                      : cropBox.isSelected
                      ? 'Recognize Selection'
                      : 'Recognize Whiteboard'}
                  </span>
                </button>
              </div>

              {/* Dotted Matrix Canvas Area (Dynamic Full-Screen on Desktop) */}
              <div className={`math-whiteboard-canvas-wrap ${isWhiteboardExpanded ? 'expanded' : ''}`}>
                <canvas
                  ref={canvasRef}
                  width={canvasSize.w}
                  height={canvasSize.h}
                  onMouseDown={startDrawing}
                  onMouseMove={draw}
                  onMouseUp={stopDrawing}
                  onMouseLeave={stopDrawing}
                  onTouchStart={startDrawing}
                  onTouchMove={draw}
                  onTouchEnd={stopDrawing}
                  className="math-whiteboard-canvas"
                  style={featureStyleFunctions.s0({drawTool})}
                />

                {/* Crop Bounding Box Overlay */}
                {(cropBox.isSelecting || cropBox.isSelected) && (
                  <svg
                    viewBox={`0 0 ${canvasSize.w} ${canvasSize.h}`}
                    preserveAspectRatio="none"
                    style={inlineStyles.s4}
                  >
                    <rect
                      x={cropBox.x}
                      y={cropBox.y}
                      width={cropBox.w}
                      height={cropBox.h}
                      fill="rgba(236, 72, 153, 0.18)"
                      stroke="#EC4899"
                      strokeWidth="2.5"
                      strokeDasharray="6 4"
                    />
                    <circle cx={cropBox.x} cy={cropBox.y} r={5} fill="#FFF" />
                    <circle cx={cropBox.x + cropBox.w} cy={cropBox.y} r={5} fill="#FFF" />
                    <circle cx={cropBox.x} cy={cropBox.y + cropBox.h} r={5} fill="#FFF" />
                    <circle cx={cropBox.x + cropBox.w} cy={cropBox.y + cropBox.h} r={5} fill="#FFF" />
                  </svg>
                )}

                {/* Floating button for Selected Box */}
                {cropBox.isSelected && (
                  <button
                    type="button"
                    onClick={() => handleRecognizeCanvas(true)}
                    style={featureStyleFunctions.s1({cropBox})}
                  >
                    <Sparkles size={14} /> Analyze Selected Box
                  </button>
                )}

                {/* Desktop Floating Glass OCR Result Card (Never forces vertical page scroll) */}
                {aiExplanation && showOcrCard && (
                  <div className="math-ai-solution-card desktop-floating">
                    <div style={inlineStyles.s5}>
                      <div style={inlineStyles.s6}>
                        <Sparkles size={15} /> AI OCR Detection
                      </div>
                      <div style={inlineStyles.s7}>
                        <button
                          type="button"
                          onClick={() => setActiveTab('graph')}
                          style={inlineStyles.s8}
                        >
                          Graph ➔
                        </button>
                        <button
                          type="button"
                          onClick={() => {
                            setActiveTab('ai_solver');
                            if (recognizedText) {
                              setTutorQuery(`Solve and explain step by step: ${recognizedText}`);
                              handleAskTutor(`Solve and explain step by step: ${recognizedText}`);
                            }
                          }}
                          style={inlineStyles.s9}
                        >
                          Solve ➔
                        </button>
                        <button
                          type="button"
                          onClick={() => setShowOcrCard(false)}
                          style={inlineStyles.s10}
                          title="Dismiss notification"
                        >
                          <X size={14} />
                        </button>
                      </div>
                    </div>
                    <p style={inlineStyles.s11}>
                      {aiExplanation}
                    </p>
                    {recognizedText && (
                      <div style={inlineStyles.s12}>
                        {recognizedText}
                      </div>
                    )}
                  </div>
                )}
              </div>
            </section>

            {/* Mobile-Only Bottom Area: Full Recognize Button + Detection Card */}
            <div className="math-mobile-only" style={inlineStyles.s13}>
              <button
                type="button"
                className="math-recognize-full-btn"
                onClick={() => handleRecognizeCanvas(cropBox.isSelected)}
                disabled={isRecognizing}
              >
                <Sparkles size={18} />
                <span>
                  {isRecognizing
                    ? 'Analyzing Handwriting...'
                    : cropBox.isSelected
                    ? 'Recognize Selected Region'
                    : 'Recognize Full Whiteboard'}
                </span>
              </button>

              {aiExplanation && (
                <div className="math-ai-solution-card">
                  <div style={inlineStyles.s14}>
                    <div style={inlineStyles.s15}>
                      <Sparkles size={16} /> AI OCR Detection
                    </div>
                    <div style={inlineStyles.s16}>
                      <button
                        type="button"
                        onClick={() => setActiveTab('graph')}
                        style={inlineStyles.s17}
                      >
                        View in Graph ➔
                      </button>
                      <button
                        type="button"
                        onClick={() => {
                          setActiveTab('ai_solver');
                          if (recognizedText) {
                            setTutorQuery(`Solve and explain step by step: ${recognizedText}`);
                            handleAskTutor(`Solve and explain step by step: ${recognizedText}`);
                          }
                        }}
                        style={inlineStyles.s18}
                      >
                        Solve with AI ➔
                      </button>
                    </div>
                  </div>
                  <p style={inlineStyles.s19}>
                    {aiExplanation}
                  </p>
                  {recognizedText && (
                    <div style={inlineStyles.s20}>
                      Detected Equation: {recognizedText}
                    </div>
                  )}
                </div>
              )}
            </div>

          </div>
        )}

        {/* 5. TAB 2: GRAPH PLOTTER & VISUAL CONCEPTS */}
        {activeTab === 'graph' && (
          <div className="math-tab-content-pane">
            <div className="math-graph-layout">

              {/* MAIN GRAPH COLUMN: Full-Screen 2D Canvas */}
              <div className="math-graph-main-col">
                <section className="math-graph-card" aria-label="Real-Time 2D Graph Plotter">
                  {/* Header Bar */}
                  <div className="math-card-header">
                    <div className="math-card-header-left">
                      <LineChart size={18} color="#C084FC" />
                      <span className="math-card-title">Real-Time 2D Graph Plotter</span>
                    </div>

                    {/* Desktop Curve Formula Badge */}
                    <div className="math-curve-badge-header">
                      <span style={inlineStyles.s21}>
                        {getFormattedFormula()}
                      </span>
                      <span style={inlineStyles.s22}>
                        ({plotMode === 'linear' ? 'Linear Line' : plotMode === 'vertical' ? 'Vertical Line' : plotMode === 'quadratic' ? 'Parabola' : plotMode === 'sine' ? 'Sine Wave' : 'Curve'})
                      </span>
                    </div>

                    <div style={inlineStyles.s23}>
                      <button
                        type="button"
                        onClick={() => setZoomScale(p => Math.min(p + 5, 60))}
                        className="math-card-expand-btn"
                        title="Zoom in"
                        aria-label="Zoom in"
                      >
                        <ZoomIn size={14} />
                      </button>
                      <button
                        type="button"
                        onClick={() => setZoomScale(p => Math.max(p - 5, 15))}
                        className="math-card-expand-btn"
                        title="Zoom out"
                        aria-label="Zoom out"
                      >
                        <ZoomOut size={14} />
                      </button>
                    </div>
                  </div>

                  {/* Responsive Graph Canvas */}
                  <div className="math-graph-canvas-wrap">
                    <canvas
                      ref={graphCanvasRef}
                      width={graphCanvasSize.w}
                      height={graphCanvasSize.h}
                      onMouseMove={handleGraphMouseMove}
                      onMouseLeave={() => setHoverCoord(null)}
                      className="math-graph-canvas"
                    />
                    {hoverCoord && (
                      <div style={inlineStyles.s24}>
                        x: {hoverCoord.x.toFixed(2)}, y: {hoverCoord.y.toFixed(2)}
                      </div>
                    )}
                  </div>
                </section>
              </div>

              {/* SIDE CONTROLS COLUMN: Presets, Sliders & Collapsible Visual Concepts */}
              <div className="math-graph-side-col">
                {/* Mobile-Only Curve Banner */}
                <div className="math-curve-badge math-mobile-only">
                  <div style={inlineStyles.s25}>
                    <span style={inlineStyles.s26}>
                      Active 2D Curve
                    </span>
                    {recognizedText && (
                      <span style={inlineStyles.s27}>
                        Handwritten: {recognizedText}
                      </span>
                    )}
                  </div>
                  <div style={inlineStyles.s28}>
                    <span style={inlineStyles.s29}>
                      {getFormattedFormula()}
                    </span>
                    <span style={inlineStyles.s30}>
                      ({plotMode === 'linear' ? 'Linear Line' : plotMode === 'vertical' ? 'Vertical Line' : plotMode === 'quadratic' ? 'Parabola' : plotMode === 'sine' ? 'Sine Wave' : 'Curve'})
                    </span>
                  </div>
                </div>

                {/* Quick Mode Presets */}
                <div style={inlineStyles.s31}>
                  {[
                    { id: 'linear', label: 'Linear' },
                    { id: 'quadratic', label: 'Quadratic' },
                    { id: 'sine', label: 'Sine' },
                    { id: 'cubic', label: 'Cubic' },
                    { id: 'vertical', label: 'Vertical' }
                  ].map(m => (
                    <button
                      key={m.id}
                      type="button"
                      onClick={() => setPlotMode(m.id)}
                      style={featureStyleFunctions.s2({plotMode,m})}
                    >
                      {m.label}
                    </button>
                  ))}
                </div>

                {/* Live Parameter Sliders */}
                <div className="math-graph-controls-card">
                  <div style={inlineStyles.s32}>
                    <Sliders size={14} /> Live Parameter Sliders
                  </div>
                  <div style={inlineStyles.s33}>
                    <div>
                      <label style={inlineStyles.s34}>
                        <span>Slope/Scale (a):</span> <b>{paramA}</b>
                      </label>
                      <input
                        type="range"
                        min={Math.min(-10, Math.floor(paramA - 2))}
                        max={Math.max(10, Math.ceil(paramA + 2))}
                        step="0.5"
                        value={paramA}
                        onChange={e => setParamA(parseFloat(e.target.value))}
                        style={inlineStyles.s35}
                      />
                    </div>
                    <div>
                      <label style={inlineStyles.s36}>
                        <span>Intercept/Offset (c):</span> <b>{paramC}</b>
                      </label>
                      <input
                        type="range"
                        min={Math.min(-15, Math.floor(paramC - 2))}
                        max={Math.max(15, Math.ceil(paramC + 2))}
                        step="0.5"
                        value={paramC}
                        onChange={e => setParamC(parseFloat(e.target.value))}
                        style={inlineStyles.s37}
                      />
                    </div>
                  </div>
                </div>

                {/* Collapsible Interactive Visual Concepts (COLLAPSED BY DEFAULT) */}
                <div className="math-visual-concepts-accordion">
                  <button
                    type="button"
                    className="math-accordion-btn"
                    onClick={() => setShowVisualConcepts(prev => !prev)}
                    aria-expanded={showVisualConcepts}
                  >
                    <span style={inlineStyles.s38}>
                      <Triangle size={14} color="#EC4899" />
                      <span>Interactive Visual Concepts (18)</span>
                    </span>
                    <ChevronDown
                      size={16}
                      style={featureStyleFunctions.s3({showVisualConcepts})}
                    />
                  </button>

                  {showVisualConcepts && (
                    <div className="math-visual-concepts-body">
                      <div style={inlineStyles.s39}>
                        {[
                          { id: 'pythagoras', label: 'Pythagoras', icon: Triangle },
                          { id: 'sector', label: 'Circle Sector', icon: Compass },
                          { id: 'elevation', label: 'Heights & Distances', icon: Maximize2 },
                          { id: 'solid', label: '3D Cylinder', icon: Box },
                          { id: 'cone', label: 'Cone', icon: Triangle },
                          { id: 'sphere', label: 'Sphere', icon: Circle },
                          { id: 'composite', label: 'Composite Solid', icon: Layers },
                          { id: 'parabola', label: 'Quadratic Parabola', icon: TrendingUp },
                          { id: 'coordgeo', label: 'Coordinate Geometry', icon: LineChart },
                          { id: 'trapezoid', label: 'Trapezoid', icon: Square },
                          { id: 'venn', label: 'Venn Diagram', icon: Circle },
                          { id: 'bellcurve', label: 'Normal Bell Curve', icon: Activity },
                          { id: 'vectors', label: 'Vectors Law', icon: Award },
                          { id: 'tangent', label: 'Tangent & Slope', icon: TrendingUp },
                          { id: 'inequality', label: 'Inequality Line', icon: Calculator },
                          { id: 'trig', label: 'Unit Circle', icon: Circle },
                          { id: 'calculus', label: 'Calculus Integral', icon: TrendingUp },
                          { id: 'angles', label: 'Supplementary Angles', icon: Calculator }
                        ].map(({ id, label, icon: Icon }) => (
                          <button
                            key={id}
                            type="button"
                            onClick={() => setVisualizerSubTab(id)}
                            style={featureStyleFunctions.s4({visualizerSubTab,id})}
                          >
                            <Icon size={13} />
                            {label}
                          </button>
                        ))}
                      </div>

                      <div style={inlineStyles.s40}>
                        {visualizerSubTab === 'pythagoras' && (
                          <DynamicMathVisualizer spec={{ type: 'triangle', title: 'Pythagoras Proof Visualizer', params: { base: pythA, height: pythB } }} />
                        )}
                        {visualizerSubTab === 'sector' && (
                          <DynamicMathVisualizer spec={{ type: 'sector', title: 'Circle Sector & Clock Hand Visualizer', params: { radius: 10, angle: 30 } }} />
                        )}
                        {visualizerSubTab === 'elevation' && (
                          <DynamicMathVisualizer spec={{ type: 'elevation_depression', title: 'Heights & Distances (Angle of Elevation)', params: { distance: 50, angle: 30 } }} />
                        )}
                        {visualizerSubTab === 'solid' && (
                          <DynamicMathVisualizer spec={{ type: 'solid_surface', title: '3D Cylinder Surface Area & Volume', params: { radius: 7, height: 14 } }} />
                        )}
                        {visualizerSubTab === 'cone' && (
                          <DynamicMathVisualizer spec={{ type: 'cone', title: 'Cone Slant Height & Surface Area', params: { radius: 6, height: 8 } }} />
                        )}
                        {visualizerSubTab === 'sphere' && (
                          <DynamicMathVisualizer spec={{ type: 'sphere_hemisphere', title: 'Sphere & Hemisphere Geometry', params: { radius: 7, mode: 'sphere' } }} />
                        )}
                        {visualizerSubTab === 'composite' && (
                          <DynamicMathVisualizer spec={{ type: 'composite_solid', title: 'Composite Solid (Cylinder + Hemisphere)', params: { radius: 3.5, height: 10 } }} />
                        )}
                        {visualizerSubTab === 'parabola' && (
                          <DynamicMathVisualizer spec={{ type: 'quadratic_parabola', title: 'Quadratic Parabola & Roots', params: { a: 1, b: -4, c: 3 } }} />
                        )}
                        {visualizerSubTab === 'coordgeo' && (
                          <DynamicMathVisualizer spec={{ type: 'coordinate_geometry', title: 'Coordinate Geometry & Section Formula', params: { x1: 2, y1: 3, x2: 8, y2: 9, m: 2, n: 1 } }} />
                        )}
                        {visualizerSubTab === 'trapezoid' && (
                          <DynamicMathVisualizer spec={{ type: 'trapezoid', title: 'Trapezoid & Altitude Visualizer', params: { a: 10, b: 18, h: 8 } }} />
                        )}
                        {visualizerSubTab === 'venn' && (
                          <DynamicMathVisualizer spec={{ type: 'venn_diagram', title: 'Venn Diagram & Set Operations', params: { onlyA: 20, onlyB: 15, both: 10, total: 50 } }} />
                        )}
                        {visualizerSubTab === 'bellcurve' && (
                          <DynamicMathVisualizer spec={{ type: 'bell_curve', title: 'Gaussian Normal Distribution (Bell Curve)', params: { mean: 70, sd: 10 } }} />
                        )}
                        {visualizerSubTab === 'vectors' && (
                          <DynamicMathVisualizer spec={{ type: 'vector_addition', title: 'Parallelogram Law of Vector Addition', params: { magA: 5, magB: 12, angle: 90 } }} />
                        )}
                        {visualizerSubTab === 'tangent' && (
                          <DynamicMathVisualizer spec={{ type: 'tangent_derivative', title: 'Curve Tangent & Derivative Slope', params: { x0: 2 } }} />
                        )}
                        {visualizerSubTab === 'inequality' && (
                          <DynamicMathVisualizer spec={{ type: 'number_line_inequality', title: 'Number Line Inequality Interval', params: { min: -3, max: 5, leftInclusive: false, rightInclusive: true } }} />
                        )}
                        {visualizerSubTab === 'trig' && (
                          <DynamicMathVisualizer spec={{ type: 'circle', title: 'Unit Circle Visualizer', params: { radius: 5 } }} />
                        )}
                        {visualizerSubTab === 'calculus' && (
                          <DynamicMathVisualizer spec={{ type: 'area_under_curve', title: 'Calculus Integral Area Visualizer', params: { a: 0, b: 3, func: 'x^2' } }} />
                        )}
                        {visualizerSubTab === 'angles' && (
                          <DynamicMathVisualizer spec={{ type: 'angles', title: 'Supplementary & Complementary Angles', params: { angle1: 36, angle2: 144, totalAngle: 180 } }} />
                        )}
                      </div>
                    </div>
                  )}
                </div>

              </div>
            </div>
          </div>
        )}

        {/* 6. TAB 3: AI MATH SOLVER (Dedicated 3rd Option) */}
        {activeTab === 'ai_solver' && (
          <div className="math-tab-content-pane" style={inlineStyles.s41}>
            <section className="math-solver-card" aria-label="AI Step-by-Step Math Solver">
              {/* Header */}
              <div className="math-card-header" style={inlineStyles.s42}>
                <div className="math-card-header-left">
                  <Sparkles size={18} color="#C084FC" />
                  <span className="math-card-title">AI Step-by-Step Math Solver</span>
                </div>
              </div>
              <p style={inlineStyles.s43}>
                Type or speak any equation or textbook math problem. Get instant formatted step-by-step solutions, formulas, and dynamic diagrams.
              </p>

              {/* Input Bar */}
              <div style={inlineStyles.s44}>
                <input
                  type="text"
                  value={tutorQuery}
                  onChange={(e) => setTutorQuery(e.target.value)}
                  onKeyDown={(e) => e.key === 'Enter' && handleAskTutor()}
                  placeholder="e.g. Total surface area formed by joining cylinder and hemisphere..."
                  style={featureStyleFunctions.s5({isListening})}
                />
                <button
                  type="button"
                  onClick={toggleListening}
                  title={isListening ? "Stop listening" : "Speak math question"}
                  style={featureStyleFunctions.s6({isListening})}
                >
                  <Mic size={17} color={isListening ? '#FFF' : '#C084FC'} />
                </button>
                <button
                  type="button"
                  onClick={() => handleAskTutor()}
                  disabled={isTutorThinking}
                  style={featureStyleFunctions.s7({isTutorThinking})}
                >
                  <Send size={15} />
                  <span>{isTutorThinking ? 'Solving...' : 'Solve'}</span>
                </button>
              </div>

              {/* Quick Try Pills */}
              <div style={inlineStyles.s45}>
                <span style={inlineStyles.s46}>
                  Quick Try Problems:
                </span>
                <div style={inlineStyles.s47}>
                  {[
                    "A 50m tower observed from ground at 30° angle of elevation",
                    "Surface area of cylinder joined with hemisphere (r=3.5, h=10)",
                    "Find point P dividing line segment (2,3) to (8,9) in ratio 2:1",
                    "Find roots and vertex of quadratic equation 2x² - 4x - 6 = 0",
                    "Slant height and CSA of cone with radius 6cm and height 8cm",
                    "In a class of 50 students, 30 like Math, 25 like Science, 10 like both",
                    "Normal distribution of scores with mean 70 and standard deviation 10",
                    "Resultant of two forces 5N and 12N acting at 90° angle",
                    "Area swept by 10cm minute hand in 5 minutes",
                    "Two supplementary angles in ratio 1:4. Find both angles"
                  ].map(ex => (
                    <button
                      key={ex}
                      type="button"
                      onClick={() => { setTutorQuery(ex); handleAskTutor(ex); }}
                      style={inlineStyles.s48}
                    >
                      {ex}
                    </button>
                  ))}
                </div>
              </div>

              {/* Tutor Response */}
              {(tutorResponse || isTutorThinking) && (
                <div ref={tutorResponseRef} style={inlineStyles.s49}>
                  {isTutorThinking ? (
                    <div style={inlineStyles.s50}>
                      <RefreshCw size={18} style={inlineStyles.s51} />
                      <span>Solving math problem and generating step-by-step derivation...</span>
                    </div>
                  ) : (
                    <div className="math-ai-solution-card" style={inlineStyles.s52}>
                      <div style={inlineStyles.s53}>
                        <div style={inlineStyles.s54}>
                          <Lightbulb size={18} /> Step-by-Step AI Solution
                        </div>
                        {recognizedText && (
                          <button
                            type="button"
                            onClick={() => setActiveTab('graph')}
                            style={inlineStyles.s55}
                          >
                            Plot in Graph ➔
                          </button>
                        )}
                      </div>
                      <CustomMathMarkdown content={tutorResponse} />
                      {parsedVisualSpec && (
                        <SafeMathRenderer>
                          <DynamicMathVisualizer spec={parsedVisualSpec} />
                        </SafeMathRenderer>
                      )}
                    </div>
                  )}
                </div>
              )}
            </section>
          </div>
        )}

      </div>
    </div>
  );

}
