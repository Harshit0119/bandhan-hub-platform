// app/api/razorpay/webhook/route.ts

import { NextResponse } from "next/server"
import crypto from "crypto"
import { createClient } from "@supabase/supabase-js"

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
)

export async function POST(req: Request) {
  try {
    const body = await req.text()
    const signature = req.headers.get("x-razorpay-signature")!

    const expectedSignature = crypto
      .createHmac("sha256", process.env.RAZORPAY_WEBHOOK_SECRET!)
      .update(body)
      .digest("hex")

    if (expectedSignature !== signature) {
      return NextResponse.json({ error: "Invalid signature" }, { status: 400 })
    }

    const event = JSON.parse(body)

    if (event.event === "payment.captured") {
      const payment = event.payload.payment.entity

      const userId = payment.notes.userId
      const plan = payment.notes.plan

      console.log("Webhook payment:", userId, plan)

      // 🔥 same logic as verify-payment
      const { data: vendor } = await supabase
        .from("vendors")
        .select("id")
        .eq("user_id", userId)
        .single()

      if (vendor) {
        const expiresAt = new Date()

        if (plan === "annual") {
          expiresAt.setFullYear(expiresAt.getFullYear() + 1)
        } else {
          expiresAt.setMonth(expiresAt.getMonth() + 1)
        }

        await supabase
          .from("vendors")
          .update({
            is_premium: true,
            subscription_plan: plan,
            subscription_expires_at: expiresAt.toISOString(),
          })
          .eq("id", vendor.id)
      }
    }

    return NextResponse.json({ status: "ok" })
  } catch (err) {
    console.error("Webhook error:", err)
    return NextResponse.json({ error: "Webhook failed" }, { status: 500 })
  }
}