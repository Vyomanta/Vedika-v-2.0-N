'use client';

import inlineStyles from '@/features/administration/styles/admin-jobs-page.jsx.styles.js';
import { useState, useEffect } from 'react';
import { Briefcase, Plus, Edit2, Trash2, X, MapPin, Clock, Calendar, Globe, AlertCircle } from 'lucide-react';
import { T } from '@/shared/design-system/theme';
import { useMediaQuery, isMobileMQ } from '@/lib/useMediaQuery';
import { getJobs, createJob, updateJob, deleteJob } from '@/features/administration/api/collections';

export function useAdminJobsPageModel() {

  const isMobile = useMediaQuery(isMobileMQ);

  // States
  const [jobs, setJobs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [modalMode, setModalMode] = useState('create'); // 'create' or 'edit'
  const [submitError, setSubmitError] = useState('');
  const [currentJob, setCurrentJob] = useState({
    id: '',
    title: '',
    company: '',
    location: '',
    type: 'Full Time',
    work_mode: 'Remote',
    status: 'Open',
    company_website: '',
    description: ''
  });

  // Load jobs from Frappe API
  useEffect(() => {
    async function loadJobs() {
      try {
        setLoading(true);
        const list = await getJobs();
        setJobs(list);
      } catch (e) {
        console.error(e);
      } finally {
        setLoading(false);
      }
    }
    loadJobs();
  }, []);

  const handleOpenCreateModal = () => {
    setModalMode('create');
    setSubmitError('');
    setCurrentJob({
      id: '',
      title: '',
      company: '',
      location: '',
      type: 'Full Time',
      work_mode: 'Remote',
      status: 'Open',
      company_website: '',
      description: ''
    });
    setIsModalOpen(true);
  };

  const handleOpenEditModal = (job, e) => {
    e.stopPropagation();
    setModalMode('edit');
    setSubmitError('');
    setCurrentJob({ ...job });
    setIsModalOpen(true);
  };

  const handleDeleteJob = async (id, e) => {
    e.stopPropagation();
    if (confirm('Are you sure you want to delete this job opportunity?')) {
      const success = await deleteJob(id);
      if (success) {
        const fresh = await getJobs();
        setJobs(fresh);
      }
    }
  };

  const handleSaveJobSubmit = async (e) => {
    e.preventDefault();
    if (!currentJob.title.trim() || !currentJob.company.trim()) return;
    setSubmitError('');

    try {
      if (modalMode === 'create') {
        await createJob(currentJob);
      } else {
        await updateJob(currentJob.id, currentJob);
      }

      const fresh = await getJobs();
      setJobs(fresh);
      setIsModalOpen(false);
    } catch (err) {
      console.error(err);
      setSubmitError(err.message || 'Failed to save job opportunity.');
    }
  };

  const containerPadding = isMobile ? '70px 16px 32px 16px' : '40px';
  const gridColumns = isMobile ? '1fr' : 'repeat(auto-fill, minmax(340px, 1fr))';

  
return {isMobile,jobs,setJobs,loading,setLoading,isModalOpen,setIsModalOpen,modalMode,setModalMode,submitError,setSubmitError,currentJob,setCurrentJob,handleOpenCreateModal,handleOpenEditModal,handleDeleteJob,handleSaveJobSubmit,containerPadding,gridColumns};
}
