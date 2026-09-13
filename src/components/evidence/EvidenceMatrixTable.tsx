import React, { useState } from 'react';
import type { EvidenceMatrixRow, VerificationStatus } from '@/types/evidence';
import { StatusBadge } from './StatusBadge';
import { 
  Table, 
  TableBody, 
  TableCell, 
  TableHead, 
  TableHeader, 
  TableRow 
} from '@/components/ui/table';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Info, ShieldAlert } from 'lucide-react';

interface EvidenceMatrixTableProps {
  rows: EvidenceMatrixRow[];
  auditId: string;
}

export const EvidenceMatrixTable: React.FC<EvidenceMatrixTableProps> = ({ rows, auditId }) => {
  const [filterStatus, setFilterStatus] = useState<string>('all');

  const filteredRows = rows.filter(r => {
    if (filterStatus === 'all') return true;
    return r.status === filterStatus;
  });

  return (
    <Card className="border border-border shadow-sm">
      <CardHeader className="pb-3 border-b border-border bg-card flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div>
          <div className="flex items-center gap-2">
            <CardTitle className="text-base font-bold font-serif text-foreground">
              Standardized Evidence Matrix
            </CardTitle>
            <Badge variant="outline" className="font-mono text-[10px] border-primary/30 text-primary">
              Epistemic Humility Standard
            </Badge>
          </div>
          <p className="text-xs text-muted-foreground mt-0.5">
            Strict distinction between directly observed visual findings and unverified laboratory measurements.
          </p>
        </div>

        {/* Status Filters */}
        <div className="flex items-center gap-1.5 shrink-0">
          <span className="text-xs text-muted-foreground hidden sm:inline mr-1">Filter:</span>
          {['all', 'OBSERVED', 'POSSIBLE', 'UNVERIFIED'].map((status) => (
            <button
              key={status}
              type="button"
              onClick={() => setFilterStatus(status)}
              className={`px-2.5 py-1 rounded text-xs font-mono font-medium transition-colors ${
                filterStatus === status
                  ? 'bg-primary text-primary-foreground font-semibold shadow-xs'
                  : 'bg-muted text-muted-foreground hover:bg-muted/80'
              }`}
            >
              {status === 'all' ? `All (${rows.length})` : status}
            </button>
          ))}
        </div>
      </CardHeader>

      <CardContent className="p-0">
        <div className="w-full max-w-full overflow-x-auto bg-card">
          <Table className="[&>div]:max-w-full text-xs">
            <TableHeader className="bg-muted/50">
              <TableRow>
                <TableHead className="whitespace-nowrap font-semibold text-foreground w-[220px]">
                  Observable Parameter / Test
                </TableHead>
                <TableHead className="whitespace-nowrap font-semibold text-foreground w-[180px]">
                  Result
                </TableHead>
                <TableHead className="whitespace-nowrap font-semibold text-foreground w-[130px]">
                  Verification Status
                </TableHead>
                <TableHead className="whitespace-nowrap font-semibold text-foreground w-[220px]">
                  Method / Equipment
                </TableHead>
                <TableHead className="whitespace-nowrap font-semibold text-foreground w-[90px]">
                  Confidence
                </TableHead>
                <TableHead className="whitespace-nowrap font-semibold text-foreground min-w-[200px]">
                  Epistemic Limitation / Note
                </TableHead>
              </TableRow>
            </TableHeader>

            <TableBody>
              {filteredRows.map((row) => {
                const isUnverified = row.status === 'UNVERIFIED';
                return (
                  <TableRow 
                    key={row.id} 
                    className={isUnverified ? 'bg-muted/20 opacity-85' : 'hover:bg-muted/40'}
                  >
                    <TableCell className="whitespace-nowrap font-medium text-foreground">
                      <div className="flex items-center gap-1.5">
                        <span className="font-medium">{row.parameter}</span>
                      </div>
                      <span className="text-[10px] text-muted-foreground block font-mono">
                        {row.categoryGroup}
                      </span>
                    </TableCell>

                    <TableCell className="whitespace-nowrap font-mono font-bold text-foreground">
                      {isUnverified ? (
                        <span className="text-muted-foreground italic font-normal">
                          {row.result}
                        </span>
                      ) : (
                        <span className="text-primary">{row.result}</span>
                      )}
                    </TableCell>

                    <TableCell className="whitespace-nowrap">
                      <StatusBadge status={row.status} size="sm" />
                    </TableCell>

                    <TableCell className="whitespace-nowrap text-muted-foreground font-mono text-[11px]">
                      {row.method}
                    </TableCell>

                    <TableCell className="whitespace-nowrap font-mono text-[11px]">
                      {row.confidence === 'High' && (
                        <span className="text-emerald-700 dark:text-emerald-400 font-semibold">High (95%)</span>
                      )}
                      {row.confidence === 'Medium' && (
                        <span className="text-amber-700 dark:text-amber-400 font-semibold">Medium (85%)</span>
                      )}
                      {row.confidence === 'Low' && (
                        <span className="text-orange-700 dark:text-orange-400 font-semibold">Low</span>
                      )}
                      {row.confidence === 'N/A' && (
                        <span className="text-muted-foreground">—</span>
                      )}
                    </TableCell>

                    <TableCell className="whitespace-nowrap text-muted-foreground text-[11px]">
                      {row.note}
                    </TableCell>
                  </TableRow>
                );
              })}
            </TableBody>
          </Table>
        </div>

        {/* Epistemic Protocol Rule Banner */}
        <div className="p-3 bg-muted/40 border-t border-border flex items-start gap-2 text-xs text-muted-foreground">
          <Info className="w-4 h-4 text-primary shrink-0 mt-0.5" />
          <p>
            <strong className="text-foreground">Protocol Rule:</strong> KisanDrishti does not decide what the crop is worth. It creates standardized visual evidence that both sides can inspect. Parameters such as moisture, protein, and chemical residue are explicitly listed <span className="font-mono font-bold">UNVERIFIED (Not tested)</span>.
          </p>
        </div>
      </CardContent>
    </Card>
  );
};
