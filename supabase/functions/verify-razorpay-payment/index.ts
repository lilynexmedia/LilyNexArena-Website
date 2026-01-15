import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";
import { crypto } from "https://deno.land/std@0.190.0/crypto/mod.ts";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

interface VerifyPaymentRequest {
  razorpay_order_id: string;
  razorpay_payment_id: string;
  razorpay_signature: string;
  registration_id: string;
}

// Convert ArrayBuffer to hex string
function arrayBufferToHex(buffer: ArrayBuffer): string {
  return Array.from(new Uint8Array(buffer))
    .map(b => b.toString(16).padStart(2, '0'))
    .join('');
}

serve(async (req: Request) => {
  // Handle CORS preflight
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { 
      razorpay_order_id, 
      razorpay_payment_id, 
      razorpay_signature,
      registration_id 
    }: VerifyPaymentRequest = await req.json();

    console.log('Verifying payment:', { razorpay_order_id, razorpay_payment_id, registration_id });

    if (!razorpay_order_id || !razorpay_payment_id || !razorpay_signature || !registration_id) {
      return new Response(
        JSON.stringify({ error: 'All payment details are required' }),
        { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    // Get Razorpay secret for signature verification
    const razorpayKeySecret = Deno.env.get('RAZORPAY_KEY_SECRET');
    if (!razorpayKeySecret) {
      console.error('Razorpay secret not configured');
      return new Response(
        JSON.stringify({ error: 'Payment gateway not configured' }),
        { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    // Verify signature
    const payload = `${razorpay_order_id}|${razorpay_payment_id}`;
    const encoder = new TextEncoder();
    const key = await crypto.subtle.importKey(
      'raw',
      encoder.encode(razorpayKeySecret),
      { name: 'HMAC', hash: 'SHA-256' },
      false,
      ['sign']
    );
    
    const signature = await crypto.subtle.sign(
      'HMAC',
      key,
      encoder.encode(payload)
    );
    
    const expectedSignature = arrayBufferToHex(signature);
    
    console.log('Signature verification:', { 
      expected: expectedSignature.substring(0, 20) + '...', 
      received: razorpay_signature.substring(0, 20) + '...' 
    });

    if (expectedSignature !== razorpay_signature) {
      console.error('Signature verification failed');
      return new Response(
        JSON.stringify({ error: 'Payment verification failed - invalid signature', code: 'INVALID_SIGNATURE' }),
        { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    console.log('Signature verified successfully');

    // Create Supabase client
    const supabaseUrl = Deno.env.get('SUPABASE_URL')!;
    const supabaseServiceKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!;
    const supabase = createClient(supabaseUrl, supabaseServiceKey);

    // Fetch registration to verify order ID matches
    const { data: registration, error: regError } = await supabase
      .from('team_registrations')
      .select('id, razorpay_order_id, payment_status, captain_email, captain_name, team_name, event_id')
      .eq('id', registration_id)
      .single();

    if (regError || !registration) {
      console.error('Registration not found:', regError);
      return new Response(
        JSON.stringify({ error: 'Registration not found' }),
        { status: 404, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    // Verify order ID matches
    if (registration.razorpay_order_id !== razorpay_order_id) {
      console.error('Order ID mismatch:', { 
        expected: registration.razorpay_order_id, 
        received: razorpay_order_id 
      });
      return new Response(
        JSON.stringify({ error: 'Order ID mismatch', code: 'ORDER_MISMATCH' }),
        { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    // Check if already paid (prevent duplicate updates)
    if (registration.payment_status === 'paid') {
      console.log('Payment already verified for this registration');
      return new Response(
        JSON.stringify({ 
          success: true, 
          message: 'Payment already verified',
          registration_id: registration_id 
        }),
        { status: 200, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    // Update registration with payment details and mark as approved
    const { error: updateError } = await supabase
      .from('team_registrations')
      .update({
        payment_id: razorpay_payment_id,
        payment_signature: razorpay_signature,
        payment_status: 'paid',
        paid_at: new Date().toISOString(),
        status: 'approved', // Auto-approve paid registrations
      })
      .eq('id', registration_id);

    if (updateError) {
      console.error('Failed to update registration:', updateError);
      return new Response(
        JSON.stringify({ error: 'Failed to update registration' }),
        { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    console.log('Registration updated successfully with payment details');

    // Try to send approval email (non-blocking)
    try {
      await supabase.functions.invoke('send-approval-email', {
        body: {
          captain_email: registration.captain_email,
          captain_name: registration.captain_name,
          team_name: registration.team_name,
          event_id: registration.event_id,
        },
      });
      console.log('Approval email sent');
    } catch (emailError) {
      console.error('Failed to send approval email (non-blocking):', emailError);
    }

    return new Response(
      JSON.stringify({ 
        success: true, 
        message: 'Payment verified and registration approved',
        registration_id: registration_id
      }),
      { status: 200, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );

  } catch (error) {
    console.error('Error verifying payment:', error);
    return new Response(
      JSON.stringify({ error: 'Internal server error' }),
      { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  }
});