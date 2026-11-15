'use client';
import * as featureStyleFunctions from '@/features/lessons/styles/LessonPage.e6c5c4f9.styles.js';

import inlineStyles from '@/features/lessons/styles/LessonPage.styles';
import { useState, useEffect, useRef } from 'react';
import { useRouter } from 'next/navigation';
import {
  Brain, CheckCircle, Circle, ChevronRight, ChevronDown, ChevronUp, Clock,
  Loader2, Sparkles, RotateCcw, ArrowLeft, Send,
  FileText, Award, AlertCircle, ThumbsUp, HelpCircle, Terminal,
  BookOpen, Bot, MessageSquare, Mic, MicOff, BookMarked,
  Trash2, Plus, Play, Download, Bell, Megaphone, X, Check
} from 'lucide-react';
import { T } from '@/shared/design-system/theme';
import { COURSE, getCourseDetails } from '@/features/courses/domain/course-data';
import { geminiCall } from '@/features/tutoring/api/gemini';
import { buildQuizPrompt } from '@/features/tutoring/domain/prompts';
import { parseQuizOutput } from '@/features/tutoring/domain/parsers';
import { useMediaQuery, isMobileMQ, isTabletMQ } from '@/lib/useMediaQuery';
import dynamic from 'next/dynamic';
import { getCourses } from '@/features/courses/api/client';
import { getQuizzes, submitQuizResponse, getQuizSubmissions, getAssignments, submitAssignmentResponse, getAssignmentSubmissions } from '@/features/assessments/api/client';
import { getNotifications } from '@/features/administration/api/collections';
import PDFViewerModal from '@/components/PDFViewerModal';
import VideoPlayerWithAI from '@/components/VideoPlayerWithAI';
import VideoAIExplainerCard from '@/components/VideoAIExplainerCard';
import PracticePlaygroundModal from '@/components/PracticePlaygroundModal';
import CompanionTabs, { TABS } from '@/components/CompanionTabs';
import OverviewModal from '@/components/OverviewModal';
import { getMascotBridge } from '@/lib/mascotBridge';
import '@/features/lessons/styles/LessonPage.css';
import {formatTimestamp,extractYoutubeId,renderCleanFormattedText,renderFormattedChatMessage} from '@/features/lessons/components/features-lessons-components-LessonPage.support.jsx';
import {useLessonPageModel} from '@/features/lessons/hooks/features-lessons-components-LessonPage.jsx';
export default function LessonPage({ lesson, completed = {}, onComplete }) {
const {router,isMobile,isTablet,isStackedLayout,next,setNext,isPlaygroundOpen,setIsPlaygroundOpen,isPdfViewerOpen,setIsPdfViewerOpen,selectedPdfResource,setSelectedPdfResource,videoSeekTime,setVideoSeekTime,videoCurrentTime,setVideoCurrentTime,aiExplainerData,setAiExplainerData,explainerLoading,setExplainerLoading,activeCompanionTab,setActiveCompanionTab,isOverviewModalOpen,setIsOverviewModalOpen,isExpanded,setIsExpanded,isSummaryExpanded,setIsSummaryExpanded,currentTab,panelColor,notesTabColor,chatQuestion,setChatQuestion,chatHistory,setChatHistory,chatLoading,setChatLoading,notes,setNotes,allCourseNotes,setAllCourseNotes,noteFilter,setNoteFilter,recentNoteAlert,setRecentNoteAlert,newNoteText,setNewNoteText,isPointsSaved,setIsPointsSaved,isDictating,setIsDictating,forcePause,setForcePause,recognitionRef,dictationBaseTextRef,isExplainingRef,announcements,setAnnouncements,mod,currentUser,setCurrentUser,isTabletOrSmallDesktop,rPad,aiQuiz,setAiQuiz,aiLoading,setAiLoading,aiErr,setAiErr,aiQuizIdx,setAiQuizIdx,aiQuizAns,setAiQuizAns,officialQuiz,setOfficialQuiz,officialAssignment,setOfficialAssignment,quizAttempts,setQuizAttempts,assignmentSub,setAssignmentSub,isOfficialQuizActive,setIsOfficialQuizActive,officialQuizIdx,setOfficialQuizIdx,officialQuizAnswers,setOfficialQuizAnswers,officialQuizScore,setOfficialQuizScore,submittingQuiz,setSubmittingQuiz,assignmentText,setAssignmentText,submittingAss,setSubmittingAss,assSuccessMsg,setAssSuccessMsg,isMascotConnected,setIsMascotConnected,ensureNumberedNotes,lastReportedTimeRef,handleExplainMoment,handleSaveQuickNote,handleSaveManualNote,handleDeleteNoteById,handleDownloadNote,handleDownloadAllNotes,handleToggleDictation,handleAskQuestion,handleGeneratePracticeQuiz,handleOfficialQuizSubmit,handleOfficialAssignmentSubmit}=useLessonPageModel({lesson,completed,onComplete});
return (
    <div style={featureStyleFunctions.s0({T,isStackedLayout,isMobile})}>
      <div style={featureStyleFunctions.s1({isStackedLayout})}>
        {/* Navigation Bar */}
        <div style={inlineStyles.s5}>
          <div style={inlineStyles.s6}>
            <button
              onClick={() => {
                const cId = lesson?.courseId || (typeof window !== 'undefined' ? localStorage.getItem('selected_course_id') : '');
                if (cId) {
                  router.push(`/courses?course=${encodeURIComponent(cId)}`);
                } else {
                  router.push('/courses');
                }
              }}
              style={featureStyleFunctions.s2({T})}
              onMouseEnter={(e) => e.currentTarget.style.color = T.text}
              onMouseLeave={(e) => e.currentTarget.style.color = T.muted}
            >
              <ArrowLeft size={15} /> Back to Course
            </button>

            <button
              onClick={() => setIsOverviewModalOpen(true)}
              style={featureStyleFunctions.s3({T})}
              onMouseEnter={(e) => {
                e.currentTarget.style.background = `${T.accent}15`;
                e.currentTarget.style.borderColor = `${T.accent}40`;
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.background = T.s2;
                e.currentTarget.style.borderColor = T.border;
              }}
            >
              <BookOpen size={14} color={T.accent} />
              <span>Overview</span>
            </button>
          </div>
          
          <div style={inlineStyles.s7}>
            <button
              onClick={() => setIsPlaygroundOpen(true)}
              style={featureStyleFunctions.s4({T})}
            >
              <Terminal size={14} />
              <span>Practice Playground</span>
            </button>

            {completed[lesson.id] ? (
              <div style={featureStyleFunctions.s5({T})}>
                <CheckCircle size={14} /> Completed
              </div>
            ) : (
              <button
                onClick={() => onComplete && onComplete(lesson.id)}
                style={featureStyleFunctions.s6({T})}
              >
                <CheckCircle size={14} /> Mark Complete
              </button>
            )}

            {next && (
              <button
                onClick={() => router.push(`/lesson/${next.id}`)}
                style={featureStyleFunctions.s7({T})}
              >
                <span>Next</span>
                <ChevronRight size={14} />
              </button>
            )}
          </div>
        </div>

        {/* ──────────────────────────────────────────────────────── */}
        {/* TWO-COLUMN WORKSPACE: Video Player (Left) + 4 Tabs (Right) */}
        {/* ──────────────────────────────────────────────────────── */}
        <div style={featureStyleFunctions.s8({isStackedLayout})}>
          {/* Left: Video Player */}
          <div style={featureStyleFunctions.s9({isStackedLayout,isExpanded,T})}>
            <div style={featureStyleFunctions.s10({isStackedLayout,T})}>
              <div style={featureStyleFunctions.s11({isStackedLayout})}>
                <span style={featureStyleFunctions.s12({isStackedLayout,mod,T})}>
                  {mod?.emoji} {mod?.title}
                </span>
                <span
                  title={lesson.title}
                  style={featureStyleFunctions.s13({T,isStackedLayout})}
                >
                  {lesson.title}
                </span>
                {!isStackedLayout && (
                  <span style={featureStyleFunctions.s14({T})}>
                    <Clock size={11} />
                    <span>{lesson.dur}</span>
                  </span>
                )}
              </div>

              <div style={featureStyleFunctions.s15({T})}>
                <Clock size={11} /> {formatTimestamp(videoCurrentTime)}
              </div>
            </div>

            <div style={featureStyleFunctions.s16({isStackedLayout})}>
              <VideoPlayerWithAI
                videoId={extractYoutubeId(lesson.vid || lesson.youtube)}
                onTimeUpdate={(secs) => setVideoCurrentTime(secs)}
                onExplainRequested={(secs) => {
                  setActiveCompanionTab('ask_vedika');
                  setIsExpanded(true);
                  handleExplainMoment(secs);
                }}
                seekTime={videoSeekTime}
                onSeekComplete={() => setVideoSeekTime(null)}
                forcePause={forcePause}
              />
            </div>
          </div>

          {/* Right Section: Companion Drawer Panel + 4 Tabs Column */}
          <div style={featureStyleFunctions.s17({isStackedLayout,isExpanded})}>
            {/* MOBILE VIEW (Collapsed): Single neat card showing the 4 tabs */}
            {isStackedLayout && !isExpanded && (
              <div style={featureStyleFunctions.s18({T})}>
                <div style={featureStyleFunctions.s19({T})}>
                  {TABS.map((tab) => {
                    const { Icon } = tab;
                    const count = tab.id === 'notes' ? notes.length : tab.id === 'qa' ? chatHistory.length : 0;
                    return (
                      <button
                        key={tab.id}
                        type="button"
                        onClick={() => {
                          setActiveCompanionTab(tab.id);
                          setIsExpanded(true);
                        }}
                        style={featureStyleFunctions.s20({T})}
                      >
                        <div style={inlineStyles.s8}>
                          <Icon size={16} />
                          {count > 0 && (
                            <span style={featureStyleFunctions.s21({tab})}>
                              {count}
                            </span>
                          )}
                        </div>
                        <span style={featureStyleFunctions.s22({T})}>
                          {tab.label}
                        </span>
                        <span style={inlineStyles.s9}>
                          {tab.subtitle}
                        </span>
                      </button>
                    );
                  })}
                </div>
              </div>
            )}

            {/* Opening Companion Tab Drawer Panel (Desktop) OR Combined Card (Mobile) */}
            {isExpanded && (() => {
              const currentTab = TABS.find(t => t.id === activeCompanionTab) || TABS[0];
              const panelColor = currentTab.color;
              const TabIcon = currentTab.Icon;

              // On mobile, eliminate protruding corners for end tabs (Ask Vedika & Practice Quiz)
              const panelBorderRadius = isStackedLayout
                ? (activeCompanionTab === 'ask_vedika'
                    ? '0 16px 16px 16px'
                    : activeCompanionTab === 'quiz'
                      ? '16px 0 16px 16px'
                      : '16px')
                : '16px';

              return (
                <div style={featureStyleFunctions.s23({isStackedLayout})}>
                  {isStackedLayout && (
                    /* MOBILE 4-TAB BAR: Sits on top of panel body, active tab vertically blended into panel */
                    <div style={inlineStyles.s10}>
                      {TABS.map((tab) => {
                        const isActive = activeCompanionTab === tab.id;
                        const { Icon } = tab;
                        const count = tab.id === 'notes' ? notes.length : tab.id === 'qa' ? chatHistory.length : 0;
                        const tabBorderRadius = (() => {
                          if (tab.id === 'ask_vedika') {
                            return isActive ? '16px 10px 0 0' : '10px 6px 0 0';
                          }
                          if (tab.id === 'quiz') {
                            return isActive ? '10px 16px 0 0' : '6px 10px 0 0';
                          }
                          return isActive ? '10px 10px 0 0' : '6px 6px 0 0';
                        })();

                        return (
                          <button
                            key={tab.id}
                            type="button"
                            onClick={() => {
                              if (activeCompanionTab === tab.id) {
                                setIsExpanded(false);
                              } else {
                                setActiveCompanionTab(tab.id);
                              }
                            }}
                            style={featureStyleFunctions.s24({tabBorderRadius,isActive,tab,T})}
                          >
                            <div style={inlineStyles.s11}>
                              <Icon size={16} style={featureStyleFunctions.s25({isActive,tab})} />
                              {count > 0 && (
                                <span style={featureStyleFunctions.s26({tab})}>
                                  {count}
                                </span>
                              )}
                            </div>
                            <span style={featureStyleFunctions.s27({isActive,T})}>
                              {tab.label}
                            </span>
                            <span style={featureStyleFunctions.s28({isActive,tab})}>
                              {tab.subtitle}
                            </span>
                          </button>
                        );
                      })}
                    </div>
                  )}

                  {/* MAIN PANEL BODY */}
                  <div style={featureStyleFunctions.s29({isStackedLayout,panelBorderRadius,panelColor,T})}>
                    {isStackedLayout ? (
                      /* Mobile Quick Close Button [X] */
                      <button
                        type="button"
                        onClick={() => setIsExpanded(false)}
                        title="Close panel"
                        style={featureStyleFunctions.s30({panelColor})}
                      >
                        <X size={13} />
                      </button>
                    ) : (
                      /* DESKTOP PANEL HEADER (100% Unchanged) */
                      <div style={featureStyleFunctions.s31({T})}>
                        <div style={inlineStyles.s12}>
                          <div style={featureStyleFunctions.s32({panelColor})}>
                            <TabIcon size={16} />
                          </div>
                          <div>
                            <div style={featureStyleFunctions.s33({T})}>
                              {currentTab.label}
                            </div>
                            <div style={featureStyleFunctions.s34({T})}>
                              {currentTab.subtitle}
                            </div>
                          </div>
                        </div>

                        <button
                          type="button"
                          onClick={() => setIsExpanded(false)}
                          title="Close panel"
                          style={featureStyleFunctions.s35({panelColor})}
                          onMouseEnter={(e) => { e.currentTarget.style.color = '#fff'; e.currentTarget.style.background = panelColor; }}
                          onMouseLeave={(e) => { e.currentTarget.style.color = panelColor; e.currentTarget.style.background = `${panelColor}12`; }}
                        >
                          <X size={14} />
                        </button>
                      </div>
                    )}

                  <div style={featureStyleFunctions.s36({isStackedLayout})}>

                    {/* TAB 1 CONTENT: ASK VEDIKA */}
                    {activeCompanionTab === 'ask_vedika' && (
                      <div style={inlineStyles.s13}>
                        <div style={featureStyleFunctions.s37({T})}>
                          <div style={inlineStyles.s14}>
                            <span style={featureStyleFunctions.s38({panelColor})}>
                              Paused at {formatTimestamp(videoCurrentTime)}
                            </span>
                            <span style={featureStyleFunctions.s39({T})}>{lesson.dur}</span>
                          </div>
                          <div style={featureStyleFunctions.s40({T})}>
                            {lesson.title}
                          </div>
                          <p style={featureStyleFunctions.s41({T})}>
                            Pause the video at any time to receive a step-by-step Socratic breakdown of what is being explained.
                          </p>
                        </div>

                        {/* 24/7 Desktop Mascot Status Indicator */}
                        {isMascotConnected ? (
                          <div style={inlineStyles.s15}>
                            <span style={inlineStyles.s16}>🎙️</span>
                            <div>
                              <div style={inlineStyles.s17}>
                                <span>24/7 Desktop Mascot Active</span>
                                <span style={inlineStyles.s18} />
                              </div>
                              <div style={inlineStyles.s19}>
                                Vedika is explaining this moment out loud on your desktop. Speak into your mic to ask questions!
                              </div>
                            </div>
                          </div>
                        ) : (
                          <div style={featureStyleFunctions.s42({T})}>
                            <div style={inlineStyles.s20}>
                              <span style={inlineStyles.s21}>💻</span>
                              <span>Desktop Mascot Offline</span>
                            </div>
                            <span style={featureStyleFunctions.s43({panelColor})}>
                              Launch Desktop Shortcut for Voice
                            </span>
                          </div>
                        )}

                        <button
                          type="button"
                          onClick={() => handleExplainMoment(videoCurrentTime)}
                          disabled={explainerLoading}
                          style={featureStyleFunctions.s44({panelColor,explainerLoading})}
                        >
                          <Bot size={16} />
                          <span>
                            {explainerLoading ? 'Analyzing Lecture Moment...' : `Explain Concept at ${formatTimestamp(videoCurrentTime)}`}
                          </span>
                        </button>

                        {aiExplainerData && (
                          <div style={featureStyleFunctions.s45({T})}>
                            {/* Collapsible Header Toggle */}
                            <button
                              type="button"
                              onClick={() => setIsSummaryExpanded(!isSummaryExpanded)}
                              style={inlineStyles.s22}
                              onMouseEnter={(e) => { e.currentTarget.style.background = `${panelColor}0c`; }}
                              onMouseLeave={(e) => { e.currentTarget.style.background = 'transparent'; }}
                            >
                              <div style={inlineStyles.s23}>
                                <Sparkles size={15} style={featureStyleFunctions.s46({panelColor})} />
                                <div style={inlineStyles.s24}>
                                  <span style={featureStyleFunctions.s47({T})}>
                                    Lecture Summary & Concepts
                                  </span>
                                  <span style={featureStyleFunctions.s48({panelColor})}>
                                    at {aiExplainerData.timestamp || formatTimestamp(videoCurrentTime)}
                                  </span>
                                </div>
                              </div>
                              <div style={featureStyleFunctions.s49({panelColor})}>
                                <span>{isSummaryExpanded ? 'Hide Summary' : 'View Summary'}</span>
                                {isSummaryExpanded ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
                              </div>
                            </button>

                            {/* Collapsible Body */}
                            {isSummaryExpanded && (
                              <div style={featureStyleFunctions.s50({T})}>
                                <div style={featureStyleFunctions.s51({T})}>
                                  {renderCleanFormattedText(aiExplainerData.coreExplanation || aiExplainerData.summary)}
                                </div>
                                {aiExplainerData.keyTakeaways?.length > 0 && (
                                  <div style={inlineStyles.s25}>
                                    <span style={featureStyleFunctions.s52({T})}>Key Takeaways:</span>
                                    {aiExplainerData.keyTakeaways.map((point, i) => (
                                      <div
                                        key={i}
                                        style={featureStyleFunctions.s53({panelColor})}
                                      >
                                        <div style={inlineStyles.s26}>
                                          <span style={featureStyleFunctions.s54({panelColor})}>•</span>
                                          <span style={featureStyleFunctions.s55({T})}>
                                            {renderCleanFormattedText(point)}
                                          </span>
                                        </div>
                                        <button
                                          type="button"
                                          onClick={() => handleSaveQuickNote(point, aiExplainerData.timestamp || formatTimestamp(videoCurrentTime))}
                                          title="Save point to Personal Notes"
                                          style={featureStyleFunctions.s56({panelColor})}
                                          onMouseEnter={(e) => { e.currentTarget.style.background = panelColor; e.currentTarget.style.color = '#fff'; }}
                                          onMouseLeave={(e) => { e.currentTarget.style.background = `${panelColor}15`; e.currentTarget.style.color = panelColor; }}
                                        >
                                          <Plus size={11} /> Note
                                        </button>
                                      </div>
                                    ))}
                                  </div>
                                )}
                                <button
                                  type="button"
                                  onClick={() => {
                                    const noteContent = `${aiExplainerData.coreExplanation || ''}\n\nKey Takeaways:\n${(aiExplainerData.keyTakeaways || []).map(p => `• ${p}`).join('\n')}`;
                                    handleSaveQuickNote(noteContent, aiExplainerData.timestamp || formatTimestamp(videoCurrentTime));
                                  }}
                                  style={featureStyleFunctions.s57({isPointsSaved,panelColor})}
                                  onMouseEnter={(e) => {
                                    if (!isPointsSaved) {
                                      e.currentTarget.style.background = panelColor;
                                      e.currentTarget.style.color = '#fff';
                                    }
                                  }}
                                  onMouseLeave={(e) => {
                                    if (!isPointsSaved) {
                                      e.currentTarget.style.background = `${panelColor}15`;
                                      e.currentTarget.style.color = panelColor;
                                    }
                                  }}
                                >
                                  {isPointsSaved ? <Check size={14} /> : <BookMarked size={14} />}
                                  <span>{isPointsSaved ? 'Saved to Personal Notes! ✓' : 'Save Points to Personal Notes'}</span>
                                </button>
                              </div>
                            )}
                          </div>
                        )}
                      </div>
                    )}

                    {/* TAB 2 CONTENT: PERSONAL NOTES */}
                    {activeCompanionTab === 'notes' && (
                      <div style={inlineStyles.s27}>
                        <div style={inlineStyles.s28}>
                          <div style={inlineStyles.s29}>
                            <button
                              type="button"
                              onClick={() => setNoteFilter('lesson')}
                              style={featureStyleFunctions.s58({noteFilter,panelColor,T})}
                            >
                              This Lesson ({notes.length})
                            </button>
                            <button
                              type="button"
                              onClick={() => setNoteFilter('course')}
                              style={featureStyleFunctions.s59({noteFilter,panelColor,T})}
                            >
                              All Course ({allCourseNotes.length || notes.length})
                            </button>
                          </div>

                          {(noteFilter === 'lesson' ? notes : (allCourseNotes.length > 0 ? allCourseNotes : notes)).length > 0 && (
                            <button
                              type="button"
                              onClick={() => handleDownloadAllNotes(noteFilter === 'lesson' ? notes : (allCourseNotes.length > 0 ? allCourseNotes : notes))}
                              style={featureStyleFunctions.s60({panelColor})}
                            >
                              <Download size={12} /> Export .txt
                            </button>
                          )}
                        </div>

                        {/* Composer */}
                        <form onSubmit={handleSaveManualNote} style={inlineStyles.s30}>
                          <input
                            type="text"
                            value={newNoteText}
                            onChange={(e) => setNewNoteText(e.target.value)}
                            placeholder={isDictating ? "Listening... Speak note now" : `Add note (or 'Note 1: ...') at ${formatTimestamp(videoCurrentTime)}...`}
                            style={featureStyleFunctions.s61({T,isDictating,panelColor})}
                          />
                          <button
                            type="button"
                            onClick={handleToggleDictation}
                            title="Voice dictation"
                            style={featureStyleFunctions.s62({isDictating,panelColor,T})}
                          >
                            {isDictating ? <MicOff size={14} /> : <Mic size={14} />}
                          </button>
                          <button
                            type="submit"
                            disabled={!newNoteText.trim()}
                            style={featureStyleFunctions.s63({panelColor,newNoteText})}
                          >
                            <Plus size={14} />
                          </button>
                        </form>

                        {recentNoteAlert && (
                          <div style={featureStyleFunctions.s64({panelColor})}>
                            <span>
                              ✓ {recentNoteAlert.isUpdated ? 'Added point to' : 'Created'} Note #{recentNoteAlert.noteNumber || 1} ({recentNoteAlert.timestampFormatted || '00:00'})
                            </span>
                          </div>
                        )}

                        {/* Notes List */}
                        <div style={inlineStyles.s31}>
                          {(() => {
                            const displayedList = noteFilter === 'lesson' ? notes : (allCourseNotes.length > 0 ? allCourseNotes : notes);
                            if (displayedList.length === 0) {
                              return (
                                <div style={featureStyleFunctions.s65({T})}>
                                  <BookMarked size={24} style={featureStyleFunctions.s66({panelColor})} />
                                  <div>No study notes recorded yet. Type or ask Vedika to add notes at any lecture timestamp!</div>
                                </div>
                              );
                            }
                            return displayedList.map((n, idx) => {
                              const noteNum = n.noteNumber || (displayedList.length - idx);
                              const isHighlighted = recentNoteAlert && (
                                String(recentNoteAlert.id) === String(n.id) ||
                                (recentNoteAlert.noteNumber && Number(recentNoteAlert.noteNumber) === Number(noteNum))
                              );
                              return (
                                <div
                                  key={n.id || `${noteNum}_${idx}`}
                                  style={featureStyleFunctions.s67({isHighlighted,panelColor,T})}
                                >
                                  <div style={inlineStyles.s32}>
                                    <div style={inlineStyles.s33}>
                                      <span
                                        style={featureStyleFunctions.s68({panelColor})}
                                      >
                                        Note #{noteNum}
                                      </span>
                                      <button
                                        type="button"
                                        onClick={() => setVideoSeekTime(n.timestampSeconds || 0)}
                                        style={featureStyleFunctions.s69({panelColor})}
                                      >
                                        <Play size={9} style={featureStyleFunctions.s70({panelColor})} />
                                        <span>{n.timestampFormatted || '00:00'}</span>
                                      </button>
                                    </div>
                                    <div style={inlineStyles.s34}>
                                      <button
                                        type="button"
                                        onClick={() => handleDownloadNote(n)}
                                        style={featureStyleFunctions.s71({T})}
                                      >
                                        <Download size={12} />
                                      </button>
                                      <button
                                        type="button"
                                        onClick={() => handleDeleteNoteById(n.id)}
                                        style={featureStyleFunctions.s72({T})}
                                      >
                                        <Trash2 size={12} />
                                      </button>
                                    </div>
                                  </div>
                                <div style={featureStyleFunctions.s73({T})}>
                                  {(n.noteText || '').split('\n').filter(Boolean).map((line, lIdx) => {
                                    const isBullet = line.trim().startsWith('•') || line.trim().startsWith('-') || line.trim().startsWith('*');
                                    const cleanLine = isBullet ? line.replace(/^[•\-*]\s*/, '').trim() : line.trim();
                                    if (isBullet) {
                                      return (
                                        <div key={lIdx} style={inlineStyles.s35}>
                                          <span style={featureStyleFunctions.s74({panelColor})}>•</span>
                                          <span style={inlineStyles.s36}>{renderCleanFormattedText(cleanLine)}</span>
                                        </div>
                                      );
                                    }
                                    return (
                                      <div key={lIdx} style={inlineStyles.s37}>
                                        {renderCleanFormattedText(cleanLine)}
                                      </div>
                                    );
                                  })}
                                </div>
                                </div>
                                );
                              });
                          })()}
                        </div>
                      </div>
                    )}

                    {/* TAB 3 CONTENT: LESSON Q&A */}
                    {activeCompanionTab === 'qa' && (
                      <div style={inlineStyles.s38}>
                        <div style={featureStyleFunctions.s75({T})}>
                          {chatHistory.length === 0 ? (
                            <div style={featureStyleFunctions.s76({T})}>
                              <MessageSquare size={24} style={featureStyleFunctions.s77({panelColor})} />
                              <div>Ask questions regarding concepts or code covered in this lesson.</div>
                            </div>
                          ) : (
                            chatHistory.map((m, idx) => (
                              <div
                                key={idx}
                                style={featureStyleFunctions.s78({m})}
                              >
                                {m.role === 'user' ? m.text : renderFormattedChatMessage(m.text, (sec) => setVideoSeekTime(sec))}
                              </div>
                            ))
                          )}
                          {chatLoading && (
                            <div style={featureStyleFunctions.s79({panelColor})}>
                              <Loader2 size={12} className="animate-spin" />
                              <span>Vedika is thinking...</span>
                            </div>
                          )}
                        </div>

                        <form
                          onSubmit={(e) => {
                            e.preventDefault();
                            handleAskQuestion(chatQuestion);
                          }}
                          style={inlineStyles.s39}
                        >
                          <input
                            type="text"
                            value={chatQuestion}
                            onChange={(e) => setChatQuestion(e.target.value)}
                            placeholder="Ask a question about this lesson..."
                            style={featureStyleFunctions.s80({T})}
                          />
                          <button
                            type="submit"
                            disabled={chatLoading || !chatQuestion.trim()}
                            style={featureStyleFunctions.s81({panelColor,chatLoading,chatQuestion})}
                          >
                            <Send size={14} />
                          </button>
                        </form>
                      </div>
                    )}

                    {/* TAB 4 CONTENT: PRACTICE QUIZ */}
                    {activeCompanionTab === 'quiz' && (
                      <div style={inlineStyles.s40}>
                        {!aiQuiz && !aiLoading && (
                          <div style={inlineStyles.s41}>
                            <Award size={28} color={panelColor} />
                            <div style={featureStyleFunctions.s82({T})}>Generate Practice Quiz</div>
                            <p style={featureStyleFunctions.s83({T})}>
                              Take an instant AI-generated practice quiz based on this lecture topic to test your knowledge!
                            </p>
                            <button
                              onClick={handleGeneratePracticeQuiz}
                              style={featureStyleFunctions.s84({panelColor})}
                            >
                              Start Practice Quiz
                            </button>
                          </div>
                        )}

                        {aiLoading && (
                          <div style={featureStyleFunctions.s85({panelColor})}>
                            <Loader2 size={24} className="animate-spin" />
                            <span style={inlineStyles.s42}>Crafting practice quiz questions...</span>
                          </div>
                        )}

                        {aiQuiz && aiQuiz.questions && (
                          <div style={inlineStyles.s43}>
                            <div style={featureStyleFunctions.s86({T})}>
                              <span style={featureStyleFunctions.s87({panelColor})}>
                                Question {aiQuizIdx + 1} of {aiQuiz.questions.length}
                              </span>
                              <button
                                onClick={handleGeneratePracticeQuiz}
                                style={featureStyleFunctions.s88({panelColor})}
                              >
                                <RotateCcw size={11} /> New Quiz
                              </button>
                            </div>

                            <div style={featureStyleFunctions.s89({T})}>
                              {aiQuiz.questions[aiQuizIdx].q}
                            </div>

                            <div style={inlineStyles.s44}>
                              {aiQuiz.questions[aiQuizIdx].opts.map((opt, oi) => {
                                const isSelected = aiQuizAns === oi;
                                const isCorrect = oi === aiQuiz.questions[aiQuizIdx].ans;
                                let optBg = T.s2;
                                let optBorder = T.border;

                                if (aiQuizAns !== null) {
                                  if (isCorrect) {
                                    optBg = 'rgba(16, 185, 129, 0.15)';
                                    optBorder = '#10B981';
                                  } else if (isSelected) {
                                    optBg = 'rgba(239, 68, 68, 0.15)';
                                    optBorder = '#EF4444';
                                  }
                                }

                                return (
                                  <button
                                    key={oi}
                                    disabled={aiQuizAns !== null}
                                    onClick={() => setAiQuizAns(oi)}
                                    style={featureStyleFunctions.s90({optBg,optBorder,T,aiQuizAns})}
                                  >
                                    <span style={featureStyleFunctions.s91({T})}>{String.fromCharCode(65 + oi)}.</span>
                                    <span>{opt}</span>
                                  </button>
                                );
                              })}
                            </div>

                            {aiQuizAns !== null && (
                              <div style={inlineStyles.s45}>
                                <span style={featureStyleFunctions.s92({aiQuizAns,aiQuiz,aiQuizIdx})}>
                                  {aiQuizAns === aiQuiz.questions[aiQuizIdx].ans ? '✓ Correct Answer!' : '✗ Incorrect Option'}
                                </span>
                                {aiQuizIdx < aiQuiz.questions.length - 1 && (
                                  <button
                                    onClick={() => {
                                      setAiQuizIdx(idx => idx + 1);
                                      setAiQuizAns(null);
                                    }}
                                    style={featureStyleFunctions.s93({panelColor})}
                                  >
                                    Next Question →
                                  </button>
                                )}
                              </div>
                            )}
                          </div>
                        )}
                      </div>
                    )}
                  </div>
                </div>
              </div>
            );
          })()}

          {/* 4 Companion Tabs (ONLY rendered on desktop, since mobile has them integrated into the unified card above!) */}
          {!isStackedLayout && (
            <div style={featureStyleFunctions.s94({isExpanded})}>
              <CompanionTabs
                vertical={true}
                activeTab={isExpanded ? activeCompanionTab : null}
                isExpanded={isExpanded}
                onSelectTab={(tabId) => {
                  if (isExpanded && activeCompanionTab === tabId) {
                    setIsExpanded(false);
                  } else {
                    setActiveCompanionTab(tabId);
                    setIsExpanded(true);
                  }
                }}
                notesCount={notes.length}
                qaCount={chatHistory.length}
              />
            </div>
          )}
        </div>
        </div>
      </div>

      {/* Lesson Overview & Key Points Modal */}
      <OverviewModal
        isOpen={isOverviewModalOpen}
        onClose={() => setIsOverviewModalOpen(false)}
        lesson={lesson}
        mod={mod}
        onOpenPdf={lesson.pdf ? () => {
          setSelectedPdfResource({ file_link: lesson.pdf, name: `${lesson.title} Reference PDF` });
          setIsPdfViewerOpen(true);
        } : null}
      />

      {/* PDF Viewer Modal */}
      {selectedPdfResource && (
        <PDFViewerModal
          isOpen={isPdfViewerOpen}
          onClose={() => setIsPdfViewerOpen(false)}
          fileUrl={selectedPdfResource.file_link}
          title={selectedPdfResource.name}
        />
      )}

      {/* Practice Playground Modal */}
      <PracticePlaygroundModal
        isOpen={isPlaygroundOpen}
        onClose={() => setIsPlaygroundOpen(false)}
        title={`Practice: ${lesson.title}`}
        badge={mod?.title || 'Python'}
        initialCode={lesson?.codingExercise?.starterCode || `# Practice code for: ${lesson.title}\nprint("Practicing: ${lesson.title}")\n`}
        codingExercise={lesson?.codingExercise}
      />

      {/* Floating Toast Notification: Personal Note Saved */}
      {recentNoteAlert && (
        <div style={featureStyleFunctions.s95({notesTabColor})}>
          <div style={featureStyleFunctions.s96({notesTabColor})}>
            <Check size={16} />
          </div>
          <div style={inlineStyles.s46}>
            <span style={inlineStyles.s47}>Saved to Personal Notes!</span>
            <span style={featureStyleFunctions.s97({T})}>
              Timestamp {recentNoteAlert.timestampFormatted}
            </span>
          </div>
          <button
            type="button"
            onClick={() => {
              setActiveCompanionTab('notes');
              setIsExpanded(true);
              setRecentNoteAlert(null);
            }}
            style={featureStyleFunctions.s98({notesTabColor})}
          >
            View Notes →
          </button>
          <button
            type="button"
            onClick={() => setRecentNoteAlert(null)}
            style={featureStyleFunctions.s99({T})}
          >
            <X size={14} />
          </button>
        </div>
      )}
    </div>
  );

}
