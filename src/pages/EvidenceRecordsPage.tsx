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
  Layers
} from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { format } from 'date-fns';

export const EvidenceRecordsPage: React.FC = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCrop, setSelectedCrop] = useState<string>('all');

  const allAudits = getAuditHistory();

  const filteredAudits = allAudits.filter(audit => {
    const matchesSearch = 
      audit.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
      audit.metadata.lotId.toLowerCase().includes(searchTerm.toLowerCase()) ||
      audit.metadata.crop.toLowerCase().includes(searchTerm.toLowerCase()) ||
      audit.metadata.location.toLowerCase().includes(searchTerm.toLowerCase());

    const matchesCrop = selectedCrop === 'all' || audit.metadata.crop === selectedCrop;

    return matchesSearch && matchesCrop;
  });

  const crops = ['all', 'Wheat', 'Paddy (Rice)', 'Mustard'];

  return (
    <div className="space-y-6 pb-16">
      
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-border">
        <div className="space-y-1">
          <h1 className="text-xl sm:text-2xl font-serif font-bold text-foreground">
            Verifiable Evidence Records Repository
          </h1>
          <p className="text-xs text-muted-foreground">
            Searchable repository of standardized agricultural produce audits with SHA-256 cryptographic seals.
          </p>
        </div>

        <Button asChild size="sm" className="bg-primary text-primary-foreground text-xs shrink-0">
          <Link to="/audit/new">
            <Camera className="w-3.5 h-3.5 mr-1.5" />
            New Audit
          </Link>
        </Button>
      </div>

      {/* Filter and Search Bar */}
      <div className="flex flex-col sm:flex-row items-center gap-3">
        <div className="relative flex-1 w-full">
          <Search className="w-4 h-4 text-muted-foreground absolute left-3 top-1/2 -translate-y-1/2" />
          <Input
            placeholder="Search by Audit ID, Lot ID, Crop, or Mandi location..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-9 text-xs h-9 bg-card"
          />
        </div>

        {/* Crop filter chips */}
        <div className="flex items-center gap-1.5 overflow-x-auto w-full sm:w-auto">
          {crops.map((c) => (
            <button
              key={c}
              type="button"
              onClick={() => setSelectedCrop(c)}
              className={`px-3 py-1.5 rounded-full text-xs font-mono font-medium transition-colors whitespace-nowrap ${
                selectedCrop === c
                  ? 'bg-primary text-primary-foreground font-semibold shadow-xs'
                  : 'bg-muted text-muted-foreground hover:bg-muted/80'
              }`}
            >
              {c === 'all' ? 'All Crops' : c}
            </button>
          ))}
        </div>
      </div>

      {/* Audits List */}
      <div className="space-y-3">
        {filteredAudits.length === 0 ? (
          <div className="p-12 text-center border border-dashed border-border rounded-xl space-y-3">
            <Layers className="w-10 h-10 text-muted-foreground mx-auto opacity-50" />
            <h3 className="font-bold text-sm">No Evidence Records Found</h3>
            <p className="text-xs text-muted-foreground max-w-sm mx-auto">
              No audits matched your search criteria. You can create a new audit using the 10cm×10cm calibration sheet.
            </p>
            <Button asChild size="sm" variant="outline" className="text-xs">
              <Link to="/audit/new">Start New Audit</Link>
            </Button>
          </div>
        ) : (
          filteredAudits.map((audit) => (
            <Card 
              key={audit.id} 
              className="border border-border bg-card shadow-xs hover:border-primary/50 transition-colors overflow-hidden"
            >
              <CardContent className="p-4 flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
                
                {/* Thumbnail & Basic Info */}
                <div className="flex items-start sm:items-center gap-4 w-full md:w-auto">
                  <div className="relative w-20 h-20 sm:w-24 sm:h-24 rounded-lg overflow-hidden bg-stone-900 shrink-0 border border-border">
                    <img
                      src={audit.imageUrl}
                      alt={audit.metadata.crop}
                      className="w-full h-full object-cover"
                    />
                    <div className="absolute top-1 left-1 bg-black/80 text-[8px] font-mono text-emerald-400 px-1 rounded">
                      10x10cm
                    </div>
                  </div>

                  <div className="space-y-1 flex-1 min-w-0">
                    <div className="flex items-center gap-2 flex-wrap">
                      <span className="font-mono text-xs font-bold text-primary">{audit.id}</span>
                      <Badge variant="outline" className="font-mono text-[10px]">
                        Lot: {audit.metadata.lotId}
                      </Badge>
                      {audit.isDemo && (
                        <Badge className="bg-amber-500/15 text-amber-800 dark:text-amber-300 text-[10px] font-mono">
                          DEMO
                        </Badge>
                      )}
                    </div>

                    <h3 className="font-bold text-sm text-foreground">
                      {audit.metadata.crop} — {audit.metadata.variety || 'Standard Sample'}
                    </h3>

                    <div className="flex items-center gap-3 text-[11px] text-muted-foreground flex-wrap">
                      <span className="flex items-center gap-1">
                        <MapPin className="w-3 h-3 text-stone-400" />
                        {audit.metadata.location}
                      </span>
                      <span>•</span>
                      <span className="flex items-center gap-1">
                        <Calendar className="w-3 h-3 text-stone-400" />
                        {format(new Date(audit.metadata.captureTimestamp), 'dd MMM yyyy, HH:mm')}
                      </span>
                    </div>
                  </div>
                </div>

                {/* Observable Evidence Summary & Action */}
                <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3 w-full md:w-auto justify-end border-t md:border-t-0 pt-3 md:pt-0 border-border">
                  
                  {/* Observable metrics pills */}
                  <div className="grid grid-cols-3 gap-2 text-center font-mono text-[10px] bg-muted/40 p-2 rounded-lg border border-border">
                    <div>
                      <span className="text-muted-foreground block text-[9px]">Broken %:</span>
                      <span className="font-bold text-amber-700 dark:text-amber-400">{audit.stats.brokenPercent}%</span>
                    </div>
                    <div>
                      <span className="text-muted-foreground block text-[9px]">Foreign:</span>
                      <span className="font-bold text-red-700 dark:text-red-400">{audit.stats.foreignObjectCount} units</span>
                    </div>
                    <div>
                      <span className="text-muted-foreground block text-[9px]">Discolor %:</span>
                      <span className="font-bold text-orange-700 dark:text-orange-400">{audit.stats.discoloredPercent}%</span>
                    </div>
                  </div>

                  <Button asChild size="sm" variant="default" className="text-xs whitespace-nowrap">
                    <Link to={`/records/${audit.id}`}>
                      Inspect Visual Evidence
                      <ArrowRight className="w-3.5 h-3.5 ml-1.5" />
                    </Link>
                  </Button>
                </div>

              </CardContent>
            </Card>
          ))
        )}
      </div>

    </div>
  );
};
