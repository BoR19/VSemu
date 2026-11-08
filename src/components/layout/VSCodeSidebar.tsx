import React from 'react';
import {
  LayoutDashboard,
  Smartphone,
  Maximize2,
  RotateCcw,
  Usb,
  Wifi,
  Stethoscope,
  Terminal,
  WifiOff,
  Settings,
  Layers,
  ChevronRight
} from 'lucide-react';
import { TabSection } from '../../types/pwaStudio';

interface VSCodeSidebarProps {
  activeTab: TabSection;
  setActiveTab: (tab: TabSection) => void;
  detectedDevicesCount: number;
  auditScore: number | null;
  consoleErrorsCount: number;
  isOffline: boolean;
  orientation: 'portrait' | 'landscape';
  toggleOrientation: () => void;
}

interface NavItem {
  id: TabSection;
  label: string;
  icon: React.ReactNode;
  badge?: string | number;
  badgeColor?: string;
  subtext?: string;
}

export const VSCodeSidebar: React.FC<VSCodeSidebarProps> = ({
  activeTab,
  setActiveTab,
  detectedDevicesCount,
  auditScore,
  consoleErrorsCount,
  isOffline,
  orientation,
  toggleOrientation,
}) => {
  const navItems: NavItem[] = [
    {
      id: 'dashboard',
      label: 'Dashboard Principal',
      icon: <LayoutDashboard className="w-4 h-4" />,
      subtext: 'Resumen general & accesos'
    },
    {
      id: 'emulator',
      label: 'Emulador de Teléfono',
      icon: <Smartphone className="w-4 h-4" />,
      badge: orientation === 'portrait' ? 'Vertical' : 'Horizontal',
      badgeColor: 'bg-[#007acc]/20 text-[#3794ff]',
      subtext: 'Frame virtual interactivo'
    },
    {
      id: 'devices',
      label: 'Dispositivos & Resoluciones',
      icon: <Maximize2 className="w-4 h-4" />,
      subtext: 'Presets Pixel, Samsung, etc.'
    },
    {
      id: 'android-adb',
      label: 'Conexión Android ADB',
      icon: <Usb className="w-4 h-4" />,
      badge: `${detectedDevicesCount} detectados`,
      badgeColor: detectedDevicesCount > 0 ? 'bg-[#89d185]/20 text-[#89d185]' : 'bg-[#333333] text-[#858585]',
      subtext: 'Detección USB / Wi-Fi real'
    },
    {
      id: 'diagnostics',
      label: 'Diagnóstico PWA',
      icon: <Stethoscope className="w-4 h-4" />,
      badge: auditScore !== null ? `${auditScore}/100` : 'Pendiente',
      badgeColor: auditScore && auditScore >= 80 ? 'bg-[#89d185]/20 text-[#89d185]' : 'bg-[#cca700]/20 text-[#cca700]',
      subtext: 'Manifest & Service Worker'
    },
    {
      id: 'console',
      label: 'Consola de Errores',
      icon: <Terminal className="w-4 h-4" />,
      badge: consoleErrorsCount > 0 ? consoleErrorsCount : undefined,
      badgeColor: 'bg-[#f14c4c]/20 text-[#f14c4c]',
      subtext: 'DevTools & ADB logs'
    },
    {
      id: 'network',
      label: 'Red & Modo Offline',
      icon: <WifiOff className="w-4 h-4" />,
      badge: isOffline ? 'OFFLINE' : 'ONLINE',
      badgeColor: isOffline ? 'bg-[#f14c4c]/20 text-[#f14c4c]' : 'bg-[#89d185]/20 text-[#89d185]',
      subtext: 'Simulador Throttling'
    },
    {
      id: 'settings',
      label: 'Configuración General',
      icon: <Settings className="w-4 h-4" />,
      subtext: 'Ruta ADB & Opciones'
    }
  ];

  return (
    <aside className="w-64 bg-[#252526] border-r border-[#3c3c3c] flex flex-col justify-between shrink-0 select-none h-[calc(100vh-3rem)]">
      {/* Top Header Section */}
      <div className="p-2 border-b border-[#3c3c3c] bg-[#1e1e1e]/60">
        <div className="flex items-center justify-between px-2 py-1">
          <span className="text-[11px] font-bold tracking-wider text-[#858585] uppercase">
            PWA Studio Inspector
          </span>
          <span className="text-[10px] text-[#007acc] font-mono bg-[#007acc]/10 px-1.5 py-0.5 rounded border border-[#007acc]/30">
            VS Code Ext
          </span>
        </div>
      </div>

      {/* Navigation List */}
      <nav className="flex-1 overflow-y-auto p-2 space-y-1">
        {navItems.map((item) => {
          const isActive = activeTab === item.id;
          return (
            <button
              key={item.id}
              onClick={() => setActiveTab(item.id)}
              className={`w-full flex items-center justify-between px-2.5 py-2 rounded text-xs transition-all text-left ${
                isActive
                  ? 'bg-[#37373d] text-white font-medium shadow-sm border-l-2 border-[#007acc]'
                  : 'text-[#cccccc] hover:bg-[#2a2d2e] hover:text-white'
              }`}
            >
              <div className="flex items-center gap-2.5 min-w-0">
                <span className={isActive ? 'text-[#3794ff]' : 'text-[#858585]'}>
                  {item.icon}
                </span>
                <div className="truncate">
                  <div className="truncate">{item.label}</div>
                  {item.subtext && (
                    <div className="text-[10px] text-[#858585] font-normal truncate">
                      {item.subtext}
                    </div>
                  )}
                </div>
              </div>

              {item.badge !== undefined && (
                <span className={`text-[10px] px-1.5 py-0.5 rounded font-mono shrink-0 ml-1 ${item.badgeColor}`}>
                  {item.badge}
                </span>
              )}
            </button>
          );
        })}
      </nav>

      {/* Quick Orientation Switcher Bar */}
      <div className="p-2 border-t border-[#3c3c3c] bg-[#1e1e1e]">
        <div className="text-[10px] text-[#858585] font-semibold mb-1 px-1">
          VISTA RÁPIDA DE DISPOSITIVO
        </div>
        <button
          onClick={toggleOrientation}
          className="w-full flex items-center justify-between px-2.5 py-1.5 bg-[#252526] hover:bg-[#333333] border border-[#3c3c3c] rounded text-xs text-[#cccccc] transition-colors"
          title="Alternar entre orientación vertical y horizontal"
        >
          <div className="flex items-center gap-2">
            <RotateCcw className="w-3.5 h-3.5 text-[#3794ff]" />
            <span>Orientación: <strong>{orientation === 'portrait' ? 'Vertical' : 'Horizontal'}</strong></span>
          </div>
          <span className="text-[10px] bg-[#007acc]/20 text-[#3794ff] px-1.5 py-0.5 rounded font-mono">
            {orientation === 'portrait' ? '9:16' : '16:9'}
          </span>
        </button>

        {/* Extension Webview Disclaimer Footer */}
        <div className="mt-2 text-[10px] text-[#777777] bg-[#252526] p-2 rounded border border-[#333333] space-y-1">
          <div className="flex items-center justify-between font-medium text-[#aaaaaa]">
            <span>Arquitectura VS Code:</span>
            <span className="text-[#89d185]">Webview UI</span>
          </div>
          <p className="leading-tight text-[9.5px]">
            Lista para recibir eventos RPC de ADB nativo via postMessage.
          </p>
        </div>
      </div>
    </aside>
  );
};
