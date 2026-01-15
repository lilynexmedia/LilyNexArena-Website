import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

interface CreateOrderRequest {
  event_id: string;
  registration_id: string;
}

serve(async (req: Request) => {
  // Handle CORS preflight
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { event_id, registration_id }: CreateOrderRequest = await req.json();
    
    console.log('Creating Razorpay order for:', { event_id, registration_id });

    if (!event_id || !registration_id) {
      return new Response(
        JSON.stringify({ error: 'event_id and registration_id are required' }),
        { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    // Create Supabase client
    const supabaseUrl = Deno.env.get('SUPABASE_URL')!;
    const supabaseServiceKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!;
    const supabase = createClient(supabaseUrl, supabaseServiceKey);

    // Fetch event to get entry_amount (always from DB, not frontend)
    const { data: event, error: eventError } = await supabase
      .from('events')
      .select('id, name, entry_amount')
      .eq('id', event_id)
      .single();

    if (eventError || !event) {
      console.error('Event not found:', eventError);
      return new Response(
        JSON.stringify({ error: 'Event not found' }),
        { status: 404, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    // Verify entry_amount > 0
    if (!event.entry_amount || event.entry_amount <= 0) {
      console.error('Event is free, no payment required');
      return new Response(
        JSON.stringify({ error: 'This is a free event, no payment required' }),
        { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    // Fetch registration to get details
    const { data: registration, error: regError } = await supabase
      .from('team_registrations')
      .select('id, team_name, captain_email, captain_name, payment_status')
      .eq('id', registration_id)
      .single();

    if (regError || !registration) {
      console.error('Registration not found:', regError);
      return new Response(
        JSON.stringify({ error: 'Registration not found' }),
        { status: 404, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    // Check if already paid
    if (registration.payment_status === 'paid') {
      return new Response(
        JSON.stringify({ error: 'Payment already completed for this registration' }),
        { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    // Get Razorpay credentials
    const razorpayKeyId = Deno.env.get('RAZORPAY_KEY_ID');
    const razorpayKeySecret = Deno.env.get('RAZORPAY_KEY_SECRET');

    if (!razorpayKeyId || !razorpayKeySecret) {
      console.error('Razorpay credentials not configured');
      return new Response(
        JSON.stringify({ error: 'Payment gateway not configured' }),
        { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    // Create Razorpay order
    const amountInPaise = event.entry_amount * 100; // Convert to paise
    
    const orderPayload = {
      amount: amountInPaise,
      currency: 'INR',
      receipt: `reg_${registration_id.slice(0, 8)}`,
      notes: {
        event_id: event_id,
        registration_id: registration_id,
        team_name: registration.team_name,
        captain_email: registration.captain_email,
      },
    };

    console.log('Creating Razorpay order with payload:', orderPayload);

    const razorpayResponse = await fetch('https://api.razorpay.com/v1/orders', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': 'Basic ' + btoa(`${razorpayKeyId}:${razorpayKeySecret}`),
      },
      body: JSON.stringify(orderPayload),
    });

    if (!razorpayResponse.ok) {
      const errorText = await razorpayResponse.text();
      console.error('Razorpay order creation failed:', errorText);
      return new Response(
        JSON.stringify({ error: 'Failed to create payment order' }),
        { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    const razorpayOrder = await razorpayResponse.json();
    console.log('Razorpay order created:', razorpayOrder.id);

    // Update registration with order ID and set status to pending
    const { error: updateError } = await supabase
      .from('team_registrations')
      .update({
        razorpay_order_id: razorpayOrder.id,
        payment_status: 'pending',
        payment_amount: event.entry_amount,
      })
      .eq('id', registration_id);

    if (updateError) {
      console.error('Failed to update registration:', updateError);
    }

    // Log successful order creation
    console.log('Order created successfully:', {
      order_id: razorpayOrder.id,
      registration_id: registration_id,
      event_id: event_id,
      amount_inr: event.entry_amount,
      amount_paise: amountInPaise,
    });

    return new Response(
      JSON.stringify({
        order_id: razorpayOrder.id,
        amount: amountInPaise, // Return in paise for Razorpay checkout
        currency: 'INR',
        key_id: razorpayKeyId,
        prefill: {
          name: registration.captain_name,
          email: registration.captain_email,
        },
        notes: {
          event_name: event.name,
          team_name: registration.team_name,
        },
      }),
      { status: 200, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );

  } catch (error) {
    console.error('Error creating order:', error);
    return new Response(
      JSON.stringify({ error: 'Internal server error' }),
      { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  }
});