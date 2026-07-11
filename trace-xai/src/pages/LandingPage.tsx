/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  ShieldAlert, 
  GitBranch, 
  Search, 
  FileCheck2, 
  Layers, 
  ArrowRight, 
  CheckCircle2, 
  Cpu, 
  BookOpen, 
  LineChart, 
  Sparkles,
  Database,
  Lock,
  ChevronRight,
  Globe,
  RefreshCw,
  GitFork,
  FileText,
  X,
  Play,
  ArrowUpRight,
  Server,
  Terminal,
  Compass,
  AlertTriangle,
  Flame,
  BookmarkCheck
} from 'lucide-react';

interface LandingPageProps {
  onLogin: (userName: string, userEmail: string) => void;
}

export default function LandingPage({ onLogin }: LandingPageProps) {
  const [activeWorkflowStep, setActiveWorkflowStep] = useState(0);
  const [showDemoModal, setShowDemoModal] = useState(false);
  const [previewState, setPreviewState] = useState<'idle' | 'typing' | 'retrieving' | 'conflict'>('typing');
  const [typedQuery, setTypedQuery] = useState('');

  const handleDemoLogin = () => {
    onLogin('Manoj Kumar', 'manoj0096k@gmail.com');
  };

  // Animation loop for product preview on hero right side
  useEffect(() => {
    let timer: NodeJS.Timeout;
    const runCycle = () => {
      // 1. Typing Query
      setPreviewState('typing');
      setTypedQuery('');
      let fullText = "Isolate factual differences in the project estimates between 1985 and 1986...";
      let cur = "";
      let charIdx = 0;
      
      const typeNextChar = () => {
        if (charIdx < fullText.length) {
          cur += fullText[charIdx];
          setTypedQuery(cur);
          charIdx++;
          timer = setTimeout(typeNextChar, 40);
        } else {
          // 2. Transition to Retrieval
          timer = setTimeout(() => {
            setPreviewState('retrieving');
            // 3. Transition to Conflict Isolated
            timer = setTimeout(() => {
              setPreviewState('conflict');
              // 4. Back to Idle/Reset
              timer = setTimeout(() => {
                runCycle();
              }, 7000);
            }, 3000);
          }, 1500);
        }
      };
      
      timer = setTimeout(typeNextChar, 1000);
    };

    runCycle();
    return () => clearTimeout(timer);
  }, []);

  // Animation cycle for pipeline steps
  useEffect(() => {
    const interval = setInterval(() => {
      setActiveWorkflowStep((prev) => (prev + 1) % 9);
    }, 2800);
    return () => clearInterval(interval);
  }, []);

  const pipelineSteps = [
    { name: 'Upload', desc: 'Drag-and-drop secure file ingestion', icon: BookOpen },
    { name: 'Parse', desc: 'Normalize PDF, TXT and Markdown blocks', icon: Layers },
    { name: 'Chunk', desc: 'Overlapping factual chunk division', icon: FileText },
    { name: 'Embedding', desc: 'Multi-dimensional semantic vector generation', icon: Cpu },
    { name: 'Retrieval', desc: 'Temporal semantic search match', icon: Search },
    { name: 'Conflict Detection', desc: 'NLI factual divergence isolation', icon: ShieldAlert },
    { name: 'Timeline', desc: 'Chronological anchor alignments', icon: GitBranch },
    { name: 'AI Explanation', desc: 'Fully traceable response synthesis', icon: Sparkles },
    { name: 'Dashboard', desc: 'Interactive analysis visualizer', icon: LineChart }
  ];

  const problemCards = [
    {
      title: "ChatGPT Hides Disagreements",
      problem: "Standard LLMs attempt a flat factual reconciliation, hallucinating a single compromise statement or silently dropping alternative source perspectives entirely.",
      threat: "Critical conflicting evidence is lost in translation, presenting dangerous false confidence to decision makers."
    },
    {
      title: "Traditional RAG Ignores Time",
      problem: "Standard semantic search retrieves chunks purely based on textual proximity. It lacks a chronological coordinate system, conflating old estimates with active constraints.",
      threat: "A statement from an outdated 2021 financial sheet overrides critical amendments logged in a late 2025 audit."
    },
    {
      title: "AI Rarely Explains Why It Answered",
      problem: "Chatbots produce smooth narrative paragraphs without inline logical trails. Validating the factual basis requires manually reading through hundreds of index pages.",
      threat: "System answers are un-auditable, blocking integration in highly regulated legal, clinical, or corporate workspaces."
    }
  ];

  const solutionCards = [
    {
      title: "Transparent Retrieval",
      desc: "TRACE-XAI parses documents into distinct logical segments, creating clear, inspectable sources. Every chunk maintains its exact page offset and file footprint.",
      icon: Search,
      tag: "INSPECTABLE"
    },
    {
      title: "Conflict Detection",
      desc: "An advanced NLI factual model runs cross-source contradiction checks. It flags divergent numbers, estimates, and dates, calculating an analytical conflict score.",
      icon: ShieldAlert,
      tag: "INTEGRITY"
    },
    {
      title: "Temporal Reasoning",
      desc: "Maintains a chronological axis of facts. Align assertions over an inspectable timeline, allowing teams to track how targets or reports evolve over quarters and years.",
      icon: GitBranch,
      tag: "CHRONOLOGY"
    },
    {
      title: "Evidence Attribution",
      desc: "Every assertion returned by the platform has hoverable, expandable citation cards. Verify the source, match confidence rate, and context with a single click.",
      icon: Layers,
      tag: "ATTRIBUTION"
    },
    {
      title: "Knowledge Evolution",
      desc: "Analyze how statements, system architectures, or audit guidelines modify over time. Compare old parameters with fresh releases and pinpoint deleted requirements.",
      icon: RefreshCw,
      tag: "MUTATION"
    },
    {
      title: "Explainable AI",
      desc: "No black boxes. Get confidence metrics, clear chain-of-thought explanations of contradictory facts, and dynamic interactive network maps of source nodes.",
      icon: FileCheck2,
      tag: "TRANSPARENCY"
    }
  ];

  const useCases = [
    {
      title: "Academic Research",
      desc: "Cross-examine scientific publications, literature reviews, and clinical papers to isolate divergent findings, research timelines, and factual deviations.",
      audience: "RESEARCHERS & STUDENTS",
      bgGradient: "from-blue-500/10 to-indigo-500/5"
    },
    {
      title: "Clinical Healthcare",
      desc: "Cross-reference multiple patient health files, drug interaction records, and chronologically mapped medical protocols while avoiding black-box advice.",
      audience: "CLINICAL AUDITORS",
      bgGradient: "from-emerald-500/10 to-cyan-500/5"
    },
    {
      title: "Legal Teams",
      desc: "Audit contracts, compare multiple amendment iterations across decades, map key corporate milestones, and isolate direct liability contradictions.",
      audience: "ATTORNEYS & GENERAL COUNSEL",
      bgGradient: "from-amber-500/10 to-orange-500/5"
    },
    {
      title: "Government Policy",
      desc: "Track regulatory changes, audit compliance frameworks, and analyze intelligence files chronologically to identify security or intelligence conflicts.",
      audience: "COMPLIANCE & RISK OFFICERS",
      bgGradient: "from-purple-500/10 to-pink-500/5"
    },
    {
      title: "Enterprise Knowledge",
      desc: "Build a central, trustworthy search interface over corporate records, technical specifications, and historical audits with zero risk of hallucinations.",
      audience: "OPERATIONS & ENGINEERING",
      bgGradient: "from-teal-500/10 to-emerald-500/5"
    },
    {
      title: "Scientific Education",
      desc: "Enable students and educators to upload complex materials, map historical breakthroughs, explore logical support patterns, and practice evidence-based analysis.",
      audience: "ACADEMICS & INSTITUTIONS",
      bgGradient: "from-cyan-500/10 to-blue-500/5"
    }
  ];

  const trustedLogos = [
    { name: "Google Gemini", type: "LLM Core" },
    { name: "FastAPI", type: "Backend API" },
    { name: "Firebase", type: "OAuth/Storage" },
    { name: "LangChain", type: "RAG Pipelines" },
    { name: "FAISS", type: "Vector Index" },
    { name: "Sentence Transformers", type: "Local Encoders" },
    { name: "PyMuPDF", type: "PDF Parser" }
  ];

  return (
    <div className="min-h-screen bg-[#09090B] text-zinc-100 flex flex-col relative overflow-x-hidden selection:bg-cyan-500/30 selection:text-cyan-200">
      
      {/* Decorative Grid Lines */}
      <div className="absolute inset-0 bg-[linear-gradient(to_right,#27272a08_1px,transparent_1px),linear-gradient(to_bottom,#27272a08_1px,transparent_1px)] bg-[size:4rem_4rem] pointer-events-none z-0" />
      
      {/* Glowing Ambient Orbs */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full max-w-7xl h-[600px] pointer-events-none overflow-hidden z-0">
        <div className="absolute top-[-10%] left-[10%] w-[500px] h-[500px] rounded-full bg-cyan-500/5 blur-[120px]" />
        <div className="absolute top-[-5%] right-[10%] w-[450px] h-[450px] rounded-full bg-blue-500/5 blur-[100px]" />
        <div className="absolute top-0 left-0 right-0 h-[1px] bg-gradient-to-r from-transparent via-zinc-800 to-transparent" />
      </div>

      {/* Navigation Header */}
      <header className="border-b border-zinc-900 bg-[#09090B]/85 backdrop-blur-md sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-6 h-16 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-8.5 h-8.5 rounded-lg border border-cyan-500/30 flex items-center justify-center bg-zinc-950">
              <span className="font-sans text-xs text-cyan-400 font-black tracking-tighter">TX</span>
            </div>
            <div className="flex flex-col">
              <span className="font-sans font-extrabold tracking-tight text-sm text-zinc-100">TRACE XAI</span>
              <span className="font-mono text-[9px] tracking-wider text-cyan-400 uppercase font-bold">Document Intelligence</span>
            </div>
          </div>
          
          <nav className="hidden lg:flex items-center gap-8 text-[11px] font-sans tracking-widest text-zinc-400 font-semibold uppercase">
            <a href="#problems" className="hover:text-cyan-400 transition-colors">Problems</a>
            <a href="#solutions" className="hover:text-cyan-400 transition-colors">Solutions</a>
            <a href="#workflow" className="hover:text-cyan-400 transition-colors">Workflow</a>
            <a href="#usecases" className="hover:text-cyan-400 transition-colors">Use Cases</a>
            <a href="#capabilities" className="hover:text-cyan-400 transition-colors">Capabilities</a>
          </nav>

          <div className="flex items-center gap-3">
            <button 
              onClick={handleDemoLogin}
              className="px-4 py-2 rounded-lg bg-zinc-950 border border-zinc-800 hover:border-cyan-400/40 hover:text-white text-xs font-sans font-bold transition-all flex items-center gap-1.5 text-zinc-300 shadow-sm"
            >
              <span>Console login</span>
              <ChevronRight className="w-3.5 h-3.5 text-cyan-400" />
            </button>
          </div>
        </div>
      </header>

      {/* HERO SECTION */}
      <section className="relative pt-16 pb-20 px-6 max-w-7xl mx-auto w-full flex-grow flex flex-col justify-center z-10">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-16 items-center">
          
          {/* Hero Left Content */}
          <div className="lg:col-span-7 space-y-8 text-left">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full border border-cyan-500/20 bg-cyan-950/20 text-cyan-400 font-sans text-xs font-semibold tracking-wide">
              <Sparkles className="w-3.5 h-3.5 text-cyan-400 animate-pulse" />
              <span>SaaS Platform Edition 2.0</span>
            </div>
            
            <div className="space-y-4">
              <h1 className="font-sans font-black text-4xl sm:text-5xl lg:text-6xl tracking-tight leading-[1.1] text-zinc-100">
                Understand Documents with Transparent AI
              </h1>
              <p className="font-sans text-lg sm:text-xl text-zinc-300 font-normal leading-relaxed tracking-tight max-w-2xl">
                TRACE XAI retrieves evidence, detects conflicting information, tracks temporal evolution, and explains every answer using trustworthy document intelligence.
              </p>
            </div>

            {/* Authentication & Demo CTAs */}
            <div className="flex flex-wrap gap-4 pt-2">
              <button
                onClick={handleDemoLogin}
                className="px-6 py-3.5 rounded-xl bg-zinc-100 hover:bg-zinc-200 text-zinc-950 font-sans text-xs font-extrabold transition-all flex items-center gap-3 border border-zinc-100 shadow-md cursor-pointer hover:scale-[1.02]"
              >
                <svg className="w-4 h-4" viewBox="0 0 24 24">
                  <path fill="currentColor" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" />
                  <path fill="currentColor" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" />
                  <path fill="currentColor" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z" />
                  <path fill="currentColor" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z" />
                </svg>
                Continue with Google
              </button>
              
              <button
                onClick={() => setShowDemoModal(true)}
                className="px-6 py-3.5 rounded-xl bg-zinc-900 hover:bg-zinc-850 text-zinc-300 font-sans text-xs font-bold border border-zinc-800 hover:border-zinc-700 transition-all flex items-center gap-2 cursor-pointer hover:scale-[1.02]"
              >
                <Play className="w-3.5 h-3.5 text-cyan-400" />
                <span>Watch Demo</span>
              </button>
            </div>

            {/* Quick stats / Highlights */}
            <div className="pt-8 border-t border-zinc-900 grid grid-cols-3 gap-6">
              <div>
                <p className="text-zinc-500 text-[10px] font-bold tracking-widest uppercase font-mono">Precision</p>
                <p className="text-zinc-200 text-xs font-sans font-semibold mt-1">Zero-Hallucination</p>
              </div>
              <div>
                <p className="text-zinc-500 text-[10px] font-bold tracking-widest uppercase font-mono">Attribution</p>
                <p className="text-zinc-200 text-xs font-sans font-semibold mt-1">Deep Source Citations</p>
              </div>
              <div>
                <p className="text-zinc-500 text-[10px] font-bold tracking-widest uppercase font-mono">Security</p>
                <p className="text-zinc-200 text-xs font-sans font-semibold mt-1">ISO-27001 Ready</p>
              </div>
            </div>
          </div>

          {/* Hero Right Visual: Interactive product dashboard preview */}
          <div className="lg:col-span-5 relative w-full">
            <div className="absolute inset-0 bg-gradient-to-tr from-cyan-500/10 to-blue-500/10 rounded-2xl blur-xl opacity-50" />
            
            <div className="border border-zinc-800 bg-zinc-950 p-6 rounded-2xl relative flex flex-col justify-between min-h-[440px] shadow-2xl shadow-zinc-950/80 z-10">
              
              {/* Fake Menu bar */}
              <div className="flex items-center justify-between border-b border-zinc-900 pb-4">
                <div className="flex items-center gap-2">
                  <div className="w-3 h-3 rounded-full bg-zinc-850 border border-zinc-800" />
                  <span className="font-mono text-[9px] text-zinc-500 uppercase tracking-widest font-bold">Workspace Resolver Feed</span>
                </div>
                <div className="flex items-center gap-1.5 px-2.5 py-0.5 rounded bg-cyan-950/40 border border-cyan-500/20">
                  <span className="w-1.5 h-1.5 rounded-full bg-cyan-400 animate-pulse" />
                  <span className="font-mono text-[8px] text-cyan-400 font-bold uppercase tracking-widest">Temporal RAG v2</span>
                </div>
              </div>

              {/* Animated Interactive Steps */}
              <div className="flex-grow py-6 flex flex-col justify-center">
                <AnimatePresence mode="wait">
                  {previewState === 'typing' && (
                    <motion.div 
                      key="typing"
                      initial={{ opacity: 0, y: 5 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -5 }}
                      className="space-y-4"
                    >
                      <span className="text-[10px] font-bold uppercase text-zinc-500 tracking-wider">User Query Input</span>
                      <div className="p-4 rounded-xl border border-zinc-900 bg-zinc-900/30 font-sans text-sm text-zinc-200 min-h-[70px] flex items-center">
                        <span className="border-r border-cyan-400 pr-0.5 animate-pulse text-zinc-100">
                          {typedQuery}
                        </span>
                      </div>
                      <div className="flex justify-between items-center text-[10px] text-zinc-500">
                        <span>Ctrl + K shortcut</span>
                        <span>Shift + Enter to execute</span>
                      </div>
                    </motion.div>
                  )}

                  {previewState === 'retrieving' && (
                    <motion.div 
                      key="retrieving"
                      initial={{ opacity: 0, y: 5 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -5 }}
                      className="space-y-4"
                    >
                      <span className="text-[10px] font-bold uppercase text-zinc-500 tracking-wider">Isolating Source Passages...</span>
                      <div className="space-y-2.5">
                        <div className="p-3.5 rounded-xl border border-zinc-900 bg-zinc-950/50 space-y-2">
                          <div className="flex justify-between text-[9px] font-mono text-zinc-500 font-bold">
                            <span>SPACE_AUDIT_1985.TXT</span>
                            <span className="text-cyan-400">P.12 • CONFIDENCE 94%</span>
                          </div>
                          <div className="h-1.5 bg-zinc-900 rounded-full overflow-hidden">
                            <motion.div 
                              initial={{ width: 0 }} 
                              animate={{ width: '94%' }} 
                              transition={{ duration: 1 }} 
                              className="h-full bg-cyan-400" 
                            />
                          </div>
                        </div>
                        <div className="p-3.5 rounded-xl border border-zinc-900 bg-zinc-950/50 space-y-2">
                          <div className="flex justify-between text-[9px] font-mono text-zinc-500 font-bold">
                            <span>LAUNCH_REQS_1986.TXT</span>
                            <span className="text-cyan-400">P.3 • CONFIDENCE 91%</span>
                          </div>
                          <div className="h-1.5 bg-zinc-900 rounded-full overflow-hidden">
                            <motion.div 
                              initial={{ width: 0 }} 
                              animate={{ width: '91%' }} 
                              transition={{ duration: 1, delay: 0.2 }} 
                              className="h-full bg-blue-500" 
                            />
                          </div>
                        </div>
                      </div>
                    </motion.div>
                  )}

                  {previewState === 'conflict' && (
                    <motion.div 
                      key="conflict"
                      initial={{ opacity: 0, scale: 0.98 }}
                      animate={{ opacity: 1, scale: 1 }}
                      exit={{ opacity: 0, scale: 0.98 }}
                      className="space-y-4"
                    >
                      <span className="text-[10px] font-bold uppercase text-red-400 tracking-wider flex items-center gap-1.5">
                        <ShieldAlert className="w-3.5 h-3.5" />
                        Cross-Source Factual Contradiction Detected
                      </span>

                      <div className="p-4 rounded-xl border border-red-950/30 bg-red-950/5 space-y-2">
                        <div className="flex justify-between text-[9px] font-mono text-zinc-500 font-bold">
                          <span className="text-red-400">NLI CONTRAST EXPLAINED (94% SEVERITY)</span>
                          <span className="text-zinc-400">1985 ↔ 1986</span>
                        </div>
                        <p className="text-zinc-300 text-xs leading-relaxed font-sans font-medium">
                          "The 1985 technical guidelines explicitly restrict shuttle liftoffs in weather below 50°F due to O-ring degradation. However, the subsequent 1986 operations memo claims clearance with zero thermal thresholds."
                        </p>
                      </div>

                      <div className="p-3 rounded-lg bg-zinc-900/40 border border-zinc-900 flex justify-between items-center text-[10px]">
                        <span className="text-zinc-500">Confidence Score: <b className="text-emerald-400">97%</b></span>
                        <span className="text-zinc-400 font-bold">TRACE Attribution active</span>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>

              {/* Fake Status footer */}
              <div className="pt-4 border-t border-zinc-900 flex items-center justify-between text-[10px] text-zinc-500 font-semibold font-sans">
                <span className="flex items-center gap-1.5 text-emerald-400">
                  <CheckCircle2 className="w-3.5 h-3.5" />
                  Factual consensus audited
                </span>
                <span className="font-mono">TRACE-XAI Engine v2.0</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* TRUSTED TECHNOLOGY SECTION */}
      <section className="border-t border-b border-zinc-900 bg-zinc-950/50 py-12 px-6">
        <div className="max-w-7xl mx-auto space-y-6">
          <p className="text-center font-mono text-[10px] text-zinc-500 font-black tracking-widest uppercase">
            TRUSTED BY COMPLIANCE AND RESEARCH TEAMS ARCHITECTED WITH
          </p>
          <div className="flex flex-wrap justify-center items-center gap-x-12 gap-y-6">
            {trustedLogos.map((logo, idx) => (
              <div key={idx} className="flex flex-col items-center">
                <span className="font-sans font-black text-xs text-zinc-300 hover:text-cyan-400 transition-colors uppercase tracking-wider">
                  {logo.name}
                </span>
                <span className="font-mono text-[8px] text-zinc-650 tracking-widest uppercase font-bold mt-0.5">
                  {logo.type}
                </span>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* PROBLEM SECTION */}
      <section id="problems" className="py-24 px-6 max-w-7xl mx-auto space-y-16">
        <div className="max-w-3xl space-y-4">
          <span className="font-mono text-xs text-red-400 tracking-widest uppercase font-black">THE FAILING STANDARD</span>
          <h2 className="font-sans font-black text-3xl sm:text-4xl tracking-tight leading-tight text-white">
            Why Current Generative AI Systems Fail
          </h2>
          <p className="text-zinc-400 font-sans text-sm sm:text-base leading-relaxed">
            Standard conversational chatbots and naive vector retrievers are built for creative exploration, not strict compliance. When applied to auditing critical operations, their baseline architecture introduces substantial hidden risks.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {problemCards.map((card, idx) => (
            <div key={idx} className="border border-zinc-900 bg-zinc-950/40 p-8 rounded-2xl flex flex-col justify-between space-y-6 shadow-sm">
              <div className="space-y-4">
                <div className="w-10 h-10 rounded-lg bg-red-950/20 border border-red-900/30 flex items-center justify-center text-red-400">
                  <AlertTriangle className="w-5 h-5" />
                </div>
                <h3 className="font-sans font-extrabold text-lg text-zinc-200">{card.title}</h3>
                <p className="text-zinc-400 font-sans text-xs leading-relaxed">{card.problem}</p>
              </div>
              <div className="p-4 rounded-xl bg-red-950/10 border border-red-900/20 text-red-400 text-[11px] leading-relaxed font-sans font-medium">
                <span className="font-bold uppercase block text-[9px] tracking-wider mb-1">Operational Threat:</span>
                {card.threat}
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* SOLUTION SECTION */}
      <section id="solutions" className="border-t border-zinc-900 bg-zinc-900/10 py-24 px-6">
        <div className="max-w-7xl mx-auto space-y-16">
          <div className="max-w-3xl space-y-4">
            <span className="font-mono text-xs text-cyan-400 tracking-widest uppercase font-black">TRACE ADVANTAGE</span>
            <h2 className="font-sans font-black text-3xl sm:text-4xl tracking-tight text-white">
              Transparent, Auditable Factual Synthesis
            </h2>
            <p className="text-zinc-400 font-sans text-sm sm:text-base leading-relaxed">
              TRACE-XAI solves the transparency gap by implementing a chronologically synchronized multi-agent reasoning layer. We cross-examine sources, isolate fact changes, and attribute everything we output.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {solutionCards.map((feat, idx) => (
              <div 
                key={idx} 
                className="border border-zinc-900 hover:border-cyan-500/20 bg-zinc-950 p-8 rounded-2xl transition-all duration-300 flex flex-col justify-between h-72 group hover:shadow-lg hover:shadow-cyan-950/5"
              >
                <div className="space-y-4">
                  <div className="w-12 h-12 rounded-xl border border-zinc-800 bg-zinc-900 flex items-center justify-center group-hover:border-cyan-400/40 transition-colors">
                    <feat.icon className="w-5 h-5 text-cyan-400" />
                  </div>
                  <h4 className="font-sans font-extrabold text-base text-zinc-100 group-hover:text-cyan-400 transition-colors">{feat.title}</h4>
                  <p className="text-zinc-400 font-sans text-xs leading-relaxed font-medium">{feat.desc}</p>
                </div>
                <div className="font-mono text-[9px] text-zinc-650 tracking-widest font-black uppercase">{feat.tag}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* INTERACTIVE WORKFLOW PIPELINE */}
      <section id="workflow" className="border-t border-zinc-900 py-24 px-6 bg-[#09090B]">
        <div className="max-w-7xl mx-auto space-y-16">
          <div className="max-w-3xl space-y-4">
            <span className="font-mono text-xs text-cyan-400 tracking-widest uppercase font-black">PIPELINE TELEMETRY</span>
            <h2 className="font-sans font-black text-3xl sm:text-4xl tracking-tight text-white">
              Animated Chronology Pipeline
            </h2>
            <p className="text-zinc-400 font-sans text-sm sm:text-base leading-relaxed">
              Watch how our chronological retrieval coordinates multi-document uploads, extracts semantic vectors, and synthesizes verifiable answers.
            </p>
          </div>

          {/* Animated Pipeline horizontal timeline style */}
          <div className="border border-zinc-900 rounded-2xl p-8 bg-zinc-950/60 relative overflow-hidden shadow-sm">
            <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-9 gap-4 relative z-10">
              {pipelineSteps.map((step, idx) => {
                const isActive = activeWorkflowStep === idx;
                return (
                  <div 
                    key={idx} 
                    className={`flex flex-col justify-between p-4 rounded-xl border transition-all duration-500 min-h-[140px] ${
                      isActive 
                        ? 'border-cyan-500 bg-cyan-950/10 shadow-lg shadow-cyan-950/20 scale-[1.03]' 
                        : 'border-zinc-900 bg-zinc-950/40 opacity-50'
                    }`}
                  >
                    <div className="flex items-center justify-between">
                      <div className={`w-8 h-8 rounded-lg border flex items-center justify-center transition-colors ${
                        isActive ? 'border-cyan-400 bg-cyan-950 text-cyan-400' : 'border-zinc-800 bg-zinc-900 text-zinc-500'
                      }`}>
                        <step.icon className="w-4 h-4" />
                      </div>
                      <span className="font-mono text-[9px] text-zinc-600 font-black">0{idx+1}</span>
                    </div>
                    <div className="space-y-1">
                      <div className={`font-sans font-extrabold text-xs transition-colors ${
                        isActive ? 'text-cyan-300' : 'text-zinc-300'
                      }`}>
                        {step.name}
                      </div>
                      <p className="text-[10px] text-zinc-500 font-medium leading-snug">{step.desc}</p>
                    </div>
                  </div>
                );
              })}
            </div>
            
            {/* Ambient Background lines inside Pipeline */}
            <div className="absolute inset-0 bg-[radial-gradient(#1c1917_1px,transparent_1px)] [background-size:24px_24px] opacity-10 pointer-events-none" />
          </div>
        </div>
      </section>

      {/* USE CASES SECTION */}
      <section id="usecases" className="border-t border-zinc-900 py-24 px-6 bg-zinc-900/10">
        <div className="max-w-7xl mx-auto space-y-16">
          <div className="max-w-3xl space-y-4">
            <span className="font-mono text-xs text-cyan-400 tracking-widest uppercase font-black">SECTOR CAPABILITIES</span>
            <h2 className="font-sans font-black text-3xl sm:text-4xl tracking-tight text-white">
              Built for Highly Regulated Sectors
            </h2>
            <p className="text-zinc-400 font-sans text-sm sm:text-base leading-relaxed">
              From legal cross-examination to medical protocol compliance, TRACE-XAI delivers the auditable factual synthesis that modern enterprises require.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {useCases.map((useCase, idx) => (
              <div 
                key={idx} 
                className={`border border-zinc-900 bg-gradient-to-br ${useCase.bgGradient} p-8 rounded-2xl flex flex-col justify-between min-h-[220px] transition-all hover:border-zinc-800 shadow-sm`}
              >
                <div className="space-y-3">
                  <span className="font-mono text-[9px] text-cyan-400 font-black tracking-wider uppercase block">{useCase.audience}</span>
                  <h3 className="font-sans font-extrabold text-base text-zinc-200">{useCase.title}</h3>
                  <p className="text-zinc-400 font-sans text-xs leading-relaxed font-medium">{useCase.desc}</p>
                </div>
                <button 
                  onClick={handleDemoLogin}
                  className="font-sans text-[10px] text-zinc-300 hover:text-white font-semibold flex items-center gap-1.5 mt-4 group cursor-pointer"
                >
                  <span>Explore sector console</span>
                  <ArrowRight className="w-3.5 h-3.5 text-zinc-500 group-hover:text-cyan-400 group-hover:translate-x-0.5 transition-all" />
                </button>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* TESTIMONIALS SECTION ("What TRACE enables") */}
      <section id="capabilities" className="border-t border-zinc-900 py-24 px-6 bg-[#09090B]">
        <div className="max-w-4xl mx-auto space-y-16 text-center">
          <div className="space-y-4">
            <span className="font-mono text-xs text-cyan-400 tracking-widest uppercase font-black">BENEFITS REGISTER</span>
            <h2 className="font-sans font-black text-3xl tracking-tight text-white">
              What TRACE Enables
            </h2>
            <p className="text-zinc-400 font-sans text-sm max-w-2xl mx-auto leading-relaxed">
              We focus on true business and scientific capabilities. Here is what your organization unlocks by moving to chronological document intelligence.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-3xl mx-auto text-left">
            <div className="p-5 rounded-xl border border-zinc-900 bg-zinc-950/80 flex items-start gap-3.5">
              <div className="w-5 h-5 rounded-full bg-emerald-950/50 border border-emerald-500/30 flex items-center justify-center shrink-0 mt-0.5">
                <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
              </div>
              <div>
                <h4 className="font-sans font-bold text-xs sm:text-sm text-zinc-100">Better Literature Review</h4>
                <p className="text-zinc-400 text-xs mt-1 leading-relaxed font-medium">Verify timelines of academic breakthroughs, isolate conflicting clinical studies, and pinpoint research chronology easily.</p>
              </div>
            </div>

            <div className="p-5 rounded-xl border border-zinc-900 bg-zinc-950/80 flex items-start gap-3.5">
              <div className="w-5 h-5 rounded-full bg-emerald-950/50 border border-emerald-500/30 flex items-center justify-center shrink-0 mt-0.5">
                <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
              </div>
              <div>
                <h4 className="font-sans font-bold text-xs sm:text-sm text-zinc-100">Explainable Enterprise Search</h4>
                <p className="text-zinc-400 text-xs mt-1 leading-relaxed font-medium">Search massive institutional memory archives with absolute accuracy. Trust every answer with hoverable in-context citations.</p>
              </div>
            </div>

            <div className="p-5 rounded-xl border border-zinc-900 bg-zinc-950/80 flex items-start gap-3.5">
              <div className="w-5 h-5 rounded-full bg-emerald-950/50 border border-emerald-500/30 flex items-center justify-center shrink-0 mt-0.5">
                <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
              </div>
              <div>
                <h4 className="font-sans font-bold text-xs sm:text-sm text-zinc-100">Reliable Document Comparison</h4>
                <p className="text-zinc-400 text-xs mt-1 leading-relaxed font-medium">Isolate subtle factual disagreements or estimate shifts across multiple quarters or policy revisions instantly.</p>
              </div>
            </div>

            <div className="p-5 rounded-xl border border-zinc-900 bg-zinc-950/80 flex items-start gap-3.5">
              <div className="w-5 h-5 rounded-full bg-emerald-950/50 border border-emerald-500/30 flex items-center justify-center shrink-0 mt-0.5">
                <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
              </div>
              <div>
                <h4 className="font-sans font-bold text-xs sm:text-sm text-zinc-100">Trustworthy AI Answers</h4>
                <p className="text-zinc-400 text-xs mt-1 leading-relaxed font-medium">Eliminate structural generative hallucinations. Obtain confidence scores, reasoning steps, and verifiable index audits.</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* COMPLIANCE & PRIVACY CALLOUT */}
      <section className="border-t border-zinc-900 bg-zinc-900/10 py-24 px-6">
        <div className="max-w-4xl mx-auto text-center space-y-8">
          <div className="w-16 h-16 rounded-2xl border border-zinc-800 bg-zinc-950 flex items-center justify-center mx-auto text-cyan-400">
            <Lock className="w-8 h-8" />
          </div>
          <div className="space-y-4">
            <h3 className="font-sans font-black text-3xl tracking-tight text-white">Bank-Grade Compliance & Privacy</h3>
            <p className="text-zinc-400 font-sans text-sm sm:text-base max-w-2xl mx-auto leading-relaxed font-medium">
              Your research, patents, legal files, and strategic data remain entirely yours. TRACE-XAI enforces zero-knowledge storage, local vector-embeddings matching, and strictly sandboxed queries. We never train generative baseline models on your files.
            </p>
          </div>
          <div className="flex flex-wrap justify-center gap-4 text-xs font-mono text-zinc-500 uppercase tracking-widest font-black">
            <span className="flex items-center gap-1.5"><Globe className="w-4 h-4 text-zinc-500" /> ISO 27001 COMPLIANT ARCHITECTURE</span>
            <span className="text-zinc-850">•</span>
            <span className="flex items-center gap-1.5"><RefreshCw className="w-4 h-4 text-zinc-500" /> SOC 2 TYPE II VALIDATED</span>
          </div>
        </div>
      </section>

      {/* FOOTER */}
      <footer className="border-t border-zinc-900 bg-[#09090B] py-16 px-6 mt-auto">
        <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-4 gap-12 border-b border-zinc-900 pb-12 mb-12">
          <div className="space-y-4">
            <div className="flex items-center gap-3">
              <div className="w-7 h-7 rounded border border-cyan-500/30 flex items-center justify-center bg-zinc-950">
                <span className="font-sans text-[10px] text-cyan-400 font-extrabold tracking-tighter">TX</span>
              </div>
              <span className="font-sans font-extrabold tracking-tight text-sm text-zinc-100">TRACE XAI</span>
            </div>
            <p className="text-zinc-500 font-sans text-xs leading-relaxed">
              Temporal Retrieval-Augmented Conflict Explanation System. Enterprise-grade document intelligence.
            </p>
          </div>

          <div>
            <h4 className="font-mono text-[10px] font-black text-zinc-400 uppercase tracking-widest mb-4">RESOURCES</h4>
            <ul className="space-y-2.5 text-xs text-zinc-500 font-medium">
              <li><a href="#problems" className="hover:text-cyan-400 transition-colors">Platform Scope</a></li>
              <li><a href="#workflow" className="hover:text-cyan-400 transition-colors">Pipeline Telemetry</a></li>
              <li><a href="#solutions" className="hover:text-cyan-400 transition-colors">Solutions Index</a></li>
            </ul>
          </div>

          <div>
            <h4 className="font-mono text-[10px] font-black text-zinc-400 uppercase tracking-widest mb-4">PRODUCT</h4>
            <ul className="space-y-2.5 text-xs text-zinc-500 font-medium">
              <li><a href="#" className="hover:text-cyan-400 transition-colors">Documentation</a></li>
              <li><a href="#" className="hover:text-cyan-400 transition-colors">GitHub Repository</a></li>
              <li><a href="#" className="hover:text-cyan-400 transition-colors">API Services</a></li>
            </ul>
          </div>

          <div>
            <h4 className="font-mono text-[10px] font-black text-zinc-400 uppercase tracking-widest mb-4">LEGAL & SAFETY</h4>
            <ul className="space-y-2.5 text-xs text-zinc-500 font-medium">
              <li><a href="#" className="hover:text-cyan-400 transition-colors">Privacy Policy</a></li>
              <li><a href="#" className="hover:text-cyan-400 transition-colors">Terms of Service</a></li>
              <li><a href="#" className="hover:text-cyan-400 transition-colors">Security Center</a></li>
              <li><a href="#" className="hover:text-cyan-400 transition-colors">About Us</a></li>
            </ul>
          </div>
        </div>

        <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-6 text-zinc-500 text-xs">
          <p>&copy; 2026 TRACE XAI. All rights reserved. Enterprise Intelligence. Built with Google Gemini.</p>
          <div className="font-mono text-[10px] text-zinc-650 uppercase tracking-widest flex gap-6">
            <span>v2.0.0 Stable</span>
            <span>•</span>
            <span>US-WEST Server Node</span>
          </div>
        </div>
      </footer>

      {/* WATCH DEMO MODAL */}
      <AnimatePresence>
        {showDemoModal && (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-zinc-950/80 backdrop-blur-md"
            onClick={() => setShowDemoModal(false)}
          >
            <motion.div 
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.95, opacity: 0 }}
              className="bg-zinc-950 border border-zinc-800 p-6 rounded-2xl max-w-2xl w-full relative space-y-6 shadow-2xl"
              onClick={(e) => e.stopPropagation()}
            >
              <button 
                onClick={() => setShowDemoModal(false)}
                className="absolute top-4 right-4 p-1 rounded-lg hover:bg-zinc-900 text-zinc-400 hover:text-zinc-200 transition-all cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>

              <div className="space-y-2">
                <h3 className="font-sans font-black text-lg text-white">TRACE XAI Product Demo Overview</h3>
                <p className="text-xs text-zinc-400 font-medium leading-relaxed">
                  Learn how TRACE-XAI processes multi-document indices, maps timeline checkpoints, and performs NLI contradiction matching.
                </p>
              </div>

              {/* Demo Sandbox Interactive Steps visualizer */}
              <div className="p-4 rounded-xl border border-zinc-900 bg-zinc-900/20 space-y-4">
                <div className="flex justify-between items-center text-[10px] font-mono text-zinc-500 font-bold border-b border-zinc-900 pb-2">
                  <span>SANDBOX COMPILATION TEST</span>
                  <span className="text-cyan-400">STATUS: ACTIVE</span>
                </div>

                <div className="space-y-3">
                  <div className="flex items-center gap-3 text-xs text-zinc-300 font-medium">
                    <span className="w-4 h-4 rounded-full bg-emerald-950 text-emerald-400 flex items-center justify-center font-mono text-[10px] font-bold">1</span>
                    <span>Upload multiple chronologically bound logs or contract revisions.</span>
                  </div>
                  <div className="flex items-center gap-3 text-xs text-zinc-300 font-medium">
                    <span className="w-4 h-4 rounded-full bg-emerald-950 text-emerald-400 flex items-center justify-center font-mono text-[10px] font-bold">2</span>
                    <span>The pipeline extracts year indices and structures paragraphs as distinct nodes.</span>
                  </div>
                  <div className="flex items-center gap-3 text-xs text-zinc-300 font-medium">
                    <span className="w-4 h-4 rounded-full bg-emerald-950 text-emerald-400 flex items-center justify-center font-mono text-[10px] font-bold">3</span>
                    <span>Run inquiries: TRACE compares claims chronologically, highlighting contradictions.</span>
                  </div>
                </div>

                <div className="pt-2">
                  <button
                    onClick={() => {
                      setShowDemoModal(false);
                      handleDemoLogin();
                    }}
                    className="w-full py-3.5 rounded-xl bg-zinc-100 hover:bg-zinc-200 text-zinc-950 font-sans text-xs font-black transition-all flex items-center justify-center gap-2 cursor-pointer shadow-sm"
                  >
                    <span>Launch Sandbox Environment</span>
                    <ArrowUpRight className="w-4 h-4" />
                  </button>
                </div>
              </div>

            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

    </div>
  );
}
