import React from 'react';
import type { AuditRecord } from '@/types/evidence';
import QRCodeDataUrl from '@/components/ui/qrcodedataurl';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { ShieldCheck, Calendar, MapPin, Package, Lock, CheckCircle2 } from 'lucide-react';
import { format } from 'date-fns';

interface EvidenceReportCardProps {
  record: AuditRecord;
}

export const EvidenceReportCard: React.FC<EvidenceReportCardProps> = ({ record }) => {
  const shareUrl = typeof window !== 'undefined' 
    ? `${window.location.origin}/records/${record.id}`
    : `https://kisandrishti.app/records/${record.id}`;

  return (
    <Card className="border-2 border-stone-800 bg-[#FAFAF7] text-stone-900 shadow-xl max-w-2xl mx-auto overflow-hidden print:shadow-none print:border-stone-900">
      {/* Top Header Strip */}
      <div className="bg-stone-900 text-white p-4 flex items-center justify-between border-b-2 border-stone-800">
        <div className="space-y-0.5">
          <div className="flex items-center gap-2">
            <span className="font-serif font-bold text-lg tracking-wide text-amber-300">
              KISANDRISHTI
            </span>
            <span className="text-[10px] font-mono px-1.5 py-0.5 bg-stone-800 text-stone-300 rounded uppercase">
              Visual Evidence Protocol
            </span>
          </div>
          <p className="text-[11px] text-stone-300 italic font-serif">
            Evidence Before Valuation • Tamper-Evident Agricultural Audit
          </p>
        </div>

        <div className="text-right font-mono text-[11px] text-emerald-400 flex items-center gap-1.5">
          <ShieldCheck className="w-4 h-4" />
          <span>SHA-256 VERIFIED</span>
        </div>
      </div>

      <CardContent className="p-5 space-y-4 text-xs">
        {/* Core Metadata Bar */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 p-3 bg-stone-100 rounded-lg border border-stone-300 text-[11px] font-mono">
          <div>
            <span className="text-stone-500 block text-[9px]">AUDIT ID:</span>
            <span className="font-bold text-stone-900">{record.id}</span>
          </div>
          <div>
            <span className="text-stone-500 block text-[9px]">CROP & LOT:</span>
            <span className="font-bold text-stone-900">{record.metadata.crop} (Lot {record.metadata.lotId})</span>
          </div>
          <div>
            <span className="text-stone-500 block text-[9px]">LOCATION:</span>
            <span className="font-medium text-stone-800 truncate block">{record.metadata.location}</span>
          </div>
          <div>
            <span className="text-stone-500 block text-[9px]">CAPTURE TIME:</span>
            <span className="font-medium text-stone-800">
              {format(new Date(record.metadata.captureTimestamp), 'dd MMM yyyy, HH:mm')}
            </span>
          </div>
        </div>

        {/* Primary Observable Visual Evidence Summary (NOT grain counts) */}
        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <h4 className="font-bold uppercase tracking-wider text-[11px] text-stone-800 font-mono">
              OBSERVED VISUAL EVIDENCE (10cm × 10cm Standard Grid)
            </h4>
            <Badge variant="outline" className="font-mono text-[10px] border-emerald-700 text-emerald-800">
              Non-Invasive Optical Record
            </Badge>
          </div>

          <div className="grid grid-cols-3 sm:grid-cols-6 gap-2">
            <div className="p-2 bg-white rounded border border-stone-300 text-center">
              <span className="text-[10px] text-stone-500 block">Broken %</span>
              <span className="text-sm font-mono font-bold text-amber-700">{record.stats.brokenPercent}%</span>
            </div>
            <div className="p-2 bg-white rounded border border-stone-300 text-center">
              <span className="text-[10px] text-stone-500 block">Foreign</span>
              <span className="text-sm font-mono font-bold text-red-700">{record.stats.foreignObjectCount} units</span>
            </div>
            <div className="p-2 bg-white rounded border border-stone-300 text-center">
              <span className="text-[10px] text-stone-500 block">Discolor %</span>
              <span className="text-sm font-mono font-bold text-orange-700">{record.stats.discoloredPercent}%</span>
            </div>
            <div className="p-2 bg-white rounded border border-stone-300 text-center">
              <span className="text-[10px] text-stone-500 block">Damage %</span>
              <span className="text-sm font-mono font-bold text-stone-800">{record.stats.visibleDamagePercent}%</span>
            </div>
            <div className="p-2 bg-white rounded border border-stone-300 text-center">
              <span className="text-[10px] text-stone-500 block">Coverage</span>
              <span className="text-sm font-mono font-bold text-emerald-800">{record.stats.sampleCoveragePercent}%</span>
            </div>
            <div className="p-2 bg-white rounded border border-stone-300 text-center">
              <span className="text-[10px] text-stone-500 block">Optical Q</span>
              <span className="text-sm font-mono font-bold text-emerald-800">{record.stats.captureQualityScore}%</span>
            </div>
          </div>
        </div>

        {/* Matrix Snapshot */}
        <div className="space-y-1.5 pt-1">
          <div className="font-mono text-[11px] font-bold text-stone-800">
            EVIDENTIARY CLASSIFICATION BREAKDOWN:
          </div>
          <div className="border border-stone-300 rounded overflow-hidden">
            <div className="grid grid-cols-12 bg-stone-200 text-[10px] font-mono font-semibold text-stone-700 p-1.5">
              <div className="col-span-5">PARAMETER / TEST</div>
              <div className="col-span-3">OBSERVED RESULT</div>
              <div className="col-span-4">VERIFICATION STATUS</div>
            </div>
            {record.matrixRows.slice(0, 6).map((row, i) => (
              <div 
                key={row.id} 
                className={`grid grid-cols-12 text-[11px] p-1.5 border-t border-stone-200 ${
                  i % 2 === 0 ? 'bg-white' : 'bg-stone-50'
                }`}
              >
                <div className="col-span-5 font-medium text-stone-900">{row.parameter}</div>
                <div className="col-span-3 font-mono font-bold text-stone-800">{row.result}</div>
                <div className="col-span-4 font-mono text-[10px]">
                  <span className={`px-1.5 py-0.5 rounded font-semibold ${
                    row.status === 'OBSERVED' ? 'bg-emerald-100 text-emerald-800' :
                    row.status === 'POSSIBLE' ? 'bg-amber-100 text-amber-800' :
                    'bg-stone-200 text-stone-600'
                  }`}>
                    {row.status}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Explicit UNVERIFIED Laboratory Tests Box */}
        <div className="p-2.5 bg-stone-100 rounded border border-stone-300 text-[11px] space-y-1">
          <span className="font-bold font-mono text-[10px] text-stone-700 uppercase block">
            EXPLICITLY UNVERIFIED PARAMETERS (Not Tested Non-Destructively):
          </span>
          <p className="text-stone-600">
            Moisture %, Protein %, Chemical Residue, and Internal Fungal Endophytes are <strong>NOT TESTED</strong>. Non-destructive optical photography does not fabricate laboratory chemistry.
          </p>
        </div>

        {/* QR Code & Cryptographic SHA-256 Footer */}
        <div className="p-3 bg-stone-900 text-white rounded-lg flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="space-y-1.5 flex-1">
            <div className="flex items-center gap-1.5 text-amber-400 font-mono text-[11px] font-semibold">
              <Lock className="w-3.5 h-3.5" />
              <span>SHA-256 Cryptographic Fingerprint:</span>
            </div>
            <div className="font-mono text-[10px] text-stone-300 break-all bg-stone-950 p-1.5 rounded border border-stone-800">
              {record.cryptographicHash}
            </div>
            <p className="text-[10px] text-stone-400 italic">
              "KisanDrishti does not decide what the crop is worth. It creates standardized visual evidence that both sides can inspect."
            </p>
          </div>

          <div className="shrink-0 text-center bg-white p-2 rounded border border-stone-700">
            <QRCodeDataUrl text={shareUrl} width={80} color="#1c1917" backgroundColor="#ffffff" />
            <span className="text-[8px] font-mono text-stone-700 block mt-1">Scan to Verify</span>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};
