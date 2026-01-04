'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { Trash2, Loader2 } from 'lucide-react'

export default function DeleteOfficeButton({ officeId }: { officeId: string }) {
    const router = useRouter()
    const [loading, setLoading] = useState(false)

    const handleDelete = async () => {
        if (!confirm('Bu ofisi silmek istediğinizden emin misiniz? Bu işlem geri alınamaz.')) return

        setLoading(true)
        try {
            const res = await fetch(`/api/admin/offices/${officeId}`, {
                method: 'DELETE'
            })

            const json = await res.json()
            if (!res.ok) {
                alert(json.error || 'Ofis silinemedi')
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
            title="Ofisi Sil"
        >
            {loading ? <Loader2 className="w-5 h-5 animate-spin" /> : <Trash2 className="w-5 h-5" />}
        </button>
    )
}
