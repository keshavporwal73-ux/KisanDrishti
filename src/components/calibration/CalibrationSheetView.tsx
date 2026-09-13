import React, { useRef } from 'react';
import { Download, Printer, Shield, Info, Check, QrCode, Smartphone, Sparkles } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
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
              Optional Printed Alignment Sheet
            </h2>
            <Badge variant="outline" className="text-xs border-emerald-600 text-emerald-700 dark:text-emerald-400 font-mono">
              Strictly Optional
            </Badge>
          </div>
          <p className="text-xs sm:text-sm text-muted-foreground mt-1">
            An inexpensive A4 printed paper sheet to assist camera framing, scale reference, and color calibration.
          </p>
        </div>

        <div className="flex items-center gap-2 shrink-0">
          <Button variant="outline" size="sm" onClick={handlePrint} className="text-xs border-stone-300">
            <Printer className="w-3.5 h-3.5 mr-1.5" />
            Print A4 Sheet
          </Button>
          {onProceedToCapture && (
            <Button size="sm" onClick={onProceedToCapture} className="bg-emerald-700 hover:bg-emerald-800 text-white text-xs">
              Proceed to Capture
            </Button>
          )}
        </div>
      </div>

      {/* Protocol Guidance Banner */}
      <div className="bg-emerald-500/10 border border-emerald-600/20 rounded-xl p-4 text-xs sm:text-sm text-emerald-950 dark:text-emerald-200 flex items-start gap-3">
        <Info className="w-5 h-5 text-emerald-700 dark:text-emerald-400 shrink-0 mt-0.5" />
        <div className="space-y-1.5">
          <p className="font-semibold text-emerald-900 dark:text-emerald-300">
            No Specialized Hardware Required:
          </p>
          <p className="text-xs text-stone-700 dark:text-stone-300 leading-relaxed">
            This sheet is <strong>strictly optional</strong>. You do NOT need special hardware or paid kits. If used, simply spread a natural portion of crop onto the surface. <strong>Do NOT arrange or individually count grains.</strong>
          </p>
          <p className="text-[11px] text-muted-foreground italic">
            * Note: The alignment sheet assists optical scale and color balance only. It does not prove that the captured sample represents the entire lot.
          </p>
        </div>
      </div>

      {/* Printable Sheet Canvas Area */}
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
                  ALIGNMENT SHEET
                </span>
              </div>
              <p className="text-[10px] text-stone-600 dark:text-stone-400 font-mono tracking-wider">
                EVIDENCE BEFORE VALUATION • OPTICAL REFERENCE
              </p>
            </div>

            <div className="text-right text-[10px] font-mono text-stone-700 dark:text-stone-300">
              <p className="font-bold">SESSION: {sessionId}</p>
              <p className="text-stone-500">CROP: {crop}</p>
            </div>
          </div>

          {/* Color Reference Calibration Bars */}
          <div className="w-full py-3 flex items-center justify-between gap-2 border-b border-stone-200 dark:border-stone-800 text-[9px] font-mono">
            <span className="text-stone-500 uppercase font-semibold">Optical Color Balance:</span>
            <div className="flex items-center gap-1">
              <div className="w-5 h-4 bg-[#FFFFFF] border border-stone-400" title="White 99%" />
              <div className="w-5 h-4 bg-[#D1D5DB] border border-stone-400" title="Neutral Gray" />
              <div className="w-5 h-4 bg-[#4B5563]" title="Dark Gray" />
              <div className="w-5 h-4 bg-[#111827]" title="Deep Black" />
              <div className="w-5 h-4 bg-[#DC2626]" title="Red" />
              <div className="w-5 h-4 bg-[#16A34A]" title="Green" />
              <div className="w-5 h-4 bg-[#2563EB]" title="Blue" />
              <div className="w-5 h-4 bg-[#D97706]" title="Amber (580nm)" />
            </div>
          </div>

          {/* Framing Target Area */}
          <div className="my-8 relative w-72 sm:w-80 h-72 sm:h-80 border-2 border-stone-400 dark:border-stone-600 rounded-xl bg-stone-50/50 dark:bg-stone-900/30 flex flex-col items-center justify-center p-6 text-center space-y-3">
            {/* Corner Alignment Crosshairs */}
            <div className="absolute top-2 left-2 w-4 h-4 border-t-2 border-l-2 border-stone-800 dark:border-stone-200" />
            <div className="absolute top-2 right-2 w-4 h-4 border-t-2 border-r-2 border-stone-800 dark:border-stone-200" />
            <div className="absolute bottom-2 left-2 w-4 h-4 border-b-2 border-l-2 border-stone-800 dark:border-stone-200" />
            <div className="absolute bottom-2 right-2 w-4 h-4 border-b-2 border-r-2 border-stone-800 dark:border-stone-200" />

            <Smartphone className="w-8 h-8 text-stone-400" />
            <span className="font-bold text-xs text-stone-800 dark:text-stone-200">
              Sample Placement Area
            </span>
            <p className="text-[10px] text-stone-500 max-w-[200px]">
              Spread sample naturally across this zone. Ordinary phone camera, no arranging required.
            </p>
          </div>

          {/* Bottom Bar on A4 Sheet */}
          <div className="w-full flex items-center justify-between border-t border-stone-200 dark:border-stone-800 pt-3 text-[9px] font-mono text-stone-500">
            <span>Standard Smartphone Visual Evidence Protocol</span>
            <span>www.kisandrishti.app</span>
          </div>
        </div>
      </Card>
    </div>
  );
};
