import { useState, useCallback, useMemo } from "react";
import { Station } from "@/types/station";
import { StationCard } from "./StationCard";
import { StationSearch } from "./StationSearch";
import { Button } from "@/components/ui/button";
import { List, Grid3X3, ChevronDown } from "lucide-react";
import { cn } from "@/lib/utils";
import { useStationAvailability } from "@/hooks/useStationAvailability";

interface StationListProps {
  stations: Station[];
  onStationSelect?: (station: Station) => void;
  selectedStationId?: string | null;
  favorites?: string[];
  onToggleFavorite?: (stationId: string) => void;
}

export function StationList({ 
  stations, 
  onStationSelect, 
  selectedStationId,
  favorites = [],
  onToggleFavorite 
}: StationListProps) {
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const [visibleCount, setVisibleCount] = useState(6);
  const [searchQuery, setSearchQuery] = useState("");
  
  // Realtime availability
  const { allAvailability, isLoading: availabilityLoading } = useStationAvailability(undefined, true);

  // Filter stations by search query
  const filteredStations = useMemo(() => {
    if (!searchQuery || searchQuery.length < 2) return stations;
    
    const query = searchQuery.toLowerCase().trim();
    return stations.filter(station => 
      station.name.toLowerCase().includes(query) ||
      station.address.full.toLowerCase().includes(query) ||
      station.address.street.toLowerCase().includes(query) ||
      station.operator.name.toLowerCase().includes(query)
    );
  }, [stations, searchQuery]);

  // Merge realtime availability data with stations
  const stationsWithAvailability = useMemo(() => {
    if (!allAvailability.length) return filteredStations;
    
    return filteredStations.map(station => {
      const realtimeData = allAvailability.find(a => a.stationId === station.id);
      if (realtimeData) {
        return {
          ...station,
          availableChargers: realtimeData.availableConnectors,
          totalChargers: realtimeData.totalConnectors,
        };
      }
      return station;
    });
  }, [filteredStations, allAvailability]);

  const visibleStations = stationsWithAvailability.slice(0, visibleCount);
  const hasMore = visibleCount < stationsWithAvailability.length;

  const loadMore = () => {
    setVisibleCount(prev => Math.min(prev + 6, stationsWithAvailability.length));
  };

  const handleSearch = useCallback((query: string) => {
    setSearchQuery(query);
    setVisibleCount(6); // Reset pagination on search
  }, []);

  return (
    <div className="space-y-3 sm:space-y-4">
      {/* Search Bar */}
      <div className="sticky top-0 z-10 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 py-1.5 sm:py-2 -mx-3 px-3 sm:-mx-4 sm:px-4 md:mx-0 md:px-0">
        <StationSearch 
          onSearch={handleSearch}
          isSearching={availabilityLoading}
        />
      </div>

      {/* Results Header & View Toggle */}
      <div className="flex items-center justify-between gap-2 sm:gap-4">
        <p 
          className="text-xs sm:text-sm text-muted-foreground"
          role="status"
          aria-live="polite"
          aria-atomic="true"
        >
          {searchQuery.length >= 2 ? (
            <>Znaleziono <strong className="text-foreground">{stationsWithAvailability.length}</strong></>
          ) : (
            <><strong className="text-foreground">{visibleStations.length}</strong> z {stationsWithAvailability.length}</>
          )}
        </p>
        
        <div 
          className="flex gap-0.5 sm:gap-1" 
          role="group" 
          aria-label="Zmień widok listy"
        >
          <Button
            variant={viewMode === 'grid' ? 'secondary' : 'ghost'}
            size="icon"
            className="h-8 w-8 sm:h-9 sm:w-9 md:h-10 md:w-10 min-h-[32px] min-w-[32px] sm:min-h-[36px] sm:min-w-[36px] md:min-h-[44px] md:min-w-[44px] focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
            onClick={() => setViewMode('grid')}
            aria-label="Widok siatki"
            aria-pressed={viewMode === 'grid'}
          >
            <Grid3X3 className="h-4 w-4 md:h-4 md:w-4" aria-hidden="true" />
          </Button>
          <Button
            variant={viewMode === 'list' ? 'secondary' : 'ghost'}
            size="icon"
            className="h-8 w-8 sm:h-9 sm:w-9 md:h-10 md:w-10 min-h-[32px] min-w-[32px] sm:min-h-[36px] sm:min-w-[36px] md:min-h-[44px] md:min-w-[44px] focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
            onClick={() => setViewMode('list')}
            aria-label="Widok listy"
            aria-pressed={viewMode === 'list'}
          >
            <List className="h-4 w-4 md:h-4 md:w-4" aria-hidden="true" />
          </Button>
        </div>
      </div>

      {/* Stations Grid/List */}
      <div 
        className={cn(
          viewMode === 'grid' 
            ? "grid grid-cols-1 sm:grid-cols-2 md:grid-cols-2 lg:grid-cols-3 gap-3 sm:gap-4 md:gap-5"
            : "flex flex-col gap-2 sm:gap-3 md:gap-4"
        )}
        role="list"
        aria-label="Lista stacji ładowania"
      >
        {visibleStations.map((station) => (
          <div key={station.id} role="listitem">
            <StationCard
              station={station}
              onSelect={onStationSelect}
              isSelected={selectedStationId === station.id}
              compact={viewMode === 'list'}
              isFavorite={favorites.includes(station.id)}
              onToggleFavorite={onToggleFavorite}
            />
          </div>
        ))}
      </div>

      {/* Load More */}
      {hasMore && (
        <div className="flex justify-center pt-3 sm:pt-4">
          <Button
            variant="outline"
            onClick={loadMore}
            className="h-10 sm:h-10 md:h-11 px-5 sm:px-6 md:px-6 min-h-[40px] sm:min-h-[44px] md:min-h-[44px] text-sm touch-manipulation focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 gap-1.5"
            aria-label={`Załaduj więcej. ${visibleCount} z ${stationsWithAvailability.length}`}
          >
            Załaduj Więcej
            <ChevronDown className="h-4 w-4" aria-hidden="true" />
          </Button>
        </div>
      )}

      {/* Empty State */}
      {stationsWithAvailability.length === 0 && (
        <div 
          className="text-center py-12"
          role="status"
          aria-label="Brak wyników"
        >
          {searchQuery.length >= 2 ? (
            <>
              <p className="text-muted-foreground">Brak stacji pasujących do „{searchQuery}"</p>
              <p className="text-sm text-muted-foreground mt-1">Spróbuj zmienić kryteria wyszukiwania.</p>
            </>
          ) : (
            <>
              <p className="text-muted-foreground">Brak stacji pasujących do filtrów.</p>
              <p className="text-sm text-muted-foreground mt-1">Spróbuj zmienić kryteria wyszukiwania.</p>
            </>
          )}
        </div>
      )}
    </div>
  );
}
