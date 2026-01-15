import { NextResponse } from 'next/server'
import db from '@/lib/db'
import { getSession } from '@/lib/auth'
import { z } from 'zod'

const officeSchema = z.object({
    name: z.string().min(1),
    address: z.string().min(1),
    latitude: z.number(),
    longitude: z.number(),
})

export async function GET() {
    const offices = await db.office.findMany({
        orderBy: { name: 'asc' }
    })
    return NextResponse.json(offices)
}

export async function POST(request: Request) {
    const session = await getSession()
    if (!session || session.user.role !== 'ADMIN') {
        return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    try {
        const body = await request.json()
        const result = officeSchema.safeParse(body)

        if (!result.success) {
            return NextResponse.json({
                error: 'Validation failed',
                issues: result.error.issues
            }, { status: 400 })
        }

        const office = await db.office.create({
            data: result.data
        })

        return NextResponse.json(office)
    } catch (error) {
        return NextResponse.json({ error: 'Failed to create office' }, { status: 500 })
    }
}
