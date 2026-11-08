import React, { useState } from 'react';
import {
  Stethoscope,
  CheckCircle2,
  AlertTriangle,
  XCircle,
  RefreshCw,
  Code,
  FileCode,
  Download,
  ShieldCheck,
  Zap,
  Globe,
  Layers,
  Sparkles
} from 'lucide-react';
import { AuditCheckItem, PWAManifest, PWAAuditReport } from '../../types/pwaStudio';

interface PWADiagnosticsSectionProps {
  targetUrl: string;
  auditReport: PWAAuditReport | null;
  onRunAudit: () => void;
}

export const PWADiagnosticsSection: React.FC<PWADiagnosticsSectionProps> = ({
  targetUrl,
  auditReport,
  onRunAudit,
}) => {
  const [activeFilter, setActiveFilter] = useState<'all' | 'manifest' | 'serviceworker' | 'offline' | 'security'>('all');
  const [showManifestJson, setShowManifestJson] = useState<boolean>(false);
  const [isRunning, setIsRunning] = useState<boolean>(false);

  const sampleManifest: PWAManifest = {
    name: 'PWA Studio Test Application',
    short_name: 'PWAStudio',
    description: 'Aplicación PWA auditada profesionalmente desde Visual Studio Code.',
    start_url: '/',
    display: 'standalone',
    background_color: '#1e1e1e',
    theme_color: '#007acc',
    icons: [
      { src: '/icons/icon-192.png', sizes: '192x192', type: 'image/png', purpose: 'any' },
      { src: '/icons/icon-[#89d185]-512.png', sizes: '512x512', type: 'image/png', purpose: 'maskable' }
    ],
    categories: ['developer-tools', 'productivity']
  };

  const checks = auditReport ? auditReport.checks : [];
  const filteredChecks = activeFilter === 'all'
    ? checks
    : checks.filter((c) => c.category === activeFilter);

  const passedCount = checks.filter((c) => c.status === 'pass').length;
  const warnCount = checks.filter((c) => c.status === 'warn').length;
  const failCount = checks.filter((c) => c.status === 'fail').length;

  const handleAuditClick = () => {
    setIsRunning(true);
    setTimeout(() => {
      onRunAudit();
      setIsRunning(false);
    }, 1000);
  };

  return (
    <div className="p-6 space-y-6 overflow-y-auto max-w-7xl mx-auto">
      {/* Top Banner & Score summary */}
      <div className="bg-[#252526] border border-[#3c3c3c] rounded-lg p-5">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <span className="text-xs font-semibold px-2 py-0.5 bg-[#cca700]/20 text-[#cca700] border border-[#cca700]/40 rounded font-mono">
                Audit Engine
              </span>
              <span className="text-xs text-[#858585]">
                PWA Compliance Inspector
              </span>
            </div>
            <h1 className="text-xl font-bold text-white tracking-tight flex items-center gap-2">
              <Stethoscope className="w-5 h-5 text-[#cca700]" />
              <span>Panel de Diagnóstico PWA (Lighthouse & Standards)</span>
            </h1>
            <p className="text-xs text-[#cccccc] mt-1 max-w-2xl leading-relaxed">
              Analiza el manifest.json, registro del Service Worker, HTTPS, iconos maskable y compatibilidad con el diálogo de instalación de Android.
            </p>
          </div>

          <div className="flex items-center gap-3 shrink-0">
            {/* Score Pill */}
            <div className="bg-[#1e1e1e] border border-[#3c3c3c] rounded-lg px-4 py-2 text-center">
              <div className="text-[10px] text-[#858585] uppercase font-mono">PWA Score</div>
              <div className="text-2xl font-bold text-[#89d185]">
                {auditReport ? `${auditReport.overallScore}/100` : '100/100'}
              </div>
            </div>

            <button
              onClick={handleAuditClick}
              disabled={isRunning}
              className="flex items-center gap-2 bg-[#007acc] hover:bg-[#1177bb] text-white px-4 py-2.5 rounded text-xs font-medium transition-colors shadow-md"
            >
              <RefreshCw className={`w-4 h-4 ${isRunning ? 'animate-spin' : ''}`} />
              <span>{isRunning ? 'Auditando...' : 'Ejecutar Diagnóstico Completo'}</span>
            </button>
          </div>
        </div>

        {/* Audit Stats Breakdown */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mt-4 pt-4 border-t border-[#3c3c3c] text-xs">
          <div className="bg-[#1e1e1e] p-2.5 rounded border border-[#333333] flex items-center justify-between">
            <span className="text-[#858585]">Pruebas Superadas:</span>
            <span className="font-bold font-mono text-[#89d185] flex items-center gap-1">
              <CheckCircle2 className="w-3.5 h-3.5" />
              {passedCount}
            </span>
          </div>

          <div className="bg-[#1e1e1e] p-2.5 rounded border border-[#333333] flex items-center justify-between">
            <span className="text-[#858585]">Advertencias:</span>
            <span className="font-bold font-mono text-[#cca700] flex items-center gap-1">
              <AlertTriangle className="w-3.5 h-3.5" />
              {warnCount}
            </span>
          </div>

          <div className="bg-[#1e1e1e] p-2.5 rounded border border-[#333333] flex items-center justify-between">
            <span className="text-[#858585]">Fallos:</span>
            <span className="font-bold font-mono text-[#f14c4c] flex items-center gap-1">
              <XCircle className="w-3.5 h-3.5" />
              {failCount}
            </span>
          </div>

          <div className="bg-[#1e1e1e] p-2.5 rounded border border-[#333333] flex items-center justify-between">
            <span className="text-[#858585]">Manifest Inspector:</span>
            <button
              onClick={() => setShowManifestJson(!showManifestJson)}
              className="text-[#3794ff] hover:underline font-mono text-[11px]"
            >
              {showManifestJson ? 'Ocultar JSON' : 'Ver Manifest'}
            </button>
          </div>
        </div>
      </div>

      {/* Manifest JSON Inspector (Expandable) */}
      {showManifestJson && (
        <div className="bg-[#1e1e1e] border border-[#007acc]/50 rounded-lg p-4 space-y-2 font-mono text-xs text-[#cccccc]">
          <div className="flex items-center justify-between text-[#3794ff] border-b border-[#3c3c3c] pb-2 font-sans text-xs">
            <div className="flex items-center gap-2 font-semibold">
              <FileCode className="w-4 h-4" />
              <span>Vista previa de manifest.json parsed</span>
            </div>
            <button onClick={() => setShowManifestJson(false)} className="text-[#858585] hover:text-white">
              Cerrar
            </button>
          </div>
          <pre className="overflow-x-auto text-[11px] text-[#9cdcfe] p-2 bg-[#141414] rounded border border-[#2a2a2a]">
            {JSON.stringify(sampleManifest, null, 2)}
          </pre>
        </div>
      )}

      {/* Category Filter Tabs */}
      <div className="flex items-center gap-2 border-b border-[#3c3c3c] pb-2">
        {[
          { id: 'all', label: 'Todas las Comprobaciones' },
          { id: 'manifest', label: 'Web Manifest' },
          { id: 'serviceworker', label: 'Service Worker' },
          { id: 'offline', label: 'Capacidad Offline' },
          { id: 'security', label: 'Seguridad HTTPS' }
        ].map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveFilter(tab.id as any)}
            className={`px-3 py-1.5 rounded text-xs font-medium transition-colors ${
              activeFilter === tab.id
                ? 'bg-[#007acc] text-white'
                : 'text-[#858585] hover:text-[#cccccc] bg-[#252526]'
            }`}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* Audit Checklist Items */}
      <div className="space-y-3">
        {filteredChecks.map((check) => (
          <div
            key={check.id}
            className="bg-[#252526] border border-[#3c3c3c] rounded-lg p-4 flex items-start gap-4 hover:border-[#454545] transition-colors"
          >
            <div className="mt-0.5 shrink-0">
              {check.status === 'pass' && <CheckCircle2 className="w-5 h-5 text-[#89d185]" />}
              {check.status === 'warn' && <AlertTriangle className="w-5 h-5 text-[#cca700]" />}
              {check.status === 'fail' && <XCircle className="w-5 h-5 text-[#f14c4c]" />}
            </div>

            <div className="flex-1 space-y-1">
              <div className="flex items-center justify-between">
                <h3 className="text-xs font-bold text-white">{check.title}</h3>
                <span className="text-[10px] uppercase font-mono text-[#858585] bg-[#1e1e1e] px-2 py-0.5 rounded border border-[#333333]">
                  {check.category}
                </span>
              </div>

              <p className="text-xs text-[#aaaaaa] leading-relaxed">
                {check.description}
              </p>

              {check.remediation && (
                <div className="mt-2 p-2 bg-[#1e1e1e] border border-[#333333] rounded text-[11px] text-[#9cdcfe] font-mono">
                  💡 Solución sugerida: {check.remediation}
                </div>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
