import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { useLottery, Prize } from "@/hooks/useLottery";
import { LotteryModal } from "@/components/lottery/LotteryModal";
import { 
  Gift, 
  History, 
  Timer, 
  Copy, 
  Check, 
  QrCode, 
  Sparkles, 
  Ticket, 
  Percent, 
  CreditCard, 
  Star,
  Calendar,
  Info
} from "lucide-react";
import { cn } from "@/lib/utils";
import { toast } from "sonner";

const getPrizeIcon = (type: Prize['type']) => {
  switch (type) {
    case 'percent': return Percent;
    case 'voucher': return CreditCard;
    case 'ticket': return Ticket;
    default: return Star;
  }
};

const getPrizeTypeLabel = (type: Prize['type']) => {
  switch (type) {
    case 'percent': return 'Zniżka';
    case 'voucher': return 'Voucher';
    case 'ticket': return 'Bilet';
    default: return 'Nagroda';
  }
};

export default function Loteria() {
  const { canPlay, formatTimeRemaining, prizes } = useLottery();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [copiedCode, setCopiedCode] = useState<string | null>(null);

  const handleCopyCode = async (code: string) => {
    try {
      await navigator.clipboard.writeText(code);
      setCopiedCode(code);
      toast.success('Kod skopiowany do schowka');
      setTimeout(() => setCopiedCode(null), 2000);
    } catch {
      toast.error('Nie udało się skopiować kodu');
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('pl-PL', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  const isExpired = (expiresAt: string) => {
    return new Date(expiresAt) < new Date();
  };

  const activePrizes = prizes.filter(p => !p.used && !isExpired(p.expiresAt));
  const usedOrExpiredPrizes = prizes.filter(p => p.used || isExpired(p.expiresAt));

  return (
    <div className="flex-1 flex flex-col bg-background">
      <main className="flex-1 container px-3 sm:px-4 md:px-6 py-6 sm:py-8">
        {/* Header */}
        <header className="mb-6 sm:mb-8">
          <h1 className="text-2xl sm:text-3xl font-bold text-foreground mb-2 flex items-center gap-2">
            <Gift className="h-6 w-6 sm:h-7 sm:w-7 text-primary" aria-hidden="true" />
            Loteria Karty Łodzianina
          </h1>
          <p className="text-sm sm:text-base text-muted-foreground">
            Zdrapuj zdrapki i wygrywaj zniżki oraz nagrody!
          </p>
        </header>

        {/* Play Section */}
        <section className="mb-8">
          <Card className="bg-gradient-to-br from-primary/5 via-background to-accent/5 border-primary/20">
            <CardContent className="p-6 sm:p-8">
              <div className="flex flex-col md:flex-row items-center gap-6">
                <div className="h-24 w-24 sm:h-32 sm:w-32 rounded-full bg-primary/10 flex items-center justify-center flex-shrink-0">
                  {canPlay ? (
                    <Gift className="h-12 w-12 sm:h-16 sm:w-16 text-primary animate-pulse" aria-hidden="true" />
                  ) : (
                    <Timer className="h-12 w-12 sm:h-16 sm:w-16 text-warning" aria-hidden="true" />
                  )}
                </div>
                
                <div className="flex-1 text-center md:text-left">
                  {canPlay ? (
                    <>
                      <h2 className="text-xl sm:text-2xl font-bold text-foreground mb-2">
                        Gotowy na wygraną? 🎲
                      </h2>
                      <p className="text-sm sm:text-base text-muted-foreground mb-4">
                        Kliknij przycisk i zdrap zdrapkę, aby wylosować nagrodę! 
                        Możesz grać raz na 24 godziny.
                      </p>
                      <Button 
                        size="lg"
                        onClick={() => setIsModalOpen(true)}
                        className="w-full sm:w-auto h-12 sm:h-14 px-8 text-base sm:text-lg gap-2"
                        aria-label="Zagraj w loterię"
                      >
                        <Sparkles className="h-5 w-5" aria-hidden="true" />
                        Zagraj teraz!
                      </Button>
                    </>
                  ) : (
                    <>
                      <h2 className="text-xl sm:text-2xl font-bold text-foreground mb-2">
                        Następna gra dostępna za:
                      </h2>
                      <p className="text-3xl sm:text-4xl font-bold text-warning mb-4" aria-live="polite">
                        {formatTimeRemaining()}
                      </p>
                      <p className="text-sm text-muted-foreground">
                        Wróć później, aby zagrać ponownie!
                      </p>
                    </>
                  )}
                </div>
              </div>
            </CardContent>
          </Card>
        </section>

        {/* Active Prizes */}
        {activePrizes.length > 0 && (
          <section className="mb-8">
            <div className="flex items-center gap-2 mb-4">
              <Gift className="h-5 w-5 text-primary" aria-hidden="true" />
              <h2 className="text-lg sm:text-xl font-semibold text-foreground">
                Twoje aktywne nagrody ({activePrizes.length})
              </h2>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {activePrizes.map((prize) => {
                const Icon = getPrizeIcon(prize.type);
                return (
                  <Card key={prize.id} className="overflow-hidden">
                    <CardHeader className="pb-3 bg-gradient-to-r from-primary/5 to-transparent">
                      <div className="flex items-center gap-3">
                        <div className="h-10 w-10 rounded-full bg-primary/10 flex items-center justify-center">
                          <Icon className="h-5 w-5 text-primary" aria-hidden="true" />
                        </div>
                        <div className="flex-1">
                          <CardTitle className="text-base">{prize.name}</CardTitle>
                          <Badge variant="secondary" className="text-xs mt-1">
                            {getPrizeTypeLabel(prize.type)}
                          </Badge>
                        </div>
                      </div>
                    </CardHeader>
                    <CardContent className="pt-3">
                      <p className="text-sm text-muted-foreground mb-3">{prize.description}</p>
                      
                      <div className="bg-muted/50 rounded-lg p-3 mb-3">
                        <p className="text-xs text-muted-foreground mb-1">Kod zniżkowy:</p>
                        <div className="flex items-center gap-2">
                          <code className="text-sm font-mono font-bold flex-1">{prize.code}</code>
                          <Button
                            variant="ghost"
                            size="icon"
                            className="h-8 w-8"
                            onClick={() => handleCopyCode(prize.code)}
                            aria-label="Kopiuj kod"
                          >
                            {copiedCode === prize.code ? (
                              <Check className="h-4 w-4 text-primary" />
                            ) : (
                              <Copy className="h-4 w-4" />
                            )}
                          </Button>
                        </div>
                      </div>

                      <div className="flex items-center gap-2 text-xs text-muted-foreground">
                        <Calendar className="h-3.5 w-3.5" aria-hidden="true" />
                        <span>Ważny do: {formatDate(prize.expiresAt)}</span>
                      </div>
                      
                      {prize.partner && (
                        <div className="flex items-center gap-2 text-xs text-muted-foreground mt-1">
                          <Info className="h-3.5 w-3.5" aria-hidden="true" />
                          <span>Partner: {prize.partner}</span>
                        </div>
                      )}
                    </CardContent>
                  </Card>
                );
              })}
            </div>
          </section>
        )}

        {/* History */}
        <section>
          <div className="flex items-center gap-2 mb-4">
            <History className="h-5 w-5 text-muted-foreground" aria-hidden="true" />
            <h2 className="text-lg sm:text-xl font-semibold text-foreground">
              Historia losowań ({prizes.length})
            </h2>
          </div>

          {prizes.length === 0 ? (
            <Card>
              <CardContent className="py-12 text-center">
                <Gift className="h-12 w-12 mx-auto text-muted-foreground/50 mb-4" aria-hidden="true" />
                <p className="text-muted-foreground">Brak wylosowanych nagród</p>
                <p className="text-sm text-muted-foreground mt-1">
                  Zagraj w loterię, aby wygrać zniżki!
                </p>
              </CardContent>
            </Card>
          ) : (
            <div className="space-y-2">
              {prizes.map((prize) => {
                const Icon = getPrizeIcon(prize.type);
                const expired = isExpired(prize.expiresAt);
                
                return (
                  <Card 
                    key={prize.id}
                    className={cn(
                      "transition-colors",
                      (prize.used || expired) && "opacity-60"
                    )}
                  >
                    <CardContent className="p-4">
                      <div className="flex items-center gap-3">
                        <div className={cn(
                          "h-10 w-10 rounded-full flex items-center justify-center flex-shrink-0",
                          expired || prize.used ? "bg-muted" : "bg-primary/10"
                        )}>
                          <Icon className={cn(
                            "h-5 w-5",
                            expired || prize.used ? "text-muted-foreground" : "text-primary"
                          )} aria-hidden="true" />
                        </div>
                        
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center gap-2 flex-wrap">
                            <p className="font-medium text-sm">{prize.name}</p>
                            {prize.used && (
                              <Badge variant="secondary" className="text-xs">Wykorzystane</Badge>
                            )}
                            {expired && !prize.used && (
                              <Badge variant="destructive" className="text-xs">Wygasło</Badge>
                            )}
                          </div>
                          <p className="text-xs text-muted-foreground mt-0.5">
                            Wylosowano: {formatDate(prize.wonAt)}
                          </p>
                        </div>

                        <div className="flex items-center gap-1">
                          <code className="text-xs font-mono bg-muted px-2 py-1 rounded hidden sm:block">
                            {prize.code}
                          </code>
                          <Button
                            variant="ghost"
                            size="icon"
                            className="h-8 w-8"
                            onClick={() => handleCopyCode(prize.code)}
                            disabled={expired || prize.used}
                            aria-label="Kopiuj kod"
                          >
                            {copiedCode === prize.code ? (
                              <Check className="h-4 w-4 text-primary" />
                            ) : (
                              <Copy className="h-4 w-4" />
                            )}
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

        {/* Rules */}
        <section className="mt-8">
          <Card className="bg-muted/30">
            <CardContent className="p-4 sm:p-6">
              <h3 className="font-semibold text-foreground mb-3 flex items-center gap-2">
                <Info className="h-4 w-4 text-muted-foreground" aria-hidden="true" />
                Zasady loterii
              </h3>
              <ul className="space-y-2 text-sm text-muted-foreground">
                <li className="flex items-start gap-2">
                  <span className="text-primary">•</span>
                  <span>Możesz grać raz na 24 godziny</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-primary">•</span>
                  <span>Każda nagroda jest ważna przez 30 dni od wylosowania</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-primary">•</span>
                  <span>Kod zniżkowy należy pokazać przy kasie lub wpisać podczas zakupu online</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-primary">•</span>
                  <span>Nagrody nie łączą się z innymi promocjami</span>
                </li>
              </ul>
            </CardContent>
          </Card>
        </section>
      </main>

      <LotteryModal open={isModalOpen} onClose={() => setIsModalOpen(false)} />
    </div>
  );
}
