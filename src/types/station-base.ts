// Types for base station data from EIPA (dane_baz.json)

export interface OperatingHours {
  weekday: number; // 1-7 (Monday-Sunday)
  from_time: string;
  to_time: string;
}

export interface StationBase {
  id: number;
  code: string;
  name: string;
  latitude: number;
  longitude: number;
  elevation?: number;
  street: string;
  house_number: string;
  postal_code: string;
  city: string;
  accessibility?: string;
  operator_id: number;
  charging: boolean;
  refilling: boolean;
  h2refilling: boolean;
  features: string[];
  legalized: boolean;
  filling: boolean;
  operating_hours: OperatingHours[];
  closing_hours: OperatingHours[];
  images: string[];
  ts: string;
}

export interface StationsBaseFile {
  data: StationBase[];
}

// Check if station is in Łódź region
export function isLodzStation(station: StationBase): boolean {
  const city = station.city?.toLowerCase() || '';
  const lodzCities = [
    'łódź', 'lodz', 'łódz', 
    'pabianice', 'zgierz', 'konstantynów łódzki',
    'aleksandrów łódzki', 'ozorków', 'koluszki',
    'brzeziny', 'stryków', 'głowno', 'łęczyca',
    'tuszyn', 'rzgów', 'andrespol', 'nowosolna'
  ];
  
  // Check by city name
  if (lodzCities.some(lc => city.includes(lc))) {
    return true;
  }
  
  // Check by coordinates (Łódź region: approx 51.65-51.85 lat, 19.30-19.60 lon)
  const isInLodzBounds = 
    station.latitude >= 51.60 && station.latitude <= 51.90 &&
    station.longitude >= 19.25 && station.longitude <= 19.70;
  
  return isInLodzBounds;
}

// Check if station is currently open
export function isStationOpen(station: StationBase): boolean {
  const now = new Date();
  const currentDay = now.getDay() || 7; // Convert Sunday (0) to 7
  const currentTime = now.toTimeString().slice(0, 5); // "HH:MM"
  
  const todayHours = station.operating_hours?.find(h => h.weekday === currentDay);
  
  if (!todayHours) {
    // If no hours defined, assume 24/7
    return true;
  }
  
  // Check if closed hours apply
  const closedToday = station.closing_hours?.find(h => h.weekday === currentDay);
  if (closedToday) {
    if (currentTime >= closedToday.from_time && currentTime <= closedToday.to_time) {
      return false;
    }
  }
  
  return currentTime >= todayHours.from_time && currentTime <= todayHours.to_time;
}

// Check if station is 24/7
export function isStation24h(station: StationBase): boolean {
  if (!station.operating_hours || station.operating_hours.length === 0) {
    return true;
  }
  
  return station.operating_hours.every(
    h => h.from_time === '00:00' && (h.to_time === '23:59' || h.to_time === '24:00')
  );
}
