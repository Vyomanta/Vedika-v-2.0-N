'use client';
import * as featureStyleFunctions from '@/features/administration/styles/View.512a2799.styles.js';

import inlineStyles from '@/features/administration/styles/admin-certs-page.jsx.styles.js';


import { useState, useEffect } from 'react';
import { Award, Plus, Trash2, X, Check, Save, ShieldCheck } from 'lucide-react';
import { T } from '@/shared/design-system/theme';
import { useMediaQuery, isMobileMQ } from '@/lib/useMediaQuery';
import { getCertificates, createCertificate, deleteCertificate, getCertificateConfig, saveCertificateConfig } from '@/features/administration/api/collections';
import { getCourses } from '@/features/courses/api/client';

export default function AdminCertsPage() {
  const isMobile = useMediaQuery(isMobileMQ);
  const [activeTab, setActiveTab] = useState('issued'); // 'issued' or 'settings'
  const [certificates, setCertificates] = useState([]);
  const [courses, setCourses] = useState([]);
  const [config, setConfig] = useState({
    signer_name: '',
    signer_title: '',
    require_passing_quiz: true,
    require_assignments_submitted: true,
    theme_color: '#9B6EF8'
  });
  
  // Modal State
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [newCert, setNewCert] = useState({ student_name: '', course_title: '', issue_date: '' });
  const [loading, setLoading] = useState(true);
  const [saveLoading, setSaveLoading] = useState(false);

  const loadData = () => {
    setLoading(true);
    Promise.all([
      getCertificates(),
      getCertificateConfig(),
      getCourses()
    ]).then(([certsData, configData, coursesData]) => {
      setCertificates(certsData);
      setConfig(configData);
      setCourses(coursesData);
      if (coursesData.length > 0) {
        setNewCert(prev => ({ ...prev, course_title: coursesData[0].title }));
      }
      setLoading(false);
    });
  };

  useEffect(() => {
    loadData();
  }, []);

  const handleCreateCertSubmit = async (e) => {
    e.preventDefault();
    if (!newCert.student_name.trim()) return;

    try {
      const hash = 'cert-' + Math.random().toString(36).substr(2, 8).toUpperCase();
      await createCertificate({
        ...newCert,
        cert_hash: hash
      });
      setIsModalOpen(false);
      setNewCert({ student_name: '', course_title: courses[0]?.title || '', issue_date: '' });
      loadData();
    } catch (e) {
      alert("Failed to issue certificate: " + e.message);
    }
  };

  const handleRevokeCert = async (id) => {
    if (confirm('Are you sure you want to revoke/delete this certificate?')) {
      const success = await deleteCertificate(id);
      if (success) {
        loadData();
      }
    }
  };

  const handleSaveConfig = async (e) => {
    e.preventDefault();
    setSaveLoading(true);
    await saveCertificateConfig(config);
    setSaveLoading(false);
    alert('Certificate configuration saved successfully.');
  };

  const containerPadding = isMobile ? '70px 16px 32px 16px' : '40px';

  return (
    <div style={featureStyleFunctions.s0({containerPadding})}>
      {/* Header */}
      <div style={inlineStyles.s0}>
        <div>
          <h1 style={featureStyleFunctions.s1({T,isMobile})}>Certifications</h1>
          <p style={featureStyleFunctions.s2({T})}>Issue curriculum certificates, adjust passing parameters, and customize signatures.</p>
        </div>

        {activeTab === 'issued' && (
          <button
            onClick={() => setIsModalOpen(true)}
            style={featureStyleFunctions.s3({T})}
          >
            <Plus size={16} /> Issue Certificate
          </button>
        )}
      </div>

      {/* Tabs Menu */}
      <div style={featureStyleFunctions.s4({T})}>
        <button
          onClick={() => setActiveTab('issued')}
          style={featureStyleFunctions.s5({activeTab,T})}
        >
          Issued Certificates
        </button>
        <button
          onClick={() => setActiveTab('settings')}
          style={featureStyleFunctions.s6({activeTab,T})}
        >
          Rules & Templates
        </button>
      </div>

      {/* Content Rendering */}
      {loading ? (
        <div style={inlineStyles.s1}>
          <div style={featureStyleFunctions.s7({T})} />
        </div>
      ) : activeTab === 'issued' ? (
        /* ISSUED CERTIFICATES TAB */
        certificates.length === 0 ? (
          <div style={featureStyleFunctions.s8({T})}>
            <Award size={48} color={T.muted} style={inlineStyles.s2} />
            <h3 style={featureStyleFunctions.s9({T})}>No certificates issued</h3>
            <p style={featureStyleFunctions.s10({T})}>
              There are no student certificates issued yet. You can manually issue one using the button above.
            </p>
            <button
              onClick={() => setIsModalOpen(true)}
              style={featureStyleFunctions.s11({T})}
            >
              <Plus size={14} /> Issue Certificate
            </button>
          </div>
        ) : (
          <div style={featureStyleFunctions.s12({T})}>
            <table style={inlineStyles.s3}>
              <thead>
                <tr style={featureStyleFunctions.s13({T})}>
                  <th style={inlineStyles.s4}>Student Name</th>
                  <th style={inlineStyles.s5}>Course</th>
                  <th style={inlineStyles.s6}>Issue Date</th>
                  <th style={inlineStyles.s7}>Certificate ID / Hash</th>
                  <th style={inlineStyles.s8}>Status</th>
                  <th style={inlineStyles.s9}>Actions</th>
                </tr>
              </thead>
              <tbody style={inlineStyles.s10}>
                {certificates.map((cert) => (
                  <tr key={cert.id} style={featureStyleFunctions.s14({T})}>
                    <td style={featureStyleFunctions.s15({T})}>
                      {cert.student_name}
                    </td>
                    <td style={featureStyleFunctions.s16({T})}>
                      {cert.course_title}
                    </td>
                    <td style={featureStyleFunctions.s17({T})}>
                      {cert.issue_date}
                    </td>
                    <td style={featureStyleFunctions.s18({T})}>
                      {cert.cert_hash}
                    </td>
                    <td style={inlineStyles.s11}>
                      <span style={featureStyleFunctions.s19({T})}>
                        {cert.status}
                      </span>
                    </td>
                    <td style={inlineStyles.s12}>
                      <button
                        onClick={() => handleRevokeCert(cert.id)}
                        style={featureStyleFunctions.s20({T})}
                        onMouseEnter={(e) => e.currentTarget.style.color = T.red}
                        onMouseLeave={(e) => e.currentTarget.style.color = T.muted}
                        title="Revoke / Delete Certificate"
                      >
                        <Trash2 size={14} />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )
      ) : (
        /* DESIGN & RULES SETTINGS TAB */
        <form onSubmit={handleSaveConfig} style={featureStyleFunctions.s21({T})}>
          <h3 style={featureStyleFunctions.s22({T})}>
            <ShieldCheck size={18} color={T.purple} /> Certificate Criteria & Design
          </h3>

          {/* Grid fields */}
          <div style={featureStyleFunctions.s23({isMobile})}>
            <div style={inlineStyles.s13}>
              <label style={featureStyleFunctions.s24({T})}>Authority Signatory Name</label>
              <input
                type="text"
                required
                value={config.signer_name}
                onChange={(e) => setConfig({ ...config, signer_name: e.target.value })}
                style={featureStyleFunctions.s25({T})}
              />
            </div>

            <div style={inlineStyles.s14}>
              <label style={featureStyleFunctions.s26({T})}>Authority Signatory Title</label>
              <input
                type="text"
                required
                value={config.signer_title}
                onChange={(e) => setConfig({ ...config, signer_title: e.target.value })}
                style={featureStyleFunctions.s27({T})}
              />
            </div>
          </div>

          <hr style={featureStyleFunctions.s28({T})} />

          {/* Validation Toggles */}
          <div style={inlineStyles.s15}>
            <div style={featureStyleFunctions.s29({T})}>Completion Parameters</div>

            <label style={featureStyleFunctions.s30({T})}>
              <input
                type="checkbox"
                checked={config.require_passing_quiz}
                onChange={(e) => setConfig({ ...config, require_passing_quiz: e.target.checked })}
                style={featureStyleFunctions.s31({T})}
              />
              <span style={featureStyleFunctions.s32({config,T})}>Require passing score on all quizzes before auto-generation</span>
            </label>

            <label style={featureStyleFunctions.s33({T})}>
              <input
                type="checkbox"
                checked={config.require_assignments_submitted}
                onChange={(e) => setConfig({ ...config, require_assignments_submitted: e.target.checked })}
                style={featureStyleFunctions.s34({T})}
              />
              <span style={featureStyleFunctions.s35({config,T})}>Require all course assignments to be graded & complete</span>
            </label>
          </div>

          {/* Action Footer */}
          <div style={featureStyleFunctions.s36({T})}>
            <button
              type="submit"
              disabled={saveLoading}
              style={featureStyleFunctions.s37({T})}
            >
              <Save size={15} /> {saveLoading ? 'Saving...' : 'Save Configuration'}
            </button>
          </div>
        </form>
      )}

      {/* Manual Issue Certificate Modal Dialog */}
      {isModalOpen && (
        <div style={inlineStyles.s16}>
          <div style={featureStyleFunctions.s38({T})}>
            {/* Modal Header */}
            <div style={featureStyleFunctions.s39({T})}>
              <h3 style={featureStyleFunctions.s40({T})}>
                Issue Student Certificate
              </h3>
              <button
                onClick={() => setIsModalOpen(false)}
                style={featureStyleFunctions.s41({T})}
              >
                <X size={18} />
              </button>
            </div>

            {/* Modal Form */}
            <form onSubmit={handleCreateCertSubmit} style={inlineStyles.s17}>
              
              {/* Student Name */}
              <div style={inlineStyles.s18}>
                <label style={featureStyleFunctions.s42({T})}>Student Full Name</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Aarav Mehta"
                  value={newCert.student_name}
                  onChange={(e) => setNewCert({ ...newCert, student_name: e.target.value })}
                  style={featureStyleFunctions.s43({T})}
                />
              </div>

              {/* Course Title Selection */}
              <div style={inlineStyles.s19}>
                <label style={featureStyleFunctions.s44({T})}>Course Completed</label>
                <select
                  value={newCert.course_title}
                  onChange={(e) => setNewCert({ ...newCert, course_title: e.target.value })}
                  style={featureStyleFunctions.s45({T})}
                >
                  {courses.length === 0 ? (
                    <option>No Courses Available</option>
                  ) : (
                    courses.map(c => (
                      <option key={c.id} value={c.title}>{c.title}</option>
                    ))
                  )}
                </select>
              </div>

              {/* Optional Issue Date override */}
              <div style={inlineStyles.s20}>
                <label style={featureStyleFunctions.s46({T})}>Issue Date (Optional)</label>
                <input
                  type="text"
                  placeholder="e.g. Jun 14, 2026 (defaults to today)"
                  value={newCert.issue_date}
                  onChange={(e) => setNewCert({ ...newCert, issue_date: e.target.value })}
                  style={featureStyleFunctions.s47({T})}
                />
              </div>

              {/* Modal Buttons */}
              <div style={featureStyleFunctions.s48({T})}>
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  style={featureStyleFunctions.s49({T})}
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  style={featureStyleFunctions.s50({T})}
                >
                  Issue Certificate
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
