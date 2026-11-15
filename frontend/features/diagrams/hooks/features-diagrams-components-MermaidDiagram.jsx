'use client';

import inlineStyles from '@/features/diagrams/styles/MermaidDiagram.styles';
import React, { useEffect, useRef, useState, useCallback } from 'react';
import { createPortal } from 'react-dom';
import { ZoomIn, ZoomOut, RotateCcw, Code, Copy, Check, Sparkles, AlertCircle, Maximize2, ChevronDown, X, ArrowLeft, Move } from 'lucide-react';
import StitchAICursor from '@/components/StitchAICursor';
import '@/features/diagrams/styles/MermaidDiagram.css';
import {renderFormattedText,sanitizeMermaid,NODE_PALETTES,applyBlenderPalettes,synthesizeCreativeInfographic,MIN_MODAL_ZOOM,MAX_MODAL_ZOOM,MIN_INLINE_ZOOM,MAX_INLINE_ZOOM,ZOOM_STEP,DIAGRAM_CONFIGS,getMermaidConfig} from '@/features/diagrams/components/features-diagrams-components-MermaidDiagram.support.jsx';

export function useMermaidDiagramModel({ chart, points = [], chatHistory = [], onRegenerate, onClose, diagramType = 'flowchart' }) {

  const containerRef = useRef(null);
  const modalViewportRef = useRef(null);
  const [mounted, setMounted] = useState(false);
  const [svgHtml, setSvgHtml] = useState('');
  const [renderError, setRenderError] = useState(null);
  const [loading, setLoading] = useState(true);
  const [zoom, setZoom] = useState(0.95);
  const [modalZoom, setModalZoom] = useState(1.0);
  const modalZoomRef = useRef(1.0);
  modalZoomRef.current = modalZoom;

  const [isWheelZooming, setIsWheelZooming] = useState(false);
  const wheelZoomTimeoutRef = useRef(null);
  const touchDistRef = useRef(null);
  const resizeTimerRef = useRef(null);

  const [showCode, setShowCode] = useState(false);
  const [copied, setCopied] = useState(false);
  const [isKeypointsOpen, setIsKeypointsOpen] = useState(false); // Collapsed by default (inline chat)
  const [isModalOpen, setIsModalOpen] = useState(true); // Open directly in fullscreen focused modal when requested!
  const takeawaysRef = useRef(null);
  const hasAnimatedRef = useRef(false); // Tracks whether live draw has completed once, to prevent wiping on reopen

  // Derived intelligent topic title for the poster header banner
  const derivedTopicTitle = React.useMemo(() => {
    if (chatHistory && chatHistory.length > 0) {
      const userMsg = [...chatHistory].reverse().find(m => m.sender === 'user' || m.role === 'user');
      const rawUserText = userMsg ? (userMsg.content || userMsg.text || '') : '';
      if (rawUserText) {
        let t = rawUserText.replace(/^(explain|teach me|what is|tell me about|how does|why is|draw|generate an infographic about|infographic on|visual summary of|visual summary on)\s+/i, '').trim();
        t = t.replace(/[?!.]+$/, '').trim();
        if (t.length > 0 && t.length <= 60) {
          return t.charAt(0).toUpperCase() + t.slice(1);
        }
      }
    }
    if (points && points.length > 0) {
      const first = points[0].replace(/^[-*\d.)\s]+/, '').replace(/\*\*/g, '');
      const parts = first.split(/[:—–\-]/);
      if (parts[0].trim().length >= 3) {
        return parts[0].trim();
      }
    }
    return "Knowledge Architecture & Concept Flow";
  }, [chatHistory, points]);

  const handleScrollToTakeaways = () => {
    if (takeawaysRef.current) {
      takeawaysRef.current.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  };

  // Body scroll lock when fullscreen modal is active
  useEffect(() => {
    if (isModalOpen) {
      const prevOverflow = document.body.style.overflow;
      document.body.style.overflow = 'hidden';
      return () => {
        document.body.style.overflow = prevOverflow;
      };
    }
  }, [isModalOpen]);

  // Close modal on Escape key
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === 'Escape' && isModalOpen) {
        setIsModalOpen(false);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isModalOpen]);

  // Mouse drag panning state for modal viewport
  const [isPanning, setIsPanning] = useState(false);
  const panStartRef = useRef({ x: 0, y: 0, scrollLeft: 0, scrollTop: 0 });

  // ── Stitch AI Live Construction State ──
  const [isLiveDrawEnabled, setIsLiveDrawEnabled] = useState(true);
  const [isBuilding, setIsBuilding] = useState(true);
  const [cursorState, setCursorState] = useState({
    x: 0,
    y: 0,
    visible: false,
    status: 'Drafting...',
    label: '',
    isClicking: false,
    isTracing: false
  });

  const animTimeoutsRef = useRef([]);
  const animFrameRef = useRef(null);
  const animCancelledRef = useRef(false);

  const clearAnimTimeouts = () => {
    animTimeoutsRef.current.forEach((t) => clearTimeout(t));
    animTimeoutsRef.current = [];
    if (animFrameRef.current) {
      cancelAnimationFrame(animFrameRef.current);
      animFrameRef.current = null;
    }
  };

  const stopAndCleanAnimation = useCallback(() => {
    animCancelledRef.current = true;
    clearAnimTimeouts();
    setIsBuilding(false);
    setCursorState((prev) => ({ ...prev, visible: false, isClicking: false, isTracing: false }));
    const targets = [modalViewportRef.current, containerRef.current].filter(Boolean);
    targets.forEach((root) => {
      const wrapper = root.querySelector('.mermaid-svg-wrapper') || (root.classList?.contains('mermaid-svg-wrapper') ? root : null);
      if (wrapper) {
        wrapper.classList.remove('building');
        wrapper.style.opacity = '1';
        applyBlenderPalettes(wrapper);
        const allNodes = wrapper.querySelectorAll('.node, g.node');
        allNodes.forEach((n) => {
          n.style.opacity = '1';
          n.style.transform = 'none';
          n.style.filter = '';
          const shape = n.querySelector('rect, polygon, circle, ellipse, path:not(.arrowMarkerPath)') || n;
          if (shape && shape.style) shape.style.strokeDashoffset = '0';
          const texts = n.querySelectorAll('.label, foreignObject, text, tspan, .nodeLabel');
          texts.forEach((t) => { t.style.opacity = '1'; });
        });
        const allEdges = wrapper.querySelectorAll('.edgePaths path, .edgePath path, path.flowchart-link, g[class*="edge"] path');
        allEdges.forEach((e) => {
          e.style.opacity = '1';
          if (e.style) {
            e.style.strokeDashoffset = '0';
            e.style.stroke = '#64748B';
          }
        });
        const allMarkers = wrapper.querySelectorAll('marker, .arrowheadPath, .arrowMarkerPath, [id*="pointEnd"] path, [id*="arrow"] path, .edgeLabel, .edgeLabels');
        allMarkers.forEach((m) => {
          m.style.opacity = '1';
        });
        const allClusters = wrapper.querySelectorAll('.cluster, g.cluster');
        allClusters.forEach((c) => {
          const rect = c.querySelector('rect');
          if (rect && rect.style) rect.style.strokeDashoffset = '0';
          const labels = c.querySelectorAll('text, span, .nodeLabel, foreignObject');
          labels.forEach((l) => { l.style.opacity = '1'; });
        });
      }
    });
  }, []);

  // Compute stable intrinsic fit zoom so diagram fills viewport comfortably with zero sudden jumps or box-by-box scroll trap
  const computeFitZoom = useCallback((viewportEl, isModal) => {
    if (!viewportEl) return isModal ? 0.9 : 0.85;
    const stageEl = viewportEl.querySelector('.mermaid-canvas-stage');
    const svgEl = viewportEl.querySelector('svg');
    if (!svgEl && !stageEl) return isModal ? 0.9 : 0.85;

    const vpH = viewportEl.clientHeight || (isModal ? 680 : 380);
    const vpW = viewportEl.clientWidth || (isModal ? 1200 : 650);

    // Guard against zero or negative dimensions
    if (vpW <= 0 || vpH <= 0) return isModal ? 0.9 : 0.85;

    const paddingX = isModal ? 48 : 32;
    const paddingY = isModal ? 40 : 32;

    const availW = Math.max(200, vpW - paddingX);
    const availH = Math.max(200, vpH - paddingY);

    if (isModal && stageEl) {
      // In widescreen modal mode, measure the stage composition dimensions
      const stageW = Math.max(800, stageEl.scrollWidth || stageEl.offsetWidth || 1200);
      const stageH = Math.max(420, stageEl.scrollHeight || stageEl.offsetHeight || 600);

      const scaleW = availW / stageW;
      const scaleH = availH / stageH;
      let ideal = Math.min(scaleW, scaleH);

      // If diagram is exceptionally tall, prioritize comfortable horizontal width so cards and typography remain readable
      if (stageH > stageW * 1.25) {
        ideal = Math.min(scaleW, 1.0);
      }

      return Number(Math.max(MIN_MODAL_ZOOM, Math.min(1.25, ideal)).toFixed(2));
    }

    let intrinsicW = 550;
    let intrinsicH = 380;

    if (svgEl?.viewBox?.baseVal?.width > 0 && svgEl?.viewBox?.baseVal?.height > 0) {
      intrinsicW = svgEl.viewBox.baseVal.width;
      intrinsicH = svgEl.viewBox.baseVal.height;
    } else {
      const bbox = typeof svgEl?.getBBox === 'function' ? svgEl.getBBox() : null;
      if (bbox && bbox.width > 0 && bbox.height > 0) {
        intrinsicW = bbox.width;
        intrinsicH = bbox.height;
      }
    }

    // Guard against invalid dimensions
    if (intrinsicW <= 0 || intrinsicH <= 0) return isModal ? 0.9 : 0.85;

    const maxStageW = 780;
    const targetW = Math.min(availW, maxStageW);

    const aspect = intrinsicH / Math.max(40, intrinsicW);
    const renderedH = targetW * aspect;

    // Scale factor required to fit both width and height completely inside viewport
    const scaleW = availW / targetW;
    const scaleH = availH / Math.max(40, renderedH);
    let ideal = Math.min(scaleW, scaleH);

    // Clamp to reasonable bounds to prevent extreme zoom
    const maxZoom = isModal ? 1.15 : 1.15;
    const minZoom = isModal ? MIN_MODAL_ZOOM : MIN_INLINE_ZOOM;
    ideal = Math.max(minZoom, Math.min(maxZoom, ideal));

    return Number(ideal.toFixed(2));
  }, []);

  const autoFitModalChart = useCallback(() => {
    if (!modalViewportRef.current) return;
    const fit = computeFitZoom(modalViewportRef.current, true);
    setModalZoom(fit);
    modalZoomRef.current = fit;
    // Reset scroll position to prevent negative scroll trap
    modalViewportRef.current.scrollTop = 0;
    modalViewportRef.current.scrollLeft = 0;
    // Ensure stage is centered
    const stageEl = modalViewportRef.current.querySelector('.mermaid-canvas-stage');
    if (stageEl) {
      stageEl.style.transformOrigin = 'center center';
    }
  }, [computeFitZoom]);

  const autoFitInlineChart = useCallback(() => {
    if (!containerRef.current) return;
    const fit = computeFitZoom(containerRef.current, false);
    setZoom(fit);
    containerRef.current.scrollTop = 0;
    containerRef.current.scrollLeft = 0;
    // Ensure stage is centered
    const stageEl = containerRef.current.querySelector('.mermaid-canvas-stage');
    if (stageEl) {
      stageEl.style.transformOrigin = 'top center';
    }
  }, [computeFitZoom]);

  // Point-to-point live vector drawing animation engine: draws boxes, text, and arrow connections one after the other, one at a time!
  const runLiveDrawAnimation = useCallback((containerEl) => {
    const isModal = isModalOpen && modalViewportRef.current;
    const container = containerEl || (isModal ? modalViewportRef.current : containerRef.current);
    if (!container) return;

    clearAnimTimeouts();
    animCancelledRef.current = false;

    container.scrollTop = 0;
    container.scrollLeft = 0;

    const wrapper = container.querySelector('.mermaid-svg-wrapper');
    if (!wrapper) return;
    const svgEl = wrapper.querySelector('svg');
    if (!svgEl) return;
    const stageEl = container.querySelector('.mermaid-canvas-stage') || wrapper;

    const rawClusterEls = Array.from(wrapper.querySelectorAll('.cluster, g.cluster'));
    const rawNodeEls = Array.from(wrapper.querySelectorAll('.node, g.node'));
    const rawEdgeEls = Array.from(wrapper.querySelectorAll('.edgePaths path, .edgePath path, path.flowchart-link, g[class*="edge"] path'));
    const rawMarkerEls = Array.from(wrapper.querySelectorAll('marker, .arrowMarkerPath, .arrowheadPath, [id*="pointEnd"] path, [id*="arrow"] path'));
    const rawLabelEls = Array.from(wrapper.querySelectorAll('.edgeLabel, .edgeLabels'));

    if (rawNodeEls.length === 0) return;

    // Helper: converts any client-space position (clientX, clientY) directly into stage-local coordinates
    const toStagePoint = (clientX, clientY) => {
      const sRect = stageEl.getBoundingClientRect();
      const scale = stageEl.offsetWidth > 0 ? (sRect.width / stageEl.offsetWidth) : 1;
      return {
        x: (clientX - sRect.left) / scale,
        y: (clientY - sRect.top) / scale
      };
    };

    // Frame-by-frame animation runner returning a promise
    const animateFrame = (durationMs, onFrame) => {
      return new Promise((resolve) => {
        const start = performance.now();
        const step = (now) => {
          if (animCancelledRef.current) return resolve();
          const elapsed = now - start;
          const t = Math.min(1, elapsed / Math.max(1, durationMs));
          onFrame(t);
          if (t < 1) {
            animFrameRef.current = requestAnimationFrame(step);
          } else {
            resolve();
          }
        };
        animFrameRef.current = requestAnimationFrame(step);
      });
    };

    // Sort clusters in visual top-to-bottom order
    const sortedClusters = rawClusterEls.slice().sort((a, b) => a.getBoundingClientRect().top - b.getBoundingClientRect().top);

    // Initial state: hide all clusters, nodes, text, edges, markers, labels
    sortedClusters.forEach((c) => {
      const rect = c.querySelector('rect');
      if (rect) {
        const cr = rect.getBoundingClientRect();
        const perim = 2 * (cr.width + cr.height);
        rect.dataset.rectLength = String(perim);
        rect.style.strokeDasharray = `${perim}`;
        rect.style.strokeDashoffset = `${perim}`;
        rect.style.transition = 'none';
      }
      const labelEls = c.querySelectorAll('text, span, .nodeLabel, foreignObject');
      labelEls.forEach((l) => {
        l.style.opacity = '0';
        l.style.transition = 'opacity 0.25s ease';
      });
    });

    rawNodeEls.forEach((n) => {
      n.style.opacity = '1';
      const shape = n.querySelector('rect, polygon, circle, ellipse, path:not(.arrowMarkerPath)') || n;
      const nr = (shape || n).getBoundingClientRect();
      const perim = 2 * (nr.width + nr.height);
      shape.dataset.shapeLength = String(perim);
      if (shape.style) {
        shape.style.strokeDasharray = `${perim}`;
        shape.style.strokeDashoffset = `${perim}`;
        shape.style.transition = 'none';
      }
      const textEls = n.querySelectorAll('.label, foreignObject, text, tspan, .nodeLabel');
      textEls.forEach((t) => {
        t.style.opacity = '0';
        t.style.transition = 'opacity 0.25s ease';
      });
    });

    rawEdgeEls.forEach((e) => {
      let eLen = 0;
      if (typeof e.getTotalLength === 'function') {
        try { eLen = e.getTotalLength(); } catch {}
      }
      if (!eLen || isNaN(eLen)) eLen = 140;
      e.dataset.pathLength = String(eLen);
      e.style.strokeDasharray = `${eLen}`;
      e.style.strokeDashoffset = `${eLen}`;
      e.style.opacity = '0';
      e.style.transition = 'none';
    });

    rawMarkerEls.forEach((m) => {
      m.style.opacity = '0';
      m.style.transition = 'opacity 0.2s ease';
    });

    rawLabelEls.forEach((l) => {
      l.style.opacity = '0';
      l.style.transition = 'opacity 0.25s ease';
    });

    wrapper.classList.add('building');
    setIsBuilding(true);

    // Initial position: White hairline vector stylus hovers above first item
    const firstTarget = sortedClusters[0] || rawNodeEls[0];
    const fr = firstTarget.getBoundingClientRect();
    const startPt = toStagePoint(fr.left + fr.width / 2, Math.max(10, fr.top - 24));

    setCursorState({
      x: startPt.x,
      y: startPt.y,
      visible: true,
      status: '🧠 Drafting Blueprint...',
      label: 'Vedika AI',
      isClicking: false,
      isTracing: false
    });

    // Helper to find all nodes visually inside a cluster
    const getNodesForCluster = (clusterEl, allNodes) => {
      const cr = clusterEl.getBoundingClientRect();
      const matched = allNodes.filter((n) => {
        const nr = n.getBoundingClientRect();
        const centerY = nr.top + nr.height / 2;
        return centerY >= cr.top - 5 && centerY <= cr.bottom + 5;
      });
      // Sort left-to-right
      return matched.sort((a, b) => a.getBoundingClientRect().left - b.getBoundingClientRect().left);
    };

    // Sequential point-to-point drawing: boxes -> text -> arrows (one after the other, one at a time!)
    (async () => {
      try {
        await new Promise((r) => setTimeout(r, 120));
        if (animCancelledRef.current) return;

        let nodeColorCounter = 0;

        if (sortedClusters.length > 0) {
          // Diagram has Stages / Clusters
          for (let cIdx = 0; cIdx < sortedClusters.length; cIdx++) {
            if (animCancelledRef.current) break;
            const clusterEl = sortedClusters[cIdx];
            const cRectEl = clusterEl.querySelector('rect');
            const clusterText = clusterEl.textContent?.trim().replace(/\s+/g, ' ') || `Stage ${cIdx + 1}`;

            // Step 1: Draw the Stage container box frame
            if (cRectEl) {
              const cr = cRectEl.getBoundingClientRect();
              const cStartPt = toStagePoint(cr.left, cr.top);

              setCursorState((prev) => ({
                ...prev,
                status: `Drawing ${clusterText.slice(0, 24)}...`,
                label: `Stage ${cIdx + 1}`,
                accentColor: '#38BDF8',
                x: cStartPt.x,
                y: cStartPt.y,
                isTracing: true,
                isClicking: true
              }));

              const rw = cr.width;
              const rh = cr.height;
              const perim = 2 * (rw + rh);
              const rectLen = parseFloat(cRectEl.dataset.rectLength || String(perim));

              await animateFrame(200, (t) => {
                cRectEl.style.strokeDashoffset = `${rectLen * (1 - t)}`;
                const d = t * perim;
                let cx = cr.left, cy = cr.top;
                if (d < rw) { cx = cr.left + d; cy = cr.top; }
                else if (d < rw + rh) { cx = cr.right; cy = cr.top + (d - rw); }
                else if (d < 2 * rw + rh) { cx = cr.right - (d - (rw + rh)); cy = cr.bottom; }
                else { cx = cr.left; cy = cr.bottom - (d - (2 * rw + rh)); }
                const pt = toStagePoint(cx, cy);
                setCursorState((prev) => ({ ...prev, x: pt.x, y: pt.y }));
              });
              cRectEl.style.strokeDashoffset = '0';
            }

            // Reveal Stage Title Text
            const clusterLabels = clusterEl.querySelectorAll('text, span, .nodeLabel, foreignObject');
            clusterLabels.forEach((l) => { l.style.opacity = '1'; });
            await new Promise((r) => setTimeout(r, 60));

            // Step 2: Draw each node inside this Stage (box first, then the text in it!)
            const stageNodes = getNodesForCluster(clusterEl, rawNodeEls);
            for (let nIdx = 0; nIdx < stageNodes.length; nIdx++) {
              if (animCancelledRef.current) break;
              const nodeEl = stageNodes[nIdx];
              const shapeEl = nodeEl.querySelector('rect, polygon, circle, ellipse, path:not(.arrowMarkerPath)') || nodeEl;
              const textEls = nodeEl.querySelectorAll('.label, foreignObject, text, tspan, .nodeLabel');
              const nodeTitle = nodeEl.querySelector('b, strong')?.textContent?.trim() || nodeEl.textContent?.trim().slice(0, 20) || `Node`;

              const nr = (shapeEl || nodeEl).getBoundingClientRect();
              const nStartPt = toStagePoint(nr.left, nr.top);
              const colorIdx = nodeColorCounter % NODE_PALETTES.length;
              nodeColorCounter++;
              const palette = NODE_PALETTES[colorIdx];

              setCursorState((prev) => ({
                ...prev,
                status: `Drawing Box: ${nodeTitle}`,
                label: nodeTitle.slice(0, 18),
                accentColor: palette.stroke,
                x: nStartPt.x,
                y: nStartPt.y,
                isTracing: true,
                isClicking: true
              }));

              // 2a. Pen draws the node box outline
              const nw = nr.width;
              const nh = nr.height;
              const nPerim = 2 * (nw + nh);
              const shapeLen = parseFloat(shapeEl.dataset.shapeLength || String(nPerim));

              await animateFrame(220, (t) => {
                if (shapeEl.style) {
                  shapeEl.style.strokeDashoffset = `${shapeLen * (1 - t)}`;
                }
                const d = t * nPerim;
                let cx = nr.left, cy = nr.top;
                if (d < nw) { cx = nr.left + d; cy = nr.top; }
                else if (d < nw + nh) { cx = nr.right; cy = nr.top + (d - nw); }
                else if (d < 2 * nw + nh) { cx = nr.right - (d - (nw + nh)); cy = nr.bottom; }
                else { cx = nr.left; cy = nr.bottom - (d - (2 * nw + nh)); }
                const pt = toStagePoint(cx, cy);
                setCursorState((prev) => ({ ...prev, x: pt.x, y: pt.y }));
              });
              if (shapeEl.style) shapeEl.style.strokeDashoffset = '0';

              // 2b. Pen writes the text inside the box!
              const nCenterPt = toStagePoint(nr.left + nw / 2, nr.top + nh / 2);
              setCursorState((prev) => ({
                ...prev,
                status: `Writing text: ${nodeTitle}`,
                x: nCenterPt.x,
                y: nCenterPt.y,
                isClicking: false
              }));

              // Reveal text in this box
              textEls.forEach((t) => { t.style.opacity = '1'; });
              if (shapeEl.style) {
                shapeEl.style.stroke = palette.stroke;
                shapeEl.style.fill = palette.fill;
              }
              await new Promise((r) => setTimeout(r, 90));
            }

            // Step 3: Draw the connecting arrow to the next Stage
            if (cIdx < sortedClusters.length - 1) {
              if (animCancelledRef.current) break;
              const edgeEl = rawEdgeEls[cIdx];
              if (edgeEl) {
                const er = edgeEl.getBoundingClientRect();
                const edgeStartPt = toStagePoint(er.left + er.width / 2, er.top);
                const edgeLen = parseFloat(edgeEl.dataset.pathLength || String(Math.max(80, er.height)));

                edgeEl.style.opacity = '1';
                edgeEl.style.stroke = '#38BDF8';
                edgeEl.style.strokeWidth = '1.75px';
                edgeEl.style.strokeDasharray = `${edgeLen}`;
                edgeEl.style.strokeDashoffset = `${edgeLen}`;

                setCursorState((prev) => ({
                  ...prev,
                  status: `Connecting to Stage ${cIdx + 2} ➔`,
                  label: '➔',
                  accentColor: '#38BDF8',
                  x: edgeStartPt.x,
                  y: edgeStartPt.y,
                  isTracing: true,
                  isClicking: true
                }));

                // Pen glides along the arrow path from top to bottom
                await animateFrame(180, (t) => {
                  edgeEl.style.strokeDashoffset = `${edgeLen * (1 - t)}`;
                  const cx = er.left + er.width / 2;
                  const cy = er.top + t * er.height;
                  const pt = toStagePoint(cx, cy);
                  setCursorState((prev) => ({ ...prev, x: pt.x, y: pt.y }));
                });
                edgeEl.style.strokeDashoffset = '0';

                // Reveal arrowhead marker
                if (cIdx < rawMarkerEls.length) {
                  rawMarkerEls[cIdx].style.opacity = '1';
                  rawMarkerEls[cIdx].style.fill = '#38BDF8';
                }

                // Pen moves to and reveals the single neat pill label ("Processes into" / "Yields deliverables")
                if (cIdx < rawLabelEls.length) {
                  const lbl = rawLabelEls[cIdx];
                  lbl.style.opacity = '1';
                  const lr = lbl.getBoundingClientRect();
                  const lPt = toStagePoint(lr.left + lr.width / 2, lr.top + lr.height / 2);
                  setCursorState((prev) => ({
                    ...prev,
                    status: lbl.textContent?.trim() || 'Connected',
                    label: '➔',
                    x: lPt.x,
                    y: lPt.y,
                    isClicking: false
                  }));
                }
                await new Promise((r) => setTimeout(r, 90));
              }
            }
          }
        } else {
          // Diagram without clusters: simple top-to-bottom sequence
          const sortedNodes = rawNodeEls.slice().sort((a, b) => a.getBoundingClientRect().top - b.getBoundingClientRect().top);
          for (let idx = 0; idx < sortedNodes.length; idx++) {
            if (animCancelledRef.current) break;
            const nodeEl = sortedNodes[idx];
            const shapeEl = nodeEl.querySelector('rect, polygon, circle, ellipse, path:not(.arrowMarkerPath)') || nodeEl;
            const textEls = nodeEl.querySelectorAll('.label, foreignObject, text, tspan, .nodeLabel');
            const nodeTitle = nodeEl.querySelector('b, strong')?.textContent?.trim() || nodeEl.textContent?.trim().slice(0, 20) || `Node ${idx + 1}`;

            const nr = (shapeEl || nodeEl).getBoundingClientRect();
            const nStartPt = toStagePoint(nr.left, nr.top);
            const palette = NODE_PALETTES[idx % NODE_PALETTES.length];

            setCursorState((prev) => ({
              ...prev,
              status: `Drawing: ${nodeTitle}`,
              label: nodeTitle.slice(0, 18),
              accentColor: palette.stroke,
              x: nStartPt.x,
              y: nStartPt.y,
              isTracing: true,
              isClicking: true
            }));

            const nw = nr.width;
            const nh = nr.height;
            const nPerim = 2 * (nw + nh);
            const shapeLen = parseFloat(shapeEl.dataset.shapeLength || String(nPerim));

            await animateFrame(220, (t) => {
              if (shapeEl.style) shapeEl.style.strokeDashoffset = `${shapeLen * (1 - t)}`;
              const d = t * nPerim;
              let cx = nr.left, cy = nr.top;
              if (d < nw) { cx = nr.left + d; cy = nr.top; }
              else if (d < nw + nh) { cx = nr.right; cy = nr.top + (d - nw); }
              else if (d < 2 * nw + nh) { cx = nr.right - (d - (nw + nh)); cy = nr.bottom; }
              else { cx = nr.left; cy = nr.bottom - (d - (2 * nw + nh)); }
              const pt = toStagePoint(cx, cy);
              setCursorState((prev) => ({ ...prev, x: pt.x, y: pt.y }));
            });
            if (shapeEl.style) shapeEl.style.strokeDashoffset = '0';

            // Write text inside the box
            const nCenterPt = toStagePoint(nr.left + nw / 2, nr.top + nh / 2);
            setCursorState((prev) => ({
              ...prev,
              status: `Writing text: ${nodeTitle}`,
              x: nCenterPt.x,
              y: nCenterPt.y,
              isClicking: false
            }));
            textEls.forEach((t) => { t.style.opacity = '1'; });
            if (shapeEl.style) {
              shapeEl.style.stroke = palette.stroke;
              shapeEl.style.fill = palette.fill;
            }
            await new Promise((r) => setTimeout(r, 90));

            // Draw outgoing arrow if available
            if (idx < rawEdgeEls.length) {
              const edgeEl = rawEdgeEls[idx];
              const er = edgeEl.getBoundingClientRect();
              const edgeStartPt = toStagePoint(er.left + er.width / 2, er.top);
              const edgeLen = parseFloat(edgeEl.dataset.pathLength || String(Math.max(80, er.height)));

              edgeEl.style.opacity = '1';
              edgeEl.style.stroke = palette.stroke;
              edgeEl.style.strokeWidth = '1.75px';
              edgeEl.style.strokeDasharray = `${edgeLen}`;
              edgeEl.style.strokeDashoffset = `${edgeLen}`;

              setCursorState((prev) => ({
                ...prev,
                status: 'Connecting ➔',
                label: '➔',
                accentColor: palette.stroke,
                x: edgeStartPt.x,
                y: edgeStartPt.y,
                isTracing: true
              }));

              await animateFrame(180, (t) => {
                edgeEl.style.strokeDashoffset = `${edgeLen * (1 - t)}`;
                const cx = er.left + er.width / 2;
                const cy = er.top + t * er.height;
                const pt = toStagePoint(cx, cy);
                setCursorState((prev) => ({ ...prev, x: pt.x, y: pt.y }));
              });
              edgeEl.style.strokeDashoffset = '0';

              if (idx < rawMarkerEls.length) {
                rawMarkerEls[idx].style.opacity = '1';
                rawMarkerEls[idx].style.fill = palette.stroke;
              }
              if (idx < rawLabelEls.length) {
                rawLabelEls[idx].style.opacity = '1';
              }
              await new Promise((r) => setTimeout(r, 60));
            }
          }
        }

        // Complete any remaining edges/markers/labels
        rawEdgeEls.forEach((e) => { e.style.opacity = '1'; if (e.style) e.style.strokeDashoffset = '0'; });
        rawMarkerEls.forEach((m) => { m.style.opacity = '1'; });
        rawLabelEls.forEach((l) => { l.style.opacity = '1'; });

        if (!animCancelledRef.current) {
          hasAnimatedRef.current = true;
          setCursorState((prev) => ({
            ...prev,
            status: 'Infographic Complete ✨',
            label: 'Ready',
            isClicking: false,
            isTracing: false
          }));
        }
      } finally {
        hasAnimatedRef.current = true;
        stopAndCleanAnimation(container);
        setTimeout(() => {
          setCursorState((prev) => ({ ...prev, visible: false }));
          setIsBuilding(false);
        }, 400);
      }
    })();
  }, [isModalOpen, zoom, stopAndCleanAnimation]);

  const handleSkipBuild = (targetEl) => {
    hasAnimatedRef.current = true;
    stopAndCleanAnimation(targetEl || (isModalOpen ? modalViewportRef.current : containerRef.current));
  };

  const handleReplayBuild = () => {
    hasAnimatedRef.current = false;
    stopAndCleanAnimation();
    setTimeout(() => {
      const activeTarget = (isModalOpen && modalViewportRef.current) ? modalViewportRef.current : containerRef.current;
      runLiveDrawAnimation(activeTarget);
    }, 60);
  };

  const handleToggleLiveDraw = () => {
    if (isBuilding) {
      handleSkipBuild();
    }
    setIsLiveDrawEnabled((prev) => !prev);
  };

  // Cleanup timeouts on unmount
  useEffect(() => {
    return () => clearAnimTimeouts();
  }, []);

  useEffect(() => {
    setMounted(true);
  }, []);


  // Reset modal scroll and trigger live draw when modal is opened
  useEffect(() => {
    if (isModalOpen) {
      const timer = setTimeout(() => {
        if (modalViewportRef.current) {
          modalViewportRef.current.scrollTop = 0;
          modalViewportRef.current.scrollLeft = 0;
          autoFitModalChart();
          applyBlenderPalettes(modalViewportRef.current);

          // If live draw is active and diagram hasn't been drawn yet, execute live draw!
          if (isLiveDrawEnabled && !hasAnimatedRef.current) {
            runLiveDrawAnimation(modalViewportRef.current);
          } else {
            // Already animated or live draw disabled: ensure 100% full visibility
            stopAndCleanAnimation(modalViewportRef.current);
          }
        }
      }, 70);
      return () => clearTimeout(timer);
    } else {
      // Modal closed: safely clean up any ongoing animation
      stopAndCleanAnimation();
    }
  }, [isModalOpen, isLiveDrawEnabled, autoFitModalChart, runLiveDrawAnimation, stopAndCleanAnimation]);

  // Generate unique render ID per component mount to prevent SVG collisions
  const uniqueIdRef = useRef(`mermaid_${Math.random().toString(36).substr(2, 9)}`);

  const activeChartCode = (chart && chart.trim().length > 15 && (chart.includes('subgraph') || !points || points.length === 0))
    ? chart
    : (points && points.length > 0
        ? synthesizeCreativeInfographic(points, "Visual Architecture & Concept Flow")
        : (chart && chart.trim().length > 5 ? chart : `flowchart TD\n  Root(["🎯 Concept Summary"])\n  Start["⚡ Ready to visualize"]\n  Root ==> Start`)
      );

  useEffect(() => {
    let isMounted = true;
    setLoading(true);
    setRenderError(null);

    async function renderChart() {
      let baseConfig;
      try {
        hasAnimatedRef.current = false;
        const mermaid = (await import('mermaid')).default;
        const diagramConfig = getMermaidConfig(diagramType);
        
        baseConfig = {
          startOnLoad: false,
          theme: 'base',
          flowchart: DIAGRAM_CONFIGS.flowchart.config,
          themeVariables: {
            darkMode: true,
            background: 'transparent',
            primaryColor: '#0F1420',
            primaryTextColor: '#F8FAFC',
            primaryBorderColor: '#38BDF8',
            lineColor: '#64748B',
            secondaryColor: '#161324',
            tertiaryColor: '#0D1929',
            edgeLabelBackground: 'transparent',
            clusterBkg: 'rgba(12, 17, 32, 0.72)',
            clusterBorder: 'rgba(56, 189, 248, 0.28)',
            fontFamily: 'var(--font-outfit), sans-serif',
            fontSize: '13px',
            nodeBorder: 'solid'
          },
          securityLevel: 'loose'
        };
        
        // Add diagram-specific config
        if (diagramConfig.config) {
          baseConfig[diagramConfig.mermaidType] = diagramConfig.config;
        }
        
        mermaid.initialize(baseConfig || { startOnLoad: false, securityLevel: 'strict' });

        const sanitized = sanitizeMermaid(activeChartCode);
        const renderId = 'mmd_' + Date.now() + '_' + Math.random().toString(36).slice(2, 7);

        // Ensure web fonts are completely loaded so Mermaid measures SVG text dimensions accurately
        if (typeof document !== 'undefined' && document.fonts) {
          await document.fonts.ready;
        }

        // Render SVG dynamically
        const { svg } = await mermaid.render(renderId, sanitized);
        let cleanSvg = svg;
        // Strip duplicate SVG rect boxes inserted by Mermaid under edge labels
        cleanSvg = cleanSvg.replace(/<rect[^>]*class=["'][^"']*(?:background|edgeLabel)[^"']*["'][^>]*\/?>/gi, '');
        // Clean transparent arrowheads or default strokes
        cleanSvg = cleanSvg.replace(/fill:\s*rgba\(255,\s*255,\s*255,\s*0\)/g, 'fill: #64748B');
        cleanSvg = cleanSvg.replace(/stroke:\s*1\.25px/g, 'stroke: #38BDF8; stroke-width: 1.5px');
        cleanSvg = cleanSvg.replace(/<svg\s+([^>]*?)style="([^"]*?)"/i, (m, attrs, style) => {
          return `<svg ${attrs} style="display: block; width: 100%; max-width: 100%; height: auto; margin: 0 auto; overflow: visible;"`;
        });
        if (!cleanSvg.includes('style=')) {
          cleanSvg = cleanSvg.replace(/<svg\s+/i, '<svg style="display: block; width: 100%; max-width: 100%; height: auto; margin: 0 auto; overflow: visible;" ');
        }

        if (isMounted) {
          setSvgHtml(cleanSvg);
          setLoading(false);
          setTimeout(() => {
            if (modalViewportRef.current) {
              autoFitModalChart();
              applyBlenderPalettes(modalViewportRef.current);
            }
            if (containerRef.current) {
              autoFitInlineChart();
              applyBlenderPalettes(containerRef.current);
            }
            if (isLiveDrawEnabled && !hasAnimatedRef.current) {
              const activeTarget = (isModalOpen && modalViewportRef.current) ? modalViewportRef.current : containerRef.current;
              runLiveDrawAnimation(activeTarget);
            }
          }, 60);
        }
      } catch (err) {
        console.warn('Mermaid rendering failed, attempting simplified fallback:', err);
        // Fallback: try ultra-simple synthesized tree from points
        if (points && points.length > 0) {
          try {
            const mermaid = (await import('mermaid')).default;
            mermaid.initialize(baseConfig || { startOnLoad: false, securityLevel: 'strict' });
            if (typeof document !== 'undefined' && document.fonts) {
              await document.fonts.ready;
            }
            const simpleChart = synthesizeCreativeInfographic(points, "Visual Concept Flow");
            const fallbackId = 'mmd_fb_' + Date.now() + '_' + Math.random().toString(36).slice(2, 7);
            const { svg } = await mermaid.render(fallbackId, simpleChart);
            let cleanSvg = svg;
            // Strip duplicate SVG rect boxes inserted by Mermaid under edge labels
            cleanSvg = cleanSvg.replace(/<rect[^>]*class=["'][^"']*(?:background|edgeLabel)[^"']*["'][^>]*\/?>/gi, '');
            cleanSvg = cleanSvg.replace(/fill:\s*rgba\(255,\s*255,\s*255,\s*0\)/g, 'fill: #64748B');
            cleanSvg = cleanSvg.replace(/stroke:\s*1\.25px/g, 'stroke: #38BDF8; stroke-width: 1.5px');
            cleanSvg = cleanSvg.replace(/<svg\s+([^>]*?)style="([^"]*?)"/i, (m, attrs, style) => {
              return `<svg ${attrs} style="display: block; width: 100%; max-width: 100%; height: auto; margin: 0 auto; overflow: visible;"`;
            });
            if (!cleanSvg.includes('style=')) {
              cleanSvg = cleanSvg.replace(/<svg\s+/i, '<svg style="display: block; width: 100%; max-width: 100%; height: auto; margin: 0 auto; overflow: visible;" ');
            }
            if (isMounted) {
              setSvgHtml(cleanSvg);
              setLoading(false);
              setTimeout(() => {
                if (modalViewportRef.current) {
                  autoFitModalChart();
                  applyBlenderPalettes(modalViewportRef.current);
                }
                if (containerRef.current) {
                  autoFitInlineChart();
                  applyBlenderPalettes(containerRef.current);
                }
                if (isLiveDrawEnabled && !hasAnimatedRef.current) {
                  const activeTarget = (isModalOpen && modalViewportRef.current) ? modalViewportRef.current : containerRef.current;
                  runLiveDrawAnimation(activeTarget);
                }
              }, 60);
              return;
            }
          } catch (fbErr) {
            console.error('Fallback mermaid render error:', fbErr);
          }
        }
        if (isMounted) {
          setRenderError(err?.message || 'Diagram syntax parsing error');
          setLoading(false);
        }
      }
    }

    renderChart();

    return () => {
      isMounted = false;
    };
  }, [activeChartCode, points, autoFitModalChart, autoFitInlineChart, diagramType]);

  // Trigger Stitch AI live draw once the active viewport & its SVG nodes are mounted
  useEffect(() => {
    if (!svgHtml) return;
    if (isModalOpen && !mounted) return;

    // If live draw is disabled or the diagram was already animated, immediately ensure 100% full visibility!
    if (!isLiveDrawEnabled || hasAnimatedRef.current) {
      stopAndCleanAnimation();
      return;
    }

    let cancelled = false;
    let attempts = 0;

    const timer = setInterval(() => {
      attempts++;
      // When modal is open, STRICTLY wait for and target modalViewportRef.current!
      // NEVER fall back to containerRef.current when isModalOpen is true!
      const target = isModalOpen ? modalViewportRef.current : containerRef.current;

      if (target) {
        const wrapper = target.querySelector('.mermaid-svg-wrapper');
        const nodes = target.querySelectorAll('.node, g.node');
        if (wrapper && nodes.length > 0) {
          clearInterval(timer);
          if (!cancelled) {
            runLiveDrawAnimation(target);
          }
          return;
        }
      }

      if (attempts > 60) {
        clearInterval(timer);
        // Timer exhausted: SVG nodes never found (e.g. diagram rendered off-screen).
        // Force-reveal the static diagram by ending the building state.
        if (!cancelled) stopAndCleanAnimation();
      }
    }, 45);

    return () => {
      cancelled = true;
      clearInterval(timer);
    };
  }, [svgHtml, isLiveDrawEnabled, isModalOpen, mounted, runLiveDrawAnimation, stopAndCleanAnimation]);

  const handleZoomIn = () => setZoom(prev => Math.min(Number((prev + ZOOM_STEP).toFixed(2)), MAX_INLINE_ZOOM));
  const handleZoomOut = () => setZoom(prev => Math.max(Number((prev - ZOOM_STEP).toFixed(2)), MIN_INLINE_ZOOM));
  const handleZoomReset = () => setZoom(0.95);

  const handleModalZoomIn = () => setModalZoom(prev => Math.min(Number((prev + 0.10).toFixed(2)), MAX_MODAL_ZOOM));
  const handleModalZoomOut = () => setModalZoom(prev => Math.max(Number((prev - 0.10).toFixed(2)), MIN_MODAL_ZOOM));
  const handleModalZoomReset = () => {
    if (modalViewportRef.current) autoFitModalChart();
    else setModalZoom(1.0);
  };

  // Auto-fit immediately when modal opens on laptop/desktop screens and keep responsive on resize
  useEffect(() => {
    if (isModalOpen) {
      const timer = setTimeout(() => {
        autoFitModalChart();
      }, 50);
      const handleResize = () => {
        // Debounce resize
        clearTimeout(resizeTimerRef.current);
        resizeTimerRef.current = setTimeout(() => {
          autoFitModalChart();
        }, 100);
      };
      window.addEventListener('resize', handleResize);
      return () => {
        clearTimeout(timer);
        clearTimeout(resizeTimerRef.current);
        window.removeEventListener('resize', handleResize);
      };
    }
  }, [isModalOpen, autoFitModalChart]);

  // Handle wheel events: Smooth zooming without hijacking natural scroll
  useEffect(() => {
    if (!mounted) return;

    if (isModalOpen) {
      // Fullscreen Modal: Trackpad pinch or Ctrl+wheel performs buttery-smooth zoom
      const handleWindowWheel = (e) => {
        if (e.ctrlKey || e.metaKey) {
          e.preventDefault();
          e.stopPropagation();

          setIsWheelZooming(true);
          clearTimeout(wheelZoomTimeoutRef.current);
          wheelZoomTimeoutRef.current = setTimeout(() => setIsWheelZooming(false), 140);

          const delta = -e.deltaY * 0.0025;
          setModalZoom((prev) => Math.max(MIN_MODAL_ZOOM, Math.min(MAX_MODAL_ZOOM, Number((prev + delta).toFixed(2)))));
        }
        // When not pinching, native scrolling/trackpad momentum operates freely
      };

      window.addEventListener('wheel', handleWindowWheel, { passive: false });
      return () => {
        window.removeEventListener('wheel', handleWindowWheel);
      };
    } else {
      // Inline View: Intercept Ctrl/Cmd + wheel only when hovering over container to zoom inline canvas
      const container = containerRef.current;
      if (!container) return;

      const handleInlineWheel = (e) => {
        if (e.ctrlKey || e.metaKey) {
          e.preventDefault();
          e.stopPropagation();

          setIsWheelZooming(true);
          clearTimeout(wheelZoomTimeoutRef.current);
          wheelZoomTimeoutRef.current = setTimeout(() => setIsWheelZooming(false), 140);

          const factor = e.deltaY < 0 ? 1.08 : 0.92;
          setZoom((prev) => Math.max(MIN_INLINE_ZOOM, Math.min(MAX_INLINE_ZOOM, Number((prev * factor).toFixed(2)))));
        }
      };

      container.addEventListener('wheel', handleInlineWheel, { passive: false });
      return () => {
        container.removeEventListener('wheel', handleInlineWheel);
      };
    }
  }, [mounted, isModalOpen]);

  // Touch handlers for 2-finger pinch-to-zoom on touchscreen laptops, tablets, and mobile devices
  const handleTouchStart = (e) => {
    if (e.touches.length === 2) {
      touchDistRef.current = Math.hypot(
        e.touches[0].clientX - e.touches[1].clientX,
        e.touches[0].clientY - e.touches[1].clientY
      );
    }
  };

  const handleTouchMove = (e) => {
    if (e.touches.length === 2 && touchDistRef.current) {
      e.preventDefault();
      const currentDist = Math.hypot(
        e.touches[0].clientX - e.touches[1].clientX,
        e.touches[0].clientY - e.touches[1].clientY
      );
      const ratio = currentDist / touchDistRef.current;
      if (ratio > 0.05 && ratio < 20) {
        setIsWheelZooming(true);
        clearTimeout(wheelZoomTimeoutRef.current);
        wheelZoomTimeoutRef.current = setTimeout(() => setIsWheelZooming(false), 140);

        if (isModalOpen) {
          setModalZoom((prev) => Math.max(MIN_MODAL_ZOOM, Math.min(MAX_MODAL_ZOOM, Number((prev * ratio).toFixed(2)))));
        } else {
          setZoom((prev) => Math.max(MIN_INLINE_ZOOM, Math.min(MAX_INLINE_ZOOM, Number((prev * ratio).toFixed(2)))));
        }
      }
      touchDistRef.current = currentDist;
    }
  };

  const handleTouchEnd = () => {
    touchDistRef.current = null;
  };

  const handleFitToScreen = () => {
    autoFitModalChart();
  };

  const handleMouseDown = (e) => {
    e.stopPropagation(); // Stop mousedown bubbling to document outside-click handler!
    if (e.button !== 0) return;
    if (e.target.closest('button') || e.target.closest('a') || e.target.closest('input')) return;
    if (!modalViewportRef.current) return;
    setIsPanning(true);
    panStartRef.current = {
      x: e.clientX,
      y: e.clientY,
      scrollLeft: modalViewportRef.current.scrollLeft,
      scrollTop: modalViewportRef.current.scrollTop
    };
  };

  // Window-level dragging listener for buttery-smooth panning without boundary clipping
  useEffect(() => {
    if (!isPanning) return;

    const handleWindowMouseMove = (e) => {
      if (!modalViewportRef.current) return;
      const dx = e.clientX - panStartRef.current.x;
      const dy = e.clientY - panStartRef.current.y;
      modalViewportRef.current.scrollLeft = panStartRef.current.scrollLeft - dx;
      modalViewportRef.current.scrollTop = panStartRef.current.scrollTop - dy;
    };

    const handleWindowMouseUp = (e) => {
      if (e) e.stopPropagation();
      setIsPanning(false);
    };

    window.addEventListener('mousemove', handleWindowMouseMove);
    window.addEventListener('mouseup', handleWindowMouseUp);
    return () => {
      window.removeEventListener('mousemove', handleWindowMouseMove);
      window.removeEventListener('mouseup', handleWindowMouseUp);
    };
  }, [isPanning]);

  const handleCopyCode = async () => {
    try {
      await navigator.clipboard.writeText(activeChartCode);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {}
  };

  const btnBaseStyle = {
    background: 'rgba(255, 255, 255, 0.06)',
    border: '1px solid rgba(255, 255, 255, 0.12)',
    color: '#94A3B8',
    borderRadius: 6,
    padding: '5px 9px',
    fontSize: 11,
    fontWeight: 600,
    cursor: 'pointer',
    display: 'inline-flex',
    alignItems: 'center',
    gap: 4,
    outline: 'none',
    lineHeight: 1,
    boxShadow: 'none',
    transition: 'all 0.15s ease'
  };

  
return {containerRef,modalViewportRef,mounted,setMounted,svgHtml,setSvgHtml,renderError,setRenderError,loading,setLoading,zoom,setZoom,modalZoom,setModalZoom,modalZoomRef,isWheelZooming,setIsWheelZooming,wheelZoomTimeoutRef,touchDistRef,resizeTimerRef,showCode,setShowCode,copied,setCopied,isKeypointsOpen,setIsKeypointsOpen,isModalOpen,setIsModalOpen,takeawaysRef,hasAnimatedRef,derivedTopicTitle,handleScrollToTakeaways,isPanning,setIsPanning,panStartRef,isLiveDrawEnabled,setIsLiveDrawEnabled,isBuilding,setIsBuilding,cursorState,setCursorState,animTimeoutsRef,animFrameRef,animCancelledRef,clearAnimTimeouts,stopAndCleanAnimation,computeFitZoom,autoFitModalChart,autoFitInlineChart,runLiveDrawAnimation,handleSkipBuild,handleReplayBuild,handleToggleLiveDraw,uniqueIdRef,activeChartCode,handleZoomIn,handleZoomOut,handleZoomReset,handleModalZoomIn,handleModalZoomOut,handleModalZoomReset,handleTouchStart,handleTouchMove,handleTouchEnd,handleFitToScreen,handleMouseDown,handleCopyCode,btnBaseStyle};
}
