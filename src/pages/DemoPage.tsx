import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { DEMO_WHEAT_AUDIT } from '@/lib/sampleData';
import { SpatialEvidenceViewer } from '@/components/evidence/SpatialEvidenceViewer';
import { EvidenceMatrixTable } from '@/components/evidence/EvidenceMatrixTable';
import { GeminiExplanationPanel } from '@/components/evidence/GeminiExplanationPanel';
import { TamperEvidentCard } from '@/components/evidence/TamperEvidentCard';
import { ShareModal } from '@/components/evidence/ShareModal';
import { EvidenceReportCard } from '@/components/evidence/EvidenceReportCard';
import { SideBySideComparison } from '@/components/evidence/SideBySideComparison';
import { 
  Sparkles, 
  Layers, 
  FileText, 
  Lock, 
  Camera, 
  ShieldCheck, 
  Info,
  ArrowRight,
  CheckCircle2,
  GitCompare,
  AlertTriangle
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';

export const DemoPage: React.FC = () => {
  const [activeTab, setActiveTab] = useState<string>('spatial');
  const [selectedAnomalyId, setSelectedAnomalyId] = useState<number | undefined>(1);
  const record = DEMO_WHEAT_AUDIT;

  return (
    <div className="space-y-6 pb-16">
      
      {/* Explicit Demo Mode Banner Required by Specification */}
      <div className="p-4 bg-amber-500/10 border-2 border-amber-500/40 rounded-xl flex flex-col sm:flex-row sm:items-center justify-between gap-3 shadow-xs">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-lg bg-amber-500 text-stone-950 font-bold flex items-center justify-center shrink-0">
            <AlertTriangle className="w-5 h-5" />
          </div>
          <div className="space-y-0.5">
            <div className="flex items-center gap-2">
              <Badge className="bg-amber-600 hover:bg-amber-700 text-white font-mono font-bold text-[10px] tracking-wider">
                DEMO DATA — NOT A REAL AGRICULTURAL ASSESSMENT
              </Badge>
            </div>
            <p className="text-xs text-foreground font-medium">
              Realistic walkthrough of the KisanDrishti visual evidence protocol without requiring real hardware or live farmer capture.
            </p>
          </div>
        </div>

        <Button asChild size="sm" className="bg-emerald-700 hover:bg-emerald-800 text-white shrink-0 text-xs gap-1.5">
          <Link to="/audit/new">
            <Camera className="w-3.5 h-3.5" />
            <span>Create Real Evidence</span>
          </Link>
        </Button>
      </div>

      {/* Product Positioning Summary Card */}
      <div className="p-4 rounded-xl border border-border bg-stone-900 text-stone-200 text-xs space-y-2">
        <div className="flex items-center gap-2 font-bold text-amber-300 font-serif text-sm">
          <ShieldCheck className="w-4 h-4 text-emerald-400" />
          <span>Central Product Promise: "Evidence Before Valuation"</span>
        </div>
        <p className="text-stone-300 text-xs leading-relaxed">
          "Don't tell both sides what the crop is worth. Give both sides the same visual evidence to inspect."
        </p>
        <p className="text-[11px] text-stone-400">
          KisanDrishti is NOT an AI crop-price predictor, NOT a laboratory, and NOT an official grading authority. It creates standardized digital visual records for fair mandi transactions.
        </p>
      </div>

      {/* Main Tabbed Analysis Views */}
      <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-4">
        <div className="overflow-x-auto pb-1">
          <TabsList className="grid grid-cols-5 w-full min-w-[550px] bg-muted/60 p-1">
            <TabsTrigger value="spatial" className="text-xs gap-1.5 py-1.5">
              <Layers className="w-3.5 h-3.5" />
              <span>Spatial Viewer</span>
            </TabsTrigger>
            <TabsTrigger value="matrix" className="text-xs gap-1.5 py-1.5">
              <FileText className="w-3.5 h-3.5" />
              <span>Evidence Matrix</span>
            </TabsTrigger>
            <TabsTrigger value="reasoning" className="text-xs gap-1.5 py-1.5">
              <Sparkles className="w-3.5 h-3.5" />
              <span>Gemini Reasoning</span>
            </TabsTrigger>
            <TabsTrigger value="comparison" className="text-xs gap-1.5 py-1.5">
              <GitCompare className="w-3.5 h-3.5" />
              <span>Side-by-Side</span>
            </TabsTrigger>
            <TabsTrigger value="seal" className="text-xs gap-1.5 py-1.5">
              <Lock className="w-3.5 h-3.5" />
              <span>SHA-256 Seal</span>
            </TabsTrigger>
          </TabsList>
        </div>

        {/* TAB 1: Spatial Evidence Viewer */}
        <TabsContent value="spatial" className="space-y-4 m-0">
          <SpatialEvidenceViewer
            imageUrl={record.imageUrl}
            photos={record.photos}
            stats={record.stats}
            detections={record.detections}
            cropName={record.metadata.crop}
            lotId={record.metadata.lotId}
            initialSelectedId={selectedAnomalyId}
            onSelectMarker={(m) => m && setSelectedAnomalyId(m.id)}
          />
        </TabsContent>

        {/* TAB 2: Standardized Evidence Matrix */}
        <TabsContent value="matrix" className="space-y-4 m-0">
          <EvidenceMatrixTable rows={record.matrixRows} auditId={record.id} />
        </TabsContent>

        {/* TAB 3: Gemini Multimodal Reasoning */}
        <TabsContent value="reasoning" className="space-y-4 m-0">
          <GeminiExplanationPanel
            explanations={record.explanations}
            onSelectAnomaly={(id) => {
              setSelectedAnomalyId(id);
              setActiveTab('spatial');
            }}
          />
        </TabsContent>

        {/* TAB 4: Side-by-Side Comparison */}
        <TabsContent value="comparison" className="space-y-4 m-0">
          <SideBySideComparison
            currentRecord={record}
          />
        </TabsContent>

        {/* TAB 5: Tamper-Evident SHA-256 Seal */}
        <TabsContent value="seal" className="space-y-4 m-0">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
            <div className="lg:col-span-6 space-y-4">
              <TamperEvidentCard record={record} />
            </div>
            <div className="lg:col-span-6 space-y-4">
              <EvidenceReportCard record={record} />
            </div>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
};
