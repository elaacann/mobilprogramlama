import { NextResponse } from 'next/server'
import db from '@/lib/db'
import { getSession } from '@/lib/auth'

import { z } from 'zod'

const reservationSchema = z.object({
    carId: z.string(),
    startDate: z.string(),
    endDate: z.string(),
    totalAmount: z.number(),
})

export async function POST(request: Request) {
    try {
        const session = await getSession()
        if (!session || !session.user) {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
        }

        const body = await request.json()
        const result = reservationSchema.safeParse(body)

        if (!result.success) {
            return NextResponse.json({ error: 'Invalid data' }, { status: 400 })
        }

        const { carId, startDate, endDate, totalAmount } = result.data

        // Basic validation: check overlapping? Skip for now for simplicity.

        // Generate QR Data content (e.g., JSON string or a UUID reference)
        // We'll use a random UUID + Reservation info signature
        const qrCodeData = crypto.randomUUID()

        const reservation = await db.reservation.create({
            data: {
                userId: session.user.id,
                carId,
                startDate: new Date(startDate),
                endDate: new Date(endDate),
                totalAmount,
                status: 'PENDING',
                qrCodeData,
            }
        })

        return NextResponse.json({ success: true, reservation })

    } catch (error) {
        console.error(error)
        return NextResponse.json({ error: 'Failed to create reservation' }, { status: 500 })
    }
}
