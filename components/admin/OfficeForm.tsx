'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { Loader2, MapPin, Building, Globe, Navigation, Save, X } from 'lucide-react'

interface OfficeFormProps {
    initialData?: {
        id: string
        name: string
        address: string
        latitude: number
        longitude: number
    }
}

export default function OfficeForm({ initialData }: OfficeFormProps) {
    const router = useRouter()
    const [loading, setLoading] = useState(false)
    const [error, setError] = useState('')

    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault()
        setLoading(true)
        setError('')

        const formData = new FormData(e.currentTarget)
        const data = {
            name: formData.get('name'),
            address: formData.get('address'),
            latitude: Number(formData.get('latitude')),
            longitude: Number(formData.get('longitude')),
        }

        try {
            const url = initialData
                ? `/api/admin/offices/${initialData.id}`
                : '/api/admin/offices'

            const method = initialData ? 'PATCH' : 'POST'

            const res = await fetch(url, {
                method,
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(data)
            })

            const json = await res.json()
            if (!res.ok) {
                throw new Error(json.error || 'Ofis kaydedilemedi')
            }

            router.push('/admin/offices')
            router.refresh()
        } catch (err: any) {
            setError(err.message)
        } finally {
            setLoading(false)
        }
    }

    return (
        <form onSubmit={handleSubmit} className="space-y-8">
            {error && (
                <div className="bg-red-500/10 border border-red-500/20 text-red-500 p-5 rounded-2xl text-sm font-black flex items-center gap-3">
                    <div className="w-2 h-2 bg-red-500 rounded-full" />
                    {error}
                </div>
            )}

            <div className="grid grid-cols-1 gap-8">
                <div className="space-y-3">
                    <label className="text-xs font-black text-gray-400 uppercase tracking-widest ml-1 flex items-center gap-2">
                        <Building className="w-4 h-4" />
                        Ofis Adı
                    </label>
                    <div className="relative group">
                        <input
                            name="name"
                            required
                            defaultValue={initialData?.name}
                            type="text"
                            className="w-full px-6 py-4.5 bg-background dark:bg-background/50 border border-border-subtle rounded-3xl focus:ring-4 focus:ring-blue-500/5 focus:border-blue-500 outline-none transition-all font-bold text-foreground placeholder:text-gray-500"
                            placeholder="Örn: İstanbul Havalimanı"
                        />
                    </div>
                </div>

                <div className="space-y-3">
                    <label className="text-xs font-black text-gray-400 uppercase tracking-widest ml-1 flex items-center gap-2">
                        <MapPin className="w-4 h-4" />
                        Tam Adres
                    </label>
                    <div className="relative group">
                        <textarea
                            name="address"
                            required
                            defaultValue={initialData?.address}
                            rows={3}
                            className="w-full px-6 py-4.5 bg-background dark:bg-background/50 border border-border-subtle rounded-3xl focus:ring-4 focus:ring-blue-500/5 focus:border-blue-500 outline-none transition-all font-bold text-foreground resize-none placeholder:text-gray-500"
                            placeholder="Sokak, mahalle, bina no ve şehir bilgisi..."
                        />
                    </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                    <div className="space-y-3">
                        <label className="text-xs font-black text-gray-400 uppercase tracking-widest ml-1 flex items-center gap-2">
                            <Navigation className="w-4 h-4" />
                            Enlem (Latitude)
                        </label>
                        <input
                            name="latitude"
                            required
                            defaultValue={initialData?.latitude}
                            type="number"
                            step="any"
                            className="w-full px-6 py-4.5 bg-background dark:bg-background/50 border border-border-subtle rounded-3xl focus:ring-4 focus:ring-blue-500/5 focus:border-blue-500 outline-none transition-all font-bold text-foreground placeholder:text-gray-500"
                            placeholder="41.0082"
                        />
                    </div>
                    <div className="space-y-3">
                        <label className="text-xs font-black text-gray-400 uppercase tracking-widest ml-1 flex items-center gap-2">
                            <Globe className="w-4 h-4" />
                            Boylam (Longitude)
                        </label>
                        <input
                            name="longitude"
                            required
                            defaultValue={initialData?.longitude}
                            type="number"
                            step="any"
                            className="w-full px-6 py-4.5 bg-background dark:bg-background/50 border border-border-subtle rounded-3xl focus:ring-4 focus:ring-blue-500/5 focus:border-blue-500 outline-none transition-all font-bold text-foreground placeholder:text-gray-500"
                            placeholder="28.9784"
                        />
                    </div>
                </div>
            </div>

            <div className="flex flex-col sm:flex-row justify-end gap-4 pt-8 border-t border-border-subtle">
                <button
                    type="button"
                    onClick={() => router.back()}
                    className="px-8 py-4.5 rounded-3xl font-black text-gray-500 hover:bg-surface-hover transition-all active:scale-95 flex items-center justify-center gap-2"
                >
                    <X className="w-5 h-5" />
                    İptal
                </button>
                <button
                    type="submit"
                    disabled={loading}
                    className="bg-blue-600 text-white px-10 py-4.5 rounded-[2rem] font-black hover:bg-blue-700 transition-all active:scale-95 flex items-center justify-center gap-2 disabled:opacity-50 shadow-xl shadow-blue-500/20"
                >
                    {loading ? <Loader2 className="w-6 h-6 animate-spin" /> : <Save className="w-6 h-6" />}
                    {loading ? 'Kaydediliyor...' : (initialData ? 'Ofisi Güncelle' : 'Ofis Oluştur')}
                </button>
            </div>
        </form>
    )
}
