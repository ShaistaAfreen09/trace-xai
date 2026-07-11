/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from 'react';
import LandingPage from './pages/LandingPage';
import Dashboard from './pages/Dashboard';
import DocumentRepository from './pages/DocumentRepository';
import QueryAnalysis from './pages/QueryAnalysis';
import ConflictExplorer from './pages/ConflictExplorer';
import TimelineView from './pages/TimelineView';
import KnowledgeGraph from './pages/KnowledgeGraph';
import Reports from './pages/Reports';
import Settings from './pages/Settings';
import Sidebar from './components/Sidebar';
import EngineeringGrid from './components/EngineeringGrid';
import { IndexedDocument, QueryAnalysisResult, ActivityLog, SystemStatus } from './types';

export default function App() {
  const [user, setUser] = useState<{ name: string; email: string } | null>(null);
  const [activeTab, setActiveTab] = useState<string>('dashboard');
  const [theme, setTheme] = useState<'dark' | 'light' | 'system'>(() => {
    return (localStorage.getItem('trace_theme') as 'dark' | 'light' | 'system') || 'dark';
  });
  
  // Real data state synced with Node.js backend
  const [documents, setDocuments] = useState<IndexedDocument[]>([]);
  const [queryHistory, setQueryHistory] = useState<QueryAnalysisResult[]>([]);
  const [activityLogs, setActivityLogs] = useState<ActivityLog[]>([]);
  const [systemStatus, setSystemStatus] = useState<SystemStatus | null>(null);

  // Apply active theme to document root
  useEffect(() => {
    const root = document.documentElement;
    const applyTheme = (currentTheme: 'dark' | 'light' | 'system') => {
      root.classList.remove('dark', 'light');
      if (currentTheme === 'light') {
        root.classList.add('light');
      } else if (currentTheme === 'dark') {
        root.classList.add('dark');
      } else {
        const isDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
        if (isDark) {
          root.classList.add('dark');
        } else {
          root.classList.add('light');
        }
      }
    };

    applyTheme(theme);
    localStorage.setItem('trace_theme', theme);

    if (theme === 'system') {
      const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)');
      const listener = (e: MediaQueryListEvent) => {
        root.classList.remove('dark', 'light');
        if (e.matches) {
          root.classList.add('dark');
        } else {
          root.classList.add('light');
        }
      };
      mediaQuery.addEventListener('change', listener);
      return () => mediaQuery.removeEventListener('change', listener);
    }
  }, [theme]);

  // Load user session from local storage on mount
  useEffect(() => {
    const cachedUser = localStorage.getItem('trace_user');
    if (cachedUser) {
      setUser(JSON.parse(cachedUser));
    }
  }, []);

  // Fetch full system telemetry and dataset indexes
  const fetchState = async () => {
    try {
      // Parallel fetch for speed
      const [statusRes, docsRes, histRes, logsRes] = await Promise.all([
        fetch('/api/status'),
        fetch('/api/documents'),
        fetch('/api/query/history'),
        fetch('/api/activity')
      ]);

      if (statusRes.ok) {
        const statusData = await statusRes.json();
        setSystemStatus({
          api: statusData.api,
          vectorDb: statusData.vectorDb,
          firebase: statusData.firebase,
          gemini: statusData.gemini
        });
      }

      if (docsRes.ok) {
        const docsData = await docsRes.json();
        setDocuments(docsData);
      }

      if (histRes.ok) {
        const histData = await histRes.json();
        setQueryHistory(histData);
      }

      if (logsRes.ok) {
        const logsData = await logsRes.json();
        setActivityLogs(logsData);
      }
    } catch (err) {
      console.error('Error fetching TRACE-XAI state:', err);
    }
  };

  // Poll system and state updates periodically if researcher is authenticated
  useEffect(() => {
    if (user) {
      fetchState();
      const interval = setInterval(fetchState, 6000);
      return () => clearInterval(interval);
    }
  }, [user]);

  const handleLogin = (name: string, email: string) => {
    const newUser = { name, email };
    setUser(newUser);
    localStorage.setItem('trace_user', JSON.stringify(newUser));
    setActiveTab('dashboard');
  };

  const handleLogout = () => {
    setUser(null);
    localStorage.removeItem('trace_user');
  };

  // Upload and Parse raw document
  const handleUploadDocument = async (name: string, content: string, forcedYear?: string) => {
    try {
      const response = await fetch('/api/documents/upload', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name, content, forcedYear })
      });

      if (!response.ok) {
        const errData = await response.json();
        throw new Error(errData.error || 'Failed to ingest file.');
      }

      // Refresh documents and trails immediately
      await fetchState();
    } catch (err: any) {
      console.error('Upload failed:', err);
      alert(`Ingestion failed: ${err.message}`);
    }
  };

  // Execute Temporal semantic inquiry
  const handleExecuteQuery = async (queryText: string) => {
    try {
      const response = await fetch('/api/query', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ query: queryText })
      });

      if (!response.ok) {
        const errData = await response.json();
        throw new Error(errData.error || 'Query resolution failed.');
      }

      // Refresh query index and activities trail
      await fetchState();
    } catch (err: any) {
      console.error('Query failed:', err);
      alert(`Analysis failure: ${err.message}`);
    }
  };

  // Clear system index and cache state
  const handleResetSystem = async () => {
    const confirmWipe = window.confirm('Are you sure you want to completely wipe all document indexes and query history?');
    if (!confirmWipe) return;

    try {
      const response = await fetch('/api/reset', { method: 'POST' });
      if (response.ok) {
        await fetchState();
        setActiveTab('dashboard');
      }
    } catch (err) {
      console.error('Reset failed:', err);
    }
  };

  // Authentication Guard
  if (!user) {
    return <LandingPage onLogin={handleLogin} />;
  }

  // Active sub-page rendering helper
  const renderContent = () => {
    switch (activeTab) {
      case 'dashboard':
        return (
          <Dashboard 
            documents={documents} 
            queryHistory={queryHistory} 
            activityLogs={activityLogs} 
            systemStatus={systemStatus}
            onNavigate={setActiveTab}
          />
        );
      case 'repository':
        return (
          <DocumentRepository 
            documents={documents} 
            onUpload={handleUploadDocument}
            onReset={handleResetSystem}
          />
        );
      case 'query':
        return (
          <QueryAnalysis 
            documents={documents} 
            queryHistory={queryHistory} 
            onExecuteQuery={handleExecuteQuery}
          />
        );
      case 'explorer':
        return <ConflictExplorer queryHistory={queryHistory} />;
      case 'timeline':
        return <TimelineView documents={documents} queryHistory={queryHistory} />;
      case 'graph':
        return <KnowledgeGraph queryHistory={queryHistory} documents={documents} />;
      case 'reports':
        return <Reports documents={documents} queryHistory={queryHistory} />;
      case 'settings':
        return <Settings systemStatus={systemStatus} onReset={handleResetSystem} />;
      default:
        return <Dashboard documents={documents} queryHistory={queryHistory} activityLogs={activityLogs} systemStatus={systemStatus} onNavigate={setActiveTab} />;
    }
  };

  return (
    <div className="flex h-screen bg-transparent text-zinc-900 dark:text-[#F5F5F5] font-sans overflow-hidden relative">
      <EngineeringGrid />
      <Sidebar 
        activeTab={activeTab} 
        onNavigate={setActiveTab} 
        user={user} 
        onLogout={handleLogout} 
        theme={theme}
        setTheme={setTheme}
      />
      <main className="flex-grow overflow-y-auto z-10">
        {renderContent()}
      </main>
    </div>
  );
}
