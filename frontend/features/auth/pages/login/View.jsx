'use client';

import inlineStyles from '@/features/auth/styles/login-page.jsx.styles.js';
import { useState, useEffect, useRef, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import { Eye, EyeOff, GraduationCap, ArrowLeft, CheckCircle2, Sparkles, AlertCircle } from 'lucide-react';
import { login } from '@/features/auth/api/lms';
import '@/app/login/login.css';
import {getSvgPathLength} from '@/features/auth/components/features-auth-pages-login-View.support.jsx';
import {useLoginPageModel} from '@/features/auth/hooks/features-auth-pages-login-View.jsx';
export default function LoginPage() {
const {router,mode,setMode,email,setEmail,password,setPassword,showPassword,setShowPassword,fullName,setFullName,confirmPassword,setConfirmPassword,showConfirmPassword,setShowConfirmPassword,error,setError,successMsg,setSuccessMsg,loading,setLoading,focusedField,setFocusedField,loginPaneRef,loginEmailRef,loginPwdRef,loginSubmitRef,loginGoogleRef,signupPaneRef,signupNameRef,signupEmailRef,signupPwdRef,signupConfirmRef,signupSubmitRef,signupGoogleRef,loginEmailInputRef,loginPwdInputRef,signupNameInputRef,signupEmailInputRef,signupPwdInputRef,signupConfirmInputRef,loginSnake,setLoginSnake,signupSnake,setSignupSnake,recalculateLoginSnake,recalculateSignupSnake,switchMode,handleGoogleLogin,handleLogin,handleSignup,handleForgotPassword,activeLoginStyle,activeSignupStyle}=useLoginPageModel();
return (
    <div className="login-page-root">
      {/* Background ambient lighting */}
      <div className="login-bg-glow-1" />
      <div className="login-bg-glow-2" />

      {/* Header with Brand Badge & Switchers */}
      <header className="login-header-section">
        <div className="brand-badge">
          <div className="brand-icon-box">
            <GraduationCap size={15} />
          </div>
          <span>VEDIKA AI TUTOR</span>
        </div>

        {mode !== 'forgot' && (
          <nav className="switchers-container" aria-label="Authentication mode selection">
            <button
              type="button"
              className={`switcher-btn ${mode === 'login' ? 'is-active' : ''}`}
              onClick={() => switchMode('login')}
            >
              Login
              <span className="switcher-underline" />
            </button>
            <button
              type="button"
              className={`switcher-btn ${mode === 'signup' ? 'is-active' : ''}`}
              onClick={() => switchMode('signup')}
            >
              Sign Up
              <span className="switcher-underline" />
            </button>
          </nav>
        )}
      </header>

      {/* Overlapping Cards Container (Codepen 1 structure + Codepen 2 content) */}
      <main className="cards-deck-container">
        {mode !== 'forgot' ? (
          <>
            {/* ================= LOGIN CARD ================= */}
            <article
              className={`split-card ${mode === 'login' ? 'active-card' : 'inactive-login'}`}
              onClick={() => {
                if (mode !== 'login') switchMode('login');
              }}
            >
              {/* Left Pane (Codepen 2 clean high-contrast block) */}
              <div className="card-left-pane">
                <div>
                  <h1 className="card-title">Login</h1>
                  <p className="card-eula">
                    Sign in to access your interactive AI tutor, adaptive courses, and personalized code execution workspace.
                  </p>
                </div>
                <div className="card-left-footer">
                  Don't have an account?
                  <button
                    type="button"
                    className="card-left-link"
                    onClick={(e) => {
                      e.stopPropagation();
                      switchMode('signup');
                    }}
                  >
                    Sign Up
                  </button>
                </div>
              </div>

              {/* Right Pane (Codepen 2 dark slate block with snake line animation) */}
              <div className="card-right-pane" ref={loginPaneRef}>
                {/* Continuous Glowing Snake SVG Track */}
                <svg className="snake-svg-layer" aria-hidden="true">
                  <defs>
                    <linearGradient id="snakeGradient" x1="0%" y1="0%" x2="100%" y2="0%">
                      <stop offset="0%" stopColor="#ff00ff" />
                      <stop offset="50%" stopColor="#ff0055" />
                      <stop offset="100%" stopColor="#ff0000" />
                    </linearGradient>
                  </defs>
                  {loginSnake.d && (
                    <path
                      className="snake-path"
                      d={loginSnake.d}
                      style={activeLoginStyle}
                    />
                  )}
                </svg>

                {mode === 'login' && error && (
                  <div className="card-alert-error" role="alert">
                    <AlertCircle size={16} />
                    <span>{error}</span>
                  </div>
                )}
                {mode === 'login' && successMsg && (
                  <div className="card-alert-success" role="status">
                    <CheckCircle2 size={16} />
                    <span>{successMsg}</span>
                  </div>
                )}

                <form onSubmit={handleLogin} noValidate>
                  {/* Email or Username */}
                  <div className={`input-group ${focusedField === 'login-email' ? 'is-focused' : ''}`}>
                    <div className="input-label-row">
                      <label
                        htmlFor="login-email"
                        className="input-label"
                        onClick={() => loginEmailInputRef.current?.focus()}
                      >
                        Email or Username
                      </label>
                    </div>
                    <div
                      className="input-wrapper"
                      ref={loginEmailRef}
                      onClick={() => loginEmailInputRef.current?.focus()}
                    >
                      <input
                        ref={loginEmailInputRef}
                        id="login-email"
                        name="email"
                        type="text"
                        autoCapitalize="none"
                        autoCorrect="off"
                        className="card-input"
                        placeholder="Enter your email or username"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        onFocus={() => setFocusedField('login-email')}
                        required
                        tabIndex={mode === 'login' ? 0 : -1}
                        readOnly={mode !== 'login'}
                      />
                      <span className="input-base-line" />
                    </div>
                  </div>

                  {/* Password */}
                  <div className={`input-group ${focusedField === 'login-password' ? 'is-focused' : ''}`}>
                    <div className="input-label-row">
                      <label
                        htmlFor="login-password"
                        className="input-label"
                        onClick={() => loginPwdInputRef.current?.focus()}
                      >
                        Password
                      </label>
                    </div>
                    <div
                      className="input-wrapper"
                      ref={loginPwdRef}
                      onClick={() => loginPwdInputRef.current?.focus()}
                    >
                      <input
                        ref={loginPwdInputRef}
                        id="login-password"
                        name="password"
                        type={showPassword ? 'text' : 'password'}
                        className="card-input"
                        placeholder="Enter your password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        onFocus={() => setFocusedField('login-password')}
                        required
                        tabIndex={mode === 'login' ? 0 : -1}
                        readOnly={mode !== 'login'}
                      />
                      <button
                        type="button"
                        aria-label={showPassword ? 'Hide password' : 'Show password'}
                        className="pwd-toggle-btn"
                        onClick={(e) => {
                          e.stopPropagation();
                          setShowPassword(!showPassword);
                        }}
                      >
                        {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                      </button>
                      <span className="input-base-line" />
                    </div>

                    {/* Forgot password positioned cleanly below the password field */}
                    <div className="forgot-password-row">
                      <button
                        type="button"
                        className="forgot-btn-below"
                        onClick={(e) => {
                          e.stopPropagation();
                          switchMode('forgot');
                        }}
                      >
                        Forgot password?
                      </button>
                    </div>
                  </div>

                  {/* Side-by-Side Action Buttons: Sign In & Continue with Google */}
                  <div className="auth-buttons-row">
                    <button
                      ref={loginSubmitRef}
                      type="submit"
                      className="btn-submit-action side-btn"
                      disabled={loading || mode !== 'login'}
                      onFocus={() => setFocusedField('login-submit')}
                      onMouseEnter={() => setFocusedField('login-submit')}
                    >
                      {loading && mode === 'login' ? (
                        <>
                          <div style={inlineStyles.s0} />
                          Signing In...
                        </>
                      ) : 'Sign In'}
                    </button>

                    <button
                      ref={loginGoogleRef}
                      type="button"
                      className="btn-google-auth side-btn"
                      onClick={(e) => {
                        e.stopPropagation();
                        handleGoogleLogin();
                      }}
                      onFocus={() => setFocusedField('login-google')}
                      onMouseEnter={() => setFocusedField('login-google')}
                      disabled={mode !== 'login'}
                    >
                      <svg width="17" height="17" viewBox="0 0 24 24">
                        <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" />
                        <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" />
                        <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z" />
                        <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z" />
                      </svg>
                      <span>Continue with Google</span>
                    </button>
                  </div>
                </form>
              </div>
            </article>

            {/* ================= SIGN UP CARD ================= */}
            <article
              className={`split-card ${mode === 'signup' ? 'active-card' : 'inactive-signup'}`}
              onClick={() => {
                if (mode !== 'signup') switchMode('signup');
              }}
            >
              {/* Left Pane (Codepen 2 clean high-contrast block) */}
              <div className="card-left-pane">
                <div>
                  <h1 className="card-title">Sign Up</h1>
                  <p className="card-eula">
                    Create your student account to unlock real-time AI reasoning, interactive coding labs, and adaptive concept mastery.
                  </p>
                </div>
                <div className="card-left-footer">
                  Already have an account?
                  <button
                    type="button"
                    className="card-left-link"
                    onClick={(e) => {
                      e.stopPropagation();
                      switchMode('login');
                    }}
                  >
                    Sign In
                  </button>
                </div>
              </div>

              {/* Right Pane (Codepen 2 dark slate block with snake line animation) */}
              <div className="card-right-pane" ref={signupPaneRef}>
                {/* Continuous Glowing Snake SVG Track */}
                <svg className="snake-svg-layer" aria-hidden="true">
                  {signupSnake.d && (
                    <path
                      className="snake-path"
                      d={signupSnake.d}
                      style={activeSignupStyle}
                    />
                  )}
                </svg>

                {mode === 'signup' && error && (
                  <div className="card-alert-error" role="alert">
                    <AlertCircle size={16} />
                    <span>{error}</span>
                  </div>
                )}
                {mode === 'signup' && successMsg && (
                  <div className="card-alert-success" role="status">
                    <CheckCircle2 size={16} />
                    <span>{successMsg}</span>
                  </div>
                )}

                <form onSubmit={handleSignup} noValidate>
                  {/* Full Name */}
                  <div className={`input-group ${focusedField === 'signup-name' ? 'is-focused' : ''}`}>
                    <div className="input-label-row">
                      <label
                        htmlFor="signup-name"
                        className="input-label"
                        onClick={() => signupNameInputRef.current?.focus()}
                      >
                        Full Name
                      </label>
                    </div>
                    <div
                      className="input-wrapper"
                      ref={signupNameRef}
                      onClick={() => signupNameInputRef.current?.focus()}
                    >
                      <input
                        ref={signupNameInputRef}
                        id="signup-name"
                        name="name"
                        type="text"
                        className="card-input"
                        placeholder="Enter your full name"
                        value={fullName}
                        onChange={(e) => setFullName(e.target.value)}
                        onFocus={() => setFocusedField('signup-name')}
                        required
                        tabIndex={mode === 'signup' ? 0 : -1}
                        readOnly={mode !== 'signup'}
                      />
                      <span className="input-base-line" />
                    </div>
                  </div>

                  {/* Email Address */}
                  <div className={`input-group ${focusedField === 'signup-email' ? 'is-focused' : ''}`}>
                    <div className="input-label-row">
                      <label
                        htmlFor="signup-email"
                        className="input-label"
                        onClick={() => signupEmailInputRef.current?.focus()}
                      >
                        Email Address
                      </label>
                    </div>
                    <div
                      className="input-wrapper"
                      ref={signupEmailRef}
                      onClick={() => signupEmailInputRef.current?.focus()}
                    >
                      <input
                        ref={signupEmailInputRef}
                        id="signup-email"
                        name="email"
                        type="email"
                        autoCapitalize="none"
                        className="card-input"
                        placeholder="student@example.com"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        onFocus={() => setFocusedField('signup-email')}
                        required
                        tabIndex={mode === 'signup' ? 0 : -1}
                        readOnly={mode !== 'signup'}
                      />
                      <span className="input-base-line" />
                    </div>
                  </div>

                  {/* Create Password */}
                  <div className={`input-group ${focusedField === 'signup-password' ? 'is-focused' : ''}`}>
                    <div className="input-label-row">
                      <label
                        htmlFor="signup-password"
                        className="input-label"
                        onClick={() => signupPwdInputRef.current?.focus()}
                      >
                        Create Password
                      </label>
                    </div>
                    <div
                      className="input-wrapper"
                      ref={signupPwdRef}
                      onClick={() => signupPwdInputRef.current?.focus()}
                    >
                      <input
                        ref={signupPwdInputRef}
                        id="signup-password"
                        name="password"
                        type={showPassword ? 'text' : 'password'}
                        className="card-input"
                        placeholder="Minimum 6 characters"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        onFocus={() => setFocusedField('signup-password')}
                        required
                        tabIndex={mode === 'signup' ? 0 : -1}
                        readOnly={mode !== 'signup'}
                      />
                      <button
                        type="button"
                        aria-label={showPassword ? 'Hide password' : 'Show password'}
                        className="pwd-toggle-btn"
                        onClick={(e) => {
                          e.stopPropagation();
                          setShowPassword(!showPassword);
                        }}
                      >
                        {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                      </button>
                      <span className="input-base-line" />
                    </div>
                  </div>

                  {/* Confirm Password */}
                  <div className={`input-group ${focusedField === 'signup-confirm' ? 'is-focused' : ''}`}>
                    <div className="input-label-row">
                      <label
                        htmlFor="signup-confirm"
                        className="input-label"
                        onClick={() => signupConfirmInputRef.current?.focus()}
                      >
                        Confirm Password
                      </label>
                    </div>
                    <div
                      className="input-wrapper"
                      ref={signupConfirmRef}
                      onClick={() => signupConfirmInputRef.current?.focus()}
                    >
                      <input
                        ref={signupConfirmInputRef}
                        id="signup-confirm"
                        name="confirmPassword"
                        type={showConfirmPassword ? 'text' : 'password'}
                        className="card-input"
                        placeholder="Re-enter your password"
                        value={confirmPassword}
                        onChange={(e) => setConfirmPassword(e.target.value)}
                        onFocus={() => setFocusedField('signup-confirm')}
                        required
                        tabIndex={mode === 'signup' ? 0 : -1}
                        readOnly={mode !== 'signup'}
                      />
                      <button
                        type="button"
                        aria-label={showConfirmPassword ? 'Hide confirm password' : 'Show confirm password'}
                        className="pwd-toggle-btn"
                        onClick={(e) => {
                          e.stopPropagation();
                          setShowConfirmPassword(!showConfirmPassword);
                        }}
                      >
                        {showConfirmPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                      </button>
                      <span className="input-base-line" />
                    </div>
                  </div>

                  {/* Side-by-Side Action Buttons: Create Account & Sign up with Google */}
                  <div className="auth-buttons-row">
                    <button
                      ref={signupSubmitRef}
                      type="submit"
                      className="btn-submit-action side-btn"
                      disabled={loading || mode !== 'signup'}
                      onFocus={() => setFocusedField('signup-submit')}
                      onMouseEnter={() => setFocusedField('signup-submit')}
                    >
                      {loading && mode === 'signup' ? (
                        <>
                          <div style={inlineStyles.s1} />
                          Creating Account...
                        </>
                      ) : (
                        <>
                          <Sparkles size={15} />
                          Create Account
                        </>
                      )}
                    </button>

                    <button
                      ref={signupGoogleRef}
                      type="button"
                      className="btn-google-auth side-btn"
                      onClick={(e) => {
                        e.stopPropagation();
                        handleGoogleLogin();
                      }}
                      onFocus={() => setFocusedField('signup-google')}
                      onMouseEnter={() => setFocusedField('signup-google')}
                      disabled={mode !== 'signup'}
                    >
                      <svg width="17" height="17" viewBox="0 0 24 24">
                        <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" />
                        <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" />
                        <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z" />
                        <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z" />
                      </svg>
                      <span>Sign up with Google</span>
                    </button>
                  </div>
                </form>
              </div>
            </article>
          </>
        ) : (
          /* ================= FORGOT PASSWORD CARD ================= */
          <article className="split-card active-card">
            <div className="card-left-pane">
              <div>
                <h1 className="card-title">Reset Password</h1>
                <p className="card-eula">
                  Enter your registered email address below and we'll send you recovery instructions to regain access to your student account.
                </p>
              </div>
              <div className="card-left-footer">
                <button
                  type="button"
                  className="card-left-link"
                  style={inlineStyles.s2}
                  onClick={() => switchMode('login')}
                >
                  <ArrowLeft size={14} />
                  Back to Sign In
                </button>
              </div>
            </div>

            <div className="card-right-pane">
              {error && (
                <div className="card-alert-error" role="alert">
                  <AlertCircle size={16} />
                  <span>{error}</span>
                </div>
              )}
              {successMsg && (
                <div className="card-alert-success" role="status">
                  <CheckCircle2 size={16} />
                  <span>{successMsg}</span>
                </div>
              )}

              <form onSubmit={handleForgotPassword} noValidate>
                <div className={`input-group ${focusedField === 'forgot-email' ? 'is-focused' : ''}`}>
                  <div className="input-label-row">
                    <label htmlFor="forgot-email" className="input-label">Registered Email</label>
                  </div>
                  <div className="input-wrapper">
                    <input
                      id="forgot-email"
                      name="email"
                      type="email"
                      className="card-input"
                      placeholder="Enter your registered email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      onFocus={() => setFocusedField('forgot-email')}
                      required
                    />
                    <span className="input-base-line" />
                  </div>
                </div>

                <div className="auth-buttons-row">
                  <button
                    type="submit"
                    className="btn-submit-action side-btn"
                    disabled={loading}
                  >
                    {loading ? 'Sending...' : 'Send Reset Instructions'}
                  </button>

                  <button
                    type="button"
                    className="btn-google-auth side-btn"
                    onClick={() => switchMode('login')}
                  >
                    <ArrowLeft size={15} />
                    <span>Back to Sign In</span>
                  </button>
                </div>
              </form>
            </div>
          </article>
        )}
      </main>

      {/* Footer copyright */}
      <footer style={inlineStyles.s3}>
        © 2026 Vedika AI TUTOR Platform. All rights reserved.
      </footer>
    </div>
  );

}
