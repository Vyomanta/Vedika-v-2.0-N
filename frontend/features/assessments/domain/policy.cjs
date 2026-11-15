const crypto = require('node:crypto');

function fail(message, status = 400) { const error = new Error(message); error.status = status; throw error; }
function tenantOf(auth) { return String(auth.user.tenant_id || 'default'); }
function identityOf(auth) { return String(auth.user.email || auth.user.user_id).toLowerCase(); }
function canGrade(auth) { return Boolean(auth.isAdmin || auth.isSuperAdmin || auth.user.role?.toLowerCase() === 'instructor'); }
function assertGrade(auth) { if (!canGrade(auth)) fail('Only instructors and administrators may grade work.', 403); }
function assertOwner(auth, record) {
  if (String(record.member).toLowerCase() !== identityOf(auth)) fail('This submission belongs to another student.', 403);
}
function id(prefix) { return `${prefix}-${crypto.randomUUID()}`; }

function validateAssessment(kind, input) {
  if (!input || typeof input !== 'object' || Array.isArray(input)) fail('Invalid assessment.');
  if (typeof input.title !== 'string' || !input.title.trim() || input.title.length > 300) fail('Title is required (maximum 300 characters).');
  if (!input.course || typeof input.course !== 'string') fail('A course is required.');
  if (input.course.length > 128 || (input.id && (typeof input.id !== 'string' || input.id.length > 128))) fail('Invalid course or assessment ID.');
  if (input.due_date && !Number.isFinite(Date.parse(input.due_date))) fail('Invalid submission deadline.');
  if (kind === 'quiz') {
    if (!Array.isArray(input.questions) || !input.questions.length || input.questions.length > 100) fail('Provide between 1 and 100 quiz questions.');
    for (const q of input.questions) {
      if (typeof q.question !== 'string' || !q.question.trim() || !Array.isArray(q.options) || q.options.length < 2 || q.options.length > 10 || q.options.some(o => typeof o !== 'string')) fail('Each question requires text and 2–10 options.');
      if (!Number.isInteger(q.correct) || q.correct < 0 || q.correct >= q.options.length) fail('Each question requires a valid answer key.');
    }
    const pass = Number(input.passing_percentage ?? 70);
    if (!Number.isFinite(pass) || pass < 0 || pass > 100) fail('Passing percentage must be between 0 and 100.');
    const attempts = Number(input.max_attempts ?? 3);
    if (!Number.isInteger(attempts) || attempts < 1 || attempts > 100) fail('Maximum attempts must be between 1 and 100.');
  }
  return { ...input, title: input.title.trim(), id: input.id || id(kind) };
}

function publicAssessment(kind, assessment, admin) {
  if (admin) return assessment;
  if (kind === 'quiz') return { ...assessment, questions: (assessment.questions || []).map(({ correct, correct_option, explanation, answer, ...q }) => q) };
  const { answer, sample_answer, sampleAnswer, ...safe } = assessment;
  if (Array.isArray(safe.questions)) safe.questions = safe.questions.map(q => typeof q === 'object' ? Object.fromEntries(Object.entries(q).filter(([key]) => !['answer','sample_answer','sampleAnswer','correct','solution'].includes(key))) : q);
  return safe;
}

function gradeQuiz(quiz, answers) {
  if (!Array.isArray(answers) || answers.length !== quiz.questions.length) fail('Provide an answer entry for every question.');
  if (answers.some((a, i) => a !== null && (!Number.isInteger(a) || a < 0 || a >= quiz.questions[i].options.length))) fail('Invalid answer option.');
  const score = quiz.questions.reduce((sum, q, i) => sum + Number(answers[i] === q.correct), 0);
  const percentage = Math.round(score / quiz.questions.length * 100);
  return { score, score_out_of: quiz.questions.length, percentage, passing_percentage: Number(quiz.passing_percentage ?? 70), passed: percentage >= Number(quiz.passing_percentage ?? 70) };
}

function checkDeadline(assessment) {
  const deadline = assessment.due_date || assessment.deadline;
  if (deadline && Number.isFinite(Date.parse(deadline)) && Date.now() > Date.parse(deadline)) fail('The submission deadline has passed.', 409);
}

module.exports = { fail, tenantOf, identityOf, canGrade, assertGrade, assertOwner, id, validateAssessment, publicAssessment, gradeQuiz, checkDeadline };
