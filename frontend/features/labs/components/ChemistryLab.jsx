'use client';
import * as featureStyleFunctions from '@/features/labs/styles/ChemistryLab.58bb2d68.styles.js';

import inlineStyles from '@/features/labs/styles/ChemistryLab.styles';


import { useState, useEffect, useRef } from 'react';
import { useRouter } from 'next/navigation';
import * as THREE from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls';
import {
  FlaskConical, Sliders, Info, Zap,
  RotateCcw, Play, Pause, AlertCircle, Compass, Database, Maximize2, ArrowLeft
} from 'lucide-react';
import { T } from '@/shared/design-system/theme';
import { useMediaQuery, isMobileMQ, isTabletMQ } from '@/lib/useMediaQuery';

import PhetSimViewer from '@/components/labs/PhetSimViewer';
import { getMascotBridge } from '@/lib/mascotBridge';

// Periodic Table Elements Data
const ELEMENTS = [
  { z: 1, symbol: 'H', name: 'Hydrogen', category: 'Nonmetal', radius: 37, electronegativity: 2.20, shell: [1] },
  { z: 2, symbol: 'He', name: 'Helium', category: 'Noble Gas', radius: 31, electronegativity: 0, shell: [2] },
  { z: 3, symbol: 'Li', name: 'Lithium', category: 'Alkali Metal', radius: 152, electronegativity: 0.98, shell: [2, 1] },
  { z: 4, symbol: 'Be', name: 'Beryllium', category: 'Alkaline Earth', radius: 112, electronegativity: 1.57, shell: [2, 2] },
  { z: 5, symbol: 'B', name: 'Boron', category: 'Metalloid', radius: 85, electronegativity: 2.04, shell: [2, 3] },
  { z: 6, symbol: 'C', name: 'Carbon', category: 'Nonmetal', radius: 77, electronegativity: 2.55, shell: [2, 4] },
  { z: 7, symbol: 'N', name: 'Nitrogen', category: 'Nonmetal', radius: 75, electronegativity: 3.04, shell: [2, 5] },
  { z: 8, symbol: 'O', name: 'Oxygen', category: 'Nonmetal', radius: 73, electronegativity: 3.44, shell: [2, 6] },
  { z: 9, symbol: 'F', name: 'Fluorine', category: 'Halogen', radius: 71, electronegativity: 3.98, shell: [2, 7] },
  { z: 10, symbol: 'Ne', name: 'Neon', category: 'Noble Gas', radius: 38, electronegativity: 0, shell: [2, 8] }
];

export default function ChemistryLab() {
  const router = useRouter();
  const isMobile = useMediaQuery(isMobileMQ);
  const isTablet = useMediaQuery(isTabletMQ);
  const isStacked = isMobile;
  const [labMode, setLabMode] = useState('phet'); // 'phet' | '3d'
  const [activePhetSim, setActivePhetSim] = useState('build-an-atom');
  const [selectedExperiment, setSelectedExperiment] = useState('bohr');
  const [isPlaying, setIsPlaying] = useState(true);
  const [timeScale, setTimeScale] = useState(1);

  // URL Query Parameters & Mascot Bridge Inner Page Controller
  useEffect(() => {
    if (typeof window === 'undefined') return;

    const applyQueryParams = () => {
      const params = new URLSearchParams(window.location.search);
      const exp = params.get('experiment') || params.get('exp');
      const mode = params.get('mode');
      const phet = params.get('sim') || params.get('phet');

      if (exp) {
        const validExps = ['bohr', 'gas', 'titration', 'diffusion', 'trends'];
        if (validExps.includes(exp.toLowerCase())) {
          setSelectedExperiment(exp.toLowerCase());
          setLabMode('3d');
        }
      }
      if (mode === '3d' || mode === 'phet') {
        setLabMode(mode);
      }
      if (phet) {
        setActivePhetSim(phet);
        setLabMode('phet');
      }
    };

    applyQueryParams();

    // Listen for real-time remote commands from Desktop Mascot
    const bridge = getMascotBridge();
    const unsubscribe = bridge.subscribe((msg) => {
      if (msg.type === 'PET_ACTION_REQUESTED' && msg.payload) {
        const { action, target } = msg.payload;
        if (action === 'select_experiment' || action === 'switch_experiment') {
          const exp = target?.toLowerCase();
          const validExps = ['bohr', 'gas', 'titration', 'diffusion', 'trends'];
          if (validExps.includes(exp)) {
            setSelectedExperiment(exp);
            setLabMode('3d');
          }
        } else if (action === 'set_mode') {
          if (target === '3d' || target === 'phet') setLabMode(target);
        }
      } else if (msg.type === 'NAVIGATE_WEBAPP' && msg.payload?.route) {
        const r = msg.payload.route;
        if (r.includes('?')) {
          const params = new URLSearchParams(r.split('?')[1]);
          const exp = params.get('experiment') || params.get('exp');
          if (exp && ['bohr', 'gas', 'titration', 'diffusion', 'trends'].includes(exp.toLowerCase())) {
            setSelectedExperiment(exp.toLowerCase());
            setLabMode('3d');
          }
          const mode = params.get('mode');
          if (mode === '3d' || mode === 'phet') setLabMode(mode);
        }
      }
    });

    return () => {
      unsubscribe();
    };
  }, []);

  // Sync active experiment and mode back to Desktop Mascot
  useEffect(() => {
    if (typeof window === 'undefined') return;
    const bridge = getMascotBridge();
    bridge.sendActivityUpdate('chemistry_lab', {
      experiment: selectedExperiment,
      mode: labMode,
      phetSim: activePhetSim
    });
    return () => {
      bridge.sendActivityUpdate('browsing', { page: window.location.pathname });
    };
  }, [selectedExperiment, labMode, activePhetSim]);

  // --- 1. Bohr Model Builder States ---
  const [protons, setProtons] = useState(3); // Lithium
  const [neutrons, setNeutrons] = useState(4);
  const [electrons, setElectrons] = useState(3);
  const activeElement = ELEMENTS.find(e => e.z === protons) || ELEMENTS[0];

  // --- 2. Gas Laws States ---
  const [gasTemp, setGasTemp] = useState(300); // Kelvin
  const [gasVolume, setGasVolume] = useState(3.0); // Liters (corresponds to height)
  const [gasMoles, setGasMoles] = useState(2.0);
  const [gasPressure, setGasPressure] = useState(16.4); // atm

  // --- 3. Acid-Base Reactions / Titration States ---
  const [acidVol, setAcidVol] = useState(25.0); // ml
  const [acidConc, setAcidConc] = useState(0.1); // M (HCl)
  const [baseConc, setBaseConc] = useState(0.1); // M (NaOH)
  const [baseAdded, setBaseAdded] = useState(0.0); // ml added from buret
  const [titrationPh, setTitrationPh] = useState(1.0);
  const [isDripping, setIsDripping] = useState(false);

  // --- 4. Molecular Diffusion States ---
  const [diffusionTemp, setDiffusionTemp] = useState(300); // Kelvin
  const [diffusionGas, setDiffusionGas] = useState('helium'); // 'helium' | 'neon' | 'xenon'
  const [isPartitionOpen, setIsPartitionOpen] = useState(false);

  // --- 5. Periodic Trends States ---
  const [trendElementIndex, setTrendElementIndex] = useState(2); // Lithium
  const [selectedProperty, setSelectedProperty] = useState('radius'); // 'radius' | 'electronegativity'
  const activeTrendElement = ELEMENTS[trendElementIndex];

  // DOM Mount Ref & Global State Reference
  const mountRef = useRef(null);
  const diffParticlesRef = useRef([]);
  const simStateRef = useRef({
    isPlaying: true,
    timeScale: 1,
    selectedExperiment: 'bohr',
    // Bohr
    bohr: { protons: 3, neutrons: 4, electrons: 3 },
    // Gas
    gas: { T: 300, V: 3.0, n: 2.0, P: 16.4 },
    // Titration
    titration: { acidVol: 25.0, acidConc: 0.1, baseConc: 0.1, baseAdded: 0.0, pH: 1.0, isDripping: false },
    // Diffusion
    diffusion: { T: 300, gas: 'helium', open: false, elapsed: 0 },
    // Trends
    trends: { z: 3, property: 'radius' }
  });

  // Sync state to ref
  useEffect(() => {
    simStateRef.current.isPlaying = isPlaying;
    simStateRef.current.timeScale = timeScale;
    simStateRef.current.selectedExperiment = selectedExperiment;

    simStateRef.current.bohr.protons = protons;
    simStateRef.current.bohr.neutrons = neutrons;
    simStateRef.current.bohr.electrons = electrons;

    simStateRef.current.gas.T = gasTemp;
    simStateRef.current.gas.V = gasVolume;
    simStateRef.current.gas.n = gasMoles;
    // Ideal Gas Equation: P = nRT/V (using R = 0.0821 L*atm/(mol*K))
    const P = (gasMoles * 0.0821 * gasTemp) / gasVolume;
    simStateRef.current.gas.P = P;
    setGasPressure(P);

    simStateRef.current.titration.acidVol = acidVol;
    simStateRef.current.titration.acidConc = acidConc;
    simStateRef.current.titration.baseConc = baseConc;
    simStateRef.current.titration.baseAdded = baseAdded;
    simStateRef.current.titration.isDripping = isDripping;

    // Titration pH calculation: HCl (acid) + NaOH (base)
    // mmol of H+ = Va * Ma, mmol of OH- = Vb * Mb
    const mmolH = acidVol * acidConc;
    const mmolOH = baseAdded * baseConc;
    const totalVolume = acidVol + baseAdded;
    
    let computedPH = 7.0;
    if (mmolH > mmolOH) {
      const remainingH = mmolH - mmolOH;
      const concH = remainingH / totalVolume;
      computedPH = -Math.log10(concH);
    } else if (mmolOH > mmolH) {
      const remainingOH = mmolOH - mmolH;
      const concOH = remainingOH / totalVolume;
      computedPH = 14 + Math.log10(concOH);
    }
    simStateRef.current.titration.pH = computedPH;
    setTitrationPh(computedPH);

    simStateRef.current.diffusion.T = diffusionTemp;
    simStateRef.current.diffusion.gas = diffusionGas;
    simStateRef.current.diffusion.open = isPartitionOpen;

    simStateRef.current.trends.z = activeTrendElement.z;
    simStateRef.current.trends.property = selectedProperty;

  }, [
    isPlaying, timeScale, selectedExperiment,
    protons, neutrons, electrons,
    gasTemp, gasVolume, gasMoles,
    acidVol, acidConc, baseConc, baseAdded, isDripping,
    diffusionTemp, diffusionGas, isPartitionOpen,
    trendElementIndex, selectedProperty, activeTrendElement
  ]);

  // Main 3D Canvas
  useEffect(() => {
    const container = mountRef.current;
    if (!container || typeof window === 'undefined') return;

    const width = container.clientWidth || 400;
    const height = container.clientHeight || 400;

    const scene = new THREE.Scene();
    scene.background = new THREE.Color('#07080F');

    const camera = new THREE.PerspectiveCamera(50, width / height, 0.1, 100);
    camera.position.set(0, 1.5, 6);

    const renderer = new THREE.WebGLRenderer({ antialias: true });
    renderer.setSize(width, height);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.shadowMap.enabled = true;
    container.appendChild(renderer.domElement);

    const controls = new OrbitControls(camera, renderer.domElement);
    controls.enableDamping = true;
    controls.dampingFactor = 0.05;
    controls.maxPolarAngle = Math.PI / 2 + 0.1;

    // Lights
    const ambientLight = new THREE.AmbientLight(0xffffff, 0.45);
    scene.add(ambientLight);

    const dirLight = new THREE.DirectionalLight(0xffffff, 0.8);
    dirLight.position.set(5, 10, 7);
    scene.add(dirLight);

    const gridHelper = new THREE.GridHelper(20, 20, 0x22C5A0, 0x1E293B);
    gridHelper.position.y = -2.5;
    scene.add(gridHelper);

    // --- Materials Cache ---
    const protonMat = new THREE.MeshStandardMaterial({ color: 0xF55B6B, roughness: 0.1, metalness: 0.1 }); // Red
    const neutronMat = new THREE.MeshStandardMaterial({ color: 0x5B8CF8, roughness: 0.1, metalness: 0.1 }); // Blue
    const electronMat = new THREE.MeshBasicMaterial({ color: 0xF5A95B }); // Glowing Orange/Yellow
    const glassMat = new THREE.MeshStandardMaterial({ color: 0xffffff, transparent: true, opacity: 0.18, roughness: 0.1, metalness: 0.1 });
    const metalMat = new THREE.MeshStandardMaterial({ color: 0x8892B0, roughness: 0.3, metalness: 0.8 });
    const indicatorLiquidMat = new THREE.MeshStandardMaterial({ color: 0xffffff, transparent: true, opacity: 0.7, roughness: 0.2 });

    // --- 1. BOHR ATOMIC BUILDER GROUP ---
    const bohrGroup = new THREE.Group();
    scene.add(bohrGroup);

    // Nucleus sub-group
    const nucleusGroup = new THREE.Group();
    bohrGroup.add(nucleusGroup);

    // Shell ring lines
    const shellsCount = 3;
    const shellRadii = [1.2, 2.0, 2.8];
    const shellRings = [];
    for (let i = 0; i < shellsCount; i++) {
      const ringGeo = new THREE.RingGeometry(shellRadii[i] - 0.015, shellRadii[i] + 0.015, 64);
      const ringMat = new THREE.MeshBasicMaterial({ color: 0x647298, side: THREE.DoubleSide, transparent: true, opacity: 0.25 });
      const ring = new THREE.Mesh(ringGeo, ringMat);
      ring.rotation.x = Math.PI / 2;
      bohrGroup.add(ring);
      shellRings.push(ring);
    }

    // Dynamic Electrons meshes pool
    const maxElectrons = 10;
    const electronMeshes = [];
    const eGeo = new THREE.SphereGeometry(0.06, 16, 16);
    for (let i = 0; i < maxElectrons; i++) {
      const em = new THREE.Mesh(eGeo, electronMat);
      bohrGroup.add(em);
      electronMeshes.push(em);
    }

    // Rebuild Nucleus Spheres based on Proton/Neutron states
    const rebuildNucleus = (pCount, nCount) => {
      // Clear current meshes
      while (nucleusGroup.children.length > 0) {
        const obj = nucleusGroup.children[0];
        nucleusGroup.remove(obj);
        obj.geometry.dispose();
      }

      const sphereGeo = new THREE.SphereGeometry(0.09, 16, 16);
      const list = [];
      for (let i = 0; i < pCount; i++) list.push({ mat: protonMat });
      for (let i = 0; i < nCount; i++) list.push({ mat: neutronMat });

      // Shuffle list to mix proton and neutrons visually
      list.sort(() => Math.random() - 0.5);

      // Pack closely in a cluster using spherical offsets
      list.forEach((item, index) => {
        const m = new THREE.Mesh(sphereGeo, item.mat);
        // Distribute coordinates in shell layer offsets
        const radiusVal = 0.12 * Math.pow(index, 0.4);
        const thetaVal = Math.random() * Math.PI;
        const phiVal = Math.random() * Math.PI * 2;
        m.position.setFromSphericalCoords(radiusVal, thetaVal, phiVal);
        nucleusGroup.add(m);
      });
    };
    rebuildNucleus(3, 4); // Lithium defaults

    // --- 2. GAS LAWS GROUP ---
    const gasGroup = new THREE.Group();
    scene.add(gasGroup);

    // Chamber glass box base
    const chamberBoxGeo = new THREE.BoxGeometry(3, 4, 3);
    // Draw wireframe outlines for container
    const edges = new THREE.EdgesGeometry(chamberBoxGeo);
    const lineMat = new THREE.LineBasicMaterial({ color: 0x5B8CF8, linewidth: 2 });
    const chamberOutline = new THREE.LineSegments(edges, lineMat);
    chamberOutline.position.y = -0.5;
    gasGroup.add(chamberOutline);

    const chamberGlass = new THREE.Mesh(chamberBoxGeo, glassMat);
    chamberGlass.position.y = -0.5;
    gasGroup.add(chamberGlass);

    // Movable Piston cylinder lid
    const pistonGeo = new THREE.BoxGeometry(2.95, 0.15, 2.95);
    const piston = new THREE.Mesh(pistonGeo, metalMat);
    piston.position.set(0, 1.4, 0); // moves y between -2.2 and 1.4
    gasGroup.add(piston);

    // Gas molecules
    const maxGasParticles = 60;
    const gasParticles = [];
    const partGeo = new THREE.SphereGeometry(0.06, 8, 8);
    const partMat = new THREE.MeshStandardMaterial({ color: 0x22C5A0, roughness: 0.1 });
    for (let i = 0; i < maxGasParticles; i++) {
      const m = new THREE.Mesh(partGeo, partMat);
      gasGroup.add(m);
      
      gasParticles.push({
        mesh: m,
        pos: new THREE.Vector3(
          (Math.random() - 0.5) * 2.7,
          -2.3 + Math.random() * 3.5,
          (Math.random() - 0.5) * 2.7
        ),
        vel: new THREE.Vector3(
          (Math.random() - 0.5) * 2.0,
          (Math.random() - 0.5) * 2.0,
          (Math.random() - 0.5) * 2.0
        )
      });
    }

    // --- 3. ACID-BASE TITRATION GROUP ---
    const titrationGroup = new THREE.Group();
    scene.add(titrationGroup);

    // Titration metal stand
    const basePlateGeo = new THREE.BoxGeometry(1.6, 0.08, 1.2);
    const basePlate = new THREE.Mesh(basePlateGeo, metalMat);
    basePlate.position.set(0, -2.46, 0);
    titrationGroup.add(basePlate);

    const verticalRodGeo = new THREE.CylinderGeometry(0.04, 0.04, 3.8, 16);
    const verticalRod = new THREE.Mesh(verticalRodGeo, metalMat);
    verticalRod.position.set(-0.6, -0.6, -0.3);
    titrationGroup.add(verticalRod);

    // Buret clamp
    const clampGeo = new THREE.BoxGeometry(0.6, 0.06, 0.12);
    const clamp = new THREE.Mesh(clampGeo, metalMat);
    clamp.position.set(-0.3, 1.0, -0.15);
    titrationGroup.add(clamp);

    // Glass Buret cylinder
    const buretGeo = new THREE.CylinderGeometry(0.06, 0.06, 1.6, 16);
    const buret = new THREE.Mesh(buretGeo, glassMat);
    buret.position.set(0, 1.0, 0);
    titrationGroup.add(buret);

    // Erlenmeyer Flask underneath
    const flaskConicalGeo = new THREE.CylinderGeometry(0.12, 0.5, 0.8, 16);
    const flask = new THREE.Mesh(flaskConicalGeo, glassMat);
    flask.position.set(0, -2.0, 0);
    titrationGroup.add(flask);

    // Dynamic liquid mesh inside flask
    const liquidGeo = new THREE.CylinderGeometry(0.12, 0.48, 0.55, 16);
    const liquidMesh = new THREE.Mesh(liquidGeo, indicatorLiquidMat);
    liquidMesh.position.set(0, -2.1, 0);
    titrationGroup.add(liquidMesh);

    // Dripping drop sphere
    const dropGeo = new THREE.SphereGeometry(0.03, 8, 8);
    const dropMat = new THREE.MeshBasicMaterial({ color: 0x9B6EF8, transparent: true, opacity: 0.8 });
    const drop = new THREE.Mesh(dropGeo, dropMat);
    drop.position.set(0, 0.2, 0);
    drop.visible = false;
    titrationGroup.add(drop);

    // --- 4. MOLECULAR DIFFUSION GROUP ---
    const diffusionGroup = new THREE.Group();
    scene.add(diffusionGroup);

    // Diffusion double box
    const diffOutlineGeo = new THREE.BoxGeometry(4.0, 2.0, 2.0);
    const diffOutlineEdges = new THREE.EdgesGeometry(diffOutlineGeo);
    const diffOutline = new THREE.LineSegments(diffOutlineEdges, lineMat);
    diffOutline.position.y = -0.5;
    diffusionGroup.add(diffOutline);

    const diffGlass = new THREE.Mesh(diffOutlineGeo, glassMat);
    diffGlass.position.y = -0.5;
    diffusionGroup.add(diffGlass);

    // Partition divider plate in the center (x = 0)
    const partitionGeo = new THREE.BoxGeometry(0.08, 1.95, 1.95);
    const partition = new THREE.Mesh(partitionGeo, metalMat);
    partition.position.set(0, -0.5, 0);
    diffusionGroup.add(partition);

    // Left and Right gas molecule populations
    const maxDiffParticles = 40;
    const diffParticles = [];
    diffParticlesRef.current = diffParticles;
    for (let i = 0; i < maxDiffParticles; i++) {
      const m = new THREE.Mesh(partGeo, partMat);
      diffusionGroup.add(m);
      
      diffParticles.push({
        mesh: m,
        // Start all particles on the LEFT side (x between -1.9 and -0.1)
        pos: new THREE.Vector3(
          -1.8 + Math.random() * 1.6,
          -1.4 + Math.random() * 1.8,
          -0.8 + Math.random() * 1.6
        ),
        vel: new THREE.Vector3(0, 0, 0)
      });
    }

    // --- 5. PERIODIC TABLE TRENDS GROUP ---
    const trendsGroup = new THREE.Group();
    scene.add(trendsGroup);

    // 3D atom size display sphere
    const trendAtomGeo = new THREE.SphereGeometry(1.2, 32, 32);
    const trendAtomMat = new THREE.MeshStandardMaterial({ color: 0x3b82f6, roughness: 0.1, metalness: 0.1 });
    const trendAtom = new THREE.Mesh(trendAtomGeo, trendAtomMat);
    trendsGroup.add(trendAtom);

    // Electron shell orbits wrapper around trend atom
    const orbitContainer = new THREE.Group();
    trendsGroup.add(orbitContainer);

    // --- Dynamic Solver Runner Loops ---
    const clock = new THREE.Clock();
    let animationId;

    let lastProtons = protons;
    let lastNeutrons = neutrons;
    let titrationDropT = 0;

    const animate = () => {
      animationId = requestAnimationFrame(animate);

      const dt = clock.getDelta();
      const state = simStateRef.current;
      const cappedDt = Math.min(dt, 0.05) * (state.isPlaying ? state.timeScale : 0);

      // Hide all groups except active
      bohrGroup.visible = state.selectedExperiment === 'bohr';
      gasGroup.visible = state.selectedExperiment === 'gas';
      titrationGroup.visible = state.selectedExperiment === 'titration';
      diffusionGroup.visible = state.selectedExperiment === 'diffusion';
      trendsGroup.visible = state.selectedExperiment === 'trends';

      // Re-center camera controls target
      if (state.selectedExperiment === 'bohr') {
        controls.target.set(0, 0, 0);
      } else if (state.selectedExperiment === 'gas') {
        controls.target.set(0, -0.5, 0);
      } else if (state.selectedExperiment === 'titration') {
        controls.target.set(0, -0.6, 0);
      } else if (state.selectedExperiment === 'diffusion') {
        controls.target.set(0, -0.5, 0);
      } else if (state.selectedExperiment === 'trends') {
        controls.target.set(0, 0, 0);
      }

      // --- 1. Bohr Model Animations ---
      if (state.selectedExperiment === 'bohr') {
        // Check if protons/neutrons values changed
        if (state.bohr.protons !== lastProtons || state.bohr.neutrons !== lastNeutrons) {
          rebuildNucleus(state.bohr.protons, state.bohr.neutrons);
          lastProtons = state.bohr.protons;
          lastNeutrons = state.bohr.neutrons;
        }

        // Rotate nucleus slowly
        nucleusGroup.rotation.y += cappedDt * 0.2;
        nucleusGroup.rotation.x += cappedDt * 0.1;

        // Render Shell orbitals (hide those outer if no electrons fill them)
        const activeElem = ELEMENTS.find(e => e.z === state.bohr.protons) || ELEMENTS[0];
        const shells = activeElem.shell; // e.g. Lithium: [2, 1] (2 in shell 1, 1 in shell 2)

        shellRings.forEach((ring, idx) => {
          ring.visible = idx < shells.length;
        });

        // Distribute electrons on active orbits
        let electronIndex = 0;
        shells.forEach((electronsInShell, shellIdx) => {
          const radius = shellRadii[shellIdx];
          const speed = 1.6 / radius; // outer shells rotate slower

          for (let eIdx = 0; eIdx < electronsInShell; eIdx++) {
            if (electronIndex >= maxElectrons) break;

            const mesh = electronMeshes[electronIndex];
            mesh.visible = true;

            // angle distribution
            const initialAngle = (eIdx / electronsInShell) * Math.PI * 2;
            const currentAngle = initialAngle + clock.getElapsedTime() * speed;

            const ex = Math.cos(currentAngle) * radius;
            const ez = Math.sin(currentAngle) * radius;
            mesh.position.set(ex, 0, ez);

            electronIndex++;
          }
        });

        // Hide remaining meshes in pool
        for (let i = electronIndex; i < maxElectrons; i++) {
          electronMeshes[i].visible = false;
        }
      }

      // --- 2. Gas Laws (PV=nRT) Animations ---
      if (state.selectedExperiment === 'gas') {
        const g = state.gas;

        // Piston slider position: maps V (1.0 to 5.0) to height Y (-1.5 to 1.4)
        const pistonY = -2.2 + (g.V / 5.0) * 3.6;
        piston.position.y = pistonY;

        // Bounce molecules inside box borders
        const tempSpeedFactor = Math.sqrt(g.T / 300); // speed scales with sqrt(T)
        const activeCount = Math.min(maxGasParticles, Math.round(g.n * 15));

        gasParticles.forEach((p, idx) => {
          if (idx >= activeCount) {
            p.mesh.visible = false;
            return;
          }
          p.mesh.visible = true;

          // Integrate position
          p.pos.addScaledVector(p.vel, cappedDt * tempSpeedFactor);
          p.mesh.position.copy(p.pos);

          // Box collision borders: X: [-1.4, 1.4], Z: [-1.4, 1.4], Y: [-2.4, pistonY - 0.1]
          const boundaryX = 1.42;
          const boundaryZ = 1.42;
          const boundaryMinY = -2.42;
          const boundaryMaxY = pistonY - 0.1;

          if (p.pos.x > boundaryX) { p.pos.x = boundaryX; p.vel.x *= -1; }
          if (p.pos.x < -boundaryX) { p.pos.x = -boundaryX; p.vel.x *= -1; }
          if (p.pos.z > boundaryZ) { p.pos.z = boundaryZ; p.vel.z *= -1; }
          if (p.pos.z < -boundaryZ) { p.pos.z = -boundaryZ; p.vel.z *= -1; }
          if (p.pos.y > boundaryMaxY) { p.pos.y = boundaryMaxY; p.vel.y *= -1; }
          if (p.pos.y < boundaryMinY) { p.pos.y = boundaryMinY; p.vel.y *= -1; }
        });
      }

      // --- 3. Acid-Base Reaction Titration Animations ---
      if (state.selectedExperiment === 'titration') {
        const tit = state.titration;

        // Drop animation dripping from buret (y=0.2) to flask (y=-1.8)
        if (tit.isDripping) {
          drop.visible = true;
          titrationDropT += cappedDt * 3.0; // speed of falling drop
          const dropY = 0.2 - titrationDropT * 2.0;

          if (dropY <= -1.8) {
            // Drop hits flask liquid, increments base added
            setBaseAdded(prev => {
              const nextVal = prev + 0.5; // add 0.5ml per drop
              if (nextVal >= 50) {
                setIsDripping(false);
                return 50;
              }
              return nextVal;
            });
            titrationDropT = 0;
            drop.position.y = 0.2;
          } else {
            drop.position.y = dropY;
          }
        } else {
          drop.visible = false;
          titrationDropT = 0;
        }

        // Liquid height inside flask: scales with total volume
        const totalVol = tit.acidVol + tit.baseAdded;
        const volumeScale = Math.min(1.5, totalVol / 50);
        liquidMesh.scale.y = volumeScale;
        // Adjust liquid y position to stick to bottom of flask
        liquidMesh.position.y = -2.3 + (0.28 * volumeScale);

        // Phenolphthalein color interpolation: colorless/transparent at pH <= 8.2, pink at pH > 8.2
        const pH = tit.pH;
        let liquidColor = new THREE.Color(0xffffff); // clear
        let opacity = 0.4;
        if (pH > 8.2) {
          const t = Math.min(1.0, (pH - 8.2) / 1.8);
          liquidColor.lerp(new THREE.Color(0xF55B6B), t); // lerp to magenta pink
          opacity = 0.4 + t * 0.3; // become slightly more saturated
        }
        indicatorLiquidMat.color.copy(liquidColor);
        indicatorLiquidMat.opacity = opacity;
      }

      // --- 4. Molecular Diffusion Animations ---
      if (state.selectedExperiment === 'diffusion') {
        const diff = state.diffusion;

        // Animate partition divider: slide up to Y=1.5 if partition is open
        const targetY = diff.open ? 1.5 : -0.5;
        partition.position.y += (targetY - partition.position.y) * 5.0 * cappedDt;

        // Diffusion Speed: root mean square velocity scales with sqrt(T / Mw)
        // Gas molecular weights: Helium = 4, Neon = 20, Xenon = 131
        let mw = 4;
        let gasColor = 0x22C5A0; // green for Helium
        if (diff.gas === 'neon') { mw = 20; gasColor = 0xF5A95B; } // orange
        if (diff.gas === 'xenon') { mw = 131; gasColor = 0x5B8CF8; } // blue

        partMat.color.setHex(gasColor);
        const speed = 1.8 * Math.sqrt(diff.T / 300) / Math.sqrt(mw / 4);

        diffParticles.forEach((p) => {
          p.mesh.visible = true;

          // If partition is open or particles are on the left, let them move
          if (p.vel.lengthSq() === 0) {
            // Assign random unit velocity vectors on open
            p.vel.set(
              (Math.random() - 0.5) * speed,
              (Math.random() - 0.5) * speed,
              (Math.random() - 0.5) * speed
            );
          }

          // Scale velocity to current speed settings
          p.vel.normalize().multiplyScalar(speed);

          p.pos.addScaledVector(p.vel, cappedDt);
          p.mesh.position.copy(p.pos);

          // Box collision borders: X: [-1.9, 1.9], Y: [-1.4, 0.4], Z: [-0.9, 0.9]
          // If partition is CLOSED (partition.position.y < 0), X: [-1.9, -0.05] on left side
          const minX = -1.9;
          const maxX = 1.9;
          const minY = -1.4;
          const maxY = 0.4;
          const minZ = -0.9;
          const maxZ = 0.9;

          // X border collision
          if (partition.position.y < 0.0) {
            // Partition is closed, particles stay on left (x <= -0.06)
            if (p.pos.x > -0.08) { p.pos.x = -0.08; p.vel.x *= -1; }
          } else {
            // Partition is open, particles bounce off far right wall
            if (p.pos.x > maxX) { p.pos.x = maxX; p.vel.x *= -1; }
          }

          if (p.pos.x < minX) { p.pos.x = minX; p.vel.x *= -1; }
          if (p.pos.y > maxY) { p.pos.y = maxY; p.vel.y *= -1; }
          if (p.pos.y < minY) { p.pos.y = minY; p.vel.y *= -1; }
          if (p.pos.z > maxZ) { p.pos.z = maxZ; p.vel.z *= -1; }
          if (p.pos.z < minZ) { p.pos.z = minZ; p.vel.z *= -1; }
        });
      }

      // --- 5. Periodic Table Trends Animations ---
      if (state.selectedExperiment === 'trends') {
        const trend = state.trends;
        const elem = ELEMENTS.find(e => e.z === trend.z) || ELEMENTS[0];

        // Animate atom sphere size based on property select
        let targetRadiusScale = 1.0;
        let activeColor = new THREE.Color(0x3b82f6); // default blue

        if (trend.property === 'radius') {
          // Radius range: 31 (He) to 152 (Li). Map to scale (0.4 to 1.8)
          targetRadiusScale = 0.4 + (elem.radius / 152) * 1.4;
          // Color based on size: smaller is yellow/orange, larger is blue
          activeColor.lerp(new THREE.Color(0xF5A95B), 1.0 - (elem.radius / 152));
        } else if (trend.property === 'electronegativity') {
          // Electronegativity range: 0 (Noble) to 3.98 (F). Map scale (0.5 to 1.6)
          targetRadiusScale = 0.5 + (elem.electronegativity / 3.98) * 1.1;
          // Color based on electronegativity strength: higher is intense red, lower is blue
          activeColor.lerp(new THREE.Color(0xF55B6B), elem.electronegativity / 3.98);
        }

        trendAtom.scale.set(targetRadiusScale, targetRadiusScale, targetRadiusScale);
        trendAtomMat.color.copy(activeColor);

        // Spin trends atom
        trendAtom.rotation.y += cappedDt * 0.3;

        // Render orbiting rings representing Bohr shell counts
        // Clear old shells
        while (orbitContainer.children.length > 0) {
          const r = orbitContainer.children[0];
          orbitContainer.remove(r);
          r.geometry.dispose();
        }

        const shells = elem.shell;
        shells.forEach((elecCount, shellIdx) => {
          const orbitRadius = targetRadiusScale * (1.3 + shellIdx * 0.5);
          const orbitGeo = new THREE.RingGeometry(orbitRadius - 0.01, orbitRadius + 0.01, 32);
          const orbitMat = new THREE.MeshBasicMaterial({ color: 0xffffff, side: THREE.DoubleSide, transparent: true, opacity: 0.15 });
          const o = new THREE.Mesh(orbitGeo, orbitMat);
          o.rotation.x = Math.PI / 2;
          orbitContainer.add(o);
        });
      }

      controls.update();
      renderer.render(scene, camera);
    };

    animate();

    const handleResize = () => {
      if (!container || !camera || !renderer) return;
      const w = container.clientWidth;
      const h = container.clientHeight;
      camera.aspect = w / h;
      camera.updateProjectionMatrix();
      renderer.setSize(w, h);
    };
    window.addEventListener('resize', handleResize);

    return () => {
      window.removeEventListener('resize', handleResize);
      if (animationId) cancelAnimationFrame(animationId);
      if (renderer && container.contains(renderer.domElement)) {
        container.removeChild(renderer.domElement);
      }
      renderer.dispose();
      controls.dispose();
    };
  }, []);

  if (labMode === 'phet') {
    return (
      <div style={featureStyleFunctions.s0({isMobile})}>
        <PhetSimViewer
          subject="chemistry"
          activeSimId={activePhetSim}
          onSelectSim={setActivePhetSim}
          onViewModeChange={setLabMode}
          currentViewMode={labMode}
        />
      </div>
    );
  }

  return (
    <div style={featureStyleFunctions.s1({isStacked})}>
      
      {/* --- PARAMETER SIDEBAR PANEL --- */}
      <div style={featureStyleFunctions.s2({isStacked})}>
        {/* Lab Header */}
        <div style={inlineStyles.s0}>
          <div style={inlineStyles.s1}>
            <button
              type="button"
              onClick={() => router.push('/vedika-labs')}
              style={inlineStyles.s2}
              title="Back to Vedika Labs"
            >
              <ArrowLeft size={13} />
              <span>Back</span>
            </button>
            <FlaskConical size={20} color="#22C5A0" />
            <div>
              <h2 style={inlineStyles.s3}>Chemistry Lab</h2>
              <span style={inlineStyles.s4}>Molecular Sandbox & Solver</span>
            </div>
          </div>
          <button
            onClick={() => setLabMode('phet')}
            style={inlineStyles.s5}
          >
            <Maximize2 size={12} />
            HTML5 Sim
          </button>
        </div>

        {/* Experiment Selector */}
        <div style={inlineStyles.s6}>
          <label style={inlineStyles.s7}>
            Select Experiment
          </label>
          <select
            value={selectedExperiment}
            onChange={(e) => {
              setSelectedExperiment(e.target.value);
              setIsPlaying(true);
              // Reset titration triggers
              setBaseAdded(0.0);
              setIsDripping(false);
              setIsPartitionOpen(false);
            }}
            style={inlineStyles.s8}
          >
            <option value="bohr">⚛️ Bohr Atomic Builder</option>
            <option value="gas">🧪 Gas Laws Simulator (PV=nRT)</option>
            <option value="titration">⚗️ Acid-Base Titration Reactions</option>
            <option value="diffusion">🌬️ Molecular Gas Diffusion</option>
            <option value="trends">📈 Periodic Table Trends</option>
          </select>
        </div>

        {/* Dynamic scroll sidebar controls */}
        <div style={inlineStyles.s9} className="sandbox-scroll">
          
          {/* BOHR ATOMIC BUILDER CONTROLS */}
          {selectedExperiment === 'bohr' && (
            <div style={inlineStyles.s10}>
              <div style={inlineStyles.s11}>
                <Sliders size={13} /> Nuclear Configuration
              </div>

              {/* Protons Slider */}
              <div style={inlineStyles.s12}>
                <div style={inlineStyles.s13}>
                  <span style={inlineStyles.s14}>Protons (Charge Z)</span>
                  <span style={inlineStyles.s15}>{protons} p⁺</span>
                </div>
                <input
                  type="range" min={1} max={10} step={1}
                  value={protons}
                  onChange={(e) => {
                    const z = parseInt(e.target.value);
                    setProtons(z);
                    // Match neutrons and electrons to maintain stable neutral isotope references
                    const ref = ELEMENTS.find(el => el.z === z) || ELEMENTS[0];
                    setElectrons(z);
                    setNeutrons(z === 1 ? 0 : z === 3 ? 4 : z === 4 ? 5 : z === 9 ? 10 : z);
                  }}
                  style={inlineStyles.s16}
                />
              </div>

              {/* Neutrons Slider */}
              <div style={inlineStyles.s17}>
                <div style={inlineStyles.s18}>
                  <span style={inlineStyles.s19}>Neutrons (Isotope)</span>
                  <span style={inlineStyles.s20}>{neutrons} n⁰</span>
                </div>
                <input
                  type="range" min={0} max={12} step={1}
                  value={neutrons} onChange={(e) => setNeutrons(parseInt(e.target.value))}
                  style={inlineStyles.s21}
                />
              </div>

              {/* Element Info Card */}
              <div style={inlineStyles.s22}>
                <span style={inlineStyles.s23}>Identified Element Info</span>
                <div style={inlineStyles.s24}>
                  <span style={inlineStyles.s25}>Element Name:</span>
                  <strong style={inlineStyles.s26}>{activeElement.name} ({activeElement.symbol})</strong>
                </div>
                <div style={inlineStyles.s27}>
                  <span style={inlineStyles.s28}>Classification:</span>
                  <span style={inlineStyles.s29}>{activeElement.category}</span>
                </div>
                <div style={inlineStyles.s30}>
                  <span style={inlineStyles.s31}>Atomic Mass:</span>
                  <span style={inlineStyles.s32}>{(protons + neutrons)} u</span>
                </div>
              </div>
            </div>
          )}

          {/* GAS LAWS CONTROLS */}
          {selectedExperiment === 'gas' && (
            <div style={inlineStyles.s33}>
              <div style={inlineStyles.s34}>
                <Sliders size={13} /> Thermodynamic variables
              </div>

              {/* Temperature */}
              <div style={inlineStyles.s35}>
                <div style={inlineStyles.s36}>
                  <span style={inlineStyles.s37}>Temperature (T)</span>
                  <span style={inlineStyles.s38}>{gasTemp} K</span>
                </div>
                <input
                  type="range" min={100} max={600} step={10}
                  value={gasTemp} onChange={(e) => setGasTemp(parseInt(e.target.value))}
                  style={inlineStyles.s39}
                />
              </div>

              {/* Volume */}
              <div style={inlineStyles.s40}>
                <div style={inlineStyles.s41}>
                  <span style={inlineStyles.s42}>Chamber Volume (V)</span>
                  <span style={inlineStyles.s43}>{gasVolume.toFixed(1)} Liters</span>
                </div>
                <input
                  type="range" min={1.0} max={5.0} step={0.1}
                  value={gasVolume} onChange={(e) => setGasVolume(parseFloat(e.target.value))}
                  style={inlineStyles.s44}
                />
              </div>

              {/* Moles */}
              <div style={inlineStyles.s45}>
                <div style={inlineStyles.s46}>
                  <span style={inlineStyles.s47}>Gas amount (n)</span>
                  <span style={inlineStyles.s48}>{gasMoles.toFixed(1)} moles</span>
                </div>
                <input
                  type="range" min={0.5} max={4.0} step={0.1}
                  value={gasMoles} onChange={(e) => setGasMoles(parseFloat(e.target.value))}
                  style={inlineStyles.s49}
                />
              </div>

              {/* Pressure Readout */}
              <div style={inlineStyles.s50}>
                <span style={inlineStyles.s51}>Ideal Gas Solver</span>
                <div style={inlineStyles.s52}>
                  <span style={inlineStyles.s53}>Computed Pressure (P):</span>
                  <strong style={inlineStyles.s54}>{gasPressure.toFixed(2)} atm</strong>
                </div>
              </div>
            </div>
          )}

          {/* TITRATION CONTROLS */}
          {selectedExperiment === 'titration' && (
            <div style={inlineStyles.s55}>
              <div style={inlineStyles.s56}>
                <Sliders size={13} /> Titration concentrations
              </div>

              {/* Acid Conc HCl */}
              <div style={inlineStyles.s57}>
                <div style={inlineStyles.s58}>
                  <span style={inlineStyles.s59}>Acid Conc [HCl]</span>
                  <span style={inlineStyles.s60}>{acidConc.toFixed(2)} M</span>
                </div>
                <input
                  type="range" min={0.05} max={0.5} step={0.01}
                  value={acidConc} onChange={(e) => setAcidConc(parseFloat(e.target.value))}
                  style={inlineStyles.s61}
                />
              </div>

              {/* Base Conc NaOH */}
              <div style={inlineStyles.s62}>
                <div style={inlineStyles.s63}>
                  <span style={inlineStyles.s64}>Base Conc [NaOH]</span>
                  <span style={inlineStyles.s65}>{baseConc.toFixed(2)} M</span>
                </div>
                <input
                  type="range" min={0.05} max={0.5} step={0.01}
                  value={baseConc} onChange={(e) => setBaseConc(parseFloat(e.target.value))}
                  style={inlineStyles.s66}
                />
              </div>

              {/* Drip stopcock control button */}
              <button
                onClick={() => setIsDripping(!isDripping)}
                disabled={baseAdded >= 50}
                style={featureStyleFunctions.s3({isDripping,baseAdded})}
              >
                <Zap size={12} fill="currentColor" /> {isDripping ? 'Stop Stopcock' : 'Open Stopcock (Drip)'}
              </button>

              {/* Titration Live Readout */}
              <div style={inlineStyles.s67}>
                <span style={inlineStyles.s68}>Reaction Monitoring</span>
                <div style={inlineStyles.s69}>
                  <span style={inlineStyles.s70}>Base Added (NaOH):</span>
                  <strong style={inlineStyles.s71}>{baseAdded.toFixed(1)} ml</strong>
                </div>
                <div style={inlineStyles.s72}>
                  <span style={inlineStyles.s73}>pH Level:</span>
                  <strong style={featureStyleFunctions.s4({titrationPh})}>{titrationPh.toFixed(2)}</strong>
                </div>
              </div>
            </div>
          )}

          {/* MOLECULAR DIFFUSION CONTROLS */}
          {selectedExperiment === 'diffusion' && (
            <div style={inlineStyles.s74}>
              <div style={inlineStyles.s75}>
                <Sliders size={13} /> Diffusion variables
              </div>

              {/* Temperature */}
              <div style={inlineStyles.s76}>
                <div style={inlineStyles.s77}>
                  <span style={inlineStyles.s78}>Temperature (T)</span>
                  <span style={inlineStyles.s79}>{diffusionTemp} K</span>
                </div>
                <input
                  type="range" min={100} max={600} step={10}
                  value={diffusionTemp} onChange={(e) => setDiffusionTemp(parseInt(e.target.value))}
                  style={inlineStyles.s80}
                />
              </div>

              {/* Gas selection */}
              <div style={inlineStyles.s81}>
                <span style={inlineStyles.s82}>Gas Molecular Weight</span>
                <select
                  value={diffusionGas}
                  onChange={(e) => setDiffusionGas(e.target.value)}
                  style={inlineStyles.s83}
                >
                  <option value="helium">🎈 Helium (Mw = 4 g/mol)</option>
                  <option value="neon">🔋 Neon (Mw = 20 g/mol)</option>
                  <option value="xenon">💎 Xenon (Mw = 131 g/mol)</option>
                </select>
              </div>

              {/* Partition toggle */}
              <button
                onClick={() => setIsPartitionOpen(!isPartitionOpen)}
                style={featureStyleFunctions.s5({isPartitionOpen})}
              >
                <Compass size={12} /> {isPartitionOpen ? 'Close Chamber Partition' : 'Open Chamber Partition'}
              </button>
            </div>
          )}

          {/* PERIODIC TABLE TRENDS CONTROLS */}
          {selectedExperiment === 'trends' && (
            <div style={inlineStyles.s84}>
              <div style={inlineStyles.s85}>
                <Sliders size={13} /> Trends Properties
              </div>

              {/* Element Selection */}
              <div style={inlineStyles.s86}>
                <span style={inlineStyles.s87}>Select Period 1 & 2 Element</span>
                <select
                  value={trendElementIndex}
                  onChange={(e) => setTrendElementIndex(parseInt(e.target.value))}
                  style={inlineStyles.s88}
                >
                  {ELEMENTS.map((el, idx) => (
                    <option key={el.z} value={idx}>
                      Z = {el.z}: {el.name} ({el.symbol})
                    </option>
                  ))}
                </select>
              </div>

              {/* Property Selection */}
              <div style={inlineStyles.s89}>
                <span style={inlineStyles.s90}>Visualized Property</span>
                <div style={inlineStyles.s91}>
                  {[
                    { label: 'Atomic Radius', val: 'radius' },
                    { label: 'Electronegativity', val: 'electronegativity' }
                  ].map(prop => (
                    <button
                      key={prop.val}
                      onClick={() => setSelectedProperty(prop.val)}
                      style={featureStyleFunctions.s6({selectedProperty,prop})}
                    >
                      {prop.label}
                    </button>
                  ))}
                </div>
              </div>

              {/* Readout values */}
              <div style={inlineStyles.s92}>
                <span style={inlineStyles.s93}>Property Values</span>
                <div style={inlineStyles.s94}>
                  <span style={inlineStyles.s95}>Atomic Radius:</span>
                  <strong style={inlineStyles.s96}>{activeTrendElement.radius} pm</strong>
                </div>
                <div style={inlineStyles.s97}>
                  <span style={inlineStyles.s98}>Electronegativity:</span>
                  <strong style={inlineStyles.s99}>{activeTrendElement.electronegativity > 0 ? activeTrendElement.electronegativity.toFixed(2) : 'N/A'}</strong>
                </div>
              </div>
            </div>
          )}

        </div>

        {/* Bottom Playback toolbar */}
        <div style={inlineStyles.s100}>
          <div style={inlineStyles.s101}>
            <button
              onClick={() => setIsPlaying(!isPlaying)}
              style={featureStyleFunctions.s7({isPlaying})}
            >
              {isPlaying ? <Pause size={12} /> : <Play size={12} fill="currentColor" />}
              {isPlaying ? 'Pause' : 'Play'}
            </button>

            <button
              onClick={() => {
                if (selectedExperiment === 'gas') {
                  setGasTemp(300);
                  setGasVolume(3.0);
                  setGasMoles(2.0);
                } else if (selectedExperiment === 'titration') {
                  setBaseAdded(0.0);
                  setIsDripping(false);
                } else if (selectedExperiment === 'diffusion') {
                  setIsPartitionOpen(false);
                  // Resets particle left coordinates
                  diffParticlesRef.current?.forEach(p => {
                    p.pos.set(
                      -1.8 + Math.random() * 1.6,
                      -1.4 + Math.random() * 1.8,
                      -0.8 + Math.random() * 1.6
                    );
                    p.vel.set(0, 0, 0);
                  });
                }
              }}
              title="Reset Positions"
              style={inlineStyles.s102}
            >
              <RotateCcw size={12} />
            </button>
          </div>

          {/* TimeScale */}
          <div style={inlineStyles.s103}>
            {[
              { label: '1.0x', val: 1.0 },
              { label: '0.25x (Slow)', val: 0.25 }
            ].map(item => (
              <button
                key={item.label}
                onClick={() => setTimeScale(item.val)}
                style={featureStyleFunctions.s8({timeScale,item})}
              >
                {item.label}
              </button>
            ))}
          </div>
        </div>

      </div>

      {/* --- 3D CANVAS MOUNT --- */}
      <div style={featureStyleFunctions.s9({isStacked})}>
        <div ref={mountRef} style={featureStyleFunctions.s10({isStacked})} />
      </div>

    </div>
  );
}
