'use client';
import * as featureStyleFunctions from '@/features/progress/styles/ProgressPage.e3971795.styles.js';

import inlineStyles from '@/features/progress/styles/ProgressPage.styles';


import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import {
  ArrowLeft, BookOpen, CheckCircle, Circle, Clock, Trophy, Award, FileText, ClipboardList
} from 'lucide-react';
import { T } from '@/shared/design-system/theme';
import { getCourseDetails } from '@/features/courses/domain/course-data';
import { useMediaQuery, isMobileMQ, isTabletMQ } from '@/lib/useMediaQuery';
import { getCourses, getCourseSyllabus } from '@/features/courses/api/client';
import { getStudentEnrollments } from '@/features/administration/api/collections';
import { getQuizzes, getQuizSubmissions, getAssignments, getAssignmentSubmissions } from '@/features/assessments/api/client';

export default function ProgressPage({ completed = {} }) {
  const router = useRouter();
  const isMobile = useMediaQuery(isMobileMQ);
  const isTablet = useMediaQuery(isTabletMQ);
  const statCols = isMobile ? 'repeat(2,1fr)' : isTablet ? 'repeat(2,1fr)' : 'repeat(4,1fr)';
  const lessonCols = isMobile ? 'repeat(3,1fr)' : isTablet ? 'repeat(4,1fr)' : 'repeat(5,1fr)';

  // LMS Backend Stats
  const [currentUser, setCurrentUser] = useState(null);
  const [quizzesCount, setQuizzesCount] = useState(0);
  const [passedQuizzesCount, setPassedQuizzesCount] = useState(0);
  const [assignmentsCount, setAssignmentsCount] = useState(0);
  const [submittedAssignmentsCount, setSubmittedAssignmentsCount] = useState(0);
  const [submissionsList, setSubmissionsList] = useState([]);

  // Enrolled Courses & Selected Syllabus
  const [enrolledCourses, setEnrolledCourses] = useState([]);
  const [selectedCourseId, setSelectedCourseId] = useState('');
  const [selectedCourseSyllabus, setSelectedCourseSyllabus] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const stored = localStorage.getItem('frappe_user');
    if (stored) {
      try { setCurrentUser(JSON.parse(stored)); } catch (e) {}
    }
  }, []);

  useEffect(() => {
    if (!currentUser) return;
    
    async function loadStatsAndCourses() {
      setLoading(true);
      try {
        const email = currentUser.email || '';
        const [list, enrollments, quizzes, quizSubs, assignments, assSubs] = await Promise.all([
          getCourses(),
          email ? getStudentEnrollments(email) : Promise.resolve([]),
          getQuizzes(),
          getQuizSubmissions(),
          getAssignments(),
          getAssignmentSubmissions()
        ]);
        
        const published = list.filter(c => c.status === 'Published');
        const enrolled = published.filter(c => enrollments.includes(c.id));
        setEnrolledCourses(enrolled);

        let defaultId = '';
        if (typeof window !== 'undefined') {
          const lastCourseId = localStorage.getItem('selected_course_id');
          if (lastCourseId && enrolled.some(c => c.id === lastCourseId)) {
            defaultId = lastCourseId;
          }
        }
        if (!defaultId && enrolled.length > 0) {
          defaultId = enrolled[0].id;
        }
        setSelectedCourseId(defaultId);

        if (defaultId) {
          try {
            const syllabus = await getCourseSyllabus(defaultId);
            setSelectedCourseSyllabus(syllabus);
          } catch (err) {
            console.error("Failed to load syllabus", err);
          }
        }

        setQuizzesCount(quizzes.length);
        
        // Count passed quizzes
        const userQuizSubs = quizSubs.filter(s => s.member === currentUser.username);
        const passedQuizzes = new Set();
        userQuizSubs.forEach(sub => {
          if (sub.percentage >= sub.passing_percentage) {
            passedQuizzes.add(sub.quiz);
          }
        });
        setPassedQuizzesCount(passedQuizzes.size);

        setAssignmentsCount(assignments.length);
        const userAssSubs = assSubs.filter(s => s.member === currentUser.username);
        setSubmittedAssignmentsCount(userAssSubs.length);
        setSubmissionsList(userAssSubs);
      } catch (e) {
        console.error("Failed to load progress stats:", e);
      } finally {
        setLoading(false);
      }
    }
    loadStatsAndCourses();
  }, [currentUser]);

  // Load syllabus when selectedCourseId changes
  useEffect(() => {
    if (!selectedCourseId) return;
    async function loadSyllabus() {
      try {
        const syllabus = await getCourseSyllabus(selectedCourseId);
        setSelectedCourseSyllabus(syllabus);
      } catch (e) {
        console.error("Failed to load syllabus for", selectedCourseId, e);
      }
    }
    loadSyllabus();
  }, [selectedCourseId]);

  // Compute course-specific progress stats
  const modules = selectedCourseSyllabus?.modules || [];
  const courseLessons = modules.flatMap(m => m.lessons || []);
  const total = courseLessons.length;
  const done = courseLessons.filter(l => completed[l.id]).length;
  const pct = total > 0 ? Math.round((done / total) * 100) : 0;

  const stats = [
    { label: 'Lessons Done',    val: done,                   total: total,        color: T.accent, Icon: CheckCircle },
    { label: 'Quizzes Passed',   val: passedQuizzesCount,      total: quizzesCount, color: T.purple, Icon: Award },
    { label: 'Assignments Done', val: submittedAssignmentsCount, total: assignmentsCount, color: T.amber, Icon: FileText },
    { label: 'Completion',       val: `${pct}%`,              total: null,         color: T.green,  Icon: Trophy },
  ];

  if (loading) {
    return (
      <div style={inlineStyles.s0}>
        <div style={inlineStyles.s1}>
          <div style={inlineStyles.s2} />
          <div style={inlineStyles.s3}>Loading progress details...</div>
        </div>
      </div>
    );
  }

  if (enrolledCourses.length === 0) {
    return (
      <div style={featureStyleFunctions.s0({isMobile})}>
        <h2 style={featureStyleFunctions.s1({T})}>
          Progress Dashboard
        </h2>
        <div style={featureStyleFunctions.s2({T})}>
          <div style={inlineStyles.s4}>📈</div>
          <h3 style={featureStyleFunctions.s3({T})}>No Active Enrollments</h3>
          <p style={featureStyleFunctions.s4({T})}>
            To see your learning progress and KPIs, enroll in a course first.
          </p>
          <a href="/courses" style={featureStyleFunctions.s5({T})}>
            Explore Courses
          </a>
        </div>
      </div>
    );
  }

  return (
    <div style={featureStyleFunctions.s6({isMobile})}>
      <div style={inlineStyles.s5}>
        <button
          type="button"
          onClick={() => router.push('/')}
          style={featureStyleFunctions.s7({T})}
          title="Back to Dashboard"
        >
          <ArrowLeft size={14} />
          <span>Back</span>
        </button>
        <h2 style={featureStyleFunctions.s8({T,isMobile})}>
          Progress Dashboard
        </h2>
      </div>
      <p style={featureStyleFunctions.s9({T,isMobile})}>
        Your progress in <span style={featureStyleFunctions.s10({T})}>{selectedCourseSyllabus?.title || "selected course"}</span> at a glance.
      </p>

      {/* Course Selector */}
      {enrolledCourses.length > 1 && (
        <div style={inlineStyles.s6}>
          <span style={featureStyleFunctions.s11({T})}>Select Course:</span>
          <select 
            value={selectedCourseId} 
            onChange={(e) => {
              setSelectedCourseId(e.target.value);
              if (typeof window !== 'undefined') {
                localStorage.setItem('selected_course_id', e.target.value);
              }
            }}
            style={featureStyleFunctions.s12({T,isMobile})}
          >
            {enrolledCourses.map(course => (
              <option key={course.id} value={course.id} style={featureStyleFunctions.s13({T})}>
                {course.title}
              </option>
            ))}
          </select>
        </div>
      )}

      {/* Stats grid */}
      <div style={featureStyleFunctions.s14({statCols,isMobile})}>
        {stats.map(({ label, val, total: t, color, Icon }) => (
          <div key={label} style={featureStyleFunctions.s15({T,isMobile})}>
            <div style={inlineStyles.s7}>
              <span style={featureStyleFunctions.s16({isMobile,T})}>{label}</span>
              <div style={featureStyleFunctions.s17({color})}>
                <Icon size={12} color={color} />
              </div>
            </div>
            <div style={featureStyleFunctions.s18({isMobile,T})}>{val}</div>
            {t !== null && <div style={featureStyleFunctions.s19({T})}>of {t}</div>}
          </div>
        ))}
      </div>

      {/* Assignment submissions feedback panel */}
      {submissionsList.length > 0 && (
        <div style={featureStyleFunctions.s20({T,isMobile})}>
          <div style={featureStyleFunctions.s21({T})}>
            <ClipboardList size={16} color={T.amber} /> Assignment Grading Reviews
          </div>
          
          <div style={inlineStyles.s8}>
            {submissionsList.map(sub => (
              <div key={sub.id} style={featureStyleFunctions.s22({isMobile,T})}>
                <div style={inlineStyles.s9}>
                  <div style={featureStyleFunctions.s23({T})}>{sub.assignment_title}</div>
                  {sub.comments && <div style={featureStyleFunctions.s24({T})}>Feedback: "{sub.comments}"</div>}
                </div>
                <span style={featureStyleFunctions.s25({isMobile,sub,T})}>
                  {sub.status.toUpperCase()}
                </span>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Module progress */}
      <div style={featureStyleFunctions.s26({T,isMobile})}>
        <div style={featureStyleFunctions.s27({T})}>Module Progress</div>
        {modules.map(mod => {
          const modDone = (mod.lessons || []).filter(l => completed[l.id]).length;
          const modPct  = mod.lessons?.length > 0 ? Math.round((modDone / mod.lessons.length) * 100) : 0;
          return (
            <div key={mod.id} style={inlineStyles.s10}>
              <div style={inlineStyles.s11}>
                <span style={featureStyleFunctions.s28({T})}>{mod.emoji || "📖"} {mod.title}</span>
                <span style={featureStyleFunctions.s29({T})}>{modDone}/{mod.lessons?.length || 0} · {modPct}%</span>
              </div>
              <div style={featureStyleFunctions.s30({T})}>
                <div style={featureStyleFunctions.s31({mod,T,modPct})} />
              </div>
            </div>
          );
        })}
      </div>

      {/* Lesson status grid */}
      <div style={featureStyleFunctions.s32({T,isMobile})}>
        <div style={featureStyleFunctions.s33({T})}>Lesson Status</div>
        {courseLessons.length === 0 ? (
          <div style={featureStyleFunctions.s34({T})}>No lessons in this course yet.</div>
        ) : (
          <div style={featureStyleFunctions.s35({lessonCols})}>
            {courseLessons.map(l => (
              <div key={l.id} title={l.title}
                style={featureStyleFunctions.s36({completed,l,T,isMobile})}>
                {completed[l.id]
                  ? <CheckCircle size={12} color={T.green} style={inlineStyles.s12} />
                  : <Circle size={12} color={T.dim} style={inlineStyles.s13} />}
                <div style={featureStyleFunctions.s37({completed,l,T})}>
                  {l.title}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
