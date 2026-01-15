'use client'

import { useRouter, useSearchParams } from 'next/navigation'
import { Search, Filter, X, ChevronDown, Tag } from 'lucide-react'
import { useState, useEffect } from 'react'

interface Office {
    id: string
    name: string
}

interface Category {
    id: string
    name: string
}

export default function CarFilter({ offices, categories }: { offices: Office[], categories: Category[] }) {
    const router = useRouter()
    const searchParams = useSearchParams()

    const [search, setSearch] = useState(searchParams.get('search') || '')
    const [office, setOffice] = useState(searchParams.get('office') || '')
    const [fuel, setFuel] = useState(searchParams.get('fuel') || '')
    const [transmission, setTransmission] = useState(searchParams.get('transmission') || '')
    const [category, setCategory] = useState(searchParams.get('category') || '')

    const handleFilter = () => {
        const params = new URLSearchParams()
        if (search) params.set('search', search)
        if (office) params.set('office', office)
        if (fuel) params.set('fuel', fuel)
        if (transmission) params.set('transmission', transmission)
        if (category) params.set('category', category)

        router.push(`/dashboard?${params.toString()}`)
    }

    const clearFilters = () => {
        setSearch('')
        setOffice('')
        setFuel('')
        setTransmission('')
        setCategory('')
        router.push('/dashboard')
    }

    return (
        <div className="bg-surface dark:bg-surface rounded-[2.5rem] shadow-2xl shadow-blue-500/5 border border-border-subtle p-8 -mt-16 relative z-20 mx-4 backdrop-blur-xl animate-fade-in-up">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-6 gap-5">
                {/* Search */}
                <div className="lg:col-span-2 relative group">
                    <Search className="absolute left-5 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400 group-focus-within:text-blue-500 transition-colors" />
                    <input
                        type="text"
                        value={search}
                        onChange={(e) => setSearch(e.target.value)}
                        placeholder="Marka veya model ile ara..."
                        className="w-full pl-14 pr-5 py-5 bg-background dark:bg-background/50 border border-border-subtle rounded-3xl focus:ring-4 focus:ring-blue-500/10 focus:border-blue-500 outline-none transition-all placeholder:text-gray-500 font-bold text-foreground"
                    />
                </div>

                {/* Office */}
                <div className="relative group">
                    <select
                        value={office}
                        onChange={(e) => setOffice(e.target.value)}
                        className="w-full pl-5 pr-12 py-5 bg-background dark:bg-background/50 border border-border-subtle rounded-3xl focus:ring-4 focus:ring-blue-500/10 focus:border-blue-500 outline-none transition-all font-bold text-foreground appearance-none cursor-pointer"
                    >
                        <option value="">Tüm Lokasyonlar</option>
                        {offices.map(o => (
                            <option key={o.id} value={o.id}>{o.name}</option>
                        ))}
                    </select>
                    <ChevronDown className="absolute right-5 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400 pointer-events-none group-focus-within:rotate-180 transition-transform" />
                </div>

                {/* Category */}
                <div className="relative group">
                    <select
                        value={category}
                        onChange={(e) => setCategory(e.target.value)}
                        className="w-full pl-5 pr-12 py-5 bg-background dark:bg-background/50 border border-border-subtle rounded-3xl focus:ring-4 focus:ring-blue-500/10 focus:border-blue-500 outline-none transition-all font-bold text-foreground appearance-none cursor-pointer"
                    >
                        <option value="">Kategoriler</option>
                        {categories.map(c => (
                            <option key={c.id} value={c.id}>{c.name}</option>
                        ))}
                    </select>
                    <ChevronDown className="absolute right-5 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400 pointer-events-none" />
                </div>

                {/* Fuel */}
                <div className="relative group">
                    <select
                        value={fuel}
                        onChange={(e) => setFuel(e.target.value)}
                        className="w-full pl-5 pr-12 py-5 bg-background dark:bg-background/50 border border-border-subtle rounded-3xl focus:ring-4 focus:ring-blue-500/10 focus:border-blue-500 outline-none transition-all font-bold text-foreground appearance-none cursor-pointer"
                    >
                        <option value="">Tüm Yakıtlar</option>
                        <option value="Petrol">Benzin</option>
                        <option value="Diesel">Dizel</option>
                        <option value="Electric">Elektrik</option>
                        <option value="Hybrid">Hibrit</option>
                    </select>
                    <ChevronDown className="absolute right-5 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400 pointer-events-none" />
                </div>

                {/* Search Button */}
                <div className="flex gap-3">
                    <button
                        onClick={handleFilter}
                        className="flex-1 bg-blue-600 text-white font-black py-5 rounded-3xl hover:bg-blue-700 transition-all active:scale-95 flex items-center justify-center gap-2 shadow-xl shadow-blue-500/30"
                    >
                        Ara
                    </button>
                    {(search || office || fuel || transmission || category) && (
                        <button
                            onClick={clearFilters}
                            className="px-5 py-5 bg-background dark:bg-background/50 text-gray-400 hover:text-red-500 hover:bg-red-50 dark:hover:bg-red-500/10 rounded-3xl transition-all border border-border-subtle active:scale-95"
                            title="Filtreleri temizle"
                        >
                            <X className="w-6 h-6" />
                        </button>
                    )}
                </div>
            </div>

            {/* Sub-Filters / Chips */}
            <div className="flex flex-wrap gap-3 mt-6">
                <span className="text-sm font-bold text-gray-400 self-center mr-2 uppercase tracking-widest">Vites:</span>
                {[{ label: 'Otomatik', value: 'Automatic' }, { label: 'Manuel', value: 'Manual' }].map((type) => (
                    <button
                        key={type.value}
                        onClick={() => setTransmission(transmission === type.value ? '' : type.value)}
                        className={`px-6 py-2.5 rounded-2xl text-sm font-bold transition-all border-2 ${transmission === type.value
                            ? 'bg-blue-600 text-white border-blue-600 shadow-xl shadow-blue-500/20'
                            : 'bg-background dark:bg-background/30 text-gray-500 border-border-subtle hover:border-blue-500/50 hover:text-blue-500'
                            }`}
                    >
                        {type.label}
                    </button>
                ))}
            </div>
        </div>
    )
}
