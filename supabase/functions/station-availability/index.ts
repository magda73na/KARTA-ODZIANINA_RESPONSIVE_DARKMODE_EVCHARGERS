import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

// Mock real-time availability data
// In production, this would connect to actual charging network APIs
const generateAvailability = (stationId: string) => {
  const statuses = ['available', 'occupied', 'faulted', 'unavailable'];
  const connectorTypes = ['CCS', 'CHAdeMO', 'Type 2'];
  
  const numConnectors = Math.floor(Math.random() * 4) + 1;
  const connectors = [];
  
  for (let i = 0; i < numConnectors; i++) {
    connectors.push({
      id: `${stationId}-conn-${i + 1}`,
      type: connectorTypes[Math.floor(Math.random() * connectorTypes.length)],
      status: statuses[Math.floor(Math.random() * statuses.length)],
      power: [22, 50, 100, 150][Math.floor(Math.random() * 4)],
      lastUpdated: new Date().toISOString(),
    });
  }
  
  return {
    stationId,
    connectors,
    totalConnectors: numConnectors,
    availableConnectors: connectors.filter(c => c.status === 'available').length,
    timestamp: new Date().toISOString(),
  };
};

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const url = new URL(req.url);
    const stationId = url.searchParams.get('stationId');
    
    if (req.method === 'GET' || req.method === 'POST') {
      if (stationId) {
        // Get availability for specific station
        const availability = generateAvailability(stationId);
        console.log(`Fetching availability for station: ${stationId}`);
        
        return new Response(JSON.stringify(availability), {
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        });
      } else {
        // Get availability for all stations (mock IDs)
        const stationIds = [
          'greenway-manufaktura',
          'orlen-charge-piotrkowska',
          'shell-recharge-zielona',
          'elocity-ec1',
          'powerdot-galeria',
          'ionity-a1-lodz',
          'greenway-andersa',
          'orlen-charge-politechnika',
          'elocity-widzew',
          'tesla-supercharger',
          'go-e-parking-dluga',
          'innogy-go-centrum'
        ];
        
        const allAvailability = stationIds.map(id => generateAvailability(id));
        console.log(`Fetching availability for all ${stationIds.length} stations`);
        
        return new Response(JSON.stringify({ stations: allAvailability }), {
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        });
      }
    }

    return new Response(JSON.stringify({ error: 'Method not allowed' }), {
      status: 405,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  } catch (error) {
    console.error('Error in station-availability function:', error);
    const errorMessage = error instanceof Error ? error.message : 'Unknown error';
    return new Response(JSON.stringify({ error: errorMessage }), {
      status: 500,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  }
});
