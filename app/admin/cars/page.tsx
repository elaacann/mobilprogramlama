import db from '@/lib/db'
import { getSession } from '@/lib/auth'
import { redirect } from 'next/navigation'
import Link from 'next/link'
import { Plus, Edit3, Car, MapPin, Tag } from 'lucide-react'
import DeleteCarButton from '@/components/admin/DeleteCarButton'

export const dynamic = 'force-dynamic'

export default async function AdminCarsPage() {
    const session = await getSession()
    if (!session || session.user.role !== 'ADMIN') redirect('/login')

    const cars = await db.car.findMany({
        include: { office: true },
        orderBy: { createdAt: 'desc' }
    })

    return (
        <div className="max-w-7xl mx-auto px-4 pb-20 animate-fade-in-up">
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-12 gap-6">
                <div>
                    <h1 className="text-4xl md:text-5xl font-black text-foreground mb-3 tracking-tight">Filo Yönetimi</h1>
                    <p className="text-gray-500 dark:text-gray-400 font-medium text-lg">Araç envanterinizi güncelleyin ve müsaitlik durumunu takip edin.</p>
                </div>
                <Link
                    href="/admin/cars/new"
                    className="w-full md:w-auto bg-blue-600 text-white px-8 py-4 rounded-2xl flex items-center justify-center gap-3 hover:bg-blue-700 transition-all active:scale-95 shadow-xl shadow-blue-500/20 font-black"
                >
                    <Plus className="w-6 h-6" /> Araç Ekle
                </Link>
            </div>

            <div className="bg-surface rounded-[2.5rem] shadow-2xl shadow-black/5 border border-border-subtle overflow-hidden">
                <div className="overflow-x-auto">
                    <table className="w-full text-left border-collapse">
                        <thead>
                            <tr className="bg-surface-hover/30 border-b border-border-subtle">
                                <th className="p-8 font-black text-gray-400 uppercase tracking-widest text-[10px]">Görsel</th>
                                <th className="p-8 font-black text-gray-400 uppercase tracking-widest text-[10px]">Araç Bilgisi</th>
                                <th className="p-8 font-black text-gray-400 uppercase tracking-widest text-[10px]">Lokasyon</th>
                                <th className="p-8 font-black text-gray-400 uppercase tracking-widest text-[10px]">Günlük Ücret</th>
                                <th className="p-8 font-black text-gray-400 uppercase tracking-widest text-[10px]">Durum</th>
                                <th className="p-8 font-black text-gray-400 uppercase tracking-widest text-[10px] text-right">İşlemler</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-border-subtle">
                            {cars.map((car: any) => (
                                <tr key={car.id} className="group hover:bg-surface-hover/50 transition-all duration-300">
                                    <td className="p-8">
                                        <div className="relative w-32 h-20 rounded-2xl overflow-hidden shadow-lg border border-border-subtle">
                                            <img src={car.imageUrl} alt="" className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500" />
                                        </div>
                                    </td>
                                    <td className="p-8">
                                        <div className="flex flex-col gap-1">
                                            <span className="font-black text-foreground text-lg tracking-tight">{car.make} {car.model}</span>
                                            <div className="flex items-center gap-2 text-xs font-bold text-gray-400 uppercase tracking-wider">
                                                <Tag className="w-3.5 h-3.5" />
                                                {car.year} • {car.transmission === 'Automatic' ? 'Otomatik' : car.transmission === 'Manual' ? 'Manuel' : car.transmission}
                                            </div>
                                        </div>
                                    </td>
                                    <td className="p-8">
                                        <div className="flex items-center gap-2 text-gray-500 font-bold">
                                            <MapPin className="w-4 h-4 text-rose-500" />
                                            {car.office.name}
                                        </div>
                                    </td>
                                    <td className="p-8">
                                        <div className="font-black text-foreground text-xl tracking-tighter">
                                            {car.pricePerDay} <span className="text-sm font-bold text-gray-400">₺/gün</span>
                                        </div>
                                    </td>
                                    <td className="p-8">
                                        <div className={`inline-flex items-center gap-2 px-4 py-2 rounded-xl text-[10px] font-black uppercase tracking-widest border
                                    ${car.available ? 'bg-emerald-500/10 text-emerald-600 border-emerald-500/20' : 'bg-rose-500/10 text-rose-600 border-rose-500/20'}`}>
                                            <div className={`w-1.5 h-1.5 rounded-full ${car.available ? 'bg-emerald-500' : 'bg-rose-500'}`} />
                                            {car.available ? 'Müsait' : 'Kirada'}
                                        </div>
                                    </td>
                                    <td className="p-8 text-right">
                                        <div className="flex items-center justify-end gap-3 translate-x-4 group-hover:translate-x-0 opacity-0 group-hover:opacity-100 transition-all duration-300">
                                            <Link
                                                href={`/admin/cars/${car.id}/edit`}
                                                className="p-3 text-gray-400 hover:text-blue-500 hover:bg-blue-500/10 rounded-xl border border-border-subtle transition-all"
                                                title="Düzenle"
                                            >
                                                <Edit3 className="w-5 h-5" />
                                            </Link>
                                            <DeleteCarButton carId={car.id} />
                                        </div>
                                    </td>
                                </tr>
                            ))}
                            {cars.length === 0 && (
                                <tr>
                                    <td colSpan={6} className="p-32 text-center text-gray-500">
                                        <div className="flex flex-col items-center gap-4">
                                            <div className="w-20 h-20 rounded-full bg-gray-50 dark:bg-gray-800 flex items-center justify-center">
                                                <Car className="w-10 h-10 text-gray-300" />
                                            </div>
                                            <p className="text-xl font-black text-foreground">Araç bulunamadı.</p>
                                            <p className="max-w-xs font-medium text-gray-400">İlk aracınızı eklemek için sağ üstteki butonu kullanın.</p>
                                        </div>
                                    </td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    )
}
