'use client'

import { useState } from 'react'
import ProfileSidebar from './ProfileSidebar'
import ReservationList from './ReservationList'
import ProfileForm from './ProfileForm'
import LegalSection from './LegalSection'
import CarCard from '@/components/CarCard'
import { useRouter } from 'next/navigation'
import { Sparkles, History, Calendar, ShieldCheck, Heart } from 'lucide-react'

interface ReservationItem {
    id: string
    startDate: Date | string
    endDate: Date | string
    status: string
    totalAmount: number
    car: {
        id: string
        make: string
        model: string
        imageUrl: string
        pricePerDay: number
        year: number
        fuelType: string
        transmission: string
        office: {
            name: string
        }
    }
}

interface ProfileViewProps {
    user: {
        name: string
        email: string
    }
    reservations: {
        active: ReservationItem[]
        upcoming: ReservationItem[]
        past: ReservationItem[]
    }
    favorites: any[]
}

export default function ProfileView({ user, reservations, favorites }: ProfileViewProps) {
    const [activeTab, setActiveTab] = useState('reservations')
    const router = useRouter()

    const handleLogout = async () => {
        await fetch('/api/logout', { method: 'POST' })
        router.push('/login')
        router.refresh()
    }

    return (
        <div className="flex flex-col lg:flex-row gap-8 lg:gap-12 pb-20 mt-4 md:mt-8">
            <div className="lg:w-80 flex-shrink-0">
                <ProfileSidebar
                    activeTab={activeTab}
                    onTabChange={setActiveTab}
                    onLogout={handleLogout}
                />
            </div>

            <div className="flex-1 min-w-0">
                <div className="bg-surface rounded-[2.5rem] shadow-2xl shadow-black/5 border border-border-subtle p-8 md:p-12 animate-fade-in-up min-h-[600px]">
                    {activeTab === 'profile' && (
                        <div>
                            <ProfileForm user={user} />
                        </div>
                    )}

                    {activeTab === 'reservations' && (
                        <div className="space-y-12">
                            <div>
                                <div className="flex items-center gap-4 mb-10">
                                    <div className="w-12 h-12 rounded-2xl bg-blue-500/10 flex items-center justify-center">
                                        <Calendar className="w-6 h-6 text-blue-600" />
                                    </div>
                                    <div>
                                        <h2 className="text-3xl font-black text-foreground tracking-tight">Rezervasyonlarım</h2>
                                        <p className="text-sm text-gray-500 font-medium">Tüm kiralama geçmişinizi ve aktif rezervasyonlarınızı yönetin.</p>
                                    </div>
                                </div>

                                <div className="space-y-16">
                                    {reservations.active.length > 0 && (
                                        <section>
                                            <div className="flex items-center gap-3 mb-6">
                                                <div className="w-2.5 h-2.5 bg-emerald-500 rounded-full animate-pulse shadow-[0_0_10px_rgba(16,185,129,0.5)]" />
                                                <h3 className="text-xl font-black text-foreground tracking-tight uppercase">Aktif Kiralamalar</h3>
                                            </div>
                                            <ReservationList reservations={reservations.active} type="active" />
                                        </section>
                                    )}

                                    <section>
                                        <div className="flex items-center gap-3 mb-6">
                                            <div className="w-2.5 h-2.5 bg-blue-500 rounded-full" />
                                            <h3 className="text-xl font-black text-foreground tracking-tight uppercase">Yaklaşan Seyahatler</h3>
                                        </div>
                                        <ReservationList reservations={reservations.upcoming} type="upcoming" />
                                    </section>

                                    <section>
                                        <div className="flex items-center gap-3 mb-6">
                                            <div className="w-2.5 h-2.5 bg-gray-400 rounded-full" />
                                            <h3 className="text-xl font-black text-foreground tracking-tight uppercase">Geçmiş Tamamlananlar</h3>
                                        </div>
                                        <ReservationList reservations={reservations.past} type="past" />
                                    </section>
                                </div>
                            </div>
                        </div>
                    )}

                    {activeTab === 'favorites' && (
                        <div>
                            <div className="flex items-center gap-4 mb-10">
                                <div className="w-12 h-12 rounded-2xl bg-rose-500/10 flex items-center justify-center">
                                    <Heart className="w-6 h-6 text-rose-500 fill-current" />
                                </div>
                                <div>
                                    <h2 className="text-3xl font-black text-foreground tracking-tight">Favorilerim</h2>
                                    <p className="text-sm text-gray-500 font-medium">Beğendiğiniz ve daha sonra kiralamayı düşündüğünüz araçlar.</p>
                                </div>
                            </div>

                            {favorites.length === 0 ? (
                                <div className="text-center py-20 bg-background/50 rounded-[2rem] border border-dashed border-border-subtle">
                                    <Heart className="w-12 h-12 text-gray-300 mx-auto mb-4" />
                                    <p className="text-gray-500 font-bold">Henüz favori aracınız yok.</p>
                                </div>
                            ) : (
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                                    {favorites.map((car) => (
                                        <CarCard key={car.id} car={car} isFavoriteInitial={true} />
                                    ))}
                                </div>
                            )}
                        </div>
                    )}

                    {activeTab === 'legal' && (
                        <div>
                            <div className="flex items-center gap-4 mb-10">
                                <div className="w-12 h-12 rounded-2xl bg-indigo-500/10 flex items-center justify-center">
                                    <ShieldCheck className="w-6 h-6 text-indigo-600" />
                                </div>
                                <h2 className="text-3xl font-black text-foreground tracking-tight">Yasal ve Destek</h2>
                            </div>
                            <LegalSection />
                        </div>
                    )}
                </div>
            </div>
        </div>
    )
}
