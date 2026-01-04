import db from '@/lib/db'
import { getSession } from '@/lib/auth'
import { notFound, redirect } from 'next/navigation'
import QRGenerator from '@/components/QRGenerator'
import { format } from 'date-fns'
import Link from 'next/link'
import { CheckCircle, Clock, XCircle, ArrowLeft } from 'lucide-react'

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
            <div className="p-8 text-center text-red-600">
                Bu rezervasyona yetkisiz erişim.
            </div>
        )
    }

    const statusColors = {
        PENDING: 'text-yellow-600 bg-yellow-50 border-yellow-200',
        CONFIRMED: 'text-green-600 bg-green-50 border-green-200',
        COMPLETED: 'text-blue-600 bg-blue-50 border-blue-200',
        CANCELLED: 'text-red-600 bg-red-50 border-red-200',
    }

    const statusIcons = {
        PENDING: Clock,
        CONFIRMED: CheckCircle,
        COMPLETED: CheckCircle,
        CANCELLED: XCircle,
    }

    const StatusIcon = statusIcons[reservation.status as keyof typeof statusIcons] || Clock

    return (
        <div className="max-w-4xl mx-auto">
            <Link href="/profile" className="inline-flex items-center text-gray-500 hover:text-gray-900 mb-6">
                <ArrowLeft className="w-4 h-4 mr-2" />
                Rezervasyonlara Dön
            </Link>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                <div className="md:col-span-2 space-y-6">
                    <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-8">
                        <div className="flex justify-between items-start mb-6">
                            <div>
                                <h1 className="text-2xl font-bold text-gray-900">Rezervasyon Detayları</h1>
                                <p className="text-gray-500 text-sm">ID: {reservation.id}</p>
                            </div>
                            <div className={`px-4 py-2 rounded-full border flex items-center gap-2 ${statusColors[reservation.status as keyof typeof statusColors]}`}>
                                <StatusIcon className="w-4 h-4" />
                                <span className="font-semibold text-sm">
                                    {reservation.status === 'PENDING' ? 'BEKLEYEN' :
                                        reservation.status === 'CONFIRMED' ? 'ONAYLANDI' :
                                            reservation.status === 'COMPLETED' ? 'TAMAMLANDI' :
                                                reservation.status === 'CANCELLED' ? 'İPTAL EDİLDİ' : reservation.status}
                                </span>
                            </div>
                        </div>

                        <div className="grid grid-cols-2 gap-6 mb-8">
                            <div>
                                <span className="block text-sm text-gray-500 mb-1">Alış</span>
                                <p className="font-semibold text-gray-900 text-lg">
                                    {format(reservation.startDate, 'dd MMM yyyy')}
                                </p>
                            </div>
                            <div>
                                <span className="block text-sm text-gray-500 mb-1">İade</span>
                                <p className="font-semibold text-gray-900 text-lg">
                                    {format(reservation.endDate, 'dd MMM yyyy')}
                                </p>
                            </div>
                        </div>

                        <div className="border-t border-gray-100 pt-6">
                            <h3 className="font-semibold text-gray-900 mb-4">Araç Bilgileri</h3>
                            <div className="flex gap-4">
                                <img
                                    src={reservation.car.imageUrl}
                                    alt={reservation.car.make}
                                    className="w-24 h-24 object-cover rounded-lg"
                                />
                                <div>
                                    <p className="font-bold text-lg text-gray-900">{reservation.car.make} {reservation.car.model}</p>
                                    <p className="text-gray-500">{reservation.car.year} • {reservation.car.transmission === 'Automatic' ? 'Otomatik' : reservation.car.transmission === 'Manual' ? 'Manuel' : reservation.car.transmission}</p>
                                    <p className="text-sm text-gray-600 mt-1">{reservation.car.office.name}</p>
                                </div>
                            </div>
                        </div>

                        <div className="border-t border-gray-100 mt-6 pt-6 flex justify-between items-center">
                            <span className="text-gray-600">Toplam Tutar</span>
                            <span className="text-2xl font-bold text-blue-600">{reservation.totalAmount} ₺</span>
                        </div>
                    </div>
                </div>

                <div className="md:col-span-1">
                    <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6 flex flex-col items-center text-center">
                        <h3 className="font-bold text-gray-900 mb-4">Rezervasyon QR Kodu</h3>
                        <p className="text-sm text-gray-500 mb-6">
                            Aracınızı almak için bu QR kodu kimliğinizle birlikte ofiste gösterin.
                        </p>

                        {reservation.qrCodeData ? (
                            <QRGenerator value={reservation.qrCodeData} />
                        ) : (
                            <div className="text-red-500 py-8">QR Kod mevcut değil</div>
                        )}
                    </div>
                </div>
            </div>
        </div>
    )
}
