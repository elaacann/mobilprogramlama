
export default function Testimonials() {
    const testimonials = [
        {
            name: "Ahmet Y.",
            role: "CEO",
            quote: "İş seyahatlerimde kullandığım en profesyonel kiralama hizmeti. Araç kondisyonu mükemmeldi.",
            avatar: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?auto=format&fit=crop&q=80&w=100",
        },
        {
            name: "Elif K.",
            role: "Mimar",
            quote: "Tasarım odaklı biri olarak araçların temizliği ve kalitesi beni çok etkiledi. Teşekkürler!",
            avatar: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?auto=format&fit=crop&q=80&w=100",
        },
        {
            name: "Can B.",
            role: "Yazılımcı",
            quote: "Online rezervasyon süreci inanılmaz hızlıydı. QR kod ile aracı teslim almak büyük kolaylık.",
            avatar: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&q=80&w=100",
        },
    ];

    return (
        <section className="py-24 bg-gray-50 dark:bg-black">
            <div className="container mx-auto px-4">
                <div className="text-center mb-16">
                    <h2 className="text-3xl md:text-5xl font-black mb-4 tracking-tight">
                        Mutlu <span className="text-indigo-600">Müşteriler</span>
                    </h2>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                    {testimonials.map((t, index) => (
                        <div
                            key={index}
                            className="p-8 rounded-3xl bg-white dark:bg-white/5 shadow-xl shadow-gray-200/50 dark:shadow-none border border-gray-100 dark:border-white/5 relative"
                        >
                            <div className="absolute -top-6 left-8">
                                <img
                                    src={t.avatar}
                                    alt={t.name}
                                    className="w-12 h-12 rounded-full border-4 border-white dark:border-black shadow-lg"
                                />
                            </div>
                            <div className="mt-6">
                                <div className="flex gap-1 mb-4">
                                    {[...Array(5)].map((_, i) => (
                                        <span key={i} className="text-yellow-400 text-sm">★</span>
                                    ))}
                                </div>
                                <p className="text-gray-600 dark:text-gray-300 italic mb-6">"{t.quote}"</p>
                                <div>
                                    <h4 className="font-bold">{t.name}</h4>
                                    <p className="text-xs text-gray-400 uppercase tracking-wider">{t.role}</p>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </section>
    );
}
