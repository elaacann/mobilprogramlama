import { NextResponse } from 'next/server'
import db from '@/lib/db'
import { getSession } from '@/lib/auth'
import { z } from 'zod'

const carSchema = z.object({
    make: z.string().min(1, 'Make is required'),
    model: z.string().min(1, 'Model is required'),
    year: z.number().int().min(1900).max(new Date().getFullYear() + 1),
    pricePerDay: z.number().min(0),
    imageUrl: z.string().url(),
    description: z.string().optional(),
    transmission: z.string(),
    fuelType: z.string(),
    officeId: z.string().min(1, 'Office is required'),
})

export async function POST(request: Request) {
    const session = await getSession()
    if (!session || session.user.role !== 'ADMIN') {
        return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    try {
        const body = await request.json()
        const result = carSchema.safeParse(body)

        if (!result.success) {
            return NextResponse.json({ error: result.error.issues[0].message }, { status: 400 })
        }

        const data = result.data

        const car = await db.car.create({
            data: {
                ...data,
                available: true,
            }
        })

        return NextResponse.json({ success: true, car })

    } catch (error) {
        console.error(error)
        return NextResponse.json({ error: 'Failed to create car' }, { status: 500 })
    }
}
