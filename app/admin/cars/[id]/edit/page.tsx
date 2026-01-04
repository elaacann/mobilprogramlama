import db from '@/lib/db'
import CarForm from '@/components/admin/CarForm'
import { redirect } from 'next/navigation'
import Link from 'next/link'
import { ArrowLeft, Edit3 } from 'lucide-react'

interface EditCarPageProps {
    params: Promise<{ id: string }>
}

export default async function EditCarPage({ params }: EditCarPageProps) {
    const { id } = await params

    // Fetch car and offices in parallel
    const [car, offices] = await Promise.all([
        db.car.findUnique({
            where: { id }
        }),
        db.office.findMany()
    ])

    if (!car) {
        redirect('/admin/cars')
    }

    return (
        <div className="max-w-3xl mx-auto px-4 py-8 animate-fade-in-up">
            <Link href="/admin/cars" className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-surface border border-border-subtle text-gray-500 hover:text-foreground mb-8 transition-all font-bold text-sm shadow-sm group">
                <ArrowLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" />
                Filoya Dön
            </Link>

            <div className="bg-surface rounded-[2.5rem] shadow-2xl shadow-black/5 border border-border-subtle p-8 md:p-12 overflow-hidden relative">
                <div className="absolute top-0 right-0 p-12 opacity-5 pointer-events-none">
                    <Edit3 className="w-32 h-32" />
                </div>

                <div className="relative z-10">
                    <div className="mb-10">
                        <h1 className="text-4xl font-black text-foreground mb-3 tracking-tight">Aracı Düzenle</h1>
                        <p className="text-gray-500 dark:text-gray-400 font-bold">{car.make} {car.model} teknik bilgilerini ve durumunu güncelleyin.</p>
                    </div>

                    <CarForm offices={offices} initialData={car} />
                </div>
            </div>
        </div>
    )
}
