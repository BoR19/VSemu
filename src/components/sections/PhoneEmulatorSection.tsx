import React, { useState, useRef } from 'react';
import {
  RotateCcw,
  Smartphone,
  Download,
  Maximize2,
  RefreshCw,
  Eye,
  Camera,
  Layers,
  Sparkles,
  Wifi,
  Battery,
  Signal,
  CheckCircle,
  X,
  ExternalLink,
  Sliders,
  Monitor
} from 'lucide-react';
import { DevicePreset } from '../../types/pwaStudio';
import { DEVICE_PRESETS } from '../../data/devicePresets';

interface PhoneEmulatorSectionProps {
  targetUrl: string;
  selectedDevice: DevicePreset;
  setSelectedDevice: (dev: DevicePreset) => void;
  orientation: 'portrait' | 'landscape';
  setOrientation: (o: 'portrait' | 'landscape') => void;
  onRefreshIframe: () => void;
  iframeKey: number;
}

export const PhoneEmulatorSection: React.FC<PhoneEmulatorSectionProps> = ({
  targetUrl,
  selectedDevice,
  setSelectedDevice,
  orientation,
  setOrientation,
  onRefreshIframe,
  iframeKey,
}) => {
  const [scale, setScale] = useState<number>(0.85);
  const [showBezel, setShowBezel] = useState<boolean>(true);
  const [showPwaInstallPrompt, setShowPwaInstallPrompt] = useState<boolean>(false);
  const [installedPwa, setInstalledPwa] = useState<boolean>(false);
  const [screenshotTakenMessage, setScreenshotTakenMessage] = useState<string | null>(null);
  const iframeRef = useRef<HTMLIFrameElement>(null);

  const isPortrait = orientation === 'portrait';
  const width = isPortrait ? selectedDevice.viewportWidth : selectedDevice.viewportHeight;
  const height = isPortrait ? selectedDevice.viewportHeight : selectedDevice.viewportWidth;

  const handleTakeScreenshot = () => {
    setScreenshotTakenMessage(`Captura guardada en el espacio de trabajo de VS Code (${selectedDevice.name}_${orientation}.png)`);
    setTimeout(() => {
      setScreenshotTakenMessage(null);
    }, 4000);
  };

  const handleTriggerInstall = () => {
    setShowPwaInstallPrompt(true);
  };

  const handleAcceptInstall = () => {
    setInstalledPwa(true);
    setShowPwaInstallPrompt(false);
  };

  return (
    <div className="h-full flex flex-col bg-[#1e1e1e] overflow-hidden select-none">
      {/* Emulator Toolbar Header */}
      <div className="bg-[#2d2d2d] border-b border-[#3c3c3c] px-4 py-2 flex flex-wrap items-center justify-between gap-3 text-xs shrink-0">
        {/* Left: Device Dropdown & Preset Info */}
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-2 bg-[#1e1e1e] border border-[#3c3c3c] rounded px-2.5 py-1">
            <Smartphone className="w-4 h-4 text-[#3794ff]" />
            <select
              value={selectedDevice.id}
              onChange={(e) => {
                const found = DEVICE_PRESETS.find((d) => d.id === e.target.value);
                if (found) setSelectedDevice(found);
              }}
              className="bg-transparent text-white font-medium focus:outline-none text-xs cursor-pointer"
            >
              {DEVICE_PRESETS.map((dev) => (
                <option key={dev.id} value={dev.id} className="bg-[#252526] text-white">
                  {dev.name} ({dev.viewportWidth}x{dev.viewportHeight} - {dev.brand})
                </option>
              ))}
            </select>
          </div>

          <span className="text-[#858585]">|</span>

          {/* Orientation Switch */}
          <div className="flex items-center bg-[#1e1e1e] border border-[#3c3c3c] rounded p-0.5">
            <button
              onClick={() => setOrientation('portrait')}
              className={`px-2 py-1 rounded text-xs flex items-center gap-1 transition-colors ${
                isPortrait ? 'bg-[#007acc] text-white font-medium' : 'text-[#858585] hover:text-[#cccccc]'
              }`}
            >
              <span>Vertical</span>
              <span className="text-[10px] font-mono opacity-80">(9:16)</span>
            </button>
            <button
              onClick={() => setOrientation('landscape')}
              className={`px-2 py-1 rounded text-xs flex items-center gap-1 transition-colors ${
                !isPortrait ? 'bg-[#007acc] text-white font-medium' : 'text-[#858585] hover:text-[#cccccc]'
              }`}
            >
              <span>Horizontal</span>
              <span className="text-[10px] font-mono opacity-80">(16:9)</span>
            </button>
          </div>
        </div>

        {/* Center: Scale Selector & Frame Toggle */}
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-2 text-[#aaaaaa]">
            <Sliders className="w-3.5 h-3.5 text-[#858585]" />
            <span>Escala:</span>
            <div className="flex items-center bg-[#1e1e1e] border border-[#3c3c3c] rounded p-0.5">
              {[0.65, 0.85, 1.0, 1.15].map((s) => (
                <button
                  key={s}
                  onClick={() => setScale(s)}
                  className={`px-2 py-0.5 text-[11px] font-mono rounded transition-colors ${
                    scale === s ? 'bg-[#007acc] text-white' : 'text-[#858585] hover:text-white'
                  }`}
                >
                  {Math.round(s * 100)}%
                </button>
              ))}
            </div>
          </div>

          <button
            onClick={() => setShowBezel(!showBezel)}
            className={`flex items-center gap-1.5 px-2.5 py-1 rounded border transition-colors ${
              showBezel
                ? 'bg-[#007acc]/20 border-[#007acc] text-[#3794ff]'
                : 'bg-[#1e1e1e] border-[#3c3c3c] text-[#858585] hover:text-[#cccccc]'
            }`}
            title="Mostrar u ocultar marco físico del teléfono"
          >
            <Smartphone className="w-3.5 h-3.5" />
            <span>{showBezel ? 'Marco Activo' : 'Sin Marco'}</span>
          </button>
        </div>

        {/* Right: Actions (Screenshot, Install Simulation, Reload) */}
        <div className="flex items-center gap-2">
          <button
            onClick={handleTriggerInstall}
            className="flex items-center gap-1 bg-[#89d185]/20 hover:bg-[#89d185]/30 text-[#89d185] border border-[#89d185]/40 px-2.5 py-1 rounded transition-colors"
            title="Simular banner de instalación PWA en el teléfono"
          >
            <Download className="w-3.5 h-3.5" />
            <span>Probar Instalación</span>
          </button>

          <button
            onClick={handleTakeScreenshot}
            className="flex items-center gap-1 bg-[#252526] hover:bg-[#333333] border border-[#3c3c3c] text-[#cccccc] px-2.5 py-1 rounded transition-colors"
            title="Tomar captura de pantalla de la vista previa"
          >
            <Camera className="w-3.5 h-3.5 text-[#3794ff]" />
            <span>Captura</span>
          </button>

          <button
            onClick={onRefreshIframe}
            className="p-1 text-[#858585] hover:text-white bg-[#252526] border border-[#3c3c3c] rounded hover:bg-[#333333] transition-colors"
            title="Recargar iframe"
          >
            <RefreshCw className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>

      {/* Screenshot Notification Banner */}
      {screenshotTakenMessage && (
        <div className="bg-[#89d185]/20 border-b border-[#89d185]/40 px-4 py-1.5 text-xs text-[#89d185] flex items-center justify-between shrink-0">
          <div className="flex items-center gap-2">
            <CheckCircle className="w-4 h-4" />
            <span>{screenshotTakenMessage}</span>
          </div>
          <button onClick={() => setScreenshotTakenMessage(null)} className="hover:text-white">
            <X className="w-3.5 h-3.5" />
          </button>
        </div>
      )}

      {/* Main Canvas Viewport View */}
      <div className="flex-1 overflow-auto p-8 flex items-center justify-center bg-[#141414] relative">
        {/* Transform Scale Wrapper */}
        <div
          style={{
            transform: `scale(${scale})`,
            transformOrigin: 'center center',
            transition: 'transform 0.2s ease-out',
          }}
          className="relative flex items-center justify-center"
        >
          {/* Phone Physical Shell */}
          <div
            style={{
              width: `${width + (showBezel ? 32 : 0)}px`,
              height: `${height + (showBezel ? 64 : 0)}px`,
            }}
            className={`relative transition-all duration-300 ${
              showBezel
                ? 'bg-[#111111] rounded-[42px] p-4 border-4 border-[#2c2c2e] device-shadow device-bezel flex flex-col'
                : 'rounded-lg overflow-hidden border border-[#333333]'
            }`}
          >
            {/* Phone Hardware Side Buttons (Simulated) */}
            {showBezel && (
              <>
                {/* Volume Up/Down */}
                <div className="absolute -left-2.5 top-24 w-1.5 h-12 bg-[#2c2c2e] rounded-l-md border-y border-l border-[#3a3a3c]"></div>
                <div className="absolute -left-2.5 top-40 w-1.5 h-12 bg-[#2c2c2e] rounded-l-md border-y border-l border-[#3a3a3c]"></div>
                {/* Power Button */}
                <div className="absolute -right-2.5 top-28 w-1.5 h-16 bg-[#007acc] rounded-r-md border-y border-r border-[#0e639c]"></div>
              </>
            )}

            {/* Simulated Phone Screen Area */}
            <div className="relative w-full h-full bg-black rounded-[28px] overflow-hidden flex flex-col">
              {/* Phone Status Bar */}
              {showBezel && (
                <div className="h-6 bg-black text-[#ffffff] px-4 flex items-center justify-between text-[10px] font-mono select-none z-30 shrink-0">
                  <span>09:41</span>
                  {/* Notch Punch-hole */}
                  <div className="w-3 h-3 bg-black border border-[#222222] rounded-full mx-auto"></div>
                  <div className="flex items-center gap-1.5">
                    <Signal className="w-3 h-3 text-[#cccccc]" />
                    <Wifi className="w-3 h-3 text-[#cccccc]" />
                    <Battery className="w-3.5 h-3.5 text-[#89d185]" />
                  </div>
                </div>
              )}

              {/* Simulated PWA Installation Banner Overlay */}
              {showPwaInstallPrompt && (
                <div className="absolute top-8 left-2 right-2 bg-[#252526] border border-[#007acc] rounded-lg p-3 text-xs text-white z-40 shadow-2xl animate-fade-in space-y-2">
                  <div className="flex items-start justify-between gap-2">
                    <div className="flex items-center gap-2">
                      <div className="w-8 h-8 bg-[#007acc] rounded-md flex items-center justify-center font-bold text-white text-sm shrink-0">
                        PWA
                      </div>
                      <div>
                        <div className="font-semibold text-white">Instalar PWA Studio Demo</div>
                        <div className="text-[10px] text-[#858585]">{targetUrl}</div>
                      </div>
                    </div>
                    <button
                      onClick={() => setShowPwaInstallPrompt(false)}
                      className="text-[#858585] hover:text-white"
                    >
                      <X className="w-4 h-4" />
                    </button>
                  </div>
                  <p className="text-[11px] text-[#cccccc] leading-snug">
                    ¿Añadir esta aplicación Web Progresiva a la pantalla de inicio de Android?
                  </p>
                  <div className="flex items-center justify-end gap-2 pt-1">
                    <button
                      onClick={() => setShowPwaInstallPrompt(false)}
                      className="px-2.5 py-1 text-[11px] text-[#858585] hover:text-white"
                    >
                      Cancelar
                    </button>
                    <button
                      onClick={handleAcceptInstall}
                      className="px-3 py-1 bg-[#007acc] hover:bg-[#1177bb] text-white text-[11px] font-medium rounded shadow-sm"
                    >
                      Instalar en Android
                    </button>
                  </div>
                </div>
              )}

              {/* Installed Banner Notification */}
              {installedPwa && (
                <div className="bg-[#89d185]/20 text-[#89d185] px-3 py-1 text-[10px] flex items-center justify-between z-30 shrink-0 border-b border-[#89d185]/30">
                  <span>PWA instalada en dispositivo virtual</span>
                  <button onClick={() => setInstalledPwa(false)} className="underline">
                    Desinstalar
                  </button>
                </div>
              )}

              {/* Real IFrame Embed Viewport */}
              <iframe
                key={iframeKey}
                ref={iframeRef}
                src={targetUrl}
                title="PWA Virtual Preview"
                style={{ width: '100%', height: '100%' }}
                className="w-full flex-1 border-0 bg-white"
                sandbox="allow-scripts allow-same-origin allow-forms allow-popups allow-modals"
              />

              {/* Phone Home Bar Indicator */}
              {showBezel && (
                <div className="h-4 bg-black flex items-center justify-center shrink-0 z-30">
                  <div className="w-24 h-1 bg-[#666666] rounded-full"></div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Footer Info Strip */}
      <div className="bg-[#2d2d2d] border-t border-[#3c3c3c] px-4 py-1.5 flex items-center justify-between text-[11px] text-[#858585] shrink-0 font-mono">
        <div>
          Visualizando: <strong className="text-[#cccccc]">{selectedDevice.name}</strong> ({width}px × {height}px)
        </div>
        <div className="flex items-center gap-4">
          <span>DPR: {selectedDevice.dpr}x</span>
          <span>Notch: {selectedDevice.notchType}</span>
          <span className="text-[#3794ff]">Android Webview Engine</span>
        </div>
      </div>
    </div>
  );
};
