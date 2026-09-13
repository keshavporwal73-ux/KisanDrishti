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
          <span>SHA-256 SEALED</span>
        </div>
      </div>

      <CardContent className="p-5 space-y-4 text-xs">
        {/* Core Metadata Bar */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 p-3 bg-stone-100 rounded-lg border border-stone-300 text-[11px] font-mono">
          <div>
            <span className="text-stone-500 block text-[9px]">EVIDENCE ID:</span>
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

        {/* Observable Visual Metrics Grid */}
        <div className="space-y-1.5">
          <span className="font-bold uppercase tracking-wider text-[10px] text-stone-600 block">
            Observable Visual Evidence Findings:
          </span>
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-2 text-center font-mono">
            <div className="p-2.5 bg-white border border-stone-300 rounded-md">
              <span className="text-[10px] text-stone-500 block">BROKEN / DAMAGED</span>
              <span className="text-base font-bold text-amber-700">{record.stats.brokenPercent}%</span>
              <span className="text-[9px] text-stone-400 block">({record.stats.brokenCount} obs)</span>
            </div>
            <div className="p-2.5 bg-white border border-stone-300 rounded-md">
              <span className="text-[10px] text-stone-500 block">VISIBLE DISCOLORATION</span>
              <span className="text-base font-bold text-orange-700">{record.stats.discoloredPercent}%</span>
              <span className="text-[9px] text-stone-400 block">({record.stats.discoloredCount} obs)</span>
            </div>
            <div className="p-2.5 bg-white border border-stone-300 rounded-md">
              <span className="text-[10px] text-stone-500 block">FOREIGN MATERIAL</span>
              <span className="text-base font-bold text-red-700">{record.stats.foreignObjectCount}</span>
              <span className="text-[9px] text-stone-400 block">items detected</span>
            </div>
            <div className="p-2.5 bg-white border border-stone-300 rounded-md">
              <span className="text-[10px] text-stone-500 block">SURFACE DAMAGE</span>
              <span className="text-base font-bold text-stone-800">{record.stats.visibleDamagePercent}%</span>
              <span className="text-[9px] text-stone-400 block">({record.stats.visibleDamageCount} obs)</span>
            </div>
            <div className="p-2.5 bg-white border border-stone-300 rounded-md">
              <span className="text-[10px] text-stone-500 block">SAMPLE DISPERSION</span>
              <span className="text-base font-bold text-emerald-700">{record.stats.sampleCoveragePercent}%</span>
              <span className="text-[9px] text-stone-400 block">Even distribution</span>
            </div>
            <div className="p-2.5 bg-white border border-stone-300 rounded-md">
              <span className="text-[10px] text-stone-500 block">CAPTURE QUALITY</span>
              <span className="text-base font-bold text-emerald-700">{record.stats.captureQualityScore}%</span>
              <span className="text-[9px] text-emerald-700 font-bold block">GATE PASSED</span>
            </div>
          </div>
        </div>

        {/* Visual Thumbnail & QR Code Strip */}
        <div className="grid grid-cols-1 sm:grid-cols-12 gap-3 p-3 bg-stone-100 rounded-lg border border-stone-300 items-center">
          <div className="sm:col-span-8 flex items-center gap-3">
            <img
              src={record.imageUrl}
              alt="Audited Crop Sample"
              className="w-20 h-20 rounded object-cover border border-stone-300 shrink-0"
            />
            <div className="space-y-1 text-[11px]">
              <span className="font-bold text-stone-900 block font-serif">
                {record.metadata.crop} — {record.metadata.variety || 'Standard Lot'}
              </span>
              <p className="text-stone-600 line-clamp-2">
                Standardized smartphone capture. {record.detections.length} candidate visual observations localized on optical grid.
              </p>
            </div>
          </div>

          <div className="sm:col-span-4 flex flex-col items-center justify-center text-center border-t sm:border-t-0 sm:border-l border-stone-300 pt-2 sm:pt-0 sm:pl-3">
            <div className="p-1 bg-white rounded border border-stone-300 mb-1">
              <QRCodeDataUrl text={shareUrl} width={58} />
            </div>
            <span className="text-[9px] font-mono text-stone-500">SCAN TO VERIFY</span>
          </div>
        </div>

        {/* Cryptographic Tamper-Evident Hash */}
        <div className="p-3 bg-stone-900 text-stone-200 rounded-lg space-y-1 font-mono text-[10px]">
          <div className="flex items-center justify-between text-emerald-400">
            <span className="flex items-center gap-1 font-bold">
              <Lock className="w-3 h-3" />
              TAMPER-EVIDENT SHA-256 HASH:
            </span>
            <span>Canonical JSON Hash</span>
          </div>
          <div className="break-all font-mono text-stone-300 bg-stone-950 p-1.5 rounded border border-stone-800">
            {record.cryptographicHash}
          </div>
        </div>

        {/* Mandatory Representativeness Disclaimer */}
        <div className="p-2.5 bg-amber-500/10 border border-amber-500/20 rounded text-[10px] text-amber-900 space-y-0.5">
          <span className="font-bold block">Mandatory Protocol Disclaimers:</span>
          <p>
            1. "This record describes visual observations from the captured sample. It does not prove that the captured sample represents the entire lot."
          </p>
          <p>
            2. "KisanDrishti does not decide what the crop is worth. It creates standardized visual evidence that both sides can inspect."
          </p>
        </div>
      </CardContent>
    </Card>
  );
};
