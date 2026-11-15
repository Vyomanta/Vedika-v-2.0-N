'use client';
import * as featureStyleFunctions from '@/features/administration/styles/View.78cca555.styles.js';

import inlineStyles from '@/features/administration/styles/admin-code-ex-page.jsx.styles.js';


import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import {
  Code2, Sparkles, Plus, Trash2, ExternalLink, CheckCircle2,
  Loader2, BookOpen, ChevronDown, ChevronUp, Terminal
} from 'lucide-react';
import { T } from '@/shared/design-system/theme';
import { useMediaQuery, isMobileMQ } from '@/lib/useMediaQuery';

const DEFAULT_FACULTY_PROGRAMS = [
  {
    id: 'find_max',
    title: 'Find Largest Number in Array',
    difficulty: 'Easy',
    description: 'Write a function find_max(arr) that takes an array/list of numbers and returns the largest number in it.',
    isDefault: true,
    stepsCount: 6
  },
  {
    id: 'reverse_str',
    title: 'Reverse a String',
    difficulty: 'Easy',
    description: 'Write a function reverse_string(s) that takes a string s and returns it reversed without using slicing [::-1].',
    isDefault: true,
    stepsCount: 6
  },
  {
    id: 'count_evens',
    title: 'Count Even Numbers',
    difficulty: 'Easy',
    description: 'Write a function count_evens(arr) that returns the count of even numbers present in the array arr.',
    isDefault: true,
    stepsCount: 6
  }
];

export default function AdminCodeExercisesPage() {
  const router = useRouter();
  const isMobile = useMediaQuery(isMobileMQ);

  const [programTitle, setProgramTitle] = useState('');
  const [difficulty, setDifficulty] = useState('Easy');
  const [isGenerating, setIsGenerating] = useState(false);
  const [customPuzzles, setCustomPuzzles] = useState([]);
  const [expandedId, setExpandedId] = useState(null);
  const [toastMsg, setToastMsg] = useState('');

  useEffect(() => {
    async function loadFacultyPuzzles() {
      try {
        const res = await fetch('/api/code-puzzle/faculty');
        const data = await res.json();
        if (Array.isArray(data.puzzles)) {
          setCustomPuzzles(data.puzzles);
          localStorage.setItem('vedika_faculty_puzzles', JSON.stringify(data.puzzles));
          return;
        }
      } catch (_) {}
      try {
        const cached = JSON.parse(localStorage.getItem('vedika_faculty_puzzles') || '[]');
        if (Array.isArray(cached)) setCustomPuzzles(cached);
      } catch (_) {}
    }
    loadFacultyPuzzles();
  }, []);

  const showToast = (msg) => {
    setToastMsg(msg);
    setTimeout(() => setToastMsg(''), 3200);
  };

  const handleCreateExercise = async (e) => {
    e.preventDefault();
    const trimmed = programTitle.trim();
    if (!trimmed || isGenerating) return;

    setIsGenerating(true);
    try {
      const res = await fetch('/api/code-puzzle/faculty', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ title: trimmed, difficulty })
      });
      const data = await res.json();
      if (data.error) throw new Error(data.error);

      const nextList = Array.isArray(data.puzzles) ? data.puzzles : [...customPuzzles, data.puzzle];
      setCustomPuzzles(nextList);
      localStorage.setItem('vedika_faculty_puzzles', JSON.stringify(nextList));
      setProgramTitle('');
      if (data.puzzle?.id) setExpandedId(data.puzzle.id);
      showToast(`"${trimmed}" assigned! Vedika AI generated ${data.puzzle?.steps?.length || 5} guided steps for students.`);
    } catch (err) {
      alert(err.message || 'Failed to generate exercise steps.');
    } finally {
      setIsGenerating(false);
    }
  };

  const handleDeleteExercise = async (id, title) => {
    if (!confirm(`Remove "${title}" from Given by Faculty exercises?`)) return;
    try {
      const res = await fetch(`/api/code-puzzle/faculty?id=${encodeURIComponent(id)}`, { method: 'DELETE' });
      const data = await res.json();
      const nextList = Array.isArray(data.puzzles) ? data.puzzles : customPuzzles.filter(p => p.id !== id);
      setCustomPuzzles(nextList);
      localStorage.setItem('vedika_faculty_puzzles', JSON.stringify(nextList));
      showToast(`Removed "${title}"`);
    } catch (_) {
      const nextList = customPuzzles.filter(p => p.id !== id);
      setCustomPuzzles(nextList);
      localStorage.setItem('vedika_faculty_puzzles', JSON.stringify(nextList));
    }
  };

  return (
    <div style={featureStyleFunctions.s0({isMobile,T})}>
      {/* Header */}
      <div style={inlineStyles.s0}>
        <div>
          <div style={inlineStyles.s1}>
            <div style={inlineStyles.s2}>
              <Code2 size={18} color="#A855F7" />
            </div>
            <h1 style={featureStyleFunctions.s1({isMobile})}>
              Faculty Programming Exercises
            </h1>
          </div>
          <p style={featureStyleFunctions.s2({T})}>
            Enter only the <strong>Program Name</strong> below. <strong>Vedika AI</strong> automatically builds the starter code, sample test cases, and step-by-step guidance for students under <em>&ldquo;Given by Faculty&rdquo;</em>.
          </p>
        </div>

        <button
          onClick={() => router.push('/code-puzzle')}
          style={inlineStyles.s3}
        >
          <ExternalLink size={14} />
          <span>Open Student Code Puzzle IDE</span>
        </button>
      </div>

      {toastMsg && (
        <div style={inlineStyles.s4}>
          <CheckCircle2 size={16} />
          <span>{toastMsg}</span>
        </div>
      )}

      {/* Faculty Quick-Assign Form */}
      <form
        onSubmit={handleCreateExercise}
        style={featureStyleFunctions.s3({T,isMobile})}
      >
        <div style={inlineStyles.s5}>
          <Sparkles size={14} />
          <span>Assign New Program to Students (Vedika AI Step Generator)</span>
        </div>

        <div style={featureStyleFunctions.s4({isMobile})}>
          <input
            type="text"
            required
            placeholder="e.g., Check Palindrome Number, Fibonacci Series, Binary Search, Sum of Digits..."
            value={programTitle}
            onChange={(e) => setProgramTitle(e.target.value)}
            style={featureStyleFunctions.s5({T})}
          />

          <select
            value={difficulty}
            onChange={(e) => setDifficulty(e.target.value)}
            style={featureStyleFunctions.s6({T})}
          >
            <option value="Easy">Easy</option>
            <option value="Medium">Medium</option>
            <option value="Hard">Hard</option>
          </select>

          <button
            type="submit"
            disabled={isGenerating || !programTitle.trim()}
            style={featureStyleFunctions.s7({isGenerating,programTitle})}
          >
            {isGenerating ? <Loader2 size={15} style={inlineStyles.s6} /> : <Plus size={15} />}
            <span>{isGenerating ? 'Vedika AI Generating Steps...' : 'Assign & Generate Steps'}</span>
          </button>
        </div>
      </form>

      {/* Active Faculty Programs List */}
      <div style={inlineStyles.s7}>
        <div style={featureStyleFunctions.s8({T})}>
          Active &ldquo;Given by Faculty&rdquo; Dropdown Programs ({DEFAULT_FACULTY_PROGRAMS.length + customPuzzles.length})
        </div>

        {/* Custom Faculty Added Programs */}
        {customPuzzles.map((p, idx) => {
          const isOpen = expandedId === p.id;
          return (
            <div
              key={p.id}
              style={featureStyleFunctions.s9({T})}
            >
              <div style={inlineStyles.s8}>
                <div style={inlineStyles.s9}>
                  <span style={inlineStyles.s10}>
                    Faculty Assigned #{DEFAULT_FACULTY_PROGRAMS.length + idx + 1}
                  </span>
                  <h3 style={featureStyleFunctions.s10({T})}>{p.title}</h3>
                  <span style={inlineStyles.s11}>
                    {p.difficulty || 'Easy'}
                  </span>
                  <span style={featureStyleFunctions.s11({T})}>
                    • {(p.steps || []).length} AI-Guided Steps
                  </span>
                </div>

                <div style={inlineStyles.s12}>
                  <button
                    onClick={() => setExpandedId(isOpen ? null : p.id)}
                    style={featureStyleFunctions.s12({T})}
                  >
                    <span>{isOpen ? 'Hide Steps' : 'View AI Steps'}</span>
                    {isOpen ? <ChevronUp size={13} /> : <ChevronDown size={13} />}
                  </button>
                  <button
                    onClick={() => handleDeleteExercise(p.id, p.title)}
                    title="Delete Program"
                    style={inlineStyles.s13}
                  >
                    <Trash2 size={14} />
                  </button>
                </div>
              </div>

              <p style={featureStyleFunctions.s13({T})}>{p.description}</p>

              {isOpen && Array.isArray(p.steps) && (
                <div style={featureStyleFunctions.s14({T})}>
                  <div style={inlineStyles.s14}>
                    Vedika AI Generated Step-by-Step Guide
                  </div>
                  {p.steps.map((s, sIdx) => (
                    <div key={s.id || sIdx} style={inlineStyles.s15}>
                      <strong style={inlineStyles.s16}>Step {sIdx + 1}:</strong>
                      <div>
                        <strong style={featureStyleFunctions.s15({T})}>{s.shortTitle}</strong> — <span style={featureStyleFunctions.s16({T})}>{s.description}</span>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          );
        })}

        {/* Built-in Default Faculty Programs */}
        {DEFAULT_FACULTY_PROGRAMS.map((p, idx) => (
          <div
            key={p.id}
            style={featureStyleFunctions.s17({T})}
          >
            <div>
              <div style={inlineStyles.s17}>
                <span style={inlineStyles.s18}>
                  Core #{idx + 1}
                </span>
                <h3 style={featureStyleFunctions.s18({T})}>{p.title}</h3>
                <span style={inlineStyles.s19}>
                  {p.difficulty}
                </span>
                <span style={featureStyleFunctions.s19({T})}>• {p.stepsCount} Guided Steps</span>
              </div>
              <p style={featureStyleFunctions.s20({T})}>{p.description}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
