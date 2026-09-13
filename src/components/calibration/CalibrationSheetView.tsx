import React, { useRef } from 'react';
import { Download, Printer, Shield, Info, Check, QrCode } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import QRCodeDataUrl from '@/components/ui/qrcodedataurl';

interface CalibrationSheetViewProps {
  sessionId?: string;
  auditId?: string;
  lotId?: string;
  crop?: string;
  onProceedToCapture?: () => void;
  isStandalone?: boolean;
}

export const CalibrationSheetView: React.FC<CalibrationSheetViewProps> = ({
  sessionId = 'KD-SESS-STD-2026',
  auditId = 'KD-STD-CAL-01',
  lotId = 'LOT-SAMPLE-01',
  crop = 'Agricultural Grain / Seed',
  onProceedToCapture,
  isStandalone = false,
}) => {
  const printRef = useRef<HTMLDivElement>(null);

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="w-full space-y-6">
      {/* Header Info */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <h2 className="text-xl font-bold font-serif text-foreground">
              A4 Physical Calibration Sheet (10cm × 10cm)
            </h2>
            <span className="text-xs px-2 py-0.5 bg-primary/10 text-primary font-mono rounded">
              Standard v2.4
            </span>
          </div>
          <p className="text-xs sm:text-sm text-muted-foreground mt-1">
            Standardized optical background with 1mm grid ticks, RGB/CMYK spectral patches, and corner fiducial alignment targets.
          </p>
        </div>

        <div className="flex items-center gap-2 shrink-0">
          <Button variant="outline" size="sm" onClick={handlePrint} className="text-xs">
            <Printer className="w-3.5 h-3.5 mr-1.5" />
            Print A4 Sheet
          </Button>
          {onProceedToCapture && (
            <Button size="sm" onClick={onProceedToCapture} className="bg-primary text-primary-foreground text-xs">
              Proceed to Capture
            </Button>
          )}
        </div>
      </div>

      {/* Protocol Guidance Banner */}
      <div className="bg-emerald-500/10 border border-emerald-600/20 rounded-lg p-3 text-xs sm:text-sm text-emerald-950 dark:text-emerald-200 flex items-start gap-2.5">
        <Info className="w-4 h-4 text-emerald-700 dark:text-emerald-400 shrink-0 mt-0.5" />
        <div className="space-y-1">
          <p className="font-semibold text-emerald-900 dark:text-emerald-300">
            Sampling Standard Operating Procedure:
          </p>
          <p>
            &ldquo;Place a representative sample inside the marked 10 cm × 10 cm area. Capture the entire sample without intentionally selecting only visually favorable grains.&rdquo;
          </p>
          <p className="text-[11px] text-muted-foreground italic">
            * Note: The calibration sheet guarantees dimensional and optical standardization for the captured photograph. It does NOT guarantee that the farmer or trader took a representative physical sample of the entire lot.
          </p>
        </div>
      </div>

      {/* Printable Calibration Sheet Canvas Area */}
      <Card className="border-2 border-stone-300 dark:border-stone-700 bg-white dark:bg-stone-950 text-stone-900 dark:text-stone-100 shadow-md overflow-hidden">
        <div 
          ref={printRef}
          className="p-6 sm:p-10 max-w-2xl mx-auto flex flex-col items-center justify-between min-h-[640px] relative select-none font-sans"
        >
          {/* Top Bar on A4 Sheet */}
          <div className="w-full flex items-center justify-between border-b-2 border-stone-900 dark:border-stone-100 pb-3">
            <div>
              <div className="flex items-center gap-1.5">
                <span className="font-serif font-black text-lg tracking-tight text-emerald-950 dark:text-emerald-400">
                  KISANDRISHTI
                </span>
                <span className="text-[10px] font-mono uppercase bg-stone-900 text-white dark:bg-stone-100 dark:text-stone-900 px-1.5 py-0.5 font-bold">
                  CALIBRATION STANDARD
                </span>
              </div>
              <p className="text-[10px] text-stone-600 dark:text-stone-400 font-mono tracking-wider">
                EVIDENCE BEFORE VALUATION • OPTICAL TARGET
              </p>
            </div>

            <div className="text-right text-[10px] font-mono text-stone-700 dark:text-stone-300">
              <p className="font-bold">SESSION: {sessionId}</p>
              <p className="text-stone-500">CROP: {crop}</p>
            </div>
          </div>

          {/* Color Reference Calibration Bars */}
          <div className="w-full py-3 flex items-center justify-between gap-2 border-b border-stone-200 dark:border-stone-800 text-[9px] font-mono">
            <span className="text-stone-500 uppercase font-semibold">Optical Color Reference:</span>
            <div className="flex items-center gap-1">
              <div className="w-5 h-4 bg-[#FFFFFF] border border-stone-400" title="99% White Reflectance" />
              <div className="w-5 h-4 bg-[#D1D5DB] border border-stone-400" title="18% Neutral Gray" />
              <div className="w-5 h-4 bg-[#4B5563]" title="Dark Gray" />
              <div className="w-5 h-4 bg-[#111827]" title="Deep Black" />
              <div className="w-5 h-4 bg-[#DC2626]" title="Primary Red" />
              <div className="w-5 h-4 bg-[#16A34A]" title="Primary Green" />
              <div className="w-5 h-4 bg-[#2563EB]" title="Primary Blue" />
              <div className="w-5 h-4 bg-[#D97706]" title="Wheat Amber (580nm)" />
            </div>
          </div>

          {/* Main 10cm x 10cm Calibration Boundary with Corner Fiducials */}
          <div className="my-6 relative w-72 h-72 sm:w-80 sm:h-80 border-2 border-stone-900 dark:border-stone-100 bg-stone-50/70 dark:bg-stone-900/50 flex flex-col items-center justify-center">
            
            {/* 4 Corner Fiducial Markers (ArUco / Optical Alignment Targets) */}
            <div className="absolute -top-3.5 -left-3.5 w-7 h-7 bg-stone-950 text-white flex items-center justify-center border-2 border-white dark:border-stone-900 shadow-sm">
              <div className="w-3 h-3 bg-white" />
            </div>
            <div className="absolute -top-3.5 -right-3.5 w-7 h-7 bg-stone-950 text-white flex items-center justify-center border-2 border-white dark:border-stone-900 shadow-sm">
              <div className="w-3 h-3 bg-white" />
            </div>
            <div className="absolute -bottom-3.5 -left-3.5 w-7 h-7 bg-stone-950 text-white flex items-center justify-center border-2 border-white dark:border-stone-900 shadow-sm">
              <div className="w-3 h-3 bg-white" />
            </div>
            <div className="absolute -bottom-3.5 -right-3.5 w-7 h-7 bg-stone-950 text-white flex items-center justify-center border-2 border-white dark:border-stone-900 shadow-sm">
              <div className="w-3 h-3 bg-white" />
            </div>

            {/* Grid Ticks & Metric Rulers */}
            <div className="absolute inset-0 calibration-grid opacity-60 pointer-events-none" />

            {/* Dimensional Callouts */}
            <div className="absolute top-2 left-2 text-[10px] font-mono font-bold text-stone-500">
              0,0 cm
            </div>
            <div className="absolute top-2 right-2 text-[10px] font-mono font-bold text-stone-500">
              10,0 cm
            </div>
            <div className="absolute bottom-2 left-2 text-[10px] font-mono font-bold text-stone-500">
              0,10 cm
            </div>
            <div className="absolute bottom-2 right-2 text-[10px] font-mono font-bold text-stone-500">
              10,10 cm
            </div>

            {/* Center Reticle */}
            <div className="w-12 h-12 border border-dashed border-stone-400/80 rounded-full flex items-center justify-center pointer-events-none">
              <div className="w-1 h-1 bg-stone-900 dark:bg-stone-100 rounded-full" />
            </div>

            {/* Placement Text */}
            <div className="text-center p-4 max-w-[200px] pointer-events-none z-10">
              <span className="text-[11px] font-bold uppercase tracking-wider text-stone-800 dark:text-stone-200 block mb-1">
                SAMPLE PLACEMENT AREA
              </span>
              <span className="text-[10px] font-mono text-stone-500 block">
                100 cm² (10 cm × 10 cm)
              </span>
              <span className="text-[9px] text-stone-400 block mt-1">
                Spread physical seeds evenly across this boundary
              </span>
            </div>
          </div>

          {/* Bottom Bar: QR Session Token, Metric Ruler, and Warning */}
          <div className="w-full pt-3 border-t-2 border-stone-900 dark:border-stone-100 flex items-center justify-between text-[10px] font-mono">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 bg-white p-1 border border-stone-300 shrink-0">
                <QRCodeDataUrl text={`https://kisandrishti.in/verify?session=${sessionId}`} className="w-full h-full" />
              </div>
              <div className="space-y-0.5">
                <p className="font-bold text-stone-900 dark:text-stone-100">AUDIT ID: {auditId}</p>
                <p className="text-stone-500">LOT: {lotId}</p>
                <p className="text-[9px] text-stone-400">Scale: 1:1 Metric Standard A4</p>
              </div>
            </div>

            <div className="text-right max-w-xs space-y-1">
              <p className="text-[9px] text-stone-600 dark:text-stone-400 leading-tight">
                Align smartphone camera perpendicular to calibration sheet until all 4 corner fiducials illuminate green.
              </p>
              <p className="text-[8px] text-stone-400">
                Security Hash Token: {sessionId.slice(0, 16)}...
              </p>
            </div>
          </div>
        </div>
      </Card>
    </div>
  );
};
