'use client'

import { useState, useEffect } from 'react'
import { Heart } from 'lucide-react'
import { useRouter } from 'next/navigation'

interface FavoriteButtonProps {
    carId: string
    initialIsFavorite?: boolean
}

export default function FavoriteButton({ carId, initialIsFavorite = false }: FavoriteButtonProps) {
    const [isFavorite, setIsFavorite] = useState(initialIsFavorite)
    const [loading, setLoading] = useState(false)
    const router = useRouter()

    const toggleFavorite = async (e: React.MouseEvent) => {
        e.preventDefault()
        e.stopPropagation()

        setLoading(true)
        try {
            const res = await fetch('/api/favorites', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ carId })
            })

            if (res.status === 401) {
                router.push('/login')
                return
            }

            if (res.ok) {
                const data = await res.json()
                setIsFavorite(data.status === 'added')
            }
        } catch (error) {
            console.error('Failed to toggle favorite')
        } finally {
            setLoading(false)
        }
    }

    return (
        <button
            onClick={toggleFavorite}
            disabled={loading}
            className={`p-3 rounded-2xl border transition-all duration-300 active:scale-90 ${isFavorite
                    ? 'bg-rose-500/10 border-rose-500/20 text-rose-500'
                    : 'bg-white/10 border-white/10 text-white hover:bg-white/20'
                } backdrop-blur-md`}
        >
            <Heart className={`w-6 h-6 ${isFavorite ? 'fill-current' : ''}`} />
        </button>
    )
}
