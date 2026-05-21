import React from 'react';
import { motion } from 'motion/react';
import { Building2, Search, FileText, Settings, ShieldAlert, LogOut, Command } from 'lucide-react';

interface SidebarProps {
  activeTab: string;
  setActiveTab: (tab: string) => void;
}

export function Sidebar({ activeTab, setActiveTab }: SidebarProps) {
  const menuItems = [
    { id: 'dashboard', label: 'Dashboard / 控制台', icon: Command },
    { id: 'name-search', label: 'Name Search / 名称查册', icon: Search },
    { id: 'registration', label: 'Auto Reg / 自动注册 (WIP)', icon: Building2 },
    { id: 'documents', label: 'Documents / 文件生成', icon: FileText },
    { id: 'settings', label: 'Settings / 系统设置', icon: Settings },
  ];

  return (
    <div className="w-64 bg-gray-50 border-r border-gray-200 flex flex-col h-full text-[#1a1a1a] font-sans">
      <div className="h-14 bg-[#1e293b] text-white flex items-center px-6 shrink-0">
        <div className="w-8 h-8 rounded-md flex items-center justify-center bg-blue-500 font-bold text-lg mr-3 shadow-sm border border-blue-400/50">R</div>
        <span className="text-lg font-semibold tracking-tight">HK-Reg RPA <span className="text-blue-400 font-normal">v2</span></span>
      </div>
      
      <div className="flex-1 py-4 px-4 space-y-1">
        <div className="px-2 mb-4 text-[11px] font-bold text-gray-400 uppercase tracking-wider">
          Automation Pipeline
        </div>
        {menuItems.map((item) => {
          const isActive = activeTab === item.id;
          return (
            <button
              key={item.id}
              onClick={() => setActiveTab(item.id)}
              className={`w-full flex items-center px-2 py-2 rounded transition-all duration-200 border ${
                isActive 
                  ? 'bg-blue-50 text-blue-700 border-blue-200' 
                  : 'bg-transparent border-transparent hover:bg-white hover:text-gray-700 hover:border-gray-200 hover:shadow-sm text-gray-600'
              }`}
            >
              <item.icon className={`w-4 h-4 mr-3 ${isActive ? 'text-blue-500' : 'text-gray-400'}`} />
              <span className="text-sm font-medium">{item.label}</span>
            </button>
          );
        })}
      </div>

      <div className="p-4 border-t border-gray-200 mt-auto">
        <div className="bg-gray-800 rounded-lg p-3 text-white">
          <div className="text-[10px] uppercase text-gray-400 mb-1">Bot Latency</div>
          <div className="text-xl font-mono flex items-baseline">142<span className="text-xs text-gray-500 ml-1">ms</span></div>
        </div>
      </div>
    </div>
  );
}
