/**
 * VS Code Webview Communication Bridge
 * Handles acquireVsCodeApi() safely in production VS Code extensions
 * and provides a fallback / mock event emitter for local dev preview.
 */

import { VSCodeIncomingMessage } from '../types/pwaStudio';

// Declare VS Code API acquisition
declare function acquireVsCodeApi(): {
  postMessage(message: any): void;
  getState(): any;
  setState(state: any): void;
};

interface VSCodeAPI {
  postMessage(message: any): void;
  getState(): any;
  setState(state: any): void;
}

class VSCodeBridgeService {
  private vsCodeApi: VSCodeAPI | null = null;
  private listeners: Array<(msg: VSCodeIncomingMessage) => void> = [];
  private isVSCodeHost: boolean = false;

  constructor() {
    this.init();
  }

  private init() {
    if (typeof acquireVsCodeApi === 'function') {
      try {
        this.vsCodeApi = acquireVsCodeApi();
        this.isVSCodeHost = true;
        console.log('[PWA Studio] Running inside VS Code Webview Host.');
      } catch (err) {
        console.warn('[PWA Studio] acquireVsCodeApi failed or already acquired:', err);
      }
    } else {
      console.log('[PWA Studio] Running in standalone web mode. Using Extension Bridge Mock.');
    }

    // Listen to window postMessages (from VS Code Extension host)
    window.addEventListener('message', (event) => {
      const message = event.data;
      if (message && message.type && message.type.startsWith('pwaStudio/')) {
        this.notifyListeners(message as VSCodeIncomingMessage);
      }
    });
  }

  public isNativeVSCode(): boolean {
    return this.isVSCodeHost;
  }

  /**
   * Send command to native VS Code extension backend (Node.js process)
   */
  public postMessage(command: string, data: any = {}) {
    const payload = { command, ...data, timestamp: new Date().toISOString() };
    if (this.vsCodeApi) {
      this.vsCodeApi.postMessage(payload);
    } else {
      console.log(`[VS Code Bridge Mock Outbound] Command: "${command}"`, payload);
    }
  }

  /**
   * Subscribe to incoming events from VS Code extension backend
   */
  public subscribe(callback: (msg: VSCodeIncomingMessage) => void) {
    this.listeners.push(callback);
    return () => {
      this.listeners = this.listeners.filter((l) => l !== callback);
    };
  }

  private notifyListeners(msg: VSCodeIncomingMessage) {
    this.listeners.forEach((listener) => listener(msg));
  }

  /**
   * Helper for testing/simulating incoming VS Code extension messages in standalone preview
   */
  public simulateIncomingMessage(type: string, payload: any) {
    const msg: VSCodeIncomingMessage = { type: type as any, payload };
    console.log(`[VS Code Bridge Mock Inbound] ${type}`, payload);
    this.notifyListeners(msg);
  }
}

export const vscodeBridge = new VSCodeBridgeService();
