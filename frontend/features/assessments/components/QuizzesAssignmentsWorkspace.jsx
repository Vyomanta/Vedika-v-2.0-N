'use client';
import dynamic from 'next/dynamic';
import QuizCatalog from '@/features/assessments/quizzes/components/QuizCatalog';
import AssignmentCatalog from '@/features/assessments/assignments/components/AssignmentCatalog';
const QuizAttempt=dynamic(()=>import('@/features/assessments/quizzes/components/QuizAttempt'),{ssr:false});
const AssignmentSubmission=dynamic(()=>import('@/features/assessments/assignments/components/AssignmentSubmission'),{ssr:false});
import * as featureStyleFunctions from '@/features/assessments/styles/QuizzesAssignmentsWorkspace.0bd3c671.styles.js';

import inlineStyles from '@/features/assessments/styles/QuizzesAssignmentsWorkspace.styles';

import { useState, useEffect, useMemo } from 'react';
import { useRouter } from 'next/navigation';
import {
  Award, FileText, Clock, CheckCircle, X, ChevronRight, HelpCircle,
  ArrowLeft, Search, Send, AlertCircle, Filter, Sparkles, BookOpen, Check,
  Edit2, RotateCcw
} from 'lucide-react';
import { T } from '@/shared/design-system/theme';
import { useMediaQuery, isMobileMQ } from '@/lib/useMediaQuery';
import { getQuizzes, getQuizSubmissions, submitQuizResponse, getAssignments, getAssignmentSubmissions, submitAssignmentResponse } from '@/features/assessments/api/client';
import { getCourses } from '@/features/courses/api/client';
import { parseQuestionsList, DEFAULT_QUIZZES, DEFAULT_ASSIGNMENTS } from '@/features/assessments/domain/legacy-formats';
import { DEFAULT_COURSES } from '@/integrations/frappe/transport';
import { getSubjectArtwork } from '@/lib/artwork';
import CategoryShowcaseCarousel from '@/components/CategoryShowcaseCarousel';
import PacmanPagination from '@/components/PacmanPagination';
import VedikaParticleBot from '@/components/VedikaParticleBot';
import ReactMarkdown from 'react-markdown';
import { useAssessmentsWorkspace } from '@/features/assessments/hooks/useAssessmentsWorkspace';

export default function QuizzesAssignmentsWorkspace({ initialMode = 'quizzes' }) {
  const model = useAssessmentsWorkspace(initialMode);
const { loadError, router, isMobile, activeTab, setActiveTab, isAssignmentsOpen, currentUser, setCurrentUser, courses, setCourses, loading, setLoading, quizzes, setQuizzes, quizSubmissions, setQuizSubmissions, selectedQuizCategory, setSelectedQuizCategory, quizSearch, setQuizSearch, quizPage, setQuizPage, QUIZ_ITEMS_PER_PAGE, selectedQuiz, setSelectedQuiz, isAttemptingQuiz, setIsAttemptingQuiz, currentQuizQIdx, setCurrentQuizQIdx, quizAnswers, setQuizAnswers, submittingQuiz, setSubmittingQuiz, quizScore, setQuizScore, assignments, setAssignments, assignmentSubmissions, setAssignmentSubmissions, selectedAssignmentCategory, setSelectedAssignmentCategory, assignmentSearch, setAssignmentSearch, assignmentCourseFilter, setAssignmentCourseFilter, assignmentChapterFilter, setAssignmentChapterFilter, assignmentPage, setAssignmentPage, ASSIGNMENT_ITEMS_PER_PAGE, selectedAssignment, setSelectedAssignment, isViewingAssignmentPrompt, setIsViewingAssignmentPrompt, activeAssignmentQIdx, setActiveAssignmentQIdx, assignmentAnswers, setAssignmentAnswers, submittingAssignment, setSubmittingAssignment, assignmentSuccessMsg, setAssignmentSuccessMsg, isEditingSubmission, setIsEditingSubmission, existingUserSub, getCourseName, getItemCategory, getQuizStatus, quizCategoryShowcaseItems, filteredQuizzes, totalQuizPages, paginatedQuizzes, handleStartAttempt, handleSelectQuizOption, handleQuizSubmit, getAssignmentStatus, assignmentCategoryShowcaseItems, categoryFilteredCourses, uniqueChapters, filteredAssignments, totalAssignmentPages, paginatedAssignments, handleOpenAssignmentPrompt, handleAssignmentSubmit } = model;
return (
    <div style={inlineStyles.s0}>
      {loadError && <div role="alert" style={{position:"absolute",top:0,left:0,right:0,zIndex:100,padding:12,background:"#7f1d1d",color:"white"}}>{loadError}</div>}
      <style>{featureStyleFunctions.s0({isMobile})}</style>

      <div className={`box-container ${isAssignmentsOpen ? 'right-open' : ''}`}>
        {/* Ambient Backdrop: Cosmic Purple when Assignments active, Cosmic Gold when Quizzes active */}
        {isAssignmentsOpen ? (
          <div className="assignments-ambient-bg">
            <svg
              viewBox="0 0 1440 900"
              preserveAspectRatio="none"
              style={inlineStyles.s1}
            >
              <defs>
                <linearGradient id="purpleWave1" x1="0%" y1="0%" x2="100%" y2="0%">
                  <stop offset="0%" stopColor="rgba(168, 85, 247, 0)" />
                  <stop offset="25%" stopColor="rgba(192, 132, 252, 0.32)" />
                  <stop offset="60%" stopColor="rgba(168, 85, 247, 0.25)" />
                  <stop offset="100%" stopColor="rgba(126, 34, 206, 0)" />
                </linearGradient>
                <linearGradient id="purpleWave2" x1="0%" y1="0%" x2="100%" y2="0%">
                  <stop offset="0%" stopColor="rgba(192, 132, 252, 0)" />
                  <stop offset="40%" stopColor="rgba(168, 85, 247, 0.2)" />
                  <stop offset="80%" stopColor="rgba(147, 51, 234, 0.14)" />
                  <stop offset="100%" stopColor="rgba(126, 34, 206, 0)" />
                </linearGradient>
              </defs>

              {/* Sweeping Purple Flow Wave 1 */}
              <path
                d="M -100 640 C 260 540, 580 700, 940 570 C 1180 480, 1360 530, 1600 560"
                fill="none"
                stroke="url(#purpleWave1)"
                strokeWidth="2"
              />

              {/* Sweeping Purple Flow Wave 2 */}
              <path
                d="M -80 720 C 220 620, 520 760, 880 650 C 1180 560, 1400 610, 1680 640"
                fill="none"
                stroke="url(#purpleWave2)"
                strokeWidth="1.5"
              />

              {/* Purple Sparkle Stars matching Image 1 */}
              <g transform="translate(100, 180)">
                <path d="M 0 -10 Q 0 0, -10 0 Q 0 0, 0 10 Q 0 0, 10 0 Q 0 0, 0 -10 Z" fill="#E9D5FF" opacity="0.9" />
              </g>
              <g transform="translate(240, 570)">
                <path d="M 0 -8 Q 0 0, -8 0 Q 0 0, 0 8 Q 0 0, 8 0 Q 0 0, 0 -8 Z" fill="#C084FC" opacity="0.85" />
              </g>
              <g transform="translate(560, 150)">
                <path d="M 0 -9 Q 0 0, -9 0 Q 0 0, 0 9 Q 0 0, 9 0 Q 0 0, 0 -9 Z" fill="#E9D5FF" opacity="0.9" />
              </g>
              <g transform="translate(740, 260)">
                <path d="M 0 -7 Q 0 0, -7 0 Q 0 0, 0 7 Q 0 0, 7 0 Q 0 0, 0 -7 Z" fill="#D8B4FE" opacity="0.8" />
              </g>
              <g transform="translate(1060, 320)">
                <path d="M 0 -8 Q 0 0, -8 0 Q 0 0, 0 8 Q 0 0, 8 0 Q 0 0, 0 -8 Z" fill="#C084FC" opacity="0.85" />
              </g>
              <g transform="translate(1320, 290)">
                <path d="M 0 -10 Q 0 0, -10 0 Q 0 0, 0 10 Q 0 0, 10 0 Q 0 0, 0 -10 Z" fill="#E9D5FF" opacity="0.8" />
              </g>
            </svg>
          </div>
        ) : (
          <div className="quizzes-ambient-bg">
            <svg
              viewBox="0 0 1440 900"
              preserveAspectRatio="none"
              style={inlineStyles.s2}
            >
              <defs>
                <linearGradient id="goldWave1" x1="0%" y1="0%" x2="100%" y2="0%">
                  <stop offset="0%" stopColor="rgba(245, 158, 11, 0)" />
                  <stop offset="25%" stopColor="rgba(245, 158, 11, 0.28)" />
                  <stop offset="60%" stopColor="rgba(251, 191, 36, 0.22)" />
                  <stop offset="100%" stopColor="rgba(217, 119, 6, 0)" />
                </linearGradient>
                <linearGradient id="goldWave2" x1="0%" y1="0%" x2="100%" y2="0%">
                  <stop offset="0%" stopColor="rgba(251, 191, 36, 0)" />
                  <stop offset="40%" stopColor="rgba(245, 158, 11, 0.16)" />
                  <stop offset="80%" stopColor="rgba(251, 191, 36, 0.1)" />
                  <stop offset="100%" stopColor="rgba(217, 119, 6, 0)" />
                </linearGradient>
              </defs>

              {/* Sweeping Golden Flow Wave 1 */}
              <path
                d="M -100 680 C 220 580, 480 720, 840 590 C 1100 490, 1320 540, 1600 580"
                fill="none"
                stroke="url(#goldWave1)"
                strokeWidth="2"
              />

              {/* Sweeping Golden Flow Wave 2 */}
              <path
                d="M -80 740 C 260 660, 560 780, 920 670 C 1220 580, 1420 630, 1680 660"
                fill="none"
                stroke="url(#goldWave2)"
                strokeWidth="1.5"
              />

              {/* Golden Upper Orbit Arc behind bot */}
              <ellipse
                cx="1100"
                cy="260"
                rx="460"
                ry="180"
                fill="none"
                stroke="rgba(245, 158, 11, 0.15)"
                strokeWidth="1.2"
                strokeDasharray="6 6"
              />

              {/* Scattered 4-Point Golden Sparkle Stars matching the reference image */}
              <g transform="translate(80, 110)">
                <path d="M 0 -10 Q 0 0, -10 0 Q 0 0, 0 10 Q 0 0, 10 0 Q 0 0, 0 -10 Z" fill="#FDE68A" opacity="0.85" />
              </g>
              <g transform="translate(480, 140)">
                <path d="M 0 -8 Q 0 0, -8 0 Q 0 0, 0 8 Q 0 0, 8 0 Q 0 0, 0 -8 Z" fill="#FDE68A" opacity="0.9" />
              </g>
              <g transform="translate(780, 110)">
                <path d="M 0 -9 Q 0 0, -9 0 Q 0 0, 0 9 Q 0 0, 9 0 Q 0 0, 0 -9 Z" fill="#FDE68A" opacity="0.9" />
              </g>
              <g transform="translate(980, 130)">
                <path d="M 0 -7 Q 0 0, -7 0 Q 0 0, 0 7 Q 0 0, 7 0 Q 0 0, 0 -7 Z" fill="#FCD34D" opacity="0.75" />
              </g>
              <g transform="translate(180, 480)">
                <path d="M 0 -7 Q 0 0, -7 0 Q 0 0, 0 7 Q 0 0, 7 0 Q 0 0, 0 -7 Z" fill="#FDE68A" opacity="0.75" />
              </g>
            </svg>
          </div>
        )}
        {/* ============================================================== */}
        {/* BOX 1 CONTENT: LARGER PANEL (FLEX: 7) - QUIZZES                */}
        {/* ============================================================== */}
        <QuizCatalog model={model} />

        {/* ============================================================== */}
        {/* BOX 1 SIDE: SMALLER PANEL - QUIZ BOT (DESKTOP ONLY)             */}
        {/* ============================================================== */}
        {!isMobile && (
          <div className="box1-side">
            {/* Interactive Particle Bot Canvas (Golden & White Particles, No Obscuring Glow) */}
            <div style={inlineStyles.s41}>
              <VedikaParticleBot
                src="/vedika-bot-quiz.png?v=12"
                colorMode="golden"
                width={460}
                height={400}
                inline={true}
                particleStep={2}
              />
            </div>

            {/* Mode Switch Pill */}
            <div style={inlineStyles.s42}>
              <button
                type="button"
                onClick={() => setActiveTab('assignments')}
                style={inlineStyles.s43}
                onMouseEnter={(e) => {
                  e.currentTarget.style.background = 'rgba(245, 158, 11, 0.2)';
                  e.currentTarget.style.borderColor = 'rgba(245, 158, 11, 0.55)';
                  e.currentTarget.style.color = '#FFFFFF';
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.background = 'rgba(245, 158, 11, 0.1)';
                  e.currentTarget.style.borderColor = 'rgba(245, 158, 11, 0.35)';
                  e.currentTarget.style.color = '#FDE68A';
                }}
              >
                <span>Assignments Mode</span>
                <ChevronRight size={14} color="#F59E0B" />
              </button>
            </div>
          </div>
        )}

        {/* ============================================================== */}
        {/* BOX 2 SIDE: SMALLER PANEL - ASSIGNMENT BOT (DESKTOP ONLY)       */}
        {/* ============================================================== */}
        {!isMobile && (
          <div className="box2-side">
            {/* Interactive Particle Bot Canvas (Cosmic Purple & White Ultra-Crisp Micro-Particles) */}
            <div style={inlineStyles.s44}>
              <VedikaParticleBot
                src="/vedika-bot-assignment.png?v=12"
                colorMode="cosmic-purple"
                width={460}
                height={400}
                inline={true}
                particleStep={2}
              />
            </div>

            {/* Mode Switch Pill */}
            <div style={inlineStyles.s45}>
              <button
                type="button"
                onClick={() => setActiveTab('quizzes')}
                style={inlineStyles.s46}
                onMouseEnter={(e) => {
                  e.currentTarget.style.background = 'rgba(168, 85, 247, 0.22)';
                  e.currentTarget.style.borderColor = 'rgba(192, 132, 252, 0.6)';
                  e.currentTarget.style.color = '#FFFFFF';
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.background = 'rgba(168, 85, 247, 0.1)';
                  e.currentTarget.style.borderColor = 'rgba(168, 85, 247, 0.35)';
                  e.currentTarget.style.color = '#E9D5FF';
                }}
              >
                <ArrowLeft size={14} color="#C084FC" />
                <span>Quizzes Mode</span>
              </button>
            </div>
          </div>
        )}

        {/* ============================================================== */}
        {/* BOX 2 CONTENT: LARGER PANEL - ASSIGNMENTS                      */}
        {/* ============================================================== */}
        <AssignmentCatalog model={model} />
      </div>

      {/* ============================================================== */}
      {/* MODAL: ATTEMPT QUIZ                                            */}
      {/* ============================================================== */}
      {isAttemptingQuiz && selectedQuiz && <QuizAttempt model={model} />}

      {/* ============================================================== */}
      {/* MODAL: VIEW / SUBMIT ASSIGNMENT                                */}
      {/* ============================================================== */}
      {isViewingAssignmentPrompt && selectedAssignment && <AssignmentSubmission model={model} />}
    </div>
  );

}
