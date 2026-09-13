import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { BENCHMARK_COMMODITIES, type BenchmarkCommodityProfile } from '@/lib/sampleData';
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
  CheckCircle2,
  GitCompare,
  Wheat,
  MapPin,
  Calendar,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Card, CardContent } from '@/components/ui/card';
import { format } from 'date-fns';

export const DemoPage: React.FC = () => {
  const [selectedCommodityId, setSelectedCommodityId] = useState<string>('wheat');
  const [activeTab, setActiveTab] = useState<string>('spatial');
  const [selectedAnomalyId, setSelectedAnomalyId] = useState<number | undefined>(1);

  const currentCommodity: BenchmarkCommodityProfile = 
    BENCHMARK_COMMODITIES.find(c => c.id === selectedCommodityId) || BENCHMARK_COMMODITIES[0];

  const record = currentCommodity.record;

  return (
    <div className="space-y-6 pb-16">
      
      {/* Top Banner: Enterprise Benchmark Showcase */}
      <div className="p-4 sm:p-5 bg-gradient-to-r from-emerald-950 via-stone-900 to-stone-950 text-white border border-emerald-800/40 rounded-2xl shadow-md flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="space-y-1">
          <div className="flex flex-wrap items-center gap-2">
            <span className="w-2.5 h-2.5 rounded-full bg-emerald-400 animate-pulse" />
            <Badge className="bg-emerald-700/80 hover:bg-emerald-700 text-white font-mono text-[10px] tracking-wider uppercase border-0">
              Interactive Evidence Showcase & Benchmark Protocol
            </Badge>
            <span className="text-xs text-stone-300 font-mono">6 APMC Mandi Commodities</span>
          </div>
          <h1 className="text-lg sm:text-xl font-bold font-serif tracking-tight text-amber-200">
            Standardized Field Verification Benchmark
          </h1>
          <p className="text-xs text-stone-300 max-w-2xl leading-relaxed">
            Explore authentic multi-photo visual evidence packages across India's top agricultural trading hubs. Inspect candidate anomalies, view Gemini multimodal reasoning, and verify tamper-evident cryptographic hashes.
          </p>
        </div>

        <div className="flex items-center gap-2 shrink-0">
          <Button asChild size="sm" className="bg-emerald-600 hover:bg-emerald-700 text-white text-xs gap-1.5 shadow-sm">
            <Link to="/audit/new">
              <Camera className="w-3.5 h-3.5" />
              <span>Create New Audit</span>
            </Link>
          </Button>
          <ShareModal record={record} />
        </div>
      </div>

      {/* Commodity Selector Grid (6 Major Indian Commodities) */}
      <div className="space-y-2">
        <div className="flex items-center justify-between text-xs">
          <span className="font-bold text-foreground uppercase tracking-wider text-[11px] flex items-center gap-1.5">
            <Wheat className="w-3.5 h-3.5 text-emerald-600" />
            Select Benchmark Commodity (Real APMC Mandi Records):
          </span>
          <span className="text-[10px] text-muted-foreground font-mono">
            Click any crop to switch live evidence package
          </span>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-2.5">
          {BENCHMARK_COMMODITIES.map((c) => {
            const isSelected = c.id === selectedCommodityId;
            return (
              <button
                key={c.id}
                type="button"
                onClick={() => {
                  setSelectedCommodityId(c.id);
                  setSelectedAnomalyId(1);
                }}
                className={`p-2.5 sm:p-3 rounded-xl border text-left transition-all relative flex flex-col justify-between ${
                  isSelected
                    ? 'border-emerald-600 bg-emerald-500/10 ring-2 ring-emerald-600/30 shadow-xs'
                    : 'border-border bg-card hover:bg-muted/50'
                }`}
              >
                <div className="space-y-1">
                  <div className="flex items-center justify-between">
                    <span className="font-bold text-xs truncate text-foreground">{c.crop}</span>
                    {isSelected && (
                      <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                    )}
                  </div>
                  <p className="text-[10px] text-muted-foreground font-mono truncate">
                    {c.lotId}
                  </p>
                </div>

                <div className="mt-2 pt-2 border-t border-border/60 text-[9px] text-muted-foreground flex items-center gap-1 truncate">
                  <MapPin className="w-2.5 h-2.5 text-emerald-600 shrink-0" />
                  <span className="truncate">{c.mandiLocation.split(',')[0]}</span>
                </div>
              </button>
            );
          })}
        </div>
      </div>

      {/* Selected Benchmark Metadata Card */}
      <Card className="border border-border shadow-xs bg-card">
        <CardContent className="p-4 sm:p-5">
          <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
            <div className="space-y-1.5">
              <div className="flex flex-wrap items-center gap-2">
                <Badge variant="outline" className="text-xs font-semibold border-emerald-600/40 text-emerald-700 dark:text-emerald-300">
                  {currentCommodity.crop} • {currentCommodity.variety}
                </Badge>
                <Badge variant="secondary" className="text-[10px] font-mono">
                  Lot: {record.metadata.lotId}
                </Badge>
                <Badge variant="outline" className="text-[10px] border-amber-600 text-amber-700 dark:text-amber-300">
                  {currentCommodity.badge}
                </Badge>
              </div>

              <div className="flex flex-wrap items-center gap-x-4 gap-y-1 text-xs text-muted-foreground font-mono">
                <span className="flex items-center gap-1">
                  <MapPin className="w-3 h-3 text-emerald-600" />
                  {record.metadata.location}
                </span>
                <span className="flex items-center gap-1">
                  <Calendar className="w-3 h-3 text-emerald-600" />
                  {format(new Date(record.metadata.captureTimestamp), 'dd MMM yyyy, HH:mm')}
                </span>
                <span className="text-emerald-600 font-semibold">
                  Quality Gate: {record.stats.captureQualityScore}% Passed
                </span>
              </div>
            </div>

            {/* Quick Metrics Strip */}
            <div className="flex items-center gap-2 overflow-x-auto pb-1 font-mono text-center shrink-0">
              <div className="p-2 bg-stone-100 dark:bg-stone-900 border border-border rounded-lg min-w-[80px]">
                <span className="text-[9px] text-muted-foreground block">BROKEN</span>
                <span className="text-xs font-bold text-amber-600">{record.stats.brokenPercent}%</span>
              </div>
              <div className="p-2 bg-stone-100 dark:bg-stone-900 border border-border rounded-lg min-w-[80px]">
                <span className="text-[9px] text-muted-foreground block">DISCOLOR</span>
                <span className="text-xs font-bold text-orange-600">{record.stats.discoloredPercent}%</span>
              </div>
              <div className="p-2 bg-stone-100 dark:bg-stone-900 border border-border rounded-lg min-w-[80px]">
                <span className="text-[9px] text-muted-foreground block">FOREIGN</span>
                <span className="text-xs font-bold text-red-600">{record.stats.foreignObjectCount} item</span>
              </div>
              <div className="p-2 bg-stone-100 dark:bg-stone-900 border border-border rounded-lg min-w-[90px]">
                <span className="text-[9px] text-muted-foreground block">SOUND GRAIN</span>
                <span className="text-xs font-bold text-emerald-600">{record.stats.soundGrainRatePercent}%</span>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

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
            <TabsTrigger value="compare" className="text-xs gap-1.5 py-1.5">
              <GitCompare className="w-3.5 h-3.5" />
              <span>Baseline Reference</span>
            </TabsTrigger>
            <TabsTrigger value="tamper" className="text-xs gap-1.5 py-1.5">
              <Lock className="w-3.5 h-3.5" />
              <span>SHA-256 Seal</span>
            </TabsTrigger>
          </TabsList>
        </div>

        {/* TAB 1: SPATIAL EVIDENCE VIEWER */}
        <TabsContent value="spatial" className="space-y-4">
          <SpatialEvidenceViewer
            imageUrl={record.imageUrl}
            photos={record.photos}
            stats={record.stats}
            detections={record.detections}
            cropName={record.metadata.crop}
            lotId={record.metadata.lotId}
            initialSelectedId={selectedAnomalyId}
            onSelectMarker={(m) => setSelectedAnomalyId(m?.id)}
          />
        </TabsContent>

        {/* TAB 2: STRUCTURED EVIDENCE MATRIX */}
        <TabsContent value="matrix" className="space-y-4">
          <EvidenceMatrixTable rows={record.matrixRows} auditId={record.id} />
        </TabsContent>

        {/* TAB 3: GEMINI MULTIMODAL REASONING PANEL */}
        <TabsContent value="reasoning" className="space-y-4">
          <GeminiExplanationPanel
            explanations={record.explanations}
            onSelectAnomaly={(id) => setSelectedAnomalyId(id)}
          />
        </TabsContent>

        {/* TAB 4: SIDE-BY-SIDE REFERENCE COMPARISON */}
        <TabsContent value="compare" className="space-y-4">
          <SideBySideComparison currentRecord={record} />
        </TabsContent>

        {/* TAB 5: TAMPER-EVIDENT CRYPTOGRAPHIC SEAL */}
        <TabsContent value="tamper" className="space-y-4">
          <TamperEvidentCard record={record} />
        </TabsContent>
      </Tabs>

      {/* Printable / Shareable Summary Card */}
      <div className="space-y-3 pt-4 border-t border-border">
        <div className="flex items-center justify-between">
          <h3 className="font-bold font-serif text-sm text-foreground flex items-center gap-2">
            <FileText className="w-4 h-4 text-emerald-600" />
            <span>Digital Evidence Summary Report (Print & Share Preview)</span>
          </h3>
          <span className="text-xs text-muted-foreground font-mono">
            Evidence ID: {record.id}
          </span>
        </div>
        <EvidenceReportCard record={record} />
      </div>

      {/* Protocol Guarantee Footer Callout */}
      <div className="p-4 rounded-xl border border-border bg-stone-100 dark:bg-stone-900 text-stone-700 dark:text-stone-300 text-xs space-y-1.5">
        <div className="flex items-center gap-2 font-bold text-foreground">
          <ShieldCheck className="w-4 h-4 text-emerald-600" />
          <span>KisanDrishti Protocol Promise:</span>
        </div>
        <p className="text-[11px] leading-relaxed text-muted-foreground">
          "KisanDrishti does not decide what the crop is worth. It creates standardized digital visual records that both farmers and buyers can inspect. Describes the captured sample only; does not claim entire bulk representativeness."
        </p>
      </div>
    </div>
  );
};
