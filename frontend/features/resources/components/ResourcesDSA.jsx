'use client';
import * as featureStyleFunctions from '@/features/resources/styles/ResourcesDSA.a8d57a9f.styles.js';

import inlineStyles from '@/features/resources/styles/ResourcesDSA.styles';


import { motion } from 'framer-motion';
import { ArrowRight, Building, BookOpen, ArrowLeft } from 'lucide-react';
import { T } from '@/shared/design-system/theme';

export default function ResourcesDSA({ navigateTo }) {
  const options = [
    {
      id: 'dsa/company',
      title: 'Company-wise Questions',
      description: 'Practice coding questions asked by top tech companies',
      gradient: 'linear-gradient(135deg, #3B82F6 0%, #8B5CF6 100%)',
      Icon: Building
    },
    {
      id: 'dsa/resources',
      title: 'Learning Resources',
      description: 'Comprehensive DSA study materials and guides',
      gradient: 'linear-gradient(135deg, #10B981 0%, #14B8A6 100%)',
      Icon: BookOpen
    }
  ];

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
            Data Structures & Algorithms
          </h1>
          <p style={featureStyleFunctions.s2({T})}>
            Master DSA with company-specific questions and comprehensive learning resources.
          </p>
        </div>
      </div>

      {/* Options */}
      <div style={inlineStyles.s3}>
        {options.map(({ id, title, description, gradient, Icon }) => (
          <motion.div
            key={id}
            whileHover={{ y: -6 }}
            onClick={() => navigateTo(id)}
            style={featureStyleFunctions.s3({gradient})}
          >
            {/* Glossy overlay */}
            <div style={inlineStyles.s4}></div>

            <div style={inlineStyles.s5}>
              <div style={inlineStyles.s6}>
                <Icon size={24} color="#fff" />
              </div>
              <h2 style={inlineStyles.s7}>{title}</h2>
              <p style={inlineStyles.s8}>{description}</p>
            </div>

            <div style={inlineStyles.s9}>
              Explore <ArrowRight size={14} />
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  );
}
