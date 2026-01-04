'use client'

import { User, Calendar, Settings, Shield, LogOut, Heart } from 'lucide-react'
import { cn } from '@/lib/utils'

interface ProfileSidebarProps {
    activeTab: string
    onTabChange: (tab: string) => void
    onLogout: () => void
}

export default function ProfileSidebar({ activeTab, onTabChange, onLogout }: ProfileSidebarProps) {
    const menuItems = [
        { id: 'profile', label: 'Profilim', icon: User },
        { id: 'reservations', label: 'Rezervasyonlarım', icon: Calendar },
        { id: 'favorites', label: 'Favorilerim', icon: Heart },
        { id: 'legal', label: 'Yasal & Destek', icon: Shield },
    ]

    return (
        <div className="bg-surface border border-border-subtle rounded-[2rem] p-6 shadow-xl shadow-black/5 lg:sticky lg:top-28 animate-fade-in-up">
            <div className="flex items-center gap-4 mb-8 px-2">
                <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-blue-600 to-indigo-600 flex items-center justify-center text-white font-black text-xl shadow-lg shadow-blue-500/20">
                    {menuItems.find(i => i.id === activeTab)?.icon && (
                        <User className="w-6 h-6" />
                    )}
                </div>
                <div>
                    <p className="text-[10px] text-gray-400 font-black uppercase tracking-[0.2em] mb-0.5">Yönetim</p>
                    <p className="text-sm font-black text-foreground tracking-tight">Kullanıcı Paneli</p>
                </div>
            </div>

            <nav className="space-y-2">
                {menuItems.map((item) => (
                    <button
                        key={item.id}
                        onClick={() => onTabChange(item.id)}
                        className={cn(
                            "w-full flex items-center gap-4 px-5 py-4 rounded-2xl text-sm font-bold transition-all duration-300 group",
                            activeTab === item.id
                                ? "bg-blue-600 text-white shadow-xl shadow-blue-500/25"
                                : "text-gray-500 hover:text-foreground hover:bg-surface-hover"
                        )}
                    >
                        <item.icon className={cn("w-5 h-5 transition-transform duration-300", activeTab === item.id ? "scale-110" : "group-hover:scale-110")} />
                        <span>{item.label}</span>
                    </button>
                ))}

                <div className="pt-6 mt-6 border-t border-border-subtle">
                    <button
                        onClick={onLogout}
                        className="w-full flex items-center gap-4 px-5 py-4 rounded-2xl text-sm font-bold text-red-500 hover:bg-red-500/10 transition-all duration-300 active:scale-95"
                    >
                        <LogOut className="w-5 h-5" />
                        Çıkış Yap
                    </button>
                </div>
            </nav>
        </div>
    )
}
