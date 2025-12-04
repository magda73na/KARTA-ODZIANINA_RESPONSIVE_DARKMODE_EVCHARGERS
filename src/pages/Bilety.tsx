import { useState } from "react";
import { Footer } from "@/components/layout/Footer";
import { ReturnTicketDialog } from "@/components/tickets/ReturnTicketDialog";
import { DamageReportDialog } from "@/components/tickets/DamageReportDialog";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { 
  Ticket, 
  Calendar, 
  Clock, 
  MapPin, 
  CreditCard,
  QrCode,
  ChevronRight,
  Bus,
  Building2,
  Dumbbell
} from "lucide-react";

interface TicketData {
  id: string;
  name: string;
  date: string;
  time?: string;
  location?: string;
  price: number;
  status: 'active' | 'used' | 'expired';
  type: 'komunikacja' | 'kultura' | 'sport';
  validUntil?: string;
}

const mockActiveTickets: TicketData[] = [
  { 
    id: "t1", 
    name: "Bilet 24h MPK Łódź", 
    date: "2025-12-04", 
    price: 15.00, 
    status: 'active',
    type: 'komunikacja',
    validUntil: "2025-12-05 14:30"
  },
  { 
    id: "t2", 
    name: "Wstęp do Muzeum Sztuki", 
    date: "2025-12-10", 
    time: "10:00",
    location: "ul. Więckowskiego 36",
    price: 25.00, 
    status: 'active',
    type: 'kultura'
  },
  { 
    id: "t3", 
    name: "Basen Fala - wejście 2h", 
    date: "2025-12-08", 
    time: "16:00",
    location: "al. Unii Lubelskiej 4",
    price: 32.00, 
    status: 'active',
    type: 'sport'
  },
];

const mockHistoryTickets: TicketData[] = [
  { 
    id: "h1", 
    name: "Bilet jednorazowy MPK", 
    date: "2025-12-01", 
    price: 4.60, 
    status: 'used',
    type: 'komunikacja'
  },
  { 
    id: "h2", 
    name: "Zoo Łódź - bilet rodzinny", 
    date: "2025-11-28", 
    time: "11:00",
    location: "ul. Konstantynowska 8/10",
    price: 45.00, 
    status: 'used',
    type: 'kultura'
  },
];

const getTypeIcon = (type: TicketData['type']) => {
  switch (type) {
    case 'komunikacja': return Bus;
    case 'kultura': return Building2;
    case 'sport': return Dumbbell;
  }
};

const getStatusBadge = (status: TicketData['status']) => {
  switch (status) {
    case 'active': return <Badge className="bg-primary">Aktywny</Badge>;
    case 'used': return <Badge variant="secondary">Wykorzystany</Badge>;
    case 'expired': return <Badge variant="destructive">Wygasły</Badge>;
  }
};

function TicketCard({ ticket, showQr = false }: { ticket: TicketData; showQr?: boolean }) {
  const TypeIcon = getTypeIcon(ticket.type);
  
  return (
    <article 
      aria-label={`Bilet: ${ticket.name}, status: ${ticket.status === 'active' ? 'aktywny' : ticket.status === 'used' ? 'wykorzystany' : 'wygasły'}, cena: ${ticket.price.toFixed(2)} złotych`}
    >
      <Card className="overflow-hidden hover:shadow-md transition-shadow focus-within:ring-2 focus-within:ring-ring">
        <CardContent className="p-4">
          <div className="flex items-start gap-4">
            {/* Icon */}
            <div 
              className="h-12 w-12 rounded-lg bg-primary/10 flex items-center justify-center flex-shrink-0"
              aria-hidden="true"
            >
              <TypeIcon className="h-6 w-6 text-primary" />
            </div>
            
            {/* Content */}
            <div className="flex-1 min-w-0">
              <div className="flex items-start justify-between gap-2 mb-2">
                <h3 className="font-semibold text-sm sm:text-base line-clamp-2">{ticket.name}</h3>
                {getStatusBadge(ticket.status)}
              </div>
              
              <dl className="space-y-1 text-xs sm:text-sm text-muted-foreground">
                <div className="flex items-center gap-2">
                  <dt className="sr-only">Data</dt>
                  <Calendar className="h-3.5 w-3.5 flex-shrink-0" aria-hidden="true" />
                  <dd>{new Date(ticket.date).toLocaleDateString('pl-PL', { 
                    weekday: 'short', 
                    day: 'numeric', 
                    month: 'short' 
                  })}</dd>
                  {ticket.time && (
                    <>
                      <dt className="sr-only">Godzina</dt>
                      <Clock className="h-3.5 w-3.5 ml-2 flex-shrink-0" aria-hidden="true" />
                      <dd>{ticket.time}</dd>
                    </>
                  )}
                </div>
                {ticket.location && (
                  <div className="flex items-center gap-2">
                    <dt className="sr-only">Lokalizacja</dt>
                    <MapPin className="h-3.5 w-3.5 flex-shrink-0" aria-hidden="true" />
                    <dd className="truncate">{ticket.location}</dd>
                  </div>
                )}
                {ticket.validUntil && (
                  <div className="flex items-center gap-2 text-primary font-medium">
                    <dt className="sr-only">Ważny do</dt>
                    <Clock className="h-3.5 w-3.5 flex-shrink-0" aria-hidden="true" />
                    <dd>Ważny do: {ticket.validUntil}</dd>
                  </div>
                )}
              </dl>
              
              <div className="flex items-center justify-between mt-3 pt-3 border-t">
                <div className="flex items-center gap-1.5 text-sm font-semibold">
                  <CreditCard className="h-4 w-4 text-muted-foreground" aria-hidden="true" />
                  <span aria-label={`Cena: ${ticket.price.toFixed(2)} złotych`}>
                    {ticket.price.toFixed(2)} zł
                  </span>
                </div>
                {showQr && ticket.status === 'active' && (
                  <Button 
                    variant="outline" 
                    size="sm" 
                    className="gap-2 min-h-[40px] focus-visible:ring-2 focus-visible:ring-ring"
                    aria-label={`Pokaż kod QR dla biletu ${ticket.name}`}
                  >
                    <QrCode className="h-4 w-4" aria-hidden="true" />
                    <span className="hidden sm:inline">Pokaż</span> QR
                  </Button>
                )}
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </article>
  );
}

export default function Bilety() {
  const [activeTab, setActiveTab] = useState("active");

  return (
    <div className="flex-1 flex flex-col min-h-0">
      <main 
        id="main-content" 
        role="main" 
        aria-label="Moje bilety" 
        className="flex-1 overflow-y-auto"
      >
        <div className="container px-4 md:px-6 py-4 md:py-6">
          {/* Header */}
          <header className="mb-6">
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
              <div>
                <h1 className="text-xl sm:text-2xl md:text-3xl font-bold text-foreground flex items-center gap-2">
                  <Ticket className="h-6 w-6 sm:h-7 sm:w-7 text-primary" aria-hidden="true" />
                  Moje bilety
                </h1>
                <p className="text-sm sm:text-base text-muted-foreground mt-1">
                  Zarządzaj swoimi biletami i wejściówkami
                </p>
              </div>
              
              {/* Action Buttons */}
              <div className="flex flex-col sm:flex-row gap-2">
                <ReturnTicketDialog />
                <DamageReportDialog />
              </div>
            </div>
          </header>

          {/* Quick Stats */}
          <section aria-labelledby="stats-heading" className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-6">
            <h2 id="stats-heading" className="sr-only">Podsumowanie biletów</h2>
            <Card>
              <CardContent className="p-4 text-center">
                <p className="text-2xl sm:text-3xl font-bold text-primary" aria-hidden="true">{mockActiveTickets.length}</p>
                <p className="text-xs sm:text-sm text-muted-foreground">Aktywne</p>
                <span className="sr-only">{mockActiveTickets.length} aktywnych biletów</span>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="p-4 text-center">
                <p className="text-2xl sm:text-3xl font-bold text-muted-foreground" aria-hidden="true">{mockHistoryTickets.length}</p>
                <p className="text-xs sm:text-sm text-muted-foreground">Wykorzystane</p>
                <span className="sr-only">{mockHistoryTickets.length} wykorzystanych biletów</span>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="p-4 text-center">
                <p className="text-2xl sm:text-3xl font-bold text-foreground" aria-hidden="true">
                  {(mockActiveTickets.reduce((sum, t) => sum + t.price, 0) + 
                    mockHistoryTickets.reduce((sum, t) => sum + t.price, 0)).toFixed(0)} zł
                </p>
                <p className="text-xs sm:text-sm text-muted-foreground">Łącznie</p>
                <span className="sr-only">Łączna wartość biletów: {(mockActiveTickets.reduce((sum, t) => sum + t.price, 0) + mockHistoryTickets.reduce((sum, t) => sum + t.price, 0)).toFixed(0)} złotych</span>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="p-4 text-center">
                <p className="text-2xl sm:text-3xl font-bold text-primary" aria-hidden="true">0</p>
                <p className="text-xs sm:text-sm text-muted-foreground">Zgłoszenia</p>
                <span className="sr-only">0 aktywnych zgłoszeń</span>
              </CardContent>
            </Card>
          </section>

          {/* Tabs */}
          <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
            <TabsList className="w-full grid grid-cols-2 mb-4 h-12" aria-label="Kategorie biletów">
              <TabsTrigger 
                value="active" 
                className="min-h-[44px] data-[state=active]:bg-primary data-[state=active]:text-primary-foreground focus-visible:ring-2 focus-visible:ring-ring"
                aria-controls="active-tab-content"
              >
                Aktywne ({mockActiveTickets.length})
              </TabsTrigger>
              <TabsTrigger 
                value="history"
                className="min-h-[44px] data-[state=active]:bg-primary data-[state=active]:text-primary-foreground focus-visible:ring-2 focus-visible:ring-ring"
                aria-controls="history-tab-content"
              >
                Historia ({mockHistoryTickets.length})
              </TabsTrigger>
            </TabsList>

            <TabsContent value="active" id="active-tab-content" className="mt-0" role="tabpanel" aria-label="Lista aktywnych biletów">
              {mockActiveTickets.length === 0 ? (
                <Card className="py-12">
                  <CardContent className="text-center">
                    <Ticket className="h-12 w-12 mx-auto mb-4 text-muted-foreground/50" aria-hidden="true" />
                    <h3 className="font-semibold mb-2">Brak aktywnych biletów</h3>
                    <p className="text-sm text-muted-foreground mb-4">
                      Nie masz żadnych aktywnych biletów. Kup bilet, aby zacząć korzystać!
                    </p>
                    <Button className="min-h-[48px] focus-visible:ring-2 focus-visible:ring-ring">
                      Kup bilet
                    </Button>
                  </CardContent>
                </Card>
              ) : (
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
                  {mockActiveTickets.map((ticket) => (
                    <TicketCard key={ticket.id} ticket={ticket} showQr />
                  ))}
                </div>
              )}
            </TabsContent>

            <TabsContent value="history" id="history-tab-content" className="mt-0" role="tabpanel" aria-label="Historia wykorzystanych biletów">
              {mockHistoryTickets.length === 0 ? (
                <Card className="py-12">
                  <CardContent className="text-center">
                    <Ticket className="h-12 w-12 mx-auto mb-4 text-muted-foreground/50" aria-hidden="true" />
                    <h3 className="font-semibold mb-2">Brak historii</h3>
                    <p className="text-sm text-muted-foreground">
                      Nie masz jeszcze żadnych wykorzystanych biletów.
                    </p>
                  </CardContent>
                </Card>
              ) : (
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
                  {mockHistoryTickets.map((ticket) => (
                    <TicketCard key={ticket.id} ticket={ticket} />
                  ))}
                </div>
              )}
            </TabsContent>
          </Tabs>

          {/* Help Section */}
          <section aria-labelledby="help-heading" className="mt-8">
            <h2 id="help-heading" className="text-lg font-semibold mb-4">Potrzebujesz pomocy?</h2>
            <nav className="grid grid-cols-1 sm:grid-cols-2 gap-3" aria-label="Linki pomocy">
              <a 
                href="#jak-kupic-bilet"
                className="group block focus-visible:outline-none"
              >
                <Card className="hover:shadow-md transition-shadow group-focus-visible:ring-2 group-focus-visible:ring-ring group-focus-visible:ring-offset-2">
                  <CardContent className="p-4 flex items-center gap-4">
                    <div 
                      className="h-10 w-10 rounded-full bg-muted flex items-center justify-center"
                      aria-hidden="true"
                    >
                      <Ticket className="h-5 w-5 text-muted-foreground" />
                    </div>
                    <div className="flex-1">
                      <h3 className="font-medium text-sm">Jak kupić bilet?</h3>
                      <p className="text-xs text-muted-foreground">Przewodnik krok po kroku</p>
                    </div>
                    <ChevronRight className="h-5 w-5 text-muted-foreground group-hover:translate-x-0.5 transition-transform" aria-hidden="true" />
                  </CardContent>
                </Card>
              </a>
              <a 
                href="#jak-uzywac-qr"
                className="group block focus-visible:outline-none"
              >
                <Card className="hover:shadow-md transition-shadow group-focus-visible:ring-2 group-focus-visible:ring-ring group-focus-visible:ring-offset-2">
                  <CardContent className="p-4 flex items-center gap-4">
                    <div 
                      className="h-10 w-10 rounded-full bg-muted flex items-center justify-center"
                      aria-hidden="true"
                    >
                      <QrCode className="h-5 w-5 text-muted-foreground" />
                    </div>
                    <div className="flex-1">
                      <h3 className="font-medium text-sm">Jak używać kodu QR?</h3>
                      <p className="text-xs text-muted-foreground">Instrukcja skanowania</p>
                    </div>
                    <ChevronRight className="h-5 w-5 text-muted-foreground group-hover:translate-x-0.5 transition-transform" aria-hidden="true" />
                  </CardContent>
                </Card>
              </a>
            </nav>
          </section>
        </div>

        <Footer />
      </main>
    </div>
  );
}