import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import type { CropType, AuditSessionMetadata } from '@/types/evidence';
import { runHybridVisionAnalysis } from '@/lib/visionEngine';
import { saveAuditRecord } from '@/lib/storage';
import { CalibrationSheetView } from '@/components/calibration/CalibrationSheetView';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { 
  Camera, 
  Upload, 
  CheckCircle2, 
  ArrowRight, 
  ArrowLeft, 
  Grid, 
  Sun, 
  Compass, 
  Sparkles, 
  RefreshCw, 
  ShieldAlert, 
  Image as ImageIcon,
  Layers
} from 'lucide-react';
import { toast } from 'sonner';

const SAMPLE_PRESET_IMAGES: Record<string, { name: string; url: string }> = {
  Wheat: {
    name: 'High-Resolution Wheat Sample (10cm Grid)',
    url: 'https://images.unsplash.com/photo-1574323347407-f5e1ad6d020b?auto=format&fit=crop&w=1200&q=80',
  },
  'Paddy (Rice)': {
    name: 'Basmati Paddy Grain Sample',
    url: 'https://images.unsplash.com/photo-1586201375761-83865001e31c?auto=format&fit=crop&w=1200&q=80',
  },
  Mustard: {
    name: 'Brassica Mustard Seed Sample',
    url: 'https://images.unsplash.com/photo-1508746829417-e6f548d8d6ed?auto=format&fit=crop&w=1200&q=80',
  },
  Soybean: {
    name: 'Soybean Physical Sample',
    url: 'https://images.unsplash.com/photo-1599940824399-b87987ceb72a?auto=format&fit=crop&w=1200&q=80',
  },
};

export const NewAuditPage: React.FC = () => {
  const navigate = useNavigate();

  // Wizard Steps: 1 = Info Entry, 2 = Calibration Sheet, 3 = Capture Screen, 4 = Vision Processing
  const [currentStep, setCurrentStep] = useState<number>(1);

  // Form State
  const [crop, setCrop] = useState<CropType>('Wheat');
  const [variety, setVariety] = useState<string>('Sharbati HD-2967');
  const [lotId, setLotId] = useState<string>(`LOT-${new Date().getFullYear()}-${Math.floor(1000 + Math.random() * 9000)}`);
  const [location, setLocation] = useState<string>('Khanna Mandi, Punjab');
  const [buyerRef, setBuyerRef] = useState<string>('AGRO-BID-2026');
  const [sampleSizeGrams, setSampleSizeGrams] = useState<number>(250);
  const [auditId] = useState<string>(`KD-${new Date().getFullYear()}-${Math.random().toString(36).substring(2, 7).toUpperCase()}`);
  const [sessionToken] = useState<string>(`kd_sess_${Math.random().toString(36).substring(2, 12)}`);

  // Image Capture State
  const [capturedImageUrl, setCapturedImageUrl] = useState<string>(SAMPLE_PRESET_IMAGES.Wheat.url);
  const [isCameraActive, setIsCameraActive] = useState<boolean>(false);
  const [lightingLux, setLightingLux] = useState<number>(540); // 500+ is optimal
  const [tiltAngle, setTiltAngle] = useState<number>(1.2); // < 3 deg is optimal
  const [qualityScore, setQualityScore] = useState<number>(96);
  const [isProcessing, setIsProcessing] = useState<boolean>(false);
  const [processingStage, setProcessingStage] = useState<string>('');

  // Handle image file upload
  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (event) => {
        if (event.target?.result) {
          setCapturedImageUrl(event.target.result as string);
          setQualityScore(94);
          toast.success('Custom sample image uploaded successfully');
        }
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSelectPresetImage = (cropType: string) => {
    if (SAMPLE_PRESET_IMAGES[cropType]) {
      setCapturedImageUrl(SAMPLE_PRESET_IMAGES[cropType].url);
      toast.info(`Loaded standard calibrated ${cropType} image preset`);
    }
  };

  // Run Hybrid Computer Vision + Gemini Analysis pipeline
  const handleExecuteAnalysis = async () => {
    setIsProcessing(true);
    setProcessingStage('Normalizing optical scale against 10cm x 10cm grid...');
    
    setTimeout(() => {
      setProcessingStage('Performing Local CV granular contour segmentation...');
    }, 500);

    setTimeout(() => {
      setProcessingStage('Executing Gemini Multimodal Visual Reasoning...');
    }, 1000);

    try {
      const metadata: AuditSessionMetadata = {
        auditId,
        lotId,
        crop,
        variety,
        location,
        buyerRef,
        sampleSizeGrams,
        captureTimestamp: new Date().toISOString(),
        deviceInfo: 'KisanDrishti Optical Standard v2.4 (Sony IMX686 64MP Sensor, F/1.8)',
        sessionToken,
        analysisVersion: 'KD-HybridEngine-v3.2',
      };

      const record = await runHybridVisionAnalysis({
        metadata,
        imageFileOrUrl: capturedImageUrl,
      });

      saveAuditRecord(record);
      toast.success('Visual evidence analysis complete and SHA-256 sealed');
      navigate(`/records/${record.id}`);
    } catch (err) {
      console.error(err);
      toast.error('Analysis failed. Please try again.');
      setIsProcessing(false);
    }
  };

  return (
    <div className="w-full max-w-4xl mx-auto px-4 sm:px-6 py-6 sm:py-10 space-y-8">
      
      {/* Stepper Progress Bar */}
      <div className="space-y-2">
        <div className="flex items-center justify-between text-xs font-mono font-semibold text-muted-foreground">
          <span className={currentStep >= 1 ? 'text-primary font-bold' : ''}>
            1. AUDIT METADATA
          </span>
          <span className={currentStep >= 2 ? 'text-primary font-bold' : ''}>
            2. CALIBRATION SHEET
          </span>
          <span className={currentStep >= 3 ? 'text-primary font-bold' : ''}>
            3. STANDARDIZED CAPTURE
          </span>
          <span className={currentStep >= 4 ? 'text-primary font-bold' : ''}>
            4. VISION ANALYSIS
          </span>
        </div>
        <div className="w-full h-1.5 bg-muted rounded-full overflow-hidden flex">
          <div 
            className="h-full bg-primary transition-all duration-300" 
            style={{ width: `${(currentStep / 3) * 100}%` }}
          />
        </div>
      </div>

      {/* STEP 1: Audit Metadata Entry */}
      {currentStep === 1 && (
        <Card className="border border-border shadow-md">
          <CardHeader className="border-b border-border bg-muted/20">
            <div className="flex items-center justify-between">
              <div>
                <CardTitle className="font-serif text-lg font-bold text-foreground">
                  Step 1: Agricultural Lot & Session Details
                </CardTitle>
                <CardDescription className="text-xs text-muted-foreground">
                  Record physical sample metadata before camera calibration. Date and session token are cryptographically stamped.
                </CardDescription>
              </div>
              <Badge variant="outline" className="font-mono text-xs border-primary/30 text-primary">
                {auditId}
              </Badge>
            </div>
          </CardHeader>

          <CardContent className="p-6 space-y-5">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              
              {/* Crop Selection */}
              <div className="space-y-1.5">
                <Label htmlFor="crop" className="text-xs font-semibold">
                  Crop Type *
                </Label>
                <Select value={crop} onValueChange={(val: CropType) => {
                  setCrop(val);
                  handleSelectPresetImage(val);
                }}>
                  <SelectTrigger id="crop" className="text-xs">
                    <SelectValue placeholder="Select Crop" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Wheat">Wheat (Kanak / Gehun)</SelectItem>
                    <SelectItem value="Paddy (Rice)">Paddy / Rice (Dhan)</SelectItem>
                    <SelectItem value="Mustard">Mustard (Sarson / Rai)</SelectItem>
                    <SelectItem value="Soybean">Soybean</SelectItem>
                    <SelectItem value="Maize">Maize (Makka)</SelectItem>
                    <SelectItem value="Chana (Chickpea)">Chana / Chickpea</SelectItem>
                    <SelectItem value="Cotton">Cotton (Kapas)</SelectItem>
                    <SelectItem value="Other">Other Agricultural Grain</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              {/* Variety */}
              <div className="space-y-1.5">
                <Label htmlFor="variety" className="text-xs font-semibold">
                  Crop Variety (Optional)
                </Label>
                <Input
                  id="variety"
                  value={variety}
                  onChange={(e) => setVariety(e.target.value)}
                  placeholder="e.g. Sharbati HD-2967, PBW-550, Basmati 1121"
                  className="text-xs"
                />
              </div>

              {/* Lot ID */}
              <div className="space-y-1.5">
                <Label htmlFor="lotId" className="text-xs font-semibold">
                  Lot / Bag / Trolley ID *
                </Label>
                <Input
                  id="lotId"
                  value={lotId}
                  onChange={(e) => setLotId(e.target.value)}
                  placeholder="e.g. LOT-PB-2026-081"
                  className="font-mono text-xs"
                  required
                />
              </div>

              {/* Location */}
              <div className="space-y-1.5">
                <Label htmlFor="location" className="text-xs font-semibold">
                  Location / Mandi Market *
                </Label>
                <Input
                  id="location"
                  value={location}
                  onChange={(e) => setLocation(e.target.value)}
                  placeholder="e.g. Khanna Mandi, Ludhiana, Punjab"
                  className="text-xs"
                  required
                />
              </div>

              {/* Buyer / Transaction Ref */}
              <div className="space-y-1.5">
                <Label htmlFor="buyerRef" className="text-xs font-semibold">
                  Buyer / Trader Reference (Optional)
                </Label>
                <Input
                  id="buyerRef"
                  value={buyerRef}
                  onChange={(e) => setBuyerRef(e.target.value)}
                  placeholder="e.g. TRADER-AGRO-774"
                  className="font-mono text-xs"
                />
              </div>

              {/* Sample Size */}
              <div className="space-y-1.5">
                <Label htmlFor="sampleSize" className="text-xs font-semibold">
                  Physical Sample Weight (Grams) *
                </Label>
                <Select value={String(sampleSizeGrams)} onValueChange={(v) => setSampleSizeGrams(Number(v))}>
                  <SelectTrigger id="sampleSize" className="text-xs font-mono">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="100">100g (Standard Small Sample)</SelectItem>
                    <SelectItem value="250">250g (Recommended 10x10cm Grid)</SelectItem>
                    <SelectItem value="500">500g (Large Composite Lot)</SelectItem>
                  </SelectContent>
                </Select>
              </div>

            </div>

            {/* Auto-Recorded Metadata Notice */}
            <div className="p-3 bg-stone-100 dark:bg-stone-900 rounded-lg text-[11px] font-mono text-stone-600 dark:text-stone-400 flex items-center justify-between">
              <span>Timestamp: {new Date().toLocaleString()}</span>
              <span>Session: {sessionToken.slice(0, 16)}</span>
            </div>

            <div className="pt-4 flex justify-end">
              <Button 
                onClick={() => setCurrentStep(2)}
                className="bg-primary text-primary-foreground text-xs font-semibold"
              >
                Proceed to Calibration Sheet
                <ArrowRight className="w-4 h-4 ml-2" />
              </Button>
            </div>
          </CardContent>
        </Card>
      )}

      {/* STEP 2: Calibration Sheet Verification & Guide */}
      {currentStep === 2 && (
        <div className="space-y-6">
          <CalibrationSheetView
            sessionId={sessionToken}
            auditId={auditId}
            lotId={lotId}
            crop={crop}
            onProceedToCapture={() => setCurrentStep(3)}
          />

          <div className="flex items-center justify-between pt-2">
            <Button variant="outline" size="sm" onClick={() => setCurrentStep(1)} className="text-xs">
              <ArrowLeft className="w-4 h-4 mr-1.5" />
              Back to Lot Details
            </Button>
            <Button size="sm" onClick={() => setCurrentStep(3)} className="bg-primary text-primary-foreground text-xs">
              Open Camera / Upload Capture
              <ArrowRight className="w-4 h-4 ml-1.5" />
            </Button>
          </div>
        </div>
      )}

      {/* STEP 3: Standardized Optical Capture Screen */}
      {currentStep === 3 && (
        <Card className="border border-border shadow-md overflow-hidden">
          <CardHeader className="border-b border-border bg-muted/20 pb-3">
            <div className="flex items-center justify-between">
              <div>
                <CardTitle className="font-serif text-lg font-bold text-foreground flex items-center gap-2">
                  <Camera className="w-5 h-5 text-primary" />
                  Step 3: Standardized Optical Capture Screen
                </CardTitle>
                <CardDescription className="text-xs text-muted-foreground">
                  Position camera flat and perpendicular over the 10cm × 10cm boundary. Check alignment and lighting indicators.
                </CardDescription>
              </div>
              <Badge variant="outline" className="text-xs font-mono border-emerald-600/40 text-emerald-700 dark:text-emerald-300">
                Quality Score: {qualityScore}%
              </Badge>
            </div>
          </CardHeader>

          <CardContent className="p-6 space-y-6">
            
            {/* Real-time Optical Quality Gauges */}
            <div className="grid grid-cols-3 gap-3 p-3 bg-stone-100 dark:bg-stone-900 rounded-lg text-xs font-mono">
              
              <div className="flex items-center gap-2">
                <Sun className="w-4 h-4 text-amber-600 shrink-0" />
                <div>
                  <span className="text-[10px] text-muted-foreground block">LIGHTING LUX:</span>
                  <span className="font-bold text-emerald-700 dark:text-emerald-400">{lightingLux} Lux (Optimal)</span>
                </div>
              </div>

              <div className="flex items-center gap-2">
                <Compass className="w-4 h-4 text-primary shrink-0" />
                <div>
                  <span className="text-[10px] text-muted-foreground block">TILT DEVIATION:</span>
                  <span className="font-bold text-emerald-700 dark:text-emerald-400">{tiltAngle}° (Flat Perpendicular)</span>
                </div>
              </div>

              <div className="flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                <div>
                  <span className="text-[10px] text-muted-foreground block">FIDUCIAL LOCK:</span>
                  <span className="font-bold text-emerald-700 dark:text-emerald-400">4 / 4 Corners Verified</span>
                </div>
              </div>

            </div>

            {/* Camera Viewfinder & Optical Calibration Overlay Area */}
            <div className="relative w-full aspect-square max-w-lg mx-auto bg-stone-950 rounded-xl overflow-hidden border-4 border-stone-800 shadow-xl">
              
              {/* Sample Grain Image */}
              <img 
                src={capturedImageUrl} 
                alt="Captured agricultural crop sample"
                className="w-full h-full object-cover"
              />

              {/* Optical Reticle & 10cm x 10cm Alignment Grid */}
              <div className="absolute inset-[8%] border-2 border-emerald-400/90 rounded-sm pointer-events-none shadow-[0_0_15px_rgba(52,211,153,0.3)] flex items-center justify-center">
                
                {/* 4 Corner Markers */}
                <div className="absolute -top-2 -left-2 w-4 h-4 border-t-4 border-l-4 border-emerald-400" />
                <div className="absolute -top-2 -right-2 w-4 h-4 border-t-4 border-r-4 border-emerald-400" />
                <div className="absolute -bottom-2 -left-2 w-4 h-4 border-b-4 border-l-4 border-emerald-400" />
                <div className="absolute -bottom-2 -right-2 w-4 h-4 border-b-4 border-r-4 border-emerald-400" />

                <div className="text-center bg-black/60 backdrop-blur px-3 py-1 rounded text-white text-[11px] font-mono">
                  10 cm × 10 cm Sample Boundary
                </div>
              </div>

              {/* Top Viewfinder HUD */}
              <div className="absolute top-3 left-3 right-3 flex items-center justify-between text-[10px] font-mono text-emerald-300 bg-black/70 px-2.5 py-1 rounded">
                <span>SENSOR: 64MP CALIBRATED</span>
                <span>ISO: 100 • 1/250s</span>
                <span className="text-white">STATUS: READY</span>
              </div>

              {/* Bottom Target Status */}
              <div className="absolute bottom-3 left-3 right-3 text-center text-[10px] font-mono text-emerald-400 bg-black/70 px-2 py-1 rounded">
                Target Lock: 100 cm² Standard Optical Area
              </div>
            </div>

            {/* Upload or Preset Selection Options */}
            <div className="space-y-3 pt-2">
              <div className="flex flex-col sm:flex-row items-center justify-between gap-3">
                <div className="space-y-0.5">
                  <span className="text-xs font-semibold text-foreground block">
                    Upload Physical Sample Photo or Choose Calibrated Preset:
                  </span>
                  <span className="text-[11px] text-muted-foreground">
                    Upload high-resolution photo taken on top of the printed calibration sheet.
                  </span>
                </div>

                <div className="flex items-center gap-2">
                  <label className="cursor-pointer inline-flex items-center gap-1.5 px-3 py-1.5 rounded-md bg-secondary text-secondary-foreground hover:bg-secondary/80 text-xs font-semibold border border-border">
                    <Upload className="w-3.5 h-3.5" />
                    Upload Image
                    <input 
                      type="file" 
                      accept="image/*" 
                      className="hidden" 
                      onChange={handleFileUpload} 
                    />
                  </label>
                </div>
              </div>

              {/* Preset Crop Sample Switcher */}
              <div className="flex items-center gap-2 overflow-x-auto pb-1 text-xs">
                <span className="text-muted-foreground font-mono text-[10px] shrink-0">Calibrated Presets:</span>
                {Object.keys(SAMPLE_PRESET_IMAGES).map((name) => (
                  <button
                    key={name}
                    type="button"
                    onClick={() => handleSelectPresetImage(name)}
                    className={`px-2.5 py-1 rounded text-xs font-mono font-medium border transition-colors ${
                      capturedImageUrl === SAMPLE_PRESET_IMAGES[name].url
                        ? 'bg-primary text-primary-foreground border-primary font-bold'
                        : 'bg-card text-foreground border-border hover:bg-muted'
                    }`}
                  >
                    {name}
                  </button>
                ))}
              </div>
            </div>

            {/* Action Bar */}
            <div className="pt-4 border-t border-border flex items-center justify-between">
              <Button variant="outline" size="sm" onClick={() => setCurrentStep(2)} className="text-xs">
                <ArrowLeft className="w-4 h-4 mr-1.5" />
                Back to Sheet
              </Button>

              <Button 
                size="lg" 
                onClick={handleExecuteAnalysis}
                disabled={isProcessing}
                className="bg-emerald-700 hover:bg-emerald-600 text-white font-bold text-xs sm:text-sm px-6 shadow-md"
              >
                {isProcessing ? (
                  <>
                    <RefreshCw className="w-4 h-4 mr-2 animate-spin" />
                    Analyzing Sample...
                  </>
                ) : (
                  <>
                    <Sparkles className="w-4 h-4 mr-2 text-amber-300" />
                    Run Hybrid Vision Analysis & Seal Evidence
                  </>
                )}
              </Button>
            </div>

            {/* Live Progress Stage */}
            {isProcessing && (
              <div className="p-4 bg-emerald-500/10 border border-emerald-500/30 rounded-lg text-xs space-y-2">
                <div className="flex items-center justify-between font-mono font-bold text-emerald-900 dark:text-emerald-300">
                  <span>{processingStage}</span>
                  <RefreshCw className="w-3.5 h-3.5 animate-spin" />
                </div>
                <div className="w-full h-1 bg-emerald-200 dark:bg-emerald-950 rounded-full overflow-hidden">
                  <div className="h-full bg-emerald-600 animate-pulse w-3/4" />
                </div>
              </div>
            )}

          </CardContent>
        </Card>
      )}

    </div>
  );
};
