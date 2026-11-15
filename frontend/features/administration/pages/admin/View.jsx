'use client';
import * as featureStyleFunctions from '@/features/administration/styles/View.f726f61c.styles.js';

import inlineStyles from '@/features/administration/styles/admin-page.jsx.styles.js';


import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { BookOpen, Users, BarChart3, Plus, ArrowRight, Layers, ShieldCheck, FileText, CheckSquare } from 'lucide-react';
import { T } from '@/shared/design-system/theme';
import { useMediaQuery, isMobileMQ } from '@/lib/useMediaQuery';
import { getCourses } from '@/features/courses/api/client';
import { getBatches, getNotifications, getCertificates } from '@/features/administration/api/collections';

export default function AdminHomePage() {
  const router = useRouter();
  const isMobile = useMediaQuery(isMobileMQ);
  
  // Dashboard state
  const [courseCount, setCourseCount] = useState(0);
  const [batchCount, setBatchCount] = useState(0);
  const [unreadAlertCount, setUnreadAlertCount] = useState(0);
  const [certCount, setCertCount] = useState(0);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    Promise.all([
      getCourses().catch(() => []),
      getBatches().catch(() => []),
      getNotifications().catch(() => []),
      getCertificates().catch(() => [])
    ]).then(([courses, batches, alerts, certs]) => {
      setCourseCount(courses.length);
      setBatchCount(batches.length);
      setUnreadAlertCount(alerts.filter(a => !a.read).length);
      setCertCount(certs.length);
      setLoading(false);
    });
  }, []);

  const containerPadding = isMobile ? '70px 16px 32px 16px' : '40px';

  const shortcuts = [
    { title: 'Courses Curriculum', desc: 'Create, modify structure, and upload CSV syllabus.', count: courseCount, route: '/admin/courses', color: T.accent, Icon: BookOpen },
    { title: 'Cohort Batches', desc: 'Manage batches, student groups, and lesson access.', count: batchCount, route: '/admin/batches', color: T.purple, Icon: Users },
    { title: 'Certifications', desc: 'Review issued awards and completion criteria.', count: certCount, route: '/admin/certs', color: T.green, Icon: ShieldCheck },
    { title: 'Analytics & Stats', desc: 'Check student registrations and completion rates.', count: null, route: '/admin/statistics', color: T.amber, Icon: BarChart3 }
  ];

  return (
    <div style={featureStyleFunctions.s0({containerPadding})}>
      {/* Header section */}
      <div style={inlineStyles.s0}>
        <div>
          <h1 style={featureStyleFunctions.s1({T,isMobile})}>
            Hey, Administrator 👋
          </h1>
          <p style={featureStyleFunctions.s2({T,isMobile})}>
            Manage your courses, cohort batches, and certifications in one place.
          </p>
        </div>

        <button
          onClick={() => router.push('/admin/courses')}
          style={featureStyleFunctions.s3({T})}
        >
          <Plus size={16} /> New Course
        </button>
      </div>

      {/* Stats Summary Alert Banner */}
      {unreadAlertCount > 0 && (
        <div 
          onClick={() => router.push('/admin/alerts')}
          style={featureStyleFunctions.s4({})}
          onMouseEnter={(e) => e.currentTarget.style.borderColor = T.purple}
          onMouseLeave={(e) => e.currentTarget.style.borderColor = 'rgba(155, 110, 248, 0.15)'}
        >
          <div style={featureStyleFunctions.s5({T})}>
            <span style={featureStyleFunctions.s6({T})} />
            <span>You have <strong>{unreadAlertCount}</strong> unread notifications and submissions waiting for review.</span>
          </div>
          <div style={featureStyleFunctions.s7({T})}>
            Review Alerts <ArrowRight size={14} />
          </div>
        </div>
      )}

      {/* Main Shortcut Grid */}
      <div style={featureStyleFunctions.s8({isMobile})}>
        {shortcuts.map((sc) => {
          const Icon = sc.Icon;
          return (
            <div
              key={sc.title}
              onClick={() => router.push(sc.route)}
              style={featureStyleFunctions.s9({T})}
              onMouseEnter={(e) => {
                e.currentTarget.style.borderColor = sc.color;
                e.currentTarget.style.transform = 'translateY(-2px)';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.borderColor = T.border;
                e.currentTarget.style.transform = 'none';
              }}
            >
              <div style={inlineStyles.s1}>
                <div style={featureStyleFunctions.s10({sc})}>
                  <Icon size={20} color={sc.color} />
                </div>
                <div>
                  <h3 style={featureStyleFunctions.s11({T})}>
                    {sc.title}
                  </h3>
                  <p style={featureStyleFunctions.s12({T})}>
                    {sc.desc}
                  </p>
                </div>
              </div>

              {sc.count !== null && (
                <div style={featureStyleFunctions.s13({sc})}>
                  {loading ? '...' : sc.count}
                </div>
              )}
            </div>
          );
        })}
      </div>

      {/* Quick Info Board */}
      <div style={featureStyleFunctions.s14({T})}>
        💡 Use the sidebar navigation on the left to jump between different panels like Quizzes, Assignments, and Jobs.
      </div>
    </div>
  );
}
