import React, { useState } from 'react';
import {
  Settings,
  Usb,
  Terminal,
  Smartphone,
  Save,
  CheckCircle2,
  RefreshCw,
  Globe,
  Sliders,
  Moon,
  Info
} from 'lucide-react';
import { ExtensionSettings } from '../../types/pwaStudio';
import { DEVICE_PRESETS } from '../../data/devicePresets';

interface SettingsSectionProps {
  settings: ExtensionSettings;
  setSettings: React.Dispatch<React.SetStateAction<ExtensionSettings>>;
}

export const SettingsSection: React.FC<SettingsSectionProps> = ({
  settings,
  setSettings,
}) => {
  const [savedMessage, setSavedMessage] = useState<string | null>(null);

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    setSavedMessage('Configuración de PWA Studio Preview guardada en las preferencias de VS Code.');
    setTimeout(() => setSavedMessage(null), 3000);
  };

  return (
    <div className="p-6 space-y-6 overflow-y-auto max-w-5xl mx-auto">
      {/* Header */}
      <div className="bg-[#252526] border border-[#3c3c3c] rounded-lg p-5">
        <div className="flex items-center gap-2 mb-1">
          <Settings className="w-5 h-5 text-[#3794ff]" />
          <h1 className="text-xl font-bold text-white tracking-tight">
            Configuración General de PWA Studio Preview
          </h1>
        </div>
        <p className="text-xs text-[#858585]">
          Ajusta la integración de la extensión con el sistema operativo, rutas de ejecutable ADB y preferencias del emulador.
        </p>
      </div>

      {/* Settings Form */}
      <form onSubmit={handleSave} className="space-y-6">
        {/* Group 1: General & Target URL */}
        <div className="bg-[#252526] border border-[#3c3c3c] rounded-lg p-5 space-y-4">
          <h2 className="text-xs font-bold text-white uppercase tracking-wider text-[#3794ff]">
            1. Dirección Objetivo & Webview
          </h2>

          <div className="space-y-3 text-xs">
            <div>
              <label className="block text-[#aaaaaa] mb-1 font-medium">URL Predeterminada del Servidor de Desarrollo PWA:</label>
              <div className="flex items-center bg-[#1e1e1e] border border-[#3c3c3c] rounded px-3 py-2 focus-within:border-[#007acc]">
                <Globe className="w-4 h-4 text-[#858585] mr-2 shrink-0" />
                <input
                  type="text"
                  value={settings.targetPwaUrl}
                  onChange={(e) => setSettings({ ...settings, targetPwaUrl: e.target.value })}
                  className="bg-transparent text-white w-full focus:outline-none font-mono"
                  placeholder="http://localhost:5173"
                />
              </div>
            </div>

            <div className="flex items-center justify-between p-3 bg-[#1e1e1e] rounded border border-[#333333]">
              <div>
                <div className="font-semibold text-white">Sincronizar Tema con VS Code</div>
                <div className="text-[11px] text-[#858585]">Adapta los colores del panel al tema activo de la ventana de VS Code</div>
              </div>
              <input
                type="checkbox"
                checked={settings.syncVsCodeTheme}
                onChange={(e) => setSettings({ ...settings, syncVsCodeTheme: e.target.checked })}
                className="w-4 h-4 accent-[#007acc]"
              />
            </div>
          </div>
        </div>

        {/* Group 2: Android ADB Path & Daemon */}
        <div className="bg-[#252526] border border-[#3c3c3c] rounded-lg p-5 space-y-4">
          <h2 className="text-xs font-bold text-white uppercase tracking-wider text-[#89d185]">
            2. Configuración ADB Android
          </h2>

          <div className="space-y-3 text-xs">
            <div>
              <label className="block text-[#aaaaaa] mb-1 font-medium">Ruta del Ejecutable ADB (Android Debug Bridge):</label>
              <input
                type="text"
                value={settings.customAdbPath}
                onChange={(e) => setSettings({ ...settings, customAdbPath: e.target.value })}
                className="w-full bg-[#1e1e1e] border border-[#3c3c3c] rounded px-3 py-2 text-white font-mono focus:outline-none focus:border-[#007acc]"
                placeholder="adb (o C:\Android\platform-tools\adb.exe)"
              />
              <p className="text-[10px] text-[#858585] mt-1">
                Dejar en <code className="text-[#3794ff]">adb</code> si está agregado al PATH del sistema operativo.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="flex items-center justify-between p-3 bg-[#1e1e1e] rounded border border-[#333333]">
                <div>
                  <div className="font-semibold text-white">Escaneo Automático de Dispositivos</div>
                  <div className="text-[11px] text-[#858585]">Sondea el bus USB mediante <code className="text-[#89d185]">adb devices</code></div>
                </div>
                <input
                  type="checkbox"
                  checked={settings.autoScanDevices}
                  onChange={(e) => setSettings({ ...settings, autoScanDevices: e.target.checked })}
                  className="w-4 h-4 accent-[#007acc]"
                />
              </div>

              <div>
                <label className="block text-[#aaaaaa] mb-1 font-medium">Intervalo de Escaneo (segundos):</label>
                <select
                  value={settings.scanIntervalSeconds}
                  onChange={(e) => setSettings({ ...settings, scanIntervalSeconds: Number(e.target.value) })}
                  className="w-full bg-[#1e1e1e] border border-[#3c3c3c] rounded px-3 py-2 text-white font-mono focus:outline-none focus:border-[#007acc]"
                >
                  <option value={3}>Cada 3 segundos</option>
                  <option value={5}>Cada 5 segundos</option>
                  <option value={10}>Cada 10 segundos</option>
                </select>
              </div>
            </div>
          </div>
        </div>

        {/* Group 3: Emulator Defaults */}
        <div className="bg-[#252526] border border-[#3c3c3c] rounded-lg p-5 space-y-4">
          <h2 className="text-xs font-bold text-white uppercase tracking-wider text-[#cca700]">
            3. Preferencias de Emulación Virtual
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
            <div>
              <label className="block text-[#aaaaaa] mb-1 font-medium">Dispositivo Predeterminado:</label>
              <select
                value={settings.defaultDevicePresetId}
                onChange={(e) => setSettings({ ...settings, defaultDevicePresetId: e.target.value })}
                className="w-full bg-[#1e1e1e] border border-[#3c3c3c] rounded px-3 py-2 text-white focus:outline-none focus:border-[#007acc]"
              >
                {DEVICE_PRESETS.map((p) => (
                  <option key={p.id} value={p.id}>
                    {p.name} ({p.brand})
                  </option>
                ))}
              </select>
            </div>

            <div className="flex items-center justify-between p-3 bg-[#1e1e1e] rounded border border-[#333333]">
              <div>
                <div className="font-semibold text-white">Mostrar Marco Físico del Teléfono</div>
                <div className="text-[11px] text-[#858585]">Incluye biseles, botones laterales y notch</div>
              </div>
              <input
                type="checkbox"
                checked={settings.showPhoneBezel}
                onChange={(e) => setSettings({ ...settings, showPhoneBezel: e.target.checked })}
                className="w-4 h-4 accent-[#007acc]"
              />
            </div>
          </div>
        </div>

        {/* Group 4: Webview Bridge RPC Mode Switch */}
        <div className="bg-[#252526] border border-[#007acc]/40 rounded-lg p-5 space-y-3">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-xs font-bold text-[#3794ff] uppercase tracking-wider">
                4. Modo de Comunicación Webview VS Code
              </h2>
              <p className="text-xs text-[#858585] mt-0.5">
                Alterna entre el modo simulación en navegador y el canal RPC real mediante postMessage
              </p>
            </div>

            <div className="flex items-center bg-[#1e1e1e] p-1 rounded border border-[#3c3c3c]">
              <button
                type="button"
                onClick={() => setSettings({ ...settings, mockMode: true })}
                className={`px-3 py-1 text-xs rounded font-medium transition-colors ${
                  settings.mockMode ? 'bg-[#007acc] text-white' : 'text-[#858585] hover:text-[#cccccc]'
                }`}
              >
                Modo Simulación UI
              </button>
              <button
                type="button"
                onClick={() => setSettings({ ...settings, mockMode: false })}
                className={`px-3 py-1 text-xs rounded font-medium transition-colors ${
                  !settings.mockMode ? 'bg-[#007acc] text-white' : 'text-[#858585] hover:text-[#cccccc]'
                }`}
              >
                VS Code RPC Activo
              </button>
            </div>
          </div>
        </div>

        {/* Save Bar */}
        <div className="flex items-center justify-between pt-2">
          {savedMessage ? (
            <div className="text-xs text-[#89d185] flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4" />
              <span>{savedMessage}</span>
            </div>
          ) : (
            <div></div>
          )}

          <button
            type="submit"
            className="flex items-center gap-2 bg-[#007acc] hover:bg-[#1177bb] text-white font-semibold px-6 py-2.5 rounded text-xs transition-colors shadow-md"
          >
            <Save className="w-4 h-4" />
            <span>Guardar Preferencias</span>
          </button>
        </div>
      </form>
    </div>
  );
};
