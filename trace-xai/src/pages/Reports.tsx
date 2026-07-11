/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { 
  FileJson, 
  BookOpen, 
  History, 
  Copy, 
  Check, 
  ArrowDownToLine, 
  FileText,
  BookmarkCheck,
  ShieldCheck,
  Download,
  Printer
} from 'lucide-react';
import { QueryAnalysisResult, IndexedDocument } from '../types';

interface ReportsProps {
  documents: IndexedDocument[];
  queryHistory: QueryAnalysisResult[];
}

export default function Reports({ documents, queryHistory }: ReportsProps) {
  const [copiedText, setCopiedText] = useState<string | null>(null);

  // Download entire current state as JSON
  const handleDownloadJSON = () => {
    const reportData = {
      system: 'TRACE-XAI Enterprise platform',
      timestamp: new Date().toISOString(),
      documentsIndexed: documents.map(d => ({ name: d.name, size: d.size, year: d.extractedYear })),
      queriesRun: queryHistory
    };

    const dataStr = "data:text/json;charset=utf-8," + encodeURIComponent(JSON.stringify(reportData, null, 2));
    const downloadAnchor = document.createElement('a');
    downloadAnchor.setAttribute("href", dataStr);
    downloadAnchor.setAttribute("download", `trace_xai_audit_trail_${Date.now()}.json`);
    document.body.appendChild(downloadAnchor);
    downloadAnchor.click();
    downloadAnchor.remove();
  };

  const handleCopyValue = (text: string, id: string) => {
    navigator.clipboard.writeText(text);
    setCopiedText(id);
    setTimeout(() => setCopiedText(null), 2000);
  };

  const latestResult = queryHistory[0] || null;

  return (
    <div className="space-y-8 p-6 lg:p-10 max-w-7xl mx-auto selection:bg-cyan-500/30">
      
      {/* Page Header */}
      <div className="border-b border-zinc-200 dark:border-zinc-800 pb-5">
        <h1 className="font-sans font-extrabold text-2xl sm:text-3xl text-zinc-900 dark:text-zinc-100 tracking-tight">
          Audit & Export Center
        </h1>
        <p className="font-sans text-sm text-zinc-500 dark:text-zinc-400 mt-1">
          Export structured RAG analysis records, download system integrity transcripts, or generate print-ready factual compliance reports.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        
        {/* Left: Export triggers (5 cols) */}
        <div className="lg:col-span-5 space-y-6">
          <div className="border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900/40 p-6 rounded-2xl shadow-sm dark:shadow-none space-y-5">
            <span className="font-sans text-xs font-bold text-zinc-400 dark:text-zinc-500 uppercase tracking-wider">Compile Reports</span>
            
            <p className="text-zinc-500 dark:text-zinc-400 text-xs sm:text-sm leading-relaxed font-medium">
              Bundle full temporal analysis logs, contradiction records, and source details into standard machine-readable JSON formats or layout sheets.
            </p>

            <div className="space-y-3 pt-2">
              {/* JSON Download */}
              <button 
                onClick={handleDownloadJSON}
                disabled={documents.length === 0}
                className="w-full px-4 py-3 rounded-xl bg-zinc-900 hover:bg-zinc-850 dark:bg-zinc-100 dark:hover:bg-zinc-200 border border-zinc-200 dark:border-zinc-800 text-white dark:text-zinc-950 disabled:opacity-40 font-sans text-xs font-bold flex items-center justify-between transition-all cursor-pointer shadow-sm"
              >
                <span className="flex items-center gap-2">
                  <FileJson className="w-4 h-4 text-blue-500 dark:text-cyan-400" />
                  Download JSON Audit Dataset
                </span>
                <Download className="w-4 h-4 text-zinc-400 dark:text-zinc-600" />
              </button>

              {/* Print report trigger */}
              <button 
                onClick={() => window.print()}
                disabled={queryHistory.length === 0}
                className="w-full px-4 py-3 rounded-xl bg-zinc-50 hover:bg-zinc-100 dark:bg-zinc-900 dark:hover:bg-zinc-900/80 border border-zinc-200 dark:border-zinc-800 text-zinc-700 dark:text-zinc-300 disabled:opacity-40 font-sans text-xs font-bold flex items-center justify-between transition-all cursor-pointer"
              >
                <span className="flex items-center gap-2">
                  <FileText className="w-4 h-4 text-blue-500 dark:text-cyan-400" />
                  Print Compliance Report
                </span>
                <Printer className="w-4 h-4 text-zinc-400" />
              </button>
            </div>

            {/* Reference Statement */}
            <div className="p-4 rounded-xl bg-zinc-50 dark:bg-zinc-950 border border-zinc-200 dark:border-zinc-850 space-y-2">
              <span className="text-zinc-500 dark:text-zinc-400 font-bold uppercase block text-[10px] tracking-wider">Platform Statement</span>
              <p className="text-[11px] text-zinc-400 dark:text-zinc-500 leading-relaxed font-medium">Use this factual statement to log audits performed via TRACE-XAI within compliance registries:</p>
              <div className="text-zinc-700 dark:text-zinc-300 select-all p-3 rounded-xl bg-white dark:bg-zinc-900 text-xs font-sans leading-relaxed border border-zinc-200 dark:border-zinc-900 flex justify-between items-center mt-1">
                <span className="truncate pr-4">"TRACE-XAI Fact-Check: Verified via secure multi-source temporal RAG pipeline."</span>
                <button 
                  onClick={() => handleCopyValue("TRACE-XAI Fact-Check: Verified via secure multi-source temporal RAG pipeline.", "platform-statement")}
                  className="text-zinc-450 hover:text-blue-500 dark:hover:text-cyan-400"
                >
                  {copiedText === "platform-statement" ? <Check className="w-4 h-4 text-emerald-500" /> : <Copy className="w-4 h-4" />}
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Right: Document Reference Metadata Inventory (7 cols) */}
        <div className="lg:col-span-7 space-y-6">
          <div className="border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900/40 p-6 rounded-2xl shadow-sm dark:shadow-none space-y-4 flex flex-col justify-between h-full min-h-[440px]">
            <div className="space-y-4">
              <span className="block font-sans text-xs font-bold text-zinc-400 dark:text-zinc-500 uppercase tracking-wider">Document Metadata Register</span>

              {documents.length > 0 ? (
                <div className="space-y-4 max-h-[350px] overflow-y-auto pr-1">
                  {documents.map((doc) => {
                    const referenceText = `Document: ${doc.name}\nSize: ${doc.size} bytes\nChronology Year Anchor: ${doc.extractedYear || 'N/A'}\nAudit Hash: TRACE-XAI-${doc.id.substring(0, 8).toUpperCase()}`;
                    return (
                      <div key={doc.id} className="p-4 rounded-xl border border-zinc-200 dark:border-zinc-850 bg-zinc-50/50 dark:bg-zinc-950 space-y-3 relative group">
                        <div className="flex justify-between items-center">
                          <div className="flex items-center gap-2 max-w-[80%]">
                            <ShieldCheck className="w-4 h-4 text-blue-500 dark:text-cyan-400 shrink-0" />
                            <h4 className="font-sans font-bold text-xs text-zinc-800 dark:text-zinc-200 truncate" title={doc.name}>
                              {doc.name}
                            </h4>
                          </div>
                          
                          <button
                            onClick={() => handleCopyValue(referenceText, doc.id)}
                            className="p-1.5 rounded-lg bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-850 text-zinc-400 hover:text-blue-500 dark:hover:text-cyan-400 hover:border-zinc-300 dark:hover:border-zinc-700 transition-all cursor-pointer"
                            title="Copy reference metadata"
                          >
                            {copiedText === doc.id ? (
                              <Check className="w-3.5 h-3.5 text-emerald-500" />
                            ) : (
                              <Copy className="w-3.5 h-3.5" />
                            )}
                          </button>
                        </div>
                        
                        <div className="text-[11px] font-mono text-zinc-500 dark:text-zinc-500 leading-relaxed bg-white dark:bg-zinc-900/80 p-3 rounded-lg border border-zinc-150 dark:border-zinc-900 space-y-1">
                          <p><span className="font-sans font-bold text-zinc-400">File Name:</span> {doc.name}</p>
                          <p><span className="font-sans font-bold text-zinc-400">Anchor Year:</span> {doc.extractedYear || 'N/A'}</p>
                          <p><span className="font-sans font-bold text-zinc-400">System Key:</span> TRACE-XAI-{doc.id.substring(0, 8).toUpperCase()}</p>
                        </div>
                      </div>
                    );
                  })}
                </div>
              ) : (
                <div className="py-16 text-center space-y-4">
                  <div className="w-12 h-12 rounded-xl border border-zinc-200 dark:border-zinc-800 bg-zinc-50 dark:bg-zinc-950 flex items-center justify-center mx-auto text-zinc-400">
                    <BookmarkCheck className="w-5 h-5 text-zinc-400" />
                  </div>
                  <div>
                    <h4 className="font-sans font-bold text-sm text-zinc-800 dark:text-zinc-200 uppercase tracking-wider">Register Empty</h4>
                    <p className="font-sans text-xs text-zinc-400 dark:text-zinc-500 max-w-xs mx-auto mt-1 leading-relaxed">
                      Please ingest corporate or research documents. Reference metadata files will be compiled dynamically here.
                    </p>
                  </div>
                </div>
              )}
            </div>

            <div className="pt-4 border-t border-zinc-150 dark:border-zinc-900 flex justify-between items-center text-[10px] font-sans font-bold text-zinc-400 dark:text-zinc-500 uppercase tracking-widest">
              <span>Standard</span>
              <span className="text-blue-600 dark:text-cyan-400 flex items-center gap-1.5 font-sans font-semibold">
                <BookOpen className="w-3.5 h-3.5" />
                Fact Compliance Logs
              </span>
            </div>
          </div>
        </div>

      </div>
    </div>
  );
}
