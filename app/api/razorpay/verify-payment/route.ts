//app\api\razorpay\verify-payment\routes.ts
import { NextResponse } from 'next/server'
import crypto from 'crypto'
import { createClient } from '@supabase/supabase-js'

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
)

export async function POST(req: Request) {
  try {
    const {
      razorpay_order_id,
      razorpay_payment_id,
      razorpay_signature,
      userId,
      plan,
    } = await req.json()

    const body = razorpay_order_id + "|" + razorpay_payment_id

    const expectedSignature = crypto
      .createHmac('sha256', process.env.RAZORPAY_KEY_SECRET!)
      .update(body)
      .digest('hex')

    if (expectedSignature !== razorpay_signature) {
      return NextResponse.json({ error: 'Invalid signature' }, { status: 400 })
    }

    // ✅ GET vendor
    const { data: vendor } = await supabase
      .from('vendors')
      .select('id')
      .eq('user_id', userId)
      .single()

    if (!vendor) {
      return NextResponse.json({ error: 'Vendor not found' }, { status: 404 })
    }

    // ✅ expiry logic
    const expiresAt = new Date()
    if (plan === 'annual') {
      expiresAt.setFullYear(expiresAt.getFullYear() + 1)
    } else {
      expiresAt.setMonth(expiresAt.getMonth() + 1)
    }

    // ✅ UPDATE vendor
    const { data, error } = await supabase
      .from('vendors')
      .update({
        is_premium: true,
        subscription_plan: plan,
        subscription_expires_at: expiresAt.toISOString(),
      })
      .eq('id', vendor.id)
      .select()
      
        console.log("UPDATE RESULT:", data)
        console.log("UPDATE ERROR:", error)
      

    return NextResponse.json({ success: true })
  } catch (err) {
    console.error(err)
    return NextResponse.json({ error: 'Verification failed' }, { status: 500 })
  }
}