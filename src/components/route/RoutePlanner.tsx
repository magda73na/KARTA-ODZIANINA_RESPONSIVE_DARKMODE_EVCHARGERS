import { useState, useMemo } from "react";
import { Navigation, MapPin, Zap, Clock, ChevronRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Slider } from "@/components/ui/slider";
import { Station } from "@/types/station";
import { calculateDistanceKm, formatDistanceKm } from "@/data/lodz-stations";

interface RoutePlannerProps {
  stations: Station[];
  userPosition: { latitude: number; longitude: number } | null;
  onStationSelect: (station: Station) => void;
}

// Predefined destinations in/around Łódź
const DESTINATIONS = [
  { name: "Centrum Łodzi", lat: 51.7592, lng: 19.4560 },
  { name: "Manufaktura", lat: 51.7825, lng: 19.4414 },
  { name: "Port Łódź", lat: 51.7231, lng: 19.4986 },
  { name: "Dworzec Łódź Fabryczna", lat: 51.7680, lng: 19.4730 },
  { name: "Galeria Łódzka", lat: 51.7750, lng: 19.4540 },
  { name: "EC1 Łódź", lat: 51.7690, lng: 19.4780 },
  { name: "Piotrkowska 217", lat: 51.7490, lng: 19.4510 },
  { name: "Atlas Arena", lat: 51.7535, lng: 19.5035 },
];

export function RoutePlanner({ stations, userPosition, onStationSelect }: RoutePlannerProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [destination, setDestination] = useState<{ name: string; lat: number; lng: number } | null>(null);
  const [batteryRange, setBatteryRange] = useState([150]); // km
  const [customDestination, setCustomDestination] = useState("");

  const routeStations = useMemo(() => {
    if (!userPosition || !destination) return [];

    // Calculate stations along the route
    // Simple algorithm: find stations that are reasonably close to the line between start and destination
    const startLat = userPosition.latitude;
    const startLng = userPosition.longitude;
    const endLat = destination.lat;
    const endLng = destination.lng;

    const totalDistance = calculateDistanceKm(startLat, startLng, endLat, endLng);

    return stations
      .map(station => {
        const distFromStart = calculateDistanceKm(startLat, startLng, station.latitude, station.longitude);
        const distFromEnd = calculateDistanceKm(station.latitude, station.longitude, endLat, endLng);
        const distFromRoute = distFromStart + distFromEnd - totalDistance;
        
        // Consider station "on route" if detour is less than 20% of total distance or less than 2km
        const isOnRoute = distFromRoute < Math.max(totalDistance * 0.2, 2);
        
        return {
          station,
          distFromStart,
          distFromEnd,
          distFromRoute,
          isOnRoute,
        };
      })
      .filter(s => s.isOnRoute)
      .sort((a, b) => a.distFromStart - b.distFromStart);
  }, [userPosition, destination, stations]);

  const recommendedStops = useMemo(() => {
    if (!userPosition || !destination || routeStations.length === 0) return [];

    const range = batteryRange[0];
    const stops: typeof routeStations = [];
    let currentRange = range;
    let currentPosition = 0;

    for (const stationData of routeStations) {
      const distanceToStation = stationData.distFromStart - currentPosition;
      
      if (distanceToStation > currentRange * 0.7) {
        // Need to stop before running too low
        const lastViableStation = routeStations
          .filter(s => s.distFromStart > currentPosition && s.distFromStart <= currentPosition + currentRange * 0.7)
          .pop();
        
        if (lastViableStation) {
          stops.push(lastViableStation);
          currentPosition = lastViableStation.distFromStart;
          currentRange = range; // Assume full charge
        }
      }
    }

    // If no stops needed but route has stations, suggest fastest chargers
    if (stops.length === 0 && routeStations.length > 0) {
      const fastChargers = routeStations
        .filter(s => s.station.chargingPoints.some(cp => cp.power >= 50))
        .slice(0, 2);
      return fastChargers;
    }

    return stops;
  }, [userPosition, destination, routeStations, batteryRange]);

  const handleSelectDestination = (dest: typeof DESTINATIONS[0]) => {
    setDestination(dest);
  };

  const totalDistance = useMemo(() => {
    if (!userPosition || !destination) return 0;
    return calculateDistanceKm(
      userPosition.latitude,
      userPosition.longitude,
      destination.lat,
      destination.lng
    );
  }, [userPosition, destination]);

  return (
    <Sheet open={isOpen} onOpenChange={setIsOpen}>
      <SheetTrigger asChild>
        <Button variant="dark" size="sm" className="gap-2">
          <Navigation className="h-4 w-4" />
          <span className="hidden sm:inline">Planuj trasę</span>
        </Button>
      </SheetTrigger>
      <SheetContent className="w-full sm:max-w-lg">
        <SheetHeader>
          <SheetTitle className="flex items-center gap-2">
            <Navigation className="h-5 w-5" />
            Planowanie Trasy
          </SheetTitle>
        </SheetHeader>

        <div className="mt-6 space-y-6">
          {/* Start Point */}
          <div className="space-y-2">
            <Label className="flex items-center gap-2">
              <div className="w-3 h-3 rounded-full bg-primary" />
              Punkt startowy
            </Label>
            {userPosition ? (
              <Card className="bg-primary/10 border-primary/20">
                <CardContent className="p-3 text-sm">
                  <span className="text-primary font-medium">Twoja lokalizacja</span>
                  <span className="text-muted-foreground ml-2">
                    ({userPosition.latitude.toFixed(4)}, {userPosition.longitude.toFixed(4)})
                  </span>
                </CardContent>
              </Card>
            ) : (
              <Card className="bg-muted">
                <CardContent className="p-3 text-sm text-muted-foreground">
                  Włącz lokalizację, aby zaplanować trasę
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
                  <Button 
                    variant="ghost" 
                    size="sm"
                    onClick={() => setDestination(null)}
                  >
                    Zmień
                  </Button>
                </CardContent>
              </Card>
            ) : (
              <div className="space-y-2">
                <div className="grid grid-cols-2 gap-2">
                  {DESTINATIONS.slice(0, 6).map((dest) => (
                    <Button
                      key={dest.name}
                      variant="outline"
                      size="sm"
                      className="justify-start text-xs h-auto py-2"
                      onClick={() => handleSelectDestination(dest)}
                      disabled={!userPosition}
                    >
                      <MapPin className="h-3 w-3 mr-1 flex-shrink-0" />
                      <span className="truncate">{dest.name}</span>
                    </Button>
                  ))}
                </div>
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

          {/* Route Results */}
          {destination && userPosition && (
            <div className="space-y-4">
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
                      <div
                        key={stop.station.id}
                        className="flex items-center gap-2 py-1"
                      >
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

              <ScrollArea className="h-[250px]">
                <div className="space-y-2">
                  {routeStations.map((stationData) => (
                    <Card
                      key={stationData.station.id}
                      className="cursor-pointer hover:bg-muted/50 transition-colors"
                      onClick={() => {
                        onStationSelect(stationData.station);
                        setIsOpen(false);
                      }}
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
            </div>
          )}
        </div>
      </SheetContent>
    </Sheet>
  );
}
