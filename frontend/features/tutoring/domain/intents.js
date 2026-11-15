import syllabusesData from '@/data/syllabuses.json';


export function classifyIntent(input) {
  const clean = input.trim();
  if (/^(thanks|thank you|ty|thx)\b/i.test(clean) || /\b(thanks|thank you)\s*$/i.test(clean)) {
    return { type: 'thanks' };
  }
  if (/^(hi|hello|hey|good morning|good afternoon|good evening|sup|yo)\b/i.test(clean) ||
      /^(hi|hello|hey)$/i.test(clean)) {
    return { type: 'greeting' };
  }
  if (isMathExpression(clean)) {
    return { type: 'math', expression: clean };
  }

  const feature = detectFeatureRequest(clean);
  if (feature) return { type: 'feature', ...feature };

  return { type: 'topic' };
}

export function detectFeatureRequest(input) {
  const c = input.trim();
  let m;

  m = c.match(/^(?:give\s+(?:me\s+)?|create\s+|make\s+)?(?:a\s+|an\s+)?(\d+\s+)?quiz(?:zes)?\s*(?:questions?)?\s+(?:about|on|for|of)\s+(.+)/i);
  if (m) return { feature: 'quiz', topic: m[2].trim(), count: m[1] ? parseInt(m[1]) : 4 };

  m = c.match(/^(?:give\s+(?:me\s+)?|create\s+|make\s+)?(?:a\s+|an\s+)?(\d+\s+)?flashcards?\s+(?:about|on|for|of)\s+(.+)/i);
  if (m) return { feature: 'flashcards', topic: m[2].trim(), count: m[1] ? parseInt(m[1]) : 5 };
  m = c.match(/^(?:give\s+(?:me\s+)?|create\s+|make\s+)?(?:a\s+|an\s+)?(\d+\s+)?(?:digital\s+)?cards?\s+(?:about|on|for|of)\s+(.+)/i);
  if (m) return { feature: 'flashcards', topic: m[2].trim(), count: m[1] ? parseInt(m[1]) : 5 };

  m = c.match(/^(?:give\s+(?:me\s+)?|create\s+|make\s+)?(?:a\s+|an\s+)?(\d+\s+)?(?:infographic|visual\s*(?:summary|aid)|summary)\s+(?:about|on|for|of)\s+(.+)/i);
  if (m) return { feature: 'infographic', topic: m[2].trim() };

  m = c.match(/^(?:give\s+(?:me\s+)?|show\s+(?:me\s+)?|provide\s+)?(?:some\s+|a\s+few\s+|several\s+)?examples?\s+(?:of|for|on)\s+(.+)/i);
  if (m) return { feature: 'examples', topic: m[1].trim() };

  m = c.match(/^(?:explain|tell)\s+(?:me\s+)?(?:in\s+)?(?:simpler|simple|easier|basic)\s+(?:terms|way|language|words)\s+(.+)/i);
  if (m) return { feature: 'simpler', topic: m[1].trim() };

  m = c.match(/^(?:give\s+(?:me\s+)?|provide\s+)?(?:a\s+|an\s+)?simpler?\s+(?:explanation|way)\s+(?:of|for)\s+(.+)/i);
  if (m) return { feature: 'simpler', topic: m[1].trim() };

  m = c.match(/^(quiz|flashcards?|infographic)\s+(?:about|on|for|of)\s+(.+)/i);
  if (m) {
    const f = m[1].toLowerCase().replace(/s$/, '');
    return { feature: f === 'flashcard' ? 'flashcards' : f, topic: m[2].trim() };
  }

  return null;
}

export function isMathExpression(input) {
  const clean = input.trim().toLowerCase();
  if (!/\d/.test(clean)) return false;
  const stripped = clean.replace(/\b(sqrt|sin|cos|tan|log|abs|round|floor|ceil|pow|pi|e)\b/g, '');
  return /^[\s\d+\-*/().,%^]+$/.test(stripped);
}

export function evaluateMath(input) {
  const clean = input.trim().toLowerCase();
  let evalStr = clean
    .replace(/\bpi\b/g, `(${Math.PI})`)
    .replace(/\be\b/g, `(${Math.E})`)
    .replace(/\bsqrt\(/g, 'Math.sqrt(')
    .replace(/\bsin\(/g, 'Math.sin(')
    .replace(/\bcos\(/g, 'Math.cos(')
    .replace(/\btan\(/g, 'Math.tan(')
    .replace(/\blog\(/g, 'Math.log(')
    .replace(/\babs\(/g, 'Math.abs(')
    .replace(/\bround\(/g, 'Math.round(')
    .replace(/\bfloor\(/g, 'Math.floor(')
    .replace(/\bceil\(/g, 'Math.ceil(')
    .replace(/\bpow\(/g, 'Math.pow(')
    .replace(/\^/g, '**');
  try {
    const result = Function(`"use strict"; return (${evalStr})`)();
    return Number.isFinite(result) ? result : 'Error: result is not finite';
  } catch (e) {
    return `Error: ${e.message}`;
  }
}

export function getGreetingResponse() {
  const r = [
    "Hi there! What topic would you like to learn about today?",
    "Hello! I'm ready to help you learn. What shall we explore?",
    "Hey! Drop me a topic and I'll explain it at your preferred level.",
  ];
  return r[Math.floor(Math.random() * r.length)];
}

export function getThanksResponse() {
  const r = [
    "You're welcome! Let me know if you have more questions.",
    "Happy to help! Feel free to ask about anything else.",
    "Glad I could help! What would you like to learn next?",
  ];
  return r[Math.floor(Math.random() * r.length)];
}

export function detectPromptInjection(input) {
  const clean = input.toLowerCase();
  const injectionPatterns = [
    "ignore previous instructions",
    "ignore all instructions",
    "ignore instructions",
    "forget previous",
    "forget all instructions",
    "system prompt",
    "system instruction",
    "override system",
    "developer mode",
    "dan mode",
    "jailbreak",
    "you are now a",
    "you are now an",
    "forget the instructions",
    "bypass instructions",
    "bypass restrictions"
  ];
  return injectionPatterns.some(pattern => clean.includes(pattern));
}
