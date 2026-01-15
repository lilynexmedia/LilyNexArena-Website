import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const RESEND_API_KEY = Deno.env.get("RESEND_API_KEY");



const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

interface ApprovalEmailRequest {
  captainName: string;
  captainEmail: string;
  teamName: string;
  eventName: string;
}

const handler = async (req: Request): Promise<Response> => {
  // Handle CORS preflight
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { captainName, captainEmail, teamName, eventName }: ApprovalEmailRequest = await req.json();

    console.log(`[Approval Email] Sending to ${captainEmail} for team ${teamName}`);

    if (!captainEmail || !captainName || !teamName || !eventName) {
      console.error("[Approval Email] Missing required fields");
      return new Response(
        JSON.stringify({ error: "Missing required fields" }),
        { status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    const emailResponse = await fetch("https://api.resend.com/emails", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${RESEND_API_KEY}`,
      },
      body: JSON.stringify({
        from: "LilyNex Esports <noreply@notifications.lilynexmedia.com>",
        to: [captainEmail],
        subject: "✅ Team Approved – Welcome to LilyNex Esports",
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
                          <span style="display: inline-block; background: rgba(34, 197, 94, 0.2); color: #22c55e; padding: 8px 20px; border-radius: 20px; font-size: 14px; font-weight: 600; border: 1px solid rgba(34, 197, 94, 0.3);">
                            ✅ TEAM APPROVED
                          </span>
                        </div>
                        
                        <h2 style="color: #ffffff; font-size: 24px; margin: 0 0 20px; text-align: center;">
                          Hey ${captainName}! 🎮
                        </h2>
                        
                        <p style="color: #a0a0b0; font-size: 16px; line-height: 1.6; margin: 0 0 24px; text-align: center;">
                          Great news! Your team has been officially approved and you're now part of the action.
                        </p>
                        
                        <!-- Team Details Card -->
                        <table width="100%" cellpadding="0" cellspacing="0" style="background: rgba(0, 212, 255, 0.05); border: 1px solid rgba(0, 212, 255, 0.15); border-radius: 12px; margin-bottom: 24px;">
                          <tr>
                            <td style="padding: 24px;">
                              <table width="100%" cellpadding="0" cellspacing="0">
                                <tr>
                                  <td style="padding: 8px 0;">
                                    <span style="color: #6b7280; font-size: 12px; text-transform: uppercase; letter-spacing: 1px;">Team Name</span>
                                    <p style="color: #00d4ff; font-size: 18px; font-weight: 600; margin: 4px 0 0;">${teamName}</p>
                                  </td>
                                </tr>
                                <tr>
                                  <td style="padding: 8px 0;">
                                    <span style="color: #6b7280; font-size: 12px; text-transform: uppercase; letter-spacing: 1px;">Event</span>
                                    <p style="color: #a855f7; font-size: 18px; font-weight: 600; margin: 4px 0 0;">${eventName}</p>
                                  </td>
                                </tr>
                              </table>
                            </td>
                          </tr>
                        </table>
                        
                        <p style="color: #a0a0b0; font-size: 15px; line-height: 1.6; margin: 0 0 24px; text-align: center;">
                          Get your squad ready and prepare to compete. Keep an eye on our website for match schedules and updates.
                        </p>
                        
                        <p style="color: #a0a0b0; font-size: 15px; line-height: 1.6; margin: 0; text-align: center;">
                          Thank you for being part of the LilyNex community. Let's make this tournament legendary! 🏆
                        </p>
                      </td>
                    </tr>
                    
                    <!-- Footer -->
                    <tr>
                      <td style="padding: 30px 40px; background: rgba(0, 0, 0, 0.3); border-top: 1px solid rgba(0, 212, 255, 0.1);">
                        <p style="color: #6b7280; font-size: 13px; margin: 0 0 8px; text-align: center;">
                          Good luck, and game on!
                        </p>
                        <p style="color: #00d4ff; font-size: 14px; font-weight: 600; margin: 0; text-align: center;">
                          — LilyNex Esports Team
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
      console.error("[Approval Email] Resend API error:", emailData);
      throw new Error(emailData.message || "Failed to send email");
    }

    console.log("[Approval Email] Email sent successfully:", emailResponse);

    return new Response(
      JSON.stringify({ success: true, data: emailResponse }),
      { status: 200, headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  } catch (error: any) {
    console.error("[Approval Email] Error sending email:", error);
    return new Response(
      JSON.stringify({ error: error.message }),
      { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  }
};

serve(handler);