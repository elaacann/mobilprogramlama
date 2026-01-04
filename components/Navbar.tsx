'use client'

import Link from 'next/link'
import { useAuth } from '@/components/providers/AuthProvider'
import { LogOut, User, Menu, X, Car, LayoutDashboard, Settings } from 'lucide-react'
import { useState, useEffect } from 'react'
import { usePathname } from 'next/navigation'

export default function Navbar() {
    const { user, logout } = useAuth()
    const [isOpen, setIsOpen] = useState(false)
    const [scrolled, setScrolled] = useState(false)
    const pathname = usePathname()

    useEffect(() => {
        const handleScroll = () => {
            setScrolled(window.scrollY > 10)
        }
        window.addEventListener('scroll', handleScroll)
        return () => window.removeEventListener('scroll', handleScroll)
    }, [])

    useEffect(() => {
        setIsOpen(false)
    }, [pathname])

    const navLinks = [
        { href: '/dashboard', label: 'Araçlar', icon: Car },
        { href: '/reservations', label: 'Rezervasyonlarım', icon: LayoutDashboard },
        { href: '/profile', label: 'Profilim', icon: User },
    ]

    return (
        <nav className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${scrolled ? 'bg-surface/80 dark:bg-surface/90 backdrop-blur-lg border-b border-border-subtle py-3 shadow-lg shadow-black/5' : 'bg-transparent py-5'
            }`}>
            <div className="max-w-7xl mx-auto px-4 md:px-8">
                <div className="flex justify-between items-center">
                    {/* Logo */}
                    <Link href="/" className="flex items-center gap-3 group">
                        <div className="w-10 h-10 bg-gradient-to-tr from-blue-600 to-indigo-600 rounded-xl flex items-center justify-center text-white font-bold text-xl shadow-lg shadow-blue-500/30 group-hover:scale-105 transition-transform duration-300">
                            C
                        </div>
                        <span className="text-xl font-bold tracking-tight text-foreground bg-clip-text">
                            OtoKiralama
                        </span>
                    </Link>

                    {/* Desktop Navigation */}
                    <div className="hidden md:flex items-center gap-2">
                        {user ? (
                            <>
                                {navLinks.map((link) => (
                                    <Link
                                        key={link.href}
                                        href={link.href}
                                        className={`px-4 py-2 rounded-lg text-sm font-medium transition-all ${pathname === link.href
                                                ? 'text-blue-600 bg-blue-50 dark:bg-blue-500/10'
                                                : 'text-gray-500 hover:text-foreground hover:bg-surface-hover'
                                            }`}
                                    >
                                        {link.label}
                                    </Link>
                                ))}

                                {user.role === 'ADMIN' && (
                                    <Link
                                        href="/admin/dashboard"
                                        className="ml-2 px-4 py-2 rounded-lg text-sm font-bold text-white bg-indigo-600 hover:bg-indigo-700 shadow-md shadow-indigo-500/20 transition-all"
                                    >
                                        Yönetici Paneli
                                    </Link>
                                )}

                                <div className="h-6 w-px bg-border-subtle mx-3" />

                                <div className="flex items-center gap-2">
                                    <div className="w-9 h-9 rounded-full bg-gradient-to-br from-blue-500 to-indigo-600 text-white flex items-center justify-center font-bold text-sm shadow-md">
                                        {user.name.charAt(0)}
                                    </div>
                                    <button
                                        onClick={logout}
                                        className="p-2 text-gray-400 hover:text-red-500 rounded-lg hover:bg-red-50 dark:hover:bg-red-500/10 transition-colors"
                                        title="Çıkış Yap"
                                    >
                                        <LogOut className="w-5 h-5" />
                                    </button>
                                </div>
                            </>
                        ) : (
                            <div className="flex items-center gap-4">
                                <Link href="/login" className="text-sm font-medium text-gray-500 hover:text-foreground transition-colors">
                                    Giriş Yap
                                </Link>
                                <Link href="/register" className="bg-blue-600 text-white px-6 py-2.5 rounded-xl text-sm font-bold shadow-lg shadow-blue-500/30 hover:shadow-blue-500/40 hover:-translate-y-0.5 transition-all duration-300">
                                    Kayıt Ol
                                </Link>
                            </div>
                        )}
                    </div>

                    {/* Mobile Menu Button */}
                    <button
                        onClick={() => setIsOpen(!isOpen)}
                        className="md:hidden p-2 text-gray-500 hover:bg-surface-hover rounded-lg transition-colors border border-border-subtle"
                    >
                        {isOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
                    </button>
                </div>
            </div>

            {/* Mobile Menu */}
            {isOpen && (
                <div className="md:hidden absolute top-full left-0 right-0 bg-surface dark:bg-surface border-b border-border-subtle shadow-2xl animate-fade-in-up">
                    <div className="p-4 space-y-2">
                        {user ? (
                            <>
                                <div className="flex items-center gap-4 p-3 bg-gray-50 dark:bg-gray-900/50 rounded-xl mb-4">
                                    <div className="w-12 h-12 rounded-full bg-gradient-to-br from-blue-500 to-indigo-600 text-white flex items-center justify-center font-bold text-lg shadow-lg">
                                        {user.name.charAt(0)}
                                    </div>
                                    <div>
                                        <p className="font-bold text-foreground">{user.name}</p>
                                        <p className="text-xs text-gray-500">{user.email}</p>
                                    </div>
                                </div>
                                {navLinks.map((link) => (
                                    <Link
                                        key={link.href}
                                        href={link.href}
                                        className={`flex items-center gap-3 px-4 py-3 rounded-xl font-medium ${pathname === link.href
                                                ? 'text-blue-600 bg-blue-50 dark:bg-blue-500/10'
                                                : 'text-gray-600 dark:text-gray-400 hover:bg-surface-hover'
                                            }`}
                                    >
                                        <link.icon className="w-5 h-5" />
                                        {link.label}
                                    </Link>
                                ))}
                                {user.role === 'ADMIN' && (
                                    <Link
                                        href="/admin/dashboard"
                                        className="flex items-center gap-3 px-4 py-3 rounded-xl font-bold bg-indigo-600 text-white"
                                    >
                                        <Settings className="w-5 h-5" />
                                        Yönetici Paneli
                                    </Link>
                                )}
                                <button
                                    onClick={logout}
                                    className="w-full flex items-center gap-3 px-4 py-3 rounded-xl font-medium text-red-600 hover:bg-red-50 dark:hover:bg-red-500/10 transition-colors"
                                >
                                    <LogOut className="w-5 h-5" />
                                    Çıkış Yap
                                </button>
                            </>
                        ) : (
                            <div className="grid grid-cols-2 gap-3 pt-2">
                                <Link href="/login" className="flex items-center justify-center px-4 py-3 rounded-xl font-medium text-foreground border border-border-subtle hover:bg-surface-hover">Giriş Yap</Link>
                                <Link href="/register" className="flex items-center justify-center px-4 py-3 rounded-xl font-bold bg-blue-600 text-white shadow-lg shadow-blue-500/20">Kayıt Ol</Link>
                            </div>
                        )}
                    </div>
                </div>
            )}
        </nav>
    )
}
