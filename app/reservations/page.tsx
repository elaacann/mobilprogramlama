
import db from '@/lib/db'
import { getSession } from '@/lib/auth'
import { redirect } from 'next/navigation'
import Link from 'next/link'
import ReservationList from '@/components/profile/ReservationList'
import { Calendar, LayoutDashboard } from 'lucide-react'

export const dynamic = "force-dynamic";

export default async function ReservationsPage() {
    const session = await getSession()
    if (!session || !session.user) redirect('/login')

    const reservations = await db.reservation.findMany({
        where: { userId: session.user.id },
        include: {
            car: {
                include: {
                    office: true
                }
            }
        },
        orderBy: { createdAt: 'desc' }
    })

    // Map to match ReservationList expectation
    const safeReservations = JSON.parse(JSON.stringify(reservations)).map((res: any) => ({
        ...res,
        // ReservationList expects 'car' with make, model, imageUrl, office.name
        // Our include covers this.
    }));

    return (
        <div className="max-w-5xl mx-auto space-y-8 animate-fade-in-up">
            <div className="flex items-center gap-4 mb-4">
                <div className="w-12 h-12 rounded-2xl bg-indigo-500/10 flex items-center justify-center">
                    <LayoutDashboard className="w-6 h-6 text-indigo-600" />
                </div>
                <div>
                    <h1 className="text-3xl font-black text-foreground tracking-tight">Rezervasyonlarım</h1>
                    <p className="text-sm text-gray-500 font-medium">Tüm seyahatleriniz tek bir yerde.</p>
                </div>
            </div>

            {safeReservations.length === 0 ? (
                <div className="text-center py-20 bg-background/50 dark:bg-background/20 rounded-[2rem] border-2 border-dashed border-border-subtle animate-fade-in-up">
                    <div className="w-16 h-16 bg-surface-hover rounded-full flex items-center justify-center mx-auto mb-6">
                        <Calendar className="w-8 h-8 text-gray-400" />
                    </div>
                    <h3 className="text-foreground text-xl font-black mb-2">Henüz rezervasyonunuz yok</h3>
                    <p className="text-gray-500 mb-6">İlk yolculuğunuzu planlamaya başlayın.</p>
                    <Link href="/dashboard" className="px-8 py-3 bg-blue-600 text-white rounded-xl font-bold hover:bg-blue-700 transition-all shadow-lg shadow-blue-500/20">
                        Araçları Keşfet
                    </Link>
                </div>
            ) : (
                <ReservationList reservations={safeReservations} type="active" />
            )}
        </div>
    )
}
