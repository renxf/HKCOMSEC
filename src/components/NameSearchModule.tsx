import React, { useState } from 'react';
import { CompanyNameInfo, LogEntry, SearchResult } from '../types';
import { RpaTerminal } from './RpaTerminal';
import { Play, RotateCcw, AlertTriangle, ShieldCheck, FileCheck, CheckCircle2, XCircle, Search, Lightbulb } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

export function NameSearchModule() {
  const [companyInfo, setCompanyInfo] = useState<CompanyNameInfo>({
    chineseName: '',
    englishName: '',
  });

  const [aiPrompt, setAiPrompt] = useState('');
  const [aiSuggesting, setAiSuggesting] = useState(false);
  const [suggestedNames, setSuggestedNames] = useState<{en: string, zh: string}[]>([]);

  const [status, setStatus] = useState<'idle' | 'running' | 'success' | 'error'>('idle');
  const [logs, setLogs] = useState<LogEntry[]>([]);
  const [result, setResult] = useState<SearchResult | null>(null);

  const addLog = (message: string, type: LogEntry['type'] = 'info') => {
    const now = new Date();
    const timeStr = `${now.getHours().toString().padStart(2, '0')}:${now.getMinutes().toString().padStart(2, '0')}:${now.getSeconds().toString().padStart(2, '0')}.${now.getMilliseconds().toString().padStart(3, '0')}`;
    
    setLogs(prev => [...prev, {
      id: Math.random().toString(36).substring(7),
      timestamp: timeStr,
      message,
      type
    }]);
  };

  const handleSuggestNames = async () => {
    if (!aiPrompt.trim()) {
      alert("Please enter a brief business description / 请输入简短的业务描述");
      return;
    }

    setAiSuggesting(true);
    setSuggestedNames([]);
    
    try {
      const response = await fetch("/api/suggest-names", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ prompt: aiPrompt })
      });
      
      const data = await response.json();
      if (!response.ok) {
        throw new Error(data.error || "Failed to generate suggestions");
      }
      
      if (data.suggestions && Array.isArray(data.suggestions)) {
        setSuggestedNames(data.suggestions);
      }
    } catch (err: any) {
      alert("Error: " + err.message);
    } finally {
      setAiSuggesting(false);
    }
  };

  const handleStartRpa = async () => {
    if (!companyInfo.chineseName && !companyInfo.englishName) {
      alert("Please enter the proposed Chinese or English company name / 请输入拟注册的中文或英文公司名称");
      return;
    }

    setStatus('running');
    setLogs([]);
    setResult(null);

    try {
      const response = await fetch("/api/rpa/search", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          chineseName: companyInfo.chineseName,
          englishName: companyInfo.englishName
        })
      });

      if (!response.body) throw new Error("No response body");

      const reader = response.body.getReader();
      const decoder = new TextDecoder("utf-8");
      
      let finalResult = null;
      let finalStatus: "error" | "success" = "success";

      while (true) {
        const { done, value } = await reader.read();
        if (done) break;

        const chunk = decoder.decode(value, { stream: true });
        const lines = chunk.split('\n\n');
        
        for (const line of lines) {
          if (line.startsWith('data: ')) {
            try {
              const data = JSON.parse(line.substring(6));
              if (data.message) {
                addLog(data.message, data.type as LogEntry['type']);
                if (data.type === 'error') {
                   finalStatus = 'error';
                }
              }
              if (data.result) {
                finalResult = data.result;
                if (!data.result.isAvailable) finalStatus = 'error';
              }
            } catch (e) {
              // chunking parse error potentially, ignoring for simplistic RPA terminal
            }
          }
        }
      }

      setStatus(finalStatus);
      if (finalResult) {
        setResult(finalResult);
      } else {
        setResult({
          isAvailable: false,
          conflictingNames: [],
          remarks: "No parseable result returned from engine.",
          checkedAt: new Date().toLocaleString()
        });
      }

    } catch (err: any) {
       addLog(`Network Error: Failed to reach RPA backend (${err.message})`, "error");
       setStatus("error");
    }
  };

  return (
    <div className="flex-1 flex flex-col bg-[#f8f9fa] font-sans text-[#1a1a1a] overflow-hidden w-full h-full">
      <div className="h-10 bg-white border-b border-gray-200 flex items-center px-6 justify-between shrink-0">
        <div className="flex items-center space-x-3 text-xs font-medium text-gray-500">
          <span className="text-blue-600">Search Module</span>
          <span>/</span>
          <span className="text-gray-900">Company Name Check</span>
        </div>
        <div className="text-[10px] uppercase tracking-widest text-gray-400 font-bold">
          Session ID: CR-8839-XZQ
        </div>
      </div>

      <div className="flex-1 flex overflow-hidden">
        {/* Left Column: Input Form */}
        <div className="w-1/2 p-6 overflow-y-auto border-r border-gray-200 flex flex-col gap-6 bg-white">
          
          <div>
            <h3 className="text-lg font-serif italic text-gray-800 mb-6 border-b pb-2 flex items-center">
              <Lightbulb className="w-5 h-5 text-gray-400 mr-2" />
              AI Name Suggestion / 智能助手起名
            </h3>
            <div className="space-y-4">
              <div>
                 <label className="block text-[11px] uppercase font-bold text-gray-500 mb-1">Company Description / 业务描述</label>
                 <textarea 
                   rows={3}
                   value={aiPrompt}
                   onChange={e => setAiPrompt(e.target.value)}
                   className="w-full bg-white border border-gray-300 rounded px-3 py-2 text-sm focus:outline-none focus:ring-2 ring-blue-500/20"
                   placeholder="e.g. A technology company specializing in artificial intelligence and automation / 例如：一家专注于人工智能和自动化的科技公司"
                 />
              </div>
              <button
                onClick={handleSuggestNames}
                disabled={aiSuggesting}
                className={`w-full flex items-center justify-center py-2 px-4 rounded shadow-sm text-sm font-medium text-white transition-colors disabled:opacity-70 disabled:cursor-not-allowed uppercase tracking-wider
                  ${aiSuggesting 
                    ? 'bg-indigo-400' 
                    : 'bg-indigo-600 hover:bg-indigo-700 active:scale-[0.99]'
                  }`}
              >
                {aiSuggesting ? (
                  <>
                    <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin mr-2" />
                    Generating / 正在生成...
                  </>
                ) : (
                  'Suggest Names / 智能起名'
                )}
              </button>
              
              {suggestedNames.length > 0 && (
                <div className="mt-4 space-y-2">
                  <label className="block text-[11px] uppercase font-bold text-gray-500 mb-1">AI Suggestions (Click to apply) / AI 推荐</label>
                  {suggestedNames.map((namePair, idx) => (
                    <div key={idx} className="bg-white border top border-gray-200 rounded p-2 text-sm cursor-pointer hover:border-indigo-300 hover:bg-indigo-50 transition-colors" onClick={() => {
                        setCompanyInfo({ chineseName: namePair.zh, englishName: namePair.en });
                    }}>
                      <div className="font-bold text-gray-800">{namePair.en}</div>
                      <div className="text-gray-600">{namePair.zh}</div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>

          <div className="mt-4">
            <h3 className="text-lg font-serif italic text-gray-800 mb-4 border-b pb-2 flex items-center">
              <Search className="w-5 h-5 text-gray-400 mr-2" />
              Target Search Strings
            </h3>
            
            <div className="space-y-4">
              <div>
                 <label className="block text-[11px] uppercase font-bold text-gray-500 mb-1">Proposed Chinese Name / 拟注册中文名称</label>
                 <div className="relative">
                    <input 
                      type="text" 
                      value={companyInfo.chineseName}
                      onChange={e => setCompanyInfo({...companyInfo, chineseName: e.target.value})}
                      className="w-full bg-white border border-gray-300 rounded pl-3 pr-16 py-2 text-sm focus:outline-none focus:ring-2 ring-blue-500/20 placeholder:text-gray-400"
                      placeholder="e.g. 普罗米修斯科技有限公司"
                    />
                    <div className="absolute inset-y-0 right-0 pr-3 flex items-center pointer-events-none">
                      <span className="text-[10px] font-mono text-gray-400 font-bold">ZH-HK</span>
                    </div>
                 </div>
              </div>

              <div>
                 <label className="block text-[11px] uppercase font-bold text-gray-500 mb-1">Proposed English Name / 拟注册英文名称</label>
                 <div className="relative">
                    <input 
                      type="text" 
                      value={companyInfo.englishName}
                      onChange={e => setCompanyInfo({...companyInfo, englishName: e.target.value})}
                      className="w-full bg-white border border-gray-300 rounded pl-3 pr-16 py-2 text-sm focus:outline-none focus:ring-2 ring-blue-500/20 placeholder:text-gray-400"
                      placeholder="e.g. PROMETHEUS TECHNOLOGY LIMITED"
                    />
                    <div className="absolute inset-y-0 right-0 pr-3 flex items-center pointer-events-none">
                      <span className="text-[10px] font-mono text-gray-400 font-bold">EN</span>
                    </div>
                 </div>
              </div>
            </div>

            <div className="mt-8">
              <button
                onClick={handleStartRpa}
                disabled={status === 'running'}
                className={`w-full flex items-center justify-center py-2 px-4 rounded shadow-sm text-sm font-medium text-white transition-colors disabled:opacity-70 disabled:cursor-not-allowed uppercase tracking-wider
                  ${status === 'running' 
                    ? 'bg-blue-400' 
                    : 'bg-blue-600 hover:bg-blue-700 active:scale-[0.99]'
                  }`}
              >
                {status === 'running' ? (
                  <>
                    <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin mr-2" />
                    Executing Search...
                  </>
                ) : (
                  <>
                    {status === 'idle' ? 'Start Search / 开始查册' : 'Restart Session / 重新查册'}
                  </>
                )}
              </button>
              
              <div className="mt-4 p-4 bg-indigo-50 border-l-4 border-indigo-500 text-indigo-800 text-xs">
                <strong>Data Source Note:</strong> The tool uses the official API of data.gov.hk to query data under the "Company Name Search" category for both Local and Foreign entities.
              </div>
            </div>
          </div>
        </div>

        {/* Right Column: Terminal & Results */}
        <div className="w-1/2 flex flex-col bg-white overflow-hidden border-l border-gray-200">
          
          <div className="h-1/2 min-h-[300px] border-b border-gray-200">
             <RpaTerminal logs={logs} status={status} />
          </div>

          <div className="h-1/2 p-4 overflow-y-auto bg-gray-50 flex flex-col">
            <div className="flex items-center justify-between mb-3 shrink-0">
              <h4 className="text-[11px] font-bold text-gray-500 uppercase tracking-wider">Captured Data Result</h4>
              {result && (
                 <span className="text-[10px] bg-white px-2 py-0.5 rounded border border-gray-200 shadow-sm text-gray-500">{result.checkedAt}</span>
              )}
            </div>
            
            {!result ? (
               <div className="flex-1 flex items-center justify-center text-xs text-gray-400 font-mono border border-dashed border-gray-300 rounded bg-white">
                 Awaiting execution results...
               </div>
            ) : (
               <motion.div 
                 initial={{ opacity: 0 }}
                 animate={{ opacity: 1 }}
                 className="bg-white border top border-gray-200 flex-1 relative flex flex-col"
               >
                 <table className="w-full text-xs">
                   <thead>
                     <tr className="bg-gray-100 border-b border-gray-200">
                       <th className="py-2 px-3 text-left font-bold text-gray-600">Company Name</th>
                       <th className="py-2 px-3 text-left font-bold text-gray-600">Status</th>
                       <th className="py-2 px-3 text-left font-bold text-gray-600 w-1/3">Remarks</th>
                     </tr>
                   </thead>
                   <tbody className="divide-y divide-gray-100">
                     <tr className="hover:bg-blue-50/50">
                       <td className="py-3 px-3 font-medium text-gray-800">
                         {companyInfo.englishName || companyInfo.chineseName || 'N/A'}
                       </td>
                       <td className="py-3 px-3">
                         <span className={`px-2 py-0.5 rounded text-[10px] font-bold tracking-wider ${
                           result.isAvailable ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'
                         }`}>
                           {result.isAvailable ? 'AVAILABLE' : 'TAKEN'}
                         </span>
                       </td>
                       <td className="py-3 px-3 text-gray-600 italic break-words" title={result.remarks}>
                         {result.remarks}
                       </td>
                     </tr>
                   </tbody>
                 </table>
                 
                 {!result.isAvailable && result.conflictingNames && result.conflictingNames.length > 0 && (
                   <div className="p-4 border-t border-gray-200 mt-auto bg-gray-50">
                     <div className="text-[11px] font-bold text-gray-500 uppercase tracking-wider mb-2">Conflicting Extracted Entities</div>
                     <ul className="space-y-1">
                       {result.conflictingNames.map((name, idx) => (
                         <li key={idx} className="text-xs font-mono text-gray-700 bg-white px-2 py-1 border border-gray-200 rounded">{name}</li>
                       ))}
                     </ul>
                   </div>
                 )}
               </motion.div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
