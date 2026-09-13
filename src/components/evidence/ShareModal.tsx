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
  Lock
} from 'lucide-react';
import { toast } from 'sonner';

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
Audit ID: ${record.id}
Crop: ${record.metadata.crop} (${record.metadata.variety || 'Standard'})
Lot: ${record.metadata.lotId}
Location: ${record.metadata.location}

*OBSERVED VISUAL EVIDENCE (10x10cm Calibrated Grid)*:
• Broken/Damaged Candidates: ${record.stats.brokenPercent}%
• Discoloration Candidates: ${record.stats.discoloredPercent}%
• Foreign Object Candidates: ${record.stats.foreignObjectCount}
• Visible Physical Scuffs: ${record.stats.visibleDamagePercent}%
• Grid Dispersion Coverage: ${record.stats.sampleCoveragePercent}%
• Optical Quality Score: ${record.stats.captureQualityScore}%

*UNVERIFIED (Laboratory Only)*:
• Moisture %: Not tested
• Protein %: Not tested
• Chemical Residue: Not tested

*SHA-256 Hash*: ${record.cryptographicHash.slice(0, 16)}...

"KisanDrishti does not decide what the crop is worth. It creates standardized visual evidence that both sides can inspect."

Inspect interactive spatial evidence record:
${shareUrl}`;

  const handleCopyLink = () => {
    navigator.clipboard.writeText(shareUrl);
    setCopied(true);
    toast.success('Shareable evidence link copied to clipboard');
    setTimeout(() => setCopied(false), 2000);
  };

  const handleOpenWhatsApp = () => {
    const encoded = encodeURIComponent(whatsappMessage);
    window.open(`https://api.whatsapp.com/send?text=${encoded}`, '_blank');
  };

  const handlePrint = () => {
    window.print();
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        {triggerButton || (
          <Button variant="default" size="sm" className="text-xs">
            <Share2 className="w-3.5 h-3.5 mr-1.5" />
            Share Evidence
          </Button>
        )}
      </DialogTrigger>

      <DialogContent className="max-w-[calc(100%-2rem)] md:max-w-lg bg-card">
        <DialogHeader>
          <div className="flex items-center gap-2">
            <div className="w-7 h-7 rounded-lg bg-primary/10 flex items-center justify-center text-primary">
              <Share2 className="w-4 h-4" />
            </div>
            <div>
              <DialogTitle className="text-base font-bold font-serif text-foreground">
                Share Tamper-Evident Evidence Card
              </DialogTitle>
              <DialogDescription className="text-xs text-muted-foreground">
                Send verifiable visual evidence to mandi buyers, traders, or commission agents.
              </DialogDescription>
            </div>
          </div>
        </DialogHeader>

        <div className="space-y-4 pt-2 text-xs">
          {/* Summary Preview Box */}
          <div className="p-3 bg-muted/40 rounded-lg border border-border space-y-2">
            <div className="flex items-center justify-between font-mono text-[11px]">
              <span className="font-bold text-foreground">{record.metadata.crop} — Lot {record.metadata.lotId}</span>
              <span className="text-emerald-700 dark:text-emerald-400 font-semibold flex items-center gap-1">
                <ShieldCheck className="w-3.5 h-3.5" /> SHA-256 Verified
              </span>
            </div>

            <div className="grid grid-cols-3 gap-1.5 pt-1 text-center font-mono text-[10px]">
              <div className="p-1.5 bg-card rounded border border-border">
                <span className="text-muted-foreground block">Broken %:</span>
                <span className="font-bold text-amber-700 dark:text-amber-400">{record.stats.brokenPercent}%</span>
              </div>
              <div className="p-1.5 bg-card rounded border border-border">
                <span className="text-muted-foreground block">Foreign:</span>
                <span className="font-bold text-red-700 dark:text-red-400">{record.stats.foreignObjectCount} items</span>
              </div>
              <div className="p-1.5 bg-card rounded border border-border">
                <span className="text-muted-foreground block">Discoloration:</span>
                <span className="font-bold text-orange-700 dark:text-orange-400">{record.stats.discoloredPercent}%</span>
              </div>
            </div>

            <div className="text-[11px] text-muted-foreground pt-1 border-t border-border">
              <em>"KisanDrishti does not decide what the crop is worth. It creates standardized visual evidence that both sides can inspect."</em>
            </div>
          </div>

          {/* Share Link Input */}
          <div className="space-y-1.5">
            <label className="text-[11px] font-semibold text-foreground uppercase tracking-wider block">
              Recipient Web Link (Zero-Install Access):
            </label>
            <div className="flex items-center gap-2">
              <Input
                readOnly
                value={shareUrl}
                className="font-mono text-xs h-9 bg-background"
              />
              <Button
                variant="outline"
                size="sm"
                onClick={handleCopyLink}
                className="h-9 px-3 shrink-0 text-xs border-border"
              >
                {copied ? <Check className="w-3.5 h-3.5 mr-1" /> : <Copy className="w-3.5 h-3.5 mr-1" />}
                {copied ? 'Copied' : 'Copy'}
              </Button>
            </div>
          </div>

          {/* Export Action Buttons */}
          <div className="grid grid-cols-2 gap-2 pt-2">
            <Button
              variant="default"
              onClick={handleOpenWhatsApp}
              className="w-full justify-center text-xs bg-emerald-700 hover:bg-emerald-800 text-white"
            >
              <MessageSquare className="w-3.5 h-3.5 mr-1.5" />
              Share on WhatsApp
            </Button>

            <Button
              variant="outline"
              onClick={handlePrint}
              className="w-full justify-center text-xs border-border text-primary hover:bg-muted"
            >
              <Printer className="w-3.5 h-3.5 mr-1.5" />
              Print / PDF Export
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};
