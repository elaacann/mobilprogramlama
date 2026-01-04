import Link from 'next/link'
import { Car, Office, Review, Category } from '@prisma/client'
import { Fuel, MapPin, ArrowRight, Gauge, Cog, Star, Tag } from 'lucide-react'
import FavoriteButton from './FavoriteButton'

interface CarCardProps {
    car: Car & {
        office: Office,
        reviews?: Review[],
        category?: Category | null
    }
    isFavoriteInitial?: boolean
}

export default function CarCard({ car, isFavoriteInitial = false }: CarCardProps) {
    const averageRating = car.reviews && car.reviews.length > 0
        ? car.reviews.reduce((acc, r) => acc + r.rating, 0) / car.reviews.length
        : 0

    return (
        <div className="group bg-surface rounded-3xl shadow-lg shadow-black/5 hover:shadow-2xl hover:shadow-blue-500/10 hover:-translate-y-2 transition-all duration-500 border border-border-subtle overflow-hidden flex flex-col h-full animate-fade-in-up">
            <div className="relative aspect-[16/10] overflow-hidden">
                <img
                    src={car.imageUrl}
                    alt={car.make + ' ' + car.model}
                    className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent opacity-60 group-hover:opacity-80 transition-opacity duration-500" />

                <div className="absolute top-4 left-4 z-20">
                    <FavoriteButton carId={car.id} initialIsFavorite={isFavoriteInitial} />
                </div>

                {car.category && (
                    <div className="absolute top-4 right-20 bg-blue-500/20 backdrop-blur-md px-3 py-1.5 rounded-xl text-[10px] font-black text-blue-100 border border-blue-500/30 flex items-center gap-1.5 uppercase tracking-widest">
                        <Tag className="w-3 h-3" />
                        {car.category.name}
                    </div>
                )}

                <div className="absolute top-4 right-4 bg-surface/90 dark:bg-black/40 backdrop-blur-xl px-4 py-2 rounded-2xl text-sm font-bold text-foreground shadow-2xl border border-white/10">
                    {car.pricePerDay} ₺ <span className="text-gray-400 font-medium text-xs">/ gün</span>
                </div>

                <div className="absolute bottom-5 left-6 text-white transform group-hover:translate-x-1 transition-transform duration-500">
                    <div className="flex items-center gap-2 mb-1.5">
                        <p className="text-xs font-bold text-blue-400 uppercase tracking-widest drop-shadow-sm">{car.year} Model</p>
                        {averageRating > 0 && (
                            <div className="flex items-center gap-1 bg-amber-500/20 backdrop-blur-md px-2 py-0.5 rounded-lg border border-amber-500/30">
                                <Star className="w-2.5 h-2.5 text-amber-500 fill-current" />
                                <span className="text-[10px] font-black text-amber-500">{averageRating.toFixed(1)}</span>
                            </div>
                        )}
                    </div>
                    <h3 className="text-2xl font-black tracking-tight drop-shadow-md">{car.make} {car.model}</h3>
                </div>
            </div>

            <div className="p-6 flex flex-col flex-grow">
                <div className="flex items-center gap-x-4 gap-y-3 text-sm mb-6 flex-wrap">
                    <div className="flex items-center gap-2 bg-background/50 dark:bg-background/20 px-3 py-2 rounded-xl border border-border-subtle backdrop-blur-sm transition-colors hover:bg-blue-500/5 hover:border-blue-500/20">
                        <Cog className="w-4 h-4 text-blue-500" />
                        <span className="font-bold text-foreground/80">
                            {car.transmission === 'Automatic' ? 'Otomatik' : car.transmission === 'Manual' ? 'Manuel' : car.transmission}
                        </span>
                    </div>
                    <div className="flex items-center gap-2 bg-background/50 dark:bg-background/20 px-3 py-2 rounded-xl border border-border-subtle backdrop-blur-sm transition-colors hover:bg-blue-500/5 hover:border-blue-500/20">
                        <Fuel className="w-4 h-4 text-indigo-500" />
                        <span className="font-bold text-foreground/80">
                            {car.fuelType === 'Petrol' ? 'Benzin' :
                                car.fuelType === 'Diesel' ? 'Dizel' :
                                    car.fuelType === 'Electric' ? 'Elektrik' :
                                        car.fuelType === 'Hybrid' ? 'Hibrit' : car.fuelType}
                        </span>
                    </div>
                </div>

                <div className="mt-auto pt-5 border-t border-border-subtle flex items-center justify-between">
                    <div className="flex items-center text-sm text-gray-500 dark:text-gray-400">
                        <div className="w-8 h-8 rounded-full bg-rose-500/10 flex items-center justify-center mr-2">
                            <MapPin className="w-4 h-4 text-rose-500" />
                        </div>
                        <span className="truncate max-w-[120px] font-bold">{car.office.name}</span>
                    </div>

                    <Link
                        href={'/cars/' + car.id}
                        className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white px-5 py-2.5 rounded-xl font-bold text-sm shadow-lg shadow-blue-500/20 transition-all active:scale-95"
                    >
                        Kirala
                        <ArrowRight className="w-4 h-4" />
                    </Link>
                </div>
            </div>
        </div>
    )
}
