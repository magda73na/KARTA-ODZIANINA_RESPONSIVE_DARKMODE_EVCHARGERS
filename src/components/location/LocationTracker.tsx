import { MapPin, Navigation, Loader2, AlertCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";
import { GeolocationPosition } from "@/hooks/useGeolocation";

interface LocationTrackerProps {
  position: GeolocationPosition | null;
  isLoading: boolean;
  onRequestLocation: () => void;
  isSupported: boolean;
}

export function LocationTracker({
  position,
  isLoading,
  onRequestLocation,
  isSupported,
}: LocationTrackerProps) {
  if (!isSupported) {
    return (
      <div 
        className="flex items-center gap-2 p-3 bg-destructive/10 border border-destructive/20 rounded-lg"
        role="alert"
        aria-live="polite"
      >
        <AlertCircle className="h-4 w-4 text-destructive" aria-hidden="true" />
        <span className="text-sm text-destructive">
          Twoja przeglądarka nie obsługuje geolokalizacji
        </span>
      </div>
    );
  }

  return (
    <section 
      className="flex flex-col sm:flex-row items-start sm:items-center gap-3 p-3 sm:p-4 md:p-4 bg-primary/5 border border-primary/20 rounded-lg"
      aria-labelledby="location-heading"
      role="region"
    >
      <div className="flex items-center gap-2.5 flex-1">
        {position ? (
          <>
            <div 
              className="w-9 h-9 sm:w-10 sm:h-10 rounded-full bg-primary/20 flex items-center justify-center flex-shrink-0"
              aria-hidden="true"
            >
              <MapPin className="h-4 w-4 sm:h-5 sm:w-5 text-primary" />
            </div>
            <div className="min-w-0 flex-1">
              <h2 id="location-heading" className="text-sm sm:text-base font-medium text-foreground">
                Lokalizacja aktywna
              </h2>
              <p className="text-xs sm:text-sm text-muted-foreground">
                Stacje sortowane według odległości od Twojej pozycji
              </p>
            </div>
            <Badge 
              variant="secondary" 
              className="ml-2 text-xs flex-shrink-0"
              aria-label={`Dokładność lokalizacji: plus minus ${Math.round(position.accuracy)} metrów`}
            >
              ±{Math.round(position.accuracy)}m
            </Badge>
          </>
        ) : (
          <>
            <div 
              className="w-9 h-9 sm:w-10 sm:h-10 rounded-full bg-muted flex items-center justify-center flex-shrink-0"
              aria-hidden="true"
            >
              <Navigation className="h-4 w-4 sm:h-5 sm:w-5 text-muted-foreground" />
            </div>
            <div className="min-w-0 flex-1">
              <h2 id="location-heading" className="text-sm sm:text-base font-medium text-foreground">
                Włącz lokalizację
              </h2>
              <p className="text-xs sm:text-sm text-muted-foreground">
                Znajdź najbliższe stacje ładowania
              </p>
            </div>
          </>
        )}
      </div>

      <Button
        variant={position ? "outline" : "default"}
        size="sm"
        onClick={onRequestLocation}
        disabled={isLoading}
        className="h-9 sm:h-10 md:h-10 min-h-[36px] sm:min-h-[40px] md:min-h-[44px] touch-manipulation w-full sm:w-auto focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 gap-1.5 sm:gap-2"
        aria-label={isLoading ? 'Trwa pobieranie lokalizacji' : position ? 'Odśwież swoją pozycję GPS' : 'Włącz usługi lokalizacji GPS'}
        aria-busy={isLoading}
      >
        {isLoading ? (
          <>
            <Loader2 className="h-4 w-4 animate-spin" aria-hidden="true" />
            <span className="hidden sm:inline">Lokalizowanie...</span>
            <span className="sm:hidden">GPS...</span>
          </>
        ) : position ? (
          <>
            <Navigation className="h-4 w-4" aria-hidden="true" />
            <span className="hidden sm:inline">Odśwież pozycję</span>
            <span className="sm:hidden">Odśwież</span>
          </>
        ) : (
          <>
            <MapPin className="h-4 w-4" aria-hidden="true" />
            <span>Użyj GPS</span>
          </>
        )}
      </Button>
    </section>
  );
}
