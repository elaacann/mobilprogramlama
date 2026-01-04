'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { Loader2, Upload, MapPin, Car, Tag, Activity, Settings, Save, X } from 'lucide-react'

interface Office {
    id: string
    name: string
}

interface CarFormProps {
    offices: Office[]
    initialData?: {
        id: string
        make: string
        model: string
        year: number
        pricePerDay: number
        imageUrl: string
        description: string | null
        transmission: string
        fuelType: string
        officeId: string
    }
}

export default function CarForm({ offices, initialData }: CarFormProps) {
    const router = useRouter()
    const [loading, setLoading] = useState(false)
    const [error, setError] = useState('')

    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault()
        setLoading(true)
        setError('')

        const formData = new FormData(e.currentTarget)
        const data = {
            make: formData.get('make'),
            model: formData.get('model'),
            year: Number(formData.get('year')),
            pricePerDay: Number(formData.get('pricePerDay')),
            imageUrl: formData.get('imageUrl'),
            description: formData.get('description'),
            transmission: formData.get('transmission'),
            fuelType: formData.get('fuelType'),
            officeId: formData.get('officeId'),
        }

        try {
            const url = initialData
                ? `/api/admin/cars/${initialData.id}`
                : '/api/admin/cars'

            const method = initialData ? 'PATCH' : 'POST'

            const res = await fetch(url, {
                method,
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(data)
            })

            const json = await res.json()

            if (!res.ok) {
                throw new Error(json.error || 'Araç kaydedilemedi')
            }

            router.push('/admin/cars')
            router.refresh()
        } catch (err: any) {
            setError(err.message)
        } finally {
            setLoading(false)
        }
    }

    return (
        <form onSubmit={handleSubmit} className="space-y-10">
            {error && (
                <div className="bg-red-500/10 border border-red-500/20 text-red-500 p-5 rounded-2xl text-sm font-black animate-fade-in-up flex items-center gap-3">
                    <div className="w-2 h-2 bg-red-500 rounded-full" />
                    {error}
                </div>
            )}

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                <div className="space-y-3">
                    <label className="text-xs font-black text-gray-400 uppercase tracking-widest ml-1 flex items-center gap-2">
                        <Tag className="w-4 h-4" /> Marka
                    </label>
                    <input
                        name="make"
                        required
                        defaultValue={initialData?.make}
                        type="text"
                        className="w-full px-6 py-4.5 bg-background dark:bg-background/50 border border-border-subtle rounded-3xl focus:ring-4 focus:ring-blue-500/5 focus:border-blue-500 outline-none transition-all font-bold text-foreground placeholder:text-gray-500"
                        placeholder="Örn: BMW"
                    />
                </div>
                <div className="space-y-3">
                    <label className="text-xs font-black text-gray-400 uppercase tracking-widest ml-1 flex items-center gap-2">
                        <Car className="w-4 h-4" /> Model
                    </label>
                    <input
                        name="model"
                        required
                        defaultValue={initialData?.model}
                        type="text"
                        className="w-full px-6 py-4.5 bg-background dark:bg-background/50 border border-border-subtle rounded-3xl focus:ring-4 focus:ring-blue-500/5 focus:border-blue-500 outline-none transition-all font-bold text-foreground placeholder:text-gray-500"
                        placeholder="Örn: M4 Competition"
                    />
                </div>
                <div className="space-y-3">
                    <label className="text-xs font-black text-gray-400 uppercase tracking-widest ml-1">Model Yılı</label>
                    <input
                        name="year"
                        required
                        defaultValue={initialData?.year}
                        type="number"
                        min="1900"
                        max={new Date().getFullYear() + 1}
                        className="w-full px-6 py-4.5 bg-background dark:bg-background/50 border border-border-subtle rounded-3xl focus:ring-4 focus:ring-blue-500/5 focus:border-blue-500 outline-none transition-all font-bold text-foreground placeholder:text-gray-500"
                        placeholder="Örn: 2024"
                    />
                </div>
                <div className="space-y-3">
                    <label className="text-xs font-black text-gray-400 uppercase tracking-widest ml-1 flex items-center gap-2">
                        <Activity className="w-4 h-4" /> Günlük Ücret (₺)
                    </label>
                    <input
                        name="pricePerDay"
                        required
                        defaultValue={initialData?.pricePerDay}
                        type="number"
                        min="0"
                        step="0.01"
                        className="w-full px-6 py-4.5 bg-background dark:bg-background/50 border border-border-subtle rounded-3xl focus:ring-4 focus:ring-blue-500/5 focus:border-blue-500 outline-none transition-all font-black text-foreground placeholder:text-gray-500"
                        placeholder="Örn: 2500"
                    />
                </div>
            </div>

            <div className="space-y-3">
                <label className="text-xs font-black text-gray-400 uppercase tracking-widest ml-1 flex items-center gap-2">
                    <Upload className="w-4 h-4" /> Görsel URL
                </label>
                <div className="relative group">
                    <input
                        name="imageUrl"
                        required
                        defaultValue={initialData?.imageUrl}
                        type="url"
                        className="w-full pl-6 pr-6 py-4.5 bg-background dark:bg-background/50 border border-border-subtle rounded-3xl focus:ring-4 focus:ring-blue-500/5 focus:border-blue-500 outline-none transition-all font-bold text-foreground placeholder:text-gray-500 text-sm"
                        placeholder="https://images.unsplash.com/..."
                    />
                </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                <div className="space-y-3">
                    <label className="text-xs font-black text-gray-400 uppercase tracking-widest ml-1 flex items-center gap-2">
                        <Settings className="w-4 h-4" /> Vites
                    </label>
                    <select
                        name="transmission"
                        defaultValue={initialData?.transmission}
                        className="w-full px-6 py-4.5 bg-background dark:bg-background/50 border border-border-subtle rounded-3xl focus:ring-4 focus:ring-blue-500/5 focus:border-blue-500 outline-none transition-all font-bold text-foreground appearance-none cursor-pointer"
                    >
                        <option value="Automatic">Otomatik</option>
                        <option value="Manual">Manuel</option>
                    </select>
                </div>
                <div className="space-y-3">
                    <label className="text-xs font-black text-gray-400 uppercase tracking-widest ml-1 flex items-center gap-2">
                        <Activity className="w-4 h-4" /> Yakıt Türü
                    </label>
                    <select
                        name="fuelType"
                        defaultValue={initialData?.fuelType}
                        className="w-full px-6 py-4.5 bg-background dark:bg-background/50 border border-border-subtle rounded-3xl focus:ring-4 focus:ring-blue-500/5 focus:border-blue-500 outline-none transition-all font-bold text-foreground appearance-none cursor-pointer"
                    >
                        <option value="Petrol">Benzin</option>
                        <option value="Diesel">Dizel</option>
                        <option value="Electric">Elektrik</option>
                        <option value="Hybrid">Hibrit</option>
                    </select>
                </div>
                <div className="space-y-3">
                    <label className="text-xs font-black text-gray-400 uppercase tracking-widest ml-1 flex items-center gap-2">
                        <MapPin className="w-4 h-4" /> Ofis Lokasyonu
                    </label>
                    <select
                        name="officeId"
                        required
                        defaultValue={initialData?.officeId}
                        className="w-full px-6 py-4.5 bg-background dark:bg-background/50 border border-border-subtle rounded-3xl focus:ring-4 focus:ring-blue-500/5 focus:border-blue-500 outline-none transition-all font-bold text-foreground appearance-none cursor-pointer"
                    >
                        <option value="">Ofis Seçin</option>
                        {offices.map(office => (
                            <option key={office.id} value={office.id}>{office.name}</option>
                        ))}
                    </select>
                </div>
            </div>

            <div className="space-y-3">
                <label className="text-xs font-black text-gray-400 uppercase tracking-widest ml-1">Araç Açıklaması</label>
                <textarea
                    name="description"
                    rows={4}
                    defaultValue={initialData?.description || ''}
                    className="w-full px-6 py-4.5 bg-background dark:bg-background/50 border border-border-subtle rounded-[2rem] focus:ring-4 focus:ring-blue-500/5 focus:border-blue-500 outline-none transition-all font-bold text-foreground resize-none italic placeholder:text-gray-500"
                    placeholder="Premium araç özellikleri, donanım detayları..."
                />
            </div>

            <div className="flex flex-col sm:flex-row justify-end gap-4 pt-10 border-t border-border-subtle">
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
                    className="bg-blue-600 text-white px-10 py-4.5 rounded-[2.5rem] font-black hover:bg-blue-700 transition-all active:scale-95 flex items-center justify-center gap-2 disabled:opacity-50 shadow-xl shadow-blue-500/20"
                >
                    {loading ? <Loader2 className="w-6 h-6 animate-spin" /> : <Save className="w-6 h-6" />}
                    {loading ? 'Kaydediliyor...' : (initialData ? 'Aracı Güncelle' : 'Aracı Ekle')}
                </button>
            </div>
        </form>
    )
}
