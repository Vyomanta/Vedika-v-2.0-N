'use client';
import * as featureStyleFunctions from '@/features/administration/styles/View.d2183fe1.styles.js';

import inlineStyles from '@/features/administration/styles/super-admin-login-page.jsx.styles.js';


import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { ShieldCheck, Lock, Mail, ArrowRight, Loader2, KeyRound, Sparkles, AlertCircle } from 'lucide-react';
import { T } from '@/shared/design-system/theme';

export default function SuperAdminLoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e) => {
    if (e) e.preventDefault();
    setError('');
    setLoading(true);

    try {
      const res = await fetch('/api/super-admin/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password })
      });

      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.error || 'Authentication failed.');
      }

      if (data.token) {
        localStorage.setItem('super_admin_jwt', data.token);
        localStorage.setItem('super_admin_user', JSON.stringify(data.user));
      }

      router.replace('/super-admin');
    } catch (err) {
      setError(err.message || 'Invalid Super Administrator credentials.');
      setLoading(false);
    }
  };

  return (
    <div style={inlineStyles.s0}>
      {/* Ambient background glows */}
      <div style={inlineStyles.s1} />
      <div style={inlineStyles.s2} />

      {/* Main card */}
      <div style={inlineStyles.s3}>
        {/* Header Icon */}
        <div style={inlineStyles.s4}>
          <div style={inlineStyles.s5}>
            <ShieldCheck size={22} color="#fff" />
          </div>
          <div>
            <div style={inlineStyles.s6}>
              <Sparkles size={11} /> PLATFORM GOVERNANCE
            </div>
            <h1 style={inlineStyles.s7}>
              Super Admin Console
            </h1>
          </div>
        </div>

        <p style={inlineStyles.s8}>
          Centralized SaaS administration, multi-tenant organization provisioning, and AI metering gateway.
        </p>

        {error && (
          <div style={inlineStyles.s9}>
            <AlertCircle size={16} style={inlineStyles.s10} />
            <span>{error}</span>
          </div>
        )}

        <form onSubmit={handleSubmit} style={inlineStyles.s11}>
          {/* Email */}
          <div>
            <label style={inlineStyles.s12}>
              ADMINISTRATOR EMAIL
            </label>
            <div style={inlineStyles.s13}>
              <Mail size={16} color="#64748B" />
              <input
                type="email"
                value={email}
                onChange={e => setEmail(e.target.value)}
                placeholder="superadmin@vedika.ai"
                required
                style={inlineStyles.s14}
              />
            </div>
          </div>

          {/* Password */}
          <div>
            <label style={inlineStyles.s15}>
              MASTER SECURITY KEY / PASSWORD
            </label>
            <div style={inlineStyles.s16}>
              <Lock size={16} color="#64748B" />
              <input
                type={showPassword ? 'text' : 'password'}
                value={password}
                onChange={e => setPassword(e.target.value)}
                placeholder="Enter Super Admin password"
                required
                style={inlineStyles.s17}
              />
              <button
                type="button"
                onClick={() => setShowPassword(p => !p)}
                style={inlineStyles.s18}
              >
                {showPassword ? 'Hide' : 'Show'}
              </button>
            </div>
          </div>

          {/* Submit Button */}
          <button
            type="submit"
            disabled={loading}
            style={featureStyleFunctions.s0({loading})}
          >
            {loading ? (
              <>
                <Loader2 size={16} style={inlineStyles.s19} />
                <span>Authenticating...</span>
              </>
            ) : (
              <>
                <span>Enter Super Admin Console</span>
                <ArrowRight size={16} />
              </>
            )}
          </button>
        </form>

        <div style={inlineStyles.s20}>
          <button
            type="button"
            onClick={() => router.push('/')}
            style={inlineStyles.s21}
          >
            &larr; Return to Student Portal
          </button>
        </div>
      </div>
    </div>
  );
}
