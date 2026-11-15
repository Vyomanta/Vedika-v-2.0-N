'use client';
import * as featureStyleFunctions from '@/features/assessments/quizzes/styles/QuizCatalog.dynamic.styles.js';
import inlineStyles from '@/features/assessments/quizzes/styles/QuizCatalog.styles.js';
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
export default function QuizCatalog({model}) {
const {loadError,router,isMobile,activeTab,setActiveTab,isAssignmentsOpen,currentUser,setCurrentUser,courses,setCourses,loading,setLoading,quizzes,setQuizzes,quizSubmissions,setQuizSubmissions,selectedQuizCategory,setSelectedQuizCategory,quizSearch,setQuizSearch,quizPage,setQuizPage,QUIZ_ITEMS_PER_PAGE,selectedQuiz,setSelectedQuiz,isAttemptingQuiz,setIsAttemptingQuiz,currentQuizQIdx,setCurrentQuizQIdx,quizAnswers,setQuizAnswers,submittingQuiz,setSubmittingQuiz,quizScore,setQuizScore,assignments,setAssignments,assignmentSubmissions,setAssignmentSubmissions,selectedAssignmentCategory,setSelectedAssignmentCategory,assignmentSearch,setAssignmentSearch,assignmentCourseFilter,setAssignmentCourseFilter,assignmentChapterFilter,setAssignmentChapterFilter,assignmentPage,setAssignmentPage,ASSIGNMENT_ITEMS_PER_PAGE,selectedAssignment,setSelectedAssignment,isViewingAssignmentPrompt,setIsViewingAssignmentPrompt,activeAssignmentQIdx,setActiveAssignmentQIdx,assignmentAnswers,setAssignmentAnswers,submittingAssignment,setSubmittingAssignment,assignmentSuccessMsg,setAssignmentSuccessMsg,isEditingSubmission,setIsEditingSubmission,existingUserSub,getCourseName,getItemCategory,getQuizStatus,quizCategoryShowcaseItems,filteredQuizzes,totalQuizPages,paginatedQuizzes,handleStartAttempt,handleSelectQuizOption,handleQuizSubmit,getAssignmentStatus,assignmentCategoryShowcaseItems,categoryFilteredCourses,uniqueChapters,filteredAssignments,totalAssignmentPages,paginatedAssignments,handleOpenAssignmentPrompt,handleAssignmentSubmit}=model;
return (<div className="box1-content">
          {/* STAGE 1: QUIZZES CATEGORY CAROUSEL */}
          {!selectedQuizCategory ? (
            <div style={inlineStyles.s3}>
              <div style={inlineStyles.s4}>
                <button
                  type="button"
                  onClick={() => router.push('/')}
                  style={inlineStyles.s5}
                  title="Back to Dashboard"
                >
                  <ArrowLeft size={14} />
                  <span>Back</span>
                </button>
              </div>
              <div style={featureStyleFunctions.s1({isMobile})}>
                <h1 style={featureStyleFunctions.s2({isMobile})}>
                  <span>Course</span>
                  <span style={inlineStyles.s6}>
                    Quizzes
                  </span>
                </h1>
                <p style={featureStyleFunctions.s3({isMobile})}>
                  Select a subject domain to enter quizzes and test your knowledge.
                </p>
              </div>

              {/* Mobile: Particle Animation ON TOP */}
              {isMobile && (
                <div style={inlineStyles.s7}>
                  <VedikaParticleBot
                    src="/vedika-bot-quiz.png?v=12"
                    colorMode="golden"
                    width={270}
                    height={195}
                    inline={true}
                    particleStep={2}
                  />
                </div>
              )}

              {/* Cards Carousel BELOW particle bot on mobile */}
              <CategoryShowcaseCarousel
                items={quizCategoryShowcaseItems}
                itemTypeLabel="Quizzes"
                theme="gold"
                onSelectCategory={(cat) => {
                  setSelectedQuizCategory(cat);
                  setQuizPage(1);
                }}
              />

              {/* Mobile: Mode Switch Button BELOW cards */}
              {isMobile && (
                <div style={inlineStyles.s8}>
                  <button
                    type="button"
                    onClick={() => setActiveTab('assignments')}
                    style={inlineStyles.s9}
                  >
                    <span>Assignments Mode</span>
                    <ChevronRight size={15} color="#F59E0B" />
                  </button>
                </div>
              )}
            </div>
          ) : (
            /* STAGE 2: QUIZZES DRILLDOWN */
            <div style={inlineStyles.s10}>
              {/* Drilldown Top Bar */}
              <div>
                <div style={inlineStyles.s11}>
                  <div style={inlineStyles.s12}>
                    <button
                      onClick={() => {
                        setSelectedQuizCategory(null);
                        setQuizPage(1);
                        setQuizSearch('');
                      }}
                      style={inlineStyles.s13}
                    >
                      <ArrowLeft size={14} />
                      <span>Back to Domains</span>
                    </button>

                    <h2 style={inlineStyles.s14}>
                      {selectedQuizCategory}
                    </h2>
                    <span style={inlineStyles.s15}>
                      {filteredQuizzes.length} Quizzes
                    </span>
                  </div>

                  {/* Search Bar */}
                  <div style={inlineStyles.s16}>
                    <Search size={14} color="#F59E0B" style={inlineStyles.s17} />
                    <input
                      type="text"
                      placeholder="Search quizzes..."
                      value={quizSearch}
                      onChange={(e) => setQuizSearch(e.target.value)}
                      style={inlineStyles.s18}
                    />
                    {quizSearch && (
                      <button
                        onClick={() => setQuizSearch('')}
                        style={inlineStyles.s19}
                      >
                        <X size={13} />
                      </button>
                    )}
                  </div>
                </div>

                {/* Cards Grid */}
                {loading ? (
                  <div style={inlineStyles.s20}>
                    <div style={inlineStyles.s21} />
                  </div>
                ) : filteredQuizzes.length === 0 ? (
                  <div style={inlineStyles.s22}>
                    <Award size={36} color="#F59E0B" style={inlineStyles.s23} />
                    <h4 style={inlineStyles.s24}>No Quizzes Found</h4>
                    <p style={inlineStyles.s25}>No quizzes match your search query in {selectedQuizCategory}.</p>
                  </div>
                ) : (
                  <div style={featureStyleFunctions.s4({isMobile})}>
                    {paginatedQuizzes.map((quiz) => {
                      const qStatus = getQuizStatus(quiz.id);
                      return (
                        <div
                          key={quiz.id}
                          style={inlineStyles.s26}
                        >
                          <div>
                            <div style={inlineStyles.s27}>
                              <span style={inlineStyles.s28}>
                                📚 {getCourseName(quiz.course)}
                              </span>
                              {quiz.chapter && (
                                <span style={inlineStyles.s29}>
                                  Ch: {quiz.chapter}
                                </span>
                              )}
                            </div>

                            <h3 style={inlineStyles.s30}>
                              {quiz.title}
                            </h3>

                            <div style={inlineStyles.s31}>
                              <div style={inlineStyles.s32}>
                                <Clock size={12} color="#F59E0B" />
                                <span>{quiz.duration || '10 mins'}</span>
                              </div>
                              <div style={inlineStyles.s33}>
                                <HelpCircle size={12} color="#F59E0B" />
                                <span>{quiz.questions?.length || 5} Questions</span>
                              </div>
                            </div>

                            <div style={inlineStyles.s34}>
                              Pass Score: <strong style={inlineStyles.s35}>{quiz.passing_percentage || 70}%</strong>
                            </div>
                          </div>

                          <div style={inlineStyles.s36}>
                            <div>
                              {qStatus.status === 'Passed' && (
                                <span style={inlineStyles.s37}>
                                  <CheckCircle size={13} /> {qStatus.percentage}%
                                </span>
                              )}
                              {qStatus.status === 'Failed' && (
                                <span style={inlineStyles.s38}>
                                  Failed ({qStatus.percentage}%)
                                </span>
                              )}
                              {qStatus.status === 'Not Attempted' && (
                                <span style={inlineStyles.s39}>
                                  Not Attempted
                                </span>
                              )}
                            </div>

                            <button
                              onClick={() => handleStartAttempt(quiz)}
                              style={featureStyleFunctions.s5({qStatus})}
                            >
                              <span>{qStatus.status === 'Passed' ? 'Retake' : 'Start'}</span>
                              <ChevronRight size={13} />
                            </button>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                )}
              </div>

              {/* Pacman Pagination */}
              {totalQuizPages > 1 && (
                <div style={inlineStyles.s40}>
                  <PacmanPagination
                    currentPage={quizPage}
                    totalPages={totalQuizPages}
                    onPageChange={(p) => setQuizPage(p)}
                  />
                </div>
              )}
            </div>
          )}
        </div>);
}
