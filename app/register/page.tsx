'use client'

import { useState } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { Loader2, User, Mail, Lock, ArrowLeft, Sparkles, UserPlus } from 'lucide-react'

const registerSchema = z.object({
    name: z.string().min(2, 'İsim en az 2 karakter olmalıdır'),
    email: z.string().email('Geçersiz e-posta adresi'),
    password: z.string().min(6, 'Şifre en az 6 karakter olmalıdır'),
})

type RegisterForm = z.infer<typeof registerSchema>

export default function RegisterPage() {
    const router = useRouter()
    const [error, setError] = useState('')
    const [loading, setLoading] = useState(false)

    const { register, handleSubmit, formState: { errors } } = useForm<RegisterForm>({
        resolver: zodResolver(registerSchema),
    })

    const onSubmit = async (data: RegisterForm) => {
        setError('')
        setLoading(true)
        try {
            const res = await fetch('/api/register', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(data),
            })

            const json = await res.json()

            if (!res.ok) {
                if (json.error === "User already exists") {
                    throw new Error("Bu e-posta zaten kayıtlı. Lütfen giriş yapın.")
                }
                throw new Error(json.error || 'Kayıt başarısız')
            }

            router.push('/login')
        } catch (err: any) {
            setError(err.message)
        } finally {
            setLoading(false)
        }
    }

    return (
        <div className="flex flex-col lg:flex-row bg-surface rounded-[3rem] overflow-hidden border border-border-subtle shadow-2xl animate-fade-in-up md:min-h-[700px]">
            {/* Left Side - Image/Brand */}
            <div className="hidden lg:flex lg:w-1/2 relative bg-black">
                <div className="absolute inset-0 bg-gradient-to-br from-indigo-900/60 to-black/80 z-10" />
                <img
                    src="https://images.unsplash.com/photo-1503376763036-066120622c74?auto=format&fit=crop&q=80&w=1920"
                    alt="Luxury Sportscar"
                    className="absolute inset-0 w-full h-full object-cover opacity-60"
                />
                <div className="relative z-20 flex flex-col justify-between p-16 w-full text-white">
                    <div className="animate-fade-in-up">
                        <Link href="/" className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/10 hover:bg-white/20 backdrop-blur-md border border-white/10 transition-all text-sm font-bold">
                            <ArrowLeft className="w-4 h-4" /> Ana Sayfaya Dön
                        </Link>
                    </div>
                    <div className="animate-fade-in-up" style={{ animationDelay: '100ms' }}>
                        <div className="inline-flex items-center gap-2 mb-6 px-4 py-2 rounded-full bg-indigo-500/20 border border-indigo-500/30 text-indigo-400 text-xs font-black uppercase tracking-widest">
                            <Sparkles className="w-4 h-4" />
                            Premium Deneyim
                        </div>
                        <h1 className="text-6xl font-black mb-8 leading-[1.1] tracking-tighter">Seçkin<br />Kulübe Katılın.</h1>
                        <p className="text-xl text-gray-300 max-w-md font-medium leading-relaxed">Özel fırsatlardan yararlanmak ve premium rezervasyonlarınızı sorunsuzca yönetmek için bir hesap oluşturun.</p>
                    </div>
                </div>
            </div>

            {/* Right Side - Form */}
            <div className="flex-1 flex flex-col justify-center p-8 lg:p-20 bg-surface dark:bg-surface">
                <div className="w-full max-w-md mx-auto">
                    <div className="mb-12">
                        <h2 className="text-4xl font-black text-foreground mb-3 tracking-tight">Hesap Oluştur</h2>
                        <p className="text-gray-500 dark:text-gray-400 font-bold">Başlamak için bilgilerinizi girin</p>
                    </div>

                    {error && (
                        <div className="bg-red-500/10 border border-red-500/20 text-red-500 p-5 rounded-2xl mb-8 text-sm font-black flex items-center gap-3 animate-fade-in-up">
                            <div className="w-2 h-2 bg-red-500 rounded-full" />
                            {error}
                        </div>
                    )}

                    <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
                        <div className="space-y-3">
                            <label className="text-xs font-black text-gray-400 uppercase tracking-widest ml-1">Ad Soyad</label>
                            <div className="relative group">
                                <div className="absolute left-4 top-1/2 -translate-y-1/2 w-10 h-10 flex items-center justify-center rounded-xl bg-background border border-border-subtle group-focus-within:border-blue-500/50 transition-colors">
                                    <User className="w-5 h-5 text-gray-400 group-focus-within:text-blue-500" />
                                </div>
                                <input
                                    {...register('name')}
                                    type="text"
                                    className="w-full pl-16 pr-5 py-4.5 rounded-3xl border border-border-subtle bg-background font-bold text-foreground focus:ring-4 focus:ring-blue-500/5 focus:border-blue-500 outline-none transition-all placeholder:text-gray-500"
                                    placeholder="John Doe"
                                />
                            </div>
                            {errors.name && <p className="text-red-500 text-xs mt-2 ml-1 font-black">{errors.name.message}</p>}
                        </div>

                        <div className="space-y-3">
                            <label className="text-xs font-black text-gray-400 uppercase tracking-widest ml-1">E-posta Adresi</label>
                            <div className="relative group">
                                <div className="absolute left-4 top-1/2 -translate-y-1/2 w-10 h-10 flex items-center justify-center rounded-xl bg-background border border-border-subtle group-focus-within:border-blue-500/50 transition-colors">
                                    <Mail className="w-5 h-5 text-gray-400 group-focus-within:text-blue-500" />
                                </div>
                                <input
                                    {...register('email')}
                                    type="email"
                                    className="w-full pl-16 pr-5 py-4.5 rounded-3xl border border-border-subtle bg-background font-bold text-foreground focus:ring-4 focus:ring-blue-500/5 focus:border-blue-500 outline-none transition-all placeholder:text-gray-500"
                                    placeholder="you@example.com"
                                />
                            </div>
                            {errors.email && <p className="text-red-500 text-xs mt-2 ml-1 font-black">{errors.email.message}</p>}
                        </div>

                        <div className="space-y-3">
                            <label className="text-xs font-black text-gray-400 uppercase tracking-widest ml-1">Şifre</label>
                            <div className="relative group">
                                <div className="absolute left-4 top-1/2 -translate-y-1/2 w-10 h-10 flex items-center justify-center rounded-xl bg-background border border-border-subtle group-focus-within:border-blue-500/50 transition-colors">
                                    <Lock className="w-5 h-5 text-gray-400 group-focus-within:text-blue-500" />
                                </div>
                                <input
                                    {...register('password')}
                                    type="password"
                                    className="w-full pl-16 pr-5 py-4.5 rounded-3xl border border-border-subtle bg-background font-bold text-foreground focus:ring-4 focus:ring-blue-500/5 focus:border-blue-500 outline-none transition-all placeholder:text-gray-500"
                                    placeholder="••••••••"
                                />
                            </div>
                            {errors.password && <p className="text-red-500 text-xs mt-2 ml-1 font-black">{errors.password.message}</p>}
                        </div>

                        <button
                            type="submit"
                            disabled={loading}
                            className="w-full bg-indigo-600 hover:bg-indigo-700 text-white font-black py-5 rounded-[2rem] transition-all active:scale-95 flex items-center justify-center disabled:opacity-50 shadow-xl shadow-indigo-500/20 hover:shadow-indigo-500/40 mt-4"
                        >
                            {loading ? <Loader2 className="animate-spin h-6 w-6" /> : (
                                <>
                                    <UserPlus className="w-5 h-5 mr-2" />
                                    Hesap Oluştur
                                </>
                            )}
                        </button>
                    </form>

                    <div className="mt-12 text-center text-sm font-bold text-gray-500">
                        Zaten hesabınız var mı?{' '}
                        <Link href="/login" className="text-indigo-600 hover:text-indigo-700 hover:underline font-black ml-1">
                            Giriş yap
                        </Link>
                    </div>
                </div>
            </div>
        </div>
    )
}
