import { useState } from "react";
import { History, Plus, Trash2, Calendar, Clock, Zap, Wallet, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { ScrollArea } from "@/components/ui/scroll-area";
import { useChargingHistory, ChargingSession } from "@/hooks/useChargingHistory";
import { Station } from "@/types/station";
import { useToast } from "@/hooks/use-toast";
import { format } from "date-fns";
import { pl } from "date-fns/locale";

interface ChargingHistoryPanelProps {
  stations: Station[];
}

export function ChargingHistoryPanel({ stations }: ChargingHistoryPanelProps) {
  const { sessions, addSession, removeSession, clearHistory, getTotalStats, getMonthlyStats } = useChargingHistory();
  const { toast } = useToast();
  const [isOpen, setIsOpen] = useState(false);
  const [addDialogOpen, setAddDialogOpen] = useState(false);
  
  const [newSession, setNewSession] = useState({
    stationId: '',
    date: new Date().toISOString().split('T')[0],
    duration: 30,
    energy: 10,
    cost: 25,
    connectorType: 'CCS',
    power: 50,
  });

  const totalStats = getTotalStats();
  const monthlyStats = getMonthlyStats();

  const handleAddSession = () => {
    const station = stations.find(s => s.id === newSession.stationId);
    if (!station) {
      toast({
        title: "Błąd",
        description: "Wybierz stację ładowania",
        variant: "destructive",
      });
      return;
    }

    addSession({
      stationId: newSession.stationId,
      stationName: station.name,
      date: newSession.date,
      duration: newSession.duration,
      energy: newSession.energy,
      cost: newSession.cost,
      connectorType: newSession.connectorType,
      power: newSession.power,
    });

    toast({
      title: "Dodano sesję",
      description: `Sesja ładowania na ${station.name} została zapisana`,
    });

    setAddDialogOpen(false);
    setNewSession({
      stationId: '',
      date: new Date().toISOString().split('T')[0],
      duration: 30,
      energy: 10,
      cost: 25,
      connectorType: 'CCS',
      power: 50,
    });
  };

  const handleRemoveSession = (sessionId: string) => {
    removeSession(sessionId);
    toast({
      title: "Usunięto",
      description: "Sesja została usunięta z historii",
    });
  };

  return (
    <Sheet open={isOpen} onOpenChange={setIsOpen}>
      <SheetTrigger asChild>
        <Button variant="dark" size="sm" className="gap-2">
          <History className="h-4 w-4" />
          <span className="hidden sm:inline">Historia</span>
          {sessions.length > 0 && (
            <Badge variant="secondary" className="ml-1 bg-background text-foreground">
              {sessions.length}
            </Badge>
          )}
        </Button>
      </SheetTrigger>
      <SheetContent className="w-full sm:max-w-lg">
        <SheetHeader>
          <SheetTitle className="flex items-center gap-2">
            <History className="h-5 w-5" />
            Historia Ładowań
          </SheetTitle>
        </SheetHeader>

        <div className="mt-6 space-y-4">
          {/* Stats Cards */}
          <div className="grid grid-cols-2 gap-3">
            <Card className="bg-accent/10 border-accent/20">
              <CardContent className="p-3">
                <div className="text-xs text-muted-foreground">Ten miesiąc</div>
                <div className="text-lg font-bold text-accent">{monthlyStats.totalCost.toFixed(2)} zł</div>
                <div className="text-xs text-muted-foreground">{monthlyStats.totalEnergy.toFixed(1)} kWh</div>
              </CardContent>
            </Card>
            <Card className="bg-primary/10 border-primary/20">
              <CardContent className="p-3">
                <div className="text-xs text-muted-foreground">Łącznie</div>
                <div className="text-lg font-bold text-primary">{totalStats.totalCost.toFixed(2)} zł</div>
                <div className="text-xs text-muted-foreground">{totalStats.totalEnergy.toFixed(1)} kWh</div>
              </CardContent>
            </Card>
          </div>

          {/* Actions */}
          <div className="flex gap-2">
            <Dialog open={addDialogOpen} onOpenChange={setAddDialogOpen}>
              <DialogTrigger asChild>
                <Button variant="dark" className="flex-1 gap-2">
                  <Plus className="h-4 w-4" />
                  Dodaj sesję
                </Button>
              </DialogTrigger>
              <DialogContent>
                <DialogHeader>
                  <DialogTitle>Nowa sesja ładowania</DialogTitle>
                </DialogHeader>
                <div className="space-y-4 pt-4">
                  <div className="space-y-2">
                    <Label>Stacja</Label>
                    <Select
                      value={newSession.stationId}
                      onValueChange={(value) => setNewSession(prev => ({ ...prev, stationId: value }))}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Wybierz stację" />
                      </SelectTrigger>
                      <SelectContent>
                        {stations.map(station => (
                          <SelectItem key={station.id} value={station.id}>
                            {station.name}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                  
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label>Data</Label>
                      <Input
                        type="date"
                        value={newSession.date}
                        onChange={(e) => setNewSession(prev => ({ ...prev, date: e.target.value }))}
                      />
                    </div>
                    <div className="space-y-2">
                      <Label>Czas (min)</Label>
                      <Input
                        type="number"
                        value={newSession.duration}
                        onChange={(e) => setNewSession(prev => ({ ...prev, duration: Number(e.target.value) }))}
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label>Energia (kWh)</Label>
                      <Input
                        type="number"
                        step="0.1"
                        value={newSession.energy}
                        onChange={(e) => setNewSession(prev => ({ ...prev, energy: Number(e.target.value) }))}
                      />
                    </div>
                    <div className="space-y-2">
                      <Label>Koszt (zł)</Label>
                      <Input
                        type="number"
                        step="0.01"
                        value={newSession.cost}
                        onChange={(e) => setNewSession(prev => ({ ...prev, cost: Number(e.target.value) }))}
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label>Złącze</Label>
                      <Select
                        value={newSession.connectorType}
                        onValueChange={(value) => setNewSession(prev => ({ ...prev, connectorType: value }))}
                      >
                        <SelectTrigger>
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="CCS">CCS</SelectItem>
                          <SelectItem value="CHAdeMO">CHAdeMO</SelectItem>
                          <SelectItem value="Type 2">Type 2</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    <div className="space-y-2">
                      <Label>Moc (kW)</Label>
                      <Input
                        type="number"
                        value={newSession.power}
                        onChange={(e) => setNewSession(prev => ({ ...prev, power: Number(e.target.value) }))}
                      />
                    </div>
                  </div>

                  <Button variant="dark" className="w-full" onClick={handleAddSession}>
                    Zapisz sesję
                  </Button>
                </div>
              </DialogContent>
            </Dialog>
            
            {sessions.length > 0 && (
              <Button
                variant="outline"
                size="icon"
                onClick={() => {
                  clearHistory();
                  toast({ title: "Wyczyszczono", description: "Historia została usunięta" });
                }}
              >
                <Trash2 className="h-4 w-4" />
              </Button>
            )}
          </div>

          {/* Sessions List */}
          <ScrollArea className="h-[400px]">
            {sessions.length === 0 ? (
              <div className="text-center py-12 text-muted-foreground">
                <History className="h-12 w-12 mx-auto mb-4 opacity-50" />
                <p>Brak zapisanych sesji</p>
                <p className="text-sm">Dodaj swoją pierwszą sesję ładowania</p>
              </div>
            ) : (
              <div className="space-y-3">
                {sessions.map((session) => (
                  <Card key={session.id} className="relative">
                    <Button
                      variant="ghost"
                      size="icon"
                      className="absolute top-2 right-2 h-6 w-6"
                      onClick={() => handleRemoveSession(session.id)}
                    >
                      <X className="h-3 w-3" />
                    </Button>
                    <CardContent className="p-4">
                      <div className="font-medium text-sm mb-2">{session.stationName}</div>
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
                      <div className="mt-2 flex gap-1">
                        <Badge variant="outline" className="text-xs">{session.connectorType}</Badge>
                        <Badge variant="outline" className="text-xs">{session.power} kW</Badge>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            )}
          </ScrollArea>
        </div>
      </SheetContent>
    </Sheet>
  );
}
