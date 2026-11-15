'use client';
import * as featureStyleFunctions from '@/features/assessments/quizzes/styles/QuizAttempt.dynamic.styles.js';
import inlineStyles from '@/features/assessments/quizzes/styles/QuizAttempt.styles.js';
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
export default function QuizAttempt({model}) {
const {loadError,router,isMobile,activeTab,setActiveTab,isAssignmentsOpen,currentUser,setCurrentUser,courses,setCourses,loading,setLoading,quizzes,setQuizzes,quizSubmissions,setQuizSubmissions,selectedQuizCategory,setSelectedQuizCategory,quizSearch,setQuizSearch,quizPage,setQuizPage,QUIZ_ITEMS_PER_PAGE,selectedQuiz,setSelectedQuiz,isAttemptingQuiz,setIsAttemptingQuiz,currentQuizQIdx,setCurrentQuizQIdx,quizAnswers,setQuizAnswers,submittingQuiz,setSubmittingQuiz,quizScore,setQuizScore,assignments,setAssignments,assignmentSubmissions,setAssignmentSubmissions,selectedAssignmentCategory,setSelectedAssignmentCategory,assignmentSearch,setAssignmentSearch,assignmentCourseFilter,setAssignmentCourseFilter,assignmentChapterFilter,setAssignmentChapterFilter,assignmentPage,setAssignmentPage,ASSIGNMENT_ITEMS_PER_PAGE,selectedAssignment,setSelectedAssignment,isViewingAssignmentPrompt,setIsViewingAssignmentPrompt,activeAssignmentQIdx,setActiveAssignmentQIdx,assignmentAnswers,setAssignmentAnswers,submittingAssignment,setSubmittingAssignment,assignmentSuccessMsg,setAssignmentSuccessMsg,isEditingSubmission,setIsEditingSubmission,existingUserSub,getCourseName,getItemCategory,getQuizStatus,quizCategoryShowcaseItems,filteredQuizzes,totalQuizPages,paginatedQuizzes,handleStartAttempt,handleSelectQuizOption,handleQuizSubmit,getAssignmentStatus,assignmentCategoryShowcaseItems,categoryFilteredCourses,uniqueChapters,filteredAssignments,totalAssignmentPages,paginatedAssignments,handleOpenAssignmentPrompt,handleAssignmentSubmit}=model;
return (<div style={featureStyleFunctions.s11({isMobile})}>
          <div style={inlineStyles.s87}>
            <div style={inlineStyles.s88}>
              <div>
                <h2 style={inlineStyles.s89}>
                  {selectedQuiz.title}
                </h2>
                <span style={inlineStyles.s90}>
                  Passing rate requirement: {selectedQuiz.passing_percentage || 70}%
                </span>
              </div>
              <button
                onClick={() => setIsAttemptingQuiz(false)}
                style={inlineStyles.s91}
              >
                <X size={20} />
              </button>
            </div>

            <div style={inlineStyles.s92}>
              {quizScore ? (
                <div style={inlineStyles.s93}>
                  <div style={featureStyleFunctions.s12({quizScore})}>
                    <Award size={28} color={quizScore.passed ? '#10B981' : '#EF4444'} />
                  </div>
                  <h3 style={inlineStyles.s94}>
                    {quizScore.passed ? 'Congratulations! You Passed' : 'Quiz Attempt Failed'}
                  </h3>
                  <p style={inlineStyles.s95}>
                    You scored {quizScore.score} out of {quizScore.total} questions ({quizScore.percentage}%)
                  </p>
                  <div style={inlineStyles.s96}>
                    {!quizScore.passed && (
                      <button
                        onClick={() => handleStartAttempt(selectedQuiz)}
                        style={inlineStyles.s97}
                      >
                        Try Again
                      </button>
                    )}
                    <button
                      onClick={() => setIsAttemptingQuiz(false)}
                      style={inlineStyles.s98}
                    >
                      Close Window
                    </button>
                  </div>
                </div>
              ) : (
                <div>
                  <div style={inlineStyles.s99}>
                    <span style={inlineStyles.s100}>
                      Question {currentQuizQIdx + 1} of {selectedQuiz.questions.length}
                    </span>
                    <span style={inlineStyles.s101}>
                      {selectedQuiz.duration || '10 mins'}
                    </span>
                  </div>

                  <h3 style={inlineStyles.s102}>
                    {selectedQuiz.questions[currentQuizQIdx]?.question}
                  </h3>

                  <div style={inlineStyles.s103}>
                    {selectedQuiz.questions[currentQuizQIdx]?.options?.map((opt, oIdx) => {
                      const isSelected = quizAnswers[currentQuizQIdx] === oIdx;
                      return (
                        <button
                          key={oIdx}
                          onClick={() => handleSelectQuizOption(oIdx)}
                          style={featureStyleFunctions.s13({isSelected})}
                        >
                          <div style={featureStyleFunctions.s14({isSelected})}>
                            {isSelected && <div style={inlineStyles.s104} />}
                          </div>
                          <span>{opt}</span>
                        </button>
                      );
                    })}
                  </div>

                  <div style={inlineStyles.s105}>
                    <button
                      onClick={() => setCurrentQuizQIdx((i) => Math.max(0, i - 1))}
                      disabled={currentQuizQIdx === 0}
                      style={featureStyleFunctions.s15({currentQuizQIdx})}
                    >
                      Previous
                    </button>

                    {currentQuizQIdx < selectedQuiz.questions.length - 1 ? (
                      <button
                        onClick={() => setCurrentQuizQIdx((i) => i + 1)}
                        style={inlineStyles.s106}
                      >
                        Next
                      </button>
                    ) : (
                      <button
                        onClick={handleQuizSubmit}
                        disabled={submittingQuiz || quizAnswers.includes(null)}
                        style={featureStyleFunctions.s16({submittingQuiz,quizAnswers})}
                      >
                        {submittingQuiz ? 'Submitting...' : 'Finish & Submit'}
                      </button>
                    )}
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>);
}
