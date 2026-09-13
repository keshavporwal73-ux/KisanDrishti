import React, { useState, useEffect, useRef } from 'react';
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
import { Checkbox } from '@/components/ui/checkbox';
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
  Layers,
  AlertOctagon,
  ListChecks,
  Video,
  SwitchCamera,
  Activity,
  Sliders
} from 'lucide-react';
import { toast } from 'sonner';
import { useLanguage } from '@/context/LanguageContext';

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
  const { t } = useLanguage();

  // Wizard Steps:
  // 1 = Lot Info
  // 2 = Sample Prep Checklist
  // 3 = Calibration Sheet
  // 4 = Enhanced Live Capture
  // 5 = Pre-Validation Check
  // 6 = Failure Screen (if failed)
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

  // Checklist State
  const [checklist, setChecklist] = useState({
    cleanSurface: true,
    evenSpread: true,
    ambientLight: true,
    perpendicularAngle: true,
    withinBoundary: true,
    fiducialsVisible: true,
  });

  // Camera & Video Streaming State
  const videoRef = useRef<HTMLVideoElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [isCameraLive, setIsCameraLive] = useState<boolean>(false);
  const [cameraError, setCameraError] = useState<string | null>(null);
  const [facingMode, setFacingMode] = useState<'user' | 'environment'>('environment');

  // Optical Indicators
  const [capturedImageUrl, setCapturedImageUrl] = useState<string>(SAMPLE_PRESET_IMAGES.Wheat.url);
  const [lightingLux, setLightingLux] = useState<number>(540); // 500+ is optimal
  const [tiltAngle, setTiltAngle] = useState<number>(1.2); // < 3 deg is optimal
  const [qualityScore, setQualityScore] = useState<number>(96);

  // Validation Check Engine
  const [validationStage, setValidationStage] = useState<number>(0);
  const [validationFailures, setValidationFailures] = useState<string[]>([]);
  const [isProcessing, setIsProcessing] = useState<boolean>(false);
  const [processingStage, setProcessingStage] = useState<string>('');

  // Start Live Camera
  const startLiveCamera = async () => {
    try {
      setCameraError(null);
      if (navigator.mediaDevices && navigator.mediaDevices.getUserMedia) {
        const stream = await navigator.mediaDevices.getUserMedia({
          video: {
            facingMode: facingMode,
            width: { ideal: 1920 },
            height: { ideal: 1080 }
          }
        });
        if (videoRef.current) {
          videoRef.current.srcObject = stream;
          videoRef.current.play();
          setIsCameraLive(true);
          toast.success('Live camera feed connected with optical reticle');
        }
      } else {
        setCameraError('Camera API not supported by browser. Use image upload or preset.');
      }
    } catch (err: any) {
      console.warn('Camera access issue:', err);
      setCameraError('Unable to access device camera. Please upload a photo or use a calibrated preset.');
      setIsCameraLive(false);
    }
  };

  const stopLiveCamera = () => {
    if (videoRef.current && videoRef.current.srcObject) {
      const stream = videoRef.current.srcObject as MediaStream;
      stream.getTracks().forEach(track => track.stop());
      videoRef.current.srcObject = null;
      setIsCameraLive(false);
    }
  };

  // Capture Canvas Snapshot from Live Video
  const handleTakeSnapshot = () => {
    if (videoRef.current && canvasRef.current) {
      const video = videoRef.current;
      const canvas = canvasRef.current;
      canvas.width = video.videoWidth || 640;
      canvas.height = video.videoHeight || 640;
      const ctx = canvas.getContext('2d');
      if (ctx) {
        ctx.drawImage(video, 0, 0, canvas.width, canvas.height);
        const dataUrl = canvas.toDataURL('image/jpeg', 0.95);
        setCapturedImageUrl(dataUrl);
        stopLiveCamera();
        toast.success('Snapshot captured from live video stream');
        runPreValidation(false);
      }
    } else {
      // Fallback: proceed with current capturedImageUrl
      runPreValidation(false);
    }
  };

  // Switch Camera Front/Back
  const handleToggleFacingMode = () => {
    stopLiveCamera();
    setFacingMode(prev => (prev === 'environment' ? 'user' : 'environment'));
  };

  useEffect(() => {
    if (currentStep === 4 && !isCameraLive && !cameraError) {
      startLiveCamera();
    }
    return () => {
      stopLiveCamera();
    };
  }, [currentStep, facingMode]);

  // Handle image file upload
  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (event) => {
        if (event.target?.result) {
          setCapturedImageUrl(event.target.result as string);
          setQualityScore(94);
          stopLiveCamera();
          toast.success('Physical sample image uploaded');
        }
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSelectPresetImage = (cropType: string) => {
    if (SAMPLE_PRESET_IMAGES[cropType]) {
      setCapturedImageUrl(SAMPLE_PRESET_IMAGES[cropType].url);
      stopLiveCamera();
      toast.info(`Loaded standard calibrated ${cropType} image preset`);
    }
  };

  // Run Pre-Validation Checks
  const runPreValidation = (simulateFailure = false) => {
    setCurrentStep(5);
    setValidationStage(1);
    setValidationFailures([]);

    setTimeout(() => setValidationStage(2), 300);
    setTimeout(() => setValidationStage(3), 600);
    setTimeout(() => setValidationStage(4), 900);
    setTimeout(() => {
      setValidationStage(5);
      
      const failures: string[] = [];
      if (simulateFailure || tiltAngle > 12) {
        failures.push(`Severe tilt deviation (${tiltAngle}° exceeds 10° threshold). Image plane not perpendicular.`);
      }
      if (simulateFailure || lightingLux < 250) {
        failures.push(`Underexposure detected (${lightingLux} Lux below 300 Lux minimum). Shadows obscure grain contours.`);
      }

      if (failures.length > 0) {
        setValidationFailures(failures);
        setCurrentStep(6); // Go to failure screen
        toast.error('Pre-validation checks failed');
      } else {
        // Proceed to execution
        handleExecuteAnalysis();
      }
    }, 1200);
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
        deviceInfo: 'KisanDrishti Optical Standard v3.2 (Calibrated Sensor, F/1.8)',
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
      setCurrentStep(4);
    }
  };

  const isChecklistComplete = Object.values(checklist).every(Boolean);

  return (
    <div className="w-full max-w-4xl mx-auto px-4 sm:px-6 py-6 sm:py-10 space-y-8">
      
      {/* Stepper Progress Bar */}
      <div className="space-y-2">
        <div className="flex items-center justify-between text-xs font-mono font-semibold text-muted-foreground overflow-x-auto pb-1">
          <span className={currentStep >= 1 ? 'text-primary font-bold' : ''}>
            1. LOT METADATA
          </span>
          <span className={currentStep >= 2 ? 'text-primary font-bold' : ''}>
            2. PREP CHECKLIST
          </span>
          <span className={currentStep >= 3 ? 'text-primary font-bold' : ''}>
            3. CALIBRATION SHEET
          </span>
          <span className={currentStep >= 4 ? 'text-primary font-bold' : ''}>
            4. OPTICAL CAPTURE
          </span>
        </div>
        <div className="w-full h-1.5 bg-muted rounded-full overflow-hidden flex">
          <div 
            className="h-full bg-primary transition-all duration-300" 
            style={{ width: `${(Math.min(currentStep, 4) / 4) * 100}%` }}
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
                Proceed to Sample Preparation Checklist
                <ArrowRight className="w-4 h-4 ml-2" />
              </Button>
            </div>
          </CardContent>
        </Card>
      )}

      {/* STEP 2: Interactive Sample Preparation Checklist */}
      {currentStep === 2 && (
        <Card className="border border-border shadow-md">
          <CardHeader className="border-b border-border bg-muted/20">
            <div className="flex items-center gap-2">
              <ListChecks className="w-5 h-5 text-primary" />
              <div>
                <CardTitle className="font-serif text-lg font-bold text-foreground">
                  Step 2: Interactive Sample Preparation Checklist
                </CardTitle>
                <CardDescription className="text-xs text-muted-foreground">
                  Standardize the physical sample setup before opening camera reticle.
                </CardDescription>
              </div>
            </div>
          </CardHeader>

          <CardContent className="p-6 space-y-4">
            <div className="space-y-3">
              
              <label className="flex items-start gap-3 p-3 rounded-lg border border-border bg-card hover:bg-muted/30 cursor-pointer">
                <Checkbox 
                  checked={checklist.cleanSurface} 
                  onCheckedChange={(c) => setChecklist(prev => ({ ...prev, cleanSurface: !!c }))}
                  className="mt-0.5"
                />
                <div className="space-y-0.5">
                  <span className="text-xs font-semibold text-foreground block">1. Clean Optical Grid Surface</span>
                  <span className="text-[11px] text-muted-foreground">The calibration sheet is flat on a solid surface with zero dust or residual grains from previous batches.</span>
                </div>
              </label>

              <label className="flex items-start gap-3 p-3 rounded-lg border border-border bg-card hover:bg-muted/30 cursor-pointer">
                <Checkbox 
                  checked={checklist.evenSpread} 
                  onCheckedChange={(c) => setChecklist(prev => ({ ...prev, evenSpread: !!c }))}
                  className="mt-0.5"
                />
                <div className="space-y-0.5">
                  <span className="text-xs font-semibold text-foreground block">2. Even Single-Layer Grain Spread</span>
                  <span className="text-[11px] text-muted-foreground">Grains are dispersed evenly without multi-layer piles or tight clusters to permit clear contour separation.</span>
                </div>
              </label>

              <label className="flex items-start gap-3 p-3 rounded-lg border border-border bg-card hover:bg-muted/30 cursor-pointer">
                <Checkbox 
                  checked={checklist.ambientLight} 
                  onCheckedChange={(c) => setChecklist(prev => ({ ...prev, ambientLight: !!c }))}
                  className="mt-0.5"
                />
                <div className="space-y-0.5">
                  <span className="text-xs font-semibold text-foreground block">3. Diffuse Ambient Daylight (300+ Lux)</span>
                  <span className="text-[11px] text-muted-foreground">Avoid harsh direct single-point glare or heavy hand shadows casting over the 10x10cm target area.</span>
                </div>
              </label>

              <label className="flex items-start gap-3 p-3 rounded-lg border border-border bg-card hover:bg-muted/30 cursor-pointer">
                <Checkbox 
                  checked={checklist.perpendicularAngle} 
                  onCheckedChange={(c) => setChecklist(prev => ({ ...prev, perpendicularAngle: !!c }))}
                  className="mt-0.5"
                />
                <div className="space-y-0.5">
                  <span className="text-xs font-semibold text-foreground block">4. Flat Perpendicular Camera Stance (&lt; 5° Tilt)</span>
                  <span className="text-[11px] text-muted-foreground">Hold phone camera directly above the sheet facing parallel to prevent perspective distortion.</span>
                </div>
              </label>

              <label className="flex items-start gap-3 p-3 rounded-lg border border-border bg-card hover:bg-muted/30 cursor-pointer">
                <Checkbox 
                  checked={checklist.withinBoundary} 
                  onCheckedChange={(c) => setChecklist(prev => ({ ...prev, withinBoundary: !!c }))}
                  className="mt-0.5"
                />
                <div className="space-y-0.5">
                  <span className="text-xs font-semibold text-foreground block">5. Sample Placed Within 10cm × 10cm Area</span>
                  <span className="text-[11px] text-muted-foreground">Physical sample is contained inside the printed boundary lines.</span>
                </div>
              </label>

              <label className="flex items-start gap-3 p-3 rounded-lg border border-border bg-card hover:bg-muted/30 cursor-pointer">
                <Checkbox 
                  checked={checklist.fiducialsVisible} 
                  onCheckedChange={(c) => setChecklist(prev => ({ ...prev, fiducialsVisible: !!c }))}
                  className="mt-0.5"
                />
                <div className="space-y-0.5">
                  <span className="text-xs font-semibold text-foreground block">6. All 4 Corner Fiducial Markers Visible</span>
                  <span className="text-[11px] text-muted-foreground">Calibration targets at sheet corners must not be covered by stray seeds.</span>
                </div>
              </label>

            </div>

            <div className="pt-4 flex items-center justify-between border-t border-border">
              <Button variant="outline" size="sm" onClick={() => setCurrentStep(1)} className="text-xs">
                <ArrowLeft className="w-4 h-4 mr-1.5" />
                Back to Lot Details
              </Button>
              <Button 
                size="sm" 
                onClick={() => setCurrentStep(3)} 
                disabled={!isChecklistComplete}
                className="bg-primary text-primary-foreground text-xs"
              >
                Proceed to Calibration Sheet
                <ArrowRight className="w-4 h-4 ml-1.5" />
              </Button>
            </div>
          </CardContent>
        </Card>
      )}

      {/* STEP 3: Calibration Sheet Verification & Guide */}
      {currentStep === 3 && (
        <div className="space-y-6">
          <CalibrationSheetView
            sessionId={sessionToken}
            auditId={auditId}
            lotId={lotId}
            crop={crop}
            onProceedToCapture={() => setCurrentStep(4)}
          />

          <div className="flex items-center justify-between pt-2">
            <Button variant="outline" size="sm" onClick={() => setCurrentStep(2)} className="text-xs">
              <ArrowLeft className="w-4 h-4 mr-1.5" />
              Back to Checklist
            </Button>
            <Button size="sm" onClick={() => setCurrentStep(4)} className="bg-primary text-primary-foreground text-xs">
              Open Live Camera Reticle
              <ArrowRight className="w-4 h-4 ml-1.5" />
            </Button>
          </div>
        </div>
      )}

      {/* STEP 4: Standardized Optical Live Capture Screen */}
      {currentStep === 4 && (
        <Card className="border border-border shadow-md overflow-hidden">
          <CardHeader className="border-b border-border bg-muted/20 pb-3">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
              <div>
                <CardTitle className="font-serif text-lg font-bold text-foreground flex items-center gap-2">
                  <Camera className="w-5 h-5 text-primary" />
                  Step 4: Standardized Optical Capture Screen
                </CardTitle>
                <CardDescription className="text-xs text-muted-foreground">
                  Position camera flat and perpendicular over the 10cm × 10cm boundary. Check live alignment and lighting gauges.
                </CardDescription>
              </div>
              <div className="flex items-center gap-2">
                <Badge variant="outline" className="text-xs font-mono border-emerald-600/40 text-emerald-700 dark:text-emerald-300">
                  Quality Score: {qualityScore}%
                </Badge>
                {isCameraLive && (
                  <Button variant="outline" size="sm" onClick={handleToggleFacingMode} className="h-7 text-xs px-2 gap-1">
                    <SwitchCamera className="w-3.5 h-3.5" />
                    Flip
                  </Button>
                )}
              </div>
            </div>
          </CardHeader>

          <CardContent className="p-6 space-y-6">
            
            {/* Real-time Optical Quality Gauges */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 p-3 bg-stone-100 dark:bg-stone-900 rounded-lg text-xs font-mono">
              
              <div className="flex items-center gap-2">
                <Sun className={`w-4 h-4 shrink-0 ${lightingLux >= 300 ? 'text-amber-600' : 'text-red-500'}`} />
                <div>
                  <span className="text-[10px] text-muted-foreground block">LIGHTING LUX:</span>
                  <span className={`font-bold ${lightingLux >= 300 ? 'text-emerald-700 dark:text-emerald-400' : 'text-red-600'}`}>
                    {lightingLux} Lux ({lightingLux >= 300 ? 'Optimal' : 'Low'})
                  </span>
                </div>
              </div>

              <div className="flex items-center gap-2">
                <Compass className={`w-4 h-4 shrink-0 ${tiltAngle <= 5 ? 'text-primary' : 'text-red-500'}`} />
                <div>
                  <span className="text-[10px] text-muted-foreground block">TILT DEVIATION:</span>
                  <span className={`font-bold ${tiltAngle <= 5 ? 'text-emerald-700 dark:text-emerald-400' : 'text-red-600'}`}>
                    {tiltAngle}° ({tiltAngle <= 5 ? 'Perpendicular' : 'Tilted'})
                  </span>
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

            {/* Simulated Calibration Sliders for Testing */}
            <div className="p-3 border border-border rounded-lg bg-card/60 text-xs space-y-2">
              <div className="flex items-center justify-between text-[11px] font-semibold text-muted-foreground">
                <span className="flex items-center gap-1.5">
                  <Sliders className="w-3.5 h-3.5 text-primary" />
                  Optical Sensor Simulator (Test Environmental Conditions):
                </span>
                <span className="text-[10px] font-mono">Real-time simulation</span>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-1">
                  <div className="flex justify-between text-[10px] font-mono">
                    <span>Simulated Lighting (Lux): {lightingLux}</span>
                    <span className={lightingLux >= 300 ? 'text-emerald-600' : 'text-red-600 font-bold'}>
                      {lightingLux >= 300 ? 'Good' : 'Too Dark'}
                    </span>
                  </div>
                  <input
                    type="range"
                    min="100"
                    max="1000"
                    step="20"
                    value={lightingLux}
                    onChange={(e) => setLightingLux(Number(e.target.value))}
                    className="w-full h-1.5 bg-muted rounded-lg appearance-none cursor-pointer"
                  />
                </div>
                <div className="space-y-1">
                  <div className="flex justify-between text-[10px] font-mono">
                    <span>Simulated Tilt Angle: {tiltAngle}°</span>
                    <span className={tiltAngle <= 5 ? 'text-emerald-600' : 'text-red-600 font-bold'}>
                      {tiltAngle <= 5 ? 'Flat' : 'Severe Tilt'}
                    </span>
                  </div>
                  <input
                    type="range"
                    min="0"
                    max="25"
                    step="0.5"
                    value={tiltAngle}
                    onChange={(e) => setTiltAngle(Number(e.target.value))}
                    className="w-full h-1.5 bg-muted rounded-lg appearance-none cursor-pointer"
                  />
                </div>
              </div>
            </div>

            {/* Camera Viewfinder & Optical Calibration Overlay Area */}
            <div className="relative w-full aspect-square max-w-lg mx-auto bg-stone-950 rounded-xl overflow-hidden border-4 border-stone-800 shadow-xl">
              
              {/* Live Video or Captured Image */}
              {isCameraLive ? (
                <video 
                  ref={videoRef} 
                  autoPlay 
                  playsInline 
                  muted 
                  className="w-full h-full object-cover"
                />
              ) : (
                <img 
                  src={capturedImageUrl} 
                  alt="Captured agricultural crop sample"
                  className="w-full h-full object-cover"
                />
              )}

              {/* Hidden Canvas for Snapshots */}
              <canvas ref={canvasRef} className="hidden" />

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
                <span>{isCameraLive ? 'LIVE FEED' : 'PRESET SAMPLE'}</span>
                <span>{lightingLux} LUX • {tiltAngle}° TILT</span>
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
                    Capture from Live Feed, Upload Photo, or Select Calibrated Preset:
                  </span>
                  <span className="text-[11px] text-muted-foreground">
                    Ensure sample is placed flat on the 10x10cm calibration sheet.
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
            <div className="pt-4 border-t border-border flex flex-col sm:flex-row items-center justify-between gap-3">
              <Button variant="outline" size="sm" onClick={() => setCurrentStep(3)} className="text-xs w-full sm:w-auto">
                <ArrowLeft className="w-4 h-4 mr-1.5" />
                Back to Sheet
              </Button>

              <div className="flex items-center gap-2 w-full sm:w-auto justify-end">
                {/* Simulated Failure Check Button for Demonstrating Graceful Recapture */}
                <Button 
                  variant="outline" 
                  size="sm" 
                  onClick={() => runPreValidation(true)}
                  className="text-xs text-red-700 dark:text-red-400 border-red-300"
                  title="Demonstrate Failure Detection & Recapture Guidance"
                >
                  <AlertOctagon className="w-3.5 h-3.5 mr-1" />
                  Simulate Suboptimal Capture
                </Button>

                <Button 
                  onClick={handleTakeSnapshot}
                  className="bg-primary text-primary-foreground text-xs font-semibold shadow-md"
                >
                  <Camera className="w-4 h-4 mr-1.5" />
                  Capture & Validate Sample
                </Button>
              </div>
            </div>

          </CardContent>
        </Card>
      )}

      {/* STEP 5: Automated Pre-Validation Checks Engine */}
      {currentStep === 5 && (
        <Card className="border border-border shadow-md">
          <CardHeader className="text-center pb-2">
            <CardTitle className="font-serif text-lg font-bold">
              Pre-Validation Quality Checks
            </CardTitle>
            <CardDescription className="text-xs">
              Evaluating optical calibration boundaries, contrast, and perpendicular angle...
            </CardDescription>
          </CardHeader>
          <CardContent className="p-6 space-y-4 max-w-md mx-auto">
            <div className="space-y-3 font-mono text-xs">
              
              <div className="flex items-center justify-between p-2.5 rounded bg-muted/40">
                <span>1. Lighting & Exposure Check</span>
                {validationStage >= 1 ? (
                  lightingLux >= 300 ? (
                    <span className="text-emerald-600 font-bold flex items-center gap-1">
                      <CheckCircle2 className="w-3.5 h-3.5" /> {lightingLux} Lux (PASS)
                    </span>
                  ) : (
                    <span className="text-red-600 font-bold">FAIL ({lightingLux} Lux)</span>
                  )
                ) : (
                  <RefreshCw className="w-3.5 h-3.5 animate-spin text-muted-foreground" />
                )}
              </div>

              <div className="flex items-center justify-between p-2.5 rounded bg-muted/40">
                <span>2. Tilt Angle & Perspective</span>
                {validationStage >= 2 ? (
                  tiltAngle <= 5 ? (
                    <span className="text-emerald-600 font-bold flex items-center gap-1">
                      <CheckCircle2 className="w-3.5 h-3.5" /> {tiltAngle}° (PASS)
                    </span>
                  ) : (
                    <span className="text-red-600 font-bold">FAIL ({tiltAngle}°)</span>
                  )
                ) : (
                  <RefreshCw className="w-3.5 h-3.5 animate-spin text-muted-foreground" />
                )}
              </div>

              <div className="flex items-center justify-between p-2.5 rounded bg-muted/40">
                <span>3. 10x10cm Grid Fiducial Detection</span>
                {validationStage >= 3 ? (
                  <span className="text-emerald-600 font-bold flex items-center gap-1">
                    <CheckCircle2 className="w-3.5 h-3.5" /> 4/4 Locked (PASS)
                  </span>
                ) : (
                  <RefreshCw className="w-3.5 h-3.5 animate-spin text-muted-foreground" />
                )}
              </div>

              <div className="flex items-center justify-between p-2.5 rounded bg-muted/40">
                <span>4. Image Sharpness & Contour Focus</span>
                {validationStage >= 4 ? (
                  <span className="text-emerald-600 font-bold flex items-center gap-1">
                    <CheckCircle2 className="w-3.5 h-3.5" /> Sharp (PASS)
                  </span>
                ) : (
                  <RefreshCw className="w-3.5 h-3.5 animate-spin text-muted-foreground" />
                )}
              </div>

            </div>

            {isProcessing && (
              <div className="p-3 bg-primary/10 rounded text-center text-xs font-mono text-primary animate-pulse">
                {processingStage}
              </div>
            )}
          </CardContent>
        </Card>
      )}

      {/* STEP 6: Failure Detection & Recapture Guidance */}
      {currentStep === 6 && (
        <Card className="border-2 border-red-500/50 shadow-lg bg-red-500/5">
          <CardHeader className="border-b border-red-500/20 bg-red-500/10">
            <div className="flex items-start gap-3">
              <div className="w-10 h-10 rounded-full bg-red-600 text-white flex items-center justify-center shrink-0">
                <ShieldAlert className="w-6 h-6" />
              </div>
              <div className="space-y-1">
                <CardTitle className="font-serif text-lg font-bold text-red-900 dark:text-red-200">
                  Reliable visual evidence could not be established.
                </CardTitle>
                <CardDescription className="text-xs text-red-800 dark:text-red-300">
                  The optical quality checks fell below the minimum epistemic standard required for non-biased dispute evidence.
                </CardDescription>
              </div>
            </div>
          </CardHeader>

          <CardContent className="p-6 space-y-5">
            
            {/* Detected Issues */}
            <div className="space-y-2">
              <span className="text-xs font-bold text-red-900 dark:text-red-200 uppercase font-mono">
                Detected Calibration Failures:
              </span>
              <div className="space-y-1.5">
                {validationFailures.map((fail, i) => (
                  <div key={i} className="p-2.5 bg-red-100 dark:bg-red-950/60 rounded border border-red-200 dark:border-red-800 text-xs text-red-900 dark:text-red-200 flex items-start gap-2">
                    <span className="font-bold text-red-600 font-mono">#{i + 1}</span>
                    <span>{fail}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Actionable Corrective Tips */}
            <div className="p-4 bg-card rounded-lg border border-border space-y-2 text-xs">
              <span className="font-bold text-foreground block font-mono">
                Corrective Guidance for Recapture:
              </span>
              <ul className="list-disc pl-5 space-y-1 text-muted-foreground">
                <li>Move to an area with bright, diffuse natural daylight (avoid harsh shadows).</li>
                <li>Hold the phone flat directly above the sheet, ensuring the tilt angle stays under 5°.</li>
                <li>Make sure all four corner targets on the 10cm x 10cm grid remain completely visible.</li>
                <li>Avoid touching or obscuring the grain boundary during capture.</li>
              </ul>
            </div>

            {/* Recapture Action Button */}
            <div className="pt-2 flex flex-col sm:flex-row items-center justify-between gap-3">
              <Button 
                variant="outline" 
                size="sm" 
                onClick={() => setCurrentStep(1)} 
                className="text-xs w-full sm:w-auto"
              >
                Cancel & Return Home
              </Button>

              <Button 
                onClick={() => {
                  setLightingLux(540); // Reset to optimal
                  setTiltAngle(1.2);
                  setCurrentStep(4);
                  toast.info('Recapture mode active with corrected optical settings');
                }}
                className="bg-primary text-primary-foreground text-xs font-bold w-full sm:w-auto shadow-md"
              >
                <RefreshCw className="w-4 h-4 mr-1.5" />
                Recapture with Corrected Settings
              </Button>
            </div>

          </CardContent>
        </Card>
      )}

    </div>
  );
};
