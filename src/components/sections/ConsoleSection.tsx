import React, { useState } from 'react';
import {
  Terminal,
  Trash2,
  Copy,
  Download,
  Search,
  Filter,
  Check,
  AlertOctagon,
  AlertTriangle,
  Info,
  Layers,
  Usb
} from 'lucide-react';
import { ConsoleLog, LogLevel } from '../../types/pwaStudio';

interface ConsoleSectionProps {
  logs: ConsoleLog[];
  onClearLogs: () => void;
}

export const ConsoleSection: React.FC<ConsoleSectionProps> = ({ logs, onClearLogs }) => {
  const [filterLevel, setFilterLevel] = useState<'all' | 'error' | 'warn' | 'info' | 'bridge'>('all');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [copied, setCopied] = useState<boolean>(false);

  const filteredLogs = logs.filter((log) => {
    const matchesLevel = filterLevel === 'all' || log.level === filterLevel;
    const matchesSearch = searchQuery === '' || 
      log.message.toLowerCase().includes(searchQuery.toLowerCase()) ||
      log.source.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesLevel && matchesSearch;
  });

  const errorCount = logs.filter((l) => l.level === 'error').length;
  const warnCount = logs.filter((l) => l.level === 'warn').length;

  const handleCopyLogs = () => {
    const text = logs.map((l) => `[${l.timestamp}] [${l.level.toUpperCase()}] [${l.source}] ${l.message}`).join('\n');
    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleExportLogs = () => {
    const blob = new Blob([JSON.stringify(logs, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `pwa-studio-console-logs-${Date.now()}.json`;
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div className="h-full flex flex-col bg-[#1e1e1e] overflow-hidden select-none">
      {/* Console Top Toolbar */}
      <div className="bg-[#2d2d2d] border-b border-[#3c3c3c] px-4 py-2 flex flex-wrap items-center justify-between gap-3 text-xs shrink-0">
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-1.5 font-bold text-white">
            <Terminal className="w-4 h-4 text-[#89d185]" />
            <span>Consola de Diagnóstico & ADB Logs</span>
          </div>

          <span className="text-[#858585]">|</span>

          {/* Level Filter Buttons */}
          <div className="flex items-center bg-[#1e1e1e] border border-[#3c3c3c] rounded p-0.5">
            <button
              onClick={() => setFilterLevel('all')}
              className={`px-2 py-0.5 rounded text-[11px] font-medium transition-colors ${
                filterLevel === 'all' ? 'bg-[#007acc] text-white' : 'text-[#858585] hover:text-[#cccccc]'
              }`}
            >
              Todos ({logs.length})
            </button>
            <button
              onClick={() => setFilterLevel('error')}
              className={`px-2 py-0.5 rounded text-[11px] font-medium transition-colors ${
                filterLevel === 'error' ? 'bg-[#f14c4c] text-white' : 'text-[#858585] hover:text-[#cccccc]'
              }`}
            >
              Errores ({errorCount})
            </button>
            <button
              onClick={() => setFilterLevel('warn')}
              className={`px-2 py-0.5 rounded text-[11px] font-medium transition-colors ${
                filterLevel === 'warn' ? 'bg-[#cca700] text-black font-bold' : 'text-[#858585] hover:text-[#cccccc]'
              }`}
            >
              Warns ({warnCount})
            </button>
            <button
              onClick={() => setFilterLevel('bridge')}
              className={`px-2 py-0.5 rounded text-[11px] font-medium transition-colors ${
                filterLevel === 'bridge' ? 'bg-[#3794ff] text-white' : 'text-[#858585] hover:text-[#cccccc]'
              }`}
            >
              RPC Bridge
            </button>
          </div>
        </div>

        {/* Search & Action Controls */}
        <div className="flex items-center gap-2">
          <div className="flex items-center bg-[#1e1e1e] border border-[#3c3c3c] rounded px-2 py-1 w-48 focus-within:border-[#007acc]">
            <Search className="w-3.5 h-3.5 text-[#858585] mr-1.5 shrink-0" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Buscar evento..."
              className="bg-transparent text-white text-xs focus:outline-none w-full"
            />
          </div>

          <button
            onClick={handleCopyLogs}
            className="flex items-center gap-1 bg-[#252526] hover:bg-[#333333] border border-[#3c3c3c] text-[#cccccc] px-2.5 py-1 rounded transition-colors text-xs"
            title="Copiar todos los registros al portapapeles"
          >
            {copied ? <Check className="w-3.5 h-3.5 text-[#89d185]" /> : <Copy className="w-3.5 h-3.5 text-[#3794ff]" />}
            <span>{copied ? 'Copiado' : 'Copiar'}</span>
          </button>

          <button
            onClick={handleExportLogs}
            className="flex items-center gap-1 bg-[#252526] hover:bg-[#333333] border border-[#3c3c3c] text-[#cccccc] px-2.5 py-1 rounded transition-colors text-xs"
            title="Exportar archivo de registros JSON"
          >
            <Download className="w-3.5 h-3.5 text-[#89d185]" />
            <span>Exportar</span>
          </button>

          <button
            onClick={onClearLogs}
            className="p-1 text-[#858585] hover:text-[#f14c4c] bg-[#252526] border border-[#3c3c3c] rounded hover:bg-[#333333] transition-colors"
            title="Limpiar consola"
          >
            <Trash2 className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>

      {/* Console Messages List Viewport */}
      <div className="flex-1 overflow-y-auto p-4 font-mono text-xs space-y-1 bg-[#181818]">
        {filteredLogs.length === 0 ? (
          <div className="text-center py-12 text-[#666666] font-sans text-xs">
            No se encontraron eventos o registros en la consola con los filtros actuales.
          </div>
        ) : (
          filteredLogs.map((log) => {
            let textColor = 'text-[#cccccc]';
            let badgeBg = 'bg-[#333333] text-[#858585]';

            if (log.level === 'error') {
              textColor = 'text-[#f14c4c]';
              badgeBg = 'bg-[#f14c4c]/20 text-[#f14c4c] border border-[#f14c4c]/40';
            } else if (log.level === 'warn') {
              textColor = 'text-[#cca700]';
              badgeBg = 'bg-[#cca700]/20 text-[#cca700] border border-[#cca700]/40';
            } else if (log.level === 'bridge') {
              textColor = 'text-[#3794ff]';
              badgeBg = 'bg-[#3794ff]/20 text-[#3794ff] border border-[#3794ff]/40';
            }

            return (
              <div
                key={log.id}
                className="py-1 px-2 hover:bg-[#252526] rounded flex items-start gap-3 border-b border-[#222222] transition-colors"
              >
                <span className="text-[#666666] text-[10px] shrink-0 font-mono pt-0.5">
                  {log.timestamp}
                </span>

                <span className={`text-[9px] uppercase px-1.5 py-0.2 rounded font-sans font-bold shrink-0 ${badgeBg}`}>
                  {log.source}
                </span>

                <span className={`flex-1 break-all ${textColor}`}>
                  {log.message}
                </span>
              </div>
            );
          })
        )}
      </div>

      {/* Terminal Footer Info */}
      <div className="bg-[#2d2d2d] border-t border-[#3c3c3c] px-4 py-1.5 flex items-center justify-between text-[10px] text-[#858585] font-mono shrink-0">
        <div>
          Eventos capturados: <strong className="text-white">{logs.length}</strong>
        </div>
        <div>
          Filtro activo: <strong className="text-[#3794ff] uppercase">{filterLevel}</strong>
        </div>
      </div>
    </div>
  );
};
