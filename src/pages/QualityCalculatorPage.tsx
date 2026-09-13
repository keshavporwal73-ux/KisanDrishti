import React, { useState, useEffect } from 'react';
import { useSearchParams, Link } from 'react-router-dom';
import { 
  SlidersHorizontal, 
  Wheat, 
  ShieldCheck, 
  DollarSign, 
  AlertCircle, 
  CheckCircle2, 
  HelpCircle, 
  RotateCcw,
  Sparkles,
  ArrowRight,
  TrendingUp,
  Percent,
  FileSpreadsheet
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Slider } from '@/components/ui/slider';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';

export const QualityCalculatorPage: React.FC = () => {
  const [searchParams] = useSearchParams();
  const initialCrop = searchParams.get('crop') || 'Wheat';
  const initialPrice = Number(searchParams.get('price')) || 2480;

  const [crop, setCrop] = useState<string>(initialCrop);
  const [basePrice, setBasePrice] = useState<number>(initialPrice);
  const [lotQuantityQuintals, setLotQuantityQuintals] = useState<number>(50);

  // Observable Visual Defect Inputs
  const [brokenPercent, setBrokenPercent] = useState<number>(6.4);
  const [discoloredPercent, setDiscoloredPercent] = useState<number>(1.8);
  const [foreignMatterCount, setForeignMatterCount] = useState<number>(2);
  const [surfaceDamagePercent, setSurfaceDamagePercent] = useState<number>(1.2);
  const [soundGrainBonus, setSoundGrainBonus] = useState<boolean>(true);

  // Crop Standards & Fair Tolerances (FAQ Standard Mandi Limits)
  const cropTolerances: Record<string, { maxBroken: number; maxDiscolor: number; maxForeign: number; defaultBase: number }> = {
    'Wheat': { maxBroken: 4.0, maxDiscolor: 2.0, maxForeign: 1, defaultBase: 2480 },
    'Paddy (Rice)': { maxBroken: 5.0, maxDiscolor: 3.0, maxForeign: 1, defaultBase: 4350 },
    'Mustard': { maxBroken: 2.0, maxDiscolor: 2.0, maxForeign: 2, defaultBase: 5850 },
    'Soybean': { maxBroken: 3.0, maxDiscolor: 2.0, maxForeign: 1, defaultBase: 4680 },
    'Maize': { maxBroken: 4.5, maxDiscolor: 3.0, maxForeign: 2, defaultBase: 2260 },
    'Chana (Chickpea)': { maxBroken: 3.0, maxDiscolor: 2.5, maxForeign: 1, defaultBase: 6120 },
    'Cotton': { maxBroken: 2.0, maxDiscolor: 3.0, maxForeign: 2, defaultBase: 7450 },
  };

  const currentTolerance = cropTolerances[crop] || cropTolerances['Wheat'];

  const handleCropChange = (newCrop: string) => {
    setCrop(newCrop);
    const tol = cropTolerances[newCrop] || cropTolerances['Wheat'];
    setBasePrice(tol.defaultBase);
  };

  // Calculations
  const excessBroken = Math.max(0, brokenPercent - currentTolerance.maxBroken);
  const excessDiscolor = Math.max(0, discoloredPercent - currentTolerance.maxDiscolor);
  const excessForeign = Math.max(0, foreignMatterCount - currentTolerance.maxForeign);
  const excessDamage = Math.max(0, surfaceDamagePercent - 1.0);

  // Standard APMC proportional value deduction formula per quintal
  const brokenDeduction = (excessBroken * 0.75 * basePrice) / 100;
  const discolorDeduction = (excessDiscolor * 0.60 * basePrice) / 100;
  const foreignDeduction = (excessForeign * 0.50 * basePrice) / 100;
  const damageDeduction = (excessDamage * 0.40 * basePrice) / 100;

  const totalDeductions = brokenDeduction + discolorDeduction + foreignDeduction + damageDeduction;

  // Premium bonus if sample is exceptionally sound (e.g. broken < 2%, discolored < 1%)
  const soundRate = 100 - (brokenPercent + discoloredPercent + surfaceDamagePercent);
  const qualityPremium = (soundRate >= 92 && soundGrainBonus) ? (basePrice * 0.02) : 0;

  const realizedPricePerQuintal = Math.max(0, Math.round(basePrice - totalDeductions + qualityPremium));
  const totalLotValue = realizedPricePerQuintal * lotQuantityQuintals;
  const baseLotValue = basePrice * lotQuantityQuintals;
  const netVariance = totalLotValue - baseLotValue;

  return (
    <div className="space-y-6 pb-16">
      
      {/* Top Header */}
      <div className="p-5 sm:p-6 bg-gradient-to-r from-emerald-950 via-stone-900 to-stone-950 text-white border border-emerald-800/40 rounded-2xl shadow-md flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="space-y-1.5">
          <div className="flex items-center gap-2">
            <span className="w-2.5 h-2.5 rounded-full bg-emerald-400 animate-pulse" />
            <Badge className="bg-emerald-700/80 text-white font-mono text-[10px] uppercase border-0">
              Interactive Fair Valuation Estimator
            </Badge>
          </div>
          <h1 className="text-xl sm:text-2xl font-serif font-bold tracking-tight text-amber-200">
            Grain Quality & Fair Price Impact Calculator
          </h1>
          <p className="text-xs text-stone-300 max-w-2xl leading-relaxed">
            Simulate standard APMC quality deductions and sound-grain premiums based on verifiable visual defect rates. Ensure transparent, fact-based negotiations between farmers and procurement traders.
          </p>
        </div>

        <div className="flex items-center gap-2 shrink-0">
          <Button asChild size="sm" className="bg-emerald-600 hover:bg-emerald-700 text-white text-xs gap-1.5">
            <Link to="/audit/new">
              <Wheat className="w-3.5 h-3.5" />
              <span>Capture Live Evidence</span>
            </Link>
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        
        {/* Left Form: Inputs & Defect Sliders (7 cols) */}
        <div className="lg:col-span-7 space-y-5">
          
          {/* Commodity & Base Rate Selection */}
          <Card className="border border-border bg-card shadow-xs">
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-bold font-serif text-foreground">
                1. Commodity & Baseline Market Rate
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                <div className="space-y-1.5">
                  <label className="text-xs font-semibold text-foreground">Select Commodity</label>
                  <Select value={crop} onValueChange={handleCropChange}>
                    <SelectTrigger className="text-xs h-9">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {Object.keys(cropTolerances).map((c) => (
                        <SelectItem key={c} value={c} className="text-xs">
                          {c}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-1.5">
                  <label className="text-xs font-semibold text-foreground">Base Rate (₹/Quintal)</label>
                  <Input
                    type="number"
                    value={basePrice}
                    onChange={(e) => setBasePrice(Number(e.target.value))}
                    className="text-xs font-mono h-9"
                  />
                </div>

                <div className="space-y-1.5">
                  <label className="text-xs font-semibold text-foreground">Lot Quantity (Quintals)</label>
                  <Input
                    type="number"
                    value={lotQuantityQuintals}
                    onChange={(e) => setLotQuantityQuintals(Number(e.target.value))}
                    className="text-xs font-mono h-9"
                  />
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Defect Sliders */}
          <Card className="border border-border bg-card shadow-xs">
            <CardHeader className="pb-3 flex flex-row items-center justify-between">
              <div>
                <CardTitle className="text-sm font-bold font-serif text-foreground">
                  2. Observable Defect Rates (Visual Evidence)
                </CardTitle>
                <CardDescription className="text-xs">
                  Adjust visual observations to test impact on realized transaction price.
                </CardDescription>
              </div>
              <Button
                size="sm"
                variant="ghost"
                onClick={() => {
                  setBrokenPercent(currentTolerance.maxBroken);
                  setDiscoloredPercent(currentTolerance.maxDiscolor);
                  setForeignMatterCount(currentTolerance.maxForeign);
                  setSurfaceDamagePercent(1.0);
                }}
                className="text-[11px] h-7 text-muted-foreground gap-1"
              >
                <RotateCcw className="w-3 h-3" /> Reset to FAQ Limits
              </Button>
            </CardHeader>

            <CardContent className="space-y-5">
              
              {/* Slider 1: Broken Grains */}
              <div className="space-y-2">
                <div className="flex items-center justify-between text-xs">
                  <span className="font-semibold text-foreground">Broken Grains:</span>
                  <div className="flex items-center gap-2">
                    <span className="font-mono font-bold text-amber-600">{brokenPercent.toFixed(1)}%</span>
                    <span className="text-[10px] text-muted-foreground font-mono">(FAQ Limit: {currentTolerance.maxBroken}%)</span>
                  </div>
                </div>
                <Slider
                  value={[brokenPercent]}
                  onValueChange={(val) => setBrokenPercent(val[0])}
                  min={0}
                  max={20}
                  step={0.1}
                  className="py-1"
                />
              </div>

              {/* Slider 2: Discolored / Shriveled */}
              <div className="space-y-2">
                <div className="flex items-center justify-between text-xs">
                  <span className="font-semibold text-foreground">Discolored / Shriveled:</span>
                  <div className="flex items-center gap-2">
                    <span className="font-mono font-bold text-orange-600">{discoloredPercent.toFixed(1)}%</span>
                    <span className="text-[10px] text-muted-foreground font-mono">(FAQ Limit: {currentTolerance.maxDiscolor}%)</span>
                  </div>
                </div>
                <Slider
                  value={[discoloredPercent]}
                  onValueChange={(val) => setDiscoloredPercent(val[0])}
                  min={0}
                  max={15}
                  step={0.1}
                  className="py-1"
                />
              </div>

              {/* Slider 3: Foreign Matter Count */}
              <div className="space-y-2">
                <div className="flex items-center justify-between text-xs">
                  <span className="font-semibold text-foreground">Foreign Matter Observations:</span>
                  <div className="flex items-center gap-2">
                    <span className="font-mono font-bold text-red-600">{foreignMatterCount} items</span>
                    <span className="text-[10px] text-muted-foreground font-mono">(FAQ Limit: {currentTolerance.maxForeign})</span>
                  </div>
                </div>
                <Slider
                  value={[foreignMatterCount]}
                  onValueChange={(val) => setForeignMatterCount(val[0])}
                  min={0}
                  max={10}
                  step={1}
                  className="py-1"
                />
              </div>

              {/* Slider 4: Surface Damage */}
              <div className="space-y-2">
                <div className="flex items-center justify-between text-xs">
                  <span className="font-semibold text-foreground">Surface Physical Damage:</span>
                  <span className="font-mono font-bold text-stone-600 dark:text-stone-300">{surfaceDamagePercent.toFixed(1)}%</span>
                </div>
                <Slider
                  value={[surfaceDamagePercent]}
                  onValueChange={(val) => setSurfaceDamagePercent(val[0])}
                  min={0}
                  max={10}
                  step={0.1}
                  className="py-1"
                />
              </div>

            </CardContent>
          </Card>
        </div>

        {/* Right Summary Card: Realized Price Calculation (5 cols) */}
        <div className="lg:col-span-5 space-y-5">
          <Card className="border-2 border-emerald-600/40 bg-card shadow-md">
            <CardHeader className="pb-3 bg-emerald-950/20 border-b border-border">
              <div className="flex items-center justify-between">
                <CardTitle className="text-base font-bold font-serif text-foreground">
                  Estimated Settlement Realization
                </CardTitle>
                <Badge variant="outline" className="text-[10px] font-mono border-emerald-600 text-emerald-700 dark:text-emerald-300">
                  Fair Price Protocol
                </Badge>
              </div>
            </CardHeader>

            <CardContent className="p-4 space-y-4">
              {/* Headline Price */}
              <div className="p-4 rounded-xl bg-muted/50 border border-border space-y-1 text-center">
                <span className="text-[11px] font-mono text-muted-foreground uppercase">Realized Price per Quintal</span>
                <div className="text-3xl font-black font-mono text-emerald-600 dark:text-emerald-400">
                  ₹{realizedPricePerQuintal.toLocaleString()}
                  <span className="text-xs font-normal text-muted-foreground ml-1">/ 100 kg</span>
                </div>
                <div className="text-xs font-mono font-semibold">
                  {netVariance >= 0 ? (
                    <span className="text-emerald-600">Base Price Protected (0% arbitrary cut)</span>
                  ) : (
                    <span className="text-amber-600">-₹{Math.round(totalDeductions)}/q deduction for visual defects</span>
                  )}
                </div>
              </div>

              {/* Total Lot Value */}
              <div className="p-3 rounded-lg border border-border bg-card space-y-1">
                <div className="flex justify-between text-xs">
                  <span className="text-muted-foreground">Total Lot Size:</span>
                  <span className="font-mono font-bold text-foreground">{lotQuantityQuintals} Quintals ({lotQuantityQuintals * 100} kg)</span>
                </div>
                <div className="flex justify-between text-xs">
                  <span className="text-muted-foreground">Standard Base Value:</span>
                  <span className="font-mono text-foreground">₹{baseLotValue.toLocaleString()}</span>
                </div>
                <div className="flex justify-between text-xs pt-1 border-t border-border font-bold">
                  <span className="text-foreground">Total Net Payable:</span>
                  <span className="font-mono text-emerald-600 dark:text-emerald-400 text-sm">₹{totalLotValue.toLocaleString()}</span>
                </div>
              </div>

              {/* Itemized Deduction Breakdown */}
              <div className="space-y-1.5 text-xs font-mono">
                <span className="font-bold text-[11px] text-foreground block uppercase font-sans">
                  Itemized Quality Adjustments:
                </span>

                <div className="flex justify-between py-1 border-b border-border/60 text-muted-foreground">
                  <span>Broken Grain Adjustment:</span>
                  <span className={brokenDeduction > 0 ? 'text-amber-600 font-bold' : 'text-emerald-600'}>
                    {brokenDeduction > 0 ? `-₹${brokenDeduction.toFixed(1)}/q` : '₹0.0 (Within Limit)'}
                  </span>
                </div>

                <div className="flex justify-between py-1 border-b border-border/60 text-muted-foreground">
                  <span>Discoloration Adjustment:</span>
                  <span className={discolorDeduction > 0 ? 'text-orange-600 font-bold' : 'text-emerald-600'}>
                    {discolorDeduction > 0 ? `-₹${discolorDeduction.toFixed(1)}/q` : '₹0.0 (Within Limit)'}
                  </span>
                </div>

                <div className="flex justify-between py-1 border-b border-border/60 text-muted-foreground">
                  <span>Foreign Matter Deduction:</span>
                  <span className={foreignDeduction > 0 ? 'text-red-600 font-bold' : 'text-emerald-600'}>
                    {foreignDeduction > 0 ? `-₹${foreignDeduction.toFixed(1)}/q` : '₹0.0 (Clean Sample)'}
                  </span>
                </div>

                {qualityPremium > 0 && (
                  <div className="flex justify-between py-1 border-b border-border/60 text-emerald-600 font-bold">
                    <span>Sound Grain Quality Premium:</span>
                    <span>+₹{qualityPremium.toFixed(1)}/q (+2.0%)</span>
                  </div>
                )}
              </div>

              {/* Action */}
              <Button asChild className="w-full bg-emerald-600 hover:bg-emerald-700 text-white text-xs gap-1.5 shadow-sm">
                <Link to={`/audit/new?crop=${encodeURIComponent(crop)}`}>
                  <Wheat className="w-3.5 h-3.5" />
                  <span>Create Verifiable Visual Record for This Lot</span>
                </Link>
              </Button>
            </CardContent>
          </Card>
        </div>

      </div>
    </div>
  );
};
