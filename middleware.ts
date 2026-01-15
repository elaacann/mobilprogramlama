import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'
import { decrypt } from '@/lib/auth'

export async function middleware(request: NextRequest) {
    const sessionCookie = request.cookies.get('session')?.value
    let user = null

    if (sessionCookie) {
        try {
            const payload = await decrypt(sessionCookie)
            user = payload.user
        } catch (e) {
            // invalid session
        }
    }

    const { pathname } = request.nextUrl

    // Protect Admin Routes
    if (pathname.startsWith('/admin')) {
        if (!user || user.role !== 'ADMIN') {
            return NextResponse.redirect(new URL('/login', request.url))
        }
    }

    // Protect User Routes (that require login)
    const protectedUserRoutes = ['/reservations', '/profile', '/dashboard']
    // Actually dashboard can be public? Maybe not.
    if (protectedUserRoutes.some(route => pathname.startsWith(route))) {
        if (!user) {
            return NextResponse.redirect(new URL('/login', request.url))
        }
    }

    // If logged in and trying to go to login/register, redirect to dashboard or admin
    if ((pathname === '/login' || pathname === '/register') && user) {
        if (user.role === 'ADMIN') {
            return NextResponse.redirect(new URL('/admin/dashboard', request.url))
        } else {
            return NextResponse.redirect(new URL('/dashboard', request.url))
        }
    }

    return NextResponse.next()
}

export const config = {
    matcher: ['/((?!api|_next/static|_next/image|favicon.ico).*)'],
}
