import { NextResponse } from 'next/server'
import db from '@/lib/db'
import { getSession } from '@/lib/auth'

export async function POST(request: Request) {
    const session = await getSession()
    if (!session || session.user.role !== 'ADMIN') {
        return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    try {
        const { qrCodeData } = await request.json()

        const reservation = await db.reservation.findUnique({
            where: { qrCodeData }
        })

        if (!reservation) {
            return NextResponse.json({ error: 'Reservation not found' }, { status: 404 })
        }

        return NextResponse.json({ success: true, reservationId: reservation.id })

    } catch (error) {
        return NextResponse.json({ error: 'Verification failed' }, { status: 500 })
    }
}
