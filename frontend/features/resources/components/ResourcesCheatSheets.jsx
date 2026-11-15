'use client';
import * as featureStyleFunctions from '@/features/resources/styles/ResourcesCheatSheets.585f4ba6.styles.js';

import inlineStyles from '@/features/resources/styles/ResourcesCheatSheets.styles';


import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Search, BookOpen, Tag, FolderOpen, ArrowLeft, ArrowRight } from 'lucide-react';
import { T } from '@/shared/design-system/theme';
import cheatSheets from '@/lib/all-cheatsheets';

export default function ResourcesCheatSheets({ navigateTo }) {
  const [searchTerm, setSearchTerm] = useState('');
  const [groupedCheatSheets, setGroupedCheatSheets] = useState({});
  const [selectedCategory, setSelectedCategory] = useState('All Categories');

  useEffect(() => {
    // Group cheat sheets by category
    const grouped = {};
    cheatSheets.forEach(sheet => {
      const category = sheet.categories[0] || 'General';
      if (!grouped[category]) {
        grouped[category] = [];
      }
      grouped[category].push(sheet);
    });
    
    // Sort categories - priority categories first, then alphabetically
    const priorityCategories = ['Programming', 'Python', 'Database'];
    const sortedGrouped = {};
    
    // Add priority categories first
    priorityCategories.forEach(category => {
      if (grouped[category]) {
        sortedGrouped[category] = grouped[category];
      }
    });
    
    // Add remaining categories alphabetically
    Object.keys(grouped)
      .sort()
      .forEach(key => {
        if (!priorityCategories.includes(key)) {
          sortedGrouped[key] = grouped[key];
        }
      });
    
    setGroupedCheatSheets(sortedGrouped);
  }, []);

  const handleCheatSheetClick = (id) => {
    navigateTo('cheatsheet', { id });
  };

  const getFilteredSheets = () => {
    let filtered = cheatSheets;
    if (selectedCategory !== 'All Categories') {
      filtered = filtered.filter(sheet => sheet.categories.includes(selectedCategory));
    }
    if (searchTerm) {
      const term = searchTerm.toLowerCase();
      filtered = filtered.filter(sheet => 
        sheet.title.toLowerCase().includes(term) ||
        sheet.intro.toLowerCase().includes(term) ||
        sheet.tags.some(tag => tag.toLowerCase().includes(term))
      );
    }
    return filtered;
  };

  const allCategories = ['All Categories', ...Object.keys(groupedCheatSheets)];
  const displayGrouped = searchTerm === '' && selectedCategory === 'All Categories';
  const filteredSheets = getFilteredSheets();

  return (
    <div style={inlineStyles.s0}>
      {/* Back button and header */}
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
            Cheat Sheets
          </h1>
          <p style={featureStyleFunctions.s2({T})}>
            Quick reference guides for developers and learners. Find the most important commands and concepts in one place.
          </p>
        </div>
      </div>

      {/* Controls */}
      <div style={inlineStyles.s3}>
        {/* Search */}
        <div style={inlineStyles.s4}>
          <Search size={18} color={T.muted} style={inlineStyles.s5} />
          <input
            type="text"
            placeholder="Search cheat sheets..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            style={featureStyleFunctions.s3({T})}
          />
        </div>

        {/* Categories Dropdown */}
        <select
          value={selectedCategory}
          onChange={(e) => setSelectedCategory(e.target.value)}
          style={featureStyleFunctions.s4({T})}
        >
          {allCategories.map(cat => (
            <option key={cat} value={cat}>{cat}</option>
          ))}
        </select>
      </div>

      {/* Stats Counter */}
      <div style={inlineStyles.s6}>
        <div style={featureStyleFunctions.s5({T})}>
          <div style={inlineStyles.s7}>
            <BookOpen size={20} />
          </div>
          <div>
            <div style={featureStyleFunctions.s6({T})}>{cheatSheets.length}</div>
            <div style={featureStyleFunctions.s7({T})}>Total Sheets</div>
          </div>
        </div>

        <div style={featureStyleFunctions.s8({T})}>
          <div style={inlineStyles.s8}>
            <Tag size={20} />
          </div>
          <div>
            <div style={featureStyleFunctions.s9({T})}>{new Set(cheatSheets.flatMap(s => s.tags)).size}</div>
            <div style={featureStyleFunctions.s10({T})}>Unique Tags</div>
          </div>
        </div>

        <div style={featureStyleFunctions.s11({T})}>
          <div style={inlineStyles.s9}>
            <FolderOpen size={20} />
          </div>
          <div>
            <div style={featureStyleFunctions.s12({T})}>{Object.keys(groupedCheatSheets).length}</div>
            <div style={featureStyleFunctions.s13({T})}>Categories</div>
          </div>
        </div>
      </div>

      {/* Main categories listing */}
      {displayGrouped ? (
        Object.entries(groupedCheatSheets).map(([category, sheets]) => (
          <div key={category} style={inlineStyles.s10}>
            <div style={featureStyleFunctions.s14({T})}>
              <FolderOpen size={18} color={T.accent} />
              <h2 style={featureStyleFunctions.s15({T})}>{category}</h2>
              <span style={featureStyleFunctions.s16({T})}>
                {sheets.length} sheets
              </span>
            </div>

            <div style={inlineStyles.s11}>
              {sheets.map(sheet => (
                <motion.div
                  key={sheet.id}
                  whileHover={{ y: -4 }}
                  onClick={() => handleCheatSheetClick(sheet.id)}
                  style={featureStyleFunctions.s17({T})}
                >
                  <div>
                    <h3 style={featureStyleFunctions.s18({T})}>{sheet.title}</h3>
                    <p style={featureStyleFunctions.s19({T})}>
                      {sheet.intro}
                    </p>
                  </div>
                  <div style={inlineStyles.s12}>
                    {sheet.tags.slice(0, 2).map(tag => (
                      <span key={tag} style={featureStyleFunctions.s20({T})}>
                        {tag}
                      </span>
                    ))}
                    {sheet.tags.length > 2 && (
                      <span style={featureStyleFunctions.s21({T})}>
                        +{sheet.tags.length - 2}
                      </span>
                    )}
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        ))
      ) : (
        /* Searched / Filtered list */
        <div>
          <div style={featureStyleFunctions.s22({T})}>
            <BookOpen size={18} color={T.accent} />
            <h2 style={featureStyleFunctions.s23({T})}>
              {selectedCategory !== 'All Categories' ? selectedCategory : 'Search Results'}
            </h2>
            <span style={featureStyleFunctions.s24({T})}>
              {filteredSheets.length} sheets
            </span>
          </div>

          {filteredSheets.length === 0 ? (
            <div style={featureStyleFunctions.s25({T})}>
              No cheat sheets match your filters.
            </div>
          ) : (
            <div style={inlineStyles.s13}>
              {filteredSheets.map(sheet => (
                <motion.div
                  key={sheet.id}
                  whileHover={{ y: -4 }}
                  onClick={() => handleCheatSheetClick(sheet.id)}
                  style={featureStyleFunctions.s26({T})}
                >
                  <div>
                    <h3 style={featureStyleFunctions.s27({T})}>{sheet.title}</h3>
                    <p style={featureStyleFunctions.s28({T})}>
                      {sheet.intro}
                    </p>
                  </div>
                  <div style={inlineStyles.s14}>
                    {sheet.tags.slice(0, 2).map(tag => (
                      <span key={tag} style={featureStyleFunctions.s29({T})}>
                        {tag}
                      </span>
                    ))}
                    {sheet.tags.length > 2 && (
                      <span style={featureStyleFunctions.s30({T})}>
                        +{sheet.tags.length - 2}
                      </span>
                    )}
                  </div>
                </motion.div>
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  );
}
