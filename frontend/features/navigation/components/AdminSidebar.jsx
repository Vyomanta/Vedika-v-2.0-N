'use client';
import * as featureStyleFunctions from '@/features/navigation/styles/AdminSidebar.cd05b78e.styles.js';

import inlineStyles from '@/features/navigation/styles/AdminSidebar.styles';


import { useState, useEffect } from 'react';
import { usePathname, useRouter } from 'next/navigation';
import {
  Home, Search, Bell, BookOpen, Layers, Users, Award,
  Briefcase, BarChart3, CheckSquare, FileText, Code2,
  Plus, HelpCircle, LogOut, Sun, Moon,
  ChevronLeft, ChevronRight
} from 'lucide-react';
import { T, getTheme, setTheme } from '@/shared/design-system/theme';
import { useMediaQuery, isMobileMQ } from '@/lib/useMediaQuery';

// Admin-specific navigation items
const NAV_ITEMS = [
  { id: '/admin',             Icon: Home,         label: 'Home' },
  { id: '/admin/search',      Icon: Search,       label: 'Search' },
  { id: '/admin/alerts',      Icon: Bell,         label: 'Notifications' },
  { id: '/admin/courses',     Icon: BookOpen,     label: 'Courses' },
  { id: '/admin/batches',     Icon: Users,        label: 'Batches' },
  { id: '/admin/certs',       Icon: Award,        label: 'Certifications' },
  { id: '/admin/jobs',        Icon: Briefcase,    label: 'Jobs' },
  { id: '/admin/statistics',  Icon: BarChart3,    label: 'Statistics' },
  { id: '/admin/quizzes',     Icon: CheckSquare,  label: 'Quizzes' },
  { id: '/admin/assignments', Icon: FileText,    label: 'Assignments' },
  { id: '/admin/code-ex',     Icon: Code2,        label: 'Programming Exercises' },
];

export default function AdminSidebar({ isCollapsed = false, onToggleCollapse }) {
  const pathname = usePathname();
  const router = useRouter();
  const isMobile = useMediaQuery(isMobileMQ);

  useEffect(() => {
    if (isMobile) {
      const el = document.createElement('style');
      el.id = 'admin-sidebar-mobile-pad';
      el.textContent = '.sidebar-content-area { padding-top: 48px !important; }';
      document.head.appendChild(el);
      return () => { document.getElementById('admin-sidebar-mobile-pad')?.remove(); };
    }
  }, [isMobile]);

  const handleLogout = () => {
    localStorage.removeItem('frappe_user');
    router.replace('/login');
  };

  const isActive = (navId) => {
    if (navId === '/admin') return pathname === '/admin';
    return pathname.startsWith(navId);
  };

  const navigateTo = (navId, disabled) => {
    if (disabled) return;
    router.push(navId);
  };

  // ── Mobile layout top menu ──
  if (isMobile) {
    return (
      <div style={featureStyleFunctions.s0({T})}>
        <div style={inlineStyles.s0} onClick={() => router.push('/admin')}>
          <div style={featureStyleFunctions.s1({T})}>
            <Layers size={14} color={T.purple} />
          </div>
          <span style={featureStyleFunctions.s2({T})}>Learning Admin</span>
        </div>

        <div style={inlineStyles.s1}>
          <button onClick={() => setTheme(getTheme() === 'dark' ? 'light' : 'dark')} style={featureStyleFunctions.s3({T})}>
            {getTheme() === 'dark' ? <Sun size={16} /> : <Moon size={16} />}
          </button>
          <button onClick={handleLogout} style={featureStyleFunctions.s4({T})}>
            <LogOut size={16} />
          </button>
        </div>
      </div>
    );
  }

  // ── Desktop Sidebar ──
  return (
    <div style={featureStyleFunctions.s5({isCollapsed,T})}>
      {/* Floating Toggle Button */}
      <button
        onClick={onToggleCollapse}
        style={featureStyleFunctions.s6({T})}
        onMouseEnter={e => e.currentTarget.style.color = T.purple}
        onMouseLeave={e => e.currentTarget.style.color = T.muted}
        title={isCollapsed ? "Expand Sidebar" : "Collapse Sidebar"}
      >
        {isCollapsed ? <ChevronRight size={14} /> : <ChevronLeft size={14} />}
      </button>

      {/* Brand Header */}
      <div style={featureStyleFunctions.s7({isCollapsed,T})}>
        <div style={featureStyleFunctions.s8({isCollapsed})}>
          <div style={featureStyleFunctions.s9({isCollapsed})}>
            <div style={featureStyleFunctions.s10({T})}>
              <Layers size={18} color={T.purple} />
            </div>
            {!isCollapsed && (
              <div>
                <div style={featureStyleFunctions.s11({T})}>Learning</div>
                <div style={featureStyleFunctions.s12({T})}>Admin Portal</div>
              </div>
            )}
          </div>
          {!isCollapsed && (
            <button
              onClick={() => setTheme(getTheme() === 'dark' ? 'light' : 'dark')}
              style={featureStyleFunctions.s13({T})}
              onMouseEnter={(e) => { e.currentTarget.style.color = T.purple; e.currentTarget.style.background = `${T.purple}22`; }}
              onMouseLeave={(e) => { e.currentTarget.style.color = T.muted; e.currentTarget.style.background = `${T.purple}12`; }}
              title={`Switch to ${getTheme() === 'dark' ? 'Light' : 'Dark'} Mode`}
            >
              {getTheme() === 'dark' ? <Sun size={15} /> : <Moon size={15} />}
            </button>
          )}
        </div>
        {isCollapsed && (
          <button
            onClick={() => setTheme(getTheme() === 'dark' ? 'light' : 'dark')}
            style={featureStyleFunctions.s14({T})}
            onMouseEnter={(e) => { e.currentTarget.style.color = T.purple; e.currentTarget.style.background = `${T.purple}22`; }}
            onMouseLeave={(e) => { e.currentTarget.style.color = T.muted; e.currentTarget.style.background = `${T.purple}12`; }}
            title={`Switch to ${getTheme() === 'dark' ? 'Light' : 'Dark'} Mode`}
          >
            {getTheme() === 'dark' ? <Sun size={15} /> : <Moon size={15} />}
          </button>
        )}
      </div>

      {/* Nav Menu */}
      <div style={featureStyleFunctions.s15({isCollapsed})}>
        {NAV_ITEMS.map(({ id, Icon, label, disabled }) => {
          const active = isActive(id);
          return (
            <button
              key={id}
              onClick={() => navigateTo(id, disabled)}
              style={featureStyleFunctions.s16({isCollapsed,active,T,disabled})}
              title={disabled ? "Feature coming soon" : isCollapsed ? label : ""}
            >
              <Icon size={15} color={active ? T.purple : disabled ? T.dim : T.muted} />
              {!isCollapsed && <span>{label}</span>}
              {!isCollapsed && disabled && (
                <span style={featureStyleFunctions.s17({T})}>
                  Soon
                </span>
              )}
            </button>
          );
        })}
      </div>

      {/* Sidebar spacer */}
      <div style={inlineStyles.s2} />

      {/* Administrator Profile Card (Direct Log Out) */}
      <div style={featureStyleFunctions.s18({T,isCollapsed})}>
        <div style={featureStyleFunctions.s19({isCollapsed})}>
          <div style={featureStyleFunctions.s20({isCollapsed})}>
            <div style={featureStyleFunctions.s21({T})}>
              AD
            </div>
            {!isCollapsed && (
              <div>
                <div style={featureStyleFunctions.s22({T})}>Hey, Admin 👋</div>
                <div style={featureStyleFunctions.s23({T})}>Owner / Admin</div>
              </div>
            )}
          </div>
          
          <button 
            onClick={handleLogout}
            style={featureStyleFunctions.s24({T})}
            onMouseEnter={(e) => { e.currentTarget.style.color = T.red; e.currentTarget.style.background = 'rgba(245, 91, 107, 0.08)'; }}
            onMouseLeave={(e) => { e.currentTarget.style.color = T.muted; e.currentTarget.style.background = 'transparent'; }}
            title="Log Out"
          >
            <LogOut size={15} />
          </button>
        </div>
      </div>

      {/* Help Footer */}
      {!isCollapsed ? (
        <div style={featureStyleFunctions.s25({T})}>
          <button
            onClick={() => alert('Support portal is under construction.')}
            style={featureStyleFunctions.s26({T})}
          >
            <HelpCircle size={14} /> Help
          </button>
          <span style={featureStyleFunctions.s27({T})}>v1.0.0</span>
        </div>
      ) : (
        <div style={featureStyleFunctions.s28({T})}>
          <button
            onClick={() => alert('Support portal is under construction.')}
            style={featureStyleFunctions.s29({T})}
            title="Help & Support (v1.0.0)"
          >
            <HelpCircle size={15} />
          </button>
        </div>
      )}
    </div>
  );
}
