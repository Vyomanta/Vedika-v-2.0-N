'use client';
import * as featureStyleFunctions from '@/features/auth/styles/View.40ec788e.styles.js';
import inlineStyles from '@/features/auth/styles/auth-callback-page.js.styles.js';
// app/auth/callback/page.js

import { useEffect, useState } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { GraduationCap } from 'lucide-react';
import { T } from '@/shared/design-system/theme';

export default function AuthCallback() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [status, setStatus] = useState('Verifying your Google session...');
  const [error, setError] = useState('');

  useEffect(() => {
    async function verifyAndFetchUser() {
      try {
        const frappeUrl = (process.env.NEXT_PUBLIC_FRAPPE_URL || process.env.FRAPPE_URL || 'https://vedika-v2-0.onrender.com').replace(/\/$/, '');
        
        // Check for Google OAuth authorization code from direct redirect
        const code = searchParams.get('code');
        if (code) {
          setStatus('Exchanging authorization code with Google...');
          const redirectUri = `${window.location.origin}/auth/callback`;
          const exchangeRes = await fetch('/api/auth/google/callback', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ code, redirect_uri: redirectUri, state: searchParams.get('state') })
          });

          const data = await exchangeRes.json();
          if (!exchangeRes.ok || !data.user) {
            throw new Error(data.error || 'Google authentication failed');
          }

          const userProfile = data.user;
          if (data.token) {
            localStorage.setItem('token', data.token);
            localStorage.setItem('jwt', data.token);
          }
          localStorage.setItem('frappe_user', JSON.stringify(userProfile));

          // Synchronize course progress
          try {
            const progressRes = await fetch(`/api/progress?email=${encodeURIComponent(userProfile.email)}`);
            if (progressRes.ok) {
              const progressData = await progressRes.json();
              localStorage.setItem(`completed_lessons_${userProfile.email}`, JSON.stringify(progressData.completed || {}));
            }
          } catch (e) {}

          const isAdmin = userProfile.role === 'Administrator';
          setStatus(`Welcome ${userProfile.name}! Redirecting to workspace...`);
          setTimeout(() => {
            router.replace(isAdmin ? '/admin' : '/');
          }, 600);
          return;
        }

        // Retrieve sid from search parameters if present (passed via redirect URL parameter)
        let sid = searchParams.get('sid');
        if (sid) {
          localStorage.setItem('frappe_sid', sid);
        } else {
          sid = localStorage.getItem('frappe_sid');
        }
        
        // Fetch logged-in user email from backend
        // We append the sid query parameter to bypass cross-site cookie restrictions
        const fetchUrl = sid 
          ? `${frappeUrl}/api/method/frappe.auth.get_logged_user?sid=${encodeURIComponent(sid)}`
          : `${frappeUrl}/api/method/frappe.auth.get_logged_user`;
          
        const emailRes = await fetch(fetchUrl, {
          credentials: 'include'
        });
        
        if (!emailRes.ok) {
          throw new Error('OAuth authentication failed');
        }
        
        const emailData = await emailRes.json();
        const email = emailData.message;
        
        if (!email || email === 'Guest') {
          throw new Error('No active session found');
        }
        
        setStatus('Retrieving student profile details...');
        
        // Fetch User Doc details
        const userFetchUrl = sid
          ? `${frappeUrl}/api/resource/User/${encodeURIComponent(email)}?sid=${encodeURIComponent(sid)}`
          : `${frappeUrl}/api/resource/User/${encodeURIComponent(email)}`;
          
        const userRes = await fetch(userFetchUrl, {
          credentials: 'include'
        });
        
        if (!userRes.ok) {
          throw new Error('Failed to load user profile');
        }
        
        const userData = await userRes.json();
        const userDoc = userData.data;
        
        // Check if the user is an admin
        const emailLower = (userDoc.email || '').toLowerCase();
        const isAdmin = emailLower === 'admin@lms.com' || Boolean(userDoc.roles?.some?.(r => (r.role || r) === 'Administrator' || (r.role || r) === 'System Manager'));
        const role = isAdmin ? 'Administrator' : 'Student';
        
        const userProfile = {
          email: userDoc.email,
          username: userDoc.email,
          name: userDoc.full_name || `${userDoc.first_name || ''} ${userDoc.last_name || ''}`.trim() || userDoc.email,
          role
        };

        // Exchange session sid for JWT token for secure API access
        try {
          const jwtRes = await fetch(`/api/auth/jwt${sid ? `?sid=${encodeURIComponent(sid)}` : ''}`);
          if (jwtRes.ok) {
            const jwtData = await jwtRes.json();
            if (jwtData.token) {
              localStorage.setItem('token', jwtData.token);
              localStorage.setItem('jwt', jwtData.token);
              userProfile.token = jwtData.token;
            }
          }
        } catch (jwtErr) {
          console.warn('Could not exchange session for JWT token:', jwtErr);
        }
        
        setStatus('Synchronizing course progress...');
        
        // Fetch student completions from Redis database
        try {
          const progressRes = await fetch(`/api/progress?email=${encodeURIComponent(userProfile.email)}`);
          if (progressRes.ok) {
            const progressData = await progressRes.json();
            const completed = progressData.completed || {};
            // Store completions in localStorage
            localStorage.setItem(`completed_lessons_${userProfile.email}`, JSON.stringify(completed));
          }
        } catch (e) {
          console.error("Failed to sync progress on callback", e);
        }
        
        // Save user profile to local storage
        localStorage.setItem('frappe_user', JSON.stringify(userProfile));
        
        setStatus(`Welcome! Redirecting to ${isAdmin ? 'Admin' : 'Student'} workspace...`);
        
        // Redirect to workspace based on role
        setTimeout(() => {
          router.replace(isAdmin ? '/admin' : '/');
        }, 800);
        
      } catch (err) {
        const errMsg = err.message || 'Verification failed. Please try again.';
        setError(errMsg);
        setTimeout(() => {
          router.replace(`/login?error=oauth_failed&msg=${encodeURIComponent(errMsg)}`);
        }, 3000);
      }
    }
    
    verifyAndFetchUser();
  }, [router, searchParams]);

  return (
    <div style={inlineStyles.s0}>
      <div style={featureStyleFunctions.s0({T})}>
        <div style={featureStyleFunctions.s1({T})}>
          <GraduationCap size={28} color="#fff" />
        </div>
        
        <div>
          <h3 style={inlineStyles.s1}>Google Sign-In</h3>
          <p style={featureStyleFunctions.s2({error,T})}>
            {error ? error : status}
          </p>
        </div>
        
        {!error && (
          <div style={featureStyleFunctions.s3({T})} />
        )}
      </div>
    </div>
  );
}