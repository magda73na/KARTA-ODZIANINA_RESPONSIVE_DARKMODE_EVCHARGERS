import { Station, ChargingPoint } from "@/types/station";
import { Sheet, SheetContent, SheetHeader, SheetTitle } from "@/components/ui/sheet";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { ScrollArea } from "@/components/ui/scroll-area";
import { 
  MapPin, Navigation, Phone, Mail, Globe, Clock, Zap, 
  Battery, Plug, CreditCard, Shield, ChevronRight, X,
  CheckCircle2, XCircle, AlertCircle, Star, Bell, BellRing, BellOff, Loader2, RefreshCw
} from "lucide-react";
import { cn } from "@/lib/utils";
import { useToast } from "@/hooks/use-toast";
import { useStationAvailability } from "@/hooks/useStationAvailability";
import { useEffect } from "react";

interface StationDetailSheetProps {
  station: Station | null;
  open: boolean;
  onClose: () => void;
  isFavorite: boolean;
  onToggleFavorite: (stationId: string) => void;
  isSubscribed: boolean;
  onSubscribe: (stationId: string, stationName: string) => Promise<boolean>;
  onUnsubscribe: (stationId: string) => void;
  notificationPermission: NotificationPermission;
  notificationsSupported: boolean;
}

const getAvailabilityIcon = (status: string, operationalStatus?: string) => {
  // Niesprawny (faulted) has priority
  if (operationalStatus && operationalStatus !== 'operational') {
    return <AlertCircle className="h-4 w-4 text-destructive" aria-hidden="true" />;
  }
  switch (status) {
    case 'available':
      return <CheckCircle2 className="h-4 w-4 text-primary" aria-hidden="true" />;
    case 'occupied':
      return <XCircle className="h-4 w-4 text-warning" aria-hidden="true" />;
    case 'offline':
      return <AlertCircle className="h-4 w-4 text-destructive" aria-hidden="true" />;
    default:
      return <AlertCircle className="h-4 w-4 text-muted-foreground" aria-hidden="true" />;
  }
};

const getAvailabilityLabel = (status: string, operationalStatus?: string) => {
  // Niesprawny has priority - if operational status is not operational
  if (operationalStatus && operationalStatus !== 'operational') {
    return operationalStatus === 'maintenance' ? 'Serwis' : 'Niesprawny';
  }
  switch (status) {
    case 'available': return 'Dostępny';
    case 'occupied': return 'Zajęty';
    case 'offline': return 'Niesprawny';
    default: return 'Status nieznany';
  }
};

const getPowerCategoryStyle = (category: string) => {
  switch (category) {
    case 'ultra': return 'bg-violet-500 text-white';
    case 'fast': return 'bg-amber-500 text-white';
    default: return 'bg-primary text-primary-foreground';
  }
};

function ChargingPointCard({ point, index }: { point: ChargingPoint; index: number }) {
  const isAvailable = point.availability === 'available' && point.operationalStatus === 'operational';
  const isFaulted = point.operationalStatus !== 'operational';
  const statusLabel = getAvailabilityLabel(point.availability, point.operationalStatus);
  
  return (
    <article 
      className={cn(
        "p-3 sm:p-4 rounded-lg border transition-colors",
        isAvailable ? "bg-primary/5 border-primary/20" : 
        isFaulted ? "bg-destructive/5 border-destructive/20" : 
        "bg-muted/50 border-border"
      )}
      aria-label={`Punkt ładowania ${index + 1}, ${point.power} kW, ${statusLabel}`}
    >
      <div className="flex items-start justify-between mb-3">
        <div className="flex items-center gap-2">
          <div className={cn(
            "w-8 h-8 rounded-full flex items-center justify-center text-sm font-semibold",
            isAvailable ? "bg-primary text-primary-foreground" : 
            isFaulted ? "bg-destructive text-destructive-foreground" :
            "bg-muted text-muted-foreground"
          )} aria-hidden="true">
            {index + 1}
          </div>
          <div>
            <p className="text-sm font-medium">{point.power} kW</p>
            <p className="text-xs text-muted-foreground">{point.code}</p>
          </div>
        </div>
        <div className="flex items-center gap-1.5" aria-live="polite">
          {getAvailabilityIcon(point.availability, point.operationalStatus)}
          <span className={cn(
            "text-sm font-medium",
            isAvailable ? "text-primary" : 
            isFaulted ? "text-destructive" :
            point.availability === 'occupied' ? "text-warning" :
            "text-muted-foreground"
          )}>
            {statusLabel}
          </span>
        </div>
      </div>

      <div className="flex flex-wrap gap-1.5 mb-3" role="list" aria-label="Złącza">
        {point.connectors.map((connector, idx) => (
          <Badge key={idx} variant="outline" className="text-xs" role="listitem">
            <Plug className="h-3 w-3 mr-1" aria-hidden="true" />
            {connector.type} ({connector.power} kW)
          </Badge>
        ))}
      </div>

      {point.price && (
        <div className="flex items-center justify-between text-sm">
          <span className="text-muted-foreground">Cena</span>
          <span className="font-semibold text-primary">
            {point.price.pricePerKwh.toFixed(2)} PLN/kWh
          </span>
        </div>
      )}
    </article>
  );
}

export function StationDetailSheet({ 
  station, 
  open, 
  onClose,
  isFavorite,
  onToggleFavorite,
  isSubscribed,
  onSubscribe,
  onUnsubscribe,
  notificationPermission,
  notificationsSupported
}: StationDetailSheetProps) {
  const { toast } = useToast();
  
  // Realtime availability for this specific station
  const { availability, isLoading: availabilityLoading, error: availabilityError, refresh } = useStationAvailability(
    open ? station?.id : undefined, 
    open // Auto refresh when open
  );
  
  if (!station) return null;

  const handleNavigate = () => {
    const url = `https://www.google.com/maps/dir/?api=1&destination=${station.latitude},${station.longitude}`;
    window.open(url, '_blank', 'noopener,noreferrer');
  };

  const handleCall = () => {
    if (station.operator.phone) {
      window.location.href = `tel:${station.operator.phone}`;
    }
  };

  const handleEmail = () => {
    if (station.operator.email) {
      window.location.href = `mailto:${station.operator.email}`;
    }
  };

  const handleWebsite = () => {
    if (station.operator.website) {
      window.open(station.operator.website, '_blank', 'noopener,noreferrer');
    }
  };

  const handleNotificationToggle = async () => {
    if (!notificationsSupported) {
      toast({
        title: "Nie wspierane",
        description: "Twoja przeglądarka nie obsługuje powiadomień",
        variant: "destructive"
      });
      return;
    }

    if (isSubscribed) {
      onUnsubscribe(station.id);
      toast({
        title: "Anulowano subskrypcję",
        description: `Nie będziesz już otrzymywać powiadomień o ${station.name}`
      });
    } else {
      const success = await onSubscribe(station.id, station.name);
      if (success) {
        toast({
          title: "Subskrypcja aktywna",
          description: `Powiadomimy Cię gdy stacja będzie dostępna`
        });
      } else if (notificationPermission === 'denied') {
        toast({
          title: "Brak uprawnień",
          description: "Włącz powiadomienia w ustawieniach przeglądarki",
          variant: "destructive"
        });
      }
    }
  };

  // Use realtime data if available
  const availablePoints = availability?.availableConnectors ?? station.chargingPoints.filter(p => p.availability === 'available').length;
  const totalPoints = availability?.totalConnectors ?? station.totalChargers;
  const powerCategory = station.powerCategory === 'ultra' ? 'Ultra-Szybkie' : station.powerCategory === 'fast' ? 'Szybkie DC' : 'AC';

  return (
    <Sheet open={open} onOpenChange={onClose}>
      <SheetContent 
        side="bottom" 
        className="h-[85vh] sm:h-[90vh] rounded-t-2xl p-0"
        aria-label={`Szczegóły stacji ${station.name}`}
      >
        <div className="flex flex-col h-full">
          {/* Header */}
          <SheetHeader className="p-3 sm:p-4 pb-2 sm:pb-3 border-b sticky top-0 bg-background z-10">
            <div className="flex items-start justify-between gap-2">
              <div className="flex-1 min-w-0 pr-2">
                <div className="flex items-center gap-1.5 flex-wrap mb-1">
                  <Badge className={cn("text-xs", getPowerCategoryStyle(station.powerCategory))}>
                    {powerCategory}
                  </Badge>
                  {station.isOpen24h && (
                    <Badge variant="outline" className="text-xs">
                      <Clock className="h-3 w-3 mr-1" aria-hidden="true" />
                      24/7
                    </Badge>
                  )}
                </div>
                <SheetTitle className="text-base sm:text-lg text-left truncate">{station.name}</SheetTitle>
                <div className="flex items-center gap-1.5 mt-1 text-xs sm:text-sm text-muted-foreground">
                  <MapPin className="h-3.5 w-3.5 flex-shrink-0" aria-hidden="true" />
                  <span className="truncate">{station.address.full}</span>
                </div>
              </div>
              <div className="flex items-center gap-1 flex-shrink-0">
                <Button 
                  variant={isFavorite ? "default" : "ghost"} 
                  size="icon" 
                  onClick={() => onToggleFavorite(station.id)}
                  className={cn("h-9 w-9 min-h-[36px] min-w-[36px]", isFavorite && "bg-amber-500 hover:bg-amber-600")}
                  aria-label={isFavorite ? "Usuń z ulubionych" : "Dodaj do ulubionych"}
                  aria-pressed={isFavorite}
                >
                  <Star className={cn("h-4 w-4", isFavorite && "fill-white")} aria-hidden="true" />
                </Button>
                {notificationsSupported && (
                  <Button 
                    variant={isSubscribed ? "default" : "ghost"} 
                    size="icon" 
                    onClick={handleNotificationToggle}
                    className="h-9 w-9 min-h-[36px] min-w-[36px]"
                    aria-label={isSubscribed ? "Wyłącz powiadomienia" : "Włącz powiadomienia o dostępności"}
                    aria-pressed={isSubscribed}
                  >
                    {isSubscribed ? (
                      <BellRing className="h-4 w-4" aria-hidden="true" />
                    ) : notificationPermission === 'denied' ? (
                      <BellOff className="h-4 w-4" aria-hidden="true" />
                    ) : (
                      <Bell className="h-4 w-4" aria-hidden="true" />
                    )}
                  </Button>
                )}
                <Button 
                  variant="ghost" 
                  size="icon" 
                  onClick={onClose} 
                  className="h-9 w-9 min-h-[36px] min-w-[36px]"
                  aria-label="Zamknij szczegóły"
                >
                  <X className="h-4 w-4" aria-hidden="true" />
                </Button>
              </div>
            </div>
          </SheetHeader>

          <ScrollArea className="flex-1">
            <div className="p-3 sm:p-4 space-y-4 sm:space-y-6">
              {/* Quick Stats with Realtime Indicator */}
              <section aria-labelledby="stats-heading">
                <h3 id="stats-heading" className="sr-only">Statystyki dostępności</h3>
                <div className="flex items-center justify-between mb-2">
                  <span className="text-xs text-muted-foreground">Status w czasie rzeczywistym</span>
                  <Button 
                    variant="ghost" 
                    size="sm" 
                    onClick={refresh}
                    disabled={availabilityLoading}
                    className="h-7 text-xs"
                    aria-label="Odśwież dane dostępności"
                  >
                    {availabilityLoading ? (
                      <Loader2 className="h-3 w-3 animate-spin mr-1" aria-hidden="true" />
                    ) : (
                      <RefreshCw className="h-3 w-3 mr-1" aria-hidden="true" />
                    )}
                    Odśwież
                  </Button>
                </div>
                <div 
                  className="grid grid-cols-3 gap-2 sm:gap-3"
                  role="region"
                  aria-live="polite"
                  aria-atomic="true"
                >
                  <div className="text-center p-2 sm:p-3 bg-muted/50 rounded-lg">
                    <p className="text-xl sm:text-2xl font-bold text-primary">{availablePoints}</p>
                    <p className="text-xs text-muted-foreground">Dostępne</p>
                  </div>
                  <div className="text-center p-2 sm:p-3 bg-muted/50 rounded-lg">
                    <p className="text-xl sm:text-2xl font-bold">{totalPoints}</p>
                    <p className="text-xs text-muted-foreground">Łącznie</p>
                  </div>
                  <div className="text-center p-2 sm:p-3 bg-muted/50 rounded-lg">
                    <p className="text-xl sm:text-2xl font-bold">{station.maxPower}</p>
                    <p className="text-xs text-muted-foreground">kW Maks.</p>
                  </div>
                </div>
                {availabilityError && (
                  <p className="text-xs text-destructive mt-2" role="alert">
                    Nie udało się pobrać aktualnych danych: {availabilityError}
                  </p>
                )}
              </section>

              {/* Notification Banner */}
              {isSubscribed && (
                <div 
                  className="p-3 bg-primary/10 border border-primary/20 rounded-lg flex items-center gap-3"
                  role="status"
                >
                  <BellRing className="h-5 w-5 text-primary flex-shrink-0" aria-hidden="true" />
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium">Powiadomienia włączone</p>
                    <p className="text-xs text-muted-foreground">Powiadomimy Cię gdy stacja będzie wolna</p>
                  </div>
                </div>
              )}

              {/* Pricing Overview */}
              {station.avgPricePerKwh && (
                <div className="p-3 sm:p-4 bg-primary/5 rounded-lg border border-primary/20">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <Battery className="h-5 w-5 text-primary" aria-hidden="true" />
                      <span className="font-medium text-sm">Średnia Cena</span>
                    </div>
                    <span className="text-lg sm:text-xl font-bold text-primary">
                      {station.avgPricePerKwh.toFixed(2)} PLN/kWh
                    </span>
                  </div>
                </div>
              )}

              <Separator />

              {/* Charging Points */}
              <section aria-labelledby="charging-points-heading">
                <h3 id="charging-points-heading" className="font-semibold mb-3 flex items-center gap-2 text-sm sm:text-base">
                  <Zap className="h-5 w-5 text-primary" aria-hidden="true" />
                  Punkty Ładowania ({station.chargingPoints.length})
                </h3>
                <div className="space-y-2 sm:space-y-3" role="list">
                  {station.chargingPoints.map((point, index) => (
                    <ChargingPointCard key={point.id} point={point} index={index} />
                  ))}
                </div>
              </section>

              <Separator />

              {/* Payment & Auth Methods */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <section aria-labelledby="payment-methods-heading">
                  <h4 id="payment-methods-heading" className="text-sm font-medium mb-2 flex items-center gap-2">
                    <CreditCard className="h-4 w-4" aria-hidden="true" />
                    Metody Płatności
                  </h4>
                  <div className="flex flex-wrap gap-1.5" role="list">
                    {station.paymentMethods.map((method) => (
                      <Badge key={method} variant="secondary" className="text-xs" role="listitem">
                        {method}
                      </Badge>
                    ))}
                  </div>
                </section>
                <section aria-labelledby="auth-methods-heading">
                  <h4 id="auth-methods-heading" className="text-sm font-medium mb-2 flex items-center gap-2">
                    <Shield className="h-4 w-4" aria-hidden="true" />
                    Uwierzytelnianie
                  </h4>
                  <div className="flex flex-wrap gap-1.5" role="list">
                    {station.authMethods.map((method) => (
                      <Badge key={method} variant="secondary" className="text-xs" role="listitem">
                        {method}
                      </Badge>
                    ))}
                  </div>
                </section>
              </div>

              <Separator />

              {/* Operator Info */}
              <section aria-labelledby="operator-heading">
                <h3 id="operator-heading" className="font-semibold mb-3 text-sm sm:text-base">Operator</h3>
                <div className="p-3 sm:p-4 bg-muted/30 rounded-lg space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="font-medium text-sm">{station.operator.name}</span>
                    <Badge variant="outline" className="text-xs">{station.operator.code}</Badge>
                  </div>
                  
                  <div className="grid grid-cols-1 gap-2">
                    {station.operator.phone && (
                      <Button 
                        variant="outline" 
                        size="sm" 
                        className="justify-start h-10 min-h-[44px] text-sm" 
                        onClick={handleCall}
                        aria-label={`Zadzwoń: ${station.operator.phone}`}
                      >
                        <Phone className="h-4 w-4 mr-2" aria-hidden="true" />
                        {station.operator.phone}
                      </Button>
                    )}
                    {station.operator.email && (
                      <Button 
                        variant="outline" 
                        size="sm" 
                        className="justify-start h-10 min-h-[44px] text-sm" 
                        onClick={handleEmail}
                        aria-label={`Wyślij email: ${station.operator.email}`}
                      >
                        <Mail className="h-4 w-4 mr-2" aria-hidden="true" />
                        <span className="truncate">{station.operator.email}</span>
                      </Button>
                    )}
                    {station.operator.website && (
                      <Button 
                        variant="outline" 
                        size="sm" 
                        className="justify-start h-10 min-h-[44px] text-sm" 
                        onClick={handleWebsite}
                        aria-label="Odwiedź stronę operatora"
                      >
                        <Globe className="h-4 w-4 mr-2" aria-hidden="true" />
                        Odwiedź Stronę
                        <ChevronRight className="h-4 w-4 ml-auto" aria-hidden="true" />
                      </Button>
                    )}
                  </div>
                </div>
              </section>

              {/* Accessibility */}
              {station.accessibility && (
                <section aria-labelledby="accessibility-heading">
                  <Separator className="mb-4" />
                  <h3 id="accessibility-heading" className="font-semibold mb-2 text-sm sm:text-base">Szczegóły Lokalizacji</h3>
                  <p className="text-sm text-muted-foreground">{station.accessibility}</p>
                </section>
              )}

              {/* Features */}
              {station.features.length > 0 && (
                <section aria-labelledby="features-heading">
                  <Separator className="mb-4" />
                  <h3 id="features-heading" className="font-semibold mb-2 text-sm sm:text-base">W Pobliżu</h3>
                  <div className="flex flex-wrap gap-2" role="list">
                    {station.features.map((feature) => (
                      <Badge key={feature} variant="outline" role="listitem">{feature}</Badge>
                    ))}
                  </div>
                </section>
              )}
            </div>
          </ScrollArea>

          {/* Fixed Footer Actions */}
          <div className="p-3 sm:p-4 border-t bg-background sticky bottom-0 safe-area-inset-bottom">
            <div className="flex gap-2 sm:gap-3">
              <Button 
                variant="outline" 
                className="flex-1 h-11 sm:h-12 min-h-[44px] text-sm sm:text-base touch-manipulation focus-visible:ring-2 focus-visible:ring-ring"
                onClick={handleCall}
                disabled={!station.operator.phone}
                aria-label="Zadzwoń do operatora"
              >
                <Phone className="mr-2 h-4 w-4 sm:h-5 sm:w-5" aria-hidden="true" />
                Zadzwoń
              </Button>
              <Button 
                className="flex-1 h-11 sm:h-12 min-h-[44px] text-sm sm:text-base touch-manipulation focus-visible:ring-2 focus-visible:ring-ring"
                onClick={handleNavigate}
                aria-label="Nawiguj do stacji"
              >
                <Navigation className="mr-2 h-4 w-4 sm:h-5 sm:w-5" aria-hidden="true" />
                Nawiguj
              </Button>
            </div>
          </div>
        </div>
      </SheetContent>
    </Sheet>
  );
}
