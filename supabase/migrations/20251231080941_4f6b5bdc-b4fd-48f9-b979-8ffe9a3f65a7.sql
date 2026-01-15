-- SECURITY FIX: Create a trigger to enforce payment field protection
-- This ensures payment fields can ONLY be set by service role (edge functions)

-- Create function to validate payment fields on insert/update
CREATE OR REPLACE FUNCTION public.validate_payment_fields()
RETURNS TRIGGER AS $$
BEGIN
    -- Check if this is being called with service role (edge functions)
    -- auth.role() returns the role of the current user
    -- For service_role, it returns 'service_role'
    -- For anon/authenticated, it returns the respective role
    
    -- On INSERT: payment fields must be NULL (only backend can set them later)
    IF TG_OP = 'INSERT' THEN
        -- Allow if service role, otherwise force payment fields to safe defaults
        IF current_setting('request.jwt.claims', true)::json->>'role' != 'service_role' THEN
            NEW.payment_status := 'not_required';
            NEW.payment_id := NULL;
            NEW.razorpay_order_id := NULL;
            NEW.payment_signature := NULL;
            NEW.payment_amount := NULL;
            NEW.paid_at := NULL;
        END IF;
    END IF;
    
    -- On UPDATE: prevent non-service-role from modifying payment fields
    IF TG_OP = 'UPDATE' THEN
        IF current_setting('request.jwt.claims', true)::json->>'role' != 'service_role' THEN
            -- Preserve existing payment fields, don't allow frontend to change them
            NEW.payment_status := OLD.payment_status;
            NEW.payment_id := OLD.payment_id;
            NEW.razorpay_order_id := OLD.razorpay_order_id;
            NEW.payment_signature := OLD.payment_signature;
            NEW.payment_amount := OLD.payment_amount;
            NEW.paid_at := OLD.paid_at;
        END IF;
    END IF;
    
    RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER SET search_path = public;

-- Drop trigger if exists and recreate
DROP TRIGGER IF EXISTS enforce_payment_field_protection ON public.team_registrations;

CREATE TRIGGER enforce_payment_field_protection
BEFORE INSERT OR UPDATE ON public.team_registrations
FOR EACH ROW
EXECUTE FUNCTION public.validate_payment_fields();