/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { 
  Calendar, 
  BookOpen, 
  ChevronDown, 
  ChevronUp,
  SlidersHorizontal,
  Clock
} from 'lucide-react';
import { IndexedDocument } from '../types';

interface TimelineViewProps {
  documents: IndexedDocument[];
  queryHistory: any[];
}

export default function TimelineView({ documents, queryHistory }: TimelineViewProps) {
  const [expandedId, setExpandedId] = useState<string | null>(null);
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('asc');

  // Extract timeline events chronologically
  const latestResult = queryHistory[0] || null;
  const rawEvents = latestResult ? latestResult.retrievedChunks.filter((c: any) => c.year !== null) : [];

  // Sort events based on selected order
  const events = [...rawEvents].sort((a: any, b: any) => {
    const yearA = a.year || 0;
    const yearB = b.year || 0;
    return sortOrder === 'asc' ? yearA - yearB : yearB - yearA;
  });

  return (
    <div className="space-y-8 p-6 lg:p-10 max-w-7xl mx-auto selection:bg-cyan-500/30">
      
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 border-b border-zinc-200 dark:border-zinc-800 pb-5">
        <div>
          <h1 className="font-sans font-extrabold text-2xl sm:text-3xl text-zinc-900 dark:text-zinc-100 tracking-tight">
            Chronology Timeline
          </h1>
          <p className="font-sans text-sm text-zinc-500 dark:text-zinc-400 mt-1">
            Map factual assertions chronologically over mapped periods. Resolve status evolution and track state changes over time.
          </p>
        </div>
        
        <div className="flex items-center gap-2 text-xs font-semibold">
          <SlidersHorizontal className="w-4 h-4 text-zinc-400" />
          <select 
            value={sortOrder}
            onChange={(e) => setSortOrder(e.target.value as 'asc' | 'desc')}
            className="bg-zinc-50 dark:bg-zinc-950 border border-zinc-200 dark:border-zinc-850 rounded-xl px-3 py-1.5 text-xs text-zinc-600 dark:text-zinc-400 font-sans font-bold uppercase focus:outline-none focus:border-blue-500 dark:focus:border-cyan-400"
          >
            <option value="asc">Ascending (Oldest First)</option>
            <option value="desc">Descending (Newest First)</option>
          </select>
        </div>
      </div>

      {latestResult ? (
        <div className="space-y-8">
          
          {/* Query contextual card */}
          <div className="p-5 rounded-2xl border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900/30 font-sans text-sm text-zinc-700 dark:text-zinc-300 shadow-sm">
            <span className="font-sans text-xs font-bold text-zinc-400 dark:text-zinc-500 block uppercase tracking-wider mb-1">
              Active Timeline Query
            </span>
            <p className="font-semibold text-zinc-800 dark:text-zinc-100">
              "{latestResult.query}"
            </p>
          </div>

          {events.length > 0 ? (
            <div className="relative border-l border-zinc-200 dark:border-zinc-850 pl-6 ml-4 space-y-8">
              {events.map((evt: any) => {
                const isExpanded = expandedId === evt.id;
                return (
                  <div key={evt.id} className="relative group">
                    
                    {/* Circle timeline bullet */}
                    <div className="absolute -left-[31px] top-1.5 w-2.5 h-2.5 rounded-full border-2 border-blue-600 dark:border-cyan-400 bg-white dark:bg-zinc-950 group-hover:bg-blue-600 dark:group-hover:bg-cyan-400 transition-all z-10" />

                    <div className="border border-zinc-200 dark:border-zinc-850 bg-white dark:bg-zinc-900/30 rounded-2xl hover:border-zinc-300 dark:hover:border-zinc-800 transition-all overflow-hidden shadow-sm dark:shadow-none">
                      {/* Clickable Header */}
                      <div 
                        onClick={() => setExpandedId(isExpanded ? null : evt.id)}
                        className="p-5 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 cursor-pointer select-none"
                      >
                        <div className="space-y-2">
                          <div className="flex flex-wrap items-center gap-3">
                            <span className="font-mono text-xs font-bold text-blue-600 dark:text-cyan-400 px-2.5 py-1 rounded-full bg-blue-50 dark:bg-cyan-500/10 border border-blue-100 dark:border-cyan-500/20">
                              Year {evt.year}
                            </span>
                            <span className="font-sans text-xs text-zinc-400 dark:text-zinc-500 font-semibold uppercase flex items-center gap-1.5">
                              <BookOpen className="w-3.5 h-3.5" />
                              {evt.documentName}
                            </span>
                          </div>
                          <p className="font-sans text-xs sm:text-sm text-zinc-800 dark:text-zinc-200 font-semibold leading-relaxed mt-1">
                            {evt.content.substring(0, 110)}...
                          </p>
                        </div>

                        <div className="flex items-center gap-3 shrink-0 self-end sm:self-auto text-xs text-zinc-400 dark:text-zinc-500 font-semibold">
                          <span>Page {evt.page || 1}</span>
                          {isExpanded ? (
                            <ChevronUp className="w-4 h-4 text-zinc-400" />
                          ) : (
                            <ChevronDown className="w-4 h-4 text-zinc-400" />
                          )}
                        </div>
                      </div>

                      {/* Expandable original chunk */}
                      {isExpanded && (
                        <div className="p-5 bg-zinc-50/50 dark:bg-zinc-950 border-t border-zinc-150 dark:border-zinc-900 text-xs text-zinc-600 dark:text-zinc-400 leading-relaxed font-sans whitespace-pre-line">
                          <div className="font-sans text-[10px] font-bold text-zinc-400 dark:text-zinc-500 uppercase tracking-wider mb-2.5">
                            Raw Source Paragraph Text
                          </div>
                          {evt.content}
                        </div>
                      )}
                    </div>

                  </div>
                );
              })}
            </div>
          ) : (
            <div className="border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900/30 p-12 rounded-2xl flex flex-col items-center justify-center text-center space-y-4">
              <div className="w-12 h-12 rounded-xl border border-zinc-200 dark:border-zinc-800 bg-zinc-50 dark:bg-zinc-950 flex items-center justify-center text-zinc-400">
                <Clock className="w-5 h-5 text-zinc-500" />
              </div>
              <div className="space-y-2">
                <h4 className="font-sans font-bold text-sm text-zinc-800 dark:text-zinc-200 uppercase tracking-wider">No Chronological Nodes Matches</h4>
                <p className="font-sans text-xs text-zinc-400 dark:text-zinc-500 max-w-sm mx-auto leading-relaxed">
                  None of the matching source passages extracted for this query contains parsed year markers (e.g. 19xx, 20xx) to map.
                </p>
              </div>
            </div>
          )}
        </div>
      ) : (
        <div className="border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900/30 p-16 rounded-2xl flex flex-col items-center justify-center text-center space-y-4 min-h-[460px]">
          <div className="w-12 h-12 rounded-xl border border-zinc-200 dark:border-zinc-800 bg-zinc-50 dark:bg-zinc-950 flex items-center justify-center text-zinc-400">
            <Calendar className="w-5 h-5 text-zinc-500" />
          </div>
          <div className="space-y-2">
            <h4 className="font-sans font-bold text-sm text-zinc-800 dark:text-zinc-200 uppercase tracking-wider">Chronology View Inactive</h4>
            <p className="font-sans text-xs text-zinc-400 dark:text-zinc-500 max-w-sm mx-auto leading-relaxed">
              Please run an inquiry in the Query Analysis Console. The system will index temporal references across retrieved files and compile an interactive chronology.
            </p>
          </div>
        </div>
      )}
    </div>
  );
}
