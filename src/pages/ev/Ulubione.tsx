import { useState, useMemo } from "react";
import { lodzStations } from "@/data/lodz-stations";
import { useFavorites } from "@/hooks/useFavorites";
import { useNotifications } from "@/hooks/useNotifications";
import { Station } from "@/types/station";
import { StationDetailSheet } from "@/components/stations/StationDetailSheet";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Star, Zap, MapPin, Navigation, Trash2, Heart } from "lucide-react";
import { cn } from "@/lib/utils";

export default function Ulubione() {
  const { favorites, removeFavorite, isFavorite, toggleFavorite } = useFavorites();
  const { permission, subscribe, unsubscribe, isSubscribed, isSupported: notifSupported } = useNotifications();
  const [selectedStation, setSelectedStation] = useState<Station | null>(null);
  const [detailSheetOpen, setDetailSheetOpen] = useState(false);

  const favoriteStations = useMemo(() => 
    lodzStations.filter((station) => favorites.includes(station.id)),
    [favorites]
  );

  const handleNavigate = (station: Station, e: React.MouseEvent) => {
    e.stopPropagation();
    const url = `https://www.google.com/maps/dir/?api=1&destination=${station.latitude},${station.longitude}`;
    window.open(url, '_blank');
  };

  const handleStationSelect = (station: Station) => {
    setSelectedStation(station);
    setDetailSheetOpen(true);
  };

  return (
    <main id="main-content" role="main" aria-label="Ulubione stacje" className="flex-1 flex flex-col">
      <div className="container px-4 md:px-6 py-6">
        <header className="mb-6">
          <h1 className="text-2xl md:text-3xl font-bold text-foreground flex items-center gap-2">
            <Heart className="h-7 w-7 text-primary fill-primary" />
            Ulubione stacje
          </h1>
          <p className="text-muted-foreground mt-1">Twoje zapisane stacje ładowania ({favorites.length})</p>
        </header>

        <section aria-labelledby="favorites-heading">
          <h2 id="favorites-heading" className="sr-only">Lista ulubionych stacji</h2>
          
          {favoriteStations.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-16 text-center">
              <div className="w-20 h-20 rounded-full bg-muted flex items-center justify-center mb-4">
                <Star className="h-10 w-10 text-muted-foreground" />
              </div>
              <h3 className="font-semibold text-lg mb-2">Brak ulubionych stacji</h3>
              <p className="text-sm text-muted-foreground max-w-xs">
                Dodaj stacje do ulubionych klikając ikonę serca, aby mieć do nich szybki dostęp
              </p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {favoriteStations.map(station => {
                const isAvailable = station.availableChargers > 0;
                
                return (
                  <Card 
                    key={station.id}
                    className="cursor-pointer transition-all hover:shadow-md active:scale-[0.99]"
                    onClick={() => handleStationSelect(station)}
                  >
                    <CardContent className="p-4">
                      <div className="flex items-start gap-3">
                        <div className={cn(
                          "w-10 h-10 rounded-full flex items-center justify-center flex-shrink-0",
                          isAvailable ? "bg-primary" : "bg-muted"
                        )}>
                          <Zap className={cn(
                            "h-5 w-5",
                            isAvailable ? "text-primary-foreground" : "text-muted-foreground"
                          )} />
                        </div>
                        
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center gap-2 mb-1">
                            <h4 className="font-semibold text-sm truncate">{station.name}</h4>
                            <Badge variant={isAvailable ? "default" : "secondary"} className="text-xs">
                              {isAvailable ? "Dostępna" : "Zajęta"}
                            </Badge>
                          </div>
                          <div className="flex items-center gap-1.5 text-xs text-muted-foreground mb-2">
                            <MapPin className="h-3 w-3" />
                            <span className="truncate">{station.address.full}</span>
                          </div>
                          <div className="flex items-center gap-4 text-xs">
                            <span className="font-medium">
                              {station.availableChargers}/{station.totalChargers} wolnych
                            </span>
                            <span className="text-muted-foreground">{station.maxPower} kW</span>
                          </div>
                        </div>

                        <div className="flex flex-col gap-2">
                          <Button
                            variant="ghost"
                            size="icon"
                            className="h-8 w-8"
                            onClick={(e) => {
                              e.stopPropagation();
                              removeFavorite(station.id);
                            }}
                            aria-label="Usuń z ulubionych"
                          >
                            <Trash2 className="h-4 w-4 text-destructive" />
                          </Button>
                          <Button
                            variant="ghost"
                            size="icon"
                            className="h-8 w-8"
                            onClick={(e) => handleNavigate(station, e)}
                            aria-label="Nawiguj do stacji"
                          >
                            <Navigation className="h-4 w-4" />
                          </Button>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                );
              })}
            </div>
          )}
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
