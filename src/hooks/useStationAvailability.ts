import { useState, useEffect, useCallback } from 'react';
import { supabase } from '@/integrations/supabase/client';

export interface ConnectorAvailability {
  id: string;
  type: string;
  status: 'available' | 'occupied' | 'faulted' | 'unavailable';
  power: number;
  lastUpdated: string;
}

export interface StationAvailability {
  stationId: string;
  connectors: ConnectorAvailability[];
  totalConnectors: number;
  availableConnectors: number;
  timestamp: string;
}

export function useStationAvailability(stationId?: string, autoRefresh = false) {
  const [availability, setAvailability] = useState<StationAvailability | null>(null);
  const [allAvailability, setAllAvailability] = useState<StationAvailability[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchAvailability = useCallback(async (id?: string) => {
    setIsLoading(true);
    setError(null);

    try {
      const params: Record<string, string> = {};
      if (id) params.stationId = id;

      const { data, error: fnError } = await supabase.functions.invoke('station-availability', {
        body: null,
      });

      if (fnError) throw fnError;

      if (id && data) {
        setAvailability(data);
      } else if (data?.stations) {
        setAllAvailability(data.stations);
      }
    } catch (err) {
      console.error('Error fetching station availability:', err);
      setError(err instanceof Error ? err.message : 'Błąd pobierania danych');
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchAvailability(stationId);

    if (autoRefresh) {
      const interval = setInterval(() => {
        fetchAvailability(stationId);
      }, 30000); // Refresh every 30 seconds

      return () => clearInterval(interval);
    }
  }, [stationId, autoRefresh, fetchAvailability]);

  const refresh = useCallback(() => {
    fetchAvailability(stationId);
  }, [stationId, fetchAvailability]);

  return {
    availability,
    allAvailability,
    isLoading,
    error,
    refresh,
  };
}
