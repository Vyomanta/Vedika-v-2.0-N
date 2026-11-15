'use client';
import * as featureStyleFunctions from '@/features/administration/styles/View.f8e172a8.styles.js';

import inlineStyles from '@/features/administration/styles/admin-search-page.jsx.styles.js';


import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Search as SearchIcon, BookOpen, Users, CheckSquare, FileText, Briefcase, ArrowRight, CornerDownRight } from 'lucide-react';
import { T } from '@/shared/design-system/theme';
import { useMediaQuery, isMobileMQ } from '@/lib/useMediaQuery';
import { searchLMS } from '@/features/opportunities/api/lms';

export default function AdminSearchPage() {
  const router = useRouter();
  const isMobile = useMediaQuery(isMobileMQ);
  const [query, setQuery] = useState('');
  const [loading, setLoading] = useState(false);
  const [results, setResults] = useState({
    courses: [],
    batches: [],
    quizzes: [],
    assignments: [],
    jobs: []
  });

  useEffect(() => {
    if (!query.trim()) {
      setResults({ courses: [], batches: [], quizzes: [], assignments: [], jobs: [] });
      return;
    }

    setLoading(true);
    const debounce = setTimeout(() => {
      searchLMS(query).then(res => {
        setResults(res);
        setLoading(false);
      });
    }, 250);

    return () => clearTimeout(debounce);
  }, [query]);

  const totalResults = 
    results.courses.length + 
    results.batches.length + 
    results.quizzes.length + 
    results.assignments.length + 
    results.jobs.length;

  const renderResultSection = (title, items, icon, routePrefix, subtitleExtractor) => {
    if (items.length === 0) return null;
    const Icon = icon;

    return (
      <div style={featureStyleFunctions.s0({T})}>
        <h3 style={featureStyleFunctions.s1({T})}>
          <Icon size={16} /> {title} ({items.length})
        </h3>

        <div style={inlineStyles.s0}>
          {items.map((item) => (
            <div
              key={item.id}
              onClick={() => router.push(`${routePrefix}/${item.id}`)}
              style={featureStyleFunctions.s2({T})}
              onMouseEnter={(e) => {
                e.currentTarget.style.borderColor = T.purple;
                e.currentTarget.style.transform = 'translateX(4px)';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.borderColor = T.border;
                e.currentTarget.style.transform = 'none';
              }}
            >
              <div style={inlineStyles.s1}>
                <div style={featureStyleFunctions.s3({T})}>
                  {item.title}
                </div>
                <div style={featureStyleFunctions.s4({T})}>
                  <CornerDownRight size={12} color={T.dim} />
                  ID: {item.id} {subtitleExtractor && ` • ${subtitleExtractor(item)}`}
                </div>
              </div>
              <ArrowRight size={14} color={T.muted} />
            </div>
          ))}
        </div>
      </div>
    );
  };

  const containerPadding = isMobile ? '70px 16px 32px 16px' : '40px';

  return (
    <div style={featureStyleFunctions.s5({containerPadding})}>
      {/* Header */}
      <div style={inlineStyles.s2}>
        <h1 style={featureStyleFunctions.s6({T,isMobile})}>Search Portal</h1>
        <p style={featureStyleFunctions.s7({T})}>Search across all platform items like courses, modules, batches, quizzes, assignments, and jobs.</p>
      </div>

      {/* Search Bar Input */}
      <div style={inlineStyles.s3}>
        <span style={inlineStyles.s4}>
          <SearchIcon size={20} color={T.muted} />
        </span>
        <input
          type="text"
          placeholder="Type keywords to search courses, batches, quizzes, assignments..."
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          autoFocus
          style={featureStyleFunctions.s8({T})}
          onFocus={(e) => e.target.style.borderColor = T.purple}
          onBlur={(e) => e.target.style.borderColor = T.border}
        />
        {loading && (
          <div style={featureStyleFunctions.s9({T})} />
        )}
      </div>

      {/* Results rendering */}
      {query.trim() === '' ? (
        <div style={featureStyleFunctions.s10({T})}>
          <SearchIcon size={48} color={T.muted} style={inlineStyles.s5} />
          <h3 style={featureStyleFunctions.s11({T})}>Start searching</h3>
          <p style={featureStyleFunctions.s12({T})}>
            Type keywords in the search bar above to look up system resources.
          </p>
        </div>
      ) : totalResults === 0 && !loading ? (
        <div style={featureStyleFunctions.s13({T})}>
          <SearchIcon size={48} color={T.muted} style={inlineStyles.s6} />
          <h3 style={featureStyleFunctions.s14({T})}>No results found</h3>
          <p style={featureStyleFunctions.s15({T})}>
            No records matched "{query}". Try checking your spelling or search terms.
          </p>
        </div>
      ) : (
        <div>
          {renderResultSection("Courses", results.courses, BookOpen, "/admin/courses", (item) => item.category)}
          {renderResultSection("Batches", results.batches, Users, "/admin/batches", (item) => item.medium)}
          {renderResultSection("Quizzes", results.quizzes, CheckSquare, "/admin/quizzes", (item) => `Course: ${item.course}`)}
          {renderResultSection("Assignments", results.assignments, FileText, "/admin/assignments", (item) => `Course: ${item.course}`)}
          {renderResultSection("Jobs", results.jobs, Briefcase, "/admin/jobs", (item) => `${item.company} (${item.status})`)}
        </div>
      )}
    </div>
  );
}
