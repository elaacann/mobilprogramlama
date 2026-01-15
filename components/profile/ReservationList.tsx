'use client'

import { format } from 'date-fns'
import Link from 'next/link'
import { MapPin, Calendar, ArrowRight, Clock, CheckCircle2, XCircle, ChevronRight } from 'lucide-react'

interface ReservationItem {
    id: string
    startDate: Date | string
    endDate: Date | string
    status: string
    totalAmount: number
    car: {
        make: string
        model: string
        imageUrl: string
        office: {
            name: string
        }
    }
}

interface ReservationListProps {
    reservations: ReservationItem[]
    type: 'active' | 'upcoming' | 'past'
}

export default function ReservationList({ reservations, type }: ReservationListProps) {
    if (reservations.length === 0) {
        const typeLabels: Record<string, string> = {
            active: 'aktif',
            upcoming: 'yaklaşan',
            past: 'geçmiş'
        }
        return (
            <div className="text-center py-20 bg-background/50 dark:bg-background/20 rounded-[2rem] border-2 border-dashed border-border-subtle animate-fade-in-up">
                <div className="w-16 h-16 bg-surface-hover rounded-full flex items-center justify-center mx-auto mb-6">
                    <Calendar className="w-8 h-8 text-gray-400" />
                </div>
                <p className="text-foreground text-xl font-black">Henüz {typeLabels[type] || type} rezervasyon bulunamadı.</p>
                {type !== 'past' && (
                    <Link href="/dashboard" className="mt-4 inline-flex items-center gap-2 text-blue-600 font-black hover:gap-3 transition-all">
                        Araçlara Göz At <ChevronRight className="w-4 h-4" />
                    </Link>
                )}
            </div>
        )
    }

    const getStatusStyles = (status: string) => {
        switch (status) {
            case 'CONFIRMED': return 'bg-emerald-500/10 text-emerald-600 border-emerald-500/20'
            case 'PENDING': return 'bg-amber-500/10 text-amber-600 border-amber-500/20'
            case 'COMPLETED': return 'bg-blue-500/10 text-blue-600 border-blue-500/20'
            case 'CANCELLED': return 'bg-rose-500/10 text-rose-600 border-rose-500/20'
            default: return 'bg-gray-500/10 text-gray-600 border-gray-500/20'
        }
    }

    const getStatusLabel = (status: string) => {
        switch (status) {
            case 'PENDING': return 'Bekleyen'
            case 'CONFIRMED': return 'Onaylandı'
            case 'COMPLETED': return 'Tamamlandı'
            case 'CANCELLED': return 'İptal Edildi'
            default: return status
        }
    }

    return (
        <div className="grid grid-cols-1 gap-6">
            {reservations.map((res, index) => (
                <div
                    key={res.id}
                    className="group bg-surface border border-border-subtle rounded-[2rem] p-6 flex flex-col md:flex-row gap-8 hover:shadow-2xl hover:shadow-blue-500/5 hover:-translate-y-1 transition-all duration-500 animate-fade-in-up"
                    style={{ animationDelay: `${index * 50}ms` }}
                >
                    <div className="relative overflow-hidden rounded-2xl md:w-64 h-40 flex-shrink-0 shadow-lg shadow-black/5">
                        <img
                            src={res.car.imageUrl}
                            alt={`${res.car.make} ${res.car.model}`}
                            className="w-full h-full object-cover transform group-hover:scale-110 transition-transform duration-700"
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-black/40 to-transparent" />
                    </div>

                    <div className="flex-1 flex flex-col justify-between py-1">
                        <div>
                            <div className="flex flex-col sm:flex-row justify-between items-start gap-4 mb-4">
                                <div>
                                    <h3 className="font-black text-2xl text-foreground tracking-tight group-hover:text-blue-600 transition-colors uppercase">
                                        {res.car.make} {res.car.model}
                                    </h3>
                                    <div className="flex items-center text-sm font-bold text-gray-500 mt-2">
                                        <div className="w-8 h-8 rounded-full bg-rose-500/10 flex items-center justify-center mr-2">
                                            <MapPin className="w-4 h-4 text-rose-500" />
                                        </div>
                                        {res.car.office.name}
                                    </div>
                                </div>
                                <div className={`flex items-center gap-2 px-4 py-2 rounded-2xl text-xs font-black uppercase tracking-widest border ${getStatusStyles(res.status)}`}>
                                    <div className={`w-2 h-2 rounded-full bg-current ${res.status === 'PENDING' ? 'animate-pulse' : ''}`} />
                                    {getStatusLabel(res.status)}
                                </div>
                            </div>
                        </div>

                        <div className="flex flex-wrap items-end justify-between mt-auto gap-6 pt-6 border-t border-border-subtle">
                            <div className="flex items-center gap-1.5 p-1 px-1.5 bg-background dark:bg-background/50 rounded-2xl border border-border-subtle">
                                <div className="flex items-center gap-4 px-4 py-3 rounded-xl hover:bg-surface-hover transition-colors">
                                    <div className="flex flex-col">
                                        <span className="text-[10px] font-black text-gray-400 uppercase tracking-wider">Alış Tarihi</span>
                                        <span className="text-sm font-black text-foreground">{format(new Date(res.startDate), 'dd MMM yyyy')}</span>
                                    </div>
                                    <ChevronRight className="w-4 h-4 text-gray-300" />
                                    <div className="flex flex-col">
                                        <span className="text-[10px] font-black text-gray-400 uppercase tracking-wider">İade Tarihi</span>
                                        <span className="text-sm font-black text-foreground">{format(new Date(res.endDate), 'dd MMM yyyy')}</span>
                                    </div>
                                </div>
                            </div>
                            <div className="flex flex-col items-end">
                                <span className="text-[10px] font-black text-gray-400 mb-1 uppercase tracking-[0.2em]">Toplam Tutar</span>
                                <span className="font-black text-3xl text-foreground tracking-tighter">{res.totalAmount} <span className="text-lg text-blue-500">₺</span></span>
                            </div>
                        </div>
                    </div>

                    <div className="flex md:flex-col items-center justify-center border-t md:border-t-0 md:border-l border-border-subtle pt-6 md:pt-0 md:pl-8 gap-4">
                        <Link
                            href={`/reservations/${res.id}`}
                            className="w-full md:w-16 h-12 md:h-16 flex items-center justify-center bg-blue-600 text-white rounded-2xl shadow-xl shadow-blue-500/20 hover:bg-blue-700 hover:scale-105 active:scale-95 transition-all"
                            title="Detayları Görüntüle"
                        >
                            <ArrowRight className="w-6 h-6" />
                        </Link>
                    </div>
                </div>
            ))}
        </div>
    )
}
