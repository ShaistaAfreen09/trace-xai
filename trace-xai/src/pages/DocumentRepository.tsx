/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useRef, useEffect } from 'react';
import { 
  UploadCloud, 
  Search, 
  Trash2, 
  CheckCircle2, 
  Clock, 
  SlidersHorizontal, 
  FileCheck2,
  Cpu,
  Database,
  FileText,
  AlertCircle,
  RefreshCw,
  LayoutGrid,
  List,
  Eye,
  X,
  BookOpen,
  Calendar,
  Hash,
  Download,
  Check,
  ChevronRight,
  Sparkles
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { IndexedDocument } from '../types';

interface DocumentRepositoryProps {
  documents: IndexedDocument[];
  onUpload: (name: string, content: string, forcedYear?: string) => Promise<void>;
  onReset: () => Promise<void>;
}

export default function DocumentRepository({ 
  documents, 
  onUpload, 
  onReset 
}: DocumentRepositoryProps) {
  const [searchQuery, setSearchQuery] = useState('');
  const [forcedYear, setForcedYear] = useState('');
  const [isUploading, setIsUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [uploadStateText, setUploadStateText] = useState('');
  const [dragActive, setDragActive] = useState(false);
  const [statusFilter, setStatusFilter] = useState<'all' | 'indexed' | 'processing' | 'failed'>('all');
  const [viewMode, setViewMode] = useState<'list' | 'grid'>('list');
  const [selectedDoc, setSelectedDoc] = useState<IndexedDocument | null>(null);
  const [isResetting, setIsResetting] = useState(false);
  const [copiedId, setCopiedId] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleDrag = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === "dragenter" || e.type === "dragover") {
      setDragActive(true);
    } else if (e.type === "dragleave") {
      setDragActive(false);
    }
  };

  const processFile = async (file: File) => {
    if (!file) return;
    setIsUploading(true);
    setUploadProgress(10);
    setUploadStateText('Reading local document structure...');

    // Progress simulation for interactive feedback
    const progressTimer = setInterval(() => {
      setUploadProgress((prev) => {
        if (prev < 40) {
          setUploadStateText('Parsing plain text content...');
          return prev + 10;
        } else if (prev < 75) {
          setUploadStateText('Generating multi-dimensional embeddings...');
          return prev + 5;
        } else if (prev < 95) {
          setUploadStateText('Syncing vector indexes with FAISS database...');
          return prev + 2;
        }
        return prev;
      });
    }, 400);

    try {
      const reader = new FileReader();
      const uploadPromise = new Promise<string>((resolve) => {
        reader.onload = (e) => resolve(e.target?.result as string || '');
        const isBinary = file.name.endsWith('.pdf') || file.name.endsWith('.docx');
        if (isBinary) {
          reader.readAsDataURL(file);
        } else {
          reader.readAsText(file);
        }
      });

      const text = await uploadPromise;
      if (text) {
        await onUpload(file.name, text, forcedYear || undefined);
        setUploadProgress(100);
        setUploadStateText('Synchronization complete!');
        setForcedYear('');
      }
    } catch (err) {
      console.error(err);
      setUploadStateText('Failed to ingest document');
    } finally {
      clearInterval(progressTimer);
      setTimeout(() => {
        setIsUploading(false);
        setUploadProgress(0);
        setUploadStateText('');
      }, 1200);
    }
  };

  const handleDrop = async (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      await processFile(e.dataTransfer.files[0]);
    }
  };

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      await processFile(e.target.files[0]);
    }
  };

  const triggerFileSelect = () => {
    fileInputRef.current?.click();
  };

  const handleResetClick = async () => {
    if (confirm("Are you sure you want to wipe the document repository? This will delete all documents and cached FAISS embeddings permanently.")) {
      setIsResetting(true);
      try {
        await onReset();
        setSelectedDoc(null);
      } finally {
        setIsResetting(false);
      }
    }
  };

  const handleCopyHash = (text: string, id: string) => {
    navigator.clipboard.writeText(text);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  // Filter and Search logic
  const filteredDocuments = documents.filter(doc => {
    const matchesSearch = doc.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
                          (doc.extractedYear?.toString() || '').includes(searchQuery);
    const matchesFilter = statusFilter === 'all' || doc.status === statusFilter;
    return matchesSearch && matchesFilter;
  });

  const getDocSizeString = (bytes: number) => {
    if (!bytes) return '1.2 KB';
    if (bytes < 1024) return `${bytes} B`;
    const kb = bytes / 1024;
    if (kb < 1024) return `${kb.toFixed(1)} KB`;
    return `${(kb / 1024).toFixed(1)} MB`;
  };

  // Set default selected document on load
  useEffect(() => {
    if (documents.length > 0 && !selectedDoc) {
      setSelectedDoc(documents[0]);
    }
  }, [documents]);

  return (
    <div className="p-6 lg:p-10 max-w-7xl mx-auto space-y-8 flex flex-col min-h-0 selection:bg-cyan-500/30">
      
      {/* Title block */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 border-b border-zinc-200 dark:border-zinc-800 pb-5">
        <div>
          <h1 className="font-sans font-extrabold text-2xl sm:text-3xl text-zinc-900 dark:text-zinc-100 tracking-tight">
            Document Repository
          </h1>
          <p className="font-sans text-sm text-zinc-500 dark:text-zinc-400 mt-1">
            Securely ingest corporate resources. TRACE-XAI partitions paragraphs, maps chronologies, and aligns semantic vector indices.
          </p>
        </div>
        
        <button
          onClick={handleResetClick}
          disabled={documents.length === 0 || isResetting}
          className="px-4 py-2 rounded-xl bg-red-50 dark:bg-red-950/20 hover:bg-red-100 dark:hover:bg-red-950/40 border border-red-200 dark:border-red-900/30 text-red-600 dark:text-red-400 disabled:opacity-40 transition-all text-xs font-semibold flex items-center gap-2 cursor-pointer"
        >
          {isResetting ? (
            <>
              <RefreshCw className="w-3.5 h-3.5 animate-spin" />
              <span>Resetting Repository...</span>
            </>
          ) : (
            <>
              <Trash2 className="w-3.5 h-3.5" />
              <span>Wipe System Index</span>
            </>
          )}
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-stretch">
        
        {/* Left column (4 cols): Upload & Custom Anchors */}
        <div className="lg:col-span-4 space-y-6 flex flex-col">
          <div className="border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900/30 p-6 rounded-2xl shadow-sm dark:shadow-none space-y-6 flex-grow flex flex-col justify-between">
            <div className="space-y-6 w-full">
              <span className="font-sans text-xs font-bold text-zinc-400 dark:text-zinc-500 uppercase tracking-wider">Ingestion Panel</span>
              
              {/* Optional Forced Year Override */}
              <div className="space-y-1.5">
                <label className="block text-xs font-bold text-zinc-500 dark:text-zinc-400 uppercase tracking-wider">
                  Override Target Year <span className="text-zinc-400 dark:text-zinc-500 font-normal lowercase">(optional override)</span>
                </label>
                <input
                  type="number"
                  placeholder="e.g. 1986 (forces chronological axis)"
                  value={forcedYear}
                  onChange={(e) => setForcedYear(e.target.value)}
                  className="w-full bg-zinc-50 dark:bg-zinc-950 border border-zinc-200 dark:border-zinc-850 rounded-xl px-3.5 py-2.5 text-xs text-zinc-800 dark:text-zinc-200 placeholder-zinc-400 dark:placeholder-zinc-650 focus:outline-none focus:border-blue-500 dark:focus:border-cyan-400 focus:ring-1 focus:ring-blue-500/10 dark:focus:ring-cyan-400/20 transition-all font-sans"
                />
              </div>

              {/* Ingestion Drag & Drop Zone */}
              <div
                onDragEnter={handleDrag}
                onDragOver={handleDrag}
                onDragLeave={handleDrag}
                onDrop={handleDrop}
                onClick={triggerFileSelect}
                className={`border border-dashed p-8 rounded-2xl text-center cursor-pointer transition-all duration-300 relative overflow-hidden flex flex-col justify-center min-h-[220px] ${
                  dragActive 
                    ? 'border-blue-500 dark:border-cyan-400 bg-blue-50/20 dark:bg-cyan-500/5' 
                    : 'border-zinc-200 dark:border-zinc-800 bg-zinc-50/50 dark:bg-zinc-950/50 hover:border-zinc-300 dark:hover:border-zinc-750'
                } ${isUploading ? 'opacity-80 pointer-events-none' : ''}`}
              >
                <input
                  ref={fileInputRef}
                  type="file"
                  accept=".txt,.md"
                  onChange={handleFileChange}
                  className="hidden"
                />
                
                {isUploading ? (
                  <div className="space-y-4">
                    <div className="w-10 h-10 rounded-xl border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900 flex items-center justify-center mx-auto shadow-sm text-zinc-400">
                      <RefreshCw className="w-5 h-5 text-blue-600 dark:text-cyan-400 animate-spin" />
                    </div>
                    <div className="space-y-2">
                      <p className="text-zinc-800 dark:text-zinc-200 font-sans font-bold text-xs">{uploadStateText}</p>
                      
                      {/* Real tactile progress bar */}
                      <div className="w-full bg-zinc-100 dark:bg-zinc-900 h-1.5 rounded-full overflow-hidden max-w-[180px] mx-auto">
                        <motion.div 
                          className="h-full bg-blue-600 dark:bg-cyan-400"
                          initial={{ width: '0%' }}
                          animate={{ width: `${uploadProgress}%` }}
                          transition={{ duration: 0.2 }}
                        />
                      </div>
                      <span className="font-mono text-[9px] text-zinc-400">{uploadProgress}%</span>
                    </div>
                  </div>
                ) : (
                  <div className="space-y-4">
                    <div className="w-10 h-10 rounded-xl border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900 flex items-center justify-center mx-auto shadow-sm text-zinc-400">
                      <UploadCloud className="w-5 h-5 text-blue-600 dark:text-cyan-400" />
                    </div>
                    <div className="space-y-1">
                      <p className="text-zinc-800 dark:text-zinc-200 font-sans font-bold text-xs">Drag & drop files here</p>
                      <p className="text-zinc-400 dark:text-zinc-500 font-sans text-[10px] leading-relaxed max-w-[180px] mx-auto">
                        Supports text files (.txt) and markdown (.md) indices.
                      </p>
                    </div>
                    <button
                      type="button"
                      className="px-3.5 py-1.5 rounded-xl bg-zinc-900 hover:bg-zinc-850 dark:bg-zinc-100 dark:hover:bg-zinc-200 border border-zinc-200 dark:border-zinc-800 text-white dark:text-zinc-950 font-sans text-xs font-bold transition-all shadow-sm"
                    >
                      Browse Files
                    </button>
                  </div>
                )}
              </div>
            </div>

            {/* Pipeline specifications */}
            <div className="p-4 rounded-xl bg-zinc-50 dark:bg-zinc-950 border border-zinc-200 dark:border-zinc-850 space-y-2 pt-4 mt-6">
              <div className="flex items-center gap-1.5 text-zinc-600 dark:text-zinc-400 font-bold uppercase text-[9px] tracking-wider">
                <FileCheck2 className="w-3.5 h-3.5 text-blue-500 dark:text-cyan-400" />
                <span>RAG Pipeline Spec</span>
              </div>
              <ul className="space-y-1.5 text-[10px] text-zinc-400 dark:text-zinc-500 leading-relaxed font-semibold">
                <li className="flex items-start gap-1.5">
                  <span className="text-blue-500 dark:text-cyan-400 mt-0.5">•</span>
                  <span>Factual chunk partitioner with semantic token overlaps.</span>
                </li>
                <li className="flex items-start gap-1.5">
                  <span className="text-blue-500 dark:text-cyan-400 mt-0.5">•</span>
                  <span>Auto temporal parsing extracts year indices for chronology.</span>
                </li>
              </ul>
            </div>
          </div>
        </div>

        {/* Middle column (5 cols): Ingested Files Explorer */}
        <div className="lg:col-span-5 space-y-6 flex flex-col">
          <div className="border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900/30 p-6 rounded-2xl shadow-sm dark:shadow-none space-y-4 flex flex-col justify-between h-full min-h-[480px]">
            <div className="space-y-4">
              
              {/* Header and filter controls */}
              <div className="flex items-center justify-between border-b border-zinc-100 dark:border-zinc-850 pb-3">
                <span className="font-sans text-xs font-bold text-zinc-400 dark:text-zinc-500 uppercase tracking-wider">
                  Documents Index ({documents.length})
                </span>
                
                <div className="flex items-center gap-2">
                  {/* Grid/List View Toggles */}
                  <div className="flex items-center bg-zinc-100 dark:bg-zinc-900 p-0.5 rounded-lg border border-zinc-200 dark:border-zinc-800">
                    <button
                      onClick={() => setViewMode('list')}
                      className={`p-1 rounded transition-all ${viewMode === 'list' ? 'bg-white dark:bg-zinc-800 text-zinc-900 dark:text-zinc-100 shadow-sm' : 'text-zinc-400 hover:text-zinc-650'}`}
                      title="List View"
                    >
                      <List className="w-3.5 h-3.5" />
                    </button>
                    <button
                      onClick={() => setViewMode('grid')}
                      className={`p-1 rounded transition-all ${viewMode === 'grid' ? 'bg-white dark:bg-zinc-800 text-zinc-900 dark:text-zinc-100 shadow-sm' : 'text-zinc-400 hover:text-zinc-650'}`}
                      title="Grid View"
                    >
                      <LayoutGrid className="w-3.5 h-3.5" />
                    </button>
                  </div>

                  <select
                    value={statusFilter}
                    onChange={(e: any) => setStatusFilter(e.target.value)}
                    className="bg-zinc-50 dark:bg-zinc-950 border border-zinc-200 dark:border-zinc-850 rounded-lg px-2 py-1 text-[10px] text-zinc-500 font-sans font-bold uppercase tracking-wider focus:outline-none"
                  >
                    <option value="all">ALL</option>
                    <option value="indexed">INDEXED</option>
                    <option value="processing">QUEUED</option>
                  </select>
                </div>
              </div>

              {/* Search input */}
              <div className="relative">
                <Search className="w-3.5 h-3.5 absolute left-3 top-3.5 text-zinc-400" />
                <input
                  type="text"
                  placeholder="Search repository index..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full bg-zinc-50 dark:bg-zinc-950 border border-zinc-200 dark:border-zinc-850 rounded-xl pl-9 pr-4 py-3 text-xs text-zinc-800 dark:text-zinc-200 focus:outline-none focus:border-blue-500 dark:focus:border-cyan-400 transition-colors font-sans placeholder-zinc-450"
                />
              </div>

              {/* Content display */}
              {filteredDocuments.length > 0 ? (
                <div className="max-h-[360px] overflow-y-auto pr-1">
                  {viewMode === 'list' ? (
                    /* LIST VIEW */
                    <div className="space-y-2">
                      {filteredDocuments.map((doc) => {
                        const isSelected = selectedDoc?.id === doc.id;
                        return (
                          <div 
                            key={doc.id}
                            onClick={() => setSelectedDoc(doc)}
                            className={`p-3.5 rounded-xl border flex items-center justify-between gap-3 cursor-pointer transition-all ${
                              isSelected 
                                ? 'border-cyan-500/50 bg-cyan-50/10 dark:bg-cyan-500/[0.04]' 
                                : 'border-zinc-200 dark:border-zinc-850 bg-zinc-50/20 dark:bg-zinc-950/40 hover:border-zinc-300 dark:hover:border-zinc-800'
                            }`}
                          >
                            <div className="flex items-center gap-3 truncate">
                              <FileText className={`w-4 h-4 shrink-0 ${isSelected ? 'text-cyan-500' : 'text-zinc-400'}`} />
                              <div className="truncate space-y-0.5">
                                <h4 className="font-sans font-bold text-xs text-zinc-800 dark:text-zinc-200 truncate">{doc.name}</h4>
                                <span className="font-sans text-[10px] text-zinc-400 font-semibold uppercase tracking-wider block">
                                  {doc.extractedYear ? `Year ${doc.extractedYear}` : 'No chronology'}
                                </span>
                              </div>
                            </div>
                            
                            <div className="flex items-center gap-2">
                              <span className={`text-[9px] font-mono px-2 py-0.5 rounded-full border ${
                                doc.status === 'indexed'
                                  ? 'bg-emerald-50 dark:bg-emerald-500/10 border-emerald-100 dark:border-emerald-500/20 text-emerald-600 dark:text-emerald-400'
                                  : 'bg-amber-50 dark:bg-amber-500/10 border-amber-100 dark:border-amber-500/20 text-amber-600 dark:text-amber-400 animate-pulse'
                              }`}>
                                {doc.status}
                              </span>
                              <ChevronRight className="w-3.5 h-3.5 text-zinc-400" />
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  ) : (
                    /* GRID VIEW */
                    <div className="grid grid-cols-2 gap-3">
                      {filteredDocuments.map((doc) => {
                        const isSelected = selectedDoc?.id === doc.id;
                        return (
                          <div 
                            key={doc.id}
                            onClick={() => setSelectedDoc(doc)}
                            className={`p-4 rounded-xl border flex flex-col justify-between min-h-[110px] cursor-pointer transition-all ${
                              isSelected 
                                ? 'border-cyan-500/50 bg-cyan-50/10 dark:bg-cyan-500/[0.04] scale-[1.01]' 
                                : 'border-zinc-200 dark:border-zinc-850 bg-zinc-50/20 dark:bg-zinc-950/40 hover:border-zinc-300 dark:hover:border-zinc-800'
                            }`}
                          >
                            <div className="space-y-2">
                              <div className="flex items-center justify-between">
                                <FileText className={`w-4 h-4 ${isSelected ? 'text-cyan-500' : 'text-zinc-400'}`} />
                                <span className="text-[9px] font-mono text-zinc-400">{getDocSizeString(doc.size)}</span>
                              </div>
                              <h4 className="font-sans font-bold text-xs text-zinc-850 dark:text-zinc-200 truncate" title={doc.name}>
                                {doc.name}
                              </h4>
                            </div>

                            <div className="flex justify-between items-center pt-2 border-t border-zinc-100 dark:border-zinc-900 text-[9px] font-sans font-bold uppercase text-zinc-400">
                              <span>Pages {doc.pages || 1}</span>
                              <span className="text-cyan-500">{doc.extractedYear || 'N/A'}</span>
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  )}
                </div>
              ) : (
                <div className="py-20 text-center space-y-4">
                  <div className="w-12 h-12 rounded-xl border border-zinc-200 dark:border-zinc-800 bg-zinc-50 dark:bg-zinc-950 flex items-center justify-center mx-auto text-zinc-400">
                    <Database className="w-5 h-5" />
                  </div>
                  <div>
                    <h3 className="font-sans font-bold text-xs text-zinc-850 dark:text-zinc-300 uppercase tracking-wider">No Records In Repository</h3>
                    <p className="font-sans text-[10px] text-zinc-400 dark:text-zinc-500 max-w-[200px] mx-auto mt-1 leading-relaxed">
                      Upload raw files in the left sidebar to populate this workspace.
                    </p>
                  </div>
                </div>
              )}
            </div>

            <div className="pt-4 border-t border-zinc-150 dark:border-zinc-900 flex justify-between items-center text-[10px] font-sans font-bold text-zinc-400 dark:text-zinc-500 uppercase tracking-widest">
              <span>LOCAL EMBEDDING SCHEMA</span>
              <span className="text-blue-600 dark:text-cyan-400 flex items-center gap-1.5 font-sans font-semibold">
                <Database className="w-3.5 h-3.5" />
                SECURE VECTOR STORAGE
              </span>
            </div>
          </div>
        </div>

        {/* Right column (3 cols): Document Metadata Drawer & Live Preview */}
        <div className="lg:col-span-3">
          <AnimatePresence mode="wait">
            {selectedDoc ? (
              <motion.div 
                key={selectedDoc.id}
                initial={{ opacity: 0, x: 10 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: 10 }}
                className="border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-950 rounded-2xl flex flex-col h-full overflow-hidden shadow-sm min-h-[480px]"
              >
                {/* Header info */}
                <div className="p-4 border-b border-zinc-150 dark:border-zinc-900 bg-zinc-50/50 dark:bg-zinc-900/10 flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <BookOpen className="w-4 h-4 text-cyan-500" />
                    <span className="font-sans text-[10px] text-zinc-700 dark:text-zinc-300 uppercase font-extrabold tracking-wider">Document Inspector</span>
                  </div>
                  <button 
                    onClick={() => setSelectedDoc(null)}
                    className="p-1 rounded-lg hover:bg-zinc-200 dark:hover:bg-zinc-900 text-zinc-400 hover:text-zinc-200 transition-all cursor-pointer"
                  >
                    <X className="w-3.5 h-3.5" />
                  </button>
                </div>

                {/* Body scrollable inspector */}
                <div className="p-4 flex-grow overflow-y-auto space-y-4 text-xs font-sans">
                  
                  {/* File parameters */}
                  <div className="space-y-2.5 pb-4 border-b border-zinc-100 dark:border-zinc-900">
                    <div className="space-y-0.5">
                      <span className="text-[10px] font-bold uppercase text-zinc-400 tracking-wider">File Name</span>
                      <p className="font-bold text-zinc-800 dark:text-zinc-200 leading-snug break-all">{selectedDoc.name}</p>
                    </div>

                    <div className="grid grid-cols-2 gap-2 text-[11px]">
                      <div>
                        <span className="text-[9px] font-bold uppercase text-zinc-400 tracking-wider block">Size</span>
                        <span className="font-mono font-bold text-zinc-700 dark:text-zinc-300">{getDocSizeString(selectedDoc.size)}</span>
                      </div>
                      <div>
                        <span className="text-[9px] font-bold uppercase text-zinc-400 tracking-wider block">Pages</span>
                        <span className="font-mono font-bold text-zinc-700 dark:text-zinc-300">{selectedDoc.pages || 1}</span>
                      </div>
                    </div>
                  </div>

                  {/* Chronology timeline metadata */}
                  <div className="space-y-3 pb-4 border-b border-zinc-100 dark:border-zinc-900">
                    <span className="text-[10px] font-bold uppercase text-zinc-400 tracking-wider block">Extracted Temporal Anchors</span>
                    
                    <div className="flex items-center gap-2 p-2.5 rounded-lg bg-zinc-50 dark:bg-zinc-900/50 border border-zinc-200 dark:border-zinc-900">
                      <Calendar className="w-4 h-4 text-blue-600 dark:text-cyan-400 shrink-0" />
                      <div className="space-y-0.5">
                        <span className="text-[9px] text-zinc-400 block font-bold">TIMELINE REGISTER</span>
                        <span className="font-mono font-bold text-zinc-800 dark:text-zinc-200">
                          {selectedDoc.extractedYear ? `Year ${selectedDoc.extractedYear}` : 'No Chronology anchors'}
                        </span>
                      </div>
                    </div>
                  </div>

                  {/* Audit Hash key block */}
                  <div className="space-y-2 pb-4 border-b border-zinc-100 dark:border-zinc-900">
                    <span className="text-[10px] font-bold uppercase text-zinc-400 tracking-wider block">System Trace Identification</span>
                    <div className="flex justify-between items-center p-2 rounded-lg bg-zinc-50 dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-850 font-mono text-[10px] text-zinc-600 dark:text-zinc-400">
                      <span className="truncate pr-3">HASH: TRACE-XAI-{selectedDoc.id.substring(0, 8).toUpperCase()}</span>
                      <button 
                        onClick={() => handleCopyHash(`TRACE-XAI-${selectedDoc.id.substring(0, 8).toUpperCase()}`, selectedDoc.id)}
                        className="text-zinc-450 hover:text-cyan-500 transition-colors"
                        title="Copy System Hash"
                      >
                        {copiedId === selectedDoc.id ? <Check className="w-3.5 h-3.5 text-emerald-500" /> : <Hash className="w-3.5 h-3.5" />}
                      </button>
                    </div>
                  </div>

                  {/* Raw Document text preview container */}
                  <div className="space-y-1.5 flex-grow flex flex-col min-h-0">
                    <span className="text-[10px] font-bold uppercase text-zinc-400 tracking-wider block">Raw Content Preview</span>
                    <div className="p-3 rounded-xl border border-zinc-250 dark:border-zinc-900 bg-zinc-50/50 dark:bg-zinc-900/20 italic text-zinc-700 dark:text-zinc-300 leading-relaxed text-[11px] font-medium max-h-[160px] overflow-y-auto whitespace-pre-line border-l-4 border-l-cyan-400">
                      "{selectedDoc.content || 'No text parsed'}"
                    </div>
                  </div>

                </div>
              </motion.div>
            ) : (
              <div className="border border-dashed border-zinc-200 dark:border-zinc-850 rounded-2xl bg-zinc-50/40 dark:bg-[#09090b]/50 p-6 flex flex-col items-center justify-center text-center h-full min-h-[480px]">
                <Eye className="w-6 h-6 text-zinc-400 mb-2 animate-pulse" />
                <p className="font-sans text-[10px] text-zinc-400 dark:text-zinc-500 max-w-[150px] mx-auto leading-relaxed">
                  Select any document in the index table to preview parsed contents and inspect metadata trails.
                </p>
              </div>
            )}
          </AnimatePresence>
        </div>

      </div>
    </div>
  );
}
