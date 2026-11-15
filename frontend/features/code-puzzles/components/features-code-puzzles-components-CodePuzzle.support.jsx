'use client';
import dynamic from 'next/dynamic';
import * as featureStyleFunctions from '@/features/code-puzzles/styles/features-code-puzzles-components-CodePuzzle.support.9cd876af.styles.js';

import inlineStyles from '@/features/code-puzzles/styles/CodePuzzle.styles';
import '@/features/code-puzzles/styles/CodePuzzle.css';
import { useState, useEffect, useRef, useCallback, useMemo } from 'react';
import { useRouter } from 'next/navigation';
const CodeMirror = dynamic(() => import('@uiw/react-codemirror'), { ssr: false });
import { python } from '@codemirror/lang-python';
import { html } from '@codemirror/lang-html';
import { usePyodide } from '@/hooks/usePyodide';
import {
  Play, RotateCcw, Save, Download, Check, Copy, ChevronLeft, ChevronRight,
  ChevronDown, ChevronUp, X, Plus, Terminal as TerminalIcon, CheckSquare,
  Eye, FileText, Code, Settings, Sparkles, Loader2, Target,
  FileCode, FolderTree, RefreshCw, ExternalLink, Monitor, Tablet,
  Smartphone, Award, AlertCircle, HelpCircle, Lightbulb, Zap, Globe,
  BookOpen, Trash2, Brain, Home
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { StateField, StateEffect } from "@codemirror/state";
import { EditorView, Decoration, WidgetType, keymap } from "@codemirror/view";
import { indentUnit, indentOnInput } from '@codemirror/language';
import { indentWithTab } from '@codemirror/commands';
import { Terminal } from 'xterm';
import { FitAddon } from 'xterm-addon-fit';
import 'xterm/css/xterm.css';
import { getMascotBridge } from '@/lib/mascotBridge';
import { useMediaQuery, isMobileMQ, isTabletMQ } from '@/lib/useMediaQuery';
export const setErrorEffect = StateEffect.define();

export class ErrorWidget extends WidgetType {
  constructor(message) {
    super();
    this.message = message;
  }
  toDOM() {
    const badge = document.createElement("span");
    badge.className = "cm-error-eol-tooltip";
    badge.title = this.message;
    badge.style.cssText = [
      "display: inline-flex",
      "align-items: center",
      "gap: 5px",
      "margin-left: 14px",
      "padding: 1px 9px",
      "font-size: 11px",
      "line-height: 1.35",
      "font-family: 'Plus Jakarta Sans', -apple-system, sans-serif",
      "color: #FDA4AF",
      "background: rgba(244, 63, 94, 0.14)",
      "border: 1px solid rgba(244, 63, 94, 0.42)",
      "border-radius: 999px",
      "vertical-align: middle",
      "white-space: nowrap",
      "max-width: 440px",
      "overflow: hidden",
      "text-overflow: ellipsis",
      "user-select: none",
      "pointer-events: auto",
      "cursor: help",
      "box-shadow: 0 2px 10px rgba(0, 0, 0, 0.35)"
    ].join(";");

    const icon = document.createElement("span");
    icon.textContent = "💡";
    icon.style.fontSize = "10.5px";
    badge.appendChild(icon);

    const text = document.createElement("span");
    text.textContent = this.message;
    badge.appendChild(text);

    return badge;
  }
}

export const errorDecorationField = StateField.define({
  create() {
    return Decoration.none;
  },
  update(decorations, tr) {
    decorations = decorations.map(tr.changes);
    for (let e of tr.effects) {
      if (e.is(setErrorEffect)) {
        const error = e.value;
        if (!error || !error.line) {
          return Decoration.none;
        }
        try {
          const docLines = tr.state.doc.lines;
          const targetLine = Math.max(1, Math.min(error.line, docLines));
          const linePos = tr.state.doc.line(targetLine);
          const deco = Decoration.widget({
            widget: new ErrorWidget(error.message),
            side: 1
          });
          return Decoration.set([deco.range(linePos.to)]);
        } catch (err) {
          console.warn("[CodeMirror Error Widget] Failed to apply decoration:", err);
          return Decoration.none;
        }
      }
    }
    return decorations;
  },
  provide: (f) => EditorView.decorations.from(f)
});

export function CustomDropdown({ value, options, onChange, icon: Icon, color = '#5B8CF8', minWidth = 140, maxWidth = 340 }) {
  const [isOpen, setIsOpen] = useState(false);
  const ref = useRef(null);
  const selectedOption = options.find(o => o.value === value) || options[0];

  useEffect(() => {
    const handleClickOutside = (e) => {
      if (ref.current && !ref.current.contains(e.target)) {
        setIsOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  return (
    <div ref={ref} style={inlineStyles.s0}>
      <button
        type="button"
        onClick={() => setIsOpen(!isOpen)}
        style={featureStyleFunctions.s0({isOpen,color,minWidth,maxWidth})}
      >
        <div style={inlineStyles.s1}>
          {Icon && <Icon size={13} color={color} />}
          <span style={inlineStyles.s2}>
            {selectedOption?.label || value}
          </span>
        </div>
        <ChevronDown size={11} color={color} style={featureStyleFunctions.s1({isOpen})} />
      </button>

      {isOpen && (
        <div style={featureStyleFunctions.s2({maxWidth})}>
          {options.map((opt) => {
            const isSelected = opt.value === value;
            return (
              <div
                key={String(opt.value)}
                onClick={() => {
                  onChange(opt.value);
                  setIsOpen(false);
                }}
                style={featureStyleFunctions.s3({isSelected,color})}
                onMouseEnter={e => {
                  if (!isSelected) e.currentTarget.style.background = 'rgba(255, 255, 255, 0.05)';
                }}
                onMouseLeave={e => {
                  if (!isSelected) e.currentTarget.style.background = 'transparent';
                }}
              >
                <div style={inlineStyles.s3}>
                  <span>{opt.label}</span>
                </div>
                {isSelected && <Check size={12} color={color} style={inlineStyles.s4} />}
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}

export const FACULTY_PUZZLES = [
  {
    id: "find_max",
    title: "Find Largest Number in Array",
    difficulty: "Easy",
    description: "Write a function `find_max(arr)` that takes an array/list of numbers and returns the largest number in it.",
    sampleInput: "arr = [12, 3, 45, 7, 23, 19]",
    sampleOutput: "45",
    constraints: [
      "1 <= len(arr) <= 10^5",
      "-10^9 <= arr[i] <= 10^9"
    ],
    testCases: [
      { id: 1, name: "Positive Numbers", input: "[1, 5, 2, 9, 3]", expected: "9" },
      { id: 2, name: "Negative Numbers", input: "[-10, -3, -50, -1]", expected: "-1" },
      { id: 3, name: "Single Item", input: "[42]", expected: "42" },
      { id: 4, name: "Duplicate Max", input: "[7, 12, 12, 3]", expected: "12" }
    ],
    starterCode: "def find_max(arr):\n    pass\n",
    defaultCall: "\n# Test call for visualizer\nmy_array = [12, 3, 45, 7, 23, 19]\nresult = find_max(my_array)\nprint('Array:', my_array)\nprint('Max Number:', result)\n",
    steps: [
      {
        id: "step1",
        shortTitle: "Define Function Signature",
        description: "Start by defining the function `def find_max(arr):` (you can name the input list parameter anything clear, such as `arr` or `numbers`). End the line with a colon `:`."
      },
      {
        id: "step2",
        shortTitle: "Initialize Tracking Variable",
        description: "Indented 4 spaces inside the function, create a variable to store the largest value seen so far and set it to the first element (e.g., `max_val = arr[0]`). Any valid variable name is accepted!"
      },
      {
        id: "step3",
        shortTitle: "Loop Through Elements",
        description: "On the next line (4 spaces indent), write a `for` loop to inspect each number in your list (e.g., `for num in arr:`)."
      },
      {
        id: "step4",
        shortTitle: "Compare Current Element",
        description: "Inside the loop (indented 8 spaces), write an `if` condition to check whether the current loop element is greater than your tracking variable (e.g., `if num > max_val:`)."
      },
      {
        id: "step5",
        shortTitle: "Update Tracking Variable",
        description: "Inside the `if` block (indented 12 spaces), update your tracking variable to the new larger element (e.g., `max_val = num`)."
      },
      {
        id: "step6",
        shortTitle: "Return Final Largest Value",
        description: "Outside the loop (back at 4 spaces indent), return your tracking variable (e.g., `return max_val` or whatever variable name you initialized in step 2)."
      }
    ]
  },
  {
    id: "reverse_str",
    title: "Reverse a String",
    difficulty: "Easy",
    description: "Write a function `reverse_string(s)` that takes a string `s` and returns it reversed using a loop (without `[::-1]`).",
    sampleInput: "s = 'vedika'",
    sampleOutput: "'akidev'",
    constraints: [
      "0 <= len(s) <= 10^5",
      "s consists of printable ASCII characters"
    ],
    testCases: [
      { id: 1, name: "Simple Word", input: "'hello'", expected: "'olleh'" },
      { id: 2, name: "Single Character", input: "'a'", expected: "'a'" },
      { id: 3, name: "Empty String", input: "''", expected: "''" }
    ],
    starterCode: "def reverse_string(s):\n    pass\n",
    defaultCall: "\n# Test call for visualizer\nword = 'vedika'\nresult = reverse_string(word)\nprint('Original:', word)\nprint('Reversed:', result)\n",
    steps: [
      {
        id: "step1",
        shortTitle: "Define Function Signature",
        description: "Define the function `def reverse_string(s):` (you may use any parameter name for the input string)."
      },
      {
        id: "step2",
        shortTitle: "Initialize Empty Result String",
        description: "Indented 4 spaces inside the function, initialize a variable to an empty string `''` or `\"\"` (e.g., `reversed_str = ''`)."
      },
      {
        id: "step3",
        shortTitle: "Loop Over Characters",
        description: "Write a `for` loop (4 spaces indent) to iterate through every character in the input string (e.g., `for ch in s:`)."
      },
      {
        id: "step4",
        shortTitle: "Prepend Current Character",
        description: "Inside the loop (indented 8 spaces), place the current character in front of your accumulator string (e.g., `reversed_str = ch + reversed_str`)."
      },
      {
        id: "step5",
        shortTitle: "Return Reversed String",
        description: "Outside the loop (at 4 spaces indent), return your reversed string variable (e.g., `return reversed_str`)."
      }
    ]
  },
  {
    id: "count_evens",
    title: "Count Even Numbers",
    difficulty: "Easy",
    description: "Write a function `count_evens(arr)` that returns the total count of even numbers present in the list.",
    sampleInput: "arr = [4, 2, 7, 9, 10, 5, 8]",
    sampleOutput: "4",
    constraints: [
      "0 <= len(arr) <= 10^5",
      "0 <= arr[i] <= 10^6"
    ],
    testCases: [
      { id: 1, name: "Mixed Numbers", input: "[4, 2, 7, 9, 10, 5, 8]", expected: "4" },
      { id: 2, name: "All Odd Numbers", input: "[1, 3, 5, 7, 9]", expected: "0" },
      { id: 3, name: "All Even Numbers", input: "[2, 4, 6, 8, 10]", expected: "5" }
    ],
    starterCode: "def count_evens(arr):\n    pass\n",
    defaultCall: "\n# Test call for visualizer\nmy_list = [4, 2, 7, 9, 10, 5, 8]\nresult = count_evens(my_list)\nprint('List:', my_list)\nprint('Even Count:', result)\n",
    steps: [
      {
        id: "step1",
        shortTitle: "Define Function Signature",
        description: "Define the function `def count_evens(arr):` with a parameter for the input list."
      },
      {
        id: "step2",
        shortTitle: "Initialize Counter to Zero",
        description: "Indented 4 spaces inside the function, initialize a counter variable to `0` (e.g., `even_count = 0` or `count = 0`)."
      },
      {
        id: "step3",
        shortTitle: "Iterate Through List",
        description: "Write a `for` loop (4 spaces indent) to go through each number in the list (e.g., `for num in arr:`)."
      },
      {
        id: "step4",
        shortTitle: "Check if Number is Even",
        description: "Inside the loop (indented 8 spaces), check if the current number is divisible by 2 using `%` (e.g., `if num % 2 == 0:`)."
      },
      {
        id: "step5",
        shortTitle: "Increment Counter",
        description: "Inside the `if` block (indented 12 spaces), add 1 to your counter variable (e.g., `count += 1` or `count = count + 1`)."
      },
      {
        id: "step6",
        shortTitle: "Return Final Count",
        description: "Outside the loop (at 4 spaces indent), return your counter variable (e.g., `return count`)."
      }
    ]
  }
];

export const WEB_PUZZLES = [
  {
    id: "interactive_card",
    title: "Interactive Profile Card",
    difficulty: "Easy",
    description: "Build a sleek glowing profile card with an avatar, user bio, skill badges, and an interactive 'Connect' button with JavaScript feedback.",
    html: `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <link rel="stylesheet" href="style.css">
</head>
<body>
  <div class="card">
    <div class="avatar">👨‍💻</div>
    <h2>Aarav Sharma</h2>
    <p class="role">Full Stack AI Developer</p>
    <div class="tags">
      <span class="tag">React</span>
      <span class="tag">Python</span>
      <span class="tag">CSS Grid</span>
    </div>
    <button id="connectBtn" onclick="handleConnect()">Connect With Me</button>
    <div id="status" class="status-msg"></div>
  </div>
  <script src="script.js"></script>
</body>
</html>`,
    css: `body {
  font-family: 'Outfit', -apple-system, BlinkMacSystemFont, sans-serif;
  background: #090D1A;
  color: #F8FAFC;
  margin: 0;
  display: flex;
  justify-content: center;
  align-items: center;
  min-height: 100vh;
}

.card {
  position: relative;
  background: rgba(18, 24, 38, 0.9);
  border: 1px solid rgba(168, 85, 247, 0.3);
  box-shadow: 0 12px 40px rgba(0, 0, 0, 0.6);
  border-radius: 16px;
  padding: 32px 24px;
  text-align: center;
  max-width: 320px;
  width: 100%;
}

.avatar {
  font-size: 48px;
  margin-bottom: 8px;
}

h2 {
  margin: 8px 0 4px;
  font-size: 20px;
  color: #FFFFFF;
}

.role {
  color: #A855F7;
  font-size: 13px;
  margin-bottom: 16px;
  font-weight: 500;
}

.tags {
  display: flex;
  gap: 6px;
  justify-content: center;
  margin-bottom: 20px;
}

.tag {
  background: rgba(168, 85, 247, 0.15);
  color: #C084FC;
  padding: 4px 10px;
  border-radius: 999px;
  font-size: 11px;
  font-weight: 600;
}

button {
  background: linear-gradient(135deg, #A855F7, #6366F1);
  color: #FFF;
  border: none;
  padding: 10px 20px;
  border-radius: 8px;
  font-weight: 600;
  cursor: pointer;
  transition: transform 0.15s ease, box-shadow 0.15s ease;
}

button:hover {
  transform: scale(1.04);
  box-shadow: 0 4px 16px rgba(168, 85, 247, 0.4);
}

.status-msg {
  margin-top: 14px;
  font-size: 12.5px;
  color: #34D399;
  min-height: 18px;
  font-weight: 500;
}`,
    js: `function handleConnect() {
  console.log("[Web] Connect button clicked!");
  const statusEl = document.getElementById("status");
  statusEl.textContent = "✨ Connection request sent successfully!";
}
`,
    steps: [
      {
        id: "step1",
        description: "Create a container `<div class=\"card\">` with an avatar icon and user heading.",
        shortTitle: "Card Container"
      },
      {
        id: "step2",
        description: "Style the `.card` with a dark glassmorphic background and purple border in `style.css`.",
        shortTitle: "CSS Card Style"
      },
      {
        id: "step3",
        description: "Add a `<button>` that calls `handleConnect()` when clicked.",
        shortTitle: "Interactive Button"
      },
      {
        id: "step4",
        description: "Implement `handleConnect()` in `script.js` to log to the console and update `#status` text.",
        shortTitle: "JavaScript Logic"
      }
    ]
  },
  {
    id: "animated_counter",
    title: "Animated Dynamic Counter",
    difficulty: "Easy",
    description: "Build an interactive counter application with increment, decrement, and reset actions, complete with live number animations and boundary warnings.",
    html: `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <link rel="stylesheet" href="style.css">
</head>
<body>
  <div class="counter-box">
    <h3>Live Counter</h3>
    <div id="counter-value" class="value">0</div>
    <div class="controls">
      <button onclick="changeCount(-1)">- Decrement</button>
      <button onclick="resetCount()" class="reset-btn">Reset</button>
      <button onclick="changeCount(1)">+ Increment</button>
    </div>
  </div>
  <script src="script.js"></script>
</body>
</html>`,
    css: `body {
  font-family: sans-serif;
  background: #0A0E1A;
  color: #FFF;
  margin: 0;
  display: flex;
  align-items: center;
  justify-content: center;
  min-height: 100vh;
}

.counter-box {
  background: #131A2B;
  border: 1px solid rgba(255,255,255,0.1);
  border-radius: 14px;
  padding: 28px 36px;
  text-align: center;
  box-shadow: 0 10px 30px rgba(0,0,0,0.5);
}

.value {
  font-size: 52px;
  font-weight: 800;
  color: #38BDF8;
  margin: 16px 0;
  transition: transform 0.12s ease;
}

.controls {
  display: flex;
  gap: 10px;
}

button {
  background: #2563EB;
  color: #FFF;
  border: none;
  padding: 8px 16px;
  border-radius: 6px;
  cursor: pointer;
  font-weight: 600;
  transition: background 0.15s;
}

button:hover {
  background: #1D4ED8;
}

.reset-btn {
  background: rgba(255,255,255,0.1);
}

.reset-btn:hover {
  background: rgba(255,255,255,0.2);
}`,
    js: `let count = 0;

function changeCount(delta) {
  count += delta;
  console.log("[Counter] Value changed to:", count);
  const el = document.getElementById("counter-value");
  el.textContent = count;
  el.style.transform = "scale(1.2)";
  setTimeout(() => el.style.transform = "scale(1)", 120);
}

function resetCount() {
  count = 0;
  console.log("[Counter] Value reset to 0");
  document.getElementById("counter-value").textContent = 0;
}`,
    steps: [
      {
        id: "step1",
        description: "Create a `#counter-value` display element initialized to 0.",
        shortTitle: "Value Display"
      },
      {
        id: "step2",
        description: "Add increment and decrement buttons with `onclick` handlers in `index.html`.",
        shortTitle: "Buttons Layout"
      },
      {
        id: "step3",
        description: "Define `changeCount(delta)` in `script.js` to modify state and update DOM text.",
        shortTitle: "State Updates"
      },
      {
        id: "step4",
        description: "Add scale micro-animation on count update for smooth feedback.",
        shortTitle: "Micro Animation"
      }
    ]
  },
  {
    id: "todo_app",
    title: "Interactive Mini Task List",
    difficulty: "Medium",
    description: "Implement a responsive task manager that allows users to add tasks dynamically and mark or remove items from the list.",
    html: `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <link rel="stylesheet" href="style.css">
</head>
<body>
  <div class="todo-app">
    <h2>My Tasks</h2>
    <div class="input-row">
      <input type="text" id="taskInput" placeholder="Add a new task..." />
      <button onclick="addTask()">Add</button>
    </div>
    <ul id="taskList">
      <li><span>Review code</span> <button onclick="this.parentElement.remove()">✕</button></li>
      <li><span>Test sandbox preview</span> <button onclick="this.parentElement.remove()">✕</button></li>
    </ul>
  </div>
  <script src="script.js"></script>
</body>
</html>`,
    css: `body {
  font-family: sans-serif;
  background: #0B0F19;
  color: #F1F5F9;
  display: flex;
  justify-content: center;
  align-items: center;
  min-height: 100vh;
  margin: 0;
}

.todo-app {
  background: #161F33;
  padding: 24px;
  border-radius: 12px;
  width: 320px;
  border: 1px solid rgba(255,255,255,0.1);
  box-shadow: 0 8px 30px rgba(0,0,0,0.4);
}

.input-row {
  display: flex;
  gap: 8px;
  margin-bottom: 16px;
}

input {
  flex: 1;
  background: #0B0F19;
  border: 1px solid #334155;
  border-radius: 6px;
  color: #FFF;
  padding: 8px 10px;
  outline: none;
}

button {
  background: #A855F7;
  color: #FFF;
  border: none;
  padding: 8px 14px;
  border-radius: 6px;
  cursor: pointer;
  font-weight: 600;
}

ul {
  list-style: none;
  padding: 0;
  margin: 0;
  display: flex;
  flex-direction: column;
  gap: 8px;
}

li {
  display: flex;
  justify-content: space-between;
  align-items: center;
  background: #0B0F19;
  padding: 8px 12px;
  border-radius: 6px;
}

li button {
  background: none;
  color: #EF4444;
  padding: 0 4px;
  cursor: pointer;
}`,
    js: `function addTask() {
  const input = document.getElementById("taskInput");
  const val = input.value.trim();
  if (!val) return;
  console.log("[Tasks] Added:", val);
  const li = document.createElement("li");
  li.innerHTML = '<span>' + val + '</span><button onclick="this.parentElement.remove()">✕</button>';
  document.getElementById("taskList").appendChild(li);
  input.value = "";
}`,
    steps: [
      {
        id: "step1",
        description: "Create an input field and Add button inside `.todo-app`.",
        shortTitle: "Input Form"
      },
      {
        id: "step2",
        description: "Create an empty `<ul>` list container with `#taskList`.",
        shortTitle: "List Container"
      },
      {
        id: "step3",
        description: "Implement `addTask()` in `script.js` to create `<li>` elements dynamically.",
        shortTitle: "Dynamic Appending"
      },
      {
        id: "step4",
        description: "Attach a remove button to each task item that deletes its parent on click.",
        shortTitle: "Item Deletion"
      }
    ]
  }
];

export function isLineIncompleteInProgress(code) {
  if (!code) return true;
  const activeLines = code
    .split('\n')
    .map(l => l.split('#')[0].trimEnd())
    .filter(l => l.trim().length > 0 && l.trim() !== 'pass');
  if (activeLines.length === 0) return true;
  const last = activeLines[activeLines.length - 1].trim();
  // Incomplete keyword prefixes or trailing operators while student is mid-thought
  if (/^(def|for|if|elif|else|while|return)\s*$/.test(last)) return true;
  if (/^(def|for|if|elif|while)\b/.test(last) && !last.endsWith(':')) return true;
  if (/[=+\-*/%><,\(\[\{]$/.test(last)) return true;
  if (/in\s*$/.test(last)) return true;
  return false;
}

export function getVariableBestPracticeTip(varName, recommendedExamples) {
  if (!varName) return '';
  const clean = varName.trim();
  if (clean.length <= 1 || /^[a-z][0-9]*$/i.test(clean)) {
    return `Nice logic! Best-practice tip: Using a descriptive variable name like ${recommendedExamples} instead of '${clean}' makes your code much easier to read in real-world projects.`;
  }
  return '';
}

export function validatePythonStepLocally(code, puzzleId, stepIndex) {
  if (!code || typeof code !== 'string') {
    return { passed: false, line: 1, message: 'Write your Python code in the editor to begin.' };
  }

  const rawLines = code.split('\n');
  const lines = rawLines.map((line, idx) => {
    const trimmed = line.trim();
    const noComment = trimmed.split('#')[0].trim();
    const indentMatch = line.match(/^(\s*)/);
    const indent = indentMatch ? indentMatch[1].length : 0;
    return { raw: line, trimmed, noComment, indent, lineNum: idx + 1 };
  });

  // Balanced parenthesis, brackets, and quotes check
  for (const l of lines) {
    if (!l.noComment) continue;
    const openParen = (l.noComment.match(/\(/g) || []).length;
    const closeParen = (l.noComment.match(/\)/g) || []).length;
    const openSquare = (l.noComment.match(/\[/g) || []).length;
    const closeSquare = (l.noComment.match(/\]/g) || []).length;
    if (openParen !== closeParen) {
      return { passed: false, line: l.lineNum, message: 'SyntaxError: Unbalanced parentheses () on this line.' };
    }
    if (openSquare !== closeSquare) {
      return { passed: false, line: l.lineNum, message: 'SyntaxError: Unbalanced square brackets [] on this line.' };
    }
  }

  // Extract user's parameter name from def line if present
  const defLineAny = lines.find(l => /^def\s+[a-zA-Z_]\w*\s*\(([a-zA-Z_]\w*)?\)\s*:?/.test(l.noComment));
  const paramMatch = defLineAny ? defLineAny.noComment.match(/^def\s+([a-zA-Z_]\w*)\s*\(\s*([a-zA-Z_]\w*)?\s*\)/) : null;
  const userParam = paramMatch?.[2] || '';

  // Helper to extract identifier names from an expression
  const getLineIdentifiers = (lineStr) => {
    return (lineStr.match(/\b[a-zA-Z_]\w*\b/g) || []).filter(
      id => !['def', 'return', 'for', 'in', 'if', 'else', 'elif', 'pass', 'and', 'or', 'not', 'is', 'True', 'False', 'None'].includes(id)
    );
  };

  // 1. Find Max Puzzle (6 clear steps with cross-step variable consistency)
  if (puzzleId === 'find_max') {
    const defLine = lines.find(l => /^def\s+[a-zA-Z_]\w*\s*\(\s*[a-zA-Z_]\w*\s*\)/.test(l.noComment));
    if (stepIndex === 0) {
      if (!defLine) return { passed: false, line: 1, message: 'Define the function signature, e.g. def find_max(arr):' };
      if (!defLine.noComment.endsWith(':')) return { passed: false, line: defLine.lineNum, message: 'SyntaxError: Add a colon ":" at the end of your def line.' };
      return { passed: true, line: 0, message: '', suggestion: getVariableBestPracticeTip(userParam, '`arr` or `numbers`') };
    }

    // Identify user's tracking variable from line like 'val = arr[0]' or 'max_val = arr[0]'
    const initLine = lines.find(l => /^([a-zA-Z_]\w*)\s*=\s*[a-zA-Z_]\w*\s*\[\s*0\s*\]$/.test(l.noComment));
    const trackingVar = initLine ? initLine.noComment.split('=')[0].trim() : null;

    if (stepIndex === 1) {
      if (!initLine) return { passed: false, line: 2, message: 'Initialize your tracking variable to the first item, e.g. max_val = arr[0]' };
      if (initLine.indent === 0) return { passed: false, line: initLine.lineNum, message: 'IndentationError: Indent this line by 4 spaces inside the function.' };
      return { passed: true, line: 0, message: '', suggestion: getVariableBestPracticeTip(trackingVar, '`max_val` or `largest`') };
    }

    // Identify loop variable from line like 'for num in arr:'
    const loopLine = lines.find(l => /^for\s+([a-zA-Z_]\w*)\s+in\s+.+:$/.test(l.noComment));
    const loopVar = loopLine ? loopLine.noComment.match(/^for\s+([a-zA-Z_]\w*)/)?.[1] : null;

    if (stepIndex === 2) {
      if (!loopLine) return { passed: false, line: 3, message: 'Write a for loop over the list, e.g. for num in arr:' };
      if (loopLine.indent === 0) return { passed: false, line: loopLine.lineNum, message: 'IndentationError: Indent the for loop (4 spaces) inside the function.' };
      return { passed: true, line: 0, message: '', suggestion: getVariableBestPracticeTip(loopVar, '`num` or `item`') };
    }

    if (stepIndex === 3) {
      const ifLine = lines.find(l => /^if\s+.+[><].*:$/.test(l.noComment));
      if (!ifLine) return { passed: false, line: 4, message: `Inside the loop, compare the current element with your tracking variable, e.g. if ${loopVar || 'num'} > ${trackingVar || 'max_val'}:` };
      if (ifLine.indent <= 4) return { passed: false, line: ifLine.lineNum, message: 'IndentationError: Indent the if statement inside the for loop (8 spaces).' };
      // Verify consistency: if the user defined 'val', they must not compare against an undefined variable like 'max_val'
      if (trackingVar) {
        const ifIds = getLineIdentifiers(ifLine.noComment);
        if (!ifIds.includes(trackingVar)) {
          return {
            passed: false,
            line: ifLine.lineNum,
            message: `NameError: You defined '${trackingVar}', but your comparison doesn't use it. Please compare with '${trackingVar}' (e.g. if ${loopVar || 'num'} > ${trackingVar}:).`
          };
        }
      }
      return { passed: true, line: 0, message: '' };
    }

    if (stepIndex === 4) {
      const updateLine = lines.find(l => /^[a-zA-Z_]\w*\s*=\s*[a-zA-Z_]\w*(\[.*\])?$/.test(l.noComment) && !/\[\s*0\s*\]/.test(l.noComment));
      const oneLiner = lines.find(l => /^if\s+.+[><].*:\s*[a-zA-Z_]\w*\s*=\s*[a-zA-Z_]\w*/.test(l.noComment));
      if (!updateLine && !oneLiner) return { passed: false, line: 5, message: `Inside the if block, update your tracking variable, e.g. ${trackingVar || 'max_val'} = ${loopVar || 'num'}` };
      if (updateLine && updateLine.indent <= 8) return { passed: false, line: updateLine.lineNum, message: 'IndentationError: Indent the assignment inside the if block (12 spaces).' };
      // Verify consistency: assignment must update the user's tracking variable
      if (trackingVar) {
        const targetLine = updateLine || oneLiner;
        const assignedTarget = targetLine.noComment.split('=')[0].replace(/^.*:/, '').trim();
        if (assignedTarget !== trackingVar) {
          return {
            passed: false,
            line: targetLine.lineNum,
            message: `NameError: You defined '${trackingVar}' as your tracking variable, but you are updating '${assignedTarget}'. Please update '${trackingVar}'.`
          };
        }
      }
      return { passed: true, line: 0, message: '' };
    }

    if (stepIndex === 5) {
      if (!trackingVar) {
        return { passed: false, line: 2, message: 'Initialize your tracking variable first (e.g., max_val = arr[0]).' };
      }
      const retLine = lines.find(l => /^return\s+[a-zA-Z_]\w*/.test(l.noComment));
      if (!retLine) return { passed: false, line: lines.length, message: `Return your tracking variable outside the loop, e.g. return ${trackingVar}` };
      if (retLine.indent > 4) return { passed: false, line: retLine.lineNum, message: 'Indentation warning: Place return at 4 spaces indent (outside the for loop) so the loop finishes first.' };

      // CRITICAL FIX: Verify that the returned variable matches the actual tracking variable declared!
      const retMatch = retLine.noComment.match(/^return\s+([a-zA-Z_]\w*)/);
      const returnedVar = retMatch ? retMatch[1] : '';
      if (returnedVar !== trackingVar) {
        return {
          passed: false,
          line: retLine.lineNum,
          message: `NameError: name '${returnedVar}' is not defined. You initialized '${trackingVar}' earlier, so you should write 'return ${trackingVar}'.`
        };
      }

      // End-to-End Function Scope Check: Ensure no undefined identifiers exist anywhere in the function
      const declaredScope = new Set([
        trackingVar,
        loopVar,
        userParam,
        'find_max',
        'len', 'range', 'enumerate', 'int', 'float', 'str', 'print', 'min', 'max'
      ].filter(Boolean));

      for (const l of lines) {
        if (!l.noComment || l.noComment.startsWith('def ')) continue;
        const lineVars = getLineIdentifiers(l.noComment);
        for (const v of lineVars) {
          if (!declaredScope.has(v)) {
            return {
              passed: false,
              line: l.lineNum,
              message: `NameError: name '${v}' is not defined in this function. Did you mean '${trackingVar}'?`
            };
          }
        }
      }

      return { passed: true, line: 0, message: '' };
    }
  }

  // 2. Reverse String Puzzle (5 clear steps with cross-step variable consistency)
  if (puzzleId === 'reverse_str') {
    const defLine = lines.find(l => /^def\s+[a-zA-Z_]\w*\s*\(\s*[a-zA-Z_]\w*\s*\)/.test(l.noComment));
    if (stepIndex === 0) {
      if (!defLine) return { passed: false, line: 1, message: 'Define function signature, e.g. def reverse_string(s):' };
      if (!defLine.noComment.endsWith(':')) return { passed: false, line: defLine.lineNum, message: 'SyntaxError: Missing colon ":" at the end of def line.' };
      return { passed: true, line: 0, message: '', suggestion: getVariableBestPracticeTip(userParam, '`text` or `input_str`') };
    }

    const initLine = lines.find(l => /^([a-zA-Z_]\w*)\s*=\s*(['"]{2}|str\(\))$/.test(l.noComment));
    const trackingVar = initLine ? initLine.noComment.split('=')[0].trim() : null;

    if (stepIndex === 1) {
      if (!initLine) return { passed: false, line: 2, message: 'Initialize an empty string variable, e.g. reversed_str = ""' };
      if (initLine.indent === 0) return { passed: false, line: initLine.lineNum, message: 'IndentationError: Indent with 4 spaces inside the function.' };
      return { passed: true, line: 0, message: '', suggestion: getVariableBestPracticeTip(trackingVar, '`reversed_str` or `result`') };
    }

    const loopLine = lines.find(l => /^for\s+([a-zA-Z_]\w*)\s+in\s+.+:$/.test(l.noComment));
    const loopVar = loopLine ? loopLine.noComment.match(/^for\s+([a-zA-Z_]\w*)/)?.[1] : null;

    if (stepIndex === 2) {
      if (!loopLine) return { passed: false, line: 3, message: 'Loop over each character, e.g. for char in s:' };
      if (loopLine.indent === 0) return { passed: false, line: loopLine.lineNum, message: 'IndentationError: Indent the for loop inside the function.' };
      return { passed: true, line: 0, message: '', suggestion: getVariableBestPracticeTip(loopVar, '`char` or `ch`') };
    }

    if (stepIndex === 3) {
      const appendLine = lines.find(l => /^[a-zA-Z_]\w*\s*=\s*[a-zA-Z_]\w*\s*\+\s*[a-zA-Z_]\w*/.test(l.noComment));
      if (!appendLine) return { passed: false, line: 4, message: `Prepend the character inside the loop, e.g. ${trackingVar || 'reversed_str'} = ${loopVar || 'char'} + ${trackingVar || 'reversed_str'}` };
      if (appendLine.indent <= 4) return { passed: false, line: appendLine.lineNum, message: 'IndentationError: Indent this line inside the for loop (8 spaces).' };
      if (trackingVar) {
        const assignedTarget = appendLine.noComment.split('=')[0].trim();
        if (assignedTarget !== trackingVar) {
          return {
            passed: false,
            line: appendLine.lineNum,
            message: `NameError: You defined '${trackingVar}', but you are updating '${assignedTarget}'. Please update '${trackingVar}'.`
          };
        }
      }
      return { passed: true, line: 0, message: '' };
    }

    if (stepIndex === 4) {
      if (!trackingVar) {
        return { passed: false, line: 2, message: 'Initialize your result string variable first (e.g. reversed_str = "").' };
      }
      const retLine = lines.find(l => /^return\s+[a-zA-Z_]\w*/.test(l.noComment));
      if (!retLine) return { passed: false, line: lines.length, message: `Return your reversed string variable outside the loop, e.g. return ${trackingVar}` };
      if (retLine.indent > 4) return { passed: false, line: retLine.lineNum, message: 'Indentation warning: return should be outside the for loop (4 spaces indent).' };

      const retMatch = retLine.noComment.match(/^return\s+([a-zA-Z_]\w*)/);
      const returnedVar = retMatch ? retMatch[1] : '';
      if (returnedVar !== trackingVar) {
        return {
          passed: false,
          line: retLine.lineNum,
          message: `NameError: name '${returnedVar}' is not defined. You initialized '${trackingVar}', so you must write 'return ${trackingVar}'.`
        };
      }

      const declaredScope = new Set([
        trackingVar,
        loopVar,
        userParam,
        'reverse_string',
        'len', 'range', 'enumerate', 'int', 'float', 'str', 'print'
      ].filter(Boolean));

      for (const l of lines) {
        if (!l.noComment || l.noComment.startsWith('def ')) continue;
        const lineVars = getLineIdentifiers(l.noComment);
        for (const v of lineVars) {
          if (!declaredScope.has(v)) {
            return {
              passed: false,
              line: l.lineNum,
              message: `NameError: name '${v}' is not defined in this function. Did you mean '${trackingVar}'?`
            };
          }
        }
      }

      return { passed: true, line: 0, message: '' };
    }
  }

  // 3. Count Evens Puzzle (6 clear steps with cross-step variable consistency)
  if (puzzleId === 'count_evens') {
    const defLine = lines.find(l => /^def\s+[a-zA-Z_]\w*\s*\(\s*[a-zA-Z_]\w*\s*\)/.test(l.noComment));
    if (stepIndex === 0) {
      if (!defLine) return { passed: false, line: 1, message: 'Define function signature, e.g. def count_evens(arr):' };
      if (!defLine.noComment.endsWith(':')) return { passed: false, line: defLine.lineNum, message: 'SyntaxError: Missing colon ":" at the end of def line.' };
      return { passed: true, line: 0, message: '', suggestion: getVariableBestPracticeTip(userParam, '`arr` or `numbers`') };
    }

    const initLine = lines.find(l => /^([a-zA-Z_]\w*)\s*=\s*0\b/.test(l.noComment));
    const trackingVar = initLine ? initLine.noComment.split('=')[0].trim() : null;

    if (stepIndex === 1) {
      if (!initLine) return { passed: false, line: 2, message: 'Initialize a counter variable to 0, e.g. count = 0' };
      if (initLine.indent === 0) return { passed: false, line: initLine.lineNum, message: 'IndentationError: Indent with 4 spaces inside the function.' };
      return { passed: true, line: 0, message: '', suggestion: getVariableBestPracticeTip(trackingVar, '`count` or `even_count`') };
    }

    const loopLine = lines.find(l => /^for\s+([a-zA-Z_]\w*)\s+in\s+.+:$/.test(l.noComment));
    const loopVar = loopLine ? loopLine.noComment.match(/^for\s+([a-zA-Z_]\w*)/)?.[1] : null;

    if (stepIndex === 2) {
      if (!loopLine) return { passed: false, line: 3, message: 'Loop through the list, e.g. for num in arr:' };
      if (loopLine.indent === 0) return { passed: false, line: loopLine.lineNum, message: 'IndentationError: Indent the for loop (4 spaces) inside the function.' };
      return { passed: true, line: 0, message: '', suggestion: getVariableBestPracticeTip(loopVar, '`num` or `item`') };
    }

    if (stepIndex === 3) {
      const modLine = lines.find(l => /^if\s+.+%\s*2\s*==\s*0\s*:$/.test(l.noComment));
      if (!modLine) return { passed: false, line: 4, message: `Check if the element is divisible by 2, e.g. if ${loopVar || 'num'} % 2 == 0:` };
      if (modLine.indent <= 4) return { passed: false, line: modLine.lineNum, message: 'IndentationError: Indent the if condition inside the for loop (8 spaces).' };
      return { passed: true, line: 0, message: '' };
    }

    if (stepIndex === 4) {
      const incLine = lines.find(l => /^[a-zA-Z_]\w*\s*(\+=\s*1|=\s*[a-zA-Z_]\w*\s*\+\s*1)\b/.test(l.noComment));
      if (!incLine) return { passed: false, line: 5, message: `Increment your counter variable by 1, e.g. ${trackingVar || 'count'} += 1` };
      if (incLine.indent <= 8) return { passed: false, line: incLine.lineNum, message: 'IndentationError: Indent the increment inside the if block (12 spaces).' };
      if (trackingVar) {
        const assignedTarget = incLine.noComment.split(/\+=|=/)[0].trim();
        if (assignedTarget !== trackingVar) {
          return {
            passed: false,
            line: incLine.lineNum,
            message: `NameError: You defined '${trackingVar}', but you are incrementing '${assignedTarget}'. Please increment '${trackingVar}'.`
          };
        }
      }
      return { passed: true, line: 0, message: '' };
    }

    if (stepIndex === 5) {
      if (!trackingVar) {
        return { passed: false, line: 2, message: 'Initialize your counter variable first (e.g. count = 0).' };
      }
      const retLine = lines.find(l => /^return\s+[a-zA-Z_]\w*/.test(l.noComment));
      if (!retLine) return { passed: false, line: lines.length, message: `Return your counter variable outside the loop, e.g. return ${trackingVar}` };
      if (retLine.indent > 4) return { passed: false, line: retLine.lineNum, message: 'Indentation warning: Place return at 4 spaces indent (outside the for loop).' };

      const retMatch = retLine.noComment.match(/^return\s+([a-zA-Z_]\w*)/);
      const returnedVar = retMatch ? retMatch[1] : '';
      if (returnedVar !== trackingVar) {
        return {
          passed: false,
          line: retLine.lineNum,
          message: `NameError: name '${returnedVar}' is not defined. You initialized '${trackingVar}', so you must write 'return ${trackingVar}'.`
        };
      }

      const declaredScope = new Set([
        trackingVar,
        loopVar,
        userParam,
        'count_evens',
        'len', 'range', 'enumerate', 'int', 'float', 'str', 'print'
      ].filter(Boolean));

      for (const l of lines) {
        if (!l.noComment || l.noComment.startsWith('def ')) continue;
        const lineVars = getLineIdentifiers(l.noComment);
        for (const v of lineVars) {
          if (!declaredScope.has(v)) {
            return {
              passed: false,
              line: l.lineNum,
              message: `NameError: name '${v}' is not defined in this function. Did you mean '${trackingVar}'?`
            };
          }
        }
      }

      return { passed: true, line: 0, message: '' };
    }
  }

  // Generic check for AI or faculty custom puzzles
  if (stepIndex === 0) {
    const hasDef = lines.some(l => /^def\s+[a-zA-Z_]\w*\s*\(.*\)\s*:$/.test(l.noComment));
    if (!hasDef) return { passed: false, line: 1, message: 'Define your function signature ending with a colon, e.g. def solve(...):' };
  }

  return { passed: true, line: 0, message: '' };
}