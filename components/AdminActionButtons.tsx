'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { Loader2, CheckCircle2, XCircle, Flag } from 'lucide-react'

export default function AdminActionButtons({ reservationId, pkgStatus }: { reservationId: string, pkgStatus: string }) {
    const router = useRouter()
    const [loading, setLoading] = useState(false)

    const updateStatus = async (status: string) => {
        setLoading(true)
        try {
            await fetch(`/api/admin/reservations/${reservationId}`, {
                method: 'PATCH',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ status })
            })
            router.refresh()
        } catch (error) {
            console.error(error)
        } finally {
            setLoading(false)
        }
    }

    if (loading) return (
        <div className="flex justify-center p-8 bg-surface rounded-3xl border border-border-subtle">
            <Loader2 className="animate-spin w-8 h-8 text-blue-600" />
        </div>
    )

    return (
        <div className="flex flex-col sm:flex-row gap-4">
            {pkgStatus === 'PENDING' && (
                <>
                    <button
                        onClick={() => updateStatus('CONFIRMED')}
                        className="flex-1 bg-emerald-600 hover:bg-emerald-700 text-white font-black py-5 rounded-[2rem] transition-all active:scale-95 flex items-center justify-center gap-3 shadow-xl shadow-emerald-500/20"
                    >
                        <CheckCircle2 className="w-6 h-6" />
                        Rezervasyonu Onayla
                    </button>
                    <button
                        onClick={() => updateStatus('CANCELLED')}
                        className="flex-1 bg-rose-600 hover:bg-rose-700 text-white font-black py-5 rounded-[2rem] transition-all active:scale-95 flex items-center justify-center gap-3 shadow-xl shadow-rose-500/20"
                    >
                        <XCircle className="w-6 h-6" />
                        Talebi Reddet
                    </button>
                </>
            )}

            {pkgStatus === 'CONFIRMED' && (
                <button
                    onClick={() => updateStatus('COMPLETED')}
                    className="flex-1 bg-blue-600 hover:bg-blue-700 text-white font-black py-5 rounded-[2rem] transition-all active:scale-95 flex items-center justify-center gap-3 shadow-xl shadow-blue-500/20"
                >
                    <Flag className="w-6 h-6" />
                    Tamamlandı Olarak İşaretle
                </button>
            )}

            {(pkgStatus === 'COMPLETED' || pkgStatus === 'CANCELLED') && (
                <div className="flex-1 p-6 bg-surface-hover/50 rounded-3xl border border-dashed border-border-subtle text-center">
                    <p className="text-gray-500 font-black uppercase tracking-widest text-xs">Bu rezervasyon nihai durumuna ulaştı.</p>
                </div>
            )}
        </div>
    )
}
