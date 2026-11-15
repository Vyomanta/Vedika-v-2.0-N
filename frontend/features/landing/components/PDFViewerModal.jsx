'use client';
import * as featureStyleFunctions from '@/features/landing/styles/PDFViewerModal.ecbc08e5.styles.js';

import inlineStyles from '@/features/landing/styles/PDFViewerModal.styles';


import { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, ZoomIn, ZoomOut, RotateCw, Download, Maximize, Minimize } from 'lucide-react';
import { T } from '@/shared/design-system/theme';

const getGoogleDriveEmbedLink = (viewLink) => {
  if (!viewLink) return '';
  const fileIdMatch = viewLink.match(/\/d\/([a-zA-Z0-9-_]+)/);
  if (fileIdMatch) {
    const fileId = fileIdMatch[1];
    return `https://drive.google.com/file/d/${fileId}/preview`;
  }
  return viewLink;
};

const getGoogleDriveDirectLink = (viewLink) => {
  if (!viewLink) return '';
  const fileIdMatch = viewLink.match(/\/d\/([a-zA-Z0-9-_]+)/);
  if (fileIdMatch) {
    const fileId = fileIdMatch[1];
    return `https://drive.google.com/uc?export=download&id=${fileId}`;
  }
  return viewLink;
};

export default function PDFViewerModal({ isOpen, onClose, pdfResource }) {
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [zoom, setZoom] = useState(100);
  const [rotation, setRotation] = useState(0);
  const [isLoading, setIsLoading] = useState(true);
  
  const viewerRef = useRef(null);

  useEffect(() => {
    const handleFullscreenChange = () => {
      const isCurrentlyFullscreen = !!(
        document.fullscreenElement ||
        document.webkitFullscreenElement ||
        document.mozFullScreenElement ||
        document.msFullscreenElement
      );
      setIsFullscreen(isCurrentlyFullscreen);
    };

    document.addEventListener('fullscreenchange', handleFullscreenChange);
    return () => {
      document.removeEventListener('fullscreenchange', handleFullscreenChange);
    };
  }, []);

  if (!isOpen || !pdfResource) return null;

  const embedUrl = getGoogleDriveEmbedLink(pdfResource.file_link);

  const toggleFullscreen = () => {
    if (!isFullscreen) {
      if (viewerRef.current?.requestFullscreen) {
        viewerRef.current.requestFullscreen();
      }
    } else {
      if (document.exitFullscreen) {
        document.exitFullscreen();
      }
    }
  };

  const handleDownload = () => {
    const dlLink = getGoogleDriveDirectLink(pdfResource.file_link);
    window.open(dlLink, '_blank');
  };

  return (
    <AnimatePresence>
      <div 
        ref={viewerRef}
        style={featureStyleFunctions.s0({T})}
      >
        {/* Header Bar */}
        <div style={featureStyleFunctions.s1({T})}>
          <div>
            <h2 style={featureStyleFunctions.s2({T})}>{pdfResource.name}</h2>
            <p style={featureStyleFunctions.s3({T})}>
              {pdfResource.category} · {pdfResource.subcategory}
            </p>
          </div>

          <div style={inlineStyles.s0}>
            {/* Zoom Controls */}
            <div style={featureStyleFunctions.s4({T})}>
              <button 
                onClick={() => setZoom(z => Math.max(z - 25, 50))} 
                style={inlineStyles.s1}
              >
                <ZoomOut size={16} />
              </button>
              <span style={inlineStyles.s2}>{zoom}%</span>
              <button 
                onClick={() => setZoom(z => Math.min(z + 25, 200))} 
                style={inlineStyles.s3}
              >
                <ZoomIn size={16} />
              </button>
            </div>

            {/* Rotation Control */}
            <button 
              onClick={() => setRotation(r => (r + 90) % 360)} 
              title="Rotate 90°"
              style={featureStyleFunctions.s5({T})}
            >
              <RotateCw size={16} />
            </button>

            {/* Download Button */}
            <button 
              onClick={handleDownload} 
              title="Download PDF"
              style={featureStyleFunctions.s6({T})}
            >
              <Download size={16} />
            </button>

            {/* Fullscreen Button */}
            <button 
              onClick={toggleFullscreen} 
              title="Toggle Fullscreen"
              style={featureStyleFunctions.s7({T})}
            >
              {isFullscreen ? <Minimize size={16} /> : <Maximize size={16} />}
            </button>

            {/* Close Button */}
            <button 
              onClick={onClose} 
              title="Close Viewer"
              style={featureStyleFunctions.s8({T})}
            >
              <X size={18} />
            </button>
          </div>
        </div>

        {/* Content Viewer */}
        <div style={inlineStyles.s4}>
          {isLoading && (
            <div style={inlineStyles.s5}>
              <div style={featureStyleFunctions.s9({T})} />
              <div style={featureStyleFunctions.s10({T})}>Loading preview...</div>
            </div>
          )}

          <iframe 
            src={embedUrl}
            onLoad={() => setIsLoading(false)}
            style={featureStyleFunctions.s11({zoom,rotation})}
            allow="autoplay; clipboard-write; encrypted-media; fullscreen"
          />
        </div>
      </div>
    </AnimatePresence>
  );
}
