import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { LotteryModal } from './LotteryModal';
import { useLottery } from '@/hooks/useLottery';
import { Gift, Timer, Sparkles } from 'lucide-react';
import { cn } from '@/lib/utils';

interface LotteryButtonProps {
  className?: string;
  variant?: 'default' | 'card';
}

export function LotteryButton({ className, variant = 'default' }: LotteryButtonProps) {
  const [isOpen, setIsOpen] = useState(false);
  const { canPlay, formatTimeRemaining, prizes } = useLottery();

  const unusedPrizes = prizes.filter(p => !p.used && new Date(p.expiresAt) > new Date());

  if (variant === 'card') {
    return (
      <>
        <button
          onClick={() => setIsOpen(true)}
          className={cn(
            "group relative overflow-hidden rounded-xl p-4 sm:p-5 bg-gradient-to-br from-primary/10 via-primary/5 to-accent/10 border border-primary/20 hover:border-primary/40 transition-all duration-300 text-left w-full focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2",
            className
          )}
          aria-label="Zagraj w loterię Karty Łodzianina"
        >
          {/* Background decoration */}
          <div className="absolute inset-0 bg-gradient-to-br from-primary/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" aria-hidden="true" />
          
          <div className="relative flex items-center gap-3 sm:gap-4">
            <div className={cn(
              "h-12 w-12 sm:h-14 sm:w-14 rounded-full flex items-center justify-center flex-shrink-0 transition-transform group-hover:scale-110",
              canPlay ? "bg-primary/20" : "bg-muted"
            )}>
              {canPlay ? (
                <Gift className="h-6 w-6 sm:h-7 sm:w-7 text-primary" aria-hidden="true" />
              ) : (
                <Timer className="h-6 w-6 sm:h-7 sm:w-7 text-muted-foreground" aria-hidden="true" />
              )}
            </div>
            
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-2 mb-1">
                <h3 className="font-semibold text-foreground text-sm sm:text-base">
                  {canPlay ? '🎲 Zagraj w loterię!' : 'Loteria'}
                </h3>
                {unusedPrizes.length > 0 && (
                  <Badge variant="secondary" className="text-xs">
                    {unusedPrizes.length} {unusedPrizes.length === 1 ? 'nagroda' : unusedPrizes.length < 5 ? 'nagrody' : 'nagród'}
                  </Badge>
                )}
              </div>
              
              {canPlay ? (
                <p className="text-xs sm:text-sm text-muted-foreground">
                  Zdrap zdrapkę i wygraj zniżki!
                </p>
              ) : (
                <p className="text-xs sm:text-sm text-warning font-medium">
                  Następna gra za: {formatTimeRemaining()}
                </p>
              )}
            </div>

            <div className={cn(
              "h-8 w-8 sm:h-9 sm:w-9 rounded-full flex items-center justify-center transition-colors",
              canPlay ? "bg-primary text-primary-foreground" : "bg-muted text-muted-foreground"
            )}>
              <Sparkles className="h-4 w-4" aria-hidden="true" />
            </div>
          </div>

          {/* Animated sparkles when can play */}
          {canPlay && (
            <div className="absolute top-2 right-2 text-lg animate-pulse" aria-hidden="true">
              ✨
            </div>
          )}
        </button>

        <LotteryModal open={isOpen} onClose={() => setIsOpen(false)} />
      </>
    );
  }

  return (
    <>
      <Button
        onClick={() => setIsOpen(true)}
        className={cn(
          "gap-2 relative overflow-hidden",
          canPlay && "animate-pulse hover:animate-none",
          className
        )}
        variant={canPlay ? "default" : "outline"}
        aria-label="Zagraj w loterię Karty Łodzianina"
      >
        {canPlay ? (
          <>
            <Gift className="h-4 w-4" aria-hidden="true" />
            <span>Zagraj</span>
            {unusedPrizes.length > 0 && (
              <Badge variant="secondary" className="ml-1 h-5 w-5 p-0 flex items-center justify-center text-xs">
                {unusedPrizes.length}
              </Badge>
            )}
          </>
        ) : (
          <>
            <Timer className="h-4 w-4" aria-hidden="true" />
            <span className="hidden sm:inline">{formatTimeRemaining()}</span>
            <span className="sm:hidden">Timer</span>
          </>
        )}
      </Button>

      <LotteryModal open={isOpen} onClose={() => setIsOpen(false)} />
    </>
  );
}
