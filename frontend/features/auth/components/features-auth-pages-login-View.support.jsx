'use client';

import inlineStyles from '@/features/auth/styles/login-page.jsx.styles.js';
import { useState, useEffect, useRef, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import { Eye, EyeOff, GraduationCap, ArrowLeft, CheckCircle2, Sparkles, AlertCircle } from 'lucide-react';
import { login } from '@/features/auth/api/lms';
import '@/app/login/login.css';
export function getSvgPathLength(d) {
  if (typeof document === 'undefined') return 0;
  try {
    const path = document.createElementNS('http://www.w3.org/2000/svg', 'path');
    path.setAttribute('d', d);
    return path.getTotalLength() || 0;
  } catch (err) {
    return 0;
  }
}