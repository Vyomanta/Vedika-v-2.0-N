import { submissionHandlers } from '@/features/assessments/server/http';
export const dynamic = 'force-dynamic';
export const { GET, POST, PUT } = submissionHandlers('quiz');
