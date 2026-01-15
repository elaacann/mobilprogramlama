
import { getSession } from "@/lib/auth";
import db from "@/lib/db";
import CarCard from "@/components/CarCard";
import { redirect } from "next/navigation";
import { Heart } from "lucide-react";

export const dynamic = "force-dynamic";

export default async function FavoritesPage() {
    const session = await getSession();

    if (!session?.user) {
        redirect("/login");
    }

    const favorites = await db.favorite.findMany({
        where: {
            userId: session.user.id,
        },
        include: {
            car: {
                include: {
                    office: true,
                    reviews: true,
                    category: true,
                },
            },
        },
    });

    return (
        <div className="container mx-auto px-4 py-8 animate-in fade-in slide-in-from-bottom-5 duration-700">
            <div className="flex items-center gap-4 mb-8">
                <div className="p-3 bg-rose-500/10 rounded-2xl">
                    <Heart className="w-8 h-8 text-rose-500 fill-rose-500" />
                </div>
                <div>
                    <h1 className="text-3xl font-black text-gray-900 dark:text-white">Favorilerim</h1>
                    <p className="text-gray-500 dark:text-gray-400">Beğendiğiniz araçlar burada listelenir.</p>
                </div>
            </div>

            {favorites.length === 0 ? (
                <div className="text-center py-20 bg-gray-50 dark:bg-white/5 rounded-3xl border border-dashed border-gray-200 dark:border-white/10">
                    <Heart className="w-16 h-16 mx-auto mb-4 text-gray-300 dark:text-gray-600" />
                    <h2 className="text-xl font-bold mb-2 text-gray-700 dark:text-gray-300">Listeniz Boş</h2>
                    <p className="text-gray-500 mb-6">Henüz bir aracı favorilere eklemediniz.</p>
                    <a
                        href="/dashboard"
                        className="px-6 py-3 bg-blue-600 text-white rounded-xl font-bold hover:bg-blue-700 transition"
                    >
                        Araçlara Göz At
                    </a>
                </div>
            ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                    {favorites.map((fav) => (
                        <CarCard key={fav.car.id} car={fav.car} />
                    ))}
                </div>
            )}
        </div>
    );
}
