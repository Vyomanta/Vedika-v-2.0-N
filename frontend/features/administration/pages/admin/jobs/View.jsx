'use client';
import * as featureStyleFunctions from '@/features/administration/styles/View.6c83e0c1.styles.js';

import inlineStyles from '@/features/administration/styles/admin-jobs-page.jsx.styles.js';
import { useState, useEffect } from 'react';
import { Briefcase, Plus, Edit2, Trash2, X, MapPin, Clock, Calendar, Globe, AlertCircle } from 'lucide-react';
import { T } from '@/shared/design-system/theme';
import { useMediaQuery, isMobileMQ } from '@/lib/useMediaQuery';
import { getJobs, createJob, updateJob, deleteJob } from '@/features/administration/api/collections';
import {useAdminJobsPageModel} from '@/features/administration/hooks/features-administration-pages-admin-jobs-View.jsx';
export default function AdminJobsPage() {
const {isMobile,jobs,setJobs,loading,setLoading,isModalOpen,setIsModalOpen,modalMode,setModalMode,submitError,setSubmitError,currentJob,setCurrentJob,handleOpenCreateModal,handleOpenEditModal,handleDeleteJob,handleSaveJobSubmit,containerPadding,gridColumns}=useAdminJobsPageModel();
return (
    <div style={featureStyleFunctions.s0({containerPadding})}>
      {/* Header */}
      <div style={inlineStyles.s0}>
        <div>
          <h1 style={featureStyleFunctions.s1({T,isMobile})}>
            Job Placements
          </h1>
          <p style={featureStyleFunctions.s2({T})}>
            Post and coordinate career opportunities for active platform students.
          </p>
        </div>

        <button
          onClick={handleOpenCreateModal}
          style={featureStyleFunctions.s3({T})}
        >
          <Plus size={16} /> New Job Post
        </button>
      </div>

      {loading ? (
        <div style={inlineStyles.s1}>
          <div style={featureStyleFunctions.s4({T})} />
        </div>
      ) : jobs.length === 0 ? (
        <div style={featureStyleFunctions.s5({T})}>
          <Briefcase size={48} color={T.muted} style={inlineStyles.s2} />
          <h3 style={featureStyleFunctions.s6({T})}>No active job positions</h3>
          <p style={featureStyleFunctions.s7({T})}>
            There are no career openings listed right now. Post your first opportunity!
          </p>
          <button
            onClick={handleOpenCreateModal}
            style={featureStyleFunctions.s8({T})}
          >
            <Plus size={14} /> Post your first job
          </button>
        </div>
      ) : (
        <div style={featureStyleFunctions.s9({gridColumns})}>
          {jobs.map((job) => (
            <div
              key={job.id}
              style={featureStyleFunctions.s10({T})}
            >
              <div>
                {/* Header elements: Title & Actions */}
                <div style={inlineStyles.s3}>
                  <h3 style={featureStyleFunctions.s11({T})}>
                    {job.title}
                  </h3>
                  
                  <div style={inlineStyles.s4}>
                    <button
                      onClick={(e) => handleOpenEditModal(job, e)}
                      style={featureStyleFunctions.s12({T})}
                      onMouseEnter={(e) => e.currentTarget.style.color = T.purple}
                      onMouseLeave={(e) => e.currentTarget.style.color = T.muted}
                      title="Edit Job"
                    >
                      <Edit2 size={13} />
                    </button>
                    <button
                      onClick={(e) => handleDeleteJob(job.id, e)}
                      style={featureStyleFunctions.s13({T})}
                      onMouseEnter={(e) => e.currentTarget.style.color = T.red}
                      onMouseLeave={(e) => e.currentTarget.style.color = T.muted}
                      title="Delete Job"
                    >
                      <Trash2 size={13} />
                    </button>
                  </div>
                </div>

                <div style={inlineStyles.s5}>
                  <span style={featureStyleFunctions.s14({T})}>
                    {job.company}
                  </span>
                  {job.status === 'Closed' && (
                    <span style={featureStyleFunctions.s15({T})}>
                      CLOSED
                    </span>
                  )}
                </div>

                {/* Description snippet */}
                {job.description && (
                  <p style={featureStyleFunctions.s16({T})} dangerouslySetInnerHTML={{ __html: job.description }} />
                )}

                {/* Tags */}
                <div style={inlineStyles.s6}>
                  {/* Location Tag */}
                  <span style={featureStyleFunctions.s17({T})}>
                    <MapPin size={10} /> {job.location}
                  </span>

                  {/* Job Type Tag */}
                  <span style={featureStyleFunctions.s18({T})}>
                    <Clock size={10} /> {job.type}
                  </span>

                  {/* Work Mode Tag */}
                  <span style={featureStyleFunctions.s19({T})}>
                    <Globe size={10} /> {job.work_mode}
                  </span>
                </div>
              </div>

              {/* Posted Date Footer */}
              <div style={featureStyleFunctions.s20({T})}>
                <div style={inlineStyles.s7}>
                  <Calendar size={12} />
                  <span>{job.date}</span>
                </div>
                {job.company_website && (
                  <a href={job.company_website} target="_blank" rel="noreferrer" style={featureStyleFunctions.s21({T})}>
                    Website ↗
                  </a>
                )}
              </div>
            </div>
          ))}

          {/* Interactive Dotted Add Shortcut Card */}
          <div
            onClick={handleOpenCreateModal}
            style={featureStyleFunctions.s22({T})}
            onMouseEnter={(e) => {
              e.currentTarget.style.borderColor = T.purple;
              e.currentTarget.style.background = 'rgba(155, 110, 248, 0.01)';
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.borderColor = T.border;
              e.currentTarget.style.background = 'transparent';
            }}
          >
            <Plus size={24} color={T.purple} style={inlineStyles.s8} />
            <span style={featureStyleFunctions.s23({T})}>Post New Job Position</span>
            <span style={featureStyleFunctions.s24({T})}>Add more career placement modules</span>
          </div>
        </div>
      )}

      {/* Interactive Modal Form */}
      {isModalOpen && (
        <div style={inlineStyles.s9}>
          <div style={featureStyleFunctions.s25({T})}>
            {/* Modal Header */}
            <div style={featureStyleFunctions.s26({T})}>
              <h3 style={featureStyleFunctions.s27({T})}>
                {modalMode === 'create' ? 'Post New Position' : 'Edit Job Position'}
              </h3>
              <button
                onClick={() => setIsModalOpen(false)}
                style={featureStyleFunctions.s28({T})}
              >
                <X size={18} />
              </button>
            </div>

            {/* Modal Form Content */}
            <form onSubmit={handleSaveJobSubmit} style={inlineStyles.s10}>
              {submitError && (
                <div style={featureStyleFunctions.s29({T})}>
                  <span>⚠️</span>
                  <span>{submitError}</span>
                </div>
              )}
              <div style={inlineStyles.s11}>
                {/* Job Title */}
                <div style={inlineStyles.s12}>
                  <label style={featureStyleFunctions.s30({T})}>Job Title</label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Senior Software Engineer"
                    value={currentJob.title}
                    onChange={(e) => setCurrentJob({ ...currentJob, title: e.target.value })}
                    style={featureStyleFunctions.s31({T})}
                  />
                </div>

                {/* Company Name */}
                <div style={inlineStyles.s13}>
                  <label style={featureStyleFunctions.s32({T})}>Company Name</label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Google"
                    value={currentJob.company}
                    onChange={(e) => setCurrentJob({ ...currentJob, company: e.target.value })}
                    style={featureStyleFunctions.s33({T})}
                  />
                </div>
              </div>

              <div style={inlineStyles.s14}>
                {/* Location */}
                <div style={inlineStyles.s15}>
                  <label style={featureStyleFunctions.s34({T})}>Location Tag</label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Mountain View, CA"
                    value={currentJob.location}
                    onChange={(e) => setCurrentJob({ ...currentJob, location: e.target.value })}
                    style={featureStyleFunctions.s35({T})}
                  />
                </div>

                {/* Website */}
                <div style={inlineStyles.s16}>
                  <label style={featureStyleFunctions.s36({T})}>Company Website</label>
                  <input
                    type="url"
                    placeholder="https://company.com"
                    value={currentJob.company_website}
                    onChange={(e) => setCurrentJob({ ...currentJob, company_website: e.target.value })}
                    style={featureStyleFunctions.s37({T})}
                  />
                </div>
              </div>

              {/* Grid: Type, Mode, Status */}
              <div style={inlineStyles.s17}>
                <div style={inlineStyles.s18}>
                  <label style={featureStyleFunctions.s38({T})}>Job Type</label>
                  <select
                    value={currentJob.type}
                    onChange={(e) => setCurrentJob({ ...currentJob, type: e.target.value })}
                    style={featureStyleFunctions.s39({T})}
                  >
                    <option value="Full Time">Full Time</option>
                    <option value="Part Time">Part Time</option>
                    <option value="Contract">Contract</option>
                    <option value="Freelance">Freelance</option>
                  </select>
                </div>

                <div style={inlineStyles.s19}>
                  <label style={featureStyleFunctions.s40({T})}>Work Mode</label>
                  <select
                    value={currentJob.work_mode}
                    onChange={(e) => setCurrentJob({ ...currentJob, work_mode: e.target.value })}
                    style={featureStyleFunctions.s41({T})}
                  >
                    <option value="Remote">Remote</option>
                    <option value="Hybrid">Hybrid</option>
                    <option value="On-site">On-site</option>
                  </select>
                </div>

                <div style={inlineStyles.s20}>
                  <label style={featureStyleFunctions.s42({T})}>Status</label>
                  <select
                    value={currentJob.status}
                    onChange={(e) => setCurrentJob({ ...currentJob, status: e.target.value })}
                    style={featureStyleFunctions.s43({T})}
                  >
                    <option value="Open">Open</option>
                    <option value="Closed">Closed</option>
                  </select>
                </div>
              </div>

              {/* Description */}
              <div style={inlineStyles.s21}>
                <label style={featureStyleFunctions.s44({T})}>Description / Details</label>
                <textarea
                  placeholder="Describe details, benefits, requirements..."
                  value={currentJob.description}
                  onChange={(e) => setCurrentJob({ ...currentJob, description: e.target.value })}
                  style={featureStyleFunctions.s45({T})}
                />
              </div>

              {/* Action buttons */}
              <div style={featureStyleFunctions.s46({T})}>
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  style={featureStyleFunctions.s47({T})}
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  style={featureStyleFunctions.s48({T})}
                >
                  {modalMode === 'create' ? 'Post Job' : 'Save Changes'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );

}
