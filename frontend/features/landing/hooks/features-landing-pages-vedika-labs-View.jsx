'use client';

import inlineStyles from '@/features/landing/styles/vedika-labs-page.jsx.styles.js';
import { useReducer, useState, useRef, useEffect, useCallback, memo } from 'react';
import { useRouter } from 'next/navigation';
import {
  ArrowLeft,
  ArrowRight,
  Compass,
  Layers,
  FlaskConical,
  Atom,
  ChevronDown,
  Sparkles,
  Award,
  HelpCircle,
  Bot
} from 'lucide-react';
import VedikaParticleBot from '@/components/VedikaParticleBot';
import { useMediaQuery, isMobileMQ, isTabletMQ } from '@/lib/useMediaQuery';
import { LabThematicArt } from '@/app/vedika-labs/LabCardArt';
import '@/app/vedika-labs/vedika-labs.css';
import {VEDIKA_HUB_FEATURES,BookOpenIcon,LABS_DATA,FIXED_SLOTS,METRICS_BAR,initialState,vedikaLabsReducer,DesktopHologramCard,DesktopMetricsBanner,MobileHologramCard,MobileMetricsBanner} from '@/features/landing/components/features-landing-pages-vedika-labs-View.support.jsx';

export function useVedikaLabsHubModel() {

  const router = useRouter();
  const isMobile = useMediaQuery(isMobileMQ);
  const isTablet = useMediaQuery(isTabletMQ);
  const [state, dispatch] = useReducer(vedikaLabsReducer, initialState);
  const { activeIdx, isNavigating } = state;
  const activeLab = LABS_DATA[activeIdx] || LABS_DATA[0];

  const [isFeaturesDropdownOpen, setIsFeaturesDropdownOpen] = useState(false);
  const featureDropdownRef = useRef(null);
  const touchStartRef = useRef(null);

  // Close dropdown on outside click or touch
  useEffect(() => {
    const handleOutside = (e) => {
      if (featureDropdownRef.current && !featureDropdownRef.current.contains(e.target)) {
        setIsFeaturesDropdownOpen(false);
      }
    };
    document.addEventListener('mousedown', handleOutside);
    document.addEventListener('touchstart', handleOutside);
    return () => {
      document.removeEventListener('mousedown', handleOutside);
      document.removeEventListener('touchstart', handleOutside);
    };
  }, []);

  // Preload mascot assets
  useEffect(() => {
    if (typeof window !== 'undefined') {
      [
        '/vedika-bot-math.png?v=3',
        '/vedika-bot-physics.png?v=3',
        '/vedika-bot-chemistry.png?v=3',
        '/vedika-bot-biology.png?v=3'
      ].forEach((path) => {
        const img = new Image();
        img.src = path;
        if (img.decode) {
          img.decode().catch(() => {});
        }
      });
    }
    LABS_DATA.forEach((lab) => {
      if (router?.prefetch) {
        try {
          router.prefetch(lab.url);
        } catch (e) {}
      }
    });
  }, [router]);

  const handlePrev = useCallback(() => {
    dispatch({ type: 'PREV_LAB', payload: LABS_DATA.length });
  }, []);

  const handleNext = useCallback(() => {
    dispatch({ type: 'NEXT_LAB', payload: LABS_DATA.length });
  }, []);

  const handleSelectLab = useCallback((idx) => {
    dispatch({ type: 'SET_ACTIVE_LAB', payload: idx });
  }, []);

  const handleLaunchLab = useCallback((url) => {
    if (isNavigating) return;
    dispatch({ type: 'START_NAVIGATE' });
    setTimeout(() => {
      router.push(url);
    }, 240);
  }, [isNavigating, router]);

  // Mobile Touch Swipe Handling
  const handleTouchStart = (e) => {
    if (e.touches && e.touches[0]) {
      touchStartRef.current = e.touches[0].clientX;
    }
  };

  const handleTouchEnd = (e) => {
    if (touchStartRef.current === null) return;
    if (e.changedTouches && e.changedTouches[0]) {
      const diff = touchStartRef.current - e.changedTouches[0].clientX;
      if (diff > 40) {
        handleNext();
      } else if (diff < -40) {
        handlePrev();
      }
    }
    touchStartRef.current = null;
  };

  // Keyboard navigation (ArrowLeft / ArrowRight)
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === 'ArrowRight') handleNext();
      else if (e.key === 'ArrowLeft') handlePrev();
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [handleNext, handlePrev]);

  
return {router,isMobile,isTablet,state,dispatch,activeIdx,isNavigating,activeLab,isFeaturesDropdownOpen,setIsFeaturesDropdownOpen,featureDropdownRef,touchStartRef,handlePrev,handleNext,handleSelectLab,handleLaunchLab,handleTouchStart,handleTouchEnd};
}
