import React, { useState, useEffect, useRef } from 'react';
import * as THREE from 'three';
import { 
  Sparkles, 
  Terminal, 
  Code2, 
  Globe, 
  Layers, 
  ShieldCheck, 
  Trophy, 
  Users2, 
  Compass, 
  ChevronDown, 
  Radio, 
  Menu, 
  X, 
  CheckCircle2, 
  HelpCircle,
  Zap,
  Award,
  Clock,
  Gift,
  Tag,
  GraduationCap,
  Database,
  Brain,
  Cpu,
  Server,
  Smartphone,
  ShieldAlert,
  Cloud,
  Binary,
  Shapes,
  Flame,
  ArrowRight
} from 'lucide-react';

// --- THREE.JS 3D HERO CANVAS COMPONENT ---
function Hero3DCanvas() {
  const mountRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    const container = mountRef.current;
    if (!container) return;

    let animationFrameId: number;
    let renderer: THREE.WebGLRenderer,
      scene: THREE.Scene,
      camera: THREE.PerspectiveCamera,
      meshGroup: THREE.Group,
      coreMesh: THREE.Mesh,
      outerRing: THREE.Mesh,
      innerRing: THREE.Mesh,
      particles: THREE.Points;
    let mouseX = 0;
    let mouseY = 0;
    let targetX = 0;
    let targetY = 0;

    try {
      const width = container.clientWidth;
      const height = container.clientHeight;

      // Scene
      scene = new THREE.Scene();
      scene.fog = new THREE.FogExp2(0x070910, 0.045);

      // Camera
      camera = new THREE.PerspectiveCamera(45, width / height, 0.1, 100);
      camera.position.z = 6.2;
      camera.position.y = 0.2;

      // Renderer
      renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true, powerPreference: 'high-performance' });
      renderer.setSize(width, height);
      renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
      renderer.toneMapping = THREE.ACESFilmicToneMapping;
      renderer.toneMappingExposure = 1.25;
      container.appendChild(renderer.domElement);

      // Mesh Group (for global tilting)
      meshGroup = new THREE.Group();
      scene.add(meshGroup);

      // Central Polylith Trophy / Crystal Artifact
      const coreGeometry = new THREE.IcosahedronGeometry(1.4, 0);
      const coreMaterial = new THREE.MeshPhysicalMaterial({
        color: 0x111827,
        emissive: 0x1e1538,
        roughness: 0.18,
        metalness: 0.95,
        clearcoat: 1.0,
        clearcoatRoughness: 0.1,
        reflectivity: 0.9,
        wireframe: false,
        flatShading: true
      });
      coreMesh = new THREE.Mesh(coreGeometry, coreMaterial);
      meshGroup.add(coreMesh);

      // Wireframe overlay for cybernetic edge highlight
      const wireframeMat = new THREE.MeshBasicMaterial({
        color: 0x8b5cf6,
        wireframe: true,
        transparent: true,
        opacity: 0.4
      });
      const wireframeMesh = new THREE.Mesh(coreGeometry, wireframeMat);
      wireframeMesh.scale.set(1.002, 1.002, 1.002);
      meshGroup.add(wireframeMesh);

      // Inner Floating Tech Torus
      const innerTorusGeo = new THREE.TorusGeometry(1.9, 0.02, 16, 100);
      const ringMat1 = new THREE.MeshStandardMaterial({
        color: 0x38bdf8,
        emissive: 0x0284c7,
        emissiveIntensity: 0.5,
        roughness: 0.2,
        metalness: 0.9
      });
      innerRing = new THREE.Mesh(innerTorusGeo, ringMat1);
      innerRing.rotation.x = Math.PI / 3;
      meshGroup.add(innerRing);

      // Outer Tilted Cyber Ring with nodes
      const outerTorusGeo = new THREE.TorusGeometry(2.35, 0.015, 16, 120);
      const ringMat2 = new THREE.MeshStandardMaterial({
        color: 0x8b5cf6,
        emissive: 0x6d28d9,
        emissiveIntensity: 0.4,
        roughness: 0.3,
        metalness: 0.8
      });
      outerRing = new THREE.Mesh(outerTorusGeo, ringMat2);
      outerRing.rotation.x = -Math.PI / 4;
      outerRing.rotation.y = Math.PI / 6;
      meshGroup.add(outerRing);

      // Ambient Floating Micro-Particles
      const particleCount = 280;
      const particleGeo = new THREE.BufferGeometry();
      const posArray = new Float32Array(particleCount * 3);
      for (let i = 0; i < particleCount * 3; i += 3) {
        posArray[i] = (Math.random() - 0.5) * 12;
        posArray[i + 1] = (Math.random() - 0.5) * 10;
        posArray[i + 2] = (Math.random() - 0.5) * 8;
      }
      particleGeo.setAttribute('position', new THREE.BufferAttribute(posArray, 3));
      const particleMat = new THREE.PointsMaterial({
        size: 0.035,
        color: 0x67e8f9,
        transparent: true,
        opacity: 0.65,
        blending: THREE.AdditiveBlending
      });
      particles = new THREE.Points(particleGeo, particleMat);
      scene.add(particles);

      // Atmospheric Lighting (Violet Key + Cyan Rim + Ambient Fill)
      const ambientLight = new THREE.AmbientLight(0x0a0d18, 2.5);
      scene.add(ambientLight);

      const violetLight = new THREE.PointLight(0x8b5cf6, 35, 15);
      violetLight.position.set(-3.5, 2.8, 3.5);
      scene.add(violetLight);

      const cyanLight = new THREE.PointLight(0x38bdf8, 30, 15);
      cyanLight.position.set(3.5, -2.5, 3.0);
      scene.add(cyanLight);

      const topLight = new THREE.DirectionalLight(0xffffff, 1.2);
      topLight.position.set(0, 5, 2);
      scene.add(topLight);

      // Mouse Interaction
      const handleMouseMove = (e: MouseEvent) => {
        const { innerWidth, innerHeight } = window;
        mouseX = (e.clientX / innerWidth - 0.5) * 2;
        mouseY = -(e.clientY / innerHeight - 0.5) * 2;
      };
      window.addEventListener('mousemove', handleMouseMove);

      // Resize Handler
      const handleResize = () => {
        if (!container) return;
        const w = container.clientWidth;
        const h = container.clientHeight;
        camera.aspect = w / h;
        camera.updateProjectionMatrix();
        renderer.setSize(w, h);
      };
      window.addEventListener('resize', handleResize);

      // Animation Loop
      let clock = new THREE.Clock();
      const animate = () => {
        animationFrameId = requestAnimationFrame(animate);
        const elapsedTime = clock.getElapsedTime();

        // Smooth damping pointer response
        targetX += (mouseX - targetX) * 0.05;
        targetY += (mouseY - targetY) * 0.05;

        meshGroup.rotation.y = elapsedTime * 0.28 + targetX * 0.5;
        meshGroup.rotation.x = Math.sin(elapsedTime * 0.2) * 0.15 + targetY * 0.3;

        // Counter rotations for orbital gyro aesthetics
        innerRing.rotation.z = -elapsedTime * 0.35;
        outerRing.rotation.z = elapsedTime * 0.22;
        outerRing.rotation.y = Math.sin(elapsedTime * 0.3) * 0.4;

        // Subtle core pulsation
        const scaleVal = 1 + Math.sin(elapsedTime * 1.5) * 0.03;
        coreMesh.scale.set(scaleVal, scaleVal, scaleVal);
        wireframeMesh.scale.set(scaleVal * 1.002, scaleVal * 1.002, scaleVal * 1.002);

        // Particle subtle drift
        particles.rotation.y = elapsedTime * 0.03;
        particles.rotation.x = Math.cos(elapsedTime * 0.02) * 0.05;

        renderer.render(scene, camera);
      };
      animate();

      return () => {
        window.removeEventListener('mousemove', handleMouseMove);
        window.removeEventListener('resize', handleResize);
        cancelAnimationFrame(animationFrameId);
        if (renderer && renderer.domElement && container.contains(renderer.domElement)) {
          container.removeChild(renderer.domElement);
          renderer.dispose();
        }
      };
    } catch (err) {
      console.warn("WebGL initialization failed, falling back to CSS visualization.", err);
    }
  }, []);

  return (
    <div className="absolute inset-0 pointer-events-none z-0 overflow-hidden flex items-center justify-center">
      <div ref={mountRef} className="w-full h-full relative" />
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[340px] md:w-[600px] h-[340px] md:h-[600px] bg-violet-600/15 rounded-full blur-[130px] pointer-events-none -z-10" />
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[240px] md:w-[480px] h-[240px] md:h-[480px] bg-sky-500/10 rounded-full blur-[110px] pointer-events-none -z-10" />
    </div>
  );
}

// --- SUB-COMPONENT: HOLOGRAPHIC RADAR CANVAS ---
function HolographicArenaRadar() {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;
    let frameId: number;
    let angle = 0;

    const render = () => {
      angle += 0.015;
      const w = canvas.width;
      const h = canvas.height;
      const cx = w / 2;
      const cy = h / 2;

      ctx.clearRect(0, 0, w, h);

      // Background Grid
      ctx.strokeStyle = 'rgba(139, 92, 246, 0.08)';
      ctx.lineWidth = 1;
      const step = 28;
      for (let x = 0; x < w; x += step) {
        ctx.beginPath();
        ctx.moveTo(x, 0);
        ctx.lineTo(x, h);
        ctx.stroke();
      }
      for (let y = 0; y < h; y += step) {
        ctx.beginPath();
        ctx.moveTo(0, y);
        ctx.lineTo(w, y);
        ctx.stroke();
      }

      // Concentric Rings
      [60, 110, 160, 200].forEach((radius, idx) => {
        ctx.beginPath();
        ctx.arc(cx, cy, radius, 0, Math.PI * 2);
        ctx.strokeStyle = idx % 2 === 0 ? 'rgba(56, 189, 248, 0.25)' : 'rgba(139, 92, 246, 0.2)';
        ctx.setLineDash(idx % 2 === 0 ? [4, 6] : []);
        ctx.lineWidth = 1.2;
        ctx.stroke();
        ctx.setLineDash([]);
      });

      // Rotating Radar Sweep
      ctx.save();
      ctx.translate(cx, cy);
      ctx.rotate(angle);
      const gradient = ctx.createLinearGradient(0, 0, 190, 0);
      gradient.addColorStop(0, 'rgba(56, 189, 248, 0)');
      gradient.addColorStop(1, 'rgba(103, 232, 249, 0.45)');
      ctx.beginPath();
      ctx.moveTo(0, 0);
      ctx.arc(0, 0, 190, 0, Math.PI / 4);
      ctx.fillStyle = gradient;
      ctx.fill();
      ctx.restore();

      // Pulsing Center Node
      ctx.beginPath();
      ctx.arc(cx, cy, 6 + Math.sin(angle * 4) * 2, 0, Math.PI * 2);
      ctx.fillStyle = '#67e8f9';
      ctx.shadowColor = '#38bdf8';
      ctx.shadowBlur = 14;
      ctx.fill();
      ctx.shadowBlur = 0;

      // Orbiting Target Nodes across domains
      const targets = [
        { r: 110, speed: 1.1, label: 'AI_ML_CORE' },
        { r: 160, speed: -0.7, label: 'FULLSTACK_ENGINE' },
        { r: 75, speed: 1.8, label: 'SEC_DEVOPS' },
      ];

      targets.forEach((t) => {
        const curAngle = angle * t.speed;
        const tx = cx + Math.cos(curAngle) * t.r;
        const ty = cy + Math.sin(curAngle) * t.r;

        ctx.beginPath();
        ctx.arc(tx, ty, 3.5, 0, Math.PI * 2);
        ctx.fillStyle = '#8b5cf6';
        ctx.fill();

        ctx.font = '9px "Space Grotesk", monospace';
        ctx.fillStyle = 'rgba(165, 180, 204, 0.85)';
        ctx.fillText(t.label, tx + 7, ty + 3);
      });

      frameId = requestAnimationFrame(render);
    };

    render();
    return () => cancelAnimationFrame(frameId);
  }, []);

  return (
    <div className="relative w-full aspect-square max-w-[440px] mx-auto rounded-2xl border border-violet-500/20 bg-[#0c1020]/80 backdrop-blur-xl p-4 flex flex-col items-center justify-center overflow-hidden shadow-2xl shadow-violet-950/40">
      <div className="absolute top-3 left-4 flex items-center gap-2">
        <span className="w-2 h-2 rounded-full bg-cyan-400 animate-ping" />
        <span className="text-[11px] font-mono tracking-widest text-cyan-400 uppercase font-semibold">Arena Multidisciplinary Radar</span>
      </div>
      <div className="absolute top-3 right-4 font-mono text-[10px] text-slate-500">SYSTEM: ACTIVE</div>
      <canvas ref={canvasRef} width={420} height={420} className="w-full h-full object-contain" />
      <div className="absolute bottom-3 inset-x-4 flex justify-between items-center text-[10px] font-mono text-slate-400 border-t border-white/5 pt-2">
        <span>DOMAIN MATRIX: MULTI-TECH</span>
        <span className="text-violet-400">POOL: ₹28,000 PROPOSED</span>
      </div>
    </div>
  );
}

// --- MAIN APPLICATION COMPONENT ---
export default function App() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [activeFaq, setActiveFaq] = useState<number | null>(null);

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 40);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const scrollTo = (id: string) => {
    setMobileMenuOpen(false);
    const element = document.getElementById(id);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  };

  // 12 Multidisciplinary Technology Domains
  const techDomains = [
    {
      title: "Python Programming",
      icon: Terminal,
      code: "PY_CORE",
      desc: "Algorithmic thinking, data structures, and elegant backend automation.",
      gradient: "from-amber-400/20 to-sky-400/20",
      accent: "text-amber-300",
      border: "hover:border-amber-400/50"
    },
    {
      title: "Data Science & Analytics",
      icon: Database,
      code: "DATA_OPS",
      desc: "Exploratory modeling, statistical synthesis, and predictive data pipelines.",
      gradient: "from-cyan-400/20 to-blue-500/20",
      accent: "text-cyan-300",
      border: "hover:border-cyan-400/50"
    },
    {
      title: "Artificial Intelligence (AI)",
      icon: Brain,
      code: "NEURAL_AI",
      desc: "Autonomous logic, heuristic problem-solving, and generative architectures.",
      gradient: "from-violet-500/20 to-fuchsia-500/20",
      accent: "text-violet-300",
      border: "hover:border-violet-400/50"
    },
    {
      title: "Machine Learning (ML)",
      icon: Cpu,
      code: "ML_ENGINE",
      desc: "Predictive model training, reinforcement optimization, and tensor calculations.",
      gradient: "from-sky-500/20 to-indigo-500/20",
      accent: "text-sky-300",
      border: "hover:border-sky-400/50"
    },
    {
      title: "Full Stack Development",
      icon: Layers,
      code: "STACK_SYS",
      desc: "End-to-end software craft uniting reactive frontends with scalable APIs.",
      gradient: "from-emerald-500/20 to-teal-500/20",
      accent: "text-emerald-300",
      border: "hover:border-emerald-400/50"
    },
    {
      title: "Frontend Development",
      icon: Globe,
      code: "WEB_UI",
      desc: "High-performance responsive interfaces, modern component states, and UX fidelity.",
      gradient: "from-blue-500/20 to-cyan-500/20",
      accent: "text-blue-300",
      border: "hover:border-blue-400/50"
    },
    {
      title: "Backend Development",
      icon: Server,
      code: "BACK_SRV",
      desc: "Resilient server architectures, relational microservices, and rapid caching.",
      gradient: "from-purple-500/20 to-indigo-500/20",
      accent: "text-purple-300",
      border: "hover:border-purple-400/50"
    },
    {
      title: "App Development",
      icon: Smartphone,
      code: "APP_CORE",
      desc: "Native and cross-platform mobile experiences crafted for performance and speed.",
      gradient: "from-pink-500/20 to-rose-500/20",
      accent: "text-pink-300",
      border: "hover:border-pink-400/50"
    },
    {
      title: "Cybersecurity",
      icon: ShieldAlert,
      code: "CYBER_DEF",
      desc: "Threat analysis, cryptographic validation, and defensive security protocols.",
      gradient: "from-red-500/20 to-orange-500/20",
      accent: "text-rose-300",
      border: "hover:border-rose-400/50"
    },
    {
      title: "Cloud Computing & DevOps",
      icon: Cloud,
      code: "CLOUD_OPS",
      desc: "CI/CD container pipelines, serverless workflows, and scalable cluster orchestration.",
      gradient: "from-cyan-500/20 to-emerald-500/20",
      accent: "text-cyan-300",
      border: "hover:border-cyan-400/50"
    },
    {
      title: "Competitive Programming",
      icon: Binary,
      code: "ALGO_CP",
      desc: "Rapid dynamic programming, graph traversal, and mathematical time optimization.",
      gradient: "from-amber-500/20 to-yellow-500/20",
      accent: "text-amber-300",
      border: "hover:border-amber-400/50"
    },
    {
      title: "Other Technology Domains",
      icon: Shapes,
      code: "OMNI_TECH",
      desc: "Emerging computing frontiers, blockchain, IoT, and multidisciplinary innovations.",
      gradient: "from-violet-500/20 to-cyan-500/20",
      accent: "text-violet-300",
      border: "hover:border-violet-400/50"
    }
  ];

  const faqData = [
    {
      q: "What is the registration fee?",
      a: "The proposed standard entry fee is ₹99, with an exclusive ₹49 entry fee for eligible existing QSkill students. Official registration details will be announced before registration opens."
    },
    {
      q: "What is the prize pool?",
      a: "The proposed prize pool is ₹28,000, including a ₹20,000 allocation for champions and an ₹8,000 allocation for runners-up, alongside gift vouchers and goodies. Official award terms will be announced before registration opens."
    },
    {
      q: "Which technology fields can participate?",
      a: "QSkill Arena aims to welcome students interested in a wide range of technology domains, including Python, Data Science, AI/ML, Full Stack Development, Cybersecurity, and more. Final competition categories and formats will be announced officially."
    },
    {
      q: "What is QSkill Arena?",
      a: "QSkill Arena is an upcoming student technology championship organized by QSkill, designed around programming, web development, and technical problem-solving."
    },
    {
      q: "Who can participate?",
      a: "Eligibility requirements are being finalized. Official participation criteria will be announced before registration opens."
    },
    {
      q: "Is registration open?",
      a: "No. Registration is not open yet. QSkill Arena is currently in its pre-launch stage."
    },
    {
      q: "Will the competition take place online?",
      a: "The competition is currently being planned as an online event. The final format will be confirmed in the official competition rules."
    },
    {
      q: "When will QSkill Arena launch?",
      a: "The official launch date has not yet been announced. Stay tuned for updates from QSkill."
    },
    {
      q: "Will participants receive certificates?",
      a: "Certificate eligibility and award criteria have not yet been finalized. Official details will be announced before registration opens."
    }
  ];

  return (
    <div className="min-h-screen bg-[#070910] text-[#F8FAFC] font-sans selection:bg-violet-600/40 selection:text-white relative overflow-x-hidden antialiased">
      {/* Background Noise & Subtle Global Arena Grid */}
      <div 
        className="fixed inset-0 pointer-events-none z-0 opacity-20"
        style={{
          backgroundImage: `radial-gradient(rgba(139, 92, 246, 0.25) 1px, transparent 1px), linear-gradient(to right, rgba(255,255,255,0.02) 1px, transparent 1px)`,
          backgroundSize: '40px 40px, 80px 80px'
        }}
      />

      {/* TOP NOTIFICATION / PROPOSED HIGHLIGHT BANNER */}
      <div className="relative z-50 bg-gradient-to-r from-violet-950 via-[#10162f] to-cyan-950 border-b border-violet-500/20 py-2 px-4 text-center text-xs font-mono">
        <div className="max-w-7xl mx-auto flex flex-wrap items-center justify-center gap-2 sm:gap-6 text-slate-300">
          <span className="flex items-center gap-1.5 text-amber-300 font-bold">
            <Trophy className="w-3.5 h-3.5" />
            PROPOSED PRIZE POOL: ₹28,000 + GIFTS & GOODIES
          </span>
          <span className="hidden md:inline text-white/30">•</span>
          <span className="flex items-center gap-1.5 text-cyan-300 font-semibold">
            <GraduationCap className="w-3.5 h-3.5" />
            EXISTING QSKILL STUDENTS: ₹49 EXCLUSIVE FEE (PROPOSED)
          </span>
          <span className="hidden lg:inline text-white/30">•</span>
          <span className="px-2 py-0.5 rounded-full bg-violet-600/30 text-violet-200 text-[10px] uppercase font-bold border border-violet-400/40">
            PRE-LAUNCH
          </span>
        </div>
      </div>

      {/* NAVIGATION BAR */}
      <header 
        className={`fixed top-8 left-0 right-0 z-40 transition-all duration-300 ${
          scrolled 
            ? 'bg-[#070910]/90 backdrop-blur-md border-b border-white/10 py-3 shadow-lg shadow-black/40' 
            : 'bg-transparent py-4 border-b border-transparent'
        }`}
      >
        <div className="max-w-7xl mx-auto px-5 sm:px-8 flex items-center justify-between">
          {/* Brand Logo / Wordmark */}
          <div className="flex items-center gap-3 cursor-pointer select-none" onClick={() => scrollTo('hero')}>
            <div className="relative w-9 h-9 rounded-xl bg-gradient-to-br from-violet-600 via-indigo-600 to-sky-500 p-[1.5px] shadow-lg shadow-violet-600/30">
              <div className="w-full h-full bg-[#0c1020] rounded-[10px] flex items-center justify-center">
                <span className="font-extrabold text-base tracking-tighter bg-clip-text text-transparent bg-gradient-to-r from-violet-300 to-sky-200">
                  Q
                </span>
              </div>
            </div>
            <div className="flex flex-col">
              <span className="font-black tracking-wider text-base sm:text-lg uppercase text-white font-mono flex items-center gap-1.5">
                QSkill <span className="text-violet-400">Arena</span>
              </span>
              <span className="text-[10px] tracking-widest text-[#A5B4CC] uppercase -mt-1 font-mono">
                by QSkill
              </span>
            </div>
          </div>

          {/* Desktop Nav Items */}
          <nav className="hidden lg:flex items-center gap-7">
            {[
              { label: 'Home', id: 'hero' },
              { label: 'Prizes (₹28K)', id: 'prizes' },
              { label: 'Domains', id: 'categories' },
              { label: 'Entry Fee', id: 'pricing' },
              { label: 'Format', id: 'journey' },
              { label: 'Why Arena?', id: 'why' },
              { label: 'FAQ', id: 'faq' }
            ].map((link) => (
              <button
                key={link.id}
                onClick={() => scrollTo(link.id)}
                className="text-sm font-medium text-[#A5B4CC] hover:text-white transition-colors duration-200 cursor-pointer"
              >
                {link.label}
              </button>
            ))}
          </nav>

          {/* Right Action: Pre-Launch Status Badge (strictly informational) */}
          <div className="hidden sm:flex items-center gap-3">
            <div className="relative group">
              <div className="absolute -inset-0.5 bg-gradient-to-r from-violet-600 to-sky-500 rounded-full blur-sm opacity-50 group-hover:opacity-80 transition duration-300" />
              <div className="relative px-4 py-1.5 rounded-full bg-[#0c1020] border border-violet-500/40 text-xs font-mono font-semibold tracking-wider text-violet-300 flex items-center gap-2 select-none shadow-inner">
                <span className="w-2 h-2 rounded-full bg-cyan-400 animate-pulse" />
                <span>COMING SOON</span>
              </div>
            </div>
          </div>

          {/* Mobile Menu Button */}
          <button 
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)} 
            className="lg:hidden p-2 text-slate-400 hover:text-white focus:outline-none"
            aria-label="Toggle navigation menu"
          >
            {mobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>

        {/* Mobile Dropdown Drawer */}
        {mobileMenuOpen && (
          <div className="lg:hidden bg-[#0c1020]/95 backdrop-blur-2xl border-b border-white/10 px-6 py-6 transition-all duration-300 flex flex-col gap-4">
            {[
              { label: 'Home', id: 'hero' },
              { label: 'Prizes (₹28K Pool)', id: 'prizes' },
              { label: 'Tech Domains', id: 'categories' },
              { label: 'Registration Pricing', id: 'pricing' },
              { label: 'Competition Format', id: 'journey' },
              { label: 'Why QSkill Arena?', id: 'why' },
              { label: 'FAQ', id: 'faq' }
            ].map((link) => (
              <button
                key={link.id}
                onClick={() => scrollTo(link.id)}
                className="text-left text-base font-medium text-slate-300 hover:text-cyan-400 transition-colors py-1"
              >
                {link.label}
              </button>
            ))}

            <div className="pt-3 border-t border-white/10 flex items-center justify-between">
              <span className="text-xs font-mono text-slate-400">STATUS</span>
              <span className="px-3 py-1 text-xs font-mono font-bold tracking-wider rounded-full bg-violet-950/80 border border-violet-500/50 text-violet-300">
                COMING SOON
              </span>
            </div>
          </div>
        )}
      </header>

      {/* HERO SECTION */}
      <section id="hero" className="relative min-h-screen flex flex-col items-center justify-center pt-32 pb-16 px-5 sm:px-8 overflow-hidden">
        {/* 3D WebGL Canvas Layer */}
        <Hero3DCanvas />

        {/* Foreground Content Card */}
        <div className="relative z-10 max-w-5xl mx-auto text-center flex flex-col items-center pointer-events-auto">
          {/* Eyebrow badge */}
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-violet-950/60 border border-violet-500/40 backdrop-blur-md mb-5 shadow-sm">
            <Radio className="w-3.5 h-3.5 text-cyan-400 animate-pulse" />
            <span className="text-xs font-mono uppercase tracking-widest text-violet-200 font-semibold">
              THE NEXT GENERATION OF STUDENT COMPETITION
            </span>
          </div>

          {/* ANNOUNCEMENT STRIP 1: ₹28,000 PRIZE POOL */}
          <div className="mb-4 inline-flex items-center gap-2 sm:gap-3 px-4 sm:px-5 py-2 rounded-full bg-gradient-to-r from-amber-500/20 via-violet-600/30 to-sky-500/20 border border-amber-400/40 backdrop-blur-md shadow-lg shadow-amber-950/30">
            <Trophy className="w-4 h-4 text-amber-400 animate-bounce" />
            <span className="font-mono text-xs sm:text-sm font-black tracking-wider text-amber-200 uppercase">
              ₹28,000 PRIZE POOL + GIFTS & GOODIES
            </span>
            <span className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-amber-400/20 text-amber-300 border border-amber-400/40 font-bold uppercase">
              PROPOSED
            </span>
          </div>

          {/* ANNOUNCEMENT BADGE 2: ₹49 EXCLUSIVE ENTRY FOR EXISTING QSKILL STUDENTS */}
          <div className="mb-6 inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-cyan-950/60 border border-cyan-400/30 text-cyan-300 text-xs font-mono">
            <GraduationCap className="w-3.5 h-3.5 text-cyan-300" />
            <span className="font-semibold tracking-wide">
              ₹49 EXCLUSIVE ENTRY FOR EXISTING QSKILL STUDENTS
            </span>
            <span className="text-slate-400 font-normal">| ₹99 Standard</span>
          </div>

          {/* Main Giant Headline */}
          <h1 className="text-4xl sm:text-6xl md:text-7xl lg:text-8xl font-black tracking-tight leading-[1.05] mb-4 uppercase">
            YOUR SKILLS. <br />
            <span className="bg-clip-text text-transparent bg-gradient-to-r from-violet-400 via-sky-400 to-cyan-300 drop-shadow-[0_10px_25px_rgba(139,92,246,0.35)]">
              YOUR ARENA.
            </span>
          </h1>

          {/* Primary Tagline */}
          <p className="text-lg sm:text-2xl font-medium tracking-wide text-cyan-200/90 font-mono mb-4">
            Build. Compete. Prove Your Skills.
          </p>

          {/* Description */}
          <p className="max-w-2xl text-sm sm:text-base md:text-lg text-[#A5B4CC] leading-relaxed mb-7">
            An upcoming national student technology championship where ambitious minds come together to challenge themselves, solve problems across cutting-edge tech domains, and showcase their technical potential.
          </p>

          {/* Prominent Coming Soon Container */}
          <div className="flex flex-col items-center gap-2 mb-8">
            <div className="relative group">
              <div className="absolute -inset-1 bg-gradient-to-r from-violet-600 via-sky-500 to-cyan-400 rounded-2xl blur-md opacity-70 group-hover:opacity-100 transition duration-500" />
              <div className="relative px-8 sm:px-12 py-3.5 sm:py-4 rounded-xl bg-[#0c1020] border border-violet-400/50 flex items-center gap-3.5 shadow-2xl">
                <span className="w-2.5 h-2.5 rounded-full bg-cyan-400 animate-ping" />
                <span className="font-mono text-xl sm:text-2xl md:text-3xl font-black tracking-widest text-white">
                  COMING SOON
                </span>
              </div>
            </div>
            <p className="text-xs sm:text-sm font-mono text-[#A5B4CC] flex items-center gap-1.5 mt-1">
              <Sparkles className="w-3.5 h-3.5 text-violet-400" />
              Something extraordinary is being built.
            </p>
            <span className="text-[11px] font-mono uppercase tracking-widest text-slate-500">
              Organized by QSkill • Registration Not Live Yet
            </span>
          </div>

          {/* Key Metrics Strip */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 sm:gap-4 max-w-3xl w-full border-t border-white/10 pt-5 text-left">
            <div className="px-3 py-2 bg-white/[0.02] rounded-lg border border-white/5">
              <span className="text-[10px] font-mono text-slate-400 block uppercase">Prize Pool (Prop.)</span>
              <span className="text-sm sm:text-base font-bold text-amber-300">₹28,000 + Gifts</span>
            </div>
            <div className="px-3 py-2 bg-white/[0.02] rounded-lg border border-white/5">
              <span className="text-[10px] font-mono text-slate-400 block uppercase">QSkill Students</span>
              <span className="text-sm sm:text-base font-bold text-cyan-300">₹49 Only</span>
            </div>
            <div className="px-3 py-2 bg-white/[0.02] rounded-lg border border-white/5">
              <span className="text-[10px] font-mono text-slate-400 block uppercase">Standard Entry</span>
              <span className="text-sm sm:text-base font-bold text-slate-200">₹99 Proposed</span>
            </div>
            <div className="px-3 py-2 bg-white/[0.02] rounded-lg border border-white/5">
              <span className="text-[10px] font-mono text-slate-400 block uppercase">Status</span>
              <span className="text-sm sm:text-base font-semibold text-cyan-400 flex items-center gap-1">
                <span className="w-1.5 h-1.5 rounded-full bg-cyan-400 animate-pulse" /> Pre-Launch
              </span>
            </div>
          </div>
        </div>

        {/* Scroll Indicator */}
        <div 
          onClick={() => scrollTo('prizes')} 
          className="absolute bottom-5 left-1/2 -translate-x-1/2 flex flex-col items-center gap-1 cursor-pointer text-slate-400 hover:text-white transition group z-20"
        >
          <span className="text-[10px] font-mono tracking-widest uppercase group-hover:text-cyan-400 transition">View Prizes</span>
          <ChevronDown className="w-4 h-4 animate-bounce text-violet-400" />
        </div>
      </section>

      {/* 2. REIMAGINED PRIZE SECTION */}
      <section id="prizes" className="py-24 px-5 sm:px-8 relative z-10 border-t border-white/5 bg-[#070910]">
        <div className="max-w-7xl mx-auto">
          {/* Section Header */}
          <div className="text-center max-w-3xl mx-auto mb-14">
            <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-amber-950/40 border border-amber-500/40 text-xs font-mono text-amber-300 mb-3">
              <Trophy className="w-3.5 h-3.5 text-amber-400" />
              NATIONAL RECOGNITION
            </div>
            <h2 className="text-3xl sm:text-4xl md:text-5xl font-black uppercase tracking-tight mb-4">
              EXCELLENCE DESERVES RECOGNITION.
            </h2>
            <p className="text-base sm:text-lg text-[#A5B4CC] mb-6">
              QSkill Arena is being developed to celebrate technical ability, creative thinking, and outstanding student performance.
            </p>

            {/* Total Prize Pool Hero Banner */}
            <div className="relative group max-w-2xl mx-auto">
              <div className="absolute -inset-1 bg-gradient-to-r from-amber-500 via-violet-600 to-sky-400 rounded-2xl blur-lg opacity-70 group-hover:opacity-100 transition duration-500" />
              <div className="relative rounded-xl bg-gradient-to-r from-[#171226] via-[#101426] to-[#0c1b2c] border border-amber-400/50 p-6 sm:p-7 shadow-2xl text-center">
                <span className="text-xs font-mono uppercase tracking-widest text-amber-300 font-bold block mb-1">
                  PROPOSED COMPETITION ANNOUNCEMENT
                </span>
                <div className="text-2xl sm:text-4xl md:text-5xl font-black tracking-tight text-white mb-2 font-mono">
                  TOTAL PRIZE POOL: <span className="text-amber-400 drop-shadow-[0_0_25px_rgba(251,191,36,0.4)]">₹28,000</span>
                </div>
                <div className="text-sm sm:text-base font-semibold text-cyan-300 flex items-center justify-center gap-2">
                  <Gift className="w-4 h-4 text-cyan-300" />
                  + EXCLUSIVE GIFTS & GOODIES FOR TOP PERFORMERS
                </div>
              </div>
            </div>
          </div>

          {/* Dual Award Allocation Cards (Champions & Runners-Up) */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-5xl mx-auto pt-4">
            {/* 🏆 CHAMPIONS CARD (Luxurious Gold & Electric Violet) */}
            <div className="relative rounded-2xl bg-gradient-to-b from-[#221735] via-[#171328] to-[#100d1c] border-2 border-amber-400/60 p-8 sm:p-10 flex flex-col justify-between shadow-2xl shadow-violet-950/60 overflow-hidden group">
              {/* Gold & Violet Atmospheric Glows */}
              <div className="absolute -top-16 -right-16 w-56 h-56 bg-amber-500/15 rounded-full blur-3xl pointer-events-none group-hover:bg-amber-500/25 transition-all" />
              <div className="absolute -bottom-16 -left-16 w-56 h-56 bg-violet-600/20 rounded-full blur-3xl pointer-events-none" />

              <div className="relative z-10">
                <div className="flex items-center justify-between mb-6">
                  <div className="flex items-center gap-2 px-3 py-1 rounded-full bg-amber-400/10 border border-amber-400/40 text-amber-300 text-xs font-mono font-bold">
                    <Trophy className="w-4 h-4 text-amber-400" />
                    TIER 01 • PROPOSED
                  </div>
                  <span className="text-xs font-mono text-violet-300 font-semibold uppercase tracking-wider">
                    NATIONAL CHAMPION
                  </span>
                </div>

                <div className="flex items-center gap-3 mb-4">
                  <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-amber-400 to-amber-600 p-[1.5px] shadow-lg shadow-amber-500/30">
                    <div className="w-full h-full bg-[#160f26] rounded-[14px] flex items-center justify-center">
                      <span className="text-2xl">🏆</span>
                    </div>
                  </div>
                  <div>
                    <h3 className="text-2xl sm:text-3xl font-black uppercase tracking-tight text-white">
                      CHAMPIONS
                    </h3>
                    <span className="text-xs font-mono text-amber-300">Grand Winner Allocation</span>
                  </div>
                </div>

                {/* Oversized ₹20,000 Typography */}
                <div className="my-6 p-6 rounded-xl bg-[#080611]/80 border border-amber-400/30 backdrop-blur-md">
                  <span className="text-xs font-mono text-slate-400 uppercase tracking-widest block mb-1">
                    Prize Pool Allocation
                  </span>
                  <div className="text-4xl sm:text-5xl lg:text-6xl font-black text-amber-400 font-mono tracking-tight drop-shadow-[0_0_20px_rgba(251,191,36,0.35)]">
                    ₹20,000
                  </div>
                </div>

                {/* Benefits List */}
                <ul className="space-y-3 font-mono text-sm text-slate-200 mb-6">
                  <li className="flex items-center gap-2.5">
                    <CheckCircle2 className="w-4 h-4 text-amber-400 shrink-0" />
                    <span>₹20,000 Prize Pool Allocation</span>
                  </li>
                  <li className="flex items-center gap-2.5">
                    <Gift className="w-4 h-4 text-amber-400 shrink-0" />
                    <span>Exclusive Gift Vouchers</span>
                  </li>
                  <li className="flex items-center gap-2.5">
                    <Sparkles className="w-4 h-4 text-amber-400 shrink-0" />
                    <span>Premium Goodies & Winner Package</span>
                  </li>
                </ul>
              </div>

              <div className="relative z-10 pt-4 border-t border-amber-400/20 flex items-center justify-between text-xs font-mono text-amber-300/80">
                <span>RECOGNITION: HIGHEST STANDING</span>
                <span className="px-2 py-0.5 rounded bg-amber-400/10 font-bold">PROPOSED</span>
              </div>
            </div>

            {/* 🥈 RUNNERS-UP CARD (Silver & Cyber Blue) */}
            <div className="relative rounded-2xl bg-gradient-to-b from-[#111e38] via-[#0e1628] to-[#09101c] border-2 border-sky-400/50 p-8 sm:p-10 flex flex-col justify-between shadow-2xl shadow-sky-950/50 overflow-hidden group">
              {/* Silver & Blue Atmospheric Glows */}
              <div className="absolute -top-16 -right-16 w-56 h-56 bg-sky-500/15 rounded-full blur-3xl pointer-events-none group-hover:bg-sky-500/25 transition-all" />
              <div className="absolute -bottom-16 -left-16 w-56 h-56 bg-cyan-600/20 rounded-full blur-3xl pointer-events-none" />

              <div className="relative z-10">
                <div className="flex items-center justify-between mb-6">
                  <div className="flex items-center gap-2 px-3 py-1 rounded-full bg-sky-400/10 border border-sky-400/40 text-sky-300 text-xs font-mono font-bold">
                    <Award className="w-4 h-4 text-sky-400" />
                    TIER 02 • PROPOSED
                  </div>
                  <span className="text-xs font-mono text-sky-300 font-semibold uppercase tracking-wider">
                    RUNNER-UP MERIT
                  </span>
                </div>

                <div className="flex items-center gap-3 mb-4">
                  <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-slate-300 to-sky-400 p-[1.5px] shadow-lg shadow-sky-500/20">
                    <div className="w-full h-full bg-[#0a1426] rounded-[14px] flex items-center justify-center">
                      <span className="text-2xl">🥈</span>
                    </div>
                  </div>
                  <div>
                    <h3 className="text-2xl sm:text-3xl font-black uppercase tracking-tight text-white">
                      RUNNERS-UP
                    </h3>
                    <span className="text-xs font-mono text-sky-300">Merit Allocation</span>
                  </div>
                </div>

                {/* Oversized ₹8,000 Typography */}
                <div className="my-6 p-6 rounded-xl bg-[#060b17]/80 border border-sky-400/30 backdrop-blur-md">
                  <span className="text-xs font-mono text-slate-400 uppercase tracking-widest block mb-1">
                    Prize Pool Allocation
                  </span>
                  <div className="text-4xl sm:text-5xl lg:text-6xl font-black text-sky-300 font-mono tracking-tight drop-shadow-[0_0_20px_rgba(56,189,248,0.3)]">
                    ₹8,000
                  </div>
                </div>

                {/* Benefits List */}
                <ul className="space-y-3 font-mono text-sm text-slate-200 mb-6">
                  <li className="flex items-center gap-2.5">
                    <CheckCircle2 className="w-4 h-4 text-sky-400 shrink-0" />
                    <span>₹8,000 Prize Pool Allocation</span>
                  </li>
                  <li className="flex items-center gap-2.5">
                    <Gift className="w-4 h-4 text-sky-400 shrink-0" />
                    <span>Gift Vouchers</span>
                  </li>
                  <li className="flex items-center gap-2.5">
                    <Sparkles className="w-4 h-4 text-sky-400 shrink-0" />
                    <span>Exclusive Goodies Package</span>
                  </li>
                </ul>
              </div>

              <div className="relative z-10 pt-4 border-t border-sky-400/20 flex items-center justify-between text-xs font-mono text-sky-300/80">
                <span>RECOGNITION: RUNNER-UP MERIT</span>
                <span className="px-2 py-0.5 rounded bg-sky-400/10 font-bold">PROPOSED</span>
              </div>
            </div>
          </div>

          {/* Official Prize Disclaimer Statement */}
          <div className="mt-12 text-center max-w-2xl mx-auto p-4 rounded-xl bg-white/[0.02] border border-white/5">
            <p className="text-xs sm:text-sm font-mono text-[#A5B4CC] leading-relaxed">
              Official prize details, award criteria, and competition rules will be announced before registration opens. Proposed competition announcements.
            </p>
          </div>
        </div>
      </section>

      {/* 3. MULTIDISCIPLINARY COMPETITION CATEGORIES */}
      <section id="categories" className="py-24 px-5 sm:px-8 relative z-10 bg-[#0C1020]/70 border-t border-white/5">
        <div className="max-w-7xl mx-auto">
          {/* Section Header */}
          <div className="text-center max-w-3xl mx-auto mb-16">
            <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-violet-950/40 border border-violet-500/30 text-xs font-mono text-cyan-300 mb-3">
              <Zap className="w-3.5 h-3.5 text-cyan-400" />
              EXPANDED MULTIDISCIPLINARY ARENA
            </div>
            <h2 className="text-3xl sm:text-4xl md:text-5xl font-black uppercase tracking-tight mb-4">
              ONE ARENA. EVERY TECH DOMAIN.
            </h2>
            <p className="text-base sm:text-lg text-[#A5B4CC] mb-3">
              Whether you're passionate about Python, building full-stack applications, exploring artificial intelligence, working with data, or mastering another technology domain, QSkill Arena is designed to bring ambitious tech minds together.
            </p>
            <p className="text-xs sm:text-sm font-mono text-cyan-300 font-semibold tracking-wide">
              "Explore your field. Challenge your limits. Showcase your skills."
            </p>
          </div>

          {/* 12 Domains Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5">
            {techDomains.map((domain, index) => {
              const IconComp = domain.icon;
              return (
                <div 
                  key={index}
                  className={`group relative rounded-2xl bg-[#111729] border border-white/10 ${domain.border} p-6 flex flex-col justify-between transition-all duration-300 hover:-translate-y-1 shadow-lg hover:shadow-2xl overflow-hidden`}
                >
                  {/* Subtle hover gradient background */}
                  <div className={`absolute inset-0 bg-gradient-to-br ${domain.gradient} opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none`} />

                  <div className="relative z-10">
                    <div className="flex items-center justify-between mb-4">
                      <div className="p-3 rounded-xl bg-[#070910] border border-white/10 group-hover:border-violet-500/40 transition">
                        <IconComp className={`w-5 h-5 ${domain.accent}`} />
                      </div>
                      <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-white/5 text-slate-400 border border-white/5 font-semibold">
                        {domain.code}
                      </span>
                    </div>

                    <h3 className="text-lg font-bold uppercase tracking-tight text-white mb-2 group-hover:text-cyan-200 transition">
                      {domain.title}
                    </h3>

                    <p className="text-xs text-[#A5B4CC] leading-relaxed mb-4">
                      {domain.desc}
                    </p>
                  </div>

                  <div className="relative z-10 pt-3 border-t border-white/5 flex items-center justify-between text-[11px] font-mono text-slate-500">
                    <span className="flex items-center gap-1 text-cyan-400/80">
                      <Clock className="w-3 h-3" />
                      PLANNED DOMAIN
                    </span>
                    <span className="text-violet-400 group-hover:translate-x-0.5 transition">
                      0{index + 1}
                    </span>
                  </div>
                </div>
              );
            })}
          </div>

          {/* Multidisciplinary Disclaimer */}
          <div className="mt-12 text-center max-w-2xl mx-auto">
            <p className="text-xs font-mono text-slate-500">
              * Note: These represent technology domains the competition aims to welcome. Final competition tracks, challenge formats, and specific track allocations will be officially announced before launch.
            </p>
          </div>
        </div>
      </section>

      {/* 1. REGISTRATION FEE COMPARISON SECTION */}
      <section id="pricing" className="py-24 px-5 sm:px-8 relative z-10 border-t border-white/5 bg-[#070910]">
        <div className="max-w-7xl mx-auto">
          <div className="text-center max-w-3xl mx-auto mb-14">
            <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-cyan-950/40 border border-cyan-500/40 text-xs font-mono text-cyan-300 mb-3">
              <Tag className="w-3.5 h-3.5 text-cyan-400" />
              PROPOSED REGISTRATION PRICING
            </div>
            <h2 className="text-3xl sm:text-4xl md:text-5xl font-black uppercase tracking-tight mb-4">
              ACCESSIBLE ENTRY FOR BUILDERS.
            </h2>
            <p className="text-base sm:text-lg text-[#A5B4CC]">
              Proposed registration fee breakdown. The registration system is not live yet.
            </p>
          </div>

          {/* Pricing Comparison Cards */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-4xl mx-auto">
            {/* Standard Entry Fee: ₹99 */}
            <div className="rounded-2xl bg-[#111729] border border-white/10 p-8 flex flex-col justify-between shadow-xl">
              <div>
                <div className="flex items-center justify-between mb-4">
                  <span className="text-xs font-mono uppercase tracking-widest text-slate-400 font-semibold">
                    OPEN PARTICIPATION
                  </span>
                  <span className="text-[10px] font-mono px-2.5 py-0.5 rounded-full bg-slate-800 text-slate-300 border border-white/10">
                    ALL COLLEGES
                  </span>
                </div>

                <h3 className="text-2xl font-bold uppercase tracking-tight text-white mb-2">
                  Standard Entry Fee
                </h3>
                <p className="text-xs text-[#A5B4CC] mb-6">
                  Available for all eligible college and university students across India.
                </p>

                <div className="p-6 rounded-xl bg-[#070910] border border-white/10 mb-6">
                  <span className="text-xs font-mono text-slate-400 block mb-1">Proposed Fee</span>
                  <div className="text-4xl sm:text-5xl font-black text-white font-mono">
                    ₹99
                  </div>
                  <span className="text-[11px] font-mono text-slate-400 mt-1 block">One-time participation entry</span>
                </div>

                <ul className="space-y-2.5 text-xs font-mono text-slate-300 mb-6">
                  <li className="flex items-center gap-2">
                    <CheckCircle2 className="w-3.5 h-3.5 text-slate-400" />
                    <span>Access to proposed competition assessments</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <CheckCircle2 className="w-3.5 h-3.5 text-slate-400" />
                    <span>Eligible for ₹28,000 prize pool allocation</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <CheckCircle2 className="w-3.5 h-3.5 text-slate-400" />
                    <span>National rank benchmark evaluation</span>
                  </li>
                </ul>
              </div>

              <div className="p-3 rounded-lg bg-white/[0.02] border border-white/5 text-center text-xs font-mono text-slate-400 font-semibold">
                REGISTRATION OPENS SOON
              </div>
            </div>

            {/* Exclusive QSkill Existing Students Fee: ₹49 (High visual prominence) */}
            <div className="relative rounded-2xl bg-gradient-to-b from-[#1b1536] via-[#111729] to-[#0c1020] border-2 border-violet-500/70 p-8 flex flex-col justify-between shadow-2xl shadow-violet-950/60 group">
              {/* Highlight ribbon */}
              <div className="absolute -top-3.5 left-1/2 -translate-x-1/2 px-4 py-0.5 rounded-full bg-gradient-to-r from-violet-600 via-sky-500 to-cyan-400 text-[10px] font-mono uppercase tracking-widest font-black text-white shadow-md flex items-center gap-1.5 whitespace-nowrap">
                <Sparkles className="w-3 h-3 text-cyan-200" />
                EXCLUSIVE STUDENT PRIVILEGE
              </div>

              <div>
                <div className="flex items-center justify-between mb-4 pt-1">
                  <span className="text-xs font-mono uppercase tracking-widest text-cyan-300 font-bold flex items-center gap-1.5">
                    <GraduationCap className="w-4 h-4 text-cyan-400" />
                    QSKILL COMMUNITY
                  </span>
                  <span className="text-[10px] font-mono px-2.5 py-0.5 rounded-full bg-violet-600/30 text-violet-200 border border-violet-400/40 font-bold">
                    SPECIAL RATE
                  </span>
                </div>

                <h3 className="text-2xl font-bold uppercase tracking-tight text-white mb-2">
                  Existing QSkill Students
                </h3>
                <p className="text-xs text-cyan-200/90 mb-6">
                  Available <strong className="text-white">ONLY</strong> to verified existing learners enrolled in QSkill programs.
                </p>

                {/* Visual Fee Comparison Highlight */}
                <div className="p-6 rounded-xl bg-[#080614] border border-cyan-400/40 mb-6 relative overflow-hidden">
                  <div className="flex items-baseline gap-3">
                    <div className="text-4xl sm:text-5xl font-black text-cyan-300 font-mono drop-shadow-[0_0_15px_rgba(103,232,249,0.35)]">
                      ₹49
                    </div>
                    <div className="text-lg font-mono text-slate-500 line-through">
                      ₹99
                    </div>
                    <span className="text-xs font-mono font-bold text-violet-300 px-2 py-0.5 rounded bg-violet-950/60 border border-violet-500/30">
                      50% OFF
                    </span>
                  </div>
                  <span className="text-[11px] font-mono text-cyan-400 mt-2 block font-medium">
                    Exclusive subsidized rate for existing QSkill students
                  </span>
                </div>

                <ul className="space-y-2.5 text-xs font-mono text-slate-200 mb-6">
                  <li className="flex items-center gap-2">
                    <CheckCircle2 className="w-3.5 h-3.5 text-cyan-400" />
                    <span>Exclusive ₹49 entry pricing tier</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <CheckCircle2 className="w-3.5 h-3.5 text-cyan-400" />
                    <span>Full eligibility for ₹28,000 prize pool</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <CheckCircle2 className="w-3.5 h-3.5 text-cyan-400" />
                    <span>Verified learner validation required upon launch</span>
                  </li>
                </ul>
              </div>

              {/* Informational Coming Soon Pill */}
              <div className="p-3.5 rounded-xl bg-violet-950/40 border border-violet-400/50 text-center flex items-center justify-center gap-2 text-xs font-mono font-bold text-cyan-300">
                <span className="w-2 h-2 rounded-full bg-cyan-400 animate-ping" />
                <span>REGISTRATION SYSTEM NOT LIVE YET • COMING SOON</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ABOUT QSKILL ARENA */}
      <section id="about" className="py-24 px-5 sm:px-8 relative z-10 border-t border-white/5 bg-[#0C1020]/70">
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-16 items-center">
            {/* Left Column: Vision */}
            <div className="lg:col-span-7 flex flex-col space-y-6">
              <div className="inline-flex items-center gap-2 text-xs font-mono text-violet-400 uppercase tracking-widest">
                <ShieldCheck className="w-4 h-4 text-cyan-400" />
                Architected for Excellence
              </div>

              <h2 className="text-3xl sm:text-4xl md:text-5xl font-black tracking-tight uppercase leading-tight">
                MORE THAN A COMPETITION.
              </h2>
              <p className="text-lg sm:text-xl text-cyan-300 font-medium">
                A platform for the next generation of builders.
              </p>

              <div className="space-y-4 text-base sm:text-lg text-[#A5B4CC] leading-relaxed">
                <p>
                  QSkill Arena is an upcoming student technology championship designed to bring ambitious learners together through programming, web development, practical challenges, and technical problem-solving.
                </p>
                <p>
                  The goal is to create an environment where students can challenge themselves, demonstrate what they know, learn through competition, and gain recognition for their efforts.
                </p>
                <p>
                  Whether you're passionate about Python or excited about building for the web, QSkill Arena is being designed for students who want to push their skills further.
                </p>
              </div>

              {/* Supporting Highlights */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-4">
                <div className="p-4 rounded-xl bg-[#111729] border border-white/5">
                  <span className="text-xs font-mono text-cyan-400 font-bold block mb-1">01 / MERIT-FIRST</span>
                  <p className="text-sm text-slate-300">Evaluations calibrated on genuine algorithmic precision and clean architectural implementation.</p>
                </div>
                <div className="p-4 rounded-xl bg-[#111729] border border-white/5">
                  <span className="text-xs font-mono text-violet-400 font-bold block mb-1">02 / STUDENT EMPOWERMENT</span>
                  <p className="text-sm text-slate-300">Created to celebrate undergraduate innovators, self-taught coders, and polymath builders alike.</p>
                </div>
              </div>
            </div>

            {/* Right Column: Holographic Arena Radar */}
            <div className="lg:col-span-5 w-full flex justify-center">
              <HolographicArenaRadar />
            </div>
          </div>
        </div>
      </section>

      {/* THE COMPETITION JOURNEY */}
      <section id="journey" className="py-24 px-5 sm:px-8 relative z-10 border-t border-white/5 bg-[#070910]">
        <div className="max-w-7xl mx-auto">
          {/* Section Header */}
          <div className="text-center max-w-3xl mx-auto mb-16">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-violet-950/40 border border-violet-500/30 text-xs font-mono text-violet-300 font-semibold mb-3">
              <Compass className="w-3.5 h-3.5 text-cyan-400" />
              PROPOSED COMPETITION FORMAT
            </div>
            <h2 className="text-3xl sm:text-4xl md:text-5xl font-black uppercase tracking-tight mb-4">
              FROM FIRST CHALLENGE TO FINAL VICTORY.
            </h2>
            <p className="text-base sm:text-lg text-[#A5B4CC]">
              A planned multi-stage progression engineered to surface authentic skill and technical stamina.
            </p>
          </div>

          {/* Connected 4-Stage Timeline Grid */}
          <div className="relative">
            <div className="hidden lg:block absolute top-1/2 left-0 right-0 h-[2px] bg-gradient-to-r from-violet-600 via-sky-500 to-cyan-400 -translate-y-6 opacity-40" />

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              {[
                {
                  stage: "STAGE 01",
                  title: "QUALIFY",
                  icon: Code2,
                  desc: "Begin with an assessment designed to evaluate fundamental knowledge and problem-solving skills.",
                  status: "Stage One"
                },
                {
                  stage: "STAGE 02",
                  title: "COMPETE",
                  icon: Cpu,
                  desc: "Advance to more challenging tasks that test your technical understanding and coding ability.",
                  status: "Stage Two"
                },
                {
                  stage: "STAGE 03",
                  title: "BUILD",
                  icon: Layers,
                  desc: "Demonstrate practical skills through a more advanced challenge or project.",
                  status: "Stage Three"
                },
                {
                  stage: "STAGE 04",
                  title: "GET RECOGNIZED",
                  icon: Trophy,
                  desc: "Top performers may earn recognition for their performance through the competition's final ranking and awards.",
                  status: "Final Stage"
                }
              ].map((step, idx) => {
                const IconComponent = step.icon;
                return (
                  <div 
                    key={idx}
                    className="relative rounded-2xl bg-[#111729] border border-white/10 p-6 flex flex-col justify-between hover:border-cyan-500/40 transition-all duration-300 shadow-xl group"
                  >
                    <div>
                      <div className="flex items-center justify-between mb-4">
                        <span className="text-xs font-mono font-bold text-violet-400 tracking-wider">
                          {step.stage}
                        </span>
                        <div className="w-8 h-8 rounded-full bg-[#070910] border border-violet-500/40 flex items-center justify-center text-xs font-mono font-bold text-cyan-300 group-hover:scale-110 group-hover:border-cyan-400 transition">
                          0{idx + 1}
                        </div>
                      </div>

                      <div className="flex items-center gap-2.5 mb-3">
                        <IconComponent className="w-5 h-5 text-cyan-400" />
                        <h3 className="text-xl font-bold uppercase tracking-tight text-white">
                          {step.title}
                        </h3>
                      </div>

                      <p className="text-sm text-[#A5B4CC] leading-relaxed">
                        {step.desc}
                      </p>
                    </div>

                    <div className="pt-6 mt-6 border-t border-white/5 flex items-center justify-between text-[11px] font-mono text-slate-500">
                      <span>FLOW // STEP 0{idx + 1}</span>
                      <span className="text-violet-400 uppercase">{step.status}</span>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          <div className="mt-10 text-center">
            <p className="text-xs font-mono text-slate-500">
              * Specific round dates, durations, qualifying cutoffs, and exact assessment formats will be officially announced prior to competition launch.
            </p>
          </div>
        </div>
      </section>

      {/* WHAT PARTICIPANTS CAN LOOK FORWARD TO */}
      <section className="py-24 px-5 sm:px-8 relative z-10 bg-[#0C1020]/70 border-t border-white/5">
        <div className="max-w-7xl mx-auto">
          <div className="text-center max-w-3xl mx-auto mb-16">
            <span className="text-xs font-mono text-violet-400 tracking-widest uppercase font-semibold block mb-2">
              WHY COMPETE
            </span>
            <h2 className="text-3xl sm:text-4xl md:text-5xl font-black uppercase tracking-tight mb-4">
              YOUR SKILLS DESERVE A STAGE.
            </h2>
            <p className="text-base sm:text-lg text-[#A5B4CC]">
              The pillars driving the upcoming championship journey.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {[
              {
                num: "CARD 01",
                title: "REAL CHALLENGES",
                icon: Zap,
                body: "Put your technical knowledge and problem-solving skills to the test with thoughtfully curated assessments."
              },
              {
                num: "CARD 02",
                title: "HEALTHY COMPETITION",
                icon: Flame,
                body: "Challenge yourself, measure your progress, and learn from the experience alongside motivated peers."
              },
              {
                num: "CARD 03",
                title: "RECOGNITION",
                icon: Award,
                body: "Discover opportunities to showcase your performance and celebrate your achievements."
              },
              {
                num: "CARD 04",
                title: "STUDENT COMMUNITY",
                icon: Users2,
                body: "Be part of a community of learners who are passionate about technology and building new things."
              }
            ].map((card, i) => {
              const Icon = card.icon;
              return (
                <div 
                  key={i}
                  className="rounded-2xl bg-[#111729] border border-white/10 p-7 hover:border-violet-500/40 transition duration-300 flex flex-col justify-between group shadow-xl"
                >
                  <div>
                    <div className="flex items-center justify-between mb-5">
                      <div className="p-3 rounded-xl bg-violet-600/15 text-cyan-300 border border-violet-500/30 group-hover:bg-violet-600/25 transition">
                        <Icon className="w-6 h-6" />
                      </div>
                      <span className="text-[11px] font-mono text-slate-500 font-semibold">{card.num}</span>
                    </div>
                    <h3 className="text-lg font-bold uppercase tracking-tight text-white mb-2.5">
                      {card.title}
                    </h3>
                    <p className="text-sm text-[#A5B4CC] leading-relaxed">
                      {card.body}
                    </p>
                  </div>
                  <div className="mt-6 pt-4 border-t border-white/5 flex items-center gap-1.5 text-xs font-mono text-cyan-400">
                    <CheckCircle2 className="w-3.5 h-3.5" />
                    <span>Arena Value</span>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* WHY QSKILL ARENA? */}
      <section id="why" className="py-24 px-5 sm:px-8 relative z-10 border-t border-white/5 bg-[#070910]">
        <div className="max-w-7xl mx-auto">
          <div className="text-center max-w-3xl mx-auto mb-16">
            <span className="text-xs font-mono text-cyan-400 tracking-widest uppercase font-semibold block mb-2">
              OUR GUIDING ETHOS
            </span>
            <h2 className="text-3xl sm:text-4xl md:text-5xl font-black uppercase tracking-tight mb-4">
              BUILT FOR AMBITIOUS MINDS.
            </h2>
            <p className="text-base sm:text-lg text-[#A5B4CC]">
              The core principles powering our championship philosophy.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="p-8 rounded-2xl bg-[#111729] border border-white/10 relative overflow-hidden flex flex-col justify-between">
              <div>
                <span className="text-4xl font-mono font-black text-violet-500/40 block mb-6">01</span>
                <h3 className="text-xl font-bold uppercase tracking-tight text-white mb-3">
                  LEARN BY CHALLENGING YOURSELF
                </h3>
                <p className="text-sm sm:text-base text-[#A5B4CC] leading-relaxed">
                  "Growth happens when you move beyond what already feels familiar."
                </p>
              </div>
              <div className="mt-8 pt-4 border-t border-white/5 text-xs font-mono text-slate-500">
                PILLAR // CONTINUOUS EVOLUTION
              </div>
            </div>

            <div className="p-8 rounded-2xl bg-[#111729] border border-cyan-500/30 relative overflow-hidden flex flex-col justify-between shadow-lg shadow-cyan-950/20">
              <div>
                <span className="text-4xl font-mono font-black text-cyan-400/50 block mb-6">02</span>
                <h3 className="text-xl font-bold uppercase tracking-tight text-white mb-3">
                  SHOW WHAT YOU CAN BUILD
                </h3>
                <p className="text-sm sm:text-base text-[#A5B4CC] leading-relaxed">
                  "Technical ability deserves opportunities to be demonstrated through meaningful challenges."
                </p>
              </div>
              <div className="mt-8 pt-4 border-t border-white/5 text-xs font-mono text-slate-500">
                PILLAR // PRACTICAL APPLICATION
              </div>
            </div>

            <div className="p-8 rounded-2xl bg-[#111729] border border-white/10 relative overflow-hidden flex flex-col justify-between">
              <div>
                <span className="text-4xl font-mono font-black text-violet-500/40 block mb-6">03</span>
                <h3 className="text-xl font-bold uppercase tracking-tight text-white mb-3">
                  CELEBRATE STUDENT POTENTIAL
                </h3>
                <p className="text-sm sm:text-base text-[#A5B4CC] leading-relaxed">
                  "Every learner has the opportunity to improve, compete fairly, and work toward excellence."
                </p>
              </div>
              <div className="mt-8 pt-4 border-t border-white/5 text-xs font-mono text-slate-500">
                PILLAR // MERITOCRACY
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 5. COMPETITION DETAILS (THE ARENA AT A GLANCE) */}
      <section className="py-24 px-5 sm:px-8 relative z-10 bg-[#0C1020]/70 border-t border-white/5">
        <div className="max-w-7xl mx-auto">
          <div className="text-center max-w-3xl mx-auto mb-16">
            <span className="text-xs font-mono text-violet-400 tracking-widest uppercase font-semibold block mb-2">
              VERIFIED OVERVIEW
            </span>
            <h2 className="text-3xl sm:text-4xl md:text-5xl font-black uppercase tracking-tight mb-4">
              THE ARENA AT A GLANCE.
            </h2>
            <p className="text-base sm:text-lg text-[#A5B4CC]">
              Core institutional parameters of the upcoming competition.
            </p>
          </div>

          {/* Clean Information Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5 max-w-5xl mx-auto">
            {[
              { label: "Event", value: "QSkill Arena", highlight: false },
              { label: "Organizer", value: "QSkill", highlight: false },
              { label: "Format", value: "Online — Proposed", highlight: false },
              { label: "Audience", value: "Students & aspiring tech builders", highlight: false },
              { label: "Planned Domains", value: "12 Multidisciplinary Tech Fields", highlight: false },
              { label: "Prize Pool", value: "₹28,000 + Gifts (Proposed)", highlight: true, color: "text-amber-400" },
              { label: "Standard Registration", value: "₹99 Proposed", highlight: false },
              { label: "QSkill Student Fee", value: "₹49 Exclusive Proposed", highlight: true, color: "text-cyan-400" },
              { label: "Competition Status", value: "COMING SOON", highlight: true, color: "text-violet-400" },
              { label: "Registration System", value: "NOT OPEN YET", highlight: true, color: "text-rose-400" },
              { label: "Event Dates", value: "To Be Announced", highlight: false },
              { label: "Official Rules", value: "Coming Soon", highlight: false }
            ].map((item, idx) => (
              <div 
                key={idx}
                className="p-5 rounded-xl bg-[#111729] border border-white/10 flex flex-col justify-between"
              >
                <span className="text-xs font-mono text-slate-400 uppercase tracking-wider mb-2">
                  {item.label}
                </span>
                <span className={`text-base font-bold ${item.color || 'text-white'}`}>
                  {item.value}
                </span>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 5. FAQ SECTION */}
      <section id="faq" className="py-24 px-5 sm:px-8 relative z-10 border-t border-white/5 bg-[#070910]">
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-16">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-violet-950/40 border border-violet-500/30 text-xs font-mono text-cyan-300 mb-3">
              <HelpCircle className="w-3.5 h-3.5 text-cyan-400" />
              INTELLIGENCE ARCHIVE
            </div>
            <h2 className="text-3xl sm:text-4xl md:text-5xl font-black uppercase tracking-tight mb-4">
              QUESTIONS BEFORE THE ARENA OPENS?
            </h2>
            <p className="text-base sm:text-lg text-[#A5B4CC]">
              Frequently asked questions during our pre-launch phase.
            </p>
          </div>

          {/* Accessible Accordion Component */}
          <div className="space-y-3.5">
            {faqData.map((faq, index) => {
              const isOpen = activeFaq === index;
              return (
                <div 
                  key={index}
                  className="rounded-xl bg-[#111729] border border-white/10 overflow-hidden transition-all duration-200"
                >
                  <button
                    onClick={() => setActiveFaq(isOpen ? null : index)}
                    className="w-full py-4 sm:py-5 px-6 text-left flex items-center justify-between gap-4 focus:outline-none hover:bg-white/[0.02] transition"
                    aria-expanded={isOpen}
                  >
                    <span className="text-base sm:text-lg font-semibold text-white tracking-wide">
                      {faq.q}
                    </span>
                    <div className={`p-1.5 rounded-lg bg-[#070910] text-cyan-400 transition-transform duration-300 ${isOpen ? 'rotate-180 text-violet-400' : ''}`}>
                      <ChevronDown className="w-4 h-4" />
                    </div>
                  </button>

                  {isOpen && (
                    <div className="px-6 pb-5 pt-1 text-sm sm:text-base text-[#A5B4CC] leading-relaxed border-t border-white/5 bg-[#0e1424]">
                      {faq.a}
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* FINAL DRAMATIC COMING SOON SECTION */}
      <section className="py-28 px-5 sm:px-8 relative z-10 border-t border-white/5 bg-gradient-to-b from-[#070910] via-[#0b0f20] to-[#070910] overflow-hidden text-center">
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[350px] bg-violet-600/15 rounded-full blur-[140px] pointer-events-none -z-10" />

        <div className="max-w-4xl mx-auto flex flex-col items-center">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-cyan-950/50 border border-cyan-500/30 text-xs font-mono text-cyan-300 mb-6">
            <Radio className="w-3.5 h-3.5 text-cyan-400 animate-ping" />
            FINAL STAGE ASSEMBLY
          </div>

          <h2 className="text-3xl sm:text-5xl md:text-6xl font-black uppercase tracking-tight mb-4">
            THE ARENA IS TAKING SHAPE.
          </h2>

          <p className="text-base sm:text-xl text-[#A5B4CC] max-w-xl mb-6">
            New challenges. New possibilities. A new stage for student talent.
          </p>

          <div className="mb-6 flex flex-wrap items-center justify-center gap-3">
            <span className="px-3.5 py-1.5 rounded-full bg-amber-400/10 border border-amber-400/30 text-xs font-mono text-amber-300 font-bold">
              ₹28,000 PRIZE POOL PROPOSED
            </span>
            <span className="px-3.5 py-1.5 rounded-full bg-cyan-400/10 border border-cyan-400/30 text-xs font-mono text-cyan-300 font-bold">
              ₹49 EXCLUSIVE QSKILL STUDENT ENTRY
            </span>
          </div>

          {/* Large Central "COMING SOON" */}
          <div className="relative group mb-8">
            <div className="absolute -inset-1 bg-gradient-to-r from-violet-600 via-sky-400 to-cyan-300 rounded-2xl blur-lg opacity-80 group-hover:opacity-100 transition duration-700" />
            <div className="relative px-10 sm:px-16 py-6 rounded-2xl bg-[#0c1020] border border-cyan-400/50 shadow-2xl">
              <span className="font-mono text-3xl sm:text-5xl md:text-6xl font-black tracking-widest text-transparent bg-clip-text bg-gradient-to-r from-white via-cyan-100 to-violet-200">
                COMING SOON
              </span>
            </div>
          </div>

          <p className="text-sm sm:text-base font-mono text-cyan-200/90 mb-4 max-w-md">
            QSkill Arena is preparing for its next chapter. The journey begins soon.
          </p>

          <span className="text-xs font-mono uppercase tracking-widest text-slate-500">
            POWERED BY QSKILL
          </span>
        </div>
      </section>

      {/* FOOTER */}
      <footer className="border-t border-white/10 bg-[#070910] py-14 px-5 sm:px-8 relative z-10 text-slate-400">
        <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-12 gap-10 items-start">
          {/* Left Column: Brand details */}
          <div className="md:col-span-6 space-y-3">
            <div className="flex items-center gap-2.5">
              <div className="w-7 h-7 rounded-lg bg-gradient-to-br from-violet-600 to-sky-500 p-[1px]">
                <div className="w-full h-full bg-[#0c1020] rounded-[7px] flex items-center justify-center font-bold text-xs text-white">
                  Q
                </div>
              </div>
              <span className="font-black text-lg tracking-wider text-white uppercase font-mono">
                QSkill <span className="text-violet-400">Arena</span>
              </span>
            </div>

            <p className="text-sm font-medium text-cyan-200/90 font-mono">
              "Build. Compete. Prove Your Skills."
            </p>

            <p className="text-xs text-[#A5B4CC] max-w-sm">
              An upcoming student technology championship by QSkill. Designed for aspiring developers, data engineers, and computational thinkers across India.
            </p>
          </div>

          {/* Right Column: Fast Anchor Navigation */}
          <div className="md:col-span-6 flex flex-wrap gap-6 md:justify-end text-xs font-mono uppercase tracking-wider">
            <button onClick={() => scrollTo('hero')} className="hover:text-cyan-400 transition">Home</button>
            <button onClick={() => scrollTo('prizes')} className="hover:text-cyan-400 transition">Prizes (₹28K)</button>
            <button onClick={() => scrollTo('categories')} className="hover:text-cyan-400 transition">Tech Domains</button>
            <button onClick={() => scrollTo('pricing')} className="hover:text-cyan-400 transition">Entry Pricing</button>
            <button onClick={() => scrollTo('journey')} className="hover:text-cyan-400 transition">Format</button>
            <button onClick={() => scrollTo('why')} className="hover:text-cyan-400 transition">Why Arena?</button>
            <button onClick={() => scrollTo('faq')} className="hover:text-cyan-400 transition">FAQ</button>
          </div>
        </div>

        {/* Bottom Copyright Strip */}
        <div className="max-w-7xl mx-auto mt-12 pt-6 border-t border-white/5 flex flex-col sm:flex-row items-center justify-between text-xs text-slate-500 font-mono gap-3">
          <div>
            © 2026 QSkill Arena. Organized by QSkill. All rights reserved.
          </div>
          <div className="flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-cyan-400/80 animate-pulse" />
            <span>PRE-LAUNCH ARCHITECTURE • PROPOSED ANNOUNCEMENTS</span>
          </div>
        </div>
      </footer>
    </div>
  );
}