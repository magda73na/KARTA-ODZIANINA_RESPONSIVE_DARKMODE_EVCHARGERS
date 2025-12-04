import { useState, useMemo, useEffect } from "react";
import { Footer } from "@/components/layout/Footer";
import { LeafletMap } from "@/components/map/LeafletMap";
import { StationFilters, QuickFilters, StationFiltersType } from "@/components/stations/StationFilters";
import { LocationTracker } from "@/components/location/LocationTracker";
import { StationDetailSheet } from "@/components/stations/StationDetailSheet";
import { StationSearch } from "@/components/stations/StationSearch";
import { lodzStations, filterStations, sortStations, addDistanceToStations, SortOption } from "@/data/lodz-stations";
import { Station } from "@/types/station";
import { useGeolocation } from "@/hooks/useGeolocation";
import { useFavorites } from "@/hooks/useFavorites";
import { useNotifications } from "@/hooks/useNotifications";
import { useStationAvailability } from "@/hooks/useStationAvailability";
import { useCallback } from "react";

export default function MapaLadowarek() {
  const [filters, setFilters] = useState<StationFiltersType>({
    availability: 'all',
    powerCategories: ['ac', 'fast', 'ultra'],
    connectorTypes: [],
    operator: 'all',
    onlyOpen: false,
  });
  const [selectedStationId, setSelectedStationId] = useState<string | null>(null);
  const [detailSheetOpen, setDetailSheetOpen] = useState(false);
  const [sortBy, setSortBy] = useState<SortOption>('distance');
  const [searchQuery, setSearchQuery] = useState("");
  
  const { position, isLoading: geoLoading, getCurrentPosition, isSupported: geoSupported } = useGeolocation({
    watchPosition: false,
  });

  const { favorites, toggleFavorite, isFavorite } = useFavorites();
  const { permission, subscribe, unsubscribe, isSubscribed, isSupported: notifSupported } = useNotifications();
  const { allAvailability, isLoading: availabilityLoading } = useStationAvailability(undefined, true);

  useEffect(() => {
    if (geoSupported) {
      getCurrentPosition();
    }
  }, [geoSupported, getCurrentPosition]);

  // Filter by search and filters
  const filteredStations = useMemo(() => {
    let stations = filterStations(filters);
    
    // Apply search
    if (searchQuery && searchQuery.length >= 2) {
      const query = searchQuery.toLowerCase().trim();
      stations = stations.filter(station => 
        station.name.toLowerCase().includes(query) ||
        station.address.full.toLowerCase().includes(query) ||
        station.address.street.toLowerCase().includes(query) ||
        station.operator.name.toLowerCase().includes(query)
      );
    }
    
    // Add distance and sort
    if (position) {
      stations = addDistanceToStations(stations, position.latitude, position.longitude);
      stations = sortStations(stations, sortBy, position.latitude, position.longitude);
    } else {
      stations = sortStations(stations, sortBy);
    }
    
    // Merge realtime availability
    if (allAvailability.length) {
      stations = stations.map(station => {
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
    }
    
    return stations;
  }, [filters, position, sortBy, searchQuery, allAvailability]);

  const selectedStation = useMemo(() => 
    lodzStations.find(s => s.id === selectedStationId) || null,
    [selectedStationId]
  );

  const activeFilterCount = useMemo(() => {
    let count = 0;
    if (filters.availability && filters.availability !== 'all') count++;
    if (filters.powerCategories && filters.powerCategories.length < 3) count++;
    if (filters.connectorTypes && filters.connectorTypes.length > 0) count++;
    if (filters.onlyOpen) count++;
    return count;
  }, [filters]);

  const handleStationSelect = useCallback((station: Station) => {
    setSelectedStationId(station.id);
    setDetailSheetOpen(true);
  }, []);

  const handleSearch = useCallback((query: string) => {
    setSearchQuery(query);
  }, []);

  return (
    <div className="flex-1 flex flex-col min-h-0">
      <main 
        id="main-content" 
        role="main" 
        aria-label="Mapa ładowarek EV" 
        className="flex-1 overflow-y-auto"
      >
        <div className="container px-4 md:px-6 py-4 md:py-6">
          {/* Header */}
          <header className="mb-4 md:mb-6">
            <h1 className="text-xl sm:text-2xl md:text-3xl font-bold text-foreground">
              Mapa ładowarek
            </h1>
            <p className="text-sm sm:text-base text-muted-foreground mt-1">
              Znajdź najbliższą stację ładowania w Łodzi
            </p>
          </header>

          {/* Location Tracker */}
          <section aria-label="Śledzenie lokalizacji" className="mb-4">
            <LocationTracker
              position={position}
              isLoading={geoLoading}
              onRequestLocation={getCurrentPosition}
              isSupported={geoSupported}
            />
          </section>

          {/* Search & Filters */}
          <section aria-labelledby="search-filters-heading" className="mb-4 space-y-3">
            <h2 id="search-filters-heading" className="sr-only">Wyszukiwanie i filtry</h2>
            
            <StationSearch 
              onSearch={handleSearch}
              isSearching={availabilityLoading}
            />
            
            <div className="flex flex-col sm:flex-row sm:items-center gap-3">
              <StationFilters 
                filters={filters} 
                onFiltersChange={setFilters} 
                activeFilterCount={activeFilterCount}
                sortBy={sortBy}
                onSortChange={setSortBy}
                hasLocation={!!position}
              />
            </div>
            
            <QuickFilters filters={filters} onFiltersChange={setFilters} />
          </section>

          {/* Results Count */}
          <div 
            className="mb-3 text-sm text-muted-foreground"
            role="status"
            aria-live="polite"
          >
            {searchQuery.length >= 2 ? (
              <>Znaleziono <strong className="text-foreground">{filteredStations.length}</strong> stacji dla „{searchQuery}"</>
            ) : (
              <><strong className="text-foreground">{filteredStations.length}</strong> stacji na mapie</>
            )}
          </div>

          {/* Map - Proper positioning below header/nav */}
          <section 
            aria-label="Interaktywna mapa ładowarek EV" 
            className="rounded-lg overflow-hidden border border-border"
          >
            <LeafletMap 
              stations={filteredStations} 
              userPosition={position}
              onStationSelect={handleStationSelect}
              selectedStationId={selectedStationId}
              className="h-[50vh] sm:h-[55vh] md:h-[60vh] lg:h-[65vh] w-full"
            />
          </section>
        </div>

        <Footer />
      </main>

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
    </div>
  );
}
