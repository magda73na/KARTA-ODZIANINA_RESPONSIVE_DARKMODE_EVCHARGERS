import { ChargingHistoryPanel } from "@/components/history/ChargingHistoryPanel";
import { lodzStations } from "@/data/lodz-stations";
import { useChargingHistory } from "@/hooks/useChargingHistory";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { History, Calendar, Clock, Zap, Wallet, Trash2, X } from "lucide-react";
import { format } from "date-fns";
import { pl } from "date-fns/locale";
import { useToast } from "@/hooks/use-toast";

export default function Historia() {
  const { sessions, removeSession, clearHistory, getTotalStats, getMonthlyStats } = useChargingHistory();
  const { toast } = useToast();
  const totalStats = getTotalStats();
  const monthlyStats = getMonthlyStats();

  const handleRemoveSession = (sessionId: string) => {
    removeSession(sessionId);
    toast({
      title: "Usunięto",
      description: "Sesja została usunięta z historii",
    });
  };

  return (
    <main id="main-content" role="main" aria-label="Historia ładowań" className="flex-1 flex flex-col">
      <div className="container px-4 md:px-6 py-6">
        <header className="mb-6">
          <h1 className="text-2xl md:text-3xl font-bold text-foreground flex items-center gap-2">
            <History className="h-7 w-7" />
            Historia ładowań
          </h1>
          <p className="text-muted-foreground mt-1">Twoje ostatnie sesje ładowania</p>
        </header>

        {/* Stats Cards */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
          <Card className="bg-accent/10 border-accent/20">
            <CardContent className="p-4">
              <div className="text-xs text-muted-foreground">Ten miesiąc</div>
              <div className="text-xl font-bold text-accent">{monthlyStats.totalCost.toFixed(2)} zł</div>
              <div className="text-xs text-muted-foreground">{monthlyStats.totalEnergy.toFixed(1)} kWh</div>
            </CardContent>
          </Card>
          <Card className="bg-primary/10 border-primary/20">
            <CardContent className="p-4">
              <div className="text-xs text-muted-foreground">Łącznie</div>
              <div className="text-xl font-bold text-primary">{totalStats.totalCost.toFixed(2)} zł</div>
              <div className="text-xs text-muted-foreground">{totalStats.totalEnergy.toFixed(1)} kWh</div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-4">
              <div className="text-xs text-muted-foreground">Sesje</div>
              <div className="text-xl font-bold">{totalStats.totalSessions}</div>
              <div className="text-xs text-muted-foreground">łącznie</div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-4">
              <div className="text-xs text-muted-foreground">Czas</div>
              <div className="text-xl font-bold">{Math.round(totalStats.totalDuration / 60)} h</div>
              <div className="text-xs text-muted-foreground">ładowania</div>
            </CardContent>
          </Card>
        </div>

        {/* Actions */}
        <div className="flex gap-2 mb-6">
          <ChargingHistoryPanel stations={lodzStations} />
          {sessions.length > 0 && (
            <Button
              variant="outline"
              onClick={() => {
                clearHistory();
                toast({ title: "Wyczyszczono", description: "Historia została usunięta" });
              }}
            >
              <Trash2 className="h-4 w-4 mr-2" />
              Wyczyść historię
            </Button>
          )}
        </div>

        <section aria-labelledby="history-heading">
          <h2 id="history-heading" className="sr-only">Lista sesji ładowania</h2>
          
          {sessions.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-16 text-center">
              <div className="w-20 h-20 rounded-full bg-muted flex items-center justify-center mb-4">
                <History className="h-10 w-10 text-muted-foreground" />
              </div>
              <h3 className="font-semibold text-lg mb-2">Brak zapisanych sesji</h3>
              <p className="text-sm text-muted-foreground max-w-xs">
                Dodaj swoją pierwszą sesję ładowania, aby śledzić wydatki
              </p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {sessions.map((session) => (
                <Card key={session.id} className="relative">
                  <Button
                    variant="ghost"
                    size="icon"
                    className="absolute top-2 right-2 h-6 w-6"
                    onClick={() => handleRemoveSession(session.id)}
                    aria-label="Usuń sesję"
                  >
                    <X className="h-3 w-3" />
                  </Button>
                  <CardContent className="p-4">
                    <div className="font-medium text-sm mb-3">{session.stationName}</div>
                    <div className="grid grid-cols-2 gap-2 text-xs text-muted-foreground">
                      <div className="flex items-center gap-1">
                        <Calendar className="h-3 w-3" />
                        {format(new Date(session.date), 'd MMM yyyy', { locale: pl })}
                      </div>
                      <div className="flex items-center gap-1">
                        <Clock className="h-3 w-3" />
                        {session.duration} min
                      </div>
                      <div className="flex items-center gap-1">
                        <Zap className="h-3 w-3" />
                        {session.energy} kWh
                      </div>
                      <div className="flex items-center gap-1">
                        <Wallet className="h-3 w-3" />
                        <span className="font-medium text-foreground">{session.cost.toFixed(2)} zł</span>
                      </div>
                    </div>
                    <div className="mt-3 flex gap-1">
                      <Badge variant="outline" className="text-xs">{session.connectorType}</Badge>
                      <Badge variant="outline" className="text-xs">{session.power} kW</Badge>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </section>
      </div>
    </main>
  );
}
