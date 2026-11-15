'use client';
import * as featureStyleFunctions from '@/features/courses/styles/View.c9d27d34.styles.js';

import inlineStyles from '@/features/courses/styles/admin-courses-page.jsx.styles.js';
import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Search, Plus, Edit2, Trash2, X, ChevronLeft, ChevronRight, GraduationCap, BookOpen, Upload, Download } from 'lucide-react';
import { T } from '@/shared/design-system/theme';
import { useMediaQuery, isMobileMQ } from '@/lib/useMediaQuery';
import { getCourses, createCourse, updateCourse, deleteCourse } from '@/features/courses/api/client';
import {useAdminCoursesPageModel} from '@/features/courses/hooks/features-courses-pages-admin-courses-View.jsx';
export default function AdminCoursesPage() {
const {router,isMobile,courses,setCourses,searchTerm,setSearchTerm,selectedCategory,setSelectedCategory,selectedStatus,setSelectedStatus,currentPage,setCurrentPage,isModalOpen,setIsModalOpen,modalMode,setModalMode,currentCourse,setCurrentCourse,isImportModalOpen,setIsImportModalOpen,importFile,setImportFile,importLoading,setImportLoading,importError,setImportError,importResult,setImportResult,handleCloseImportModal,handleImportSubmit,updateChecklist,handleOpenCreateModal,handleOpenEditModal,handleDeleteCourse,handleSaveCourseSubmit,filteredCourses,itemsPerPage,totalPages,paginatedCourses,containerPadding}=useAdminCoursesPageModel();
return (
    <div style={featureStyleFunctions.s0({containerPadding})}>
      {/* Header */}
      <div style={inlineStyles.s0}>
        <div>
          <h1 style={featureStyleFunctions.s1({T,isMobile})}>Courses</h1>
          <p style={featureStyleFunctions.s2({T})}>Manage the system curricula, check enrollees, and modify status.</p>
        </div>

        <div style={inlineStyles.s1}>
          <button
            onClick={() => setIsImportModalOpen(true)}
            style={featureStyleFunctions.s3({T})}
            onMouseEnter={(e) => {
              e.currentTarget.style.background = `${T.purple}10`;
              e.currentTarget.style.borderColor = T.purple;
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.background = 'transparent';
              e.currentTarget.style.borderColor = T.border;
            }}
          >
            <Upload size={16} /> Import Syllabus
          </button>

          <button
            onClick={handleOpenCreateModal}
            style={featureStyleFunctions.s4({T})}
          >
            <Plus size={16} /> New Course
          </button>
        </div>
      </div>

      {/* Filters Area */}
      <div style={featureStyleFunctions.s5({T})}>
        {/* Search */}
        <div style={inlineStyles.s2}>
          <span style={inlineStyles.s3}>
            <Search size={16} color={T.muted} />
          </span>
          <input
            type="text"
            placeholder="Search courses..."
            value={searchTerm}
            onChange={(e) => { setSearchTerm(e.target.value); setCurrentPage(1); }}
            style={featureStyleFunctions.s6({T})}
          />
        </div>

        {/* Category Filter */}
        <select
          value={selectedCategory}
          onChange={(e) => { setSelectedCategory(e.target.value); setCurrentPage(1); }}
          style={featureStyleFunctions.s7({T})}
        >
          <option value="All">All Categories</option>
          <option value="Personal Development">Personal Development</option>
          <option value="Design">Design</option>
          <option value="Business">Business</option>
          <option value="Finance">Finance</option>
          <option value="Web Development">Web Development</option>
          <option value="Frontend">Frontend</option>
          <option value="Framework">Framework</option>
        </select>

        {/* Status Filter */}
        <select
          value={selectedStatus}
          onChange={(e) => { setSelectedStatus(e.target.value); setCurrentPage(1); }}
          style={featureStyleFunctions.s8({T})}
        >
          <option value="All">All Statuses</option>
          <option value="Published">Published</option>
          <option value="Draft">Draft</option>
        </select>
      </div>

      {/* Courses List Container */}
      {filteredCourses.length === 0 ? (
        <div style={featureStyleFunctions.s9({T})}>
          <GraduationCap size={48} color={T.muted} style={inlineStyles.s4} />
          <h3 style={featureStyleFunctions.s10({T})}>No courses yet</h3>
          <p style={featureStyleFunctions.s11({T})}>
            There are no courses matching your filter criteria.
          </p>
          <button
            onClick={handleOpenCreateModal}
            style={featureStyleFunctions.s12({T})}
          >
            <Plus size={14} /> Create Course
          </button>
        </div>
      ) : (
        <>
          {/* Table Container */}
          <div style={featureStyleFunctions.s13({T})}>
            <table style={inlineStyles.s5}>
              <thead>
                <tr style={featureStyleFunctions.s14({T})}>
                  <th style={inlineStyles.s6}>Course Title</th>
                  <th style={inlineStyles.s7}>Instructor</th>
                  <th style={inlineStyles.s8}>Category</th>
                  <th style={inlineStyles.s9}>Enrolled Students</th>
                  <th style={inlineStyles.s10}>Status</th>
                  <th style={inlineStyles.s11}>Created Date</th>
                  <th style={inlineStyles.s12}>Actions</th>
                </tr>
              </thead>
              <tbody style={inlineStyles.s13}>
                {paginatedCourses.map((course) => {
                  const isPublished = course.status === 'Published';
                  return (
                    <tr key={course.id} style={featureStyleFunctions.s15({T})}>
                      {/* Title */}
                      <td style={featureStyleFunctions.s16({T})}>
                        {course.title}
                      </td>
                      
                      {/* Instructor */}
                      <td style={featureStyleFunctions.s17({T})}>
                        {course.instructor}
                      </td>
                      
                      {/* Category */}
                      <td style={featureStyleFunctions.s18({T})}>
                        {course.category}
                      </td>
                      
                      {/* Enrolled */}
                      <td style={featureStyleFunctions.s19({T})}>
                        {course.enrolled}
                      </td>
                      
                      {/* Status */}
                      <td style={inlineStyles.s14}>
                        <span style={featureStyleFunctions.s20({isPublished,T})}>
                          {course.status}
                        </span>
                      </td>
                      
                      {/* Created Date */}
                      <td style={featureStyleFunctions.s21({T})}>
                        {course.date}
                      </td>
                      
                      {/* Actions */}
                      <td style={inlineStyles.s15}>
                        <div style={inlineStyles.s16}>
                          <button
                            onClick={() => router.push(`/admin/courses/${course.id}`)}
                            style={featureStyleFunctions.s22({T})}
                            onMouseEnter={(e) => e.currentTarget.style.color = T.accent}
                            onMouseLeave={(e) => e.currentTarget.style.color = T.muted}
                            title="Manage Course Syllabus (chapters & lessons)"
                          >
                            <BookOpen size={14} />
                          </button>
                          <button
                            onClick={() => handleOpenEditModal(course)}
                            style={featureStyleFunctions.s23({T})}
                            onMouseEnter={(e) => e.currentTarget.style.color = T.purple}
                            onMouseLeave={(e) => e.currentTarget.style.color = T.muted}
                            title="Edit course details"
                          >
                            <Edit2 size={14} />
                          </button>
                          <button
                            onClick={() => handleDeleteCourse(course.id)}
                            style={featureStyleFunctions.s24({T})}
                            onMouseEnter={(e) => e.currentTarget.style.color = T.red}
                            onMouseLeave={(e) => e.currentTarget.style.color = T.muted}
                            title="Delete course"
                          >
                            <Trash2 size={14} />
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>

          {/* Pagination Footer */}
          <div style={featureStyleFunctions.s25({T})}>
            <span>
              Showing {((currentPage - 1) * itemsPerPage) + 1} to {Math.min(currentPage * itemsPerPage, filteredCourses.length)} of {filteredCourses.length} courses
            </span>

            <div style={inlineStyles.s17}>
              <button
                disabled={currentPage === 1}
                onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
                style={featureStyleFunctions.s26({currentPage,T})}
              >
                <ChevronLeft size={16} /> Previous
              </button>
              
              <span style={featureStyleFunctions.s27({T})}>
                {currentPage}
              </span>

              <button
                disabled={currentPage === totalPages}
                onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
                style={featureStyleFunctions.s28({currentPage,totalPages,T})}
              >
                Next <ChevronRight size={16} />
              </button>
            </div>
          </div>
        </>
      )}

      {/* Interactive Modal Dialog for Create/Edit */}
      {isModalOpen && (
        <div style={inlineStyles.s18}>
          <div style={featureStyleFunctions.s29({T})}>
            {/* Modal Header */}
            <div style={featureStyleFunctions.s30({T})}>
              <h3 style={featureStyleFunctions.s31({T})}>
                {modalMode === 'create' ? 'Create New Course' : 'Edit Course Details'}
              </h3>
              <button
                onClick={() => setIsModalOpen(false)}
                style={featureStyleFunctions.s32({T})}
              >
                <X size={18} />
              </button>
            </div>

            {/* Modal Form */}
            <form onSubmit={handleSaveCourseSubmit} style={inlineStyles.s19}>
              {/* Title Input */}
              <div style={inlineStyles.s20}>
                <label style={featureStyleFunctions.s33({T})}>Course Title</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Advanced Python Patterns"
                  value={currentCourse.title}
                  onChange={(e) => setCurrentCourse({ ...currentCourse, title: e.target.value })}
                  style={featureStyleFunctions.s34({T})}
                />
              </div>

              {/* Grid: Instructor and Category */}
              <div style={inlineStyles.s21}>
                <div style={inlineStyles.s22}>
                  <label style={featureStyleFunctions.s35({T})}>Instructor</label>
                  <input
                    type="text"
                    required
                    placeholder="Instructor Name"
                    value={currentCourse.instructor}
                    onChange={(e) => setCurrentCourse({ ...currentCourse, instructor: e.target.value })}
                    style={featureStyleFunctions.s36({T})}
                  />
                </div>

                <div style={inlineStyles.s23}>
                  <label style={featureStyleFunctions.s37({T})}>Category</label>
                  <select
                    value={currentCourse.category}
                    onChange={(e) => setCurrentCourse({ ...currentCourse, category: e.target.value })}
                    style={featureStyleFunctions.s38({T})}
                  >
                    <option value="Personal Development">Personal Development</option>
                    <option value="Design">Design</option>
                    <option value="Business">Business</option>
                    <option value="Finance">Finance</option>
                    <option value="Web Development">Web Development</option>
                    <option value="Frontend">Frontend</option>
                    <option value="Framework">Framework</option>
                  </select>
                </div>
              </div>

              {/* Grid: Enrolled and Status */}
              <div style={inlineStyles.s24}>
                <div style={inlineStyles.s25}>
                  <label style={featureStyleFunctions.s39({T})}>Enrolled Students</label>
                  <input
                    type="number"
                    min="0"
                    value={currentCourse.enrolled}
                    onChange={(e) => setCurrentCourse({ ...currentCourse, enrolled: e.target.value })}
                    style={featureStyleFunctions.s40({T})}
                  />
                </div>

                <div style={inlineStyles.s26}>
                  <label style={featureStyleFunctions.s41({T})}>Status</label>
                  <select
                    value={currentCourse.status}
                    onChange={(e) => setCurrentCourse({ ...currentCourse, status: e.target.value })}
                    style={featureStyleFunctions.s42({T})}
                  >
                    <option value="Draft">Draft</option>
                    <option value="Published">Published</option>
                  </select>
                </div>
              </div>

              {/* Course Description */}
              <div style={inlineStyles.s27}>
                <label style={featureStyleFunctions.s43({T})}>Course Description</label>
                <textarea
                  placeholder="Detailed course curriculum explanation..."
                  value={currentCourse.description}
                  onChange={(e) => setCurrentCourse({ ...currentCourse, description: e.target.value })}
                  rows={3}
                  style={featureStyleFunctions.s44({T})}
                />
              </div>

              {/* Course Image URL */}
              <div style={inlineStyles.s28}>
                <label style={featureStyleFunctions.s45({T})}>Course Image URL (optional)</label>
                <input
                  type="text"
                  placeholder="e.g. https://images.unsplash.com/photo-..."
                  value={currentCourse.image}
                  onChange={(e) => setCurrentCourse({ ...currentCourse, image: e.target.value })}
                  style={featureStyleFunctions.s46({T})}
                />
              </div>

              {/* Course Materials PDF URL */}
              <div style={inlineStyles.s29}>
                <label style={featureStyleFunctions.s47({T})}>Course Materials PDF URL (optional)</label>
                <input
                  type="text"
                  placeholder="e.g. https://drive.google.com/file/d/..."
                  value={currentCourse.pdf}
                  onChange={(e) => setCurrentCourse({ ...currentCourse, pdf: e.target.value })}
                  style={featureStyleFunctions.s48({T})}
                />
              </div>

              {/* Action Buttons */}
              <div style={featureStyleFunctions.s49({T})}>
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  style={featureStyleFunctions.s50({T})}
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  style={featureStyleFunctions.s51({T})}
                >
                  {modalMode === 'create' ? 'Add Course' : 'Save Changes'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Import CSV Modal */}
      {isImportModalOpen && (
        <div style={inlineStyles.s30}>
          <div style={featureStyleFunctions.s52({T})}>
            {/* Modal Header */}
            <div style={featureStyleFunctions.s53({T})}>
              <div style={inlineStyles.s31}>
                <Upload size={18} color={T.purple} />
                <h3 style={featureStyleFunctions.s54({T})}>
                  Import Courses Syllabus
                </h3>
              </div>
              <button
                onClick={handleCloseImportModal}
                style={featureStyleFunctions.s55({T})}
              >
                <X size={18} />
              </button>
            </div>

            {/* Modal Content */}
            <div style={inlineStyles.s32}>
              {!importResult ? (
                <form onSubmit={handleImportSubmit} style={inlineStyles.s33}>
                  <p style={featureStyleFunctions.s56({T})}>
                    Upload a syllabus CSV file containing courses, chapters, and lessons. 
                    The importer will map them hierarchically and create them in the system.
                  </p>

                  {/* Template download link */}
                  <div style={featureStyleFunctions.s57({T})}>
                    <div>
                      <div style={featureStyleFunctions.s58({T})}>Syllabus CSV Template</div>
                      <div style={featureStyleFunctions.s59({T})}>Download the formatted template for reference.</div>
                    </div>
                    <a
                      href="/api/admin/courses/import"
                      download="sample_syllabus.csv"
                      style={featureStyleFunctions.s60({T})}
                      onMouseEnter={(e) => {
                        e.currentTarget.style.background = `${T.purple}10`;
                        e.currentTarget.style.borderColor = T.purple;
                      }}
                      onMouseLeave={(e) => {
                        e.currentTarget.style.background = T.s2;
                        e.currentTarget.style.borderColor = T.border;
                      }}
                    >
                      <Download size={14} /> Template
                    </a>
                  </div>

                  {/* Dropzone / Upload area */}
                  <div 
                    style={featureStyleFunctions.s61({importFile,T})}
                    onDragOver={(e) => {
                      e.preventDefault();
                      e.currentTarget.style.borderColor = T.purple;
                      e.currentTarget.style.background = `${T.purple}08`;
                    }}
                    onDragLeave={(e) => {
                      e.preventDefault();
                      e.currentTarget.style.borderColor = importFile ? T.purple : T.border;
                      e.currentTarget.style.background = importFile ? `${T.purple}04` : T.s2;
                    }}
                    onDrop={(e) => {
                      e.preventDefault();
                      if (e.dataTransfer.files && e.dataTransfer.files[0]) {
                        setImportFile(e.dataTransfer.files[0]);
                      }
                    }}
                  >
                    <input 
                      type="file" 
                      accept=".csv"
                      onChange={(e) => {
                        if (e.target.files && e.target.files[0]) {
                          setImportFile(e.target.files[0]);
                        }
                      }}
                      style={inlineStyles.s34}
                    />
                    
                    {!importFile ? (
                      <div style={inlineStyles.s35}>
                        <Upload size={32} color={T.muted} />
                        <div>
                          <span style={featureStyleFunctions.s62({T})}>Click to upload</span>
                          <span style={featureStyleFunctions.s63({T})}> or drag & drop CSV file</span>
                        </div>
                        <div style={featureStyleFunctions.s64({T})}>Only CSV files are supported.</div>
                      </div>
                    ) : (
                      <div style={inlineStyles.s36}>
                        <div style={featureStyleFunctions.s65({T})}>
                          <Upload size={24} />
                        </div>
                        <div style={featureStyleFunctions.s66({T})}>
                          {importFile.name}
                        </div>
                        <div style={featureStyleFunctions.s67({T})}>
                          {(importFile.size / 1024).toFixed(1)} KB
                        </div>
                        <button
                          type="button"
                          onClick={(e) => {
                            e.stopPropagation();
                            e.preventDefault();
                            setImportFile(null);
                          }}
                          style={featureStyleFunctions.s68({T})}
                        >
                          Remove file
                        </button>
                      </div>
                    )}
                  </div>

                  {/* Error Alert */}
                  {importError && (
                    <div style={featureStyleFunctions.s69({T})}>
                      <X size={16} style={inlineStyles.s37} />
                      <div>
                        <strong style={inlineStyles.s38}>Import Failed</strong>
                        {importError}
                      </div>
                    </div>
                  )}

                  {/* Buttons */}
                  <div style={featureStyleFunctions.s70({T})}>
                    <button
                      type="button"
                      disabled={importLoading}
                      onClick={handleCloseImportModal}
                      style={featureStyleFunctions.s71({T,importLoading})}
                    >
                      Cancel
                    </button>
                    <button
                      type="submit"
                      disabled={!importFile || importLoading}
                      style={featureStyleFunctions.s72({T,importFile,importLoading})}
                    >
                      {importLoading ? 'Processing...' : 'Process Import'}
                    </button>
                  </div>
                </form>
              ) : (
                /* Success/Result View */
                <div style={inlineStyles.s39}>
                  <div style={inlineStyles.s40}>
                    <div style={featureStyleFunctions.s73({T})}>
                      <BookOpen size={32} />
                    </div>
                    <div>
                      <h4 style={featureStyleFunctions.s74({T})}>
                        Syllabus Imported Successfully!
                      </h4>
                      <p style={featureStyleFunctions.s75({T})}>
                        {importResult.localFallback 
                          ? 'CSV syllabus parsed and saved to local storage fallback.' 
                          : 'Syllabus structure sync\'d successfully.'}
                      </p>
                    </div>
                  </div>

                  {/* Summary of imported courses */}
                  <div style={featureStyleFunctions.s76({T})}>
                    <div style={featureStyleFunctions.s77({T})}>
                      Import Details ({importResult.imported.length} {importResult.imported.length === 1 ? 'Course' : 'Courses'})
                    </div>
                    <div style={inlineStyles.s41}>
                      {importResult.imported.map((item, idx) => (
                        <div 
                          key={item.id || idx}
                          style={featureStyleFunctions.s78({idx,importResult,T})}
                        >
                          <div style={inlineStyles.s42}>
                            <div style={featureStyleFunctions.s79({T})}>
                              {item.title}
                            </div>
                            <div style={featureStyleFunctions.s80({T})}>
                              ID: {item.id}
                            </div>
                          </div>
                          <div style={inlineStyles.s43}>
                            <span style={featureStyleFunctions.s81({T})}>
                              {item.chaptersCount} {item.chaptersCount === 1 ? 'chapter' : 'chapters'}
                            </span>
                            <span style={featureStyleFunctions.s82({T})}>
                              {item.lessonsCount} {item.lessonsCount === 1 ? 'lesson' : 'lessons'}
                            </span>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Close button */}
                  <div style={featureStyleFunctions.s83({T})}>
                    <button
                      onClick={handleCloseImportModal}
                      style={featureStyleFunctions.s84({T})}
                    >
                      Done
                    </button>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );

}
