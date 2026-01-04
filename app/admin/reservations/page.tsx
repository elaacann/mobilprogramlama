import db from '@/lib/db'
import { getSession } from '@/lib/auth'
import { redirect } from 'next/navigation'
import Link from 'next/link'
import { format } from 'date-fns'
import { Calendar, User, Car, Settings, Filter, ArrowRight } from 'lucide-react'

export const dynamic = 'force-dynamic'

interface AdminReservationsPageProps {
    searchParams: Promise<{
        status?: string
    }>
}

export default async function AdminReservationsPage({ searchParams }: AdminReservationsPageProps) {
    const filters = await searchParams
    const session = await getSession()
    if (!session || session.user.role !== 'ADMIN') redirect('/login')

    const reservations = await db.reservation.findMany({
        where: filters.status ? { status: filters.status } : {},
        include: { car: true, user: true },
        orderBy: { createdAt: 'desc' }
    })

    return (
        <div className="max-w-7xl mx-auto px-4 pb-20 animate-fade-in-up">
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-12 gap-6">
                <div>
                    <h1 className="text-4xl md:text-5xl font-black text-foreground mb-3 tracking-tight">Tüm Rezervasyonlar</h1>
                    <p className="text-gray-500 dark:text-gray-400 font-medium text-lg">Müşteri taleplerini izleyin ve rezervasyon durumlarını güncelleyin.</p>
                </div>

                <div className="flex items-center gap-3 bg-surface p-2 rounded-2xl border border-border-subtle shadow-sm">
                    <div className="px-4 py-2 text-xs font-black text-gray-400 uppercase tracking-widest flex items-center gap-2">
                        <Filter className="w-4 h-4" /> Filtrele:
                    </div>
                    {[
                        { label: 'Hepsi', val: undefined },
                        { label: 'Bekleyen', val: 'PENDING' },
                        { label: 'Onaylı', val: 'CONFIRMED' }
                    ].map((btn, i) => (
                        <Link
                            key={i}
                            href={btn.val ? `/admin/reservations?status=${btn.val}` : '/admin/reservations'}
                            className={`px-4 py-2 rounded-xl text-xs font-black transition-all ${(filters.status === btn.val)
                                    ? 'bg-blue-600 text-white shadow-lg shadow-blue-500/20'
                                    : 'text-gray-500 hover:bg-surface-hover hover:text-foreground'
                                }`}
                        >
                            {btn.label}
                        </Link>
                    ))}
                </div>
            </div>

            <div className="bg-surface rounded-[2.5rem] shadow-2xl shadow-black/5 border border-border-subtle overflow-hidden">
                <div className="overflow-x-auto">
                    <table className="w-full text-left border-collapse">
                        <thead>
                            <tr className="bg-surface-hover/30 border-b border-border-subtle">
                                <th className="p-8 font-black text-gray-400 uppercase tracking-widest text-[10px]">ID</th>
                                <th className="p-8 font-black text-gray-400 uppercase tracking-widest text-[10px]">Kullanıcı</th>
                                <th className="p-8 font-black text-gray-400 uppercase tracking-widest text-[10px]">Araç</th>
                                <th className="p-8 font-black text-gray-400 uppercase tracking-widest text-[10px]">Tarihler</th>
                                <th className="p-8 font-black text-gray-400 uppercase tracking-widest text-[10px]">Durum</th>
                                <th className="p-8 font-black text-gray-400 uppercase tracking-widest text-[10px] text-right">İşlem</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-border-subtle">
                            {reservations.map((res: any) => (
                                <tr key={res.id} className="group hover:bg-surface-hover/50 transition-all duration-300">
                                    <td className="p-8">
                                        <div className="font-mono text-[10px] font-black text-gray-400 uppercase tracking-widest px-2 py-1 bg-background/50 border border-border-subtle rounded-lg w-fit">
                                            #{res.id.slice(0, 8)}
                                        </div>
                                    </td>
                                    <td className="p-8">
                                        <div className="flex items-center gap-4">
                                            <div className="w-10 h-10 rounded-xl bg-blue-500/10 flex items-center justify-center font-black text-blue-600 border border-blue-500/10">
                                                {res.user.name.charAt(0)}
                                            </div>
                                            <div>
                                                <div className="font-black text-foreground tracking-tight">{res.user.name}</div>
                                                <div className="text-[10px] text-gray-400 font-bold uppercase tracking-wider">{res.user.email}</div>
                                            </div>
                                        </div>
                                    </td>
                                    <td className="p-8">
                                        <div className="flex items-center gap-3">
                                            <Car className="w-4 h-4 text-gray-400" />
                                            <div className="font-bold text-foreground text-sm tracking-tight">{res.car.make} {res.car.model}</div>
                                        </div>
                                    </td>
                                    <td className="p-8">
                                        <div className="flex items-center gap-3">
                                            <Calendar className="w-4 h-4 text-gray-400" />
                                            <div className="text-sm font-black text-gray-500 uppercase tracking-tighter">
                                                {format(res.startDate, 'dd MMM')} - {format(res.endDate, 'dd MMM')}
                                            </div>
                                        </div>
                                    </td>
                                    <td className="p-8">
                                        <span className={`inline-flex items-center gap-2 px-4 py-2 rounded-xl text-[10px] font-black uppercase tracking-widest border
                                            ${res.status === 'CONFIRMED' ? 'bg-emerald-500/10 text-emerald-600 border-emerald-500/20' :
                                                res.status === 'PENDING' ? 'bg-amber-500/10 text-amber-600 border-amber-500/20' :
                                                    res.status === 'COMPLETED' ? 'bg-blue-500/10 text-blue-600 border-blue-500/20' :
                                                        'bg-rose-500/10 text-rose-600 border-rose-500/20'}`}>
                                            <div className={`w-1.5 h-1.5 rounded-full ${res.status === 'CONFIRMED' ? 'bg-emerald-500' :
                                                    res.status === 'PENDING' ? 'bg-amber-500' :
                                                        res.status === 'COMPLETED' ? 'bg-blue-500' : 'bg-rose-500'
                                                }`} />
                                            {res.status === 'PENDING' ? 'BEKLEYEN' :
                                                res.status === 'CONFIRMED' ? 'ONAYLANDI' :
                                                    res.status === 'COMPLETED' ? 'TAMAMLANDI' :
                                                        res.status === 'CANCELLED' ? 'İPTAL EDİLDİ' : res.status}
                                        </span>
                                    </td>
                                    <td className="p-8 text-right">
                                        <Link
                                            href={`/admin/reservations/${res.id}`}
                                            className="inline-flex items-center gap-2 p-3 text-gray-400 hover:text-blue-600 hover:bg-blue-500/10 rounded-xl border border-border-subtle transition-all font-black text-xs uppercase tracking-widest group/btn"
                                        >
                                            <Settings className="w-5 h-5 group-hover/btn:rotate-90 transition-transform duration-500" />
                                            <span className="hidden md:inline">Yönet</span>
                                        </Link>
                                    </td>
                                </tr>
                            ))}
                            {reservations.length === 0 && (
                                <tr>
                                    <td colSpan={6} className="p-32 text-center text-gray-500">
                                        <div className="flex flex-col items-center gap-4">
                                            <div className="w-20 h-20 rounded-full bg-gray-50 dark:bg-gray-800 flex items-center justify-center">
                                                <Calendar className="w-10 h-10 text-gray-300" />
                                            </div>
                                            <p className="text-xl font-black text-foreground">Rezervasyon bulunamadı.</p>
                                            <p className="max-w-xs font-medium text-gray-400">Aradığınız kriterlere uygun herhangi bir kayıt bulunmuyor.</p>
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
