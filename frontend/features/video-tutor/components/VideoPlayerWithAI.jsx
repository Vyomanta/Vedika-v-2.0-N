'use client';
import * as featureStyleFunctions from '@/features/video-tutor/styles/VideoPlayerWithAI.c023961b.styles.js';

import inlineStyles from '@/features/video-tutor/styles/VideoPlayerWithAI.styles';
import { useEffect, useRef, useState, useCallback } from 'react';
import { Play, Pause, RotateCcw, RotateCw, Bot } from 'lucide-react';
import { T } from '@/shared/design-system/theme';
import { useMediaQuery, isMobileMQ } from '@/lib/useMediaQuery';
import {formatTime} from '@/features/video-tutor/components/features-video-tutor-components-VideoPlayerWithAI.support.jsx';
import {useVideoPlayerWithAIModel} from '@/features/video-tutor/hooks/features-video-tutor-components-VideoPlayerWithAI.jsx';
export default function VideoPlayerWithAI({
  videoId,
  onExplainRequested,
  onTimeUpdate,
  seekTime,
  onSeekComplete,
  forcePause
}) {
const {isMobile,activeVideoId,containerRef,playerRef,html5VideoRef,intervalRef,progressBarRef,isDraggingRef,useHtml5Fallback,setUseHtml5Fallback,isPlaying,setIsPlaying,currentTime,setCurrentTime,scrubTime,setScrubTime,duration,setDuration,isApiReady,setIsApiReady,isHoveringBar,setIsHoveringBar,hoverTime,setHoverTime,hoverX,setHoverX,onTimeUpdateRef,postToYtIframe,handleTogglePlay,handleSeekDelta,getTimeFromEvent,handleScrubberStart,handleScrubberMouseMove,activeDisplayTime,progressPercent,isInteractingWithBar}=useVideoPlayerWithAIModel({videoId,onExplainRequested,onTimeUpdate,seekTime,onSeekComplete,forcePause});
return (
    <div style={inlineStyles.s0}>
      {/* Video Canvas Frame with YouTube Header & Watermark Clipping */}
      <div style={inlineStyles.s1}>
        <div style={inlineStyles.s2}>
          {/* Native YouTube Player Mount */}
          {!useHtml5Fallback && (
            <div style={inlineStyles.s3}>
              <div
                ref={containerRef}
                style={inlineStyles.s4}
              />
            </div>
          )}

          {/* Fallback iframe */}
          {!useHtml5Fallback && !isApiReady && (
            <iframe
              src={`https://www.youtube-nocookie.com/embed/${activeVideoId}?enablejsapi=1&controls=1&modestbranding=1&rel=0`}
              title="Course Video"
              style={inlineStyles.s5}
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
              referrerPolicy="strict-origin-when-cross-origin"
              allowFullScreen
            />
          )}

          {/* Direct HTML5 Video Player Fallback (guaranteed playback in all environments) */}
          {useHtml5Fallback && (
            <video
              ref={html5VideoRef}
              src="https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/BigBuckBunny.mp4"
              style={inlineStyles.s6}
              playsInline
              controls
              onTimeUpdate={() => {
                if (html5VideoRef.current) {
                  const t = html5VideoRef.current.currentTime;
                  setCurrentTime(t);
                  if (onTimeUpdateRef.current) onTimeUpdateRef.current(t, html5VideoRef.current.paused);
                }
              }}
              onLoadedMetadata={() => {
                if (html5VideoRef.current) {
                  setDuration(html5VideoRef.current.duration);
                }
              }}
              onPlay={() => setIsPlaying(true)}
              onPause={() => setIsPlaying(false)}
            />
          )}
        </div>
      </div>

      {/* Ultra-Smooth Video Scrubber Progress Bar */}
      <div
        ref={progressBarRef}
        onMouseDown={handleScrubberStart}
        onTouchStart={handleScrubberStart}
        onMouseMove={handleScrubberMouseMove}
        onMouseEnter={() => setIsHoveringBar(true)}
        onMouseLeave={() => {
          setIsHoveringBar(false);
          setHoverTime(null);
        }}
        style={featureStyleFunctions.s0({isInteractingWithBar})}
      >
        {/* Played Progress Track */}
        <div style={featureStyleFunctions.s1({progressPercent})}>
          {/* Scrubber Knob */}
          <div style={featureStyleFunctions.s2({isInteractingWithBar,isDraggingRef})} />
        </div>

        {/* Hover Time Tooltip */}
        {hoverTime !== null && (
          <div style={featureStyleFunctions.s3({hoverX})}>
            {formatTime(hoverTime)}
          </div>
        )}
      </div>

      {/* Ultra-Sleek Minimalist Video Control Bar */}
      <div style={featureStyleFunctions.s4({isMobile})}>
        {/* Left Controls: Play/Pause, -5s, +5s, Digital Clock */}
        <div style={featureStyleFunctions.s5({isMobile})}>
          {/* Play/Pause Button */}
          <button
            type="button"
            onClick={handleTogglePlay}
            style={featureStyleFunctions.s6({isMobile,isPlaying})}
            title={isPlaying ? 'Pause video' : 'Play video'}
          >
            {isPlaying ? (
              <Pause size={isMobile ? 13 : 15} style={inlineStyles.s7} />
            ) : (
              <Play size={isMobile ? 13 : 15} style={inlineStyles.s8} />
            )}
          </button>

          {/* Quick Skip -5s (Desktop only) */}
          {!isMobile && (
            <button
              type="button"
              onClick={() => handleSeekDelta(-5)}
              style={featureStyleFunctions.s7({isMobile})}
              onMouseEnter={(e) => {
                e.currentTarget.style.color = '#FFFFFF';
                e.currentTarget.style.background = 'rgba(255, 255, 255, 0.06)';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.color = '#94A3B8';
                e.currentTarget.style.background = 'transparent';
              }}
              title="Rewind 5 seconds"
            >
              <RotateCcw size={isMobile ? 12 : 14} />
              <span style={inlineStyles.s9}>-5s</span>
            </button>
          )}

          {/* Quick Skip +5s (Desktop only) */}
          {!isMobile && (
            <button
              type="button"
              onClick={() => handleSeekDelta(5)}
              style={featureStyleFunctions.s8({isMobile})}
              onMouseEnter={(e) => {
                e.currentTarget.style.color = '#FFFFFF';
                e.currentTarget.style.background = 'rgba(255, 255, 255, 0.06)';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.color = '#94A3B8';
                e.currentTarget.style.background = 'transparent';
              }}
              title="Forward 5 seconds"
            >
              <RotateCw size={isMobile ? 12 : 14} />
              <span style={inlineStyles.s10}>+5s</span>
            </button>
          )}

          {/* Digital Clock Time Counter */}
          <div style={featureStyleFunctions.s9({isMobile})}>
            <span style={inlineStyles.s11}>{formatTime(activeDisplayTime)}</span>
            {duration > 0 && (
              <>
                <span style={inlineStyles.s12}>/</span>
                <span style={inlineStyles.s13}>{formatTime(duration)}</span>
              </>
            )}
          </div>

          {/* Stream Switcher */}
          <button
            type="button"
            onClick={() => {
              setUseHtml5Fallback(prev => !prev);
              setIsPlaying(false);
            }}
            style={featureStyleFunctions.s10({isMobile,useHtml5Fallback})}
            title={useHtml5Fallback ? "Using direct HTML5 video stream. Click to switch to YouTube" : "Click to switch to direct HTML5 video stream"}
          >
            <span>{useHtml5Fallback ? (isMobile ? '🎥 HTML5' : '🎥 HTML5 Video') : (isMobile ? '📺 YT' : '📺 YouTube')}</span>
          </button>
        </div>

        {/* Right Side: Elegant "Ask Vedika at MM:SS" Action Button */}
        <button
          type="button"
          onClick={() => {
            if (playerRef.current && isPlaying) {
              playerRef.current.pauseVideo();
              setIsPlaying(false);
            }
            if (onExplainRequested) onExplainRequested(activeDisplayTime);
          }}
          style={featureStyleFunctions.s11({isMobile})}
          onMouseEnter={(e) => {
            e.currentTarget.style.background = 'linear-gradient(135deg, rgba(245, 158, 11, 0.28), rgba(217, 119, 6, 0.35))';
            e.currentTarget.style.borderColor = 'rgba(245, 158, 11, 0.65)';
            e.currentTarget.style.boxShadow = '0 2px 14px rgba(245, 158, 11, 0.25)';
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.background = 'linear-gradient(135deg, rgba(245, 158, 11, 0.18), rgba(217, 119, 6, 0.22))';
            e.currentTarget.style.borderColor = 'rgba(245, 158, 11, 0.45)';
            e.currentTarget.style.boxShadow = '0 2px 10px rgba(245, 158, 11, 0.12)';
          }}
        >
          <Bot size={isMobile ? 13 : 14} style={inlineStyles.s14} />
          <span>{isMobile ? `Ask (${formatTime(activeDisplayTime)})` : `Ask Vedika at ${formatTime(activeDisplayTime)}`}</span>
        </button>
      </div>
    </div>
  );

}
