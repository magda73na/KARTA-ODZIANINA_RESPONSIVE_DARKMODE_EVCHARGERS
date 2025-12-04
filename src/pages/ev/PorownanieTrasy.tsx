import { useState, useMemo, useEffect } from "react";
import { Navigation, MapPin, Zap, ChevronRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Slider } from "@/components/ui/slider";
import { Station } from "@/types/station";
import { lodzStations, calculateDistanceKm, formatDistanceKm } from "@/data/lodz-stations";
import { useGeolocation } from "@/hooks/useGeolocation";
import { useFavorites } from "@/hooks/useFavorites";
import { useNotifications } from "@/hooks/useNotifications";
import { StationDetailSheet } from "@/components/stations/StationDetailSheet";

const DESTINATIONS = [
  { name: "Centrum Łodzi", lat: 51.7592, lng: 19.4560 },
  { name: "Manufaktura", lat: 51.7825, lng: 19.4414 },
  { name: "Port Łódź", lat: 51.7231, lng: 19.4986 },
  { name: "Dworzec Łódź Fabryczna", lat: 51.7680, lng: 19.4730 },
  { name: "Galeria Łódzka", lat: 51.7750, lng: 19.4540 },
  { name: "EC1 Łódź", lat: 51.7690, lng: 19.4780 },
];

export default function PorownanieTrasy() {
  const { position, getCurrentPosition, isSupported } = useGeolocation();
  const { isFavorite, toggleFavorite } = useFavorites();
  const { permission, subscribe, unsubscribe, isSubscribed, isSupported: notifSupported } = useNotifications();
  
  const [destination, setDestination] = useState<{ name: string; lat: number; lng: number } | null>(null);
  const [batteryRange, setBatteryRange] = useState([150]);
  const [selectedStation, setSelectedStation] = useState<Station | null>(null);
  const [detailSheetOpen, setDetailSheetOpen] = useState(false);

  useEffect(() => {
    if (isSupported) {
      getCurrentPosition();
    }
  }, [isSupported, getCurrentPosition]);

  const routeStations = useMemo(() => {
    if (!position || !destination) return [];

    const startLat = position.latitude;
    const startLng = position.longitude;
    const endLat = destination.lat;
    const endLng = destination.lng;
    const totalDistance = calculateDistanceKm(startLat, startLng, endLat, endLng);

    return lodzStations
      .map(station => {
        const distFromStart = calculateDistanceKm(startLat, startLng, station.latitude, station.longitude);
        const distFromEnd = calculateDistanceKm(station.latitude, station.longitude, endLat, endLng);
        const distFromRoute = distFromStart + distFromEnd - totalDistance;
        const isOnRoute = distFromRoute < Math.max(totalDistance * 0.2, 2);
        
        return { station, distFromStart, distFromEnd, distFromRoute, isOnRoute };
      })
      .filter(s => s.isOnRoute)
      .sort((a, b) => a.distFromStart - b.distFromStart);
  }, [position, destination]);

  const recommendedStops = useMemo(() => {
    if (!position || !destination || routeStations.length === 0) return [];

    const range = batteryRange[0];
    const stops: typeof routeStations = [];
    let currentRange = range;
    let currentPosition = 0;

    for (const stationData of routeStations) {
      const distanceToStation = stationData.distFromStart - currentPosition;
      
      if (distanceToStation > currentRange * 0.7) {
        const lastViableStation = routeStations
          .filter(s => s.distFromStart > currentPosition && s.distFromStart <= currentPosition + currentRange * 0.7)
          .pop();
        
        if (lastViableStation) {
          stops.push(lastViableStation);
          currentPosition = lastViableStation.distFromStart;
          currentRange = range;
        }
      }
    }

    if (stops.length === 0 && routeStations.length > 0) {
      return routeStations.filter(s => s.station.chargingPoints.some(cp => cp.power >= 50)).slice(0, 2);
    }

    return stops;
  }, [position, destination, routeStations, batteryRange]);

  const totalDistance = useMemo(() => {
    if (!position || !destination) return 0;
    return calculateDistanceKm(position.latitude, position.longitude, destination.lat, destination.lng);
  }, [position, destination]);

  const handleStationSelect = (station: Station) => {
    setSelectedStation(station);
    setDetailSheetOpen(true);
  };

  return (
    <main id="main-content" role="main" aria-label="Porównanie tras" className="flex-1 flex flex-col">
      <div className="container px-4 md:px-6 py-6">
        <header className="mb-6">
          <h1 className="text-2xl md:text-3xl font-bold text-foreground flex items-center gap-2">
            <Navigation className="h-7 w-7" />
            Planowanie trasy
          </h1>
          <p className="text-muted-foreground mt-1">Zaplanuj trasę z punktami ładowania</p>
        </header>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Left Column - Configuration */}
          <div className="space-y-6">
            {/* Start Point */}
            <div className="space-y-2">
              <Label className="flex items-center gap-2">
                <div className="w-3 h-3 rounded-full bg-primary" />
                Punkt startowy
              </Label>
              {position ? (
                <Card className="bg-primary/10 border-primary/20">
                  <CardContent className="p-3 text-sm">
                    <span className="text-primary font-medium">Twoja lokalizacja</span>
                    <span className="text-muted-foreground ml-2">
                      ({position.latitude.toFixed(4)}, {position.longitude.toFixed(4)})
                    </span>
                  </CardContent>
                </Card>
              ) : (
                <Card className="bg-muted">
                  <CardContent className="p-3 text-sm text-muted-foreground">
                    <Button variant="outline" size="sm" onClick={getCurrentPosition}>
                      Włącz lokalizację
                    </Button>
                  </CardContent>
                </Card>
              )}
            </div>

            {/* Destination */}
            <div className="space-y-2">
              <Label className="flex items-center gap-2">
                <div className="w-3 h-3 rounded-full bg-destructive" />
                Cel podróży
              </Label>
              
              {destination ? (
                <Card className="bg-accent/10 border-accent/20">
                  <CardContent className="p-3 flex items-center justify-between">
                    <div>
                      <div className="font-medium text-sm">{destination.name}</div>
                      <div className="text-xs text-muted-foreground">
                        {totalDistance.toFixed(1)} km od Ciebie
                      </div>
                    </div>
                    <Button variant="ghost" size="sm" onClick={() => setDestination(null)}>
                      Zmień
                    </Button>
                  </CardContent>
                </Card>
              ) : (
                <div className="grid grid-cols-2 gap-2">
                  {DESTINATIONS.map((dest) => (
                    <Button
                      key={dest.name}
                      variant="outline"
                      size="sm"
                      className="justify-start text-xs h-auto py-2"
                      onClick={() => setDestination(dest)}
                      disabled={!position}
                    >
                      <MapPin className="h-3 w-3 mr-1 flex-shrink-0" />
                      <span className="truncate">{dest.name}</span>
                    </Button>
                  ))}
                </div>
              )}
            </div>

            {/* Battery Range */}
            <div className="space-y-3">
              <Label>Zasięg baterii: {batteryRange[0]} km</Label>
              <Slider
                value={batteryRange}
                onValueChange={setBatteryRange}
                min={50}
                max={500}
                step={10}
                className="w-full"
              />
            </div>
          </div>

          {/* Right Column - Results */}
          <div className="space-y-4">
            {destination && position ? (
              <>
                <div className="flex items-center justify-between text-sm">
                  <span className="text-muted-foreground">Stacje na trasie</span>
                  <Badge variant="secondary">{routeStations.length}</Badge>
                </div>

                {recommendedStops.length > 0 && (
                  <Card className="bg-accent/10 border-accent/20">
                    <CardContent className="p-3">
                      <div className="text-xs text-muted-foreground mb-2">
                        Rekomendowane przystanki
                      </div>
                      {recommendedStops.map((stop, index) => (
                        <div key={stop.station.id} className="flex items-center gap-2 py-1">
                          <div className="w-5 h-5 rounded-full bg-accent text-accent-foreground flex items-center justify-center text-xs font-bold">
                            {index + 1}
                          </div>
                          <span className="text-sm font-medium flex-1">{stop.station.name}</span>
                          <span className="text-xs text-muted-foreground">
                            {formatDistanceKm(stop.distFromStart)}
                          </span>
                        </div>
                      ))}
                    </CardContent>
                  </Card>
                )}

                <ScrollArea className="h-[350px]">
                  <div className="space-y-2">
                    {routeStations.map((stationData) => (
                      <Card
                        key={stationData.station.id}
                        className="cursor-pointer hover:bg-muted/50 transition-colors"
                        onClick={() => handleStationSelect(stationData.station)}
                      >
                        <CardContent className="p-3">
                          <div className="flex items-center justify-between">
                            <div className="flex-1 min-w-0">
                              <div className="font-medium text-sm truncate">
                                {stationData.station.name}
                              </div>
                              <div className="flex items-center gap-2 text-xs text-muted-foreground mt-1">
                                <span className="flex items-center gap-1">
                                  <MapPin className="h-3 w-3" />
                                  {formatDistanceKm(stationData.distFromStart)}
                                </span>
                                <span className="flex items-center gap-1">
                                  <Zap className="h-3 w-3" />
                                  {Math.max(...stationData.station.chargingPoints.map(cp => cp.power))} kW
                                </span>
                              </div>
                            </div>
                            <ChevronRight className="h-4 w-4 text-muted-foreground" />
                          </div>
                        </CardContent>
                      </Card>
                    ))}
                  </div>
                </ScrollArea>
              </>
            ) : (
              <div className="flex flex-col items-center justify-center py-16 text-center">
                <Navigation className="h-12 w-12 text-muted-foreground mb-4" />
                <p className="text-sm text-muted-foreground">
                  Włącz lokalizację i wybierz cel podróży, aby zobaczyć stacje na trasie
                </p>
              </div>
            )}
          </div>
        </div>
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
