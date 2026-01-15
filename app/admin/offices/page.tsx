import db from '@/lib/db'
import { getSession } from '@/lib/auth'
import { redirect } from 'next/navigation'
import Link from 'next/link'
import { Plus, MapPin, Trash2, Edit, Building2, Car } from 'lucide-react'
import DeleteOfficeButton from '@/components/admin/DeleteOfficeButton'

export const dynamic = 'force-dynamic'

export default async function AdminOfficesPage() {
    const session = await getSession()
    if (!session || session.user.role !== 'ADMIN') redirect('/login')

    const offices = await db.office.findMany({
        include: {
            _count: {
                select: { cars: true }
            }
        },
        orderBy: { name: 'asc' }
    })

    return (
        <div className="max-w-7xl mx-auto px-4 md:px-0">
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-12 gap-6">
                <div className="animate-fade-in-up">
                    <h1 className="text-4xl md:text-5xl font-black text-foreground mb-3 tracking-tight">Ofis Lokasyonları</h1>
                    <p className="text-gray-500 dark:text-gray-400 font-medium">Kiralama ofislerinizi ve araç envanterinizi buradan yönetin.</p>
                </div>
                <Link
                    href="/admin/offices/new"
                    className="w-full md:w-auto bg-blue-600 text-white px-8 py-4 rounded-2xl flex items-center justify-center gap-2 hover:bg-blue-700 transition-all active:scale-95 shadow-xl shadow-blue-500/20 font-black"
                >
                    <Plus className="w-6 h-6" /> Ofis Ekle
                </Link>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                {offices.map((office: any, index: number) => (
                    <div
                        key={office.id}
                        className="bg-surface rounded-3xl p-8 border border-border-subtle shadow-lg shadow-black/5 hover:shadow-2xl hover:shadow-blue-500/10 transition-all group animate-fade-in-up"
                        style={{ animationDelay: `${index * 50}ms` }}
                    >
                        <div className="flex items-start justify-between mb-8">
                            <div className="p-4 bg-blue-500/10 dark:bg-blue-500/20 rounded-2xl">
                                <Building2 className="w-8 h-8 text-blue-600 dark:text-blue-400" />
                            </div>
                            <div className="flex items-center gap-2 md:opacity-0 group-hover:opacity-100 transition-all translate-y-2 group-hover:translate-y-0 duration-300">
                                <Link
                                    href={`/admin/offices/${office.id}/edit`}
                                    className="p-3 text-gray-400 hover:text-blue-600 hover:bg-blue-50 dark:hover:bg-blue-500/10 rounded-xl border border-border-subtle transition-all"
                                >
                                    <Edit className="w-5 h-5" />
                                </Link>
                                <div className="p-1 px-0.5">
                                    <DeleteOfficeButton officeId={office.id} />
                                </div>
                            </div>
                        </div>

                        <h3 className="text-2xl font-black text-foreground mb-3 tracking-tight group-hover:text-blue-600 transition-colors">{office.name}</h3>
                        <div className="flex items-start gap-2 mb-8">
                            <MapPin className="w-4 h-4 text-rose-500 mt-1 flex-shrink-0" />
                            <p className="text-gray-500 dark:text-gray-400 text-sm font-medium line-clamp-2 leading-relaxed">{office.address}</p>
                        </div>

                        <div className="flex items-center justify-between pt-6 border-t border-border-subtle">
                            <div className="flex items-center gap-3">
                                <div className="bg-emerald-500/10 p-2 rounded-lg">
                                    <Car className="w-4 h-4 text-emerald-500" />
                                </div>
                                <span className="text-sm font-black text-foreground/80 lowercase">{office._count.cars} araç</span>
                            </div>
                            <div className="text-xs font-black text-gray-400 dark:text-gray-500 bg-background/50 px-3 py-1.5 rounded-lg border border-border-subtle">
                                {office.latitude.toFixed(4)}, {office.longitude.toFixed(4)}
                            </div>
                        </div>
                    </div>
                ))}

                {offices.length === 0 && (
                    <div className="col-span-full py-32 bg-surface/50 rounded-[3rem] border-4 border-dashed border-border-subtle text-center animate-fade-in-up">
                        <div className="w-20 h-20 bg-gray-100 dark:bg-gray-800 rounded-full flex items-center justify-center mx-auto mb-6">
                            <MapPin className="w-10 h-10 text-gray-400" />
                        </div>
                        <p className="text-foreground text-2xl font-black">Ofis bulunamadı.</p>
                        <p className="text-gray-500 dark:text-gray-400 text-lg mt-2 font-medium">İlk kiralama lokasyonunuzu ekleyerek başlayın.</p>
                    </div>
                )}
            </div>
        </div>
    )
}
