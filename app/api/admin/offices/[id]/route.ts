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

export async function PATCH(request: Request, { params }: { params: Promise<{ id: string }> }) {
    const session = await getSession()
    if (!session || session.user.role !== 'ADMIN') {
        return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    try {
        const { id } = await params
        const body = await request.json()
        const result = officeSchema.partial().safeParse(body)

        if (!result.success) {
            return NextResponse.json({
                error: 'Validation failed',
                issues: result.error.issues
            }, { status: 400 })
        }

        const office = await db.office.update({
            where: { id },
            data: result.data
        })

        return NextResponse.json(office)
    } catch (error) {
        return NextResponse.json({ error: 'Failed to update office' }, { status: 500 })
    }
}

export async function DELETE(request: Request, { params }: { params: Promise<{ id: string }> }) {
    const session = await getSession()
    if (!session || session.user.role !== 'ADMIN') {
        return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    try {
        const { id } = await params

        // Check if office has cars
        const carCount = await db.car.count({
            where: { officeId: id }
        })

        if (carCount > 0) {
            return NextResponse.json({
                error: 'Cannot delete office with registered cars. Move or delete cars first.'
            }, { status: 400 })
        }

        await db.office.delete({
            where: { id }
        })

        return NextResponse.json({ success: true })
    } catch (error) {
        return NextResponse.json({ error: 'Failed to delete office' }, { status: 500 })
    }
}
