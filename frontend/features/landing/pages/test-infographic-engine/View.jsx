'use client';
import * as featureStyleFunctions from '@/features/landing/styles/View.0b3dbee0.styles.js';

import inlineStyles from '@/features/landing/styles/test-infographic-engine-page.jsx.styles.js';


import React, { useState } from 'react';
import dynamic from 'next/dynamic';
import { generateInfographic, analyzeContent, DIAGRAM_TYPES } from '@/lib/infographicEngine';

const MermaidDiagram = dynamic(() => import('@/components/MermaidDiagram'), { ssr: false });

const SAMPLES = {
  process: `Mitochondria are the powerhouses of the cell. The process begins with glycolysis where glucose is broken down into pyruvate in the cytoplasm. Pyruvate then enters the mitochondrial matrix where the citric acid cycle (Krebs cycle) occurs, producing NADH and FADH2. These electron carriers feed into the electron transport chain along the inner mitochondrial membrane. As electrons flow through complexes I-IV, protons are pumped into the intermembrane space creating a gradient. Finally, ATP synthase uses this proton gradient to phosphorylate ADP into ATP.`,
  
  decision: `When a cell receives a signal, it first checks if the receptor is activated. If the signal is strong enough, the cell initiates the MAPK pathway. If the signal is weak, it may trigger apoptosis instead. The decision depends on the phosphorylation state of key proteins. Once the pathway is chosen, downstream effectors are activated leading to either cell proliferation or programmed cell death.`,
  
  hierarchy: `The cardiovascular system consists of the heart, blood vessels, and blood. The heart has four chambers: two atria and two ventricles. Blood vessels are classified into arteries, veins, and capillaries. Arteries carry oxygenated blood away from the heart (except pulmonary artery). Veins return deoxygenated blood to the heart (except pulmonary vein). Capillaries are the site of gas exchange. Blood contains red blood cells, white blood cells, platelets, and plasma.`,
  
  timeline: `Earth formed 4.5 billion years ago. The first single-celled life appeared around 3.8 billion years ago. Photosynthesis evolved 2.5 billion years ago, oxygenating the atmosphere. The Cambrian explosion 541 million years ago saw rapid diversification. Dinosaurs dominated from 245 to 66 million years ago. Mammals rose after the K-T extinction. Humans evolved around 300,000 years ago.`,
  
  comparison: `Photosynthesis vs Cellular Respiration. Photosynthesis occurs in chloroplasts, uses CO2 and H2O, produces glucose and O2, requires light energy. Cellular respiration occurs in mitochondria, uses glucose and O2, produces CO2 and H2O, releases ATP energy. They are complementary processes - the products of one are the reactants of the other. Both involve electron transport chains and ATP synthesis.`,
  
  architecture: `A modern web application follows a layered architecture. The presentation layer handles UI rendering with React/Vue, state management with Redux, and API communication. The business logic layer contains services, controllers, validation, and domain models. The data layer uses ORM like Prisma, database connections, migrations, and caching with Redis. Infrastructure includes load balancers, containers, CI/CD pipelines, and monitoring.`,
  
  sequence: `The TCP three-way handshake establishes a reliable connection. Step 1: Client sends SYN with initial sequence number. Step 2: Server responds with SYN-ACK acknowledging client's sequence and sending its own. Step 3: Client sends ACK confirming server's sequence. Both sides now have synchronized sequence numbers and can exchange data reliably.`,
  
  mindmap: `Cellular respiration is the central concept. It branches into three main stages: Glycolysis in the cytoplasm, Citric Acid Cycle in the mitochondrial matrix, and Electron Transport Chain on the inner membrane. Glycolysis produces pyruvate and NADH. The Citric Acid Cycle generates NADH, FADH2, and GTP. The Electron Transport Chain creates a proton gradient driving ATP synthase. Key molecules: glucose, oxygen, ATP, NAD+, FAD.`
};

export default function InfographicEngineTest() {
  const [inputText, setInputText] = useState(SAMPLES.process);
  const [result, setResult] = useState(null);
  const [logs, setLogs] = useState([]);
  const [activeSample, setActiveSample] = useState('process');

  const addLog = (msg) => {
    const time = new Date().toLocaleTimeString();
    setLogs(prev => [...prev, `[${time}] ${msg}`]);
  };

  const handleGenerate = () => {
    if (!inputText.trim()) return;
    
    addLog('Analyzing content...');
    const analysis = analyzeContent(inputText);
    addLog(`Detected type: ${analysis.primaryType} (confidence: ${(analysis.confidence * 100).toFixed(0)}%)`);
    addLog(`Signals: ${Object.entries(analysis.signals).filter(([_,v]) => v).map(([k]) => k).join(', ')}`);
    
    addLog('Generating infographic...');
    const generated = generateInfographic(inputText);
    addLog(`Generated: ${generated.diagramType} diagram with ${generated.points.length} takeaways`);
    
    setResult(generated);
  };

  const loadSample = (key) => {
    setInputText(SAMPLES[key] || '');
    setActiveSample(key);
    setResult(null);
    setLogs([]);
  };

  const handleClear = () => {
    setInputText('');
    setResult(null);
    setLogs([]);
  };

  return (
    <div style={inlineStyles.s0}>
      <h1 style={inlineStyles.s1}>
        🧠 Dynamic Infographic Engine Test
      </h1>

      <div style={inlineStyles.s2}>
        {/* Left Panel */}
        <div style={inlineStyles.s3}>
          <h3 style={inlineStyles.s4}>📝 Input Text</h3>
          
          <div style={inlineStyles.s5}>
            {Object.keys(SAMPLES).map(key => (
              <button
                key={key}
                onClick={() => loadSample(key)}
                style={featureStyleFunctions.s0({activeSample,key})}
              >
                {key.charAt(0).toUpperCase() + key.slice(1)}
              </button>
            ))}
          </div>
          
          <textarea
            value={inputText}
            onChange={(e) => setInputText(e.target.value)}
            placeholder="Paste Vedika response here..."
            style={inlineStyles.s6}
          />
          
          <div style={inlineStyles.s7}>
            <button
              onClick={handleGenerate}
              style={inlineStyles.s8}
            >
              ✨ Generate Infographic
            </button>
            <button
              onClick={handleClear}
              style={inlineStyles.s9}
            >
              🗑️ Clear
            </button>
          </div>

          <div style={inlineStyles.s10}>
            {logs.map((log, i) => <div key={i}>{log}</div>)}
          </div>
        </div>

        {/* Right Panel */}
        <div style={inlineStyles.s11}>
          <h3 style={inlineStyles.s12}>📊 Generated Output</h3>
          
          {result ? (
            <>
              <div style={inlineStyles.s13}>
                {DIAGRAM_TYPES[result.diagramType]?.icon || '📊'} {DIAGRAM_TYPES[result.diagramType]?.name || result.diagramType}
              </div>
              
              <div style={inlineStyles.s14}>
                <MermaidDiagram 
                  chart={result.mermaid} 
                  points={result.points} 
                />
              </div>
              
              <div style={inlineStyles.s15}>
                {result.points.map((pt, i) => (
                  <div key={i} style={inlineStyles.s16}>
                    <strong style={inlineStyles.s17}>{i + 1}.</strong> {pt}
                  </div>
                ))}
              </div>
            </>
          ) : (
            <div style={inlineStyles.s18}>
              Generate an infographic to see the result
            </div>
          )}
        </div>
      </div>
    </div>
  );
}