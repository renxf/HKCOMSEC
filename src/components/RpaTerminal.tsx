import React, { useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { LogEntry } from '../types';
import { Terminal, CheckCircle2, XCircle, AlertCircle, Loader2 } from 'lucide-react';

interface RpaTerminalProps {
  logs: LogEntry[];
  status: 'idle' | 'running' | 'success' | 'error';
}

export function RpaTerminal({ logs, status }: RpaTerminalProps) {
  const endOfMessagesRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (endOfMessagesRef.current) {
      endOfMessagesRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  }, [logs]);

  const getLogIcon = (type: LogEntry['type']) => {
    switch (type) {
      case 'info': return <span className="text-blue-400 font-bold tracking-widest mr-2 uppercase">EXEC:</span>;
      case 'success': return <span className="text-green-400 font-bold tracking-widest mr-2 uppercase">SUCCESS:</span>;
      case 'error': return <span className="text-red-400 font-bold tracking-widest mr-2 uppercase">ERROR:</span>;
      case 'warning': return <span className="text-yellow-400 font-bold tracking-widest mr-2 uppercase">WARN:</span>;
    }
  };

  const getStatusColor = () => {
    switch (status) {
      case 'running': return 'text-yellow-400';
      case 'success': return 'text-green-400';
      case 'error': return 'text-red-400';
      default: return 'text-gray-500';
    }
  };

  return (
    <div className="flex flex-col h-full bg-[#0f172a] overflow-hidden font-mono text-[11px] leading-relaxed relative">
      {/* Terminal Header */}
      <div className="flex items-center justify-between mb-3 border-b border-gray-800 pb-2 p-4 shrink-0">
        <span className="text-green-400 uppercase tracking-widest flex items-center">
          <Terminal className="w-3 h-3 mr-2" /> Real-Time Execution Log
        </span>
        <div className="flex items-center space-x-2">
          {status === 'running' && <Loader2 className="w-3 h-3 text-blue-400 animate-spin" />}
          <span className={`uppercase font-bold tracking-widest ${getStatusColor()}`}>
             {status}
          </span>
        </div>
      </div>

      {/* Terminal Content */}
      <div className="flex-1 overflow-y-auto px-4 pb-4 space-y-1 text-gray-300">
        {logs.length === 0 ? (
          <div className="text-gray-600 flex items-center justify-center h-full text-[10px] uppercase tracking-widest">
            Awaiting task execution...
          </div>
        ) : (
          <AnimatePresence initial={false}>
            {logs.map((log) => (
              <motion.div
                key={log.id}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                className="flex items-start break-words"
              >
                <div className="text-gray-500 mr-2 shrink-0 select-none">[{log.timestamp.substring(0,8)}]</div>
                {getLogIcon(log.type)}
                <div className={`
                  ${log.type === 'error' ? 'text-red-400' : ''}
                  ${log.type === 'success' ? 'text-green-400' : ''}
                  ${log.type === 'warning' ? 'text-yellow-300' : ''}
                  ${log.type === 'info' ? 'text-white' : ''}
                `}>
                  {log.message}
                </div>
              </motion.div>
            ))}
          </AnimatePresence>
        )}
        <div ref={endOfMessagesRef} />
      </div>

      {status === 'running' && (
        <div className="absolute bottom-4 right-4 pointer-events-none">
          <div className="w-10 h-10 border-2 border-green-500/20 rounded-full flex items-center justify-center">
            <div className="w-6 h-6 bg-green-500/20 rounded-full animate-ping"></div>
          </div>
        </div>
      )}
    </div>
  );
}
