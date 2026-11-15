'use client';
import * as featureStyleFunctions from '@/features/diagrams/styles/MermaidDiagram.6d1f3cc1.styles.js';

import inlineStyles from '@/features/diagrams/styles/MermaidDiagram.styles';
import React, { useEffect, useRef, useState, useCallback } from 'react';
import { createPortal } from 'react-dom';
import { ZoomIn, ZoomOut, RotateCcw, Code, Copy, Check, Sparkles, AlertCircle, Maximize2, ChevronDown, X, ArrowLeft, Move } from 'lucide-react';
import StitchAICursor from '@/components/StitchAICursor';
import '@/features/diagrams/styles/MermaidDiagram.css';
import {renderFormattedText,sanitizeMermaid,NODE_PALETTES,applyBlenderPalettes,synthesizeCreativeInfographic,MIN_MODAL_ZOOM,MAX_MODAL_ZOOM,MIN_INLINE_ZOOM,MAX_INLINE_ZOOM,ZOOM_STEP,DIAGRAM_CONFIGS,getMermaidConfig} from '@/features/diagrams/components/features-diagrams-components-MermaidDiagram.support.jsx';
import {useMermaidDiagramModel} from '@/features/diagrams/hooks/features-diagrams-components-MermaidDiagram.jsx';
export default function MermaidDiagram({ chart, points = [], chatHistory = [], onRegenerate, onClose, diagramType = 'flowchart' }) {
const {containerRef,modalViewportRef,mounted,setMounted,svgHtml,setSvgHtml,renderError,setRenderError,loading,setLoading,zoom,setZoom,modalZoom,setModalZoom,modalZoomRef,isWheelZooming,setIsWheelZooming,wheelZoomTimeoutRef,touchDistRef,resizeTimerRef,showCode,setShowCode,copied,setCopied,isKeypointsOpen,setIsKeypointsOpen,isModalOpen,setIsModalOpen,takeawaysRef,hasAnimatedRef,derivedTopicTitle,handleScrollToTakeaways,isPanning,setIsPanning,panStartRef,isLiveDrawEnabled,setIsLiveDrawEnabled,isBuilding,setIsBuilding,cursorState,setCursorState,animTimeoutsRef,animFrameRef,animCancelledRef,clearAnimTimeouts,stopAndCleanAnimation,computeFitZoom,autoFitModalChart,autoFitInlineChart,runLiveDrawAnimation,handleSkipBuild,handleReplayBuild,handleToggleLiveDraw,uniqueIdRef,activeChartCode,handleZoomIn,handleZoomOut,handleZoomReset,handleModalZoomIn,handleModalZoomOut,handleModalZoomReset,handleTouchStart,handleTouchMove,handleTouchEnd,handleFitToScreen,handleMouseDown,handleCopyCode,btnBaseStyle}=useMermaidDiagramModel({chart,points,chatHistory,onRegenerate,onClose,diagramType});
return (
    <div
      className="mermaid-container"
      data-feature-container="true"
      onMouseDown={(e) => e.stopPropagation()}
      onClick={(e) => e.stopPropagation()}
      style={inlineStyles.s0}
    >
      {/* Header Toolbar */}
      <div
        className="mermaid-toolbar"
        style={inlineStyles.s1}
      >
        <div className="mermaid-title-area" style={inlineStyles.s2}>
          <span
            className="mermaid-badge"
            style={inlineStyles.s3}
          >
            Mermaid Infographic
          </span>
          <span
            className="mermaid-label"
            style={inlineStyles.s4}
          >
            Dynamic Flowchart & Concepts
          </span>
        </div>

        <div className="mermaid-actions" style={inlineStyles.s5}>
          {/* Google Stitch AI Live Draw 1-Click Toggle */}
          <button
            type="button"
            className={`stitch-toggle-btn ${isLiveDrawEnabled ? 'active' : ''}`}
            onClick={handleToggleLiveDraw}
            title={isLiveDrawEnabled ? "Live AI Drawing Enabled (Click to disable)" : "Live AI Drawing Disabled (Click to enable)"}
          >
            <div className="stitch-toggle-track">
              <div className="stitch-toggle-thumb" />
            </div>
            <span>Live Draw</span>
          </button>

          {/* Skip button during building */}
          {isBuilding && (
            <button
              type="button"
              className="stitch-skip-btn"
              onClick={() => handleSkipBuild()}
              title="Skip live drawing animation"
            >
              <span>Skip ⏭</span>
            </button>
          )}

          {/* Replay Build button when diagram is ready and not currently building */}
          {!isBuilding && !loading && !renderError && svgHtml && (
            <button
              type="button"
              className="stitch-replay-btn"
              onClick={handleReplayBuild}
              title="Replay Google Stitch-inspired AI live drawing"
            >
              <Sparkles size={12} color="#D8B4FE" />
              <span>Replay ✨</span>
            </button>
          )}

          {/* Zoom controls */}
          <button
            type="button"
            className="mermaid-btn"
            style={btnBaseStyle}
            onClick={handleZoomIn}
            title="Zoom In"
            aria-label="Zoom in diagram"
          >
            <ZoomIn size={13} />
          </button>
          <button
            type="button"
            className="mermaid-btn"
            style={btnBaseStyle}
            onClick={handleZoomOut}
            title="Zoom Out"
            aria-label="Zoom out diagram"
          >
            <ZoomOut size={13} />
          </button>
          <button
            type="button"
            className="mermaid-btn"
            style={btnBaseStyle}
            onClick={handleZoomReset}
            title="Reset Zoom"
            aria-label="Reset zoom"
          >
            <RotateCcw size={12} />
            <span>{Math.round(zoom * 100)}%</span>
          </button>
          <button
            type="button"
            className="mermaid-btn"
            style={btnBaseStyle}
            onClick={autoFitInlineChart}
            title="Fit to Container"
            aria-label="Fit diagram to container"
          >
            <Maximize2 size={12} />
            <span>Fit</span>
          </button>

          {/* Code viewer toggle */}
          <button
            type="button"
            className={`mermaid-btn ${showCode ? 'active' : ''}`}
            style={featureStyleFunctions.s0({btnBaseStyle,showCode})}
            onClick={() => setShowCode(!showCode)}
            title="Toggle Mermaid Code"
          >
            <Code size={13} />
            <span>DSL</span>
          </button>

          {/* Copy button */}
          <button
            type="button"
            className="mermaid-btn"
            style={btnBaseStyle}
            onClick={handleCopyCode}
            title="Copy Diagram Syntax"
          >
            {copied ? <Check size={13} color="#10B981" /> : <Copy size={13} />}
          </button>

          {/* Fullscreen / Expand Modal Toggle */}
          <button
            type="button"
            className="mermaid-btn mermaid-expand-btn"
            style={featureStyleFunctions.s1({btnBaseStyle})}
            onClick={() => setIsModalOpen(true)}
            title="Open in Focused Modal Window"
          >
            <Maximize2 size={12} />
            <span>Expand</span>
          </button>

          {/* Optional Regenerate */}
          {onRegenerate && (
            <button
              type="button"
              className="mermaid-btn"
              style={featureStyleFunctions.s2({btnBaseStyle})}
              onClick={onRegenerate}
              title="Regenerate Infographic"
            >
              <Sparkles size={13} color="#F59E0B" />
              <span>Regen</span>
            </button>
          )}

          {/* Optional Close button */}
          {onClose && (
            <button
              type="button"
              className="mermaid-btn"
              style={featureStyleFunctions.s3({btnBaseStyle})}
              onClick={(e) => {
                e.stopPropagation();
                onClose();
              }}
              title="Close Visual Summary"
            >
              <X size={12} color="#F87171" />
              <span>Close</span>
            </button>
          )}
        </div>
      </div>

      {/* Main Viewport */}
      {showCode ? (
        <pre className="mermaid-raw-code" style={inlineStyles.s6}>
          {activeChartCode}
        </pre>
      ) : (
        <div
          className="mermaid-viewport"
          ref={containerRef}
          onTouchStart={handleTouchStart}
          onTouchMove={handleTouchMove}
          onTouchEnd={handleTouchEnd}
          style={inlineStyles.s7}
        >
          {loading && (
            <div className="mermaid-loading" style={inlineStyles.s8}>
              <Sparkles size={20} className="animate-spin" color="#3B82F6" />
              <span>Rendering Mermaid diagram...</span>
            </div>
          )}

          {!loading && renderError && (
            <div className="mermaid-error" style={inlineStyles.s9}>
              <AlertCircle size={20} />
              <span>Could not render diagram visually: {renderError}</span>
              <button
                type="button"
                className="mermaid-btn"
                style={featureStyleFunctions.s4({btnBaseStyle})}
                onClick={() => setShowCode(true)}
              >
                Inspect Mermaid Code
              </button>
            </div>
          )}

          {!loading && !renderError && svgHtml && (
            <div
              className="mermaid-canvas-stage inline-stage"
              style={featureStyleFunctions.s5({zoom,isWheelZooming})}
            >
              {/* White Digital Stylus Pen Cursor */}
              <StitchAICursor
                x={cursorState.x}
                y={cursorState.y}
                visible={isBuilding && cursorState.visible && !isModalOpen}
                status={cursorState.status}
                label={cursorState.label}
                isClicking={cursorState.isClicking}
                accentColor={cursorState.accentColor || '#38BDF8'}
                isTracing={cursorState.isTracing}
              />

              {/* Poster Header Banner for Inline View */}
              <div className="infographic-poster-header" style={inlineStyles.s10}>
                <div className="infographic-poster-badge">
                  <Sparkles size={10} color="#38BDF8" />
                  <span>Visual Knowledge Blueprint</span>
                </div>
                <h3 className="infographic-poster-title" style={inlineStyles.s11}>{derivedTopicTitle}</h3>
              </div>

              <div
                className={`mermaid-svg-wrapper ${isBuilding ? 'building' : ''}`}
                style={inlineStyles.s12}
                dangerouslySetInnerHTML={{ __html: svgHtml }}
              />
            </div>
          )}
        </div>
      )}

      {/* Key Takeaways Section (Collapsible Accordion with Formatted Typography) */}
      {points && points.length > 0 && (
        <div
          className="mermaid-takeaways"
          style={inlineStyles.s13}
        >
          <button
            type="button"
            className="mermaid-takeaways-toggle"
            style={inlineStyles.s14}
            onClick={() => setIsKeypointsOpen(!isKeypointsOpen)}
            title={isKeypointsOpen ? "Click to collapse takeaways" : "Click to view key takeaways"}
          >
            <div className="mermaid-takeaways-toggle-left" style={inlineStyles.s15}>
              <Sparkles size={13} color="#F5A95B" />
              <span className="mermaid-takeaways-title" style={inlineStyles.s16}>
                Key Takeaways & Concepts
              </span>
              <span className="mermaid-takeaways-count" style={inlineStyles.s17}>
                ({points.length} points)
              </span>
            </div>
            <ChevronDown
              size={15}
              className={`mermaid-takeaways-chevron ${isKeypointsOpen ? 'open' : ''}`}
              style={featureStyleFunctions.s6({isKeypointsOpen})}
            />
          </button>

          {isKeypointsOpen && (
            <div className="mermaid-takeaways-list" style={inlineStyles.s18}>
              {points.map((pt, idx) => (
                <div
                  key={idx}
                  className="mermaid-takeaway-item"
                  style={inlineStyles.s19}
                >
                  <span
                    className="mermaid-takeaway-bullet"
                    style={inlineStyles.s20}
                  >
                    {idx + 1}
                  </span>
                  <div className="mermaid-takeaway-text" style={inlineStyles.s21}>
                    {renderFormattedText(pt)}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* Expanded Modal Window mounted directly to document.body to prevent layout clipping */}
      {mounted && isModalOpen && typeof document !== 'undefined' && createPortal(
        <div
          className="mermaid-modal-backdrop"
          data-feature-container="true"
          onMouseDown={(e) => e.stopPropagation()}
          onClick={(e) => e.stopPropagation()}
          style={inlineStyles.s22}
        >
          <div
            className="mermaid-modal-window"
            data-feature-container="true"
            role="dialog"
            aria-modal="true"
            onMouseDown={(e) => e.stopPropagation()}
            onClick={(e) => e.stopPropagation()}
            style={inlineStyles.s23}
          >
            {/* Modal Header */}
            <div
              className="mermaid-modal-header"
              onClick={(e) => e.stopPropagation()}
              style={inlineStyles.s24}
            >
              <div style={inlineStyles.s25}>
                {/* Prominent Back to Chat button */}
                <button
                  type="button"
                  onClick={(e) => {
                    e.stopPropagation();
                    setIsModalOpen(false);
                  }}
                  style={inlineStyles.s26}
                  title="Return to Chat"
                >
                  <ArrowLeft size={16} />
                  <span>Back to Chat</span>
                </button>

                <div className="mermaid-title-area" style={inlineStyles.s27}>
                  <span
                    className="mermaid-badge"
                    style={inlineStyles.s28}
                  >
                    Expanded Infographic
                  </span>
                  <span className="mermaid-label" style={inlineStyles.s29}>
                    Full Interactive View
                  </span>
                </div>
              </div>

              <div className="mermaid-actions" style={inlineStyles.s30}>
                {/* Google Stitch AI Live Draw 1-Click Toggle */}
                <button
                  type="button"
                  className={`stitch-toggle-btn ${isLiveDrawEnabled ? 'active' : ''}`}
                  onClick={(e) => {
                    e.stopPropagation();
                    handleToggleLiveDraw();
                  }}
                  title={isLiveDrawEnabled ? "Live AI Drawing Enabled (Click to disable)" : "Live AI Drawing Disabled (Click to enable)"}
                >
                  <div className="stitch-toggle-track">
                    <div className="stitch-toggle-thumb" />
                  </div>
                  <span>Live Draw</span>
                </button>

                {/* Skip button during building */}
                {isBuilding && (
                  <button
                    type="button"
                    className="stitch-skip-btn"
                    onClick={(e) => {
                      e.stopPropagation();
                      handleSkipBuild(modalViewportRef.current);
                    }}
                    title="Skip live drawing animation"
                  >
                    <span>Skip ⏭</span>
                  </button>
                )}

                {/* Replay Build button */}
                {!isBuilding && svgHtml && (
                  <button
                    type="button"
                    className="stitch-replay-btn"
                    onClick={(e) => {
                      e.stopPropagation();
                      handleReplayBuild();
                    }}
                    title="Replay Google Stitch-inspired AI live drawing in full screen"
                  >
                    <Sparkles size={12} color="#D8B4FE" />
                    <span>Replay ✨</span>
                  </button>
                )}

                {/* Scroll to Key Takeaways on Poster */}
                {points && points.length > 0 && (
                  <button
                    type="button"
                    className="mermaid-btn mermaid-modal-keypoints-btn"
                    style={featureStyleFunctions.s7({btnBaseStyle})}
                    onClick={(e) => {
                      e.stopPropagation();
                      handleScrollToTakeaways();
                    }}
                    title="Scroll to Key Takeaways on Poster Canvas"
                  >
                    <Sparkles size={13} color="#F5A95B" />
                    <span>Key Takeaways ({points.length})</span>
                  </button>
                )}

                {/* Zoom Controls & Fit button */}
                <div style={inlineStyles.s31}>
                  <button
                    type="button"
                    className="mermaid-btn"
                    style={featureStyleFunctions.s8({btnBaseStyle,modalZoom,MAX_MODAL_ZOOM})}
                    disabled={modalZoom >= MAX_MODAL_ZOOM}
                    onClick={(e) => {
                      e.stopPropagation();
                      handleModalZoomIn();
                    }}
                    title={`Zoom In (Max: ${Math.round(MAX_MODAL_ZOOM * 100)}%)`}
                  >
                    <ZoomIn size={13} />
                  </button>
                  <button
                    type="button"
                    className="mermaid-btn"
                    style={featureStyleFunctions.s9({btnBaseStyle,modalZoom,MIN_MODAL_ZOOM})}
                    disabled={modalZoom <= MIN_MODAL_ZOOM}
                    onClick={(e) => {
                      e.stopPropagation();
                      handleModalZoomOut();
                    }}
                    title={`Zoom Out (Min: ${Math.round(MIN_MODAL_ZOOM * 100)}%)`}
                  >
                    <ZoomOut size={13} />
                  </button>
                  <button
                    type="button"
                    className="mermaid-btn"
                    style={btnBaseStyle}
                    onClick={(e) => {
                      e.stopPropagation();
                      handleModalZoomReset();
                    }}
                    title="Reset Zoom to 100%"
                  >
                    <RotateCcw size={12} />
                    <span>{Math.round(modalZoom * 100)}%</span>
                  </button>
                  <button
                    type="button"
                    className="mermaid-btn"
                    style={btnBaseStyle}
                    onClick={(e) => {
                      e.stopPropagation();
                      handleFitToScreen();
                    }}
                    title="Fit Entire Infographic to Screen"
                  >
                    <Maximize2 size={12} />
                    <span>Fit</span>
                  </button>
                </div>

                {/* Close Button: STRICTLY closes the modal and the feature */}
                <button
                  type="button"
                  className="mermaid-modal-close-btn"
                  style={inlineStyles.s32}
                  onClick={(e) => {
                    e.stopPropagation();
                    setIsModalOpen(false);
                    if (onClose) onClose();
                  }}
                  title="Close Modal"
                >
                  <X size={15} />
                  <span>Close</span>
                </button>
              </div>
            </div>

            {/* Modal Main Body: Unified Full-Width Infographic Poster Canvas */}
            <div
              className="mermaid-modal-body"
              style={inlineStyles.s33}
            >
              <div
                className={`mermaid-modal-viewport ${isPanning ? 'panning' : ''}`}
                ref={modalViewportRef}
                data-feature-container="true"
                onMouseDown={handleMouseDown}
                onTouchStart={handleTouchStart}
                onTouchMove={handleTouchMove}
                onTouchEnd={handleTouchEnd}
                onClick={(e) => e.stopPropagation()}
                style={featureStyleFunctions.s10({isPanning})}
              >
                {loading && (
                  <div className="mermaid-loading" style={inlineStyles.s34}>
                    <Sparkles size={28} className="animate-spin" color="#38BDF8" />
                    <span style={inlineStyles.s35}>Rendering Knowledge Blueprint...</span>
                    <span style={inlineStyles.s36}>Synthesizing multi-tier architectural layout</span>
                  </div>
                )}

                {!loading && renderError && (
                  <div className="mermaid-error" style={inlineStyles.s37}>
                    <AlertCircle size={26} color="#F87171" />
                    <span style={inlineStyles.s38}>Could not render diagram visually: {renderError}</span>
                    <button
                      type="button"
                      className="mermaid-btn"
                      style={featureStyleFunctions.s11({btnBaseStyle})}
                      onClick={() => setShowCode(true)}
                    >
                      Inspect Diagram Code
                    </button>
                  </div>
                )}

                {!loading && !renderError && svgHtml && (
                  <div
                    className="mermaid-canvas-stage modal-stage"
                    style={featureStyleFunctions.s12({modalZoom,isPanning,isWheelZooming})}
                  >
                    {/* White Digital Stylus Pen Cursor for Fullscreen Modal */}
                    <StitchAICursor
                      x={cursorState.x}
                      y={cursorState.y}
                      visible={isBuilding && cursorState.visible && isModalOpen}
                      status={cursorState.status}
                      label={cursorState.label}
                      isClicking={cursorState.isClicking}
                      accentColor={cursorState.accentColor || '#38BDF8'}
                      isTracing={cursorState.isTracing}
                    />

                    {/* Poster Header Banner */}
                    <div className="infographic-poster-header">
                      <div className="infographic-poster-badge">
                        <Sparkles size={11} color="#38BDF8" />
                        <span>Interactive Knowledge Blueprint</span>
                      </div>
                      <h2 className="infographic-poster-title">{derivedTopicTitle}</h2>
                      <p className="infographic-poster-subtitle">
                        Comprehensive multi-tier architectural flow & system mechanism
                      </p>
                    </div>

                    {/* 16:9 Laptop Responsive Blueprint Content */}
                    <div className="infographic-poster-content">
                      <div className="infographic-diagram-pane">
                        <div
                          className={`mermaid-svg-wrapper modal-chart ${isBuilding ? 'building' : ''}`}
                          style={inlineStyles.s39}
                          dangerouslySetInnerHTML={{ __html: svgHtml }}
                        />
                      </div>

                      {/* Integrated Key Takeaways Companion Section (Right on desktop, Below on mobile) */}
                      {points && points.length > 0 && (
                        <div className="infographic-poster-takeaways" ref={takeawaysRef}>
                          <div className="infographic-takeaways-head">
                            <div className="infographic-takeaways-headline">
                              <Sparkles size={14} color="#F5A95B" />
                              <span>Key Takeaways & System Insights</span>
                            </div>
                            <span style={inlineStyles.s40}>
                              {points.length} Essential Concepts
                            </span>
                          </div>
                          <div className="infographic-takeaways-grid">
                            {points.map((pt, idx) => (
                              <div key={idx} className="infographic-takeaway-item">
                                <span className="infographic-takeaway-badge">{idx + 1}</span>
                                <div className="infographic-takeaway-body">
                                  {renderFormattedText(pt.replace(/^[-*•]\s+/, ''))}
                                </div>
                              </div>
                            ))}
                          </div>
                        </div>
                      )}
                    </div>
                  </div>
                )}
              </div>
            </div>

            {/* Modal Bottom Status Bar with Presets & Bounds */}
            <div
              className="mermaid-modal-statusbar"
              style={inlineStyles.s41}
            >
              <div style={inlineStyles.s42}>
                <Move size={13} color="#60A5FA" />
                <span>Click &amp; drag or scroll to pan canvas &bull; Ctrl + Scroll to zoom freely &bull; Esc to go back</span>
              </div>
              <div style={inlineStyles.s43}>
                <div style={inlineStyles.s44}>
                  <span style={inlineStyles.s45}>Presets:</span>
                  <button
                    type="button"
                    className="mermaid-zoom-preset-btn"
                    onClick={() => autoFitModalChart()}
                    title="Fit Entire Diagram"
                  >
                    Fit
                  </button>
                  {[0.75, 1.0, 1.25, 1.50].map((lvl) => (
                    <button
                      key={lvl}
                      type="button"
                      className={`mermaid-zoom-preset-btn ${Math.abs(modalZoom - lvl) < 0.04 ? 'active' : ''}`}
                      onClick={() => {
                        setModalZoom(lvl);
                        modalZoomRef.current = lvl;
                      }}
                      title={`Set Zoom to ${Math.round(lvl * 100)}%`}
                    >
                      {Math.round(lvl * 100)}%
                    </button>
                  ))}
                </div>
                <div style={inlineStyles.s46} />
                <div style={inlineStyles.s47}>
                  <span style={inlineStyles.s48}>Canvas Zoom:</span>
                  <span style={inlineStyles.s49}>{Math.round(modalZoom * 100)}%</span>
                  <span style={inlineStyles.s50}>(Limit: 45% - 165%)</span>
                </div>
              </div>
            </div>
          </div>
        </div>,
        document.body
      )}
    </div>
  );

}
