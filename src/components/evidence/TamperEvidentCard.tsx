import React, { useState } from 'react';
import type { AuditRecord } from '@/types/evidence';
import { verifyRecordIntegrity } from '@/lib/crypto';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { 
  ShieldCheck, 
  ShieldAlert, 
  Copy, 
  Check, 
  Lock, 
  RefreshCw, 
  AlertTriangle,
  FileCheck,
  Info
} from 'lucide-react';
import { toast } from 'sonner';

interface TamperEvidentCardProps {
  record: AuditRecord;
}

export const TamperEvidentCard: React.FC<TamperEvidentCardProps> = ({ record }) => {
  const [copied, setCopied] = useState(false);
  const [isVerifying, setIsVerifying] = useState(false);
  const [verificationResult, setVerificationResult] = useState<{
    tested: boolean;
    isValid: boolean;
    computedHash: string;
    recordedHash: string;
  } | null>(null);

  const handleCopyHash = () => {
    navigator.clipboard.writeText(record.cryptographicHash);
    setCopied(true);
    toast.success('SHA-256 cryptographic hash copied to clipboard');
    setTimeout(() => setCopied(false), 2000);
  };

  const handleRunVerification = async (simulateTamper = false) => {
    setIsVerifying(true);
    try {
      let recordToTest = record;
      if (simulateTamper) {
        // Alter a metric slightly to demonstrate tamper detection
        recordToTest = {
          ...record,
          stats: {
            ...record.stats,
            brokenPercent: Number((record.stats.brokenPercent + 2.5).toFixed(1)),
          },
        };
      }

      const result = await verifyRecordIntegrity(recordToTest);
      setVerificationResult({
        tested: true,
        isValid: result.isValid,
        computedHash: result.computedHash,
        recordedHash: result.recordedHash,
      });

      if (result.isValid) {
        toast.success('Cryptographic verification PASSED: Digital record is pristine.');
      } else {
        toast.error('TAMPER ALERT: Recomputed hash does not match stored seal!');
      }
    } catch {
      toast.error('Verification failed');
    } finally {
      setIsVerifying(false);
    }
  };

  return (
    <Card className="border border-border shadow-xs bg-card">
      <CardHeader className="bg-muted/30 pb-3 border-b border-border">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Lock className="w-4 h-4 text-emerald-600" />
            <CardTitle className="text-base font-bold">
              Tamper-Evident SHA-256 Seal
            </CardTitle>
          </div>
          <Badge variant="outline" className="text-[10px] font-mono border-emerald-600 text-emerald-700 dark:text-emerald-400">
            Cryptographic Integrity
          </Badge>
        </div>
      </CardHeader>

      <CardContent className="pt-4 space-y-4 text-xs">
        {/* Hash Display Box */}
        <div className="space-y-1.5">
          <div className="flex items-center justify-between">
            <span className="font-mono text-[11px] text-muted-foreground uppercase">
              Canonical Evidence Package Hash:
            </span>
            <Button
              variant="ghost"
              size="sm"
              onClick={handleCopyHash}
              className="h-6 px-2 text-[11px] gap-1"
            >
              {copied ? <Check className="w-3 h-3 text-emerald-600" /> : <Copy className="w-3 h-3" />}
              <span>Copy</span>
            </Button>
          </div>

          <div className="p-3 bg-stone-900 text-stone-200 rounded-lg font-mono text-[11px] break-all border border-stone-800 select-all leading-relaxed">
            {record.cryptographicHash}
          </div>
        </div>

        {/* Verification Trigger Actions */}
        <div className="flex flex-wrap items-center gap-2 pt-1">
          <Button
            size="sm"
            onClick={() => handleRunVerification(false)}
            disabled={isVerifying}
            className="text-xs bg-emerald-700 hover:bg-emerald-800 text-white gap-1.5 h-8"
          >
            {isVerifying ? (
              <RefreshCw className="w-3.5 h-3.5 animate-spin" />
            ) : (
              <ShieldCheck className="w-3.5 h-3.5" />
            )}
            <span>Verify Digital Hash Now</span>
          </Button>

          <Button
            variant="outline"
            size="sm"
            onClick={() => handleRunVerification(true)}
            disabled={isVerifying}
            className="text-xs border-amber-300 text-amber-700 dark:text-amber-400 hover:bg-amber-50 dark:hover:bg-amber-950/40 gap-1.5 h-8"
          >
            <AlertTriangle className="w-3.5 h-3.5" />
            <span>Simulate Altered Record Test</span>
          </Button>
        </div>

        {/* Verification Result Banner */}
        {verificationResult && (
          <div
            className={`p-3.5 rounded-lg border text-xs space-y-1.5 ${
              verificationResult.isValid
                ? 'bg-emerald-500/10 border-emerald-500/30 text-emerald-900 dark:text-emerald-200'
                : 'bg-red-500/10 border-red-500/30 text-red-900 dark:text-red-200'
            }`}
          >
            <div className="flex items-center gap-2 font-bold">
              {verificationResult.isValid ? (
                <>
                  <ShieldCheck className="w-4 h-4 text-emerald-600" />
                  <span>Digital Record Pristine (Hash Match)</span>
                </>
              ) : (
                <>
                  <ShieldAlert className="w-4 h-4 text-red-600" />
                  <span>Tamper Detected: Recomputed Hash Mismatch!</span>
                </>
              )}
            </div>
            <p className="text-[11px] leading-relaxed">
              {verificationResult.isValid
                ? 'All spatial markers, observable visual defect percentages, timestamp, and crop metadata exactly match the original recorded cryptographic payload.'
                : 'The evidence package content has been altered since the original recording. The recomputed hash differs from the seal.'}
            </p>
          </div>
        )}

        {/* Clear Explanation of Tamper-Evident Limitations */}
        <div className="p-3 rounded-lg border border-border bg-stone-50 dark:bg-stone-900 text-[11px] text-muted-foreground space-y-1.5">
          <span className="font-semibold text-foreground flex items-center gap-1.5">
            <Info className="w-3.5 h-3.5 text-primary" />
            Important Definition: "Tamper-Evident", NOT "Immutable"
          </span>
          <p className="leading-relaxed">
            The SHA-256 hash ensures that any digital modification to the record (such as altering defect percentages or crop IDs) is immediately detectable. 
          </p>
          <p className="leading-relaxed font-medium text-stone-700 dark:text-stone-300">
            <strong>Limitation:</strong> The hash proves that the digital evidence has not changed since capture; it does <em>not</em> prove that the photographed sample was representative of the entire truckload or truthfully selected.
          </p>
        </div>
      </CardContent>
    </Card>
  );
};
