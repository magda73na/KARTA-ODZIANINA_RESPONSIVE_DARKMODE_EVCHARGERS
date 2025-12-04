import { useState, useMemo } from "react";
import { lodzStations } from "@/data/lodz-stations";
import { useFavorites } from "@/hooks/useFavorites";
import { useNotifications } from "@/hooks/useNotifications";
import { Station } from "@/types/station";
import { StationDetailSheet } from "@/components/stations/StationDetailSheet";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { TrendingDown, TrendingUp, Minus, Zap, MapPin, BarChart3, ChevronRight, Star } from "lucide-react";
import { cn } from "@/lib/utils";

type PriceTier = 'cheap' | 'moderate' | 'expensive';

const getPriceTier = (price: number): PriceTier => {
  if (price <= 1.5) return 'cheap';
  if (price <= 2.0) return 'moderate';
  return 'expensive';
};

const getPriceTierConfig = (tier: PriceTier) => {
  switch (tier) {
    case 'cheap':
      return { 
        label: 'Tani', 
        icon: TrendingDown,
        bgColor: 'bg-primary/10 border-primary/20'
      };
    case 'moderate':
      return { 
        label: 'Średni', 
        icon: Minus,
        bgColor: 'bg-amber-500/10 border-amber-500/20'
      };
    case 'expensive':
      return { 
        label: 'Drogi', 
        icon: TrendingUp,
        bgColor: 'bg-destructive/10 border-destructive/20'
      };
  }
};

export default function PorownanieCen() {
  const [powerFilter, setPowerFilter] = useState<'all' | 'ac' | 'dc'>('all');
  const [selectedStation, setSelectedStation] = useState<Station | null>(null);
  const [detailSheetOpen, setDetailSheetOpen] = useState(false);
  
  const { favorites, toggleFavorite, isFavorite } = useFavorites();
  const { permission, subscribe, unsubscribe, isSubscribed, isSupported: notifSupported } = useNotifications();

  const sortedStations = useMemo(() => {
    let filtered = lodzStations.filter(s => s.avgPricePerKwh);
    
    if (powerFilter === 'ac') {
      filtered = filtered.filter(s => s.powerCategory === 'ac');
    } else if (powerFilter === 'dc') {
      filtered = filtered.filter(s => s.powerCategory === 'fast' || s.powerCategory === 'ultra');
    }
    
    return filtered.sort((a, b) => (a.avgPricePerKwh || 0) - (b.avgPricePerKwh || 0));
  }, [powerFilter]);

  const priceStats = useMemo(() => {
    const prices = sortedStations.map(s => s.avgPricePerKwh || 0);
    if (prices.length === 0) return { min: 0, max: 0, avg: 0 };
    return {
      min: Math.min(...prices),
      max: Math.max(...prices),
      avg: prices.reduce((a, b) => a + b, 0) / prices.length,
    };
  }, [sortedStations]);

  const tierCounts = useMemo(() => ({
    cheap: sortedStations.filter(s => getPriceTier(s.avgPricePerKwh || 0) === 'cheap').length,
    moderate: sortedStations.filter(s => getPriceTier(s.avgPricePerKwh || 0) === 'moderate').length,
    expensive: sortedStations.filter(s => getPriceTier(s.avgPricePerKwh || 0) === 'expensive').length,
  }), [sortedStations]);

  const handleStationSelect = (station: Station) => {
    setSelectedStation(station);
    setDetailSheetOpen(true);
  };

  return (
    <main id="main-content" role="main" aria-label="Porównanie cen" className="flex-1 flex flex-col">
      <div className="container px-4 md:px-6 py-6">
        <header className="mb-6">
          <h1 className="text-2xl md:text-3xl font-bold text-foreground flex items-center gap-2">
            <BarChart3 className="h-7 w-7" />
            Porównanie cen
          </h1>
          <p className="text-muted-foreground mt-1">Porównaj ceny energii w różnych stacjach</p>
        </header>

        {/* Price Stats */}
        <div className="grid grid-cols-3 gap-3 mb-6">
          <Card className="bg-primary/5 border-primary/20">
            <CardContent className="p-3 text-center">
              <p className="text-xs text-muted-foreground">Najniższa</p>
              <p className="text-lg font-bold text-primary">{priceStats.min.toFixed(2)}</p>
              <p className="text-xs text-muted-foreground">PLN/kWh</p>
            </CardContent>
          </Card>
          <Card className="bg-muted/50">
            <CardContent className="p-3 text-center">
              <p className="text-xs text-muted-foreground">Średnia</p>
              <p className="text-lg font-bold">{priceStats.avg.toFixed(2)}</p>
              <p className="text-xs text-muted-foreground">PLN/kWh</p>
            </CardContent>
          </Card>
          <Card className="bg-destructive/5 border-destructive/20">
            <CardContent className="p-3 text-center">
              <p className="text-xs text-muted-foreground">Najwyższa</p>
              <p className="text-lg font-bold text-destructive">{priceStats.max.toFixed(2)}</p>
              <p className="text-xs text-muted-foreground">PLN/kWh</p>
            </CardContent>
          </Card>
        </div>

        {/* Tier Summary */}
        <div className="flex gap-2 mb-6">
          {(['cheap', 'moderate', 'expensive'] as PriceTier[]).map(tier => {
            const config = getPriceTierConfig(tier);
            return (
              <Badge key={tier} variant="outline" className={cn("flex-1 justify-center py-1.5", config.bgColor)}>
                <config.icon className="h-3 w-3 mr-1" />
                {config.label}: {tierCounts[tier]}
              </Badge>
            );
          })}
        </div>

        {/* Filter */}
        <div className="mb-6">
          <Select value={powerFilter} onValueChange={(v) => setPowerFilter(v as typeof powerFilter)}>
            <SelectTrigger className="h-10 w-full sm:w-[200px]">
              <SelectValue placeholder="Typ ładowania" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">Wszystkie typy</SelectItem>
              <SelectItem value="ac">Tylko AC (≤22 kW)</SelectItem>
              <SelectItem value="dc">Tylko DC (szybkie)</SelectItem>
            </SelectContent>
          </Select>
        </div>

        {/* Station List */}
        <section aria-labelledby="prices-heading">
          <h2 id="prices-heading" className="sr-only">Ranking cen stacji</h2>
          <div className="space-y-2">
            {sortedStations.map((station, index) => {
              const tier = getPriceTier(station.avgPricePerKwh || 0);
              const config = getPriceTierConfig(tier);
              const isFav = favorites.includes(station.id);
              
              return (
                <Card 
                  key={station.id} 
                  className={cn(
                    "cursor-pointer transition-all hover:shadow-md active:scale-[0.99]",
                    config.bgColor
                  )}
                  onClick={() => handleStationSelect(station)}
                >
                  <CardContent className="p-3">
                    <div className="flex items-center gap-3">
                      <div className={cn(
                        "w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold",
                        index === 0 ? "bg-primary text-primary-foreground" : "bg-muted text-muted-foreground"
                      )}>
                        {index + 1}
                      </div>
                      
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2">
                          <h4 className="font-semibold text-sm truncate">{station.name}</h4>
                          <Button
                            variant="ghost"
                            size="icon"
                            className="h-6 w-6 flex-shrink-0"
                            onClick={(e) => {
                              e.stopPropagation();
                              toggleFavorite(station.id);
                            }}
                            aria-label={isFav ? "Usuń z ulubionych" : "Dodaj do ulubionych"}
                          >
                            <Star className={cn("h-4 w-4", isFav ? "fill-amber-400 text-amber-400" : "text-muted-foreground")} />
                          </Button>
                        </div>
                        <div className="flex items-center gap-2 text-xs text-muted-foreground">
                          <MapPin className="h-3 w-3" />
                          <span className="truncate">{station.address.street}</span>
                        </div>
                      </div>

                      <div className="flex flex-col items-end gap-1">
                        <span className="text-lg font-bold">{station.avgPricePerKwh?.toFixed(2)}</span>
                        <div className="flex items-center gap-1">
                          <Zap className="h-3 w-3 text-muted-foreground" />
                          <span className="text-xs text-muted-foreground">{station.maxPower} kW</span>
                        </div>
                      </div>

                      <ChevronRight className="h-5 w-5 text-muted-foreground flex-shrink-0" />
                    </div>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        </section>
      </div>

      <StationDetailSheet 
        station={selectedStation}
        open={detailSheetOpen}
        onClose={() => setDetailSheetOpen(false)}
        isFavorite={selectedStation ? isFavorite(selectedStation.id) : false}
        onToggleFavorite={toggleFavorite}
        isSubscribed={selectedStation ? isSubscribed(selectedStation.id) : false}
        onSubscribe={subscribe}
        onUnsubscribe={unsubscribe}
        notificationPermission={permission}
        notificationsSupported={notifSupported}
      />
    </main>
  );
}
