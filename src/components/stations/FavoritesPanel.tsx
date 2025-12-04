import { Station } from "@/types/station";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from "@/components/ui/sheet";
import { Star, Zap, MapPin, Navigation, Trash2, Heart } from "lucide-react";
import { cn } from "@/lib/utils";
import { useState } from "react";

interface FavoritesPanelProps {
  stations: Station[];
  favorites: string[];
  onStationSelect: (station: Station) => void;
  onRemoveFavorite: (stationId: string) => void;
}

export function FavoritesPanel({ stations, favorites, onStationSelect, onRemoveFavorite }: FavoritesPanelProps) {
  const [isOpen, setIsOpen] = useState(false);
  
  const favoriteStations = stations.filter(s => favorites.includes(s.id));

  const handleNavigate = (station: Station, e: React.MouseEvent) => {
    e.stopPropagation();
    const url = `https://www.google.com/maps/dir/?api=1&destination=${station.latitude},${station.longitude}`;
    window.open(url, '_blank');
  };

  return (
    <Sheet open={isOpen} onOpenChange={setIsOpen}>
      <SheetTrigger asChild>
        <Button variant="outline" className="gap-2 h-10 sm:h-11 touch-manipulation relative">
          <Heart className="h-4 w-4" />
          <span className="hidden sm:inline">Ulubione</span>
          {favorites.length > 0 && (
            <Badge className="absolute -top-2 -right-2 h-5 w-5 p-0 flex items-center justify-center text-xs">
              {favorites.length}
            </Badge>
          )}
        </Button>
      </SheetTrigger>
      <SheetContent side="bottom" className="h-[80vh] rounded-t-2xl p-0">
        <div className="flex flex-col h-full">
          <SheetHeader className="p-4 pb-3 border-b sticky top-0 bg-background z-10">
            <div className="flex items-center gap-2">
              <Heart className="h-5 w-5 text-primary fill-primary" />
              <SheetTitle className="text-lg">Ulubione Stacje ({favorites.length})</SheetTitle>
            </div>
          </SheetHeader>

          <div className="flex-1 overflow-y-auto p-4">
            {favoriteStations.length === 0 ? (
              <div className="flex flex-col items-center justify-center h-full text-center py-12">
                <div className="w-16 h-16 rounded-full bg-muted flex items-center justify-center mb-4">
                  <Star className="h-8 w-8 text-muted-foreground" />
                </div>
                <h3 className="font-semibold text-lg mb-2">Brak ulubionych stacji</h3>
                <p className="text-sm text-muted-foreground max-w-xs">
                  Dodaj stacje do ulubionych klikając ikonę gwiazdki, aby mieć do nich szybki dostęp
                </p>
              </div>
            ) : (
              <div className="space-y-3">
                {favoriteStations.map(station => {
                  const isAvailable = station.availableChargers > 0;
                  
                  return (
                    <Card 
                      key={station.id}
                      className="cursor-pointer transition-all hover:shadow-md active:scale-[0.99]"
                      onClick={() => {
                        onStationSelect(station);
                        setIsOpen(false);
                      }}
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
                              <h4 className="font-semibold text-sm">{station.name}</h4>
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
                              {station.avgPricePerKwh && (
                                <span className="text-primary font-medium">
                                  {station.avgPricePerKwh.toFixed(2)} PLN/kWh
                                </span>
                              )}
                            </div>
                          </div>

                          <div className="flex flex-col gap-2">
                            <Button
                              variant="ghost"
                              size="icon"
                              className="h-8 w-8"
                              onClick={(e) => {
                                e.stopPropagation();
                                onRemoveFavorite(station.id);
                              }}
                            >
                              <Trash2 className="h-4 w-4 text-destructive" />
                            </Button>
                            <Button
                              variant="ghost"
                              size="icon"
                              className="h-8 w-8"
                              onClick={(e) => handleNavigate(station, e)}
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
          </div>
        </div>
      </SheetContent>
    </Sheet>
  );
}
