import db from '@/lib/db'
import { MapPin } from 'lucide-react'

export const dynamic = 'force-dynamic'

export default async function OfficesPage() {
    const offices = await db.office.findMany()

    return (
        <div className="max-w-4xl mx-auto">
            <h1 className="text-3xl font-bold text-gray-900 mb-8">Our Locations</h1>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {offices.map(office => (
                    <div key={office.id} className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 hover:border-blue-200 transition-colors">
                        <div className="flex items-start gap-4">
                            <div className="bg-blue-50 p-3 rounded-lg">
                                <MapPin className="w-6 h-6 text-blue-600" />
                            </div>
                            <div>
                                <h3 className="font-bold text-lg text-gray-900 mb-2">{office.name}</h3>
                                <p className="text-gray-600 leading-relaxed">{office.address}</p>
                                <div className="mt-4 text-xs text-gray-400 font-mono">
                                    {office.latitude}, {office.longitude}
                                </div>
                            </div>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    )
}
