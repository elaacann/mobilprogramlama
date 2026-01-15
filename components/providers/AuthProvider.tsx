'use client'

import { createContext, useContext, useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'

interface User {
    id: string
    name: string
    email: string
    role: 'ADMIN' | 'USER'
}

interface AuthContextType {
    user: User | null
    loading: boolean
    login: (userData: User) => void
    logout: () => void
}

const AuthContext = createContext<AuthContextType>({
    user: null,
    loading: true,
    login: () => { },
    logout: () => { },
})

export function AuthProvider({ children }: { children: React.ReactNode }) {
    const [user, setUser] = useState<User | null>(null)
    const [loading, setLoading] = useState(true)
    const router = useRouter()

    useEffect(() => {
        async function checkAuth() {
            try {
                const res = await fetch('/api/me')
                const data = await res.json()
                if (data.user) {
                    setUser(data.user)
                }
            } catch (error) {
                console.error('Failed to fetch user', error)
            } finally {
                setLoading(false)
            }
        }
        checkAuth()
    }, [])

    const login = (userData: User) => {
        setUser(userData)
        if (userData.role === 'ADMIN') {
            router.push('/admin/dashboard')
        } else {
            router.push('/dashboard')
        }
    }

    const logout = async () => {
        try {
            await fetch('/api/logout', { method: 'POST' })
            setUser(null)
            router.push('/login')
            router.refresh()
        } catch (error) {
            console.error('Logout failed', error)
        }
    }

    return (
        <AuthContext.Provider value={{ user, loading, login, logout }}>
            {children}
        </AuthContext.Provider>
    )
}

export const useAuth = () => useContext(AuthContext)
