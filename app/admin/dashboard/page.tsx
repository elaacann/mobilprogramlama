import db from '@/lib/db'
import Link from 'next/link'
import { QrCode, Car, DollarSign, TrendingUp, Clock, AlertCircle, ArrowRight, Sparkles, Building2, CalendarCheck, Star, MessageSquare } from 'lucide-react'
import { format } from 'date-fns'

export const dynamic = 'force-dynamic'

export default async function AdminDashboard() {
    // Fetch data in parallel for performance
    const [
        totalCars,
        totalRevenue,
        activeReservations,
        pendingReservations,
        recentActivity,
        fleetStatus,
        recentReviews,
        topRatedCars,
        officeRevenue
    ] = await Promise.all([
        db.car.count(),
        db.reservation.aggregate({
            _sum: { totalAmount: true },
            where: { status: { in: ['CONFIRMED', 'COMPLETED'] } }
        }),
        db.reservation.count({ where: { status: 'CONFIRMED' } }),
        db.reservation.count({ where: { status: 'PENDING' } }),
        db.reservation.findMany({
            take: 5,
            orderBy: { createdAt: 'desc' },
            include: { user: true, car: true }
        }),
        db.car.groupBy({
            by: ['available'],
            _count: true
        }),
        db.review.findMany({
            take: 3,
            orderBy: { createdAt: 'desc' },
            include: { user: true, car: true }
        }),
        db.car.findMany({
            take: 3,
            include: { reviews: true },
        }),
        db.office.findMany({
            include: {
                cars: {
                    include: {
                        reservations: {
                            where: { status: { in: ['CONFIRMED', 'COMPLETED'] } }
                        }
                    }
                }
            }
        })
    ])

    const availableCars = fleetStatus.find((s: any) => s.available)?._count ?? 0
    const rentedCars = fleetStatus.find((s: any) => !s.available)?._count ?? 0

    // Calculate performance for top cars
    const sortedTopCars = topRatedCars
        .map((car: any) => ({
            ...car,
            avgRating: car.reviews.length > 0 ? car.reviews.reduce((acc: number, r: any) => acc + r.rating, 0) / car.reviews.length : 0
        }))
        .sort((a, b) => b.avgRating - a.avgRating)

    return (
        <div className="max-w-7xl mx-auto pb-20 animate-fade-in-up">
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-12 gap-6">
                <div>
                    <h1 className="text-4xl md:text-5xl font-black text-foreground mb-3 tracking-tight">Panel Özeti</h1>
                    <p className="text-gray-500 dark:text-gray-400 font-medium text-lg flex items-center gap-2">
                        <Sparkles className="w-5 h-5 text-blue-500" />
                        Hoş geldiniz, Yönetici. İşte bugünün özeti.
                    </p>
                </div>
                <div className="px-6 py-2 bg-surface dark:bg-surface/50 border border-border-subtle rounded-2xl shadow-sm text-sm font-black text-blue-500">
                    {format(new Date(), 'dd MMMM yyyy')}
                </div>
            </div>

            {/* Metrics Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 mb-16">
                {/* Revenue Card */}
                <div className="bg-gradient-to-br from-blue-600 to-indigo-700 rounded-[2rem] p-8 text-white shadow-2xl shadow-blue-500/20 relative overflow-hidden group border border-white/10">
                    <div className="relative z-10">
                        <div className="flex items-center justify-between mb-6">
                            <div className="p-3 bg-white/20 rounded-2xl backdrop-blur-md border border-white/20">
                                <DollarSign className="w-7 h-7 text-white" />
                            </div>
                            <span className="text-white/80 text-xs font-black bg-white/10 px-3 py-1 rounded-full uppercase tracking-widest border border-white/10">+12%</span>
                        </div>
                        <p className="text-blue-100 font-bold mb-1 uppercase tracking-widest text-[10px]">Toplam Gelir</p>
                        <h3 className="text-4xl font-black tracking-tighter">{totalRevenue._sum.totalAmount?.toLocaleString() ?? 0} <span className="text-xl font-bold">₺</span></h3>
                    </div>
                    <div className="absolute -right-8 -bottom-8 opacity-10 group-hover:scale-125 transition-transform duration-700">
                        <DollarSign className="w-48 h-48" />
                    </div>
                </div>

                {/* Fleet Status Card */}
                <Link href="/admin/cars" className="bg-surface rounded-[2rem] p-8 border border-border-subtle shadow-xl shadow-black/5 relative overflow-hidden group hover:border-blue-500/30 transition-all">
                    <div className="items-center justify-between mb-6 flex">
                        <div className="p-3 bg-purple-500/10 rounded-2xl border border-purple-500/20">
                            <Car className="w-7 h-7 text-purple-600 dark:text-purple-400" />
                        </div>
                        <div className="flex gap-2 text-[10px] font-black uppercase tracking-wider">
                            <span className="text-emerald-600 bg-emerald-500/10 px-3 py-1.5 rounded-xl border border-emerald-500/20">{availableCars} Müsait</span>
                            <span className="text-amber-600 bg-amber-500/10 px-3 py-1.5 rounded-xl border border-amber-500/20">{rentedCars} Kirada</span>
                        </div>
                    </div>
                    <p className="text-gray-500 font-bold mb-1 uppercase tracking-widest text-[10px]">Toplam Filo</p>
                    <h3 className="text-4xl font-black text-foreground tracking-tighter">{totalCars}</h3>
                </Link>

                {/* Active Bookings Card */}
                <Link href="/admin/reservations?status=CONFIRMED" className="bg-surface rounded-[2rem] p-8 border border-border-subtle shadow-xl shadow-black/5 relative overflow-hidden group hover:border-emerald-500/30 transition-all">
                    <div className="flex items-center justify-between mb-6">
                        <div className="p-3 bg-emerald-500/10 rounded-2xl border border-emerald-500/20">
                            <CalendarCheck className="w-7 h-7 text-emerald-600 dark:text-emerald-400" />
                        </div>
                    </div>
                    <p className="text-gray-500 font-bold mb-1 uppercase tracking-widest text-[10px]">Aktif Rezervasyonlar</p>
                    <h3 className="text-4xl font-black text-foreground tracking-tighter">{activeReservations}</h3>
                </Link>

                {/* Pending Requests Card */}
                <Link href="/admin/reservations?status=PENDING" className="bg-surface rounded-[2rem] p-8 border border-border-subtle shadow-xl shadow-black/5 relative overflow-hidden group hover:border-amber-500/30 transition-all">
                    <div className="flex items-center justify-between mb-6">
                        <div className="p-3 bg-amber-500/10 rounded-2xl border border-amber-500/20">
                            <AlertCircle className="w-7 h-7 text-amber-600 dark:text-amber-400" />
                        </div>
                        {pendingReservations > 0 && (
                            <span className="flex h-3 w-3 rounded-full bg-amber-500 animate-ping"></span>
                        )}
                    </div>
                    <p className="text-gray-500 font-bold mb-1 uppercase tracking-widest text-[10px]">Bekleyen Talepler</p>
                    <h3 className="text-4xl font-black text-foreground tracking-tighter">{pendingReservations}</h3>
                </Link>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">
                {/* Charts and Feed */}
                <div className="lg:col-span-2 space-y-10">
                    {/* Office Revenue Performance */}
                    <div className="bg-surface rounded-[2.5rem] border border-border-subtle shadow-2xl shadow-black/5 overflow-hidden">
                        <div className="p-8 border-b border-border-subtle flex justify-between items-center bg-surface-hover/30">
                            <div className="flex items-center gap-3">
                                <div className="w-10 h-10 rounded-2xl bg-emerald-500/10 flex items-center justify-center">
                                    <Building2 className="w-5 h-5 text-emerald-600" />
                                </div>
                                <h3 className="font-black text-xl text-foreground tracking-tight">Lokasyon Bazlı Performans</h3>
                            </div>
                        </div>
                        <div className="p-8 space-y-6">
                            {officeRevenue.map((office: any) => {
                                const revenue = office.cars.reduce((acc: number, car: any) =>
                                    acc + car.reservations.reduce((sum: number, res: any) => sum + res.totalAmount, 0), 0)
                                const maxRev = 50000 // Mock max for scale
                                const percentage = Math.min((revenue / maxRev) * 100, 100)

                                return (
                                    <div key={office.id} className="space-y-3">
                                        <div className="flex justify-between items-end">
                                            <div>
                                                <p className="font-black text-foreground">{office.name}</p>
                                                <p className="text-xs text-gray-500 font-bold">{office.cars.length} Araç</p>
                                            </div>
                                            <p className="font-black text-blue-600">{revenue.toLocaleString()} ₺</p>
                                        </div>
                                        <div className="h-3 w-full bg-gray-100 dark:bg-gray-800 rounded-full overflow-hidden">
                                            <div
                                                className="h-full bg-gradient-to-r from-emerald-500 to-blue-500 transition-all duration-1000"
                                                style={{ width: `${percentage}%` }}
                                            />
                                        </div>
                                    </div>
                                )
                            })}
                        </div>
                    </div>

                    {/* Recent Activity Feed */}
                    <div className="bg-surface rounded-[2.5rem] border border-border-subtle shadow-2xl shadow-black/5 overflow-hidden">
                        <div className="p-8 border-b border-border-subtle flex justify-between items-center">
                            <div className="flex items-center gap-3">
                                <div className="w-10 h-10 rounded-2xl bg-indigo-500/10 flex items-center justify-center">
                                    <Clock className="w-5 h-5 text-indigo-600" />
                                </div>
                                <h3 className="font-black text-xl text-foreground tracking-tight">Son İşlemler</h3>
                            </div>
                            <Link href="/admin/reservations" className="text-sm text-blue-600 font-black hover:text-blue-700 flex items-center gap-2 group underline-offset-4 hover:underline">
                                Hepsini Gör <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                            </Link>
                        </div>
                        <div className="divide-y divide-border-subtle">
                            {recentActivity.length === 0 ? (
                                <div className="p-12 text-center text-gray-500 font-bold">Son işlem bulunamadı.</div>
                            ) : (
                                recentActivity.map((res: any) => (
                                    <div key={res.id} className="p-8 flex items-center justify-between hover:bg-surface-hover/50 transition-all duration-300">
                                        <div className="flex items-center gap-6">
                                            <div className={`w-14 h-14 rounded-2xl flex items-center justify-center font-black text-lg text-white shadow-lg
                                                ${res.status === 'PENDING' ? 'bg-amber-400 shadow-amber-400/20' :
                                                    res.status === 'CONFIRMED' ? 'bg-emerald-500 shadow-emerald-500/20' :
                                                        res.status === 'COMPLETED' ? 'bg-blue-500 shadow-blue-500/20' : 'bg-red-400 shadow-red-400/20'}`}>
                                                {res.user.name.charAt(0)}
                                            </div>
                                            <div>
                                                <p className="font-black text-foreground text-lg tracking-tight mb-1">{res.user.name}</p>
                                                <p className="text-sm text-gray-500 font-bold uppercase tracking-wider">{res.car.make} {res.car.model} rezerve etti</p>
                                            </div>
                                        </div>
                                        <div className="text-right">
                                            <p className="font-black text-foreground text-xl tracking-tighter mb-1">{res.totalAmount} ₺</p>
                                            <p className="text-[10px] font-black text-gray-400 flex items-center gap-2 justify-end uppercase tracking-widest">
                                                <Clock className="w-3.5 h-3.5" />
                                                {format(new Date(res.createdAt), 'dd MMM, HH:mm')}
                                            </p>
                                        </div>
                                    </div>
                                ))
                            )}
                        </div>
                    </div>
                </div>

                {/* Quick Actions & Top Rated */}
                <div className="space-y-8">
                    {/* Top Rated Cars */}
                    <div className="bg-surface rounded-[2.5rem] border border-border-subtle shadow-xl p-8">
                        <div className="flex items-center gap-3 mb-8">
                            <div className="w-8 h-8 rounded-xl bg-amber-500/10 flex items-center justify-center">
                                <Star className="w-4 h-4 text-amber-600 fill-current" />
                            </div>
                            <h3 className="font-black text-lg text-foreground tracking-tight">En Çok Beğenilenler</h3>
                        </div>
                        <div className="space-y-6">
                            {sortedTopCars.map((car: any) => (
                                <div key={car.id} className="flex items-center gap-4">
                                    <img src={car.imageUrl} className="w-16 h-16 rounded-2xl object-cover shadow-lg" alt="" />
                                    <div className="flex-1">
                                        <p className="font-black text-sm text-foreground">{car.make} {car.model}</p>
                                        <div className="flex items-center gap-1 mt-1">
                                            <Star className="w-3 h-3 text-amber-500 fill-current" />
                                            <span className="text-xs font-black text-amber-600">{car.avgRating.toFixed(1)}</span>
                                            <span className="text-[10px] text-gray-400 font-bold">({car.reviews.length} yorum)</span>
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* Recent Reviews Feed */}
                    <div className="bg-surface rounded-[2.5rem] border border-border-subtle shadow-xl p-8">
                        <div className="flex items-center gap-3 mb-8">
                            <div className="w-8 h-8 rounded-xl bg-blue-500/10 flex items-center justify-center">
                                <MessageSquare className="w-4 h-4 text-blue-600" />
                            </div>
                            <h3 className="font-black text-lg text-foreground tracking-tight">Yeni Yorumlar</h3>
                        </div>
                        <div className="space-y-6">
                            {recentReviews.map((review: any) => (
                                <div key={review.id} className="space-y-2">
                                    <div className="flex justify-between items-start">
                                        <p className="text-xs font-black text-foreground">{review.user.name}</p>
                                        <div className="flex items-center gap-0.5">
                                            {[...Array(5)].map((_, i) => (
                                                <Star key={i} className={`w-2.5 h-2.5 ${i < review.rating ? 'text-amber-500 fill-current' : 'text-gray-200'}`} />
                                            ))}
                                        </div>
                                    </div>
                                    <p className="text-xs text-gray-500 font-medium italic line-clamp-2">"{review.comment}"</p>
                                    <p className="text-[9px] font-black text-blue-500 uppercase tracking-widest">{review.car.make} {review.car.model}</p>
                                </div>
                            ))}
                        </div>
                    </div>

                    <Link href="/admin/scan" className="block group">
                        <div className="bg-foreground text-background rounded-[2.5rem] p-10 relative overflow-hidden shadow-2xl active:scale-95 transition-all">
                            <div className="relative z-10">
                                <div className="p-4 bg-white/10 rounded-2xl w-fit mb-6 backdrop-blur-md border border-white/10 group-hover:bg-blue-600/20 transition-colors">
                                    <QrCode className="w-8 h-8 text-background group-hover:text-blue-400 transition-colors" />
                                </div>
                                <h3 className="text-2xl font-black mb-3 tracking-tight">QR Tarayıcı</h3>
                                <div className="bg-background text-foreground py-4 rounded-2xl font-black text-sm text-center group-hover:bg-blue-600 group-hover:text-white transition-all shadow-xl">
                                    Tarayıcıyı Aç
                                </div>
                            </div>
                            <QrCode className="absolute -right-6 -bottom-6 w-40 h-40 text-background opacity-5" />
                        </div>
                    </Link>
                </div>
            </div>
        </div>
    )
}
