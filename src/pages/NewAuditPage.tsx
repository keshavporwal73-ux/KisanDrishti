import React, { useState, useRef, useEffect } from 'react';
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
  SlidersHorizontal,
  Image as ImageIcon
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

// High-resolution realistic fallback sample images tailored per crop
const CROP_PHOTO_PRESETS: Record<CropType, { main: string; closeUp: string; context: string; variety: string; location: string }> = {
  'Wheat': {
    main: 'https://images.unsplash.com/photo-1574323347407-f5e1ad6d020b?auto=format&fit=crop&w=1200&q=80',
    closeUp: 'https://images.unsplash.com/photo-1543257580-7269da773bf5?auto=format&fit=crop&w=1200&q=80',
    context: 'https://images.unsplash.com/photo-1500937386664-56d1dfef3854?auto=format&fit=crop&w=1200&q=80',
    variety: 'HD-3086 (Pusa Gautami)',
    location: 'Khanna Mandi, Punjab',
  },
  'Paddy (Rice)': {
    main: 'https://images.unsplash.com/photo-1586201375761-83865001e31c?auto=format&fit=crop&w=1200&q=80',
    closeUp: 'https://images.unsplash.com/photo-1536304993881-ff6e9eefa2a6?auto=format&fit=crop&w=1200&q=80',
    context: 'https://images.unsplash.com/photo-1500937386664-56d1dfef3854?auto=format&fit=crop&w=1200&q=80',
    variety: 'Basmati PB-1121',
    location: 'Karnal Grain Market, Haryana',
  },
  'Mustard': {
    main: 'https://images.unsplash.com/photo-1508746829417-e6f548d8d6ed?auto=format&fit=crop&w=1200&q=80',
    closeUp: 'https://images.unsplash.com/photo-1596040033229-a9821ebd058d?auto=format&fit=crop&w=1200&q=80',
    context: 'https://images.unsplash.com/photo-1500937386664-56d1dfef3854?auto=format&fit=crop&w=1200&q=80',
    variety: 'Pusa Bold / Pioneer 45S46',
    location: 'Alwar Mandi, Rajasthan',
  },
  'Soybean': {
    main: 'https://images.unsplash.com/photo-1599599810769-bcde5a160d32?auto=format&fit=crop&w=1200&q=80',
    closeUp: 'https://images.unsplash.com/photo-1543257580-7269da773bf5?auto=format&fit=crop&w=1200&q=80',
    context: 'https://images.unsplash.com/photo-1500937386664-56d1dfef3854?auto=format&fit=crop&w=1200&q=80',
    variety: 'JS-9560 / JS-335',
    location: 'Indore Mandi, Madhya Pradesh',
  },
  'Maize': {
    main: 'https://images.unsplash.com/photo-1551754655-cd27e38d2076?auto=format&fit=crop&w=1200&q=80',
    closeUp: 'https://images.unsplash.com/photo-1574323347407-f5e1ad6d020b?auto=format&fit=crop&w=1200&q=80',
    context: 'https://images.unsplash.com/photo-1500937386664-56d1dfef3854?auto=format&fit=crop&w=1200&q=80',
    variety: 'HQPM-1 Yellow Dent',
    location: 'Davangere APMC, Karnataka',
  },
  'Chana (Chickpea)': {
    main: 'https://images.unsplash.com/photo-1515543237350-b3eea1ec8082?auto=format&fit=crop&w=1200&q=80',
    closeUp: 'https://images.unsplash.com/photo-1543257580-7269da773bf5?auto=format&fit=crop&w=1200&q=80',
    context: 'https://images.unsplash.com/photo-1500937386664-56d1dfef3854?auto=format&fit=crop&w=1200&q=80',
    variety: 'Desi JG-11 / Vishal',
    location: 'Gulbarga APMC, Karnataka',
  },
  'Cotton': {
    main: 'https://images.unsplash.com/photo-1606041008023-472dfb5e530f?auto=format&fit=crop&w=1200&q=80',
    closeUp: 'https://images.unsplash.com/photo-1508746829417-e6f548d8d6ed?auto=format&fit=crop&w=1200&q=80',
    context: 'https://images.unsplash.com/photo-1500937386664-56d1dfef3854?auto=format&fit=crop&w=1200&q=80',
    variety: 'Bt Cotton Hybrid Shankar-6',
    location: 'Rajkot Mandi, Gujarat',
  },
  'Other': {
    main: 'https://images.unsplash.com/photo-1574323347407-f5e1ad6d020b?auto=format&fit=crop&w=1200&q=80',
    closeUp: 'https://images.unsplash.com/photo-1543257580-7269da773bf5?auto=format&fit=crop&w=1200&q=80',
    context: 'https://images.unsplash.com/photo-1500937386664-56d1dfef3854?auto=format&fit=crop&w=1200&q=80',
    variety: 'Commercial Lot Grade A',
    location: 'Central Agricultural Mandi',
  },
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

  // Track if user explicitly provided custom photos vs presets
  const [hasCustomPhotos, setHasCustomPhotos] = useState(false);

  // Active photo slot in capture screen
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

  const selectedCrop = watch('crop') as CropType;
  const hasOptionalSheet = watch('hasOptionalSheetUsed');

  // Update variety and location suggestions when crop changes
  useEffect(() => {
    const preset = CROP_PHOTO_PRESETS[selectedCrop] || CROP_PHOTO_PRESETS.Wheat;
    setValue('variety', preset.variety);
    setValue('location', preset.location);

    // If user hasn't uploaded custom photos, prefill the crop-specific presets
    if (!hasCustomPhotos) {
      setPhotos({
        main: preset.main,
        closeUp: preset.closeUp,
        context: preset.context,
      });
    }
  }, [selectedCrop, setValue, hasCustomPhotos]);

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
      
      setHasCustomPhotos(true);
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
          setHasCustomPhotos(true);
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

  // Load Crop-Specific Preset Photos
  const loadCropPresetPhotos = () => {
    const preset = CROP_PHOTO_PRESETS[selectedCrop] || CROP_PHOTO_PRESETS.Wheat;
    setPhotos({
      main: preset.main,
      closeUp: preset.closeUp,
      context: preset.context,
    });
    setHasCustomPhotos(false);
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
    const currentCropPresets = CROP_PHOTO_PRESETS[values.crop] || CROP_PHOTO_PRESETS.Wheat;
    
    // Ensure at least main and close-up photos exist (context is optional)
    const effectivePhotos: CapturedPhotos = {
      main: photos.main || currentCropPresets.main,
      closeUp: photos.closeUp || currentCropPresets.closeUp,
      context: photos.context || currentCropPresets.context,
    };

    stopCamera();
    setCurrentStep(4);
    setIsAnalyzing(true);
    setAnalysisProgress(10);
    setAnalysisStageText(`Running 8-Parameter Capture Quality Gate for ${values.crop}...`);

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

      setAnalysisStageText(`Local CV: Segmenting ${values.crop} contours & localizing candidate anomalies...`);
      setTimeout(() => {
        setAnalysisProgress(65);
        setAnalysisStageText(`Gemini Multimodal: Reasoning observable features for ${values.crop}...`);
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
            // Navigate directly to the newly generated evidence record
            navigate(`/records/${record.id}`);
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
            Standardized smartphone visual record for agricultural trade • "Evidence Before Valuation"
          </p>
        </div>

        {/* Step Indicator */}
        <div className="flex items-center gap-1.5 text-xs font-mono bg-muted/60 px-3 py-1.5 rounded-lg border border-border">
          <span className="text-muted-foreground">Step</span>
          <span className="font-bold text-emerald-600">{currentStep}</span>
          <span className="text-muted-foreground">of 3</span>
        </div>
      </div>

      {/* STEP 1: SELECT CROP & ENTER LOT DETAILS */}
      {currentStep === 1 && (
        <Card className="border border-border shadow-sm">
          <CardHeader className="pb-4 border-b border-border bg-card">
            <CardTitle className="text-base font-bold font-serif text-foreground">
              Step 1: Select Commodity & Lot Identification
            </CardTitle>
            <CardDescription className="text-xs text-muted-foreground">
              Enter the agricultural commodity, lot number, and mandi location for this inspection record.
            </CardDescription>
          </CardHeader>

          <CardContent className="pt-6 space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-6">
              
              {/* Crop Selection */}
              <div className="space-y-2">
                <Label htmlFor="crop" className="text-xs font-semibold flex items-center justify-between">
                  <span>Select Crop / Commodity *</span>
                  <span className="text-[10px] text-muted-foreground font-normal">Required</span>
                </Label>
                <Select
                  value={selectedCrop}
                  onValueChange={(val: CropType) => setValue('crop', val)}
                >
                  <SelectTrigger id="crop" className="text-xs h-9 bg-card">
                    <SelectValue placeholder="Choose commodity" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Wheat">Wheat (Kanak / Gehun)</SelectItem>
                    <SelectItem value="Paddy (Rice)">Paddy / Rice (Dhan)</SelectItem>
                    <SelectItem value="Mustard">Mustard (Sarson / Rai)</SelectItem>
                    <SelectItem value="Soybean">Soybean</SelectItem>
                    <SelectItem value="Maize">Maize (Makka)</SelectItem>
                    <SelectItem value="Chana (Chickpea)">Chana (Gram / Chickpea)</SelectItem>
                    <SelectItem value="Cotton">Cotton (Kapas)</SelectItem>
                    <SelectItem value="Other">Other Agricultural Commodity</SelectItem>
                  </SelectContent>
                </Select>
                {errors.crop && <p className="text-[11px] text-destructive">{errors.crop.message}</p>}
              </div>

              {/* Lot ID */}
              <div className="space-y-2">
                <Label htmlFor="lotId" className="text-xs font-semibold flex items-center justify-between">
                  <span>Lot / Bag Reference Identifier *</span>
                  <span className="text-[10px] text-muted-foreground font-normal">e.g. LOT-4029</span>
                </Label>
                <Input
                  id="lotId"
                  {...register('lotId')}
                  placeholder="e.g. LOT-WHEAT-2026-08"
                  className="text-xs h-9 font-mono bg-card"
                />
                {errors.lotId && <p className="text-[11px] text-destructive">{errors.lotId.message}</p>}
              </div>

              {/* Variety */}
              <div className="space-y-2">
                <Label htmlFor="variety" className="text-xs font-semibold">
                  Crop Variety / Seed Name (Optional)
                </Label>
                <Input
                  id="variety"
                  {...register('variety')}
                  placeholder="e.g. PB-1121, HD-3086, Pioneer"
                  className="text-xs h-9 bg-card"
                />
              </div>

              {/* Mandi / Location */}
              <div className="space-y-2">
                <Label htmlFor="location" className="text-xs font-semibold flex items-center justify-between">
                  <span>Mandi Yard / Farm Location *</span>
                  <span className="text-[10px] text-muted-foreground font-normal">Required</span>
                </Label>
                <Input
                  id="location"
                  {...register('location')}
                  placeholder="e.g. Khanna Mandi, Punjab"
                  className="text-xs h-9 bg-card"
                />
                {errors.location && <p className="text-[11px] text-destructive">{errors.location.message}</p>}
              </div>

              {/* Buyer / Aggregator Reference */}
              <div className="space-y-2">
                <Label htmlFor="buyerRef" className="text-xs font-semibold">
                  Buyer / Trader Ref / Gate Pass # (Optional)
                </Label>
                <Input
                  id="buyerRef"
                  {...register('buyerRef')}
                  placeholder="e.g. Trader Arhtiya Ref #89"
                  className="text-xs h-9 bg-card"
                />
              </div>

              {/* Sample Description */}
              <div className="space-y-2">
                <Label htmlFor="sampleDescription" className="text-xs font-semibold">
                  Sample Description (Optional)
                </Label>
                <Input
                  id="sampleDescription"
                  {...register('sampleDescription')}
                  placeholder="e.g. Composite grab sample from top/middle of 20 bags"
                  className="text-xs h-9 bg-card"
                />
              </div>
            </div>

            {/* Optional Alignment Sheet Switch */}
            <div className="p-4 rounded-xl border border-border bg-stone-50 dark:bg-stone-900/40 space-y-2">
              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <span className="text-xs font-semibold text-foreground flex items-center gap-1.5">
                    <Smartphone className="w-3.5 h-3.5 text-emerald-600" />
                    Did you place the sample on an optional printed alignment sheet?
                  </span>
                  <p className="text-[11px] text-muted-foreground">
                    Strictly optional. An inexpensive standard A4 printout helps camera framing and color reference.
                  </p>
                </div>
                <Switch
                  checked={hasOptionalSheet}
                  onCheckedChange={(val) => setValue('hasOptionalSheetUsed', val)}
                />
              </div>
            </div>
          </CardContent>

          <CardFooter className="bg-muted/20 border-t border-border flex justify-end p-4">
            <Button
              size="sm"
              onClick={() => setCurrentStep(2)}
              className="text-xs bg-emerald-700 hover:bg-emerald-800 text-white gap-1.5"
            >
              <span>Continue to Capture Guidelines</span>
              <ChevronRight className="w-3.5 h-3.5" />
            </Button>
          </CardFooter>
        </Card>
      )}

      {/* STEP 2: SIMPLE CAPTURE INSTRUCTIONS */}
      {currentStep === 2 && (
        <Card className="border border-border shadow-sm">
          <CardHeader className="pb-4 border-b border-border bg-card">
            <div className="flex items-center justify-between">
              <div>
                <CardTitle className="text-base font-bold font-serif text-foreground">
                  Step 2: Simple Photo Capture Guidelines
                </CardTitle>
                <CardDescription className="text-xs text-muted-foreground">
                  Follow these 3 easy rules to ensure your photos pass the Capture Quality Gate.
                </CardDescription>
              </div>
              <Badge variant="outline" className="text-[10px] font-mono border-emerald-600 text-emerald-700">
                No Special Hardware Required
              </Badge>
            </div>
          </CardHeader>

          <CardContent className="pt-6 space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {/* Instruction 1: Representative Sampling */}
              <div className="p-4 rounded-xl border border-emerald-600/30 bg-emerald-500/5 space-y-2">
                <div className="w-8 h-8 rounded-lg bg-emerald-600 text-white font-bold flex items-center justify-center text-xs">
                  1
                </div>
                <h3 className="font-bold text-xs text-foreground">
                  Representative Sample
                </h3>
                <p className="text-[11px] text-muted-foreground leading-relaxed">
                  Take a natural grab sample from across the lot or bags. <strong>Do NOT intentionally pick only the cleanest or worst material.</strong>
                </p>
              </div>

              {/* Instruction 2: Clean Surface */}
              <div className="p-4 rounded-xl border border-emerald-600/30 bg-emerald-500/5 space-y-2">
                <div className="w-8 h-8 rounded-lg bg-emerald-600 text-white font-bold flex items-center justify-center text-xs">
                  2
                </div>
                <h3 className="font-bold text-xs text-foreground">
                  Clean, Visible Surface
                </h3>
                <p className="text-[11px] text-muted-foreground leading-relaxed">
                  Place the sample on a clean sheet of paper, tray, or table. Spread it out naturally. <strong>Do NOT individually arrange or count grains.</strong>
                </p>
              </div>

              {/* Instruction 3: Good Light & 2-3 Photos */}
              <div className="p-4 rounded-xl border border-emerald-600/30 bg-emerald-500/5 space-y-2">
                <div className="w-8 h-8 rounded-lg bg-emerald-600 text-white font-bold flex items-center justify-center text-xs">
                  3
                </div>
                <h3 className="font-bold text-xs text-foreground">
                  Take 2–3 Smartphone Photos
                </h3>
                <p className="text-[11px] text-muted-foreground leading-relaxed">
                  Capture 1 <strong>Main Overview</strong>, 1 <strong>Close-Up</strong>, and optionally 1 <strong>Wider Context</strong> photo in daylight without harsh shadows.
                </p>
              </div>
            </div>

            {/* Quality Gate Rule Callout */}
            <div className="p-4 rounded-xl border border-amber-500/30 bg-amber-500/10 text-xs space-y-1.5 text-amber-950 dark:text-amber-200">
              <div className="flex items-center gap-2 font-bold text-amber-900 dark:text-amber-300">
                <ShieldAlert className="w-4 h-4 text-amber-600" />
                <span>Automated Capture Quality Gate Notice:</span>
              </div>
              <p className="text-[11px] leading-relaxed">
                KisanDrishti will automatically inspect your photos for <strong>blur, shadows, lighting, glare, framing, visibility, and resolution</strong>. If quality is insufficient, the system will not guess or generate false data; it will ask you to recapture the sample.
              </p>
            </div>
          </CardContent>

          <CardFooter className="bg-muted/20 border-t border-border flex justify-between p-4">
            <Button variant="ghost" size="sm" onClick={() => setCurrentStep(1)} className="text-xs">
              <ArrowLeft className="w-3.5 h-3.5 mr-1" />
              Back to Details
            </Button>
            <Button
              size="sm"
              onClick={() => {
                setCurrentStep(3);
                startCamera();
              }}
              className="text-xs bg-emerald-700 hover:bg-emerald-800 text-white gap-1.5"
            >
              <span>Proceed to Photo Capture</span>
              <Camera className="w-3.5 h-3.5" />
            </Button>
          </CardFooter>
        </Card>
      )}

      {/* STEP 3: SMARTPHONE PHOTO CAPTURE (2-3 PHOTOS) */}
      {currentStep === 3 && (
        <div className="space-y-4">
          <Card className="border border-border shadow-sm overflow-hidden">
            <CardHeader className="pb-3 border-b border-border bg-card">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                <div>
                  <CardTitle className="text-base font-bold font-serif text-foreground flex items-center gap-2">
                    <Camera className="w-4 h-4 text-emerald-600" />
                    <span>Capture 2–3 Smartphone Photos for {selectedCrop}</span>
                  </CardTitle>
                  <CardDescription className="text-xs text-muted-foreground">
                    Required: 1 Main Photo + 1 Close-Up. Optional: 1 Context Photo.
                  </CardDescription>
                </div>

                <div className="flex items-center gap-2">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={loadCropPresetPhotos}
                    className="text-xs border-stone-300 gap-1.5 text-stone-700 dark:text-stone-300"
                  >
                    <ImageIcon className="w-3.5 h-3.5 text-emerald-600" />
                    <span>Load {selectedCrop} Demo Photos</span>
                  </Button>
                </div>
              </div>
            </CardHeader>

            <CardContent className="p-4 sm:p-6 space-y-6">
              
              {/* Photo Slot Selection Tabs */}
              <div className="grid grid-cols-3 gap-2">
                {/* Slot 1: Main Photo */}
                <button
                  type="button"
                  onClick={() => setActivePhotoSlot('main')}
                  className={`p-3 rounded-xl border text-left transition-all relative ${
                    activePhotoSlot === 'main'
                      ? 'border-emerald-600 bg-emerald-500/10 ring-2 ring-emerald-600/30'
                      : 'border-border bg-card hover:bg-muted/40'
                  }`}
                >
                  <div className="flex items-center justify-between mb-1">
                    <span className="font-bold text-xs">1. Main Sample</span>
                    {photos.main ? (
                      <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                    ) : (
                      <span className="text-[9px] font-mono text-amber-600 bg-amber-500/10 px-1.5 py-0.5 rounded">Required</span>
                    )}
                  </div>
                  <p className="text-[10px] text-muted-foreground line-clamp-1">
                    Overall view of sample
                  </p>
                  {photos.main && (
                    <img
                      src={photos.main}
                      alt="Main sample"
                      className="mt-2 w-full h-14 object-cover rounded-md border border-border"
                    />
                  )}
                </button>

                {/* Slot 2: Close-Up Photo */}
                <button
                  type="button"
                  onClick={() => setActivePhotoSlot('closeUp')}
                  className={`p-3 rounded-xl border text-left transition-all relative ${
                    activePhotoSlot === 'closeUp'
                      ? 'border-emerald-600 bg-emerald-500/10 ring-2 ring-emerald-600/30'
                      : 'border-border bg-card hover:bg-muted/40'
                  }`}
                >
                  <div className="flex items-center justify-between mb-1">
                    <span className="font-bold text-xs">2. Close-Up</span>
                    {photos.closeUp ? (
                      <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                    ) : (
                      <span className="text-[9px] font-mono text-amber-600 bg-amber-500/10 px-1.5 py-0.5 rounded">Required</span>
                    )}
                  </div>
                  <p className="text-[10px] text-muted-foreground line-clamp-1">
                    Macro surface texture
                  </p>
                  {photos.closeUp && (
                    <img
                      src={photos.closeUp}
                      alt="Close-up sample"
                      className="mt-2 w-full h-14 object-cover rounded-md border border-border"
                    />
                  )}
                </button>

                {/* Slot 3: Context Photo */}
                <button
                  type="button"
                  onClick={() => setActivePhotoSlot('context')}
                  className={`p-3 rounded-xl border text-left transition-all relative ${
                    activePhotoSlot === 'context'
                      ? 'border-emerald-600 bg-emerald-500/10 ring-2 ring-emerald-600/30'
                      : 'border-border bg-card hover:bg-muted/40'
                  }`}
                >
                  <div className="flex items-center justify-between mb-1">
                    <span className="font-bold text-xs">3. Context</span>
                    {photos.context ? (
                      <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                    ) : (
                      <span className="text-[9px] font-mono text-muted-foreground bg-muted px-1.5 py-0.5 rounded">Optional</span>
                    )}
                  </div>
                  <p className="text-[10px] text-muted-foreground line-clamp-1">
                    Bag / lot surroundings
                  </p>
                  {photos.context && (
                    <img
                      src={photos.context}
                      alt="Context view"
                      className="mt-2 w-full h-14 object-cover rounded-md border border-border"
                    />
                  )}
                </button>
              </div>

              {/* Viewfinder / Active Capture Viewport */}
              <div className="relative aspect-[4/3] sm:aspect-video bg-stone-950 rounded-xl overflow-hidden border-2 border-stone-800 flex flex-col items-center justify-center">
                {isCameraActive ? (
                  <>
                    <video
                      ref={videoRef}
                      autoPlay
                      playsInline
                      muted
                      className="w-full h-full object-cover"
                    />

                    {/* Framing Guidelines Overlay */}
                    <div className="absolute inset-4 sm:inset-8 border border-white/40 rounded-lg pointer-events-none flex flex-col justify-between p-2">
                      <div className="flex justify-between text-[10px] font-mono text-white/80 drop-shadow">
                        <span>KISANDRISHTI CAM</span>
                        <span>SLOT: {activePhotoSlot.toUpperCase()} ({selectedCrop})</span>
                      </div>
                      <div className="text-center text-[11px] text-white/90 bg-black/60 py-1 px-3 rounded-full backdrop-blur self-center">
                        {activePhotoSlot === 'main' && `Center the full ${selectedCrop} sample spread`}
                        {activePhotoSlot === 'closeUp' && `Bring camera closer (10-15cm) for macro ${selectedCrop} texture`}
                        {activePhotoSlot === 'context' && 'Include lot bags or mandi surrounding area (Optional)'}
                      </div>
                      <div className="flex justify-between text-[10px] font-mono text-white/80 drop-shadow">
                        <span>DAYLIGHT / NO FLASH</span>
                        <span>TAP TO SNAP</span>
                      </div>
                    </div>

                    {/* Active Camera Action Controls */}
                    <div className="absolute bottom-4 inset-x-0 flex items-center justify-center gap-4 z-10 px-4">
                      <Button
                        size="sm"
                        variant="secondary"
                        onClick={toggleCameraFacing}
                        className="text-xs bg-black/60 hover:bg-black/80 text-white backdrop-blur border border-white/20"
                      >
                        <RefreshCw className="w-3.5 h-3.5 mr-1" />
                        Flip Camera
                      </Button>

                      <Button
                        size="lg"
                        onClick={takeSnapshot}
                        className="rounded-full w-14 h-14 p-0 bg-white text-stone-950 hover:bg-white/90 shadow-lg ring-4 ring-emerald-500/50 flex items-center justify-center"
                      >
                        <div className="w-10 h-10 rounded-full border-2 border-stone-950" />
                      </Button>

                      <Button
                        size="sm"
                        variant="secondary"
                        onClick={() => fileInputRef.current?.click()}
                        className="text-xs bg-black/60 hover:bg-black/80 text-white backdrop-blur border border-white/20"
                      >
                        <Upload className="w-3.5 h-3.5 mr-1" />
                        Upload
                      </Button>
                      <input
                        type="file"
                        ref={fileInputRef}
                        accept="image/*"
                        className="hidden"
                        onChange={handleFileUpload}
                      />
                    </div>
                  </>
                ) : photos[activePhotoSlot] ? (
                  /* Display Captured Photo */
                  <div className="relative w-full h-full">
                    <img
                      src={photos[activePhotoSlot]}
                      alt={`${activePhotoSlot} preview`}
                      className="w-full h-full object-cover"
                    />

                    <div className="absolute top-3 left-3 bg-black/70 text-white text-xs px-2.5 py-1 rounded-md backdrop-blur flex items-center gap-1.5 font-mono">
                      <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
                      <span>{activePhotoSlot.toUpperCase()} PHOTO READY ({selectedCrop})</span>
                    </div>

                    <div className="absolute bottom-3 right-3 flex items-center gap-2">
                      <Button
                        size="sm"
                        variant="destructive"
                        onClick={() => clearPhotoSlot(activePhotoSlot)}
                        className="text-xs h-8"
                      >
                        <X className="w-3.5 h-3.5 mr-1" />
                        Retake
                      </Button>
                      <Button
                        size="sm"
                        onClick={() => startCamera()}
                        className="text-xs h-8 bg-emerald-700 hover:bg-emerald-800 text-white"
                      >
                        <Camera className="w-3.5 h-3.5 mr-1" />
                        Open Live Camera
                      </Button>
                    </div>
                  </div>
                ) : (
                  /* Placeholder when camera is inactive and no photo */
                  <div className="text-center p-6 space-y-4 max-w-sm">
                    <div className="w-12 h-12 rounded-full bg-stone-800 text-stone-300 flex items-center justify-center mx-auto">
                      <Camera className="w-6 h-6" />
                    </div>
                    <div>
                      <h4 className="text-sm font-bold text-white">
                        {activePhotoSlot === 'main' && `Capture Main ${selectedCrop} Photo`}
                        {activePhotoSlot === 'closeUp' && `Capture Close-Up ${selectedCrop} Photo`}
                        {activePhotoSlot === 'context' && `Capture Context Photo (Optional)`}
                      </h4>
                      <p className="text-xs text-stone-400 mt-1">
                        Use your smartphone camera or upload an image from your device.
                      </p>
                    </div>

                    <div className="flex flex-wrap items-center justify-center gap-2">
                      <Button
                        size="sm"
                        onClick={() => startCamera()}
                        className="text-xs bg-emerald-700 hover:bg-emerald-800 text-white gap-1.5"
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
              KisanDrishti only records observable visual features (broken, discolored, foreign material) for {selectedCrop}. It will never fabricate moisture or chemical measurements.
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
