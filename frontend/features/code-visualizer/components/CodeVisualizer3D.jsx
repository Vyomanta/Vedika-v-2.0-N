'use client';
import * as featureStyleFunctions from '@/features/code-visualizer/styles/CodeVisualizer3D.7c491049.styles.js';

import inlineStyles from '@/features/code-visualizer/styles/CodeVisualizer3D.styles';
import '@/features/code-visualizer/styles/CodeVisualizer3D.css';
import React, { useEffect, useRef, useState } from 'react';
import * as THREE from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls';
import {createTextTexture} from '@/features/code-visualizer/components/features-code-visualizer-components-CodeVisualizer3D.support.jsx';
import {useCodeVisualizer3DModel} from '@/features/code-visualizer/hooks/features-code-visualizer-components-CodeVisualizer3D.jsx';
export default function CodeVisualizer3D({
  listKey,
  listVal = [],
  variables = {},
  prevVariables = {},
  scalarKeys = [],
  dictKeys = [],
  actionType = 'STEP',
  swapMessage = '',
  stdout = ''
}) {
const {containerRef,canvasRef,sceneRef,cameraRef,rendererRef,controlsRef,visualizerGroupRef,connectorGroupRef,meshesRef,elementIdsRef,hoveredMeshIdRef,pointersRef,selectedElement,setSelectedElement,stackVars,setStackVars}=useCodeVisualizer3DModel({listKey,listVal,variables,prevVariables,scalarKeys,dictKeys,actionType,swapMessage,stdout});
return (
    <div
      ref={containerRef}
      style={inlineStyles.s0}
    >
      {/* Three.js WebGL Canvas */}
      <canvas ref={canvasRef} style={inlineStyles.s1} />

      {/* Floating 2D HTML Labels Overlay (Positions managed directly by WebGL loop) */}
      <div style={inlineStyles.s2}>
        {/* List Mode Labels */}
        {listKey && listVal.length > 0 && elementIdsRef.current.map((id, index) => {
          const val = listVal[index];
          const activePointers = pointersRef.current[index] || [];
          return (
            <div
              key={id}
              id={`label-${id}`}
              style={inlineStyles.s3}
            >
              {/* Value Box */}
              <div
                style={inlineStyles.s4}
              >
                {String(val)}
              </div>

              {/* Variable Pointers (i, j, low, high) */}
              {activePointers.length > 0 && (
                <div style={inlineStyles.s5}>
                  {activePointers.map(ptrName => (
                    <div
                      key={ptrName}
                      style={featureStyleFunctions.s0({actionType})}
                    >
                      {ptrName}
                    </div>
                  ))}
                </div>
              )}
            </div>
          );
        })}

        {/* Variables Mode Labels (Name tags floating above pedestals) */}
        {(!listKey || listVal.length === 0) && stackVars.filter(v => v.type !== 'dict').map((v) => {
          const id = `var-${v.key}`;
          return (
            <div
              key={id}
              id={`label-${id}`}
              style={inlineStyles.s6}
            >
              <div
                style={inlineStyles.s7}
              >
                {v.key}
              </div>
            </div>
          );
        })}
      </div>

      {/* Selected Element HUD Card Details Inspector */}
      {selectedElement && (
        <div
          style={inlineStyles.s8}
        >
          <div style={inlineStyles.s9}>
            <span style={inlineStyles.s10}>ELEMENT DETAILS</span>
            <button
              onClick={() => setSelectedElement(null)}
              style={inlineStyles.s11}
              onMouseEnter={e => e.target.style.color = '#F87171'}
              onMouseLeave={e => e.target.style.color = '#8892B0'}
            >
              ✕
            </button>
          </div>
          <div>Index: <span style={inlineStyles.s12}>{selectedElement.index}</span></div>
          <div>Value: <span style={inlineStyles.s13}>{String(selectedElement.value)}</span></div>
          <div>State: <span style={featureStyleFunctions.s1({selectedElement})}>
            {selectedElement.isPointed ? `Targeted by pointer (${selectedElement.pointers.join(', ')})` : 'Idle'}
          </span></div>
        </div>
      )}

      {/* Stack/Scalar Registers Sidebar overlay (right side) */}
      {stackVars.length > 0 && (
        <div
          style={inlineStyles.s14}
          className="sandbox-scroll"
        >
          <div style={inlineStyles.s15}>
            <span style={inlineStyles.s16}>●</span> Registers
          </div>
          <div style={inlineStyles.s17}>
            {stackVars.map((v) => (
              <div
                key={v.key}
                style={featureStyleFunctions.s2({v})}
              >
                <span style={inlineStyles.s18}>
                  {v.key}
                </span>
                <span
                  style={featureStyleFunctions.s3({v})}
                >
                  {v.type === 'dict' ? '{...}' : String(v.val)}
                </span>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Styles for bounce animation and OrbitControls hover cursor */}
      
    </div>
  );

}
