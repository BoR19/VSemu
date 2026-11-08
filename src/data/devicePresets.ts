import { DevicePreset, DetectedDevice, AuditCheckItem, NetworkProfile } from '../types/pwaStudio';

export const DEVICE_PRESETS: DevicePreset[] = [
  {
    id: 'pixel-9-pro',
    name: 'Google Pixel 9 Pro',
    brand: 'Google Pixel',
    screenSize: '6.3"',
    viewportWidth: 412,
    viewportHeight: 915,
    dpr: 3,
    hasNotch: true,
    notchType: 'punch-hole',
    releaseYear: 2024,
    userAgent: 'Mozilla/5.0 (Linux; Android 15; Pixel 9 Pro Build/AP2A.240805.005) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/128.0.0.0 Mobile Safari/537.36',
    popularInRegions: ['América del Norte', 'Europa', 'Japón']
  },
  {
    id: 'samsung-s24-ultra',
    name: 'Samsung Galaxy S24 Ultra',
    brand: 'Samsung',
    screenSize: '6.8"',
    viewportWidth: 412,
    viewportHeight: 912,
    dpr: 3.5,
    hasNotch: true,
    notchType: 'punch-hole',
    releaseYear: 2024,
    userAgent: 'Mozilla/5.0 (Linux; Android 14; SM-S928B Build/UP1A.231005.007) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/127.0.6533.103 Mobile Safari/537.36',
    popularInRegions: ['Global', 'América Latina', 'Europa', 'Asia']
  },
  {
    id: 'xiaomi-14-pro',
    name: 'Xiaomi 14 Pro',
    brand: 'Xiaomi',
    screenSize: '6.73"',
    viewportWidth: 393,
    viewportHeight: 873,
    dpr: 3,
    hasNotch: true,
    notchType: 'punch-hole',
    releaseYear: 2024,
    userAgent: 'Mozilla/5.0 (Linux; Android 14; 23116PN5BC Build/UKQ1.230804.001) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/126.0.0.0 Mobile Safari/537.36',
    popularInRegions: ['América Latina', 'Europa', 'Asia']
  },
  {
    id: 'motorola-edge-50',
    name: 'Motorola Edge 50 Ultra',
    brand: 'Motorola',
    screenSize: '6.7"',
    viewportWidth: 412,
    viewportHeight: 915,
    dpr: 3,
    hasNotch: true,
    notchType: 'punch-hole',
    releaseYear: 2024,
    userAgent: 'Mozilla/5.0 (Linux; Android 14; motorola edge 50 ultra) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/128.0.0.0 Mobile Safari/537.36',
    popularInRegions: ['América Latina', 'Norteamérica', 'Europa']
  },
  {
    id: 'oneplus-12',
    name: 'OnePlus 12',
    brand: 'OnePlus',
    screenSize: '6.82"',
    viewportWidth: 412,
    viewportHeight: 915,
    dpr: 3.5,
    hasNotch: true,
    notchType: 'punch-hole',
    releaseYear: 2024,
    userAgent: 'Mozilla/5.0 (Linux; Android 14; CPH2581 Build/UKQ1.230924.001) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/127.0.0.0 Mobile Safari/537.36',
    popularInRegions: ['India', 'Norteamérica', 'Europa']
  },
  {
    id: 'iphone-15-pro',
    name: 'Apple iPhone 15 Pro',
    brand: 'Generic',
    screenSize: '6.1"',
    viewportWidth: 393,
    viewportHeight: 852,
    dpr: 3,
    hasNotch: true,
    notchType: 'dynamic-island',
    releaseYear: 2023,
    userAgent: 'Mozilla/5.0 (iPhone; CPU iPhone OS 17_5_1 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/17.5 Mobile/15E148 Safari/604.1',
    popularInRegions: ['Global']
  }
];

// Sample Android detected hardware structure (Differentiates ready state for extension ADB)
export const SAMPLE_ANDROID_DEVICES: DetectedDevice[] = [
  {
    id: 'dev-sm-s928b',
    model: 'Galaxy S24 Ultra (SM-S928B)',
    brand: 'Samsung',
    manufacturer: 'Samsung Electronics',
    serialNumber: 'R5CW200X99A',
    ipAddress: '192.168.1.105',
    connectionType: 'usb',
    status: 'port_forwarded',
    batteryLevel: 88,
    androidVersion: '14 (API 34)',
    sdkVersion: 34,
    screenResolution: '1440 x 3120',
    portForwardActive: true,
    forwardedPort: 5173,
    lastSeen: 'Hace 5 segundos',
    isRealHardware: false
  },
  {
    id: 'dev-pixel-9',
    model: 'Pixel 9 Pro (Tokay)',
    brand: 'Google Pixel',
    manufacturer: 'Google',
    serialNumber: '47011FDH2003J',
    ipAddress: '192.168.1.142',
    connectionType: 'wifi',
    status: 'adb_authorized',
    batteryLevel: 94,
    androidVersion: '15 (API 35)',
    sdkVersion: 35,
    screenResolution: '1280 x 2856',
    portForwardActive: false,
    lastSeen: 'Hace 1 minuto',
    isRealHardware: false
  },
  {
    id: 'dev-moto-edge',
    model: 'Motorola Edge 50 Ultra',
    brand: 'Motorola',
    manufacturer: 'Motorola Mobility',
    serialNumber: 'ZY22G88KLM',
    ipAddress: '192.168.1.189',
    connectionType: 'wifi',
    status: 'pairing_required',
    batteryLevel: 62,
    androidVersion: '14 (API 34)',
    sdkVersion: 34,
    screenResolution: '1220 x 2712',
    portForwardActive: false,
    lastSeen: 'Hace 3 minutos',
    isRealHardware: false
  },
  {
    id: 'dev-xiaomi-14',
    model: 'Xiaomi 14 Pro (Shennong)',
    brand: 'Xiaomi',
    manufacturer: 'Xiaomi Communications',
    serialNumber: '23116PN5BC-ADB',
    connectionType: 'usb',
    status: 'detected',
    batteryLevel: 45,
    androidVersion: '14 (HyperOS)',
    sdkVersion: 34,
    screenResolution: '1440 x 3200',
    portForwardActive: false,
    lastSeen: 'Hace 10 segundos',
    isRealHardware: false
  }
];

export const DEFAULT_AUDIT_CHECKS: AuditCheckItem[] = [
  {
    id: 'check-manifest-file',
    category: 'manifest',
    title: 'Archivo Web App Manifest detectado',
    description: 'Comprueba si la etiqueta <link rel="manifest"> apunta a un manifest.json válido.',
    status: 'pass',
    scoreWeight: 15
  },
  {
    id: 'check-manifest-name',
    category: 'manifest',
    title: 'Propiedades `name` y `short_name`',
    description: 'El manifest debe definir el nombre completo y la versión corta para el launcher de Android.',
    status: 'pass',
    scoreWeight: 10
  },
  {
    id: 'check-manifest-icons',
    category: 'manifest',
    title: 'Iconos adaptativos (192px y 512px + Maskable)',
    description: 'Requiere iconos PNG cuadrados para la pantalla de inicio de Android y soporte maskable icon.',
    status: 'pass',
    scoreWeight: 15
  },
  {
    id: 'check-display-standalone',
    category: 'manifest',
    title: 'Modo de visualización standalone',
    description: 'La PWA debe configurarse con `"display": "standalone"` o `"fullscreen"`.',
    status: 'pass',
    scoreWeight: 10
  },
  {
    id: 'check-sw-registered',
    category: 'serviceworker',
    title: 'Service Worker registrado y activo',
    description: 'Un script Service Worker válido debe estar escuchando eventos y controlando clientes.',
    status: 'pass',
    scoreWeight: 20
  },
  {
    id: 'check-offline-fallback',
    category: 'offline',
    title: 'Capacidad de respuesta en modo Offline',
    description: 'Responde con código HTTP 200 cuando se interrumpe la conexión de red.',
    status: 'pass',
    scoreWeight: 15
  },
  {
    id: 'check-https-sec',
    category: 'security',
    title: 'Conexión segura HTTPS / Localhost',
    description: 'Todas las solicitudes se entregan a través de un canal HTTPS o servidor de desarrollo seguro en localhost.',
    status: 'pass',
    scoreWeight: 10
  }
];

export const NETWORK_PROFILES: NetworkProfile[] = [
  {
    id: 'online',
    name: 'Conexión Directa (Online)',
    downloadKbps: 100000,
    uploadKbps: 50000,
    latencyMs: 5,
    description: 'Sin limitaciones de ancho de banda o latencia.'
  },
  {
    id: 'fast3g',
    name: '3G Rápido / 4G Básico',
    downloadKbps: 1600,
    uploadKbps: 750,
    latencyMs: 150,
    description: 'Simula red móvil estándar en zonas urbanas (1.6 Mbps).'
  },
  {
    id: 'slow3g',
    name: '3G Lento (Móvil Rural)',
    downloadKbps: 400,
    uploadKbps: 150,
    latencyMs: 400,
    description: 'Simula conexiones móviles inestables o de baja cobertura.'
  },
  {
    id: 'offline',
    name: 'Modo Sin Conexión (Offline)',
    downloadKbps: 0,
    uploadKbps: 0,
    latencyMs: 0,
    description: 'Corta completamente el tráfico de red para evaluar la caché del Service Worker.'
  }
];
