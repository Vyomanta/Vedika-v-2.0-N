'use client';
import * as featureStyleFunctions from '@/features/assessments/assignments/styles/AssignmentSubmission.dynamic.styles.js';
import inlineStyles from '@/features/assessments/assignments/styles/AssignmentSubmission.styles.js';
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
export default function AssignmentSubmission({model}) {
const {loadError,router,isMobile,activeTab,setActiveTab,isAssignmentsOpen,currentUser,setCurrentUser,courses,setCourses,loading,setLoading,quizzes,setQuizzes,quizSubmissions,setQuizSubmissions,selectedQuizCategory,setSelectedQuizCategory,quizSearch,setQuizSearch,quizPage,setQuizPage,QUIZ_ITEMS_PER_PAGE,selectedQuiz,setSelectedQuiz,isAttemptingQuiz,setIsAttemptingQuiz,currentQuizQIdx,setCurrentQuizQIdx,quizAnswers,setQuizAnswers,submittingQuiz,setSubmittingQuiz,quizScore,setQuizScore,assignments,setAssignments,assignmentSubmissions,setAssignmentSubmissions,selectedAssignmentCategory,setSelectedAssignmentCategory,assignmentSearch,setAssignmentSearch,assignmentCourseFilter,setAssignmentCourseFilter,assignmentChapterFilter,setAssignmentChapterFilter,assignmentPage,setAssignmentPage,ASSIGNMENT_ITEMS_PER_PAGE,selectedAssignment,setSelectedAssignment,isViewingAssignmentPrompt,setIsViewingAssignmentPrompt,activeAssignmentQIdx,setActiveAssignmentQIdx,assignmentAnswers,setAssignmentAnswers,submittingAssignment,setSubmittingAssignment,assignmentSuccessMsg,setAssignmentSuccessMsg,isEditingSubmission,setIsEditingSubmission,existingUserSub,getCourseName,getItemCategory,getQuizStatus,quizCategoryShowcaseItems,filteredQuizzes,totalQuizPages,paginatedQuizzes,handleStartAttempt,handleSelectQuizOption,handleQuizSubmit,getAssignmentStatus,assignmentCategoryShowcaseItems,categoryFilteredCourses,uniqueChapters,filteredAssignments,totalAssignmentPages,paginatedAssignments,handleOpenAssignmentPrompt,handleAssignmentSubmit}=model;
return (<div style={featureStyleFunctions.s17({isMobile})}>
          <div style={inlineStyles.s107}>
            <div style={inlineStyles.s108}>
              <div>
                <h2 style={inlineStyles.s109}>
                  {selectedAssignment.title}
                </h2>
                <span style={inlineStyles.s110}>
                  {getCourseName(selectedAssignment.course)} • {selectedAssignment.type || 'Text Submission'}
                </span>
              </div>
              <button
                onClick={() => setIsViewingAssignmentPrompt(false)}
                style={inlineStyles.s111}
              >
                <X size={20} />
              </button>
            </div>

            <div style={inlineStyles.s112}>
              {assignmentSuccessMsg ? (
                <div style={inlineStyles.s113}>
                  <div style={inlineStyles.s114}>
                    <CheckCircle size={30} color="#10B981" />
                  </div>
                  <h3 style={inlineStyles.s115}>
                    Assignment Submitted
                  </h3>
                  <p style={inlineStyles.s116}>
                    {assignmentSuccessMsg}
                  </p>
                  <button
                    onClick={() => setIsViewingAssignmentPrompt(false)}
                    style={inlineStyles.s117}
                  >
                    Done
                  </button>
                </div>
              ) : (
                <form onSubmit={handleAssignmentSubmit}>
                  {/* Status Banner for Existing Submission */}
                  {existingUserSub && (
                    <div style={featureStyleFunctions.s18({existingUserSub,selectedAssignment})}>
                      <div style={featureStyleFunctions.s19({existingUserSub})}>
                        <span style={featureStyleFunctions.s20({existingUserSub,selectedAssignment})}>
                          {existingUserSub.status ? `Status: ${existingUserSub.status}` : 'Submission Received'}
                          {existingUserSub.score !== undefined && ` (${existingUserSub.score}%)`}
                        </span>
                        {existingUserSub.evaluator && (
                          <span style={inlineStyles.s118}>Evaluated by {existingUserSub.evaluator}</span>
                        )}
                      </div>
                      {existingUserSub.comments && (
                        <p style={inlineStyles.s119}>
                          <strong>Feedback:</strong> {existingUserSub.comments}
                        </p>
                      )}
                    </div>
                  )}

                  {/* Multi-question tabs if > 1 question */}
                  {selectedAssignment.questions?.length > 1 && (
                    <div style={inlineStyles.s120}>
                      {selectedAssignment.questions.map((_, qIdx) => (
                        <button
                          key={qIdx}
                          type="button"
                          onClick={() => setActiveAssignmentQIdx(qIdx)}
                          style={featureStyleFunctions.s21({activeAssignmentQIdx,qIdx})}
                        >
                          Question {qIdx + 1}
                        </button>
                      ))}
                    </div>
                  )}

                  {/* Question Prompt */}
                  <div style={inlineStyles.s121}>
                    <span style={inlineStyles.s122}>
                      Task Instruction {selectedAssignment.questions?.length > 1 ? `(Question ${activeAssignmentQIdx + 1} of ${selectedAssignment.questions.length})` : ''}
                    </span>
                    {(() => {
                      const curQ = selectedAssignment.questions?.[activeAssignmentQIdx] || selectedAssignment.question;
                      const promptText = (typeof curQ === 'object' && curQ !== null)
                        ? (curQ.prompt || curQ.question || curQ.title || '')
                        : (curQ || '');
                      return (
                        <div style={inlineStyles.s123}>
                          <ReactMarkdown>
                            {promptText}
                          </ReactMarkdown>
                        </div>
                      );
                    })()}
                  </div>

                  {/* Evaluation Criteria if present */}
                  {Array.isArray(selectedAssignment.evaluation_criteria) && selectedAssignment.evaluation_criteria.length > 0 && (
                    <div style={inlineStyles.s124}>
                      <span style={inlineStyles.s125}>
                        Evaluation Criteria (Passing threshold: {selectedAssignment.pass_threshold || 70}%)
                      </span>
                      <ul style={inlineStyles.s126}>
                        {selectedAssignment.evaluation_criteria.map((crit, idx) => (
                          <li key={idx} style={inlineStyles.s127}>{typeof crit === 'string' ? crit : JSON.stringify(crit)}</li>
                        ))}
                      </ul>
                    </div>
                  )}

                  {/* Reference / Sample Answer if show_answer is true and student has submitted */}
                  {selectedAssignment.show_answer && existingUserSub && (
                    <div style={inlineStyles.s128}>
                      <span style={inlineStyles.s129}>
                        Reference Solution {selectedAssignment.questions?.length > 1 ? `(Question ${activeAssignmentQIdx + 1})` : ''}
                      </span>
                      <pre style={inlineStyles.s130}>
                        {(() => {
                          const curQ = selectedAssignment.questions?.[activeAssignmentQIdx];
                          return (curQ && typeof curQ === 'object' && curQ.sample_answer)
                            ? curQ.sample_answer
                            : (selectedAssignment.answer || 'No sample answer provided.');
                        })()}
                      </pre>
                    </div>
                  )}

                  {/* View Work Mode vs Active Submit Form Mode */}
                  {!isEditingSubmission && existingUserSub ? (
                    <div>
                      {/* Submitted Response Display Box */}
                      <div style={inlineStyles.s131}>
                        <div style={inlineStyles.s132}>
                          <label style={inlineStyles.s133}>
                            <CheckCircle size={14} color="#10B981" />
                            <span>Your Submitted Response {selectedAssignment.questions?.length > 1 ? `(Question ${activeAssignmentQIdx + 1})` : ''}</span>
                          </label>
                          {existingUserSub.timestamp && (
                            <span style={inlineStyles.s134}>
                              Submitted: {new Date(existingUserSub.timestamp).toLocaleString()}
                            </span>
                          )}
                        </div>

                        <div style={featureStyleFunctions.s22({selectedAssignment})}>
                          {assignmentAnswers[activeAssignmentQIdx] || existingUserSub.answer || 'No response recorded.'}
                        </div>
                        <div style={inlineStyles.s135}>
                          <span>Character count: {(assignmentAnswers[activeAssignmentQIdx] || existingUserSub.answer || '').length}</span>
                          <span style={inlineStyles.s136}>✓ Recorded on Server</span>
                        </div>
                      </div>

                      {/* View Work Mode Action Buttons */}
                      <div style={inlineStyles.s137}>
                        <button
                          type="button"
                          onClick={() => setIsEditingSubmission(true)}
                          style={inlineStyles.s138}
                        >
                          <Edit2 size={13} />
                          <span>Edit / Resubmit Answer</span>
                        </button>

                        <button
                          type="button"
                          onClick={() => setIsViewingAssignmentPrompt(false)}
                          style={inlineStyles.s139}
                        >
                          Done
                        </button>
                      </div>
                    </div>
                  ) : (
                    <div>
                      {/* Textarea */}
                      <div style={inlineStyles.s140}>
                        <label style={inlineStyles.s141}>
                          Your Solution Response {selectedAssignment.questions?.length > 1 ? `(Question ${activeAssignmentQIdx + 1})` : ''}:
                        </label>
                        <textarea
                          rows={6}
                          value={assignmentAnswers[activeAssignmentQIdx] || ''}
                          onChange={(e) => {
                            setAssignmentAnswers({
                              ...assignmentAnswers,
                              [activeAssignmentQIdx]: e.target.value
                            });
                          }}
                          placeholder="Write your comprehensive response or paste code solution..."
                          style={inlineStyles.s142}
                        />
                        <div style={inlineStyles.s143}>
                          <span>Character count: {(assignmentAnswers[activeAssignmentQIdx] || '').length}</span>
                          <span>Min requirement: {selectedAssignment.min_char_count || 20} chars</span>
                        </div>
                      </div>

                      <div style={inlineStyles.s144}>
                        <button
                          type="button"
                          onClick={() => {
                            if (existingUserSub) {
                              setIsEditingSubmission(false);
                            } else {
                              setIsViewingAssignmentPrompt(false);
                            }
                          }}
                          style={inlineStyles.s145}
                        >
                          Cancel
                        </button>
                        <button
                          type="submit"
                          disabled={submittingAssignment}
                          style={featureStyleFunctions.s23({submittingAssignment})}
                        >
                          <Send size={13} />
                          <span>{submittingAssignment ? 'Saving...' : existingUserSub ? 'Update Submission' : 'Submit Assignment'}</span>
                        </button>
                      </div>
                    </div>
                  )}
                </form>
              )}
            </div>
          </div>
        </div>);
}
