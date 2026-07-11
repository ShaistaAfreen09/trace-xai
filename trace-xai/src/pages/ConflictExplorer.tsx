/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { 
  ShieldAlert, 
  CheckCircle, 
  GitCompare, 
  ChevronDown, 
  ChevronUp,
  AlertTriangle,
  ArrowRight,
  BookOpen
} from 'lucide-react';
import { QueryAnalysisResult } from '../types';

interface ConflictExplorerProps {
  queryHistory: QueryAnalysisResult[];
}

export default function ConflictExplorer({ queryHistory }: ConflictExplorerProps) {
  const latestResult = queryHistory[0] || null;
  const [expandedId, setExpandedId] = useState<string | null>(null);

  const conflicts = latestResult ? latestResult.evidence : [];

  const getStatusStyle = (type: 'agreement' | 'contradiction' | 'neutral') => {
    switch (type) {
      case 'contradiction':
        return {
          badge: 'bg-red-50 dark:bg-red-500/10 text-red-600 dark:text-red-400 border border-red-100 dark:border-red-500/25',
          text: 'text-red-600 dark:text-red-400',
          border: 'border-red-200 dark:border-red-900/30 bg-red-50/10 dark:bg-red-950/5',
          headerBg: 'bg-red-50/20 dark:bg-red-950/10',
          scoreText: 'text-red-600 dark:text-red-400'
        };
      case 'agreement':
        return {
          badge: 'bg-emerald-50 dark:bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-100 dark:border-emerald-500/25',
          text: 'text-emerald-600 dark:text-emerald-400',
          border: 'border-emerald-200 dark:border-emerald-900/30 bg-emerald-50/10 dark:bg-emerald-950/5',
          headerBg: 'bg-emerald-50/20 dark:bg-emerald-950/10',
          scoreText: 'text-emerald-600 dark:text-emerald-400'
        };
      default:
        return {
          badge: 'bg-zinc-100 dark:bg-zinc-800 text-zinc-600 dark:text-zinc-400 border border-zinc-200 dark:border-zinc-700',
          text: 'text-zinc-600 dark:text-zinc-400',
          border: 'border-zinc-200 dark:border-zinc-800 bg-zinc-50/30 dark:bg-zinc-900/5',
          headerBg: 'bg-zinc-100/10 dark:bg-zinc-900/10',
          scoreText: 'text-zinc-500 dark:text-zinc-400'
        };
    }
  };

  return (
    <div className="space-y-8 p-6 lg:p-10 max-w-7xl mx-auto selection:bg-cyan-500/30">
      
      {/* Page header */}
      <div className="border-b border-zinc-200 dark:border-zinc-800 pb-5">
        <h1 className="font-sans font-extrabold text-2xl sm:text-3xl text-zinc-900 dark:text-zinc-100 tracking-tight">
          Conflict Explorer
        </h1>
        <p className="font-sans text-sm text-zinc-500 dark:text-zinc-400 mt-1">
          Chronologically compare cross-source factual statements, score claim contradictions, and audit logical discrepancies.
        </p>
      </div>

      {latestResult ? (
        <div className="space-y-6">
          
          {/* Query Context Card */}
          <div className="p-5 rounded-2xl border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900/30 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 shadow-sm dark:shadow-none">
            <div className="space-y-1">
              <span className="font-sans text-xs font-bold text-zinc-400 dark:text-zinc-500 uppercase tracking-wider">Active Workspace Query</span>
              <p className="font-sans text-sm text-zinc-800 dark:text-zinc-200 font-semibold leading-relaxed">
                "{latestResult.query}"
              </p>
            </div>
            
            <div className="shrink-0 text-left sm:text-right">
              <span className="font-sans text-xs font-bold text-zinc-400 dark:text-zinc-500 uppercase tracking-wider block">Integrity State</span>
              <span className="font-sans text-xs font-bold text-zinc-800 dark:text-zinc-200 mt-1 block">
                {conflicts.filter(c => c.type === 'contradiction').length} Contradictions / {conflicts.length} Total Assessed
              </span>
            </div>
          </div>

          {/* Conflict lists */}
          {conflicts.length > 0 ? (
            <div className="space-y-4">
              {conflicts.map((conflict) => {
                const style = getStatusStyle(conflict.type);
                const isExpanded = expandedId === conflict.id;

                return (
                  <div 
                    key={conflict.id} 
                    className={`border ${style.border} rounded-2xl transition-all overflow-hidden bg-white dark:bg-zinc-900/20`}
                  >
                    {/* Header bar click to open */}
                    <div 
                      onClick={() => setExpandedId(isExpanded ? null : conflict.id)}
                      className={`p-5 flex flex-col md:flex-row md:items-center justify-between gap-4 cursor-pointer select-none hover:bg-zinc-50/50 dark:hover:bg-zinc-900/30 transition-colors ${style.headerBg}`}
                    >
                      <div className="space-y-2 flex-1 min-w-0">
                        <div className="flex flex-wrap items-center gap-3">
                          <span className={`px-2.5 py-0.5 rounded-full text-[9px] font-bold uppercase tracking-wider border ${style.badge}`}>
                            {conflict.type}
                          </span>
                          <span className="font-sans text-xs font-semibold text-zinc-500 dark:text-zinc-400">
                            Confidence Level: <b className={`${style.scoreText}`}>{conflict.contradictionScore}%</b>
                          </span>
                        </div>
                        <p className="font-sans font-bold text-sm text-zinc-800 dark:text-zinc-100 truncate pr-4">
                          Claim difference detected: "{conflict.claimA}" and "{conflict.claimB}"
                        </p>
                      </div>

                      <div className="flex items-center gap-6 shrink-0 justify-between md:justify-end">
                        <div className="text-left md:text-right">
                          <span className="font-sans text-[10px] text-zinc-400 dark:text-zinc-500 font-bold uppercase tracking-wider block">Timeline Windows</span>
                          <span className="font-sans text-xs font-bold text-zinc-700 dark:text-zinc-300">
                            {conflict.yearA || 'N/A'} ↔ {conflict.yearB || 'N/A'}
                          </span>
                        </div>
                        {isExpanded ? (
                          <ChevronUp className="w-4 h-4 text-zinc-400" />
                        ) : (
                          <ChevronDown className="w-4 h-4 text-zinc-400" />
                        )}
                      </div>
                    </div>

                    {/* Expandable contents */}
                    {isExpanded && (
                      <div className="p-6 bg-white dark:bg-zinc-950 border-t border-zinc-150 dark:border-zinc-900 space-y-6">
                        
                        {/* Comparison Blocks */}
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 relative">
                          <div className="absolute inset-y-0 left-1/2 w-[1px] bg-zinc-150 dark:bg-zinc-900 hidden md:block" />
                          
                          {/* Source Alpha */}
                          <div className="space-y-3">
                            <div className="flex justify-between items-center text-[10px] font-bold uppercase tracking-widest text-zinc-400 dark:text-zinc-500">
                              <span>Source Alpha</span>
                              <span className="text-blue-600 dark:text-cyan-400 font-mono font-bold">{conflict.yearA ? `Year ${conflict.yearA}` : 'N/A'}</span>
                            </div>
                            <h5 className="font-sans font-extrabold text-xs text-zinc-800 dark:text-zinc-200 flex items-center gap-1.5 truncate" title={conflict.sourceA}>
                              <BookOpen className="w-3.5 h-3.5 shrink-0 text-zinc-400" />
                              <span className="truncate">{conflict.sourceA}</span>
                            </h5>
                            <p className="text-xs text-zinc-600 dark:text-zinc-400 font-sans leading-relaxed p-4 rounded-xl border border-zinc-200 dark:border-zinc-900 bg-zinc-50/50 dark:bg-zinc-900/10 italic">
                              "{conflict.claimA}"
                            </p>
                          </div>

                          {/* Source Beta */}
                          <div className="space-y-3">
                            <div className="flex justify-between items-center text-[10px] font-bold uppercase tracking-widest text-zinc-400 dark:text-zinc-500">
                              <span>Source Beta</span>
                              <span className="text-blue-600 dark:text-cyan-400 font-mono font-bold">{conflict.yearB ? `Year ${conflict.yearB}` : 'N/A'}</span>
                            </div>
                            <h5 className="font-sans font-extrabold text-xs text-zinc-800 dark:text-zinc-200 flex items-center gap-1.5 truncate" title={conflict.sourceB}>
                              <BookOpen className="w-3.5 h-3.5 shrink-0 text-zinc-400" />
                              <span className="truncate">{conflict.sourceB}</span>
                            </h5>
                            <p className="text-xs text-zinc-600 dark:text-zinc-400 font-sans leading-relaxed p-4 rounded-xl border border-zinc-200 dark:border-zinc-900 bg-zinc-50/50 dark:bg-zinc-900/10 italic">
                              "{conflict.claimB}"
                            </p>
                          </div>
                        </div>

                        {/* Analysis Explanation */}
                        <div className="p-4 rounded-xl border border-zinc-200 dark:border-zinc-900 bg-zinc-50/40 dark:bg-zinc-900/40 space-y-2">
                          <div className="flex items-center gap-2 text-[10px] font-bold uppercase tracking-wider text-zinc-500">
                            <GitCompare className="w-4 h-4 text-blue-600 dark:text-cyan-400" />
                            <span>COGNITIVE CONFLICT DISCREPANCY ANALYSIS</span>
                          </div>
                          <p className="font-sans text-xs text-zinc-600 dark:text-zinc-300 leading-relaxed font-medium">
                            {conflict.explanation}
                          </p>
                        </div>

                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          ) : (
            <div className="border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900/30 p-12 rounded-2xl flex flex-col items-center justify-center text-center space-y-4">
              <div className="w-12 h-12 rounded-xl border border-zinc-200 dark:border-zinc-800 bg-zinc-50 dark:bg-zinc-950 flex items-center justify-center text-zinc-400">
                <CheckCircle className="w-5 h-5 text-emerald-500" />
              </div>
              <div className="space-y-2">
                <h4 className="font-sans font-bold text-sm text-zinc-800 dark:text-zinc-200 uppercase tracking-wider">No Discrepancies Captured</h4>
                <p className="font-sans text-xs text-zinc-400 dark:text-zinc-500 max-w-sm mx-auto leading-relaxed">
                  The active query returned full structural consensus. Factual contradictions or chronology differences were not extracted.
                </p>
              </div>
            </div>
          )}
        </div>
      ) : (
        <div className="border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900/30 p-16 rounded-2xl flex flex-col items-center justify-center text-center space-y-4 min-h-[460px]">
          <div className="w-12 h-12 rounded-xl border border-zinc-200 dark:border-zinc-800 bg-zinc-50 dark:bg-zinc-950 flex items-center justify-center text-zinc-400">
            <ShieldAlert className="w-5 h-5 text-zinc-400" />
          </div>
          <div className="space-y-2">
            <h4 className="font-sans font-bold text-sm text-zinc-800 dark:text-zinc-200 uppercase tracking-wider">Conflict Explorer Inactive</h4>
            <p className="font-sans text-xs text-zinc-400 dark:text-zinc-500 max-w-sm mx-auto leading-relaxed">
              Please execute an inquiry in the Query Analysis Console first. Contradictory statements or divergent years identified in matching source materials will be highlighted here.
            </p>
          </div>
        </div>
      )}
    </div>
  );
}
