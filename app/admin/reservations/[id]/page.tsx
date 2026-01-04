import db from '@/lib/db'
import { getSession } from '@/lib/auth'
import { notFound, redirect } from 'next/navigation'
import { format } from 'date-fns'
import AdminActionButtons from '@/components/AdminActionButtons'
import Link from 'next/link'
import { ArrowLeft, User, Car, Calendar, CreditCard, ShieldCheck } from 'lucide-react'

export default async function AdminReservationDetail({ params }: { params: Promise<{ id: string }> }) {
    const session = await getSession()
    if (!session || session.user.role !== 'ADMIN') redirect('/login')

    const { id } = await params
    const reservation = await db.reservation.findUnique({
        where: { id },
        include: { car: true, user: true }
    })

    if (!reservation) notFound()

    return (
        <div className="max-w-4xl mx-auto px-4 pb-20 animate-fade-in-up">
            <Link href="/admin/reservations" className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-surface border border-border-subtle text-gray-500 hover:text-foreground mb-8 transition-all font-bold text-sm shadow-sm group">
                <ArrowLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" />
                Rezervasyonlara Dön
            </Link>

            <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-10 gap-6">
                <div>
                    <h1 className="text-4xl font-black text-foreground mb-2 tracking-tight">Rezervasyon Detayı</h1>
                    <p className="text-gray-400 font-bold uppercase tracking-widest text-[10px]">İşlem ID: #{reservation.id}</p>
                </div>
                <div className={`px-6 py-2 rounded-2xl text-[10px] font-black uppercase tracking-[0.2em] border shadow-sm
                    ${reservation.status === 'CONFIRMED' ? 'bg-emerald-500/10 text-emerald-600 border-emerald-500/20' :
                        reservation.status === 'PENDING' ? 'bg-amber-500/10 text-amber-600 border-amber-500/20' :
                            reservation.status === 'COMPLETED' ? 'bg-blue-500/10 text-blue-600 border-blue-500/20' :
                                'bg-rose-500/10 text-rose-600 border-rose-500/20'}`}>
                    {reservation.status === 'PENDING' ? 'BEKLEYEN' :
                        reservation.status === 'CONFIRMED' ? 'ONAYLANDI' :
                            reservation.status === 'COMPLETED' ? 'TAMAMLANDI' :
                                reservation.status === 'CANCELLED' ? 'İPTAL EDİLDİ' : reservation.status}
                </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-10">
                <div className="lg:col-span-2 space-y-8">
                    {/* User Info */}
                    <div className="bg-surface rounded-[2.5rem] border border-border-subtle p-10 shadow-xl shadow-black/5 relative overflow-hidden">
                        <div className="absolute top-0 right-0 p-10 opacity-5 pointer-events-none">
                            <User className="w-32 h-32" />
                        </div>
                        <div className="flex items-center gap-4 mb-8">
                            <div className="w-12 h-12 rounded-2xl bg-blue-500/10 flex items-center justify-center">
                                <User className="w-6 h-6 text-blue-600" />
                            </div>
                            <h3 className="text-2xl font-black text-foreground tracking-tight">Müşteri Bilgileri</h3>
                        </div>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                            <div>
                                <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-1">Ad Soyad</p>
                                <p className="text-xl font-black text-foreground">{reservation.user.name}</p>
                            </div>
                            <div>
                                <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-1">E-posta</p>
                                <p className="text-lg font-bold text-gray-500">{reservation.user.email}</p>
                            </div>
                        </div>
                    </div>

                    {/* Car Info */}
                    <div className="bg-surface rounded-[2.5rem] border border-border-subtle p-10 shadow-xl shadow-black/5 relative overflow-hidden group">
                        <div className="absolute top-0 right-0 p-10 opacity-5 pointer-events-none">
                            <Car className="w-32 h-32" />
                        </div>
                        <div className="flex items-center gap-4 mb-8">
                            <div className="w-12 h-12 rounded-2xl bg-indigo-500/10 flex items-center justify-center">
                                <Car className="w-6 h-6 text-indigo-600" />
                            </div>
                            <h3 className="text-2xl font-black text-foreground tracking-tight">Araç Detayları</h3>
                        </div>
                        <div className="flex flex-col md:flex-row gap-8 items-center">
                            <div className="w-full md:w-48 h-32 rounded-3xl overflow-hidden shadow-lg border border-border-subtle flex-shrink-0">
                                <img src={reservation.car.imageUrl} alt="" className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700" />
                            </div>
                            <div className="flex-1 w-full">
                                <p className="text-3xl font-black text-foreground tracking-tight mb-2 uppercase">{reservation.car.make} {reservation.car.model}</p>
                                <div className="flex flex-wrap gap-3">
                                    <span className="px-4 py-1.5 bg-background dark:bg-background/50 border border-border-subtle rounded-xl text-[10px] font-black text-gray-400 uppercase tracking-widest">{reservation.car.year}</span>
                                    <span className="px-4 py-1.5 bg-background dark:bg-background/50 border border-border-subtle rounded-xl text-[10px] font-black text-gray-400 uppercase tracking-widest">{reservation.car.transmission === 'Automatic' ? 'Otomatik' : 'Manuel'}</span>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                <div className="space-y-8">
                    {/* Booking Details Card */}
                    <div className="bg-surface rounded-[2.5rem] border border-border-subtle p-10 shadow-xl shadow-black/5 flex flex-col justify-between h-full">
                        <div className="space-y-8">
                            <div className="space-y-4">
                                <div className="flex items-center gap-2 text-[10px] font-black text-gray-400 uppercase tracking-widest">
                                    <Calendar className="w-4 h-4 text-rose-500" /> Tarihler
                                </div>
                                <div className="p-6 bg-background dark:bg-background/50 border border-border-subtle rounded-3xl space-y-4">
                                    <div>
                                        <p className="text-[10px] font-black text-gray-400 uppercase tracking-tighter mb-1">Alış Tarihi</p>
                                        <p className="text-lg font-black text-foreground">{format(reservation.startDate, 'dd MMMM yyyy')}</p>
                                    </div>
                                    <div className="border-t border-border-subtle pt-4">
                                        <p className="text-[10px] font-black text-gray-400 uppercase tracking-tighter mb-1">İade Tarihi</p>
                                        <p className="text-lg font-black text-foreground">{format(reservation.endDate, 'dd MMMM yyyy')}</p>
                                    </div>
                                </div>
                            </div>

                            <div className="space-y-4">
                                <div className="flex items-center gap-2 text-[10px] font-black text-gray-400 uppercase tracking-widest">
                                    <CreditCard className="w-4 h-4 text-emerald-500" /> Ödeme Özeti
                                </div>
                                <div className="p-8 bg-blue-600 rounded-[2rem] text-white shadow-xl shadow-blue-500/20 relative overflow-hidden group">
                                    <CreditCard className="absolute -right-4 -bottom-4 w-24 h-24 opacity-10 group-hover:scale-110 transition-transform" />
                                    <p className="text-[10px] font-black uppercase tracking-widest opacity-80 mb-2">Toplam Tutar</p>
                                    <h4 className="text-4xl font-black tracking-tighter">{reservation.totalAmount} <span className="text-xl font-bold">₺</span></h4>
                                </div>
                            </div>
                        </div>

                        <div className="mt-8 pt-8 border-t border-border-subtle flex items-center gap-3">
                            <ShieldCheck className="w-5 h-5 text-emerald-500" />
                            <span className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Güvenli İşlem Doğrulandı</span>
                        </div>
                    </div>
                </div>
            </div>

            <AdminActionButtons
                reservationId={reservation.id}
                pkgStatus={reservation.status}
            />
        </div>
    )
}
