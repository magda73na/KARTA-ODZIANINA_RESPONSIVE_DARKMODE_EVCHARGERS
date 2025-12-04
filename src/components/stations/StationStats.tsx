import { Zap, Battery, Building2, Clock } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { useStationsBase } from "@/hooks/useStationsBase";
import { useEvPointsData } from "@/hooks/useEvPointsData";
import { Skeleton } from "@/components/ui/skeleton";

export function StationStats() {
  const { lodzStats, isLoading: loadingBase, error: errorBase } = useStationsBase();
  const { stats: dynamicStats, isLoading: loadingDynamic, generated } = useEvPointsData();

  const isLoading = loadingBase || loadingDynamic;

  // Combine stats - Łódź focused KPIs
  const statItems = lodzStats && dynamicStats ? [
    { 
      icon: Building2, 
      value: lodzStats.totalStations.toLocaleString('pl-PL'), 
      label: "Stacji w Łodzi", 
      ariaLabel: `${lodzStats.totalStations} stacji ładowania w Łodzi` 
    },
    { 
      icon: Battery, 
      value: lodzStats.openNow.toLocaleString('pl-PL'), 
      label: "Dostępnych teraz", 
      ariaLabel: `${lodzStats.openNow} stacji otwartych teraz` 
    },
    { 
      icon: Clock, 
      value: lodzStats.open24h.toLocaleString('pl-PL'), 
      label: "Całodobowych", 
      ariaLabel: `${lodzStats.open24h} stacji dostępnych 24/7` 
    },
    { 
      icon: Zap, 
      value: `${dynamicStats.avgPrice.toFixed(2)} zł`, 
      label: "Śr. cena/kWh", 
      ariaLabel: `Średnia cena ${dynamicStats.avgPrice.toFixed(2)} złotych za kWh` 
    },
  ] : [];

  if (isLoading) {
    return (
      <div 
        className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4 md:gap-4"
        role="list"
        aria-label="Ładowanie statystyk..."
        aria-busy="true"
      >
        {[...Array(4)].map((_, i) => (
          <Card key={i} className="bg-primary/5 border-primary/20">
            <CardContent className="p-3 sm:p-4 md:p-5">
              <div className="flex items-center gap-2.5 sm:gap-3">
                <Skeleton className="w-9 h-9 sm:w-10 sm:h-10 md:w-11 md:h-11 rounded-full" />
                <div className="min-w-0 space-y-1.5">
                  <Skeleton className="h-6 w-16" />
                  <Skeleton className="h-3 w-12" />
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    );
  }

  if (errorBase || !lodzStats || !dynamicStats) {
    return (
      <div className="text-center py-4 text-muted-foreground text-sm">
        Nie udało się załadować statystyk
      </div>
    );
  }

  return (
    <div className="space-y-2">
      <div 
        className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4 md:gap-4"
        role="list"
        aria-label="Statystyki stacji ładowania w Łodzi"
      >
        {statItems.map(({ icon: Icon, value, label, ariaLabel }) => (
          <Card 
            key={label} 
            className="bg-primary/5 border-primary/20 hover:bg-primary/10 transition-colors"
            role="listitem"
          >
            <CardContent className="p-3 sm:p-4 md:p-5">
              <div className="flex items-center gap-2.5 sm:gap-3">
                <div 
                  className="w-9 h-9 sm:w-10 sm:h-10 md:w-11 md:h-11 rounded-full bg-primary/10 flex items-center justify-center flex-shrink-0"
                  aria-hidden="true"
                >
                  <Icon className="h-4 w-4 sm:h-5 sm:w-5 md:h-5 md:w-5 text-primary" />
                </div>
                <div className="min-w-0">
                  <p 
                    className="text-xl sm:text-2xl md:text-2xl font-bold text-foreground truncate"
                    aria-label={ariaLabel}
                  >
                    {value}
                  </p>
                  <p className="text-xs sm:text-sm md:text-sm text-muted-foreground">{label}</p>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
      <p className="text-xs text-muted-foreground text-center">
        Dane EIPA/UDT {generated && `• Aktualizacja: ${new Date(generated).toLocaleDateString('pl-PL', { 
          day: 'numeric', 
          month: 'long', 
          year: 'numeric'
        })}`}
      </p>
    </div>
  );
}
