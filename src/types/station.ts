// Types based on EIPA (Ewidencja Infrastruktury Paliw Alternatywnych) data structure

export interface ChargingPoint {
  id: number;
  code: string;
  power: number; // kW
  connectors: ConnectorInfo[];
  availability: AvailabilityStatus;
  operationalStatus: OperationalStatus;
  price?: PriceInfo;
  lastUpdate?: string;
}

export interface ConnectorInfo {
  type: ConnectorType;
  power: number;
  cableAttached: boolean;
}

export type ConnectorType = 
  | 'Type 2'
  | 'CCS Combo 2'
  | 'CHAdeMO'
  | 'Type 1'
  | 'Tesla'
  | 'Other';

export type AvailabilityStatus = 'available' | 'occupied' | 'offline' | 'unknown';
export type OperationalStatus = 'operational' | 'outOfService' | 'maintenance';
export type PowerCategory = 'ac' | 'fast' | 'ultra';

export interface PriceInfo {
  pricePerKwh: number; // PLN
  currency: string;
  lastUpdate: string;
}

export interface OperatorInfo {
  id: number;
  name: string;
  shortName: string;
  code: string;
  phone?: string;
  email?: string;
  website?: string;
}

export interface StationAddress {
  street: string;
  houseNumber: string;
  postalCode: string;
  city: string;
  full: string;
}

export interface OperatingHours {
  weekday: number;
  fromTime: string;
  toTime: string;
}

export interface Station {
  id: string;
  poolId: number;
  name: string;
  latitude: number;
  longitude: number;
  address: StationAddress;
  operator: OperatorInfo;
  chargingPoints: ChargingPoint[];
  maxPower: number;
  powerCategory: PowerCategory;
  totalChargers: number;
  availableChargers: number;
  operatingHours: OperatingHours[];
  isOpen24h: boolean;
  isOpenNow: boolean;
  accessibility?: string;
  paymentMethods: string[];
  authMethods: string[];
  features: string[];
  avgPricePerKwh?: number;
  distance?: string;
}

// Dictionaries from EIPA
export const CONNECTOR_INTERFACES: Record<number, { name: string; description: string }> = {
  10: { name: 'Type 2', description: 'IEC 62196 Type 2' },
  11: { name: 'CHAdeMO', description: 'CHAdeMO' },
  17: { name: 'Type 2', description: 'IEC 62196 Type 2 (with cable)' },
  29: { name: 'CCS Combo 2', description: 'Combo type 2 based' },
  25: { name: 'Tesla', description: 'Tesla connector' },
  19: { name: 'Type 1', description: 'SAE J1772-2009/IEC 62196-2' },
};

export const PAYMENT_METHODS: Record<number, string> = {
  0: 'Unknown',
  1: 'Free charging',
  2: 'Contract with operator',
  4: 'Payment card',
  8: 'Cash',
  16: 'Prepaid card',
  32: 'Fleet card',
  64: 'Bank transfer',
  128: 'Online payment',
};

export const AUTH_METHODS: Record<number, string> = {
  0: 'Open access',
  1: 'No access',
  2: 'RFID/NFC card',
  16: 'PIN code',
  32: 'Mobile app',
  64: 'Phone',
  512: 'Phone call',
  1024: 'SMS',
};

export function getPowerCategory(power: number): PowerCategory {
  if (power <= 22) return 'ac';
  if (power <= 49) return 'fast';
  return 'ultra';
}

export function getConnectorTypeName(interfaceId: number): ConnectorType {
  return (CONNECTOR_INTERFACES[interfaceId]?.name as ConnectorType) || 'Other';
}
