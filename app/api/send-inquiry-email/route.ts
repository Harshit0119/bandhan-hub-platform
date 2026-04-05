//\app\api\send-inquiry-email\route.ts
import { NextResponse } from "next/server";
import { Resend } from "resend";
import { createClient } from "@supabase/supabase-js";

const resend = new Resend(process.env.RESEND_API_KEY!);

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!, // 🔐 SAFE (server only)
);

export async function POST(req: Request) {
  try {
    const { vendorId, name, phone, message } = await req.json();

    // get vendor user_id
    const { data: vendor } = await supabase
      .from("vendors")
      .select("user_id, name")
      .eq("id", vendorId)
      .single();

    if (!vendor?.user_id) {
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
      from: "BandhanHub <onboarding@resend.dev>", // temp
      to: "bandhanhub@gmail.com",
      subject: "New Inquiry Received 🎉",
      html: `
        <h2>New Inquiry on BandhanHub</h2>
        <p><strong>Name:</strong> ${name}</p>
        <p><strong>Phone:</strong> ${phone}</p>
        <p><strong>Message:</strong> ${message}</p>
        <br/>
        <a href="https://v0-bandhan-hub-saa-s-platform.vercel.app/dashboard/inquiries">
          View in Dashboard
        </a>
      `,
    });

    return NextResponse.json({ success: true });
  } catch (err) {
    console.error(err);
    return NextResponse.json({ error: "Failed" }, { status: 500 });
  }
}
