import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import type { AuditRecord } from '@/types/evidence';
import { getAuditHistory } from '@/lib/storage';
import { 
  Search, 
  Filter, 
  ShieldCheck, 
  ArrowRight, 
  Calendar, 
  MapPin, 
  CheckCircle2,
  Camera,
  Layers,
  Lock
} from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { format } from 'date-fns';

export const EvidenceRecordsPage: React.FC = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCrop, setSelectedCrop] = useState<string>('all');

  const allAudits: AuditRecord[] = getAuditHistory();

  const filteredAudits = allAudits.filter((audit: AuditRecord) => {
    const matchesSearch = 
      audit.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
      audit.metadata.lotId.toLowerCase().includes(searchTerm.toLowerCase()) ||
      audit.metadata.crop.toLowerCase().includes(searchTerm.toLowerCase()) ||
      audit.metadata.location.toLowerCase().includes(searchTerm.toLowerCase());

    const matchesCrop = selectedCrop === 'all' || audit.metadata.crop === selectedCrop;

    return matchesSearch && matchesCrop;
  });

  const crops = ['all', 'Wheat', 'Paddy (Rice)', 'Mustard', 'Soybean', 'Maize', 'Chana (Chickpea)'];

  return (
    <div className="space-y-6 pb-16">
      
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-border">
        <div className="space-y-1">
          <h1 className="text-xl sm:text-2xl font-serif font-bold text-foreground">
            Verifiable Evidence Records Repository
          </h1>
          <p className="text-xs text-muted-foreground">
            Immutable cryptographic records of observable crop qualities captured across APMC Mandis.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <Button asChild size="sm" className="bg-emerald-600 hover:bg-emerald-700 text-white text-xs gap-1.5 shadow-sm">
            <Link to="/audit/new">
              <Camera className="w-3.5 h-3.5" />
              <span>Create New Audit</span>
            </Link>
          </Button>
          <Button asChild size="sm" variant="outline" className="text-xs gap-1.5">
            <Link to="/showcase">
              <Layers className="w-3.5 h-3.5 text-emerald-600" />
              <span>Benchmark Showcase</span>
            </Link>
          </Button>
        </div>
      </div>

      {/* Filter & Search Bar */}
      <div className="flex flex-col sm:flex-row items-center gap-3">
        <div className="relative flex-1 w-full">
          <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" />
          <Input
            placeholder="Search by Evidence ID, Lot ID, Crop, or APMC Mandi location..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-9 text-xs h-9"
          />
        </div>

        <div className="flex items-center gap-1.5 overflow-x-auto w-full sm:w-auto pb-1 sm:pb-0">
          {crops.map((crop) => (
            <Button
              key={crop}
              type="button"
              variant={selectedCrop === crop ? 'default' : 'outline'}
              size="sm"
              onClick={() => setSelectedCrop(crop)}
              className="text-xs h-8 capitalize shrink-0"
            >
              {crop === 'all' ? 'All Commodities' : crop}
            </Button>
          ))}
        </div>
      </div>

      {/* Records Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {filteredAudits.map((audit: AuditRecord) => (
          <Card key={audit.id} className="border border-border hover:border-emerald-600/60 transition-all bg-card shadow-xs flex flex-col justify-between">
            <CardContent className="p-4 space-y-3 flex-1 flex flex-col justify-between">
              <div className="space-y-2">
                <div className="flex items-start justify-between gap-2">
                  <div className="flex items-center gap-2.5">
                    <img
                      src={audit.imageUrl}
                      alt={audit.metadata.crop}
                      className="w-12 h-12 rounded-lg object-cover border border-border shrink-0"
                    />
                    <div>
                      <span className="font-bold text-sm text-foreground block">
                        {audit.metadata.crop}
                      </span>
                      <span className="text-[10px] font-mono text-muted-foreground block">
                        Lot: {audit.metadata.lotId}
                      </span>
                    </div>
                  </div>

                  <Badge variant="outline" className="font-mono text-[10px] border-border text-foreground">
                    {audit.id}
                  </Badge>
                </div>

                <div className="flex items-center gap-2 text-[11px] text-muted-foreground">
                  <MapPin className="w-3 h-3 text-emerald-600 shrink-0" />
                  <span className="truncate">{audit.metadata.location}</span>
                </div>

                {/* Metrics strip */}
                <div className="grid grid-cols-3 gap-1.5 p-2 rounded-lg bg-muted/40 border border-border text-center font-mono text-[10px]">
                  <div>
                    <span className="text-muted-foreground block text-[8px]">BROKEN</span>
                    <span className="font-bold text-amber-600">{audit.stats.brokenPercent}%</span>
                  </div>
                  <div>
                    <span className="text-muted-foreground block text-[8px]">DISCOLOR</span>
                    <span className="font-bold text-orange-600">{audit.stats.discoloredPercent}%</span>
                  </div>
                  <div>
                    <span className="text-muted-foreground block text-[8px]">SOUND</span>
                    <span className="font-bold text-emerald-600">{audit.stats.soundGrainRatePercent}%</span>
                  </div>
                </div>
              </div>

              <div className="pt-2 border-t border-border flex items-center justify-between text-xs">
                <span className="text-[10px] font-mono text-emerald-600 flex items-center gap-1">
                  <Lock className="w-3 h-3" />
                  SHA-256 Sealed
                </span>
                <Button asChild size="sm" variant="ghost" className="h-7 text-xs font-medium text-emerald-600 hover:text-emerald-700">
                  <Link to={`/records/${audit.id}`}>
                    Inspect Visual Evidence
                    <ArrowRight className="w-3 h-3 ml-1" />
                  </Link>
                </Button>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {filteredAudits.length === 0 && (
        <div className="text-center py-12 p-6 border border-dashed border-border rounded-xl bg-card">
          <p className="text-sm text-muted-foreground">No evidence records matched your search filters.</p>
          <Button
            variant="outline"
            size="sm"
            onClick={() => { setSearchTerm(''); setSelectedCrop('all'); }}
            className="mt-3 text-xs"
          >
            Clear Filters
          </Button>
        </div>
      )}
    </div>
  );
};
