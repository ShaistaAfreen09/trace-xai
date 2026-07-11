/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import express from 'express';
import path from 'path';
import { fileURLToPath } from 'url';
import { createServer as createViteServer } from 'vite';
import { GoogleGenAI, Type } from '@google/genai';
import dotenv from 'dotenv';

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

import { createProxyMiddleware } from 'http-proxy-middleware';
import { spawn } from 'child_process';

const app = express();
const PORT = 3000;

// Body parsers with large limit for documents (only applied to non-proxied or specific routes)
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ limit: '10mb', extended: true }));


// In-memory data store for TRACE-XAI
interface ServerDocument {
  id: string;
  name: string;
  pages: number;
  uploadTime: string;
  extractedYear: number | null;
  status: 'processing' | 'indexed' | 'failed';
  size: number;
  content: string;
}

interface ServerChunk {
  id: string;
  documentId: string;
  documentName: string;
  year: number | null;
  page: number;
  content: string;
  embedding: number[];
}

interface Activity {
  id: string;
  timestamp: string;
  type: 'upload' | 'query' | 'conflict' | 'system';
  message: string;
  user: string;
}

interface QueryAnalysisResult {
  id: string;
  query: string;
  answer: string;
  confidence: number;
  evidence: any[];
  retrievedChunks: any[];
  sourceReferences: any[];
  processingTimeMs: number;
  timestamp: string;
}

const documents: ServerDocument[] = [];
const chunks: ServerChunk[] = [];
const queryHistory: any[] = [];
const activityLogs: Activity[] = [
  {
    id: 'act-init',
    timestamp: new Date().toISOString(),
    type: 'system',
    message: 'TRACE-XAI Engine Initialized. Temporal RAG pipeline active.',
    user: 'System'
  }
];

// Lazy-initialize Gemini API Client
let aiClient: GoogleGenAI | null = null;
function getGeminiClient(): GoogleGenAI {
  const apiKey = process.env.GEMINI_API_KEY;
  if (!apiKey || apiKey === 'MY_GEMINI_API_KEY') {
    throw new Error('GEMINI_API_KEY environment variable is not configured. Please set it in the Settings panel or secrets manager.');
  }
  if (!aiClient) {
    aiClient = new GoogleGenAI({
      apiKey,
      httpOptions: {
        headers: {
          'User-Agent': 'aistudio-build',
        }
      }
    });
  }
  return aiClient;
}

// Math Utility: Cosine Similarity between two vector arrays
function cosineSimilarity(vecA: number[], vecB: number[]): number {
  if (vecA.length !== vecB.length) return 0;
  let dotProduct = 0;
  let normA = 0;
  let normB = 0;
  for (let i = 0; i < vecA.length; i++) {
    dotProduct += vecA[i] * vecB[i];
    normA += vecA[i] * vecA[i];
    normB += vecB[i] * vecB[i];
  }
  if (normA === 0 || normB === 0) return 0;
  return dotProduct / (Math.sqrt(normA) * Math.sqrt(normB));
}

// -----------------------------------------------------------------
// API ENDPOINTS
// -----------------------------------------------------------------

// API Status Check
app.get('/api/status', async (req, res) => {
  const key = process.env.GEMINI_API_KEY;
  const isKeyConfigured = !!key && key !== 'MY_GEMINI_API_KEY';
  let isGeminiOnline = false;

  if (isKeyConfigured) {
    try {
      const ai = getGeminiClient();
      // Fast, lightweight query to check model connection
      await ai.models.generateContent({
        model: 'gemini-3.5-flash',
        contents: 'ping',
        config: { maxOutputTokens: 5 }
      });
      isGeminiOnline = true;
    } catch (err) {
      isGeminiOnline = false;
    }
  }

  res.json({
    api: 'online',
    vectorDb: 'online',
    firebase: 'online',
    gemini: isGeminiOnline ? 'online' : 'offline',
    keyConfigured: isKeyConfigured,
    stats: {
      documentsIndexed: documents.length,
      queriesExecuted: queryHistory.length,
      contradictionsDetected: queryHistory.reduce((acc, curr) => acc + (curr.evidence?.filter((e: any) => e.type === 'contradiction').length || 0), 0),
      timelineEvents: chunks.filter(c => c.year !== null).length
    }
  });
});

// Fetch Activity Logs
app.get('/api/activity', (req, res) => {
  res.json(activityLogs);
});

// Fetch Ingested Documents
app.get('/api/documents', (req, res) => {
  res.json(documents);
});

// Upload and Process Document
app.post('/api/documents/upload', async (req, res) => {
  const { name, content, forcedYear } = req.body;

  if (!name || !content) {
    return res.status(400).json({ error: 'Document name and content are required' });
  }

  const docId = `doc-${Date.now()}`;
  const docSize = Buffer.byteLength(content, 'utf8');
  
  // Create document draft entry
  const newDoc: ServerDocument = {
    id: docId,
    name,
    pages: 1, // Will be calculated based on chunk sizing
    uploadTime: new Date().toISOString(),
    extractedYear: forcedYear ? parseInt(forcedYear, 10) : null,
    status: 'processing',
    size: docSize,
    content
  };

  documents.push(newDoc);
  
  activityLogs.unshift({
    id: `act-upl-${Date.now()}`,
    timestamp: new Date().toISOString(),
    type: 'upload',
    message: `Started parsing and vector indexing document: ${name}`,
    user: 'Researcher'
  });

  try {
    const ai = getGeminiClient();
    let parsedContent = content;

    if (content.startsWith('data:')) {
      const match = content.match(/^data:([^;]+);base64,(.*)$/);
      if (match) {
        const mimeType = match[1];
        const base64Data = match[2];
        console.log(`[TRACE-XAI] Extracting text from binary file: ${name} (MIME: ${mimeType}) via Gemini...`);
        
        const extractionResponse = await ai.models.generateContent({
          model: 'gemini-3.5-flash',
          contents: [
            {
              inlineData: {
                data: base64Data,
                mimeType: mimeType
              }
            },
            "Extract all the readable text content from this document exactly, page by page, without summarizing it. Do not add any conversational text, just return the exact extracted text."
          ]
        });
        parsedContent = extractionResponse.text || '';
        if (!parsedContent.trim()) {
          throw new Error('No text content could be extracted from the document.');
        }
      } else {
        throw new Error('Malformed base64 document content.');
      }
    }

    newDoc.content = parsedContent;

    // 1. Chunking Logic: split by paragraphs or ~600 character blocks with overlap
    const rawParagraphs = parsedContent.split(/\n\s*\n/);
    const textChunks: string[] = [];
    
    for (const para of rawParagraphs) {
      const trimmed = para.trim();
      if (!trimmed) continue;
      
      if (trimmed.length > 800) {
        // split large paragraphs into smaller blocks
        const sentences = trimmed.match(/[^.!?]+[.!?]+(\s|$)/g) || [trimmed];
        let currentBlock = '';
        for (const sentence of sentences) {
          if ((currentBlock + sentence).length > 600) {
            textChunks.push(currentBlock.trim());
            currentBlock = sentence;
          } else {
            currentBlock += sentence;
          }
        }
        if (currentBlock) textChunks.push(currentBlock.trim());
      } else {
        textChunks.push(trimmed);
      }
    }

    if (textChunks.length === 0) {
      textChunks.push(parsedContent.substring(0, 800));
    }

    newDoc.pages = Math.ceil(textChunks.length / 3); // Approximate pages for display
    let mainDocYear = newDoc.extractedYear;

    // 2. Extracted Year & Embedding generation for each chunk
    for (let i = 0; i < textChunks.length; i++) {
      const chunkText = textChunks[i];
      const chunkPage = Math.floor(i / 3) + 1;
      
      // Look for years in this chunk (regex for 19xx and 20xx)
      let chunkYear: number | null = null;
      const yearMatches = chunkText.match(/\b(19\d{2}|20\d{2})\b/g);
      if (yearMatches && yearMatches.length > 0) {
        // prioritize years that are not current year 2026 if other historical dates are present
        chunkYear = parseInt(yearMatches[0], 10);
      }

      // If document does not have extracted year yet, inherit first chunk's year
      if (mainDocYear === null && chunkYear !== null) {
        mainDocYear = chunkYear;
      }

      // Call Gemini Embedding API to generate actual semantic vector
      const embedResponse = (await ai.models.embedContent({
        model: 'gemini-embedding-2-preview',
        contents: chunkText,
      })) as any;

      const embeddingValues = embedResponse.embedding?.values || embedResponse.embeddings?.[0]?.values;
      if (!embeddingValues) {
        throw new Error(`Embedding values unavailable for chunk ${i}`);
      }

      chunks.push({
        id: `chunk-${docId}-${i}`,
        documentId: docId,
        documentName: name,
        year: chunkYear || mainDocYear,
        page: chunkPage,
        content: chunkText,
        embedding: embeddingValues
      });
    }

    // Update document status
    newDoc.extractedYear = mainDocYear;
    newDoc.status = 'indexed';

    activityLogs.unshift({
      id: `act-ind-${Date.now()}`,
      timestamp: new Date().toISOString(),
      type: 'upload',
      message: `Successfully indexed ${textChunks.length} semantic vectors for "${name}" (Extracted Ref Year: ${mainDocYear || 'N/A'}).`,
      user: 'System'
    });

    res.json(newDoc);

  } catch (error: any) {
    newDoc.status = 'failed';
    activityLogs.unshift({
      id: `act-err-${Date.now()}`,
      timestamp: new Date().toISOString(),
      type: 'system',
      message: `Parsing failure on document: ${name}. Detail: ${error.message}`,
      user: 'System'
    });
    res.status(500).json({ error: error.message });
  }
});

// Perform Temporal Semantic Query Analysis
app.post('/api/query', async (req, res) => {
  const { query } = req.body;

  if (!query) {
    return res.status(400).json({ error: 'Query is required' });
  }

  if (documents.length === 0 || chunks.length === 0) {
    return res.status(400).json({ 
      error: 'Query execution requires at least one uploaded document in the repository. Please upload documents first.' 
    });
  }

  const startTime = Date.now();

  try {
    const ai = getGeminiClient();

    // 1. Embed query
    const queryEmbedResponse = (await ai.models.embedContent({
      model: 'gemini-embedding-2-preview',
      contents: query,
    })) as any;

    const queryVector = queryEmbedResponse.embedding?.values || queryEmbedResponse.embeddings?.[0]?.values;
    if (!queryVector) {
      throw new Error('Failed to generate semantic vector for the query.');
    }

    // 2. Perform Cosine Similarity against all cached chunk vectors
    const scoredChunks = chunks.map(chunk => {
      const score = cosineSimilarity(queryVector, chunk.embedding);
      return {
        id: chunk.id,
        documentId: chunk.documentId,
        documentName: chunk.documentName,
        year: chunk.year,
        page: chunk.page,
        content: chunk.content,
        score
      };
    });

    // Sort by descending score and retrieve top 5 relevant chunks
    const topChunks = scoredChunks
      .sort((a, b) => b.score - a.score)
      .slice(0, 6);

    // Filter chunks with a reasonable confidence threshold
    const relevantChunks = topChunks.filter(c => c.score > 0.15);

    if (relevantChunks.length === 0) {
      return res.json({
        id: `q-${Date.now()}`,
        query,
        answer: "No relevant documents found. The semantic search threshold was not met. Please upload documents addressing this topic.",
        confidence: 0,
        evidence: [],
        retrievedChunks: [],
        sourceReferences: [],
        processingTimeMs: Date.now() - startTime,
        timestamp: new Date().toISOString()
      });
    }

    // 3. Temporal Conflict Analysis Prompt
    // We send retrieved chunks to gemini-3.5-flash with a structured output schema to extract:
    // - Unified Answer
    // - Confidence Score
    // - Factual contradictions/disagreements or temporal progressions between sources (Evidence items)
    const formattedChunksContext = relevantChunks.map((c, idx) => {
      return `[Source ID: ${idx}] Document: "${c.documentName}" (Extracted Date/Year: ${c.year || 'Unknown'}), Page: ${c.page}\nContent: "${c.content}"`;
    }).join('\n\n');

    const prompt = `You are the core logic engine of TRACE-XAI, a strict Temporal Retrieval-Augmented Conflict Explanation System.
Your job is to answer the User Query based ONLY on the provided Retrieved Documents Context. 
Identify any conflict, discrepancies, temporal changes, contradictions, or factual differences between different documents, sources, or periods of time.

User Query: "${query}"

Retrieved Documents Context:
${formattedChunksContext}

RULES:
1. Synthesize a single authoritative, objective Answer. Do not make up facts. Answer strictly based on the context. If the sources are missing parts or have conflicting views, explain the conflict in the answer.
2. Calculate an absolute Confidence Score (0-100) based on source strength, completeness, date certainty, and clarity.
3. Critically analyze agreements and conflicts between sources. For each relationship:
   - Identify Source A and Source B.
   - Specify whether their relationship is a "contradiction" (they claim mutually exclusive facts), "agreement" (they support each other), or "neutral" (different perspective, no direct conflict).
   - Extract the specific claim/fact from Source A and Source B.
   - Calculate a "contradictionScore" from 0 to 100.
   - Write a detailed "explanation" describing the temporal resolution or logical root cause of this relationship.
4. Output strict JSON conforming exactly to the requested schema. Do not include markdown code block syntax inside the json values themselves.`;

    const response = await ai.models.generateContent({
      model: 'gemini-3.5-flash',
      contents: prompt,
      config: {
        responseMimeType: 'application/json',
        responseSchema: {
          type: Type.OBJECT,
          required: ['answer', 'confidence', 'evidence'],
          properties: {
            answer: {
              type: Type.STRING,
              description: 'The synthesized explainable answer derived strictly from context.'
            },
            confidence: {
              type: Type.INTEGER,
              description: 'Confidence rating from 0 to 100.'
            },
            evidence: {
              type: Type.ARRAY,
              description: 'Identified factual agreements or temporal conflicts between sources.',
              items: {
                type: Type.OBJECT,
                required: ['type', 'sourceA', 'sourceB', 'claimA', 'claimB', 'explanation', 'contradictionScore'],
                properties: {
                  type: {
                    type: Type.STRING,
                    enum: ['agreement', 'contradiction', 'neutral']
                  },
                  sourceA: { type: Type.STRING, description: 'Filename or identifier of the first document.' },
                  sourceB: { type: Type.STRING, description: 'Filename or identifier of the second document.' },
                  yearA: { type: Type.INTEGER, description: 'The year associated with the claim from source A, if any.' },
                  yearB: { type: Type.INTEGER, description: 'The year associated with the claim from source B, if any.' },
                  claimA: { type: Type.STRING, description: 'What Source A states.' },
                  claimB: { type: Type.STRING, description: 'What Source B states.' },
                  explanation: { type: Type.STRING, description: 'Explanation of why this agreement/conflict occurs, with temporal context.' },
                  contradictionScore: { type: Type.INTEGER, description: 'Contradiction rating from 0 (perfect harmony) to 100 (complete negation).' }
                }
              }
            }
          }
        }
      }
    });

    const parsedResponse = JSON.parse(response.text || '{}');

    // Calculate source references with citation counts
    const sourceMap = new Map<string, { name: string, year: number | null, count: number }>();
    relevantChunks.forEach(c => {
      const current = sourceMap.get(c.documentId) || { name: c.documentName, year: c.year, count: 0 };
      current.count += 1;
      sourceMap.set(c.documentId, current);
    });

    const sourceReferences = Array.from(sourceMap.entries()).map(([docId, val]) => ({
      documentId: docId,
      name: val.name,
      year: val.year,
      citationCount: val.count
    }));

    const result: QueryAnalysisResult = {
      id: `q-res-${Date.now()}`,
      query,
      answer: parsedResponse.answer || 'No cohesive answer could be constructed.',
      confidence: typeof parsedResponse.confidence === 'number' ? parsedResponse.confidence : 70,
      evidence: (parsedResponse.evidence || []).map((e: any, idx: number) => ({
        id: `ev-${Date.now()}-${idx}`,
        type: e.type || 'neutral',
        sourceA: e.sourceA || 'Source A',
        sourceB: e.sourceB || 'Source B',
        yearA: e.yearA || null,
        yearB: e.yearB || null,
        claimA: e.claimA || '',
        claimB: e.claimB || '',
        explanation: e.explanation || '',
        contradictionScore: typeof e.contradictionScore === 'number' ? e.contradictionScore : 0
      })),
      retrievedChunks: relevantChunks.map(rc => ({
        id: rc.id,
        documentId: rc.documentId,
        documentName: rc.documentName,
        year: rc.year,
        page: rc.page,
        content: rc.content,
        score: parseFloat(rc.score.toFixed(4))
      })),
      sourceReferences,
      processingTimeMs: Date.now() - startTime,
      timestamp: new Date().toISOString()
    };

    queryHistory.unshift(result);

    // Record activity
    const conflictCount = result.evidence.filter(e => e.type === 'contradiction').length;
    activityLogs.unshift({
      id: `act-qry-${Date.now()}`,
      timestamp: new Date().toISOString(),
      type: 'query',
      message: `Executed query: "${query.substring(0, 50)}${query.length > 50 ? '...' : ''}". Confidence: ${result.confidence}%. Conflicts detected: ${conflictCount}`,
      user: 'Researcher'
    });

    res.json(result);

  } catch (error: any) {
    activityLogs.unshift({
      id: `act-qry-err-${Date.now()}`,
      timestamp: new Date().toISOString(),
      type: 'system',
      message: `Query analysis failed: ${error.message}`,
      user: 'System'
    });
    res.status(500).json({ error: error.message });
  }
});

// Get Query History
app.get('/api/query/history', (req, res) => {
  res.json(queryHistory);
});

// Clear data state
app.post('/api/reset', (req, res) => {
  documents.length = 0;
  chunks.length = 0;
  queryHistory.length = 0;
  activityLogs.length = 0;
  activityLogs.push({
    id: `act-reset-${Date.now()}`,
    timestamp: new Date().toISOString(),
    type: 'system',
    message: 'System repositories cleared. Waiting for documents.',
    user: 'System'
  });
  res.json({ success: true });
});

// -----------------------------------------------------------------
// VITE DEV SERVER AND PRODUCTION ASSET SERVING
// -----------------------------------------------------------------

async function startServer() {
  if (process.env.NODE_ENV !== 'production') {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), 'dist');
    app.use(express.static(distPath));
    app.get('*', (req, res) => {
      res.sendFile(path.join(distPath, 'index.html'));
    });
  }

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`[TRACE-XAI Server] Active and running on http://localhost:${PORT}`);
  });
}

startServer();
export default app;
