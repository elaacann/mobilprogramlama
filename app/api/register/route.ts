import { NextResponse } from 'next/server'
import db from '@/lib/db'
import { hashPassword } from '@/lib/password'
import { login } from '@/lib/auth'
import { z } from 'zod'

const registerSchema = z.object({
    email: z.string().email(),
    password: z.string().min(6, 'Password must be at least 6 characters'),
    name: z.string().min(2, 'Name is required'),
})

export async function POST(request: Request) {
    try {
        const body = await request.json()
        const result = registerSchema.safeParse(body)

        if (!result.success) {
            return NextResponse.json({ error: result.error.issues[0].message }, { status: 400 })
        }

        const { email, password, name } = result.data

        const existingUser = await db.user.findUnique({
            where: { email },
        })

        if (existingUser) {
            return NextResponse.json({ error: 'User already exists' }, { status: 400 })
        }

        const hashedPassword = await hashPassword(password)

        const user = await db.user.create({
            data: {
                email,
                password: hashedPassword,
                name,
                role: 'USER',
            },
        })

        const { password: _, ...userWithoutPassword } = user
        await login(userWithoutPassword)

        return NextResponse.json({ success: true, user: userWithoutPassword })
    } catch (error) {
        return NextResponse.json({ error: 'Something went wrong' }, { status: 500 })
    }
}
