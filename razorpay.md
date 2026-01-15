# Razorpay Payment Integration Guide

This guide explains how to configure and manage Razorpay payments for LilyNex Arena.

## Overview

The platform uses Razorpay for processing tournament entry fee payments. When a user registers for a paid event, they are redirected to Razorpay's secure payment gateway.

## Configuration

### Required Secrets

The following secrets must be configured in **Supabase Edge Function Secrets**:

| Secret Name | Description | Where to Find |
|-------------|-------------|---------------|
| `RAZORPAY_KEY_ID` | Your Razorpay API Key ID | Razorpay Dashboard → Settings → API Keys |
| `RAZORPAY_KEY_SECRET` | Your Razorpay API Key Secret | Razorpay Dashboard → Settings → API Keys |

### How to Update Razorpay Keys

1. **Login to Razorpay Dashboard**: [https://dashboard.razorpay.com](https://dashboard.razorpay.com)

2. **Navigate to API Keys**:
   - Go to **Settings** → **API Keys**
   - Generate new keys if needed (Test/Live mode)

3. **Update in Supabase**:
   - Go to Supabase Dashboard → **Project Settings** → **Edge Functions** → **Secrets**
   - Or use this direct link: [Edge Function Secrets](https://supabase.com/dashboard/project/vddxueqeiusevpncfmsa/settings/functions)
   - Update `RAZORPAY_KEY_ID` and `RAZORPAY_KEY_SECRET`

## Payment Flow

```
User Registration → Create Order (Edge Function) → Razorpay Checkout → Verify Payment → Registration Confirmed
```

### Edge Functions

| Function | Purpose |
|----------|---------|
| `create-razorpay-order` | Creates a Razorpay order with the event's entry amount |
| `verify-razorpay-payment` | Verifies payment signature and updates registration status |

## Event Entry Amount

To set or update the entry fee for an event:

1. Go to **Admin Panel** → **Events** → Select Event
2. Update the **Entry Amount** field (in INR)
3. If amount is `0`, payment is skipped (free registration)

## Test vs Live Mode

### Test Mode (Development)
- Use Test API Keys from Razorpay Dashboard
- Test card: `4111 1111 1111 1111` (any future expiry, any CVV)
- UPI: `success@razorpay` for successful payments

### Live Mode (Production)
- Switch to Live API Keys in Razorpay Dashboard
- Update secrets in Supabase with Live keys
- Ensure KYC verification is complete on Razorpay

## Troubleshooting

### Common Issues

1. **Payment fails immediately**
   - Check if `RAZORPAY_KEY_ID` and `RAZORPAY_KEY_SECRET` are correct
   - Verify you're using matching Test/Live keys

2. **Signature verification failed**
   - Ensure `RAZORPAY_KEY_SECRET` is correct
   - Check Edge Function logs for details

3. **Order creation fails**
   - Verify event has a valid `entry_amount` > 0
   - Check Edge Function logs: [View Logs](https://supabase.com/dashboard/project/vddxueqeiusevpncfmsa/functions/create-razorpay-order/logs)

### Viewing Logs

- **Create Order Logs**: [create-razorpay-order](https://supabase.com/dashboard/project/vddxueqeiusevpncfmsa/functions/create-razorpay-order/logs)
- **Verify Payment Logs**: [verify-razorpay-payment](https://supabase.com/dashboard/project/vddxueqeiusevpncfmsa/functions/verify-razorpay-payment/logs)

## Security Notes

- Payment amounts are validated server-side (not from frontend)
- Payment signature is verified using HMAC SHA256
- Database trigger `validate_payment_fields` prevents unauthorized status updates
- Never expose `RAZORPAY_KEY_SECRET` in frontend code

## Useful Links

- [Razorpay Dashboard](https://dashboard.razorpay.com)
- [Razorpay API Documentation](https://razorpay.com/docs/api/)
- [Test Card Numbers](https://razorpay.com/docs/payments/payments/test-card-upi-details/)
- [Supabase Edge Function Secrets](https://supabase.com/dashboard/project/vddxueqeiusevpncfmsa/settings/functions)
