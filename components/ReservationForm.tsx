'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { addDays, format, differenceInDays } from 'date-fns'
import { Loader2, Calendar as CalendarIcon, ShieldCheck, CreditCard, ChevronRight } from 'lucide-react'
import { useAuth } from '@/components/providers/AuthProvider'

export default function ReservationForm({ carId, pricePerDay }: { carId: string, pricePerDay: number }) {
    const router = useRouter()
    const { user } = useAuth()
    const [loading, setLoading] = useState(false)
    const [error, setError] = useState('')

    const [startDate, setStartDate] = useState('')
    const [endDate, setEndDate] = useState('')

    const totalDays = startDate && endDate ? differenceInDays(new Date(endDate), new Date(startDate)) : 0
    const totalAmount = totalDays > 0 ? totalDays * pricePerDay : 0

    const handleReserve = async (e: React.FormEvent) => {
        e.preventDefault()
        if (!user) {
            router.push('/login')
            return
        }

        if (totalDays <= 0) {
            setError('Bitiş tarihi başlangıç tarihinden sonra olmalıdır')
            return
        }

        setLoading(true)
        setError('')

        try {
            const res = await fetch('/api/reservations', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    carId,
                    startDate,
                    endDate,
                    totalAmount
                })
            })

            const json = await res.json()
            if (!res.ok) throw new Error(json.error || 'Rezervasyon başarısız')

            router.push(`/reservations/${json.reservation.id}`)
        } catch (err: any) {
            setError(err.message)
        } finally {
            setLoading(false)
        }
    }

    return (
        <div className="bg-surface p-10 rounded-[2.5rem] shadow-2xl shadow-blue-500/5 border border-border-subtle animate-fade-in-up">
            <div className="flex items-center gap-3 mb-8">
                <div className="p-3 bg-blue-500/10 rounded-2xl">
                    <CalendarIcon className="w-6 h-6 text-blue-600" />
                </div>
                <h3 className="text-2xl font-black text-foreground tracking-tight">Rezervasyon Yap</h3>
            </div>

            {error && (
                <div className="bg-red-500/10 border border-red-500/20 text-red-500 p-4 rounded-2xl mb-8 text-sm font-black flex items-center gap-3">
                    <div className="w-1.5 h-1.5 bg-red-500 rounded-full" />
                    {error}
                </div>
            )}

            <form onSubmit={handleReserve} className="space-y-8">
                <div className="space-y-3">
                    <label className="text-[10px] font-black text-gray-400 uppercase tracking-[0.2em] ml-1">Alış Tarihi</label>
                    <div className="relative group">
                        <input
                            type="date"
                            required
                            min={new Date().toISOString().split('T')[0]}
                            className="w-full px-6 py-4.5 bg-background dark:bg-background/50 border border-border-subtle rounded-2xl focus:ring-4 focus:ring-blue-500/5 focus:border-blue-500 outline-none transition-all font-bold text-foreground appearance-none cursor-pointer"
                            value={startDate}
                            onChange={(e) => setStartDate(e.target.value)}
                        />
                    </div>
                </div>

                <div className="space-y-3">
                    <label className="text-[10px] font-black text-gray-400 uppercase tracking-[0.2em] ml-1">İade Tarihi</label>
                    <div className="relative group">
                        <input
                            type="date"
                            required
                            min={startDate || new Date().toISOString().split('T')[0]}
                            className="w-full px-6 py-4.5 bg-background dark:bg-background/50 border border-border-subtle rounded-2xl focus:ring-4 focus:ring-blue-500/5 focus:border-blue-500 outline-none transition-all font-bold text-foreground appearance-none cursor-pointer"
                            value={endDate}
                            onChange={(e) => setEndDate(e.target.value)}
                        />
                    </div>
                </div>

                {totalDays > 0 ? (
                    <div className="bg-blue-600 rounded-3xl p-8 text-white shadow-xl shadow-blue-500/30 group overflow-hidden relative">
                        <div className="absolute top-0 right-0 p-4 opacity-10 flex group-hover:scale-110 transition-transform">
                            <CreditCard className="w-20 h-20" />
                        </div>
                        <div className="relative z-10 flex justify-between items-center">
                            <div>
                                <span className="text-[10px] font-black uppercase tracking-widest opacity-80 decoration-white/30 underline underline-offset-4 decoration-2">Toplam Süre</span>
                                <p className="font-black text-2xl">{totalDays} <span className="text-sm font-bold">Gün</span></p>
                            </div>
                            <div className="text-right">
                                <span className="text-[10px] font-black uppercase tracking-widest opacity-80">Ödenecek Tutar</span>
                                <p className="font-black text-4xl leading-none">{totalAmount} <span className="text-lg font-bold">₺</span></p>
                            </div>
                        </div>
                    </div>
                ) : (
                    <div className="bg-surface-hover/50 p-6 rounded-3xl border border-dashed border-border-subtle flex items-center justify-center text-center">
                        <p className="text-sm font-bold text-gray-400">Tarih seçerek toplam tutarı hesaplayın.</p>
                    </div>
                )}

                <button
                    type="submit"
                    disabled={loading}
                    className="w-full bg-blue-600 hover:bg-blue-700 text-white font-black py-5 rounded-[2rem] transition-all active:scale-95 flex items-center justify-center gap-3 disabled:opacity-50 shadow-xl shadow-blue-500/20 group hover:shadow-blue-500/40"
                >
                    {loading ? <Loader2 className="animate-spin h-6 w-6" /> : (
                        <>
                            Rezervasyonu Onayla
                            <ChevronRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                        </>
                    )}
                </button>

                {!user ? (
                    <div className="flex items-center gap-3 p-4 rounded-2xl bg-amber-500/5 border border-amber-500/20 text-amber-600">
                        <ShieldCheck className="w-5 h-5 flex-shrink-0" />
                        <p className="text-xs font-black">Rezervasyon için giriş yapmalısınız.</p>
                    </div>
                ) : (
                    <div className="flex items-center gap-3 justify-center">
                        <ShieldCheck className="w-4 h-4 text-emerald-500" />
                        <span className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Güvenli Rezervasyon</span>
                    </div>
                )}
            </form>
        </div>
    )
}
