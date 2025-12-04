import { useState, useEffect, useCallback } from 'react';
import { supabase } from '@/integrations/supabase/client';

export interface Prize {
  id: string;
  name: string;
  description: string;
  type: 'percent' | 'voucher' | 'ticket' | 'other';
  value: number;
  code: string;
  wonAt: string;
  expiresAt: string;
  used: boolean;
  partner?: string;
}

const COOLDOWN_MS = 24 * 60 * 60 * 1000; // 24 hours
const SESSION_KEY = 'karta-lodzianina-session';

function generateSecureToken(length: number = 32): string {
  const array = new Uint8Array(length);
  crypto.getRandomValues(array);
  return Array.from(array, byte => byte.toString(16).padStart(2, '0')).join('');
}

function getSessionId(): string {
  let sessionId = localStorage.getItem(SESSION_KEY);
  
  // Check if existing session uses old insecure format
  const isSecureFormat = sessionId && /^kl-[a-f0-9]{64}$/.test(sessionId);
  
  if (!sessionId || !isSecureFormat) {
    // Generate cryptographically secure session ID
    sessionId = `kl-${generateSecureToken(32)}`;
    localStorage.setItem(SESSION_KEY, sessionId);
  }
  return sessionId;
}

export function useLottery() {
  const [prizes, setPrizes] = useState<Prize[]>([]);
  const [lastDrawTime, setLastDrawTime] = useState<string | null>(null);
  const [timeRemaining, setTimeRemaining] = useState<number>(0);
  const [canPlay, setCanPlay] = useState<boolean>(true);
  const [isLoading, setIsLoading] = useState(true);

  const sessionId = getSessionId();

  // Fetch data from Supabase
  const fetchData = useCallback(async () => {
    try {
      // Fetch prizes
      const { data: prizesData, error: prizesError } = await supabase
        .from('lottery_prizes')
        .select('*')
        .eq('session_id', sessionId)
        .order('won_at', { ascending: false });

      if (prizesError) {
        console.error('Błąd pobierania nagród:', prizesError);
      } else if (prizesData) {
        setPrizes(prizesData.map(p => ({
          id: p.id,
          name: p.name,
          description: p.description,
          type: p.type as Prize['type'],
          value: p.value,
          code: p.code,
          wonAt: p.won_at,
          expiresAt: p.expires_at,
          used: p.used,
          partner: p.partner || undefined,
        })));
      }

      // Fetch last draw
      const { data: drawData, error: drawError } = await supabase
        .from('lottery_draws')
        .select('drawn_at')
        .eq('session_id', sessionId)
        .maybeSingle();

      if (drawError) {
        console.error('Błąd pobierania losowania:', drawError);
      } else if (drawData) {
        setLastDrawTime(drawData.drawn_at);
      }
    } catch (error) {
      console.error('Błąd pobierania danych loterii:', error);
    } finally {
      setIsLoading(false);
    }
  }, [sessionId]);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  // Calculate remaining time
  const calculateTimeRemaining = useCallback(() => {
    if (!lastDrawTime) {
      return 0;
    }
    const lastDraw = new Date(lastDrawTime).getTime();
    const now = Date.now();
    const remaining = Math.max(0, COOLDOWN_MS - (now - lastDraw));
    return remaining;
  }, [lastDrawTime]);

  // Update timer every second
  useEffect(() => {
    const updateTimer = () => {
      const remaining = calculateTimeRemaining();
      setTimeRemaining(remaining);
      setCanPlay(remaining === 0);
    };

    updateTimer();
    const interval = setInterval(updateTimer, 1000);
    return () => clearInterval(interval);
  }, [calculateTimeRemaining]);

  // Play lottery - calls server-side Edge Function
  const play = useCallback(async (): Promise<Prize> => {
    if (!canPlay) {
      throw new Error('Musisz poczekać do następnej gry');
    }

    // Call server-side Edge Function for secure prize drawing
    const { data, error } = await supabase.functions.invoke('lottery-draw', {
      body: { session_id: sessionId },
    });

    if (error) {
      console.error('Błąd losowania:', error);
      throw new Error('Nie udało się wylosować nagrody');
    }

    if (data.error) {
      console.error('Błąd serwera:', data.error);
      throw new Error(data.error);
    }

    const newPrize: Prize = data.prize;

    setPrizes(prev => [newPrize, ...prev]);
    setLastDrawTime(newPrize.wonAt);

    return newPrize;
  }, [canPlay, sessionId]);

  const markAsUsed = useCallback(async (prizeId: string) => {
    const { error } = await supabase
      .from('lottery_prizes')
      .update({ used: true, used_at: new Date().toISOString() })
      .eq('id', prizeId)
      .eq('session_id', sessionId);

    if (error) {
      console.error('Błąd aktualizacji nagrody:', error);
      return;
    }

    setPrizes(prev => prev.map(p => 
      p.id === prizeId ? { ...p, used: true } : p
    ));
  }, [sessionId]);

  const formatTimeRemaining = useCallback((): string => {
    if (timeRemaining === 0) return '';
    
    const hours = Math.floor(timeRemaining / (1000 * 60 * 60));
    const minutes = Math.floor((timeRemaining % (1000 * 60 * 60)) / (1000 * 60));
    const seconds = Math.floor((timeRemaining % (1000 * 60)) / 1000);
    
    if (hours > 0) {
      return `${hours}h ${minutes}m ${seconds}s`;
    }
    if (minutes > 0) {
      return `${minutes}m ${seconds}s`;
    }
    return `${seconds}s`;
  }, [timeRemaining]);

  return {
    canPlay,
    timeRemaining,
    formatTimeRemaining,
    prizes,
    play,
    markAsUsed,
    isLoading,
  };
}
