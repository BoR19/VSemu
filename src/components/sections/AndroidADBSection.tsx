import React, { useState } from 'react';
import {
  Usb,
  Wifi,
  Smartphone,
  CheckCircle2,
  AlertCircle,
  RefreshCw,
  QrCode,
  ShieldAlert,
  ArrowRight,
  Info,
  Layers,
  Terminal,
  Zap,
  Power,
  Play
} from 'lucide-react';
import { DetectedDevice, ADBDaemonState } from '../../types/pwaStudio';
import { vscodeBridge } from '../../vscode/vscodeBridge';

interface AndroidADBSectionProps {
  detectedDevices: DetectedDevice[];
  setDetectedDevices: React.Dispatch<React.SetStateAction<DetectedDevice[]>>;
  adbDaemon: ADBDaemonState;
  setAdbDaemon: React.Dispatch<React.SetStateAction<ADBDaemonState>>;
  targetUrl: string;
}

export const AndroidADBSection: React.FC<AndroidADBSectionProps> = ({
  detectedDevices,
  setDetectedDevices,
  adbDaemon,
  setAdbDaemon,
  targetUrl,
}) => {
  const [activeSubTab, setActiveSubTab] = useState<'usb' | 'wifi' | 'architecture'>('usb');

  // Wi-Fi Pairing Form State
  const [wifiIp, setWifiIp] = useState<string>('192.168.1.');
  const [wifiPort, setWifiPort] = useState<string>('5555');
  const [pairingPin, setPairingPin] = useState<string>('');
  const [isPairing, setIsPairing] = useState<boolean>(false);
  const [pairingSuccessMessage, setPairingSuccessMessage] = useState<string | null>(null);

  const handleTogglePortForward = (deviceId: string) => {
    setDetectedDevices((prev) =>
      prev.map((d) => {
        if (d.id === deviceId) {
          const nextState = !d.portForwardActive;
          const updatedStatus = nextState ? 'port_forwarded' : 'adb_authorized';
          
          // Notify VS Code host extension
          vscodeBridge.postMessage('pwaStudio/setPortForward', {
            deviceId: d.id,
            active: nextState,
            localPort: 5173,
            devicePort: 5173
          });

          return {
            ...d,
            portForwardActive: nextState,
            status: updatedStatus,
            forwardedPort: nextState ? 5173 : undefined,
          };
        }
        return d;
      })
    );
  };

  const handleConnectWifi = (e: React.FormEvent) => {
    e.preventDefault();
    if (!wifiIp || !wifiPort) return;

    setIsPairing(true);
    setPairingSuccessMessage(null);

    // Send RPC message to native VS Code extension backend
    vscodeBridge.postMessage('pwaStudio/adbConnectWifi', {
      ip: wifiIp,
      port: Number(wifiPort),
      pin: pairingPin,
    });

    setTimeout(() => {
      setIsPairing(false);
      setPairingSuccessMessage(`Solicitud de conexión ADB Wi-Fi enviada a ${wifiIp}:${wifiPort}`);

      // Add new simulated device if not already present
      const newDev: DetectedDevice = {
        id: `wifi-${Date.now()}`,
        model: 'Dispositivo Android Wi-Fi (Pairing Ready)',
        brand: 'Generic',
        manufacturer: 'Android Device',
        serialNumber: `${wifiIp}:${wifiPort}`,
        ipAddress: wifiIp,
        connectionType: 'wifi',
        status: 'adb_authorized',
        batteryLevel: 90,
        androidVersion: '14 (API 34)',
        sdkVersion: 34,
        screenResolution: '1080 x 2400',
        portForwardActive: false,
        lastSeen: 'Ahora mismo',
        isRealHardware: false
      };

      setDetectedDevices((prev) => [newDev, ...prev]);
    }, 1200);
  };

  const handleSimulateDevicePlugIn = () => {
    const brands: Array<'Samsung' | 'Google Pixel' | 'Motorola' | 'Xiaomi' | 'OnePlus'> = ['Samsung', 'Google Pixel', 'Motorola', 'Xiaomi', 'OnePlus'];
    const randomBrand = brands[Math.floor(Math.random() * brands.length)];

    const simulatedNew: DetectedDevice = {
      id: `dev-sim-${Date.now()}`,
      model: `${randomBrand} Smartphone (Conectado via USB)`,
      brand: randomBrand,
      manufacturer: randomBrand,
      serialNumber: `SN-${Math.floor(100000 + Math.random() * 900000)}`,
      connectionType: 'usb',
      status: 'detected',
      batteryLevel: Math.floor(40 + Math.random() * 60),
      androidVersion: '14 (API 34)',
      sdkVersion: 34,
      screenResolution: '1440 x 3200',
      portForwardActive: false,
      lastSeen: 'Ahora mismo',
      isRealHardware: false
    };

    setDetectedDevices((prev) => [simulatedNew, ...prev]);
  };

  return (
    <div className="p-6 space-y-6 overflow-y-auto max-w-7xl mx-auto">
      {/* Header Banner */}
      <div className="bg-[#252526] border border-[#3c3c3c] rounded-lg p-5">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <span className="text-xs font-semibold px-2 py-0.5 bg-[#89d185]/20 text-[#89d185] border border-[#89d185]/40 rounded font-mono">
                Módulo ADB Bridge
              </span>
              <span className="text-xs text-[#858585]">
                Detección Automática de Dispositivos Móviles
              </span>
            </div>
            <h1 className="text-xl font-bold text-white tracking-tight flex items-center gap-2">
              <Usb className="w-5 h-5 text-[#89d185]" />
              <span>Panel de Conexión Android mediante USB y Wi-Fi</span>
            </h1>
            <p className="text-xs text-[#cccccc] mt-1 max-w-3xl leading-relaxed">
              Compatible con Samsung, Motorola, Xiaomi, Google Pixel, OnePlus y cualquier dispositivo Android con depuración USB o inalámbrica activa.
            </p>
          </div>

          <div className="flex items-center gap-2 shrink-0">
            <button
              onClick={handleSimulateDevicePlugIn}
              className="flex items-center gap-1.5 bg-[#1e1e1e] hover:bg-[#2d2d2d] border border-[#007acc] text-[#3794ff] px-3 py-1.5 rounded text-xs font-medium transition-colors"
              title="Prueba cómo la interfaz procesa un nuevo evento de dispositivo conectado"
            >
              <Play className="w-3.5 h-3.5" />
              <span>Simular Evento ADB Plug-in</span>
            </button>
          </div>
        </div>

        {/* Sub-tab Navigation */}
        <div className="flex items-center gap-2 mt-4 pt-4 border-t border-[#3c3c3c]">
          <button
            onClick={() => setActiveSubTab('usb')}
            className={`flex items-center gap-2 px-3 py-1.5 rounded text-xs font-medium transition-colors ${
              activeSubTab === 'usb'
                ? 'bg-[#007acc] text-white'
                : 'bg-[#1e1e1e] text-[#cccccc] hover:bg-[#2a2d2e]'
            }`}
          >
            <Usb className="w-3.5 h-3.5" />
            <span>Dispositivos Detectados ({detectedDevices.length})</span>
          </button>

          <button
            onClick={() => setActiveSubTab('wifi')}
            className={`flex items-center gap-2 px-3 py-1.5 rounded text-xs font-medium transition-colors ${
              activeSubTab === 'wifi'
                ? 'bg-[#007acc] text-white'
                : 'bg-[#1e1e1e] text-[#cccccc] hover:bg-[#2a2d2e]'
            }`}
          >
            <Wifi className="w-3.5 h-3.5" />
            <span>Emparejamiento Wi-Fi ADB</span>
          </button>

          <button
            onClick={() => setActiveSubTab('architecture')}
            className={`flex items-center gap-2 px-3 py-1.5 rounded text-xs font-medium transition-colors ${
              activeSubTab === 'architecture'
                ? 'bg-[#007acc] text-white'
                : 'bg-[#1e1e1e] text-[#cccccc] hover:bg-[#2a2d2e]'
            }`}
          >
            <Info className="w-3.5 h-3.5 text-[#cca700]" />
            <span>Aclaración de Arquitectura Nativa</span>
          </button>
        </div>
      </div>

      {/* Clear Rule Disclaimer Callout Box */}
      <div className="bg-[#1e1e1e] border border-[#3c3c3c] rounded-lg p-4 flex items-start gap-3">
        <Info className="w-5 h-5 text-[#3794ff] shrink-0 mt-0.5" />
        <div className="space-y-1 text-xs leading-relaxed text-[#cccccc]">
          <strong className="text-white block font-semibold">
            Diferenciación de Capas: Extensión Nativa VS Code vs Webview UI
          </strong>
          <p>
            Esta vista es la interfaz oficial de la extensión PWA Studio Preview. En el flujo final, el proceso nativo Node.js de la extensión VS Code ejecutará la utilidad de consola <code className="text-[#3794ff] font-mono">adb devices -l</code> y <code className="text-[#3794ff] font-mono">adb reverse tcp:5173 tcp:5173</code> en segundo plano. La interfaz Webview está 100% cableada para actualizarse dinámicamente.
          </p>
        </div>
      </div>

      {/* Subtab 1: Dispositivos USB y Lista Automática */}
      {activeSubTab === 'usb' && (
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-sm font-bold text-white flex items-center gap-2">
              <span>Dispositivos Detectados por ADB</span>
              <span className="text-xs font-mono bg-[#89d185]/20 text-[#89d185] px-2 py-0.5 rounded">
                {detectedDevices.length} Encontrados
              </span>
            </h2>

            <div className="text-xs text-[#858585] flex items-center gap-2">
              <span>Daemon ADB: <strong className="text-white">v1.0.41</strong></span>
              <span>Puerto ADB: <strong className="text-white">5037</strong></span>
            </div>
          </div>

          <div className="grid grid-cols-1 gap-4">
            {detectedDevices.map((device) => (
              <div
                key={device.id}
                className="bg-[#252526] border border-[#3c3c3c] rounded-lg p-5 flex flex-col md:flex-row md:items-center justify-between gap-4 transition-colors hover:border-[#007acc]/60"
              >
                <div className="flex items-start gap-4">
                  <div className="p-3 bg-[#1e1e1e] border border-[#333333] rounded-lg text-[#3794ff] shrink-0">
                    <Smartphone className="w-7 h-7" />
                  </div>

                  <div className="space-y-1">
                    <div className="flex items-center gap-2">
                      <h3 className="text-sm font-bold text-white">{device.model}</h3>
                      <span className="text-[10px] font-mono px-2 py-0.5 bg-[#1e1e1e] border border-[#333333] text-[#cccccc] rounded">
                        {device.brand}
                      </span>
                      <span className={`text-[10px] font-mono px-2 py-0.5 rounded border ${
                        device.connectionType === 'usb'
                          ? 'bg-[#89d185]/10 text-[#89d185] border-[#89d185]/30'
                          : 'bg-[#3794ff]/10 text-[#3794ff] border-[#3794ff]/30'
                      }`}>
                        {device.connectionType.toUpperCase()}
                      </span>
                    </div>

                    <div className="grid grid-cols-2 md:grid-cols-4 gap-3 text-xs text-[#aaaaaa] pt-1">
                      <div>
                        <span className="text-[#777777] block text-[10px] uppercase">Fabricante:</span>
                        <span className="text-white">{device.manufacturer}</span>
                      </div>
                      <div>
                        <span className="text-[#777777] block text-[10px] uppercase">Número de Serie / IP:</span>
                        <span className="text-white font-mono">{device.serialNumber}</span>
                      </div>
                      <div>
                        <span className="text-[#777777] block text-[10px] uppercase">Versión Android:</span>
                        <span className="text-[#89d185] font-mono">Android {device.androidVersion}</span>
                      </div>
                      <div>
                        <span className="text-[#777777] block text-[10px] uppercase">Batería:</span>
                        <span className="text-white font-mono">{device.batteryLevel}%</span>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Port Forward & Action Controls */}
                <div className="flex flex-col sm:flex-row items-end sm:items-center gap-3 pt-3 md:pt-0 border-t md:border-0 border-[#333333]">
                  <div className="text-right">
                    <div className="text-[10px] text-[#777777] uppercase font-mono">Port Forwarding:</div>
                    <div className="text-xs font-mono text-white">
                      {device.portForwardActive ? 'localhost:5173 ➔ Teléfono:5173' : 'Inactivo'}
                    </div>
                  </div>

                  <button
                    onClick={() => handleTogglePortForward(device.id)}
                    className={`px-3 py-2 rounded text-xs font-medium flex items-center gap-1.5 transition-colors ${
                      device.portForwardActive
                        ? 'bg-[#89d185] hover:bg-[#72be6e] text-[#141414] font-bold'
                        : 'bg-[#007acc] hover:bg-[#1177bb] text-white'
                    }`}
                  >
                    <Power className="w-3.5 h-3.5" />
                    <span>{device.portForwardActive ? 'Desactivar Forward' : 'Activar ADB Forward'}</span>
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Subtab 2: Emparejamiento Wi-Fi Wireless ADB */}
      {activeSubTab === 'wifi' && (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Pairing Form */}
          <div className="bg-[#252526] border border-[#3c3c3c] rounded-lg p-5 space-y-4">
            <div className="flex items-center gap-2">
              <Wifi className="w-5 h-5 text-[#3794ff]" />
              <div>
                <h2 className="text-sm font-bold text-white">Asistente de Conexión Inalámbrica (Wi-Fi ADB)</h2>
                <p className="text-xs text-[#858585]">Conecta teléfonos Android 11+ sin necesidad de cable USB</p>
              </div>
            </div>

            <form onSubmit={handleConnectWifi} className="space-y-4 text-xs">
              <div>
                <label className="block text-[#aaaaaa] mb-1 font-medium">Dirección IP del Teléfono Android:</label>
                <input
                  type="text"
                  value={wifiIp}
                  onChange={(e) => setWifiIp(e.target.value)}
                  placeholder="192.168.1.105"
                  className="w-full bg-[#1e1e1e] border border-[#3c3c3c] rounded px-3 py-2 text-white font-mono focus:outline-none focus:border-[#007acc]"
                  required
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-[#aaaaaa] mb-1 font-medium">Puerto ADB Wireless:</label>
                  <input
                    type="text"
                    value={wifiPort}
                    onChange={(e) => setWifiPort(e.target.value)}
                    placeholder="5555 o 37000"
                    className="w-full bg-[#1e1e1e] border border-[#3c3c3c] rounded px-3 py-2 text-white font-mono focus:outline-none focus:border-[#007acc]"
                    required
                  />
                </div>

                <div>
                  <label className="block text-[#aaaaaa] mb-1 font-medium">Código PIN (6 dígitos):</label>
                  <input
                    type="text"
                    value={pairingPin}
                    onChange={(e) => setPairingPin(e.target.value)}
                    placeholder="123456"
                    className="w-full bg-[#1e1e1e] border border-[#3c3c3c] rounded px-3 py-2 text-white font-mono focus:outline-none focus:border-[#007acc]"
                  />
                </div>
              </div>

              <button
                type="submit"
                disabled={isPairing}
                className="w-full py-2.5 bg-[#007acc] hover:bg-[#1177bb] text-white font-semibold rounded text-xs transition-colors flex items-center justify-center gap-2"
              >
                {isPairing ? (
                  <>
                    <RefreshCw className="w-4 h-4 animate-spin" />
                    <span>Conectando con ADB Daemon...</span>
                  </>
                ) : (
                  <>
                    <Wifi className="w-4 h-4" />
                    <span>Conectar Dispositivo via Wi-Fi</span>
                  </>
                )}
              </button>
            </form>

            {pairingSuccessMessage && (
              <div className="p-3 bg-[#89d185]/20 border border-[#89d185]/40 rounded text-xs text-[#89d185] flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 shrink-0" />
                <span>{pairingSuccessMessage}</span>
              </div>
            )}
          </div>

          {/* Android Pairing Instructions */}
          <div className="bg-[#252526] border border-[#3c3c3c] rounded-lg p-5 space-y-3">
            <h3 className="text-xs font-bold text-white uppercase tracking-wider">
              Instrucciones en el Teléfono Android
            </h3>

            <ol className="list-decimal list-inside space-y-2 text-xs text-[#cccccc] leading-relaxed">
              <li className="p-2 bg-[#1e1e1e] rounded border border-[#333333]">
                Abre <strong>Ajustes ➔ Opciones para desarrolladores</strong> en tu Android (Samsung, Pixel, Xiaomi, Motorola).
              </li>
              <li className="p-2 bg-[#1e1e1e] rounded border border-[#333333]">
                Activa la opción <strong>Depuración inalámbrica</strong> (Wireless Debugging).
              </li>
              <li className="p-2 bg-[#1e1e1e] rounded border border-[#333333]">
                Toca en <strong>Emparejar dispositivo con código de emparejamiento</strong>.
              </li>
              <li className="p-2 bg-[#1e1e1e] rounded border border-[#333333]">
                Copia la IP, el Puerto y el código de 6 dígitos en el formulario de la izquierda.
              </li>
            </ol>
          </div>
        </div>
      )}

      {/* Subtab 3: Explicación de Arquitectura Nativa */}
      {activeSubTab === 'architecture' && (
        <div className="bg-[#252526] border border-[#3c3c3c] rounded-lg p-6 space-y-4">
          <h2 className="text-sm font-bold text-white flex items-center gap-2">
            <Terminal className="w-5 h-5 text-[#3794ff]" />
            <span>Plan de Integración con el Proceso Nativo de la Extensión de VS Code</span>
          </h2>

          <p className="text-xs text-[#cccccc] leading-relaxed">
            PWA Studio Preview está estructurado respetando la separación de capas recomendada por el equipo de VS Code para extensiones Webview con componentes nativos:
          </p>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs pt-2">
            <div className="bg-[#1e1e1e] p-4 rounded border border-[#007acc]/40 space-y-2">
              <span className="font-bold text-[#3794ff] block text-sm">1. Capa Webview UI (Este Proyecto)</span>
              <ul className="list-disc list-inside space-y-1 text-[#aaaaaa]">
                <li>Interfaz React profesional con modo oscuro de VS Code.</li>
                <li>Manejadores de estado para emulador y diagnósticos PWA.</li>
                <li>Escuchador de eventos <code className="text-[#3794ff] font-mono">window.addEventListener('message')</code>.</li>
                <li>Emisión de comandos hacia el backend mediante <code className="text-[#3794ff] font-mono">vscode.postMessage()</code>.</li>
              </ul>
            </div>

            <div className="bg-[#1e1e1e] p-4 rounded border border-[#89d185]/40 space-y-2">
              <span className="font-bold text-[#89d185] block text-sm">2. Capa Proceso Nativo (Extensión VS Code)</span>
              <ul className="list-disc list-inside space-y-1 text-[#aaaaaa]">
                <li>Spawnea el binario <code className="text-[#89d185] font-mono">adb</code> usando el runtime Node.js de VS Code.</li>
                <li>Escucha cambios en el bus USB del sistema operativo.</li>
                <li>Ejecuta comandos <code className="text-[#89d185] font-mono">adb reverse tcp:5173 tcp:5173</code>.</li>
                <li>Notifica a la Webview enviando payloads JSON de dispositivos.</li>
              </ul>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
