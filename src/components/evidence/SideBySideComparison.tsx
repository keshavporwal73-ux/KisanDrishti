import React, { useState } from 'react';
import type { AuditRecord } from '@/types/evidence';
import { getAuditHistory } from '@/lib/storage';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { GitCompare, ArrowRight, ShieldCheck, CheckCircle2 } from 'lucide-react';

interface SideBySideComparisonProps {
  currentRecord: AuditRecord;
}

export const SideBySideComparison: React.FC<SideBySideComparisonProps> = ({ currentRecord }) => {
  const allAudits = getAuditHistory();
  const availableComparisons = allAudits.filter((a: AuditRecord) => a.id !== currentRecord.id);

  const [selectedTargetId, setSelectedTargetId] = useState<string>(
    availableComparisons.length > 0 ? availableComparisons[0].id : ''
  );

  const targetRecord = allAudits.find((a: AuditRecord) => a.id === selectedTargetId) || availableComparisons[0] || null;

  const getMetricDiff = (curr: number, target: number, unit = '%') => {
    const diff = Number((curr - target).toFixed(1));
    if (diff === 0) return <span className="text-muted-foreground font-mono">0{unit} (Equal)</span>;
    if (diff > 0) {
      return (
        <span className="text-amber-600 font-mono font-semibold">
          +{diff}{unit} higher
        </span>
      );
    }
    return (
      <span className="text-emerald-600 font-mono font-semibold">
        {diff}{unit} lower
      </span>
    );
  };

  return (
    <Card className="border border-border shadow-xs bg-card">
      <CardHeader className="pb-3 border-b border-border bg-card">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div className="flex items-center gap-2">
            <div className="w-7 h-7 rounded-lg bg-emerald-500/10 flex items-center justify-center text-emerald-600">
              <GitCompare className="w-4 h-4" />
            </div>
            <div>
              <CardTitle className="text-base font-bold font-serif text-foreground">
                Side-by-Side Visual & Observable Baseline Comparison
              </CardTitle>
              <p className="text-xs text-muted-foreground">
                Compare current sample against reference baseline or past transactions of identical crop type.
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2 shrink-0">
            <span className="text-xs text-muted-foreground">Compare with:</span>
            <Select value={selectedTargetId} onValueChange={setSelectedTargetId}>
              <SelectTrigger className="w-[200px] h-8 text-xs">
                <SelectValue placeholder="Select target audit" />
              </SelectTrigger>
              <SelectContent>
                {availableComparisons.map((a: AuditRecord) => (
                  <SelectItem key={a.id} value={a.id} className="text-xs">
                    {a.metadata.crop} ({a.metadata.lotId})
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </div>
      </CardHeader>

      <CardContent className="p-4 space-y-6">
        {targetRecord ? (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            
            {/* Current Sample Column */}
            <div className="space-y-3 p-4 rounded-xl border border-emerald-600/30 bg-emerald-500/5">
              <div className="flex items-center justify-between">
                <Badge variant="outline" className="font-mono text-xs border-emerald-600 text-emerald-700 dark:text-emerald-300">
                  Current Sample: {currentRecord.id}
                </Badge>
                <span className="text-xs font-bold text-foreground">
                  {currentRecord.metadata.crop} ({currentRecord.metadata.lotId})
                </span>
              </div>

              <div className="aspect-[4/3] rounded-lg overflow-hidden border border-border bg-stone-900">
                <img
                  src={currentRecord.imageUrl}
                  alt="Current crop sample"
                  className="w-full h-full object-cover"
                />
              </div>

              <div className="space-y-2 text-xs font-mono">
                <div className="flex justify-between py-1 border-b border-border">
                  <span className="text-muted-foreground">Broken Grains:</span>
                  <span className="font-bold text-amber-600">{currentRecord.stats.brokenPercent}%</span>
                </div>
                <div className="flex justify-between py-1 border-b border-border">
                  <span className="text-muted-foreground">Discolored / Shriveled:</span>
                  <span className="font-bold text-orange-600">{currentRecord.stats.discoloredPercent}%</span>
                </div>
                <div className="flex justify-between py-1 border-b border-border">
                  <span className="text-muted-foreground">Foreign Matter:</span>
                  <span className="font-bold text-red-600">{currentRecord.stats.foreignObjectCount} items</span>
                </div>
                <div className="flex justify-between py-1 border-b border-border">
                  <span className="text-muted-foreground">Sound Grain Rate:</span>
                  <span className="font-bold text-emerald-600">{currentRecord.stats.soundGrainRatePercent}%</span>
                </div>
              </div>
            </div>

            {/* Target Comparison Sample Column */}
            <div className="space-y-3 p-4 rounded-xl border border-border bg-muted/30">
              <div className="flex items-center justify-between">
                <Badge variant="outline" className="font-mono text-xs border-border text-foreground">
                  Baseline: {targetRecord.id}
                </Badge>
                <span className="text-xs font-bold text-foreground">
                  {targetRecord.metadata.crop} ({targetRecord.metadata.lotId})
                </span>
              </div>

              <div className="aspect-[4/3] rounded-lg overflow-hidden border border-border bg-stone-900">
                <img
                  src={targetRecord.imageUrl}
                  alt="Baseline comparison crop sample"
                  className="w-full h-full object-cover"
                />
              </div>

              <div className="space-y-2 text-xs font-mono">
                <div className="flex justify-between py-1 border-b border-border">
                  <span className="text-muted-foreground">Broken Grains:</span>
                  <span className="font-bold">{targetRecord.stats.brokenPercent}% ({getMetricDiff(currentRecord.stats.brokenPercent, targetRecord.stats.brokenPercent)})</span>
                </div>
                <div className="flex justify-between py-1 border-b border-border">
                  <span className="text-muted-foreground">Discolored / Shriveled:</span>
                  <span className="font-bold">{targetRecord.stats.discoloredPercent}% ({getMetricDiff(currentRecord.stats.discoloredPercent, targetRecord.stats.discoloredPercent)})</span>
                </div>
                <div className="flex justify-between py-1 border-b border-border">
                  <span className="text-muted-foreground">Foreign Matter:</span>
                  <span className="font-bold">{targetRecord.stats.foreignObjectCount} items ({getMetricDiff(currentRecord.stats.foreignObjectCount, targetRecord.stats.foreignObjectCount, '')})</span>
                </div>
                <div className="flex justify-between py-1 border-b border-border">
                  <span className="text-muted-foreground">Sound Grain Rate:</span>
                  <span className="font-bold">{targetRecord.stats.soundGrainRatePercent}% ({getMetricDiff(currentRecord.stats.soundGrainRatePercent, targetRecord.stats.soundGrainRatePercent)})</span>
                </div>
              </div>
            </div>

          </div>
        ) : (
          <p className="text-xs text-muted-foreground text-center py-6">
            No secondary benchmark available for comparison.
          </p>
        )}
      </CardContent>
    </Card>
  );
};
