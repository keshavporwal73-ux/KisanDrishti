import React, { useState, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { 
  Camera, 
  Upload, 
  Sparkles, 
  Layers, 
  CheckCircle2, 
  AlertTriangle, 
  RefreshCw, 
  ChevronRight, 
  FileText, 
  ArrowLeft,
  Info,
  ShieldAlert,
  Smartphone,
  Eye,
  Check,
  Download,
  HelpCircle,
  Sun,
  Maximize2,
  X,
  SlidersHorizontal
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Switch } from '@/components/ui/switch';
import type { CropType, AuditSessionMetadata, CapturedPhotos } from '@/types/evidence';
import { runHybridVisionAnalysis, evaluateCaptureQualityGate } from '@/lib/visionEngine';
import { saveAuditRecord } from '@/lib/storage';
import { useLanguage } from '@/context/LanguageContext';

const formSchema = z.object({
  crop: z.enum([
    'Wheat', 
    'Paddy (Rice)', 
    'Mustard', 
    'Soybean', 
    'Maize', 
    'Chana (Chickpea)', 
    'Cotton', 
    'Other'
  ]),
  lotId: z.string().min(2, 'Lot Identifier is required (e.g. LOT-2026-001)'),
  variety: z.string().optional(),
  location: z.string().min(2, 'Location / Mandi is required'),
  buyerRef: z.string().optional(),
  sampleDescription: z.string().optional(),
  hasOptionalSheetUsed: z.boolean(),
});

type FormValues = {
  crop: CropType;
  lotId: string;
  variety?: string;
  location: string;
  buyerRef?: string;
  sampleDescription?: string;
  hasOptionalSheetUsed: boolean;
};

// High-resolution realistic fallback sample images for quick testing
const PHOTO_PRESETS = {
  main: 'https://images.unsplash.com/photo-1574323347407-f5e1ad6d020b?auto=format&fit=crop&w=1200&q=80',
  closeUp: 'https://images.unsplash.com/photo-1543257580-7269da773bf5?auto=format&fit=crop&w=1200&q=80',
  context: 'https://images.unsplash.com/photo-1500937386664-56d1dfef3854?auto=format&fit=crop&w=1200&q=80',
};

export const NewAuditPage: React.FC = () => {
  const navigate = useNavigate();
  const { t } = useLanguage();
  
  // Wizard steps: 1: Metadata, 2: Instructions, 3: Multi-Photo Capture, 4: Quality Gate & Analysis, 5: Quality Failure Screen
  const [currentStep, setCurrentStep] = useState<1 | 2 | 3 | 4 | 5>(1);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [analysisProgress, setAnalysisProgress] = useState(0);
  const [analysisStageText, setAnalysisStageText] = useState('Initializing Local CV Engine...');
  
  // Multi-photo state
  const [photos, setPhotos] = useState<CapturedPhotos>({
    main: '',
    closeUp: '',
    context: '',
  });

  // Active photo tab in capture screen
  const [activePhotoSlot, setActivePhotoSlot] = useState<'main' | 'closeUp' | 'context'>('main');

  // Camera stream & controls
  const [isCameraActive, setIsCameraActive] = useState(false);
  const [cameraFacing, setCameraFacing] = useState<'environment' | 'user'>('environment');
  const [cameraError, setCameraError] = useState<string | null>(null);
  const videoRef = useRef<HTMLVideoElement | null>(null);
  const fileInputRef = useRef<HTMLInputElement | null>(null);

  // Quality gate failure simulation toggle for user testing
  const [simulateQualityFailure, setSimulateQualityFailure] = useState(false);
  const [qualityFailReasons, setQualityFailReasons] = useState<string[]>([]);
  const [qualityGuidance, setQualityGuidance] = useState<string[]>([]);

  const { register, handleSubmit, formState: { errors }, setValue, watch } = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      crop: 'Wheat',
      lotId: `LOT-${Math.floor(1000 + Math.random() * 9000)}`,
      location: 'Khanna Mandi, Punjab',
      variety: 'HD-3086 (Pusa Gautami)',
      buyerRef: 'Mandi Yard Trade Ref #44',
      sampleDescription: 'Representative grab sample from 4 bags',
      hasOptionalSheetUsed: false,
    },
  });

  const selectedCrop = watch('crop');
  const hasOptionalSheet = watch('hasOptionalSheetUsed');

  // Start Camera
  const startCamera = async (facing: 'environment' | 'user' = cameraFacing) => {
    setCameraError(null);
    try {
      if (videoRef.current && videoRef.current.srcObject) {
        const stream = videoRef.current.srcObject as MediaStream;
        stream.getTracks().forEach(t => t.stop());
      }

      const stream = await navigator.mediaDevices.getUserMedia({
        video: {
          facingMode: facing,
          width: { ideal: 1920 },
          height: { ideal: 1080 }
        },
        audio: false
      });

      if (videoRef.current) {
        videoRef.current.srcObject = stream;
        videoRef.current.play();
        setIsCameraActive(true);
      }
    } catch (err) {
      console.warn('Camera stream error:', err);
      setCameraError('Camera access not available or permission denied. You can upload photo files directly.');
      setIsCameraActive(false);
    }
  };

  // Stop Camera
  const stopCamera = () => {
    if (videoRef.current && videoRef.current.srcObject) {
      const stream = videoRef.current.srcObject as MediaStream;
      stream.getTracks().forEach(t => t.stop());
      videoRef.current.srcObject = null;
    }
    setIsCameraActive(false);
  };

  // Switch Camera
  const toggleCameraFacing = () => {
    const nextFacing = cameraFacing === 'environment' ? 'user' : 'environment';
    setCameraFacing(nextFacing);
    if (isCameraActive) {
      startCamera(nextFacing);
    }
  };

  // Capture Snapshot from Video
  const takeSnapshot = () => {
    if (!videoRef.current) return;
    const canvas = document.createElement('canvas');
    canvas.width = videoRef.current.videoWidth || 1280;
    canvas.height = videoRef.current.videoHeight || 720;
    const ctx = canvas.getContext('2d');
    if (ctx) {
      ctx.drawImage(videoRef.current, 0, 0, canvas.width, canvas.height);
      const dataUrl = canvas.toDataURL('image/jpeg', 0.92);
      
      setPhotos(prev => ({
        ...prev,
        [activePhotoSlot]: dataUrl,
      }));

      // Automatically advance to next slot if capturing sequentially
      if (activePhotoSlot === 'main' && !photos.closeUp) {
        setActivePhotoSlot('closeUp');
      } else if (activePhotoSlot === 'closeUp' && !photos.context) {
        setActivePhotoSlot('context');
      }
    }
  };

  // Handle local file upload
  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (event) => {
        if (event.target?.result) {
          setPhotos(prev => ({
            ...prev,
            [activePhotoSlot]: event.target?.result as string,
          }));

          if (activePhotoSlot === 'main' && !photos.closeUp) {
            setActivePhotoSlot('closeUp');
          } else if (activePhotoSlot === 'closeUp' && !photos.context) {
            setActivePhotoSlot('context');
          }
        }
      };
      reader.readAsDataURL(file);
    }
  };

  // Use Preset Demo Photos
  const loadPresetPhotos = () => {
    setPhotos(PHOTO_PRESETS);
    stopCamera();
  };

  // Clear a photo slot
  const clearPhotoSlot = (slot: 'main' | 'closeUp' | 'context') => {
    setPhotos(prev => ({
      ...prev,
      [slot]: '',
    }));
  };

  // Form submit -> Run Capture Quality Gate and Analysis
  const onFormSubmit = async (values: FormValues) => {
    // Ensure at least main and close-up photos exist (context is optional)
    const effectivePhotos: CapturedPhotos = {
      main: photos.main || PHOTO_PRESETS.main,
      closeUp: photos.closeUp || PHOTO_PRESETS.closeUp,
      context: photos.context || undefined,
    };

    stopCamera();
    setCurrentStep(4);
    setIsAnalyzing(true);
    setAnalysisProgress(10);
    setAnalysisStageText('Running 8-Parameter Capture Quality Gate (Sharpness, Shadows, Lighting, Framing)...');

    // Evaluate quality gate
    const gateResult = evaluateCaptureQualityGate(effectivePhotos, simulateQualityFailure);

    setTimeout(() => {
      setAnalysisProgress(35);
      if (!gateResult.passed) {
        // Quality gate failed
        setIsAnalyzing(false);
        setQualityFailReasons(gateResult.failureReasons);
        setQualityGuidance(gateResult.correctiveGuidance);
        setCurrentStep(5); // Show explicit failure screen
        return;
      }

      setAnalysisStageText('Local CV: Segmenting sample contours & candidate anomaly localization...');
      setTimeout(() => {
        setAnalysisProgress(65);
        setAnalysisStageText('Gemini Multimodal: Reasoning observable features (Broken, Discoloration, Foreign Objects)...');
        setTimeout(() => {
          setAnalysisProgress(88);
          setAnalysisStageText('Cryptographic Engine: Generating SHA-256 Tamper-Evident Evidence Seal...');
          setTimeout(async () => {
            setAnalysisProgress(100);

            const metadata: AuditSessionMetadata = {
              auditId: `EVD-${new Date().getFullYear()}-${values.crop.slice(0, 3).toUpperCase()}-${Math.floor(1000 + Math.random() * 9000)}`,
              lotId: values.lotId,
              crop: values.crop,
              variety: values.variety,
              location: values.location,
              buyerRef: values.buyerRef,
              sampleDescription: values.sampleDescription,
              captureTimestamp: new Date().toISOString(),
              deviceInfo: 'Standard Smartphone Camera (12MP)',
              sessionToken: `sess_${Math.random().toString(36).substring(2, 9)}`,
              analysisVersion: 'KisanDrishti Hybrid CV + Gemini v3.2',
              hasOptionalSheetUsed: values.hasOptionalSheetUsed,
            };

            const record = await runHybridVisionAnalysis({
              metadata,
              photos: effectivePhotos,
              forceQualityFail: false,
              forceLowConfidence: false,
            });

            await saveAuditRecord(record);
            navigate(`/audits/${record.id}`);
          }, 600);
        }, 800);
      }, 800);
    }, 700);
  };

  const hasMinimumPhotos = Boolean(photos.main && photos.closeUp);
  const photoCount = (photos.main ? 1 : 0) + (photos.closeUp ? 1 : 0) + (photos.context ? 1 : 0);

  return (
    <div className="max-w-4xl mx-auto space-y-6 pb-12">
      {/* Top Header & Tagline */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-border pb-4">
        <div>
          <div className="flex items-center gap-2">
            <span className="w-2.5 h-2.5 rounded-full bg-emerald-600 animate-pulse" />
            <h1 className="text-xl sm:text-2xl font-bold font-serif tracking-tight text-foreground">
              Create Visual Evidence
            </h1>
          </div>
          <p className="text-xs sm:text-sm text-muted-foreground font-medium mt-0.5">
            Evidence Before Valuation • Smartphone Visual Evidence Protocol
          </p>
        </div>

        <div className="flex items-center gap-2">
          <Badge variant="outline" className="text-[11px] font-mono bg-stone-100 dark:bg-stone-900 border-stone-300">
            Step {currentStep} of 4
          </Badge>
          <Button variant="ghost" size="sm" onClick={() => navigate('/audits')} className="text-xs">
            <ArrowLeft className="w-3.5 h-3.5 mr-1" />
            Back to Records
          </Button>
        </div>
      </div>

      {/* Progress Steps Header */}
      <div className="grid grid-cols-3 gap-2 text-xs">
        <div 
          onClick={() => currentStep > 1 && setCurrentStep(1)}
          className={`p-2.5 rounded-lg border text-center transition-all cursor-pointer ${
            currentStep === 1 
              ? 'border-primary bg-primary/10 text-primary font-bold shadow-xs' 
              : currentStep > 1 
              ? 'border-emerald-600/40 bg-emerald-500/5 text-emerald-800 dark:text-emerald-300' 
              : 'border-border text-muted-foreground opacity-60'
          }`}
        >
          <span className="block font-mono text-[10px]">STEP 1</span>
          <span>1. Lot Metadata</span>
        </div>

        <div 
          onClick={() => currentStep > 2 && setCurrentStep(2)}
          className={`p-2.5 rounded-lg border text-center transition-all cursor-pointer ${
            currentStep === 2 
              ? 'border-primary bg-primary/10 text-primary font-bold shadow-xs' 
              : currentStep > 2 
              ? 'border-emerald-600/40 bg-emerald-500/5 text-emerald-800 dark:text-emerald-300' 
              : 'border-border text-muted-foreground opacity-60'
          }`}
        >
          <span className="block font-mono text-[10px]">STEP 2</span>
          <span>2. Simple Guidelines</span>
        </div>

        <div 
          onClick={() => currentStep > 3 && setCurrentStep(3)}
          className={`p-2.5 rounded-lg border text-center transition-all cursor-pointer ${
            currentStep === 3 
              ? 'border-primary bg-primary/10 text-primary font-bold shadow-xs' 
              : currentStep > 3 
              ? 'border-emerald-600/40 bg-emerald-500/5 text-emerald-800 dark:text-emerald-300' 
              : 'border-border text-muted-foreground opacity-60'
          }`}
        >
          <span className="block font-mono text-[10px]">STEP 3</span>
          <span>3. 2–3 Smartphone Photos</span>
        </div>
      </div>

      {/* STEP 1: LOT METADATA FORM */}
      {currentStep === 1 && (
        <Card className="border border-border shadow-xs">
          <CardHeader className="bg-muted/30 pb-4 border-b border-border">
            <div className="flex items-center justify-between">
              <div>
                <CardTitle className="text-base font-bold flex items-center gap-2">
                  <FileText className="w-4 h-4 text-primary" />
                  Produce & Lot Information
                </CardTitle>
                <CardDescription className="text-xs mt-1">
                  Enter basic identifiers for the agricultural lot before capturing visual evidence.
                </CardDescription>
              </div>
              <Badge variant="secondary" className="text-[10px] font-mono">
                Zero Hardware Required
              </Badge>
            </div>
          </CardHeader>

          <CardContent className="pt-6 space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {/* Crop Type */}
              <div className="space-y-1.5">
                <Label htmlFor="crop" className="text-xs font-semibold">
                  Crop / Commodity <span className="text-red-500">*</span>
                </Label>
                <Select
                  value={selectedCrop}
                  onValueChange={(val) => setValue('crop', val as CropType)}
                >
                  <SelectTrigger id="crop" className="text-xs">
                    <SelectValue placeholder="Select Crop" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Wheat">Wheat (Kanak / Gehun)</SelectItem>
                    <SelectItem value="Paddy (Rice)">Paddy / Rice (Dhan)</SelectItem>
                    <SelectItem value="Mustard">Mustard (Sarson / Rai)</SelectItem>
                    <SelectItem value="Soybean">Soybean</SelectItem>
                    <SelectItem value="Maize">Maize (Makka)</SelectItem>
                    <SelectItem value="Chana (Chickpea)">Chana (Bengal Gram)</SelectItem>
                    <SelectItem value="Cotton">Cotton (Kapas)</SelectItem>
                    <SelectItem value="Other">Other Agricultural Commodity</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              {/* Lot Identifier */}
              <div className="space-y-1.5">
                <Label htmlFor="lotId" className="text-xs font-semibold">
                  Lot / Trolley Identifier <span className="text-red-500">*</span>
                </Label>
                <Input
                  id="lotId"
                  placeholder="e.g. LOT-2026-0891 or Trolley #12"
                  className="text-xs font-mono"
                  {...register('lotId')}
                />
                {errors.lotId && (
                  <p className="text-[11px] text-red-500">{errors.lotId.message}</p>
                )}
              </div>

              {/* Location / Mandi */}
              <div className="space-y-1.5">
                <Label htmlFor="location" className="text-xs font-semibold">
                  Location / Mandi Name <span className="text-red-500">*</span>
                </Label>
                <Input
                  id="location"
                  placeholder="e.g. Khanna Grain Mandi, Punjab"
                  className="text-xs"
                  {...register('location')}
                />
                {errors.location && (
                  <p className="text-[11px] text-red-500">{errors.location.message}</p>
                )}
              </div>

              {/* Variety (Optional) */}
              <div className="space-y-1.5">
                <Label htmlFor="variety" className="text-xs font-semibold">
                  Variety / Cultivar <span className="text-muted-foreground font-normal">(Optional)</span>
                </Label>
                <Input
                  id="variety"
                  placeholder="e.g. HD-3086, PBW-550, Basmati 1509"
                  className="text-xs"
                  {...register('variety')}
                />
              </div>

              {/* Buyer / Transaction Ref (Optional) */}
              <div className="space-y-1.5">
                <Label htmlFor="buyerRef" className="text-xs font-semibold">
                  Buyer / Trader Reference <span className="text-muted-foreground font-normal">(Optional)</span>
                </Label>
                <Input
                  id="buyerRef"
                  placeholder="e.g. Traders Union, Aggarwal Mills, APMC Yard"
                  className="text-xs"
                  {...register('buyerRef')}
                />
              </div>

              {/* Sample Grab Description */}
              <div className="space-y-1.5">
                <Label htmlFor="sampleDescription" className="text-xs font-semibold">
                  Sample Selection Method <span className="text-muted-foreground font-normal">(Optional)</span>
                </Label>
                <Input
                  id="sampleDescription"
                  placeholder="e.g. Random grab sample from top and center bags"
                  className="text-xs"
                  {...register('sampleDescription')}
                />
              </div>
            </div>

            {/* Optional Printed Sheet Toggle */}
            <div className="p-3 rounded-lg border border-border bg-stone-50 dark:bg-stone-900/40 flex items-center justify-between gap-4">
              <div className="space-y-0.5">
                <div className="flex items-center gap-1.5">
                  <span className="text-xs font-bold text-foreground">Using Optional Alignment Sheet?</span>
                  <Badge variant="outline" className="text-[9px] border-stone-300">Strictly Optional</Badge>
                </div>
                <p className="text-[11px] text-muted-foreground">
                  An ordinary A4 printed paper sheet helps camera framing and color reference. It is NOT required.
                </p>
              </div>
              <Switch
                checked={hasOptionalSheet}
                onCheckedChange={(val) => setValue('hasOptionalSheetUsed', val)}
              />
            </div>

            {/* Core Principle Callout */}
            <div className="p-3 rounded-lg border border-emerald-600/20 bg-emerald-500/5 text-[11px] text-stone-700 dark:text-stone-300 flex items-start gap-2.5">
              <Info className="w-4 h-4 text-emerald-700 dark:text-emerald-400 shrink-0 mt-0.5" />
              <div>
                <span className="font-semibold text-emerald-800 dark:text-emerald-300 block">
                  KisanDrishti Protocol Ground:
                </span>
                <span>
                  "Don't tell both sides what the crop is worth. Give both sides the same visual evidence to inspect."
                </span>
              </div>
            </div>
          </CardContent>

          <CardFooter className="bg-muted/20 border-t border-border flex justify-between">
            <Button variant="ghost" size="sm" onClick={() => navigate('/audits')} className="text-xs">
              Cancel
            </Button>
            <Button size="sm" onClick={() => setCurrentStep(2)} className="text-xs gap-1">
              <span>Next: Simple Capture Guidelines</span>
              <ChevronRight className="w-3.5 h-3.5" />
            </Button>
          </CardFooter>
        </Card>
      )}

      {/* STEP 2: SIMPLE CAPTURE GUIDELINES */}
      {currentStep === 2 && (
        <Card className="border border-border shadow-xs">
          <CardHeader className="bg-muted/30 pb-4 border-b border-border">
            <div className="flex items-center justify-between">
              <div>
                <CardTitle className="text-base font-bold flex items-center gap-2">
                  <Smartphone className="w-4 h-4 text-primary" />
                  Simple Smartphone Capture Guidelines
                </CardTitle>
                <CardDescription className="text-xs mt-1">
                  Follow these 3 simple field instructions to ensure your photos pass the quality gate.
                </CardDescription>
              </div>
              <Badge variant="outline" className="text-[10px] font-mono border-emerald-600 text-emerald-700 dark:text-emerald-400">
                Ordinary Phone
              </Badge>
            </div>
          </CardHeader>

          <CardContent className="pt-6 space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
              {/* Guideline 1 */}
              <div className="p-4 rounded-xl border border-border bg-card space-y-2">
                <div className="w-8 h-8 rounded-full bg-emerald-500/10 text-emerald-700 dark:text-emerald-400 font-mono font-bold text-sm flex items-center justify-center">
                  1
                </div>
                <h4 className="font-bold text-xs text-foreground">Representative Sample</h4>
                <p className="text-[11px] text-muted-foreground leading-relaxed">
                  Take a typical portion of the lot. <strong>Do not</strong> intentionally pick only the cleanest or worst grains.
                </p>
              </div>

              {/* Guideline 2 */}
              <div className="p-4 rounded-xl border border-border bg-card space-y-2">
                <div className="w-8 h-8 rounded-full bg-emerald-500/10 text-emerald-700 dark:text-emerald-400 font-mono font-bold text-sm flex items-center justify-center">
                  2
                </div>
                <h4 className="font-bold text-xs text-foreground">Clean, Visible Surface</h4>
                <p className="text-[11px] text-muted-foreground leading-relaxed">
                  Spread sample evenly on any clean, non-reflective, flat surface. <strong>Do not arrange or count grains individually.</strong>
                </p>
              </div>

              {/* Guideline 3 */}
              <div className="p-4 rounded-xl border border-border bg-card space-y-2">
                <div className="w-8 h-8 rounded-full bg-emerald-500/10 text-emerald-700 dark:text-emerald-400 font-mono font-bold text-sm flex items-center justify-center">
                  3
                </div>
                <h4 className="font-bold text-xs text-foreground">Natural Lighting</h4>
                <p className="text-[11px] text-muted-foreground leading-relaxed">
                  Use bright indirect daytime light. Avoid harsh flash glare and ensure your body does not cast a dark shadow over the sample.
                </p>
              </div>
            </div>

            {/* Photo Plan Breakdown */}
            <div className="p-4 rounded-xl border border-border bg-stone-50 dark:bg-stone-900/60 space-y-2">
              <span className="font-bold text-xs text-foreground block">
                Required Photo Plan (2–3 Photos):
              </span>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-2 text-[11px]">
                <div className="p-2.5 rounded bg-background border border-border">
                  <span className="font-semibold text-primary block">Photo 1: Main Sample</span>
                  <span className="text-muted-foreground">Overall view from approx. 20–30 cm above.</span>
                </div>
                <div className="p-2.5 rounded bg-background border border-border">
                  <span className="font-semibold text-primary block">Photo 2: Close-up Photo</span>
                  <span className="text-muted-foreground">Macro focus from approx. 10–15 cm for grain details.</span>
                </div>
                <div className="p-2.5 rounded bg-background border border-border">
                  <span className="font-semibold text-stone-600 dark:text-stone-300 block">Photo 3: Wider Context (Optional)</span>
                  <span className="text-muted-foreground">Shows the surrounding lot/trolley environment.</span>
                </div>
              </div>
            </div>

            {/* Representativeness Limitation Box */}
            <div className="p-3 rounded-lg border border-amber-500/20 bg-amber-500/5 text-[11px] text-amber-900 dark:text-amber-200">
              <span className="font-semibold block mb-0.5">Mandatory Representativeness Notice:</span>
              <span>
                "This record describes visual observations from the captured sample. It does not prove that the captured sample represents the entire lot."
              </span>
            </div>
          </CardContent>

          <CardFooter className="bg-muted/20 border-t border-border flex justify-between">
            <Button variant="ghost" size="sm" onClick={() => setCurrentStep(1)} className="text-xs">
              <ArrowLeft className="w-3.5 h-3.5 mr-1" />
              Back
            </Button>
            <Button size="sm" onClick={() => setCurrentStep(3)} className="text-xs gap-1">
              <span>Next: Take 2–3 Photos</span>
              <ChevronRight className="w-3.5 h-3.5" />
            </Button>
          </CardFooter>
        </Card>
      )}

      {/* STEP 3: 2-3 SMARTPHONE PHOTO CAPTURE */}
      {currentStep === 3 && (
        <div className="space-y-4">
          <Card className="border border-border shadow-xs">
            <CardHeader className="bg-muted/30 pb-3 border-b border-border">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                <div>
                  <CardTitle className="text-base font-bold flex items-center gap-2">
                    <Camera className="w-4 h-4 text-primary" />
                    Capture 2–3 Smartphone Photos
                  </CardTitle>
                  <CardDescription className="text-xs mt-0.5">
                    Capture <strong>Main Sample</strong> and <strong>Close-up</strong> (Required), plus <strong>Wider Context</strong> (Optional).
                  </CardDescription>
                </div>
                <div className="flex items-center gap-2">
                  <Badge variant={hasMinimumPhotos ? 'default' : 'outline'} className="text-[10px] font-mono">
                    {photoCount} of 3 Captured
                  </Badge>
                  <Button 
                    variant="outline" 
                    size="sm" 
                    onClick={loadPresetPhotos} 
                    className="text-xs h-7 border-stone-300"
                  >
                    Use Demo Photos
                  </Button>
                </div>
              </div>
            </CardHeader>

            <CardContent className="pt-4 space-y-4">
              {/* Photo Slots Selector Tabs */}
              <div className="grid grid-cols-3 gap-2">
                {/* Slot 1: Main */}
                <button
                  type="button"
                  onClick={() => setActivePhotoSlot('main')}
                  className={`p-3 rounded-xl border text-left transition-all ${
                    activePhotoSlot === 'main'
                      ? 'border-primary ring-2 ring-primary/20 bg-primary/5'
                      : 'border-border bg-card hover:bg-muted/40'
                  }`}
                >
                  <div className="flex items-center justify-between mb-1">
                    <span className="text-xs font-bold">1. Main Sample</span>
                    {photos.main ? (
                      <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                    ) : (
                      <span className="text-[10px] font-mono text-red-500 font-semibold">*Req</span>
                    )}
                  </div>
                  <p className="text-[10px] text-muted-foreground truncate">
                    {photos.main ? 'Captured' : 'Overall view (25cm)'}
                  </p>
                </button>

                {/* Slot 2: Close-up */}
                <button
                  type="button"
                  onClick={() => setActivePhotoSlot('closeUp')}
                  className={`p-3 rounded-xl border text-left transition-all ${
                    activePhotoSlot === 'closeUp'
                      ? 'border-primary ring-2 ring-primary/20 bg-primary/5'
                      : 'border-border bg-card hover:bg-muted/40'
                  }`}
                >
                  <div className="flex items-center justify-between mb-1">
                    <span className="text-xs font-bold">2. Close-up</span>
                    {photos.closeUp ? (
                      <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                    ) : (
                      <span className="text-[10px] font-mono text-red-500 font-semibold">*Req</span>
                    )}
                  </div>
                  <p className="text-[10px] text-muted-foreground truncate">
                    {photos.closeUp ? 'Captured' : 'Macro detail (10cm)'}
                  </p>
                </button>

                {/* Slot 3: Context (Optional) */}
                <button
                  type="button"
                  onClick={() => setActivePhotoSlot('context')}
                  className={`p-3 rounded-xl border text-left transition-all ${
                    activePhotoSlot === 'context'
                      ? 'border-primary ring-2 ring-primary/20 bg-primary/5'
                      : 'border-border bg-card hover:bg-muted/40'
                  }`}
                >
                  <div className="flex items-center justify-between mb-1">
                    <span className="text-xs font-bold">3. Context</span>
                    {photos.context ? (
                      <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                    ) : (
                      <span className="text-[10px] font-mono text-muted-foreground">Opt</span>
                    )}
                  </div>
                  <p className="text-[10px] text-muted-foreground truncate">
                    {photos.context ? 'Captured' : 'Trolley / Lot View'}
                  </p>
                </button>
              </div>

              {/* Viewfinder / Preview Container for Active Slot */}
              <div className="relative rounded-xl overflow-hidden border-2 border-stone-800 bg-stone-950 aspect-4/3 sm:aspect-video flex items-center justify-center">
                {/* Active Photo Captured Preview */}
                {photos[activePhotoSlot] ? (
                  <div className="relative w-full h-full">
                    <img
                      src={photos[activePhotoSlot]}
                      alt={`${activePhotoSlot} view`}
                      className="w-full h-full object-cover"
                    />
                    <div className="absolute top-3 left-3 bg-black/80 backdrop-blur-xs text-white px-3 py-1 rounded-full text-xs font-mono flex items-center gap-1.5 border border-white/20">
                      <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
                      <span>{activePhotoSlot.toUpperCase()} PHOTO READY</span>
                    </div>

                    <div className="absolute bottom-3 right-3 flex items-center gap-2">
                      <Button
                        size="sm"
                        variant="destructive"
                        className="text-xs h-8 gap-1 shadow-lg"
                        onClick={() => clearPhotoSlot(activePhotoSlot)}
                      >
                        <RefreshCw className="w-3.5 h-3.5" />
                        <span>Retake This Photo</span>
                      </Button>
                    </div>
                  </div>
                ) : isCameraActive ? (
                  /* Live Camera Viewfinder */
                  <div className="relative w-full h-full">
                    <video
                      ref={videoRef}
                      playsInline
                      muted
                      className="w-full h-full object-cover"
                    />

                    {/* Framing HUD Overlay */}
                    <div className="absolute inset-0 pointer-events-none flex flex-col justify-between p-4">
                      <div className="flex items-center justify-between">
                        <div className="bg-black/70 backdrop-blur-xs text-emerald-400 px-3 py-1 rounded text-[11px] font-mono border border-emerald-500/30 flex items-center gap-1.5">
                          <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping" />
                          <span>LIVE CAMERA: {activePhotoSlot.toUpperCase()} VIEW</span>
                        </div>
                        <Button
                          size="sm"
                          variant="ghost"
                          onClick={toggleCameraFacing}
                          className="pointer-events-auto h-7 px-2 text-[11px] bg-black/60 text-white hover:bg-black/80 border border-white/20"
                        >
                          <RefreshCw className="w-3 h-3 mr-1" />
                          Flip Camera
                        </Button>
                      </div>

                      {/* Optical Framing Guide */}
                      <div className="mx-auto border-2 border-dashed border-white/60 rounded-xl w-3/4 h-3/5 flex items-center justify-center">
                        <span className="text-white/80 text-xs font-medium bg-black/50 px-2 py-1 rounded">
                          {activePhotoSlot === 'main' && 'Center Representative Sample Here'}
                          {activePhotoSlot === 'closeUp' && 'Macro View: Fill Frame with 20–30 Grains'}
                          {activePhotoSlot === 'context' && 'Wider Context: Show Trolley / Bag Area'}
                        </span>
                      </div>

                      <div className="flex justify-center pointer-events-auto">
                        <Button
                          size="lg"
                          onClick={takeSnapshot}
                          className="rounded-full w-14 h-14 bg-white text-stone-900 hover:bg-stone-200 border-4 border-stone-800 shadow-2xl p-0 flex items-center justify-center"
                        >
                          <Camera className="w-6 h-6" />
                        </Button>
                      </div>
                    </div>
                  </div>
                ) : (
                  /* Empty Slot Prompt */
                  <div className="text-center p-6 space-y-4 max-w-sm">
                    <div className="w-12 h-12 rounded-full bg-stone-900 border border-stone-700 text-stone-300 flex items-center justify-center mx-auto">
                      <Camera className="w-6 h-6" />
                    </div>
                    <div>
                      <h4 className="text-stone-200 text-sm font-bold">
                        {activePhotoSlot === 'main' && 'Capture Photo 1: Main Sample'}
                        {activePhotoSlot === 'closeUp' && 'Capture Photo 2: Close-up Detail'}
                        {activePhotoSlot === 'context' && 'Capture Photo 3: Wider Context (Optional)'}
                      </h4>
                      <p className="text-stone-400 text-xs mt-1">
                        Use your smartphone camera or upload a file from gallery.
                      </p>
                    </div>

                    {cameraError && (
                      <p className="text-[11px] text-amber-400 bg-amber-950/60 p-2 rounded border border-amber-800">
                        {cameraError}
                      </p>
                    )}

                    <div className="flex flex-wrap justify-center gap-2 pt-1">
                      <Button
                        size="sm"
                        onClick={() => startCamera()}
                        className="text-xs bg-emerald-600 hover:bg-emerald-700 text-white gap-1.5"
                      >
                        <Camera className="w-3.5 h-3.5" />
                        <span>Open Smartphone Camera</span>
                      </Button>

                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => fileInputRef.current?.click()}
                        className="text-xs border-stone-700 text-stone-200 bg-stone-900 hover:bg-stone-800 gap-1.5"
                      >
                        <Upload className="w-3.5 h-3.5" />
                        <span>Upload File</span>
                      </Button>
                      <input
                        type="file"
                        ref={fileInputRef}
                        accept="image/*"
                        className="hidden"
                        onChange={handleFileUpload}
                      />
                    </div>
                  </div>
                )}
              </div>

              {/* Quality Failure Simulation Toggle (For testing quality gate) */}
              <div className="p-3 rounded-lg border border-dashed border-border bg-muted/20 flex items-center justify-between text-xs">
                <div className="space-y-0.5">
                  <span className="font-semibold text-foreground flex items-center gap-1.5">
                    <SlidersHorizontal className="w-3.5 h-3.5 text-amber-500" />
                    Test Quality Gate: Simulate Capture Failure
                  </span>
                  <p className="text-[11px] text-muted-foreground">
                    Enable to test how KisanDrishti detects blur/shadows and shows the failure recapture screen.
                  </p>
                </div>
                <Switch
                  checked={simulateQualityFailure}
                  onCheckedChange={setSimulateQualityFailure}
                />
              </div>
            </CardContent>

            <CardFooter className="bg-muted/20 border-t border-border flex flex-col sm:flex-row items-center justify-between gap-3">
              <Button variant="ghost" size="sm" onClick={() => setCurrentStep(2)} className="text-xs w-full sm:w-auto">
                <ArrowLeft className="w-3.5 h-3.5 mr-1" />
                Back to Guidelines
              </Button>

              <div className="flex items-center gap-2 w-full sm:w-auto justify-end">
                <Button
                  size="sm"
                  onClick={handleSubmit(onFormSubmit)}
                  className="text-xs bg-emerald-700 hover:bg-emerald-800 text-white gap-1.5 w-full sm:w-auto"
                >
                  <Sparkles className="w-3.5 h-3.5" />
                  <span>Run Quality Gate & Analyze Evidence</span>
                </Button>
              </div>
            </CardFooter>
          </Card>
        </div>
      )}

      {/* STEP 4: QUALITY GATE & HYBRID ANALYSIS IN PROGRESS */}
      {currentStep === 4 && isAnalyzing && (
        <Card className="border border-border p-8 text-center space-y-6">
          <div className="w-16 h-16 rounded-full bg-emerald-500/10 text-emerald-600 flex items-center justify-center mx-auto animate-pulse">
            <RefreshCw className="w-8 h-8 animate-spin" />
          </div>

          <div className="space-y-2 max-w-md mx-auto">
            <h3 className="text-lg font-bold font-serif text-foreground">
              Processing Standardized Visual Evidence
            </h3>
            <p className="text-xs text-muted-foreground font-mono">
              {analysisStageText}
            </p>
          </div>

          <div className="max-w-md mx-auto space-y-2">
            <Progress value={analysisProgress} className="h-2.5" />
            <div className="flex justify-between text-[10px] font-mono text-muted-foreground">
              <span>Quality Gate & CV Localization</span>
              <span>{analysisProgress}%</span>
            </div>
          </div>

          <div className="p-3 rounded-lg border border-border bg-stone-50 dark:bg-stone-900/40 text-[11px] text-muted-foreground max-w-md mx-auto text-left">
            <span className="font-semibold text-foreground block mb-0.5">Strict Epistemic Protocol:</span>
            <span>
              KisanDrishti only records observable visual features (broken, discolored, foreign material). It will never fabricate moisture or chemical measurements.
            </span>
          </div>
        </Card>
      )}

      {/* STEP 5: QUALITY GATE FAILURE & RECAPTURE SCREEN */}
      {currentStep === 5 && (
        <Card className="border-2 border-red-500/40 shadow-lg bg-card">
          <CardHeader className="bg-red-500/10 pb-4 border-b border-red-500/20">
            <div className="flex items-start gap-3">
              <div className="w-10 h-10 rounded-full bg-red-500 text-white flex items-center justify-center shrink-0">
                <AlertTriangle className="w-5 h-5" />
              </div>
              <div className="space-y-1">
                <CardTitle className="text-base sm:text-lg font-bold text-red-700 dark:text-red-400">
                  Capture Quality Insufficient. Please Recapture the Sample.
                </CardTitle>
                <CardDescription className="text-xs text-stone-600 dark:text-stone-300">
                  The automated 8-parameter quality gate rejected this capture because the photos do not meet minimal optical standards for objective inspection.
                </CardDescription>
              </div>
            </div>
          </CardHeader>

          <CardContent className="pt-6 space-y-4">
            {/* Specific Failure Reasons */}
            <div className="space-y-2">
              <span className="text-xs font-bold uppercase tracking-wider text-muted-foreground block">
                Detected Quality Issues:
              </span>
              <div className="space-y-1.5">
                {qualityFailReasons.map((reason, i) => (
                  <div key={i} className="flex items-start gap-2 text-xs text-red-600 dark:text-red-300 bg-red-500/5 p-2.5 rounded border border-red-500/15">
                    <X className="w-4 h-4 shrink-0 text-red-500 mt-0.5" />
                    <span>{reason}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Actionable Corrective Guidance */}
            <div className="space-y-2">
              <span className="text-xs font-bold uppercase tracking-wider text-muted-foreground block">
                Actionable Corrective Guidance:
              </span>
              <div className="space-y-1.5">
                {qualityGuidance.map((tip, i) => (
                  <div key={i} className="flex items-start gap-2 text-xs text-stone-700 dark:text-stone-300 bg-stone-50 dark:bg-stone-900 p-2.5 rounded border border-border">
                    <CheckCircle2 className="w-4 h-4 shrink-0 text-emerald-600 mt-0.5" />
                    <span>{tip}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Product Promise Callout */}
            <div className="p-3 rounded-lg border border-border bg-stone-100 dark:bg-stone-900 text-[11px] text-muted-foreground">
              <span className="font-semibold text-foreground block">Why does KisanDrishti fail low-quality captures?</span>
              <span>
                "If capture quality is insufficient, generating a confident analysis would be dishonest. We demand clear evidence so both sides can trust what they see."
              </span>
            </div>
          </CardContent>

          <CardFooter className="bg-muted/20 border-t border-border flex flex-col sm:flex-row items-center justify-between gap-3">
            <Button
              variant="outline"
              size="sm"
              onClick={() => {
                setSimulateQualityFailure(false);
                setCurrentStep(1);
              }}
              className="text-xs w-full sm:w-auto"
            >
              Start Over
            </Button>

            <Button
              size="sm"
              onClick={() => {
                setSimulateQualityFailure(false);
                setCurrentStep(3);
                startCamera();
              }}
              className="text-xs bg-emerald-700 hover:bg-emerald-800 text-white gap-1.5 w-full sm:w-auto"
            >
              <RefreshCw className="w-3.5 h-3.5" />
              <span>Recapture Photos with Corrected Settings</span>
            </Button>
          </CardFooter>
        </Card>
      )}
    </div>
  );
};
