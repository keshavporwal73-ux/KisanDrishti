import React, { useState } from 'react';
import type { AuditRecord } from '@/types/evidence';
import { 
  Dialog, 
  DialogContent, 
  DialogHeader, 
  DialogTitle, 
  DialogDescription,
  DialogTrigger 
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { 
  Share2, 
  Copy, 
  Check, 
  Printer, 
  MessageSquare, 
  ShieldCheck, 
  ExternalLink,
  Lock,
  Download
} from 'lucide-react';
import { toast } from 'sonner';
import QRCodeDataUrl from '@/components/ui/qrcodedataurl';
import { incrementAuditShareCount } from '@/lib/storage';

interface ShareModalProps {
  record: AuditRecord;
  triggerButton?: React.ReactNode;
}

export const ShareModal: React.FC<ShareModalProps> = ({ record, triggerButton }) => {
  const [open, setOpen] = useState(false);
  const [copied, setCopied] = useState(false);

  // Canonical share URL (recipient view without app login)
  const shareUrl = typeof window !== 'undefined' 
    ? `${window.location.origin}/records/${record.id}?view=recipient`
    : `https://kisandrishti.app/records/${record.id}?view=recipient`;

  // Preformatted WhatsApp message focusing on Observable Visual Evidence and the central product message
  const whatsappMessage = `*KisanDrishti Visual Evidence Protocol*
Tagline: Evidence Before Valuation

*Evidence ID*: ${record.id}
*Crop*: ${record.metadata.crop} (${record.metadata.variety || 'Standard'})
*Lot*: ${record.metadata.lotId}
*Location*: ${record.metadata.location}

*OBSERVED VISUAL EVIDENCE*:
• Broken/Damaged Material: ${record.stats.brokenPercent}% (${record.stats.brokenCount} obs)
• Visible Discoloration: ${record.stats.discoloredPercent}% (${record.stats.discoloredCount} obs)
• Visible Foreign Material: ${record.stats.foreignObjectCount} ${record.stats.foreignObjectCount === 1 ? 'item' : 'items'}
• Surface Abrasion: ${record.stats.visibleDamagePercent}%
• Capture Quality Score: ${record.stats.captureQualityScore}% (Passed)

*UNVERIFIED (Laboratory Only)*:
• Moisture %: Not tested
• Protein %: Not tested
• Chemical Residue: Not tested

*Tamper-Evident SHA-256*: ${record.cryptographicHash.slice(0, 16)}...

*Inspect Full Visual Evidence Online*:
${shareUrl}

_"KisanDrishti does not decide what the crop is worth. It creates standardized visual evidence that both sides can inspect."_
_Note: Describes captured sample only; does not prove entire lot representativeness._`;

  const handleCopyLink = () => {
    navigator.clipboard.writeText(shareUrl);
    setCopied(true);
    incrementAuditShareCount(record.id);
    toast.success('Shareable evidence link copied to clipboard');
    setTimeout(() => setCopied(false), 2000);
  };

  const handleOpenWhatsApp = () => {
    incrementAuditShareCount(record.id);
    const encoded = encodeURIComponent(whatsappMessage);
    const url = `https://api.whatsapp.com/send?text=${encoded}`;
    window.open(url, '_blank');
  };

  const handlePrint = () => {
    window.print();
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        {triggerButton || (
          <Button variant="outline" size="sm" className="gap-1.5 text-xs border-stone-300">
            <Share2 className="w-3.5 h-3.5" />
            <span>Share Evidence</span>
          </Button>
        )}
      </DialogTrigger>

      <DialogContent className="max-w-[calc(100%-2rem)] md:max-w-lg p-0 overflow-hidden bg-card text-foreground">
        <DialogHeader className="p-4 sm:p-5 bg-muted/40 border-b border-border">
          <div className="flex items-center gap-2">
            <span className="w-2.5 h-2.5 rounded-full bg-emerald-600" />
            <DialogTitle className="text-base font-bold font-serif">
              Share Tamper-Evident Evidence Package
            </DialogTitle>
          </div>
          <DialogDescription className="text-xs text-muted-foreground mt-1">
            Send this standardized visual record to buyers, traders, or mandi officials.
          </DialogDescription>
        </DialogHeader>

        <div className="p-4 sm:p-5 space-y-4 text-xs">
          {/* Quick WhatsApp Action Button */}
          <div className="p-4 rounded-xl border border-emerald-600/30 bg-emerald-500/10 space-y-2.5">
            <div className="flex items-center justify-between">
              <span className="font-bold text-emerald-900 dark:text-emerald-200 text-xs flex items-center gap-1.5">
                <MessageSquare className="w-4 h-4 text-emerald-600" />
                Share via WhatsApp
              </span>
              <span className="text-[10px] font-mono text-emerald-700 dark:text-emerald-400 font-semibold">
                Instant Delivery
              </span>
            </div>
            <p className="text-[11px] text-stone-700 dark:text-stone-300">
              Sends the complete observable evidence summary, breakdown of findings, and tamper-evident web link directly to the buyer.
            </p>
            <Button
              onClick={handleOpenWhatsApp}
              className="w-full bg-emerald-600 hover:bg-emerald-700 text-white font-medium text-xs gap-2 h-9"
            >
              <MessageSquare className="w-4 h-4" />
              <span>Send Preformatted WhatsApp Summary</span>
            </Button>
          </div>

          {/* Web Share Link & QR Code */}
          <div className="space-y-2">
            <span className="font-semibold text-muted-foreground block text-[11px] uppercase tracking-wider">
              Shareable Direct Web Link (No Login Required)
            </span>
            <div className="flex items-center gap-2">
              <Input
                readOnly
                value={shareUrl}
                className="font-mono text-xs bg-muted/30 select-all"
              />
              <Button
                variant="outline"
                size="sm"
                onClick={handleCopyLink}
                className="shrink-0 text-xs border-stone-300"
              >
                {copied ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : <Copy className="w-3.5 h-3.5" />}
              </Button>
            </div>
          </div>

          {/* QR Code Quick Scan */}
          <div className="p-3 rounded-lg border border-border bg-stone-50 dark:bg-stone-900/40 flex items-center gap-4">
            <div className="p-1.5 bg-white rounded-md border border-stone-200 shrink-0">
              <QRCodeDataUrl text={shareUrl} width={64} />
            </div>
            <div className="space-y-1">
              <span className="font-bold text-foreground text-xs block">
                Instant Recipient QR Scan
              </span>
              <p className="text-[11px] text-muted-foreground">
                Buyers can scan this QR code with any standard smartphone camera to open the interactive spatial evidence viewer.
              </p>
            </div>
          </div>

          {/* Export to PDF & Print Action */}
          <div className="pt-2 border-t border-border flex items-center justify-between">
            <Button
              variant="outline"
              size="sm"
              onClick={handlePrint}
              className="text-xs border-stone-300 gap-1.5"
            >
              <Printer className="w-3.5 h-3.5" />
              <span>Export PDF / Print Certificate</span>
            </Button>

            <div className="flex items-center gap-1.5 text-[11px] font-mono text-emerald-600 dark:text-emerald-400">
              <Lock className="w-3.5 h-3.5" />
              <span>SHA-256 Tamper-Evident</span>
            </div>
          </div>

          {/* Mandatory Representativeness Disclaimer */}
          <div className="p-2.5 bg-stone-100 dark:bg-stone-900 text-stone-600 dark:text-stone-400 rounded text-[10px] leading-relaxed border border-border">
            <strong>Mandatory Legal Limitation:</strong> This record describes visual observations from the captured sample only. It does not prove that the captured sample represents the entire lot, nor does it replace official mandi inspection.
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};
