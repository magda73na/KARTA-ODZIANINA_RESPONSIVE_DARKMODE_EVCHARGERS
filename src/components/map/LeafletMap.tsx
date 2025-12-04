import { useEffect, useRef, useState, useCallback } from 'react';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import { Station } from '@/types/station';
import { Button } from '@/components/ui/button';
import { Locate, ZoomIn, ZoomOut, Layers } from 'lucide-react';
import { cn } from '@/lib/utils';
import { GeolocationPosition } from '@/hooks/useGeolocation';

interface LeafletMapProps {
  stations: Station[];
  onStationSelect?: (station: Station) => void;
  selectedStationId?: string | null;
  userPosition?: GeolocationPosition | null;
  className?: string;
}

// Custom marker icons
const createMarkerIcon = (available: boolean, powerCategory: string) => {
  const color = !available ? '#6b7280' : // gray for unavailable
    powerCategory === 'ultra' ? '#8b5cf6' : // purple for ultra
    powerCategory === 'fast' ? '#f59e0b' : // amber for fast
    '#22c55e'; // green for AC

  return L.divIcon({
    className: 'custom-marker',
    html: `
      <div class="relative">
        <div class="w-8 h-8 sm:w-10 sm:h-10 rounded-full flex items-center justify-center shadow-lg transition-transform hover:scale-110" style="background-color: ${color}">
          <svg class="w-4 h-4 sm:w-5 sm:h-5 text-white" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
            <path d="M13 3L4 14h7v7l9-11h-7V3z"/>
          </svg>
        </div>
        ${available ? '<span class="absolute -top-1 -right-1 w-3 h-3 bg-green-400 rounded-full animate-pulse border-2 border-white"></span>' : ''}
        <div class="absolute left-1/2 -translate-x-1/2 top-full w-0 h-0 border-l-[6px] border-r-[6px] border-t-[8px] border-l-transparent border-r-transparent" style="border-top-color: ${color}"></div>
      </div>
    `,
    iconSize: [40, 48],
    iconAnchor: [20, 48],
    popupAnchor: [0, -48]
  });
};

const createUserMarkerIcon = () => {
  return L.divIcon({
    className: 'user-marker',
    html: `
      <div class="relative">
        <div class="w-6 h-6 rounded-full bg-blue-500 border-4 border-white shadow-lg flex items-center justify-center">
          <div class="w-2 h-2 bg-white rounded-full"></div>
        </div>
        <div class="absolute -inset-2 bg-blue-500/30 rounded-full animate-ping"></div>
      </div>
    `,
    iconSize: [24, 24],
    iconAnchor: [12, 12],
  });
};

export function LeafletMap({ stations, onStationSelect, selectedStationId, userPosition, className }: LeafletMapProps) {
  const mapContainer = useRef<HTMLDivElement>(null);
  const map = useRef<L.Map | null>(null);
  const markersRef = useRef<Map<string, L.Marker>>(new Map());
  const userMarkerRef = useRef<L.Marker | null>(null);
  const lastTriggerRef = useRef<HTMLElement | null>(null);
  const [mapStyle, setMapStyle] = useState<'light' | 'dark'>('light');
  const [statusMessage, setStatusMessage] = useState<string>('');
  const [openPopupStationId, setOpenPopupStationId] = useState<string | null>(null);

  // Close all popups and restore focus
  const closeAllPopups = useCallback(() => {
    map.current?.closePopup();
    setOpenPopupStationId(null);
    if (lastTriggerRef.current) {
      lastTriggerRef.current.focus();
      lastTriggerRef.current = null;
    }
    setStatusMessage('Zamknięto popup');
  }, []);

  // Handle ESC key to close popup
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && openPopupStationId) {
        closeAllPopups();
      }
    };

    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, [openPopupStationId, closeAllPopups]);

  // Łódź center coordinates
  const CENTER: L.LatLngExpression = [51.7592, 19.4560];
  const DEFAULT_ZOOM = 12;

  useEffect(() => {
    if (!mapContainer.current || map.current) return;

    // Initialize map
    map.current = L.map(mapContainer.current, {
      center: CENTER,
      zoom: DEFAULT_ZOOM,
      zoomControl: false,
      attributionControl: false,
      keyboard: true,
      keyboardPanDelta: 80
    });

    // Add tile layer
    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
      maxZoom: 19
    }).addTo(map.current);

    // Add attribution
    L.control.attribution({
      position: 'bottomleft',
      prefix: '© OpenStreetMap'
    }).addTo(map.current);

    // Click on map (not on marker) closes popup
    map.current.on('click', () => {
      closeAllPopups();
    });

    return () => {
      map.current?.remove();
      map.current = null;
    };
  }, [closeAllPopups]);

  // Update user position marker
  useEffect(() => {
    if (!map.current) return;

    if (userPosition) {
      if (userMarkerRef.current) {
        userMarkerRef.current.setLatLng([userPosition.latitude, userPosition.longitude]);
      } else {
        userMarkerRef.current = L.marker(
          [userPosition.latitude, userPosition.longitude],
          { icon: createUserMarkerIcon() }
        ).addTo(map.current);
        
        userMarkerRef.current.bindPopup(`
          <div class="p-2 text-center">
            <p class="font-semibold text-sm">Twoja lokalizacja</p>
            <p class="text-xs text-gray-500">Dokładność: ±${Math.round(userPosition.accuracy)}m</p>
          </div>
        `);
      }
    }
  }, [userPosition]);

  // Update markers when stations change
  useEffect(() => {
    if (!map.current) return;

    // Clear existing markers
    markersRef.current.forEach(marker => marker.remove());
    markersRef.current.clear();

    // Add new markers
    stations.forEach(station => {
      const isAvailable = station.availableChargers > 0;
      const icon = createMarkerIcon(isAvailable, station.powerCategory);

      const marker = L.marker([station.latitude, station.longitude], { 
        icon,
        alt: `Stacja ${station.name}, ${station.address.street}, ${isAvailable ? 'dostępna' : 'zajęta'}, ${station.maxPower} kW`
      })
        .addTo(map.current!);

      // Create popup content with close button
      const popupContent = `
        <div class="p-3 min-w-[220px] relative" role="dialog" aria-label="Szczegóły stacji ${station.name}" aria-modal="true">
          <button 
            class="popup-close-btn absolute top-1 right-1 w-7 h-7 flex items-center justify-center rounded-full hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-blue-500 transition-colors"
            aria-label="Zamknij okno mapy"
            data-station-id="${station.id}"
          >
            <svg class="w-4 h-4 text-gray-500" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
              <path d="M18 6L6 18M6 6l12 12"/>
            </svg>
          </button>
          <h3 class="font-semibold text-sm mb-1 pr-6" tabindex="-1" id="popup-title-${station.id}">${station.name}</h3>
          <p class="text-xs text-gray-600 mb-2">${station.address.full}</p>
          <div class="flex items-center gap-2 text-xs mb-1">
            <span class="font-medium">${station.availableChargers}/${station.totalChargers}</span>
            <span class="text-gray-500">ładowarek dostępnych</span>
          </div>
          <div class="flex items-center gap-2 text-xs">
            <span class="font-medium">${station.maxPower} kW</span>
            <span class="text-gray-500">maks. moc</span>
          </div>
          ${station.distance ? `
            <div class="flex items-center gap-2 text-xs mt-1">
              <span class="font-medium text-blue-600">${station.distance}</span>
              <span class="text-gray-500">od Ciebie</span>
            </div>
          ` : ''}
          ${station.avgPricePerKwh ? `
            <div class="flex items-center gap-2 text-xs mt-1">
              <span class="font-medium text-green-600">${station.avgPricePerKwh.toFixed(2)} PLN/kWh</span>
            </div>
          ` : ''}
        </div>
      `;

      marker.bindPopup(popupContent, {
        closeButton: false,
        className: 'custom-popup',
        autoPan: true,
        keepInView: true
      });

      // Handle popup open - focus management
      marker.on('popupopen', () => {
        setOpenPopupStationId(station.id);
        // Focus on popup title after it opens
        setTimeout(() => {
          const titleEl = document.getElementById(`popup-title-${station.id}`);
          titleEl?.focus();
          
          // Add click handler to close button
          const closeBtn = document.querySelector(`.popup-close-btn[data-station-id="${station.id}"]`);
          closeBtn?.addEventListener('click', (e) => {
            e.stopPropagation();
            closeAllPopups();
          });
        }, 100);
        setStatusMessage(`Otwarto szczegóły stacji ${station.name}`);
      });

      // Handle popup close
      marker.on('popupclose', () => {
        setOpenPopupStationId(null);
        if (lastTriggerRef.current) {
          lastTriggerRef.current.focus();
          lastTriggerRef.current = null;
        }
      });

      marker.on('click', (e) => {
        // Store trigger element for focus restoration
        lastTriggerRef.current = e.originalEvent?.target as HTMLElement || null;
        onStationSelect?.(station);
        setStatusMessage(`Wybrano stację ${station.name}`);
      });

      markersRef.current.set(station.id, marker);
    });
  }, [stations, onStationSelect, closeAllPopups]);

  // Handle selected station
  useEffect(() => {
    if (!map.current || !selectedStationId) return;

    const marker = markersRef.current.get(selectedStationId);
    if (marker) {
      const station = stations.find(s => s.id === selectedStationId);
      if (station) {
        map.current.setView([station.latitude, station.longitude], 15, {
          animate: true
        });
        marker.openPopup();
      }
    }
  }, [selectedStationId, stations]);

  const handleLocateMe = () => {
    if (!map.current) return;

    if (userPosition) {
      map.current.setView([userPosition.latitude, userPosition.longitude], 14, { animate: true });
      setStatusMessage('Przesunięto mapę do Twojej lokalizacji');
    } else {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          const { latitude, longitude } = position.coords;
          map.current?.setView([latitude, longitude], 14, { animate: true });
          setStatusMessage('Przesunięto mapę do Twojej lokalizacji');
        },
        () => {
          map.current?.setView(CENTER, DEFAULT_ZOOM);
          setStatusMessage('Nie udało się uzyskać lokalizacji');
        }
      );
    }
  };

  const handleZoomIn = () => {
    map.current?.zoomIn();
    setStatusMessage('Powiększono mapę');
  };

  const handleZoomOut = () => {
    map.current?.zoomOut();
    setStatusMessage('Pomniejszono mapę');
  };

  const toggleMapStyle = () => {
    if (!map.current) return;

    const newStyle = mapStyle === 'light' ? 'dark' : 'light';
    setMapStyle(newStyle);

    // Remove current tiles and add new ones
    map.current.eachLayer((layer) => {
      if (layer instanceof L.TileLayer) {
        layer.remove();
      }
    });

    const tileUrl = newStyle === 'light'
      ? 'https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png'
      : 'https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png';

    L.tileLayer(tileUrl, { maxZoom: 19 }).addTo(map.current);
    setStatusMessage(`Zmieniono styl mapy na ${newStyle === 'light' ? 'jasny' : 'ciemny'}`);
  };

  return (
    <div 
      className={cn("relative w-full", className)}
      role="application"
      aria-label="Interaktywna mapa stacji ładowania EV w Łodzi"
    >
      {/* Screen reader announcements */}
      <div 
        aria-live="polite" 
        aria-atomic="true" 
        className="sr-only"
      >
        {statusMessage}
      </div>

      <div 
        ref={mapContainer} 
        className="w-full h-full rounded-xl overflow-hidden"
        style={{ minHeight: '300px' }}
        tabIndex={0}
        aria-label={`Mapa z ${stations.length} stacjami ładowania. Użyj strzałek do nawigacji, plus i minus do zmiany powiększenia.`}
      />

      {/* Map Controls */}
      <div 
        className="absolute top-3 sm:top-4 right-3 sm:right-4 flex flex-col gap-1.5 sm:gap-2 z-10"
        role="group"
        aria-label="Kontrolki mapy"
      >
        <Button
          size="icon"
          variant="secondary"
          className="h-10 w-10 sm:h-11 sm:w-11 md:h-11 md:w-11 min-h-[40px] min-w-[40px] sm:min-h-[44px] sm:min-w-[44px] rounded-full shadow-lg bg-background/90 backdrop-blur focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
          onClick={handleZoomIn}
          aria-label="Powiększ mapę"
        >
          <ZoomIn className="h-4 w-4 sm:h-5 sm:w-5" aria-hidden="true" />
        </Button>
        <Button
          size="icon"
          variant="secondary"
          className="h-10 w-10 sm:h-11 sm:w-11 md:h-11 md:w-11 min-h-[40px] min-w-[40px] sm:min-h-[44px] sm:min-w-[44px] rounded-full shadow-lg bg-background/90 backdrop-blur focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
          onClick={handleZoomOut}
          aria-label="Pomniejsz mapę"
        >
          <ZoomOut className="h-4 w-4 sm:h-5 sm:w-5" aria-hidden="true" />
        </Button>
        <Button
          size="icon"
          variant="secondary"
          className="h-10 w-10 sm:h-11 sm:w-11 md:h-11 md:w-11 min-h-[40px] min-w-[40px] sm:min-h-[44px] sm:min-w-[44px] rounded-full shadow-lg bg-background/90 backdrop-blur focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
          onClick={toggleMapStyle}
          aria-label={`Zmień styl mapy na ${mapStyle === 'light' ? 'ciemny' : 'jasny'}`}
          aria-pressed={mapStyle === 'dark'}
        >
          <Layers className="h-4 w-4 sm:h-5 sm:w-5" aria-hidden="true" />
        </Button>
      </div>

      {/* Locate Me Button */}
      <Button
        size="icon"
        variant={userPosition ? "default" : "secondary"}
        className={cn(
          "absolute bottom-3 sm:bottom-4 right-3 sm:right-4 h-12 w-12 sm:h-13 sm:w-13 md:h-14 md:w-14 min-h-[48px] min-w-[48px] sm:min-h-[52px] sm:min-w-[52px] rounded-full shadow-lg backdrop-blur z-10 focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2",
          userPosition ? "bg-primary" : "bg-background/90"
        )}
        onClick={handleLocateMe}
        aria-label="Pokaż moją lokalizację na mapie"
      >
        <Locate className="h-5 w-5 sm:h-6 sm:w-6" aria-hidden="true" />
      </Button>

      {/* Legend */}
      <div 
        className="absolute bottom-3 sm:bottom-4 left-3 sm:left-4 flex flex-wrap gap-1.5 sm:gap-2 z-10 max-w-[calc(100%-80px)] sm:max-w-none"
        role="list"
        aria-label="Legenda mapy"
      >
        <div className="flex items-center gap-1.5 bg-background/90 backdrop-blur px-2 py-1 sm:px-2.5 sm:py-1.5 rounded-md text-[10px] sm:text-xs shadow" role="listitem">
          <div className="w-2 h-2 sm:w-2.5 sm:h-2.5 rounded-full bg-primary flex-shrink-0" aria-hidden="true" />
          <span className="text-foreground">AC (≤22 kW)</span>
        </div>
        <div className="flex items-center gap-1.5 bg-background/90 backdrop-blur px-2 py-1 sm:px-2.5 sm:py-1.5 rounded-md text-[10px] sm:text-xs shadow" role="listitem">
          <div className="w-2 h-2 sm:w-2.5 sm:h-2.5 rounded-full bg-amber-500 flex-shrink-0" aria-hidden="true" />
          <span className="text-foreground">Szybkie DC</span>
        </div>
        <div className="flex items-center gap-1.5 bg-background/90 backdrop-blur px-2 py-1 sm:px-2.5 sm:py-1.5 rounded-md text-[10px] sm:text-xs shadow" role="listitem">
          <div className="w-2 h-2 sm:w-2.5 sm:h-2.5 rounded-full bg-violet-500 flex-shrink-0" aria-hidden="true" />
          <span className="text-foreground">Ultraszybkie</span>
        </div>
      </div>

      {/* City Label */}
      <div className="absolute top-3 sm:top-4 left-3 sm:left-4 z-10">
        <div className="bg-background/90 backdrop-blur px-2.5 py-1.5 sm:px-3 sm:py-2 rounded-lg shadow-lg">
          <h3 className="text-xs sm:text-sm font-semibold text-foreground">Łódź, Polska</h3>
          <p className="text-[10px] sm:text-xs text-muted-foreground" aria-live="polite">
            {stations.length} stacji ładowania
          </p>
        </div>
      </div>
    </div>
  );
}
