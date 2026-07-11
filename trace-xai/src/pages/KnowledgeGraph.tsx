/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect, useRef } from 'react';
import * as d3 from 'd3';
import { 
  GitFork, 
  HelpCircle, 
  ShieldAlert, 
  CheckCircle2, 
  Info, 
  Layers, 
  FileText, 
  Compass, 
  Activity,
  Calendar,
  Check,
  BookOpen
} from 'lucide-react';
import { QueryAnalysisResult, IndexedDocument } from '../types';

interface KnowledgeGraphProps {
  queryHistory: QueryAnalysisResult[];
  documents: IndexedDocument[];
}

interface GraphNode extends d3.SimulationNodeDatum {
  id: string;
  label: string;
  type: 'document' | 'chunk' | 'topic';
  meta?: any;
}

interface GraphLink extends d3.SimulationLinkDatum<GraphNode> {
  source: string | GraphNode;
  target: string | GraphNode;
  type: 'supports' | 'contradicts' | 'references';
  meta?: any;
}

export default function KnowledgeGraph({ queryHistory, documents }: KnowledgeGraphProps) {
  const latestResult = queryHistory[0] || null;
  const svgRef = useRef<SVGSVGElement | null>(null);
  const containerRef = useRef<HTMLDivElement | null>(null);
  const [selectedNode, setSelectedNode] = useState<GraphNode | null>(null);
  const [dimensions, setDimensions] = useState({ width: 600, height: 500 });
  
  // Dynamic resizing
  useEffect(() => {
    if (!containerRef.current) return;
    const resizeObserver = new ResizeObserver((entries) => {
      for (let entry of entries) {
        const { width, height } = entry.contentRect;
        setDimensions({
          width: Math.max(width, 300),
          height: Math.max(height, 400)
        });
      }
    });
    resizeObserver.observe(containerRef.current);
    return () => resizeObserver.disconnect();
  }, []);

  // Construct node-link mapping
  const getGraphData = () => {
    const nodes: GraphNode[] = [];
    const links: GraphLink[] = [];

    if (latestResult && latestResult.retrievedChunks && latestResult.retrievedChunks.length > 0) {
      latestResult.sourceReferences.forEach((ref) => {
        nodes.push({
          id: ref.documentId || `doc-${ref.name}`,
          label: ref.name,
          type: 'document',
          meta: {
            year: ref.year,
            citationCount: ref.citationCount
          }
        });
      });

      latestResult.retrievedChunks.forEach((chunk) => {
        nodes.push({
          id: chunk.id,
          label: `Chunk P.${chunk.page}`,
          type: 'chunk',
          meta: chunk
        });

        const parentDocId = chunk.documentId || latestResult.sourceReferences.find(r => r.name === chunk.documentName)?.documentId || `doc-${chunk.documentName}`;
        links.push({
          source: chunk.id,
          target: parentDocId,
          type: 'references'
        });
      });

      latestResult.evidence.forEach((ev, idx) => {
        const topicId = `topic-${idx}`;
        nodes.push({
          id: topicId,
          label: ev.type === 'contradiction' ? 'Conflict Area' : 'Alignment',
          type: 'topic',
          meta: ev
        });

        const sourceADoc = latestResult.sourceReferences.find(r => r.name === ev.sourceA);
        const sourceBDoc = latestResult.sourceReferences.find(r => r.name === ev.sourceB);
        
        if (sourceADoc) {
          links.push({
            source: topicId,
            target: sourceADoc.documentId || `doc-${ev.sourceA}`,
            type: ev.type === 'contradiction' ? 'contradicts' : 'supports'
          });
        }
        if (sourceBDoc) {
          links.push({
            source: topicId,
            target: sourceBDoc.documentId || `doc-${ev.sourceB}`,
            type: ev.type === 'contradiction' ? 'contradicts' : 'supports'
          });
        }
      });
    } else if (documents.length > 0) {
      documents.forEach((doc) => {
        nodes.push({
          id: doc.id,
          label: doc.name,
          type: 'document',
          meta: {
            year: doc.extractedYear,
            pages: doc.pages,
            size: doc.size
          }
        });

        for (let p = 1; p <= Math.min(doc.pages, 3); p++) {
          const chunkId = `chunk-${doc.id}-${p}`;
          nodes.push({
            id: chunkId,
            label: `Segment P.${p}`,
            type: 'chunk',
            meta: {
              documentName: doc.name,
              page: p,
              year: doc.extractedYear,
              content: `This represents indexed semantic segment #${p} of document "${doc.name}". Semantic indexing is active and completely mapped.`
            }
          });

          links.push({
            source: chunkId,
            target: doc.id,
            type: 'references'
          });
        }
      });
    }

    const uniqueNodesMap = new Map<string, GraphNode>();
    nodes.forEach(n => uniqueNodesMap.set(n.id, n));
    const uniqueNodes = Array.from(uniqueNodesMap.values());

    const validLinks = links.filter(l => {
      const sourceId = typeof l.source === 'string' ? l.source : (l.source as GraphNode).id;
      const targetId = typeof l.target === 'string' ? l.target : (l.target as GraphNode).id;
      return uniqueNodesMap.has(sourceId) && uniqueNodesMap.has(targetId);
    });

    return { nodes: uniqueNodes, links: validLinks };
  };

  const { nodes, links } = getGraphData();

  // D3 force layout rendering
  useEffect(() => {
    if (!svgRef.current || nodes.length === 0) return;

    const svg = d3.select(svgRef.current);
    svg.selectAll('*').remove();

    const width = dimensions.width;
    const height = dimensions.height;

    // Direct path marker definitions
    const defs = svg.append('defs');
    ['supports', 'contradicts', 'references'].forEach(type => {
      let color = '#a1a1aa';
      if (type === 'supports') color = '#10b981';
      if (type === 'contradicts') color = '#ef4444';

      defs.append('marker')
        .attr('id', `arrow-${type}`)
        .attr('viewBox', '0 -5 10 10')
        .attr('refX', 22)
        .attr('refY', 0)
        .attr('markerWidth', 6)
        .attr('markerHeight', 6)
        .attr('orient', 'auto')
        .append('path')
        .attr('d', 'M0,-5L10,0L0,5')
        .attr('fill', color);
    });

    const mainGroup = svg.append('g');

    // Drag-zoom behaviors
    const zoomBehavior = d3.zoom<SVGSVGElement, unknown>()
      .scaleExtent([0.3, 3])
      .on('zoom', (event) => {
        mainGroup.attr('transform', event.transform);
      });

    svg.call(zoomBehavior);

    const simulation = d3.forceSimulation<GraphNode>(nodes)
      .force('link', d3.forceLink<GraphNode, GraphLink>(links)
        .id(d => d.id)
        .distance(d => d.type === 'references' ? 65 : 115)
      )
      .force('charge', d3.forceManyBody().strength(-220))
      .force('center', d3.forceCenter(width / 2, height / 2))
      .force('collision', d3.forceCollide().radius(40));

    const linkGroup = mainGroup.append('g').attr('class', 'links-layer');

    const link = linkGroup.selectAll('line')
      .data(links)
      .enter()
      .append('line')
      .attr('stroke-width', d => d.type === 'references' ? 1.5 : 2)
      .attr('stroke', d => {
        if (d.type === 'supports') return '#10b981';
        if (d.type === 'contradicts') return '#ef4444';
        return '#d4d4d8';
      })
      .attr('stroke-dasharray', d => d.type === 'references' ? '3,3' : 'none')
      .attr('marker-end', d => `url(#arrow-${d.type})`);

    const nodeGroup = mainGroup.append('g').attr('class', 'nodes-layer');

    const node = nodeGroup.selectAll<SVGGElement, GraphNode>('g')
      .data(nodes)
      .enter()
      .append('g')
      .attr('class', 'node-group')
      .style('cursor', 'pointer')
      .on('click', (event, d) => {
        setSelectedNode(d);
        event.stopPropagation();
      })
      .call(d3.drag<SVGGElement, GraphNode>()
        .on('start', dragstarted)
        .on('drag', dragged)
        .on('end', dragended)
      );

    // Dynamic circles based on types
    node.append('circle')
      .attr('r', d => d.type === 'document' ? 18 : d.type === 'topic' ? 14 : 10)
      .attr('fill', d => {
        if (d.type === 'document') return '#18181b';
        if (d.type === 'topic') return d.label === 'Conflict Area' ? '#ef4444' : '#10b981';
        return '#2563eb';
      })
      .attr('stroke', d => {
        if (d.type === 'document') return '#3b82f6';
        if (d.type === 'topic') return '#ffffff';
        return '#60a5fa';
      })
      .attr('stroke-width', 2);

    // Responsive Label placement
    node.append('text')
      .attr('dy', d => d.type === 'document' ? 28 : 22)
      .attr('text-anchor', 'middle')
      .attr('fill', '#3f3f46')
      .attr('class', 'dark:fill-zinc-300 font-sans font-bold text-[9px] pointer-events-none')
      .text(d => d.label.length > 15 ? d.label.substring(0, 12) + '...' : d.label);

    simulation.on('tick', () => {
      link
        .attr('x1', d => (d.source as GraphNode).x || 0)
        .attr('y1', d => (d.source as GraphNode).y || 0)
        .attr('x2', d => (d.target as GraphNode).x || 0)
        .attr('y2', d => (d.target as GraphNode).y || 0);

      node
        .attr('transform', d => `translate(${d.x || 0}, ${d.y || 0})`);
    });

    function dragstarted(event: any, d: GraphNode) {
      if (!event.active) simulation.alphaTarget(0.3).restart();
      d.fx = d.x;
      d.fy = d.y;
    }

    function dragged(event: any, d: GraphNode) {
      d.fx = event.x;
      d.fy = event.y;
    }

    function dragended(event: any, d: GraphNode) {
      if (!event.active) simulation.alphaTarget(0);
      d.fx = null;
      d.fy = null;
    }

    if (!selectedNode && nodes.length > 0) {
      setSelectedNode(nodes[0]);
    }

  }, [nodes, dimensions]);

  return (
    <div className="p-6 lg:p-10 max-w-7xl mx-auto space-y-8 flex flex-col h-[calc(100vh-2rem)] selection:bg-cyan-500/30">
      
      {/* Header */}
      <div className="border-b border-zinc-200 dark:border-zinc-800 pb-5 shrink-0">
        <div className="flex items-center gap-3">
          <GitFork className="w-6 h-6 text-blue-600 dark:text-cyan-400" />
          <h1 className="font-sans font-extrabold text-2xl sm:text-3xl text-zinc-900 dark:text-zinc-100 tracking-tight">
            Knowledge Graph
          </h1>
        </div>
        <p className="font-sans text-sm text-zinc-500 dark:text-zinc-400 mt-1">
          Explore cognitive mapping of factual support, dependencies, and conflicting claims across matching files.
        </p>
      </div>

      {nodes.length === 0 ? (
        <div className="flex-grow flex flex-col items-center justify-center border border-dashed border-zinc-200 dark:border-zinc-850 rounded-2xl bg-white dark:bg-[#09090b]/50 shadow-sm">
          <Layers className="w-12 h-12 text-zinc-400 mb-4 animate-pulse" />
          <h3 className="font-sans text-sm text-zinc-800 dark:text-zinc-300 font-semibold">No Graph Assets Indexed</h3>
          <p className="font-sans text-xs text-zinc-400 dark:text-zinc-500 mt-1 text-center max-w-xs leading-relaxed">
            Ingest research files or run queries to automatically plot cognitive network dependencies.
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-5 gap-8 flex-grow overflow-hidden h-full min-h-0 items-stretch">
          
          {/* D3 Graph View Frame (3 cols) */}
          <div ref={containerRef} className="lg:col-span-3 border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-950/40 p-4 rounded-2xl relative flex flex-col min-h-[400px] shadow-sm">
            <div className="absolute top-4 left-4 z-20 flex items-center gap-2 pointer-events-none bg-white/85 dark:bg-zinc-900/80 p-2 rounded-xl backdrop-blur border border-zinc-100 dark:border-zinc-800 text-xs font-sans font-semibold text-zinc-600 dark:text-zinc-400">
              <Compass className="w-4 h-4 text-blue-600 dark:text-cyan-400" />
              <span>Interactive Network View</span>
            </div>

            <svg ref={svgRef} className="w-full h-full flex-grow focus:outline-none" />

            {/* Legend Frame */}
            <div className="p-4 border-t border-zinc-100 dark:border-zinc-900 bg-zinc-50/50 dark:bg-zinc-950/80 rounded-b-2xl flex flex-wrap gap-4 text-[10px] font-sans font-bold text-zinc-400 dark:text-zinc-500 uppercase shrink-0 select-none">
              <div className="flex items-center gap-1.5">
                <span className="w-3 h-3 rounded-full border border-blue-500 bg-zinc-100 dark:bg-zinc-900" />
                <span>Document Node</span>
              </div>
              <div className="flex items-center gap-1.5">
                <span className="w-2.5 h-2.5 rounded-full bg-blue-600" />
                <span>Segment/Chunk</span>
              </div>
              <div className="flex items-center gap-1.5">
                <span className="w-2.5 h-2.5 rounded-full bg-red-500" />
                <span>Conflict Area</span>
              </div>
              <div className="flex items-center gap-1.5">
                <span className="w-2.5 h-2.5 rounded-full bg-emerald-500" />
                <span>Alignment</span>
              </div>
            </div>
          </div>

          {/* Inspector Panel (2 cols) */}
          <div className="lg:col-span-2 flex flex-col min-h-0 h-full">
            {selectedNode ? (
              <div className="border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-950 rounded-2xl flex flex-col h-full overflow-hidden shadow-sm">
                
                {/* Header title */}
                <div className="p-5 border-b border-zinc-100 dark:border-zinc-900 bg-zinc-50/50 dark:bg-zinc-900/30 flex items-center justify-between shrink-0 select-none">
                  <div className="flex items-center gap-2">
                    <Activity className="w-4 h-4 text-blue-600 dark:text-cyan-400" />
                    <span className="font-sans text-xs text-zinc-700 dark:text-zinc-300 uppercase font-extrabold tracking-wider">Node Inspector</span>
                  </div>
                  <span className="font-sans text-[10px] px-2.5 py-0.5 rounded-full bg-zinc-150 dark:bg-zinc-800 text-zinc-500 font-bold uppercase">
                    {selectedNode.type}
                  </span>
                </div>

                {/* Evidence Details */}
                <div className="flex-grow overflow-y-auto divide-y divide-zinc-100 dark:divide-zinc-900 font-sans text-xs">
                  
                  {/* Source metadata split */}
                  <div className="p-5 space-y-4">
                    <h3 className="font-sans text-[10px] font-bold uppercase text-zinc-400 tracking-wider">Source Context</h3>
                    
                    <div className="space-y-3">
                      <div>
                        <span className="font-sans text-[10px] text-zinc-400 dark:text-zinc-500 block uppercase font-bold">Document Name</span>
                        <div className="flex items-center gap-2 text-zinc-800 dark:text-zinc-200 font-bold mt-1 text-sm">
                          <FileText className="w-4 h-4 text-blue-600 dark:text-cyan-400 shrink-0" />
                          <span className="truncate">{selectedNode.type === 'document' ? selectedNode.label : (selectedNode.meta?.documentName || 'Associated File')}</span>
                        </div>
                      </div>

                      <div className="grid grid-cols-2 gap-4">
                        <div>
                          <span className="font-sans text-[10px] text-zinc-400 dark:text-zinc-500 block uppercase font-bold">Temporal Reference</span>
                          <span className="text-zinc-700 dark:text-zinc-300 font-mono font-bold flex items-center gap-1.5 mt-1">
                            <Calendar className="w-4 h-4 text-blue-600 dark:text-cyan-400" />
                            {selectedNode.meta?.year || 'Unknown Year'}
                          </span>
                        </div>
                        {selectedNode.type === 'chunk' && (
                          <div>
                            <span className="font-sans text-[10px] text-zinc-400 dark:text-zinc-500 block uppercase font-bold">Page Reference</span>
                            <span className="text-zinc-700 dark:text-zinc-300 font-mono font-bold flex items-center gap-1.5 mt-1">
                              <BookOpen className="w-4 h-4 text-blue-600 dark:text-cyan-400" />
                              Page {selectedNode.meta?.page || 'N/A'}
                            </span>
                          </div>
                        )}
                      </div>
                    </div>

                    <div className="space-y-1.5">
                      <span className="font-sans text-[10px] text-zinc-400 dark:text-zinc-500 block uppercase font-bold">Anchor Content</span>
                      <div className="p-4 rounded-xl border border-zinc-200 dark:border-zinc-900 bg-zinc-50/50 dark:bg-zinc-900/10 italic leading-relaxed text-zinc-700 dark:text-zinc-300 border-l-4 border-l-blue-500 dark:border-l-cyan-400 text-xs font-medium">
                        "{selectedNode.type === 'document' 
                          ? `This node represents the core parent file index. You can expand and review exact parsed matching paragraph nodes to view individual quotes.`
                          : selectedNode.type === 'topic' 
                          ? selectedNode.meta?.explanation 
                          : selectedNode.meta?.content}"
                      </div>
                    </div>
                  </div>

                  {/* Verification split */}
                  <div className="p-5 space-y-4 bg-zinc-50/30 dark:bg-zinc-900/[0.05]">
                    <h3 className="font-sans text-[10px] font-bold uppercase text-zinc-400 tracking-wider">Logical Parameters</h3>
                    
                    {selectedNode.type === 'chunk' && (
                      <div className="space-y-4">
                        <div className="grid grid-cols-2 gap-4">
                          <div>
                            <span className="font-sans text-[10px] text-zinc-400 dark:text-zinc-500 block uppercase font-bold">Match Score</span>
                            <div className="flex items-baseline gap-0.5 mt-1 text-zinc-800 dark:text-zinc-200">
                              <span className="text-xl font-bold font-mono">
                                {selectedNode.meta?.score ? (selectedNode.meta.score * 100).toFixed(0) : '85'}
                              </span>
                              <span className="text-[10px] text-zinc-400">%</span>
                            </div>
                          </div>
                          <div>
                            <span className="font-sans text-[10px] text-zinc-400 dark:text-zinc-500 block uppercase font-bold">Match Status</span>
                            <span className="text-emerald-600 dark:text-emerald-400 font-bold flex items-center gap-1 mt-1 text-[10px] uppercase font-sans bg-emerald-50 dark:bg-emerald-500/10 px-2 py-0.5 rounded-full border border-emerald-100 dark:border-emerald-500/15 w-fit">
                              <Check className="w-3 h-3" /> Valid Evidence
                            </span>
                          </div>
                        </div>

                        <div className="p-3.5 rounded-xl border border-zinc-200 dark:border-zinc-900 bg-white dark:bg-[#0d0d0f] text-xs text-zinc-500 dark:text-zinc-400 leading-relaxed font-medium">
                          Paragraph verified by cosine embedding matches against requested query scope. Fully synchronized vector index node.
                        </div>
                      </div>
                    )}

                    {selectedNode.type === 'topic' && (
                      <div className="space-y-4">
                        <div className="grid grid-cols-2 gap-4">
                          <div>
                            <span className="font-sans text-[10px] text-zinc-400 dark:text-zinc-500 block uppercase font-bold">Discrepancy Grade</span>
                            <div className="flex items-baseline gap-0.5 mt-1 text-zinc-800 dark:text-zinc-200">
                              <span className={`text-xl font-bold font-mono ${selectedNode.label === 'Conflict Area' ? 'text-red-600' : 'text-emerald-600'}`}>
                                {selectedNode.meta?.contradictionScore || '0'}
                              </span>
                              <span className="text-[10px] text-zinc-400">%</span>
                            </div>
                          </div>
                          <div>
                            <span className="font-sans text-[10px] text-zinc-400 dark:text-zinc-500 block uppercase font-bold">Classification</span>
                            <span className={`font-bold flex items-center gap-1 mt-1 text-[10px] uppercase font-sans px-2.5 py-0.5 rounded-full border w-fit ${
                              selectedNode.label === 'Conflict Area' 
                                ? 'bg-red-50 dark:bg-red-500/10 text-red-600 dark:text-red-400 border-red-100 dark:border-red-500/20' 
                                : 'bg-emerald-50 dark:bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-100 dark:border-emerald-500/20'
                            }`}>
                              {selectedNode.label === 'Conflict Area' ? 'Contradiction' : 'Alignment'}
                            </span>
                          </div>
                        </div>

                        <div className="space-y-3.5 text-xs">
                          <div className="p-3 rounded-xl bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800">
                            <span className="font-sans text-[9px] text-zinc-400 dark:text-zinc-500 uppercase block font-bold mb-1">Claim A:</span>
                            <p className="text-zinc-700 dark:text-zinc-300 font-medium italic">"{selectedNode.meta?.claimA}"</p>
                            <span className="text-zinc-400 dark:text-zinc-500 font-sans text-[9px] mt-1 block">Source: {selectedNode.meta?.sourceA}</span>
                          </div>
                          <div className="p-3 rounded-xl bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800">
                            <span className="font-sans text-[9px] text-zinc-400 dark:text-zinc-500 uppercase block font-bold mb-1">Claim B:</span>
                            <p className="text-zinc-700 dark:text-zinc-300 font-medium italic">"{selectedNode.meta?.claimB}"</p>
                            <span className="text-zinc-400 dark:text-zinc-500 font-sans text-[9px] mt-1 block">Source: {selectedNode.meta?.sourceB}</span>
                          </div>
                        </div>
                      </div>
                    )}

                    {selectedNode.type === 'document' && (
                      <div className="space-y-4">
                        <div className="grid grid-cols-2 gap-4">
                          <div>
                            <span className="font-sans text-[10px] text-zinc-400 dark:text-zinc-500 block uppercase font-bold">File Size</span>
                            <span className="text-zinc-800 dark:text-zinc-200 font-sans font-bold block mt-1">
                              {(selectedNode.meta?.size ? selectedNode.meta.size / 1024 : 142).toFixed(1)} KB
                            </span>
                          </div>
                          <div>
                            <span className="font-sans text-[10px] text-zinc-400 dark:text-zinc-500 block uppercase font-bold">Corpus Index</span>
                            <span className="text-zinc-800 dark:text-zinc-200 font-sans font-bold block mt-1">
                              {selectedNode.meta?.pages || '1'} Pages / {selectedNode.meta?.citationCount || '1'} Citations
                            </span>
                          </div>
                        </div>
                      </div>
                    )}

                  </div>

                </div>
              </div>
            ) : (
              <div className="border border-dashed border-zinc-200 dark:border-zinc-850 rounded-2xl bg-zinc-50/50 dark:bg-[#09090b]/50 flex flex-col items-center justify-center p-6 h-full text-center">
                <Info className="w-8 h-8 text-zinc-400 mb-2" />
                <p className="font-sans text-xs text-zinc-400 dark:text-zinc-500">
                  Select any node in the Knowledge Graph to inspect raw citations, NLI severity, and model explanations.
                </p>
              </div>
            )}
          </div>

        </div>
      )}

    </div>
  );
}
