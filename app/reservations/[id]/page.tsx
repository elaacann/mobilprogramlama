
import db from '@/lib/db'
import { getSession } from '@/lib/auth'
import { notFound, redirect } from 'next/navigation'
import QRGenerator from '@/components/QRGenerator'
import { format } from 'date-fns'
import { tr } from 'date-fns/locale'
import Link from 'next/link'
import { CheckCircle, Clock, XCircle, ArrowLeft, MapPin, Calendar, Fuel, Cog, Info } from 'lucide-react'

export default async function ReservationDetailPage({ params }: { params: Promise<{ id: string }> }) {
    const session = await getSession()
    if (!session || !session.user) redirect('/login')

    const { id } = await params
    const reservation = await db.reservation.findUnique({
        where: { id },
        include: { car: { include: { office: true } } }
    })

    if (!reservation) notFound()

    // Ensure user owns this reservation (or is admin)
    if (reservation.userId !== session.user.id && session.user.role !== 'ADMIN') {
        return (
            <div className="flex flex-col items-center justify-center min-h-[50vh] text-center p-8">
                <XCircle className="w-16 h-16 text-red-500 mb-4" />
                <h1 className="text-2xl font-bold text-gray-900 mb-2">Yetkisiz Erişim</h1>
                <p className="text-gray-500">Bu rezervasyonu görüntüleme yetkiniz yok.</p>
                <Link href="/dashboard" className="mt-6 text-blue-600 hover:underline">Ana Sayfaya Dön</Link>
            </div>
        )
    }

    const statusStyles = {
        PENDING: 'bg-yellow-500/10 text-yellow-600 border-yellow-500/20',
        CONFIRMED: 'bg-emerald-500/10 text-emerald-600 border-emerald-500/20',
        COMPLETED: 'bg-blue-500/10 text-blue-600 border-blue-500/20',
        CANCELLED: 'bg-rose-500/10 text-rose-600 border-rose-500/20',
    }

    const statusIcons = {
        PENDING: Clock,
        CONFIRMED: CheckCircle,
        COMPLETED: CheckCircle,
        CANCELLED: XCircle,
    }

    const StatusIcon = statusIcons[reservation.status as keyof typeof statusIcons] || Clock
    const statusStyle = statusStyles[reservation.status as keyof typeof statusStyles] || 'bg-gray-100 text-gray-600'

    return (
        <div className="max-w-4xl mx-auto pb-12 animate-fade-in-up">
            <Link href="/reservations" className="inline-flex items-center text-gray-500 hover:text-foreground mb-8 transition-colors group">
                <ArrowLeft className="w-4 h-4 mr-2 group-hover:-translate-x-1 transition-transform" />
                Rezervasyonlara Dön
            </Link>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                <div className="md:col-span-2 space-y-8">
                    {/* Header Card */}
                    <div className="bg-surface rounded-[2.5rem] shadow-xl shadow-black/5 border border-border-subtle p-8 overflow-hidden relative">
                        <div className="absolute top-0 right-0 w-64 h-64 bg-gradient-to-br from-blue-500/5 to-transparent rounded-full -mr-16 -mt-16 blur-2xl" />

                        <div className="relative z-10 flex flex-col md:flex-row justify-between items-start gap-4 mb-8">
                            <div>
                                <span className="text-xs font-black text-gray-400 uppercase tracking-widest block mb-1">Rezervasyon ID</span>
                                <p className="font-mono text-xs text-gray-500 bg-gray-100 dark:bg-white/5 px-2 py-1 rounded-md inline-block">{reservation.id}</p>
                            </div>
                            <div className={`px-5 py-2 rounded-2xl border flex items-center gap-2.5 ${statusStyle} backdrop-blur-md`}>
                                <StatusIcon className="w-4 h-4" />
                                <span className="font-black text-xs uppercase tracking-wider">
                                    {reservation.status === 'PENDING' ? 'Bekleyen' :
                                        reservation.status === 'CONFIRMED' ? 'Onaylandı' :
                                            reservation.status === 'COMPLETED' ? 'Tamamlandı' :
                                                reservation.status === 'CANCELLED' ? 'İptal Edildi' : reservation.status}
                                </span>
                            </div>
                        </div>

                        <div className="grid grid-cols-2 gap-8 relative z-10">
                            <div className="p-4 rounded-2xl bg-background/50 border border-border-subtle">
                                <span className="flex items-center gap-2 text-xs font-black text-gray-400 uppercase tracking-widest mb-2">
                                    <Calendar className="w-3.5 h-3.5" />
                                    Alış Tarihi
                                </span>
                                <p className="font-black text-xl text-foreground">
                                    {format(reservation.startDate, 'dd MMM yyyy', { locale: tr })}
                                </p>
                                <p className="text-sm text-gray-500 font-medium">{format(reservation.startDate, 'HH:mm')}</p>
                            </div>
                            <div className="p-4 rounded-2xl bg-background/50 border border-border-subtle">
                                <span className="flex items-center gap-2 text-xs font-black text-gray-400 uppercase tracking-widest mb-2">
                                    <Calendar className="w-3.5 h-3.5" />
                                    İade Tarihi
                                </span>
                                <p className="font-black text-xl text-foreground">
                                    {format(reservation.endDate, 'dd MMM yyyy', { locale: tr })}
                                </p>
                                <p className="text-sm text-gray-500 font-medium">{format(reservation.endDate, 'HH:mm')}</p>
                            </div>
                        </div>
                    </div>

                    {/* Car Info Card */}
                    <div className="bg-surface rounded-[2.5rem] shadow-xl shadow-black/5 border border-border-subtle overflow-hidden">
                        <div className="grid grid-cols-1 md:grid-cols-2 h-full">
                            <div className="h-64 md:h-auto relative overflow-hidden group">
                                <img
                                    src={reservation.car.imageUrl}
                                    alt={reservation.car.make}
                                    className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
                                />
                                <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent md:bg-gradient-to-r" />
                                <div className="absolute bottom-4 left-4 text-white p-2">
                                    <h3 className="text-3xl font-black">{reservation.car.make}</h3>
                                    <p className="text-xl font-medium opacity-90">{reservation.car.model}</p>
                                </div>
                            </div>
                            <div className="p-8 flex flex-col justify-center bg-surface">
                                <span className="text-xs font-black text-gray-400 uppercase tracking-widest mb-6 block">Araç Detayları</span>
                                <div className="space-y-4">
                                    <div className="flex items-center gap-3">
                                        <div className="p-2 bg-blue-500/10 rounded-xl">
                                            <Cog className="w-4 h-4 text-blue-500" />
                                        </div>
                                        <span className="font-bold text-foreground text-sm">
                                            {reservation.car.transmission === 'Automatic' ? 'Otomatik Vites' : 'Manuel Vites'}
                                        </span>
                                    </div>
                                    <div className="flex items-center gap-3">
                                        <div className="p-2 bg-indigo-500/10 rounded-xl">
                                            <Fuel className="w-4 h-4 text-indigo-500" />
                                        </div>
                                        <span className="font-bold text-foreground text-sm">
                                            {reservation.car.fuelType === 'Petrol' ? 'Benzin' : reservation.car.fuelType === 'Diesel' ? 'Dizel' : reservation.car.fuelType}
                                        </span>
                                    </div>
                                    <div className="flex items-center gap-3">
                                        <div className="p-2 bg-rose-500/10 rounded-xl">
                                            <MapPin className="w-4 h-4 text-rose-500" />
                                        </div>
                                        <div>
                                            <span className="font-bold text-foreground text-sm block">{reservation.car.office.name}</span>
                                            <span className="text-xs text-gray-500">{reservation.car.office.address}</span>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Payment Info */}
                    <div className="bg-surface rounded-[2.5rem] shadow-xl shadow-black/5 border border-border-subtle p-8 flex justify-between items-center">
                        <div className="flex items-center gap-3">
                            <div className="p-3 bg-emerald-500/10 rounded-2xl">
                                <CheckCircle className="w-6 h-6 text-emerald-500" />
                            </div>
                            <div className="flex flex-col">
                                <span className="font-bold text-foreground">Ödeme Durumu</span>
                                <span className="text-xs text-gray-500">Kredi Kartı ile ödendi</span>
                            </div>
                        </div>
                        <div className="text-right">
                            <span className="text-xs font-black text-gray-400 uppercase tracking-widest block">Toplam</span>
                            <span className="text-3xl font-black text-blue-600 tracking-tighter">{reservation.totalAmount} ₺</span>
                        </div>
                    </div>
                </div>

                {/* Sidebar (QR Code) */}
                <div className="md:col-span-1">
                    <div className="bg-surface rounded-[2.5rem] shadow-xl shadow-black/5 border border-border-subtle p-8 flex flex-col items-center text-center sticky top-24">
                        <div className="w-16 h-16 bg-blue-600 rounded-full flex items-center justify-center text-white font-black text-2xl mb-6 shadow-lg shadow-blue-500/30">
                            ID
                        </div>
                        <h3 className="font-black text-xl text-foreground mb-2">Teslimat QR Kodu</h3>
                        <p className="text-sm text-gray-500 font-medium mb-8 leading-relaxed">
                            Aracınızı teslim almak için kiralama ofisindeki yetkiliye bu kodu gösterin.
                        </p>

                        <div className="p-4 bg-white rounded-3xl shadow-sm border border-gray-100 mb-6">
                            {reservation.qrCodeData ? (
                                <QRGenerator value={reservation.qrCodeData} />
                            ) : (
                                <div className="w-48 h-48 flex items-center justify-center text-red-500 font-bold border-2 border-dashed border-red-200 rounded-2xl">
                                    Kod Oluşmadı
                                </div>
                            )}
                        </div>

                        <div className="flex items-center gap-2 text-xs text-gray-400 font-medium bg-gray-50 dark:bg-white/5 px-4 py-2 rounded-xl">
                            <Info className="w-3 h-3" />
                            <span>15 dakika önceden gitmeniz önerilir.</span>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}
