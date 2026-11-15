'use client';
import * as featureStyleFunctions from '@/features/labs/styles/PhetSimViewer.b57c07d7.styles.js';

import inlineStyles from '@/features/labs/styles/PhetSimViewer.styles';
import React, { useState, useRef, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { 
  Maximize2, RotateCcw, BookOpen, HelpCircle, 
  ExternalLink, Layers, CheckCircle2, ChevronDown, ChevronUp, Award, Send, Bot, RefreshCw,
  Sparkles, Smartphone, X, Check, Compass, ArrowLeft
} from 'lucide-react';
import { PHET_SIMULATIONS, LAB_SUBJECT_METADATA } from '@/lib/phet-simulations';
import { T } from '@/shared/design-system/theme';
import MathEquationRenderer from '@/components/labs/MathEquationRenderer';
import { useMediaQuery, isMobileMQ } from '@/lib/useMediaQuery';
import {LAB_FEATURE_OPTIONS} from '@/features/labs/components/features-labs-components-PhetSimViewer.support.jsx';
import {usePhetSimViewerModel} from '@/features/labs/hooks/features-labs-components-PhetSimViewer.jsx';
export default function PhetSimViewer({ subject = 'physics', activeSimId, onSelectSim, onViewModeChange, currentViewMode = 'phet' }) {
const {router,isMobile,sims,activeSim,subjectMeta,getInitialGreeting,isLoading,setIsLoading,activeTab,setActiveTab,isFeatureDropdownOpen,setIsFeatureDropdownOpen,showMobileTip,setShowMobileTip,isFullscreen,setIsFullscreen,dropdownRef,aiQuery,setAiQuery,aiChat,setAiChat,isAiThinking,setIsAiThinking,chatBottomRef,containerRef,iframeRef,handleToggleFullscreen,handleReloadIframe,handleAskAi,currentFeature,CurrentFeatureIcon}=usePhetSimViewerModel({subject,activeSimId,onSelectSim,onViewModeChange,currentViewMode});
return (
    <div 
      ref={containerRef}
      style={featureStyleFunctions.s0({isMobile,T})}
    >
      {/* Top Header Control Bar */}
      <div style={featureStyleFunctions.s1({isMobile})}>
        {/* Main Controls Row */}
        <div style={featureStyleFunctions.s2({isMobile})}>
          {/* Left: Back to Labs + Experiment Selector & Subject Badge */}
          <div style={featureStyleFunctions.s3({isMobile})}>
            <button
              type="button"
              onClick={() => router.push('/vedika-labs')}
              style={inlineStyles.s0}
              onMouseEnter={(e) => {
                e.currentTarget.style.background = 'rgba(255, 255, 255, 0.12)';
                e.currentTarget.style.color = '#FFFFFF';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.background = 'rgba(255, 255, 255, 0.06)';
                e.currentTarget.style.color = '#E2E8F0';
              }}
              title="Back to Vedika Labs"
            >
              <ArrowLeft size={13} />
              <span>Back</span>
            </button>
            <span style={featureStyleFunctions.s4({subjectMeta})}>
              HTML5 {subject.toUpperCase()}
            </span>

            <div style={inlineStyles.s1}>
              <select
                value={activeSim?.id}
                onChange={(e) => {
                  setIsLoading(true);
                  onSelectSim && onSelectSim(e.target.value);
                }}
                style={featureStyleFunctions.s5({isMobile})}
              >
                {sims.map(sim => (
                  <option key={sim.id} value={sim.id} style={inlineStyles.s2}>
                    🧪 {sim.title} ({sim.badge})
                  </option>
                ))}
              </select>
              <ChevronDown size={14} color="#aaa" style={inlineStyles.s3} />
            </div>
          </div>

          {/* Desktop Center: Dual Mode Switcher (HTML5 vs 3D WebGL) */}
          {!isMobile && (
            <div style={inlineStyles.s4}>
              <button
                onClick={() => onViewModeChange && onViewModeChange('phet')}
                style={featureStyleFunctions.s6({currentViewMode,subjectMeta})}
              >
                <Maximize2 size={13} />
                HTML5 Sim
              </button>
              <button
                onClick={() => onViewModeChange && onViewModeChange('3d')}
                style={featureStyleFunctions.s7({currentViewMode,subjectMeta})}
              >
                <Layers size={13} />
                3D Canvas
              </button>
            </div>
          )}

          {/* Quick Action Controls (Reset & Fullscreen) */}
          <div style={inlineStyles.s5}>
            <button
              onClick={handleReloadIframe}
              title="Reset / Reload Simulation"
              style={featureStyleFunctions.s8({isMobile})}
            >
              <RotateCcw size={13} />
              {!isMobile && 'Reset'}
            </button>

            <button
              onClick={handleToggleFullscreen}
              title="Fullscreen Mode"
              style={featureStyleFunctions.s9({isFullscreen,subjectMeta,isMobile})}
            >
              <Maximize2 size={13} />
              {isMobile ? (isFullscreen ? 'Exit' : 'Full') : (isFullscreen ? 'Exit Fullscreen' : 'Fullscreen')}
            </button>
          </div>
        </div>

        {/* Mobile-Only Row: Mode Switcher */}
        {isMobile && (
          <div style={inlineStyles.s6}>
            <button
              onClick={() => onViewModeChange && onViewModeChange('phet')}
              style={featureStyleFunctions.s10({currentViewMode,subjectMeta})}
            >
              <Maximize2 size={12} />
              HTML5 Sim
            </button>
            <button
              onClick={() => onViewModeChange && onViewModeChange('3d')}
              style={featureStyleFunctions.s11({currentViewMode,subjectMeta})}
            >
              <Layers size={12} />
              3D Canvas
            </button>
          </div>
        )}
      </div>

      {/* Hero Feature Options Bar: Custom Dropdown for the 5 Features */}
      <div style={featureStyleFunctions.s12({isMobile})}>
        {/* The 5-Feature Options Dropdown Trigger & Popover */}
        <div ref={dropdownRef} style={featureStyleFunctions.s13({isMobile})}>
          <button
            type="button"
            onClick={() => setIsFeatureDropdownOpen(prev => !prev)}
            aria-label="Select Lab Feature Option"
            style={featureStyleFunctions.s14({isFeatureDropdownOpen,subjectMeta,isMobile})}
          >
            <div style={inlineStyles.s7}>
              <div style={featureStyleFunctions.s15({subjectMeta})}>
                <CurrentFeatureIcon size={16} />
              </div>
              <div style={inlineStyles.s8}>
                <div style={inlineStyles.s9}>
                  Lab Feature
                </div>
                <div style={featureStyleFunctions.s16({isMobile})}>
                  <span style={inlineStyles.s10}>{currentFeature.label}</span>
                  <span style={featureStyleFunctions.s17({subjectMeta})}>
                    {currentFeature.badge}
                  </span>
                </div>
              </div>
            </div>

            <div style={inlineStyles.s11}>
              <span style={inlineStyles.s12}>Menu</span>
              <ChevronDown
                size={16}
                color={isFeatureDropdownOpen ? subjectMeta.accentColor : '#8892B0'}
                style={featureStyleFunctions.s18({isFeatureDropdownOpen})}
              />
            </div>
          </button>

          {/* Dropdown Menu Modal / Popover */}
          {isFeatureDropdownOpen && (
            <div style={featureStyleFunctions.s19({isMobile,subjectMeta})}>
              <div style={inlineStyles.s13}>
                <span style={inlineStyles.s14}>
                  Available Features
                </span>
                <span style={featureStyleFunctions.s20({subjectMeta})}>
                  5 Options
                </span>
              </div>
              <div style={inlineStyles.s15}>
                {LAB_FEATURE_OPTIONS.map((opt) => {
                  const OptIcon = opt.icon;
                  const isSelected = activeTab === opt.id;
                  return (
                    <button
                      key={opt.id}
                      onClick={() => {
                        setActiveTab(opt.id);
                        setIsFeatureDropdownOpen(false);
                      }}
                      style={featureStyleFunctions.s21({isSelected,subjectMeta})}
                    >
                      <div style={inlineStyles.s16}>
                        <div style={featureStyleFunctions.s22({isSelected,subjectMeta})}>
                          <OptIcon size={16} />
                        </div>
                        <div style={inlineStyles.s17}>
                          <div style={featureStyleFunctions.s23({isSelected})}>
                            <span>{opt.label}</span>
                            <span style={featureStyleFunctions.s24({isSelected,subjectMeta})}>
                              {opt.badge}
                            </span>
                          </div>
                          <div style={inlineStyles.s18}>
                            {opt.subtitle}
                          </div>
                        </div>
                      </div>
                      {isSelected && (
                        <Check size={16} color={subjectMeta.accentColor} style={inlineStyles.s19} />
                      )}
                    </button>
                  );
                })}
              </div>
            </div>
          )}
        </div>

        {/* Desktop Quick-Access Tab Strip (Screens >= 768px) */}
        {!isMobile && (
          <div style={inlineStyles.s20}>
            {LAB_FEATURE_OPTIONS.map(opt => {
              const OptIcon = opt.icon;
              const isSelected = activeTab === opt.id;
              return (
                <button
                  key={opt.id}
                  onClick={() => setActiveTab(opt.id)}
                  style={featureStyleFunctions.s25({isSelected,subjectMeta})}
                >
                  <OptIcon size={14} />
                  <span>{opt.label}</span>
                </button>
              );
            })}
          </div>
        )}
      </div>

      {/* Main Content Area */}
      <div style={inlineStyles.s21}>
        
        {/* TAB 1: PhET Simulation iFrame View */}
        {activeTab === 'sim' && (
          <div style={featureStyleFunctions.s26({isMobile})}>
            {/* Mobile Touch & Orientation Tip Pill */}
            {isMobile && showMobileTip && (
              <div style={inlineStyles.s22}>
                <div style={inlineStyles.s23}>
                  <Smartphone size={16} color={subjectMeta.accentColor} style={inlineStyles.s24} />
                  <span style={inlineStyles.s25}>
                    <strong>Tip:</strong> Rotate to <strong>Landscape</strong> or tap <strong>Fullscreen</strong> for best PhET touch experience.
                  </span>
                </div>
                <div style={inlineStyles.s26}>
                  <button
                    onClick={handleToggleFullscreen}
                    style={featureStyleFunctions.s27({subjectMeta})}
                  >
                    {isFullscreen ? 'Exit' : 'Fullscreen'}
                  </button>
                  <button
                    onClick={() => setShowMobileTip(false)}
                    style={inlineStyles.s27}
                    title="Dismiss"
                  >
                    <X size={14} />
                  </button>
                </div>
              </div>
            )}

            {isLoading && (
              <div style={inlineStyles.s28}>
                <RefreshCw size={36} color={subjectMeta.accentColor} style={inlineStyles.s29} />
                <div style={inlineStyles.s30}>
                  <h3 style={inlineStyles.s31}>
                    Loading {activeSim?.title}...
                  </h3>
                  <p style={inlineStyles.s32}>
                    Initializing Vedika Interactive STEM Engine
                  </p>
                </div>
              </div>
            )}

            <div style={inlineStyles.s33}>
              <iframe
                ref={iframeRef}
                src={`/api/phet-proxy?sim=${activeSim?.id}&url=${encodeURIComponent(activeSim?.embedUrl || '')}`}
                title={activeSim?.title}
                onLoad={() => setIsLoading(false)}
                allowFullScreen
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share; fullscreen"
                style={featureStyleFunctions.s28({isMobile})}
              />

              {/* Mobile Quick Floating Fullscreen FAB */}
              {isMobile && (
                <button
                  onClick={handleToggleFullscreen}
                  aria-label="Toggle Fullscreen"
                  style={featureStyleFunctions.s29({subjectMeta})}
                >
                  <Maximize2 size={13} color={subjectMeta.accentColor} />
                  {isFullscreen ? 'Exit Fullscreen' : 'Fullscreen'}
                </button>
              )}
            </div>
          </div>
        )}

        {/* TAB 2: Objectives & Guided Lab Steps */}
        {activeTab === 'objectives' && (
          <div style={featureStyleFunctions.s30({isMobile})}>
            <div style={inlineStyles.s34}>
              <div style={inlineStyles.s35}>
                <span style={featureStyleFunctions.s31({isMobile})}>🔬</span>
                <div>
                  <h2 style={featureStyleFunctions.s32({isMobile})}>
                    {activeSim?.title}
                  </h2>
                  <p style={featureStyleFunctions.s33({isMobile})}>
                    {activeSim?.description}
                  </p>
                </div>
              </div>

              <div style={featureStyleFunctions.s34({isMobile})}>
                <h4 style={featureStyleFunctions.s35({subjectMeta,isMobile})}>
                  🎯 Core Learning Objectives
                </h4>
                <ul style={featureStyleFunctions.s36({isMobile})}>
                  {activeSim?.objectives?.map((obj, i) => (
                    <li key={i} style={inlineStyles.s36}>{obj}</li>
                  ))}
                </ul>
              </div>

              <div style={featureStyleFunctions.s37({isMobile})}>
                <button
                  onClick={() => setActiveTab('sim')}
                  style={featureStyleFunctions.s38({isMobile,subjectMeta})}
                >
                  Return to Interactive Canvas →
                </button>
              </div>
            </div>
          </div>
        )}

        {/* TAB 3: Formulas & Principles */}
        {activeTab === 'formulas' && (
          <div style={featureStyleFunctions.s39({isMobile})}>
            <div style={inlineStyles.s37}>
              <h3 style={featureStyleFunctions.s40({isMobile})}>
                📐 Key Equations & Scientific Principles
              </h3>
              <div style={featureStyleFunctions.s41({isMobile})}>
                {activeSim?.keyFormulas?.map((formula, idx) => (
                  <div key={idx} style={featureStyleFunctions.s42({subjectMeta,isMobile})}>
                    <span style={inlineStyles.s38}>
                      Formula #{idx + 1}
                    </span>
                    <h4 style={featureStyleFunctions.s43({isMobile})}>
                      {formula}
                    </h4>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* TAB 4: Viva & Self-Test Questions */}
        {activeTab === 'questions' && (
          <div style={featureStyleFunctions.s44({isMobile})}>
            <div style={inlineStyles.s39}>
              <h3 style={featureStyleFunctions.s45({isMobile})}>
                ❓ Interactive Viva Questions for {activeSim?.title}
              </h3>
              <div style={inlineStyles.s40}>
                {activeSim?.guidedQuestions?.map((q, i) => (
                  <div key={i} style={featureStyleFunctions.s46({isMobile})}>
                    <h4 style={featureStyleFunctions.s47({subjectMeta,isMobile})}>
                      Q{i + 1}: {q}
                    </h4>
                    <button
                      onClick={() => {
                        setActiveTab('ai');
                        handleAskAi(`Answer Viva Question Q${i+1}: ${q}`, {
                          vivaQuestion: q,
                          questionIndex: i + 1
                        });
                      }}
                      style={featureStyleFunctions.s48({isMobile})}
                    >
                      <Bot size={14} color={subjectMeta.accentColor} />
                      Ask Vedika AI Tutor for Guided Solution
                    </button>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* TAB 5: Integrated Vedika AI Tutor Assistant */}
        {activeTab === 'ai' && (
          <div style={featureStyleFunctions.s49({isMobile})}>
            <div style={inlineStyles.s41}>
              {aiChat.map((msg, idx) => (
                <div 
                  key={idx}
                  style={featureStyleFunctions.s50({msg,isMobile,subjectMeta})}
                >
                  <div style={inlineStyles.s42}>
                    {msg.sender === 'user' ? 'You' : (
                      <>
                        <Bot size={15} style={featureStyleFunctions.s51({subjectMeta})} />
                        <span>Vedika AI Science Tutor</span>
                      </>
                    )}
                  </div>
                  <div style={featureStyleFunctions.s52({isMobile})}>
                    {msg.sender === 'ai' ? (
                      <MathEquationRenderer content={msg.text} />
                    ) : (
                      <div style={inlineStyles.s43}>{msg.text}</div>
                    )}
                  </div>
                </div>
              ))}
              {isAiThinking && (
                <div style={featureStyleFunctions.s53({subjectMeta})}>
                  <RefreshCw size={14} style={inlineStyles.s44} />
                  Vedika AI Tutor is analyzing experiment principles and preparing guidance...
                </div>
              )}
              <div ref={chatBottomRef} />
            </div>

            <div style={inlineStyles.s45}>
              <input
                type="text"
                value={aiQuery}
                onChange={(e) => setAiQuery(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && handleAskAi()}
                placeholder={`Ask Vedika AI about ${activeSim?.title}...`}
                style={featureStyleFunctions.s54({isMobile})}
              />
              <button
                onClick={() => handleAskAi()}
                style={featureStyleFunctions.s55({subjectMeta,isMobile})}
              >
                <Send size={15} />
                {!isMobile && 'Ask AI'}
              </button>
            </div>
          </div>
        )}

      </div>
    </div>
  );

}

export { LAB_FEATURE_OPTIONS } from '@/features/labs/components/features-labs-components-PhetSimViewer.support.jsx';
