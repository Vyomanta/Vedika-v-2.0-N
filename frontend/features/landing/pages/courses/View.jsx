'use client';
import * as featureStyleFunctions from '@/features/landing/styles/View.81e7f219.styles.js';

import inlineStyles from '@/features/landing/styles/courses-page.jsx.styles.js';


import React, { Component } from 'react';
import CoursePage from '@/components/CoursePage';
import { T } from '@/shared/design-system/theme';

class CoursesErrorBoundary extends Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error) {
    return { hasError: true, error };
  }

  componentDidCatch(error, errorInfo) {
    console.error('[Courses ErrorBoundary caught error]:', error, errorInfo);
  }

  handleReset = () => {
    if (typeof window !== 'undefined') {
      try {
        localStorage.removeItem('selected_course_id');
      } catch (e) {}
    }
    this.setState({ hasError: false, error: null });
  };

  render() {
    if (this.state.hasError) {
      return (
        <div style={inlineStyles.s0}>
          <div style={inlineStyles.s1}>
            <div style={inlineStyles.s2}>📚</div>
            <h3 style={inlineStyles.s3}>
              Course Explorer
            </h3>
            <p style={inlineStyles.s4}>
              The course explorer encountered an unexpected state. Click below to load your courses cleanly.
            </p>
            <div style={inlineStyles.s5}>
              <button
                onClick={this.handleReset}
                style={inlineStyles.s6}
              >
                View All Courses
              </button>
              <button
                onClick={() => {
                  if (typeof window !== 'undefined') {
                    localStorage.removeItem('selected_course_id');
                    window.location.reload();
                  }
                }}
                style={inlineStyles.s7}
              >
                Reload Page
              </button>
            </div>
          </div>
        </div>
      );
    }
    return this.props.children;
  }
}

export default function CoursesRoute() {
  return (
    <div style={featureStyleFunctions.s0({T})}>
      <CoursesErrorBoundary>
        <CoursePage completed={{}} />
      </CoursesErrorBoundary>
    </div>
  );
}
