import { useState, useEffect, useMemo } from 'react';
import { 
  EvPointsDataFile, 
  EvPointData, 
  parseAvailability, 
  parsePricePerKwh 
} from '@/types/ev-point-data';

interface EvPointsDataState {
  data: EvPointData[];
  isLoading: boolean;
  error: string | null;
  generated: string | null;
  totalPoints: number;
}

// Map for fast lookup by point code
type PointLookupMap = Map<string, EvPointData>;

export function useEvPointsData() {
  const [state, setState] = useState<EvPointsDataState>({
    data: [],
    isLoading: true,
    error: null,
    generated: null,
    totalPoints: 0
  });

  useEffect(() => {
    const loadData = async () => {
      try {
        const response = await fetch('/data/ev-points-prices.json');
        if (!response.ok) {
          throw new Error('Nie udało się załadować danych punktów ładowania');
        }
        const jsonData: EvPointsDataFile = await response.json();
        
        setState({
          data: jsonData.data,
          isLoading: false,
          error: null,
          generated: jsonData.generated,
          totalPoints: jsonData.data.length
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

  // Create lookup map for O(1) access by code
  const pointsByCode: PointLookupMap = useMemo(() => {
    const map = new Map<string, EvPointData>();
    for (const point of state.data) {
      map.set(point.code, point);
    }
    return map;
  }, [state.data]);

  // Create lookup map by point_id
  const pointsById: Map<number, EvPointData> = useMemo(() => {
    const map = new Map<number, EvPointData>();
    for (const point of state.data) {
      map.set(point.point_id, point);
    }
    return map;
  }, [state.data]);

  // Helper function to get point data by code
  const getPointByCode = (code: string): EvPointData | undefined => {
    return pointsByCode.get(code);
  };

  // Helper function to get point data by id
  const getPointById = (id: number): EvPointData | undefined => {
    return pointsById.get(id);
  };

  // Get current price for a point
  const getPointPrice = (code: string): number | undefined => {
    const point = pointsByCode.get(code);
    return point ? parsePricePerKwh(point.prices) : undefined;
  };

  // Get current availability status for a point
  const getPointAvailability = (code: string): 'available' | 'occupied' | 'offline' | undefined => {
    const point = pointsByCode.get(code);
    return point ? parseAvailability(point.status) : undefined;
  };

  // Statistics
  const stats = useMemo(() => {
    if (state.data.length === 0) return null;

    let available = 0;
    let occupied = 0;
    let offline = 0;
    let withPrice = 0;
    let totalPrice = 0;
    const stationCodes = new Set<string>();

    for (const point of state.data) {
      // Extract station code from point code (e.g., PL-GJC-E034-01 -> PL-GJC-E034)
      const codeMatch = point.code?.match(/^(.+)-\d+$/);
      if (codeMatch) {
        stationCodes.add(codeMatch[1]);
      } else if (point.code) {
        // If no numeric suffix, use whole code as station
        stationCodes.add(point.code);
      }

      const availability = parseAvailability(point.status);
      if (availability === 'available') available++;
      else if (availability === 'occupied') occupied++;
      else offline++;

      const price = parsePricePerKwh(point.prices);
      if (price !== undefined && price > 0) {
        withPrice++;
        totalPrice += price;
      }
    }

    return {
      totalPoints: state.data.length,
      totalStations: stationCodes.size,
      available,
      occupied,
      offline,
      avgPrice: withPrice > 0 ? totalPrice / withPrice : 0
    };
  }, [state.data]);

  return {
    ...state,
    pointsByCode,
    pointsById,
    getPointByCode,
    getPointById,
    getPointPrice,
    getPointAvailability,
    stats
  };
}
