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
  FileCheck
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
        toast.success('Cryptographic verification PASSED: Digital record is pristine');
      } else {
        toast.error('Cryptographic verification FAILED: Tampering detected');
      }
    } catch (e) {
      toast.error('Verification failed');
    } finally {
      setIsVerifying(false);
    }
  };

  return (
    <Card className="border border-border shadow-sm">
      <CardHeader className="pb-3 border-b border-border bg-card">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-primary/10 flex items-center justify-center text-primary">
              <Lock className="w-4 h-4" />
            </div>
            <div>
              <CardTitle className="text-base font-bold font-serif text-foreground">
                Tamper-Evident Cryptographic Seal
              </CardTitle>
              <p className="text-xs text-muted-foreground">
                Deterministic SHA-256 digest calculated over the canonical visual evidence package.
              </p>
            </div>
          </div>
          <Badge variant="outline" className="font-mono text-[10px] text-primary border-primary/30 w-fit">
            SHA-256 CANONICAL SEAL
          </Badge>
        </div>
      </CardHeader>

      <CardContent className="pt-4 space-y-4 text-xs">
        {/* Hash Display Box */}
        <div className="p-3 bg-stone-900 text-stone-100 rounded-lg space-y-2 border border-stone-800">
          <div className="flex items-center justify-between text-[11px] font-mono text-stone-400">
            <span>OFFICIAL RECORD DIGEST:</span>
            <span className="text-emerald-400 font-semibold flex items-center gap-1">
              <ShieldCheck className="w-3.5 h-3.5" />
              Signed at Capture
            </span>
          </div>

          <div className="p-2 bg-stone-950 rounded font-mono text-[11px] text-amber-300 break-all select-all border border-stone-800">
            {record.cryptographicHash}
          </div>

          <div className="flex items-center justify-between pt-1">
            <span className="text-[10px] font-mono text-stone-400">
              Algorithm: SHA-256 (256-bit Hex)
            </span>
            <Button
              variant="ghost"
              size="sm"
              onClick={handleCopyHash}
              className="h-7 text-xs border border-white/20 text-white hover:bg-white/10"
            >
              {copied ? <Check className="w-3.5 h-3.5 mr-1" /> : <Copy className="w-3.5 h-3.5 mr-1" />}
              {copied ? 'Copied' : 'Copy Hash'}
            </Button>
          </div>
        </div>

        {/* Verification Controls */}
        <div className="space-y-3 pt-1">
          <div className="flex flex-col sm:flex-row items-center gap-2">
            <Button
              variant="default"
              size="sm"
              onClick={() => handleRunVerification(false)}
              disabled={isVerifying}
              className="w-full sm:w-auto text-xs"
            >
              <RefreshCw className={`w-3.5 h-3.5 mr-1.5 ${isVerifying ? 'animate-spin' : ''}`} />
              Verify Digital Integrity
            </Button>

            <Button
              variant="outline"
              size="sm"
              onClick={() => handleRunVerification(true)}
              disabled={isVerifying}
              className="w-full sm:w-auto text-xs text-muted-foreground hover:text-foreground"
            >
              <AlertTriangle className="w-3.5 h-3.5 mr-1.5 text-amber-600" />
              Simulate Post-Capture Tamper Test
            </Button>
          </div>

          {/* Verification Result Display */}
          {verificationResult && verificationResult.tested && (
            <div
              className={`p-3 rounded-lg border text-xs space-y-1.5 ${
                verificationResult.isValid
                  ? 'bg-emerald-500/10 border-emerald-500/30 text-emerald-900 dark:text-emerald-200'
                  : 'bg-red-500/10 border-red-500/30 text-red-900 dark:text-red-200'
              }`}
            >
              <div className="flex items-center gap-2 font-bold text-sm">
                {verificationResult.isValid ? (
                  <>
                    <ShieldCheck className="w-4 h-4 text-emerald-600" />
                    <span>INTEGRITY VERIFIED: Pristine Original Record</span>
                  </>
                ) : (
                  <>
                    <ShieldAlert className="w-4 h-4 text-red-600" />
                    <span>TAMPER DETECTED: Data package modified since capture</span>
                  </>
                )}
              </div>

              <div className="font-mono text-[10px] space-y-0.5">
                <div>Recorded Hash: {verificationResult.recordedHash.slice(0, 32)}...</div>
                <div>Computed Hash: {verificationResult.computedHash.slice(0, 32)}...</div>
              </div>
            </div>
          )}
        </div>

        {/* Epistemic disclaimer for cryptographic hashing */}
        <div className="p-3 rounded-lg bg-muted/40 border border-border text-[11px] text-muted-foreground space-y-1">
          <span className="font-semibold text-foreground block">Epistemic Scope of Hash:</span>
          <p>
            The SHA-256 hash guarantees that the digital findings have not been altered after capture. It proves record integrity; it does not guarantee that the physical sample was representative of the whole field.
          </p>
        </div>
      </CardContent>
    </Card>
  );
};
