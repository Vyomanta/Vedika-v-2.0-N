'use client';
import * as featureStyleFunctions from '@/features/resources/styles/ResourcesMarkdownCheatSheet.cf48da38.styles.js';

import inlineStyles from '@/features/resources/styles/ResourcesMarkdownCheatSheet.styles';


import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { ArrowLeft, Copy, Check, FileText } from 'lucide-react';
import { T } from '@/shared/design-system/theme';

export default function ResourcesMarkdownCheatSheet({ navigateTo, cheatSheetId }) {
  const [cheatSheet, setCheatSheet] = useState(null);
  const [sections, setSections] = useState([]);
  const [copiedCode, setCopiedCode] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadCheatSheet() {
      if (!cheatSheetId) {
        navigateTo('cheatsheets');
        return;
      }
      
      setLoading(true);
      try {
        const response = await fetch(`/src/markdown-cheatsheets/${cheatSheetId}.md`);
        if (!response.ok) {
          navigateTo('cheatsheets');
          return;
        }
        
        const text = await response.text();
        
        // Parse frontmatter
        const frontmatterRegex = /^---\n([\s\S]*?)\n---\n/;
        const match = text.match(frontmatterRegex);
        
        let contentText = text;
        const metadata = { id: cheatSheetId };
        
        if (match) {
          const frontmatter = match[1];
          contentText = text.substring(match[0].length);
          
          frontmatter.split('\n').forEach(line => {
            if (line.includes(':') && !line.startsWith('  -')) {
              const [key, ...valueParts] = line.split(':');
              const currentKey = key.trim();
              const value = valueParts.join(':').trim();
              if (value) {
                if (currentKey === 'tags') {
                  metadata[currentKey] = value.split(' -').filter(tag => tag.trim()).map(tag => tag.trim());
                } else if (currentKey === 'categories') {
                  metadata[currentKey] = [value];
                } else {
                  metadata[currentKey] = value;
                }
              }
            }
          });
        }
        
        if (!metadata.title) {
          metadata.title = cheatSheetId.replace(/-/g, ' ');
        }
        
        setCheatSheet(metadata);
        parseContent(contentText);
      } catch (error) {
        console.error('Error loading cheat sheet:', error);
        navigateTo('cheatsheets');
      } finally {
        setLoading(false);
      }
    }
    
    loadCheatSheet();
  }, [cheatSheetId]);

  const parseContent = (content) => {
    const sectionMatches = content.split(/(^##\s.*)/gm).filter(s => s.trim() !== '');
    const parsedSections = [];
    let currentSection = null;
    
    sectionMatches.forEach((part) => {
      if (part.startsWith('## ')) {
        if (currentSection) {
          parsedSections.push(currentSection);
        }
        currentSection = {
          title: part.substring(3).trim(),
          subsections: []
        };
      } else if (currentSection) {
        const subSections = part.split(/(^###\s.*)/gm).filter(s => s.trim() !== '');
        let currentSubSection = null;
        
        subSections.forEach((subPart) => {
          if (subPart.startsWith('### ')) {
            if (currentSubSection) {
              currentSection.subsections.push(currentSubSection);
            }
            currentSubSection = {
              title: subPart.substring(4).trim(),
              content: ''
            };
          } else if (currentSubSection) {
            currentSubSection.content += subPart;
          }
        });
        
        if (currentSubSection) {
          currentSection.subsections.push(currentSubSection);
        }
      }
    });
    
    if (currentSection) {
      parsedSections.push(currentSection);
    }
    setSections(parsedSections);
  };

  const copyToClipboard = (text, index) => {
    navigator.clipboard.writeText(text);
    setCopiedCode(index);
    setTimeout(() => setCopiedCode(null), 2000);
  };

  const renderContent = (content) => {
    const parts = content.split(/(```[\s\S]*?```)/g);
    return parts.map((part, index) => {
      if (part.startsWith('```') && part.endsWith('```')) {
        const lines = part.split('\n');
        const code = lines.slice(1, -1).join('\n');
        const codeIndex = `${index}`;
        
        return (
          <div key={index} style={inlineStyles.s0}>
            <pre style={featureStyleFunctions.s0({T})}>
              <code>{code}</code>
            </pre>
            <button
              onClick={() => copyToClipboard(code, codeIndex)}
              style={featureStyleFunctions.s1({T})}
            >
              {copiedCode === codeIndex ? <Check size={13} color={T.green} /> : <Copy size={13} />}
            </button>
          </div>
        );
      } else if (part.trim() !== '') {
        const lines = part.split('\n').filter(line => line.trim() !== '');
        return lines.map((line, idx) => {
          if (line.trim().startsWith('- ') || line.trim().startsWith('* ')) {
            return (
              <li key={idx} style={featureStyleFunctions.s2({T})}>
                {line.substring(2).trim()}
              </li>
            );
          }
          return (
            <p key={idx} style={featureStyleFunctions.s3({T})}>
              {line}
            </p>
          );
        });
      }
      return null;
    });
  };

  if (loading) {
    return (
      <div style={inlineStyles.s1}>
        <div style={featureStyleFunctions.s4({T})} />
        <div style={featureStyleFunctions.s5({T})}>Loading cheat sheet...</div>
      </div>
    );
  }

  return (
    <div style={inlineStyles.s2}>
      {/* Header */}
      <div style={inlineStyles.s3}>
        <button
          onClick={() => navigateTo('cheatsheets')}
          style={featureStyleFunctions.s6({T})}
          onMouseEnter={(e) => e.currentTarget.style.color = T.text}
          onMouseLeave={(e) => e.currentTarget.style.color = T.muted}
        >
          <ArrowLeft size={16} /> Back to Cheat Sheets
        </button>

        <div style={inlineStyles.s4}>
          <h1 style={featureStyleFunctions.s7({T})}>
            {cheatSheet?.title}
          </h1>
          {cheatSheet?.intro && (
            <p style={featureStyleFunctions.s8({T})}>
              {cheatSheet.intro}
            </p>
          )}
          
          {cheatSheet?.tags && (
            <div style={inlineStyles.s5}>
              {cheatSheet.tags.map(tag => (
                <span key={tag} style={featureStyleFunctions.s9({T})}>
                  {tag}
                </span>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Grid of Sections */}
      <div style={inlineStyles.s6}>
        {sections.map((section, sIdx) => (
          <div key={sIdx} style={featureStyleFunctions.s10({T})}>
            <h2 style={featureStyleFunctions.s11({T})}>
              {section.title}
            </h2>

            {/* Subsection Cards inside grid */}
            <div style={inlineStyles.s7}>
              {section.subsections.map((sub, subIdx) => (
                <div key={subIdx} style={featureStyleFunctions.s12({T})}>
                  <div style={inlineStyles.s8}>
                    <h3 style={featureStyleFunctions.s13({T})}>{sub.title}</h3>
                    <FileText size={14} color={T.muted} />
                  </div>
                  <div style={inlineStyles.s9}>
                    {renderContent(sub.content)}
                  </div>
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
