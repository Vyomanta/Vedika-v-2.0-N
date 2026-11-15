'use client';
import dynamic from 'next/dynamic';
import * as featureStyleFunctions from '@/features/navigation/styles/LayoutWrapper.7a3de7a8.styles.js';

import inlineStyles from '@/features/navigation/styles/LayoutWrapper.styles';


import { useState, useEffect } from 'react';
import { usePathname, useRouter } from 'next/navigation';
const Sidebar = dynamic(() => import('@/components/Sidebar'), { ssr: false });
const AdminSidebar = dynamic(() => import('@/components/AdminSidebar'), { ssr: false });
const Header = dynamic(() => import('@/components/Header'), { ssr: false });
import { T } from '@/shared/design-system/theme';
import { getMascotBridge } from '@/lib/mascotBridge';

export default function LayoutWrapper({ children }) {
  const pathname = usePathname();
  const router = useRouter();
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);

  useEffect(() => {
    if (typeof window !== 'undefined') {
      const stored = localStorage.getItem('sidebar_collapsed') === 'true';
      setSidebarCollapsed(stored);
    }
  }, []);

  const handleToggleCollapse = () => {
    const newState = !sidebarCollapsed;
    setSidebarCollapsed(newState);
    if (typeof window !== 'undefined') {
      localStorage.setItem('sidebar_collapsed', String(newState));
    }
  };

  useEffect(() => {
    // Read the user object synchronously from localStorage
    const storedUser = localStorage.getItem('frappe_user');
    let currentUser = null;
    if (storedUser) {
      try {
        currentUser = JSON.parse(storedUser);
      } catch (e) {
        localStorage.removeItem('frappe_user');
      }
    }

    const isAuthPage = pathname === '/login' || pathname === '/users' || pathname === '/admin/login' || pathname.startsWith('/auth');
    const isPublicPage = pathname === '/' || isAuthPage;

    const isAdmin = currentUser && (
      ['administrator','super_admin','superadmin'].includes((currentUser.role || '').toLowerCase()) ||
      (currentUser.role || '').toLowerCase() === 'admin' ||
      (currentUser.role || '').toLowerCase() === 'system manager' ||
      (currentUser.email || '').toLowerCase() === 'admin@lms.com' ||
      (currentUser.username || '').toLowerCase() === 'administrator' ||
      (currentUser.username || '').toLowerCase() === 'admin'
    );

    if (currentUser && isAdmin && !['Administrator','super_admin','superadmin'].includes(currentUser.role)) {
      currentUser.role = 'Administrator';
      try {
        localStorage.setItem('frappe_user', JSON.stringify(currentUser));
      } catch (e) {}
    }

    if (!currentUser) {
      if (typeof window !== 'undefined' && process.env.NODE_ENV === 'development') {
        currentUser = { email: 'student@vedika.io', name: 'Student', role: 'Student' };
      } else if (!isPublicPage) {
        // Redirect to unified login page if not logged in
        setUser(null);
        setLoading(true);
        router.replace('/login');
        return;
      }
    } else {
      // User is logged in
      if (pathname === '/users' || pathname === '/admin/login' || pathname === '/login') {
        // Redirect logged-in users away from auth pages
        setLoading(true);
        if (isAdmin) {
          router.replace('/admin');
        } else {
          router.replace('/prev-home-page');
        }
        return;
      } else {
        // Logged-in page validation
        if (isAdmin) {
          if (!pathname.startsWith('/admin') && pathname !== '/') {
            setLoading(true);
            router.replace('/admin');
            return;
          }
        } else {
          if (pathname.startsWith('/admin')) {
            setLoading(true);
            router.replace('/');
            return;
          }
        }
      }
    }

    // If no redirect is needed, set the local state and stop loading
    setUser(currentUser);
    setLoading(false);
  }, [pathname, router]);

  const isHomePage = pathname === '/';
  const isLabPage = pathname?.startsWith('/vedika-labs/') || pathname?.startsWith('/labs/');
  const isFixedPage = !isLabPage && (
    pathname?.startsWith('/lesson/') ||
    pathname?.startsWith('/general-tutor') ||
    pathname?.startsWith('/coding-tutor') ||
    pathname?.startsWith('/code-puzzle') ||
    pathname?.startsWith('/vedika-ai/puzzle') ||
    pathname?.startsWith('/viva-interview') ||
    pathname?.startsWith('/quizzes') ||
    pathname?.startsWith('/assignments') ||
    pathname === '/vedika-labs'
  );

  useEffect(() => {
    // Configure layout background dynamically matching theme
    const theme = localStorage.getItem('theme') || 'dark';
    document.documentElement.setAttribute('data-theme', theme);
    document.body.style.backgroundColor = isHomePage ? '#02050c' : (theme === 'dark' ? '#090B14' : '#F4F7FB');
  }, [isHomePage]);

  useEffect(() => {
    if (typeof window === 'undefined') return;
    const bridge = getMascotBridge();

    // Listen for mascot-commanded navigation (e.g. "open math lab", "open titration")
    const unsubscribeNav = bridge.onNavigate((targetRoute) => {
      if (!targetRoute) return;
      const currentFull = typeof window !== 'undefined' ? (window.location.pathname + window.location.search) : pathname;
      if (targetRoute !== currentFull) {
        console.log('[LayoutWrapper] Desktop Mascot navigating to:', targetRoute);
        try {
          router.push(targetRoute);
        } catch (err) {
          console.warn('[LayoutWrapper] router.push threw error, fallback to window.location.href:', err);
          if (typeof window !== 'undefined') {
            window.location.href = targetRoute;
          }
        }
      }

      if (targetRoute.includes('/courses')) {
        if (targetRoute.includes('category=')) {
          const match = targetRoute.match(/category=([^&]+)/);
          if (match && match[1]) {
            const cat = decodeURIComponent(match[1].replace(/\+/g, ' '));
            window.dispatchEvent(new CustomEvent('change_course_category', { detail: { category: cat } }));
          }
        } else if (targetRoute.includes('course=') || targetRoute.includes('courseId=')) {
          const match = targetRoute.match(/(?:course|courseId)=([^&]+)/);
          if (match && match[1]) {
            const cId = decodeURIComponent(match[1]);
            window.dispatchEvent(new CustomEvent('select_course_by_id', { detail: { courseId: cId } }));
          }
        } else {
          window.dispatchEvent(new CustomEvent('reset_courses_view'));
        }
      } else if (targetRoute.includes('/viva-interview') && targetRoute.includes('mode=')) {
        const match = targetRoute.match(/mode=([^&]+)/);
        if (match && match[1]) {
          window.dispatchEvent(new CustomEvent('viva_mode_change', { detail: { mode: decodeURIComponent(match[1]) } }));
        }
      } else if (targetRoute.includes('/code-puzzle') && targetRoute.includes('lang=')) {
        const match = targetRoute.match(/lang=([^&]+)/);
        if (match && match[1]) {
          window.dispatchEvent(new CustomEvent('code_puzzle_lang_change', { detail: { lang: decodeURIComponent(match[1]) } }));
        }
      }
    });

    // Listen for mascot-commanded back navigation ("go back", "previous page")
    const unsubscribeNavBack = bridge.onNavigateBack(() => {
      console.log('[LayoutWrapper] Desktop Mascot requested NAVIGATE_BACK. Current path:', pathname);
      if (pathname?.startsWith('/lesson/')) {
        let storedCourseId = '';
        if (typeof window !== 'undefined') {
          storedCourseId = localStorage.getItem('selected_course_id') || '';
        }
        if (storedCourseId) {
          router.push(`/courses?course=${encodeURIComponent(storedCourseId)}`);
        } else {
          router.push('/courses');
        }
      } else if (pathname === '/courses') {
        window.dispatchEvent(new CustomEvent('courses_navigate_back_step'));
      } else if (pathname?.startsWith('/vedika-labs/') || pathname?.startsWith('/labs/')) {
        router.push('/vedika-labs');
      } else if (pathname === '/resources') {
        const params = new URLSearchParams(window.location.search);
        const view = params.get('view');
        if (view && view.startsWith('dsa/')) {
          router.push('/resources?view=dsa');
        } else if (view && view !== 'home') {
          router.push('/resources');
        } else {
          router.push('/');
        }
      } else if (
        pathname === '/general-tutor' ||
        pathname === '/coding-tutor' ||
        pathname?.startsWith('/vedika-ai/') ||
        pathname?.startsWith('/code-puzzle') ||
        pathname?.startsWith('/viva-interview')
      ) {
        router.push('/vedika-ai');
      } else if (
        pathname === '/vedika-labs' ||
        pathname === '/vedika-ai' ||
        pathname === '/quizzes' ||
        pathname === '/assignments' ||
        pathname === '/jobs' ||
        pathname === '/progress'
      ) {
        router.push('/');
      } else {
        try {
          router.back();
        } catch (_) {
          router.push('/');
        }
      }
    });

    // Notify mascot of page changes
    let activity = 'browsing';
    if (pathname === '/') activity = 'homepage';
    else if (pathname?.startsWith('/vedika-labs/math') || pathname?.startsWith('/labs/math')) activity = 'math_tutor';
    else if (pathname?.startsWith('/vedika-labs/chemistry') || pathname?.startsWith('/labs/chemistry')) activity = 'chemistry_lab';
    else if (pathname?.startsWith('/vedika-labs/physics') || pathname?.startsWith('/labs/physics')) activity = 'physics_lab';
    else if (pathname?.startsWith('/vedika-labs/biology') || pathname?.startsWith('/labs/biology')) activity = 'biology_lab';
    else if (pathname?.startsWith('/code-puzzle') || pathname?.startsWith('/vedika-ai/puzzle')) activity = 'dsa_puzzle';
    else if (pathname?.startsWith('/coding-tutor') || pathname?.startsWith('/code-tutor')) activity = 'coding_tutor';
    else if (pathname?.startsWith('/lesson/')) activity = 'video_lesson';
    else if (pathname?.startsWith('/courses')) activity = 'courses';

    bridge.sendActivityUpdate(activity, { page: pathname });

    return () => {
      unsubscribeNav();
      unsubscribeNavBack();
    };
  }, [pathname, router]);

  if (loading) {
    return (
      <div style={inlineStyles.s0}>
        <div style={inlineStyles.s1}>
          <div style={inlineStyles.s2} />
          <div style={inlineStyles.s3}>Loading AI TUTOR Portal...</div>
        </div>
      </div>
    );
  }

  const isAuthPage = pathname === '/login' || pathname === '/users' || pathname === '/admin/login' || pathname.startsWith('/auth');

  // Auth pages (like /login) render directly without a navbar
  if (isAuthPage) {
    return <div style={inlineStyles.s4}>{children}</div>;
  }

  const isAdminRoute = pathname.startsWith('/admin');

  if (isAdminRoute) {
    return (
      <div style={inlineStyles.s5}>
        <AdminSidebar isCollapsed={sidebarCollapsed} onToggleCollapse={handleToggleCollapse} />
        <div className="sidebar-content-area" style={inlineStyles.s6}>
          {children}
        </div>
      </div>
    );
  }

  const isAskVedika = pathname === '/general-tutor' || pathname?.startsWith('/vedika-ai/ask') || pathname === '/coding-tutor' || pathname?.startsWith('/vedika-ai/code');
  const isViewportLocked = isFixedPage || isHomePage;

  return (
    <div
      className={`app-layout-root ${isViewportLocked ? 'viewport-locked' : ''} ${isHomePage ? 'home-layout' : ''}`}
      style={featureStyleFunctions.s0({isViewportLocked,isLabPage,isHomePage})}
    >
      {/* Present Navbar displayed consistently on every page */}
      <Header />
      <main
        className={`app-main-content ${isViewportLocked ? 'viewport-locked' : ''} ${isHomePage ? 'home-main' : ''}`}
        style={featureStyleFunctions.s1({isLabPage,isViewportLocked,isAskVedika,isHomePage})}
      >
        {children}
      </main>
    </div>
  );
}

