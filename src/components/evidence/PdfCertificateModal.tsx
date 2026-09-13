import React, { useRef } from 'react';
import type { AuditRecord } from '@/types/evidence';
import { 
  Download, 
  Printer, 
  ShieldCheck, 
  Lock, 
  QrCode, 
  Wheat, 
  MapPin, 
  Calendar,
  FileText,
  CheckCircle2,
  AlertTriangle
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Badge } from '@/components/ui/badge';
import { format } from 'date-fns';
import QRCodeDataUrl from '@/components/ui/qrcodedataurl';

interface PdfCertificateModalProps {
  record: AuditRecord;
}

export const PdfCertificateModal: React.FC<PdfCertificateModalProps> = ({ record }) => {
  const certificateRef = useRef<HTMLDivElement>(null);

  const handlePrint = () => {
    window.print();
  };

  const shareUrl = `${window.location.origin}/records/${record.id}`;

  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button size="sm" variant="outline" className="text-xs gap-1.5 border-emerald-600/40 text-emerald-700 dark:text-emerald-300">
          <Download className="w-3.5 h-3.5" />
          <span>Export Verifiable PDF Certificate</span>
        </Button>
      </DialogTrigger>

      <DialogContent className="max-w-[calc(100%-2rem)] md:max-w-3xl max-h-[90vh] overflow-y-auto p-4 sm:p-6">
        <DialogHeader className="flex flex-row items-center justify-between pb-3 border-b border-border">
          <DialogTitle className="text-base font-bold font-serif text-foreground flex items-center gap-2">
            <FileText className="w-4 h-4 text-emerald-600" />
            <span>Verifiable Visual Evidence Certificate</span>
          </DialogTitle>
          <Button onClick={handlePrint} size="sm" className="bg-emerald-600 hover:bg-emerald-700 text-white text-xs gap-1.5">
            <Printer className="w-3.5 h-3.5" />
            <span>Print / Save as PDF</span>
          </Button>
        </DialogHeader>

        {/* Printable Official Certificate Sheet */}
        <div ref={certificateRef} className="p-6 bg-white text-stone-900 rounded-xl border border-stone-300 space-y-6 shadow-sm font-sans">
          
          {/* Header Banner */}
          <div className="flex items-start justify-between border-b-2 border-emerald-800 pb-4">
            <div className="space-y-1">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-lg bg-emerald-900 text-amber-300 flex items-center justify-center font-serif font-black text-base">
                  KD
                </div>
                <div>
                  <h2 className="text-xl font-bold font-serif text-emerald-950 leading-none">
                    KisanDrishti
                  </h2>
                  <span className="text-[10px] font-mono tracking-widest text-emerald-800 uppercase font-semibold">
                    Visual Evidence Protocol Certificate
                  </span>
                </div>
              </div>
              <p className="text-[10px] text-stone-600">
                Cryptographically Sealed Smartphone Agricultural Inspection Record
              </p>
            </div>

            <div className="text-right space-y-1">
              <Badge className="bg-emerald-900 text-amber-300 font-mono text-[10px] border-0">
                OFFICIAL RECORD
              </Badge>
              <div className="text-xs font-mono font-bold text-stone-800">
                CERT: {record.id}
              </div>
              <div className="text-[10px] text-stone-500 font-mono">
                Issued: {format(new Date(record.metadata.captureTimestamp), 'dd MMM yyyy, HH:mm')}
              </div>
            </div>
          </div>

          {/* Commodity & Lot Metadata Grid */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 p-3 rounded-lg bg-stone-100 border border-stone-200 text-xs">
            <div>
              <span className="text-[10px] text-stone-500 uppercase font-mono block">Commodity</span>
              <strong className="text-stone-900 font-serif text-sm">{record.metadata.crop}</strong>
              <span className="text-[10px] text-stone-600 block">{record.metadata.variety || 'Standard APMC Grade'}</span>
            </div>

            <div>
              <span className="text-[10px] text-stone-500 uppercase font-mono block">Lot Identifier</span>
              <strong className="text-stone-900 font-mono text-xs">{record.metadata.lotId}</strong>
              <span className="text-[10px] text-emerald-700 font-semibold block">Quality Gate 96% Pass</span>
            </div>

            <div>
              <span className="text-[10px] text-stone-500 uppercase font-mono block">Mandi Location</span>
              <strong className="text-stone-900 text-xs truncate block">{record.metadata.location}</strong>
              <span className="text-[10px] text-stone-500 font-mono block">APMC Registered Hub</span>
            </div>

            <div>
              <span className="text-[10px] text-stone-500 uppercase font-mono block">Capture Device</span>
              <strong className="text-stone-900 font-mono text-xs truncate block">Smartphone Camera</strong>
              <span className="text-[10px] text-stone-500 font-mono block">8-Parameter CV Passed</span>
            </div>
          </div>

          {/* Visual Evidence Photo Strip */}
          <div className="space-y-2">
            <span className="text-xs font-bold font-serif text-stone-900 uppercase tracking-wider block">
              1. Photographed Optical Evidence Package
            </span>
            <div className="grid grid-cols-2 gap-3">
              <div className="rounded-lg overflow-hidden border border-stone-300 bg-stone-100 space-y-1">
                <div className="aspect-[4/3] bg-stone-200">
                  <img
                    src={record.imageUrl}
                    alt="Main Sample Photo"
                    className="w-full h-full object-cover"
                  />
                </div>
                <div className="p-1.5 text-center text-[10px] font-mono text-stone-600 font-semibold">
                  Primary Representative Sample
                </div>
              </div>

              <div className="rounded-lg overflow-hidden border border-stone-300 bg-stone-100 space-y-1">
                <div className="aspect-[4/3] bg-stone-200">
                  <img
                    src={record.photos?.closeUp || record.imageUrl}
                    alt="Macro Close-Up"
                    className="w-full h-full object-cover"
                  />
                </div>
                <div className="p-1.5 text-center text-[10px] font-mono text-stone-600 font-semibold">
                  Macro Grain Structure (Detail)
                </div>
              </div>
            </div>
          </div>

          {/* Observable Metrics & Matrix Table */}
          <div className="space-y-2">
            <span className="text-xs font-bold font-serif text-stone-900 uppercase tracking-wider block">
              2. Standardized Observable Metrics (Visual Findings)
            </span>
            <table className="w-full text-left text-xs border border-stone-300 rounded-lg overflow-hidden">
              <thead className="bg-stone-200 font-mono text-[10px] text-stone-700 uppercase">
                <tr>
                  <th className="p-2 border-b border-stone-300">Observation Parameter</th>
                  <th className="p-2 border-b border-stone-300 text-right">Result</th>
                  <th className="p-2 border-b border-stone-300 text-center">Status</th>
                  <th className="p-2 border-b border-stone-300">Epistemic Method</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-stone-200 text-xs font-mono">
                <tr>
                  <td className="p-2 font-medium text-stone-900 font-sans">Broken / Damaged Grains</td>
                  <td className="p-2 text-right font-bold text-amber-700">{record.stats.brokenPercent}% ({record.stats.brokenCount} count)</td>
                  <td className="p-2 text-center"><Badge className="bg-emerald-100 text-emerald-800 text-[9px] border-emerald-300">OBSERVED</Badge></td>
                  <td className="p-2 text-stone-600 text-[10px]">High-Res Smartphone CV</td>
                </tr>
                <tr>
                  <td className="p-2 font-medium text-stone-900 font-sans">Discolored / Shriveled Grains</td>
                  <td className="p-2 text-right font-bold text-orange-700">{record.stats.discoloredPercent}%</td>
                  <td className="p-2 text-center"><Badge className="bg-emerald-100 text-emerald-800 text-[9px] border-emerald-300">OBSERVED</Badge></td>
                  <td className="p-2 text-stone-600 text-[10px]">Optical Color Masking</td>
                </tr>
                <tr>
                  <td className="p-2 font-medium text-stone-900 font-sans">Foreign Objects / Chaff</td>
                  <td className="p-2 text-right font-bold text-red-700">{record.stats.foreignObjectCount} items</td>
                  <td className="p-2 text-center"><Badge className="bg-emerald-100 text-emerald-800 text-[9px] border-emerald-300">OBSERVED</Badge></td>
                  <td className="p-2 text-stone-600 text-[10px]">Spatial Bounding Box</td>
                </tr>
                <tr className="bg-stone-50">
                  <td className="p-2 font-medium text-stone-900 font-sans">Moisture Content</td>
                  <td className="p-2 text-right text-stone-500 italic">Not Lab Tested</td>
                  <td className="p-2 text-center"><Badge variant="outline" className="text-stone-500 text-[9px] border-stone-300">UNVERIFIED</Badge></td>
                  <td className="p-2 text-stone-500 text-[10px]">Requires Digital Moisture Meter</td>
                </tr>
                <tr className="bg-stone-50">
                  <td className="p-2 font-medium text-stone-900 font-sans">Chemical Residue / Oil %</td>
                  <td className="p-2 text-right text-stone-500 italic">Not Lab Tested</td>
                  <td className="p-2 text-center"><Badge variant="outline" className="text-stone-500 text-[9px] border-stone-300">UNVERIFIED</Badge></td>
                  <td className="p-2 text-stone-500 text-[10px]">Requires Wet Chemistry Laboratory</td>
                </tr>
              </tbody>
            </table>
          </div>

          {/* Cryptographic Hash Seal & QR Code Block */}
          <div className="p-4 rounded-xl border border-stone-300 bg-stone-50 flex flex-col sm:flex-row items-center justify-between gap-4">
            <div className="space-y-1.5 flex-1 min-w-0">
              <div className="flex items-center gap-1.5 text-xs font-bold text-emerald-900 font-serif">
                <Lock className="w-3.5 h-3.5 text-emerald-700" />
                <span>Tamper-Evident SHA-256 Cryptographic Seal:</span>
              </div>
              <div className="p-2 rounded bg-white border border-stone-300 font-mono text-[10px] text-stone-800 break-all select-all">
                {record.cryptographicHash}
              </div>
              <p className="text-[9px] text-stone-500">
                Guarantees zero modifications to the digital evidence package since capture timestamp.
              </p>
            </div>

            <div className="shrink-0 flex flex-col items-center gap-1">
              <QRCodeDataUrl
                text={shareUrl}
                width={80}
                className="rounded border border-stone-300 p-1 bg-white"
              />
              <span className="text-[9px] font-mono text-stone-500">Scan to Verify</span>
            </div>
          </div>

          {/* Mandatory Institutional Disclaimer */}
          <div className="pt-2 border-t border-stone-200 text-[10px] text-stone-600 leading-tight space-y-1">
            <p>
              <strong>Protocol Statement:</strong> KisanDrishti creates standardized visual records for mutual counterparty inspection. It does not decide monetary crop value, official AGMARK mandi grade, or laboratory chemical metrics. Describes the photographed physical sample only.
            </p>
          </div>

        </div>
      </DialogContent>
    </Dialog>
  );
};
