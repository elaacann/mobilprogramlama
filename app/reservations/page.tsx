import db from '@/lib/db'
import { getSession } from '@/lib/auth'
import { redirect } from 'next/navigation'
import Link from 'next/link'
import { format } from 'date-fns'
import { Calendar, ChevronRight } from 'lucide-react'

export default async function ReservationsPage() {
    const session = await getSession()
    if (!session || !session.user) redirect('/login')

    const reservations = await db.reservation.findMany({
        where: { userId: session.user.id },
        include: { car: true },
        orderBy: { createdAt: 'desc' }
    })

    return (
        <div className="max-w-4xl mx-auto">
            <h1 className="text-3xl font-bold text-gray-900 mb-8">My Reservations</h1>

            {reservations.length === 0 ? (
                <div className="bg-white rounded-xl border border-dashed border-gray-300 p-12 text-center">
                    <Calendar className="w-12 h-12 text-gray-300 mx-auto mb-4" />
                    <h3 className="text-lg font-medium text-gray-900 mb-2">No reservations yet</h3>
                    <p className="text-gray-500 mb-6">Book your first car today getting started!</p>
                    <Link href="/dashboard" className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700">
                        Browse Cars
                    </Link>
                </div>
            ) : (
                <div className="space-y-4">
                    {reservations.map(res => (
                        <Link
                            key={res.id}
                            href={`/reservations/${res.id}`}
                            className="block bg-white rounded-xl shadow-sm border border-gray-100 p-6 hover:shadow-md transition-shadow group"
                        >
                            <div className="flex flex-col md:flex-row justify-between items-center gap-4">
                                <div className="flex gap-4 items-center w-full md:w-auto">
                                    <img src={res.car.imageUrl} alt={res.car.make} className="w-20 h-20 object-cover rounded-lg bg-gray-100" />
                                    <div>
                                        <h3 className="font-bold text-gray-900 group-hover:text-blue-600 transition-colors">
                                            {res.car.make} {res.car.model}
                                        </h3>
                                        <div className="text-sm text-gray-500 mt-1">
                                            {format(res.startDate, 'MMM d')} - {format(res.endDate, 'MMM d, yyyy')}
                                        </div>
                                        <span className={`inline-block mt-2 text-xs font-semibold px-2 py-0.5 rounded-full 
                                    ${res.status === 'CONFIRMED' ? 'bg-green-100 text-green-700' :
                                                res.status === 'PENDING' ? 'bg-yellow-100 text-yellow-700' :
                                                    'bg-gray-100 text-gray-700'}`}>
                                            {res.status}
                                        </span>
                                    </div>
                                </div>

                                <div className="flex items-center gap-4 w-full md:w-auto justify-between md:justify-end">
                                    <span className="font-bold text-gray-900">{res.totalAmount} ₺</span>
                                    <ChevronRight className="w-5 h-5 text-gray-400 group-hover:text-blue-500" />
                                </div>
                            </div>
                        </Link>
                    ))}
                </div>
            )}
        </div>
    )
}
