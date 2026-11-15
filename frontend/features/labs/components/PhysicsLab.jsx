'use client';
import * as featureStyleFunctions from '@/features/labs/styles/PhysicsLab.ff53394c.styles.js';

import inlineStyles from '@/features/labs/styles/PhysicsLab.styles';


import { useState, useEffect, useRef } from 'react';
import { useRouter } from 'next/navigation';
import * as THREE from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls';
import {
  Play, Pause, RotateCcw, Award, Sliders, Info, Zap,
  ChevronRight, HelpCircle, Activity, Lightbulb, Compass, AlertCircle, Maximize2, ArrowLeft
} from 'lucide-react';
import { T } from '@/shared/design-system/theme';
import { useMediaQuery, isMobileMQ, isTabletMQ } from '@/lib/useMediaQuery';

import PhetSimViewer from '@/components/labs/PhetSimViewer';
import { getMascotBridge } from '@/lib/mascotBridge';

// --- Helical Spring Path Generator Helper ---
class HelixPath extends THREE.Curve {
  constructor(radius = 0.25, turns = 10, height = 2) {
    super();
    this.radius = radius;
    this.turns = turns;
    this.height = height;
  }
  getPoint(t) {
    const angle = t * Math.PI * 2 * this.turns;
    const x = Math.cos(angle) * this.radius;
    const z = Math.sin(angle) * this.radius;
    const y = -t * this.height; // starts at y=0, extends downward
    return new THREE.Vector3(x, y, z);
  }
}

export default function PhysicsLab() {
  const router = useRouter();
  const isMobile = useMediaQuery(isMobileMQ);
  const isTablet = useMediaQuery(isTabletMQ);
  const isStacked = isMobile;
  const [labMode, setLabMode] = useState('phet'); // 'phet' | '3d'
  const [activePhetSim, setActivePhetSim] = useState('circuit-construction-kit-dc');
  const [selectedExperiment, setSelectedExperiment] = useState('pendulum');
  const [isPlaying, setIsPlaying] = useState(true);
  const [timeScale, setTimeScale] = useState(1); // 1 = normal, 0.25 = slow motion

  // URL Query Parameters & Mascot Bridge Inner Page Controller
  useEffect(() => {
    if (typeof window === 'undefined') return;

    const applyQueryParams = () => {
      const params = new URLSearchParams(window.location.search);
      const exp = params.get('experiment') || params.get('exp');
      const mode = params.get('mode');
      const phet = params.get('sim') || params.get('phet');

      if (exp) {
        const validExps = ['pendulum', 'projectile', 'refraction', 'spring', 'circuit'];
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
          const validExps = ['pendulum', 'projectile', 'refraction', 'spring', 'circuit'];
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
          if (exp && ['pendulum', 'projectile', 'refraction', 'spring', 'circuit'].includes(exp.toLowerCase())) {
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
    bridge.sendActivityUpdate('physics_lab', {
      experiment: selectedExperiment,
      mode: labMode,
      phetSim: activePhetSim
    });
    return () => {
      bridge.sendActivityUpdate('browsing', { page: window.location.pathname });
    };
  }, [selectedExperiment, labMode, activePhetSim]);
  
  // --- Simulation Parameters & Variables ---
  // 1. Pendulum
  const [pendulumLength, setPendulumLength] = useState(2.5); // meters
  const [pendulumMass, setPendulumMass] = useState(2); // kg
  const [pendulumGravity, setPendulumGravity] = useState(9.8); // m/s^2 (preset)
  const [pendulumDamping, setPendulumDamping] = useState(0.1); // damping coefficient
  
  // 2. Projectile Motion
  const [projectileVelocity, setProjectileVelocity] = useState(15); // m/s
  const [projectileAngle, setProjectileAngle] = useState(45); // degrees
  const [projectileGravity, setProjectileGravity] = useState(9.8); // m/s^2
  const [projectileStats, setProjectileStats] = useState({ range: 0, height: 0, time: 0 });
  const [projectileFireTrigger, setProjectileFireTrigger] = useState(0); // counter to fire

  // 3. Refraction & Reflection
  const [refractionAngle, setRefractionAngle] = useState(45); // incident angle in degrees
  const [refractionN1, setRefractionN1] = useState(1.0); // refractive index 1 (Air)
  const [refractionN2, setRefractionN2] = useState(1.5); // refractive index 2 (Glass)
  const [isTIR, setIsTIR] = useState(false); // Total Internal Reflection warning flag

  // 4. Spring Mass
  const [springConstant, setSpringConstant] = useState(15); // N/m
  const [springMass, setSpringMass] = useState(1.5); // kg
  const [springDamping, setSpringDamping] = useState(0.08);

  // 5. Ohm's Law Circuit
  const [circuitVoltage, setCircuitVoltage] = useState(9); // Volts
  const [circuitResistance, setCircuitResistance] = useState(15); // Ohms
  const [circuitCurrent, setCircuitCurrent] = useState(0.6); // Amperes

  // DOM Canvas & Scene Ref
  const mountRef = useRef(null);
  const simStateRef = useRef({
    isPlaying: true,
    timeScale: 1,
    selectedExperiment: 'pendulum',
    // Pendulum dynamic states
    pendulum: { length: 2.5, mass: 2, gravity: 9.8, damping: 0.1, angle: Math.PI / 4, velocity: 0 },
    // Projectile dynamic states
    projectile: { velocity: 15, angle: 45, gravity: 9.8, t: 0, maxT: 0, isFlying: false, fireTrigger: 0 },
    // Refraction dynamic states
    refraction: { angle: 45, n1: 1.0, n2: 1.5 },
    // Spring Mass dynamic states
    spring: { k: 15, mass: 1.5, damping: 0.08, displacement: 1.0, velocity: 0 },
    // Circuit dynamic states
    circuit: { voltage: 9, resistance: 15, current: 0.6 }
  });

  // Keep ref synchronized with states
  useEffect(() => {
    simStateRef.current.isPlaying = isPlaying;
    simStateRef.current.timeScale = timeScale;
    simStateRef.current.selectedExperiment = selectedExperiment;
    
    // Pendulum
    simStateRef.current.pendulum.length = pendulumLength;
    simStateRef.current.pendulum.mass = pendulumMass;
    simStateRef.current.pendulum.gravity = pendulumGravity;
    simStateRef.current.pendulum.damping = pendulumDamping;

    // Projectile
    simStateRef.current.projectile.velocity = projectileVelocity;
    simStateRef.current.projectile.angle = projectileAngle;
    simStateRef.current.projectile.gravity = projectileGravity;
    simStateRef.current.projectile.fireTrigger = projectileFireTrigger;

    // Refraction
    simStateRef.current.refraction.angle = refractionAngle;
    simStateRef.current.refraction.n1 = refractionN1;
    simStateRef.current.refraction.n2 = refractionN2;

    // Spring
    simStateRef.current.spring.k = springConstant;
    simStateRef.current.spring.mass = springMass;
    simStateRef.current.spring.damping = springDamping;

    // Circuit
    simStateRef.current.circuit.voltage = circuitVoltage;
    simStateRef.current.circuit.resistance = circuitResistance;
    const current = circuitVoltage / circuitResistance;
    simStateRef.current.circuit.current = current;
    setCircuitCurrent(current);

  }, [
    isPlaying, timeScale, selectedExperiment,
    pendulumLength, pendulumMass, pendulumGravity, pendulumDamping,
    projectileVelocity, projectileAngle, projectileGravity, projectileFireTrigger,
    refractionAngle, refractionN1, refractionN2,
    springConstant, springMass, springDamping,
    circuitVoltage, circuitResistance
  ]);

  // Sync Projectile flight triggers
  useEffect(() => {
    if (projectileFireTrigger > 0) {
      simStateRef.current.projectile.t = 0;
      simStateRef.current.projectile.isFlying = true;
      const angleRad = (projectileAngle * Math.PI) / 180;
      const tFlight = (2 * projectileVelocity * Math.sin(angleRad)) / projectileGravity;
      simStateRef.current.projectile.maxT = tFlight;
    }
  }, [projectileFireTrigger]);

  // --- SVGs live energy / quantitative output rendering ---
  // Simple Pendulum Energy bar graphs
  const [pendulumEnergy, setPendulumEnergy] = useState({ ke: 0, pe: 0, te: 0 });
  const [springEnergy, setSpringEnergy] = useState({ ke: 0, pe: 0, te: 0 });

  // Main Three.js Runner
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
    controls.maxPolarAngle = Math.PI / 2 + 0.1; // don't go below ground too much

    // --- Lights Setup ---
    const ambientLight = new THREE.AmbientLight(0xffffff, 0.4);
    scene.add(ambientLight);

    const dirLight = new THREE.DirectionalLight(0xffffff, 0.8);
    dirLight.position.set(5, 10, 7);
    dirLight.castShadow = true;
    scene.add(dirLight);

    // Ground Grid helper
    const gridHelper = new THREE.GridHelper(20, 20, 0x5B8CF8, 0x1E293B);
    gridHelper.position.y = -2.5;
    scene.add(gridHelper);

    // --- Geometries & Materials Cache ---
    // Universal Materials
    const metalMat = new THREE.MeshStandardMaterial({ color: 0x8892B0, roughness: 0.2, metalness: 0.8 });
    const pivotMat = new THREE.MeshStandardMaterial({ color: 0x3b82f6, roughness: 0.1 });
    const redBobMat = new THREE.MeshStandardMaterial({ color: 0xF55B6B, roughness: 0.3, metalness: 0.2 });
    const dashedLineMat = new THREE.LineDashedMaterial({ color: 0x647298, dashSize: 0.1, gapSize: 0.05 });
    
    // --- 1. PENDULUM GROUP ---
    const pendulumGroup = new THREE.Group();
    scene.add(pendulumGroup);

    // Base Stand
    const standGeo = new THREE.CylinderGeometry(0.08, 0.08, 3.2, 16);
    const stand = new THREE.Mesh(standGeo, metalMat);
    stand.position.set(-1.2, -0.9, -0.5);
    pendulumGroup.add(stand);

    const crossbarGeo = new THREE.CylinderGeometry(0.06, 0.06, 1.5, 16);
    const crossbar = new THREE.Mesh(crossbarGeo, metalMat);
    crossbar.rotation.z = Math.PI / 2;
    crossbar.position.set(-0.5, 0.7, -0.5);
    pendulumGroup.add(crossbar);

    const pivotGeo = new THREE.SphereGeometry(0.12, 16, 16);
    const pivot = new THREE.Mesh(pivotGeo, pivotMat);
    pivot.position.set(0, 0.7, -0.5);
    pendulumGroup.add(pivot);

    // Dynamic Pendulum String & Bob
    const bobGeo = new THREE.SphereGeometry(0.24, 32, 32);
    const bob = new THREE.Mesh(bobGeo, redBobMat);
    pendulumGroup.add(bob);

    // String Line
    const stringPoints = [new THREE.Vector3(0, 0.7, -0.5), new THREE.Vector3(0, -1.8, -0.5)];
    const stringGeo = new THREE.BufferGeometry().setFromPoints(stringPoints);
    const stringMat = new THREE.LineBasicMaterial({ color: 0x5B8CF8, linewidth: 2 });
    const stringLine = new THREE.Line(stringGeo, stringMat);
    pendulumGroup.add(stringLine);

    // Vector arrows
    const velocityArrow = new THREE.ArrowHelper(
      new THREE.Vector3(1, 0, 0),
      new THREE.Vector3(0, 0, 0),
      0,
      0x22C5A0, // green
      0.15,
      0.08
    );
    const accelArrow = new THREE.ArrowHelper(
      new THREE.Vector3(0, -1, 0),
      new THREE.Vector3(0, 0, 0),
      0,
      0xF55B6B, // red
      0.15,
      0.08
    );
    pendulumGroup.add(velocityArrow);
    pendulumGroup.add(accelArrow);

    // --- 2. PROJECTILE GROUP ---
    const projectileGroup = new THREE.Group();
    scene.add(projectileGroup);

    // Cannon Launcher
    const cannonBaseGeo = new THREE.CylinderGeometry(0.25, 0.25, 0.08, 16);
    const cannonBase = new THREE.Mesh(cannonBaseGeo, metalMat);
    cannonBase.position.set(-2, -2.46, 0);
    projectileGroup.add(cannonBase);

    const barrelGeo = new THREE.CylinderGeometry(0.12, 0.12, 0.8, 16);
    const barrel = new THREE.Mesh(barrelGeo, metalMat);
    barrel.position.set(-2, -2.2, 0);
    projectileGroup.add(barrel);

    const ballGeo = new THREE.SphereGeometry(0.1, 16, 16);
    const ball = new THREE.Mesh(ballGeo, redBobMat);
    ball.position.set(-2, -2.2, 0);
    projectileGroup.add(ball);

    // Parabolic trail curve
    const maxTrailPoints = 200;
    const trailPositions = new Float32Array(maxTrailPoints * 3);
    const trailGeo = new THREE.BufferGeometry();
    trailGeo.setAttribute('position', new THREE.BufferAttribute(trailPositions, 3));
    const trailMat = new THREE.LineBasicMaterial({ color: 0x5B8CF8, linewidth: 2 });
    const trailLine = new THREE.Line(trailGeo, trailMat);
    projectileGroup.add(trailLine);

    // Ground Target Marker
    const targetRingGeo = new THREE.RingGeometry(0.15, 0.18, 32);
    const targetRingMat = new THREE.MeshBasicMaterial({ color: 0x22C5A0, side: THREE.DoubleSide });
    const targetRing = new THREE.Mesh(targetRingGeo, targetRingMat);
    targetRing.rotation.x = Math.PI / 2;
    targetRing.position.set(0, -2.48, 0);
    projectileGroup.add(targetRing);

    // --- 3. REFRACTION / OPTICS GROUP ---
    const refractionGroup = new THREE.Group();
    scene.add(refractionGroup);

    // Interface boundary plane
    const interfacePlaneGeo = new THREE.PlaneGeometry(6, 6);
    const interfacePlaneMat = new THREE.MeshBasicMaterial({ color: 0x3b82f6, transparent: true, opacity: 0.15, side: THREE.DoubleSide });
    const interfacePlane = new THREE.Mesh(interfacePlaneGeo, interfacePlaneMat);
    interfacePlane.rotation.x = Math.PI / 2;
    interfacePlane.position.y = -0.5;
    refractionGroup.add(interfacePlane);

    // Transparent block for Glass Medium 2 (y < -0.5)
    const glassBlockGeo = new THREE.BoxGeometry(6, 4, 6);
    const glassBlockMat = new THREE.MeshStandardMaterial({ color: 0x3b82f6, transparent: true, opacity: 0.25, roughness: 0.1, metalness: 0.1 });
    const glassBlock = new THREE.Mesh(glassBlockGeo, glassBlockMat);
    glassBlock.position.set(0, -2.5, 0);
    refractionGroup.add(glassBlock);

    // Normal line (dashed white line along y axis)
    const normalPoints = [new THREE.Vector3(0, 2.5, 0), new THREE.Vector3(0, -2.5, 0)];
    const normalGeo = new THREE.BufferGeometry().setFromPoints(normalPoints);
    const normalLine = new THREE.LineSegments(normalGeo, dashedLineMat);
    refractionGroup.add(normalLine);

    // Light Rays lines
    const rayIncidentPoints = [new THREE.Vector3(0, 0, 0), new THREE.Vector3(0, 0, 0)];
    const rayIncidentGeo = new THREE.BufferGeometry().setFromPoints(rayIncidentPoints);
    const rayIncidentMat = new THREE.LineBasicMaterial({ color: 0xF55B6B, linewidth: 3 }); // Red
    const rayIncident = new THREE.Line(rayIncidentGeo, rayIncidentMat);
    refractionGroup.add(rayIncident);

    const rayReflectedPoints = [new THREE.Vector3(0, 0, 0), new THREE.Vector3(0, 0, 0)];
    const rayReflectedGeo = new THREE.BufferGeometry().setFromPoints(rayReflectedPoints);
    const rayReflectedMat = new THREE.LineBasicMaterial({ color: 0xF5A95B, linewidth: 3 }); // Yellow/Orange
    const rayReflected = new THREE.Line(rayReflectedGeo, rayReflectedMat);
    refractionGroup.add(rayReflected);

    const rayRefractedPoints = [new THREE.Vector3(0, 0, 0), new THREE.Vector3(0, 0, 0)];
    const rayRefractedGeo = new THREE.BufferGeometry().setFromPoints(rayRefractedPoints);
    const rayRefractedMat = new THREE.LineBasicMaterial({ color: 0x22C5A0, linewidth: 3 }); // Green
    const rayRefracted = new THREE.Line(rayRefractedGeo, rayRefractedMat);
    refractionGroup.add(rayRefracted);

    // Laser pointer source dot
    const sourceDotGeo = new THREE.SphereGeometry(0.08, 16, 16);
    const sourceDotMat = new THREE.MeshBasicMaterial({ color: 0xF55B6B });
    const sourceDot = new THREE.Mesh(sourceDotGeo, sourceDotMat);
    refractionGroup.add(sourceDot);

    // --- 4. SPRING MASS GROUP ---
    const springGroup = new THREE.Group();
    scene.add(springGroup);

    // Fixed Ceiling bracket
    const bracketGeo = new THREE.BoxGeometry(1.2, 0.15, 1.2);
    const bracket = new THREE.Mesh(bracketGeo, metalMat);
    bracket.position.set(0, 2.0, 0);
    springGroup.add(bracket);

    // Spring structure Mesh (drawn using TubeGeometry)
    let springMesh = null;
    const rebuildSpringMesh = (heightDisplacement) => {
      if (springMesh) springGroup.remove(springMesh);

      const path = new HelixPath(0.18, 12, heightDisplacement);
      const tubeGeo = new THREE.TubeGeometry(path, 120, 0.02, 12, false);
      const tubeMat = new THREE.MeshStandardMaterial({ color: 0x8892B0, roughness: 0.2, metalness: 0.9 });
      springMesh = new THREE.Mesh(tubeGeo, tubeMat);
      springMesh.position.set(0, 2.0, 0);
      springGroup.add(springMesh);
    };
    rebuildSpringMesh(3.0); // initial spring height

    // Weight block mass
    const weightBlockGeo = new THREE.BoxGeometry(0.48, 0.48, 0.48);
    const weightBlock = new THREE.Mesh(weightBlockGeo, pivotMat);
    weightBlock.position.set(0, -1.0, 0);
    springGroup.add(weightBlock);

    // --- 5. OHM'S LAW CIRCUIT GROUP ---
    const circuitGroup = new THREE.Group();
    scene.add(circuitGroup);

    // 3D Wire Loop base path
    const wirePath = [
      new THREE.Vector3(-1.8, 0, 0),
      new THREE.Vector3(1.8, 0, 0),
      new THREE.Vector3(1.8, -1.8, 0),
      new THREE.Vector3(-1.8, -1.8, 0),
      new THREE.Vector3(-1.8, 0, 0)
    ];
    const wireGeo = new THREE.BufferGeometry().setFromPoints(wirePath);
    const wireMat = new THREE.LineBasicMaterial({ color: 0x1E293B, linewidth: 4 });
    const wireLine = new THREE.Line(wireGeo, wireMat);
    circuitGroup.add(wireLine);

    // Battery cell (left side)
    const batteryGeo = new THREE.CylinderGeometry(0.14, 0.14, 0.8, 16);
    const batteryMat = new THREE.MeshStandardMaterial({ color: 0x3b82f6 }); // blue
    const battery = new THREE.Mesh(batteryGeo, batteryMat);
    battery.rotation.z = Math.PI / 2;
    battery.position.set(-1.8, -0.9, 0);
    circuitGroup.add(battery);

    // Resistor cylinder (right side)
    const resistorGeo = new THREE.CylinderGeometry(0.12, 0.12, 0.7, 16);
    const resistorMat = new THREE.MeshStandardMaterial({ color: 0xF5A95B }); // orange
    const resistor = new THREE.Mesh(resistorGeo, resistorMat);
    resistor.position.set(1.8, -0.9, 0);
    circuitGroup.add(resistor);

    // Electron flow spheres
    const numElectrons = 15;
    const electrons = [];
    const electronGeo = new THREE.SphereGeometry(0.04, 8, 8);
    const electronMat = new THREE.MeshBasicMaterial({ color: 0xF5A95B }); // glowing orange
    for (let i = 0; i < numElectrons; i++) {
      const e = new THREE.Mesh(electronGeo, electronMat);
      circuitGroup.add(e);
      electrons.push({
        mesh: e,
        progress: i / numElectrons // 0 to 1 along wire loop path
      });
    }

    // Function to calculate position along 2D wire path loop
    const getWirePosition = (t) => {
      // Loop wire dimensions: Width = 3.6, Height = 1.8. Total length = 2 * 3.6 + 2 * 1.8 = 10.8
      const perimeter = 10.8;
      const targetPos = (t % 1) * perimeter;

      if (targetPos <= 3.6) {
        // top wire going right: (-1.8, 0) to (1.8, 0)
        return new THREE.Vector3(-1.8 + targetPos, 0, 0);
      } else if (targetPos <= 5.4) {
        // right wire going down: (1.8, 0) to (1.8, -1.8)
        return new THREE.Vector3(1.8, -(targetPos - 3.6), 0);
      } else if (targetPos <= 9.0) {
        // bottom wire going left: (1.8, -1.8) to (-1.8, -1.8)
        return new THREE.Vector3(1.8 - (targetPos - 5.4), -1.8, 0);
      } else {
        // left wire going up: (-1.8, -1.8) to (-1.8, 0)
        return new THREE.Vector3(-1.8, -1.8 + (targetPos - 9.0), 0);
      }
    };

    // --- Simulation Physics loop variables ---
    const clock = new THREE.Clock();
    let animationId;

    // Run frame
    const animate = () => {
      animationId = requestAnimationFrame(animate);
      
      const dt = clock.getDelta();
      const state = simStateRef.current;
      const cappedDt = Math.min(dt, 0.05) * (state.isPlaying ? state.timeScale : 0);

      // Hide all groups, display only selected
      pendulumGroup.visible = state.selectedExperiment === 'pendulum';
      projectileGroup.visible = state.selectedExperiment === 'projectile';
      refractionGroup.visible = state.selectedExperiment === 'refraction';
      springGroup.visible = state.selectedExperiment === 'spring';
      circuitGroup.visible = state.selectedExperiment === 'circuit';

      // Reset camera targets based on experiments
      if (state.selectedExperiment === 'pendulum') {
        controls.target.set(0, -0.6, -0.5);
      } else if (state.selectedExperiment === 'projectile') {
        controls.target.set(0, -1.5, 0);
      } else if (state.selectedExperiment === 'refraction') {
        controls.target.set(0, -0.5, 0);
      } else if (state.selectedExperiment === 'spring') {
        controls.target.set(0, 0.5, 0);
      } else if (state.selectedExperiment === 'circuit') {
        controls.target.set(0, -0.9, 0);
      }

      // --- 1. Pendulum Calculations ---
      if (state.selectedExperiment === 'pendulum') {
        const p = state.pendulum;
        // Integrate swing acceleration with damping
        const accel = -(p.gravity / p.length) * Math.sin(p.angle) - p.damping * p.velocity;
        p.velocity += accel * cappedDt;
        p.angle += p.velocity * cappedDt;

        // Position of Bob relative to pivot (0, 0.7, -0.5)
        const bobX = p.length * Math.sin(p.angle);
        const bobY = 0.7 - p.length * Math.cos(p.angle);
        bob.position.set(bobX, bobY, -0.5);

        // Update String geometry points
        const positions = stringLine.geometry.attributes.position.array;
        positions[3] = bobX;
        positions[4] = bobY;
        stringLine.geometry.attributes.position.needsUpdate = true;

        // Arrows helpers
        // Velocity: tangent to swing, direction is perpendicular to radius vector
        const velMag = p.length * p.velocity;
        const velDir = new THREE.Vector3(Math.cos(p.angle), Math.sin(p.angle), 0).normalize();
        velocityArrow.position.copy(bob.position);
        velocityArrow.setDirection(velDir);
        velocityArrow.setLength(Math.abs(velMag) * 0.4 + 0.05, 0.15, 0.06);

        // Acceleration: pointing towards tension (centripetal) and gravity (tangent)
        const accDir = new THREE.Vector3(
          -Math.sin(p.angle) * Math.cos(p.angle),
          -Math.sin(p.angle) * Math.sin(p.angle) - 0.2, // bias towards gravity
          0
        ).normalize();
        const accMag = Math.abs(accel);
        accelArrow.position.copy(bob.position);
        accelArrow.setDirection(accDir);
        accelArrow.setLength(accMag * 0.25 + 0.05, 0.15, 0.06);

        // Energy math
        const h = p.length * (1 - Math.cos(p.angle));
        const pe = p.mass * p.gravity * h;
        const ke = 0.5 * p.mass * Math.pow(p.length * p.velocity, 2);
        const te = pe + ke;
        setPendulumEnergy({ ke, pe, te });
      }

      // --- 2. Projectile Calculations ---
      if (state.selectedExperiment === 'projectile') {
        const proj = state.projectile;
        const angleRad = (proj.angle * Math.PI) / 180;

        // Cannon Rotation: rotate barrel
        barrel.rotation.z = angleRad - Math.PI / 2;
        // Shift barrel center along barrel direction
        const barrelLen = 0.4;
        const muzzleX = -2 + Math.cos(angleRad) * barrelLen;
        const muzzleY = -2.46 + Math.sin(angleRad) * barrelLen;
        barrel.position.set(-2 + Math.cos(angleRad) * (barrelLen / 2), -2.46 + Math.sin(angleRad) * (barrelLen / 2), 0);

        if (proj.isFlying) {
          proj.t += cappedDt;
          
          // Trajectory position
          const x = muzzleX + proj.velocity * Math.cos(angleRad) * proj.t;
          const y = muzzleY + proj.velocity * Math.sin(angleRad) * proj.t - 0.5 * proj.gravity * Math.pow(proj.t, 2);

          if (proj.t >= proj.maxT || y <= -2.48) {
            proj.isFlying = false;
            ball.position.set(muzzleX + proj.velocity * Math.cos(angleRad) * proj.maxT, -2.48, 0);
          } else {
            ball.position.set(x, y, 0);
          }

          // Realtime stats
          const instY = ball.position.y - (-2.46);
          const range = ball.position.x - muzzleX;
          setProjectileStats({
            range: Math.max(0, range),
            height: Math.max(0, instY),
            time: proj.t
          });
        } else if (proj.t === 0) {
          // Resting ball inside barrel
          ball.position.set(muzzleX, muzzleY, 0);
        }

        // Draw parabolic trace
        const pArray = trailLine.geometry.attributes.position.array;
        for (let i = 0; i < maxTrailPoints; i++) {
          const stepT = (i / maxTrailPoints) * proj.maxT;
          const tx = muzzleX + proj.velocity * Math.cos(angleRad) * stepT;
          const ty = muzzleY + proj.velocity * Math.sin(angleRad) * stepT - 0.5 * proj.gravity * Math.pow(stepT, 2);
          
          pArray[i * 3] = tx;
          pArray[i * 3 + 1] = Math.max(-2.48, ty);
          pArray[i * 3 + 2] = 0;
        }
        trailLine.geometry.attributes.position.needsUpdate = true;

        // Position Target Ring at estimated range
        const maxRange = proj.velocity * Math.cos(angleRad) * proj.maxT;
        targetRing.position.x = muzzleX + maxRange;
      }

      // --- 3. Refraction Calculations ---
      if (state.selectedExperiment === 'refraction') {
        const r = state.refraction;
        const angleRad = (r.angle * Math.PI) / 180;
        
        // Incident beam: source points from upper-left to origin (0, -0.5, 0)
        // Direction vector: (sin(angleRad), -cos(angleRad))
        const sourceX = -2.5 * Math.sin(angleRad);
        const sourceY = -0.5 + 2.5 * Math.cos(angleRad);
        sourceDot.position.set(sourceX, sourceY, 0);

        // Incident ray geometry
        const incArray = rayIncident.geometry.attributes.position.array;
        incArray[0] = sourceX; incArray[1] = sourceY;
        incArray[3] = 0; incArray[4] = -0.5;
        rayIncident.geometry.attributes.position.needsUpdate = true;

        // Reflected ray: headings to upper right (sin, cos)
        const refArray = rayReflected.geometry.attributes.position.array;
        refArray[0] = 0; refArray[1] = -0.5;
        refArray[3] = 2.5 * Math.sin(angleRad); refArray[4] = -0.5 + 2.5 * Math.cos(angleRad);
        rayReflected.geometry.attributes.position.needsUpdate = true;

        // Refracted ray via Snell's Law
        const sin2 = (r.n1 * Math.sin(angleRad)) / r.n2;
        const refrArray = rayRefracted.geometry.attributes.position.array;

        if (sin2 > 1.0) {
          // Total Internal Reflection (TIR)
          setIsTIR(true);
          rayRefracted.visible = false;
        } else {
          setIsTIR(false);
          rayRefracted.visible = true;
          const angle2 = Math.asin(sin2);
          
          refrArray[0] = 0; refrArray[1] = -0.5;
          refrArray[3] = 2.5 * Math.sin(angle2); refrArray[4] = -0.5 - 2.5 * Math.cos(angle2);
          rayRefracted.geometry.attributes.position.needsUpdate = true;
        }
      }

      // --- 4. Spring Calculations ---
      if (state.selectedExperiment === 'spring') {
        const s = state.spring;
        
        // Harmonic motion integration
        const springForce = -s.k * s.displacement;
        const dampingForce = -s.damping * s.velocity;
        const accel = (springForce + dampingForce) / s.mass;

        s.velocity += accel * cappedDt;
        s.displacement += s.velocity * cappedDt;

        // Spring bottom Y coordinates: pivot is at 2.0. Base spring height is 2.5.
        // Spring height extends downward: 2.5 - displacement
        const springLength = 2.4 - s.displacement;
        rebuildSpringMesh(springLength);

        // Mass block attached to spring bottom
        weightBlock.position.set(0, 2.0 - springLength - 0.24, 0);

        // Energy stats
        const pe = 0.5 * s.k * Math.pow(s.displacement, 2);
        const ke = 0.5 * s.mass * Math.pow(s.velocity, 2);
        const te = pe + ke;
        setSpringEnergy({ ke, pe, te });
      }

      // --- 5. Circuit Electron Flow ---
      if (state.selectedExperiment === 'circuit') {
        const c = state.circuit;
        
        // Electrons animation speed is proportional to current current
        const speedMultiplier = 0.2 * c.current;
        electrons.forEach(e => {
          e.progress = (e.progress + cappedDt * speedMultiplier) % 1;
          const pos = getWirePosition(e.progress);
          e.mesh.position.copy(pos);
        });
      }

      controls.update();
      renderer.render(scene, camera);
    };
    
    animate();

    // Resize Handler
    const handleResize = () => {
      if (!container || !camera || !renderer) return;
      const w = container.clientWidth;
      const h = container.clientHeight;
      camera.aspect = w / h;
      camera.updateProjectionMatrix();
      renderer.setSize(w, h);
    };
    window.addEventListener('resize', handleResize);

    // Clean unmount
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

  // Presets gravity values
  const handlePendulumPreset = (gravityVal) => {
    setPendulumGravity(gravityVal);
  };

  if (labMode === 'phet') {
    return (
      <div style={featureStyleFunctions.s0({isMobile})}>
        <PhetSimViewer
          subject="physics"
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
      
      {/* --- PARAMETERS SIDEBAR (Width: 360px on desktop, full width below canvas on mobile) --- */}
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
            <Activity size={20} color="#5B8CF8" />
            <div>
              <h2 style={inlineStyles.s3}>Physics Lab</h2>
              <span style={inlineStyles.s4}>Virtual Interactive Workbench</span>
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
            }}
            style={inlineStyles.s8}
          >
            <option value="pendulum">🧲 Simple Pendulum Lab</option>
            <option value="projectile">🚀 Projectile Motion Lab</option>
            <option value="refraction">🌈 Refraction & Reflection</option>
            <option value="spring">🌀 Spring-Mass System</option>
            <option value="circuit">⚡ Ohm's Law Circuit</option>
          </select>
        </div>

        {/* Dynamic Parameter Sliders scroll section */}
        <div style={inlineStyles.s9} className="sandbox-scroll">
          
          {/* PENDULUM SLIDERS */}
          {selectedExperiment === 'pendulum' && (
            <div style={inlineStyles.s10}>
              <div style={inlineStyles.s11}>
                <Sliders size={13} /> Adjustable Parameters
              </div>
              
              {/* Length Slider */}
              <div style={inlineStyles.s12}>
                <div style={inlineStyles.s13}>
                  <span style={inlineStyles.s14}>String Length (L)</span>
                  <span style={inlineStyles.s15}>{pendulumLength.toFixed(1)} m</span>
                </div>
                <input
                  type="range" min={1.0} max={3.5} step={0.1}
                  value={pendulumLength} onChange={(e) => setPendulumLength(parseFloat(e.target.value))}
                  style={inlineStyles.s16}
                />
              </div>

              {/* Mass Slider */}
              <div style={inlineStyles.s17}>
                <div style={inlineStyles.s18}>
                  <span style={inlineStyles.s19}>Bob Mass (M)</span>
                  <span style={inlineStyles.s20}>{pendulumMass.toFixed(1)} kg</span>
                </div>
                <input
                  type="range" min={0.5} max={5.0} step={0.1}
                  value={pendulumMass} onChange={(e) => setPendulumMass(parseFloat(e.target.value))}
                  style={inlineStyles.s21}
                />
              </div>

              {/* Air Damping Slider */}
              <div style={inlineStyles.s22}>
                <div style={inlineStyles.s23}>
                  <span style={inlineStyles.s24}>Air Friction (Damping)</span>
                  <span style={inlineStyles.s25}>{pendulumDamping.toFixed(2)}</span>
                </div>
                <input
                  type="range" min={0.0} max={0.5} step={0.01}
                  value={pendulumDamping} onChange={(e) => setPendulumDamping(parseFloat(e.target.value))}
                  style={inlineStyles.s26}
                />
              </div>

              {/* Gravity Presets */}
              <div style={inlineStyles.s27}>
                <span style={inlineStyles.s28}>Gravity Presets (g)</span>
                <div style={inlineStyles.s29}>
                  {[
                    { label: 'Earth (9.8 m/s²)', val: 9.8 },
                    { label: 'Moon (1.6 m/s²)', val: 1.6 },
                    { label: 'Jupiter (24.8 m/s²)', val: 24.8 },
                    { label: 'Space (0 m/s²)', val: 0.0 }
                  ].map(preset => (
                    <button
                      key={preset.label}
                      onClick={() => handlePendulumPreset(preset.val)}
                      style={featureStyleFunctions.s3({pendulumGravity,preset})}
                    >
                      {preset.label}
                    </button>
                  ))}
                </div>
              </div>

              {/* Formula Panel */}
              <div style={inlineStyles.s30}>
                <div style={inlineStyles.s31}>
                  <Info size={11} /> Physics Formula
                </div>
                Angular Period: T = 2π × √(L/g)
                <div style={inlineStyles.s32}>Kinetic Energy: KE = ½ M v²</div>
                <div>Potential Energy: PE = M g h</div>
              </div>
            </div>
          )}

          {/* PROJECTILE SLIDERS */}
          {selectedExperiment === 'projectile' && (
            <div style={inlineStyles.s33}>
              <div style={inlineStyles.s34}>
                <Sliders size={13} /> Projectile Variables
              </div>
              
              {/* Velocity */}
              <div style={inlineStyles.s35}>
                <div style={inlineStyles.s36}>
                  <span style={inlineStyles.s37}>Launch Velocity (v)</span>
                  <span style={inlineStyles.s38}>{projectileVelocity.toFixed(0)} m/s</span>
                </div>
                <input
                  type="range" min={5} max={30} step={1}
                  value={projectileVelocity} onChange={(e) => setProjectileVelocity(parseInt(e.target.value))}
                  style={inlineStyles.s39}
                />
              </div>

              {/* Angle */}
              <div style={inlineStyles.s40}>
                <div style={inlineStyles.s41}>
                  <span style={inlineStyles.s42}>Launch Angle (θ)</span>
                  <span style={inlineStyles.s43}>{projectileAngle.toFixed(0)}°</span>
                </div>
                <input
                  type="range" min={15} max={85} step={1}
                  value={projectileAngle} onChange={(e) => setProjectileAngle(parseInt(e.target.value))}
                  style={inlineStyles.s44}
                />
              </div>

              {/* Gravity */}
              <div style={inlineStyles.s45}>
                <div style={inlineStyles.s46}>
                  <span style={inlineStyles.s47}>Gravity (g)</span>
                  <span style={inlineStyles.s48}>{projectileGravity.toFixed(1)} m/s²</span>
                </div>
                <input
                  type="range" min={1.6} max={25.0} step={0.1}
                  value={projectileGravity} onChange={(e) => setProjectileGravity(parseFloat(e.target.value))}
                  style={inlineStyles.s49}
                />
              </div>

              {/* Action Fire button */}
              <button
                onClick={() => setProjectileFireTrigger(prev => prev + 1)}
                style={inlineStyles.s50}
              >
                <Zap size={13} fill="currentColor" /> Launch Projectile
              </button>

              {/* Live readout */}
              <div style={inlineStyles.s51}>
                <span style={inlineStyles.s52}>Measurement Outputs</span>
                <div style={inlineStyles.s53}>
                  <span style={inlineStyles.s54}>Horizontal Range:</span>
                  <strong style={inlineStyles.s55}>{projectileStats.range.toFixed(2)} m</strong>
                </div>
                <div style={inlineStyles.s56}>
                  <span style={inlineStyles.s57}>Current Altitude:</span>
                  <strong style={inlineStyles.s58}>{projectileStats.height.toFixed(2)} m</strong>
                </div>
                <div style={inlineStyles.s59}>
                  <span style={inlineStyles.s60}>Time of Flight:</span>
                  <strong style={inlineStyles.s61}>{projectileStats.time.toFixed(2)} s</strong>
                </div>
              </div>
            </div>
          )}

          {/* OPTICS / REFRACTION SLIDERS */}
          {selectedExperiment === 'refraction' && (
            <div style={inlineStyles.s62}>
              <div style={inlineStyles.s63}>
                <Sliders size={13} /> Optical Indices
              </div>

              {/* Incident Angle */}
              <div style={inlineStyles.s64}>
                <div style={inlineStyles.s65}>
                  <span style={inlineStyles.s66}>Incident Angle (θ₁)</span>
                  <span style={inlineStyles.s67}>{refractionAngle.toFixed(0)}°</span>
                </div>
                <input
                  type="range" min={0} max={89} step={1}
                  value={refractionAngle} onChange={(e) => setRefractionAngle(parseInt(e.target.value))}
                  style={inlineStyles.s68}
                />
              </div>

              {/* Index n1 */}
              <div style={inlineStyles.s69}>
                <div style={inlineStyles.s70}>
                  <span style={inlineStyles.s71}>Index Medium 1 (n₁)</span>
                  <span style={inlineStyles.s72}>{refractionN1.toFixed(2)}</span>
                </div>
                <input
                  type="range" min={1.0} max={2.0} step={0.05}
                  value={refractionN1} onChange={(e) => setRefractionN1(parseFloat(e.target.value))}
                  style={inlineStyles.s73}
                />
              </div>

              {/* Index n2 */}
              <div style={inlineStyles.s74}>
                <div style={inlineStyles.s75}>
                  <span style={inlineStyles.s76}>Index Medium 2 (n₂)</span>
                  <span style={inlineStyles.s77}>{refractionN2.toFixed(2)}</span>
                </div>
                <input
                  type="range" min={1.0} max={2.0} step={0.05}
                  value={refractionN2} onChange={(e) => setRefractionN2(parseFloat(e.target.value))}
                  style={inlineStyles.s78}
                />
              </div>

              {/* Medium Label Helpers */}
              <div style={inlineStyles.s79}>
                <span style={inlineStyles.s80}>Index References</span>
                <span style={inlineStyles.s81}>Air: 1.00 | Water: 1.33 | Glass: 1.50</span>
              </div>

              {/* TIR Warning */}
              {isTIR && (
                <div style={inlineStyles.s82}>
                  <AlertCircle size={14} />
                  <span>Total Internal Reflection! Light beam cannot pass into Medium 2.</span>
                </div>
              )}
            </div>
          )}

          {/* SPRING MASS SLIDERS */}
          {selectedExperiment === 'spring' && (
            <div style={inlineStyles.s83}>
              <div style={inlineStyles.s84}>
                <Sliders size={13} /> Hooke's Elasticity Variables
              </div>

              {/* Spring Constant */}
              <div style={inlineStyles.s85}>
                <div style={inlineStyles.s86}>
                  <span style={inlineStyles.s87}>Spring Stiffness (k)</span>
                  <span style={inlineStyles.s88}>{springConstant.toFixed(0)} N/m</span>
                </div>
                <input
                  type="range" min={5} max={30} step={1}
                  value={springConstant} onChange={(e) => setSpringConstant(parseInt(e.target.value))}
                  style={inlineStyles.s89}
                />
              </div>

              {/* Mass */}
              <div style={inlineStyles.s90}>
                <div style={inlineStyles.s91}>
                  <span style={inlineStyles.s92}>Mass block (M)</span>
                  <span style={inlineStyles.s93}>{springMass.toFixed(2)} kg</span>
                </div>
                <input
                  type="range" min={0.5} max={3.0} step={0.1}
                  value={springMass} onChange={(e) => setSpringMass(parseFloat(e.target.value))}
                  style={inlineStyles.s94}
                />
              </div>

              {/* Damping */}
              <div style={inlineStyles.s95}>
                <div style={inlineStyles.s96}>
                  <span style={inlineStyles.s97}>Damping Damping</span>
                  <span style={inlineStyles.s98}>{springDamping.toFixed(3)}</span>
                </div>
                <input
                  type="range" min={0.0} max={0.2} step={0.005}
                  value={springDamping} onChange={(e) => setSpringDamping(parseFloat(e.target.value))}
                  style={inlineStyles.s99}
                />
              </div>
            </div>
          )}

          {/* OHM'S LAW SLIDERS */}
          {selectedExperiment === 'circuit' && (
            <div style={inlineStyles.s100}>
              <div style={inlineStyles.s101}>
                <Sliders size={13} /> Circuit Potentials
              </div>

              {/* Voltage */}
              <div style={inlineStyles.s102}>
                <div style={inlineStyles.s103}>
                  <span style={inlineStyles.s104}>DC Voltage Source (V)</span>
                  <span style={inlineStyles.s105}>{circuitVoltage.toFixed(1)} Volts</span>
                </div>
                <input
                  type="range" min={1.5} max={18} step={0.5}
                  value={circuitVoltage} onChange={(e) => setCircuitVoltage(parseFloat(e.target.value))}
                  style={inlineStyles.s106}
                />
              </div>

              {/* Resistance */}
              <div style={inlineStyles.s107}>
                <div style={inlineStyles.s108}>
                  <span style={inlineStyles.s109}>Load Resistance (R)</span>
                  <span style={inlineStyles.s110}>{circuitResistance.toFixed(0)} Ohms</span>
                </div>
                <input
                  type="range" min={5} max={50} step={1}
                  value={circuitResistance} onChange={(e) => setCircuitResistance(parseInt(e.target.value))}
                  style={inlineStyles.s111}
                />
              </div>

              {/* Current Output Reading */}
              <div style={inlineStyles.s112}>
                <span style={inlineStyles.s113}>Ohm's Equation Output</span>
                <div style={inlineStyles.s114}>
                  <span style={inlineStyles.s115}>Computed Current (I)</span>
                  <strong style={inlineStyles.s116}>
                    {circuitCurrent.toFixed(3)} A
                  </strong>
                </div>
              </div>
            </div>
          )}

        </div>

        {/* Global Toolbar controls */}
        <div style={inlineStyles.s117}>
          <div style={inlineStyles.s118}>
            <button
              onClick={() => setIsPlaying(!isPlaying)}
              style={featureStyleFunctions.s4({isPlaying})}
            >
              {isPlaying ? <Pause size={12} /> : <Play size={12} fill="currentColor" />}
              {isPlaying ? 'Pause' : 'Play'}
            </button>
            
            <button
              onClick={() => {
                // Trigger a reset of variables depending on selected experiment
                if (selectedExperiment === 'pendulum') {
                  simStateRef.current.pendulum.angle = Math.PI / 4;
                  simStateRef.current.pendulum.velocity = 0;
                } else if (selectedExperiment === 'projectile') {
                  simStateRef.current.projectile.t = 0;
                  simStateRef.current.projectile.isFlying = false;
                  setProjectileStats({ range: 0, height: 0, time: 0 });
                } else if (selectedExperiment === 'spring') {
                  simStateRef.current.spring.displacement = 1.0;
                  simStateRef.current.spring.velocity = 0;
                }
              }}
              title="Reset Simulation Positions"
              style={inlineStyles.s119}
            >
              <RotateCcw size={12} />
            </button>
          </div>

          {/* Speed Scale Selector */}
          <div style={inlineStyles.s120}>
            {[
              { label: '1.0x', val: 1.0 },
              { label: '0.25x (Slow)', val: 0.25 }
            ].map(item => (
              <button
                key={item.label}
                onClick={() => setTimeScale(item.val)}
                style={featureStyleFunctions.s5({timeScale,item})}
              >
                {item.label}
              </button>
            ))}
          </div>
        </div>

      </div>

      {/* --- 3D CANVAS + ENERGY CHART OVERLAY --- */}
      <div style={featureStyleFunctions.s6({isStacked})}>
        
        {/* Render Three.js Canvas container */}
        <div ref={mountRef} style={featureStyleFunctions.s7({isStacked})} />

        {/* Dynamic Live Energy SVG overlay (bottom overlay block) */}
        {selectedExperiment === 'pendulum' && (
          <div style={inlineStyles.s121}>
            <span style={inlineStyles.s122}>Energy Distribution</span>
            
            {/* KE Bar */}
            <div style={inlineStyles.s123}>
              <div style={inlineStyles.s124}>
                <span style={inlineStyles.s125}>Kinetic Energy (KE)</span>
                <span style={inlineStyles.s126}>{pendulumEnergy.ke.toFixed(2)} J</span>
              </div>
              <div style={inlineStyles.s127}>
                <div style={featureStyleFunctions.s8({pendulumEnergy})} />
              </div>
            </div>

            {/* PE Bar */}
            <div style={inlineStyles.s128}>
              <div style={inlineStyles.s129}>
                <span style={inlineStyles.s130}>Potential Energy (PE)</span>
                <span style={inlineStyles.s131}>{pendulumEnergy.pe.toFixed(2)} J</span>
              </div>
              <div style={inlineStyles.s132}>
                <div style={featureStyleFunctions.s9({pendulumEnergy})} />
              </div>
            </div>

            {/* Total Energy Text */}
            <div style={inlineStyles.s133}>
              <span style={inlineStyles.s134}>Total Mechanical (E)</span>
              <span style={inlineStyles.s135}>{pendulumEnergy.te.toFixed(2)} J</span>
            </div>
          </div>
        )}

        {/* Spring Mass Energy overlay */}
        {selectedExperiment === 'spring' && (
          <div style={inlineStyles.s136}>
            <span style={inlineStyles.s137}>Hooke's System Energy</span>
            
            {/* KE Bar */}
            <div style={inlineStyles.s138}>
              <div style={inlineStyles.s139}>
                <span style={inlineStyles.s140}>Kinetic Energy (KE)</span>
                <span style={inlineStyles.s141}>{springEnergy.ke.toFixed(2)} J</span>
              </div>
              <div style={inlineStyles.s142}>
                <div style={featureStyleFunctions.s10({springEnergy})} />
              </div>
            </div>

            {/* PE Bar */}
            <div style={inlineStyles.s143}>
              <div style={inlineStyles.s144}>
                <span style={inlineStyles.s145}>Elastic Potential (PE)</span>
                <span style={inlineStyles.s146}>{springEnergy.pe.toFixed(2)} J</span>
              </div>
              <div style={inlineStyles.s147}>
                <div style={featureStyleFunctions.s11({springEnergy})} />
              </div>
            </div>

            {/* Total Energy */}
            <div style={inlineStyles.s148}>
              <span style={inlineStyles.s149}>Total Energy (E)</span>
              <span style={inlineStyles.s150}>{springEnergy.te.toFixed(2)} J</span>
            </div>
          </div>
        )}

      </div>
    </div>
  );
}
