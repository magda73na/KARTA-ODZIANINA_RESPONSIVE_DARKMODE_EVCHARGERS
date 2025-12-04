import { useState, useCallback, useEffect, useRef } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Card, CardContent } from '@/components/ui/card';
import { ScratchCard } from './ScratchCard';
import { useLottery, Prize } from '@/hooks/useLottery';
import { Gift, History, Timer, Copy, Check, QrCode, Sparkles, Ticket, Percent, CreditCard, Star } from 'lucide-react';
import { cn } from '@/lib/utils';
import { toast } from 'sonner';
import QRCode from 'qrcode';

interface LotteryModalProps {
  open: boolean;
  onClose: () => void;
}

type GameState = 'ready' | 'scratching' | 'won';

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

export function LotteryModal({ open, onClose }: LotteryModalProps) {
  const { canPlay, formatTimeRemaining, prizes, play } = useLottery();
  const [gameState, setGameState] = useState<GameState>('ready');
  const [currentPrize, setCurrentPrize] = useState<Prize | null>(null);
  const [activeTab, setActiveTab] = useState<'play' | 'history'>('play');
  const [copiedCode, setCopiedCode] = useState<string | null>(null);
  const [showQR, setShowQR] = useState<string | null>(null);
  const qrCanvasRef = useRef<HTMLCanvasElement>(null);

  // Reset state when modal opens
  useEffect(() => {
    if (open) {
      setGameState('ready');
      setCurrentPrize(null);
      setActiveTab(canPlay ? 'play' : 'history');
    }
  }, [open, canPlay]);

  // Generate QR code
  useEffect(() => {
    if (showQR && qrCanvasRef.current) {
      QRCode.toCanvas(qrCanvasRef.current, showQR, {
        width: 200,
        margin: 2,
        color: {
          dark: '#000000',
          light: '#ffffff',
        },
      }).catch(console.error);
    }
  }, [showQR]);

  const handleStartGame = useCallback(() => {
    if (!canPlay) return;
    setGameState('scratching');
  }, [canPlay]);

  const handleReveal = useCallback(async () => {
    try {
      const prize = await play();
      setCurrentPrize(prize);
      setGameState('won');
      toast.success(`Gratulacje! Wygrałeś: ${prize.name}`);
    } catch (error) {
      toast.error('Wystąpił błąd podczas losowania');
      setGameState('ready');
    }
  }, [play]);

  const handleCopyCode = useCallback(async (code: string) => {
    try {
      await navigator.clipboard.writeText(code);
      setCopiedCode(code);
      toast.success('Kod skopiowany do schowka');
      setTimeout(() => setCopiedCode(null), 2000);
    } catch {
      toast.error('Nie udało się skopiować kodu');
    }
  }, []);

  const handlePlayAgain = useCallback(() => {
    if (canPlay) {
      setGameState('ready');
      setCurrentPrize(null);
    } else {
      setActiveTab('history');
    }
  }, [canPlay]);

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

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent 
        className="sm:max-w-lg max-h-[90vh] overflow-y-auto"
        aria-labelledby="lottery-title"
        aria-describedby="lottery-description"
      >
        <DialogHeader>
          <DialogTitle id="lottery-title" className="flex items-center gap-2 text-xl">
            <Gift className="h-5 w-5 text-primary" aria-hidden="true" />
            Loteria Karty Łodzianina
          </DialogTitle>
          <DialogDescription id="lottery-description">
            Zdrapuj i wygrywaj nagrody!
          </DialogDescription>
        </DialogHeader>

        <Tabs value={activeTab} onValueChange={(v) => setActiveTab(v as 'play' | 'history')}>
          <TabsList className="grid w-full grid-cols-2 mb-4">
            <TabsTrigger value="play" className="gap-2" aria-label="Zagraj w loterię">
              <Sparkles className="h-4 w-4" aria-hidden="true" />
              Zagraj
            </TabsTrigger>
            <TabsTrigger value="history" className="gap-2" aria-label="Historia zniżek">
              <History className="h-4 w-4" aria-hidden="true" />
              Twoje zniżki ({prizes.length})
            </TabsTrigger>
          </TabsList>

          <TabsContent value="play" className="space-y-4">
            {/* Timer - gdy nie można grać */}
            {!canPlay && gameState === 'ready' && (
              <Card className="border-warning/50 bg-warning/5">
                <CardContent className="p-4 flex items-center gap-3">
                  <div className="h-12 w-12 rounded-full bg-warning/20 flex items-center justify-center flex-shrink-0">
                    <Timer className="h-6 w-6 text-warning" aria-hidden="true" />
                  </div>
                  <div>
                    <p className="font-semibold text-foreground">Następna gra dostępna za:</p>
                    <p className="text-2xl font-bold text-warning" aria-live="polite">
                      {formatTimeRemaining()}
                    </p>
                  </div>
                </CardContent>
              </Card>
            )}

            {/* Ready state */}
            {canPlay && gameState === 'ready' && (
              <div className="text-center space-y-4">
                <div className="h-24 w-24 mx-auto rounded-full bg-primary/10 flex items-center justify-center animate-pulse">
                  <Gift className="h-12 w-12 text-primary" aria-hidden="true" />
                </div>
                <div>
                  <h3 className="text-lg font-semibold">Gotowy na wygraną?</h3>
                  <p className="text-sm text-muted-foreground">
                    Kliknij przycisk i zdrap zdrapkę, aby wylosować nagrodę!
                  </p>
                </div>
                <Button 
                  size="lg" 
                  onClick={handleStartGame}
                  className="w-full h-14 text-lg gap-2"
                  aria-label="Rozpocznij losowanie nagrody"
                >
                  <Sparkles className="h-5 w-5" aria-hidden="true" />
                  🎲 Losuj swoją zniżkę!
                </Button>
              </div>
            )}

            {/* Scratching state */}
            {gameState === 'scratching' && (
              <div className="flex flex-col items-center gap-4">
                <ScratchCard
                  width={300}
                  height={200}
                  onReveal={handleReveal}
                  className="mx-auto"
                >
                  <div className="text-center p-4">
                    <Sparkles className="h-8 w-8 mx-auto text-amber-600 mb-2 animate-bounce" aria-hidden="true" />
                    <p className="text-lg font-bold text-amber-800 dark:text-amber-200">
                      Zdrapuj dalej...
                    </p>
                  </div>
                </ScratchCard>
                <p className="text-sm text-muted-foreground text-center">
                  Przeciągnij palcem lub myszką po zdrapce
                </p>
              </div>
            )}

            {/* Won state */}
            {gameState === 'won' && currentPrize && (
              <div className="text-center space-y-4 animate-fade-in">
                <div className="relative">
                  <div className="h-20 w-20 mx-auto rounded-full bg-gradient-to-br from-amber-400 to-amber-600 flex items-center justify-center shadow-lg">
                    {(() => {
                      const Icon = getPrizeIcon(currentPrize.type);
                      return <Icon className="h-10 w-10 text-white" aria-hidden="true" />;
                    })()}
                  </div>
                  <div className="absolute -top-2 -right-2 left-0 right-0 flex justify-center">
                    <span className="text-4xl animate-bounce">🎉</span>
                  </div>
                </div>

                <div>
                  <Badge className="mb-2">{getPrizeTypeLabel(currentPrize.type)}</Badge>
                  <h3 className="text-xl font-bold text-foreground">{currentPrize.name}</h3>
                  <p className="text-sm text-muted-foreground mt-1">{currentPrize.description}</p>
                  {currentPrize.partner && (
                    <p className="text-xs text-muted-foreground mt-1">
                      Partner: {currentPrize.partner}
                    </p>
                  )}
                </div>

                <Card className="bg-muted/50">
                  <CardContent className="p-4">
                    <p className="text-xs text-muted-foreground mb-2">Twój kod zniżkowy:</p>
                    <div className="flex items-center justify-center gap-2">
                      <code className="text-lg font-mono font-bold bg-background px-3 py-1 rounded">
                        {currentPrize.code}
                      </code>
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => handleCopyCode(currentPrize.code)}
                        aria-label="Kopiuj kod"
                      >
                        {copiedCode === currentPrize.code ? (
                          <Check className="h-4 w-4 text-primary" />
                        ) : (
                          <Copy className="h-4 w-4" />
                        )}
                      </Button>
                    </div>
                    <p className="text-xs text-muted-foreground mt-2">
                      Ważny do: {formatDate(currentPrize.expiresAt)}
                    </p>
                  </CardContent>
                </Card>

                <div className="flex gap-2">
                  <Button
                    variant="outline"
                    className="flex-1 gap-2"
                    onClick={() => setShowQR(currentPrize.code)}
                    aria-label="Pokaż kod QR"
                  >
                    <QrCode className="h-4 w-4" aria-hidden="true" />
                    Pokaż QR
                  </Button>
                  <Button
                    className="flex-1 gap-2"
                    onClick={handlePlayAgain}
                    aria-label={canPlay ? "Zagraj ponownie" : "Zobacz historię"}
                  >
                    {canPlay ? (
                      <>
                        <Sparkles className="h-4 w-4" aria-hidden="true" />
                        Zagraj ponownie
                      </>
                    ) : (
                      <>
                        <History className="h-4 w-4" aria-hidden="true" />
                        Zobacz historię
                      </>
                    )}
                  </Button>
                </div>
              </div>
            )}
          </TabsContent>

          <TabsContent value="history" className="space-y-3">
            {prizes.length === 0 ? (
              <div className="text-center py-8">
                <Gift className="h-12 w-12 mx-auto text-muted-foreground/50 mb-3" aria-hidden="true" />
                <p className="text-muted-foreground">Brak wylosowanych nagród</p>
                <p className="text-sm text-muted-foreground">Zagraj w loterię, aby wygrać zniżki!</p>
              </div>
            ) : (
              <div className="space-y-2 max-h-[400px] overflow-y-auto pr-1">
                {prizes.map((prize) => {
                  const Icon = getPrizeIcon(prize.type);
                  const expired = isExpired(prize.expiresAt);
                  
                  return (
                    <Card 
                      key={prize.id}
                      className={cn(
                        "transition-colors",
                        prize.used && "opacity-60",
                        expired && "opacity-40"
                      )}
                    >
                      <CardContent className="p-3">
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
                            <div className="flex items-center gap-2">
                              <p className="font-medium text-sm truncate">{prize.name}</p>
                              {prize.used && (
                                <Badge variant="secondary" className="text-xs">Wykorzystane</Badge>
                              )}
                              {expired && !prize.used && (
                                <Badge variant="destructive" className="text-xs">Wygasło</Badge>
                              )}
                            </div>
                            <p className="text-xs text-muted-foreground">
                              {formatDate(prize.wonAt)}
                            </p>
                          </div>
                          <div className="flex gap-1">
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
                            <Button
                              variant="ghost"
                              size="icon"
                              className="h-8 w-8"
                              onClick={() => setShowQR(prize.code)}
                              disabled={expired || prize.used}
                              aria-label="Pokaż kod QR"
                            >
                              <QrCode className="h-4 w-4" />
                            </Button>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  );
                })}
              </div>
            )}
          </TabsContent>
        </Tabs>

        {/* QR Code Modal */}
        {showQR && (
          <Dialog open={!!showQR} onOpenChange={() => setShowQR(null)}>
            <DialogContent className="sm:max-w-xs">
              <DialogHeader>
                <DialogTitle className="text-center">Kod QR</DialogTitle>
              </DialogHeader>
              <div className="flex flex-col items-center gap-4">
                <canvas ref={qrCanvasRef} className="rounded-lg" />
                <p className="font-mono text-lg font-bold">{showQR}</p>
                <Button onClick={() => setShowQR(null)} className="w-full">
                  Zamknij
                </Button>
              </div>
            </DialogContent>
          </Dialog>
        )}
      </DialogContent>
    </Dialog>
  );
}
