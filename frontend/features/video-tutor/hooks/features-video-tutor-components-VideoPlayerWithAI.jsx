'use client';

import inlineStyles from '@/features/video-tutor/styles/VideoPlayerWithAI.styles';
import { useEffect, useRef, useState, useCallback } from 'react';
import { Play, Pause, RotateCcw, RotateCw, Bot } from 'lucide-react';
import { T } from '@/shared/design-system/theme';
import { useMediaQuery, isMobileMQ } from '@/lib/useMediaQuery';
import {formatTime} from '@/features/video-tutor/components/features-video-tutor-components-VideoPlayerWithAI.support.jsx';

export function useVideoPlayerWithAIModel({
  videoId,
  onExplainRequested,
  onTimeUpdate,
  seekTime,
  onSeekComplete,
  forcePause
}) {

  const isMobile = useMediaQuery(isMobileMQ);
  const activeVideoId = videoId || 'rfscVS0vtbw';
  const containerRef = useRef(null);
  const playerRef = useRef(null);
  const html5VideoRef = useRef(null);
  const intervalRef = useRef(null);
  const progressBarRef = useRef(null);
  const isDraggingRef = useRef(false);

  const [useHtml5Fallback, setUseHtml5Fallback] = useState(false);
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [scrubTime, setScrubTime] = useState(null);
  const [duration, setDuration] = useState(0);
  const [isApiReady, setIsApiReady] = useState(false);
  const [isHoveringBar, setIsHoveringBar] = useState(false);
  const [hoverTime, setHoverTime] = useState(null);
  const [hoverX, setHoverX] = useState(0);

  const onTimeUpdateRef = useRef(onTimeUpdate);
  useEffect(() => {
    onTimeUpdateRef.current = onTimeUpdate;
  }, [onTimeUpdate]);

  // 1. Load YouTube Iframe API once
  useEffect(() => {
    if (typeof window === 'undefined') return;

    if (window.YT && window.YT.Player) {
      setIsApiReady(true);
      return;
    }

    const existingScript = document.getElementById('youtube-iframe-api');
    if (!existingScript) {
      const tag = document.createElement('script');
      tag.id = 'youtube-iframe-api';
      tag.src = 'https://www.youtube.com/iframe_api';
      const firstScriptTag = document.getElementsByTagName('script')[0];
      firstScriptTag?.parentNode?.insertBefore(tag, firstScriptTag);
    }

    const prevCallback = window.onYouTubeIframeAPIReady;
    window.onYouTubeIframeAPIReady = () => {
      if (prevCallback) prevCallback();
      setIsApiReady(true);
    };
  }, []);

  // 2. Initialize YT.Player
  useEffect(() => {
    if (useHtml5Fallback || !isApiReady || !activeVideoId || !containerRef.current) return;

    if (playerRef.current && typeof playerRef.current.destroy === 'function') {
      try {
        playerRef.current.destroy();
      } catch (e) {}
      playerRef.current = null;
    }

    const elementId = `yt-player-${activeVideoId.replace(/[^a-zA-Z0-9_-]/g, '')}`;
    let playerEl = document.getElementById(elementId);
    if (!playerEl) {
      playerEl = document.createElement('div');
      playerEl.id = elementId;
      containerRef.current.innerHTML = '';
      containerRef.current.appendChild(playerEl);
    }

    const isLocal = typeof window !== 'undefined' && (window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1');

    try {
      playerRef.current = new window.YT.Player(elementId, {
        videoId: activeVideoId,
        width: '100%',
        height: '100%',
        playerVars: {
          autoplay: 0,
          controls: 1,
          disablekb: 0,
          modestbranding: 1,
          rel: 0,
          showinfo: 0,
          iv_load_policy: 3,
          playsinline: 1,
          enablejsapi: 1,
          fs: 1,
        },
        events: {
          onError: (event) => {
            console.warn('YouTube Player error code:', event?.data);
            if (event?.data === 101 || event?.data === 150) {
              setUseHtml5Fallback(true);
            }
          },
          onReady: (event) => {
            const dur = event.target.getDuration();
            if (dur) setDuration(dur);
          },
          onStateChange: (event) => {
            // YT.PlayerState: PLAYING = 1, PAUSED = 2
            if (event.data === 1) {
              setIsPlaying(true);
              if (onTimeUpdateRef.current) onTimeUpdateRef.current(event.target.getCurrentTime() || 0, false);
            } else if (event.data === 2) {
              setIsPlaying(false);
              const pausedSecs = event.target.getCurrentTime() || 0;
              setCurrentTime(pausedSecs);
              if (onTimeUpdateRef.current) onTimeUpdateRef.current(pausedSecs, true);
            } else {
              setIsPlaying(false);
            }
          }
        }
      });
    } catch (err) {
      console.error('Failed to init YT.Player:', err);
      setUseHtml5Fallback(true);
    }

    if (intervalRef.current) clearInterval(intervalRef.current);
    intervalRef.current = setInterval(() => {
      if (isDraggingRef.current) return; // Don't overwrite during live scrub drag
      if (playerRef.current && typeof playerRef.current.getCurrentTime === 'function') {
        try {
          const time = playerRef.current.getCurrentTime();
          if (typeof time === 'number') {
            setCurrentTime(time);
            const state = typeof playerRef.current.getPlayerState === 'function' ? playerRef.current.getPlayerState() : -1;
            const isPaused = state === 2;
            if (onTimeUpdateRef.current) onTimeUpdateRef.current(time, isPaused);
          }
          const dur = playerRef.current.getDuration();
          if (typeof dur === 'number' && dur > 0) {
            setDuration(dur);
          }
        } catch (e) {}
      }
    }, 250);

    return () => {
      if (intervalRef.current) clearInterval(intervalRef.current);
      if (playerRef.current && typeof playerRef.current.destroy === 'function') {
        try {
          playerRef.current.destroy();
        } catch (e) {}
      }
    };
  }, [isApiReady, activeVideoId, useHtml5Fallback]);

  const postToYtIframe = useCallback((command, args = []) => {
    try {
      const iframes = document.querySelectorAll('iframe[src*="youtube"]');
      iframes.forEach(iframe => {
        if (iframe && iframe.contentWindow) {
          iframe.contentWindow.postMessage(JSON.stringify({
            event: 'command',
            func: command,
            args
          }), '*');
        }
      });
    } catch (e) {}
  }, []);

  // Handle external seek requests
  useEffect(() => {
    if (seekTime !== undefined && seekTime !== null) {
      if (useHtml5Fallback && html5VideoRef.current) {
        html5VideoRef.current.currentTime = seekTime;
        setCurrentTime(seekTime);
      } else if (playerRef.current && typeof playerRef.current.seekTo === 'function') {
        try {
          playerRef.current.seekTo(seekTime, true);
          setCurrentTime(seekTime);
        } catch (err) {
          postToYtIframe('seekTo', [seekTime, true]);
          setCurrentTime(seekTime);
        }
      } else {
        postToYtIframe('seekTo', [seekTime, true]);
        setCurrentTime(seekTime);
      }
      if (onSeekComplete) onSeekComplete();
    }
  }, [seekTime, onSeekComplete, useHtml5Fallback, postToYtIframe]);

  // Handle external forcePause requests
  useEffect(() => {
    if (forcePause) {
      if (useHtml5Fallback && html5VideoRef.current) {
        html5VideoRef.current.pause();
        setIsPlaying(false);
      } else if (playerRef.current && typeof playerRef.current.pauseVideo === 'function') {
        try {
          playerRef.current.pauseVideo();
          setIsPlaying(false);
        } catch (e) {
          postToYtIframe('pauseVideo');
          setIsPlaying(false);
        }
      } else {
        postToYtIframe('pauseVideo');
        setIsPlaying(false);
      }
    }
  }, [forcePause, useHtml5Fallback, postToYtIframe]);

  const handleTogglePlay = useCallback(() => {
    if (useHtml5Fallback && html5VideoRef.current) {
      if (isPlaying) {
        html5VideoRef.current.pause();
        setIsPlaying(false);
      } else {
        html5VideoRef.current.play();
        setIsPlaying(true);
      }
      return;
    }
    if (!playerRef.current || typeof playerRef.current.playVideo !== 'function') {
      postToYtIframe(isPlaying ? 'pauseVideo' : 'playVideo');
      setIsPlaying(!isPlaying);
      return;
    }
    try {
      if (isPlaying) {
        playerRef.current.pauseVideo();
        setIsPlaying(false);
      } else {
        playerRef.current.playVideo();
        setIsPlaying(true);
      }
    } catch (e) {
      postToYtIframe(isPlaying ? 'pauseVideo' : 'playVideo');
      setIsPlaying(!isPlaying);
    }
  }, [isPlaying, useHtml5Fallback, postToYtIframe]);

  const handleSeekDelta = useCallback((delta) => {
    if (useHtml5Fallback && html5VideoRef.current) {
      const current = html5VideoRef.current.currentTime || currentTime;
      const target = Math.max(0, Math.min(duration || Infinity, current + delta));
      html5VideoRef.current.currentTime = target;
      setCurrentTime(target);
      return;
    }
    const current = (playerRef.current && typeof playerRef.current.getCurrentTime === 'function')
      ? (playerRef.current.getCurrentTime() || currentTime)
      : currentTime;
    const target = Math.max(0, Math.min(duration || Infinity, current + delta));
    if (playerRef.current && typeof playerRef.current.seekTo === 'function') {
      try {
        playerRef.current.seekTo(target, true);
        setCurrentTime(target);
      } catch (e) {
        postToYtIframe('seekTo', [target, true]);
        setCurrentTime(target);
      }
    } else {
      postToYtIframe('seekTo', [target, true]);
      setCurrentTime(target);
    }
  }, [currentTime, duration, useHtml5Fallback, postToYtIframe]);

  // Helper to compute time from progress bar coordinate
  const getTimeFromEvent = useCallback((e) => {
    if (!progressBarRef.current || !duration) return 0;
    const rect = progressBarRef.current.getBoundingClientRect();
    const clientX = e.touches ? e.touches[0].clientX : e.clientX;
    const clickX = Math.max(0, Math.min(rect.width, clientX - rect.left));
    const ratio = clickX / rect.width;
    return ratio * duration;
  }, [duration]);

  // Smooth Scrubber Dragging System
  const handleScrubberStart = useCallback((e) => {
    e.preventDefault();
    if (!progressBarRef.current || !duration) return;
    isDraggingRef.current = true;
    const newTime = getTimeFromEvent(e);
    setScrubTime(newTime);

    const handleGlobalMove = (moveEvent) => {
      if (!isDraggingRef.current) return;
      const t = getTimeFromEvent(moveEvent);
      setScrubTime(t);
      if (progressBarRef.current) {
        const rect = progressBarRef.current.getBoundingClientRect();
        const clientX = moveEvent.touches ? moveEvent.touches[0].clientX : moveEvent.clientX;
        const pos = Math.max(0, Math.min(rect.width, clientX - rect.left));
        setHoverX(pos);
        setHoverTime(t);
      }
    };

    const handleGlobalEnd = (endEvent) => {
      if (!isDraggingRef.current) return;
      isDraggingRef.current = false;
      const finalTime = getTimeFromEvent(endEvent);
      setScrubTime(null);
      setCurrentTime(finalTime);
      if (useHtml5Fallback && html5VideoRef.current) {
        html5VideoRef.current.currentTime = finalTime;
      } else if (playerRef.current && typeof playerRef.current.seekTo === 'function') {
        try {
          playerRef.current.seekTo(finalTime, true);
        } catch (e) {
          postToYtIframe('seekTo', [finalTime, true]);
        }
      } else {
        postToYtIframe('seekTo', [finalTime, true]);
      }
      window.removeEventListener('mousemove', handleGlobalMove);
      window.removeEventListener('mouseup', handleGlobalEnd);
      window.removeEventListener('touchmove', handleGlobalMove);
      window.removeEventListener('touchend', handleGlobalEnd);
    };

    window.addEventListener('mousemove', handleGlobalMove);
    window.addEventListener('mouseup', handleGlobalEnd);
    window.addEventListener('touchmove', handleGlobalMove);
    window.addEventListener('touchend', handleGlobalEnd);
  }, [duration, getTimeFromEvent, useHtml5Fallback, postToYtIframe]);

  const handleScrubberMouseMove = useCallback((e) => {
    if (!progressBarRef.current || !duration) return;
    const rect = progressBarRef.current.getBoundingClientRect();
    const pos = Math.max(0, Math.min(rect.width, e.clientX - rect.left));
    setHoverX(pos);
    setHoverTime((pos / rect.width) * duration);
  }, [duration]);

  const activeDisplayTime = scrubTime !== null ? scrubTime : currentTime;
  const progressPercent = duration > 0 ? (activeDisplayTime / duration) * 100 : 0;
  const isInteractingWithBar = isHoveringBar || isDraggingRef.current;

  
return {isMobile,activeVideoId,containerRef,playerRef,html5VideoRef,intervalRef,progressBarRef,isDraggingRef,useHtml5Fallback,setUseHtml5Fallback,isPlaying,setIsPlaying,currentTime,setCurrentTime,scrubTime,setScrubTime,duration,setDuration,isApiReady,setIsApiReady,isHoveringBar,setIsHoveringBar,hoverTime,setHoverTime,hoverX,setHoverX,onTimeUpdateRef,postToYtIframe,handleTogglePlay,handleSeekDelta,getTimeFromEvent,handleScrubberStart,handleScrubberMouseMove,activeDisplayTime,progressPercent,isInteractingWithBar};
}
