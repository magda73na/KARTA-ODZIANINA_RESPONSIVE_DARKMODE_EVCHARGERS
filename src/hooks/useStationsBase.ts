import { useState, useEffect, useMemo } from 'react';
import { 
  StationBase, 
  StationsBaseFile, 
  isLodzStation,
  isStationOpen,
  isStation24h
} from '@/types/station-base';

interface StationsBaseState {
  allStations: StationBase[];
  lodzStations: StationBase[];
  isLoading: boolean;
  error: string | null;
}

export function useStationsBase() {
  const [state, setState] = useState<StationsBaseState>({
    allStations: [],
    lodzStations: [],
    isLoading: true,
    error: null
  });

  useEffect(() => {
    const loadData = async () => {
      try {
        const response = await fetch('/data/stations-base.json');
        if (!response.ok) {
          throw new Error('Nie udało się załadować danych stacji');
        }
        const jsonData: StationsBaseFile = await response.json();
        
        // Filter Łódź stations
        const lodzStations = jsonData.data.filter(isLodzStation);
        
        setState({
          allStations: jsonData.data,
          lodzStations,
          isLoading: false,
          error: null
        });
      } catch (err) {
        setState(prev => ({
          ...prev,
          isLoading: false,
          error: err instanceof Error ? err.message : 'Nieznany błąd'
        }));
      }
    };

    loadData();
  }, []);

  // Lookup maps
  const stationsById = useMemo(() => {
    const map = new Map<number, StationBase>();
    for (const station of state.allStations) {
      map.set(station.id, station);
    }
    return map;
  }, [state.allStations]);

  const stationsByCode = useMemo(() => {
    const map = new Map<string, StationBase>();
    for (const station of state.allStations) {
      map.set(station.code, station);
    }
    return map;
  }, [state.allStations]);

  // Statistics for Łódź
  const lodzStats = useMemo(() => {
    const stations = state.lodzStations;
    if (stations.length === 0) return null;

    const openNow = stations.filter(isStationOpen).length;
    const open24h = stations.filter(isStation24h).length;
    
    // Group by operator
    const operatorCounts = new Map<number, number>();
    for (const station of stations) {
      const count = operatorCounts.get(station.operator_id) || 0;
      operatorCounts.set(station.operator_id, count + 1);
    }

    return {
      totalStations: stations.length,
      openNow,
      closedNow: stations.length - openNow,
      open24h,
      operatorCount: operatorCounts.size,
      chargingStations: stations.filter(s => s.charging).length,
      refillingStations: stations.filter(s => s.refilling).length,
      h2Stations: stations.filter(s => s.h2refilling).length
    };
  }, [state.lodzStations]);

  // All Poland statistics
  const polandStats = useMemo(() => {
    const stations = state.allStations;
    if (stations.length === 0) return null;

    const operatorIds = new Set<number>();
    let chargingCount = 0;
    let refillingCount = 0;
    let h2Count = 0;

    for (const station of stations) {
      operatorIds.add(station.operator_id);
      if (station.charging) chargingCount++;
      if (station.refilling) refillingCount++;
      if (station.h2refilling) h2Count++;
    }

    return {
      totalStations: stations.length,
      chargingStations: chargingCount,
      refillingStations: refillingCount,
      h2Stations: h2Count,
      operatorCount: operatorIds.size
    };
  }, [state.allStations]);

  return {
    ...state,
    stationsById,
    stationsByCode,
    lodzStats,
    polandStats,
    getStationById: (id: number) => stationsById.get(id),
    getStationByCode: (code: string) => stationsByCode.get(code)
  };
}
