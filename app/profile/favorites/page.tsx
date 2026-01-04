import db from '@/lib/db'
import { getSession } from '@/lib/auth'
import { redirect } from 'next/navigation'
import CarCard from '@/components/CarCard'
import { Heart, Sparkles } from 'lucide-react'

export const dynamic = 'force-dynamic'

export default async function FavoritesPage() {
    const session = await getSession()
    if (!session) redirect('/login')

    const favorites = await db.favorite.findMany({
        where: { userId: session.user.id },
        include: {
            car: {
                include: { office: true }
            }
        }
    })

    const favoriteCars = favorites.map(f => f.car)

    return (
        <div className="space-y-12 pb-24 animate-fade-in-up">
            <div>
                <h1 className="text-5xl font-black text-foreground mb-4 tracking-tight flex items-center gap-4">
                    <Heart className="w-10 h-10 text-rose-500 fill-current" />
                    Favorilerim
                </h1>
                <p className="text-gray-500 dark:text-gray-400 font-bold text-lg ml-14">Keşfettiğiniz ve beğendiğiniz tüm araçlar burada.</p>
            </div>

            {favoriteCars.length === 0 ? (
                <div className="text-center py-32 bg-surface dark:bg-surface/30 rounded-[3rem] border-4 border-dashed border-border-subtle">
                    <div className="w-24 h-24 bg-gray-100 dark:bg-gray-800 rounded-full flex items-center justify-center mx-auto mb-6">
                        <Sparkles className="w-10 h-10 text-gray-400" />
                    </div>
                    <p className="text-foreground text-2xl font-black">Henüz favori aracınız yok.</p>
                    <p className="text-gray-500 dark:text-gray-400 text-lg mt-3 font-medium">Filoyu keşfedin ve beğendiklerinizi kalp ikonuna basarak buraya ekleyin.</p>
                </div>
            ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-10">
                    {favoriteCars.map((car: any) => (
                        <CarCard key={car.id} car={car} isFavoriteInitial={true} />
                    ))}
                </div>
            )}
        </div>
    )
}
