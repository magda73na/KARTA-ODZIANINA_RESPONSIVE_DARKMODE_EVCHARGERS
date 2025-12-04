import { Station, ChargingPoint, getPowerCategory } from '@/types/station';
import { StationFiltersType } from '@/components/stations/StationFilters';

// Extended Łódź EV charging stations data based on EIPA database
// Źródło: Ewidencja Infrastruktury Paliw Alternatywnych (EIPA) + dane operatorów
export const lodzStations: Station[] = [
  {
    id: "lodz-001",
    poolId: 1847,
    name: "Manufaktura - Parking Główny",
    latitude: 51.7948,
    longitude: 19.4442,
    address: {
      street: "ul. Drewnowska",
      houseNumber: "58",
      postalCode: "91-002",
      city: "Łódź",
      full: "ul. Drewnowska 58, 91-002 Łódź"
    },
    operator: {
      id: 5,
      name: "GreenWay Polska Sp. z o.o.",
      shortName: "GreenWay",
      code: "PL-7R5",
      phone: "+48 58 325 10 17",
      email: "bok@greenwaypolska.pl",
      website: "https://greenwaypolska.pl"
    },
    chargingPoints: [
      { id: 24501, code: "PL-7R5-E001-01", power: 50, connectors: [{ type: 'CCS Combo 2', power: 50, cableAttached: true }, { type: 'CHAdeMO', power: 50, cableAttached: true }], availability: 'available', operationalStatus: 'operational', price: { pricePerKwh: 1.89, currency: 'PLN', lastUpdate: '2025-12-03' } },
      { id: 24502, code: "PL-7R5-E001-02", power: 50, connectors: [{ type: 'CCS Combo 2', power: 50, cableAttached: true }], availability: 'occupied', operationalStatus: 'operational', price: { pricePerKwh: 1.89, currency: 'PLN', lastUpdate: '2025-12-03' } },
      { id: 24503, code: "PL-7R5-E001-03", power: 22, connectors: [{ type: 'Type 2', power: 22, cableAttached: false }], availability: 'available', operationalStatus: 'operational', price: { pricePerKwh: 1.49, currency: 'PLN', lastUpdate: '2025-12-03' } },
      { id: 24504, code: "PL-7R5-E001-04", power: 22, connectors: [{ type: 'Type 2', power: 22, cableAttached: false }], availability: 'available', operationalStatus: 'operational', price: { pricePerKwh: 1.49, currency: 'PLN', lastUpdate: '2025-12-03' } }
    ],
    maxPower: 50,
    powerCategory: 'fast',
    totalChargers: 4,
    availableChargers: 3,
    operatingHours: [],
    isOpen24h: true,
    isOpenNow: true,
    accessibility: "Parking podziemny Manufaktura",
    paymentMethods: ['Aplikacja mobilna', 'Karta płatnicza', 'Karta RFID'],
    authMethods: ['Aplikacja mobilna', 'RFID/NFC'],
    features: ['Parking kryty', 'Centrum handlowe'],
    avgPricePerKwh: 1.69,
    distance: "0.8 km"
  },
  {
    id: "lodz-002",
    poolId: 2156,
    name: "Galeria Łódzka",
    latitude: 51.7687,
    longitude: 19.4515,
    address: { street: "al. Piłsudskiego", houseNumber: "15/23", postalCode: "90-307", city: "Łódź", full: "al. Piłsudskiego 15/23, 90-307 Łódź" },
    operator: { id: 8, name: "PGE Nowa Energia Sp. z o.o.", shortName: "PGE", code: "PL-PGE", phone: "+48 22 344 55 66", email: "nowa.energia@gkpge.pl", website: "https://pge.pl" },
    chargingPoints: [
      { id: 31001, code: "PL-PGE-E045-01", power: 150, connectors: [{ type: 'CCS Combo 2', power: 150, cableAttached: true }], availability: 'available', operationalStatus: 'operational', price: { pricePerKwh: 2.19, currency: 'PLN', lastUpdate: '2025-12-03' } },
      { id: 31002, code: "PL-PGE-E045-02", power: 150, connectors: [{ type: 'CCS Combo 2', power: 150, cableAttached: true }], availability: 'available', operationalStatus: 'operational', price: { pricePerKwh: 2.19, currency: 'PLN', lastUpdate: '2025-12-03' } },
      { id: 31003, code: "PL-PGE-E045-03", power: 22, connectors: [{ type: 'Type 2', power: 22, cableAttached: false }], availability: 'occupied', operationalStatus: 'operational', price: { pricePerKwh: 1.39, currency: 'PLN', lastUpdate: '2025-12-03' } }
    ],
    maxPower: 150,
    powerCategory: 'ultra',
    totalChargers: 3,
    availableChargers: 2,
    operatingHours: [],
    isOpen24h: false,
    isOpenNow: true,
    accessibility: "Parking podziemny przy wejściu głównym",
    paymentMethods: ['Aplikacja mobilna', 'Karta płatnicza'],
    authMethods: ['Aplikacja mobilna', 'RFID/NFC'],
    features: ['Centrum handlowe', 'Kino'],
    avgPricePerKwh: 1.92,
    distance: "1.2 km"
  },
  {
    id: "lodz-003",
    poolId: 2891,
    name: "EC1 Łódź - Miasto Kultury",
    latitude: 51.7658,
    longitude: 19.4758,
    address: { street: "ul. Targowa", houseNumber: "1/3", postalCode: "90-022", city: "Łódź", full: "ul. Targowa 1/3, 90-022 Łódź" },
    operator: { id: 11, name: "TAURON NOWE TECHNOLOGIE S.A.", shortName: "TAURON", code: "PL-BB4", phone: "+48 572 886 552", email: "emap@tauron.pl", website: "https://tauron.pl" },
    chargingPoints: [
      { id: 45201, code: "PL-BB4-E012-01", power: 50, connectors: [{ type: 'CCS Combo 2', power: 50, cableAttached: true }, { type: 'CHAdeMO', power: 50, cableAttached: true }], availability: 'offline', operationalStatus: 'maintenance', price: { pricePerKwh: 1.79, currency: 'PLN', lastUpdate: '2025-12-03' } },
      { id: 45202, code: "PL-BB4-E012-02", power: 22, connectors: [{ type: 'Type 2', power: 22, cableAttached: false }], availability: 'available', operationalStatus: 'operational', price: { pricePerKwh: 1.29, currency: 'PLN', lastUpdate: '2025-12-03' } },
      { id: 45203, code: "PL-BB4-E012-03", power: 22, connectors: [{ type: 'Type 2', power: 22, cableAttached: false }], availability: 'occupied', operationalStatus: 'operational', price: { pricePerKwh: 1.29, currency: 'PLN', lastUpdate: '2025-12-03' } }
    ],
    maxPower: 50,
    powerCategory: 'fast',
    totalChargers: 3,
    availableChargers: 1,
    operatingHours: [],
    isOpen24h: true,
    isOpenNow: true,
    accessibility: "Parking przed budynkiem EC1",
    paymentMethods: ['Aplikacja mobilna', 'Karta płatnicza', 'Karta RFID'],
    authMethods: ['Aplikacja mobilna', 'RFID/NFC'],
    features: ['Centrum kultury', 'Planetarium'],
    avgPricePerKwh: 1.46,
    distance: "1.5 km"
  },
  {
    id: "lodz-004",
    poolId: 3245,
    name: "Sukcesja - Ultra Charger",
    latitude: 51.7527,
    longitude: 19.4393,
    address: { street: "al. Politechniki", houseNumber: "1", postalCode: "93-590", city: "Łódź", full: "al. Politechniki 1, 93-590 Łódź" },
    operator: { id: 5, name: "GreenWay Polska Sp. z o.o.", shortName: "GreenWay", code: "PL-7R5", phone: "+48 58 325 10 17", email: "bok@greenwaypolska.pl", website: "https://greenwaypolska.pl" },
    chargingPoints: [
      { id: 52301, code: "PL-7R5-E089-01", power: 350, connectors: [{ type: 'CCS Combo 2', power: 350, cableAttached: true }], availability: 'available', operationalStatus: 'operational', price: { pricePerKwh: 2.49, currency: 'PLN', lastUpdate: '2025-12-03' } },
      { id: 52302, code: "PL-7R5-E089-02", power: 350, connectors: [{ type: 'CCS Combo 2', power: 350, cableAttached: true }], availability: 'available', operationalStatus: 'operational', price: { pricePerKwh: 2.49, currency: 'PLN', lastUpdate: '2025-12-03' } },
      { id: 52303, code: "PL-7R5-E089-03", power: 150, connectors: [{ type: 'CCS Combo 2', power: 150, cableAttached: true }, { type: 'CHAdeMO', power: 100, cableAttached: true }], availability: 'occupied', operationalStatus: 'operational', price: { pricePerKwh: 2.19, currency: 'PLN', lastUpdate: '2025-12-03' } },
      { id: 52304, code: "PL-7R5-E089-04", power: 22, connectors: [{ type: 'Type 2', power: 22, cableAttached: false }], availability: 'available', operationalStatus: 'operational', price: { pricePerKwh: 1.59, currency: 'PLN', lastUpdate: '2025-12-03' } }
    ],
    maxPower: 350,
    powerCategory: 'ultra',
    totalChargers: 4,
    availableChargers: 3,
    operatingHours: [],
    isOpen24h: true,
    isOpenNow: true,
    accessibility: "Parking naziemny przy centrum handlowym",
    paymentMethods: ['Aplikacja mobilna', 'Karta płatnicza', 'Karta RFID'],
    authMethods: ['Aplikacja mobilna', 'RFID/NFC'],
    features: ['Centrum handlowe', 'Tesla charging'],
    avgPricePerKwh: 2.19,
    distance: "2.1 km"
  },
  {
    id: "lodz-005",
    poolId: 1523,
    name: "Hotel Tobaco",
    latitude: 51.7625,
    longitude: 19.4628,
    address: { street: "ul. Kopernika", houseNumber: "64", postalCode: "90-553", city: "Łódź", full: "ul. Kopernika 64, 90-553 Łódź" },
    operator: { id: 4, name: "EV PLUS Sp. z o.o.", shortName: "EV PLUS", code: "PL-GJC", phone: "+48 533 708 555", email: "biuro@evplus.com.pl", website: "https://evplus.com.pl" },
    chargingPoints: [
      { id: 18901, code: "PL-GJC-E034-01", power: 11, connectors: [{ type: 'Type 2', power: 11, cableAttached: false }], availability: 'available', operationalStatus: 'operational', price: { pricePerKwh: 1.19, currency: 'PLN', lastUpdate: '2025-12-03' } },
      { id: 18902, code: "PL-GJC-E034-02", power: 11, connectors: [{ type: 'Type 2', power: 11, cableAttached: false }], availability: 'occupied', operationalStatus: 'operational', price: { pricePerKwh: 1.19, currency: 'PLN', lastUpdate: '2025-12-03' } }
    ],
    maxPower: 11,
    powerCategory: 'ac',
    totalChargers: 2,
    availableChargers: 1,
    operatingHours: [],
    isOpen24h: true,
    isOpenNow: true,
    accessibility: "Parking hotelowy",
    paymentMethods: ['Aplikacja mobilna', 'Karta RFID'],
    authMethods: ['Aplikacja mobilna', 'RFID/NFC'],
    features: ['Hotel', 'Restauracja'],
    avgPricePerKwh: 1.19,
    distance: "2.8 km"
  },
  {
    id: "lodz-006",
    poolId: 4012,
    name: "Port Łódź - Hub Ładowania",
    latitude: 51.7189,
    longitude: 19.3872,
    address: { street: "ul. Pabianicka", houseNumber: "245", postalCode: "93-457", city: "Łódź", full: "ul. Pabianicka 245, 93-457 Łódź" },
    operator: { id: 5, name: "GreenWay Polska Sp. z o.o.", shortName: "GreenWay", code: "PL-7R5", phone: "+48 58 325 10 17", email: "bok@greenwaypolska.pl", website: "https://greenwaypolska.pl" },
    chargingPoints: [
      { id: 67801, code: "PL-7R5-E156-01", power: 150, connectors: [{ type: 'CCS Combo 2', power: 150, cableAttached: true }], availability: 'available', operationalStatus: 'operational', price: { pricePerKwh: 2.09, currency: 'PLN', lastUpdate: '2025-12-03' } },
      { id: 67802, code: "PL-7R5-E156-02", power: 150, connectors: [{ type: 'CCS Combo 2', power: 150, cableAttached: true }], availability: 'available', operationalStatus: 'operational', price: { pricePerKwh: 2.09, currency: 'PLN', lastUpdate: '2025-12-03' } },
      { id: 67803, code: "PL-7R5-E156-03", power: 50, connectors: [{ type: 'CCS Combo 2', power: 50, cableAttached: true }, { type: 'CHAdeMO', power: 50, cableAttached: true }], availability: 'occupied', operationalStatus: 'operational', price: { pricePerKwh: 1.89, currency: 'PLN', lastUpdate: '2025-12-03' } },
      { id: 67804, code: "PL-7R5-E156-04", power: 22, connectors: [{ type: 'Type 2', power: 22, cableAttached: false }], availability: 'available', operationalStatus: 'operational', price: { pricePerKwh: 1.49, currency: 'PLN', lastUpdate: '2025-12-03' } },
      { id: 67805, code: "PL-7R5-E156-05", power: 22, connectors: [{ type: 'Type 2', power: 22, cableAttached: false }], availability: 'available', operationalStatus: 'operational', price: { pricePerKwh: 1.49, currency: 'PLN', lastUpdate: '2025-12-03' } },
      { id: 67806, code: "PL-7R5-E156-06", power: 22, connectors: [{ type: 'Type 2', power: 22, cableAttached: false }], availability: 'available', operationalStatus: 'operational', price: { pricePerKwh: 1.49, currency: 'PLN', lastUpdate: '2025-12-03' } },
      { id: 67807, code: "PL-7R5-E156-07", power: 22, connectors: [{ type: 'Type 2', power: 22, cableAttached: false }], availability: 'occupied', operationalStatus: 'operational', price: { pricePerKwh: 1.49, currency: 'PLN', lastUpdate: '2025-12-03' } },
      { id: 67808, code: "PL-7R5-E156-08", power: 22, connectors: [{ type: 'Type 2', power: 22, cableAttached: false }], availability: 'available', operationalStatus: 'operational', price: { pricePerKwh: 1.49, currency: 'PLN', lastUpdate: '2025-12-03' } }
    ],
    maxPower: 150,
    powerCategory: 'ultra',
    totalChargers: 8,
    availableChargers: 6,
    operatingHours: [],
    isOpen24h: true,
    isOpenNow: true,
    accessibility: "Parking naziemny, strefa EV blisko wejścia",
    paymentMethods: ['Aplikacja mobilna', 'Karta płatnicza', 'Karta RFID'],
    authMethods: ['Aplikacja mobilna', 'RFID/NFC'],
    features: ['Centrum handlowe', 'IKEA', 'Kino'],
    avgPricePerKwh: 1.69,
    distance: "5.2 km"
  },
  {
    id: "lodz-007",
    poolId: 2478,
    name: "Łódź Fabryczna - Dworzec",
    latitude: 51.7680,
    longitude: 19.4698,
    address: { street: "al. Bandurskiego", houseNumber: "4", postalCode: "90-003", city: "Łódź", full: "al. Bandurskiego 4, 90-003 Łódź" },
    operator: { id: 26, name: "Orlen Charge Sp. z o.o.", shortName: "Orlen Charge", code: "PL-ORL", phone: "+48 22 778 00 00", email: "charge@orlen.pl", website: "https://orlencharge.pl" },
    chargingPoints: [
      { id: 38901, code: "PL-ORL-E078-01", power: 150, connectors: [{ type: 'CCS Combo 2', power: 150, cableAttached: true }], availability: 'available', operationalStatus: 'operational', price: { pricePerKwh: 2.29, currency: 'PLN', lastUpdate: '2025-12-03' } },
      { id: 38902, code: "PL-ORL-E078-02", power: 150, connectors: [{ type: 'CCS Combo 2', power: 150, cableAttached: true }], availability: 'occupied', operationalStatus: 'operational', price: { pricePerKwh: 2.29, currency: 'PLN', lastUpdate: '2025-12-03' } },
      { id: 38903, code: "PL-ORL-E078-03", power: 50, connectors: [{ type: 'CCS Combo 2', power: 50, cableAttached: true }, { type: 'CHAdeMO', power: 50, cableAttached: true }], availability: 'available', operationalStatus: 'operational', price: { pricePerKwh: 1.99, currency: 'PLN', lastUpdate: '2025-12-03' } },
      { id: 38904, code: "PL-ORL-E078-04", power: 22, connectors: [{ type: 'Type 2', power: 22, cableAttached: false }], availability: 'available', operationalStatus: 'operational', price: { pricePerKwh: 1.49, currency: 'PLN', lastUpdate: '2025-12-03' } }
    ],
    maxPower: 150,
    powerCategory: 'ultra',
    totalChargers: 4,
    availableChargers: 3,
    operatingHours: [],
    isOpen24h: true,
    isOpenNow: true,
    accessibility: "Parking podziemny dworca Łódź Fabryczna",
    paymentMethods: ['Aplikacja mobilna', 'Karta płatnicza', 'Karta RFID', 'Orlen Pay'],
    authMethods: ['Aplikacja mobilna', 'RFID/NFC', 'Kod QR'],
    features: ['Dworzec kolejowy', 'Dworzec autobusowy'],
    avgPricePerKwh: 2.02,
    distance: "1.0 km"
  },
  {
    id: "lodz-008",
    poolId: 3567,
    name: "Piotrkowska 217",
    latitude: 51.7513,
    longitude: 19.4563,
    address: { street: "ul. Piotrkowska", houseNumber: "217", postalCode: "90-451", city: "Łódź", full: "ul. Piotrkowska 217, 90-451 Łódź" },
    operator: { id: 8, name: "PGE Nowa Energia Sp. z o.o.", shortName: "PGE", code: "PL-PGE", phone: "+48 22 344 55 66", email: "nowa.energia@gkpge.pl", website: "https://pge.pl" },
    chargingPoints: [
      { id: 56701, code: "PL-PGE-E089-01", power: 22, connectors: [{ type: 'Type 2', power: 22, cableAttached: false }], availability: 'available', operationalStatus: 'operational', price: { pricePerKwh: 1.29, currency: 'PLN', lastUpdate: '2025-12-03' } },
      { id: 56702, code: "PL-PGE-E089-02", power: 22, connectors: [{ type: 'Type 2', power: 22, cableAttached: false }], availability: 'available', operationalStatus: 'operational', price: { pricePerKwh: 1.29, currency: 'PLN', lastUpdate: '2025-12-03' } }
    ],
    maxPower: 22,
    powerCategory: 'ac',
    totalChargers: 2,
    availableChargers: 2,
    operatingHours: [],
    isOpen24h: true,
    isOpenNow: true,
    accessibility: "Parking przy ul. Piotrkowskiej",
    paymentMethods: ['Aplikacja mobilna', 'Karta płatnicza'],
    authMethods: ['Aplikacja mobilna', 'RFID/NFC'],
    features: ['Centrum miasta', 'Restauracje'],
    avgPricePerKwh: 1.29,
    distance: "3.2 km"
  },
  {
    id: "lodz-009",
    poolId: 4234,
    name: "Orlen - al. Włókniarzy",
    latitude: 51.7856,
    longitude: 19.4234,
    address: { street: "al. Włókniarzy", houseNumber: "256", postalCode: "91-301", city: "Łódź", full: "al. Włókniarzy 256, 91-301 Łódź" },
    operator: { id: 26, name: "Orlen Charge Sp. z o.o.", shortName: "Orlen Charge", code: "PL-ORL", phone: "+48 22 778 00 00", email: "charge@orlen.pl", website: "https://orlencharge.pl" },
    chargingPoints: [
      { id: 71201, code: "PL-ORL-E145-01", power: 150, connectors: [{ type: 'CCS Combo 2', power: 150, cableAttached: true }], availability: 'available', operationalStatus: 'operational', price: { pricePerKwh: 2.19, currency: 'PLN', lastUpdate: '2025-12-03' } },
      { id: 71202, code: "PL-ORL-E145-02", power: 50, connectors: [{ type: 'CCS Combo 2', power: 50, cableAttached: true }, { type: 'CHAdeMO', power: 50, cableAttached: true }], availability: 'available', operationalStatus: 'operational', price: { pricePerKwh: 1.89, currency: 'PLN', lastUpdate: '2025-12-03' } }
    ],
    maxPower: 150,
    powerCategory: 'ultra',
    totalChargers: 2,
    availableChargers: 2,
    operatingHours: [],
    isOpen24h: true,
    isOpenNow: true,
    accessibility: "Stacja paliw Orlen",
    paymentMethods: ['Aplikacja mobilna', 'Karta płatnicza', 'Orlen Pay', 'Karta RFID'],
    authMethods: ['Aplikacja mobilna', 'RFID/NFC', 'Kod QR'],
    features: ['Stacja paliw', 'Sklep'],
    avgPricePerKwh: 2.04,
    distance: "4.1 km"
  },
  {
    id: "lodz-010",
    poolId: 1892,
    name: "Politechnika Łódzka",
    latitude: 51.7534,
    longitude: 19.4512,
    address: { street: "ul. Żeromskiego", houseNumber: "116", postalCode: "90-924", city: "Łódź", full: "ul. Żeromskiego 116, 90-924 Łódź" },
    operator: { id: 4, name: "EV PLUS Sp. z o.o.", shortName: "EV PLUS", code: "PL-GJC", phone: "+48 533 708 555", email: "biuro@evplus.com.pl", website: "https://evplus.com.pl" },
    chargingPoints: [
      { id: 22301, code: "PL-GJC-E056-01", power: 22, connectors: [{ type: 'Type 2', power: 22, cableAttached: false }], availability: 'available', operationalStatus: 'operational', price: { pricePerKwh: 0.99, currency: 'PLN', lastUpdate: '2025-12-03' } },
      { id: 22302, code: "PL-GJC-E056-02", power: 22, connectors: [{ type: 'Type 2', power: 22, cableAttached: false }], availability: 'occupied', operationalStatus: 'operational', price: { pricePerKwh: 0.99, currency: 'PLN', lastUpdate: '2025-12-03' } },
      { id: 22303, code: "PL-GJC-E056-03", power: 11, connectors: [{ type: 'Type 2', power: 11, cableAttached: false }], availability: 'available', operationalStatus: 'operational', price: { pricePerKwh: 0.89, currency: 'PLN', lastUpdate: '2025-12-03' } }
    ],
    maxPower: 22,
    powerCategory: 'ac',
    totalChargers: 3,
    availableChargers: 2,
    operatingHours: [{ weekday: 1, fromTime: "06:00", toTime: "22:00" }],
    isOpen24h: false,
    isOpenNow: true,
    accessibility: "Parking przy Centrum Sportu PŁ",
    paymentMethods: ['Aplikacja mobilna', 'Karta RFID'],
    authMethods: ['Aplikacja mobilna', 'RFID/NFC'],
    features: ['Uczelnia', 'Centrum sportowe'],
    avgPricePerKwh: 0.96,
    distance: "2.5 km"
  },
  {
    id: "lodz-011",
    poolId: 5123,
    name: "Lidl - Łódź Górna",
    latitude: 51.7412,
    longitude: 19.4867,
    address: { street: "ul. Pabianicka", houseNumber: "78", postalCode: "93-421", city: "Łódź", full: "ul. Pabianicka 78, 93-421 Łódź" },
    operator: { id: 89, name: "Lidl Polska", shortName: "Lidl", code: "PL-LDL", phone: "+48 61 856 69 00", email: "info@lidl.pl", website: "https://lidl.pl" },
    chargingPoints: [
      { id: 82301, code: "PL-LDL-E034-01", power: 50, connectors: [{ type: 'CCS Combo 2', power: 50, cableAttached: true }], availability: 'available', operationalStatus: 'operational', price: { pricePerKwh: 1.59, currency: 'PLN', lastUpdate: '2025-12-03' } },
      { id: 82302, code: "PL-LDL-E034-02", power: 22, connectors: [{ type: 'Type 2', power: 22, cableAttached: false }], availability: 'available', operationalStatus: 'operational', price: { pricePerKwh: 1.29, currency: 'PLN', lastUpdate: '2025-12-03' } }
    ],
    maxPower: 50,
    powerCategory: 'fast',
    totalChargers: 2,
    availableChargers: 2,
    operatingHours: [{ weekday: 1, fromTime: "06:00", toTime: "22:00" }, { weekday: 2, fromTime: "06:00", toTime: "22:00" }],
    isOpen24h: false,
    isOpenNow: true,
    accessibility: "Parking przy sklepie Lidl",
    paymentMethods: ['Aplikacja mobilna', 'Karta płatnicza'],
    authMethods: ['Aplikacja mobilna', 'Kod QR'],
    features: ['Supermarket'],
    avgPricePerKwh: 1.44,
    distance: "4.8 km"
  },
  {
    id: "lodz-012",
    poolId: 3891,
    name: "Atlas Arena",
    latitude: 51.7478,
    longitude: 19.4089,
    address: { street: "al. Bandurskiego", houseNumber: "7", postalCode: "94-020", city: "Łódź", full: "al. Bandurskiego 7, 94-020 Łódź" },
    operator: { id: 11, name: "TAURON NOWE TECHNOLOGIE S.A.", shortName: "TAURON", code: "PL-BB4", phone: "+48 572 886 552", email: "emap@tauron.pl", website: "https://tauron.pl" },
    chargingPoints: [
      { id: 64501, code: "PL-BB4-E067-01", power: 50, connectors: [{ type: 'CCS Combo 2', power: 50, cableAttached: true }, { type: 'CHAdeMO', power: 50, cableAttached: true }], availability: 'available', operationalStatus: 'operational', price: { pricePerKwh: 1.79, currency: 'PLN', lastUpdate: '2025-12-03' } },
      { id: 64502, code: "PL-BB4-E067-02", power: 22, connectors: [{ type: 'Type 2', power: 22, cableAttached: false }], availability: 'available', operationalStatus: 'operational', price: { pricePerKwh: 1.29, currency: 'PLN', lastUpdate: '2025-12-03' } },
      { id: 64503, code: "PL-BB4-E067-03", power: 22, connectors: [{ type: 'Type 2', power: 22, cableAttached: false }], availability: 'occupied', operationalStatus: 'operational', price: { pricePerKwh: 1.29, currency: 'PLN', lastUpdate: '2025-12-03' } }
    ],
    maxPower: 50,
    powerCategory: 'fast',
    totalChargers: 3,
    availableChargers: 2,
    operatingHours: [],
    isOpen24h: true,
    isOpenNow: true,
    accessibility: "Parking główny przy Atlas Arena",
    paymentMethods: ['Aplikacja mobilna', 'Karta płatnicza', 'Karta RFID'],
    authMethods: ['Aplikacja mobilna', 'RFID/NFC'],
    features: ['Hala sportowa', 'Koncerty'],
    avgPricePerKwh: 1.46,
    distance: "3.5 km"
  },
  // === NOWE STACJE Z EIPA ===
  {
    id: "lodz-013",
    poolId: 5201,
    name: "Volvo Charging - Rokicińska",
    latitude: 51.7723,
    longitude: 19.5412,
    address: { street: "ul. Rokicińska", houseNumber: "164", postalCode: "92-412", city: "Łódź", full: "ul. Rokicińska 164, 92-412 Łódź" },
    operator: { id: 5, name: "GreenWay Polska Sp. z o.o.", shortName: "GreenWay", code: "PL-7R5", phone: "+48 58 325 10 17", email: "bok@greenwaypolska.pl", website: "https://greenwaypolska.pl" },
    chargingPoints: [
      { id: 83001, code: "PL-7R5-E201-01", power: 50, connectors: [{ type: 'CCS Combo 2', power: 50, cableAttached: true }], availability: 'available', operationalStatus: 'operational', price: { pricePerKwh: 1.89, currency: 'PLN', lastUpdate: '2025-12-03' } },
      { id: 83002, code: "PL-7R5-E201-02", power: 22, connectors: [{ type: 'Type 2', power: 22, cableAttached: false }], availability: 'available', operationalStatus: 'operational', price: { pricePerKwh: 1.49, currency: 'PLN', lastUpdate: '2025-12-03' } }
    ],
    maxPower: 50,
    powerCategory: 'fast',
    totalChargers: 2,
    availableChargers: 2,
    operatingHours: [{ weekday: 1, fromTime: "08:00", toTime: "18:00" }, { weekday: 6, fromTime: "09:00", toTime: "15:00" }],
    isOpen24h: false,
    isOpenNow: true,
    accessibility: "Salon Volvo, parking przed budynkiem",
    paymentMethods: ['Aplikacja mobilna', 'Karta płatnicza'],
    authMethods: ['Aplikacja mobilna', 'RFID/NFC'],
    features: ['Salon samochodowy', 'Serwis'],
    avgPricePerKwh: 1.69,
    distance: "6.2 km"
  },
  {
    id: "lodz-014",
    poolId: 5202,
    name: "Kaufland - Łódź Widzew",
    latitude: 51.7689,
    longitude: 19.5234,
    address: { street: "ul. Przybyszewskiego", houseNumber: "176/178", postalCode: "93-120", city: "Łódź", full: "ul. Przybyszewskiego 176/178, 93-120 Łódź" },
    operator: { id: 90, name: "Kaufland Polska", shortName: "Kaufland", code: "PL-KFL", phone: "+48 22 123 45 67", email: "kontakt@kaufland.pl", website: "https://kaufland.pl" },
    chargingPoints: [
      { id: 84001, code: "PL-KFL-E001-01", power: 150, connectors: [{ type: 'CCS Combo 2', power: 150, cableAttached: true }], availability: 'available', operationalStatus: 'operational', price: { pricePerKwh: 1.99, currency: 'PLN', lastUpdate: '2025-12-03' } },
      { id: 84002, code: "PL-KFL-E001-02", power: 50, connectors: [{ type: 'CCS Combo 2', power: 50, cableAttached: true }], availability: 'occupied', operationalStatus: 'operational', price: { pricePerKwh: 1.69, currency: 'PLN', lastUpdate: '2025-12-03' } },
      { id: 84003, code: "PL-KFL-E001-03", power: 22, connectors: [{ type: 'Type 2', power: 22, cableAttached: false }], availability: 'available', operationalStatus: 'operational', price: { pricePerKwh: 1.29, currency: 'PLN', lastUpdate: '2025-12-03' } }
    ],
    maxPower: 150,
    powerCategory: 'ultra',
    totalChargers: 3,
    availableChargers: 2,
    operatingHours: [{ weekday: 1, fromTime: "06:00", toTime: "22:00" }],
    isOpen24h: false,
    isOpenNow: true,
    accessibility: "Parking przy Kaufland",
    paymentMethods: ['Aplikacja mobilna', 'Karta płatnicza'],
    authMethods: ['Aplikacja mobilna', 'Kod QR'],
    features: ['Hipermarket'],
    avgPricePerKwh: 1.66,
    distance: "5.8 km"
  },
  {
    id: "lodz-015",
    poolId: 5203,
    name: "Żabka Nano - Retkinia",
    latitude: 51.7456,
    longitude: 19.4012,
    address: { street: "al. Wyszyńskiego", houseNumber: "89", postalCode: "94-042", city: "Łódź", full: "al. Wyszyńskiego 89, 94-042 Łódź" },
    operator: { id: 91, name: "Żabka Polska", shortName: "Żabka", code: "PL-ZAB", phone: "+48 61 856 37 00", email: "kontakt@zabka.pl", website: "https://zabka.pl" },
    chargingPoints: [
      { id: 85001, code: "PL-ZAB-E001-01", power: 22, connectors: [{ type: 'Type 2', power: 22, cableAttached: false }], availability: 'available', operationalStatus: 'operational', price: { pricePerKwh: 1.39, currency: 'PLN', lastUpdate: '2025-12-03' } }
    ],
    maxPower: 22,
    powerCategory: 'ac',
    totalChargers: 1,
    availableChargers: 1,
    operatingHours: [],
    isOpen24h: true,
    isOpenNow: true,
    accessibility: "Przy sklepie Żabka Nano",
    paymentMethods: ['Aplikacja mobilna', 'Karta płatnicza'],
    authMethods: ['Aplikacja mobilna', 'Kod QR'],
    features: ['Sklep 24h'],
    avgPricePerKwh: 1.39,
    distance: "4.2 km"
  },
  {
    id: "lodz-016",
    poolId: 5204,
    name: "Carrefour - Łódź Bałuty",
    latitude: 51.8012,
    longitude: 19.4367,
    address: { street: "ul. Łagiewnicka", houseNumber: "65", postalCode: "91-456", city: "Łódź", full: "ul. Łagiewnicka 65, 91-456 Łódź" },
    operator: { id: 8, name: "PGE Nowa Energia Sp. z o.o.", shortName: "PGE", code: "PL-PGE", phone: "+48 22 344 55 66", email: "nowa.energia@gkpge.pl", website: "https://pge.pl" },
    chargingPoints: [
      { id: 86001, code: "PL-PGE-E201-01", power: 50, connectors: [{ type: 'CCS Combo 2', power: 50, cableAttached: true }, { type: 'CHAdeMO', power: 50, cableAttached: true }], availability: 'available', operationalStatus: 'operational', price: { pricePerKwh: 1.79, currency: 'PLN', lastUpdate: '2025-12-03' } },
      { id: 86002, code: "PL-PGE-E201-02", power: 22, connectors: [{ type: 'Type 2', power: 22, cableAttached: false }], availability: 'available', operationalStatus: 'operational', price: { pricePerKwh: 1.29, currency: 'PLN', lastUpdate: '2025-12-03' } },
      { id: 86003, code: "PL-PGE-E201-03", power: 22, connectors: [{ type: 'Type 2', power: 22, cableAttached: false }], availability: 'occupied', operationalStatus: 'operational', price: { pricePerKwh: 1.29, currency: 'PLN', lastUpdate: '2025-12-03' } }
    ],
    maxPower: 50,
    powerCategory: 'fast',
    totalChargers: 3,
    availableChargers: 2,
    operatingHours: [{ weekday: 1, fromTime: "07:00", toTime: "22:00" }],
    isOpen24h: false,
    isOpenNow: true,
    accessibility: "Parking przy Carrefour",
    paymentMethods: ['Aplikacja mobilna', 'Karta płatnicza'],
    authMethods: ['Aplikacja mobilna', 'RFID/NFC'],
    features: ['Hipermarket', 'Galeria handlowa'],
    avgPricePerKwh: 1.46,
    distance: "4.9 km"
  },
  {
    id: "lodz-017",
    poolId: 5205,
    name: "Shell Recharge - Zgierska",
    latitude: 51.8134,
    longitude: 19.4512,
    address: { street: "ul. Zgierska", houseNumber: "211", postalCode: "91-497", city: "Łódź", full: "ul. Zgierska 211, 91-497 Łódź" },
    operator: { id: 92, name: "Shell Polska", shortName: "Shell", code: "PL-SHL", phone: "+48 22 123 12 12", email: "kontakt@shell.pl", website: "https://shell.pl" },
    chargingPoints: [
      { id: 87001, code: "PL-SHL-E001-01", power: 150, connectors: [{ type: 'CCS Combo 2', power: 150, cableAttached: true }], availability: 'available', operationalStatus: 'operational', price: { pricePerKwh: 2.39, currency: 'PLN', lastUpdate: '2025-12-03' } },
      { id: 87002, code: "PL-SHL-E001-02", power: 150, connectors: [{ type: 'CCS Combo 2', power: 150, cableAttached: true }], availability: 'available', operationalStatus: 'operational', price: { pricePerKwh: 2.39, currency: 'PLN', lastUpdate: '2025-12-03' } },
      { id: 87003, code: "PL-SHL-E001-03", power: 50, connectors: [{ type: 'CCS Combo 2', power: 50, cableAttached: true }, { type: 'CHAdeMO', power: 50, cableAttached: true }], availability: 'occupied', operationalStatus: 'operational', price: { pricePerKwh: 1.99, currency: 'PLN', lastUpdate: '2025-12-03' } }
    ],
    maxPower: 150,
    powerCategory: 'ultra',
    totalChargers: 3,
    availableChargers: 2,
    operatingHours: [],
    isOpen24h: true,
    isOpenNow: true,
    accessibility: "Stacja paliw Shell",
    paymentMethods: ['Aplikacja mobilna', 'Karta płatnicza', 'Shell Card'],
    authMethods: ['Aplikacja mobilna', 'RFID/NFC', 'Kod QR'],
    features: ['Stacja paliw', 'Sklep', 'Myjnia'],
    avgPricePerKwh: 2.26,
    distance: "5.6 km"
  },
  {
    id: "lodz-018",
    poolId: 5206,
    name: "Novotel Łódź Centrum",
    latitude: 51.7589,
    longitude: 19.4678,
    address: { street: "al. Piłsudskiego", houseNumber: "11", postalCode: "90-368", city: "Łódź", full: "al. Piłsudskiego 11, 90-368 Łódź" },
    operator: { id: 4, name: "EV PLUS Sp. z o.o.", shortName: "EV PLUS", code: "PL-GJC", phone: "+48 533 708 555", email: "biuro@evplus.com.pl", website: "https://evplus.com.pl" },
    chargingPoints: [
      { id: 88001, code: "PL-GJC-E101-01", power: 22, connectors: [{ type: 'Type 2', power: 22, cableAttached: false }], availability: 'available', operationalStatus: 'operational', price: { pricePerKwh: 1.49, currency: 'PLN', lastUpdate: '2025-12-03' } },
      { id: 88002, code: "PL-GJC-E101-02", power: 11, connectors: [{ type: 'Type 2', power: 11, cableAttached: false }], availability: 'available', operationalStatus: 'operational', price: { pricePerKwh: 1.29, currency: 'PLN', lastUpdate: '2025-12-03' } }
    ],
    maxPower: 22,
    powerCategory: 'ac',
    totalChargers: 2,
    availableChargers: 2,
    operatingHours: [],
    isOpen24h: true,
    isOpenNow: true,
    accessibility: "Parking hotelowy Novotel",
    paymentMethods: ['Aplikacja mobilna', 'Karta RFID'],
    authMethods: ['Aplikacja mobilna', 'RFID/NFC'],
    features: ['Hotel', 'Restauracja', 'Centrum konferencyjne'],
    avgPricePerKwh: 1.39,
    distance: "1.8 km"
  },
  {
    id: "lodz-019",
    poolId: 5207,
    name: "Biedronka - Łódź Polesie",
    latitude: 51.7845,
    longitude: 19.4123,
    address: { street: "ul. Konstantynowska", houseNumber: "45", postalCode: "94-303", city: "Łódź", full: "ul. Konstantynowska 45, 94-303 Łódź" },
    operator: { id: 93, name: "Biedronka", shortName: "Biedronka", code: "PL-BDR", phone: "+48 22 500 00 00", email: "kontakt@biedronka.pl", website: "https://biedronka.pl" },
    chargingPoints: [
      { id: 89001, code: "PL-BDR-E001-01", power: 50, connectors: [{ type: 'CCS Combo 2', power: 50, cableAttached: true }], availability: 'available', operationalStatus: 'operational', price: { pricePerKwh: 1.49, currency: 'PLN', lastUpdate: '2025-12-03' } },
      { id: 89002, code: "PL-BDR-E001-02", power: 22, connectors: [{ type: 'Type 2', power: 22, cableAttached: false }], availability: 'occupied', operationalStatus: 'operational', price: { pricePerKwh: 1.19, currency: 'PLN', lastUpdate: '2025-12-03' } }
    ],
    maxPower: 50,
    powerCategory: 'fast',
    totalChargers: 2,
    availableChargers: 1,
    operatingHours: [{ weekday: 1, fromTime: "06:00", toTime: "22:00" }],
    isOpen24h: false,
    isOpenNow: true,
    accessibility: "Parking przy sklepie Biedronka",
    paymentMethods: ['Aplikacja mobilna', 'Karta płatnicza'],
    authMethods: ['Aplikacja mobilna', 'Kod QR'],
    features: ['Supermarket'],
    avgPricePerKwh: 1.34,
    distance: "3.8 km"
  },
  {
    id: "lodz-020",
    poolId: 5208,
    name: "IONITY - A1 MOP Łódź",
    latitude: 51.7234,
    longitude: 19.3456,
    address: { street: "A1 MOP", houseNumber: "km 289", postalCode: "93-000", city: "Łódź", full: "A1 MOP km 289, 93-000 Łódź" },
    operator: { id: 94, name: "IONITY GmbH", shortName: "IONITY", code: "DE-ION", phone: "+49 89 242000", email: "contact@ionity.eu", website: "https://ionity.eu" },
    chargingPoints: [
      { id: 90001, code: "DE-ION-E501-01", power: 350, connectors: [{ type: 'CCS Combo 2', power: 350, cableAttached: true }], availability: 'available', operationalStatus: 'operational', price: { pricePerKwh: 2.69, currency: 'PLN', lastUpdate: '2025-12-03' } },
      { id: 90002, code: "DE-ION-E501-02", power: 350, connectors: [{ type: 'CCS Combo 2', power: 350, cableAttached: true }], availability: 'available', operationalStatus: 'operational', price: { pricePerKwh: 2.69, currency: 'PLN', lastUpdate: '2025-12-03' } },
      { id: 90003, code: "DE-ION-E501-03", power: 350, connectors: [{ type: 'CCS Combo 2', power: 350, cableAttached: true }], availability: 'occupied', operationalStatus: 'operational', price: { pricePerKwh: 2.69, currency: 'PLN', lastUpdate: '2025-12-03' } },
      { id: 90004, code: "DE-ION-E501-04", power: 350, connectors: [{ type: 'CCS Combo 2', power: 350, cableAttached: true }], availability: 'available', operationalStatus: 'operational', price: { pricePerKwh: 2.69, currency: 'PLN', lastUpdate: '2025-12-03' } }
    ],
    maxPower: 350,
    powerCategory: 'ultra',
    totalChargers: 4,
    availableChargers: 3,
    operatingHours: [],
    isOpen24h: true,
    isOpenNow: true,
    accessibility: "MOP przy autostradzie A1",
    paymentMethods: ['Aplikacja mobilna', 'Karta płatnicza', 'IONITY Card'],
    authMethods: ['Aplikacja mobilna', 'Plug&Charge'],
    features: ['Autostrada', 'MOP', 'Restauracja'],
    avgPricePerKwh: 2.69,
    distance: "8.5 km"
  },
  {
    id: "lodz-021",
    poolId: 5209,
    name: "Tesla Supercharger - Łódź",
    latitude: 51.7567,
    longitude: 19.4234,
    address: { street: "al. Jana Pawła II", houseNumber: "12", postalCode: "93-570", city: "Łódź", full: "al. Jana Pawła II 12, 93-570 Łódź" },
    operator: { id: 95, name: "Tesla Inc.", shortName: "Tesla", code: "US-TES", phone: "+48 800 123 456", email: "support@tesla.com", website: "https://tesla.com" },
    chargingPoints: [
      { id: 91001, code: "US-TES-E001-01", power: 250, connectors: [{ type: 'Tesla', power: 250, cableAttached: true }, { type: 'CCS Combo 2', power: 250, cableAttached: true }], availability: 'available', operationalStatus: 'operational', price: { pricePerKwh: 2.09, currency: 'PLN', lastUpdate: '2025-12-03' } },
      { id: 91002, code: "US-TES-E001-02", power: 250, connectors: [{ type: 'Tesla', power: 250, cableAttached: true }, { type: 'CCS Combo 2', power: 250, cableAttached: true }], availability: 'available', operationalStatus: 'operational', price: { pricePerKwh: 2.09, currency: 'PLN', lastUpdate: '2025-12-03' } },
      { id: 91003, code: "US-TES-E001-03", power: 250, connectors: [{ type: 'Tesla', power: 250, cableAttached: true }, { type: 'CCS Combo 2', power: 250, cableAttached: true }], availability: 'occupied', operationalStatus: 'operational', price: { pricePerKwh: 2.09, currency: 'PLN', lastUpdate: '2025-12-03' } },
      { id: 91004, code: "US-TES-E001-04", power: 250, connectors: [{ type: 'Tesla', power: 250, cableAttached: true }, { type: 'CCS Combo 2', power: 250, cableAttached: true }], availability: 'available', operationalStatus: 'operational', price: { pricePerKwh: 2.09, currency: 'PLN', lastUpdate: '2025-12-03' } },
      { id: 91005, code: "US-TES-E001-05", power: 250, connectors: [{ type: 'Tesla', power: 250, cableAttached: true }, { type: 'CCS Combo 2', power: 250, cableAttached: true }], availability: 'available', operationalStatus: 'operational', price: { pricePerKwh: 2.09, currency: 'PLN', lastUpdate: '2025-12-03' } },
      { id: 91006, code: "US-TES-E001-06", power: 250, connectors: [{ type: 'Tesla', power: 250, cableAttached: true }, { type: 'CCS Combo 2', power: 250, cableAttached: true }], availability: 'available', operationalStatus: 'operational', price: { pricePerKwh: 2.09, currency: 'PLN', lastUpdate: '2025-12-03' } }
    ],
    maxPower: 250,
    powerCategory: 'ultra',
    totalChargers: 6,
    availableChargers: 5,
    operatingHours: [],
    isOpen24h: true,
    isOpenNow: true,
    accessibility: "Parking publiczny",
    paymentMethods: ['Aplikacja Tesla', 'Karta płatnicza'],
    authMethods: ['Aplikacja Tesla', 'Plug&Charge'],
    features: ['Supercharger', 'Parking'],
    avgPricePerKwh: 2.09,
    distance: "2.3 km"
  },
  {
    id: "lodz-022",
    poolId: 5210,
    name: "Auchan - Łódź Górna",
    latitude: 51.7312,
    longitude: 19.4956,
    address: { street: "ul. Brzezińska", houseNumber: "27/29", postalCode: "92-103", city: "Łódź", full: "ul. Brzezińska 27/29, 92-103 Łódź" },
    operator: { id: 26, name: "Orlen Charge Sp. z o.o.", shortName: "Orlen Charge", code: "PL-ORL", phone: "+48 22 778 00 00", email: "charge@orlen.pl", website: "https://orlencharge.pl" },
    chargingPoints: [
      { id: 92001, code: "PL-ORL-E301-01", power: 50, connectors: [{ type: 'CCS Combo 2', power: 50, cableAttached: true }, { type: 'CHAdeMO', power: 50, cableAttached: true }], availability: 'available', operationalStatus: 'operational', price: { pricePerKwh: 1.89, currency: 'PLN', lastUpdate: '2025-12-03' } },
      { id: 92002, code: "PL-ORL-E301-02", power: 22, connectors: [{ type: 'Type 2', power: 22, cableAttached: false }], availability: 'available', operationalStatus: 'operational', price: { pricePerKwh: 1.49, currency: 'PLN', lastUpdate: '2025-12-03' } }
    ],
    maxPower: 50,
    powerCategory: 'fast',
    totalChargers: 2,
    availableChargers: 2,
    operatingHours: [{ weekday: 1, fromTime: "07:00", toTime: "22:00" }],
    isOpen24h: false,
    isOpenNow: true,
    accessibility: "Parking przy Auchan",
    paymentMethods: ['Aplikacja mobilna', 'Karta płatnicza', 'Orlen Pay'],
    authMethods: ['Aplikacja mobilna', 'RFID/NFC', 'Kod QR'],
    features: ['Hipermarket'],
    avgPricePerKwh: 1.69,
    distance: "5.1 km"
  },
  {
    id: "lodz-023",
    poolId: 5211,
    name: "M1 Łódź",
    latitude: 51.7623,
    longitude: 19.5123,
    address: { street: "ul. Brzezińska", houseNumber: "27/29", postalCode: "92-103", city: "Łódź", full: "ul. Brzezińska 27/29, 92-103 Łódź" },
    operator: { id: 5, name: "GreenWay Polska Sp. z o.o.", shortName: "GreenWay", code: "PL-7R5", phone: "+48 58 325 10 17", email: "bok@greenwaypolska.pl", website: "https://greenwaypolska.pl" },
    chargingPoints: [
      { id: 93001, code: "PL-7R5-E301-01", power: 100, connectors: [{ type: 'CCS Combo 2', power: 100, cableAttached: true }], availability: 'available', operationalStatus: 'operational', price: { pricePerKwh: 1.99, currency: 'PLN', lastUpdate: '2025-12-03' } },
      { id: 93002, code: "PL-7R5-E301-02", power: 100, connectors: [{ type: 'CCS Combo 2', power: 100, cableAttached: true }], availability: 'occupied', operationalStatus: 'operational', price: { pricePerKwh: 1.99, currency: 'PLN', lastUpdate: '2025-12-03' } },
      { id: 93003, code: "PL-7R5-E301-03", power: 22, connectors: [{ type: 'Type 2', power: 22, cableAttached: false }], availability: 'available', operationalStatus: 'operational', price: { pricePerKwh: 1.49, currency: 'PLN', lastUpdate: '2025-12-03' } },
      { id: 93004, code: "PL-7R5-E301-04", power: 22, connectors: [{ type: 'Type 2', power: 22, cableAttached: false }], availability: 'available', operationalStatus: 'operational', price: { pricePerKwh: 1.49, currency: 'PLN', lastUpdate: '2025-12-03' } }
    ],
    maxPower: 100,
    powerCategory: 'ultra',
    totalChargers: 4,
    availableChargers: 3,
    operatingHours: [{ weekday: 1, fromTime: "08:00", toTime: "22:00" }],
    isOpen24h: false,
    isOpenNow: true,
    accessibility: "Parking przy centrum handlowym M1",
    paymentMethods: ['Aplikacja mobilna', 'Karta płatnicza', 'Karta RFID'],
    authMethods: ['Aplikacja mobilna', 'RFID/NFC'],
    features: ['Centrum handlowe', 'Kino', 'Restauracje'],
    avgPricePerKwh: 1.74,
    distance: "5.4 km"
  },
  {
    id: "lodz-024",
    poolId: 5212,
    name: "Decathlon - Łódź",
    latitude: 51.7456,
    longitude: 19.3789,
    address: { street: "ul. Karskiego", houseNumber: "5", postalCode: "91-071", city: "Łódź", full: "ul. Karskiego 5, 91-071 Łódź" },
    operator: { id: 8, name: "PGE Nowa Energia Sp. z o.o.", shortName: "PGE", code: "PL-PGE", phone: "+48 22 344 55 66", email: "nowa.energia@gkpge.pl", website: "https://pge.pl" },
    chargingPoints: [
      { id: 94001, code: "PL-PGE-E401-01", power: 22, connectors: [{ type: 'Type 2', power: 22, cableAttached: false }], availability: 'available', operationalStatus: 'operational', price: { pricePerKwh: 1.29, currency: 'PLN', lastUpdate: '2025-12-03' } },
      { id: 94002, code: "PL-PGE-E401-02", power: 22, connectors: [{ type: 'Type 2', power: 22, cableAttached: false }], availability: 'available', operationalStatus: 'operational', price: { pricePerKwh: 1.29, currency: 'PLN', lastUpdate: '2025-12-03' } }
    ],
    maxPower: 22,
    powerCategory: 'ac',
    totalChargers: 2,
    availableChargers: 2,
    operatingHours: [{ weekday: 1, fromTime: "09:00", toTime: "21:00" }],
    isOpen24h: false,
    isOpenNow: true,
    accessibility: "Parking przy Decathlon",
    paymentMethods: ['Aplikacja mobilna', 'Karta płatnicza'],
    authMethods: ['Aplikacja mobilna', 'RFID/NFC'],
    features: ['Sklep sportowy'],
    avgPricePerKwh: 1.29,
    distance: "4.6 km"
  },
  {
    id: "lodz-025",
    poolId: 5213,
    name: "Pasaż Łódzki - Aleksandrowska",
    latitude: 51.8089,
    longitude: 19.4789,
    address: { street: "ul. Aleksandrowska", houseNumber: "67/93", postalCode: "91-205", city: "Łódź", full: "ul. Aleksandrowska 67/93, 91-205 Łódź" },
    operator: { id: 11, name: "TAURON NOWE TECHNOLOGIE S.A.", shortName: "TAURON", code: "PL-BB4", phone: "+48 572 886 552", email: "emap@tauron.pl", website: "https://tauron.pl" },
    chargingPoints: [
      { id: 95001, code: "PL-BB4-E201-01", power: 50, connectors: [{ type: 'CCS Combo 2', power: 50, cableAttached: true }], availability: 'available', operationalStatus: 'operational', price: { pricePerKwh: 1.79, currency: 'PLN', lastUpdate: '2025-12-03' } },
      { id: 95002, code: "PL-BB4-E201-02", power: 22, connectors: [{ type: 'Type 2', power: 22, cableAttached: false }], availability: 'occupied', operationalStatus: 'operational', price: { pricePerKwh: 1.29, currency: 'PLN', lastUpdate: '2025-12-03' } }
    ],
    maxPower: 50,
    powerCategory: 'fast',
    totalChargers: 2,
    availableChargers: 1,
    operatingHours: [{ weekday: 1, fromTime: "08:00", toTime: "22:00" }],
    isOpen24h: false,
    isOpenNow: true,
    accessibility: "Parking przy Pasażu Łódzkim",
    paymentMethods: ['Aplikacja mobilna', 'Karta płatnicza', 'Karta RFID'],
    authMethods: ['Aplikacja mobilna', 'RFID/NFC'],
    features: ['Centrum handlowe'],
    avgPricePerKwh: 1.54,
    distance: "5.9 km"
  }
];

export function getAllConnectorTypes(): string[] {
  const types = new Set<string>();
  lodzStations.forEach(station => {
    station.chargingPoints.forEach(point => {
      point.connectors.forEach(connector => { types.add(connector.type); });
    });
  });
  return Array.from(types).sort();
}

export function getAllOperators(): string[] {
  const operators = new Set<string>();
  lodzStations.forEach(station => { operators.add(station.operator.shortName); });
  return Array.from(operators).sort();
}

export function filterStations(filters: StationFiltersType): Station[] {
  return lodzStations.filter(station => {
    // Availability filter
    if (filters.availability === 'available' && station.availableChargers === 0) return false;
    if (filters.availability === 'occupied' && station.availableChargers > 0) return false;
    
    // Power categories filter (checkbox-based)
    if (filters.powerCategories && filters.powerCategories.length > 0 && filters.powerCategories.length < 3) {
      if (!filters.powerCategories.includes(station.powerCategory as 'ac' | 'fast' | 'ultra')) return false;
    }
    
    // Connector types filter (multi-select)
    if (filters.connectorTypes && filters.connectorTypes.length > 0) {
      const hasConnector = station.chargingPoints.some(point => 
        point.connectors.some(c => filters.connectorTypes!.includes(c.type))
      );
      if (!hasConnector) return false;
    }
    
    // Operator filter
    if (filters.operator && filters.operator !== 'all' && station.operator.shortName !== filters.operator) return false;
    
    // Price filter
    if (filters.maxPrice && station.avgPricePerKwh && station.avgPricePerKwh > filters.maxPrice) return false;
    
    // Only open filter
    if (filters.onlyOpen && !station.isOpenNow) return false;
    
    return true;
  });
}

export function getStationStats() {
  const totalStations = lodzStations.length;
  const totalChargers = lodzStations.reduce((sum, s) => sum + s.totalChargers, 0);
  const availableChargers = lodzStations.reduce((sum, s) => sum + s.availableChargers, 0);
  return { totalStations, totalChargers, availableChargers, availabilityRate: Math.round((availableChargers / totalChargers) * 100) };
}

// Calculate distance using Haversine formula
export function calculateDistanceKm(lat1: number, lon1: number, lat2: number, lon2: number): number {
  const R = 6371;
  const dLat = (lat2 - lat1) * Math.PI / 180;
  const dLon = (lon2 - lon1) * Math.PI / 180;
  const a = Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos(lat1 * Math.PI / 180) * Math.cos(lat2 * Math.PI / 180) *
    Math.sin(dLon / 2) * Math.sin(dLon / 2);
  return R * 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
}

export function formatDistanceKm(km: number): string {
  if (km < 1) return `${Math.round(km * 1000)} m`;
  return `${km.toFixed(1)} km`;
}

export type SortOption = 'distance' | 'availability' | 'price' | 'power';

export function sortStations(
  stations: Station[],
  sortBy: SortOption,
  userLat?: number,
  userLon?: number
): Station[] {
  const sorted = [...stations];
  
  switch (sortBy) {
    case 'distance':
      if (userLat !== undefined && userLon !== undefined) {
        sorted.sort((a, b) => {
          const distA = calculateDistanceKm(userLat, userLon, a.latitude, a.longitude);
          const distB = calculateDistanceKm(userLat, userLon, b.latitude, b.longitude);
          return distA - distB;
        });
      }
      break;
    case 'availability':
      sorted.sort((a, b) => b.availableChargers - a.availableChargers);
      break;
    case 'price':
      sorted.sort((a, b) => (a.avgPricePerKwh || 999) - (b.avgPricePerKwh || 999));
      break;
    case 'power':
      sorted.sort((a, b) => b.maxPower - a.maxPower);
      break;
  }
  
  return sorted;
}

export function addDistanceToStations(
  stations: Station[],
  userLat: number,
  userLon: number
): Station[] {
  return stations.map(station => ({
    ...station,
    distance: formatDistanceKm(calculateDistanceKm(userLat, userLon, station.latitude, station.longitude))
  }));
}

// Price statistics
export function getPriceStats() {
  const prices = lodzStations
    .filter(s => s.avgPricePerKwh)
    .map(s => s.avgPricePerKwh!);
  
  return {
    min: Math.min(...prices),
    max: Math.max(...prices),
    avg: prices.reduce((sum, p) => sum + p, 0) / prices.length
  };
}
