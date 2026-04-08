//\app\api\send-inquiry-email\route.ts

import { NextResponse } from "next/server";
import { Resend } from "resend";
import { createClient } from "@supabase/supabase-js";

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!, // 🔐 SAFE (server only)
);

const resend = new Resend(process.env.RESEND_API_KEY!);

export async function POST(req: Request) {
  try {
    const { vendorId, name, phone, message } = await req.json();

    // get vendor user_id
    const { data: vendor } = await supabase
      .from("vendors")
      .select("user_id, name")
      .eq("id", vendorId)
      .single();

    if (!vendor) {
      return NextResponse.json({ error: "Vendor not found" });
    }

    // Step 2: get email from auth.users
    const { data: userData } = await supabase.auth.admin.getUserById(
      vendor.user_id,
    );

    const email = userData?.user?.email;

    if (!email) {
      return NextResponse.json({ error: "No email found" });
    }

    await resend.emails.send({
      from: "BandhanHub <onboarding@resend.dev>", //"BandhanHub <noreply@bandhanhub.com>" -- > change to this when have domain.
      to: email,
      subject: "New Inquiry Received 🎉",
      html: `
        <div style="font-family: Arial, sans-serif; background:#f9fafb; padding:20px;">
    
    <div style="max-width:600px;margin:0 auto;background:#ffffff;border-radius:10px;overflow:hidden;box-shadow:0 4px 12px rgba(0,0,0,0.08);">
      
      <!-- HEADER -->
      <div style="background:#8B0000;color:#ffffff;padding:24px 16px;text-align:center;">
      <img 
  src="https://bandhan-hub.vercel.app/bandhan-hublogo.png" 
  alt="BandhanHub"
  style="max-width:160px;width:100%;height:auto;display:block;margin:0 auto 10px;"
/>
        <h1 style="margin:10px 0 5px;font-size:20px;font-weight:600;">
        Hello ${vendor.name || "vendor"},
        </h1>

        <p style="margin:0;font-size:14px;opaciity:0.9">You’ve got a new inquiry 🎉</p>
      </div>

      <!-- BODY -->
      <div style="padding:20px;">
        <h2 style="margin-top:0;color:#111;">New Inquiry Received</h2>
        
        <p style="color:#555;font-size:14px;">
          A user has shown interest in your services. Here are the details:
        </p>

        <div style="margin:15px 0;padding:15px;background:#f3f4f6;border-radius:8px;">
          <p style="margin:5px 0;"><strong>Name:</strong> ${name}</p>
          <p style="margin:5px 0;"><strong>Phone:</strong> ${phone}</p>
          <p style="margin:5px 0;"><strong>Message:</strong> ${message || "N/A"}</p>
        </div>

        <!-- CTA BUTTON -->
        <div style="text-align:center;margin-top:20px;">
          <a href="https://bandhan-hub.vercel.app/dashboard/inquiries"
             style="background:#8B0000;color:#fff;padding:12px 20px;border-radius:6px;text-decoration:none;font-weight:bold;">
             View Inquiry
          </a>
        </div>

        <p style="margin-top:20px;font-size:12px;color:#888;">
          Tip: Respond quickly to increase your chances of getting booked 🚀
        </p>
      </div>

      <!-- FOOTER -->
      <div style="background:#f3f4f6;padding:15px;text-align:center;font-size:12px;color:#666;">
        © ${new Date().getFullYear()} BandhanHub. All rights reserved.
      </div>

    </div>
  </div>
      `,
    });

    return NextResponse.json({ success: true });
  } catch (err) {
    console.error(err);
    return NextResponse.json({ error: "Failed" }, { status: 500 });
  }
}
