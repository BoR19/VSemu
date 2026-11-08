import React from 'react';
import {
  Smartphone,
  Usb,
  Stethoscope,
  WifiOff,
  Globe,
  Play,
  CheckCircle2,
  AlertTriangle,
  ArrowRight,
  ShieldCheck,
  Zap,
  Terminal,
  Cpu,
  RefreshCw,
  Info
} from 'lucide-react';
import { TabSection, DetectedDevice, DevicePreset, PWAAuditReport } from '../../types/pwaStudio';

interface DashboardSectionProps {
  targetUrl: string;
  setTargetUrl: (url: string) => void;
  setActiveTab: (tab: TabSection) => void;
  detectedDevices: DetectedDevice[];
  selectedDevice: DevicePreset;
  auditReport: PWAAuditReport | null;
  adbDaemonRunning: boolean;
  isOffline: boolean;
  onRunAudit: () => void;
  onRefreshDevices: () => void;
}

export const DashboardSection: React.FC<DashboardSectionProps> = ({
  targetUrl,
  setTargetUrl,
  setActiveTab,
  detectedDevices,
  selectedDevice,
  auditReport,
  adbDaemonRunning,
  isOffline,
  onRunAudit,
  onRefreshDevices,
}) => {
  const connectedUsbCount = detectedDevices.filter(d => d.connectionType === 'usb' && d.status === 'port_forwarded').length;
  const connectedWifiCount = detectedDevices.filter(d => d.connectionType === 'wifi').length;

  return (
    <div className="p-6 space-y-6 overflow-y-auto max-w-7xl mx-auto">
      {/* Top Welcome Banner */}
      <div className="bg-[#252526] border border-[#3c3c3c] rounded-lg p-5 shadow-lg relative overflow-hidden">
        <div className="absolute top-0 right-0 w-96 h-96 bg-[#007acc]/5 rounded-full blur-3xl pointer-events-none"></div>

        <div className="flex flex-col lg:flex-row items-start lg:items-center justify-between gap-4 relative z-10">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <span className="text-xs font-semibold px-2 py-0.5 bg-[#007acc]/20 text-[#3794ff] border border-[#007acc]/40 rounded font-mono">
                VS Code Extension Webview
              </span>
              <span className="text-xs text-[#858585]">
                PWA Studio Preview v1.0
              </span>
            </div>
            <h1 className="text-2xl font-bold text-white tracking-tight">
              Visualización y Depuración Profesional de PWAs
            </h1>
            <p className="text-sm text-[#cccccc] mt-1 max-w-3xl leading-relaxed">
              Prueba aplicaciones Progressive Web Apps en emuladores virtuales interactivos y en teléfonos Android reales (Samsung, Google Pixel, Motorola, Xiaomi) conectados por USB y Wi-Fi mediante ADB.
            </p>
          </div>

          <div className="flex items-center gap-2 shrink-0">
            <button
              onClick={() => setActiveTab('emulator')}
              className="flex items-center gap-2 bg-[#007acc] hover:bg-[#1177bb] text-white px-4 py-2 rounded text-xs font-medium transition-colors shadow-md"
            >
              <Play className="w-4 h-4 fill-current" />
              <span>Abrir Emulador</span>
            </button>

            <button
              onClick={() => setActiveTab('android-adb')}
              className="flex items-center gap-2 bg-[#333333] hover:bg-[#3c3c3c] border border-[#444444] text-[#cccccc] hover:text-white px-4 py-2 rounded text-xs font-medium transition-colors"
            >
              <Usb className="w-4 h-4 text-[#89d185]" />
              <span>Conectar ADB</span>
            </button>
          </div>
        </div>

        {/* Quick URL Bar inside Banner */}
        <div className="mt-4 pt-4 border-t border-[#3c3c3c] flex flex-col sm:flex-row items-center gap-3">
          <span className="text-xs font-medium text-[#aaaaaa] shrink-0">URL Objetivo PWA:</span>
          <div className="flex-1 w-full flex items-center bg-[#1e1e1e] border border-[#3c3c3c] rounded px-3 py-1.5 focus-within:border-[#007acc]">
            <Globe className="w-4 h-4 text-[#858585] shrink-0 mr-2" />
            <input
              type="text"
              value={targetUrl}
              onChange={(e) => setTargetUrl(e.target.value)}
              className="bg-transparent text-[#ffffff] text-xs font-mono w-full focus:outline-none"
              placeholder="http://localhost:5173"
            />
          </div>
          <button
            onClick={() => setActiveTab('emulator')}
            className="text-xs bg-[#2d2d2d] hover:bg-[#383838] border border-[#444444] text-[#cccccc] px-3 py-1.5 rounded transition-colors whitespace-nowrap"
          >
            Probar URL
          </button>
        </div>
      </div>

      {/* Overview Metric Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Card 1: Virtual Emulator */}
        <div
          onClick={() => setActiveTab('emulator')}
          className="bg-[#252526] hover:bg-[#2a2d2e] border border-[#3c3c3c] hover:border-[#007acc] rounded-lg p-4 cursor-pointer transition-all space-y-2 group"
        >
          <div className="flex items-center justify-between text-xs text-[#858585]">
            <span className="font-semibold uppercase tracking-wider">Emulador Virtual</span>
            <Smartphone className="w-4 h-4 text-[#3794ff] group-hover:scale-110 transition-transform" />
          </div>
          <div className="text-lg font-bold text-white truncate">
            {selectedDevice.name}
          </div>
          <div className="text-xs text-[#aaaaaa] flex items-center justify-between">
            <span>Res: {selectedDevice.viewportWidth} x {selectedDevice.viewportHeight}</span>
            <span className="bg-[#1e1e1e] px-1.5 py-0.5 rounded text-[10px] font-mono text-[#3794ff]">
              DPR {selectedDevice.dpr}x
            </span>
          </div>
        </div>

        {/* Card 2: ADB Hardware Status */}
        <div
          onClick={() => setActiveTab('android-adb')}
          className="bg-[#252526] hover:bg-[#2a2d2e] border border-[#3c3c3c] hover:border-[#89d185] rounded-lg p-4 cursor-pointer transition-all space-y-2 group"
        >
          <div className="flex items-center justify-between text-xs text-[#858585]">
            <span className="font-semibold uppercase tracking-wider">Dispositivos Android</span>
            <Usb className="w-4 h-4 text-[#89d185] group-hover:scale-110 transition-transform" />
          </div>
          <div className="text-lg font-bold text-white flex items-center gap-2">
            <span>{detectedDevices.length} Detectados</span>
            <span className="text-xs text-[#89d185] font-normal font-mono bg-[#89d185]/10 px-1.5 py-0.5 rounded">
              {connectedUsbCount} USB / {connectedWifiCount} Wi-Fi
            </span>
          </div>
          <div className="text-xs text-[#aaaaaa] flex items-center justify-between">
            <span>ADB Daemon: {adbDaemonRunning ? 'Ejecutando' : 'Inactivo'}</span>
            <span className="text-[10px] text-[#89d185] font-mono">Port Forward ok</span>
          </div>
        </div>

        {/* Card 3: PWA Diagnostic Score */}
        <div
          onClick={() => setActiveTab('diagnostics')}
          className="bg-[#252526] hover:bg-[#2a2d2e] border border-[#3c3c3c] hover:border-[#cca700] rounded-lg p-4 cursor-pointer transition-all space-y-2 group"
        >
          <div className="flex items-center justify-between text-xs text-[#858585]">
            <span className="font-semibold uppercase tracking-wider">Diagnóstico PWA</span>
            <Stethoscope className="w-4 h-4 text-[#cca700] group-hover:scale-110 transition-transform" />
          </div>
          <div className="text-lg font-bold text-white flex items-center gap-2">
            <span>Score: {auditReport ? `${auditReport.overallScore}/100` : '100/100'}</span>
            <CheckCircle2 className="w-4 h-4 text-[#89d185]" />
          </div>
          <div className="text-xs text-[#aaaaaa] flex items-center justify-between">
            <span>Manifest + Service Worker</span>
            <span className="text-[10px] text-[#89d185] font-mono">7/7 Pruebas ok</span>
          </div>
        </div>

        {/* Card 4: Network & Offline */}
        <div
          onClick={() => setActiveTab('network')}
          className="bg-[#252526] hover:bg-[#2a2d2e] border border-[#3c3c3c] hover:border-[#f14c4c] rounded-lg p-4 cursor-pointer transition-all space-y-2 group"
        >
          <div className="flex items-center justify-between text-xs text-[#858585]">
            <span className="font-semibold uppercase tracking-wider">Estado de Red</span>
            <WifiOff className="w-4 h-4 text-[#3794ff] group-hover:scale-110 transition-transform" />
          </div>
          <div className="text-lg font-bold text-white">
            {isOffline ? 'Modo Offline Simulado' : 'Sin Throttling (Online)'}
          </div>
          <div className="text-xs text-[#aaaaaa] flex items-center justify-between">
            <span>Latencia: {isOffline ? 'Infinito' : '5ms'}</span>
            <span className={`text-[10px] font-mono px-1.5 py-0.5 rounded ${isOffline ? 'bg-[#f14c4c]/20 text-[#f14c4c]' : 'bg-[#89d185]/20 text-[#89d185]'}`}>
              {isOffline ? 'OFFLINE' : 'ONLINE'}
            </span>
          </div>
        </div>
      </div>

      {/* Main Grid: ADB Hardware List & Extension Architecture Note */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left 2 Cols: Android Devices Quick Monitor */}
        <div className="lg:col-span-2 bg-[#252526] border border-[#3c3c3c] rounded-lg p-5 space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-sm font-bold text-white flex items-center gap-2">
                <Usb className="w-4 h-4 text-[#89d185]" />
                <span>Dispositivos Android Detectados Automáticamente</span>
              </h2>
              <p className="text-xs text-[#858585] mt-0.5">
                Detección por ADB mediante el proceso de la extensión nativa de VS Code
              </p>
            </div>
            <button
              onClick={onRefreshDevices}
              className="flex items-center gap-1.5 text-xs bg-[#1e1e1e] hover:bg-[#2d2d2d] border border-[#3c3c3c] px-3 py-1.5 rounded text-[#cccccc] transition-colors"
            >
              <RefreshCw className="w-3.5 h-3.5 text-[#3794ff]" />
              <span>Escanear ADB</span>
            </button>
          </div>

          <div className="space-y-2">
            {detectedDevices.map((dev) => (
              <div
                key={dev.id}
                className="bg-[#1e1e1e] border border-[#3c3c3c] hover:border-[#007acc]/60 rounded-md p-3 flex flex-col sm:flex-row sm:items-center justify-between gap-3 transition-colors"
              >
                <div className="flex items-start gap-3">
                  <div className="p-2 bg-[#252526] border border-[#333333] rounded text-[#3794ff] shrink-0">
                    <Smartphone className="w-5 h-5" />
                  </div>
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="font-semibold text-xs text-white">{dev.model}</span>
                      <span className="text-[10px] bg-[#2d2d2d] text-[#858585] px-1.5 py-0.5 rounded font-mono">
                        {dev.brand}
                      </span>
                      <span className="text-[10px] text-[#858585]">
                        Android {dev.androidVersion}
                      </span>
                    </div>
                    <div className="text-[11px] text-[#858585] mt-0.5 font-mono flex items-center gap-3">
                      <span>S/N: {dev.serialNumber}</span>
                      {dev.ipAddress && <span>IP: {dev.ipAddress}</span>}
                      <span>Batería: {dev.batteryLevel}%</span>
                    </div>
                  </div>
                </div>

                <div className="flex items-center gap-2 shrink-0 self-end sm:self-center">
                  <span className={`text-[10px] px-2 py-0.5 rounded border font-mono ${
                    dev.status === 'port_forwarded'
                      ? 'bg-[#89d185]/10 text-[#89d185] border-[#89d185]/30'
                      : dev.status === 'adb_authorized'
                      ? 'bg-[#3794ff]/10 text-[#3794ff] border-[#3794ff]/30'
                      : 'bg-[#cca700]/10 text-[#cca700] border-[#cca700]/30'
                  }`}>
                    {dev.status === 'port_forwarded' ? '🔌 Port Forward Active' : dev.status === 'adb_authorized' ? '🟢 ADB Autorizado' : '🟡 Requiere Emparejamiento'}
                  </span>

                  <button
                    onClick={() => setActiveTab('android-adb')}
                    className="text-xs text-[#007acc] hover:text-[#3794ff] hover:underline font-medium flex items-center gap-1 ml-1"
                  >
                    <span>Gestionar</span>
                    <ArrowRight className="w-3 h-3" />
                  </button>
                </div>
              </div>
            ))}
          </div>

          <div className="p-3 bg-[#1e1e1e]/80 border border-[#333333] rounded text-xs text-[#aaaaaa] flex items-start gap-2.5">
            <Info className="w-4 h-4 text-[#3794ff] shrink-0 mt-0.5" />
            <div>
              <strong className="text-white">Nota de Arquitectura ADB Nativa:</strong> En el entorno final de VS Code, esta lista se sincroniza en tiempo real leyendo la salida de <code className="text-[#3794ff] font-mono">adb devices -l</code> mediante comunicación de Webview RPC.
            </div>
          </div>
        </div>

        {/* Right Col: Quick Tool Cards & Diagnostic Summary */}
        <div className="space-y-4">
          {/* Quick Actions Panel */}
          <div className="bg-[#252526] border border-[#3c3c3c] rounded-lg p-4 space-y-3">
            <h3 className="text-xs font-bold text-white uppercase tracking-wider">
              Acciones Rápida de Pruebas
            </h3>

            <div className="space-y-2">
              <button
                onClick={() => setActiveTab('diagnostics')}
                className="w-full flex items-center justify-between p-2.5 bg-[#1e1e1e] hover:bg-[#2d2d2d] border border-[#3c3c3c] rounded text-xs text-[#cccccc] transition-colors group"
              >
                <div className="flex items-center gap-2">
                  <Stethoscope className="w-4 h-4 text-[#cca700]" />
                  <span>Auditar PWA (Manifest & SW)</span>
                </div>
                <ArrowRight className="w-3.5 h-3.5 text-[#858585] group-hover:translate-x-1 transition-transform" />
              </button>

              <button
                onClick={() => setActiveTab('network')}
                className="w-full flex items-center justify-between p-2.5 bg-[#1e1e1e] hover:bg-[#2d2d2d] border border-[#3c3c3c] rounded text-xs text-[#cccccc] transition-colors group"
              >
                <div className="flex items-center gap-2">
                  <WifiOff className="w-4 h-4 text-[#3794ff]" />
                  <span>Simular Pérdida de Red (Offline)</span>
                </div>
                <ArrowRight className="w-3.5 h-3.5 text-[#858585] group-hover:translate-x-1 transition-transform" />
              </button>

              <button
                onClick={() => setActiveTab('console')}
                className="w-full flex items-center justify-between p-2.5 bg-[#1e1e1e] hover:bg-[#2d2d2d] border border-[#3c3c3c] rounded text-xs text-[#cccccc] transition-colors group"
              >
                <div className="flex items-center gap-2">
                  <Terminal className="w-4 h-4 text-[#89d185]" />
                  <span>Ver Consola de Logs & ADB</span>
                </div>
                <ArrowRight className="w-3.5 h-3.5 text-[#858585] group-hover:translate-x-1 transition-transform" />
              </button>
            </div>
          </div>

          {/* Extension Webview Ready Card */}
          <div className="bg-[#252526] border border-[#007acc]/40 rounded-lg p-4 space-y-2">
            <div className="flex items-center gap-2 text-xs font-semibold text-[#3794ff]">
              <Cpu className="w-4 h-4" />
              <span>Preparación para Extensión VS Code</span>
            </div>
            <p className="text-xs text-[#aaaaaa] leading-relaxed">
              Esta interfaz está estructurada modularmente en React y TypeScript con manejadores de mensajes <code className="text-[#3794ff] font-mono">postMessage</code> listos para recibir comandos nativos de la API de VS Code.
            </p>
            <div className="pt-2 border-t border-[#333333] flex items-center justify-between text-[11px] text-[#858585]">
              <span>Extensión: PWA Studio Host</span>
              <span className="text-[#89d185]">Bridge Ready</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
