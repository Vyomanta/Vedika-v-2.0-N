'use client';
import * as featureStyleFunctions from '@/features/assessments/assignments/styles/AssignmentCatalog.dynamic.styles.js';
import inlineStyles from '@/features/assessments/assignments/styles/AssignmentCatalog.styles.js';
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
export default function AssignmentCatalog({model}) {
const {loadError,router,isMobile,activeTab,setActiveTab,isAssignmentsOpen,currentUser,setCurrentUser,courses,setCourses,loading,setLoading,quizzes,setQuizzes,quizSubmissions,setQuizSubmissions,selectedQuizCategory,setSelectedQuizCategory,quizSearch,setQuizSearch,quizPage,setQuizPage,QUIZ_ITEMS_PER_PAGE,selectedQuiz,setSelectedQuiz,isAttemptingQuiz,setIsAttemptingQuiz,currentQuizQIdx,setCurrentQuizQIdx,quizAnswers,setQuizAnswers,submittingQuiz,setSubmittingQuiz,quizScore,setQuizScore,assignments,setAssignments,assignmentSubmissions,setAssignmentSubmissions,selectedAssignmentCategory,setSelectedAssignmentCategory,assignmentSearch,setAssignmentSearch,assignmentCourseFilter,setAssignmentCourseFilter,assignmentChapterFilter,setAssignmentChapterFilter,assignmentPage,setAssignmentPage,ASSIGNMENT_ITEMS_PER_PAGE,selectedAssignment,setSelectedAssignment,isViewingAssignmentPrompt,setIsViewingAssignmentPrompt,activeAssignmentQIdx,setActiveAssignmentQIdx,assignmentAnswers,setAssignmentAnswers,submittingAssignment,setSubmittingAssignment,assignmentSuccessMsg,setAssignmentSuccessMsg,isEditingSubmission,setIsEditingSubmission,existingUserSub,getCourseName,getItemCategory,getQuizStatus,quizCategoryShowcaseItems,filteredQuizzes,totalQuizPages,paginatedQuizzes,handleStartAttempt,handleSelectQuizOption,handleQuizSubmit,getAssignmentStatus,assignmentCategoryShowcaseItems,categoryFilteredCourses,uniqueChapters,filteredAssignments,totalAssignmentPages,paginatedAssignments,handleOpenAssignmentPrompt,handleAssignmentSubmit}=model;
return (<div className="box2-content">
          {/* STAGE 1: ASSIGNMENTS CATEGORY CAROUSEL */}
          {!selectedAssignmentCategory ? (
            <div style={inlineStyles.s47}>
              <div style={inlineStyles.s48}>
                <button
                  type="button"
                  onClick={() => router.push('/')}
                  style={inlineStyles.s49}
                  title="Back to Dashboard"
                >
                  <ArrowLeft size={14} />
                  <span>Back</span>
                </button>
              </div>
              <div style={featureStyleFunctions.s6({isMobile})}>
                <h1 style={featureStyleFunctions.s7({isMobile})}>
                  <span>Course</span>
                  <span style={inlineStyles.s50}>
                    Assignments
                  </span>
                </h1>
                <p style={featureStyleFunctions.s8({isMobile})}>
                  Select a subject domain to view and submit your assignments.
                </p>
              </div>

              {/* Cards Carousel ON TOP (above bot) on mobile */}
              <CategoryShowcaseCarousel
                items={assignmentCategoryShowcaseItems}
                itemTypeLabel="Assignments"
                theme="purple"
                onSelectCategory={(cat) => {
                  setSelectedAssignmentCategory(cat);
                  setAssignmentPage(1);
                }}
              />

              {/* Mobile: Cosmic Purple Particle Animation BELOW cards */}
              {isMobile && (
                <div style={inlineStyles.s51}>
                  <VedikaParticleBot
                    src="/vedika-bot-assignment.png?v=12"
                    colorMode="cosmic-purple"
                    width={270}
                    height={195}
                    inline={true}
                    particleStep={2}
                  />
                </div>
              )}

              {/* Mobile: Mode Switch Button BELOW particle bot */}
              {isMobile && (
                <div style={inlineStyles.s52}>
                  <button
                    type="button"
                    onClick={() => setActiveTab('quizzes')}
                    style={inlineStyles.s53}
                  >
                    <ArrowLeft size={15} color="#C084FC" />
                    <span>Quizzes Mode</span>
                  </button>
                </div>
              )}
            </div>
          ) : (
            /* STAGE 2: ASSIGNMENTS DRILLDOWN */
            <div style={inlineStyles.s54}>
              <div>
                {/* Drilldown Top Bar */}
                <div style={inlineStyles.s55}>
                  <div style={inlineStyles.s56}>
                    <button
                      onClick={() => {
                        setSelectedAssignmentCategory(null);
                        setAssignmentPage(1);
                        setAssignmentSearch('');
                        setAssignmentCourseFilter('all');
                        setAssignmentChapterFilter('all');
                      }}
                      style={inlineStyles.s57}
                    >
                      <ArrowLeft size={14} />
                      <span>Back to Domains</span>
                    </button>

                    <h2 style={inlineStyles.s58}>
                      {selectedAssignmentCategory}
                    </h2>
                    <span style={inlineStyles.s59}>
                      {filteredAssignments.length} Assignments
                    </span>
                  </div>

                  {/* Filter & Search Bar */}
                  <div style={inlineStyles.s60}>
                    {/* Course Filter */}
                    <select
                      value={assignmentCourseFilter}
                      onChange={(e) => setAssignmentCourseFilter(e.target.value)}
                      style={inlineStyles.s61}
                    >
                      <option value="all">All Courses</option>
                      {categoryFilteredCourses.map((c) => (
                        <option key={c.id} value={c.id}>{c.title}</option>
                      ))}
                    </select>

                    {/* Chapter Filter */}
                    <select
                      value={assignmentChapterFilter}
                      onChange={(e) => setAssignmentChapterFilter(e.target.value)}
                      style={inlineStyles.s62}
                    >
                      <option value="all">All Chapters</option>
                      {uniqueChapters.map((ch) => (
                        <option key={ch} value={ch}>Chapter {ch}</option>
                      ))}
                    </select>

                    {/* Search Input */}
                    <div style={inlineStyles.s63}>
                      <Search size={14} color="#C084FC" style={inlineStyles.s64} />
                      <input
                        type="text"
                        placeholder="Search assignments..."
                        value={assignmentSearch}
                        onChange={(e) => setAssignmentSearch(e.target.value)}
                        style={inlineStyles.s65}
                      />
                    </div>
                  </div>
                </div>

                {/* Cards Grid */}
                {loading ? (
                  <div style={inlineStyles.s66}>
                    <div style={inlineStyles.s67} />
                  </div>
                ) : filteredAssignments.length === 0 ? (
                  <div style={inlineStyles.s68}>
                    <FileText size={36} color="#A855F7" style={inlineStyles.s69} />
                    <h4 style={inlineStyles.s70}>No Assignments Found</h4>
                    <p style={inlineStyles.s71}>No assignments found matching your filter selections.</p>
                  </div>
                ) : (
                  <div style={featureStyleFunctions.s9({isMobile})}>
                    {paginatedAssignments.map((ass) => {
                      const aStatus = getAssignmentStatus(ass.id);
                      return (
                        <div
                          key={ass.id}
                          style={inlineStyles.s72}
                        >
                          <div>
                            <div style={inlineStyles.s73}>
                              <span style={inlineStyles.s74}>
                                📚 {getCourseName(ass.course)}
                              </span>
                              {ass.chapter && (
                                <span style={inlineStyles.s75}>
                                  Ch: {ass.chapter}
                                </span>
                              )}
                            </div>

                            <h3 style={inlineStyles.s76}>
                              {ass.title}
                            </h3>

                            <div style={inlineStyles.s77}>
                              <div style={inlineStyles.s78}>
                                <Clock size={12} color="#A855F7" />
                                <span>{ass.type || 'Written Task'}</span>
                              </div>
                              <div style={inlineStyles.s79}>
                                <FileText size={12} color="#A855F7" />
                                <span>{ass.questions?.length || 1} Prompts</span>
                              </div>
                            </div>

                            <div style={inlineStyles.s80}>
                              Min Response: <strong style={inlineStyles.s81}>{ass.min_char_count || 20} chars</strong>
                            </div>
                          </div>

                          <div style={inlineStyles.s82}>
                            <div>
                              {aStatus.graded ? (
                                <span style={inlineStyles.s83}>
                                  <CheckCircle size={13} /> Graded: {aStatus.score}/{aStatus.max_score}
                                </span>
                              ) : aStatus.status.startsWith('Submitted') ? (
                                <span style={inlineStyles.s84}>
                                  Submitted (Review)
                                </span>
                              ) : (
                                <span style={inlineStyles.s85}>
                                  Not Submitted
                                </span>
                              )}
                            </div>

                            <button
                              onClick={() => handleOpenAssignmentPrompt(ass)}
                              style={featureStyleFunctions.s10({aStatus})}
                            >
                              <span>{aStatus.status !== 'Not Submitted' ? 'View Work' : 'Solve'}</span>
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
              {totalAssignmentPages > 1 && (
                <div style={inlineStyles.s86}>
                  <PacmanPagination
                    currentPage={assignmentPage}
                    totalPages={totalAssignmentPages}
                    onPageChange={(p) => setAssignmentPage(p)}
                  />
                </div>
              )}
            </div>
          )}
        </div>);
}
