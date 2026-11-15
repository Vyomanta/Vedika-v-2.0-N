'use client';
import * as featureStyleFunctions from '@/features/resources/styles/ResourcesLibrary.d61f18eb.styles.js';

import inlineStyles from '@/features/resources/styles/ResourcesLibrary.styles';


import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Search, ChevronLeft, ChevronRight, Grid, List, BookOpen, Eye, Download, ArrowLeft } from 'lucide-react';
import { T } from '@/shared/design-system/theme';
import PDFViewerModal from '@/components/PDFViewerModal';

export default function ResourcesLibrary({ navigateTo }) {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [selectedSubcategory, setSelectedSubcategory] = useState('all');
  const [sortBy, setSortBy] = useState('newest');
  const [viewMode, setViewMode] = useState('grid');
  const [currentPage, setCurrentPage] = useState(1);
  const [isLoading, setIsLoading] = useState(true);
  const [resources, setResources] = useState([]);
  const [errorMsg, setErrorMsg] = useState(null);
  
  // Categories structure from database
  const [categories, setCategories] = useState([]);
  const [subcategories, setSubcategories] = useState([]);
  
  // Selected PDF preview state
  const [selectedPDF, setSelectedPDF] = useState(null);
  const [isViewerOpen, setIsViewerOpen] = useState(false);

  const itemsPerPage = 12;

  // 1. Fetch categories
  useEffect(() => {
    async function loadCategories() {
      try {
        const res = await fetch('/api/resources/categories');
        const data = await res.json();
        
        if (Array.isArray(data)) {
          // Extract unique lists
          const cats = ['all', ...new Set(data.map(item => item.category))];
          const subs = ['all', ...new Set(data.map(item => item.subcategory))];
          
          setCategories(cats);
          setSubcategories(subs);
        } else {
          setErrorMsg(data?.error || 'Database connection error');
        }
      } catch (e) {
        console.error('Error fetching categories:', e);
        setErrorMsg(e.message || 'Error loading categories.');
      }
    }
    loadCategories();
  }, []);

  // 2. Fetch resources list with filters
  useEffect(() => {
    async function loadResources() {
      setIsLoading(true);
      setErrorMsg(null);
      try {
        const queryParams = new URLSearchParams({
          search: searchTerm,
          category: selectedCategory,
          subcategory: selectedSubcategory,
          sortBy: sortBy
        });
        const res = await fetch(`/api/resources/list?${queryParams.toString()}`);
        const data = await res.json();
        
        if (Array.isArray(data)) {
          setResources(data);
        } else {
          setResources([]);
          setErrorMsg(data?.error || 'Database connection error');
        }
        setCurrentPage(1); // Reset to page 1 on query changes
      } catch (e) {
        console.error('Error loading resources:', e);
        setErrorMsg(e.message || 'Error loading resources.');
        setResources([]);
      } finally {
        setIsLoading(false);
      }
    }
    
    const delayDebounce = setTimeout(() => {
      loadResources();
    }, 300); // Debounce search changes

    return () => clearTimeout(delayDebounce);
  }, [searchTerm, selectedCategory, selectedSubcategory, sortBy]);

  // Pagination safely
  const resourcesList = Array.isArray(resources) ? resources : [];
  const totalPages = Math.ceil(resourcesList.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const currentPdfs = resourcesList.slice(startIndex, startIndex + itemsPerPage);

  const handlePageChange = (page) => {
    setCurrentPage(page);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const openViewer = (pdf) => {
    setSelectedPDF(pdf);
    setIsViewerOpen(true);
  };

  const getDirectDownloadLink = (viewLink) => {
    if (!viewLink) return '';
    const fileIdMatch = viewLink.match(/\/d\/([a-zA-Z0-9-_]+)/);
    if (fileIdMatch) {
      const fileId = fileIdMatch[1];
      return `https://drive.google.com/uc?export=download&id=${fileId}`;
    }
    return viewLink;
  };

  return (
    <div style={inlineStyles.s0}>
      {/* Back button and title */}
      <div style={inlineStyles.s1}>
        <button
          onClick={() => navigateTo('home')}
          style={featureStyleFunctions.s0({T})}
          onMouseEnter={(e) => e.currentTarget.style.color = T.text}
          onMouseLeave={(e) => e.currentTarget.style.color = T.muted}
        >
          <ArrowLeft size={16} /> Back to Hub
        </button>

        <div style={inlineStyles.s2}>
          <h1 style={featureStyleFunctions.s1({T})}>
            PDF Library
          </h1>
          <p style={featureStyleFunctions.s2({T})}>
            Explore our vast collection of educational resources and find the perfect PDF for your learning journey.
          </p>
        </div>
      </div>

      {/* Filters & Search controls */}
      <div style={inlineStyles.s3}>
        {/* Search */}
        <div style={inlineStyles.s4}>
          <Search size={18} color={T.muted} style={inlineStyles.s5} />
          <input
            type="text"
            placeholder="Search PDFs by title..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            style={featureStyleFunctions.s3({T})}
            onFocus={(e) => e.target.style.borderColor = T.accent}
            onBlur={(e) => e.target.style.borderColor = T.border}
          />
        </div>

        {/* Dropdowns */}
        <div style={inlineStyles.s6}>
          {/* Category */}
          <select
            value={selectedCategory}
            onChange={(e) => { setSelectedCategory(e.target.value); setSelectedSubcategory('all'); }}
            style={featureStyleFunctions.s4({T})}
          >
            <option value="all">All Categories</option>
            {categories.filter(c => c !== 'all').map(cat => (
              <option key={cat} value={cat}>{cat}</option>
            ))}
          </select>

          {/* Subcategory */}
          <select
            value={selectedSubcategory}
            onChange={(e) => setSelectedSubcategory(e.target.value)}
            style={featureStyleFunctions.s5({T})}
          >
            <option value="all">All Subcategories</option>
            {subcategories.filter(s => s !== 'all').map(sub => (
              <option key={sub} value={sub}>{sub}</option>
            ))}
          </select>

          {/* Sorting */}
          <select
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value)}
            style={featureStyleFunctions.s6({T})}
          >
            <option value="newest">Newest First</option>
            <option value="title">Alphabetical</option>
          </select>

          {/* View mode toggle */}
          <div style={featureStyleFunctions.s7({T})}>
            <button
              onClick={() => setViewMode('grid')}
              style={featureStyleFunctions.s8({viewMode,T})}
            >
              <Grid size={16} />
            </button>
            <button
              onClick={() => setViewMode('list')}
              style={featureStyleFunctions.s9({viewMode,T})}
            >
              <List size={16} />
            </button>
          </div>
        </div>

        {/* Results Counter */}
        <div style={featureStyleFunctions.s10({T})}>
          Showing {currentPdfs.length} of {resourcesList.length} results
        </div>
      </div>

      {/* Grid or List list */}
      {isLoading ? (
        <div style={inlineStyles.s7}>
          <div style={featureStyleFunctions.s11({T})} />
          <div style={featureStyleFunctions.s12({T})}>Loading PDF collection...</div>
        </div>
      ) : errorMsg ? (
        <div style={featureStyleFunctions.s13({T})}>
          <BookOpen size={48} color="#EF4444" style={inlineStyles.s8} />
          <h3 style={featureStyleFunctions.s14({T})}>Database Connection Issue</h3>
          <p style={featureStyleFunctions.s15({T})}>
            {errorMsg}
          </p>
          <div style={featureStyleFunctions.s16({T})}>
            <strong>How to resolve:</strong> Make sure the Oregon TiDB Serverless environment variables are correctly configured on your Vercel deployment (e.g. <code>DB_HOST</code>, <code>DB_USER</code>, <code>DB_PASSWORD</code>, and <code>DB_RESOURCES_NAME="pdf_resources_db"</code>).
          </div>
        </div>
      ) : resourcesList.length === 0 ? (
        <div style={featureStyleFunctions.s17({T})}>
          <BookOpen size={48} color={T.muted} style={inlineStyles.s9} />
          <h3 style={featureStyleFunctions.s18({T})}>No PDFs Found</h3>
          <p style={featureStyleFunctions.s19({T})}>Try adjusting your search terms or filters.</p>
        </div>
      ) : viewMode === 'grid' ? (
        /* Grid Mode */
        <div style={inlineStyles.s10}>
          {currentPdfs.map((pdf) => (
            <motion.div
              key={pdf.id}
              whileHover={{ y: -4 }}
              style={featureStyleFunctions.s20({T})}
            >
              {/* Thumbnail */}
              <div 
                onClick={() => openViewer(pdf)}
                style={featureStyleFunctions.s21({T})}
              >
                {pdf.thumbnail ? (
                  <img 
                    src={pdf.thumbnail} 
                    alt={pdf.name} 
                    style={inlineStyles.s11} 
                    onError={(e) => { e.currentTarget.style.display = 'none'; }}
                  />
                ) : (
                  <BookOpen size={40} color={T.muted} />
                )}
                <div style={featureStyleFunctions.s22({T})}>
                  {pdf.category}
                </div>
              </div>

              {/* Info & Actions */}
              <div style={inlineStyles.s12}>
                <div>
                  <h3 
                    onClick={() => openViewer(pdf)}
                    style={featureStyleFunctions.s23({T})}
                    onMouseEnter={(e) => e.currentTarget.style.color = T.accent}
                    onMouseLeave={(e) => e.currentTarget.style.color = T.text}
                  >
                    {pdf.name}
                  </h3>
                  <div style={featureStyleFunctions.s24({T})}>
                    {pdf.subcategory}
                  </div>
                </div>

                <div style={inlineStyles.s13}>
                  <button
                    onClick={() => openViewer(pdf)}
                    style={featureStyleFunctions.s25({T})}
                  >
                    <Eye size={14} /> View
                  </button>
                  <button
                    onClick={() => window.open(getDirectDownloadLink(pdf.file_link), '_blank')}
                    style={featureStyleFunctions.s26({T})}
                    title="Download"
                  >
                    <Download size={14} />
                  </button>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      ) : (
        /* List Mode */
        <div style={inlineStyles.s14}>
          {currentPdfs.map((pdf) => (
            <motion.div
              key={pdf.id}
              whileHover={{ x: 4 }}
              style={featureStyleFunctions.s27({T})}
            >
              {/* Thumbnail */}
              <div 
                onClick={() => openViewer(pdf)}
                style={inlineStyles.s15}
              >
                {pdf.thumbnail ? (
                  <img src={pdf.thumbnail} alt={pdf.name} style={inlineStyles.s16} onError={(e) => { e.currentTarget.style.display = 'none'; }} />
                ) : (
                  <BookOpen size={20} color={T.muted} />
                )}
              </div>

              {/* Info */}
              <div style={inlineStyles.s17}>
                <h3
                  onClick={() => openViewer(pdf)}
                  style={featureStyleFunctions.s28({T})}
                  onMouseEnter={(e) => e.currentTarget.style.color = T.accent}
                  onMouseLeave={(e) => e.currentTarget.style.color = T.text}
                >
                  {pdf.name}
                </h3>
                <div style={featureStyleFunctions.s29({T})}>
                  {pdf.category} · {pdf.subcategory}
                </div>
              </div>

              {/* Actions */}
              <div style={inlineStyles.s18}>
                <button
                  onClick={() => openViewer(pdf)}
                  style={featureStyleFunctions.s30({T})}
                >
                  <Eye size={14} /> View
                </button>
                <button
                  onClick={() => window.open(getDirectDownloadLink(pdf.file_link), '_blank')}
                  style={featureStyleFunctions.s31({T})}
                  title="Download"
                >
                  <Download size={14} />
                </button>
              </div>
            </motion.div>
          ))}
        </div>
      )}

      {/* Pagination controls */}
      {totalPages > 1 && (
        <div style={inlineStyles.s19}>
          <button
            onClick={() => handlePageChange(currentPage - 1)}
            disabled={currentPage === 1}
            style={featureStyleFunctions.s32({T,currentPage})}
          >
            <ChevronLeft size={16} />
          </button>
          
          <span style={featureStyleFunctions.s33({T})}>
            Page {currentPage} of {totalPages}
          </span>

          <button
            onClick={() => handlePageChange(currentPage + 1)}
            disabled={currentPage === totalPages}
            style={featureStyleFunctions.s34({T,currentPage,totalPages})}
          >
            <ChevronRight size={16} />
          </button>
        </div>
      )}

      {/* PDF preview modal */}
      <PDFViewerModal
        isOpen={isViewerOpen}
        onClose={() => setIsViewerOpen(false)}
        pdfResource={selectedPDF}
      />
    </div>
  );
}
