import { serve } from "https://deno.land/std@0.177.0/http/server.ts";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers":
    "authorization, x-client-info, apikey, content-type",
};

serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response("ok", { headers: corsHeaders });
  }

  try {
    const { name, email, phone, subject, message, captchaToken } = await req.json();

    // Verify reCAPTCHA token
    const recaptchaSecret = Deno.env.get("RECAPTCHA_SECRET_KEY");
    if (recaptchaSecret && captchaToken) {
      const verifyRes = await fetch("https://www.google.com/recaptcha/api/siteverify", {
        method: "POST",
        headers: { "Content-Type": "application/x-www-form-urlencoded" },
        body: `secret=${recaptchaSecret}&response=${captchaToken}`,
      });
      const verifyData = await verifyRes.json();
      if (!verifyData.success) {
        return new Response(
          JSON.stringify({ error: "CAPTCHA verification failed" }),
          { status: 403, headers: { ...corsHeaders, "Content-Type": "application/json" } }
        );
      }
    }

    const resendApiKey = Deno.env.get("RESEND_API_KEY");
    const adminEmail = Deno.env.get("ADMIN_EMAIL") || "raphelmarke@gmail.com";

    if (!resendApiKey) {
      return new Response(
        JSON.stringify({ error: "Email not configured" }),
        { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    const subjectLabels: Record<string, string> = {
      general: "Pytanie ogólne",
      technical: "Problem techniczny",
      billing: "Rozliczenia",
      installation: "Instalacja",
      complaint: "Reklamacja",
    };

    const res = await fetch("https://api.resend.com/emails", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${resendApiKey}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        from: "TV-EURO-SAT Kontakt <onboarding@resend.dev>",
        to: adminEmail,
        subject: `Nowa wiadomość: ${subjectLabels[subject] || subject} — ${name}`,
        html: `
          <div style="font-family: sans-serif; max-width: 600px; margin: 0 auto; padding: 20px;">
            <h1 style="color: #0066FF; font-size: 20px;">Nowa wiadomość z formularza kontaktowego</h1>
            <table style="width: 100%; border-collapse: collapse; margin-top: 16px;">
              <tr><td style="padding: 8px; border-bottom: 1px solid #eee; font-weight: bold; width: 120px;">Imię</td><td style="padding: 8px; border-bottom: 1px solid #eee;">${name}</td></tr>
              <tr><td style="padding: 8px; border-bottom: 1px solid #eee; font-weight: bold;">Email</td><td style="padding: 8px; border-bottom: 1px solid #eee;"><a href="mailto:${email}">${email}</a></td></tr>
              <tr><td style="padding: 8px; border-bottom: 1px solid #eee; font-weight: bold;">Telefon</td><td style="padding: 8px; border-bottom: 1px solid #eee;">${phone || "—"}</td></tr>
              <tr><td style="padding: 8px; border-bottom: 1px solid #eee; font-weight: bold;">Temat</td><td style="padding: 8px; border-bottom: 1px solid #eee;">${subjectLabels[subject] || subject}</td></tr>
            </table>
            <div style="background: #f8f9fa; padding: 16px; border-radius: 8px; margin-top: 16px;">
              <h3 style="margin: 0 0 8px 0; font-size: 14px;">Wiadomość:</h3>
              <p style="margin: 0; white-space: pre-wrap;">${message}</p>
            </div>
          </div>
        `,
      }),
    });

    const result = await res.json();
    console.log("Contact email result:", JSON.stringify(result));

    return new Response(
      JSON.stringify({ ok: true }),
      { headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  } catch (err) {
    console.error("Contact email error:", err);
    return new Response(
      JSON.stringify({ error: err.message }),
      { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  }
});
