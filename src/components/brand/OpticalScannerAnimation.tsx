import React, { useState, useEffect } from 'react';
import { Crosshair, ShieldCheck, Sparkles, Scan, Lock } from 'lucide-react';
import { Badge } from '@/components/ui/badge';

interface OpticalScannerAnimationProps {
  cropName?: string;
  isScanning?: boolean;
  score?: number;
  className?: string;
}

export const OpticalScannerAnimation: React.FC<OpticalScannerAnimationProps> = ({
  cropName = 'Wheat Sample',
  isScanning = true,
  score = 96,
  className = '',
}) => {
  const [scanPos, setScanPos] = useState(15);
  const [activeAnomaly, setActiveAnomaly] = useState(0);

  const mockAnomalies = [
    { label: 'Broken Grain (6.4%)', coords: 'x: 142mm, y: 88mm', type: 'defect' },
    { label: 'Sound Kernels (91.8%)', coords: 'x: 210mm, y: 130mm', type: 'sound' },
    { label: 'Discoloration (1.8%)', coords: 'x: 94mm, y: 175mm', type: 'defect' },
    { label: 'Foreign Particle (0.5%)', coords: 'x: 180mm, y: 60mm', type: 'foreign' },
  ];

  useEffect(() => {
    if (!isScanning) return;
    const interval = setInterval(() => {
      setScanPos((prev) => (prev >= 85 ? 15 : prev + 2));
    }, 50);

    const anomalyTimer = setInterval(() => {
      setActiveAnomaly((prev) => (prev + 1) % mockAnomalies.length);
    }, 2000);

    return () => {
      clearInterval(interval);
      clearInterval(anomalyTimer);
    };
  }, [isScanning]);

  return (
    <div className={`relative w-full aspect-[16/9] max-h-[360px] rounded-2xl overflow-hidden border border-emerald-800/60 bg-stone-950 shadow-2xl ${className}`}>
      {/* Background Grid Pattern */}
      <div className="absolute inset-0 bg-[linear-gradient(to_right,#064e3b15_1px,transparent_1px),linear-gradient(to_bottom,#064e3b15_1px,transparent_1px)] bg-[size:24px_24px]" />

      {/* Target Sample Silhouette / Image */}
      <div className="absolute inset-4 rounded-xl overflow-hidden opacity-60">
        <img
          src="https://images.unsplash.com/photo-1574323347407-f5e1ad6d020b?auto=format&fit=crop&w=1200&q=80"
          alt="Optical Scanning Target"
          className="w-full h-full object-cover filter contrast-125"
        />
      </div>

      {/* Dynamic Laser Scanning Line */}
      <div
        className="absolute left-0 right-0 h-1 bg-gradient-to-r from-transparent via-emerald-400 to-transparent shadow-[0_0_15px_#10b981] z-20 transition-all duration-75"
        style={{ top: `${scanPos}%` }}
      >
        <div className="absolute left-1/2 -translate-x-1/2 -top-2 px-2 py-0.5 rounded bg-emerald-500 text-stone-950 font-mono text-[9px] font-bold shadow-md">
          OPTICAL RADAR SCANNING
        </div>
      </div>

      {/* Radar Gradient Area behind scan line */}
      <div
        className="absolute left-0 right-0 h-24 bg-gradient-to-b from-emerald-500/10 to-transparent pointer-events-none z-10"
        style={{ top: `${Math.max(0, scanPos - 15)}%` }}
      />

      {/* Top HUD Status Bar */}
      <div className="absolute top-3 left-3 right-3 flex items-center justify-between z-30 pointer-events-none">
        <div className="flex items-center gap-2">
          <Badge className="bg-emerald-950/80 border border-emerald-500/40 text-emerald-300 font-mono text-[10px] gap-1">
            <Scan className="w-3 h-3 animate-spin" />
            <span>CV SENSOR ACTIVE</span>
          </Badge>
          <span className="text-[10px] text-stone-300 font-mono hidden sm:inline">
            Target: {cropName}
          </span>
        </div>

        <div className="flex items-center gap-2">
          <Badge className="bg-amber-950/80 border border-amber-500/40 text-amber-300 font-mono text-[10px] gap-1">
            <Lock className="w-3 h-3" />
            <span>SHA-256 SEALED</span>
          </Badge>
          <div className="px-2 py-0.5 rounded bg-black/80 border border-emerald-500/30 text-emerald-400 font-mono text-[10px] font-bold">
            GATE: {score}% PASS
          </div>
        </div>
      </div>

      {/* Simulated Live Detection Bounding Boxes */}
      <div className="absolute top-1/4 left-1/4 w-28 h-20 border-2 border-dashed border-amber-400/80 rounded bg-amber-500/10 z-20 animate-pulse flex flex-col justify-between p-1">
        <div className="flex items-center justify-between">
          <span className="text-[8px] font-mono text-amber-300 bg-black/80 px-1 rounded">BOX-01: BROKEN</span>
          <span className="text-[8px] font-mono text-amber-300">6.4%</span>
        </div>
        <div className="text-[7px] font-mono text-amber-200 text-right">L: 6.2mm</div>
      </div>

      <div className="absolute bottom-1/3 right-1/4 w-32 h-24 border-2 border-emerald-400/80 rounded bg-emerald-500/10 z-20 flex flex-col justify-between p-1">
        <div className="flex items-center justify-between">
          <span className="text-[8px] font-mono text-emerald-300 bg-black/80 px-1 rounded">BOX-02: SOUND</span>
          <span className="text-[8px] font-mono text-emerald-300">91.8%</span>
        </div>
        <div className="text-[7px] font-mono text-emerald-200 text-right">L: 7.1mm</div>
      </div>

      <div className="absolute bottom-1/4 left-1/3 w-20 h-16 border-2 border-red-500/80 rounded bg-red-500/10 z-20 flex flex-col justify-between p-1">
        <div className="flex items-center justify-between">
          <span className="text-[8px] font-mono text-red-300 bg-black/80 px-1 rounded">BOX-03: FOREIGN</span>
        </div>
        <div className="text-[7px] font-mono text-red-200 text-right">Count: 1</div>
      </div>

      {/* Bottom HUD Information Strip */}
      <div className="absolute bottom-3 left-3 right-3 flex items-center justify-between p-2 rounded-xl bg-black/80 backdrop-blur-md border border-emerald-900/80 z-30 text-xs font-mono">
        <div className="flex items-center gap-2">
          <div className="w-2 h-2 rounded-full bg-emerald-400 animate-ping" />
          <span className="text-stone-300 text-[11px]">
            Active Detection: <strong className="text-amber-300">{mockAnomalies[activeAnomaly].label}</strong>
          </span>
        </div>
        <span className="text-[10px] text-stone-400 hidden sm:inline">
          Spatial: {mockAnomalies[activeAnomaly].coords}
        </span>
      </div>

      {/* Four Corner Viewfinder Brackets */}
      <div className="absolute top-3 left-3 w-4 h-4 border-t-2 border-l-2 border-emerald-400 z-30" />
      <div className="absolute top-3 right-3 w-4 h-4 border-t-2 border-r-2 border-emerald-400 z-30" />
      <div className="absolute bottom-3 left-3 w-4 h-4 border-b-2 border-l-2 border-emerald-400 z-30" />
      <div className="absolute bottom-3 right-3 w-4 h-4 border-b-2 border-r-2 border-emerald-400 z-30" />
    </div>
  );
};
