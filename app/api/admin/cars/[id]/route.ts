import { NextResponse } from 'next/server'
import db from '@/lib/db'
import { getSession } from '@/lib/auth'
import { z } from 'zod'

const carSchema = z.object({
    make: z.string().min(1),
    model: z.string().min(1),
    year: z.number().min(1900),
    pricePerDay: z.number().min(0),
    imageUrl: z.string().url(),
    officeId: z.string().min(1),
    description: z.string().optional(),
    transmission: z.string().min(1),
    fuelType: z.string().min(1),
})

export async function PATCH(request: Request, { params }: { params: Promise<{ id: string }> }) {
    const session = await getSession()
    if (!session || session.user.role !== 'ADMIN') {
        return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    try {
        const { id } = await params
        const body = await request.json()

        const result = carSchema.partial().safeParse(body)

        if (!result.success) {
            return NextResponse.json({
                error: 'Validation failed',
                issues: result.error.issues
            }, { status: 400 })
        }

        const car = await db.car.update({
            where: { id },
            data: result.data
        })

        return NextResponse.json({ car })
    } catch (error) {
        console.error(error)
        return NextResponse.json({ error: 'Failed to update car' }, { status: 500 })
    }
}

export async function DELETE(request: Request, { params }: { params: Promise<{ id: string }> }) {
    const session = await getSession()
    if (!session || session.user.role !== 'ADMIN') {
        return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    try {
        const { id } = await params

        // Check for active reservations
        const activeReservations = await db.reservation.findFirst({
            where: {
                carId: id,
                status: { in: ['PENDING', 'CONFIRMED'] }
            }
        })

        if (activeReservations) {
            return NextResponse.json({ error: 'Cannot delete car with active reservations' }, { status: 400 })
        }

        // Delete associated reservations first (since no cascade defined in schema?)
        // Safer to just delete relation
        await db.reservation.deleteMany({
            where: { carId: id }
        })

        await db.car.delete({
            where: { id }
        })

        return NextResponse.json({ success: true })

    } catch (error) {
        console.error(error)
        return NextResponse.json({ error: 'Failed to delete car' }, { status: 500 })
    }
}
