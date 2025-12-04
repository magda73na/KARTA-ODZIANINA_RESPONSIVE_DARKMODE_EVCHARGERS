import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

// Prize pool with weights - kept server-side for security
const PRIZE_POOL = [
  { name: 'Zniżka 10%', type: 'percent', value: 10, weight: 40, partner: 'MPK Łódź', description: 'Zniżka 10% na bilety komunikacji miejskiej' },
  { name: 'Zniżka 15%', type: 'percent', value: 15, weight: 25, partner: 'Manufaktura', description: 'Zniżka 15% w wybranych sklepach Manufaktury' },
  { name: 'Zniżka 20%', type: 'percent', value: 20, weight: 15, partner: 'Atlas Arena', description: 'Zniżka 20% na wybrane wydarzenia' },
  { name: 'Voucher 25 PLN', type: 'voucher', value: 25, weight: 10, partner: 'Kino Helios', description: 'Voucher do wykorzystania w kinie Helios' },
  { name: 'Voucher 50 PLN', type: 'voucher', value: 50, weight: 5, partner: 'Piotrkowska 217', description: 'Voucher gastronomiczny' },
  { name: 'Bilet wstępu', type: 'ticket', value: 1, weight: 4, partner: 'Muzeum Miasta Łodzi', description: 'Darmowe wejście do muzeum' },
  { name: 'Nagroda specjalna', type: 'other', value: 100, weight: 1, partner: 'Karta Łodzianina', description: 'Niespodzianka od Karty Łodzianina!' },
];

const COOLDOWN_MS = 24 * 60 * 60 * 1000; // 24 hours

// Cryptographically secure prize code generation
function generateSecureCode(): string {
  const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
  const array = new Uint8Array(8);
  crypto.getRandomValues(array);
  return 'KL-' + Array.from(array, b => chars[b % chars.length]).join('');
}

// Cryptographically secure prize drawing with weights
function drawPrize(): typeof PRIZE_POOL[0] {
  const totalWeight = PRIZE_POOL.reduce((sum, p) => sum + p.weight, 0);
  
  // Use cryptographically secure random for prize selection
  const randomBytes = new Uint32Array(1);
  crypto.getRandomValues(randomBytes);
  let random = (randomBytes[0] / 0xFFFFFFFF) * totalWeight;
  
  for (const prize of PRIZE_POOL) {
    random -= prize.weight;
    if (random <= 0) {
      return prize;
    }
  }
  
  return PRIZE_POOL[0];
}

// Validate session ID format (must be cryptographically secure format)
function isValidSessionId(sessionId: string): boolean {
  // Accept only the new secure format: kl-{64 hex characters}
  const securePattern = /^kl-[a-f0-9]{64}$/;
  return securePattern.test(sessionId);
}

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { session_id } = await req.json();

    // Validate session ID
    if (!session_id || typeof session_id !== 'string') {
      console.error('Missing or invalid session_id');
      return new Response(
        JSON.stringify({ error: 'Brak identyfikatora sesji' }),
        { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    // Reject old insecure session IDs
    if (!isValidSessionId(session_id)) {
      console.error('Rejected insecure session ID format:', session_id.substring(0, 20) + '...');
      return new Response(
        JSON.stringify({ error: 'Nieprawidłowy format sesji. Proszę odświeżyć stronę.' }),
        { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    // Create Supabase client with service role for server-side operations
    const supabaseUrl = Deno.env.get('SUPABASE_URL')!;
    const supabaseKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!;
    const supabase = createClient(supabaseUrl, supabaseKey);

    // Check cooldown - server-side enforcement
    const { data: lastDraw, error: drawCheckError } = await supabase
      .from('lottery_draws')
      .select('drawn_at')
      .eq('session_id', session_id)
      .maybeSingle();

    if (drawCheckError) {
      console.error('Error checking last draw:', drawCheckError);
      return new Response(
        JSON.stringify({ error: 'Błąd sprawdzania ostatniego losowania' }),
        { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    if (lastDraw) {
      const lastDrawTime = new Date(lastDraw.drawn_at).getTime();
      const now = Date.now();
      const remaining = COOLDOWN_MS - (now - lastDrawTime);
      
      if (remaining > 0) {
        const hours = Math.floor(remaining / (1000 * 60 * 60));
        const minutes = Math.floor((remaining % (1000 * 60 * 60)) / (1000 * 60));
        console.log(`Cooldown active for session ${session_id.substring(0, 20)}..., ${hours}h ${minutes}m remaining`);
        return new Response(
          JSON.stringify({ 
            error: 'Musisz poczekać do następnej gry',
            remaining_ms: remaining 
          }),
          { status: 429, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
        );
      }
    }

    // Draw prize server-side with cryptographic randomness
    const prizeTemplate = drawPrize();
    const code = generateSecureCode();
    const now = new Date();
    const expiresAt = new Date(now.getTime() + 30 * 24 * 60 * 60 * 1000); // 30 days

    console.log(`Drawing prize for session ${session_id.substring(0, 20)}...: ${prizeTemplate.name}`);

    // Save prize
    const { data: prizeData, error: prizeError } = await supabase
      .from('lottery_prizes')
      .insert({
        session_id: session_id,
        name: prizeTemplate.name,
        description: prizeTemplate.description,
        type: prizeTemplate.type,
        value: prizeTemplate.value,
        code: code,
        partner: prizeTemplate.partner,
        won_at: now.toISOString(),
        expires_at: expiresAt.toISOString(),
        used: false,
      })
      .select()
      .single();

    if (prizeError) {
      console.error('Error saving prize:', prizeError);
      return new Response(
        JSON.stringify({ error: 'Nie udało się zapisać nagrody' }),
        { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    // Save/update draw record
    const { error: drawError } = await supabase
      .from('lottery_draws')
      .upsert({
        session_id: session_id,
        drawn_at: now.toISOString(),
        prize_id: prizeData.id,
      }, {
        onConflict: 'session_id',
      });

    if (drawError) {
      console.error('Error saving draw record:', drawError);
      // Don't fail the request, prize was already saved
    }

    console.log(`Prize saved successfully: ${prizeData.id}`);

    return new Response(
      JSON.stringify({
        prize: {
          id: prizeData.id,
          name: prizeTemplate.name,
          description: prizeTemplate.description,
          type: prizeTemplate.type,
          value: prizeTemplate.value,
          code: code,
          wonAt: now.toISOString(),
          expiresAt: expiresAt.toISOString(),
          used: false,
          partner: prizeTemplate.partner,
        }
      }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  } catch (error) {
    console.error('Unexpected error in lottery-draw:', error);
    return new Response(
      JSON.stringify({ error: 'Wystąpił nieoczekiwany błąd' }),
      { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  }
});
