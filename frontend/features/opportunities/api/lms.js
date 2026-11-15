
import { FRAPPE_URL, frappeRestGet, frappeRestPost, frappeRestPut, frappeRestDelete, DEFAULT_COURSES } from '@/integrations/frappe/transport';
import { DEFAULT_JOBS, DEFAULT_QUIZZES, DEFAULT_ASSIGNMENTS } from '@/features/assessments/domain/legacy-formats';
import { DEFAULT_BATCHES } from '@/features/auth/api/lms';

export async function getJobs() {
  if (FRAPPE_URL) {
    try {
      const jobs = await frappeRestGet("Job Opportunity", {
        fields: JSON.stringify(["name", "job_title", "location", "type", "work_mode", "status", "company_name", "company_website", "description", "creation"]),
        limit_page_length: 100
      });
      return jobs.map(j => ({
        id: j.name,
        title: j.job_title,
        location: j.location,
        type: j.type || 'Full Time',
        work_mode: j.work_mode || 'Remote',
        status: j.status || 'Open',
        company: j.company_name,
        company_website: j.company_website || '',
        description: j.description || '',
        date: new Date(j.creation).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })
      }));
    } catch (e) {
      console.error("Failed to fetch jobs. Falling back.", e);
    }
  }

  if (typeof window !== 'undefined') {
    const saved = localStorage.getItem('admin_jobs_list');
    if (saved) {
      try { return JSON.parse(saved); } catch (e) {}
    }
    localStorage.setItem('admin_jobs_list', JSON.stringify(DEFAULT_JOBS));
    return DEFAULT_JOBS;
  }
  return DEFAULT_JOBS;
}

export async function createJob(jobData) {
  if (FRAPPE_URL) {
    try {
      const result = await frappeRestPost("Job Opportunity", {
        job_title: jobData.title,
        location: jobData.location,
        type: jobData.type || 'Full Time',
        work_mode: jobData.work_mode || 'Remote',
        status: jobData.status || 'Open',
        company_name: jobData.company,
        company_website: jobData.company_website,
        description: jobData.description || '',
        company_logo: '/placeholder-logo.png',
        company_email_address: 'careers@company.com'
      });
      return { ...jobData, id: result.name };
    } catch (e) {
      console.error("Failed to create job. Falling back.", e);
      throw e;
    }
  }

  if (typeof window !== 'undefined') {
    const saved = localStorage.getItem('admin_jobs_list') || JSON.stringify(DEFAULT_JOBS);
    const list = JSON.parse(saved);
    const newJob = { ...jobData, id: Date.now().toString(), date: 'Posted just now' };
    list.unshift(newJob);
    localStorage.setItem('admin_jobs_list', JSON.stringify(list));
    return newJob;
  }
  return jobData;
}

export async function updateJob(id, jobData) {
  if (FRAPPE_URL) {
    try {
      await frappeRestPut("Job Opportunity", id, {
        job_title: jobData.title,
        location: jobData.location,
        type: jobData.type,
        work_mode: jobData.work_mode,
        status: jobData.status,
        company_name: jobData.company,
        company_website: jobData.company_website,
        description: jobData.description,
        company_logo: '/placeholder-logo.png',
        company_email_address: 'careers@company.com'
      });
      return jobData;
    } catch (e) {
      console.error("Failed to update job. Falling back.", e);
      throw e;
    }
  }

  if (typeof window !== 'undefined') {
    const saved = localStorage.getItem('admin_jobs_list') || JSON.stringify(DEFAULT_JOBS);
    const list = JSON.parse(saved);
    const updated = list.map(j => j.id === id ? { ...j, ...jobData } : j);
    localStorage.setItem('admin_jobs_list', JSON.stringify(updated));
    return jobData;
  }
  return jobData;
}

export async function deleteJob(id) {
  if (FRAPPE_URL) {
    try {
      await frappeRestDelete("Job Opportunity", id);
      return true;
    } catch (e) {
      console.error("Failed to delete job.", e);
    }
  }

  if (typeof window !== 'undefined') {
    const saved = localStorage.getItem('admin_jobs_list') || JSON.stringify(DEFAULT_JOBS);
    const list = JSON.parse(saved);
    const filtered = list.filter(j => j.id !== id);
    localStorage.setItem('admin_jobs_list', JSON.stringify(filtered));
    return true;
  }
  return false;
}

export async function searchLMS(query) {
  const q = query.trim().toLowerCase();
  if (!q) return { courses: [], batches: [], quizzes: [], assignments: [], jobs: [] };
  const [{getCourses},{getQuizzes,getAssignments},{getBatches,getJobs}]=await Promise.all([
    import('@/features/courses/api/client'),import('@/features/assessments/api/client'),import('@/features/administration/api/collections')
  ]);
  const values=await Promise.all([getCourses(),getBatches(),getQuizzes(),getAssignments(),getJobs()]);
  return Object.fromEntries(['courses','batches','quizzes','assignments','jobs'].map((kind,i)=>[kind,values[i].filter(row=>[row.title,row.category,row.company].some(value=>String(value||'').toLowerCase().includes(q))).slice(0,20)]));
}

export const DEFAULT_NOTIFICATIONS = [
  { id: '1', title: 'New Student Enrollment', message: 'Aarav Mehta has enrolled in "Python Fundamentals".', category: 'Enrollment', read: false, date: '10 mins ago' },
  { id: '2', title: 'Assignment Submission', message: 'Sneha Patel submitted "Implementing Fibonacci Sequence Generator".', category: 'Assignment', read: false, date: '1 hour ago' },
  { id: '3', title: 'Quiz Completed', message: 'Rohan Sharma scored 90% in "Python Syntax & Variables Quiz".', category: 'Quiz', read: true, date: 'Yesterday' },
  { id: '4', title: 'System Alert', message: 'Database backup completed successfully.', category: 'System', read: true, date: '2 days ago' }
];
