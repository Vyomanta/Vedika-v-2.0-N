const repository = require('./repository.cjs');
const p = require('../domain/policy.cjs');

function createService(repo = repository) {
  async function assessments(auth, kind, filters = {}) {
    const list = await repo.list(repo.query, p.tenantOf(auth), kind);
    const submitted = kind === 'assignment' && !auth.isAdmin ? new Set((await repo.list(repo.query,p.tenantOf(auth),'assignment-submission',{owner:p.identityOf(auth)})).map(record=>record.assignment)) : new Set();
    return list.filter(a => (a.status !== 'Archived' || (auth.isAdmin && filters.includeArchived === '1')) && (!filters.courseId || filters.courseId === 'all' || String(a.course) === filters.courseId) && (!filters.lessonId || filters.lessonId === 'all' || String(a.lesson) === filters.lessonId) && (!filters.chapterId || filters.chapterId === 'all' || String(a.chapter) === filters.chapterId))
      .map(a => p.publicAssessment(kind, a, Boolean(auth.isAdmin || (kind === 'assignment' && a.show_answer && submitted.has(a.id)))));
  }

  async function saveAssessment(auth, kind, input) {
    if (!auth.isAdmin) p.fail('Administrator permission required.', 403);
    const record = p.validateAssessment(kind, input);
    return repo.transaction(async run => {
      const previous = await repo.get(run, p.tenantOf(auth), kind, record.id, true);
      return repo.save(run, p.tenantOf(auth), kind, { ...previous, ...record, created_at: previous?.created_at || new Date().toISOString(), updated_at: new Date().toISOString() });
    });
  }

  async function deleteAssessment(auth, kind, id) {
    if (!auth.isAdmin) p.fail('Administrator permission required.', 403);
    if (!id || typeof id !== 'string') p.fail('An assessment ID is required.');
    return repo.transaction(async run => {
      const previous = await repo.get(run, p.tenantOf(auth), kind, id, true);
      if (!previous) p.fail('Assessment not found.', 404);
      await repo.save(run,p.tenantOf(auth),kind,{...previous,status:'Archived',archived_at:new Date().toISOString()});
      return { status: 'success', deleted: id, archived: true };
    });
  }

  async function submissions(auth, kind, filters = {}) {
    const owner = p.canGrade(auth) ? (filters.member && filters.member !== 'all' ? filters.member.toLowerCase() : undefined) : p.identityOf(auth);
    if (!p.canGrade(auth) && filters.member && filters.member !== 'all' && filters.member.toLowerCase() !== owner) p.fail('Cannot read another student’s work.', 403);
    const records = await repo.list(repo.query, p.tenantOf(auth), `${kind}-submission`, { owner, parent: filters.assignmentId || filters.quizId });
    if (!auth.isAdmin && p.canGrade(auth)) {
      const courses = await repo.teachingCourses(auth);
      return records.filter(record=>record.member===p.identityOf(auth)||courses.includes(String(record.course)));
    }
    return records;
  }

  async function submit(auth, kind, input) {
    if (!input || typeof input !== 'object') p.fail('Invalid submission.');
    const tenant = p.tenantOf(auth), member = p.identityOf(auth), parentId = input[kind];
    if (!parentId || typeof parentId !== 'string') p.fail('Assessment ID is required.');
    if (input.member && String(input.member).toLowerCase() !== member) p.fail('Cannot submit as another student.', 403);
    return repo.transaction(async run => {
      // Serialise attempts/resubmissions on the parent row across all application instances.
      const parent = await repo.get(run, tenant, kind, parentId, true);
      if (!parent) p.fail('Assessment not found.', 404);
      if (parent.status === 'Archived') p.fail('This assessment has been archived.',410);
      p.checkDeadline(parent);
      const prior = await repo.list(run, tenant, `${kind}-submission`, { owner: member, parent: parentId });
      if (input.request_id && (typeof input.request_id !== 'string' || input.request_id.length > 128)) p.fail('Invalid submission request ID.');
      const replay = input.request_id && prior.find(record=>record.request_id===input.request_id);
      if (replay) {
        if (kind === 'quiz' && JSON.stringify(replay.answers)!==JSON.stringify(input.answers)) p.fail('A submitted attempt cannot be changed.',409);
        return replay;
      }
      if (input.id && !prior.some(s => s.id === input.id)) p.fail('Submission does not belong to you.', 403);
      const now = new Date().toISOString();
      const record = { id: p.id('submission'), [kind]: parentId, [`${kind}_title`]: parent.title, course: parent.course, member, member_name: member, timestamp: now, updated_at: now, request_id: input.request_id, assessment_version: parent.updated_at };
      if (kind === 'quiz') {
        if (prior.length >= Number(parent.max_attempts ?? 3)) p.fail('Maximum quiz attempts reached.', 409);
        Object.assign(record, p.gradeQuiz(parent, input.answers), { answers: input.answers, attempt: prior.length + 1 });
      } else {
        if (typeof input.answer !== 'string' || !input.answer.trim() || input.answer.length > 100000) p.fail('An answer is required (maximum 100,000 characters).');
        if ((parent.type || 'Text') === 'Text' && input.answer.trim().length < Number(parent.min_char_count || 0)) p.fail('The answer is shorter than the required minimum.');
        if (prior[0] && prior[0].status !== 'Not Graded') p.fail('Graded work cannot be replaced.', 409);
        Object.assign(record, { id: prior[0]?.id || record.id, answer: input.answer.trim(), question: parent.question, type: parent.type || 'Text', status: 'Not Graded', score: null, comments: '', evaluator: '', ai_evaluation: null });
      }
      return repo.save(run, tenant, `${kind}-submission`, record, { owner: member, parent: parentId });
    });
  }

  async function grade(auth, input) {
    p.assertGrade(auth);
    if (!input?.id || typeof input.id !== 'string') p.fail('Submission ID is required.');
    if (!['Pass', 'Fail', 'Not Graded'].includes(input.status)) p.fail('Invalid grading status.');
    if (input.score != null && (!Number.isFinite(Number(input.score)) || Number(input.score) < 0 || Number(input.score) > 100)) p.fail('Score must be between 0 and 100.');
    return repo.transaction(async run => {
      const record = await repo.get(run, p.tenantOf(auth), 'assignment-submission', input.id, true);
      if (!record) p.fail('Submission not found.', 404);
      if (!auth.isAdmin && !(await repo.teachingCourses(auth,run)).includes(String(record.course))) p.fail('You are not an instructor for this course.',403);
      const updated = { ...record, status: input.status, score: input.score == null ? record.score : Number(input.score), comments: String(input.comments || '').slice(0, 10000), evaluator: p.identityOf(auth), ai_evaluation: input.ai_evaluation ?? record.ai_evaluation, graded_at: new Date().toISOString() };
      return repo.save(run, p.tenantOf(auth), 'assignment-submission', updated, { owner: record.member, parent: record.assignment });
    });
  }

  return { assessments, saveAssessment, deleteAssessment, submissions, submit, grade };
}

module.exports = { createService, ...createService() };
