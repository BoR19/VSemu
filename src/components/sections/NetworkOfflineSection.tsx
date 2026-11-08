import React, { useState } from 'react';
import {
  Wifi,
  WifiOff,
  Zap,
  RefreshCw,
  Database,
  BellRing,
  CheckCircle2,
  AlertCircle,
  Sliders,
  ShieldCheck,
  Radio
} from 'lucide-react';
import { NETWORK_PROFILES } from '../../data/devicePresets';
import { NetworkThrottlingPreset } from '../../types/pwaStudio';

interface NetworkOfflineSectionProps {
  currentProfile: NetworkThrottlingPreset;
  setCurrentProfile: (p: NetworkThrottlingPreset) => void;
  isOffline: boolean;
  setIsOffline: (val: boolean) => void;
  targetUrl: string;
}

export const NetworkOfflineSection: React.FC<NetworkOfflineSectionProps> = ({
  currentProfile,
  setCurrentProfile,
  isOffline,
  setIsOffline,
  targetUrl,
}) => {
  const [cacheClearMessage, setCacheClearMessage] = useState<string | null>(null);
  const [pushTriggerMessage, setPushTriggerMessage] = useState<string | null>(null);

  const handleToggleOffline = () => {
    const nextOffline = !isOffline;
    setIsOffline(nextOffline);
    if (nextOffline) {
      setCurrentProfile('offline');
    } else {
      setCurrentProfile('online');
    }
  };

  const handleSelectProfile = (preset: NetworkThrottlingPreset) => {
    setCurrentProfile(preset);
    if (preset === 'offline') {
      setIsOffline(true);
    } else {
      setIsOffline(false);
    }
  };

  const handleClearCache = () => {
    setCacheClearMessage('Caché del Service Worker (CacheStorage & IndexedDB) limpiada con éxito.');
    setTimeout(() => setCacheClearMessage(null), 3000);
  };

  const handleTriggerPushNotification = () => {
    setPushTriggerMessage('Evento de Push Notification enviado al Service Worker activo.');
    setTimeout(() => setPushTriggerMessage(null), 3000);
  };

  return (
    <div className="p-6 space-y-6 overflow-y-auto max-w-7xl mx-auto">
      {/* Top Header */}
      <div className="bg-[#252526] border border-[#3c3c3c] rounded-lg p-5">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <span className="text-xs font-semibold px-2 py-0.5 bg-[#3794ff]/20 text-[#3794ff] border border-[#3794ff]/40 rounded font-mono">
                Simulador de Red
              </span>
              <span className="text-xs text-[#858585]">
                Network & Offline Testing Suite
              </span>
            </div>
            <h1 className="text-xl font-bold text-white tracking-tight flex items-center gap-2">
              <WifiOff className="w-5 h-5 text-[#3794ff]" />
              <span>Herramientas de Pruebas de Conexión y Modo Offline</span>
            </h1>
            <p className="text-xs text-[#cccccc] mt-1 max-w-2xl leading-relaxed">
              Evalúa cómo responde tu PWA cuando se corta la conexión de datos, se experimenta alta latencia o se limpia la caché del Service Worker.
            </p>
          </div>

          {/* Big Master Toggle Switch */}
          <div className="flex items-center gap-3 bg-[#1e1e1e] p-3 rounded-lg border border-[#3c3c3c] shrink-0">
            <div className="text-right">
              <div className="text-xs font-bold text-white">Modo Sin Conexión (Offline)</div>
              <div className="text-[10px] text-[#858585]">
                {isOffline ? 'Corta el tráfico de red' : 'Conexión normal'}
              </div>
            </div>

            <button
              onClick={handleToggleOffline}
              className={`w-14 h-8 flex items-center rounded-full p-1 transition-colors duration-300 ${
                isOffline ? 'bg-[#f14c4c]' : 'bg-[#333333]'
              }`}
            >
              <div
                className={`bg-white w-6 h-6 rounded-full shadow-md transform transition-transform duration-300 flex items-center justify-center ${
                  isOffline ? 'translate-x-6' : 'translate-x-0'
                }`}
              >
                {isOffline ? (
                  <WifiOff className="w-3.5 h-3.5 text-[#f14c4c]" />
                ) : (
                  <Wifi className="w-3.5 h-3.5 text-[#333333]" />
                )}
              </div>
            </button>
          </div>
        </div>
      </div>

      {/* Profile Selection Cards Grid */}
      <div className="space-y-3">
        <h2 className="text-sm font-bold text-white flex items-center gap-2">
          <Sliders className="w-4 h-4 text-[#3794ff]" />
          <span>Perfiles de Estrangulamiento de Red (Network Throttling)</span>
        </h2>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {NETWORK_PROFILES.map((prof) => {
            const isSelected = currentProfile === prof.id;
            return (
              <div
                key={prof.id}
                onClick={() => handleSelectProfile(prof.id)}
                className={`bg-[#252526] border rounded-lg p-4 cursor-pointer transition-all space-y-3 ${
                  isSelected
                    ? 'border-[#007acc] ring-1 ring-[#007acc] bg-[#252526]'
                    : 'border-[#3c3c3c] hover:border-[#555555]'
                }`}
              >
                <div className="flex items-center justify-between">
                  <h3 className="text-xs font-bold text-white">{prof.name}</h3>
                  <span className={`w-2 h-2 rounded-full ${prof.id === 'offline' ? 'bg-[#f14c4c]' : prof.id === 'online' ? 'bg-[#89d185]' : 'bg-[#cca700]'}`}></span>
                </div>

                <p className="text-xs text-[#aaaaaa] text-left leading-relaxed">
                  {prof.description}
                </p>

                <div className="grid grid-cols-2 gap-2 text-[11px] bg-[#1e1e1e] p-2 rounded border border-[#333333] font-mono text-[#cccccc]">
                  <div>
                    <span className="text-[#858585] block text-[9px] uppercase">Descarga:</span>
                    {prof.downloadKbps > 0 ? `${(prof.downloadKbps / 1000).toFixed(1)} Mbps` : '0 Mbps'}
                  </div>
                  <div>
                    <span className="text-[#858585] block text-[9px] uppercase">Latencia:</span>
                    {prof.latencyMs > 0 ? `${prof.latencyMs} ms` : '0 ms'}
                  </div>
                </div>

                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    handleSelectProfile(prof.id);
                  }}
                  className={`w-full py-1.5 rounded text-xs font-medium transition-colors ${
                    isSelected ? 'bg-[#007acc] text-white' : 'bg-[#1e1e1e] text-[#cccccc] hover:bg-[#2d2d2d]'
                  }`}
                >
                  {isSelected ? 'Perfil Activo' : 'Aplicar Perfil'}
                </button>
              </div>
            );
          })}
        </div>
      </div>

      {/* Advanced Service Worker Test Triggers */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Cache Storage Inspector */}
        <div className="bg-[#252526] border border-[#3c3c3c] rounded-lg p-5 space-y-3">
          <div className="flex items-center gap-2">
            <Database className="w-5 h-5 text-[#89d185]" />
            <div>
              <h3 className="text-sm font-bold text-white">Inspección & Limpieza de Caché SW</h3>
              <p className="text-xs text-[#858585]">Vacía el CacheStorage para simular un usuario por primera vez</p>
            </div>
          </div>

          <p className="text-xs text-[#cccccc] leading-relaxed">
            Elimina recursos cacheados (<code className="text-[#3794ff] font-mono">workbox-precache</code>, imágenes, estáticos JS) para asegurar que las estrategias stale-while-revalidate funcionen correctamente.
          </p>

          <button
            onClick={handleClearCache}
            className="flex items-center gap-2 bg-[#1e1e1e] hover:bg-[#2d2d2d] border border-[#3c3c3c] text-[#cccccc] hover:text-white px-4 py-2 rounded text-xs transition-colors"
          >
            <RefreshCw className="w-3.5 h-3.5 text-[#89d185]" />
            <span>Vaciar Caché del Service Worker</span>
          </button>

          {cacheClearMessage && (
            <div className="p-2.5 bg-[#89d185]/20 border border-[#89d185]/40 rounded text-xs text-[#89d185] flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 shrink-0" />
              <span>{cacheClearMessage}</span>
            </div>
          )}
        </div>

        {/* Push Notification & Background Sync Simulator */}
        <div className="bg-[#252526] border border-[#3c3c3c] rounded-lg p-5 space-y-3">
          <div className="flex items-center gap-2">
            <BellRing className="w-5 h-5 text-[#cca700]" />
            <div>
              <h3 className="text-sm font-bold text-white">Eventos Push & Background Sync</h3>
              <p className="text-xs text-[#858585]">Envía eventos sintéticos al Service Worker activo</p>
            </div>
          </div>

          <p className="text-xs text-[#cccccc] leading-relaxed">
            Comprueba la reacción de tu Service Worker ante eventos en segundo plano cuando la app está minimizada en Android.
          </p>

          <button
            onClick={handleTriggerPushNotification}
            className="flex items-center gap-2 bg-[#1e1e1e] hover:bg-[#2d2d2d] border border-[#3c3c3c] text-[#cccccc] hover:text-white px-4 py-2 rounded text-xs transition-colors"
          >
            <Radio className="w-3.5 h-3.5 text-[#cca700]" />
            <span>Simular Evento Push Notification</span>
          </button>

          {pushTriggerMessage && (
            <div className="p-2.5 bg-[#cca700]/20 border border-[#cca700]/40 rounded text-xs text-[#cca700] flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 shrink-0" />
              <span>{pushTriggerMessage}</span>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
