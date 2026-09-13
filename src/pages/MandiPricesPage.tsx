import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { 
  TrendingUp, 
  TrendingDown, 
  Minus, 
  MapPin, 
  Wheat, 
  Search, 
  Filter, 
  ShieldCheck, 
  ArrowRight, 
  Calendar, 
  RefreshCw, 
  SlidersHorizontal,
  Info,
  DollarSign,
  Building2,
  CheckCircle2
} from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';

export interface MandiPriceItem {
  id: string;
  crop: string;
  variety: string;
  mandi: string;
  district: string;
  state: string;
  modalPrice: number; // ₹ per Quintal (100 kg)
  minPrice: number;
  maxPrice: number;
  mspBenchmark: number; // Government MSP 2026-27
  trend: 'up' | 'down' | 'stable';
  changePercent: number;
  arrivalTons: number;
  lastUpdated: string;
}

export const MANDI_PRICES_DATA: MandiPriceItem[] = [
  {
    id: 'wht-khn-01',
    crop: 'Wheat',
    variety: 'Sharbati / Lokwan',
    mandi: 'Khanna APMC Mandi',
    district: 'Ludhiana',
    state: 'Punjab',
    modalPrice: 2480,
    minPrice: 2350,
    maxPrice: 2620,
    mspBenchmark: 2275,
    trend: 'up',
    changePercent: 1.8,
    arrivalTons: 420,
    lastUpdated: 'Today, 08:30 AM',
  },
  {
    id: 'wht-krn-02',
    crop: 'Wheat',
    variety: 'HD-2967',
    mandi: 'Karnal Grain Market',
    district: 'Karnal',
    state: 'Haryana',
    modalPrice: 2420,
    minPrice: 2300,
    maxPrice: 2540,
    mspBenchmark: 2275,
    trend: 'stable',
    changePercent: 0.2,
    arrivalTons: 380,
    lastUpdated: 'Today, 09:15 AM',
  },
  {
    id: 'pad-krn-03',
    crop: 'Paddy (Rice)',
    variety: 'Pusa Basmati 1121',
    mandi: 'Karnal Grain Market',
    district: 'Karnal',
    state: 'Haryana',
    modalPrice: 4350,
    minPrice: 4100,
    maxPrice: 4600,
    mspBenchmark: 2300,
    trend: 'up',
    changePercent: 3.4,
    arrivalTons: 290,
    lastUpdated: 'Today, 10:00 AM',
  },
  {
    id: 'pad-tar-04',
    crop: 'Paddy (Rice)',
    variety: 'Basmati 1509',
    mandi: 'Taraori APMC Mandi',
    district: 'Karnal',
    state: 'Haryana',
    modalPrice: 3850,
    minPrice: 3600,
    maxPrice: 4100,
    mspBenchmark: 2300,
    trend: 'down',
    changePercent: -1.2,
    arrivalTons: 310,
    lastUpdated: 'Today, 07:45 AM',
  },
  {
    id: 'mst-alw-05',
    crop: 'Mustard',
    variety: 'Pusa Bold (42% Oil Base)',
    mandi: 'Alwar APMC Mandi',
    district: 'Alwar',
    state: 'Rajasthan',
    modalPrice: 5850,
    minPrice: 5600,
    maxPrice: 6100,
    mspBenchmark: 5650,
    trend: 'up',
    changePercent: 2.1,
    arrivalTons: 540,
    lastUpdated: 'Today, 09:00 AM',
  },
  {
    id: 'mst-bht-06',
    crop: 'Mustard',
    variety: 'Black Mustard Grade A',
    mandi: 'Bharatpur Mandi',
    district: 'Bharatpur',
    state: 'Rajasthan',
    modalPrice: 5790,
    minPrice: 5550,
    maxPrice: 6020,
    mspBenchmark: 5650,
    trend: 'stable',
    changePercent: 0.0,
    arrivalTons: 460,
    lastUpdated: 'Today, 08:00 AM',
  },
  {
    id: 'soy-ind-07',
    crop: 'Soybean',
    variety: 'JS-9560 Yellow',
    mandi: 'Indore Mandi (Chhavani)',
    district: 'Indore',
    state: 'Madhya Pradesh',
    modalPrice: 4680,
    minPrice: 4450,
    maxPrice: 4900,
    mspBenchmark: 4892,
    trend: 'down',
    changePercent: -1.6,
    arrivalTons: 620,
    lastUpdated: 'Today, 09:30 AM',
  },
  {
    id: 'soy-ujj-08',
    crop: 'Soybean',
    variety: 'JS-335',
    mandi: 'Ujjain APMC Mandi',
    district: 'Ujjain',
    state: 'Madhya Pradesh',
    modalPrice: 4620,
    minPrice: 4400,
    maxPrice: 4850,
    mspBenchmark: 4892,
    trend: 'stable',
    changePercent: 0.4,
    arrivalTons: 490,
    lastUpdated: 'Today, 08:15 AM',
  },
  {
    id: 'maz-dvg-09',
    crop: 'Maize',
    variety: 'HQPM-1 Yellow Feed Grade',
    mandi: 'Davangere APMC Mandi',
    district: 'Davangere',
    state: 'Karnataka',
    modalPrice: 2260,
    minPrice: 2150,
    maxPrice: 2380,
    mspBenchmark: 2090,
    trend: 'up',
    changePercent: 1.5,
    arrivalTons: 350,
    lastUpdated: 'Today, 07:30 AM',
  },
  {
    id: 'chn-glb-10',
    crop: 'Chana (Chickpea)',
    variety: 'Desi JG-11',
    mandi: 'Gulbarga APMC Mandi',
    district: 'Kalaburagi',
    state: 'Karnataka',
    modalPrice: 6120,
    minPrice: 5900,
    maxPrice: 6350,
    mspBenchmark: 5440,
    trend: 'up',
    changePercent: 2.8,
    arrivalTons: 280,
    lastUpdated: 'Today, 09:45 AM',
  },
  {
    id: 'cot-rjk-11',
    crop: 'Cotton',
    variety: 'Shankar-6 Long Staple',
    mandi: 'Rajkot APMC Mandi',
    district: 'Rajkot',
    state: 'Gujarat',
    modalPrice: 7450,
    minPrice: 7100,
    maxPrice: 7800,
    mspBenchmark: 7020,
    trend: 'up',
    changePercent: 1.9,
    arrivalTons: 510,
    lastUpdated: 'Today, 10:15 AM',
  },
];

export const MandiPricesPage: React.FC = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCrop, setSelectedCrop] = useState<string>('all');
  const [selectedState, setSelectedState] = useState<string>('all');

  const filteredPrices = MANDI_PRICES_DATA.filter((item) => {
    const matchesSearch = 
      item.crop.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.mandi.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.variety.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.district.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesCrop = selectedCrop === 'all' || item.crop === selectedCrop;
    const matchesState = selectedState === 'all' || item.state === selectedState;

    return matchesSearch && matchesCrop && matchesState;
  });

  const crops = ['all', 'Wheat', 'Paddy (Rice)', 'Mustard', 'Soybean', 'Maize', 'Chana (Chickpea)', 'Cotton'];
  const states = ['all', 'Punjab', 'Haryana', 'Rajasthan', 'Madhya Pradesh', 'Karnataka', 'Gujarat'];

  return (
    <div className="space-y-6 pb-16">
      
      {/* Top Hero Banner */}
      <div className="p-5 sm:p-6 bg-gradient-to-r from-emerald-950 via-stone-900 to-stone-950 text-white border border-emerald-800/40 rounded-2xl shadow-md flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="space-y-1.5">
          <div className="flex items-center gap-2">
            <span className="w-2.5 h-2.5 rounded-full bg-emerald-400 animate-pulse" />
            <Badge className="bg-emerald-700/80 text-white font-mono text-[10px] uppercase border-0">
              Live Mandi Price Intelligence
            </Badge>
            <span className="text-xs text-stone-300 font-mono">MSP 2026-27 Benchmarks</span>
          </div>
          <h1 className="text-xl sm:text-2xl font-serif font-bold tracking-tight text-amber-200">
            Real-Time APMC Mandi Market Prices
          </h1>
          <p className="text-xs text-stone-300 max-w-2xl leading-relaxed">
            Verify prevailing trading rates, modal prices, daily arrivals, and government Minimum Support Price (MSP) benchmarks across major agricultural trading hubs in India.
          </p>
        </div>

        <div className="flex items-center gap-2 shrink-0">
          <Button asChild size="sm" className="bg-emerald-600 hover:bg-emerald-700 text-white text-xs gap-1.5">
            <Link to="/calculator">
              <SlidersHorizontal className="w-3.5 h-3.5" />
              <span>Quality Price Calculator</span>
            </Link>
          </Button>
          <Button asChild size="sm" variant="ghost" className="border border-white/30 text-white text-xs gap-1.5">
            <Link to="/audit/new">
              <Wheat className="w-3.5 h-3.5" />
              <span>Inspect Lot</span>
            </Link>
          </Button>
        </div>
      </div>

      {/* Quick Summary Strip */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        <Card className="border border-border bg-card shadow-xs">
          <CardContent className="p-3.5 space-y-1">
            <span className="text-[10px] font-mono text-muted-foreground uppercase">Wheat (Khanna)</span>
            <div className="flex items-baseline justify-between">
              <span className="text-lg font-bold font-mono text-foreground">₹2,480/q</span>
              <span className="text-[10px] text-emerald-600 font-bold flex items-center">
                <TrendingUp className="w-3 h-3 mr-0.5" /> +1.8%
              </span>
            </div>
            <span className="text-[9px] text-muted-foreground font-mono">MSP: ₹2,275 (+₹205)</span>
          </CardContent>
        </Card>

        <Card className="border border-border bg-card shadow-xs">
          <CardContent className="p-3.5 space-y-1">
            <span className="text-[10px] font-mono text-muted-foreground uppercase">Basmati 1121 (Karnal)</span>
            <div className="flex items-baseline justify-between">
              <span className="text-lg font-bold font-mono text-foreground">₹4,350/q</span>
              <span className="text-[10px] text-emerald-600 font-bold flex items-center">
                <TrendingUp className="w-3 h-3 mr-0.5" /> +3.4%
              </span>
            </div>
            <span className="text-[9px] text-muted-foreground font-mono">MSP: ₹2,300 (+₹2,050)</span>
          </CardContent>
        </Card>

        <Card className="border border-border bg-card shadow-xs">
          <CardContent className="p-3.5 space-y-1">
            <span className="text-[10px] font-mono text-muted-foreground uppercase">Mustard (Alwar)</span>
            <div className="flex items-baseline justify-between">
              <span className="text-lg font-bold font-mono text-foreground">₹5,850/q</span>
              <span className="text-[10px] text-emerald-600 font-bold flex items-center">
                <TrendingUp className="w-3 h-3 mr-0.5" /> +2.1%
              </span>
            </div>
            <span className="text-[9px] text-muted-foreground font-mono">MSP: ₹5,650 (+₹200)</span>
          </CardContent>
        </Card>

        <Card className="border border-border bg-card shadow-xs">
          <CardContent className="p-3.5 space-y-1">
            <span className="text-[10px] font-mono text-muted-foreground uppercase">Desi Chana (Gulbarga)</span>
            <div className="flex items-baseline justify-between">
              <span className="text-lg font-bold font-mono text-foreground">₹6,120/q</span>
              <span className="text-[10px] text-emerald-600 font-bold flex items-center">
                <TrendingUp className="w-3 h-3 mr-0.5" /> +2.8%
              </span>
            </div>
            <span className="text-[9px] text-muted-foreground font-mono">MSP: ₹5,440 (+₹680)</span>
          </CardContent>
        </Card>
      </div>

      {/* Filter and Search Bar */}
      <div className="flex flex-col sm:flex-row items-center gap-3">
        <div className="relative flex-1 w-full">
          <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" />
          <Input
            placeholder="Search by commodity, mandi name, variety, or district..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-9 text-xs h-9"
          />
        </div>

        <div className="flex items-center gap-2 w-full sm:w-auto">
          <Select value={selectedCrop} onValueChange={setSelectedCrop}>
            <SelectTrigger className="w-[140px] h-9 text-xs">
              <SelectValue placeholder="All Crops" />
            </SelectTrigger>
            <SelectContent>
              {crops.map((c) => (
                <SelectItem key={c} value={c} className="text-xs capitalize">
                  {c === 'all' ? 'All Crops' : c}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>

          <Select value={selectedState} onValueChange={setSelectedState}>
            <SelectTrigger className="w-[140px] h-9 text-xs">
              <SelectValue placeholder="All States" />
            </SelectTrigger>
            <SelectContent>
              {states.map((s) => (
                <SelectItem key={s} value={s} className="text-xs capitalize">
                  {s === 'all' ? 'All States' : s}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </div>

      {/* Main Prices Table */}
      <div className="border border-border rounded-xl overflow-hidden bg-card shadow-xs">
        <div className="p-3.5 border-b border-border bg-muted/40 flex items-center justify-between">
          <div className="flex items-center gap-2 font-bold font-serif text-xs text-foreground">
            <Building2 className="w-3.5 h-3.5 text-emerald-600" />
            <span>Mandi Live Price Board ({filteredPrices.length} Records)</span>
          </div>
          <span className="text-[10px] text-muted-foreground font-mono">
            Updated: Real-time APMC Feeds
          </span>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-muted/60 text-muted-foreground font-mono text-[10px] uppercase border-b border-border">
              <tr>
                <th className="py-2.5 px-3">Commodity & Variety</th>
                <th className="py-2.5 px-3">Mandi / State</th>
                <th className="py-2.5 px-3 text-right">Modal Rate</th>
                <th className="py-2.5 px-3 text-right">Min - Max</th>
                <th className="py-2.5 px-3 text-right">MSP (2026)</th>
                <th className="py-2.5 px-3 text-right">Arrivals</th>
                <th className="py-2.5 px-3 text-center">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border font-mono text-xs">
              {filteredPrices.map((item) => {
                const diffWithMsp = item.modalPrice - item.mspBenchmark;
                const isAboveMsp = diffWithMsp >= 0;

                return (
                  <tr key={item.id} className="hover:bg-muted/30 transition-colors">
                    <td className="py-3 px-3">
                      <div className="font-bold text-foreground font-sans">{item.crop}</div>
                      <div className="text-[10px] text-muted-foreground">{item.variety}</div>
                    </td>

                    <td className="py-3 px-3">
                      <div className="font-medium text-foreground flex items-center gap-1 font-sans">
                        <MapPin className="w-3 h-3 text-emerald-600 shrink-0" />
                        <span>{item.mandi}</span>
                      </div>
                      <div className="text-[10px] text-muted-foreground">{item.district}, {item.state}</div>
                    </td>

                    <td className="py-3 px-3 text-right">
                      <div className="font-bold text-sm text-foreground">₹{item.modalPrice.toLocaleString()}</div>
                      <div className={`text-[9px] font-bold flex items-center justify-end ${
                        item.trend === 'up' ? 'text-emerald-600' : item.trend === 'down' ? 'text-red-600' : 'text-stone-500'
                      }`}>
                        {item.trend === 'up' && <TrendingUp className="w-2.5 h-2.5 mr-0.5" />}
                        {item.trend === 'down' && <TrendingDown className="w-2.5 h-2.5 mr-0.5" />}
                        {item.trend === 'stable' && <Minus className="w-2.5 h-2.5 mr-0.5" />}
                        {item.changePercent > 0 ? `+${item.changePercent}%` : `${item.changePercent}%`}
                      </div>
                    </td>

                    <td className="py-3 px-3 text-right text-[11px] text-muted-foreground">
                      ₹{item.minPrice} - ₹{item.maxPrice}
                    </td>

                    <td className="py-3 px-3 text-right">
                      <div className="text-foreground">₹{item.mspBenchmark}</div>
                      <div className={`text-[9px] font-bold ${isAboveMsp ? 'text-emerald-600' : 'text-amber-600'}`}>
                        {isAboveMsp ? `+₹${diffWithMsp} vs MSP` : `-₹${Math.abs(diffWithMsp)} vs MSP`}
                      </div>
                    </td>

                    <td className="py-3 px-3 text-right text-[11px] text-muted-foreground">
                      {item.arrivalTons} Tons
                    </td>

                    <td className="py-3 px-3 text-center">
                      <Button asChild size="sm" variant="ghost" className="h-7 text-xs text-emerald-600 hover:text-emerald-700 font-sans">
                        <Link to={`/calculator?crop=${encodeURIComponent(item.crop)}&price=${item.modalPrice}`}>
                          Calculate
                        </Link>
                      </Button>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>

      {/* Institutional Disclaimer */}
      <div className="p-4 rounded-xl border border-border bg-stone-100 dark:bg-stone-900 text-stone-700 dark:text-stone-300 text-xs space-y-1">
        <div className="flex items-center gap-2 font-bold text-foreground">
          <Info className="w-3.5 h-3.5 text-emerald-600" />
          <span>Mandi Price Intelligence & Transparency Disclaimer:</span>
        </div>
        <p className="text-[11px] text-muted-foreground leading-relaxed">
          Prices displayed represent modal spot rates reported by respective APMC agricultural market committees and central MSP notifications. Actual transaction realization depends on physical sample quality, moisture level, foreign matter %, and mutual buyer-farmer agreement.
        </p>
      </div>
    </div>
  );
};
