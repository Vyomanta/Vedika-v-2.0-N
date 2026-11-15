'use client';
import * as featureStyleFunctions from '@/features/opportunities/styles/View.68142a99.styles.js';

import inlineStyles from '@/features/opportunities/styles/jobs-page.jsx.styles.js';


import { useState, useEffect, useMemo } from 'react';
import { useRouter } from 'next/navigation';
import { Briefcase, MapPin, Clock, Calendar, Globe, Search, ArrowLeft, ArrowRight, ExternalLink, X } from 'lucide-react';
import { T } from '@/shared/design-system/theme';
import { useMediaQuery, isMobileMQ, isTabletMQ } from '@/lib/useMediaQuery';
import { getJobs } from '@/features/administration/api/collections';
import PacmanPagination from '@/components/PacmanPagination';
import ReactMarkdown from 'react-markdown';
import '@/app/jobs/jobs.css';

const PAGE_SIZE = 3;

export default function StudentJobsPage() {
  const router = useRouter();
  const isMobile = useMediaQuery(isMobileMQ);
  const isTablet = useMediaQuery(isTabletMQ);

  // States
  const [jobs, setJobs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterMode, setFilterMode] = useState('All');
  const [filterType, setFilterType] = useState('All');
  const [currentPage, setCurrentPage] = useState(1);
  
  // Selected Job for Detail Modal
  const [selectedJob, setSelectedJob] = useState(null);

  useEffect(() => {
    async function loadJobs() {
      try {
        setLoading(true);
        const list = await getJobs();
        // Students only see open positions
        setJobs(list.filter(j => j.status === 'Open'));
      } catch (e) {
        console.error(e);
      } finally {
        setLoading(false);
      }
    }
    loadJobs();
  }, []);

  // Page size: 2 on mobile to fit nicely on screen, 3 on desktop
  const pageSize = isMobile ? 2 : 3;

  // Filter logic
  const filteredJobs = useMemo(() => {
    return jobs.filter(job => {
      const matchesSearch = job.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                            job.company.toLowerCase().includes(searchTerm.toLowerCase()) ||
                            (job.description && job.description.toLowerCase().includes(searchTerm.toLowerCase()));
      const matchesMode = filterMode === 'All' || job.work_mode === filterMode;
      const matchesType = filterType === 'All' || job.type === filterType;

      return matchesSearch && matchesMode && matchesType;
    });
  }, [jobs, searchTerm, filterMode, filterType]);

  // Reset to page 1 on filter or search change
  useEffect(() => {
    setCurrentPage(1);
  }, [searchTerm, filterMode, filterType]);

  const totalPages = Math.max(1, Math.ceil(filteredJobs.length / pageSize));
  const paginatedJobs = useMemo(() => {
    const start = (currentPage - 1) * pageSize;
    return filteredJobs.slice(start, start + pageSize);
  }, [filteredJobs, currentPage, pageSize]);

  return (
    <div style={featureStyleFunctions.s0({isMobile})}>
      {/* Header */}
      <div style={featureStyleFunctions.s1({isMobile})}>
        <div style={inlineStyles.s0}>
          <button
            type="button"
            onClick={() => router.push('/')}
            style={featureStyleFunctions.s2({T})}
            onMouseEnter={(e) => { e.currentTarget.style.borderColor = T.accent; e.currentTarget.style.color = T.accent; }}
            onMouseLeave={(e) => { e.currentTarget.style.borderColor = T.border; e.currentTarget.style.color = T.text; }}
            title="Back to Dashboard"
          >
            <ArrowLeft size={14} />
            <span>Back</span>
          </button>
          <h1 style={featureStyleFunctions.s3({T,isMobile})}>
            Career Opportunities
          </h1>
        </div>
        <p style={featureStyleFunctions.s4({T,isMobile})}>
          Explore full-time, part-time, and remote jobs posted by partner organizations.
        </p>
      </div>

      {/* Filter and Search Bar */}
      <div style={featureStyleFunctions.s5({T,isMobile})}>
        {/* Search */}
        <div style={inlineStyles.s1}>
          <span style={inlineStyles.s2}>
            <Search size={15} color={T.muted} />
          </span>
          <input
            type="text"
            placeholder="Search job titles, skills, or companies..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            style={featureStyleFunctions.s6({T})}
          />
        </div>

        {/* Filters Row on mobile: side-by-side */}
        <div style={featureStyleFunctions.s7({isMobile})}>
          <select
            value={filterMode}
            onChange={(e) => setFilterMode(e.target.value)}
            style={featureStyleFunctions.s8({T,isMobile})}
          >
            <option value="All">All Work Modes</option>
            <option value="Remote">Remote</option>
            <option value="Hybrid">Hybrid</option>
            <option value="On-site">On-site</option>
          </select>

          <select
            value={filterType}
            onChange={(e) => setFilterType(e.target.value)}
            style={featureStyleFunctions.s9({T,isMobile})}
          >
            <option value="All">All Job Types</option>
            <option value="Full Time">Full Time</option>
            <option value="Part Time">Part Time</option>
            <option value="Contract">Contract</option>
            <option value="Freelance">Freelance</option>
          </select>
        </div>
      </div>

      {/* Main List Area: 3 Jobs per row, no vertical scroll */}
      <div style={inlineStyles.s3}>
        {loading ? (
          <div style={inlineStyles.s4}>
            <div style={featureStyleFunctions.s10({T})} />
          </div>
        ) : filteredJobs.length === 0 ? (
          <div style={featureStyleFunctions.s11({T})}>
            <Briefcase size={36} color={T.muted} style={inlineStyles.s5} />
            <h3 style={featureStyleFunctions.s12({T})}>No matching career openings</h3>
            <p style={featureStyleFunctions.s13({T})}>
              Try adjusting your keywords or filters to find other jobs.
            </p>
          </div>
        ) : (
          <div style={featureStyleFunctions.s14({isMobile,isTablet})}>
            {paginatedJobs.map((job) => {
              const isSelected = selectedJob?.id === job.id;
              return (
                <div
                  key={job.id}
                  onClick={() => setSelectedJob(job)}
                  className={`animated-job-card ${isSelected ? 'is-selected' : ''}`}
                  style={featureStyleFunctions.s15({T,isSelected,isMobile})}
                >
                  {/* Animated curved border beam that smoothly contours around 14px rounded corners */}
                  <div className="animated-curved-border-wrap" />

                  {/* Top content */}
                  <div>
                    <h3 style={featureStyleFunctions.s16({T})}>
                      {job.title}
                    </h3>
                    <div style={featureStyleFunctions.s17({T})}>
                      {job.company}
                    </div>

                    <div style={inlineStyles.s6}>
                      <span style={featureStyleFunctions.s18({T})}>
                        <MapPin size={11} color={T.accent} /> {job.location}
                      </span>
                      <span style={featureStyleFunctions.s19({T})}>
                        <Clock size={11} color={T.green} /> {job.type}
                      </span>
                      <span style={featureStyleFunctions.s20({T})}>
                        <Globe size={11} color={T.amber} /> {job.work_mode}
                      </span>
                    </div>
                  </div>

                  {/* Bottom footer row */}
                  <div style={featureStyleFunctions.s21({T})}>
                    <div style={featureStyleFunctions.s22({T})}>
                      <Calendar size={12} />
                      <span>{job.date || 'Recently'}</span>
                    </div>

                    <span style={featureStyleFunctions.s23({T})}>
                      View Details <ArrowRight size={13} />
                    </span>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>

      {/* Pacman Pagination Footer */}
      {!loading && filteredJobs.length > 0 && (
        <div style={inlineStyles.s7}>
          <PacmanPagination
            currentPage={currentPage}
            totalPages={totalPages}
            onPageChange={(page) => setCurrentPage(page)}
          />
        </div>
      )}

      {/* Details Modal */}
      {selectedJob && (
        <div style={featureStyleFunctions.s24({isMobile})}>
          <div style={featureStyleFunctions.s25({T,isMobile})}>
            {/* Header */}
            <div style={featureStyleFunctions.s26({isMobile,T})}>
              <div>
                <h2 style={featureStyleFunctions.s27({T,isMobile})}>
                  {selectedJob.title}
                </h2>
                <div style={featureStyleFunctions.s28({T,isMobile})}>
                  {selectedJob.company}
                </div>
              </div>
              <button
                onClick={() => setSelectedJob(null)}
                style={featureStyleFunctions.s29({T})}
              >
                <X size={20} />
              </button>
            </div>

            {/* Scrollable details */}
            <div style={featureStyleFunctions.s30({isMobile})}>
              {/* Meta details list */}
              <div style={featureStyleFunctions.s31({isMobile,T})}>
                <div style={featureStyleFunctions.s32({T})}>
                  Location: <strong style={featureStyleFunctions.s33({T})}>{selectedJob.location}</strong>
                </div>
                <div style={featureStyleFunctions.s34({T})}>
                  Job Type: <strong style={featureStyleFunctions.s35({T})}>{selectedJob.type}</strong>
                </div>
                <div style={featureStyleFunctions.s36({T})}>
                  Work Mode: <strong style={featureStyleFunctions.s37({T})}>{selectedJob.work_mode}</strong>
                </div>
                <div style={featureStyleFunctions.s38({T})}>
                  Posted Date: <strong style={featureStyleFunctions.s39({T})}>{selectedJob.date}</strong>
                </div>
              </div>

              {/* Description body */}
              <div>
                <h4 style={featureStyleFunctions.s40({T})}>Job Description</h4>
                <div
                  style={featureStyleFunctions.s41({T})}
                >
                  <ReactMarkdown>
                    {selectedJob.description || 'No description provided for this job.'}
                  </ReactMarkdown>
                </div>
              </div>
            </div>

            {/* Footer with actions */}
            <div style={featureStyleFunctions.s42({T})}>
              <div>
                {selectedJob.company_website && (
                  <a
                    href={selectedJob.company_website}
                    target="_blank"
                    rel="noreferrer"
                    style={featureStyleFunctions.s43({T})}
                  >
                    Visit company website <ExternalLink size={12} />
                  </a>
                )}
              </div>

              <div style={inlineStyles.s8}>
                <button
                  onClick={() => setSelectedJob(null)}
                  style={featureStyleFunctions.s44({T})}
                >
                  Close
                </button>
                <a
                  href={`mailto:careers@${selectedJob.company.toLowerCase().replace(/\s+/g, '')}.com?subject=Application for ${selectedJob.title}`}
                  style={featureStyleFunctions.s45({T})}
                >
                  Apply Now
                </a>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
