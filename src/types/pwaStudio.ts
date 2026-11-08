/**
 * Types & Data structures for PWA Studio Preview (VS Code Extension Webview)
 */

export type TabSection =
  | 'dashboard'
  | 'emulator'
  | 'devices'
  | 'android-adb'
  | 'diagnostics'
  | 'console'
  | 'network'
  | 'settings';

export type DeviceBrand = 'Samsung' | 'Google Pixel' | 'Xiaomi' | 'Motorola' | 'OnePlus' | 'Generic';

export interface DevicePreset {
  id: string;
  name: string;
  brand: DeviceBrand;
  screenSize: string;
  viewportWidth: number;
  viewportHeight: number;
  dpr: number;
  hasNotch: boolean;
  notchType: 'punch-hole' | 'dynamic-island' | 'classic' | 'none';
  releaseYear: number;
  userAgent: string;
  popularInRegions: string[];
}

export type ConnectionType = 'usb' | 'wifi';

export type ADBDeviceStatus = 
  | 'detected' 
  | 'adb_authorized' 
  | 'pairing_required' 
  | 'port_forwarded' 
  | 'disconnected';

export interface DetectedDevice {
  id: string;
  model: string;
  brand: DeviceBrand;
  manufacturer: string;
  serialNumber: string;
  ipAddress?: string;
  connectionType: ConnectionType;
  status: ADBDeviceStatus;
  batteryLevel: number;
  androidVersion: string;
  sdkVersion: number;
  screenResolution: string;
  portForwardActive: boolean;
  forwardedPort?: number;
  lastSeen: string;
  isRealHardware: boolean; // Differentiates detected devices in UI
}

export interface PWAManifestIcon {
  src: string;
  sizes: string;
  type: string;
  purpose?: string;
}

export interface PWAManifest {
  name: string;
  short_name: string;
  description: string;
  start_url: string;
  display: 'standalone' | 'minimal-ui' | 'fullscreen' | 'browser';
  background_color: string;
  theme_color: string;
  orientation?: string;
  scope?: string;
  icons: PWAManifestIcon[];
  categories?: string[];
}

export type AuditStatus = 'pass' | 'fail' | 'warn' | 'pending';

export interface AuditCheckItem {
  id: string;
  category: 'manifest' | 'serviceworker' | 'security' | 'offline' | 'performance';
  title: string;
  description: string;
  status: AuditStatus;
  remediation?: string;
  scoreWeight: number;
}

export interface PWAAuditReport {
  timestamp: string;
  targetUrl: string;
  overallScore: number;
  manifestScore: number;
  serviceWorkerScore: number;
  offlineScore: number;
  securityScore: number;
  checks: AuditCheckItem[];
  manifestData: PWAManifest | null;
  serviceWorkerRegistered: boolean;
  isHttps: boolean;
}

export type NetworkThrottlingPreset = 'online' | 'fast3g' | 'slow3g' | 'offline';

export interface NetworkProfile {
  id: NetworkThrottlingPreset;
  name: string;
  downloadKbps: number;
  uploadKbps: number;
  latencyMs: number;
  description: string;
}

export type LogLevel = 'error' | 'warn' | 'info' | 'debug' | 'bridge';

export interface ConsoleLog {
  id: string;
  timestamp: string;
  level: LogLevel;
  source: 'PWA Runtime' | 'Service Worker' | 'ADB Daemon' | 'VS Code Extension' | 'Audit Engine';
  message: string;
  details?: string;
}

export interface ADBDaemonState {
  isRunning: boolean;
  version: string;
  port: number;
  connectedCount: number;
  customAdbPath: string;
  autoScanInterval: number;
}

export interface ExtensionSettings {
  targetPwaUrl: string;
  customAdbPath: string;
  autoScanDevices: boolean;
  scanIntervalSeconds: number;
  defaultDevicePresetId: string;
  mockMode: boolean; // Allows testing VS Code Extension Webview RPC locally
  enableTelemetry: boolean;
  syncVsCodeTheme: boolean;
  showPhoneBezel: boolean;
  defaultOrientation: 'portrait' | 'landscape';
}

/**
 * Message types for VS Code Extension <-> Webview Communication
 */
export type VSCodeIncomingMessageType =
  | 'pwaStudio/init'
  | 'pwaStudio/deviceListUpdated'
  | 'pwaStudio/adbStatusChanged'
  | 'pwaStudio/auditReportReady'
  | 'pwaStudio/consoleLogAdded'
  | 'pwaStudio/networkStateChanged';

export interface VSCodeIncomingMessage {
  type: VSCodeIncomingMessageType;
  payload: any;
}
