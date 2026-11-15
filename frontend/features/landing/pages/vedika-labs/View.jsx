'use client';
import * as featureStyleFunctions from '@/features/landing/styles/View.8a09d3d6.styles.js';

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
import {useVedikaLabsHubModel} from '@/features/landing/hooks/features-landing-pages-vedika-labs-View.jsx';
export default function VedikaLabsHub() {
const {router,isMobile,isTablet,state,dispatch,activeIdx,isNavigating,activeLab,isFeaturesDropdownOpen,setIsFeaturesDropdownOpen,featureDropdownRef,touchStartRef,handlePrev,handleNext,handleSelectLab,handleLaunchLab,handleTouchStart,handleTouchEnd}=useVedikaLabsHubModel();
return (
    <div
      className="vedika-labs-cinema-view"
      style={featureStyleFunctions.s0({activeLab})}
    >
      {/* Sci-Fi Laboratory Scene Backdrop */}
      <div className="vedika-labs-scene-backdrop" />
      <div className="vedika-labs-scene-overlay" />

      {/* Top Transition Progress Bar */}
      {isNavigating && <div className="vedika-labs-top-progress" />}

      {/* Floating Back Button to Dashboard */}
      <button
        type="button"
        onClick={() => router.push('/')}
        style={featureStyleFunctions.s1({isMobile,activeLab})}
        onMouseEnter={(e) => {
          e.currentTarget.style.borderColor = activeLab.color;
          e.currentTarget.style.background = `${activeLab.color}22`;
        }}
        onMouseLeave={(e) => {
          e.currentTarget.style.borderColor = `${activeLab.color}55`;
          e.currentTarget.style.background = 'rgba(11, 15, 25, 0.78)';
        }}
        title="Back to Dashboard"
      >
        <ArrowLeft size={14} color={activeLab.color} />
        <span>Back</span>
      </button>

      {/* ── CONDITIONAL RENDER: DESKTOP/LAPTOP VS MOBILE ── */}
      {!isMobile ? (
        /* ══════════════════════════════════════════════════════════════════
           ORIGINAL DESKTOP & LAPTOP CINEMA VIEW
           Curved 4-Wing Hologram Stage, Ceiling Emitter, 345px Bot, CTA
           ══════════════════════════════════════════════════════════════════ */
        <div className="vedika-labs-main-grid">
          {/* 3D Stage Viewport */}
          <div className="vedika-labs-stage-viewport">
            {/* Top Ceiling Energy Emitter Beam */}
            <div className="vedika-labs-ceiling-emitter">
              <div className="emitter-ring emitter-ring-outer" />
              <div className="emitter-ring emitter-ring-inner" />
              <div className="emitter-beam-cone" />
            </div>

            {/* Holographic Cards: Semi-Spherical Curvature Wing Formation */}
            <div className="vedika-labs-carousel-stage">
              <div className="cards-bounded-viewport">
                <div className="cards-curved-guide-track" />

                <div className="cards-stage-track">
                  {LABS_DATA.map((lab, idx) => (
                    <DesktopHologramCard
                      key={lab.id}
                      lab={lab}
                      idx={idx}
                      isSelected={idx === activeIdx}
                      slot={FIXED_SLOTS[idx]}
                      slotScale={isTablet ? 0.68 : 1}
                      onSelect={handleSelectLab}
                      onLaunch={handleLaunchLab}
                    />
                  ))}
                </div>
              </div>
            </div>

            {/* FOREGROUND BOT CHARACTER */}
            <div className="vedika-labs-pedestal-stage" style={inlineStyles.s4}>
              <div className="vedika-labs-bot-foreground" style={inlineStyles.s5}>
                <div className="bot-pedestal-shadow" style={inlineStyles.s6} />
                <div style={inlineStyles.s7}>
                  <VedikaParticleBot
                    src={activeLab.botImage || '/vedika-bot-physics.png?v=3'}
                    width={345}
                    height={345}
                    inline={true}
                    colorMode="vibrant"
                    intensity={activeLab.id === 'physics' || activeLab.id === 'chemistry' ? 1.65 : 1.0}
                  />
                </div>
              </div>
            </div>
          </div>

          {/* Centered Primary CTA Launch Button */}
          <div className="vedika-labs-center-cta-wrap">
            <button
              type="button"
              className="vedika-labs-explore-cta-btn"
              onClick={() => handleLaunchLab(activeLab.url)}
            >
              <span>Enter {activeLab.title}</span>
              <ArrowRight size={18} className="cta-arrow" />
            </button>
          </div>

          {/* Bottom Floating Metrics Banner */}
          <DesktopMetricsBanner />
        </div>
      ) : (
        /* ══════════════════════════════════════════════════════════════════
           NEAT ZERO-SCROLL MOBILE VIEW
           Compact bot, touch swipe carousel, compact metrics
           ══════════════════════════════════════════════════════════════════ */
        <div className="vedika-labs-mobile-grid">
          {/* 1. Header Section */}
          <div className="vedika-labs-header-section">
            <span className="vedika-labs-explore-badge">EXPLORE</span>
            <h1 className="vedika-labs-main-title">
              Vedika <span style={featureStyleFunctions.s2({activeLab})}>Labs</span>
            </h1>
            <p className="vedika-labs-main-subtitle">
              Interactive science labs to learn, experiment and discover.
            </p>

            {/* Integrated 5-Feature Options Dropdown */}
            <div ref={featureDropdownRef} style={inlineStyles.s8}>
              <button
                type="button"
                onClick={() => setIsFeaturesDropdownOpen(prev => !prev)}
                style={featureStyleFunctions.s3({isFeaturesDropdownOpen,activeLab})}
              >
                <Sparkles size={13} color={activeLab.color} />
                <span>Explore Lab Features (5 Options)</span>
                <ChevronDown
                  size={13}
                  color={activeLab.color}
                  style={featureStyleFunctions.s4({isFeaturesDropdownOpen})}
                />
              </button>

              {isFeaturesDropdownOpen && (
                <div style={featureStyleFunctions.s5({activeLab})}>
                  <div style={inlineStyles.s9}>
                    <span>Integrated Lab Features</span>
                    <span style={featureStyleFunctions.s6({activeLab})}>Tap to open</span>
                  </div>
                  <div style={inlineStyles.s10}>
                    {VEDIKA_HUB_FEATURES.map((feat) => {
                      const FeatIcon = feat.icon;
                      return (
                        <button
                          key={feat.id}
                          onClick={() => {
                            setIsFeaturesDropdownOpen(false);
                            handleLaunchLab(`${activeLab.url}?tab=${feat.id}`);
                          }}
                          style={inlineStyles.s11}
                        >
                          <div style={featureStyleFunctions.s7({activeLab})}>
                            <FeatIcon size={15} />
                          </div>
                          <div style={inlineStyles.s12}>
                            <div style={inlineStyles.s13}>
                              <span>{feat.label}</span>
                              <span style={featureStyleFunctions.s8({activeLab})}>
                                {feat.badge}
                              </span>
                            </div>
                            <div style={inlineStyles.s14}>
                              {feat.desc}
                            </div>
                          </div>
                        </button>
                      );
                    })}
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* 2. Bot Stage */}
          <div className="vedika-labs-bot-stage">
            <div className="vedika-labs-bot-glow-aura mobile-aura" />
            <div className="bot-canvas-wrap">
              <VedikaParticleBot
                src={activeLab.botImage || '/vedika-bot-physics.png?v=3'}
                width={260}
                height={195}
                inline={true}
                colorMode="vibrant"
                themeRgb={activeLab.colorRgb}
                intensity={1.25}
                particleStep={2}
              />
            </div>
          </div>

          {/* 3. Cards Carousel */}
          <div
            className="vedika-labs-carousel-container"
            onTouchStart={handleTouchStart}
            onTouchEnd={handleTouchEnd}
          >
            <div className="vedika-labs-carousel-track">
              {LABS_DATA.map((lab, idx) => (
                <MobileHologramCard
                  key={lab.id}
                  lab={lab}
                  idx={idx}
                  activeIdx={activeIdx}
                  onSelect={handleSelectLab}
                  onLaunch={handleLaunchLab}
                />
              ))}
            </div>

            {/* Pagination Dots */}
            <div className="carousel-dots-row">
              {LABS_DATA.map((lab, idx) => (
                <button
                  key={lab.id}
                  type="button"
                  className={`carousel-dot ${idx === activeIdx ? 'active-dot' : ''}`}
                  onClick={() => handleSelectLab(idx)}
                  aria-label={`Select ${lab.title}`}
                />
              ))}
            </div>
          </div>

          {/* 4. Bottom Metrics */}
          <MobileMetricsBanner />
        </div>
      )}
    </div>
  );

}
