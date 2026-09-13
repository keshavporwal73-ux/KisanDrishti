import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { 
  BookOpen, 
  Wheat, 
  Search, 
  Layers, 
  ShieldCheck, 
  CheckCircle2, 
  AlertTriangle, 
  Info, 
  Camera, 
  ArrowRight,
  Eye,
  SlidersHorizontal,
  ChevronRight
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';

export interface GrainEncyclopediaItem {
  id: string;
  name: string;
  hindiName: string;
  botanicalName: string;
  primaryStates: string[];
  mainImageUrl: string;
  closeUpUrl: string;
  defectsImageUrl: string;
  faqStandardSpecs: {
    maxBrokenPercent: number;
    maxDiscolorPercent: number;
    maxForeignMatterPercent: number;
    standardMoisturePercent: number;
    soundKernelMinPercent: number;
  };
  visualCharacteristics: {
    shapeAndSize: string;
    colorProfile: string;
    macroTexture: string;
    endospermStructure: string;
  };
  commonVisualDefects: {
    name: string;
    visualSymptom: string;
    potentialCause: string;
  }[];
  fieldIdentificationTips: string[];
}

export const ENCYCLOPEDIA_GRAINS: GrainEncyclopediaItem[] = [
  {
    id: 'wheat',
    name: 'Wheat (Gehun)',
    hindiName: 'गेहूं (Sharbati / Lokwan / HD-2967)',
    botanicalName: 'Triticum aestivum',
    primaryStates: ['Punjab', 'Haryana', 'Madhya Pradesh', 'Rajasthan', 'Uttar Pradesh'],
    mainImageUrl: 'https://images.unsplash.com/photo-1574323347407-f5e1ad6d020b?auto=format&fit=crop&w=1200&q=80',
    closeUpUrl: 'https://images.unsplash.com/photo-1509440159596-0249088772ff?auto=format&fit=crop&w=1200&q=80',
    defectsImageUrl: 'https://images.unsplash.com/photo-1574323347407-f5e1ad6d020b?auto=format&fit=crop&w=800&q=80',
    faqStandardSpecs: {
      maxBrokenPercent: 4.0,
      maxDiscolorPercent: 2.0,
      maxForeignMatterPercent: 1.0,
      standardMoisturePercent: 12.0,
      soundKernelMinPercent: 90.0,
    },
    visualCharacteristics: {
      shapeAndSize: 'Ovoid with longitudinal crease; 6.2mm - 7.5mm length',
      colorProfile: 'Amber Golden (580nm), lustrous translucency',
      macroTexture: 'Hard vitreous endosperm with distinct brush hairs at apex',
      endospermStructure: 'Uniform starchy core without internal discoloration',
    },
    commonVisualDefects: [
      { name: 'Karnal Bunt / Black Tip', visualSymptom: 'Dark brown to black discoloration around embryo point', potentialCause: 'Tilletia indica fungal infection during flowering stage' },
      { name: 'Shriveled / Immature', visualSymptom: 'Wrinkled outer pericarp with hollow or light kernel weight', potentialCause: 'Terminal heat stress or early harvesting' },
      { name: 'Insect Bored Grains', visualSymptom: 'Visible circular exit holes with internal frass powder', potentialCause: 'Rhyzopertha dominica / Sitophilus oryzae infestation' },
    ],
    fieldIdentificationTips: [
      'High grade Sharbati wheat grains exhibit amber gloss and sink rapidly in water.',
      'Check crease depth: deeper crease indicates higher bran-to-flour ratio.',
      'Examine sample under daylight to avoid mistaking shadow for Karnal bunt.',
    ],
  },
  {
    id: 'paddy',
    name: 'Paddy / Basmati Rice (Dhan)',
    hindiName: 'धान / बासमती (PB-1121 / 1509 / PR-126)',
    botanicalName: 'Oryza sativa',
    primaryStates: ['Punjab', 'Haryana', 'Uttar Pradesh', 'West Bengal', 'Andhra Pradesh'],
    mainImageUrl: 'https://images.unsplash.com/photo-1586201375761-83865001e31c?auto=format&fit=crop&w=1200&q=80',
    closeUpUrl: 'https://images.unsplash.com/photo-1536304993881-ff6e9eefa2a6?auto=format&fit=crop&w=1200&q=80',
    defectsImageUrl: 'https://images.unsplash.com/photo-1586201375761-83865001e31c?auto=format&fit=crop&w=800&q=80',
    faqStandardSpecs: {
      maxBrokenPercent: 5.0,
      maxDiscolorPercent: 3.0,
      maxForeignMatterPercent: 1.0,
      standardMoisturePercent: 14.0,
      soundKernelMinPercent: 88.0,
    },
    visualCharacteristics: {
      shapeAndSize: 'Slender elongated grain; Basmati length > 8.0mm',
      colorProfile: 'Pale straw golden husk, pearly white kernel inside',
      macroTexture: 'Longitudinal ridges on lemma and palea hull',
      endospermStructure: 'Hard translucent kernel without chalky belly',
    },
    commonVisualDefects: [
      { name: 'Chalky / Immature Kernels', visualSymptom: 'Opaque milk-white core or chalky belly', potentialCause: 'High night temperatures during grain filling' },
      { name: 'Yellow / Heat Damaged', visualSymptom: 'Deep yellow or brownish kernel discoloration', potentialCause: 'High moisture storage and bacterial fermentation' },
      { name: 'Paddy Husk / Chaff', visualSymptom: 'Empty unfertilized spikelets mixed in lot', potentialCause: 'Improper threshing or winnowing' },
    ],
    fieldIdentificationTips: [
      'Pusa 1121 grains have an exceptional length-to-breadth ratio exceeding 4.3.',
      'Rub between fingers to ensure hulls are dry and do not shed damp husk powder.',
      'Chalkiness (>20% opaque core) reduces cooked elongation factor.',
    ],
  },
  {
    id: 'mustard',
    name: 'Mustard / Rapeseed (Sarson)',
    hindiName: 'सरसों / राई (Pusa Bold / Giriraj)',
    botanicalName: 'Brassica juncea',
    primaryStates: ['Rajasthan', 'Haryana', 'Madhya Pradesh', 'Uttar Pradesh', 'Gujarat'],
    mainImageUrl: 'https://images.unsplash.com/photo-1615485290382-441e4d049cb5?auto=format&fit=crop&w=1200&q=80',
    closeUpUrl: 'https://images.unsplash.com/photo-1599940824399-b87987ceb72a?auto=format&fit=crop&w=1200&q=80',
    defectsImageUrl: 'https://images.unsplash.com/photo-1615485290382-441e4d049cb5?auto=format&fit=crop&w=800&q=80',
    faqStandardSpecs: {
      maxBrokenPercent: 2.0,
      maxDiscolorPercent: 2.0,
      maxForeignMatterPercent: 2.0,
      standardMoisturePercent: 8.0,
      soundKernelMinPercent: 92.0,
    },
    visualCharacteristics: {
      shapeAndSize: 'Spherical micro-seeds; 1.8mm - 2.4mm diameter',
      colorProfile: 'Dark reddish brown to ebony black with natural oily sheen',
      macroTexture: 'Smooth seed coat with delicate micro-reticulation',
      endospermStructure: 'Rich yellow cotyledons with 40-42% oil content',
    },
    commonVisualDefects: [
      { name: 'Immature / Green Seeds', visualSymptom: 'Greenish cotyledons upon splitting seed coat', potentialCause: 'Early harvest before chlorophyll degradation' },
      { name: 'Argemone Seeds Adulteration', visualSymptom: 'Prickly, irregular black seeds with pointed tips', potentialCause: 'Weed seed contamination (Toxic - strictly forbidden)' },
      { name: 'Dust and Fine Mud', visualSymptom: 'Earthy coating dulling the natural seed shine', potentialCause: 'Floor drying on unpaved mandi threshing yard' },
    ],
    fieldIdentificationTips: [
      'Crush sample between paper sheets: authentic mustard leaves clean yellow oil circles.',
      'Inspect for Argemone mexicana seeds using 5x magnification.',
      'Sound seeds roll smoothly without clumping together.',
    ],
  },
  {
    id: 'soybean',
    name: 'Soybean (Soyabean)',
    hindiName: 'सोयाबीन (JS-9560 / JS-335)',
    botanicalName: 'Glycine max',
    primaryStates: ['Madhya Pradesh', 'Maharashtra', 'Rajasthan', 'Karnataka'],
    mainImageUrl: 'https://images.unsplash.com/photo-1599940824399-b87987ceb72a?auto=format&fit=crop&w=1200&q=80',
    closeUpUrl: 'https://images.unsplash.com/photo-1586201375761-83865001e31c?auto=format&fit=crop&w=1200&q=80',
    defectsImageUrl: 'https://images.unsplash.com/photo-1599940824399-b87987ceb72a?auto=format&fit=crop&w=800&q=80',
    faqStandardSpecs: {
      maxBrokenPercent: 3.0,
      maxDiscolorPercent: 2.0,
      maxForeignMatterPercent: 1.0,
      standardMoisturePercent: 10.0,
      soundKernelMinPercent: 90.0,
    },
    visualCharacteristics: {
      shapeAndSize: 'Sub-spherical to oval seed; 5.5mm - 7.0mm diameter',
      colorProfile: 'Creamy yellow with distinct brown or black hilum scar',
      macroTexture: 'Firm, taut seed coat with gentle gloss',
      endospermStructure: 'Dense pale yellow cotyledons with 20% oil & 40% protein',
    },
    commonVisualDefects: [
      { name: 'Purple Seed Stain', visualSymptom: 'Purple blotches on seed coat', potentialCause: 'Cercospora kikuchii fungal spore dispersal' },
      { name: 'Split / Dehulled Cotyledons', visualSymptom: 'Separated halves with exposed embryo', potentialCause: 'High speed combine threshing under dry conditions' },
      { name: 'Mottled / Weather Damaged', visualSymptom: 'Dull brown wrinkling or fungal mycelium film', potentialCause: 'Unseasonal rain during pod maturation' },
    ],
    fieldIdentificationTips: [
      'JS-9560 has an oval shape and pale brown hilum with high germination vigor.',
      'Avoid lots with >3% split seeds for seed-grade or storage purposes.',
    ],
  },
  {
    id: 'maize',
    name: 'Maize / Corn (Makka)',
    hindiName: 'मक्का (HQPM-1 / Bio-9681)',
    botanicalName: 'Zea mays',
    primaryStates: ['Karnataka', 'Madhya Pradesh', 'Bihar', 'Telangana', 'Rajasthan'],
    mainImageUrl: 'https://images.unsplash.com/photo-1551754655-cd27e38d2076?auto=format&fit=crop&w=1200&q=80',
    closeUpUrl: 'https://images.unsplash.com/photo-1551754655-cd27e38d2076?auto=format&fit=crop&w=1200&q=80',
    defectsImageUrl: 'https://images.unsplash.com/photo-1551754655-cd27e38d2076?auto=format&fit=crop&w=800&q=80',
    faqStandardSpecs: {
      maxBrokenPercent: 4.5,
      maxDiscolorPercent: 3.0,
      maxForeignMatterPercent: 2.0,
      standardMoisturePercent: 14.0,
      soundKernelMinPercent: 88.0,
    },
    visualCharacteristics: {
      shapeAndSize: 'Dent or flint wedge-shaped kernel; 8.0mm - 11.0mm',
      colorProfile: 'Vibrant orange-yellow with translucent crown',
      macroTexture: 'Hard vitreous outer mantle, starchy floury core',
      endospermStructure: 'Solid germ cavity without hollow mold pockets',
    },
    commonVisualDefects: [
      { name: 'Aflatoxin Mold Discoloration', visualSymptom: 'Greenish-yellow powdery mold around kernel tip', potentialCause: 'Aspergillus flavus growth in high humidity' },
      { name: 'Broken Kernel Fragments', visualSymptom: 'Sharp fractured pieces missing tip caps', potentialCause: 'Mechanical sheller impact' },
      { name: 'Silk & Cob Bits', visualSymptom: 'Fibrous plant debris mixed in sample', potentialCause: 'Incomplete pneumatic cleaning' },
    ],
    fieldIdentificationTips: [
      'HQPM-1 kernels feature translucent flint sides with exceptional protein balance.',
      'Check kernel tip cap: missing caps accelerate weevil entry during storage.',
    ],
  },
  {
    id: 'chana',
    name: 'Desi Chana (Gram / Chickpea)',
    hindiName: 'चना / छोले (JG-11 / Vishal / Vijay)',
    botanicalName: 'Cicer arietinum',
    primaryStates: ['Madhya Pradesh', 'Karnataka', 'Maharashtra', 'Rajasthan', 'Andhra Pradesh'],
    mainImageUrl: 'https://images.unsplash.com/photo-1586201375761-83865001e31c?auto=format&fit=crop&w=1200&q=80',
    closeUpUrl: 'https://images.unsplash.com/photo-1599940824399-b87987ceb72a?auto=format&fit=crop&w=1200&q=80',
    defectsImageUrl: 'https://images.unsplash.com/photo-1586201375761-83865001e31c?auto=format&fit=crop&w=800&q=80',
    faqStandardSpecs: {
      maxBrokenPercent: 3.0,
      maxDiscolorPercent: 2.5,
      maxForeignMatterPercent: 1.0,
      standardMoisturePercent: 10.0,
      soundKernelMinPercent: 90.0,
    },
    visualCharacteristics: {
      shapeAndSize: 'Angular beak-shaped seed; 6.5mm - 8.5mm',
      colorProfile: 'Warm reddish-tan / hazelnut brown seed coat',
      macroTexture: 'Wrinkled rough seed coat with prominent beak (rostrum)',
      endospermStructure: 'Crisp yellow split dal cotyledons',
    },
    commonVisualDefects: [
      { name: 'Bruchild Beetle Holes', visualSymptom: 'Clean circular exit holes with hollow seed interior', potentialCause: 'Callosobruchus maculatus pulse beetle attack' },
      { name: 'Split Dal Halves', visualSymptom: 'Cotyledons separated from outer brown hull', potentialCause: 'Mechanical stress during harvesting' },
      { name: 'Dark Blackened Grains', visualSymptom: 'Necrotic black seed coats', potentialCause: 'Wilt or root rot infection prior to harvest' },
    ],
    fieldIdentificationTips: [
      'Desi JG-11 is noted for uniform brown color and bold angular seed size.',
      'Immerse in clean water: sound seeds sink; weevil-damaged hollow seeds float.',
    ],
  },
];

export const GrainEncyclopediaPage: React.FC = () => {
  const [selectedGrainId, setSelectedGrainId] = useState<string>('wheat');
  const [searchTerm, setSearchTerm] = useState<string>('');

  const currentGrain = ENCYCLOPEDIA_GRAINS.find(g => g.id === selectedGrainId) || ENCYCLOPEDIA_GRAINS[0];

  const filteredGrains = ENCYCLOPEDIA_GRAINS.filter(g => 
    g.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    g.hindiName.toLowerCase().includes(searchTerm.toLowerCase()) ||
    g.botanicalName.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="space-y-6 pb-16">
      
      {/* Top Banner */}
      <div className="p-5 sm:p-6 bg-gradient-to-r from-emerald-950 via-stone-900 to-stone-950 text-white border border-emerald-800/40 rounded-2xl shadow-md flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="space-y-1.5">
          <div className="flex items-center gap-2">
            <span className="w-2.5 h-2.5 rounded-full bg-emerald-400 animate-pulse" />
            <Badge className="bg-emerald-700/80 text-white font-mono text-[10px] uppercase border-0">
              Agricultural Visual Knowledge Base
            </Badge>
          </div>
          <h1 className="text-xl sm:text-2xl font-serif font-bold tracking-tight text-amber-200">
            Visual Grain Encyclopedia & Field Identification Guide
          </h1>
          <p className="text-xs text-stone-300 max-w-2xl leading-relaxed">
            Examine high-definition physical grain profiles, botanical characteristics, standard APMC FAQ quality tolerances, and common visual defect markers across India's principal agricultural commodities.
          </p>
        </div>

        <div className="flex items-center gap-2 shrink-0">
          <Button asChild size="sm" className="bg-emerald-600 hover:bg-emerald-700 text-white text-xs gap-1.5">
            <Link to="/audit/new">
              <Camera className="w-3.5 h-3.5" />
              <span>Verify My Sample</span>
            </Link>
          </Button>
          <Button asChild size="sm" variant="ghost" className="border border-white/30 text-white text-xs gap-1.5">
            <Link to="/calculator">
              <SlidersHorizontal className="w-3.5 h-3.5" />
              <span>Price Calculator</span>
            </Link>
          </Button>
        </div>
      </div>

      {/* Commodity Quick Switcher Strip */}
      <div className="space-y-2">
        <span className="text-xs font-bold font-serif text-foreground uppercase tracking-wider block">
          Select Commodity Profile:
        </span>
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-2">
          {filteredGrains.map((g) => {
            const isSelected = g.id === selectedGrainId;
            return (
              <button
                key={g.id}
                type="button"
                onClick={() => setSelectedGrainId(g.id)}
                className={`p-3 rounded-xl border text-left transition-all ${
                  isSelected
                    ? 'border-emerald-600 bg-emerald-500/10 ring-2 ring-emerald-600/30'
                    : 'border-border bg-card hover:bg-muted/50'
                }`}
              >
                <span className="font-bold text-xs text-foreground block truncate">{g.name.split(' (')[0]}</span>
                <span className="text-[10px] text-muted-foreground font-mono truncate block">{g.botanicalName}</span>
              </button>
            );
          })}
        </div>
      </div>

      {/* Active Commodity Deep Dive Profile */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        
        {/* Left Column: Macro Photos & Physical Specs (5 cols) */}
        <div className="lg:col-span-5 space-y-4">
          <Card className="border border-border bg-card shadow-xs overflow-hidden">
            <div className="aspect-[4/3] bg-stone-900 relative">
              <img
                src={currentGrain.mainImageUrl}
                alt={currentGrain.name}
                className="w-full h-full object-cover"
              />
              <Badge className="absolute top-2 left-2 bg-black/80 text-white font-mono text-[10px] border-0">
                Main Optical Sample
              </Badge>
            </div>

            <CardContent className="p-4 space-y-3">
              <div>
                <h2 className="text-lg font-bold font-serif text-foreground">{currentGrain.name}</h2>
                <p className="text-xs text-emerald-700 dark:text-emerald-400 font-mono font-medium">{currentGrain.hindiName}</p>
                <p className="text-[11px] text-muted-foreground italic font-mono">{currentGrain.botanicalName}</p>
              </div>

              {/* FAQ Standard Specifications Strip */}
              <div className="pt-2 border-t border-border space-y-2">
                <span className="font-bold text-xs font-serif text-foreground block">
                  APMC FAQ Standard Limits:
                </span>
                <div className="grid grid-cols-2 gap-2 text-xs font-mono">
                  <div className="p-2 rounded bg-muted/40 border border-border">
                    <span className="text-[9px] text-muted-foreground block">MAX BROKEN</span>
                    <span className="font-bold text-amber-600">{currentGrain.faqStandardSpecs.maxBrokenPercent}%</span>
                  </div>
                  <div className="p-2 rounded bg-muted/40 border border-border">
                    <span className="text-[9px] text-muted-foreground block">MAX DISCOLOR</span>
                    <span className="font-bold text-orange-600">{currentGrain.faqStandardSpecs.maxDiscolorPercent}%</span>
                  </div>
                  <div className="p-2 rounded bg-muted/40 border border-border">
                    <span className="text-[9px] text-muted-foreground block">FOREIGN MATTER</span>
                    <span className="font-bold text-red-600">{currentGrain.faqStandardSpecs.maxForeignMatterPercent}%</span>
                  </div>
                  <div className="p-2 rounded bg-muted/40 border border-border">
                    <span className="text-[9px] text-muted-foreground block">SOUND GRAIN MIN</span>
                    <span className="font-bold text-emerald-600">{currentGrain.faqStandardSpecs.soundKernelMinPercent}%</span>
                  </div>
                </div>
              </div>

              {/* Major Production Hubs */}
              <div className="pt-2 border-t border-border text-xs">
                <span className="text-muted-foreground font-semibold">Major Mandi Hubs: </span>
                <span className="text-foreground">{currentGrain.primaryStates.join(', ')}</span>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Right Column: Visual Characteristics, Defect Diagnostic, & Tips (7 cols) */}
        <div className="lg:col-span-7 space-y-4">
          
          {/* Card 1: Observable Physical Characteristics */}
          <Card className="border border-border bg-card shadow-xs">
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-bold font-serif text-foreground flex items-center gap-2">
                <Eye className="w-4 h-4 text-emerald-600" />
                <span>Observable Physical Grain Attributes</span>
              </CardTitle>
            </CardHeader>
            <CardContent className="p-4 pt-0 space-y-2 text-xs">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-1">
                <div className="p-2.5 rounded-lg bg-muted/30 border border-border">
                  <span className="text-muted-foreground font-semibold block text-[11px]">Shape & Longitudinal Dimensions:</span>
                  <span className="text-foreground font-mono text-[11px]">{currentGrain.visualCharacteristics.shapeAndSize}</span>
                </div>
                <div className="p-2.5 rounded-lg bg-muted/30 border border-border">
                  <span className="text-muted-foreground font-semibold block text-[11px]">Optical Color & Light Profile:</span>
                  <span className="text-foreground font-mono text-[11px]">{currentGrain.visualCharacteristics.colorProfile}</span>
                </div>
                <div className="p-2.5 rounded-lg bg-muted/30 border border-border">
                  <span className="text-muted-foreground font-semibold block text-[11px]">Surface Texture & Pericarp:</span>
                  <span className="text-foreground font-mono text-[11px]">{currentGrain.visualCharacteristics.macroTexture}</span>
                </div>
                <div className="p-2.5 rounded-lg bg-muted/30 border border-border">
                  <span className="text-muted-foreground font-semibold block text-[11px]">Internal Endosperm Core:</span>
                  <span className="text-foreground font-mono text-[11px]">{currentGrain.visualCharacteristics.endospermStructure}</span>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Card 2: Common Visual Defects & Field Diagnostics */}
          <Card className="border border-border bg-card shadow-xs">
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-bold font-serif text-foreground flex items-center gap-2">
                <AlertTriangle className="w-4 h-4 text-amber-600" />
                <span>Common Visual Defects & Diagnostic Criteria</span>
              </CardTitle>
            </CardHeader>
            <CardContent className="p-4 pt-0 space-y-2.5">
              {currentGrain.commonVisualDefects.map((defect, idx) => (
                <div key={idx} className="p-3 rounded-lg border border-border bg-stone-50 dark:bg-stone-900/60 space-y-1 text-xs">
                  <div className="flex items-center justify-between">
                    <span className="font-bold text-foreground">{defect.name}</span>
                    <Badge variant="outline" className="text-[9px] font-mono border-amber-600/40 text-amber-700 dark:text-amber-300">
                      Visual Anomaly
                    </Badge>
                  </div>
                  <p className="text-muted-foreground text-[11px]">
                    <strong className="text-foreground font-semibold">Visual Symptom:</strong> {defect.visualSymptom}
                  </p>
                  <p className="text-[10px] text-stone-500 italic">
                    <strong>Cause:</strong> {defect.potentialCause}
                  </p>
                </div>
              ))}
            </CardContent>
          </Card>

          {/* Card 3: Mandi Field Inspection Tips */}
          <Card className="border border-border bg-emerald-950/10 border-emerald-800/30 shadow-xs">
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-bold font-serif text-emerald-800 dark:text-emerald-300 flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                <span>Mandi Floor Verification Guidance</span>
              </CardTitle>
            </CardHeader>
            <CardContent className="p-4 pt-0 space-y-1.5 text-xs">
              <ul className="space-y-1.5 text-stone-700 dark:text-stone-300 text-[11px] list-disc list-inside">
                {currentGrain.fieldIdentificationTips.map((tip, idx) => (
                  <li key={idx} className="leading-relaxed">{tip}</li>
                ))}
              </ul>
            </CardContent>
          </Card>

        </div>
      </div>
    </div>
  );
};
