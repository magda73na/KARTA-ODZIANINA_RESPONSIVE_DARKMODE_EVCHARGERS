import { MapPin, Zap, Navigation, ChevronRight, Star, Loader2, Plug, DollarSign } from "lucide-react";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import { cn } from "@/lib/utils";
import { Station } from "@/types/station";

interface StationCardProps {
  station: Station;
  onSelect?: (station: Station) => void;
  isSelected?: boolean;
  compact?: boolean;
  isFavorite?: boolean;
  onToggleFavorite?: (stationId: string) => void;
  isLoadingAvailability?: boolean;
}

const getAvailabilityColor = (available: number, total: number) => {
  const percentage = (available / total) * 100;
  if (percentage === 0) return "bg-destructive";
  if (percentage < 50) return "bg-warning";
  return "bg-primary";
};

const getAvailabilityTextColor = (available: number, total: number) => {
  const percentage = (available / total) * 100;
  if (percentage === 0) return "text-destructive";
  if (percentage < 50) return "text-warning";
  return "text-primary";
};

const getPowerCategoryLabel = (category: string) => {
  switch (category) {
    case 'ultra': return { label: 'Ultraszybkie', color: 'bg-violet-500 text-white' };
    case 'fast': return { label: 'Szybkie DC', color: 'bg-amber-500 text-white' };
    default: return { label: 'AC', color: 'bg-primary text-primary-foreground' };
  }
};

const getAvailabilityStatus = (available: number, total: number): { label: string; status: 'available' | 'limited' | 'occupied' } => {
  if (available === 0) return { label: 'Zajęta', status: 'occupied' };
  if (available === total) return { label: 'Dostępna', status: 'available' };
  return { label: 'Częściowo zajęta', status: 'limited' };
};

const getAvailabilityBadgeStyle = (status: 'available' | 'limited' | 'occupied') => {
  switch (status) {
    case 'available': return 'bg-primary text-primary-foreground';
    case 'limited': return 'bg-warning text-warning-foreground';
    case 'occupied': return 'bg-destructive text-destructive-foreground';
  }
};

export function StationCard({ 
  station, 
  onSelect, 
  isSelected, 
  compact = false, 
  isFavorite = false, 
  onToggleFavorite,
  isLoadingAvailability = false 
}: StationCardProps) {
  const availabilityPercentage = (station.availableChargers / station.totalChargers) * 100;
  const isAvailable = station.availableChargers > 0;
  const powerCategory = getPowerCategoryLabel(station.powerCategory);
  const availabilityInfo = getAvailabilityStatus(station.availableChargers, station.totalChargers);
  const availabilityStatusText = `${station.availableChargers} z ${station.totalChargers} ładowarek wolnych`;

  const handleNavigate = (e: React.MouseEvent | React.KeyboardEvent) => {
    e.stopPropagation();
    const url = `https://www.google.com/maps/dir/?api=1&destination=${station.latitude},${station.longitude}`;
    window.open(url, '_blank', 'noopener,noreferrer');
  };

  const handleFavoriteClick = (e: React.MouseEvent | React.KeyboardEvent) => {
    e.stopPropagation();
    onToggleFavorite?.(station.id);
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' || e.key === ' ') {
      e.preventDefault();
      onSelect?.(station);
    }
  };

  if (compact) {
    return (
      <TooltipProvider delayDuration={300}>
        <article
          role="article"
          aria-label={`Stacja ${station.name}, ${station.address.street}, ${availabilityStatusText}`}
        >
          <Card 
            className={cn(
              "cursor-pointer transition-all hover:shadow-md active:scale-[0.99] focus-within:ring-2 focus-within:ring-ring", 
              isSelected && "ring-2 ring-primary"
            )}
            onClick={() => onSelect?.(station)}
            onKeyDown={handleKeyDown}
            tabIndex={0}
            role="button"
            aria-pressed={isSelected}
          >
          <CardContent className="p-2.5 sm:p-3 md:p-5">
              <div className="flex items-center gap-2 sm:gap-3 md:gap-4">
                <Tooltip>
                  <TooltipTrigger asChild>
                    <div 
                      className={cn(
                        "w-8 h-8 sm:w-9 sm:h-9 md:w-12 md:h-12 min-w-[32px] sm:min-w-[36px] md:min-w-[48px] rounded-full flex items-center justify-center flex-shrink-0",
                        isAvailable ? "bg-primary" : "bg-muted"
                      )}
                      aria-hidden="true"
                    >
                      {isLoadingAvailability ? (
                        <Loader2 className="h-4 w-4 sm:h-5 sm:w-5 md:h-6 md:w-6 text-primary-foreground animate-spin" />
                      ) : (
                        <Zap className={cn("h-4 w-4 sm:h-5 sm:w-5 md:h-6 md:w-6", isAvailable ? "text-primary-foreground" : "text-muted-foreground")} />
                      )}
                    </div>
                  </TooltipTrigger>
                  <TooltipContent>
                    <p>Max {station.maxPower} kW</p>
                  </TooltipContent>
                </Tooltip>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-1 md:gap-2">
                    <h3 className="font-semibold text-xs sm:text-sm md:text-base truncate">{station.name}</h3>
                    {isFavorite && (
                      <Star 
                        className="h-3 w-3 sm:h-3.5 sm:w-3.5 fill-amber-400 text-amber-400 flex-shrink-0" 
                        aria-label="Dodane do ulubionych"
                      />
                    )}
                  </div>
                  <p className="text-[10px] sm:text-xs md:text-sm text-muted-foreground truncate">{station.address.street}</p>
                </div>
                <div className="flex flex-col items-end gap-0.5 sm:gap-1 md:gap-1.5" aria-live="polite">
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <span>
                        <Badge 
                          className={cn("text-[10px] sm:text-xs md:text-sm px-1.5 sm:px-2 md:px-3", getAvailabilityBadgeStyle(availabilityInfo.status))}
                          aria-label={availabilityStatusText}
                        >
                          {station.availableChargers}/{station.totalChargers}
                        </Badge>
                      </span>
                    </TooltipTrigger>
                    <TooltipContent>
                      <p>{station.availableChargers} wolnych z {station.totalChargers}</p>
                    </TooltipContent>
                  </Tooltip>
                  <span className="text-[10px] sm:text-xs md:text-sm text-muted-foreground">{station.maxPower} kW</span>
                </div>
                <ChevronRight className="h-4 w-4 sm:h-5 sm:w-5 md:h-6 md:w-6 text-muted-foreground flex-shrink-0" aria-hidden="true" />
              </div>
            </CardContent>
          </Card>
        </article>
      </TooltipProvider>
    );
  }

  return (
    <TooltipProvider delayDuration={300}>
      <article
        role="article"
        aria-label={`Stacja ${station.name}, ${station.address.full}, ${availabilityStatusText}, ${station.maxPower} kW`}
      >
        <Card 
          className={cn(
            "group overflow-hidden transition-all hover:shadow-lg active:scale-[0.99] cursor-pointer focus-within:ring-2 focus-within:ring-ring", 
            isSelected && "ring-2 ring-primary"
          )}
          onClick={() => onSelect?.(station)}
          onKeyDown={handleKeyDown}
          tabIndex={0}
          role="button"
          aria-pressed={isSelected}
        >
          <CardHeader className="p-2.5 pb-1.5 sm:p-3 sm:pb-2 md:p-5 md:pb-3">
            <div className="flex items-start justify-between gap-2">
                <div className="flex-1 min-w-0">
                <div className="flex items-center gap-1 sm:gap-1.5 md:gap-2 flex-wrap mb-0.5 sm:mb-1 md:mb-2">
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <span>
                        <Badge className={cn("text-[10px] sm:text-xs md:text-sm", powerCategory.color)}>{powerCategory.label}</Badge>
                      </span>
                    </TooltipTrigger>
                    <TooltipContent>
                      <p>Max {station.maxPower} kW</p>
                    </TooltipContent>
                  </Tooltip>
                  {station.isOpen24h && (
                    <Tooltip>
                      <TooltipTrigger asChild>
                        <span>
                          <Badge variant="outline" className="text-[10px] sm:text-xs md:text-sm">24/7</Badge>
                        </span>
                      </TooltipTrigger>
                      <TooltipContent>
                        <p>Stacja otwarta całodobowo</p>
                      </TooltipContent>
                    </Tooltip>
                  )}
                  {isFavorite && (
                    <Star 
                      className="h-3.5 w-3.5 sm:h-4 sm:w-4 fill-amber-400 text-amber-400" 
                      aria-label="Dodane do ulubionych"
                    />
                  )}
                </div>
                <h3 className="font-semibold text-xs sm:text-sm md:text-lg text-foreground line-clamp-1">{station.name}</h3>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <div className="flex items-center gap-1 sm:gap-1.5 md:gap-2 mt-0.5 sm:mt-1 md:mt-2 text-muted-foreground cursor-help">
                      <MapPin className="h-3 w-3 sm:h-3.5 sm:w-3.5 md:h-4 md:w-4 flex-shrink-0" aria-hidden="true" />
                      <span className="text-[10px] sm:text-xs md:text-sm line-clamp-1">{station.address.full}</span>
                    </div>
                  </TooltipTrigger>
                  <TooltipContent>
                    <p>{station.address.full}</p>
                  </TooltipContent>
                </Tooltip>
              </div>
              <div className="flex flex-col items-end gap-1.5 sm:gap-2 md:gap-3">
                <Tooltip>
                  <TooltipTrigger asChild>
                    <span>
                      <Badge 
                        className={cn("flex-shrink-0 text-[10px] sm:text-xs md:text-sm", getAvailabilityBadgeStyle(availabilityInfo.status))}
                        aria-live="polite"
                        aria-label={`Status: ${availabilityInfo.label}`}
                      >
                        {isLoadingAvailability ? (
                          <Loader2 className="h-2.5 w-2.5 sm:h-3 sm:w-3 animate-spin mr-0.5 sm:mr-1" />
                        ) : null}
                        {availabilityInfo.label}
                      </Badge>
                    </span>
                  </TooltipTrigger>
                  <TooltipContent>
                    <p>{availabilityStatusText}</p>
                  </TooltipContent>
                </Tooltip>
                <Button
                  variant="ghost"
                  size="icon"
                  className="h-7 w-7 sm:h-8 sm:w-8 md:h-10 md:w-10 min-h-[28px] min-w-[28px] sm:min-h-[32px] sm:min-w-[32px] md:min-h-[44px] md:min-w-[44px] focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
                  onClick={handleFavoriteClick}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter' || e.key === ' ') {
                      handleFavoriteClick(e);
                    }
                  }}
                  aria-label={isFavorite ? `Usuń ${station.name} z ulubionych` : `Dodaj ${station.name} do ulubionych`}
                  aria-pressed={isFavorite}
                >
                  <Star className={cn("h-3.5 w-3.5 sm:h-4 sm:w-4", isFavorite ? "fill-amber-400 text-amber-400" : "text-muted-foreground")} aria-hidden="true" />
                </Button>
              </div>
            </div>
          </CardHeader>

          <CardContent className="p-2.5 pt-1.5 sm:p-3 sm:pt-2 md:p-5 md:pt-3">
            {/* Availability Progress */}
            <div className="mb-2 sm:mb-3 md:mb-4">
              <div className="flex items-center justify-between mb-0.5 sm:mb-1 md:mb-2">
                <span className="text-[10px] sm:text-xs md:text-sm text-muted-foreground">Dostępność</span>
                <span 
                  className={cn("text-xs sm:text-sm md:text-base font-semibold", getAvailabilityTextColor(station.availableChargers, station.totalChargers))}
                  aria-live="polite"
                >
                  {station.availableChargers}/{station.totalChargers}
                </span>
              </div>
              <div 
                className="h-1.5 sm:h-2 md:h-2.5 bg-muted rounded-full overflow-hidden"
                role="progressbar"
                aria-valuenow={station.availableChargers}
                aria-valuemin={0}
                aria-valuemax={station.totalChargers}
                aria-label={availabilityStatusText}
              >
                <div 
                  className={cn("h-full rounded-full transition-all", getAvailabilityColor(station.availableChargers, station.totalChargers))} 
                  style={{ width: `${availabilityPercentage}%` }} 
                />
              </div>
            </div>

            {/* Station Details - With Tooltips */}
            <dl className="grid grid-cols-2 gap-1.5 sm:gap-2 md:gap-3 mb-2 sm:mb-3 md:mb-4 text-[10px] sm:text-xs md:text-sm">
              <Tooltip>
                <TooltipTrigger asChild>
                  <div className="flex items-center gap-1 sm:gap-1.5 md:gap-2 cursor-help">
                    <Zap className="h-3 w-3 sm:h-3.5 sm:w-3.5 md:h-4 md:w-4 text-primary flex-shrink-0" aria-hidden="true" />
                    <dt className="sr-only">Maksymalna moc</dt>
                    <dd className="text-foreground font-medium">{station.maxPower} kW</dd>
                  </div>
                </TooltipTrigger>
                <TooltipContent>
                  <p>Max moc: {station.maxPower} kW</p>
                </TooltipContent>
              </Tooltip>
              
              <Tooltip>
                <TooltipTrigger asChild>
                  <div className="flex items-center gap-1 sm:gap-1.5 md:gap-2 cursor-help">
                    <Plug className="h-3 w-3 sm:h-3.5 sm:w-3.5 md:h-4 md:w-4 text-muted-foreground flex-shrink-0" aria-hidden="true" />
                    <dt className="sr-only">Liczba punktów</dt>
                    <dd className="text-muted-foreground">{station.totalChargers} pkt</dd>
                  </div>
                </TooltipTrigger>
                <TooltipContent>
                  <p>{station.availableChargers} wolnych z {station.totalChargers}</p>
                </TooltipContent>
              </Tooltip>
              
              {station.avgPricePerKwh && (
                <Tooltip>
                  <TooltipTrigger asChild>
                    <div className="flex items-center gap-1 sm:gap-1.5 md:gap-2 cursor-help">
                      <DollarSign className="h-3 w-3 sm:h-3.5 sm:w-3.5 md:h-4 md:w-4 text-muted-foreground flex-shrink-0" aria-hidden="true" />
                      <dt className="sr-only">Cena za kWh</dt>
                      <dd className="text-foreground font-medium">{station.avgPricePerKwh.toFixed(2)} zł</dd>
                    </div>
                  </TooltipTrigger>
                  <TooltipContent>
                    <p>Od {station.avgPricePerKwh.toFixed(2)} PLN/kWh</p>
                  </TooltipContent>
                </Tooltip>
              )}
              
              {station.distance && (
                <Tooltip>
                  <TooltipTrigger asChild>
                    <div className="flex items-center gap-1 sm:gap-1.5 md:gap-2 cursor-help">
                      <Navigation className="h-3 w-3 sm:h-3.5 sm:w-3.5 md:h-4 md:w-4 text-muted-foreground flex-shrink-0" aria-hidden="true" />
                      <dt className="sr-only">Odległość</dt>
                      <dd className="text-muted-foreground">{station.distance}</dd>
                    </div>
                  </TooltipTrigger>
                  <TooltipContent>
                    <p>Odległość od Ciebie</p>
                  </TooltipContent>
                </Tooltip>
              )}
            </dl>

            {/* Connector Types with Tooltips */}
            <div className="flex flex-wrap gap-0.5 sm:gap-1 md:gap-1.5 mb-2 sm:mb-3 md:mb-4" role="list" aria-label="Dostępne złącza">
              {Array.from(new Set(station.chargingPoints.flatMap(p => p.connectors.map(c => c.type)))).slice(0, 3).map((type) => (
                <Tooltip key={type}>
                  <TooltipTrigger asChild>
                    <span>
                      <Badge variant="outline" className="text-[10px] sm:text-xs md:text-sm px-1 sm:px-1.5 md:px-2 py-0 md:py-0.5" role="listitem">
                        {type}
                      </Badge>
                    </span>
                  </TooltipTrigger>
                  <TooltipContent>
                    <p>Złącze {type}</p>
                  </TooltipContent>
                </Tooltip>
              ))}
            </div>

            {/* Actions */}
            <div className="flex gap-1.5 sm:gap-2 md:gap-3">
              <Button 
                variant="outline" 
                className="flex-1 h-8 sm:h-9 md:h-11 min-h-[32px] sm:min-h-[36px] md:min-h-[44px] text-[10px] sm:text-xs md:text-sm touch-manipulation focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
                aria-label={`Zobacz szczegóły stacji ${station.name}`}
              >
                Szczegóły
              </Button>
              <Button 
                className="flex-1 h-8 sm:h-9 md:h-11 min-h-[32px] sm:min-h-[36px] md:min-h-[44px] text-[10px] sm:text-xs md:text-sm touch-manipulation focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
                onClick={handleNavigate}
                onKeyDown={(e) => {
                  if (e.key === 'Enter' || e.key === ' ') {
                    handleNavigate(e);
                  }
                }}
                aria-label={`Nawiguj do stacji ${station.name}`}
              >
                <Navigation className="mr-0.5 sm:mr-1 h-3 w-3 sm:h-3.5 sm:w-3.5" aria-hidden="true" />
                Nawiguj
              </Button>
            </div>
          </CardContent>
        </Card>
      </article>
    </TooltipProvider>
  );
}