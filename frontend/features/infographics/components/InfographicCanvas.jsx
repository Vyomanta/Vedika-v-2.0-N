'use client';
import * as featureStyleFunctions from '@/features/infographics/styles/InfographicCanvas.a79ca24a.styles.js';

import React, { useState, useRef, useEffect, useCallback } from "react";
import { createPortal } from "react-dom";
import {
  Sparkles,
  Maximize2,
  X,
  RotateCcw,
  Layers,
  ChevronRight,
  ChevronDown,
  Loader2,
} from "lucide-react";
import { SceneRenderer } from "@/components/infographic/SceneRenderer";
import { BottomToolbar } from "@/components/infographic/BottomToolbar";
import { useDrawingSequence } from "@/lib/infographic/useDrawingSequence";

export const InfographicCanvas = ({
  scene: initialScene,
  isLoading = false,
  points = [],
  onRegenerate,
  onClose,
  topicTitle,
  initialExpanded = true,
}) => {
  const [scene, setScene] = useState(initialScene);
  const [isModalOpen, setIsModalOpen] = useState(initialExpanded);
  const [modalZoom, setModalZoom] = useState(1);
  const [isPanning, setIsPanning] = useState(false);
  const [panPosition, setPanPosition] = useState({ x: 0, y: 0 });
  const [showTakeaways, setShowTakeaways] = useState(false);
  const [isInlineTakeawaysOpen, setIsInlineTakeawaysOpen] = useState(false);
  const [mounted, setMounted] = useState(false);

  const svgRef = useRef(null);
  const viewportRef = useRef(null);
  const dragStartRef = useRef({ x: 0, y: 0 });
  const panStartRef = useRef({ x: 0, y: 0 });

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    if (initialScene) {
      setScene(initialScene);
    }
  }, [initialScene]);

  // Hook for deterministic sequential entrance animation
  const animationController = useDrawingSequence(scene);

  // Keyboard shortcut: Escape to close full-window modal
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === "Escape" && isModalOpen) {
        setIsModalOpen(false);
        if (onClose) onClose();
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [isModalOpen, onClose]);

  // Pan handlers for full window canvas
  const handleMouseDown = (e) => {
    if (e.button !== 0 || e.target.closest("button") || e.target.closest("select")) return;
    setIsPanning(true);
    dragStartRef.current = { x: e.clientX, y: e.clientY };
    panStartRef.current = { ...panPosition };
  };

  const handleMouseMove = useCallback((e) => {
    if (!isPanning) return;
    const dx = e.clientX - dragStartRef.current.x;
    const dy = e.clientY - dragStartRef.current.y;
    setPanPosition({
      x: panStartRef.current.x + dx,
      y: panStartRef.current.y + dy,
    });
  }, [isPanning]);

  const handleMouseUp = useCallback(() => {
    setIsPanning(false);
  }, []);

  useEffect(() => {
    if (isPanning) {
      window.addEventListener("mousemove", handleMouseMove);
      window.addEventListener("mouseup", handleMouseUp);
      return () => {
        window.removeEventListener("mousemove", handleMouseMove);
        window.removeEventListener("mouseup", handleMouseUp);
      };
    }
  }, [isPanning, handleMouseMove, handleMouseUp]);

  // Zoom handlers
  const handleZoomIn = () => setModalZoom((z) => Math.min(z + 0.15, 2.0));
  const handleZoomOut = () => setModalZoom((z) => Math.max(z - 0.15, 0.45));
  const handleZoomReset = (level = 1.0) => {
    setModalZoom(typeof level === "number" ? level : 1.0);
    setPanPosition({ x: 0, y: 0 });
  };
  const handleFitToScreen = () => {
    if (!viewportRef.current) return;
    const vw = viewportRef.current.clientWidth - 80;
    const vh = viewportRef.current.clientHeight - 120;
    const scale = Math.min(vw / 1200, vh / 675);
    setModalZoom(Math.max(0.45, Math.min(scale, 1.25)));
    setPanPosition({ x: 0, y: 0 });
  };

  // Wheel zoom handler
  const handleWheel = (e) => {
    if (e.ctrlKey || e.metaKey) {
      e.preventDefault();
      const delta = e.deltaY > 0 ? -0.08 : 0.08;
      setModalZoom((z) => Math.max(0.45, Math.min(2.0, z + delta)));
    }
  };

  const displayPoints = (points && points.length > 0)
    ? points
    : (scene?.elements || [])
        .filter((e) => e.text && e.subtitle)
        .map((e) => `${e.text}: ${e.subtitle}`);

  const title = scene?.title || topicTitle || "Visual Summary";

  return (
    <div
      className="infographic-container"
      style={featureStyleFunctions.s0({})}
    >
      {/* ── 1. INLINE CHAT FEED CARD ── */}
      <div className="infographic-inline-view">
        {/* Top Header Bar */}
        <div
          style={featureStyleFunctions.s1({})}
        >
          <div style={featureStyleFunctions.s2({})}>
            <span
              style={featureStyleFunctions.s3({})}
            >
              <Sparkles size={11} />
              VISUAL SUMMARY
            </span>
            <span
              style={featureStyleFunctions.s4({})}
            >
              {title}
            </span>
          </div>

          <div style={featureStyleFunctions.s5({})}>
            {onRegenerate && (
              <button
                type="button"
                onClick={onRegenerate}
                title="Regenerate Infographic"
                style={featureStyleFunctions.s6({})}
              >
                <RotateCcw size={12} />
                <span>Regenerate</span>
              </button>
            )}

            <button
              type="button"
              onClick={() => setIsModalOpen(true)}
              style={featureStyleFunctions.s7({})}
            >
              <Maximize2 size={12} />
              <span>Full Screen</span>
            </button>

            {onClose && (
              <button
                type="button"
                onClick={onClose}
                title="Close Visual Summary"
                style={featureStyleFunctions.s8({})}
              >
                <X size={14} />
              </button>
            )}
          </div>
        </div>

        {/* Inline Thumbnail Preview Canvas */}
        <div
          style={featureStyleFunctions.s9({})}
          onClick={() => setIsModalOpen(true)}
          title="Click to open interactive full-screen blueprint"
        >
          {scene && (
            <SceneRenderer
              scene={scene}
              animationController={animationController}
            />
          )}

          {/* Hover Overlay Hint */}
          <div
            style={featureStyleFunctions.s10({})}
            onMouseEnter={(e) => (e.currentTarget.style.opacity = "1")}
            onMouseLeave={(e) => (e.currentTarget.style.opacity = "0")}
          >
            <Maximize2 size={16} />
            <span>Click to Expand Full Screen</span>
          </div>
        </div>

        {/* Collapsible Key Takeaways Section (Inline - Collapsed by default) */}
        {displayPoints.length > 0 && (
          <div
            style={featureStyleFunctions.s11({})}
          >
            <button
              type="button"
              onClick={() => setIsInlineTakeawaysOpen((v) => !v)}
              style={featureStyleFunctions.s12({})}
            >
              <div style={featureStyleFunctions.s13({})}>
                <Sparkles size={13} color="#f5a95b" />
                <span>Key Takeaways ({displayPoints.length})</span>
              </div>
              {isInlineTakeawaysOpen ? (
                <ChevronDown size={14} color="#94a3b8" />
              ) : (
                <ChevronRight size={14} color="#94a3b8" />
              )}
            </button>

            {isInlineTakeawaysOpen && (
              <div style={featureStyleFunctions.s14({})}>
                {displayPoints.map((pt, idx) => (
                  <div
                    key={idx}
                    style={featureStyleFunctions.s15({})}
                  >
                    <span
                      style={featureStyleFunctions.s16({})}
                    >
                      {idx + 1}
                    </span>
                    <span style={featureStyleFunctions.s17({})}>{pt.replace(/^[-*•]\s+/, "")}</span>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}
      </div>

      {/* ── 2. FULL-SCREEN CANVAS MODAL (Opens by default on click) ── */}
      {isModalOpen && mounted && createPortal(
        <div
          className="infographic-modal-overlay"
          style={featureStyleFunctions.s18({})}
        >
          {/* Top Bar: Minimal - Title and Back to Chat */}
          <div
            className="infographic-modal-topbar"
            style={featureStyleFunctions.s19({})}
          >
            <div style={featureStyleFunctions.s20({})}>
              <div
                style={featureStyleFunctions.s21({})}
              >
                <Sparkles size={12} />
                <span>INTERACTIVE VISUAL SUMMARY</span>
              </div>
              <h2
                style={featureStyleFunctions.s22({})}
              >
                {title}
              </h2>
            </div>

            {/* Prominent Back to Chat Button on top right */}
            <button
              type="button"
              onClick={() => {
                setIsModalOpen(false);
                if (onClose) onClose();
              }}
              style={featureStyleFunctions.s23({})}
              title="Close Full Window (Esc)"
            >
              <X size={15} />
              <span>Back to Chat</span>
            </button>
          </div>

          {/* Canvas Viewport or Generating Loading Screen */}
          {isLoading || !scene ? (
            <div
              style={featureStyleFunctions.s24({})}
            >
              {/* Futuristic orbital loading indicator */}
              <div style={featureStyleFunctions.s25({})}>
                <div
                  style={featureStyleFunctions.s26({})}
                />
                <div
                  style={featureStyleFunctions.s27({})}
                />
                <div
                  style={featureStyleFunctions.s28({})}
                >
                  <Sparkles size={28} />
                </div>
              </div>

              <div>
                <h3 style={featureStyleFunctions.s29({})}>
                  Generating Visual Summary...
                </h3>
                <p style={featureStyleFunctions.s30({})}>
                  Gemini is analyzing the concept architecture and structuring the optimal visual diagram layout.
                </p>
              </div>

              <div
                style={featureStyleFunctions.s31({})}
              >
                <Loader2 size={13} style={featureStyleFunctions.s32({})} />
                <span>Autonomous layout synthesis in progress...</span>
              </div>
            </div>
          ) : (
            <div
              ref={viewportRef}
              className="infographic-viewport"
              onMouseDown={handleMouseDown}
              onWheel={handleWheel}
              style={featureStyleFunctions.s33({isPanning})}
            >
              {/* Scaled SVG Stage */}
              <div
                className="infographic-stage"
                style={featureStyleFunctions.s34({panPosition,modalZoom,isPanning})}
              >
                {/* Master Vector SVG Scene */}
                <SceneRenderer
                  scene={scene}
                  animationController={animationController}
                  svgRef={svgRef}
                />
              </div>

              {/* Key Takeaways Companion Drawer (Collapsed by default; slides in from right when opened) */}
              {showTakeaways && displayPoints.length > 0 && (
                <div
                  style={featureStyleFunctions.s35({})}
                >
                  <div
                    style={featureStyleFunctions.s36({})}
                  >
                    <div style={featureStyleFunctions.s37({})}>
                      <Sparkles size={15} />
                      <span>Key Takeaways</span>
                    </div>
                    <button
                      type="button"
                      onClick={() => setShowTakeaways(false)}
                      style={featureStyleFunctions.s38({})}
                      title="Collapse Takeaways"
                    >
                      <X size={15} />
                    </button>
                  </div>

                  <div style={featureStyleFunctions.s39({})}>
                    {displayPoints.map((pt, idx) => (
                      <div
                        key={idx}
                        style={featureStyleFunctions.s40({})}
                      >
                        <div style={featureStyleFunctions.s41({})}>
                          POINT {String(idx + 1).padStart(2, "0")}
                        </div>
                        {pt.replace(/^[-*•]\s+/, "")}
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          )}

          {/* ALL CANVAS OPTIONS IN ONE SLEEK LINE */}
          {scene && (
            <BottomToolbar
              scene={scene}
              zoom={modalZoom}
              onZoomIn={handleZoomIn}
              onZoomOut={handleZoomOut}
              onZoomReset={handleZoomReset}
              onFitToScreen={handleFitToScreen}
              takeawaysCount={displayPoints.length}
              showTakeaways={showTakeaways}
              onToggleTakeaways={() => setShowTakeaways((v) => !v)}
            />
          )}
        </div>,
        document.body
      )}
    </div>
  );
};
