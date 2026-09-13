import React from 'react';
import type { GeminiExplanation } from '@/types/evidence';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Sparkles, ShieldAlert, CheckCircle2, ArrowRight } from 'lucide-react';

interface GeminiExplanationPanelProps {
  explanations: GeminiExplanation[];
  onSelectAnomaly?: (markerId: number) => void;
}

export const GeminiExplanationPanel: React.FC<GeminiExplanationPanelProps> = ({
  explanations,
  onSelectAnomaly,
}) => {
  return (
    <Card className="border border-border shadow-sm">
      <CardHeader className="pb-3 border-b border-border bg-card">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-7 h-7 rounded-lg bg-primary/10 flex items-center justify-center text-primary">
              <Sparkles className="w-4 h-4" />
            </div>
            <div>
              <CardTitle className="text-base font-bold font-serif text-foreground">
                Multimodal Visual Reasoning Explanations
              </CardTitle>
              <p className="text-xs text-muted-foreground">
                Contextual reasoning explaining how observable pixel patterns and calibration metrics were interpreted.
              </p>
            </div>
          </div>
          <Badge variant="outline" className="font-mono text-[10px] border-primary/30 text-primary">
            Observed Evidence Only
          </Badge>
        </div>
      </CardHeader>

      <CardContent className="p-4 space-y-4">
        {explanations.map((exp, idx) => (
          <div 
            key={idx}
            className="p-4 rounded-lg border border-border bg-card/60 space-y-3 hover:border-primary/40 transition-colors"
          >
            <div className="flex items-start justify-between gap-2">
              <div className="space-y-1">
                <div className="flex items-center gap-2">
                  <span className="font-mono text-xs font-bold text-primary">
                    FINDING #{idx + 1}
                  </span>
                  <Badge variant="secondary" className="text-[10px] font-mono">
                    {exp.status}
                  </Badge>
                </div>
                <h4 className="text-sm font-bold text-foreground">
                  {exp.finding}
                </h4>
              </div>

              {exp.markerId && (
                <button
                  type="button"
                  onClick={() => onSelectAnomaly?.(exp.markerId!)}
                  className="px-2 py-1 rounded bg-muted hover:bg-primary hover:text-primary-foreground text-xs font-mono font-medium transition-colors flex items-center gap-1 shrink-0"
                >
                  <span>Pin #{exp.markerId}</span>
                  <ArrowRight className="w-3 h-3" />
                </button>
              )}
            </div>

            {/* Visual Evidence description */}
            <div className="space-y-1 text-xs">
              <span className="font-semibold text-muted-foreground uppercase text-[10px] tracking-wider block">
                Visual Evidence in Image:
              </span>
              <p className="p-2.5 bg-stone-50 dark:bg-stone-900 rounded border border-border text-foreground leading-relaxed">
                {exp.visualEvidence}
              </p>
            </div>

            {/* Visual Reasoning */}
            <div className="space-y-1 text-xs">
              <span className="font-semibold text-primary uppercase text-[10px] tracking-wider block">
                Visual Reasoning Logic:
              </span>
              <p className="p-2.5 bg-primary/5 rounded border border-primary/15 text-foreground leading-relaxed">
                {exp.visualReasoning}
              </p>
            </div>

            {/* Epistemic Limitation */}
            <div className="flex items-start gap-2 p-2 rounded bg-amber-500/10 border border-amber-500/20 text-[11px] text-amber-900 dark:text-amber-200">
              <ShieldAlert className="w-3.5 h-3.5 text-amber-600 shrink-0 mt-0.5" />
              <div>
                <span className="font-semibold">Observation Boundary: </span>
                <span>{exp.limitation}</span>
              </div>
            </div>
          </div>
        ))}

        {/* Global Protocol Notice */}
        <div className="p-3 rounded-lg border border-border bg-muted/30 text-xs text-muted-foreground flex items-center gap-2">
          <CheckCircle2 className="w-4 h-4 text-primary shrink-0" />
          <span>
            KisanDrishti does not decide what the crop is worth. It creates standardized visual evidence that both sides can inspect.
          </span>
        </div>
      </CardContent>
    </Card>
  );
};
