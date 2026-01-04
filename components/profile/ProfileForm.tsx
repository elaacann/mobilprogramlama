'use client'

import { useState } from 'react'
import { User, Mail, ShieldCheck, Save, Edit3 } from 'lucide-react'

interface ProfileFormProps {
    user: {
        name: string
        email: string
    }
}

export default function ProfileForm({ user }: ProfileFormProps) {
    const [name, setName] = useState(user.name)
    const [isEditing, setIsEditing] = useState(false)
    const [loading, setLoading] = useState(false)

    const handleSave = async () => {
        setLoading(true)
        // Simulated API call
        setTimeout(() => {
            setIsEditing(false)
            setLoading(false)
        }, 800)
    }

    return (
        <div className="max-w-2xl animate-fade-in-up">
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-10 gap-4">
                <div>
                    <h3 className="text-2xl font-black text-foreground tracking-tight">Kişisel Bilgiler</h3>
                    <p className="text-sm text-gray-500 font-medium mt-1">Hesap bilgilerinizi buradan güncelleyebilirsiniz.</p>
                </div>
                <button
                    onClick={() => isEditing ? handleSave() : setIsEditing(true)}
                    disabled={loading}
                    className={`w-full sm:w-auto px-6 py-3 rounded-2xl text-sm font-black transition-all active:scale-95 flex items-center justify-center gap-2
                        ${isEditing
                            ? 'bg-blue-600 text-white shadow-xl shadow-blue-500/20 hover:bg-blue-700'
                            : 'bg-surface-hover text-foreground hover:bg-border-subtle'}`}
                >
                    {isEditing ? (
                        <>
                            <Save className={`w-4 h-4 ${loading ? 'animate-pulse' : ''}`} />
                            {loading ? 'Kaydediliyor...' : 'Değişiklikleri Kaydet'}
                        </>
                    ) : (
                        <>
                            <Edit3 className="w-4 h-4" />
                            Profili Düzenle
                        </>
                    )}
                </button>
            </div>

            <div className="grid grid-cols-1 gap-8">
                <div className="space-y-3">
                    <label className="text-xs font-black text-gray-400 uppercase tracking-widest ml-1">Ad Soyad</label>
                    <div className="relative group">
                        <div className="absolute left-4 top-1/2 -translate-y-1/2 w-10 h-10 flex items-center justify-center rounded-xl bg-background/50 border border-border-subtle transition-colors group-focus-within:border-blue-500/50">
                            <User className="w-5 h-5 text-gray-400 group-focus-within:text-blue-500 transition-colors" />
                        </div>
                        <input
                            type="text"
                            value={name}
                            disabled={!isEditing}
                            onChange={(e) => setName(e.target.value)}
                            className="w-full pl-16 pr-5 py-4.5 rounded-3xl border border-border-subtle bg-background font-bold text-foreground focus:ring-4 focus:ring-blue-500/5 focus:border-blue-500 outline-none disabled:opacity-60 disabled:bg-surface-hover/30 transition-all placeholder:text-gray-500"
                            placeholder="Adınızı girin"
                        />
                    </div>
                </div>

                <div className="space-y-3">
                    <label className="text-xs font-black text-gray-400 uppercase tracking-widest ml-1">E-posta Adresi</label>
                    <div className="relative group">
                        <div className="absolute left-4 top-1/2 -translate-y-1/2 w-10 h-10 flex items-center justify-center rounded-xl bg-background border border-border-subtle">
                            <Mail className="w-5 h-5 text-gray-400" />
                        </div>
                        <input
                            type="email"
                            value={user.email}
                            disabled={true}
                            className="w-full pl-16 pr-5 py-4.5 rounded-3xl border border-border-subtle bg-surface-hover text-gray-500 cursor-not-allowed font-bold"
                        />
                    </div>
                    <div className="flex items-start gap-4 p-5 rounded-3xl bg-amber-500/5 border border-amber-500/20 text-amber-600 dark:text-amber-500">
                        <ShieldCheck className="w-6 h-6 flex-shrink-0 mt-0.5" />
                        <p className="text-sm font-bold leading-relaxed">
                            Güvenlik nedeniyle e-posta adresiniz doğrudan değiştirilemez.
                            Güncelleme için lütfen destek ekibimizle iletişime geçin.
                        </p>
                    </div>
                </div>
            </div>
        </div>
    )
}
