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
  GitCompare
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
      
      {/* Demo Banner */}
      <div className="p-4 bg-amber-500/10 border-2 border-amber-500/30 rounded-xl flex flex-col sm:flex-row sm:items-center justify-between gap-3 shadow-xs">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-lg bg-amber-500/20 text-amber-700 dark:text-amber-300 flex items-center justify-center shrink-0">
            <Sparkles className="w-5 h-5" />
          </div>
          <div className="space-y-0.5">
            <div className="flex items-center gap-2">
              <Badge className="bg-amber-500 text-stone-950 font-mono font-bold text-[10px]">
                DEMO WALKTHROUGH MODE
              </Badge>
              <span className="font-mono text-xs text-muted-foreground">Fictional Sample</span>
            </div>
            <p className="text-xs text-foreground font-medium">
              Explore how KisanDrishti prioritizes observable visual evidence on a calibrated wheat sample.
            </p>
          </div>
        </div>

        <Button asChild size="sm" className="bg-primary text-primary-foreground shrink-0 text-xs">
          <Link to="/audit/new">
            <Camera className="w-3.5 h-3.5 mr-1.5" />
            Start Real Audit
          </Link>
        </Button>
      </div>

      {/* Header Info */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-2">
        <div className="space-y-1">
          <h1 className="text-xl sm:text-2xl font-serif font-bold text-foreground">
            {record.metadata.variety} ({record.metadata.crop})
          </h1>
          <p className="text-xs text-muted-foreground">
            Captured on 10cm × 10cm Standard Calibration Grid • Khanna Mandi, Punjab
          </p>
        </div>

        <ShareModal record={record} />
      </div>

      {/* Observable Visual Evidence Top KPI Cards (NOT Grain Counts) */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3">
        <div className="p-3 bg-card border border-border rounded-xl shadow-xs space-y-1">
          <div className="text-[10px] font-mono uppercase text-muted-foreground font-semibold">
            Broken / Cleaved %
          </div>
          <div className="text-lg sm:text-xl font-mono font-bold text-amber-700 dark:text-amber-400">
            {record.stats.brokenPercent}%
          </div>
          <div className="text-[10px] text-muted-foreground">
            {record.stats.brokenCount} observed fragments
          </div>
        </div>

        <div className="p-3 bg-card border border-border rounded-xl shadow-xs space-y-1">
          <div className="text-[10px] font-mono uppercase text-muted-foreground font-semibold">
            Discoloration %
          </div>
          <div className="text-lg sm:text-xl font-mono font-bold text-orange-700 dark:text-orange-400">
            {record.stats.discoloredPercent}%
          </div>
          <div className="text-[10px] text-muted-foreground">
            {record.stats.discoloredCount} shriveled / dark
          </div>
        </div>

        <div className="p-3 bg-card border border-border rounded-xl shadow-xs space-y-1">
          <div className="text-[10px] font-mono uppercase text-muted-foreground font-semibold">
            Foreign Objects
          </div>
          <div className="text-lg sm:text-xl font-mono font-bold text-red-700 dark:text-red-400">
            {record.stats.foreignObjectCount} units
          </div>
          <div className="text-[10px] text-muted-foreground">
            1 silica stone + 1 weed seed
          </div>
        </div>

        <div className="p-3 bg-card border border-border rounded-xl shadow-xs space-y-1">
          <div className="text-[10px] font-mono uppercase text-muted-foreground font-semibold">
            Grid Coverage
          </div>
          <div className="text-lg sm:text-xl font-mono font-bold text-emerald-700 dark:text-emerald-400">
            {record.stats.sampleCoveragePercent}%
          </div>
          <div className="text-[10px] text-muted-foreground">
            100 cm² calibrated target
          </div>
        </div>

        <div className="p-3 bg-card border border-border rounded-xl shadow-xs space-y-1 col-span-2 sm:col-span-1">
          <div className="text-[10px] font-mono uppercase text-muted-foreground font-semibold">
            Optical Quality
          </div>
          <div className="text-lg sm:text-xl font-mono font-bold text-emerald-700 dark:text-emerald-400 flex items-center gap-1">
            <ShieldCheck className="w-4 h-4 text-emerald-600" />
            <span>{record.stats.captureQualityScore}%</span>
          </div>
          <div className="text-[10px] text-muted-foreground">
            Fiducials locked • 540 Lux
          </div>
        </div>
      </div>

      {/* Main Interactive Evidentiary Tabs */}
      <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-4">
        <TabsList className="bg-muted p-1 rounded-lg w-full sm:w-auto grid grid-cols-5 sm:flex">
          <TabsTrigger value="spatial" className="text-xs font-medium gap-1.5">
            <Layers className="w-3.5 h-3.5 hidden sm:inline" />
            <span>Interactive Spatial Viewer</span>
          </TabsTrigger>
          <TabsTrigger value="matrix" className="text-xs font-medium gap-1.5">
            <FileText className="w-3.5 h-3.5 hidden sm:inline" />
            <span>Evidence Matrix</span>
          </TabsTrigger>
          <TabsTrigger value="reasoning" className="text-xs font-medium gap-1.5">
            <Sparkles className="w-3.5 h-3.5 hidden sm:inline" />
            <span>Gemini Reasoning</span>
          </TabsTrigger>
          <TabsTrigger value="comparison" className="text-xs font-medium gap-1.5">
            <GitCompare className="w-3.5 h-3.5 hidden sm:inline" />
            <span>Side-by-Side</span>
          </TabsTrigger>
          <TabsTrigger value="security" className="text-xs font-medium gap-1.5">
            <Lock className="w-3.5 h-3.5 hidden sm:inline" />
            <span>SHA-256 Tamper Seal</span>
          </TabsTrigger>
        </TabsList>

        <TabsContent value="spatial" className="space-y-4 m-0 focus-visible:outline-hidden">
          <SpatialEvidenceViewer
            imageUrl={record.imageUrl}
            stats={record.stats}
            detections={record.detections}
            cropName={record.metadata.crop}
            lotId={record.metadata.lotId}
            initialSelectedId={selectedAnomalyId}
            onSelectMarker={(m) => setSelectedAnomalyId(m?.id)}
          />
        </TabsContent>

        <TabsContent value="matrix" className="space-y-4 m-0 focus-visible:outline-hidden">
          <EvidenceMatrixTable rows={record.matrixRows} auditId={record.id} />
        </TabsContent>

        <TabsContent value="reasoning" className="space-y-4 m-0 focus-visible:outline-hidden">
          <GeminiExplanationPanel
            explanations={record.explanations}
            onSelectAnomaly={(id) => {
              setSelectedAnomalyId(id);
              setActiveTab('spatial');
            }}
          />
        </TabsContent>

        <TabsContent value="comparison" className="space-y-4 m-0 focus-visible:outline-hidden">
          <SideBySideComparison currentRecord={record} />
        </TabsContent>

        <TabsContent value="security" className="space-y-4 m-0 focus-visible:outline-hidden">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
            <div className="lg:col-span-7">
              <TamperEvidentCard record={record} />
            </div>
            <div className="lg:col-span-5 space-y-4">
              <EvidenceReportCard record={record} />
            </div>
          </div>
        </TabsContent>
      </Tabs>

      {/* Central Product Statement */}
      <div className="p-4 rounded-xl border border-border bg-stone-900 text-stone-200 text-xs flex items-center justify-between gap-4">
        <div className="space-y-0.5">
          <span className="font-bold text-amber-300 block font-serif">KisanDrishti Protocol Ground:</span>
          <p className="text-stone-300">
            "KisanDrishti does not decide what the crop is worth. It creates standardized visual evidence that both sides can inspect."
          </p>
        </div>
      </div>

    </div>
  );
};
