'use client';
import * as featureStyleFunctions from '@/features/resources/styles/ResourcesDSACompanyWise.21c0f516.styles.js';

import inlineStyles from '@/features/resources/styles/ResourcesDSACompanyWise.styles';


import { useState, useEffect, useMemo } from 'react';
import { motion } from 'framer-motion';
import { ArrowLeft, Building, Search, ExternalLink } from 'lucide-react';
import { T } from '@/shared/design-system/theme';

export default function ResourcesDSACompanyWise({ navigateTo }) {
  const [companies, setCompanies] = useState([]);
  const [selectedCompany, setSelectedCompany] = useState(null);
  const [questions, setQuestions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [questionSearchTerm, setQuestionSearchTerm] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [questionsCurrentPage, setQuestionsCurrentPage] = useState(1);

  const companiesPerPage = 9;
  const questionsPerPage = 10;

  useEffect(() => {
    async function loadCompanyData() {
      try {
        setLoading(true);
        const response = await fetch('/src/DSA-comapny-wise-questions/questions-data.json');
        if (!response.ok) {
          throw new Error(`Failed to load data: ${response.status}`);
        }
        const data = await response.json();
        
        const companyList = data.map(item => ({
          name: item.company,
          questionCount: item["leetcode data"].length,
          data: item["leetcode data"]
        })).sort((a, b) => a.name.localeCompare(b.name));
        
        setCompanies(companyList);
      } catch (error) {
        console.error('Error loading company data:', error);
      } finally {
        setLoading(false);
      }
    }
    loadCompanyData();
  }, []);

  const filteredCompanies = useMemo(() => {
    return companies.filter(company => 
      company.name.toLowerCase().includes(searchTerm.toLowerCase())
    );
  }, [companies, searchTerm]);

  const totalPages = Math.ceil(filteredCompanies.length / companiesPerPage);
  const startIndex = (currentPage - 1) * companiesPerPage;
  const paginatedCompanies = filteredCompanies.slice(startIndex, startIndex + companiesPerPage);

  const filteredQuestions = useMemo(() => {
    if (!questionSearchTerm) return questions;
    const term = questionSearchTerm.toLowerCase();
    return questions.filter(q => 
      q.Title.toLowerCase().includes(term) ||
      q.Difficulty.toLowerCase().includes(term)
    );
  }, [questions, questionSearchTerm]);

  const questionsTotalPages = Math.ceil(filteredQuestions.length / questionsPerPage);
  const questionsStartIndex = (questionsCurrentPage - 1) * questionsPerPage;
  const paginatedQuestions = filteredQuestions.slice(questionsStartIndex, questionsStartIndex + questionsPerPage);

  useEffect(() => {
    setCurrentPage(1);
    setQuestionsCurrentPage(1);
  }, [searchTerm, questionSearchTerm]);

  const handleCompanySelect = (company) => {
    setSelectedCompany(company);
    setQuestions(company.data || []);
    setQuestionSearchTerm('');
    setQuestionsCurrentPage(1);
  };

  const getDifficultyColor = (difficulty) => {
    switch (difficulty) {
      case 'Easy': return '#10B981';
      case 'Medium': return '#F5A95B';
      case 'Hard': return '#EF4444';
      default: return T.muted;
    }
  };

  if (loading) {
    return (
      <div style={inlineStyles.s0}>
        <div style={featureStyleFunctions.s0({T})} />
        <div style={featureStyleFunctions.s1({T})}>Loading company questions...</div>
      </div>
    );
  }

  return (
    <div style={inlineStyles.s1}>
      {/* Back button and title */}
      <div style={inlineStyles.s2}>
        <button
          onClick={() => {
            if (selectedCompany) {
              setSelectedCompany(null);
            } else {
              navigateTo('dsa');
            }
          }}
          style={featureStyleFunctions.s2({T})}
          onMouseEnter={(e) => e.currentTarget.style.color = T.text}
          onMouseLeave={(e) => e.currentTarget.style.color = T.muted}
        >
          <ArrowLeft size={16} /> {selectedCompany ? 'Back to Companies' : 'Back to DSA'}
        </button>

        <div style={inlineStyles.s3}>
          <h1 style={featureStyleFunctions.s3({T})}>
            {selectedCompany ? `${selectedCompany.name} Questions` : 'Company-Wise Questions'}
          </h1>
          <p style={featureStyleFunctions.s4({T})}>
            Practice coding interview questions asked by top tech companies.
          </p>
        </div>
      </div>

      {!selectedCompany ? (
        /* Company Selection view */
        <div>
          {/* Search */}
          <div style={inlineStyles.s4}>
            <Search size={18} color={T.muted} style={inlineStyles.s5} />
            <input
              type="text"
              placeholder="Search companies..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              style={featureStyleFunctions.s5({T})}
            />
          </div>

          {/* Grid of Companies */}
          <div style={inlineStyles.s6}>
            {paginatedCompanies.map((company) => (
              <motion.div
                key={company.name}
                whileHover={{ y: -4 }}
                onClick={() => handleCompanySelect(company)}
                style={featureStyleFunctions.s6({T})}
              >
                <div style={inlineStyles.s7}>
                  <div style={featureStyleFunctions.s7({T})}>
                    <Building size={18} />
                  </div>
                  <div>
                    <h3 style={featureStyleFunctions.s8({T})}>{company.name}</h3>
                    <p style={featureStyleFunctions.s9({T})}>{company.questionCount} questions</p>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>

          {/* Pagination */}
          {totalPages > 1 && (
            <div style={inlineStyles.s8}>
              <button
                disabled={currentPage === 1}
                onClick={() => setCurrentPage(c => c - 1)}
                style={featureStyleFunctions.s10({T,currentPage})}
              >
                Previous
              </button>
              <span style={featureStyleFunctions.s11({T})}>Page {currentPage} of {totalPages}</span>
              <button
                disabled={currentPage === totalPages}
                onClick={() => setCurrentPage(c => c + 1)}
                style={featureStyleFunctions.s12({T,currentPage,totalPages})}
              >
                Next
              </button>
            </div>
          )}
        </div>
      ) : (
        /* Questions View list */
        <div>
          {/* Search within company questions */}
          <div style={inlineStyles.s9}>
            <Search size={18} color={T.muted} style={inlineStyles.s10} />
            <input
              type="text"
              placeholder="Search questions..."
              value={questionSearchTerm}
              onChange={(e) => setQuestionSearchTerm(e.target.value)}
              style={featureStyleFunctions.s13({T})}
            />
          </div>

          <div style={featureStyleFunctions.s14({T})}>
            {filteredQuestions.length === 0 ? (
              <div style={featureStyleFunctions.s15({T})}>No questions found.</div>
            ) : (
              <div style={inlineStyles.s11}>
                {paginatedQuestions.map((q, idx) => (
                  <div
                    key={idx}
                    style={featureStyleFunctions.s16({idx,paginatedQuestions,T})}
                  >
                    <div>
                      <h4 style={featureStyleFunctions.s17({T})}>{q.Title}</h4>
                      <div style={inlineStyles.s12}>
                        <span style={featureStyleFunctions.s18({getDifficultyColor,q})}>
                          {q.Difficulty}
                        </span>
                        <span style={featureStyleFunctions.s19({T})}>|</span>
                        <span style={featureStyleFunctions.s20({T})}>
                          Acceptance: {q["Acceptance %"]}
                        </span>
                        <span style={featureStyleFunctions.s21({T})}>|</span>
                        <span style={featureStyleFunctions.s22({T})}>
                          Freq: {q["Frequency %"]}
                        </span>
                      </div>
                    </div>

                    <a
                      href={q.URL}
                      target="_blank"
                      rel="noopener noreferrer"
                      style={featureStyleFunctions.s23({T})}
                      onMouseEnter={(e) => { e.currentTarget.style.background = T.accent; e.currentTarget.style.color = '#000'; }}
                      onMouseLeave={(e) => { e.currentTarget.style.background = T.s3; e.currentTarget.style.color = T.text; }}
                    >
                      Solve <ExternalLink size={13} />
                    </a>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Pagination */}
          {questionsTotalPages > 1 && (
            <div style={inlineStyles.s13}>
              <button
                disabled={questionsCurrentPage === 1}
                onClick={() => setQuestionsCurrentPage(c => c - 1)}
                style={featureStyleFunctions.s24({T,questionsCurrentPage})}
              >
                Previous
              </button>
              <span style={featureStyleFunctions.s25({T})}>Page {questionsCurrentPage} of {questionsTotalPages}</span>
              <button
                disabled={questionsCurrentPage === questionsTotalPages}
                onClick={() => setQuestionsCurrentPage(c => c + 1)}
                style={featureStyleFunctions.s26({T,questionsCurrentPage,questionsTotalPages})}
              >
                Next
              </button>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
