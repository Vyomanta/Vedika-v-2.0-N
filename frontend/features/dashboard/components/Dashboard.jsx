'use client';
import * as featureStyleFunctions from '@/features/dashboard/styles/Dashboard.7f342ae5.styles.js';

import inlineStyles from '@/features/dashboard/styles/Dashboard.styles';


import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import {
  BookOpen, Brain, CheckCircle, ChevronRight, GraduationCap, Flame,
  Sparkles, CheckSquare, HelpCircle, ArrowRight, Award, Trophy, Clock
} from 'lucide-react';
import { T } from '@/shared/design-system/theme';
import { getCourseDetails } from '@/features/courses/domain/course-data';
import { getCourses, getCourseSyllabus } from '@/features/courses/api/client';
import { getStudentEnrollments } from '@/features/administration/api/collections';
import { saveProgressToRedis, getProgressFromRedis } from '@/features/progress/api/lms';
import { useMediaQuery, isMobileMQ, isTabletMQ } from '@/lib/useMediaQuery';
import VedikaParticleBot from '@/components/VedikaParticleBot';

export default function Dashboard() {
  const router = useRouter();
  const [courses, setCourses] = useState([]);
  const [enrolledCourses, setEnrolledCourses] = useState([]);
  const [completed, setCompleted] = useState({});
  const [loading, setLoading] = useState(true);
  const isMobile = useMediaQuery(isMobileMQ);
  const isTablet = useMediaQuery(isTabletMQ);
  
  const rPad = isMobile ? 16 : 36;
  const statCols = isMobile ? '1fr' : 'repeat(2,1fr)';
  const mainGridCols = isMobile ? '1fr' : '2fr 1fr';
  const bottomCols = isMobile ? '1fr' : '1fr 1fr';

  // Interactive state variables
  const [greeting, setGreeting] = useState('Welcome back');
  const [userName, setUserName] = useState('Student');
  const [streak, setStreak] = useState(3);
  const [quickPrompt, setQuickPrompt] = useState('');
  const [conceptFlipped, setConceptFlipped] = useState(false);
  
  // Daily Skill Check state
  const [selectedQuizOption, setSelectedQuizOption] = useState(null);
  const [quizSubmitted, setQuizSubmitted] = useState(false);

  // Daily Tasks state
  const [tasks, setTasks] = useState([
    { id: 'resume', label: 'Resume active syllabus', completed: false },
    { id: 'tutor', label: 'Ask a question in AI Tutor', completed: false },
    { id: 'daily_concept', label: 'Review Daily Concept Card', completed: false },
    { id: 'skill_check', label: 'Complete Daily Skill Check', completed: false }
  ]);

  useEffect(() => {
    // Dynamic greeting based on time of day
    const hours = new Date().getHours();
    if (hours < 12) setGreeting('Good morning');
    else if (hours < 18) setGreeting('Good afternoon');
    else setGreeting('Good evening');

    if (typeof window !== 'undefined') {
      // Load user profile
      const stored = localStorage.getItem('frappe_user');
      if (stored) {
        try {
          const user = JSON.parse(stored);
          if (user && user.name) {
            setUserName(user.name);
          }
        } catch (e) {}
      }

      // Load daily tasks
      const savedTasks = localStorage.getItem('dashboard_daily_tasks');
      if (savedTasks) {
        try {
          setTasks(JSON.parse(savedTasks));
        } catch (e) {}
      }

      // Load streak
      const savedStreak = localStorage.getItem('dashboard_learning_streak');
      if (savedStreak) {
        setStreak(parseInt(savedStreak));
      } else {
        localStorage.setItem('dashboard_learning_streak', '3');
      }

      // Load Quiz selection
      const savedQuizOption = localStorage.getItem('dashboard_daily_quiz_opt');
      if (savedQuizOption !== null) {
        setSelectedQuizOption(parseInt(savedQuizOption));
        setQuizSubmitted(true);
      }
    }
  }, []);

  // Fetch courses and progress on mount
  useEffect(() => {
    async function loadDashboardData() {
      try {
        let email = '';
        if (typeof window !== 'undefined') {
          const stored = localStorage.getItem('frappe_user');
          if (stored) {
            try {
              const user = JSON.parse(stored);
              if (user && user.email) {
                email = user.email;
              }
            } catch (e) {}
          }
        }

        const [list, enrollments] = await Promise.all([
          getCourses(),
          email ? getStudentEnrollments(email) : Promise.resolve([])
        ]);
        const published = list.filter(c => c.status === 'Published');
        setCourses(published);

        const enrolled = published.filter(c => enrollments.includes(c.id));
        
        // Fetch syllabus/details for all enrolled courses in parallel
        const enrolledWithDetails = await Promise.all(
          enrolled.map(async (course) => {
            try {
              const details = await getCourseSyllabus(course.id);
              return { ...course, details };
            } catch (err) {
              console.error("Failed to fetch syllabus for course:", course.id, err);
              const details = getCourseDetails(course);
              return { ...course, details };
            }
          })
        );
        setEnrolledCourses(enrolledWithDetails);
      } catch (e) {
        console.error(e);
      } finally {
        setLoading(false);
      }
    }
    loadDashboardData();

    let key = 'completed_lessons';
    let email = '';
    if (typeof window !== 'undefined') {
      const stored = localStorage.getItem('frappe_user');
      if (stored) {
        try {
          const user = JSON.parse(stored);
          if (user && user.email) {
            key = `completed_lessons_${user.email}`;
            email = user.email;
          }
        } catch (e) {}
      }
    }
    const savedCompleted = localStorage.getItem(key);
    let localCompleted = {};
    if (savedCompleted) {
      try {
        localCompleted = JSON.parse(savedCompleted);
        setCompleted(localCompleted);
      } catch (e) {}
    }

    if (email) {
      getProgressFromRedis(email).then(async (remoteCompleted) => {
        if (remoteCompleted) {
          const merged = { ...localCompleted, ...remoteCompleted };
          setCompleted(merged);
          localStorage.setItem(`completed_lessons_${email}`, JSON.stringify(merged));
          
          const remoteKeys = Object.keys(remoteCompleted).length;
          const mergedKeys = Object.keys(merged).length;
          if (mergedKeys > remoteKeys) {
            await saveProgressToRedis(email, merged);
          }
        }
      }).catch(err => console.error("Error synchronizing progress:", err));
    }
  }, []);

  // Compute stats dynamically for enrolled courses
  let totalLessons = 0;
  let totalModules = 0;
  let completedCount = 0;

  const enrolledWithProgress = enrolledCourses.map(course => {
    const details = course.details || getCourseDetails(course);
    let courseLessonsCount = 0;
    let courseCompletedCount = 0;
    let courseModulesCount = 0;

    if (details && details.modules) {
      courseModulesCount = details.modules.length;
      details.modules.forEach(m => {
        if (m.lessons) {
          courseLessonsCount += m.lessons.length;
          m.lessons.forEach(l => {
            if (completed[l.id]) {
              courseCompletedCount++;
            }
          });
        }
      });
    }

    const pct = courseLessonsCount > 0 ? Math.round((courseCompletedCount / courseLessonsCount) * 100) : 0;

    totalLessons += courseLessonsCount;
    totalModules += courseModulesCount;
    completedCount += courseCompletedCount;

    return {
      ...course,
      modulesCount: courseModulesCount,
      lessonsCount: courseLessonsCount,
      completedCount: courseCompletedCount,
      progressPercent: pct
    };
  });

  // Next up uncompleted lesson logic
  const activeCourse = enrolledWithProgress[0];
  let nextLesson = null;
  if (activeCourse && activeCourse.details && activeCourse.details.modules) {
    for (const mod of activeCourse.details.modules) {
      for (const les of mod.lessons) {
        if (!completed[les.id]) {
          nextLesson = les;
          break;
        }
      }
      if (nextLesson) break;
    }
  }

  const overallProgressPercent = totalLessons > 0 ? Math.round((completedCount / totalLessons) * 100) : 0;

  const stats = [
    { label: 'Lessons Completed', val: `${completedCount}/${totalLessons}`, sub: `${overallProgressPercent}% done`, color: 'var(--accent)', Icon: CheckCircle },
    { label: 'Enrolled Courses', val: `${enrolledCourses.length}`, sub: 'Active cohort learning', color: 'var(--green)', Icon: BookOpen },
  ];

  // Checklist Actions
  const toggleTask = (taskId) => {
    const updated = tasks.map(t => t.id === taskId ? { ...t, completed: !t.completed } : t);
    setTasks(updated);
    if (typeof window !== 'undefined') {
      localStorage.setItem('dashboard_daily_tasks', JSON.stringify(updated));
    }
  };

  // Quick Ask Action
  const handleQuickAskSubmit = (e) => {
    e.preventDefault();
    const query = quickPrompt.trim();
    if (!query) return;
    if (typeof window !== 'undefined') {
      localStorage.setItem('tutor_prefill_query', query);
      
      const updated = tasks.map(t => t.id === 'tutor' ? { ...t, completed: true } : t);
      setTasks(updated);
      localStorage.setItem('dashboard_daily_tasks', JSON.stringify(updated));
    }
    router.push('/general-tutor');
  };

  // Daily Quiz Action
  const handleSelectQuizOption = (optIdx) => {
    if (quizSubmitted) return;
    setSelectedQuizOption(optIdx);
    setQuizSubmitted(true);
    if (typeof window !== 'undefined') {
      localStorage.setItem('dashboard_daily_quiz_opt', String(optIdx));
      
      const updated = tasks.map(t => t.id === 'skill_check' ? { ...t, completed: true } : t);
      setTasks(updated);
      localStorage.setItem('dashboard_daily_tasks', JSON.stringify(updated));
    }
  };

  // Concept Card Flip
  const handleFlipConcept = () => {
    setConceptFlipped(!conceptFlipped);
    const updated = tasks.map(t => t.id === 'daily_concept' ? { ...t, completed: true } : t);
    setTasks(updated);
    if (typeof window !== 'undefined') {
      localStorage.setItem('dashboard_daily_tasks', JSON.stringify(updated));
    }
  };

  if (loading) {
    return (
      <div style={inlineStyles.s0}>
        <div style={inlineStyles.s1}>
          <div style={inlineStyles.s2} />
          <div style={inlineStyles.s3}>Loading student workspace...</div>
        </div>
      </div>
    );
  }

  // Quiz values
  const quizAnswers = [
    "int x = 10",
    "x = 10",
    "declare x = 10",
    "const x = 10"
  ];
  const correctAnswerIdx = 1;

  return (
    <div style={featureStyleFunctions.s0({rPad})}>

      {/* ──────────────────────────────────────────────────────── */}
      {/* HERO SECTION: VEDIKA AI TUTOR (Left) + PARTICLE BOT (Right) */}
      {/* ──────────────────────────────────────────────────────── */}
      <div style={featureStyleFunctions.s1({isMobile})}>

        {/* Left Side: Codepen-style Kinetic Masked Sliding Syllable Typography */}
        <div style={featureStyleFunctions.s2({isMobile})}>
          <style>{featureStyleFunctions.s3({isMobile})}</style>
          
          <div className="hero-title-h1">
            {/* ROW 1: "VEDIKA" with masked sliding syllables */}
            <div
              className="hero-title-row hero-title-row-1"
              style={featureStyleFunctions.s4({isMobile})}
            >
              <div className="title-charts-cont" id="syl-ve">
                <u>
                  <span className="syl-ve">VE</span>
                </u>
              </div>
              <div className="title-charts-cont" id="syl-di">
                <u>
                  <span className="syl-di">DI</span>
                </u>
              </div>
              <div className="title-charts-cont" id="syl-ka">
                <u>
                  <span className="syl-ka">KA</span>
                </u>
              </div>
            </div>

            {/* ROW 2: "AI TUTOR" with offset & masked sliding syllables */}
            <div
              className="hero-title-row hero-title-row-2"
              style={featureStyleFunctions.s5({isMobile})}
            >
              <div className="title-charts-cont" id="syl-ai" style={featureStyleFunctions.s6({isMobile})}>
                <u>
                  <span className="syl-ai row2-gradient-text">AI</span>
                </u>
              </div>
              <div className="title-charts-cont" id="syl-tu">
                <u>
                  <span className="syl-tu row2-gradient-text">TU</span>
                </u>
              </div>
              <div className="title-charts-cont" id="syl-tor">
                <u>
                  <span className="syl-tor row2-gradient-text">TOR</span>
                </u>
              </div>
            </div>
          </div>
        </div>

        {/* Right Side: Black & White Interactive Particle Bot */}
        <div style={featureStyleFunctions.s7({isMobile})}>
          <VedikaParticleBot
            src="/vedika-bot.png"
            width={isMobile ? 360 : 520}
            height={isMobile ? 380 : 560}
          />
        </div>
      </div>

      {/* Dynamic Header & Greeting (Present Dashboard Continues Below) */}
      <div style={inlineStyles.s4}>
        <div>
          <h1 style={featureStyleFunctions.s8({isMobile})}>
            {greeting}, {userName.split(' ')[0]}! 👋
          </h1>
          <p style={featureStyleFunctions.s9({isMobile})}>
            Ready to explore Python concepts and sandboxes today?
          </p>
        </div>

        {/* Dynamic Streak Badge */}
        <div style={inlineStyles.s5}
        onClick={() => {
          const nextStreak = streak + 1;
          setStreak(nextStreak);
          localStorage.setItem('dashboard_learning_streak', String(nextStreak));
        }}
        onMouseEnter={e => e.currentTarget.style.transform = 'scale(1.04)'}
        onMouseLeave={e => e.currentTarget.style.transform = 'none'}
        title="Click to increase streak!"
        >
          <Flame size={16} fill="#000" />
          <span>{streak}-Day Streak</span>
        </div>
      </div>

      {/* Interactive Quick-Ask AI Prompt Box */}
      <div style={inlineStyles.s6}>
        <form onSubmit={handleQuickAskSubmit} style={inlineStyles.s7}>
          <div style={inlineStyles.s8}>
            <Sparkles size={15} /> Ask your AI Tutor anything...
          </div>
          <div style={inlineStyles.s9}>
            <input
              type="text"
              placeholder="e.g. What is a lambda function? or Give me a quiz on lists."
              value={quickPrompt}
              onChange={e => setQuickPrompt(e.target.value)}
              style={inlineStyles.s10}
              onFocus={e => e.target.style.borderColor = 'var(--accent)'}
              onBlur={e => e.target.style.borderColor = 'var(--border)'}
            />
            <button
              type="submit"
              style={inlineStyles.s11}
              onMouseEnter={e => e.currentTarget.style.opacity = 0.9}
              onMouseLeave={e => e.currentTarget.style.opacity = 1}
            >
              Ask AI
            </button>
          </div>
        </form>
      </div>

      {/* Main Grid Content Layout */}
      <div style={featureStyleFunctions.s10({mainGridCols})}>
        
        {/* Left Side (Learning Progress & Courses) */}
        <div style={inlineStyles.s12}>
          
          {/* Stat Cards Row */}
          <div style={featureStyleFunctions.s11({statCols})}>
            {stats.map(({ label, val, sub, color, Icon }) => (
              <div
                key={label}
                style={inlineStyles.s13}
                onMouseEnter={e => {
                  e.currentTarget.style.transform = 'translateY(-2px)';
                  e.currentTarget.style.borderColor = color;
                }}
                onMouseLeave={e => {
                  e.currentTarget.style.transform = 'none';
                  e.currentTarget.style.borderColor = 'var(--border)';
                }}
                onClick={() => {
                  if (label === 'Lessons Completed') {
                    router.push('/progress');
                  } else {
                    router.push('/courses');
                  }
                }}
              >
                <div style={inlineStyles.s14}>
                  <span style={inlineStyles.s15}>{label}</span>
                  <div style={featureStyleFunctions.s12({color})}>
                    <Icon size={14} color={color} />
                  </div>
                </div>
                <div style={inlineStyles.s16}>{val}</div>
                <div style={inlineStyles.s17}>{sub}</div>
              </div>
            ))}
          </div>

          {/* Active / Continue learning syllabus */}
          <div style={inlineStyles.s18}>
            <div>
              <div style={inlineStyles.s19}>
                <GraduationCap size={14} /> Active Syllabus
              </div>
              <div style={inlineStyles.s20}>
                {activeCourse?.title || 'No Courses Enrolled'}
              </div>
              <p style={inlineStyles.s21}>
                {activeCourse ? (
                  nextLesson ? (
                    <>📖 Next Lesson: <span style={inlineStyles.s22}>{nextLesson.title}</span> ({nextLesson.dur})</>
                  ) : (
                    '🎉 You completed all lessons in this syllabus! Perfect!'
                  )
                ) : (
                  'Go to Explore Courses to enroll and begin your coding journey!'
                )}
              </p>
            </div>

            <div>
              {activeCourse && (
                <>
                  <div style={inlineStyles.s23}>
                    <div style={featureStyleFunctions.s13({activeCourse})} />
                  </div>
                  <div style={inlineStyles.s24}>
                    <span style={inlineStyles.s25}>{activeCourse.progressPercent}% complete</span>
                    <button
                      onClick={() => {
                        if (typeof window !== 'undefined') {
                          localStorage.setItem('selected_course_id', activeCourse.id);
                        }
                        // Check daily task
                        const updated = tasks.map(t => t.id === 'resume' ? { ...t, completed: true } : t);
                        setTasks(updated);
                        localStorage.setItem('dashboard_daily_tasks', JSON.stringify(updated));
                        
                        if (nextLesson) {
                          router.push(`/lesson/${nextLesson.id}`);
                        } else {
                          router.push('/courses');
                        }
                      }}
                      style={inlineStyles.s26}
                    >
                      {nextLesson ? 'Resume Learning' : 'View Course'} <ChevronRight size={14} />
                    </button>
                  </div>
                </>
              )}
              {!activeCourse && (
                <button
                  onClick={() => router.push('/courses')}
                  style={inlineStyles.s27}
                >
                  Explore Courses <ChevronRight size={14} />
                </button>
              )}
            </div>
          </div>

          {/* AI Tools Cards */}
          <div style={featureStyleFunctions.s14({bottomCols})}>
            
            {/* General Tutor Shortcut */}
            <div style={inlineStyles.s28}>
              <div>
                <div style={inlineStyles.s29}>
                  <Brain size={14} /> AI Assistant Hub
                </div>
                <div style={inlineStyles.s30}>Ask your AI Tutor</div>
                <div style={inlineStyles.s31}>
                  Ask questions, generate flashcards, and study customized visual outlines.
                </div>
              </div>
              <button
                onClick={() => router.push('/general-tutor')}
                style={inlineStyles.s32}
                onMouseEnter={e => {
                  e.currentTarget.style.background = 'rgba(155, 110, 248, 0.08)';
                  e.currentTarget.style.borderColor = 'var(--purple)';
                }}
                onMouseLeave={e => {
                  e.currentTarget.style.background = 'transparent';
                  e.currentTarget.style.borderColor = 'var(--border)';
                }}
              >
                Open Tutor Hub <ArrowRight size={13} />
              </button>
            </div>

            {/* Coding Tutor Shortcut */}
            <div style={inlineStyles.s33}>
              <div>
                <div style={inlineStyles.s34}>
                  <Flame size={14} /> Practice Sandbox
                </div>
                <div style={inlineStyles.s35}>Code with AI Tutor</div>
                <div style={inlineStyles.s36}>
                  Write, test, and debug Python code samples directly with an AI helper.
                </div>
              </div>
              <button
                onClick={() => router.push('/coding-tutor')}
                style={inlineStyles.s37}
                onMouseEnter={e => {
                  e.currentTarget.style.background = 'rgba(34, 197, 160, 0.08)';
                  e.currentTarget.style.borderColor = 'var(--green)';
                }}
                onMouseLeave={e => {
                  e.currentTarget.style.background = 'transparent';
                  e.currentTarget.style.borderColor = 'var(--border)';
                }}
              >
                Start Sandbox <ArrowRight size={13} />
              </button>
            </div>

          </div>

          {/* Other Enrolled Courses List */}
          {enrolledWithProgress.length > 1 && (
            <div style={inlineStyles.s38}>
              <h2 style={inlineStyles.s39}>
                <BookOpen size={16} color="var(--accent)" /> Other Enrolled Courses
              </h2>
              <div style={featureStyleFunctions.s15({bottomCols})}>
                {enrolledWithProgress.slice(1).map(course => (
                  <div key={course.id} style={inlineStyles.s40}>
                    <div>
                      <div style={inlineStyles.s41}>
                        {course.category}
                      </div>
                      <div style={inlineStyles.s42}>
                        {course.title}
                      </div>
                      <div style={inlineStyles.s43}>
                        {course.modulesCount} modules · {course.lessonsCount} lessons
                      </div>
                    </div>

                    <div>
                      <div style={inlineStyles.s44}>
                        <div style={featureStyleFunctions.s16({course})} />
                      </div>
                      <div style={inlineStyles.s45}>
                        <span style={inlineStyles.s46}>{course.progressPercent}% complete</span>
                        <button 
                          onClick={() => {
                            if (typeof window !== 'undefined') {
                              localStorage.setItem('selected_course_id', course.id);
                            }
                            router.push('/courses');
                          }}
                          style={inlineStyles.s47}
                        >
                          Continue <ChevronRight size={12} />
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

        </div>

        {/* Right Side (Daily Checklist, Interactive Quiz, Concept Card) */}
        <div style={inlineStyles.s48}>
          
          {/* Interactive Checklist */}
          <div style={inlineStyles.s49}>
            <h3 style={inlineStyles.s50}>
              <CheckSquare size={16} color="var(--accent)" /> Today's Task Checklist
            </h3>
            
            <div style={inlineStyles.s51}>
              {tasks.map(task => (
                <div
                  key={task.id}
                  onClick={() => toggleTask(task.id)}
                  style={featureStyleFunctions.s17({task})}
                  onMouseEnter={e => {
                    if (!task.completed) e.currentTarget.style.borderColor = 'var(--accent)';
                  }}
                  onMouseLeave={e => {
                    if (!task.completed) e.currentTarget.style.borderColor = 'var(--border)';
                  }}
                >
                  <div style={featureStyleFunctions.s18({task})}>
                    {task.completed && '✓'}
                  </div>
                  <span style={featureStyleFunctions.s19({task})}>
                    {task.label}
                  </span>
                </div>
              ))}
            </div>
          </div>

          {/* Interactive Skill Check Quiz */}
          <div style={inlineStyles.s52}>
            <h3 style={inlineStyles.s53}>
              <HelpCircle size={16} color="var(--purple)" /> Daily Skill Check
            </h3>
            <span style={inlineStyles.s54}>Answer to check your Python foundation</span>
            
            <div style={inlineStyles.s55}>
              How does Python handle memory management for variables?
            </div>

            <div style={inlineStyles.s56}>
              {quizAnswers.map((answer, index) => {
                const isSelected = selectedQuizOption === index;
                const isCorrectOption = index === correctAnswerIdx;
                let optBg = 'var(--s2)';
                let optBorder = 'var(--border)';
                let optColor = 'var(--text)';

                if (quizSubmitted) {
                  if (isCorrectOption) {
                    optBg = 'rgba(34, 197, 160, 0.12)';
                    optBorder = 'var(--green)';
                    optColor = 'var(--green)';
                  } else if (isSelected) {
                    optBg = 'rgba(245, 91, 107, 0.12)';
                    optBorder = 'var(--red)';
                    optColor = 'var(--red)';
                  }
                } else {
                  if (isSelected) {
                    optBg = 'rgba(91, 140, 248, 0.1)';
                    optBorder = 'var(--accent)';
                  }
                }

                return (
                  <button
                    key={index}
                    onClick={() => handleSelectQuizOption(index)}
                    disabled={quizSubmitted}
                    style={featureStyleFunctions.s20({optBg,optBorder,optColor,quizSubmitted})}
                    onMouseEnter={e => {
                      if (!quizSubmitted) {
                        e.currentTarget.style.borderColor = 'var(--purple)';
                        e.currentTarget.style.background = 'var(--s3)';
                      }
                    }}
                    onMouseLeave={e => {
                      if (!quizSubmitted) {
                        e.currentTarget.style.borderColor = optBorder;
                        e.currentTarget.style.background = optBg;
                      }
                    }}
                  >
                    <span style={inlineStyles.s57}>{'ABCD'[index]})</span>
                    {answer}
                  </button>
                );
              })}
            </div>

            {quizSubmitted && (
              <div style={featureStyleFunctions.s21({selectedQuizOption,correctAnswerIdx})}>
                {selectedQuizOption === correctAnswerIdx ? (
                  <strong>✓ Correct!</strong>
                ) : (
                  <strong>✗ Incorrect.</strong>
                )}{' '}
                Python is dynamically typed; it uses Automatic Reference Counting (ARC) along with a cyclical garbage collector to manage allocations automatically when variables are assigned using `=`.
              </div>
            )}
          </div>

          {/* Concept of the Day Flashcard */}
          <div style={inlineStyles.s58}>
            <h3 style={inlineStyles.s59}>
              <Award size={16} color="var(--amber)" /> Concept of the Day
            </h3>

            <div
              onClick={handleFlipConcept}
              style={inlineStyles.s60}
            >
              <div style={featureStyleFunctions.s22({conceptFlipped})}
              onMouseEnter={e => {
                e.currentTarget.style.borderColor = 'var(--amber)';
              }}
              onMouseLeave={e => {
                if (!conceptFlipped) e.currentTarget.style.borderColor = 'var(--border)';
              }}
              >
                <span style={inlineStyles.s61}>
                  {conceptFlipped ? 'Definition' : 'Concept \u2014 click to reveal'}
                </span>
                
                <h4 style={featureStyleFunctions.s23({conceptFlipped})}>
                  {conceptFlipped ? (
                    "A decorator is a function that wraps another function to dynamically extend or modify its behavior without modifying the actual function's source code explicitly. Annotated using the @decorator syntax."
                  ) : (
                    "💡 Decorator Functions (@)"
                  )}
                </h4>
                
                <span style={inlineStyles.s62}>
                  {conceptFlipped ? 'Click to flip back' : 'Click to flip'}
                </span>
              </div>
            </div>
          </div>

        </div>

      </div>

    </div>
  );
}
