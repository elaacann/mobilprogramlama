import db from '@/lib/db'
import ReservationForm from '@/components/ReservationForm'
import ReviewSection from '@/components/ReviewSection'
import FavoriteButton from '@/components/FavoriteButton'
import { getSession } from '@/lib/auth'
import { notFound } from 'next/navigation'
import { Fuel, MapPin, Calendar, ShieldCheck, Cog, Sparkles } from 'lucide-react'

export default async function CarDetailPage({ params }: { params: Promise<{ id: string }> }) {
    const { id } = await params
    const session = await getSession()
    const car = await db.car.findUnique({
        where: { id },
        include: { office: true }
    })

    if (!car) notFound()

    const isFavorite = session ? await db.favorite.findUnique({
        where: {
            userId_carId: {
                userId: session.user.id,
                carId: id
            }
        }
    }) : false

    return (
        <div className="space-y-12 animate-fade-in-up">
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-10 lg:gap-12">
                <div className="lg:col-span-2 space-y-10">
                    {/* Main Image Card */}
                    <div className="bg-surface rounded-[3rem] shadow-2xl shadow-black/5 border border-border-subtle overflow-hidden group">
                        <div className="relative h-[500px]">
                            <img
                                src={car.imageUrl}
                                alt={car.make}
                                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-1000"
                            />
                            <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />

                            <div className="absolute top-8 left-8 z-20">
                                <FavoriteButton carId={car.id} initialIsFavorite={!!isFavorite} />
                            </div>

                            <div className="absolute bottom-8 left-10 text-white">
                                <div className="flex items-center gap-3 mb-4">
                                    <span className={`px-4 py-1.5 rounded-full text-xs font-black uppercase tracking-widest backdrop-blur-md border border-white/20 ${car.available ? 'bg-emerald-500/40 text-emerald-100' : 'bg-rose-500/40 text-rose-100'}`}>
                                        {car.available ? 'Müsait' : 'Müsait Değil'}
                                    </span>
                                    <span className="px-4 py-1.5 rounded-full text-xs font-black uppercase tracking-widest bg-blue-500/40 text-blue-100 backdrop-blur-md border border-white/20">
                                        Premium
                                    </span>
                                </div>
                                <h1 className="text-5xl font-black tracking-tighter drop-shadow-lg uppercase leading-none">{car.make} {car.model}</h1>
                            </div>
                        </div>
                    </div>

                    {/* Specs Grid */}
                    <div className="bg-surface rounded-[3rem] shadow-xl shadow-black/5 border border-border-subtle p-10 md:p-12">
                        <div className="flex items-center gap-4 mb-10">
                            <div className="w-12 h-12 rounded-2xl bg-blue-500/10 flex items-center justify-center">
                                <Sparkles className="w-6 h-6 text-blue-600" />
                            </div>
                            <h2 className="text-3xl font-black text-foreground tracking-tight">Araç Özellikleri</h2>
                        </div>

                        <div className="grid grid-cols-2 md:grid-cols-4 gap-6 mb-12">
                            {[
                                { icon: Fuel, label: 'Yakıt', val: car.fuelType === 'Petrol' ? 'Benzin' : car.fuelType === 'Diesel' ? 'Dizel' : car.fuelType === 'Electric' ? 'Elektrik' : car.fuelType === 'Hybrid' ? 'Hibrit' : car.fuelType, color: 'text-blue-500', bg: 'bg-blue-500/5' },
                                { icon: Cog, label: 'Vites', val: car.transmission === 'Automatic' ? 'Otomatik' : car.transmission === 'Manual' ? 'Manuel' : car.transmission, color: 'text-indigo-500', bg: 'bg-indigo-500/5' },
                                { icon: Calendar, label: 'Yıl', val: car.year, color: 'text-amber-500', bg: 'bg-amber-500/5' },
                                { icon: ShieldCheck, label: 'Güvenlik', val: 'ABS / Hava Yastığı', color: 'text-emerald-500', bg: 'bg-emerald-500/5' }
                            ].map((spec, i) => (
                                <div key={i} className={`p-6 ${spec.bg} rounded-[2rem] border border-border-subtle group hover:scale-105 transition-transform duration-300`}>
                                    <spec.icon className={`w-6 h-6 ${spec.color} mb-4`} />
                                    <span className="text-[10px] font-black text-gray-400 uppercase tracking-widest block mb-1">{spec.label}</span>
                                    <p className="font-black text-foreground text-lg leading-tight">{spec.val}</p>
                                </div>
                            ))}
                        </div>

                        <div className="space-y-6">
                            <h3 className="text-2xl font-black text-foreground tracking-tight border-b border-border-subtle pb-4">Detaylı Açıklama</h3>
                            <p className="text-gray-500 dark:text-gray-400 font-medium leading-relaxed text-lg italic">"{car.description}"</p>
                        </div>

                        <div className="mt-12 flex flex-col md:flex-row md:items-center gap-8 p-8 rounded-[2rem] bg-background/50 border border-border-subtle">
                            <div className="flex-1 space-y-2">
                                <div className="flex items-center gap-3">
                                    <div className="w-10 h-10 rounded-xl bg-rose-500/10 flex items-center justify-center">
                                        <MapPin className="w-5 h-5 text-rose-500" />
                                    </div>
                                    <span className="font-black text-foreground text-lg">Alış Lokasyonu</span>
                                </div>
                                <p className="text-gray-500 dark:text-gray-400 font-bold ml-13">{car.office.name}</p>
                                <p className="text-sm text-gray-400 font-medium ml-13 uppercase tracking-wider">{car.office.address}</p>
                            </div>
                        </div>
                    </div>
                </div>

                <div className="lg:col-span-1">
                    <div className="sticky top-28">
                        <ReservationForm carId={car.id} pricePerDay={car.pricePerDay} />
                    </div>
                </div>
            </div>

            {/* Reviews Section */}
            <div className="max-w-4xl">
                <ReviewSection carId={car.id} />
            </div>
        </div>
    )
}
