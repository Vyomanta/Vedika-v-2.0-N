'use client';

import inlineStyles from '@/features/auth/styles/login-page.jsx.styles.js';
import { useState, useEffect, useRef, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import { Eye, EyeOff, GraduationCap, ArrowLeft, CheckCircle2, Sparkles, AlertCircle } from 'lucide-react';
import { login } from '@/features/auth/api/lms';
import '@/app/login/login.css';
import {getSvgPathLength} from '@/features/auth/components/features-auth-pages-login-View.support.jsx';

export function useLoginPageModel() {

  const router = useRouter();
  const [mode, setMode] = useState('login'); // 'login' | 'signup' | 'forgot'
  
  // Login & Shared State
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  
  // Sign Up State
  const [fullName, setFullName] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  // Status & Feedback
  const [error, setError] = useState('');
  const [successMsg, setSuccessMsg] = useState('');
  const [loading, setLoading] = useState(false);

  // Active focused input for glowing gradient animation
  const [focusedField, setFocusedField] = useState('login-email');

  // DOM Container & Wrapper Refs
  const loginPaneRef = useRef(null);
  const loginEmailRef = useRef(null);
  const loginPwdRef = useRef(null);
  const loginSubmitRef = useRef(null);
  const loginGoogleRef = useRef(null);

  const signupPaneRef = useRef(null);
  const signupNameRef = useRef(null);
  const signupEmailRef = useRef(null);
  const signupPwdRef = useRef(null);
  const signupConfirmRef = useRef(null);
  const signupSubmitRef = useRef(null);
  const signupGoogleRef = useRef(null);

  // Direct Input Focus Refs
  const loginEmailInputRef = useRef(null);
  const loginPwdInputRef = useRef(null);
  const signupNameInputRef = useRef(null);
  const signupEmailInputRef = useRef(null);
  const signupPwdInputRef = useRef(null);
  const signupConfirmInputRef = useRef(null);

  // Snake Path States
  const [loginSnake, setLoginSnake] = useState({ d: '', styles: {}, total: 1000 });
  const [signupSnake, setSignupSnake] = useState({ d: '', styles: {}, total: 1000 });

  // Clear any existing session on mount and parse query errors
  useEffect(() => {
    localStorage.removeItem('frappe_user');
    localStorage.removeItem('frappe_sid');
    if (typeof window !== 'undefined') {
      const params = new URLSearchParams(window.location.search);
      const err = params.get('error');
      if (err === 'oauth_failed') {
        const msg = params.get('msg');
        setError(msg ? `Google sign-in error: ${msg}` : 'Google sign-in was unsuccessful. Please verify that the redirect URI is configured in Google Cloud Console.');
      } else if (err === 'invalid_token') {
        setError('Invalid login token. Please sign in again.');
      } else if (err === 'server_error') {
        setError('Internal server error during authentication.');
      }
    }
  }, []);

  // Compute exact Snake path coordinates and native measurements for Login
  const recalculateLoginSnake = useCallback(() => {
    if (!loginPaneRef.current || !loginEmailRef.current || !loginPwdRef.current || !loginSubmitRef.current || !loginGoogleRef.current) return;
    const c = loginPaneRef.current.getBoundingClientRect();
    const e = loginEmailRef.current.getBoundingClientRect();
    const p = loginPwdRef.current.getBoundingClientRect();
    const s = loginSubmitRef.current.getBoundingClientRect();
    const g = loginGoogleRef.current.getBoundingClientRect();

    if (c.width === 0) return;

    const eL = e.left - c.left;
    const eR = e.right - c.left;
    const eY = e.bottom - c.top;

    const pL = p.left - c.left;
    const pR = p.right - c.left;
    const pY = p.bottom - c.top;

    const sL = s.left - c.left;
    const sR = s.right - c.left;
    const sY = s.bottom - c.top;

    const gL = g.left - c.left;
    const gR = g.right - c.left;
    const gY = g.bottom - c.top;

    // Build subpaths for exact browser-native measurement
    const d0_email = `M ${eL} ${eY} L ${eR} ${eY}`;
    const len0_email = getSvgPathLength(d0_email);

    // Loop 01 down right margin to password start
    const d_to_p_start = `${d0_email} C ${eR + 24} ${eY}, ${pR + 24} ${pY}, ${pR} ${pY}`;
    const len_to_p_start = getSvgPathLength(d_to_p_start);

    // Straight password line (RTL)
    const d_to_p_end = `${d_to_p_start} L ${pL} ${pY}`;
    const len_to_p_end = getSvgPathLength(d_to_p_end);
    const len_p = Math.max(0, len_to_p_end - len_to_p_start);

    // Loop 12 down left margin to sign in button
    const d_to_s_start = `${d_to_p_end} C ${pL - 24} ${pY}, ${sL - 24} ${sY}, ${sL} ${sY}`;
    const len_to_s_start = getSvgPathLength(d_to_s_start);

    // Straight button line (LTR)
    const d_to_s_end = `${d_to_s_start} L ${sR} ${sY}`;
    const len_to_s_end = getSvgPathLength(d_to_s_end);
    const len_s = Math.max(0, len_to_s_end - len_to_s_start);

    // Bridge to Google button
    const d_to_g_start = `${d_to_s_end} L ${gL} ${gY}`;
    const len_to_g_start = getSvgPathLength(d_to_g_start);

    // Google button line (LTR)
    const d_full = `${d_to_g_start} L ${gR} ${gY}`;
    const total = getSvgPathLength(d_full);
    const len_g = Math.max(0, total - len_to_g_start);

    const stylesMap = {
      'login-email': {
        strokeDasharray: `${len0_email} ${total + 400}`,
        strokeDashoffset: '0'
      },
      'login-password': {
        strokeDasharray: `${len_p} ${total + 400}`,
        strokeDashoffset: `-${len_to_p_start}`
      },
      'login-submit': {
        strokeDasharray: `${len_s} ${total + 400}`,
        strokeDashoffset: `-${len_to_s_start}`
      },
      'login-google': {
        strokeDasharray: `${len_g} ${total + 400}`,
        strokeDashoffset: `-${len_to_g_start}`
      }
    };

    setLoginSnake({ d: d_full, styles: stylesMap, total });
  }, []);

  // Compute exact Snake path coordinates and native measurements for Sign Up
  const recalculateSignupSnake = useCallback(() => {
    if (!signupPaneRef.current || !signupNameRef.current || !signupEmailRef.current || !signupPwdRef.current || !signupConfirmRef.current || !signupSubmitRef.current || !signupGoogleRef.current) return;
    const c = signupPaneRef.current.getBoundingClientRect();
    const n = signupNameRef.current.getBoundingClientRect();
    const e = signupEmailRef.current.getBoundingClientRect();
    const p = signupPwdRef.current.getBoundingClientRect();
    const cf = signupConfirmRef.current.getBoundingClientRect();
    const s = signupSubmitRef.current.getBoundingClientRect();
    const g = signupGoogleRef.current.getBoundingClientRect();

    if (c.width === 0) return;

    const nL = n.left - c.left;
    const nR = n.right - c.left;
    const nY = n.bottom - c.top;

    const eL = e.left - c.left;
    const eR = e.right - c.left;
    const eY = e.bottom - c.top;

    const pL = p.left - c.left;
    const pR = p.right - c.left;
    const pY = p.bottom - c.top;

    const cfL = cf.left - c.left;
    const cfR = cf.right - c.left;
    const cfY = cf.bottom - c.top;

    const sL = s.left - c.left;
    const sR = s.right - c.left;
    const sY = s.bottom - c.top;

    const gL = g.left - c.left;
    const gR = g.right - c.left;
    const gY = g.bottom - c.top;

    // Field 0: Full Name (LTR)
    const d0_name = `M ${nL} ${nY} L ${nR} ${nY}`;
    const len0_name = getSvgPathLength(d0_name);

    // Loop 01 to Email (RTL)
    const d_to_e_start = `${d0_name} C ${nR + 24} ${nY}, ${eR + 24} ${eY}, ${eR} ${eY}`;
    const len_to_e_start = getSvgPathLength(d_to_e_start);

    const d_to_e_end = `${d_to_e_start} L ${eL} ${eY}`;
    const len_to_e_end = getSvgPathLength(d_to_e_end);
    const len_e = Math.max(0, len_to_e_end - len_to_e_start);

    // Loop 12 to Password (LTR)
    const d_to_p_start = `${d_to_e_end} C ${eL - 24} ${eY}, ${pL - 24} ${pY}, ${pL} ${pY}`;
    const len_to_p_start = getSvgPathLength(d_to_p_start);

    const d_to_p_end = `${d_to_p_start} L ${pR} ${pY}`;
    const len_to_p_end = getSvgPathLength(d_to_p_end);
    const len_p = Math.max(0, len_to_p_end - len_to_p_start);

    // Loop 23 to Confirm (RTL)
    const d_to_cf_start = `${d_to_p_end} C ${pR + 24} ${pY}, ${cfR + 24} ${cfY}, ${cfR} ${cfY}`;
    const len_to_cf_start = getSvgPathLength(d_to_cf_start);

    const d_to_cf_end = `${d_to_cf_start} L ${cfL} ${cfY}`;
    const len_to_cf_end = getSvgPathLength(d_to_cf_end);
    const len_cf = Math.max(0, len_to_cf_end - len_to_cf_start);

    // Loop 34 to Buttons (LTR)
    const d_to_s_start = `${d_to_cf_end} C ${cfL - 24} ${cfY}, ${sL - 24} ${sY}, ${sL} ${sY}`;
    const len_to_s_start = getSvgPathLength(d_to_s_start);

    const d_to_s_end = `${d_to_s_start} L ${sR} ${sY}`;
    const len_to_s_end = getSvgPathLength(d_to_s_end);
    const len_s = Math.max(0, len_to_s_end - len_to_s_start);

    // Bridge to Google button
    const d_to_g_start = `${d_to_s_end} L ${gL} ${gY}`;
    const len_to_g_start = getSvgPathLength(d_to_g_start);

    // Google button line (LTR)
    const d_full = `${d_to_g_start} L ${gR} ${gY}`;
    const total = getSvgPathLength(d_full);
    const len_g = Math.max(0, total - len_to_g_start);

    const stylesMap = {
      'signup-name': {
        strokeDasharray: `${len0_name} ${total + 400}`,
        strokeDashoffset: '0'
      },
      'signup-email': {
        strokeDasharray: `${len_e} ${total + 400}`,
        strokeDashoffset: `-${len_to_e_start}`
      },
      'signup-password': {
        strokeDasharray: `${len_p} ${total + 400}`,
        strokeDashoffset: `-${len_to_p_start}`
      },
      'signup-confirm': {
        strokeDasharray: `${len_cf} ${total + 400}`,
        strokeDashoffset: `-${len_to_cf_start}`
      },
      'signup-submit': {
        strokeDasharray: `${len_s} ${total + 400}`,
        strokeDashoffset: `-${len_to_s_start}`
      },
      'signup-google': {
        strokeDasharray: `${len_g} ${total + 400}`,
        strokeDashoffset: `-${len_to_g_start}`
      }
    };

    setSignupSnake({ d: d_full, styles: stylesMap, total });
  }, []);

  // Update geometry on mount, resize, and mode switch
  useEffect(() => {
    const handleRecalc = () => {
      recalculateLoginSnake();
      recalculateSignupSnake();
    };

    // Trigger on slight delay to let layout settle
    const timer1 = setTimeout(handleRecalc, 50);
    const timer2 = setTimeout(handleRecalc, 250);
    window.addEventListener('resize', handleRecalc);

    return () => {
      clearTimeout(timer1);
      clearTimeout(timer2);
      window.removeEventListener('resize', handleRecalc);
    };
  }, [mode, recalculateLoginSnake, recalculateSignupSnake]);

  const switchMode = (newMode) => {
    setMode(newMode);
    setError('');
    setSuccessMsg('');
    const defaultFocus = newMode === 'login' ? 'login-email' : 'signup-name';
    setFocusedField(defaultFocus);
    
    // Auto focus the target first field on mode switch
    setTimeout(() => {
      if (newMode === 'login') {
        loginEmailInputRef.current?.focus();
      } else if (newMode === 'signup') {
        signupNameInputRef.current?.focus();
      }
    }, 100);
  };

  const handleGoogleLogin = async () => {
    setError('');
    setSuccessMsg('');
    setLoading(true);
    try {
      const redirectUrl = `${window.location.origin}/auth/callback`;
      const res = await fetch(`/api/auth/google?redirect_to=${encodeURIComponent(redirectUrl)}`);
      const data = await res.json();
      if (!res.ok || !data.url) {
        throw new Error(data.error || 'Failed to initialize Google Sign-in.');
      }
      window.location.href = data.url;
    } catch (err) {
      setError(err.message || 'Could not initiate Google Sign-in. Please try again.');
      setLoading(false);
    }
  };

  const handleLogin = async (e) => {
    if (e) e.preventDefault();
    setError('');
    setSuccessMsg('');
    setLoading(true);

    try {
      const user = await login(email, password);
      const isSuperAdmin = Boolean(
        (user.role || '').toLowerCase() === 'super_admin' ||
        (user.role || '').toLowerCase() === 'superadmin' ||
        Boolean(user.is_super_admin) ||
        (user.email || '').toLowerCase() === 'superadmin@vedika.ai'
      );
      const isAdmin = Boolean(
        isSuperAdmin ||
        (user.role || '').toLowerCase() === 'administrator' ||
        (user.role || '').toLowerCase() === 'admin' ||
        (user.role || '').toLowerCase() === 'system manager' ||
        (user.email || '').toLowerCase() === 'admin@lms.com' ||
        (user.username || '').toLowerCase() === 'administrator' ||
        (user.username || '').toLowerCase() === 'admin' ||
        (user.email || '').toLowerCase().startsWith('admin@')
      );

      if (isSuperAdmin) {
        user.role = 'super_admin';
        user.is_super_admin = true;
      } else if (isAdmin) {
        user.role = 'Administrator';
      }

      localStorage.setItem('frappe_user', JSON.stringify(user));
      if (user.token) {
        localStorage.setItem('token', user.token);
        localStorage.setItem('jwt', user.token);
      }

      if (isSuperAdmin) {
        router.replace('/super-admin');
      } else if (isAdmin) {
        router.replace('/admin');
      } else {
        router.replace('/');
      }
    } catch (err) {
      setError(err.message || 'Invalid email or password.');
      setLoading(false);
    }
  };

  const handleSignup = async (e) => {
    if (e) e.preventDefault();
    setError('');
    setSuccessMsg('');

    if (password !== confirmPassword) {
      setError('Passwords do not match. Please ensure both passwords match.');
      return;
    }

    if (password.length < 6) {
      setError('Password must be at least 6 characters long.');
      return;
    }

    setLoading(true);

    try {
      const res = await fetch('/api/auth/signup', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: fullName,
          email,
          password
        })
      });

      const data = await res.json();

      if (!res.ok || !data.success) {
        throw new Error(data.error || 'Registration failed. Please try again.');
      }

      // Store authenticated user session
      localStorage.setItem('frappe_user', JSON.stringify(data.user));
      setSuccessMsg('Account created successfully! Redirecting...');
      
      setTimeout(() => {
        router.replace('/');
      }, 800);
    } catch (err) {
      setError(err.message || 'Failed to create account. Please try again.');
      setLoading(false);
    }
  };

  const handleForgotPassword = (e) => {
    if (e) e.preventDefault();
    setError('');
    if (!email) {
      setError('Please enter your email address to receive password reset instructions.');
      return;
    }
    setLoading(true);
    setTimeout(() => {
      setLoading(false);
      setSuccessMsg(`If an account exists for ${email}, password reset instructions have been dispatched.`);
    }, 600);
  };

  const activeLoginStyle = loginSnake.styles[focusedField] || loginSnake.styles['login-email'] || { strokeDasharray: '240 1000', strokeDashoffset: '0' };
  const activeSignupStyle = signupSnake.styles[focusedField] || signupSnake.styles['signup-name'] || { strokeDasharray: '240 1000', strokeDashoffset: '0' };

  
return {router,mode,setMode,email,setEmail,password,setPassword,showPassword,setShowPassword,fullName,setFullName,confirmPassword,setConfirmPassword,showConfirmPassword,setShowConfirmPassword,error,setError,successMsg,setSuccessMsg,loading,setLoading,focusedField,setFocusedField,loginPaneRef,loginEmailRef,loginPwdRef,loginSubmitRef,loginGoogleRef,signupPaneRef,signupNameRef,signupEmailRef,signupPwdRef,signupConfirmRef,signupSubmitRef,signupGoogleRef,loginEmailInputRef,loginPwdInputRef,signupNameInputRef,signupEmailInputRef,signupPwdInputRef,signupConfirmInputRef,loginSnake,setLoginSnake,signupSnake,setSignupSnake,recalculateLoginSnake,recalculateSignupSnake,switchMode,handleGoogleLogin,handleLogin,handleSignup,handleForgotPassword,activeLoginStyle,activeSignupStyle};
}
