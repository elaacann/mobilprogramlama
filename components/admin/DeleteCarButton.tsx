'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { Trash2, Loader2 } from 'lucide-react'

export default function DeleteCarButton({ carId }: { carId: string }) {
    const router = useRouter()
    const [loading, setLoading] = useState(false)

    const handleDelete = async () => {
        if (!confirm('Bu aracı silmek istediğinizden emin misiniz? Bu işlem geri alınamaz.')) return

        setLoading(true)
        try {
            const res = await fetch(`/api/admin/cars/${carId}`, {
                method: 'DELETE'
            })

            if (!res.ok) {
                const json = await res.json()
                alert(json.error || 'Araç silinemedi')
                return
            }

            router.refresh()
        } catch (error) {
            console.error(error)
            alert('Bir hata oluştu')
        } finally {
            setLoading(false)
        }
    }

    return (
        <button
            onClick={handleDelete}
            disabled={loading}
            className="p-3 text-gray-400 hover:text-red-500 hover:bg-red-50 dark:hover:bg-red-500/10 rounded-xl border border-border-subtle transition-all active:scale-95 disabled:opacity-50"
            title="Aracı Sil"
        >
            {loading ? <Loader2 className="w-5 h-5 animate-spin" /> : <Trash2 className="w-5 h-5" />}
        </button>
    )
}
