import React, { useState } from 'react';
import { Smartphone, Check, Maximize2, Monitor, Plus, Sliders, Globe, Layers, ArrowRight } from 'lucide-react';
import { DEVICE_PRESETS } from '../../data/devicePresets';
import { DevicePreset, DeviceBrand, TabSection } from '../../types/pwaStudio';

interface DeviceSelectorSectionProps {
  selectedDevice: DevicePreset;
  setSelectedDevice: (dev: DevicePreset) => void;
  setActiveTab: (tab: TabSection) => void;
}

export const DeviceSelectorSection: React.FC<DeviceSelectorSectionProps> = ({
  selectedDevice,
  setSelectedDevice,
  setActiveTab,
}) => {
  const [selectedBrandFilter, setSelectedBrandFilter] = useState<string>('all');
  const [customWidth, setCustomWidth] = useState<number>(375);
  const [customHeight, setCustomHeight] = useState<number>(667);
  const [customDpr, setCustomDpr] = useState<number>(2);
  const [customName, setCustomName] = useState<string>('Dispositivo Personalizado');

  const filteredPresets = selectedBrandFilter === 'all'
    ? DEVICE_PRESETS
    : DEVICE_PRESETS.filter((d) => d.brand.toLowerCase().includes(selectedBrandFilter.toLowerCase()));

  const handleApplyCustomDevice = () => {
    const customDev: DevicePreset = {
      id: `custom-${Date.now()}`,
      name: customName,
      brand: 'Generic',
      screenSize: 'Personalizado',
      viewportWidth: customWidth,
      viewportHeight: customHeight,
      dpr: customDpr,
      hasNotch: false,
      notchType: 'none',
      releaseYear: 2026,
      userAgent: `Mozilla/5.0 (Linux; Android 14; Custom Build) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/128.0.0.0 Mobile Safari/537.36`,
      popularInRegions: ['Desarrollo Local']
    };
    setSelectedDevice(customDev);
    setActiveTab('emulator');
  };

  return (
    <div className="p-6 space-y-6 overflow-y-auto max-w-7xl mx-auto">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 bg-[#252526] border border-[#3c3c3c] p-5 rounded-lg">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <Maximize2 className="w-5 h-5 text-[#3794ff]" />
            <h1 className="text-xl font-bold text-white tracking-tight">
              Selector de Dispositivos y Resoluciones
            </h1>
          </div>
          <p className="text-xs text-[#aaaaaa]">
            Elige entre perfiles calibrados de teléfonos Android de alta gama o configura resoluciones y densidades de píxel personalizadas.
          </p>
        </div>

        {/* Brand Filters */}
        <div className="flex items-center gap-1 bg-[#1e1e1e] p-1 rounded border border-[#3c3c3c]">
          {['all', 'Google', 'Samsung', 'Xiaomi', 'Motorola', 'OnePlus'].map((brand) => (
            <button
              key={brand}
              onClick={() => setSelectedBrandFilter(brand)}
              className={`px-3 py-1 text-xs rounded font-medium transition-colors ${
                selectedBrandFilter === brand
                  ? 'bg-[#007acc] text-white'
                  : 'text-[#858585] hover:text-[#cccccc]'
              }`}
            >
              {brand === 'all' ? 'Todos' : brand}
            </button>
          ))}
        </div>
      </div>

      {/* Preset Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {filteredPresets.map((preset) => {
          const isSelected = selectedDevice.id === preset.id;
          return (
            <div
              key={preset.id}
              onClick={() => setSelectedDevice(preset)}
              className={`bg-[#252526] border rounded-lg p-5 cursor-pointer transition-all flex flex-col justify-between relative group ${
                isSelected
                  ? 'border-[#007acc] ring-1 ring-[#007acc] shadow-lg bg-[#252526]'
                  : 'border-[#3c3c3c] hover:border-[#555555]'
              }`}
            >
              {isSelected && (
                <span className="absolute top-3 right-3 bg-[#007acc] text-white text-[10px] font-bold px-2 py-0.5 rounded-full flex items-center gap-1">
                  <Check className="w-3 h-3" />
                  <span>Seleccionado</span>
                </span>
              )}

              <div className="space-y-3">
                <div className="flex items-center gap-3">
                  <div className="p-3 bg-[#1e1e1e] border border-[#333333] rounded-lg text-[#3794ff]">
                    <Smartphone className="w-6 h-6" />
                  </div>
                  <div>
                    <h3 className="text-sm font-bold text-white group-hover:text-[#3794ff] transition-colors">
                      {preset.name}
                    </h3>
                    <div className="text-xs text-[#858585]">
                      {preset.brand} · {preset.releaseYear}
                    </div>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-2 text-xs bg-[#1e1e1e] p-3 rounded border border-[#333333]">
                  <div>
                    <span className="text-[#858585] block text-[10px] uppercase">Resolución:</span>
                    <strong className="text-white font-mono">{preset.viewportWidth} × {preset.viewportHeight}</strong>
                  </div>
                  <div>
                    <span className="text-[#858585] block text-[10px] uppercase">DPR Ratio:</span>
                    <strong className="text-[#3794ff] font-mono">{preset.dpr}x</strong>
                  </div>
                  <div>
                    <span className="text-[#858585] block text-[10px] uppercase">Pantalla:</span>
                    <span className="text-white">{preset.screenSize}</span>
                  </div>
                  <div>
                    <span className="text-[#858585] block text-[10px] uppercase">Cámara Notch:</span>
                    <span className="text-white capitalize">{preset.notchType}</span>
                  </div>
                </div>

                <div className="text-[11px] text-[#858585]">
                  <span className="text-[#aaaaaa] font-medium">Regiones principales: </span>
                  {preset.popularInRegions.join(', ')}
                </div>
              </div>

              <div className="mt-4 pt-3 border-t border-[#333333] flex items-center justify-between">
                <span className="text-[10px] text-[#858585] font-mono truncate max-w-[180px]" title={preset.userAgent}>
                  {preset.userAgent.split(' ')[0]}
                </span>

                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    setSelectedDevice(preset);
                    setActiveTab('emulator');
                  }}
                  className="flex items-center gap-1 text-xs bg-[#007acc] hover:bg-[#1177bb] text-white px-3 py-1.5 rounded transition-colors font-medium"
                >
                  <span>Probar</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>
          );
        })}
      </div>

      {/* Custom Resolution Builder Box */}
      <div className="bg-[#252526] border border-[#3c3c3c] rounded-lg p-5 space-y-4">
        <div className="flex items-center gap-2">
          <Sliders className="w-5 h-5 text-[#89d185]" />
          <div>
            <h2 className="text-sm font-bold text-white">Configurar Resolución Personalizada</h2>
            <p className="text-xs text-[#858585]">Define dimensiones exactas de viewport y densidad de píxeles (DPR)</p>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 text-xs">
          <div>
            <label className="block text-[#aaaaaa] mb-1 font-medium">Nombre del Perfil:</label>
            <input
              type="text"
              value={customName}
              onChange={(e) => setCustomName(e.target.value)}
              className="w-full bg-[#1e1e1e] border border-[#3c3c3c] rounded px-3 py-2 text-white focus:outline-none focus:border-[#007acc]"
            />
          </div>

          <div>
            <label className="block text-[#aaaaaa] mb-1 font-medium">Ancho (px):</label>
            <input
              type="number"
              value={customWidth}
              onChange={(e) => setCustomWidth(Number(e.target.value))}
              className="w-full bg-[#1e1e1e] border border-[#3c3c3c] rounded px-3 py-2 text-white font-mono focus:outline-none focus:border-[#007acc]"
            />
          </div>

          <div>
            <label className="block text-[#aaaaaa] mb-1 font-medium">Alto (px):</label>
            <input
              type="number"
              value={customHeight}
              onChange={(e) => setCustomHeight(Number(e.target.value))}
              className="w-full bg-[#1e1e1e] border border-[#3c3c3c] rounded px-3 py-2 text-white font-mono focus:outline-none focus:border-[#007acc]"
            />
          </div>

          <div>
            <label className="block text-[#aaaaaa] mb-1 font-medium">Device Pixel Ratio (DPR):</label>
            <select
              value={customDpr}
              onChange={(e) => setCustomDpr(Number(e.target.value))}
              className="w-full bg-[#1e1e1e] border border-[#3c3c3c] rounded px-3 py-2 text-white font-mono focus:outline-none focus:border-[#007acc]"
            >
              <option value={1}>1.0x (Estándar)</option>
              <option value={1.5}>1.5x (HDPI)</option>
              <option value={2.0}>2.0x (XHDPI Retina)</option>
              <option value={3.0}>3.0x (XXHDPI)</option>
              <option value={3.5}>3.5x (XXXHDPI OLED)</option>
            </select>
          </div>
        </div>

        <div className="flex justify-end pt-2">
          <button
            onClick={handleApplyCustomDevice}
            className="flex items-center gap-2 bg-[#89d185] hover:bg-[#72be6e] text-[#141414] font-bold px-4 py-2 rounded text-xs transition-colors shadow-md"
          >
            <Plus className="w-4 h-4" />
            <span>Crear y Probar Resolución</span>
          </button>
        </div>
      </div>
    </div>
  );
};
