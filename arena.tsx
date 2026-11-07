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
  ArrowRight,
  GitBranch,
  FileCheck,
  Target,
  Swords,
  ChevronRight,
  Share2,
  Lock
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
            <img 
              src="https://i.ibb.co/B5BSy9kd/q-trans.png" 
              alt="Q-logo" 
              className="w-12 h-12 object-contain drop-shadow-[0_0_10px_rgba(168,85,247,0.45)]"
            />
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
          <nav className="hidden lg:flex items-center gap-6">
            {[
              { label: 'Home', id: 'hero' },
              { label: 'How It Works', id: 'how-it-works' },
              { label: 'Prizes', id: 'prizes' },
              { label: 'Domains', id: 'categories' },
              { label: 'Certificates', id: 'certificates' },
              { label: 'Why Arena?', id: 'why-join' },
              { label: 'Entry Fee', id: 'pricing' },
              { label: 'FAQ', id: 'faq' }
            ].map((link) => (
              <button
                key={link.id}
                onClick={() => scrollTo(link.id)}
                className="text-xs xl:text-sm font-medium text-[#A5B4CC] hover:text-white transition-colors duration-200 cursor-pointer"
              >
                {link.label}
              </button>
            ))}
          </nav>

          {/* Right Action: Express Interest Button */}
          <div className="hidden sm:flex items-center gap-3">
            <a 
              href="/interest"
              className="relative group cursor-pointer"
            >
              <div className="absolute -inset-0.5 bg-gradient-to-r from-violet-600 to-sky-500 rounded-full blur-sm opacity-50 group-hover:opacity-100 transition duration-300" />
              <div className="relative px-4 py-1.5 rounded-full bg-[#0c1020] border border-violet-500/40 text-xs font-mono font-semibold tracking-wider text-cyan-300 flex items-center gap-2 shadow-inner">
                <span className="w-2 h-2 rounded-full bg-cyan-400 animate-pulse" />
                <span>EXPRESS INTEREST</span>
              </div>
            </a>
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
              { label: 'How It Works', id: 'how-it-works' },
              { label: 'Prizes (₹28K Pool)', id: 'prizes' },
              { label: 'Tech Domains', id: 'categories' },
              { label: 'Certificates & Recognition', id: 'certificates' },
              { label: 'Why Join QSkill Arena?', id: 'why-join' },
              { label: 'Registration Pricing', id: 'pricing' },
              { label: 'FAQ', id: 'faq' },
              { label: 'Express Interest', id: 'interest' }
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
                EXPRESS INTEREST
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

          {/* Prominent Express Interest Button Container */}
          <div className="flex flex-col items-center gap-2 mb-8">
            <a href="/interest" className="relative group cursor-pointer">
              <div className="absolute -inset-1 bg-gradient-to-r from-violet-600 via-sky-500 to-cyan-400 rounded-2xl blur-md opacity-70 group-hover:opacity-100 transition duration-500" />
              <div className="relative px-8 sm:px-12 py-3.5 sm:py-4 rounded-xl bg-[#0c1020] border border-violet-400/50 flex items-center gap-3.5 shadow-2xl">
                <span className="w-2.5 h-2.5 rounded-full bg-cyan-400 animate-ping" />
                <span className="font-mono text-xl sm:text-2xl md:text-3xl font-black tracking-widest text-white">
                  EXPRESS INTEREST
                </span>
              </div>
            </a>
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
              <span className="text-sm sm:text-base font-bold text-slate-200">Allowed</span>
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
          onClick={() => scrollTo('how-it-works')} 
          className="absolute bottom-5 left-1/2 -translate-x-1/2 flex flex-col items-center gap-1 cursor-pointer text-slate-400 hover:text-white transition group z-20"
        >
          <span className="text-[10px] font-mono tracking-widest uppercase group-hover:text-cyan-400 transition">How It Works</span>
          <ChevronDown className="w-4 h-4 animate-bounce text-violet-400" />
        </div>
      </section>

      {/* NEW SECTION 1: HOW IT WORKS */}
      <section id="how-it-works" className="py-24 px-5 sm:px-8 relative z-10 border-t border-white/5 bg-[#0C1020]/80">
        <div className="max-w-7xl mx-auto">
          {/* Section Heading */}
          <div className="text-center max-w-3xl mx-auto mb-16">
            <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-violet-950/40 border border-violet-500/30 text-xs font-mono text-cyan-300 mb-3">
              <Compass className="w-3.5 h-3.5 text-cyan-400" />
              TOURNAMENT BLUEPRINT
            </div>
            <h2 className="text-3xl sm:text-4xl md:text-5xl font-black uppercase tracking-tight mb-4">
              FOUR ROUNDS. ONE ARENA. ONE CHAMPION.
            </h2>
            <p className="text-base sm:text-lg text-[#A5B4CC]">
              Your journey begins with your strongest skills and takes you all the way to the ultimate QSkill Arena showdown.
            </p>
          </div>

          {/* 4 Rounds Progression Timeline */}
          <div className="space-y-12 mb-20">
            {/* ROUND 01 */}
            <div className="relative rounded-2xl bg-[#111729] border border-white/10 p-8 sm:p-10 shadow-2xl overflow-hidden group">
              <div className="absolute -top-24 -right-24 w-72 h-72 bg-amber-500/10 rounded-full blur-3xl pointer-events-none group-hover:bg-amber-500/20 transition-all duration-500" />
              <div className="flex flex-col lg:flex-row gap-8 items-start lg:items-center justify-between">
                <div className="lg:max-w-xl">
                  <div className="flex items-center gap-3 mb-4">
                    <span className="px-3 py-1 rounded-full bg-amber-400/10 border border-amber-400/40 text-amber-300 font-mono text-xs font-bold uppercase tracking-wider">
                      ROUND 01
                    </span>
                    <span className="text-xs font-mono text-slate-400 uppercase tracking-widest">
                      STAGE ONE QUALIFIER
                    </span>
                  </div>
                  <h3 className="text-2xl sm:text-3xl font-black uppercase tracking-tight text-white mb-3">
                    START WITH YOUR STRENGTH.
                  </h3>
                  <p className="text-sm sm:text-base text-[#A5B4CC] leading-relaxed mb-4">
                    Every participant begins in their preferred technology domain. Solve challenges designed around your existing technical skills and prove what you know.
                  </p>
                  <p className="text-xs font-mono text-slate-400 leading-relaxed mb-4">
                    Participants will be assessed within their selected skill domain during the initial qualifying round.
                  </p>
                  <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-lg bg-[#070910] border border-amber-400/30 text-amber-300 font-mono text-xs font-bold tracking-wider">
                    <Sparkles className="w-3.5 h-3.5 text-amber-400" />
                    YOUR SKILL. YOUR QUALIFIER.
                  </div>
                </div>

                {/* Domain pathways visual */}
                <div className="w-full lg:w-96 rounded-xl bg-[#070910] border border-white/10 p-5">
                  <span className="text-xs font-mono text-slate-400 uppercase tracking-wider block mb-3 font-semibold">
                    Illuminated Skill Tracks (Examples)
                  </span>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs font-mono">
                    {[
                      { name: "Python Programming", code: "PY" },
                      { name: "Frontend Development", code: "UI" },
                      { name: "Backend Development", code: "API" },
                      { name: "Full Stack Development", code: "FS" },
                      { name: "AI & Machine Learning", code: "ML" },
                      { name: "Data Science", code: "DS" }
                    ].map((item, i) => (
                      <div key={i} className="flex items-center justify-between px-3 py-2 rounded-lg bg-white/[0.03] border border-white/5 hover:border-amber-400/40 transition">
                        <span className="text-slate-200">{item.name}</span>
                        <span className="text-[10px] text-amber-400/90 font-bold">{item.code}</span>
                      </div>
                    ))}
                  </div>
                  <div className="mt-3 text-[10px] font-mono text-slate-500">
                    + Other eligible technology domains. Final qualifier formats to be confirmed.
                  </div>
                </div>
              </div>
            </div>

            {/* ROUND 02 */}
            <div className="relative rounded-2xl bg-[#111729] border border-white/10 p-8 sm:p-10 shadow-2xl overflow-hidden group">
              <div className="absolute -top-24 -left-24 w-72 h-72 bg-violet-600/15 rounded-full blur-3xl pointer-events-none group-hover:bg-violet-600/25 transition-all duration-500" />
              <div className="flex flex-col lg:flex-row gap-8 items-start lg:items-center justify-between">
                <div className="lg:max-w-xl">
                  <div className="flex items-center gap-3 mb-4">
                    <span className="px-3 py-1 rounded-full bg-violet-500/10 border border-violet-500/40 text-violet-300 font-mono text-xs font-bold uppercase tracking-wider">
                      ROUND 02
                    </span>
                    <span className="text-xs font-mono text-slate-400 uppercase tracking-widest">
                      STAGE TWO ADAPTABILITY
                    </span>
                  </div>
                  <h3 className="text-2xl sm:text-3xl font-black uppercase tracking-tight text-white mb-3">
                    STEP OUTSIDE YOUR COMFORT ZONE.
                  </h3>
                  <p className="text-sm sm:text-base text-[#A5B4CC] leading-relaxed mb-4">
                    Qualified participants move beyond their primary specialization and face cross-skill challenges designed to test adaptability, logical thinking, and their ability to approach unfamiliar technical problems.
                  </p>
                  <blockquote className="border-l-2 border-violet-400 pl-4 py-1 text-sm font-mono text-violet-200 italic mb-2">
                    "Great developers don't just know one thing. They know how to think."
                  </blockquote>
                </div>

                {/* 5 Evaluation Dimensions */}
                <div className="w-full lg:w-96 rounded-xl bg-[#070910] border border-white/10 p-5">
                  <span className="text-xs font-mono text-slate-400 uppercase tracking-wider block mb-3 font-semibold">
                    Core Evaluation Dimensions
                  </span>
                  <div className="space-y-2">
                    {[
                      "Adaptability",
                      "Logical reasoning",
                      "Problem-solving",
                      "Technical understanding",
                      "Learning agility"
                    ].map((dim, idx) => (
                      <div key={idx} className="flex items-center gap-2.5 px-3 py-2 rounded-lg bg-white/[0.03] border border-white/5">
                        <CheckCircle2 className="w-3.5 h-3.5 text-violet-400" />
                        <span className="text-xs font-mono text-slate-200">{dim}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>

            {/* ROUND 03 */}
            <div className="relative rounded-2xl bg-[#111729] border border-white/10 p-8 sm:p-10 shadow-2xl overflow-hidden group">
              <div className="absolute -bottom-24 -right-24 w-72 h-72 bg-sky-500/10 rounded-full blur-3xl pointer-events-none group-hover:bg-sky-500/20 transition-all duration-500" />
              <div className="flex flex-col lg:flex-row gap-8 items-start lg:items-center justify-between">
                <div className="lg:max-w-xl">
                  <div className="flex items-center gap-3 mb-4">
                    <span className="px-3 py-1 rounded-full bg-sky-400/10 border border-sky-400/40 text-sky-300 font-mono text-xs font-bold uppercase tracking-wider">
                      ROUND 03
                    </span>
                    <span className="text-xs font-mono text-slate-400 uppercase tracking-widest">
                      STAGE THREE SYNTHESIS
                    </span>
                  </div>
                  <h3 className="text-2xl sm:text-3xl font-black uppercase tracking-tight text-white mb-3">
                    SOLVE WHAT MATTERS.
                  </h3>
                  <p className="text-sm sm:text-base text-[#A5B4CC] leading-relaxed mb-4">
                    Participants face a common real-world problem and can use their preferred programming language or suitable technology to develop a solution. Evaluated on the quality of the solution, not simply the choice of programming language.
                  </p>
                  <div className="flex flex-wrap gap-2 mb-4">
                    {["Python", "JavaScript", "C#", "Java", "Approved Tech"].map((tech, i) => (
                      <span key={i} className="text-xs font-mono px-2.5 py-1 rounded-md bg-[#070910] border border-white/10 text-cyan-300">
                        {tech}
                      </span>
                    ))}
                  </div>
                </div>

                {/* 3 Pillars & Equation Dashboard */}
                <div className="w-full lg:w-96 rounded-xl bg-[#070910] border border-white/10 p-5 flex flex-col justify-between">
                  <span className="text-xs font-mono text-slate-400 uppercase tracking-wider block mb-3 font-semibold">
                    Major Evaluation Pillars
                  </span>
                  <div className="space-y-3 mb-4">
                    <div className="p-2.5 rounded-lg bg-white/[0.03] border border-white/5">
                      <span className="text-xs font-mono font-bold text-sky-300 block">01 / PROBLEM SOLVING</span>
                      <span className="text-[11px] text-slate-400">Understanding and framing the problem effectively.</span>
                    </div>
                    <div className="p-2.5 rounded-lg bg-white/[0.03] border border-white/5">
                      <span className="text-xs font-mono font-bold text-violet-300 block">02 / TECHNICAL SKILL</span>
                      <span className="text-[11px] text-slate-400">Applying clean logic, algorithms, and implementation.</span>
                    </div>
                    <div className="p-2.5 rounded-lg bg-white/[0.03] border border-white/5">
                      <span className="text-xs font-mono font-bold text-amber-300 block">03 / FINAL SCORE</span>
                      <span className="text-[11px] text-slate-400">Performance against published evaluation criteria.</span>
                    </div>
                  </div>
                  <div className="p-3 rounded-lg bg-violet-950/40 border border-violet-500/40 text-center font-mono text-[11px] font-bold text-cyan-300">
                    PROBLEM SOLVING + TECHNICAL SKILL + EVALUATION = FINAL SCORE
                  </div>
                </div>
              </div>
            </div>

            {/* ROUND 04: GRAND FINALE WITH PROPOSED BRACKET */}
            <div className="relative rounded-2xl bg-gradient-to-b from-[#1b1535] via-[#111729] to-[#0c1020] border-2 border-violet-500/60 p-8 sm:p-10 shadow-2xl overflow-hidden group">
              <div className="text-center max-w-2xl mx-auto mb-10">
                <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-amber-400/10 border border-amber-400/40 text-amber-300 font-mono text-xs font-bold uppercase tracking-wider mb-3">
                  <Trophy className="w-3.5 h-3.5 text-amber-400" />
                  THE GRAND FINALE • ROUND 04
                </div>
                <h3 className="text-3xl sm:text-4xl font-black uppercase tracking-tight text-white mb-3">
                  THE FINAL SHOWDOWN.
                </h3>
                <p className="text-sm sm:text-base text-[#A5B4CC] leading-relaxed">
                  Only the strongest performers reach the ultimate QSkill Arena. The final stage brings together top qualifiers in a head-to-head elimination tournament to determine the champion and runner-up.
                </p>
                <div className="mt-3 inline-block text-[11px] font-mono px-3 py-1 rounded-full bg-white/5 border border-white/10 text-slate-400">
                  PROPOSED FINAL ROUND FORMAT (PLACEHOLDER BRACKET)
                </div>
              </div>

              {/* Tournament Bracket Visual */}
              <div className="max-w-4xl mx-auto p-6 sm:p-8 rounded-2xl bg-[#070910]/90 border border-white/10 backdrop-blur-md">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6 items-center">
                  {/* QUARTERFINALS */}
                  <div className="space-y-4">
                    <div className="text-xs font-mono font-bold text-slate-400 uppercase tracking-widest text-center border-b border-white/5 pb-2">
                      Quarterfinals (8 Finalists)
                    </div>
                    {[
                      { m: "MATCH 1", p1: "Finalist A", p2: "Finalist B" },
                      { m: "MATCH 2", p1: "Finalist C", p2: "Finalist D" },
                      { m: "MATCH 3", p1: "Finalist E", p2: "Finalist F" },
                      { m: "MATCH 4", p1: "Finalist G", p2: "Finalist H" }
                    ].map((match, i) => (
                      <div key={i} className="p-3 rounded-lg bg-[#111729] border border-white/10 font-mono text-xs">
                        <div className="text-[10px] text-violet-400 font-bold mb-1">{match.m}</div>
                        <div className="flex justify-between py-0.5 text-slate-300">
                          <span>{match.p1}</span>
                          <span className="text-slate-600">vs</span>
                          <span>{match.p2}</span>
                        </div>
                      </div>
                    ))}
                  </div>

                  {/* SEMIFINALS */}
                  <div className="space-y-6">
                    <div className="text-xs font-mono font-bold text-cyan-300 uppercase tracking-widest text-center border-b border-white/5 pb-2">
                      Semifinals (Top 4)
                    </div>
                    <div className="p-3.5 rounded-lg bg-[#111729] border border-cyan-500/40 font-mono text-xs">
                      <div className="text-[10px] text-cyan-400 font-bold mb-1">SEMIFINAL 1</div>
                      <div className="text-slate-300 py-1">Winner Match 1</div>
                      <div className="text-slate-600 text-center text-[10px]">VS</div>
                      <div className="text-slate-300 py-1">Winner Match 2</div>
                    </div>
                    <div className="p-3.5 rounded-lg bg-[#111729] border border-cyan-500/40 font-mono text-xs">
                      <div className="text-[10px] text-cyan-400 font-bold mb-1">SEMIFINAL 2</div>
                      <div className="text-slate-300 py-1">Winner Match 3</div>
                      <div className="text-slate-600 text-center text-[10px]">VS</div>
                      <div className="text-slate-300 py-1">Winner Match 4</div>
                    </div>
                  </div>

                  {/* GRAND FINAL & RESULTS */}
                  <div className="space-y-4">
                    <div className="text-xs font-mono font-bold text-amber-300 uppercase tracking-widest text-center border-b border-white/5 pb-2">
                      Grand Final & Podium
                    </div>
                    <div className="p-4 rounded-xl bg-gradient-to-b from-[#1c142c] to-[#0c1020] border-2 border-amber-400/60 font-mono text-center shadow-lg">
                      <div className="text-[10px] text-amber-300 font-bold mb-1">CHAMPIONSHIP MATCH</div>
                      <div className="text-xs text-white font-semibold">Winner Semi 1 vs Winner Semi 2</div>
                      <div className="my-3 border-t border-white/10" />
                      <div className="text-sm font-bold text-amber-400 flex items-center justify-center gap-1.5">
                        <Trophy className="w-4 h-4 text-amber-400" />
                        🏆 QSKILL ARENA CHAMPION
                      </div>
                      <div className="text-xs text-sky-300 mt-1 font-semibold flex items-center justify-center gap-1">
                        🥈 QSKILL ARENA RUNNER-UP
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
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
            {/* 🏆 CHAMPIONS CARD */}
            <div className="relative rounded-2xl bg-gradient-to-b from-[#221735] via-[#171328] to-[#100d1c] border-2 border-amber-400/60 p-8 sm:p-10 flex flex-col justify-between shadow-2xl shadow-violet-950/60 overflow-hidden group">
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

                <div className="my-6 p-6 rounded-xl bg-[#080611]/80 border border-amber-400/30 backdrop-blur-md">
                  <span className="text-xs font-mono text-slate-400 uppercase tracking-widest block mb-1">
                    Prize Pool Allocation
                  </span>
                  <div className="text-4xl sm:text-5xl lg:text-6xl font-black text-amber-400 font-mono tracking-tight drop-shadow-[0_0_20px_rgba(251,191,36,0.35)]">
                    ₹20,000
                  </div>
                </div>

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

            {/* 🥈 RUNNERS-UP CARD */}
            <div className="relative rounded-2xl bg-gradient-to-b from-[#111e38] via-[#0e1628] to-[#09101c] border-2 border-sky-400/50 p-8 sm:p-10 flex flex-col justify-between shadow-2xl shadow-sky-950/50 overflow-hidden group">
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

                <div className="my-6 p-6 rounded-xl bg-[#060b17]/80 border border-sky-400/30 backdrop-blur-md">
                  <span className="text-xs font-mono text-slate-400 uppercase tracking-widest block mb-1">
                    Prize Pool Allocation
                  </span>
                  <div className="text-4xl sm:text-5xl lg:text-6xl font-black text-sky-300 font-mono tracking-tight drop-shadow-[0_0_20px_rgba(56,189,248,0.3)]">
                    ₹8,000
                  </div>
                </div>

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

      {/* NEW SECTION 2: CERTIFICATES & RECOGNITION */}
      <section id="certificates" className="py-24 px-5 sm:px-8 relative z-10 border-t border-white/5 bg-[#070910]">
        <div className="max-w-7xl mx-auto">
          {/* Section Header */}
          <div className="text-center max-w-3xl mx-auto mb-16">
            <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-violet-950/40 border border-violet-500/30 text-xs font-mono text-cyan-300 mb-3">
              <Award className="w-3.5 h-3.5 text-cyan-400" />
              MERIT & CREDENTIALS
            </div>
            <h2 className="text-3xl sm:text-4xl md:text-5xl font-black uppercase tracking-tight mb-4">
              EVERY STEP COUNTS. EVERY ACHIEVEMENT MATTERS.
            </h2>
            <p className="text-base sm:text-lg text-[#A5B4CC]">
              QSkill Arena celebrates participation, progress, and outstanding performance. Every stage of the journey is an opportunity to earn recognition.
            </p>
          </div>

          {/* 6 Certificate Tiers Progression */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {/* LEVEL 01 */}
            <div className="rounded-2xl bg-[#111729] border border-white/10 p-6 flex flex-col justify-between shadow-xl hover:border-slate-400/40 transition">
              <div>
                <span className="text-[10px] font-mono font-bold text-slate-400 uppercase tracking-widest block mb-2">
                  LEVEL 01 • STAGE ONE
                </span>
                <div className="w-full h-36 rounded-xl bg-[#090d1a] border border-white/10 p-4 mb-4 flex flex-col justify-between relative overflow-hidden">
                  <div className="flex justify-between items-start">
                    <span className="text-[9px] font-mono text-slate-500">QSKILL ARENA // 2026</span>
                    <FileCheck className="w-4 h-4 text-slate-400" />
                  </div>
                  <div>
                    <span className="text-xs font-mono font-bold text-white block">CERTIFICATE OF PARTICIPATION</span>
                    <span className="text-[9px] font-mono text-slate-400">Awarded for active engagement</span>
                  </div>
                </div>
                <h3 className="text-lg font-bold uppercase text-white mb-2">
                  QSkill Arena Participation Certificate
                </h3>
                <p className="text-xs text-[#A5B4CC] leading-relaxed">
                  Every eligible participant who takes part in the competition will receive a participation certificate, subject to the official participation requirements.
                </p>
              </div>
              <div className="mt-5 pt-3 border-t border-white/5 text-[10px] font-mono text-slate-500">
                TIER // FOUNDATIONAL
              </div>
            </div>

            {/* LEVEL 02 */}
            <div className="rounded-2xl bg-[#111729] border border-white/10 p-6 flex flex-col justify-between shadow-xl hover:border-violet-500/40 transition">
              <div>
                <span className="text-[10px] font-mono font-bold text-violet-400 uppercase tracking-widest block mb-2">
                  LEVEL 02 • ROUND 1 MERIT
                </span>
                <div className="w-full h-36 rounded-xl bg-[#0e1124] border border-violet-500/20 p-4 mb-4 flex flex-col justify-between relative overflow-hidden">
                  <div className="flex justify-between items-start">
                    <span className="text-[9px] font-mono text-violet-400">QSKILL ARENA // 2026</span>
                    <Award className="w-4 h-4 text-violet-400" />
                  </div>
                  <div>
                    <span className="text-xs font-mono font-bold text-violet-200 block">QUALIFIED CERTIFICATE</span>
                    <span className="text-[9px] font-mono text-slate-400">Skill-wise Qualifier Verified</span>
                  </div>
                </div>
                <h3 className="text-lg font-bold uppercase text-white mb-2">
                  QSkill Qualified Certificate
                </h3>
                <p className="text-xs text-[#A5B4CC] leading-relaxed">
                  Participants who successfully qualify through Round 1 will earn recognition for clearing the skill-wise qualifying stage.
                </p>
              </div>
              <div className="mt-5 pt-3 border-t border-white/5 text-[10px] font-mono text-violet-400">
                TIER // SKILL QUALIFIER
              </div>
            </div>

            {/* LEVEL 03 */}
            <div className="rounded-2xl bg-[#111729] border border-white/10 p-6 flex flex-col justify-between shadow-xl hover:border-cyan-400/40 transition">
              <div>
                <span className="text-[10px] font-mono font-bold text-cyan-300 uppercase tracking-widest block mb-2">
                  LEVEL 03 • ADVANCED STAGE
                </span>
                <div className="w-full h-36 rounded-xl bg-[#091526] border border-cyan-400/20 p-4 mb-4 flex flex-col justify-between relative overflow-hidden">
                  <div className="flex justify-between items-start">
                    <span className="text-[9px] font-mono text-cyan-400">QSKILL ARENA // 2026</span>
                    <Sparkles className="w-4 h-4 text-cyan-400" />
                  </div>
                  <div>
                    <span className="text-xs font-mono font-bold text-cyan-200 block">ELITE CERTIFICATE</span>
                    <span className="text-[9px] font-mono text-slate-400">Completed Round 3 Synthesis</span>
                  </div>
                </div>
                <h3 className="text-lg font-bold uppercase text-white mb-2">
                  QSkill Elite Certificate
                </h3>
                <p className="text-xs text-[#A5B4CC] leading-relaxed">
                  Participants who reach and complete Round 3 will be recognized for advancing through the competition's challenging stages.
                </p>
              </div>
              <div className="mt-5 pt-3 border-t border-white/5 text-[10px] font-mono text-cyan-400">
                TIER // HIGH MERIT
              </div>
            </div>

            {/* LEVEL 04 */}
            <div className="rounded-2xl bg-[#111729] border border-white/10 p-6 flex flex-col justify-between shadow-xl hover:border-indigo-400/40 transition">
              <div>
                <span className="text-[10px] font-mono font-bold text-indigo-300 uppercase tracking-widest block mb-2">
                  LEVEL 04 • ARENA QUALIFIED
                </span>
                <div className="w-full h-36 rounded-xl bg-[#0d122b] border border-indigo-400/20 p-4 mb-4 flex flex-col justify-between relative overflow-hidden">
                  <div className="flex justify-between items-start">
                    <span className="text-[9px] font-mono text-indigo-300">QSKILL ARENA // 2026</span>
                    <Swords className="w-4 h-4 text-indigo-300" />
                  </div>
                  <div>
                    <span className="text-xs font-mono font-bold text-indigo-200 block">FINALIST CERTIFICATE</span>
                    <span className="text-[9px] font-mono text-slate-400">Final Tournament Contender</span>
                  </div>
                </div>
                <h3 className="text-lg font-bold uppercase text-white mb-2">
                  QSkill Arena Finalist Certificate
                </h3>
                <p className="text-xs text-[#A5B4CC] leading-relaxed">
                  Participants who qualify for the final tournament will receive special recognition as QSkill Arena finalists.
                </p>
              </div>
              <div className="mt-5 pt-3 border-t border-white/5 text-[10px] font-mono text-indigo-300">
                TIER // TOP FINALIST
              </div>
            </div>

            {/* LEVEL 05: RUNNER-UP RECOGNITION */}
            <div className="rounded-2xl bg-gradient-to-b from-[#111e38] to-[#0c1424] border-2 border-sky-400/50 p-6 flex flex-col justify-between shadow-xl group">
              <div>
                <div className="flex justify-between items-center mb-2">
                  <span className="text-[10px] font-mono font-bold text-sky-300 uppercase tracking-widest">
                    LEVEL 05 • RUNNER-UP
                  </span>
                  <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-sky-400/10 text-sky-300 font-bold">
                    TIER 02
                  </span>
                </div>
                <div className="w-full h-36 rounded-xl bg-[#081120] border border-sky-400/30 p-4 mb-4 flex flex-col justify-between relative overflow-hidden">
                  <div className="flex justify-between items-start">
                    <span className="text-[9px] font-mono text-sky-300 font-bold">QSKILL ARENA 2026</span>
                    <span className="text-base">🥈</span>
                  </div>
                  <div>
                    <span className="text-xs font-mono font-black text-sky-200 block">RUNNER-UP CERTIFICATE</span>
                    <span className="text-[9px] font-mono text-sky-400">+ ₹8,000 Prize Allocation & Goodies</span>
                  </div>
                </div>
                <h3 className="text-lg font-bold uppercase text-white mb-2">
                  QSkill Arena 2026 Runner-Up Certificate
                </h3>
                <p className="text-xs text-[#A5B4CC] leading-relaxed mb-3">
                  Celebrate the achievement of finishing as a runner-up in QSkill Arena 2026.
                </p>
                <div className="space-y-1.5 text-xs font-mono text-sky-300">
                  <div className="flex items-center gap-1.5">• Runner-up certificate</div>
                  <div className="flex items-center gap-1.5">• Applicable prize allocation</div>
                  <div className="flex items-center gap-1.5">• Eligible gifts and goodies</div>
                </div>
              </div>
              <div className="mt-5 pt-3 border-t border-sky-400/20 text-[10px] font-mono text-sky-300 font-bold">
                RECOGNITION // SILVER-BLUE MERIT
              </div>
            </div>

            {/* LEVEL 06: CHAMPION RECOGNITION (DOMINANT GOLD) */}
            <div className="rounded-2xl bg-gradient-to-b from-[#261b36] to-[#140e22] border-2 border-amber-400/80 p-6 flex flex-col justify-between shadow-2xl shadow-amber-950/40 relative overflow-hidden group">
              <div className="absolute -top-12 -right-12 w-36 h-36 bg-amber-400/20 rounded-full blur-2xl pointer-events-none" />
              <div>
                <div className="flex justify-between items-center mb-2">
                  <span className="text-[10px] font-mono font-bold text-amber-300 uppercase tracking-widest flex items-center gap-1">
                    <Trophy className="w-3 h-3 text-amber-400" />
                    LEVEL 06 • CHAMPION
                  </span>
                  <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-amber-400/20 text-amber-300 font-bold border border-amber-400/40">
                    GRAND PRIZE
                  </span>
                </div>
                <div className="w-full h-36 rounded-xl bg-[#150f24] border border-amber-400/40 p-4 mb-4 flex flex-col justify-between relative overflow-hidden">
                  <div className="flex justify-between items-start">
                    <span className="text-[9px] font-mono text-amber-300 font-bold">QSKILL ARENA 2026</span>
                    <span className="text-base">🏆</span>
                  </div>
                  <div>
                    <span className="text-xs font-mono font-black text-amber-300 block">CHAMPION CERTIFICATE</span>
                    <span className="text-[9px] font-mono text-amber-200">+ ₹20,000 Grand Allocation & Goodies</span>
                  </div>
                </div>
                <h3 className="text-lg font-bold uppercase text-white mb-2">
                  QSkill Arena 2026 Champion Certificate
                </h3>
                <p className="text-xs text-[#A5B4CC] leading-relaxed mb-3">
                  The ultimate recognition for the competition champion — celebrating exceptional performance, technical ability, and determination.
                </p>
                <div className="space-y-1.5 text-xs font-mono text-amber-300">
                  <div className="flex items-center gap-1.5">• Champion certificate</div>
                  <div className="flex items-center gap-1.5">• Applicable champion prize allocation</div>
                  <div className="flex items-center gap-1.5">• Eligible gifts and goodies</div>
                </div>
              </div>
              <div className="mt-5 pt-3 border-t border-amber-400/20 text-[10px] font-mono text-amber-300 font-bold">
                RECOGNITION // HIGHEST DISTINCTION
              </div>
            </div>
          </div>

          {/* Disclaimer note */}
          <div className="mt-12 text-center max-w-2xl mx-auto p-4 rounded-xl bg-white/[0.02] border border-white/5">
            <p className="text-xs font-mono text-slate-500 leading-relaxed">
              Certificate eligibility, assessment requirements, and award conditions will be defined in the official competition rules. Planned certificate and recognition tiers.
            </p>
          </div>
        </div>
      </section>

      {/* NEW SECTION 3: WHY JOIN QSKILL ARENA? */}
      <section id="why-join" className="py-24 px-5 sm:px-8 relative z-10 bg-[#0C1020]/70 border-t border-white/5">
        <div className="max-w-7xl mx-auto">
          {/* Section Header */}
          <div className="text-center max-w-3xl mx-auto mb-16">
            <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-violet-950/40 border border-violet-500/30 text-xs font-mono text-cyan-300 mb-3">
              <Sparkles className="w-3.5 h-3.5 text-cyan-400" />
              PARTICIPANT VALUE
            </div>
            <h2 className="text-3xl sm:text-4xl md:text-5xl font-black uppercase tracking-tight mb-4">
              WHY SHOULD YOU ENTER THE ARENA?
            </h2>
            <p className="text-base sm:text-lg text-[#A5B4CC]">
              More than a competition. An opportunity to challenge yourself, connect with the tech community, and showcase what you're capable of.
            </p>
          </div>

          {/* 9 Feature Cards Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {/* 01 */}
            <div className="rounded-2xl bg-[#111729] border border-white/10 p-7 flex flex-col justify-between hover:border-violet-500/40 transition group shadow-xl">
              <div>
                <div className="flex justify-between items-center mb-4">
                  <span className="text-xs font-mono font-bold text-violet-400">01 / NATIONWIDE</span>
                  <Globe className="w-5 h-5 text-violet-400" />
                </div>
                <h3 className="text-lg font-bold uppercase text-white mb-2">
                  BE PART OF SOMETHING BIGGER.
                </h3>
                <p className="text-sm text-[#A5B4CC] leading-relaxed">
                  Join an ambitious student technology competition designed to bring together tech enthusiasts from across India.
                </p>
              </div>
              <div className="mt-4 pt-3 border-t border-white/5 text-[10px] font-mono text-slate-500">
                PROPOSED BRAND POSITIONING // CODING ARENA
              </div>
            </div>

            {/* 02 */}
            <div className="rounded-2xl bg-[#111729] border border-white/10 p-7 flex flex-col justify-between hover:border-cyan-400/40 transition group shadow-xl">
              <div>
                <div className="flex justify-between items-center mb-4">
                  <span className="text-xs font-mono font-bold text-cyan-300">02 / PORTFOLIO</span>
                  <Code2 className="w-5 h-5 text-cyan-400" />
                </div>
                <h3 className="text-lg font-bold uppercase text-white mb-2">
                  LET YOUR WORK SPEAK.
                </h3>
                <p className="text-sm text-[#A5B4CC] leading-relaxed">
                  Demonstrate your technical abilities and compete for recognition among students, mentors, recruiters, and technology companies.
                </p>
              </div>
              <div className="mt-4 pt-3 border-t border-white/5 text-[10px] font-mono text-slate-500">
                MERIT VISIBILITY // DEMONSTRATED SKILL
              </div>
            </div>

            {/* 03 */}
            <div className="rounded-2xl bg-[#111729] border border-white/10 p-7 flex flex-col justify-between hover:border-amber-400/40 transition group shadow-xl">
              <div>
                <div className="flex justify-between items-center mb-4">
                  <span className="text-xs font-mono font-bold text-amber-300">03 / AWARDS</span>
                  <Trophy className="w-5 h-5 text-amber-400" />
                </div>
                <h3 className="text-lg font-bold uppercase text-white mb-2">
                  EFFORT DESERVES RECOGNITION.
                </h3>
                <p className="text-sm text-[#A5B4CC] leading-relaxed">
                  Compete for the announced prize pool, eligible gift vouchers, goodies, and competition certificates.
                </p>
              </div>
              <div className="mt-4 pt-3 border-t border-white/5 text-[10px] font-mono text-amber-400/80">
                PRIZES: ₹28,000 PROPOSED POOL
              </div>
            </div>

            {/* 04 */}
            <div className="rounded-2xl bg-[#111729] border border-white/10 p-7 flex flex-col justify-between hover:border-violet-500/40 transition group shadow-xl">
              <div>
                <div className="flex justify-between items-center mb-4">
                  <span className="text-xs font-mono font-bold text-violet-400">04 / BENCHMARK</span>
                  <Compass className="w-5 h-5 text-violet-400" />
                </div>
                <h3 className="text-lg font-bold uppercase text-white mb-2">
                  YOUR COMPETITION. A NATIONAL STAGE.
                </h3>
                <p className="text-sm text-[#A5B4CC] leading-relaxed">
                  Challenge yourself alongside technology enthusiasts from different colleges, cities, and educational backgrounds across India.
                </p>
              </div>
              <div className="mt-4 pt-3 border-t border-white/5 text-[10px] font-mono text-slate-500">
                PAN-INDIA // ALL INSTITUTIONS
              </div>
            </div>

            {/* 05 */}
            <div className="rounded-2xl bg-[#111729] border border-white/10 p-7 flex flex-col justify-between hover:border-cyan-400/40 transition group shadow-xl">
              <div>
                <div className="flex justify-between items-center mb-4">
                  <span className="text-xs font-mono font-bold text-cyan-300">05 / NETWORK</span>
                  <Users2 className="w-5 h-5 text-cyan-400" />
                </div>
                <h3 className="text-lg font-bold uppercase text-white mb-2">
                  MEET YOUR KIND OF PEOPLE.
                </h3>
                <p className="text-sm text-[#A5B4CC] leading-relaxed">
                  Discover opportunities to connect with like-minded learners, exchange ideas, share opinions, and build meaningful connections with people who share your passion for technology.
                </p>
              </div>
              <div className="mt-4 pt-3 border-t border-white/5 text-[10px] font-mono text-slate-500">
                COMMUNITY // COLLABORATIVE ECOSYSTEM
              </div>
            </div>

            {/* 06 */}
            <div className="rounded-2xl bg-[#111729] border border-white/10 p-7 flex flex-col justify-between hover:border-violet-500/40 transition group shadow-xl">
              <div>
                <div className="flex justify-between items-center mb-4">
                  <span className="text-xs font-mono font-bold text-violet-400">06 / MASTERY</span>
                  <Zap className="w-5 h-5 text-violet-400" />
                </div>
                <h3 className="text-lg font-bold uppercase text-white mb-2">
                  GROW BEYOND WHAT YOU KNOW.
                </h3>
                <p className="text-sm text-[#A5B4CC] leading-relaxed">
                  Explore unfamiliar challenges, learn new approaches to problem-solving, and discover areas where you can continue improving.
                </p>
              </div>
              <div className="mt-4 pt-3 border-t border-white/5 text-[10px] font-mono text-slate-500">
                CONTINUOUS EVOLUTION // ADAPTABILITY
              </div>
            </div>

            {/* 07 */}
            <div className="rounded-2xl bg-[#111729] border border-white/10 p-7 flex flex-col justify-between hover:border-cyan-400/40 transition group shadow-xl">
              <div>
                <div className="flex justify-between items-center mb-4">
                  <span className="text-xs font-mono font-bold text-cyan-300">07 / CONFIDENCE</span>
                  <Flame className="w-5 h-5 text-cyan-400" />
                </div>
                <h3 className="text-lg font-bold uppercase text-white mb-2">
                  CHALLENGE YOURSELF. GAIN CONFIDENCE.
                </h3>
                <p className="text-sm text-[#A5B4CC] leading-relaxed">
                  Step outside your comfort zone, test your abilities, and build confidence through meaningful technical challenges.
                </p>
              </div>
              <div className="mt-4 pt-3 border-t border-white/5 text-[10px] font-mono text-slate-500">
                EMPOWERMENT // COMPETITIVE EDGE
              </div>
            </div>

            {/* 08 */}
            <div className="rounded-2xl bg-[#111729] border border-white/10 p-7 flex flex-col justify-between hover:border-violet-500/40 transition group shadow-xl">
              <div>
                <div className="flex justify-between items-center mb-4">
                  <span className="text-xs font-mono font-bold text-violet-400">08 / CREDENTIALS</span>
                  <Award className="w-5 h-5 text-violet-400" />
                </div>
                <h3 className="text-lg font-bold uppercase text-white mb-2">
                  MAKE YOUR ACHIEVEMENTS COUNT.
                </h3>
                <p className="text-sm text-[#A5B4CC] leading-relaxed">
                  Work toward earning competition certificates and recognition that you can showcase in your portfolio, resume, or professional profile, subject to the official award criteria.
                </p>
              </div>
              <div className="mt-4 pt-3 border-t border-white/5 text-[10px] font-mono text-slate-500">
                RESUME VALUE // VERIFIABLE MILESTONES
              </div>
            </div>

            {/* 09 */}
            <div className="rounded-2xl bg-gradient-to-b from-[#1b1535] to-[#111729] border-2 border-violet-500/50 p-7 flex flex-col justify-between hover:border-cyan-400 transition group shadow-xl">
              <div>
                <div className="flex justify-between items-center mb-4">
                  <span className="text-xs font-mono font-bold text-cyan-300">09 / ACCESSIBILITY</span>
                  <CheckCircle2 className="w-5 h-5 text-cyan-400" />
                </div>
                <h3 className="text-lg font-bold uppercase text-white mb-2">
                  NO COMPLICATED ENTRY PROCESS.
                </h3>
                <p className="text-sm text-[#A5B4CC] leading-relaxed mb-3">
                  QSkill Arena is being designed to make participation accessible. Students will be able to express their interest through a simple form before the official registration process opens.
                </p>
                <div className="p-3 rounded-lg bg-[#070910] border border-white/10 text-xs font-mono text-cyan-200">
                  "YOU DON'T NEED TO BE AN EXPERT TO START. YOU NEED THE COURAGE TO COMPETE."
                </div>
              </div>
              <div className="mt-4 pt-3 border-t border-white/5 text-[10px] font-mono text-cyan-300">
                OPEN ACCESS // PARTICIPANT CENTRIC
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* NEW SECTION 4: INTEREST FORM CTA */}
      <section id="interest" className="py-24 px-5 sm:px-8 relative z-10 border-t border-white/5 bg-[#070910]">
        <div className="max-w-4xl mx-auto">
          <div className="relative rounded-2xl bg-gradient-to-b from-[#161b33] via-[#0f1426] to-[#0a0d1a] border-2 border-cyan-500/50 p-8 sm:p-12 text-center shadow-2xl overflow-hidden">
            <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-cyan-950/60 border border-cyan-400/40 text-xs font-mono text-cyan-300 mb-4">
              <Sparkles className="w-3.5 h-3.5 text-cyan-400" />
              INTEREST COLLECTION — NOT OFFICIAL REGISTRATION
            </div>

            <h2 className="text-3xl sm:text-4xl md:text-5xl font-black uppercase tracking-tight text-white mb-4">
              READY TO ENTER THE ARENA?
            </h2>

            <p className="text-base sm:text-lg text-[#A5B4CC] max-w-2xl mx-auto mb-8">
              QSkill Arena is coming soon. Tell us which technology domain you're interested in so we can better understand our future participants.
            </p>

            {/* Interest form button */}
            <div className="flex flex-col items-center justify-center gap-3 max-w-md mx-auto mb-8">
              <a 
                href="/interest"
                className="w-full px-8 py-4 rounded-xl bg-gradient-to-r from-violet-600 via-indigo-600 to-sky-500 hover:from-violet-500 hover:to-cyan-400 text-white font-mono text-sm uppercase tracking-wider font-extrabold shadow-xl shadow-violet-950/60 transition duration-300 flex items-center justify-center gap-2"
              >
                <span>OPEN INTEREST FORM</span>
                <ArrowRight className="w-4 h-4 text-cyan-200" />
              </a>
              <span className="text-xs font-mono text-cyan-400/90 font-medium">
                Click above to express your interest for QSkill Arena 2026.
              </span>
            </div>

            {/* Future fields showcase */}
            <div className="p-6 rounded-xl bg-[#070910]/80 border border-white/10 text-left mb-6">
              <span className="text-xs font-mono text-slate-400 uppercase tracking-widest block mb-3 font-semibold text-center sm:text-left">
                Planned Future Interest Fields:
              </span>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5 text-xs font-mono text-slate-300">
                <div className="flex items-center gap-2">• Full name</div>
                <div className="flex items-center gap-2">• Email address</div>
                <div className="flex items-center gap-2">• College or university</div>
                <div className="flex items-center gap-2">• Current year of study</div>
                <div className="flex items-center gap-2">• Preferred domain (Python, AI/ML, Full Stack, etc.)</div>
                <div className="flex items-center gap-2">• Primary programming skill</div>
                <div className="flex items-center gap-2">• Current experience level</div>
                <div className="flex items-center gap-2">• What interests you most about Arena</div>
              </div>
            </div>

            <p className="text-xs font-mono text-slate-400 max-w-xl mx-auto leading-relaxed">
              Expressing interest does not constitute official registration or guarantee participation. Official registration details and verification will be announced separately.
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

            {/* Exclusive QSkill Existing Students Fee: ₹49 */}
            <div className="relative rounded-2xl bg-gradient-to-b from-[#1b1536] via-[#111729] to-[#0c1020] border-2 border-violet-500/70 p-8 flex flex-col justify-between shadow-2xl shadow-violet-950/60 group">
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

          <a href="/interest" className="relative group mb-8 cursor-pointer inline-block">
            <div className="absolute -inset-1 bg-gradient-to-r from-violet-600 via-sky-400 to-cyan-300 rounded-2xl blur-lg opacity-80 group-hover:opacity-100 transition duration-700" />
            <div className="relative px-10 sm:px-16 py-6 rounded-2xl bg-[#0c1020] border border-cyan-400/50 shadow-2xl">
              <span className="font-mono text-3xl sm:text-5xl md:text-6xl font-black tracking-widest text-transparent bg-clip-text bg-gradient-to-r from-white via-cyan-100 to-violet-200">
                EXPRESS INTEREST
              </span>
            </div>
          </a>

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
              <img 
                src="https://i.ibb.co/B5BSy9kd/q-trans.png" 
                alt="Q-logo" 
                className="w-9 h-9 object-contain drop-shadow-[0_0_10px_rgba(168,85,247,0.45)]"
              />
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
            <button onClick={() => scrollTo('how-it-works')} className="hover:text-cyan-400 transition">How It Works</button>
            <button onClick={() => scrollTo('prizes')} className="hover:text-cyan-400 transition">Prizes</button>
            <button onClick={() => scrollTo('categories')} className="hover:text-cyan-400 transition">Tech Domains</button>
            <button onClick={() => scrollTo('certificates')} className="hover:text-cyan-400 transition">Certificates</button>
            <button onClick={() => scrollTo('why-join')} className="hover:text-cyan-400 transition">Why Arena?</button>
            <button onClick={() => scrollTo('pricing')} className="hover:text-cyan-400 transition">Entry Pricing</button>
            <button onClick={() => scrollTo('interest')} className="hover:text-cyan-400 transition">Express Interest</button>
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