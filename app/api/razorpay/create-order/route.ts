//app\api\razorpay\create-order\route.ts
import Razorpay from 'razorpay'
import { NextResponse } from 'next/server'

const razorpay = new Razorpay({
  key_id: process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID!,
  key_secret: process.env.RAZORPAY_KEY_SECRET!,
})

export async function POST(req: Request) {
  try {
    const { plan, userId } = await req.json()

    const amountMap: Record<string, number> = {
      premium: 19900, // ₹199 in paise
      annual: 199900, // ₹1999 in paise
    }

    const order = await razorpay.orders.create({
      amount: amountMap[plan],
      currency: 'INR',
      receipt: `receipt_${Date.now()}`,
      notes: {
        userId,
        plan,
      },
    })

    return NextResponse.json(order)
  } catch (err) {
    console.error(err)
    return NextResponse.json({ error: 'Order creation failed' }, { status: 500 })
  }
}