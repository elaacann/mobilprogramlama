import { getSession } from '@/lib/auth'
import db from '@/lib/db'
import { redirect } from 'next/navigation'
import CarForm from '@/components/admin/CarForm'
import Link from 'next/link'
import { ArrowLeft, CarFront } from 'lucide-react'

export default async function NewCarPage() {
    const session = await getSession()
    if (!session || session.user.role !== 'ADMIN') redirect('/login')

    const offices = await db.office.findMany({
        orderBy: { name: 'asc' }
    })

    return (
        <div className="max-w-3xl mx-auto px-4 py-8 animate-fade-in-up">
            <Link href="/admin/cars" className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-surface border border-border-subtle text-gray-500 hover:text-foreground mb-8 transition-all font-bold text-sm shadow-sm group">
                <ArrowLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" />
                Filoya Dön
            </Link>

            <div className="bg-surface rounded-[2.5rem] shadow-2xl shadow-black/5 border border-border-subtle p-8 md:p-12 overflow-hidden relative">
                <div className="absolute top-0 right-0 p-12 opacity-5 pointer-events-none">
                    <CarFront className="w-32 h-32" />
                </div>

                <div className="relative z-10">
                    <div className="mb-10">
                        <h1 className="text-4xl font-black text-foreground mb-3 tracking-tight">Yeni Araç Ekle</h1>
                        <p className="text-gray-500 dark:text-gray-400 font-bold">Filoya yeni bir premium araç kaydedin.</p>
                    </div>

                    <CarForm offices={offices} />
                </div>
            </div>
        </div>
    )
}
