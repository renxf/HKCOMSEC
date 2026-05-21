import React, { useState } from 'react';
import { Sidebar } from './components/Sidebar';
import { NameSearchModule } from './components/NameSearchModule';

export default function App() {
  const [activeTab, setActiveTab] = useState('name-search');

  return (
    <div className="flex flex-col h-screen overflow-hidden selection:bg-blue-100 selection:text-blue-900">
      <div className="flex h-full flex-1 overflow-hidden bg-[#f8f9fa] text-[#1a1a1a] font-sans">
        <Sidebar activeTab={activeTab} setActiveTab={setActiveTab} />
        <main className="flex-1 flex flex-col overflow-hidden">
          {activeTab === 'name-search' ? (
            <NameSearchModule />
          ) : (
            <div className="h-full flex items-center justify-center flex-col text-gray-400">
              <div className="w-16 h-16 rounded bg-blue-50 border border-blue-200 flex items-center justify-center mb-4">
                 <svg className="w-8 h-8 text-blue-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                   <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19.428 15.428a2 2 0 00-1.022-.547l-2.387-.477a6 6 0 00-3.86.517l-.318.158a6 6 0 01-3.86.517L6.05 15.21a2 2 0 00-1.806.547M8 4h8l-1 1v5.172a2 2 0 00.586 1.414l5 5c1.26 1.26.367 3.414-1.415 3.414H4.828c-1.782 0-2.674-2.154-1.414-3.414l5-5A2 2 0 009 10.172V5L8 4z" />
                 </svg>
              </div>
              <h2 className="text-sm font-bold uppercase tracking-wider text-gray-500 mb-2">架构开发中</h2>
              <p className="text-xs text-gray-400">该模块正在由 RPA 工程团队接入中...</p>
            </div>
          )}
        </main>
      </div>
      
      {/* Footer Status Bar */}
      <footer className="h-8 bg-[#f1f5f9] border-t border-gray-300 flex items-center px-4 justify-between text-[10px] font-medium text-gray-500 shrink-0 font-sans">
        <div className="flex space-x-4 items-center">
          <div className="flex items-center">
            <span className="w-2 h-2 bg-blue-500 rounded-full mr-1.5"></span>
            WORKER_ID: 02-PROD-HK
          </div>
          <div>IP: 203.14.88.211 (HK Gateway)</div>
        </div>
        <div className="flex items-center space-x-4">
          <div>Uptime: 04h 22m 12s</div>
          <div className="text-gray-900 font-bold">E-SERVICES SYNC: ACTIVE</div>
        </div>
      </footer>
    </div>
  );
}

