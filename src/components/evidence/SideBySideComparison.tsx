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
  const availableComparisons = allAudits.filter(a => a.id !== currentRecord.id);

  const [selectedTargetId, setSelectedTargetId] = useState<string>(
    availableComparisons.length > 0 ? availableComparisons[0].id : ''
  );

  const targetRecord = allAudits.find(a => a.id === selectedTargetId) || availableComparisons[0] || null;

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
    <Card className="border border-border shadow-sm">
      <CardHeader className="pb-3 border-b border-border bg-card flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div className="space-y-0.5">
          <div className="flex items-center gap-2">
            <div className="w-7 h-7 rounded-lg bg-primary/10 flex items-center justify-center text-primary">
              <GitCompare className="w-4 h-4" />
            </div>
            <CardTitle className="text-base font-bold font-serif text-foreground">
              Side-by-Side Lot Evidence Comparison
            </CardTitle>
          </div>
          <p className="text-xs text-muted-foreground">
            Compare observable visual evidence rates against previous lots or historical baseline standard.
          </p>
        </div>

        {availableComparisons.length > 0 && (
          <div className="w-full sm:w-64">
            <Select value={selectedTargetId} onValueChange={setSelectedTargetId}>
              <SelectTrigger className="text-xs font-mono h-8">
                <SelectValue placeholder="Select comparison record" />
              </SelectTrigger>
              <SelectContent>
                {availableComparisons.map(a => (
                  <SelectItem key={a.id} value={a.id} className="text-xs font-mono">
                    {a.id} ({a.metadata.crop} - Lot {a.metadata.lotId})
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        )}
      </CardHeader>

      <CardContent className="p-4 space-y-6">
        {targetRecord ? (
          <div className="space-y-4">
            
            {/* Split Images */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              
              {/* Left: Current Sample */}
              <div className="space-y-2 border border-primary/30 p-3 rounded-xl bg-primary/5">
                <div className="flex items-center justify-between">
                  <Badge className="bg-primary text-primary-foreground text-[10px] font-mono">
                    CURRENT AUDIT: {currentRecord.id}
                  </Badge>
                  <span className="text-[11px] font-bold text-foreground">
                    Lot {currentRecord.metadata.lotId}
                  </span>
                </div>

                <div className="aspect-square rounded-lg overflow-hidden border border-border bg-stone-900 relative">
                  <img 
                    src={currentRecord.imageUrl} 
                    alt={currentRecord.metadata.crop}
                    className="w-full h-full object-cover" 
                  />
                  <div className="absolute top-2 left-2 bg-black/75 text-white text-[9px] font-mono px-1.5 py-0.5 rounded">
                    {currentRecord.metadata.crop} ({currentRecord.metadata.variety || 'Standard'})
                  </div>
                </div>

                <div className="grid grid-cols-3 gap-1.5 text-center text-[10px] font-mono">
                  <div className="p-1.5 bg-card rounded border border-border">
                    <span className="text-muted-foreground block">Broken:</span>
                    <span className="font-bold text-amber-700 dark:text-amber-400">{currentRecord.stats.brokenPercent}%</span>
                  </div>
                  <div className="p-1.5 bg-card rounded border border-border">
                    <span className="text-muted-foreground block">Foreign:</span>
                    <span className="font-bold text-red-700 dark:text-red-400">{currentRecord.stats.foreignObjectCount}</span>
                  </div>
                  <div className="p-1.5 bg-card rounded border border-border">
                    <span className="text-muted-foreground block">Discolor:</span>
                    <span className="font-bold text-orange-700 dark:text-orange-400">{currentRecord.stats.discoloredPercent}%</span>
                  </div>
                </div>
              </div>

              {/* Right: Target Sample */}
              <div className="space-y-2 border border-border p-3 rounded-xl bg-muted/20">
                <div className="flex items-center justify-between">
                  <Badge variant="outline" className="text-[10px] font-mono">
                    COMPARISON TARGET: {targetRecord.id}
                  </Badge>
                  <span className="text-[11px] font-bold text-foreground">
                    Lot {targetRecord.metadata.lotId}
                  </span>
                </div>

                <div className="aspect-square rounded-lg overflow-hidden border border-border bg-stone-900 relative">
                  <img 
                    src={targetRecord.imageUrl} 
                    alt={targetRecord.metadata.crop}
                    className="w-full h-full object-cover" 
                  />
                  <div className="absolute top-2 left-2 bg-black/75 text-white text-[9px] font-mono px-1.5 py-0.5 rounded">
                    {targetRecord.metadata.crop} ({targetRecord.metadata.variety || 'Standard'})
                  </div>
                </div>

                <div className="grid grid-cols-3 gap-1.5 text-center text-[10px] font-mono">
                  <div className="p-1.5 bg-card rounded border border-border">
                    <span className="text-muted-foreground block">Broken:</span>
                    <span className="font-bold text-amber-700 dark:text-amber-400">{targetRecord.stats.brokenPercent}%</span>
                  </div>
                  <div className="p-1.5 bg-card rounded border border-border">
                    <span className="text-muted-foreground block">Foreign:</span>
                    <span className="font-bold text-red-700 dark:text-red-400">{targetRecord.stats.foreignObjectCount}</span>
                  </div>
                  <div className="p-1.5 bg-card rounded border border-border">
                    <span className="text-muted-foreground block">Discolor:</span>
                    <span className="font-bold text-orange-700 dark:text-orange-400">{targetRecord.stats.discoloredPercent}%</span>
                  </div>
                </div>
              </div>

            </div>

            {/* Differential Comparison Table */}
            <div className="border border-border rounded-lg overflow-hidden text-xs">
              <div className="grid grid-cols-12 bg-muted/50 p-2 font-semibold font-mono text-[11px] border-b border-border">
                <div className="col-span-5">OBSERVABLE EVIDENCE PARAMETER</div>
                <div className="col-span-2 text-center">CURRENT</div>
                <div className="col-span-2 text-center">TARGET</div>
                <div className="col-span-3 text-right">DIFFERENCE</div>
              </div>

              <div className="divide-y divide-border">
                <div className="grid grid-cols-12 p-2.5 items-center">
                  <div className="col-span-5 font-medium">Broken / Damaged Candidates %</div>
                  <div className="col-span-2 text-center font-mono font-bold text-amber-700">{currentRecord.stats.brokenPercent}%</div>
                  <div className="col-span-2 text-center font-mono text-muted-foreground">{targetRecord.stats.brokenPercent}%</div>
                  <div className="col-span-3 text-right">{getMetricDiff(currentRecord.stats.brokenPercent, targetRecord.stats.brokenPercent)}</div>
                </div>

                <div className="grid grid-cols-12 p-2.5 items-center">
                  <div className="col-span-5 font-medium">Foreign Object Candidates</div>
                  <div className="col-span-2 text-center font-mono font-bold text-red-700">{currentRecord.stats.foreignObjectCount} units</div>
                  <div className="col-span-2 text-center font-mono text-muted-foreground">{targetRecord.stats.foreignObjectCount} units</div>
                  <div className="col-span-3 text-right">{getMetricDiff(currentRecord.stats.foreignObjectCount, targetRecord.stats.foreignObjectCount, ' units')}</div>
                </div>

                <div className="grid grid-cols-12 p-2.5 items-center">
                  <div className="col-span-5 font-medium">Discoloration Candidates %</div>
                  <div className="col-span-2 text-center font-mono font-bold text-orange-700">{currentRecord.stats.discoloredPercent}%</div>
                  <div className="col-span-2 text-center font-mono text-muted-foreground">{targetRecord.stats.discoloredPercent}%</div>
                  <div className="col-span-3 text-right">{getMetricDiff(currentRecord.stats.discoloredPercent, targetRecord.stats.discoloredPercent)}</div>
                </div>

                <div className="grid grid-cols-12 p-2.5 items-center">
                  <div className="col-span-5 font-medium">10x10cm Grid Dispersion Coverage</div>
                  <div className="col-span-2 text-center font-mono font-bold text-emerald-700">{currentRecord.stats.sampleCoveragePercent}%</div>
                  <div className="col-span-2 text-center font-mono text-muted-foreground">{targetRecord.stats.sampleCoveragePercent}%</div>
                  <div className="col-span-3 text-right">{getMetricDiff(currentRecord.stats.sampleCoveragePercent, targetRecord.stats.sampleCoveragePercent)}</div>
                </div>
              </div>
            </div>

          </div>
        ) : (
          <div className="text-center py-8 text-muted-foreground text-xs">
            No other audit records available for comparison. Create more audits to compare across lots.
          </div>
        )}
      </CardContent>
    </Card>
  );
};
