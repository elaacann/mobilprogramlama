
import { NextResponse } from 'next/server'
import db from '@/lib/db'
import { getSession } from '@/lib/auth'

export async function PATCH(request: Request, { params }: { params: Promise<{ id: string }> }) {
    const session = await getSession()
    if (!session || session.user.role !== 'ADMIN') {
        return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    try {
        const { status } = await request.json()
        const { id } = await params

        const reservation = await db.reservation.update({
            where: { id },
            data: { status }
        })

        return NextResponse.json({ success: true, reservation })
    } catch (error) {
        return NextResponse.json({ error: 'Update failed' }, { status: 500 })
    }
}
