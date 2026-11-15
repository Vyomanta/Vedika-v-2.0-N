'use client';
import * as featureStyleFunctions from '@/features/cohorts/styles/View.d3ce98b8.styles.js';

import inlineStyles from '@/features/cohorts/styles/admin-batches-page.jsx.styles.js';


import { useState, useEffect } from 'react';
import { Users, Plus, Edit2, Trash2, X, Calendar, MapPin, DollarSign, CheckCircle2 } from 'lucide-react';
import { T } from '@/shared/design-system/theme';
import { useMediaQuery, isMobileMQ } from '@/lib/useMediaQuery';
import { getBatches, createBatch, updateBatch, deleteBatch } from '@/features/administration/api/collections';
import { getCourses } from '@/features/courses/api/client';

export default function AdminBatchesPage() {
  const isMobile = useMediaQuery(isMobileMQ);

  // States
  const [batches, setBatches] = useState([]);
  const [courses, setCourses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [modalMode, setModalMode] = useState('create'); // 'create' or 'edit'
  const [currentBatch, setCurrentBatch] = useState({
    id: '',
    title: '',
    start_date: '',
    end_date: '',
    medium: 'Online',
    seat_count: 50,
    published: true,
    amount: 0,
    currency: 'USD'
  });

  // Load batches and courses
  useEffect(() => {
    async function loadData() {
      try {
        setLoading(true);
        const [batchList, courseList] = await Promise.all([getBatches(), getCourses()]);
        setBatches(batchList);
        setCourses(courseList);
      } catch (e) {
        console.error(e);
      } finally {
        setLoading(false);
      }
    }
    loadData();
  }, []);

  const updateChecklist = (newList) => {
    const savedChecklist = localStorage.getItem('admin_getting_started');
    if (savedChecklist) {
      try {
        const checklist = JSON.parse(savedChecklist);
        if (newList.length > 0 && !checklist.batch) {
          checklist.batch = true;
          localStorage.setItem('admin_getting_started', JSON.stringify(checklist));
          window.dispatchEvent(new Event('admin_checklist_update'));
        }
      } catch (e) {}
    }
  };

  const handleOpenCreateModal = () => {
    setModalMode('create');
    const today = new Date().toISOString().split('T')[0];
    const threeMonthsLater = new Date();
    threeMonthsLater.setMonth(threeMonthsLater.getMonth() + 3);
    const endDateStr = threeMonthsLater.toISOString().split('T')[0];

    setCurrentBatch({
      id: '',
      title: '',
      start_date: today,
      end_date: endDateStr,
      medium: 'Online',
      seat_count: 50,
      published: true,
      amount: 199,
      currency: 'USD'
    });
    setIsModalOpen(true);
  };

  const handleOpenEditModal = (batch, e) => {
    e.stopPropagation();
    setModalMode('edit');
    setCurrentBatch({ ...batch });
    setIsModalOpen(true);
  };

  const handleDeleteBatch = async (id, e) => {
    e.stopPropagation();
    if (confirm('Are you sure you want to delete this batch?')) {
      const success = await deleteBatch(id);
      if (success) {
        const fresh = await getBatches();
        setBatches(fresh);
        updateChecklist(fresh);
      }
    }
  };

  const handleSaveBatchSubmit = async (e) => {
    e.preventDefault();
    if (!currentBatch.title.trim()) return;

    if (modalMode === 'create') {
      await createBatch(currentBatch);
    } else {
      await updateBatch(currentBatch.id, currentBatch);
    }

    const fresh = await getBatches();
    setBatches(fresh);
    updateChecklist(fresh);
    setIsModalOpen(false);
  };

  const containerPadding = isMobile ? '70px 16px 32px 16px' : '40px';
  const gridColumns = isMobile ? '1fr' : 'repeat(auto-fill, minmax(350px, 1fr))';

  return (
    <div style={featureStyleFunctions.s0({containerPadding})}>
      {/* Header */}
      <div style={inlineStyles.s0}>
        <div>
          <h1 style={featureStyleFunctions.s1({T,isMobile})}>
            Batches & Cohorts
          </h1>
          <p style={featureStyleFunctions.s2({T})}>
            Manage cohort groups, scheduled courses, medium of delivery, and enrollment seats.
          </p>
        </div>

        <button
          onClick={handleOpenCreateModal}
          style={featureStyleFunctions.s3({T})}
        >
          <Plus size={16} /> Create Batch
        </button>
      </div>

      {loading ? (
        <div style={inlineStyles.s1}>
          <div style={featureStyleFunctions.s4({T})} />
        </div>
      ) : batches.length === 0 ? (
        <div style={featureStyleFunctions.s5({T})}>
          <Users size={48} color={T.muted} style={inlineStyles.s2} />
          <h3 style={featureStyleFunctions.s6({T})}>No Batches Scheduled</h3>
          <p style={featureStyleFunctions.s7({T})}>
            Organize learners into batch cohorts for group discussions, timelines, and virtual sessions.
          </p>
          <button
            onClick={handleOpenCreateModal}
            style={featureStyleFunctions.s8({T})}
          >
            <Plus size={14} /> Schedule First Batch
          </button>
        </div>
      ) : (
        <div style={featureStyleFunctions.s9({gridColumns})}>
          {batches.map((batch) => (
            <div
              key={batch.id}
              style={featureStyleFunctions.s10({T})}
            >
              <div>
                {/* Title and Actions */}
                <div style={inlineStyles.s3}>
                  <h3 style={featureStyleFunctions.s11({T})}>
                    {batch.title}
                  </h3>
                  
                  <div style={inlineStyles.s4}>
                    <button
                      onClick={(e) => handleOpenEditModal(batch, e)}
                      style={featureStyleFunctions.s12({T})}
                      onMouseEnter={(e) => e.currentTarget.style.color = T.purple}
                      onMouseLeave={(e) => e.currentTarget.style.color = T.muted}
                      title="Edit Batch"
                    >
                      <Edit2 size={13} />
                    </button>
                    <button
                      onClick={(e) => handleDeleteBatch(batch.id, e)}
                      style={featureStyleFunctions.s13({T})}
                      onMouseEnter={(e) => e.currentTarget.style.color = T.red}
                      onMouseLeave={(e) => e.currentTarget.style.color = T.muted}
                      title="Delete Batch"
                    >
                      <Trash2 size={13} />
                    </button>
                  </div>
                </div>

                <div style={inlineStyles.s5}>
                  <span style={featureStyleFunctions.s14({batch,T})}>
                    {batch.medium.toUpperCase()}
                  </span>
                  
                  {!batch.published && (
                    <span style={featureStyleFunctions.s15({T})}>
                      DRAFT
                    </span>
                  )}
                </div>

                {/* Details info */}
                <div style={inlineStyles.s6}>
                  <div style={featureStyleFunctions.s16({T})}>
                    <Calendar size={13} color={T.muted} />
                    <span>{batch.start_date} to {batch.end_date}</span>
                  </div>
                  
                  <div style={featureStyleFunctions.s17({T})}>
                    <Users size={13} color={T.muted} />
                    <span>{batch.seat_count} seats capacity</span>
                  </div>

                  <div style={featureStyleFunctions.s18({T})}>
                    <DollarSign size={13} color={T.muted} />
                    <span>{batch.amount > 0 ? `${batch.amount} ${batch.currency}` : 'Free Batch'}</span>
                  </div>
                </div>
              </div>

              {/* Footer status check */}
              <div style={featureStyleFunctions.s19({T})}>
                <CheckCircle2 size={12} color={batch.published ? T.green : T.muted} />
                <span>{batch.published ? 'Visible to guest/students' : 'Hidden draft cohort'}</span>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Interactive Modal Form */}
      {isModalOpen && (
        <div style={inlineStyles.s7}>
          <div style={featureStyleFunctions.s20({T})}>
            {/* Modal Header */}
            <div style={featureStyleFunctions.s21({T})}>
              <h3 style={featureStyleFunctions.s22({T})}>
                {modalMode === 'create' ? 'Create New Cohort Batch' : 'Edit Cohort Batch'}
              </h3>
              <button
                onClick={() => setIsModalOpen(false)}
                style={featureStyleFunctions.s23({T})}
              >
                <X size={18} />
              </button>
            </div>

            {/* Modal Form Content */}
            <form onSubmit={handleSaveBatchSubmit} style={inlineStyles.s8}>
              {/* Batch Title */}
              <div style={inlineStyles.s9}>
                <label style={featureStyleFunctions.s24({T})}>Batch / Cohort Title</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Python Cohort - Summer 2026"
                  value={currentBatch.title}
                  onChange={(e) => setCurrentBatch({ ...currentBatch, title: e.target.value })}
                  style={featureStyleFunctions.s25({T})}
                />
              </div>

              {/* Start & End Dates */}
              <div style={inlineStyles.s10}>
                <div style={inlineStyles.s11}>
                  <label style={featureStyleFunctions.s26({T})}>Start Date</label>
                  <input
                    type="date"
                    required
                    value={currentBatch.start_date}
                    onChange={(e) => setCurrentBatch({ ...currentBatch, start_date: e.target.value })}
                    style={featureStyleFunctions.s27({T})}
                  />
                </div>

                <div style={inlineStyles.s12}>
                  <label style={featureStyleFunctions.s28({T})}>End Date</label>
                  <input
                    type="date"
                    required
                    value={currentBatch.end_date}
                    onChange={(e) => setCurrentBatch({ ...currentBatch, end_date: e.target.value })}
                    style={featureStyleFunctions.s29({T})}
                  />
                </div>
              </div>

              {/* Medium & Seat Count */}
              <div style={inlineStyles.s13}>
                <div style={inlineStyles.s14}>
                  <label style={featureStyleFunctions.s30({T})}>Medium</label>
                  <select
                    value={currentBatch.medium}
                    onChange={(e) => setCurrentBatch({ ...currentBatch, medium: e.target.value })}
                    style={featureStyleFunctions.s31({T})}
                  >
                    <option value="Online">Online</option>
                    <option value="Offline">Offline</option>
                  </select>
                </div>

                <div style={inlineStyles.s15}>
                  <label style={featureStyleFunctions.s32({T})}>Seat Capacity</label>
                  <input
                    type="number"
                    min="1"
                    required
                    value={currentBatch.seat_count}
                    onChange={(e) => setCurrentBatch({ ...currentBatch, seat_count: parseInt(e.target.value) || 0 })}
                    style={featureStyleFunctions.s33({T})}
                  />
                </div>
              </div>

              {/* Pricing Section */}
              <div style={inlineStyles.s16}>
                <div style={inlineStyles.s17}>
                  <label style={featureStyleFunctions.s34({T})}>Price (Amount)</label>
                  <input
                    type="number"
                    min="0"
                    required
                    value={currentBatch.amount}
                    onChange={(e) => setCurrentBatch({ ...currentBatch, amount: parseFloat(e.target.value) || 0 })}
                    style={featureStyleFunctions.s35({T})}
                  />
                </div>

                <div style={inlineStyles.s18}>
                  <label style={featureStyleFunctions.s36({T})}>Currency</label>
                  <input
                    type="text"
                    required
                    placeholder="USD"
                    value={currentBatch.currency}
                    onChange={(e) => setCurrentBatch({ ...currentBatch, currency: e.target.value })}
                    style={featureStyleFunctions.s37({T})}
                  />
                </div>
              </div>

              {/* Publish Toggle Checkbox */}
              <div style={inlineStyles.s19}>
                <input
                  type="checkbox"
                  id="published"
                  checked={currentBatch.published}
                  onChange={(e) => setCurrentBatch({ ...currentBatch, published: e.target.checked })}
                  style={featureStyleFunctions.s38({T})}
                />
                <label htmlFor="published" style={featureStyleFunctions.s39({T})}>
                  Publish Batch (visible to students)
                </label>
              </div>

              {/* Action buttons */}
              <div style={featureStyleFunctions.s40({T})}>
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  style={featureStyleFunctions.s41({T})}
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  style={featureStyleFunctions.s42({T})}
                >
                  {modalMode === 'create' ? 'Create Batch' : 'Save Changes'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
