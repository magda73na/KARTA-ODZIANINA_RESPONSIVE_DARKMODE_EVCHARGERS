// Types for JSON point data from EIPA

export interface EvPointPrice {
  literal: string;
  price?: string;
  unit: 'kWh' | 'min' | string;
  ts: string;
}

export interface EvPointStatus {
  availability: 0 | 1; // 0 = unavailable, 1 = available
  status: 0 | 1; // 0 = not operational, 1 = operational
  ts: string;
}

export interface EvPointData {
  point_id: number;
  code: string;
  status: EvPointStatus;
  prices: EvPointPrice[];
}

export interface EvPointsDataFile {
  data: EvPointData[];
  generated: string;
}

// Parse availability from EIPA data
export function parseAvailability(status: EvPointStatus | undefined | null): 'available' | 'occupied' | 'offline' {
  if (!status) return 'offline';
  if (status.status === 0) return 'offline';
  return status.availability === 1 ? 'available' : 'occupied';
}

// Parse price from EIPA data
export function parsePricePerKwh(prices: EvPointPrice[] | undefined | null): number | undefined {
  if (!prices || prices.length === 0) return undefined;
  const kwhPrice = prices.find(p => p.unit === 'kWh' && p.price);
  return kwhPrice?.price ? parseFloat(kwhPrice.price) : undefined;
}

// Get additional fees (per minute)
export function parseMinuteFee(prices: EvPointPrice[] | undefined | null): { fee: number; description: string } | undefined {
  if (!prices || prices.length === 0) return undefined;
  const minPrice = prices.find(p => p.unit === 'min' && p.price);
  if (minPrice?.price) {
    return {
      fee: parseFloat(minPrice.price),
      description: minPrice.literal || 'Opłata za minutę'
    };
  }
  return undefined;
}
