import { Star, MessageSquare, User, Calendar } from 'lucide-react'
import { format } from 'date-fns'
import db from '@/lib/db'

interface ReviewSectionProps {
    carId: string
}

export default async function ReviewSection({ carId }: ReviewSectionProps) {
    const reviews = await db.review.findMany({
        where: { carId },
        include: { user: true },
        orderBy: { createdAt: 'desc' }
    })

    const averageRating = reviews.length > 0
        ? reviews.reduce((acc, r) => acc + r.rating, 0) / reviews.length
        : 0

    return (
        <div className="bg-surface rounded-[3rem] shadow-xl shadow-black/5 border border-border-subtle p-10 md:p-12 space-y-10">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
                <div className="flex items-center gap-4">
                    <div className="w-12 h-12 rounded-2xl bg-amber-500/10 flex items-center justify-center">
                        <Star className="w-6 h-6 text-amber-500 fill-current" />
                    </div>
                    <div>
                        <h2 className="text-3xl font-black text-foreground tracking-tight">Müşteri Yorumları</h2>
                        <div className="flex items-center gap-2 mt-1">
                            <div className="flex">
                                {[1, 2, 3, 4, 5].map((s) => (
                                    <Star
                                        key={s}
                                        className={`w-4 h-4 ${s <= Math.round(averageRating) ? 'text-amber-500 fill-current' : 'text-gray-300'}`}
                                    />
                                ))}
                            </div>
                            <span className="text-sm font-bold text-gray-500">
                                ({reviews.length} Değerlendirme)
                            </span>
                        </div>
                    </div>
                </div>
            </div>

            <div className="space-y-6">
                {reviews.length === 0 ? (
                    <div className="p-12 text-center bg-background/50 rounded-[2rem] border border-dashed border-border-subtle">
                        <MessageSquare className="w-12 h-12 text-gray-300 mx-auto mb-4" />
                        <p className="text-gray-500 font-bold">Henüz yorum yapılmamış. İlk yorumu siz yapın!</p>
                    </div>
                ) : (
                    reviews.map((review) => (
                        <div key={review.id} className="p-8 bg-background/50 rounded-[2rem] border border-border-subtle hover:bg-surface-hover/50 transition-all duration-300">
                            <div className="flex items-center justify-between mb-4">
                                <div className="flex items-center gap-4">
                                    <div className="w-12 h-12 rounded-full bg-blue-500/10 flex items-center justify-center font-black text-blue-600">
                                        {review.user.name.charAt(0)}
                                    </div>
                                    <div>
                                        <p className="font-black text-foreground">{review.user.name}</p>
                                        <div className="flex">
                                            {[1, 2, 3, 4, 5].map((s) => (
                                                <Star
                                                    key={s}
                                                    className={`w-3 h-3 ${s <= review.rating ? 'text-amber-500 fill-current' : 'text-gray-300'}`}
                                                />
                                            ))}
                                        </div>
                                    </div>
                                </div>
                                <div className="text-right">
                                    <div className="flex items-center gap-2 text-[10px] font-black text-gray-400 uppercase tracking-widest">
                                        <Calendar className="w-3.5 h-3.5" />
                                        {format(new Date(review.createdAt), 'dd MMM yyyy')}
                                    </div>
                                </div>
                            </div>
                            <p className="text-gray-600 dark:text-gray-400 font-medium italic leading-relaxed">
                                "{review.comment}"
                            </p>
                        </div>
                    ))
                )}
            </div>
        </div>
    )
}
