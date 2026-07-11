/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

export interface IndexedDocument {
  id: string;
  name: string;
  pages: number;
  uploadTime: string;
  extractedYear: number | null;
  status: 'processing' | 'indexed' | 'failed';
  size: number;
  content: string;
}

export interface RetrievedChunk {
  id: string;
  documentId: string;
  documentName: string;
  year: number | null;
  page: number;
  content: string;
  score: number; // Semantic similarity score
}

export interface EvidenceItem {
  id: string;
  type: 'agreement' | 'contradiction' | 'neutral';
  sourceA: string;
  sourceB: string;
  yearA: number | null;
  yearB: number | null;
  claimA: string;
  claimB: string;
  explanation: string;
  contradictionScore: number; // 0 to 100
}

export interface SourceReference {
  documentId: string;
  name: string;
  year: number | null;
  citationCount: number;
}

export interface QueryAnalysisResult {
  id: string;
  query: string;
  answer: string;
  confidence: number; // 0 to 100
  evidence: EvidenceItem[];
  retrievedChunks: RetrievedChunk[];
  sourceReferences: SourceReference[];
  processingTimeMs: number;
  timestamp: string;
}

export interface TimelineEvent {
  id: string;
  year: number;
  source: string;
  summary: string;
  confidence: number;
  evidence: string;
}

export interface SystemStatus {
  api: 'online' | 'offline';
  vectorDb: 'online' | 'offline';
  firebase: 'online' | 'offline';
  gemini: 'online' | 'offline';
}

export interface ActivityLog {
  id: string;
  timestamp: string;
  type: 'upload' | 'query' | 'conflict' | 'system';
  message: string;
  user: string;
}
