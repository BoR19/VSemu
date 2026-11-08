import React from 'react';
import { RefreshCw, Globe, Terminal, Cpu, Wifi, ExternalLink, ShieldAlert, Sparkles } from 'lucide-react';
import { vscodeBridge } from '../../vscode/vscodeBridge';

interface VSCodeHeaderProps {
  targetUrl: string;
  setTargetUrl: (url: string) => void;
  onRefreshIframe: () => void;
  adbDaemonRunning: boolean;
  detectedDevicesCount: number;
  mockMode: boolean;
  setMockMode: (val: boolean) => void;
  isOffline: boolean;
}

export const VSCodeHeader: React.FC<VSCodeHeaderProps> = ({
  targetUrl,
  setTargetUrl,
  onRefreshIframe,
  adbDaemonRunning,
  detectedDevicesCount,
  mockMode,
  setMockMode,
  isOffline,
}) => {
  const isNative = vscodeBridge.isNativeVSCode();

  return (
    <header className="h-12 bg-[#2d2d2d] border-b border-[#3c3c3c] flex items-center justify-between px-3 text-xs select-none gap-2 shrink-0">
      {/* Left Title & Breadcrumbs */}
      <div className="flex items-center gap-2 min-w-0">
        <div className="flex items-center gap-1.5 font-semibold text-[#ffffff] bg-[#0e639c]/30 border border-[#0e639c]/50 px-2 py-1 rounded text-xs">
          <Cpu className="w-3.5 h-3.5 text-[#3794ff]" />
          <span className="tracking-wide">PWA Studio Preview</span>
          <span className="text-[10px] text-[#858585] font-normal px-1 bg-[#1e1e1e] rounded">v1.0.0</span>
        </div>

        <span className="text-[#555555]">/</span>

        {/* Target URL Input Bar */}
        <div className="flex items-center bg-[#1e1e1e] border border-[#3c3c3c] focus-within:border-[#007acc] rounded px-2 py-1 gap-1.5 w-64 md:w-80 lg:w-96 transition-colors">
          <Globe className="w-3.5 h-3.5 text-[#858585] shrink-0" />
          <input
            type="text"
            value={targetUrl}
            onChange={(e) => setTargetUrl(e.target.value)}
            className="bg-transparent text-[#cccccc] text-xs font-mono w-full focus:outline-none placeholder-[#666666]"
            placeholder="http://localhost:5173"
            title="URL de la PWA bajo prueba"
          />
          <button
            onClick={onRefreshIframe}
            className="text-[#858585] hover:text-[#ffffff] transition-colors p-0.5 rounded hover:bg-[#333333]"
            title="Recargar vista previa"
          >
            <RefreshCw className="w-3 h-3" />
          </button>
        </div>
      </div>

      {/* Center / Status Badges */}
      <div className="hidden xl:flex items-center gap-3">
        {/* Connection status badge */}
        <div className="flex items-center gap-1.5 text-[#858585] bg-[#1e1e1e] px-2 py-1 rounded border border-[#3c3c3c]">
          <span className={`w-2 h-2 rounded-full ${adbDaemonRunning ? 'bg-[#89d185]' : 'bg-[#cca700]'}`}></span>
          <span>ADB: <strong className="text-[#cccccc] font-mono">{adbDaemonRunning ? 'Daemon Activo' : 'Detenido'}</strong></span>
          <span className="text-[10px] bg-[#252526] px-1 rounded text-[#89d185] font-mono">{detectedDevicesCount} dev</span>
        </div>

        {/* Offline status indicator */}
        {isOffline && (
          <div className="flex items-center gap-1 text-[#f14c4c] bg-[#f14c4c]/10 border border-[#f14c4c]/30 px-2 py-0.5 rounded text-[11px]">
            <Wifi className="w-3 h-3 text-[#f14c4c] line-through" />
            <span>MODO OFFLINE ACTIVADO</span>
          </div>
        )}
      </div>

      {/* Right Action Tools & VS Code Mode Toggle */}
      <div className="flex items-center gap-2 shrink-0">
        {/* Toggle between Webview Mock Simulator and Real Extension RPC mode */}
        <div className="flex items-center bg-[#1e1e1e] p-0.5 rounded border border-[#3c3c3c]">
          <button
            onClick={() => setMockMode(true)}
            className={`px-2 py-0.5 text-[11px] rounded transition-colors ${
              mockMode ? 'bg-[#007acc] text-white font-medium' : 'text-[#858585] hover:text-[#cccccc]'
            }`}
            title="Simular mensajes de extensión en navegador"
          >
            Modo Simulación
          </button>
          <button
            onClick={() => setMockMode(false)}
            className={`px-2 py-0.5 text-[11px] rounded transition-colors ${
              !mockMode ? 'bg-[#007acc] text-white font-medium' : 'text-[#858585] hover:text-[#cccccc]'
            }`}
            title="Conectar con host nativo VS Code via postMessage"
          >
            {isNative ? 'VS Code Host' : 'VS Code RPC'}
          </button>
        </div>

        <a
          href={targetUrl}
          target="_blank"
          rel="noreferrer"
          className="flex items-center gap-1 text-[#858585] hover:text-[#ffffff] bg-[#252526] hover:bg-[#333333] border border-[#3c3c3c] px-2 py-1 rounded transition-colors"
          title="Abrir URL en navegador externo"
        >
          <ExternalLink className="w-3 h-3" />
          <span className="hidden sm:inline">Abrir Web</span>
        </a>
      </div>
    </header>
  );
};
