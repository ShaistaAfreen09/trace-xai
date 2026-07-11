/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { 
  LayoutDashboard, 
  FileText, 
  Search, 
  ShieldAlert, 
  CalendarRange, 
  FileBarChart2, 
  Settings as SettingsIcon, 
  LogOut,
  GitFork,
  ChevronLeft,
  ChevronRight,
  Sun,
  Moon,
  Monitor,
  Bell
} from 'lucide-react';

interface SidebarProps {
  activeTab: string;
  onNavigate: (tab: string) => void;
  user: { name: string; email: string } | null;
  onLogout: () => void;
  theme: 'dark' | 'light' | 'system';
  setTheme: (theme: 'dark' | 'light' | 'system') => void;
}

export default function Sidebar({ 
  activeTab, 
  onNavigate, 
  user, 
  onLogout,
  theme,
  setTheme
}: SidebarProps) {
  const [isCollapsed, setIsCollapsed] = useState(false);
  const [showNotifications, setShowNotifications] = useState(false);

  const menuItems = [
    { id: 'dashboard', name: 'Dashboard', icon: LayoutDashboard },
    { id: 'repository', name: 'Document Repository', icon: FileText },
    { id: 'query', name: 'Query Analysis', icon: Search },
    { id: 'explorer', name: 'Conflict Explorer', icon: ShieldAlert },
    { id: 'timeline', name: 'Timeline View', icon: CalendarRange },
    { id: 'graph', name: 'Knowledge Graph', icon: GitFork },
    { id: 'reports', name: 'Reports', icon: FileBarChart2 },
    { id: 'settings', name: 'Settings', icon: SettingsIcon }
  ];

  const notifications = [
    { id: 1, text: 'Integrity scan completed for space_shuttle_challenger_design_review_1985.txt', time: '5m ago' },
    { id: 2, text: 'New contradiction identified in nasa_launch_clearance_memo_1986.txt', time: '12m ago' }
  ];

  return (
    <aside 
      className={`border-r border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-950 flex flex-col justify-between shrink-0 h-screen sticky top-0 z-40 select-none transition-all duration-300 ${
        isCollapsed ? 'w-16' : 'w-64'
      }`}
    >
      
      {/* Top logo & Collapse Toggle */}
      <div className="space-y-4">
        <div className="p-4 border-b border-zinc-100 dark:border-zinc-900 flex items-center justify-between">
          {!isCollapsed && (
            <div className="flex items-center gap-2.5 overflow-hidden">
              <div className="w-8 h-8 rounded-lg border border-cyan-500/30 flex items-center justify-center bg-zinc-900 shrink-0">
                <span className="font-sans text-xs text-cyan-400 font-extrabold tracking-tighter">TX</span>
              </div>
              <div className="flex flex-col truncate">
                <span className="font-sans font-extrabold tracking-tight text-sm text-zinc-900 dark:text-zinc-100">TRACE-XAI</span>
                <span className="font-sans text-[9px] tracking-wider text-cyan-500 dark:text-cyan-400 font-semibold uppercase">PLATFORM</span>
              </div>
            </div>
          )}
          {isCollapsed && (
            <div className="w-8 h-8 rounded-lg border border-cyan-500/30 flex items-center justify-center bg-zinc-900 shrink-0 mx-auto">
              <span className="font-sans text-xs text-cyan-400 font-extrabold tracking-tighter">TX</span>
            </div>
          )}
          
          <button 
            onClick={() => setIsCollapsed(!isCollapsed)}
            className="p-1 rounded-md hover:bg-zinc-100 dark:hover:bg-zinc-900 text-zinc-400 hover:text-zinc-600 dark:hover:text-zinc-200 transition-colors"
          >
            {isCollapsed ? <ChevronRight className="w-4 h-4" /> : <ChevronLeft className="w-4 h-4" />}
          </button>
        </div>

        {/* Navigation list */}
        <nav className="px-3 space-y-1">
          {menuItems.map((item) => {
            const isActive = activeTab === item.id;
            return (
              <button
                key={item.id}
                onClick={() => onNavigate(item.id)}
                className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-xs font-sans font-medium transition-all relative group ${
                  isActive 
                    ? 'bg-cyan-50 dark:bg-zinc-900 text-cyan-600 dark:text-cyan-400 border border-cyan-100 dark:border-zinc-800' 
                    : 'text-zinc-600 dark:text-zinc-400 hover:text-zinc-900 dark:hover:text-zinc-200 hover:bg-zinc-50 dark:hover:bg-zinc-900/50'
                }`}
                title={isCollapsed ? item.name : undefined}
              >
                <item.icon className={`w-4 h-4 shrink-0 ${isActive ? 'text-cyan-600 dark:text-cyan-400' : 'text-zinc-400 dark:text-zinc-500 group-hover:text-zinc-600 dark:group-hover:text-zinc-300'}`} />
                {!isCollapsed && <span className="truncate">{item.name}</span>}
                
                {/* Tooltip on hover when collapsed */}
                {isCollapsed && (
                  <div className="absolute left-14 top-1/2 -translate-y-1/2 bg-zinc-950 text-white text-[10px] px-2 py-1 rounded opacity-0 pointer-events-none group-hover:opacity-100 group-hover:pointer-events-auto transition-opacity z-50 whitespace-nowrap shadow-md border border-zinc-800">
                    {item.name}
                  </div>
                )}
              </button>
            );
          })}
        </nav>
      </div>

      {/* Bottom Profile info, Theme, Notifications */}
      <div className="p-3 border-t border-zinc-100 dark:border-zinc-900 bg-zinc-50/50 dark:bg-zinc-950 space-y-3 relative">
        
        {/* Notifications & Theme toggles */}
        <div className="flex items-center justify-around gap-1">
          {/* Notifications Trigger */}
          <div className="relative">
            <button 
              onClick={() => setShowNotifications(!showNotifications)}
              className="p-1.5 rounded-md hover:bg-zinc-150 dark:hover:bg-zinc-900 text-zinc-500 hover:text-zinc-800 dark:text-zinc-400 dark:hover:text-zinc-200 transition-colors relative"
              title="Notifications"
            >
              <Bell className="w-4 h-4" />
              <span className="absolute top-1 right-1 w-1.5 h-1.5 rounded-full bg-cyan-500" />
            </button>
            
            {showNotifications && !isCollapsed && (
              <div className="absolute bottom-10 left-0 w-64 bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-xl p-3 shadow-xl z-50 space-y-2">
                <div className="flex justify-between items-center pb-1.5 border-b border-zinc-100 dark:border-zinc-800">
                  <span className="text-[10px] font-semibold text-zinc-500 uppercase tracking-wider">NOTIFICATIONS</span>
                  <button onClick={() => setShowNotifications(false)} className="text-[10px] text-zinc-400 hover:text-zinc-600">Dismiss</button>
                </div>
                <div className="space-y-2 max-h-48 overflow-y-auto">
                  {notifications.map(n => (
                    <div key={n.id} className="text-[11px] text-zinc-600 dark:text-zinc-300 leading-snug">
                      <p>{n.text}</p>
                      <span className="text-[9px] text-zinc-400 font-mono">{n.time}</span>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Theme switcher segmented control (hidden or miniature cycle when collapsed) */}
          {!isCollapsed ? (
            <div className="flex items-center gap-0.5 p-0.5 bg-zinc-200/50 dark:bg-zinc-900 rounded-lg border border-zinc-200 dark:border-zinc-800/80">
              <button
                onClick={() => setTheme('light')}
                className={`p-1 rounded-md transition-all ${theme === 'light' ? 'bg-white dark:bg-zinc-800 text-zinc-900 dark:text-zinc-100 shadow-sm' : 'text-zinc-400 hover:text-zinc-600'}`}
                title="Light mode"
              >
                <Sun className="w-3.5 h-3.5" />
              </button>
              <button
                onClick={() => setTheme('dark')}
                className={`p-1 rounded-md transition-all ${theme === 'dark' ? 'bg-white dark:bg-zinc-800 text-zinc-900 dark:text-zinc-100 shadow-sm' : 'text-zinc-400 hover:text-zinc-600'}`}
                title="Dark mode"
              >
                <Moon className="w-3.5 h-3.5" />
              </button>
              <button
                onClick={() => setTheme('system')}
                className={`p-1 rounded-md transition-all ${theme === 'system' ? 'bg-white dark:bg-zinc-800 text-zinc-900 dark:text-zinc-100 shadow-sm' : 'text-zinc-400 hover:text-zinc-600'}`}
                title="System mode"
              >
                <Monitor className="w-3.5 h-3.5" />
              </button>
            </div>
          ) : (
            <button
              onClick={() => {
                const cycle: ('light' | 'dark' | 'system')[] = ['light', 'dark', 'system'];
                const next = cycle[(cycle.indexOf(theme) + 1) % cycle.length];
                setTheme(next);
              }}
              className="p-1.5 rounded-md hover:bg-zinc-150 dark:hover:bg-zinc-900 text-zinc-500 hover:text-zinc-800 dark:text-zinc-400 dark:hover:text-zinc-200 transition-colors"
              title={`Theme: ${theme}`}
            >
              {theme === 'light' ? <Sun className="w-4 h-4" /> : theme === 'dark' ? <Moon className="w-4 h-4" /> : <Monitor className="w-4 h-4" />}
            </button>
          )}
        </div>

        {/* Profile details */}
        {user && (
          <div className="space-y-2">
            <div className="flex items-center gap-2.5 p-1.5 rounded-lg border border-zinc-100 dark:border-zinc-900 bg-white dark:bg-zinc-950">
              <div className="w-7 h-7 rounded-full bg-gradient-to-tr from-cyan-500 to-blue-600 text-white flex items-center justify-center shrink-0 font-sans font-bold text-xs select-none shadow-sm">
                {user.name.split(' ').map(n => n[0]).join('').substring(0, 2).toUpperCase()}
              </div>
              {!isCollapsed && (
                <div className="flex flex-col truncate leading-tight">
                  <span className="font-sans font-semibold text-xs text-zinc-800 dark:text-zinc-200 truncate">{user.name}</span>
                  <span className="font-mono text-[9px] text-zinc-500 dark:text-zinc-400 truncate">{user.email}</span>
                </div>
              )}
            </div>

            <button
              onClick={onLogout}
              className={`w-full py-2 rounded-lg border border-zinc-200 dark:border-zinc-850 hover:border-red-200 dark:hover:border-red-900/30 bg-white dark:bg-zinc-950 hover:bg-red-50 dark:hover:bg-red-950/20 text-zinc-500 hover:text-red-600 dark:text-zinc-400 dark:hover:text-red-400 font-sans text-xs font-semibold transition-all flex items-center justify-center gap-1.5 cursor-pointer ${
                isCollapsed ? 'px-0' : 'px-3'
              }`}
            >
              <LogOut className="w-4 h-4" />
              {!isCollapsed && <span>Sign Out</span>}
            </button>
          </div>
        )}
      </div>

    </aside>
  );
}
