import db from '@/lib/db'
import { getSession } from '@/lib/auth'
import { redirect } from 'next/navigation'
import ProfileView from '@/components/profile/ProfileView'

export default async function ProfilePage() {
    const session = await getSession()
    if (!session || !session.user) redirect('/login')

    const [user, reservations, favorites] = await Promise.all([
        db.user.findUnique({ where: { id: session.user.id } }),
        db.reservation.findMany({
            where: { userId: session.user.id },
            include: {
                car: { include: { office: true } }
            },
            orderBy: { startDate: 'desc' }
        }),
        db.favorite.findMany({
            where: { userId: session.user.id },
            include: {
                car: { include: { office: true } }
            }
        })
    ])

    if (!user) redirect('/login')

    const now = new Date()
    const active: any[] = []
    const upcoming: any[] = []
    const past: any[] = []

    reservations.forEach((res: any) => {
        const start = new Date(res.startDate)
        const end = new Date(res.endDate)

        if (res.status === 'COMPLETED' || res.status === 'CANCELLED' || end < now) {
            past.push(res)
        } else if (start > now) {
            upcoming.push(res)
        } else {
            active.push(res)
        }
    })

    const safeReservations = JSON.parse(JSON.stringify({ active, upcoming, past }))
    const safeFavorites = JSON.parse(JSON.stringify(favorites.map(f => f.car)))

    return (
        <div className="max-w-6xl mx-auto">
            <ProfileView
                user={{ name: user.name, email: user.email }}
                reservations={safeReservations}
                favorites={safeFavorites}
            />
        </div>
    )
}
