import { assessmentHandlers } from '@/features/assessments/server/http';
export const dynamic = 'force-dynamic';
export const { GET, POST, DELETE } = assessmentHandlers('quiz');
