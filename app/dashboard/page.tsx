import db from '@/lib/db'
import CarCard from '@/components/CarCard'
import CarFilter from '@/components/CarFilter'
import { ArrowRight, Sparkles } from 'lucide-react'

export const dynamic = 'force-dynamic'

interface DashboardPageProps {
    searchParams: Promise<{
        search?: string
        office?: string
        fuel?: string
        transmission?: string
        category?: string
    }>
}

export default async function DashboardPage({ searchParams }: DashboardPageProps) {
    const filters = await searchParams

    const offices = await db.office.findMany({
        orderBy: { name: 'asc' }
    })

    const categories = await db.category.findMany({
        orderBy: { name: 'asc' }
    })

    const cars = await db.car.findMany({
        include: {
            office: true,
            reviews: true,
            category: true
        },
        where: {
            available: true,
            AND: [
                filters.search ? {
                    OR: [
                        { make: { contains: filters.search } },
                        { model: { contains: filters.search } },
                    ]
                } : {},
                filters.office ? { officeId: filters.office } : {},
                filters.fuel ? { fuelType: filters.fuel } : {},
                filters.transmission ? { transmission: filters.transmission } : {},
                filters.category ? { categoryId: filters.category } : {},
            ]
        }
    })

    return (
        <div className="space-y-16 pb-24">
            {/* Hero Section */}
            <div className="relative rounded-[3rem] overflow-hidden bg-black text-white min-h-[500px] flex items-center shadow-2xl shadow-blue-500/10 border border-white/5 group">
                <div className="absolute inset-0">
                    <img
                        src="https://images.unsplash.com/photo-1485291571150-772bcfc10da5?auto=format&fit=crop&q=80&w=2000"
                        alt="Hero"
                        className="w-full h-full object-cover opacity-50 group-hover:scale-105 transition-transform duration-1000"
                    />
                    <div className="absolute inset-0 bg-gradient-to-r from-black via-black/60 to-transparent" />
                </div>
                <div className="relative z-10 p-12 lg:p-20 max-w-3xl animate-fade-in-up">
                    <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-blue-500/10 border border-blue-500/20 text-blue-400 text-sm font-bold mb-8 backdrop-blur-md">
                        <Sparkles className="w-4 h-4" />
                        <span>Premium Araç Deneyimi</span>
                    </div>
                    <h1 className="text-6xl md:text-7xl font-black mb-8 leading-[1.1] tracking-tighter">
                        <span className="bg-clip-text text-transparent bg-gradient-to-r from-blue-400 to-indigo-400">Mükemmel</span> <br />Sürüşünüzü Bulun.
                    </h1>
                    <p className="text-xl text-gray-400 mb-10 max-w-lg leading-relaxed font-medium">
                        Bir sonraki maceranız için premium araç filomuzdan seçim yapın.
                        Lüks, konfor ve performans parmaklarınızın ucunda.
                    </p>
                    <div className="flex flex-wrap gap-4">
                        <button className="bg-blue-600 text-white px-10 py-5 rounded-[2rem] font-black text-lg flex items-center gap-3 hover:bg-blue-700 transition-all active:scale-95 shadow-[0_0_40px_rgba(37,99,235,0.4)]">
                            Filoyu Keşfet <ArrowRight className="w-6 h-6" />
                        </button>
                    </div>
                </div>
            </div>

            <CarFilter offices={offices} categories={categories} />

            <div className="px-2">
                <div className="flex flex-col md:flex-row md:items-end justify-between mb-10 gap-4">
                    <div>
                        <h2 className="text-4xl font-black text-foreground flex items-center gap-4 tracking-tight">
                            <span className="w-3 h-10 bg-gradient-to-b from-blue-500 to-indigo-600 rounded-full shadow-lg shadow-blue-500/20" />
                            {cars.length === 0 ? 'Sonuç Bulunamadı' : 'Müsait Araçlar'}
                        </h2>
                        <p className="text-gray-500 dark:text-gray-400 font-bold mt-2 ml-7"> Premium kategorideki en iyileri keşfedin.</p>
                    </div>
                    <div className="px-6 py-2 bg-surface dark:bg-surface/50 border border-border-subtle rounded-2xl shadow-sm text-sm font-black text-blue-500">
                        {cars.length} Araç Listeleniyor
                    </div>
                </div>

                {cars.length === 0 ? (
                    <div className="text-center py-32 bg-surface dark:bg-surface/30 rounded-[3rem] border-4 border-dashed border-border-subtle animate-fade-in-up">
                        <div className="w-24 h-24 bg-gray-100 dark:bg-gray-800 rounded-full flex items-center justify-center mx-auto mb-6">
                            <Sparkles className="w-10 h-10 text-gray-400" />
                        </div>
                        <p className="text-foreground text-2xl font-black">Filtrelerinize uygun araç bulunamadı.</p>
                        <p className="text-gray-500 dark:text-gray-400 text-lg mt-3 font-medium">Aramanızı ayarlamayı veya filtreleri temizlemeyi deneyin.</p>
                    </div>
                ) : (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-10">
                        {cars.map((car: any) => (
                            <CarCard key={car.id} car={car} />
                        ))}
                    </div>
                )}
            </div>
        </div>
    )
}
