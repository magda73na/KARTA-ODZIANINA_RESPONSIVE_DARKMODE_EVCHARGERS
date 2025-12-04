import { useState, useMemo, useEffect, useCallback } from "react";
import { Footer } from "@/components/layout/Footer";
import { HeroSection } from "@/components/hero/HeroSection";
import { LeafletMap } from "@/components/map/LeafletMap";
import { StationList } from "@/components/stations/StationList";
import { StationFilters, QuickFilters, StationFiltersType } from "@/components/stations/StationFilters";
import { StationStats } from "@/components/stations/StationStats";
import { StationDetailSheet } from "@/components/stations/StationDetailSheet";
import { LocationTracker } from "@/components/location/LocationTracker";
import { PriceComparison } from "@/components/stations/PriceComparison";
import { FavoritesPanel } from "@/components/stations/FavoritesPanel";
import { ChargingHistoryPanel } from "@/components/history/ChargingHistoryPanel";
import { RoutePlanner } from "@/components/route/RoutePlanner";
import { lodzStations, filterStations, sortStations, addDistanceToStations, SortOption } from "@/data/lodz-stations";
import { Station } from "@/types/station";
import { useGeolocation } from "@/hooks/useGeolocation";
import { useFavorites } from "@/hooks/useFavorites";
import { useNotifications } from "@/hooks/useNotifications";
import { useStationAvailability } from "@/hooks/useStationAvailability";

const Index = () => {
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
  
  const { position, isLoading: geoLoading, getCurrentPosition, isSupported: geoSupported } = useGeolocation({
    watchPosition: false,
  });

  const { favorites, toggleFavorite, removeFavorite, isFavorite } = useFavorites();
  const { 
    permission, 
    subscribe, 
    unsubscribe, 
    isSubscribed,
    isSupported: notifSupported 
  } = useNotifications();

  // Realtime availability
  const { allAvailability } = useStationAvailability(undefined, true);

  // Auto-get position on mount
  useEffect(() => {
    if (geoSupported) {
      getCurrentPosition();
    }
  }, [geoSupported, getCurrentPosition]);

  const filteredAndSortedStations = useMemo(() => {
    let stations = filterStations(filters);
    
    // Add real distances if we have user position
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
  }, [filters, position, sortBy, allAvailability]);

  const selectedStation = useMemo(() => 
    lodzStations.find(s => s.id === selectedStationId) || null,
    [selectedStationId]
  );

  const activeFilterCount = useMemo(() => {
    let count = 0;
    if (filters.availability && filters.availability !== 'all') count++;
    if (filters.powerCategories && filters.powerCategories.length < 3) count++;
    if (filters.connectorTypes && filters.connectorTypes.length > 0) count++;
    if (filters.operator && filters.operator !== 'all') count++;
    if (filters.maxPrice) count++;
    if (filters.onlyOpen) count++;
    return count;
  }, [filters]);

  const handleStationSelect = useCallback((station: Station) => {
    setSelectedStationId(station.id);
    setDetailSheetOpen(true);
  }, []);

  const handleCloseDetail = useCallback(() => {
    setDetailSheetOpen(false);
  }, []);

  return (
    <div className="flex-1 flex flex-col bg-background">
      <main 
        id="main-content" 
        role="main" 
        className="flex-1"
        aria-label="Główna zawartość - Wyszukiwarka stacji ładowania EV"
      >
        <HeroSection />

        {/* Stats Section */}
        <section 
          aria-labelledby="stats-heading"
          className="py-4 sm:py-6 md:py-8 lg:py-10"
        >
          <div className="container px-3 sm:px-4 md:px-6 lg:px-6">
            <h2 id="stats-heading" className="sr-only">Statystyki sieci ładowania</h2>
            <StationStats />
          </div>
        </section>

        {/* Location Tracker */}
        <section 
          aria-label="Śledzenie lokalizacji"
          className="py-2 sm:py-3 md:py-4"
        >
          <div className="container px-3 sm:px-4 md:px-6 lg:px-6">
            <LocationTracker
              position={position}
              isLoading={geoLoading}
              onRequestLocation={getCurrentPosition}
              isSupported={geoSupported}
            />
          </div>
        </section>

        {/* Map Section */}
        <section 
          id="map" 
          aria-labelledby="map-heading"
          className="py-4 sm:py-6 md:py-8 lg:py-10"
        >
          <div className="container px-3 sm:px-4 md:px-6 lg:px-6">
            <header className="mb-3 sm:mb-4 md:mb-6">
              <h2 
                id="map-heading"
                className="text-lg sm:text-xl md:text-2xl lg:text-2xl font-bold text-foreground mb-1 sm:mb-1.5"
              >
                Interaktywna Mapa
              </h2>
              <p className="text-xs sm:text-sm md:text-sm text-muted-foreground">
                Dotknij znaczników, aby zobaczyć szczegóły stacji
              </p>
            </header>
            <LeafletMap 
              stations={filteredAndSortedStations}
              onStationSelect={handleStationSelect}
              selectedStationId={selectedStationId}
              userPosition={position}
              className="h-[280px] sm:h-[350px] md:h-[450px] lg:h-[500px] xl:h-[550px]"
            />
          </div>
        </section>

        {/* Stations List */}
        <section 
          id="stations" 
          aria-labelledby="stations-heading"
          className="py-4 sm:py-6 md:py-8 lg:py-10 bg-muted/30"
        >
          <div className="container px-3 sm:px-4 md:px-6 lg:px-6">
            <div className="flex flex-col gap-3 sm:gap-4 md:gap-5 mb-4 sm:mb-5 md:mb-6">
              <div className="flex flex-col gap-3 sm:gap-4 md:flex-row md:items-center md:justify-between">
                <header>
                  <h2 
                    id="stations-heading"
                    className="text-lg sm:text-xl md:text-2xl lg:text-2xl font-bold text-foreground mb-0.5 sm:mb-1"
                  >
                    Wszystkie Stacje
                  </h2>
                  <p 
                    className="text-xs sm:text-sm md:text-sm text-muted-foreground"
                    aria-live="polite"
                    aria-atomic="true"
                  >
                    {filteredAndSortedStations.length} stacji dostępnych
                    {position && <span className="text-primary ml-1">• Wg odległości</span>}
                  </p>
                </header>
                <aside 
                  role="complementary" 
                  aria-label="Narzędzia i filtry"
                  className="flex items-center gap-1.5 sm:gap-2 flex-wrap"
                >
                  <ChargingHistoryPanel stations={lodzStations} />
                  <RoutePlanner 
                    stations={lodzStations}
                    userPosition={position}
                    onStationSelect={handleStationSelect}
                  />
                  <FavoritesPanel 
                    stations={lodzStations}
                    favorites={favorites}
                    onStationSelect={handleStationSelect}
                    onRemoveFavorite={removeFavorite}
                  />
                  <PriceComparison
                    stations={lodzStations}
                    onStationSelect={handleStationSelect}
                    favorites={favorites}
                    onToggleFavorite={toggleFavorite}
                  />
                  <StationFilters 
                    filters={filters}
                    onFiltersChange={setFilters}
                    activeFilterCount={activeFilterCount}
                    sortBy={sortBy}
                    onSortChange={setSortBy}
                    hasLocation={!!position}
                  />
                </aside>
              </div>
              <QuickFilters filters={filters} onFiltersChange={setFilters} />
            </div>

            <StationList 
              stations={filteredAndSortedStations}
              onStationSelect={handleStationSelect}
              selectedStationId={selectedStationId}
              favorites={favorites}
              onToggleFavorite={toggleFavorite}
            />
          </div>
        </section>
      </main>

      <Footer />

      {/* Station Detail Sheet - Modal dialog */}
      <StationDetailSheet 
        station={selectedStation}
        open={detailSheetOpen}
        onClose={handleCloseDetail}
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
};

export default Index;
