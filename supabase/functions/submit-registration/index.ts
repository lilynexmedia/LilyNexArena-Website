import { createClient } from 'https://esm.sh/@supabase/supabase-js@2';

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type, x-forwarded-for, x-real-ip',
};

// Rate limiting configuration
const RATE_LIMIT_WINDOW_MS = 60 * 1000; // 1 minute window
const MAX_ATTEMPTS_PER_WINDOW = 5; // Max 5 attempts per minute per IP
const MAX_ATTEMPTS_PER_EMAIL_HOUR = 10; // Max 10 attempts per hour per email

interface RegistrationData {
  event_id: string;
  team_name: string;
  captain_name: string;
  captain_email: string;
  captain_phone?: string;
  captain_ingame_name?: string;
  captain_education_type?: string;
  captain_school_name?: string;
  captain_school_class?: string;
  captain_college_name?: string;
  captain_college_year?: string;
  captain_college_branch?: string;
  player_names: string[];
  player_ingame_names?: string[];
  player_education_details?: Array<{
    type: string;
    schoolName?: string | null;
    schoolClass?: string | null;
    collegeName?: string | null;
    collegeYear?: string | null;
    collegeBranch?: string | null;
  }>;
}

Deno.serve(async (req) => {
  // Handle CORS preflight
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    // Only accept POST requests
    if (req.method !== 'POST') {
      return new Response(
        JSON.stringify({ error: 'Method not allowed' }),
        { status: 405, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    // Get client IP address
    const forwardedFor = req.headers.get('x-forwarded-for');
    const realIp = req.headers.get('x-real-ip');
    const clientIp = forwardedFor?.split(',')[0]?.trim() || realIp || 'unknown';

    console.log(`[Registration] Request from IP: ${clientIp}`);

    // Initialize Supabase client with service role for rate limiting
    const supabaseUrl = Deno.env.get('SUPABASE_URL')!;
    const supabaseServiceKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!;
    const supabase = createClient(supabaseUrl, supabaseServiceKey);

    // Parse request body
    const body: RegistrationData = await req.json();
    const email = body.captain_email?.trim().toLowerCase();

    // Validate required fields
    if (!body.event_id || !body.team_name || !body.captain_name || !email || !body.player_names) {
      console.log('[Registration] Missing required fields');
      return new Response(
        JSON.stringify({ error: 'Missing required fields' }),
        { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    // Validate email format
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      console.log('[Registration] Invalid email format');
      return new Response(
        JSON.stringify({ error: 'Invalid email format' }),
        { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    // Clean up old rate limit entries
    await supabase.rpc('cleanup_old_rate_limits');

    // Check IP-based rate limiting
    const oneMinuteAgo = new Date(Date.now() - RATE_LIMIT_WINDOW_MS).toISOString();
    const { data: ipRateLimits } = await supabase
      .from('registration_rate_limits')
      .select('*')
      .eq('ip_address', clientIp)
      .gte('last_attempt_at', oneMinuteAgo);

    const totalIpAttempts = ipRateLimits?.reduce((sum, r) => sum + r.attempt_count, 0) || 0;

    if (totalIpAttempts >= MAX_ATTEMPTS_PER_WINDOW) {
      console.log(`[Registration] Rate limit exceeded for IP: ${clientIp} (${totalIpAttempts} attempts)`);
      return new Response(
        JSON.stringify({ 
          error: 'Too many registration attempts. Please wait a moment before trying again.',
          code: 'RATE_LIMITED'
        }),
        { status: 429, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    // Check email-based rate limiting (per hour)
    const oneHourAgo = new Date(Date.now() - 60 * 60 * 1000).toISOString();
    const { data: emailRateLimits } = await supabase
      .from('registration_rate_limits')
      .select('*')
      .eq('email', email)
      .gte('last_attempt_at', oneHourAgo);

    const totalEmailAttempts = emailRateLimits?.reduce((sum, r) => sum + r.attempt_count, 0) || 0;

    if (totalEmailAttempts >= MAX_ATTEMPTS_PER_EMAIL_HOUR) {
      console.log(`[Registration] Email rate limit exceeded for: ${email} (${totalEmailAttempts} attempts)`);
      return new Response(
        JSON.stringify({ 
          error: 'Too many registration attempts with this email. Please try again later.',
          code: 'EMAIL_RATE_LIMITED'
        }),
        { status: 429, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    // Record this attempt for rate limiting
    await supabase.from('registration_rate_limits').insert({
      ip_address: clientIp,
      email: email,
      attempt_count: 1,
    });

    // Check if email already registered for this event
    const { data: existingRegistration } = await supabase
      .from('team_registrations')
      .select('id, team_name')
      .eq('event_id', body.event_id)
      .eq('captain_email', email)
      .maybeSingle();

    if (existingRegistration) {
      console.log(`[Registration] Duplicate registration attempt: ${email} for event ${body.event_id}`);
      return new Response(
        JSON.stringify({ 
          error: 'This email is already used to register a team for this event.',
          code: 'DUPLICATE_REGISTRATION'
        }),
        { status: 409, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    // Check if event exists and registration is open
    const { data: event } = await supabase
      .from('events')
      .select('id, name, status, is_registration_open, registration_start, registration_end, registration_override, team_slots')
      .eq('id', body.event_id)
      .maybeSingle();

    if (!event) {
      console.log(`[Registration] Event not found: ${body.event_id}`);
      return new Response(
        JSON.stringify({ error: 'Event not found' }),
        { status: 404, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    // Verify registration is open
    // LOGIC:
    // - If registration_override is 'open' or 'closed' → MANUAL mode (use override)
    // - If registration_override is null → AUTOMATIC mode (time-based only)
    const now = new Date();
    const regStart = new Date(event.registration_start);
    const regEnd = new Date(event.registration_end);

    // Determine if registration is open based on mode
    let isRegistrationOpen = false;
    const isManualMode = event.registration_override === 'open' || event.registration_override === 'closed';
    
    if (isManualMode) {
      // MANUAL MODE: Use override value directly
      isRegistrationOpen = event.registration_override === 'open';
      console.log(`[Registration] Manual mode: override=${event.registration_override}, isOpen=${isRegistrationOpen}`);
    } else {
      // AUTOMATIC MODE: Use time-based logic only
      // Ignore is_registration_open flag - purely time-based
      isRegistrationOpen = now >= regStart && now <= regEnd && (event.status === 'upcoming' || event.status === 'live');
      console.log(`[Registration] Auto mode: now=${now.toISOString()}, regStart=${regStart.toISOString()}, regEnd=${regEnd.toISOString()}, eventStatus=${event.status}, isOpen=${isRegistrationOpen}`);
    }

    if (!isRegistrationOpen) {
      console.log(`[Registration] Registration closed for event: ${body.event_id}`);
      return new Response(
        JSON.stringify({ error: 'Registration is not open for this event' }),
        { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    // Check team slots
    const { count: approvedCount } = await supabase
      .from('team_registrations')
      .select('*', { count: 'exact', head: true })
      .eq('event_id', body.event_id)
      .eq('status', 'approved');

    if ((approvedCount || 0) >= event.team_slots) {
      console.log(`[Registration] Event full: ${body.event_id}`);
      return new Response(
        JSON.stringify({ error: 'This event is fully booked' }),
        { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    // Insert the registration
    const { data: registration, error: insertError } = await supabase
      .from('team_registrations')
      .insert({
        event_id: body.event_id,
        team_name: body.team_name.trim(),
        captain_name: body.captain_name.trim(),
        captain_email: email,
        captain_phone: body.captain_phone?.trim() || null,
        captain_ingame_name: body.captain_ingame_name?.trim() || null,
        captain_education_type: body.captain_education_type || null,
        captain_school_name: body.captain_school_name?.trim() || null,
        captain_school_class: body.captain_school_class?.trim() || null,
        captain_college_name: body.captain_college_name?.trim() || null,
        captain_college_year: body.captain_college_year?.trim() || null,
        captain_college_branch: body.captain_college_branch?.trim() || null,
        player_names: body.player_names,
        player_ingame_names: body.player_ingame_names || null,
        player_education_details: body.player_education_details || null,
        status: 'pending',
      })
      .select()
      .single();

    if (insertError) {
      console.error('[Registration] Insert error:', insertError);
      
      // Check for unique constraint violation
      if (insertError.code === '23505') {
        return new Response(
          JSON.stringify({ 
            error: 'This email is already used to register a team for this event.',
            code: 'DUPLICATE_REGISTRATION'
          }),
          { status: 409, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
        );
      }

      return new Response(
        JSON.stringify({ error: 'Failed to create registration' }),
        { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    console.log(`[Registration] Success: Team "${body.team_name}" registered for event ${body.event_id}`);

    return new Response(
      JSON.stringify({ 
        success: true, 
        message: 'Registration submitted successfully',
        registration_id: registration.id 
      }),
      { status: 201, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );

  } catch (error) {
    console.error('[Registration] Unexpected error:', error);
    return new Response(
      JSON.stringify({ error: 'An unexpected error occurred' }),
      { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  }
});