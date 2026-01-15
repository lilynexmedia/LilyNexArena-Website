import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const RESEND_API_KEY = Deno.env.get("RESEND_API_KEY");

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers":
    "authorization, x-client-info, apikey, content-type",
};

interface ContactRequest {
  name: string;
  email: string;
  subject: string;
  message: string;
}

const handler = async (req: Request): Promise<Response> => {
  // Handle CORS preflight requests
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { name, email, subject, message }: ContactRequest = await req.json();

    console.log("[Contact Email] Sending from:", name, email);

    // Validate inputs
    if (!name || !email || !subject || !message) {
      console.error("[Contact Email] Missing required fields");
      return new Response(
        JSON.stringify({ error: "All fields are required" }),
        {
          status: 400,
          headers: { "Content-Type": "application/json", ...corsHeaders },
        }
      );
    }

    // Send email to LilyNex
    const emailResponse = await fetch("https://api.resend.com/emails", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${RESEND_API_KEY}`,
      },
      body: JSON.stringify({
        from: "LilyNex Esports <noreply@notifications.lilynexmedia.com>",
        to: ["lilynexesports@gmail.com"],
        reply_to: email,
        subject: `[Contact Form] ${subject}`,
        html: `
          <!DOCTYPE html>
          <html>
          <head>
            <meta charset="utf-8">
            <meta name="viewport" content="width=device-width, initial-scale=1.0">
          </head>
          <body style="margin: 0; padding: 0; background-color: #0a0a0f; font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;">
            <table width="100%" cellpadding="0" cellspacing="0" style="background-color: #0a0a0f; padding: 40px 20px;">
              <tr>
                <td align="center">
                  <table width="600" cellpadding="0" cellspacing="0" style="background: linear-gradient(135deg, #0f0f1a 0%, #1a1a2e 100%); border-radius: 16px; border: 1px solid rgba(0, 212, 255, 0.2); overflow: hidden;">
                    <!-- Header -->
                    <tr>
                      <td style="padding: 40px 40px 20px; text-align: center; border-bottom: 1px solid rgba(0, 212, 255, 0.1);">
                        <h1 style="margin: 0; font-size: 28px; font-weight: 800; letter-spacing: 2px;">
                          <span style="color: #ffffff;">LILY</span><span style="background: linear-gradient(135deg, #00d4ff, #a855f7); -webkit-background-clip: text; -webkit-text-fill-color: transparent; background-clip: text;">NEX</span>
                        </h1>
                        <p style="margin: 8px 0 0; color: #00d4ff; font-size: 12px; text-transform: uppercase; letter-spacing: 3px;">ESPORTS</p>
                      </td>
                    </tr>
                    
                    <!-- Main Content -->
                    <tr>
                      <td style="padding: 40px;">
                        <div style="text-align: center; margin-bottom: 30px;">
                          <span style="display: inline-block; background: rgba(0, 212, 255, 0.2); color: #00d4ff; padding: 8px 20px; border-radius: 20px; font-size: 14px; font-weight: 600; border: 1px solid rgba(0, 212, 255, 0.3);">
                            📧 NEW CONTACT FORM SUBMISSION
                          </span>
                        </div>
                        
                        <!-- Contact Details Card -->
                        <table width="100%" cellpadding="0" cellspacing="0" style="background: rgba(0, 212, 255, 0.05); border: 1px solid rgba(0, 212, 255, 0.15); border-radius: 12px; margin-bottom: 24px;">
                          <tr>
                            <td style="padding: 24px;">
                              <table width="100%" cellpadding="0" cellspacing="0">
                                <tr>
                                  <td style="padding: 8px 0;">
                                    <span style="color: #6b7280; font-size: 12px; text-transform: uppercase; letter-spacing: 1px;">From</span>
                                    <p style="color: #ffffff; font-size: 18px; font-weight: 600; margin: 4px 0 0;">${name}</p>
                                  </td>
                                </tr>
                                <tr>
                                  <td style="padding: 8px 0;">
                                    <span style="color: #6b7280; font-size: 12px; text-transform: uppercase; letter-spacing: 1px;">Email</span>
                                    <p style="color: #00d4ff; font-size: 16px; margin: 4px 0 0;"><a href="mailto:${email}" style="color: #00d4ff; text-decoration: none;">${email}</a></p>
                                  </td>
                                </tr>
                                <tr>
                                  <td style="padding: 8px 0;">
                                    <span style="color: #6b7280; font-size: 12px; text-transform: uppercase; letter-spacing: 1px;">Subject</span>
                                    <p style="color: #a855f7; font-size: 16px; font-weight: 600; margin: 4px 0 0;">${subject}</p>
                                  </td>
                                </tr>
                              </table>
                            </td>
                          </tr>
                        </table>
                        
                        <!-- Message Box -->
                        <table width="100%" cellpadding="0" cellspacing="0" style="background: rgba(255, 255, 255, 0.05); border-left: 4px solid #00d4ff; border-radius: 8px;">
                          <tr>
                            <td style="padding: 20px;">
                              <span style="color: #6b7280; font-size: 12px; text-transform: uppercase; letter-spacing: 1px; display: block; margin-bottom: 12px;">Message</span>
                              <p style="color: #e0e0e0; font-size: 15px; line-height: 1.7; margin: 0; white-space: pre-wrap;">${message}</p>
                            </td>
                          </tr>
                        </table>
                      </td>
                    </tr>
                    
                    <!-- Footer -->
                    <tr>
                      <td style="padding: 30px 40px; background: rgba(0, 0, 0, 0.3); border-top: 1px solid rgba(0, 212, 255, 0.1);">
                        <p style="color: #6b7280; font-size: 13px; margin: 0; text-align: center;">
                          Sent from LilyNex Esports Contact Form
                        </p>
                      </td>
                    </tr>
                  </table>
                </td>
              </tr>
            </table>
          </body>
          </html>
        `,
      }),
    });

    const emailData = await emailResponse.json();

    if (!emailResponse.ok) {
      console.error("[Contact Email] Resend API error:", emailData);
      throw new Error(emailData.message || "Failed to send email");
    }

    console.log("[Contact Email] Email sent successfully:", emailData);

    return new Response(JSON.stringify({ success: true }), {
      status: 200,
      headers: { "Content-Type": "application/json", ...corsHeaders },
    });
  } catch (error: any) {
    console.error("[Contact Email] Error sending email:", error);
    return new Response(
      JSON.stringify({ error: error.message }),
      {
        status: 500,
        headers: { "Content-Type": "application/json", ...corsHeaders },
      }
    );
  }
};

serve(handler);