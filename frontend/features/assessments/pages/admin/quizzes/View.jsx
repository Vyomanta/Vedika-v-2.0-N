'use client';
import * as featureStyleFunctions from '@/features/assessments/styles/View.0ee326d2.styles.js';

import inlineStyles from '@/features/assessments/styles/admin-quizzes-page.jsx.styles.js';
import { useState, useEffect, useMemo } from 'react';
import { HelpCircle, Plus, Edit2, Trash2, X, GraduationCap, CheckCircle, ClipboardList, Clock, Folder } from 'lucide-react';
import { T } from '@/shared/design-system/theme';
import { useMediaQuery, isMobileMQ } from '@/lib/useMediaQuery';
import { getQuizzes, createQuiz, updateQuiz, deleteQuiz } from '@/features/assessments/api/client';
import { getCourses } from '@/features/courses/api/client';
import { getCourseDetails } from '@/features/courses/domain/course-data';
import {useAdminQuizzesPageModel} from '@/features/assessments/hooks/features-assessments-pages-admin-quizzes-View.jsx';
export default function AdminQuizzesPage() {
const {isMobile,quizzes,setQuizzes,courses,setCourses,loading,setLoading,isModalOpen,setIsModalOpen,modalMode,setModalMode,availableLessons,setAvailableLessons,currentQuiz,setCurrentQuiz,selectedCategory,setSelectedCategory,categories,getQuizCategory,filteredQuizzes,updateChecklist,handleOpenCreateModal,handleOpenEditModal,saving,setSaving,handleDeleteQuiz,handleSaveQuizSubmit,addQuestionField,removeQuestionField,updateQuestionText,updateOptionText,updateCorrectOption,getCourseTitle,containerPadding,gridColumns}=useAdminQuizzesPageModel();
return (
    <div style={featureStyleFunctions.s0({containerPadding})}>
      {/* Header */}
      <div style={inlineStyles.s0}>
        <div>
          <h1 style={featureStyleFunctions.s1({T,isMobile})}>
            Course Quizzes
          </h1>
          <p style={featureStyleFunctions.s2({T})}>
            Author and assign multiple-choice evaluations linked to specific curriculum lessons.
          </p>
        </div>

        <button
          onClick={handleOpenCreateModal}
          style={featureStyleFunctions.s3({T})}
        >
          <Plus size={16} /> Create Quiz
        </button>
      </div>

      {/* Category Clubbing Filters */}
      <div style={inlineStyles.s1} className="no-scrollbar">
        {categories.map((cat) => (
          <button
            key={cat}
            onClick={() => setSelectedCategory(cat)}
            style={featureStyleFunctions.s4({selectedCategory,cat,T})}
          >
            {cat}
          </button>
        ))}
      </div>

      {loading ? (
        <div style={inlineStyles.s2}>
          <div style={featureStyleFunctions.s5({T})} />
        </div>
      ) : filteredQuizzes.length === 0 ? (
        <div style={featureStyleFunctions.s6({T})}>
          <ClipboardList size={48} color={T.muted} style={inlineStyles.s3} />
          <h3 style={featureStyleFunctions.s7({T})}>No Quizzes Found</h3>
          <p style={featureStyleFunctions.s8({T})}>
            No quizzes under the "{selectedCategory}" category.
          </p>
          <button
            onClick={() => setSelectedCategory('All')}
            style={featureStyleFunctions.s9({T})}
          >
            Show All Quizzes
          </button>
        </div>
      ) : (
        <div style={featureStyleFunctions.s10({gridColumns})}>
          {filteredQuizzes.map((quiz) => (
            <div
              key={quiz.id}
              style={featureStyleFunctions.s11({T})}
            >
              <div>
                {/* Title and Actions */}
                <div style={inlineStyles.s4}>
                  <h3 style={featureStyleFunctions.s12({T})}>
                    {quiz.title}
                  </h3>
                  
                  <div style={inlineStyles.s5}>
                    <button
                      onClick={(e) => handleOpenEditModal(quiz, e)}
                      style={featureStyleFunctions.s13({T})}
                      onMouseEnter={(e) => e.currentTarget.style.color = T.purple}
                      onMouseLeave={(e) => e.currentTarget.style.color = T.muted}
                      title="Edit Quiz"
                    >
                      <Edit2 size={13} />
                    </button>
                    <button
                      onClick={(e) => handleDeleteQuiz(quiz.id, e)}
                      style={featureStyleFunctions.s14({T})}
                      onMouseEnter={(e) => e.currentTarget.style.color = T.red}
                      onMouseLeave={(e) => e.currentTarget.style.color = T.muted}
                      title="Delete Quiz"
                    >
                      <Trash2 size={13} />
                    </button>
                  </div>
                </div>

                <div style={inlineStyles.s6}>
                  <span style={featureStyleFunctions.s15({T})}>
                    📂 {getQuizCategory(quiz)}
                  </span>
                  <span style={featureStyleFunctions.s16({T})}>
                    {getCourseTitle(quiz.course)}
                  </span>
                </div>

                {/* Info summary */}
                <div style={inlineStyles.s7}>
                  <div style={featureStyleFunctions.s17({T})}>
                    <HelpCircle size={13} color={T.muted} />
                    <span>{quiz.questions?.length || 0} Questions</span>
                  </div>

                  <div style={featureStyleFunctions.s18({T})}>
                    <Clock size={13} color={T.muted} />
                    <span>Duration: {quiz.duration}</span>
                  </div>

                  <div style={featureStyleFunctions.s19({T})}>
                    <CheckCircle size={13} color={T.muted} />
                    <span>Passing rate: {quiz.passing_percentage}% (total {quiz.total_marks} marks)</span>
                  </div>
                </div>
              </div>

              {/* Footer status check */}
              <div style={featureStyleFunctions.s20({T})}>
                Attempts Allowed: {quiz.max_attempts}
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Interactive Modal Form */}
      {isModalOpen && (
        <div style={inlineStyles.s8}>
          <div style={featureStyleFunctions.s21({T})}>
            {/* Modal Header */}
            <div style={featureStyleFunctions.s22({T})}>
              <h3 style={featureStyleFunctions.s23({T})}>
                {modalMode === 'create' ? 'Create New Quiz' : 'Edit Quiz'}
              </h3>
              <button
                onClick={() => setIsModalOpen(false)}
                style={featureStyleFunctions.s24({T})}
              >
                <X size={18} />
              </button>
            </div>

            {/* Modal Form Content */}
            <form onSubmit={handleSaveQuizSubmit} style={inlineStyles.s9}>
              
              {/* Scrollable Fields */}
              <div style={inlineStyles.s10}>
                {/* Title */}
                <div style={inlineStyles.s11}>
                  <label style={featureStyleFunctions.s25({T})}>Quiz Title</label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Python Variables & Conditions Quiz"
                    value={currentQuiz.title}
                    onChange={(e) => setCurrentQuiz({ ...currentQuiz, title: e.target.value })}
                    style={featureStyleFunctions.s26({T})}
                  />
                </div>

                {/* Course Selection & Lesson Selection */}
                <div style={inlineStyles.s12}>
                  <div style={inlineStyles.s13}>
                    <label style={featureStyleFunctions.s27({T})}>Link to Course</label>
                    <select
                      value={currentQuiz.course}
                      onChange={(e) => setCurrentQuiz({ ...currentQuiz, course: e.target.value, lesson: '' })}
                      style={featureStyleFunctions.s28({T})}
                    >
                      <option value="">-- Select Course --</option>
                      {courses.map(c => (
                        <option key={c.id} value={c.id}>{c.title}</option>
                      ))}
                    </select>
                  </div>

                  <div style={inlineStyles.s14}>
                    <label style={featureStyleFunctions.s29({T})}>Link to Lesson</label>
                    <select
                      value={currentQuiz.lesson}
                      onChange={(e) => setCurrentQuiz({ ...currentQuiz, lesson: e.target.value })}
                      style={featureStyleFunctions.s30({T})}
                    >
                      <option value="">-- Optional Lesson Link --</option>
                      {availableLessons.map(l => (
                        <option key={l.id} value={l.id}>{l.title}</option>
                      ))}
                    </select>
                  </div>
                </div>

                {/* Settings: Duration, Passing %, Max Attempts */}
                <div style={inlineStyles.s15}>
                  <div style={inlineStyles.s16}>
                    <label style={featureStyleFunctions.s31({T})}>Duration</label>
                    <input
                      type="text"
                      required
                      placeholder="10 mins"
                      value={currentQuiz.duration}
                      onChange={(e) => setCurrentQuiz({ ...currentQuiz, duration: e.target.value })}
                      style={featureStyleFunctions.s32({T})}
                    />
                  </div>

                  <div style={inlineStyles.s17}>
                    <label style={featureStyleFunctions.s33({T})}>Passing %</label>
                    <input
                      type="number"
                      required
                      min="10"
                      max="100"
                      value={currentQuiz.passing_percentage}
                      onChange={(e) => setCurrentQuiz({ ...currentQuiz, passing_percentage: parseInt(e.target.value) || 70 })}
                      style={featureStyleFunctions.s34({T})}
                    />
                  </div>

                  <div style={inlineStyles.s18}>
                    <label style={featureStyleFunctions.s35({T})}>Max Attempts</label>
                    <input
                      type="number"
                      required
                      min="1"
                      value={currentQuiz.max_attempts}
                      onChange={(e) => setCurrentQuiz({ ...currentQuiz, max_attempts: parseInt(e.target.value) || 3 })}
                      style={featureStyleFunctions.s36({T})}
                    />
                  </div>

                  <div style={inlineStyles.s19}>
                    <label style={featureStyleFunctions.s37({T})}>Total Marks</label>
                    <input
                      type="number"
                      required
                      min="1"
                      value={currentQuiz.total_marks}
                      onChange={(e) => setCurrentQuiz({ ...currentQuiz, total_marks: parseInt(e.target.value) || 10 })}
                      style={featureStyleFunctions.s38({T})}
                    />
                  </div>
                </div>

                {/* Questions Header */}
                <div style={featureStyleFunctions.s39({T})}>
                  <span style={featureStyleFunctions.s40({T})}>Quiz Questions ({currentQuiz.questions?.length || 0})</span>
                  <button
                    type="button"
                    onClick={addQuestionField}
                    style={featureStyleFunctions.s41({T})}
                  >
                    + Add Question
                  </button>
                </div>

                {/* Questions List */}
                <div style={inlineStyles.s20}>
                  {currentQuiz.questions?.map((q, qIndex) => (
                    <div key={qIndex} style={featureStyleFunctions.s42({T})}>
                      <div style={inlineStyles.s21}>
                        <span style={featureStyleFunctions.s43({T})}>Question #{qIndex + 1}</span>
                        {currentQuiz.questions.length > 1 && (
                          <button
                            type="button"
                            onClick={() => removeQuestionField(qIndex)}
                            style={featureStyleFunctions.s44({T})}
                          >
                            Remove
                          </button>
                        )}
                      </div>

                      {/* Question Text */}
                      <input
                        type="text"
                        required
                        placeholder="Type question here..."
                        value={q.question}
                        onChange={(e) => updateQuestionText(qIndex, e.target.value)}
                        style={featureStyleFunctions.s45({T})}
                      />

                      {/* Options Grid */}
                      <div style={inlineStyles.s22}>
                        {q.options?.map((opt, oIndex) => {
                          const isCorrect = q.correct === oIndex;
                          return (
                            <div key={oIndex} style={inlineStyles.s23}>
                              <input
                                type="radio"
                                name={`correct_${qIndex}`}
                                checked={isCorrect}
                                onChange={() => updateCorrectOption(qIndex, oIndex)}
                                style={featureStyleFunctions.s46({T})}
                              />
                              <input
                                type="text"
                                required
                                placeholder={`Option ${'ABCD'[oIndex]}`}
                                value={opt}
                                onChange={(e) => updateOptionText(qIndex, oIndex, e.target.value)}
                                style={featureStyleFunctions.s47({T,isCorrect})}
                              />
                            </div>
                          );
                        })}
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Action buttons */}
              <div style={featureStyleFunctions.s48({T})}>
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  style={featureStyleFunctions.s49({T})}
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={saving}
                  style={featureStyleFunctions.s50({T,saving})}
                >
                  {saving ? 'Saving...' : (modalMode === 'create' ? 'Create Quiz' : 'Save Changes')}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );

}
