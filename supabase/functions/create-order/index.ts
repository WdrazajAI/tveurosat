import { serve } from "https://deno.land/std@0.177.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.39.0";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers":
    "authorization, x-client-info, apikey, content-type",
};

serve(async (req) => {
  // Handle CORS preflight
  if (req.method === "OPTIONS") {
    return new Response("ok", { headers: corsHeaders });
  }

  try {
    const supabase = createClient(
      Deno.env.get("SUPABASE_URL")!,
      Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!
    );

    const body = await req.json();
    const {
      // Package data
      internetPackageId,
      internetPackageName,
      internetPeriod,
      internetMonthlyPrice,
      internetActivationFee,
      internetInstallationFee,
      tvPackageId,
      tvPackageName,
      tvPeriod,
      tvMonthlyPrice,
      tvActivationFee,
      tvInstallationFee,
      tvAddons,
      monthlyTotal,
      onetimeTotal,
      // Customer data
      name,
      email,
      phone,
      // Address
      city,
      street,
      building,
      postalCode,
      installationNotes,
      captchaToken,
    } = body;

    // 0. Verify reCAPTCHA token
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

    // 1. Insert order into database
    const { data: order, error: dbError } = await supabase
      .from("orders")
      .insert({
        internet_package_id: internetPackageId || null,
        internet_package_name: internetPackageName || null,
        internet_period: internetPeriod || null,
        internet_monthly_price: internetMonthlyPrice || null,
        internet_activation_fee: internetActivationFee || null,
        internet_installation_fee: internetInstallationFee || null,
        tv_package_id: tvPackageId || null,
        tv_package_name: tvPackageName || null,
        tv_period: tvPeriod || null,
        tv_monthly_price: tvMonthlyPrice || null,
        tv_activation_fee: tvActivationFee || null,
        tv_installation_fee: tvInstallationFee || null,
        tv_addons: tvAddons || [],
        monthly_total: monthlyTotal || 0,
        onetime_total: onetimeTotal || 0,
        customer_name: name,
        customer_email: email,
        customer_phone: phone,
        address_city: city,
        address_street: street || null,
        address_building: building,
        address_postal_code: postalCode,
        installation_notes: installationNotes || null,
        status: "pending",
      })
      .select()
      .single();

    if (dbError) {
      console.error("DB Error:", dbError);
      return new Response(
        JSON.stringify({ error: "Failed to create order" }),
        { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    // 2. Send email notification to admin
    const resendApiKey = Deno.env.get("RESEND_API_KEY");
    const adminEmail = Deno.env.get("ADMIN_EMAIL") || "raphelmarke@gmail.com";

    if (resendApiKey && order) {
      try {
        await fetch("https://api.resend.com/emails", {
          method: "POST",
          headers: {
            Authorization: `Bearer ${resendApiKey}`,
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            from: "TV-EURO-SAT <onboarding@resend.dev>",
            to: adminEmail,
            subject: `Nowe zamówienie #${order.id.slice(0, 8)} - ${order.customer_name}`,
            html: buildAdminEmail(order),
          }),
        });
      } catch (e) {
        console.error("Admin email error:", e);
      }
    }

    return new Response(
      JSON.stringify({ orderId: order.id }),
      {
        status: 200,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      }
    );
  } catch (err) {
    console.error("Error:", err);
    return new Response(
      JSON.stringify({ error: err.message }),
      { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  }
});

// deno-lint-ignore no-explicit-any
// eslint-disable-next-line @typescript-eslint/no-explicit-any
function buildAdminEmail(order: any): string {
  return `
    <div style="font-family: sans-serif; max-width: 600px; margin: 0 auto; padding: 20px;">
      <h1 style="color: #0066FF;">Nowe zamówienie!</h1>
      <table style="width: 100%; border-collapse: collapse;">
        <tr><td style="padding: 8px; border-bottom: 1px solid #eee; font-weight: bold;">Klient</td><td style="padding: 8px; border-bottom: 1px solid #eee;">${order.customer_name}</td></tr>
        <tr><td style="padding: 8px; border-bottom: 1px solid #eee; font-weight: bold;">Email</td><td style="padding: 8px; border-bottom: 1px solid #eee;">${order.customer_email}</td></tr>
        <tr><td style="padding: 8px; border-bottom: 1px solid #eee; font-weight: bold;">Telefon</td><td style="padding: 8px; border-bottom: 1px solid #eee;">${order.customer_phone}</td></tr>
        <tr><td style="padding: 8px; border-bottom: 1px solid #eee; font-weight: bold;">Adres</td><td style="padding: 8px; border-bottom: 1px solid #eee;">${order.address_city}${order.address_street ? `, ${order.address_street}` : ""} ${order.address_building}, ${order.address_postal_code}</td></tr>
        ${order.internet_package_name ? `<tr><td style="padding: 8px; border-bottom: 1px solid #eee; font-weight: bold;">Internet</td><td style="padding: 8px; border-bottom: 1px solid #eee;">${order.internet_package_name} — ${order.internet_monthly_price} zł/mies.</td></tr>` : ""}
        ${order.tv_package_name ? `<tr><td style="padding: 8px; border-bottom: 1px solid #eee; font-weight: bold;">TV</td><td style="padding: 8px; border-bottom: 1px solid #eee;">${order.tv_package_name} — ${order.tv_monthly_price} zł/mies.</td></tr>` : ""}
        <tr><td style="padding: 8px; border-bottom: 1px solid #eee; font-weight: bold;">Miesięcznie</td><td style="padding: 8px; border-bottom: 1px solid #eee; font-weight: bold; color: #0066FF;">${order.monthly_total} zł</td></tr>
        <tr><td style="padding: 8px; border-bottom: 1px solid #eee; font-weight: bold;">Jednorazowo</td><td style="padding: 8px; border-bottom: 1px solid #eee;">${order.onetime_total} zł</td></tr>
        ${order.installation_notes ? `<tr><td style="padding: 8px; font-weight: bold;">Uwagi</td><td style="padding: 8px;">${order.installation_notes}</td></tr>` : ""}
      </table>
      <p style="margin-top: 16px; color: #666;">ID: ${order.id}</p>
    </div>
  `;
}
