/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';
import { 
  FileText, 
  HelpCircle, 
  ShieldAlert, 
  CalendarRange, 
  ArrowUpRight, 
  CheckCircle2, 
  Clock, 
  Database, 
  Sparkles,
  TrendingUp,
  ChevronRight,
  Workflow
} from 'lucide-react';
import { IndexedDocument, QueryAnalysisResult, ActivityLog, SystemStatus } from '../types';

interface DashboardProps {
  documents: IndexedDocument[];
  queryHistory: QueryAnalysisResult[];
  activityLogs: ActivityLog[];
  systemStatus: SystemStatus | null;
  onNavigate: (tab: string) => void;
}

export default function Dashboard({ 
  documents, 
  queryHistory, 
  activityLogs, 
  systemStatus, 
  onNavigate 
}: DashboardProps) {
  const latestResult = queryHistory[0] || null;

  // Real backend calculations
  const docCount = documents.length;
  const queriesCount = queryHistory.length;
  const contradictionsCount = queryHistory.reduce((acc, curr) => 
    acc + (curr.evidence?.filter(e => e.type === 'contradiction').length || 0), 0
  );
  const timelineEventsCount = documents.filter(d => d.extractedYear !== null).length;

  return (
    <div className="space-y-8 p-6 lg:p-10 max-w-7xl mx-auto selection:bg-cyan-500/30">
      
      {/* Title block */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="font-sans font-extrabold text-2xl sm:text-3xl text-zinc-900 dark:text-zinc-100 tracking-tight">
            Workspace Overview
          </h1>
          <p className="font-sans text-sm text-zinc-500 dark:text-zinc-400 mt-1">
            Real-time status monitoring, document health index, and fact checking analytics.
          </p>
        </div>
        <div className="flex items-center gap-2 px-3 py-1.5 rounded-lg border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900/40 text-xs font-sans font-semibold text-zinc-600 dark:text-zinc-400">
          <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
          <span>System Active</span>
        </div>
      </div>

      {/* Analytics Cards Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        
        {/* Documents Indexed */}
        <div 
          onClick={() => onNavigate('repository')}
          className="group relative border border-zinc-200 dark:border-zinc-800/80 bg-white dark:bg-zinc-900/50 hover:border-blue-500 dark:hover:border-cyan-400 p-6 rounded-2xl transition-all duration-300 cursor-pointer shadow-sm dark:shadow-none hover:shadow-md hover:shadow-zinc-200/50 dark:hover:shadow-none flex flex-col justify-between h-36"
        >
          <div className="flex items-center justify-between">
            <span className="font-sans text-xs font-bold tracking-wider text-zinc-400 dark:text-zinc-500 uppercase">Documents Indexed</span>
            <div className="w-8 h-8 rounded-lg bg-zinc-50 dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-850 flex items-center justify-center text-zinc-400 group-hover:text-blue-500 dark:group-hover:text-cyan-400 transition-colors">
              <FileText className="w-4 h-4" />
            </div>
          </div>
          <div>
            <div className="flex items-baseline gap-2">
              <span className="text-3.5xl font-extrabold font-sans tracking-tight text-zinc-900 dark:text-zinc-100">{docCount}</span>
              <span className="text-xs text-zinc-400 dark:text-zinc-500 font-medium">sources</span>
            </div>
            <p className="text-[10px] text-zinc-400 dark:text-zinc-500 mt-1 flex items-center gap-1 group-hover:text-zinc-600 dark:group-hover:text-zinc-300 transition-colors">
              <span>Manage files</span>
              <ChevronRight className="w-3 h-3" />
            </p>
          </div>
        </div>

        {/* Queries Executed */}
        <div 
          onClick={() => onNavigate('query')}
          className="group relative border border-zinc-200 dark:border-zinc-800/80 bg-white dark:bg-zinc-900/50 hover:border-blue-500 dark:hover:border-cyan-400 p-6 rounded-2xl transition-all duration-300 cursor-pointer shadow-sm dark:shadow-none hover:shadow-md hover:shadow-zinc-200/50 dark:hover:shadow-none flex flex-col justify-between h-36"
        >
          <div className="flex items-center justify-between">
            <span className="font-sans text-xs font-bold tracking-wider text-zinc-400 dark:text-zinc-500 uppercase">Queries Evaluated</span>
            <div className="w-8 h-8 rounded-lg bg-zinc-50 dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-850 flex items-center justify-center text-zinc-400 group-hover:text-blue-500 dark:group-hover:text-cyan-400 transition-colors">
              <HelpCircle className="w-4 h-4" />
            </div>
          </div>
          <div>
            <div className="flex items-baseline gap-2">
              <span className="text-3.5xl font-extrabold font-sans tracking-tight text-zinc-900 dark:text-zinc-100">{queriesCount}</span>
              <span className="text-xs text-zinc-400 dark:text-zinc-500 font-medium">runs</span>
            </div>
            <p className="text-[10px] text-zinc-400 dark:text-zinc-500 mt-1 flex items-center gap-1 group-hover:text-zinc-600 dark:group-hover:text-zinc-300 transition-colors">
              <span>Execute inquiry</span>
              <ChevronRight className="w-3 h-3" />
            </p>
          </div>
        </div>

        {/* Conflicts Isolated */}
        <div 
          onClick={() => onNavigate('explorer')}
          className="group relative border border-zinc-200 dark:border-zinc-800/80 bg-white dark:bg-zinc-900/50 hover:border-red-500 p-6 rounded-2xl transition-all duration-300 cursor-pointer shadow-sm dark:shadow-none hover:shadow-md hover:shadow-zinc-200/50 dark:hover:shadow-none flex flex-col justify-between h-36"
        >
          <div className="flex items-center justify-between">
            <span className="font-sans text-xs font-bold tracking-wider text-zinc-400 dark:text-zinc-500 uppercase">Conflicts Isolated</span>
            <div className="w-8 h-8 rounded-lg bg-zinc-50 dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-850 flex items-center justify-center text-zinc-400 group-hover:text-red-500 transition-colors">
              <ShieldAlert className="w-4 h-4 text-red-500" />
            </div>
          </div>
          <div>
            <div className="flex items-baseline gap-2">
              <span className="text-3.5xl font-extrabold font-sans tracking-tight text-red-600 dark:text-red-400">{contradictionsCount}</span>
              <span className="text-xs text-zinc-400 dark:text-zinc-500 font-medium">contradictions</span>
            </div>
            <p className="text-[10px] text-zinc-400 dark:text-zinc-500 mt-1 flex items-center gap-1 group-hover:text-zinc-600 dark:group-hover:text-zinc-300 transition-colors">
              <span>Review discrepancies</span>
              <ChevronRight className="w-3 h-3" />
            </p>
          </div>
        </div>

        {/* Timeline Anchors */}
        <div 
          onClick={() => onNavigate('timeline')}
          className="group relative border border-zinc-200 dark:border-zinc-800/80 bg-white dark:bg-zinc-900/50 hover:border-blue-500 dark:hover:border-cyan-400 p-6 rounded-2xl transition-all duration-300 cursor-pointer shadow-sm dark:shadow-none hover:shadow-md hover:shadow-zinc-200/50 dark:hover:shadow-none flex flex-col justify-between h-36"
        >
          <div className="flex items-center justify-between">
            <span className="font-sans text-xs font-bold tracking-wider text-zinc-400 dark:text-zinc-500 uppercase">Timeline Anchors</span>
            <div className="w-8 h-8 rounded-lg bg-zinc-50 dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-850 flex items-center justify-center text-zinc-400 group-hover:text-blue-500 dark:group-hover:text-cyan-400 transition-colors">
              <CalendarRange className="w-4 h-4" />
            </div>
          </div>
          <div>
            <div className="flex items-baseline gap-2">
              <span className="text-3.5xl font-extrabold font-sans tracking-tight text-zinc-900 dark:text-zinc-100">{timelineEventsCount}</span>
              <span className="text-xs text-zinc-400 dark:text-zinc-500 font-medium">years mapped</span>
            </div>
            <p className="text-[10px] text-zinc-400 dark:text-zinc-500 mt-1 flex items-center gap-1 group-hover:text-zinc-600 dark:group-hover:text-zinc-300 transition-colors">
              <span>Navigate chronology</span>
              <ChevronRight className="w-3 h-3" />
            </p>
          </div>
        </div>

      </div>

      {/* Main Panels Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        
        {/* Left Columns (8 cols): Latest Analysis & Sub-Tables */}
        <div className="lg:col-span-8 space-y-8">
          
          {/* Latest Analysis Panel */}
          <div className="border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900/30 p-6 sm:p-8 rounded-2xl shadow-sm dark:shadow-none space-y-6">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between border-b border-zinc-100 dark:border-zinc-800 pb-4 gap-2">
              <div className="flex items-center gap-2">
                <Sparkles className="w-4 h-4 text-blue-600 dark:text-cyan-400" />
                <span className="font-sans text-xs font-extrabold tracking-widest text-zinc-500 uppercase">LATEST INQUIRY REPORT</span>
              </div>
              {latestResult && (
                <div className="flex items-center gap-4 text-[11px] font-medium text-zinc-400">
                  <span>Confidence: <b className="text-emerald-600 dark:text-emerald-400">{latestResult.confidence}%</b></span>
                  <span>•</span>
                  <span>Latency: <b className="text-zinc-700 dark:text-zinc-300 font-mono">{latestResult.processingTimeMs}ms</b></span>
                </div>
              )}
            </div>

            {latestResult ? (
              <div className="space-y-6">
                <div>
                  <h3 className="text-xs font-bold text-zinc-400 uppercase tracking-wider">USER QUERY</h3>
                  <p className="text-zinc-900 dark:text-zinc-100 text-base font-semibold mt-1.5 leading-relaxed">
                    "{latestResult.query}"
                  </p>
                </div>
                <div>
                  <h3 className="text-xs font-bold text-zinc-400 uppercase tracking-wider">EXPLAINABLE SYNTHESIS</h3>
                  <p className="text-zinc-700 dark:text-zinc-300 text-sm leading-relaxed mt-2 whitespace-pre-line font-sans">
                    {latestResult.answer}
                  </p>
                </div>

                {latestResult.sourceReferences.length > 0 && (
                  <div className="pt-2">
                    <h3 className="text-xs font-bold text-zinc-400 uppercase tracking-wider mb-2.5">RESOLVED CITATIONS</h3>
                    <div className="flex flex-wrap gap-2.5">
                      {latestResult.sourceReferences.map((ref, i) => (
                        <div 
                          key={i} 
                          className="px-3 py-1.5 rounded-xl bg-zinc-50 dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-850 text-xs font-sans text-zinc-600 dark:text-zinc-400 flex items-center gap-2"
                        >
                          <span className="w-1.5 h-1.5 rounded-full bg-blue-500 dark:bg-cyan-400" />
                          <span>{ref.name} {ref.year ? `(${ref.year})` : ''}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            ) : (
              <div className="py-12 text-center space-y-4">
                <p className="text-zinc-400 dark:text-zinc-500 font-sans text-sm">
                  No query analysis performed yet. Ingest your source material and execute an inquiry.
                </p>
                <button 
                  onClick={() => onNavigate('query')}
                  className="px-5 py-2.5 rounded-xl bg-zinc-900 hover:bg-zinc-800 text-white font-sans text-xs font-bold shadow-sm transition-all flex items-center gap-2 mx-auto"
                >
                  <span>Open Query Workspace</span>
                  <ArrowUpRight className="w-4 h-4" />
                </button>
              </div>
            )}
          </div>

          {/* Sub tables / lists */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            
            {/* Recent Documents Ingested */}
            <div className="border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900/30 p-6 rounded-2xl shadow-sm dark:shadow-none space-y-4">
              <div className="flex justify-between items-center border-b border-zinc-100 dark:border-zinc-800 pb-3">
                <span className="font-sans text-xs font-bold text-zinc-500 uppercase tracking-wider">RECENT DOCUMENTS</span>
                <span 
                  onClick={() => onNavigate('repository')}
                  className="text-xs font-sans text-blue-600 dark:text-cyan-400 font-semibold hover:underline flex items-center gap-1 cursor-pointer"
                >
                  <span>Manage</span>
                  <ArrowUpRight className="w-3.5 h-3.5" />
                </span>
              </div>
              
              {documents.length > 0 ? (
                <div className="space-y-3">
                  {documents.slice(0, 4).map((doc) => (
                    <div key={doc.id} className="flex justify-between items-center text-xs p-3 rounded-xl bg-zinc-50 dark:bg-zinc-900/40 border border-zinc-200 dark:border-zinc-850 hover:bg-zinc-100 dark:hover:bg-zinc-900 transition-all">
                      <div className="truncate max-w-[150px] font-sans font-semibold text-zinc-800 dark:text-zinc-200" title={doc.name}>
                        {doc.name}
                      </div>
                      <div className="flex items-center gap-2 text-[10px]">
                        <span className="text-zinc-400 dark:text-zinc-500 font-mono font-bold">{doc.extractedYear || 'N/A'}</span>
                        <span className={`px-2 py-0.5 rounded-full text-[9px] font-bold uppercase tracking-wider ${
                          doc.status === 'indexed' 
                            ? 'bg-emerald-50 dark:bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-100 dark:border-emerald-500/20' 
                            : 'bg-amber-50 dark:bg-amber-500/10 text-amber-600 dark:text-amber-400 border border-amber-100 dark:border-amber-500/20'
                        }`}>
                          {doc.status}
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="py-10 text-center text-zinc-400 dark:text-zinc-500 font-sans text-xs">
                  No documents in repository.
                </div>
              )}
            </div>

            {/* Past Queries */}
            <div className="border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900/30 p-6 rounded-2xl shadow-sm dark:shadow-none space-y-4">
              <div className="flex justify-between items-center border-b border-zinc-100 dark:border-zinc-800 pb-3">
                <span className="font-sans text-xs font-bold text-zinc-500 uppercase tracking-wider">INQUIRY HISTORY</span>
                <span 
                  onClick={() => onNavigate('query')}
                  className="text-xs font-sans text-blue-600 dark:text-cyan-400 font-semibold hover:underline flex items-center gap-1 cursor-pointer"
                >
                  <span>Query</span>
                  <ArrowUpRight className="w-3.5 h-3.5" />
                </span>
              </div>
              
              {queryHistory.length > 0 ? (
                <div className="space-y-3">
                  {queryHistory.slice(0, 4).map((q) => (
                    <div key={q.id} className="flex justify-between items-center text-xs p-3 rounded-xl bg-zinc-50 dark:bg-zinc-900/40 border border-zinc-200 dark:border-zinc-850 hover:bg-zinc-100 dark:hover:bg-zinc-900 transition-all">
                      <div className="truncate max-w-[170px] font-sans font-medium text-zinc-700 dark:text-zinc-300">
                        {q.query}
                      </div>
                      <span className="font-sans text-[11px] font-semibold text-zinc-400 shrink-0">
                        {q.confidence}% confidence
                      </span>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="py-10 text-center text-zinc-400 dark:text-zinc-500 font-sans text-xs">
                  No inquiries executed.
                </div>
              )}
            </div>

          </div>
        </div>

        {/* Right Side Column (4 cols): Active Audit Trail */}
        <div className="lg:col-span-4">
          <div className="border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900/30 p-6 rounded-2xl shadow-sm dark:shadow-none space-y-4 flex flex-col justify-between h-full min-h-[500px]">
            <div className="space-y-4">
              <div className="flex items-center justify-between border-b border-zinc-100 dark:border-zinc-800 pb-3.5">
                <span className="font-sans text-xs font-bold text-zinc-500 uppercase tracking-wider">PIPELINE AUDIT TRAIL</span>
                <span className="flex h-2 w-2 relative">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-cyan-400 opacity-75" />
                  <span className="relative inline-flex rounded-full h-2 w-2 bg-cyan-500" />
                </span>
              </div>

              <div className="space-y-4 max-h-[380px] overflow-y-auto pr-1">
                {activityLogs.length > 0 ? (
                  activityLogs.map((log) => (
                    <div key={log.id} className="text-xs space-y-1 bg-zinc-50 dark:bg-zinc-950 p-3 rounded-xl border border-zinc-100 dark:border-zinc-900">
                      <div className="flex justify-between text-[10px] text-zinc-400 font-medium">
                        <span className="flex items-center gap-1">
                          <Clock className="w-3 h-3" />
                          <span className="font-mono">{new Date(log.timestamp).toLocaleTimeString()}</span>
                        </span>
                        <span className="uppercase text-blue-600 dark:text-cyan-400 font-bold text-[9px] tracking-wider">{log.type}</span>
                      </div>
                      <p className="text-zinc-700 dark:text-zinc-300 font-sans leading-relaxed text-xs">{log.message}</p>
                      <div className="flex justify-between text-[9px] text-zinc-400 pt-1.5 border-t border-zinc-100 dark:border-zinc-900">
                        <span>Operator: {log.user}</span>
                      </div>
                    </div>
                  ))
                ) : (
                  <div className="py-12 text-center text-zinc-400 dark:text-zinc-500 font-sans text-xs">
                    Audit trail is currently quiet.
                  </div>
                )}
              </div>
            </div>

            <div className="pt-4 border-t border-zinc-100 dark:border-zinc-900 flex justify-between items-center text-[10px] font-sans text-zinc-400 dark:text-zinc-500 font-semibold uppercase">
              <span>RAG PIPELINE ENVIRONMENT</span>
              <span className="text-blue-600 dark:text-cyan-400 flex items-center gap-1.5">
                <Database className="w-3.5 h-3.5" />
                SECURE INSTANCE
              </span>
            </div>
          </div>
        </div>
        
      </div>
    </div>
  );
}
