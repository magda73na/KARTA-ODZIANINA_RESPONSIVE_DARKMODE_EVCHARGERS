import { useState, useMemo, useEffect } from "react";
import { Footer } from "@/components/layout/Footer";
import { StationList } from "@/components/stations/StationList";
import { StationFilters, QuickFilters, StationFiltersType } from "@/components/stations/StationFilters";
import { LocationTracker } from "@/components/location/LocationTracker";
import { StationDetailSheet } from "@/components/stations/StationDetailSheet";
import { lodzStations, filterStations, sortStations, addDistanceToStations, SortOption } from "@/data/lodz-stations";
import { Station } from "@/types/station";
import { useGeolocation } from "@/hooks/useGeolocation";
import { useFavorites } from "@/hooks/useFavorites";
import { useNotifications } from "@/hooks/useNotifications";

export default function ListaStacji() {
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

  const { favorites, toggleFavorite, isFavorite } = useFavorites();
  const { permission, subscribe, unsubscribe, isSubscribed, isSupported: notifSupported } = useNotifications();

  useEffect(() => {
    if (geoSupported) {
      getCurrentPosition();
    }
  }, [geoSupported, getCurrentPosition]);

  const filteredAndSortedStations = useMemo(() => {
    let stations = filterStations(filters);
    if (position) {
      stations = addDistanceToStations(stations, position.latitude, position.longitude);
      stations = sortStations(stations, sortBy, position.latitude, position.longitude);
    } else {
      stations = sortStations(stations, sortBy);
    }
    return stations;
  }, [filters, position, sortBy]);

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

  const handleStationSelect = (station: Station) => {
    setSelectedStationId(station.id);
    setDetailSheetOpen(true);
  };

  return (
    <div className="flex-1 flex flex-col min-h-0">
      <main 
        id="main-content" 
        role="main" 
        aria-label="Lista stacji ładowania" 
        className="flex-1 overflow-y-auto"
      >
        <div className="container px-4 md:px-6 py-4 md:py-6">
          {/* Header */}
          <header className="mb-4 md:mb-6">
            <h1 className="text-xl sm:text-2xl md:text-3xl font-bold text-foreground">
              Lista stacji
            </h1>
            <p className="text-sm sm:text-base text-muted-foreground mt-1">
              Przeglądaj wszystkie stacje ładowania w Łodzi
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

          {/* Filters */}
          <section aria-labelledby="filters-heading" className="mb-4">
            <h2 id="filters-heading" className="sr-only">Filtry stacji</h2>
            <div className="flex flex-col gap-3">
              <StationFilters 
                filters={filters} 
                onFiltersChange={setFilters} 
                activeFilterCount={activeFilterCount}
                sortBy={sortBy}
                onSortChange={setSortBy}
                hasLocation={!!position}
              />
              <QuickFilters filters={filters} onFiltersChange={setFilters} />
            </div>
          </section>

          {/* Station List */}
          <section aria-labelledby="stations-heading">
            <h2 id="stations-heading" className="sr-only">Lista stacji ładowania</h2>
            <StationList 
              stations={filteredAndSortedStations}
              onStationSelect={handleStationSelect}
              selectedStationId={selectedStationId}
              favorites={favorites}
              onToggleFavorite={toggleFavorite}
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
