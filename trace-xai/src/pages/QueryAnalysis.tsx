/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect, useRef } from 'react';
import { 
  Search, 
  Cpu, 
  ShieldAlert, 
  HelpCircle, 
  BookOpen, 
  ChevronDown, 
  ArrowRight,
  Sparkles,
  ChevronUp,
  History,
  FileCheck2,
  Bookmark,
  Calendar,
  AlertTriangle,
  Clock,
  ExternalLink,
  Layers,
  Scale,
  BookmarkCheck,
  Check,
  X,
  Target
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { QueryAnalysisResult, IndexedDocument } from '../types';

interface QueryAnalysisProps {
  documents: IndexedDocument[];
  queryHistory: QueryAnalysisResult[];
  onExecuteQuery: (query: string) => Promise<void>;
}

export default function QueryAnalysis({ 
  documents, 
  queryHistory, 
  onExecuteQuery 
}: QueryAnalysisProps) {
  const [query, setQuery] = useState('');
  const [isExecuting, setIsExecuting] = useState(false);
  const [expandedChunk, setExpandedChunk] = useState<string | null>(null);
  const [pinnedQueries, setPinnedQueries] = useState<string[]>(() => {
    return JSON.parse(localStorage.getItem('trace_pinned_queries') || '[]');
  });
  const [selectedResult, setSelectedResult] = useState<QueryAnalysisResult | null>(null);
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  const sampleQueries = [
    "Compare the reported milestones and dates between the audit reports.",
    "What are the conflicting estimates for project completion, and which years are referenced?",
    "Evaluate the timeline of development milestones and identify chronological disagreements."
  ];

  // Set latest query as active selected result by default
  useEffect(() => {
    if (queryHistory.length > 0 && !selectedResult) {
      setSelectedResult(queryHistory[0]);
    }
  }, [queryHistory]);

  // Global Ctrl+K / Cmd+K focus shortcut
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.ctrlKey || e.metaKey) && e.key === 'k') {
        e.preventDefault();
        textareaRef.current?.focus();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  const handleSelectSample = (sample: string) => {
    setQuery(sample);
    textareaRef.current?.focus();
  };

  const handleRunAnalysis = async (customQuery?: string) => {
    const targetQuery = customQuery || query;
    if (!targetQuery.trim() || documents.length === 0) return;
    setIsExecuting(true);
    try {
      await onExecuteQuery(targetQuery);
      setQuery('');
      // Set the newly run query as the primary active result
      if (queryHistory.length > 0) {
        setSelectedResult(queryHistory[0]);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setIsExecuting(false);
    }
  };

  const handleKeyDownTextarea = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleRunAnalysis();
    }
  };

  const togglePin = (qText: string) => {
    let updated: string[];
    if (pinnedQueries.includes(qText)) {
      updated = pinnedQueries.filter(q => q !== qText);
    } else {
      updated = [...pinnedQueries, qText];
    }
    setPinnedQueries(updated);
    localStorage.setItem('trace_pinned_queries', JSON.stringify(updated));
  };

  const activeResult = selectedResult || queryHistory[0] || null;

  return (
    <div className="p-6 lg:p-10 max-w-7xl mx-auto space-y-8 flex flex-col min-h-0 selection:bg-cyan-500/30">
      
      {/* Search Header Container (Only if no activeResult or when explicitly collapsed) */}
      <div className="border-b border-zinc-200 dark:border-zinc-800 pb-5 shrink-0 flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h1 className="font-sans font-extrabold text-2xl sm:text-3xl text-zinc-900 dark:text-zinc-100 tracking-tight flex items-center gap-2">
            Query Analysis Console
          </h1>
          <p className="font-sans text-sm text-zinc-500 dark:text-zinc-400 mt-1">
            Perform semantic temporal search inquiries, detect multi-source factual contradictions, and map timeline evidence.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <span className="flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-zinc-50 dark:bg-zinc-900/50 border border-zinc-200 dark:border-zinc-800 text-[10px] font-mono font-bold text-zinc-500 dark:text-zinc-450 uppercase">
            <Target className="w-3.5 h-3.5 text-blue-500" />
            {documents.length} sources indexed
          </span>
        </div>
      </div>

      {/* Main Perplexity style Search Area */}
      {(!activeResult && !isExecuting) ? (
        /* LARGE CENTERED INITIAL SEARCH VIEW */
        <div className="max-w-3xl mx-auto w-full py-12 space-y-12">
          
          <div className="text-center space-y-3">
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full border border-cyan-500/20 bg-cyan-950/20 text-cyan-400 text-[10px] font-bold uppercase tracking-wider">
              <Sparkles className="w-3.5 h-3.5" />
              <span>Transparent Temporal RAG Engine</span>
            </div>
            <h2 className="font-sans font-black text-3xl sm:text-4xl text-zinc-900 dark:text-zinc-100 tracking-tight leading-tight">
              What would you like to verify?
            </h2>
            <p className="font-sans text-xs sm:text-sm text-zinc-400 dark:text-zinc-500 max-w-md mx-auto">
              TRACE-XAI parses chronological references, indexes facts, and highlights logical contradictions with perfect attribution.
            </p>
          </div>

          {/* PERPLEXITY STYLE CENTRALIZED CONTAINER */}
          <div className="border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-950 p-4 rounded-2xl shadow-xl shadow-zinc-900/5 dark:shadow-none space-y-3">
            <div className="flex gap-3 items-start">
              <Search className="w-5 h-5 text-zinc-400 dark:text-zinc-500 mt-2.5 shrink-0" />
              <textarea
                ref={textareaRef}
                placeholder={
                  documents.length === 0 
                    ? "Inquiry inactive. Please ingest plain text or markdown files to initialize vector storage..." 
                    : "Ask TRACE-XAI to audit files (e.g., compare estimates, verify timelines, detect contradictions)..."
                }
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                onKeyDown={handleKeyDownTextarea}
                disabled={documents.length === 0 || isExecuting}
                rows={3}
                className="w-full bg-transparent border-0 text-zinc-800 dark:text-zinc-100 placeholder-zinc-400 dark:placeholder-zinc-600 text-sm focus:ring-0 focus:outline-none leading-relaxed resize-none font-medium"
              />
            </div>

            <div className="flex justify-between items-center pt-3 border-t border-zinc-100 dark:border-zinc-900">
              <div className="flex items-center gap-1.5 text-[10px] text-zinc-400 dark:text-zinc-500 font-mono">
                <kbd className="px-1.5 py-0.5 rounded border border-zinc-200 dark:border-zinc-800 bg-zinc-50 dark:bg-zinc-900">Ctrl + K</kbd>
                <span>focus console • Press Enter to run</span>
              </div>

              <button
                onClick={() => handleRunAnalysis()}
                disabled={documents.length === 0 || isExecuting || !query.trim()}
                className="px-5 py-2 rounded-xl bg-zinc-900 hover:bg-zinc-850 dark:bg-zinc-100 dark:hover:bg-zinc-200 disabled:bg-zinc-100 dark:disabled:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 text-white dark:text-zinc-950 disabled:text-zinc-400 dark:disabled:text-zinc-600 font-sans text-xs font-black transition-all flex items-center gap-2 cursor-pointer shadow-sm"
              >
                <span>Analyze Archives</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>

          {/* SUGGESTED PROMPTS */}
          <div className="space-y-4">
            <span className="block text-[10px] font-black text-zinc-400 dark:text-zinc-500 uppercase tracking-widest text-center">Suggested prompts</span>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {sampleQueries.map((q, idx) => (
                <button
                  key={idx}
                  onClick={() => handleSelectSample(q)}
                  disabled={documents.length === 0}
                  className="p-4 rounded-xl border border-zinc-200 dark:border-zinc-850 bg-zinc-50/50 hover:bg-zinc-100 dark:bg-zinc-950/40 dark:hover:bg-zinc-900 text-left text-xs text-zinc-650 dark:text-zinc-400 hover:text-zinc-900 dark:hover:text-zinc-200 leading-relaxed font-sans font-medium transition-all shadow-sm"
                >
                  "{q}"
                </button>
              ))}
            </div>
          </div>

        </div>
      ) : (
        /* SPLIT RESULT LAYOUT: LARGE RESULTS ON ACTIVE STATE */
        <div className="space-y-6 flex-grow flex flex-col min-h-0">
          
          {/* Top Compact Input Bar */}
          <div className="border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-950/80 p-3 rounded-2xl flex items-center gap-3">
            <Search className="w-4 h-4 text-zinc-400 shrink-0 ml-1" />
            <input
              ref={textareaRef}
              type="text"
              placeholder="Ask a follow-up or run a new search..."
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === 'Enter') handleRunAnalysis();
              }}
              disabled={documents.length === 0 || isExecuting}
              className="w-full bg-transparent border-0 text-xs sm:text-sm text-zinc-800 dark:text-zinc-100 placeholder-zinc-450 focus:ring-0 focus:outline-none font-medium"
            />
            
            <button
              onClick={() => handleRunAnalysis()}
              disabled={documents.length === 0 || isExecuting || !query.trim()}
              className="px-3.5 py-1.5 rounded-xl bg-zinc-900 hover:bg-zinc-850 dark:bg-zinc-100 dark:hover:bg-zinc-200 text-white dark:text-zinc-950 text-xs font-bold font-sans transition-all flex items-center gap-1 shrink-0"
            >
              {isExecuting ? (
                <span className="w-3.5 h-3.5 rounded-full border-2 border-zinc-500 border-t-white dark:border-t-zinc-950 animate-spin" />
              ) : (
                <span>Inquire</span>
              )}
            </button>
          </div>

          {/* Telemetry Loader */}
          {isExecuting ? (
            <div className="border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900/30 p-16 rounded-2xl flex flex-col items-center justify-center space-y-6 flex-grow">
              <div className="relative w-16 h-16 flex items-center justify-center">
                <div className="absolute inset-0 rounded-full border-2 border-zinc-200 dark:border-zinc-800 border-t-blue-600 dark:border-t-cyan-400 animate-spin" />
                <Cpu className="w-6 h-6 text-blue-600 dark:text-cyan-400 animate-pulse" />
              </div>
              <div className="text-center space-y-2 max-w-sm">
                <h4 className="font-sans font-bold text-sm text-zinc-800 dark:text-zinc-200 uppercase tracking-wider">TRACE COGNITIVE RESOLVER ACTIVE</h4>
                <p className="text-zinc-500 dark:text-zinc-450 font-sans text-xs leading-relaxed">
                  Generating semantic query vector, loading matching chronological blocks, and checking multi-file alignments...
                </p>
              </div>
            </div>
          ) : (
            /* DUAL COLUMN SPLIT VIEW LAYOUT */
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-stretch flex-grow min-h-0">
              
              {/* LEFT COLUMN (6 cols): Synthesized Answer, Confidence, Chronology Timeline */}
              <div className="lg:col-span-7 flex flex-col space-y-6">
                
                {/* Synthesis Answer panel */}
                <div className="border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-950/40 p-6 rounded-2xl flex flex-col justify-between shadow-sm flex-grow">
                  
                  <div className="space-y-6">
                    {/* Header info */}
                    <div className="flex justify-between items-center border-b border-zinc-100 dark:border-zinc-900 pb-3">
                      <div className="flex items-center gap-2">
                        <Sparkles className="w-4 h-4 text-blue-600 dark:text-cyan-400 animate-pulse" />
                        <span className="font-sans text-xs font-extrabold tracking-widest text-zinc-400 uppercase">Resolved Answer Integrity</span>
                      </div>
                      
                      <div className="flex items-center gap-3">
                        <span className="text-xs text-zinc-400 font-semibold">
                          Confidence: 
                          <span className={`font-mono font-bold px-1.5 py-0.5 rounded ml-1 text-[10px] ${
                            activeResult.confidence > 80 
                              ? 'bg-emerald-50 dark:bg-emerald-500/10 text-emerald-600 dark:text-emerald-400' 
                              : 'bg-amber-50 dark:bg-amber-500/10 text-amber-600 dark:text-amber-400'
                          }`}>
                            {activeResult.confidence}%
                          </span>
                        </span>
                        
                        <button 
                          onClick={() => togglePin(activeResult.query)}
                          className="p-1 rounded-lg border border-zinc-100 dark:border-zinc-900 bg-zinc-50 dark:bg-zinc-900 text-zinc-400 hover:text-amber-500 transition-colors cursor-pointer"
                          title="Pin inquiry"
                        >
                          <Bookmark className={`w-3.5 h-3.5 ${pinnedQueries.includes(activeResult.query) ? 'fill-current text-amber-500' : ''}`} />
                        </button>
                      </div>
                    </div>

                    {/* Query header */}
                    <div className="p-4 rounded-xl border border-zinc-100 dark:border-zinc-900 bg-zinc-50/50 dark:bg-zinc-900/20">
                      <span className="font-sans text-[9px] font-bold text-zinc-400 uppercase tracking-widest block mb-1">active query scope</span>
                      <p className="font-bold text-xs sm:text-sm text-zinc-800 dark:text-zinc-200">"{activeResult.query}"</p>
                    </div>

                    {/* Synthesized Answer */}
                    <div className="space-y-4 text-xs sm:text-sm leading-relaxed text-zinc-850 dark:text-zinc-300 font-sans max-h-[260px] overflow-y-auto pr-1">
                      <p className="whitespace-pre-line font-medium">{activeResult.answer}</p>
                    </div>
                  </div>

                  {/* Dynamic Timeline of assertions referenced in this answer */}
                  <div className="pt-4 border-t border-zinc-100 dark:border-zinc-900 space-y-3 mt-4">
                    <div className="flex items-center gap-1.5 text-zinc-600 dark:text-zinc-400 font-bold uppercase text-[9px] tracking-wider">
                      <Calendar className="w-3.5 h-3.5 text-blue-500 dark:text-cyan-400" />
                      <span>Answer Chronology Timeline</span>
                    </div>

                    <div className="flex items-center gap-2 overflow-x-auto pb-1 max-w-full">
                      {activeResult.sourceReferences.filter(r => r.year !== null).length > 0 ? (
                        activeResult.sourceReferences.filter(r => r.year !== null).map((ref, idx) => (
                          <div 
                            key={idx} 
                            className="px-2.5 py-1.5 rounded-lg border border-zinc-200 dark:border-zinc-850 bg-zinc-50 dark:bg-zinc-900 shrink-0 text-[10px] flex items-center gap-2 font-semibold"
                          >
                            <span className="font-mono text-blue-600 dark:text-cyan-400">Year {ref.year}</span>
                            <span className="text-zinc-400 truncate max-w-[80px]">{ref.name}</span>
                          </div>
                        ))
                      ) : (
                        <span className="text-[10px] text-zinc-450 italic font-sans font-semibold">No temporal anchors identified in answer nodes</span>
                      )}
                    </div>
                  </div>

                </div>

              </div>

              {/* RIGHT COLUMN (6 cols): Evidence Cards, Citations, Conflicts */}
              <div className="lg:col-span-5 flex flex-col space-y-6">
                
                {/* Evidence Panel */}
                <div className="border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-950/40 p-6 rounded-2xl flex flex-col justify-between shadow-sm flex-grow">
                  
                  <div className="space-y-4 w-full">
                    <span className="block font-sans text-xs font-bold text-zinc-400 uppercase tracking-wider">
                      Attributed Source Citations
                    </span>
                    
                    {/* Source summary list */}
                    <div className="flex flex-wrap gap-2 pb-2 border-b border-zinc-100 dark:border-zinc-900">
                      {activeResult.sourceReferences.map((ref, i) => (
                        <div 
                          key={i} 
                          className="px-2.5 py-1 rounded-full bg-zinc-50 dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-850 text-[10px] font-sans text-zinc-500 dark:text-zinc-400 font-bold uppercase tracking-wider flex items-center gap-1.5"
                        >
                          <BookOpen className="w-3.5 h-3.5 text-blue-500 dark:text-cyan-400" />
                          <span>{ref.name}</span>
                        </div>
                      ))}
                    </div>

                    {/* Chunk list scroll area */}
                    <div className="space-y-3 max-h-[360px] overflow-y-auto pr-1">
                      {activeResult.retrievedChunks.map((chunk) => {
                        const isExpanded = expandedChunk === chunk.id;
                        return (
                          <div 
                            key={chunk.id} 
                            className="border border-zinc-200 dark:border-zinc-850 bg-zinc-50/50 dark:bg-zinc-950 rounded-xl overflow-hidden transition-all"
                          >
                            <div 
                              onClick={() => setExpandedChunk(isExpanded ? null : chunk.id)}
                              className="p-3.5 flex justify-between items-center gap-4 cursor-pointer hover:bg-zinc-100 dark:hover:bg-zinc-900/30 select-none"
                            >
                              <div className="space-y-1 truncate">
                                <h4 className="font-sans font-bold text-xs text-zinc-850 dark:text-zinc-200 truncate">{chunk.documentName}</h4>
                                <div className="flex items-center gap-2 text-[10px] text-zinc-400 dark:text-zinc-500 font-sans font-semibold">
                                  <span>Page {chunk.page || 1}</span>
                                  <span>•</span>
                                  <span className="text-blue-500 dark:text-cyan-400">Anchor: {chunk.year || 'None'}</span>
                                </div>
                              </div>

                              <div className="flex items-center gap-2 shrink-0">
                                <span className="text-[10px] font-mono font-bold text-emerald-600 dark:text-emerald-400">
                                  {(chunk.score * 100).toFixed(0)}% Match
                                </span>
                                {isExpanded ? (
                                  <ChevronUp className="w-4 h-4 text-zinc-400" />
                                ) : (
                                  <ChevronDown className="w-4 h-4 text-zinc-400" />
                                )}
                              </div>
                            </div>

                            {isExpanded && (
                              <div className="p-4 bg-white dark:bg-zinc-900 border-t border-zinc-200 dark:border-zinc-900 text-[11px] text-zinc-650 dark:text-zinc-400 leading-relaxed font-sans whitespace-pre-line border-l-2 border-l-blue-500">
                                <span className="text-[9px] font-bold uppercase text-zinc-400 block mb-2 tracking-wider">Raw Segment Assertion</span>
                                "{chunk.content}"
                              </div>
                            )}
                          </div>
                        );
                      })}
                    </div>
                  </div>

                  {/* Inline Conflict Alerts summary footer */}
                  {activeResult.evidence && activeResult.evidence.length > 0 && (
                    <div className="pt-4 border-t border-zinc-150 dark:border-zinc-900 space-y-2 mt-4">
                      <div className="flex items-center gap-1.5 text-red-600 dark:text-red-400 font-bold uppercase text-[9px] tracking-wider">
                        <ShieldAlert className="w-4 h-4" />
                        <span>ISOLATED DOCUMENT CONFLICTS ({activeResult.evidence.length})</span>
                      </div>
                      <div className="space-y-1 max-h-[80px] overflow-y-auto pr-1">
                        {activeResult.evidence.map((ev, i) => (
                          <div key={i} className="text-[10px] text-zinc-500 dark:text-zinc-400 font-medium leading-relaxed truncate">
                            • {ev.type === 'contradiction' ? 'Contradiction' : 'Alignment'} detected between {ev.sourceA} and {ev.sourceB}
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                </div>

              </div>

            </div>
          )}

          {/* Recent Queries sidebar / history drawer */}
          {queryHistory.length > 1 && (
            <div className="border-t border-zinc-150 dark:border-zinc-900 pt-5 space-y-3 shrink-0">
              <span className="block text-[10px] font-black text-zinc-400 dark:text-zinc-500 uppercase tracking-widest">Recent inquiries history</span>
              <div className="flex gap-3 overflow-x-auto pb-1 max-w-full">
                {queryHistory.slice(1, 6).map((hist, idx) => (
                  <button
                    key={idx}
                    onClick={() => setSelectedResult(hist)}
                    className="p-3 rounded-xl border border-zinc-200 dark:border-zinc-850 bg-white dark:bg-zinc-950/50 hover:border-zinc-350 dark:hover:border-zinc-800 text-left text-[11px] font-sans font-semibold text-zinc-600 dark:text-zinc-400 truncate max-w-[200px] shrink-0 transition-all cursor-pointer"
                    title={hist.query}
                  >
                    "{hist.query}"
                  </button>
                ))}
              </div>
            </div>
          )}

        </div>
      )}

    </div>
  );
}
