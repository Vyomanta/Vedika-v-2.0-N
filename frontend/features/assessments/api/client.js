async function request(path, options = {}) {
  const token = typeof window !== 'undefined' ? (localStorage.getItem('token') || localStorage.getItem('jwt')) : null;
  const response = await fetch(path, {
    ...options, credentials: 'same-origin', cache: 'no-store',
    headers: { 'Content-Type': 'application/json', ...(token ? { Authorization: `Bearer ${token}` } : {}), ...options.headers },
  });
  const result = await response.json();
  if (!response.ok) throw new Error(result.error || `Request failed (${response.status}).`);
  return result;
}

function notify(event) { if (typeof window !== 'undefined') window.dispatchEvent(new Event(event)); }
const payload = (value) => ({ method: 'POST', body: JSON.stringify(value) });
export const getQuizzes = () => request('/api/quizzes');
export const getAssignments = (filters = {}) => request(`/api/assignments?${new URLSearchParams(filters)}`);
export const getQuizSubmissions = () => request('/api/quiz-submissions');
export const getAssignmentSubmissions = () => request('/api/assignment-submissions');

async function save(kind, input) {
  const result = await request(`/api/${kind === 'quiz' ? 'quizzes' : 'assignments'}`, payload({ [kind]: input }));
  notify(`${kind === 'quiz' ? 'quizzes' : 'assignments'}_updated`);
  return result[kind];
}
export const createQuiz = input => save('quiz', input);
export const updateQuiz = (id, input) => save('quiz', { ...input, id });
export const createAssignment = input => save('assignment', input);
export const updateAssignment = (id, input) => save('assignment', { ...input, id });
async function remove(kind, id) {
  const result = await request(`/api/${kind}?id=${encodeURIComponent(id)}`, { method: 'DELETE' });
  notify(`${kind}_updated`);
  return result;
}
export const deleteQuiz = id => remove('quizzes', id);
export const deleteAssignment = id => remove('assignments', id);
async function submit(kind, input) {
  const result = await request(`/api/${kind}-submissions`, payload({ submission: input }));
  notify('submissions_updated');
  if (kind === 'assignment') notify('assignment_submissions_updated');
  return result.submission;
}
export const submitQuizResponse = input => submit('quiz', input);
export const submitAssignmentResponse = input => submit('assignment', input);
export async function gradeAssignmentSubmission(id, data) {
  const result = await request('/api/assignment-submissions', { method: 'PUT', body: JSON.stringify({ ...data, id }) });
  notify('submissions_updated');
  notify('assignment_submissions_updated');
  return result.submission;
}
