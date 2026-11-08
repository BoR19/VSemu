/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 * PWA Studio Preview - Visual Studio Code Extension Webview UI
 */

import React, { useState, useEffect } from 'react';
import { TabSection, DevicePreset, DetectedDevice, PWAAuditReport, ConsoleLog, NetworkThrottlingPreset, ADBDaemonState, ExtensionSettings } from './types/pwaStudio';
import { DEVICE_PRESETS, SAMPLE_ANDROID_DEVICES, DEFAULT_AUDIT_CHECKS } from './data/devicePresets';
import { vscodeBridge } from './vscode/vscodeBridge';

import { VSCodeHeader } from './components/layout/VSCodeHeader';
import { VSCodeSidebar } from './components/layout/VSCodeSidebar';

import { DashboardSection } from './components/sections/DashboardSection';
import { PhoneEmulatorSection } from './components/sections/PhoneEmulatorSection';
import { DeviceSelectorSection } from './components/sections/DeviceSelectorSection';
import { AndroidADBSection } from './components/sections/AndroidADBSection';
import { PWADiagnosticsSection } from './components/sections/PWADiagnosticsSection';
import { ConsoleSection } from './components/sections/ConsoleSection';
import { NetworkOfflineSection } from './components/sections/NetworkOfflineSection';
import { SettingsSection } from './components/sections/SettingsSection';

export default function App() {
  // Navigation & View State
  const [activeTab, setActiveTab] = useState<TabSection>('dashboard');
  const [targetUrl, setTargetUrl] = useState<string>('https://pwastripes.app');
  const [selectedDevice, setSelectedDevice] = useState<DevicePreset>(DEVICE_PRESETS[0]); // Default Pixel 9 Pro
  const [orientation, setOrientation] = useState<'portrait' | 'landscape'>('portrait');
  const [iframeKey, setIframeKey] = useState<number>(Date.now());

  // Hardware ADB State
  const [detectedDevices, setDetectedDevices] = useState<DetectedDevice[]>(SAMPLE_ANDROID_DEVICES);
  const [adbDaemon, setAdbDaemon] = useState<ADBDaemonState>({
    isRunning: true,
    version: '1.0.41',
    port: 5037,
    connectedCount: 4,
    customAdbPath: 'adb',
    autoScanInterval: 5,
  });

  // Diagnostic Audit State
  const [auditReport, setAuditReport] = useState<PWAAuditReport | null>({
    timestamp: new Date().toISOString(),
    targetUrl: 'https://pwastripes.app',
    overallScore: 95,
    manifestScore: 100,
    serviceWorkerScore: 90,
    offlineScore: 95,
    securityScore: 100,
    checks: DEFAULT_AUDIT_CHECKS,
    manifestData: null,
    serviceWorkerRegistered: true,
    isHttps: true,
  });

  // Console Logs State
  const [logs, setLogs] = useState<ConsoleLog[]>([
    {
      id: 'log-1',
      timestamp: new Date().toLocaleTimeString(),
      level: 'info',
      source: 'VS Code Extension',
      message: 'PWA Studio Preview Webview UI cargada correctamente.'
    },
    {
      id: 'log-2',
      timestamp: new Date().toLocaleTimeString(),
      level: 'bridge',
      source: 'VS Code Extension',
      message: 'Escuchando canal de comunicación bidireccional postMessage (pwaStudio/*).'
    },
    {
      id: 'log-3',
      timestamp: new Date().toLocaleTimeString(),
      level: 'info',
      source: 'ADB Daemon',
      message: 'ADB Daemon respondiendo en localhost:5037. 4 dispositivos emparejados (Samsung, Pixel, Motorola, Xiaomi).'
    }
  ]);

  // Network & Throttling State
  const [currentNetworkProfile, setCurrentNetworkProfile] = useState<NetworkThrottlingPreset>('online');
  const [isOffline, setIsOffline] = useState<boolean>(false);

  // Settings & Extension State
  const [mockMode, setMockMode] = useState<boolean>(true);
  const [settings, setSettings] = useState<ExtensionSettings>({
    targetPwaUrl: 'https://pwastripes.app',
    customAdbPath: 'adb',
    autoScanDevices: true,
    scanIntervalSeconds: 5,
    defaultDevicePresetId: 'pixel-9-pro',
    mockMode: true,
    enableTelemetry: false,
    syncVsCodeTheme: true,
    showPhoneBezel: true,
    defaultOrientation: 'portrait',
  });

  // Handle incoming VS Code messages
  useEffect(() => {
    const unsubscribe = vscodeBridge.subscribe((msg) => {
      const newLog: ConsoleLog = {
        id: `log-${Date.now()}`,
        timestamp: new Date().toLocaleTimeString(),
        level: 'bridge',
        source: 'VS Code Extension',
        message: `Mensaje recibido de VS Code: ${msg.type}`,
        details: JSON.stringify(msg.payload)
      };
      setLogs((prev) => [newLog, ...prev]);

      if (msg.type === 'pwaStudio/deviceListUpdated' && Array.isArray(msg.payload)) {
        setDetectedDevices(msg.payload);
      }
    });

    return () => unsubscribe();
  }, []);

  const handleRefreshIframe = () => {
    setIframeKey(Date.now());
    const newLog: ConsoleLog = {
      id: `log-${Date.now()}`,
      timestamp: new Date().toLocaleTimeString(),
      level: 'info',
      source: 'PWA Runtime',
      message: `Recargando vista previa en emulador: ${targetUrl}`
    };
    setLogs((prev) => [newLog, ...prev]);
  };

  const toggleOrientation = () => {
    setOrientation((prev) => (prev === 'portrait' ? 'landscape' : 'portrait'));
  };

  const handleRunAudit = () => {
    setAuditReport({
      timestamp: new Date().toISOString(),
      targetUrl,
      overallScore: 98,
      manifestScore: 100,
      serviceWorkerScore: 95,
      offlineScore: 100,
      securityScore: 100,
      checks: DEFAULT_AUDIT_CHECKS,
      manifestData: null,
      serviceWorkerRegistered: true,
      isHttps: true,
    });

    const newLog: ConsoleLog = {
      id: `log-${Date.now()}`,
      timestamp: new Date().toLocaleTimeString(),
      level: 'info',
      source: 'Audit Engine',
      message: `Diagnóstico PWA completado para ${targetUrl}. Score: 98/100.`
    };
    setLogs((prev) => [newLog, ...prev]);
  };

  const handleRefreshDevices = () => {
    vscodeBridge.postMessage('pwaStudio/scanAdbDevices');
    const newLog: ConsoleLog = {
      id: `log-${Date.now()}`,
      timestamp: new Date().toLocaleTimeString(),
      level: 'info',
      source: 'ADB Daemon',
      message: 'Solicitud de escaneo ADB emitida.'
    };
    setLogs((prev) => [newLog, ...prev]);
  };

  const handleClearLogs = () => {
    setLogs([]);
  };

  const consoleErrorsCount = logs.filter((l) => l.level === 'error').length;

  return (
    <div className="flex flex-col h-screen w-screen bg-[#1e1e1e] text-[#cccccc] font-sans overflow-hidden select-none">
      {/* Top VS Code Extension Header */}
      <VSCodeHeader
        targetUrl={targetUrl}
        setTargetUrl={setTargetUrl}
        onRefreshIframe={handleRefreshIframe}
        adbDaemonRunning={adbDaemon.isRunning}
        detectedDevicesCount={detectedDevices.length}
        mockMode={mockMode}
        setMockMode={setMockMode}
        isOffline={isOffline}
      />

      {/* Main Workspace Split (Sidebar + Viewport) */}
      <div className="flex flex-1 overflow-hidden">
        {/* Left VS Code Sidebar Navigation */}
        <VSCodeSidebar
          activeTab={activeTab}
          setActiveTab={setActiveTab}
          detectedDevicesCount={detectedDevices.length}
          auditScore={auditReport ? auditReport.overallScore : null}
          consoleErrorsCount={consoleErrorsCount}
          isOffline={isOffline}
          orientation={orientation}
          toggleOrientation={toggleOrientation}
        />

        {/* Main Content Area */}
        <main className="flex-1 overflow-hidden bg-[#181818] relative">
          {activeTab === 'dashboard' && (
            <DashboardSection
              targetUrl={targetUrl}
              setTargetUrl={setTargetUrl}
              setActiveTab={setActiveTab}
              detectedDevices={detectedDevices}
              selectedDevice={selectedDevice}
              auditReport={auditReport}
              adbDaemonRunning={adbDaemon.isRunning}
              isOffline={isOffline}
              onRunAudit={handleRunAudit}
              onRefreshDevices={handleRefreshDevices}
            />
          )}

          {activeTab === 'emulator' && (
            <PhoneEmulatorSection
              targetUrl={targetUrl}
              selectedDevice={selectedDevice}
              setSelectedDevice={setSelectedDevice}
              orientation={orientation}
              setOrientation={setOrientation}
              onRefreshIframe={handleRefreshIframe}
              iframeKey={iframeKey}
            />
          )}

          {activeTab === 'devices' && (
            <DeviceSelectorSection
              selectedDevice={selectedDevice}
              setSelectedDevice={setSelectedDevice}
              setActiveTab={setActiveTab}
            />
          )}

          {activeTab === 'android-adb' && (
            <AndroidADBSection
              detectedDevices={detectedDevices}
              setDetectedDevices={setDetectedDevices}
              adbDaemon={adbDaemon}
              setAdbDaemon={setAdbDaemon}
              targetUrl={targetUrl}
            />
          )}

          {activeTab === 'diagnostics' && (
            <PWADiagnosticsSection
              targetUrl={targetUrl}
              auditReport={auditReport}
              onRunAudit={handleRunAudit}
            />
          )}

          {activeTab === 'console' && (
            <ConsoleSection logs={logs} onClearLogs={handleClearLogs} />
          )}

          {activeTab === 'network' && (
            <NetworkOfflineSection
              currentProfile={currentNetworkProfile}
              setCurrentProfile={setCurrentNetworkProfile}
              isOffline={isOffline}
              setIsOffline={setIsOffline}
              targetUrl={targetUrl}
            />
          )}

          {activeTab === 'settings' && (
            <SettingsSection settings={settings} setSettings={setSettings} />
          )}
        </main>
      </div>
    </div>
  );
}
