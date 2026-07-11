/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { 
  Database, 
  Cpu, 
  Flame, 
  Trash2, 
  CheckCircle2, 
  XCircle, 
  Activity, 
  Globe, 
  Terminal,
  Settings2,
  RefreshCw
} from 'lucide-react';
import { SystemStatus } from '../types';

interface SettingsProps {
  systemStatus: SystemStatus | null;
  onReset: () => Promise<void>;
}

export default function Settings({ systemStatus, onReset }: SettingsProps) {
  const [isResetting, setIsResetting] = useState(false);

  const handleResetClick = async () => {
    if (confirm("Are you sure you want to reset the repository? This will delete all documents and cached embeddings permanently.")) {
      setIsResetting(true);
      try {
        await onReset();
      } finally {
        setIsResetting(false);
      }
    }
  };

  const statusList = [
    {
      name: 'Google Gemini AI Service',
      desc: 'Provides language comprehension, contradiction scoring, and source attribution verification.',
      status: systemStatus?.gemini || 'online',
      icon: Cpu,
      meta: 'API Model: gemini-3.5-flash'
    },
    {
      name: 'Vector Database Index',
      desc: 'Stores high-dimensional context embeddings for fast semantic match queries.',
      status: systemStatus?.vectorDb || 'online',
      icon: Database,
      meta: 'Embedding Model: text-embedding-004'
    },
    {
      name: 'Core Application Interface',
      desc: 'Manages API endpoints, secure ingestion parsing, and structured data serialization.',
      status: systemStatus?.api || 'online',
      icon: Terminal,
      meta: 'Express Engine Core'
    }
  ];

  return (
    <div className="space-y-8 p-6 lg:p-10 max-w-7xl mx-auto selection:bg-cyan-500/30">
      
      {/* Page Header */}
      <div className="border-b border-zinc-200 dark:border-zinc-800 pb-5">
        <h1 className="font-sans font-extrabold text-2xl sm:text-3xl text-zinc-900 dark:text-zinc-100 tracking-tight">
          System Settings
        </h1>
        <p className="font-sans text-sm text-zinc-500 dark:text-zinc-400 mt-1">
          Monitor cloud integrations, check engine status, and manage persistent storage indexes.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        
        {/* Service Integrations list (8 cols) */}
        <div className="lg:col-span-8 space-y-6">
          <div className="border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900/40 p-6 rounded-2xl shadow-sm dark:shadow-none space-y-6">
            <span className="font-sans text-xs font-bold text-zinc-400 dark:text-zinc-500 uppercase tracking-wider">Active Integrations</span>
            
            <div className="space-y-4">
              {statusList.map((service, idx) => {
                const isOnline = service.status === 'online';
                return (
                  <div 
                    key={idx} 
                    className="p-4 rounded-xl border border-zinc-200 dark:border-zinc-850 bg-zinc-50/50 dark:bg-zinc-950/40 flex flex-col sm:flex-row sm:items-center justify-between gap-4"
                  >
                    <div className="flex items-start gap-3.5">
                      <div className="w-10 h-10 rounded-xl bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 flex items-center justify-center shrink-0 shadow-sm text-zinc-400">
                        <service.icon className="w-5 h-5 text-blue-600 dark:text-cyan-400" />
                      </div>
                      <div className="space-y-1">
                        <h4 className="font-sans font-bold text-xs sm:text-sm text-zinc-800 dark:text-zinc-200">{service.name}</h4>
                        <p className="font-sans text-xs text-zinc-450 leading-relaxed max-w-lg">{service.desc}</p>
                        <span className="font-mono text-[10px] text-zinc-400 dark:text-zinc-500 block uppercase pt-1">{service.meta}</span>
                      </div>
                    </div>

                    <div className="shrink-0 flex items-center gap-2">
                      {isOnline ? (
                        <span className="px-2.5 py-1 rounded-full bg-emerald-50 dark:bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-100 dark:border-emerald-500/20 text-[10px] font-bold uppercase tracking-wider flex items-center gap-1.5">
                          <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
                          ONLINE
                        </span>
                      ) : (
                        <span className="px-2.5 py-1 rounded-full bg-red-50 dark:bg-red-500/10 text-red-600 dark:text-red-400 border border-red-100 dark:border-red-500/20 text-[10px] font-bold uppercase tracking-wider flex items-center gap-1.5">
                          <span className="w-1.5 h-1.5 rounded-full bg-red-500" />
                          OFFLINE
                        </span>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>

        {/* Maintenance card (4 cols) */}
        <div className="lg:col-span-4 space-y-6">
          <div className="border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900/40 p-6 rounded-2xl shadow-sm dark:shadow-none space-y-5 flex flex-col justify-between h-full min-h-[380px]">
            <div className="space-y-4">
              <span className="font-sans text-xs font-bold text-zinc-400 dark:text-zinc-500 uppercase tracking-wider">Storage Purge</span>
              
              <p className="text-zinc-500 dark:text-zinc-400 text-xs sm:text-sm leading-relaxed font-medium">
                Wipe all uploaded research files, indexed embeddings, conflict mappings, and search logs permanently from this workspace.
              </p>

              <div className="pt-2">
                <button 
                  onClick={handleResetClick}
                  disabled={isResetting}
                  className="w-full px-4 py-2.5 rounded-xl bg-red-50 dark:bg-red-950/20 hover:bg-red-100 dark:hover:bg-red-950/40 border border-red-200 dark:border-red-900/30 text-red-600 dark:text-red-400 disabled:opacity-40 font-sans text-xs font-bold flex items-center justify-center gap-2 transition-all cursor-pointer shadow-sm"
                >
                  {isResetting ? (
                    <>
                      <RefreshCw className="w-4 h-4 animate-spin" />
                      <span>Wiping Workspace...</span>
                    </>
                  ) : (
                    <>
                      <Trash2 className="w-4 h-4" />
                      <span>Wipe System Index</span>
                    </>
                  )}
                </button>
              </div>
            </div>

            <div className="p-4 rounded-xl border border-zinc-150 dark:border-zinc-900 bg-zinc-50/50 dark:bg-zinc-950 text-[10px] text-zinc-400 dark:text-zinc-500 leading-normal space-y-2 uppercase font-sans font-bold tracking-wider">
              <span className="text-zinc-500 dark:text-zinc-400 font-extrabold block">Runtime Platform Specs</span>
              <p>Deployment Node: Cloud Run Ingress</p>
              <p>Hosting: Google AI Studio</p>
              <p>Framework: React 19 / ESM</p>
            </div>
          </div>
        </div>

      </div>
    </div>
  );
}
