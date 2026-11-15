'use client';
import * as featureStyleFunctions from '@/features/assessments/styles/View.534445ff.styles.js';

import inlineStyles from '@/features/assessments/styles/admin-assignments-page.jsx.styles.js';
import React, { useState, useEffect, useMemo } from 'react';
import { 
  FileText, Clock, CheckCircle, X, ChevronRight, HelpCircle, ArrowLeft, 
  Send, AlertCircle, Filter, Plus, Edit2, Trash2, Award, Folder,
  ClipboardList, User, Loader2, Brain, Star, RotateCcw
} from 'lucide-react';
import { T } from '@/shared/design-system/theme';
import { useMediaQuery, isMobileMQ } from '@/lib/useMediaQuery';
import { getAssignments, createAssignment, updateAssignment, deleteAssignment, getAssignmentSubmissions, gradeAssignmentSubmission } from '@/features/assessments/api/client';
import { getCourses, getCourseSyllabus } from '@/features/courses/api/client';
import { parseQuestionsList } from '@/features/assessments/domain/legacy-formats';
import { getCourseDetails } from '@/features/courses/domain/course-data';
import {useAdminAssignmentsPageModel} from '@/features/assessments/hooks/features-assessments-pages-admin-assignments-View.jsx';
export default function AdminAssignmentsPage() {
const {isMobile,assignments,setAssignments,courses,setCourses,submissions,setSubmissions,loading,setLoading,activeTab,setActiveTab,selectedCategory,setSelectedCategory,filterCourse,setFilterCourse,filterChapter,setFilterChapter,courseChapters,setCourseChapters,loadingChapters,setLoadingChapters,isModalOpen,setIsModalOpen,modalMode,setModalMode,currentAssignment,setCurrentAssignment,isGradingOpen,setIsGradingOpen,selectedSubmission,setSelectedSubmission,gradingForm,setGradingForm,evaluatingId,setEvaluatingId,refreshSubmissions,updateChecklist,handleCourseSelect,handleOpenCreateModal,handleOpenEditModal,handleAddCriterion,handleRemoveCriterion,handleCriterionChange,handleAddQuestion,handleRemoveQuestion,handleQuestionChange,saving,setSaving,handleDeleteAssignment,handleSaveAssignmentSubmit,handleOpenGradingModal,handleEvaluateWithAI,handleSaveGrading,getCourseTitle,categories,getAssignmentCategory,filteredAssignments,availableFilterChapters,containerPadding}=useAdminAssignmentsPageModel();
return (
    <div style={featureStyleFunctions.s0({containerPadding})}>
      {/* Header */}
      <div style={featureStyleFunctions.s1({isMobile})}>
        <div>
          <h1 style={featureStyleFunctions.s2({T,isMobile})}>
            Course Assignments
          </h1>
          <p style={featureStyleFunctions.s3({T})}>
            Design course challenges and grade student submissions in real-time.
          </p>
        </div>

        <button
          onClick={handleOpenCreateModal}
          style={featureStyleFunctions.s4({T})}
        >
          <Plus size={16} /> New Assignment
        </button>
      </div>

      {/* Tabs Menu */}
      <div style={featureStyleFunctions.s5({T})}>
        <button
          onClick={() => setActiveTab('list')}
          style={featureStyleFunctions.s6({activeTab,T})}
        >
          Assignments Syllabus
        </button>
        <button
          onClick={() => setActiveTab('submissions')}
          style={featureStyleFunctions.s7({activeTab,T})}
        >
          Student Submissions
          {submissions.filter(s => s.status === 'Not Graded').length > 0 && (
            <span style={featureStyleFunctions.s8({T})}>
              {submissions.filter(s => s.status === 'Not Graded').length}
            </span>
          )}
        </button>

        {activeTab === 'submissions' && (
          <button
            type="button"
            onClick={refreshSubmissions}
            title="Refresh student submissions"
            style={featureStyleFunctions.s9({T})}
          >
            <RotateCcw size={12} />
            <span>Refresh</span>
          </button>
        )}
      </div>

      {loading ? (
        <div style={inlineStyles.s0}>
          <div style={featureStyleFunctions.s10({T})} />
        </div>
      ) : activeTab === 'list' ? (
        /* Tab 1: Assignments Syllabus */
        assignments.length === 0 ? (
          <div style={featureStyleFunctions.s11({T})}>
            <FileText size={40} color={T.muted} style={inlineStyles.s1} />
            <h3 style={featureStyleFunctions.s12({T})}>No Assignments Listed</h3>
            <p style={featureStyleFunctions.s13({T})}>
              Add coding projects, essay prompts, or PDF files for student assessments.
            </p>
            <button
              onClick={handleOpenCreateModal}
              style={featureStyleFunctions.s14({T})}
            >
              Add First Assignment
            </button>
          </div>
        ) : (
          <div>
            {/* Category Clubbing Pills */}
            <div style={inlineStyles.s2} className="no-scrollbar">
              {categories.map((cat) => (
                <button
                  key={cat}
                  onClick={() => setSelectedCategory(cat)}
                  style={featureStyleFunctions.s15({selectedCategory,cat,T})}
                >
                  {cat}
                </button>
              ))}
            </div>

            {/* Filter Bar */}
            <div style={featureStyleFunctions.s16({T})}>
              <div style={inlineStyles.s3}>
                <Filter size={15} color={T.purple} />
                <span style={featureStyleFunctions.s17({T})}>Filter Assignments:</span>
              </div>

              <div style={inlineStyles.s4}>
                {/* Course Filter */}
                <select
                  value={filterCourse}
                  onChange={(e) => {
                    setFilterCourse(e.target.value);
                    setFilterChapter('all');
                  }}
                  style={featureStyleFunctions.s18({T})}
                >
                  <option value="all">All Courses</option>
                  {courses.map(c => (
                    <option key={c.id} value={c.id}>{c.title}</option>
                  ))}
                </select>

                {/* Chapter Filter */}
                <select
                  value={filterChapter}
                  onChange={(e) => setFilterChapter(e.target.value)}
                  style={featureStyleFunctions.s19({T})}
                >
                  <option value="all">All Chapters</option>
                  {availableFilterChapters.map(([chId, chTitle]) => (
                    <option key={chId} value={chId}>{chTitle}</option>
                  ))}
                </select>

                {(filterCourse !== 'all' || filterChapter !== 'all') && (
                  <button
                    onClick={() => {
                      setFilterCourse('all');
                      setFilterChapter('all');
                    }}
                    style={featureStyleFunctions.s20({T})}
                  >
                    Reset filters
                  </button>
                )}
              </div>
            </div>

            {filteredAssignments.length === 0 ? (
              <div style={featureStyleFunctions.s21({T})}>
                <FileText size={32} color={T.muted} style={inlineStyles.s5} />
                <h4 style={featureStyleFunctions.s22({T})}>No assignments match your filter</h4>
                <p style={featureStyleFunctions.s23({T})}>Try clearing the filter to view all course assignments.</p>
              </div>
            ) : (
              <div style={featureStyleFunctions.s24({isMobile})}>
                {filteredAssignments.map(ass => (
                  <div
                    key={ass.id}
                    style={featureStyleFunctions.s25({T})}
                  >
                    <div>
                      <div style={inlineStyles.s6}>
                        <h3 style={featureStyleFunctions.s26({T})}>
                          {ass.title}
                        </h3>
                        
                        <div style={inlineStyles.s7}>
                          <button
                            onClick={(e) => handleOpenEditModal(ass, e)}
                            style={featureStyleFunctions.s27({T})}
                            onMouseEnter={(e) => e.currentTarget.style.color = T.purple}
                            onMouseLeave={(e) => e.currentTarget.style.color = T.muted}
                          >
                            <Edit2 size={13} />
                          </button>
                          <button
                            onClick={(e) => handleDeleteAssignment(ass.id, e)}
                            style={featureStyleFunctions.s28({T})}
                            onMouseEnter={(e) => e.currentTarget.style.color = T.red}
                            onMouseLeave={(e) => e.currentTarget.style.color = T.muted}
                          >
                            <Trash2 size={13} />
                          </button>
                        </div>
                      </div>

                      <div style={inlineStyles.s8}>
                        <span
                          style={featureStyleFunctions.s29({T})}
                        >
                          📂 {getAssignmentCategory(ass)}
                        </span>
                        <span
                          title={getCourseTitle(ass.course, ass.custom_course_title)}
                          style={featureStyleFunctions.s30({T})}
                        >
                          📚 {getCourseTitle(ass.course, ass.custom_course_title)}
                        </span>
                        <span
                          title={ass.chapterTitle || ass.chapter || 'General'}
                          style={inlineStyles.s9}
                        >
                          🔖 Chapter: {ass.chapterTitle || ass.chapter || 'General'}
                        </span>
                        <span style={featureStyleFunctions.s31({T})}>
                          Format: {ass.type}
                        </span>
                        {ass.questions?.length > 1 && (
                          <span style={featureStyleFunctions.s32({T})}>
                            {ass.questions.length} Questions
                          </span>
                        )}
                      </div>

                      {ass.questions && ass.questions.length > 1 ? (
                        <div style={inlineStyles.s10}>
                          {ass.questions.map((q, qIdx) => (
                            <div key={qIdx} style={featureStyleFunctions.s33({T})}>
                              <span style={featureStyleFunctions.s34({T})}>Q{qIdx + 1}:</span> {q.prompt?.replace(/<[^>]*>/g, '')}
                            </div>
                          ))}
                        </div>
                      ) : (
                        ass.question && (
                          <div
                            style={featureStyleFunctions.s35({T})}
                            dangerouslySetInnerHTML={{ __html: ass.question }}
                          />
                        )
                      )}
                    </div>

                    <div style={featureStyleFunctions.s36({T})}>
                      <span style={featureStyleFunctions.s37({T})}>
                        {ass.show_answer ? 'Sample solution visible' : 'Hidden solution'}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )
      ) : (
        /* Tab 2: Student Submissions */
        submissions.length === 0 ? (
          <div style={featureStyleFunctions.s38({T})}>
            <ClipboardList size={40} color={T.muted} style={inlineStyles.s11} />
            <h3 style={featureStyleFunctions.s39({T})}>No Submissions Found</h3>
            <p style={featureStyleFunctions.s40({T})}>
              Students have not submitted response sheets for evaluations yet.
            </p>
          </div>
        ) : (
          <div style={inlineStyles.s12}>
            {submissions.map(sub => (
              <div
                key={sub.id}
                style={featureStyleFunctions.s41({T})}
              >
                {/* Submission Header Info */}
                <div style={inlineStyles.s13}>
                  <div>
                    <h4 style={featureStyleFunctions.s42({T})}>
                      {sub.assignment_title || 'Untitled Assignment'}
                    </h4>
                    <div style={featureStyleFunctions.s43({T})}>
                      <span style={featureStyleFunctions.s44({T})}>
                        <User size={12} color={T.accent} /> {sub.member_name || sub.member}
                      </span>
                      <span>•</span>
                      <span>Course: {getCourseTitle(sub.course, sub.custom_course_title)}</span>
                      <span>•</span>
                      <span>Type: {sub.type}</span>
                    </div>
                  </div>
                </div>

                {/* Submission Answer Body */}
                {sub.answer && (
                  <div style={featureStyleFunctions.s45({T})}>
                    {sub.answer}
                  </div>
                )}

                {/* Responsive Action & Grade Status Bar */}
                <div style={featureStyleFunctions.s46({T})}>
                  <div style={inlineStyles.s14}>
                    {sub.score !== undefined && sub.score !== null && (
                      <span style={featureStyleFunctions.s47({T})}>
                        Score: {sub.score}/100
                      </span>
                    )}

                    <span style={featureStyleFunctions.s48({sub,T})}>
                      {sub.status.toUpperCase()}
                    </span>
                  </div>

                  <div style={inlineStyles.s15}>
                    <button
                      type="button"
                      onClick={(e) => handleEvaluateWithAI(sub, e)}
                      disabled={evaluatingId === sub.id}
                      style={featureStyleFunctions.s49({T,evaluatingId,sub})}
                    >
                      {evaluatingId === sub.id ? (
                        <>
                          <Loader2 size={12} style={inlineStyles.s16} /> Evaluating...
                        </>
                      ) : (
                        <>
                          <Brain size={12} /> Evaluate with AI
                        </>
                      )}
                    </button>

                    <button
                      onClick={() => handleOpenGradingModal(sub)}
                      style={featureStyleFunctions.s50({T})}
                    >
                      <Star size={12} /> Grade / Review
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )
      )}

      {/* Assignment Setup Modal */}
      {isModalOpen && (
        <div style={inlineStyles.s17}>
          <div style={featureStyleFunctions.s51({T})}>
            {/* Modal Header */}
            <div style={featureStyleFunctions.s52({T})}>
              <h3 style={featureStyleFunctions.s53({T})}>
                {modalMode === 'create' ? 'Create Assignment Prompt' : 'Edit Assignment Prompt'}
              </h3>
              <button
                onClick={() => setIsModalOpen(false)}
                style={featureStyleFunctions.s54({T})}
              >
                <X size={18} />
              </button>
            </div>

            {/* Modal Form Content */}
            <form onSubmit={handleSaveAssignmentSubmit} style={inlineStyles.s18}>
              {/* Assignment Title */}
              <div style={inlineStyles.s19}>
                <label style={featureStyleFunctions.s55({T})}>Assignment Title</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Implement Fibonacci Sequence Generator"
                  value={currentAssignment.title}
                  onChange={(e) => setCurrentAssignment({ ...currentAssignment, title: e.target.value })}
                  style={featureStyleFunctions.s56({T})}
                />
              </div>

              <div style={featureStyleFunctions.s57({isMobile})}>
                {/* Course Select */}
                <div style={inlineStyles.s20}>
                  <label style={featureStyleFunctions.s58({T})}>Course Curriculum</label>
                  <select
                    value={currentAssignment.custom_course_title ? 'CUSTOM' : currentAssignment.course}
                    onChange={(e) => handleCourseSelect(e.target.value)}
                    style={featureStyleFunctions.s59({T})}
                  >
                    {courses.map(c => (
                      <option key={c.id} value={c.id}>{c.title}</option>
                    ))}
                    <option value="CUSTOM">+ Enter Custom Course / Module Name</option>
                  </select>
                </div>

                {/* Chapter Select */}
                <div style={inlineStyles.s21}>
                  <label style={featureStyleFunctions.s60({T})}>Course Chapter</label>
                  <select
                    value={currentAssignment.chapter || ''}
                    disabled={currentAssignment.course === 'CUSTOM'}
                    onChange={(e) => {
                      const selId = e.target.value;
                      const matched = courseChapters.find(m => String(m.id) === String(selId));
                      setCurrentAssignment(prev => ({
                        ...prev,
                        chapter: selId,
                        chapterTitle: matched ? matched.title : (selId || 'General')
                      }));
                    }}
                    style={featureStyleFunctions.s61({T,currentAssignment})}
                  >
                    {loadingChapters ? (
                      <option value="">Loading chapters...</option>
                    ) : courseChapters.length > 0 ? (
                      courseChapters.map(m => (
                        <option key={m.id} value={m.id}>{m.title || `Chapter ${m.id}`}</option>
                      ))
                    ) : (
                      <option value="General">General / Introduction</option>
                    )}
                  </select>
                </div>
              </div>

              {/* Assignment Type */}
              <div style={inlineStyles.s22}>
                <label style={featureStyleFunctions.s62({T})}>Response Mode</label>
                <select
                  value={currentAssignment.type}
                  onChange={(e) => setCurrentAssignment({ ...currentAssignment, type: e.target.value })}
                  style={featureStyleFunctions.s63({T})}
                >
                  <option value="Text">Online Text editor</option>
                  <option value="PDF">PDF File Attachment</option>
                  <option value="Document">Word Document</option>
                  <option value="URL">Submission URL link</option>
                  <option value="Image">Screenshots / Image</option>
                </select>
              </div>

              {/* Custom Course Name Input if selected */}
              {(currentAssignment.course === 'CUSTOM' || currentAssignment.custom_course_title) && (
                <div style={inlineStyles.s23}>
                  <label style={featureStyleFunctions.s64({T})}>Custom Course / Module Name</label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Learn Python - Full Course for Beginners"
                    value={currentAssignment.custom_course_title}
                    onChange={(e) => setCurrentAssignment({ ...currentAssignment, custom_course_title: e.target.value })}
                    style={featureStyleFunctions.s65({T})}
                  />
                </div>
              )}

              {/* Questions Builder Section (Multiple Questions Supported) */}
              <div style={featureStyleFunctions.s66({T})}>
                <div style={inlineStyles.s24}>
                  <label style={featureStyleFunctions.s67({T})}>
                    <FileText size={14} color={T.purple} /> Assignment Questions ({currentAssignment.questions?.length || 1})
                  </label>
                  <button
                    type="button"
                    onClick={handleAddQuestion}
                    style={featureStyleFunctions.s68({T})}
                  >
                    + Add Question
                  </button>
                </div>

                {(currentAssignment.questions || []).map((q, qIdx) => (
                  <div key={q.id || qIdx} style={featureStyleFunctions.s69({T})}>
                    <div style={inlineStyles.s25}>
                      <span style={featureStyleFunctions.s70({T})}>Question {qIdx + 1}</span>
                      {currentAssignment.questions.length > 1 && (
                        <button
                          type="button"
                          onClick={() => handleRemoveQuestion(qIdx)}
                          style={featureStyleFunctions.s71({T})}
                        >
                          <Trash2 size={13} />
                        </button>
                      )}
                    </div>

                    <textarea
                      placeholder={`Enter prompt question ${qIdx + 1} (HTML or markdown)...`}
                      value={q.prompt || ''}
                      onChange={(e) => handleQuestionChange(qIdx, 'prompt', e.target.value)}
                      required
                      style={featureStyleFunctions.s72({T})}
                    />

                    {currentAssignment.show_answer && (
                      <textarea
                        placeholder={`Official Sample Solution for Question ${qIdx + 1}...`}
                        value={q.sample_answer || ''}
                        onChange={(e) => handleQuestionChange(qIdx, 'sample_answer', e.target.value)}
                        style={featureStyleFunctions.s73({T})}
                      />
                    )}
                  </div>
                ))}
              </div>

              {/* Custom Evaluation Criteria Builder */}
              <div style={featureStyleFunctions.s74({T})}>
                <div style={inlineStyles.s26}>
                  <label style={featureStyleFunctions.s75({T})}>
                    <Brain size={14} /> Custom Evaluation Criteria / Rubric Points
                  </label>
                  <button
                    type="button"
                    onClick={handleAddCriterion}
                    style={featureStyleFunctions.s76({T})}
                  >
                    + Add Criterion Point
                  </button>
                </div>
                <p style={featureStyleFunctions.s77({T})}>
                  Define specific points for AI to evaluate student submissions against.
                </p>
                {(currentAssignment.evaluation_criteria || []).map((crit, idx) => (
                  <div key={idx} style={inlineStyles.s27}>
                    <span style={featureStyleFunctions.s78({T})}>{idx + 1}.</span>
                    <input
                      type="text"
                      placeholder="e.g. Must handle edge case n <= 0"
                      value={crit}
                      onChange={(e) => handleCriterionChange(idx, e.target.value)}
                      style={featureStyleFunctions.s79({T})}
                    />
                    <button
                      type="button"
                      onClick={() => handleRemoveCriterion(idx)}
                      style={featureStyleFunctions.s80({T})}
                    >
                      <Trash2 size={13} />
                    </button>
                  </div>
                ))}

                <div style={inlineStyles.s28}>
                  <div style={inlineStyles.s29}>
                    <label style={featureStyleFunctions.s81({T})}>Passing Threshold (%):</label>
                    <input
                      type="number"
                      min="1"
                      max="100"
                      value={currentAssignment.pass_threshold || 70}
                      onChange={(e) => setCurrentAssignment({ ...currentAssignment, pass_threshold: Number(e.target.value) })}
                      style={featureStyleFunctions.s82({T})}
                    />
                  </div>

                  <div style={inlineStyles.s30}>
                    <label style={featureStyleFunctions.s83({T})}>Min Response Chars:</label>
                    <input
                      type="number"
                      min="0"
                      max="1000"
                      value={currentAssignment.min_char_count !== undefined ? currentAssignment.min_char_count : 20}
                      onChange={(e) => setCurrentAssignment({ ...currentAssignment, min_char_count: Number(e.target.value) })}
                      style={featureStyleFunctions.s84({T})}
                    />
                  </div>
                </div>
              </div>

              {/* Answer details */}
              <div style={inlineStyles.s31}>
                <div style={inlineStyles.s32}>
                  <input
                    type="checkbox"
                    id="show_answer"
                    checked={currentAssignment.show_answer}
                    onChange={(e) => setCurrentAssignment({ ...currentAssignment, show_answer: e.target.checked })}
                    style={featureStyleFunctions.s85({T})}
                  />
                  <label htmlFor="show_answer" style={featureStyleFunctions.s86({T})}>
                    Show Sample Solution after student submits
                  </label>
                </div>
                {currentAssignment.show_answer && (
                  <textarea
                    placeholder="Enter the official sample solution..."
                    value={currentAssignment.answer}
                    onChange={(e) => setCurrentAssignment({ ...currentAssignment, answer: e.target.value })}
                    style={featureStyleFunctions.s87({T})}
                  />
                )}
              </div>

              {/* Action buttons */}
              <div style={featureStyleFunctions.s88({T})}>
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  style={featureStyleFunctions.s89({T})}
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  style={featureStyleFunctions.s90({T})}
                >
                  {modalMode === 'create' ? 'Create Assignment' : 'Save Changes'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Student grading review modal */}
      {isGradingOpen && selectedSubmission && (
        <div style={inlineStyles.s33}>
          <div style={featureStyleFunctions.s91({T})}>
            {/* Modal Header */}
            <div style={featureStyleFunctions.s92({T})}>
              <h3 style={featureStyleFunctions.s93({T})}>
                Evaluate Submission — {selectedSubmission.member_name || selectedSubmission.member}
              </h3>
              <button
                onClick={() => setIsGradingOpen(false)}
                style={featureStyleFunctions.s94({T})}
              >
                <X size={18} />
              </button>
            </div>

            {/* Modal Form Content */}
            <form onSubmit={handleSaveGrading} style={inlineStyles.s34}>
              
              <div>
                <span style={featureStyleFunctions.s95({T})}>STUDENT SUBMISSION ANSWER:</span>
                <div style={featureStyleFunctions.s96({T})}>
                  {selectedSubmission.answer}
                </div>
              </div>

              {/* AI Evaluation Report Breakdown View */}
              {gradingForm.ai_evaluation && (
                <div style={featureStyleFunctions.s97({T})}>
                  <div style={inlineStyles.s35}>
                    <span style={featureStyleFunctions.s98({T})}>
                      <Brain size={14} /> AI Analysis Score: {gradingForm.score}/100
                    </span>
                    <span style={featureStyleFunctions.s99({gradingForm,T})}>
                      Suggested Status: {gradingForm.status.toUpperCase()}
                    </span>
                  </div>

                  {Array.isArray(gradingForm.ai_evaluation.criteria_breakdown) && gradingForm.ai_evaluation.criteria_breakdown.length > 0 && (
                    <div style={inlineStyles.s36}>
                      <span style={featureStyleFunctions.s100({T})}>Evaluation Criteria Breakdown & Evidence:</span>
                      {gradingForm.ai_evaluation.criteria_breakdown.map((cb, idx) => (
                        <div key={idx} style={featureStyleFunctions.s101({T})}>
                          <div style={inlineStyles.s37}>
                            <span style={featureStyleFunctions.s102({T})}>{cb.criterion}</span>
                            <span style={featureStyleFunctions.s103({cb,T})}>
                              {cb.status} ({cb.score_earned}/{cb.max_score} pts)
                            </span>
                          </div>
                          {cb.evidence_quote && (
                            <p style={featureStyleFunctions.s104({T})}>
                              Quote/Evidence: "{cb.evidence_quote}"
                            </p>
                          )}
                          {cb.feedback && (
                            <p style={featureStyleFunctions.s105({T})}>
                              {cb.feedback}
                            </p>
                          )}
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              )}

              {/* Score Input */}
              <div style={inlineStyles.s38}>
                <div style={inlineStyles.s39}>
                  <label style={featureStyleFunctions.s106({T})}>Evaluation Status</label>
                  <select
                    value={gradingForm.status}
                    onChange={(e) => setGradingForm({ ...gradingForm, status: e.target.value })}
                    style={featureStyleFunctions.s107({T})}
                  >
                    <option value="Pass">Pass (Meets Requirements)</option>
                    <option value="Fail">Fail (Needs revision)</option>
                    <option value="Not Graded">Not Graded (Reset status)</option>
                    <option value="Not Applicable">Not Applicable</option>
                  </select>
                </div>

                <div style={inlineStyles.s40}>
                  <label style={featureStyleFunctions.s108({T})}>Score (0 - 100)</label>
                  <input
                    type="number"
                    min="0"
                    max="100"
                    value={gradingForm.score}
                    onChange={(e) => setGradingForm({ ...gradingForm, score: Number(e.target.value) })}
                    style={featureStyleFunctions.s109({T})}
                  />
                </div>
              </div>

              {/* Evaluation comments */}
              <div style={inlineStyles.s41}>
                <label style={featureStyleFunctions.s110({T})}>Instructor Review Comments</label>
                <textarea
                  placeholder="Provide feedback to the student..."
                  value={gradingForm.comments}
                  onChange={(e) => setGradingForm({ ...gradingForm, comments: e.target.value })}
                  style={featureStyleFunctions.s111({T})}
                />
              </div>

              {/* Action buttons */}
              <div style={featureStyleFunctions.s112({T})}>
                <button
                  type="button"
                  onClick={() => setIsGradingOpen(false)}
                  style={featureStyleFunctions.s113({T})}
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  style={featureStyleFunctions.s114({T})}
                >
                  Submit Review & Publish Grade
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );

}
