
import { ShieldCheck, Clock, Zap, MapPin } from "lucide-react";

export default function Features() {
    const features = [
        {
            icon: <ShieldCheck className="w-8 h-8 text-blue-500" />,
            title: "Tam Güvence",
            description: "Her kiralama tam kasko ve yol yardım paketi ile birlikte gelir. Sürpriz yok.",
        },
        {
            icon: <Clock className="w-8 h-8 text-indigo-500" />,
            title: "7/24 Destek",
            description: "Günün her saati ulaşabileceğiniz uzman destek ekibimiz yanınızda.",
        },
        {
            icon: <Zap className="w-8 h-8 text-yellow-500" />,
            title: "Hızlı Teslimat",
            description: "Kapınıza kadar araç teslimatı veya havalimanında karşılama hizmeti.",
        },
        {
            icon: <MapPin className="w-8 h-8 text-rose-500" />,
            title: "Geniş Lokasyon",
            description: "Şehrin en merkezi noktalarında ve tüm havalimanlarında hizmetinizdeyiz.",
        },
    ];

    return (
        <section className="py-24 bg-white dark:bg-black/50">
            <div className="container mx-auto px-4">
                <div className="text-center mb-16">
                    <h2 className="text-3xl md:text-5xl font-black mb-4 tracking-tight">
                        Neden <span className="text-blue-600">Premium?</span>
                    </h2>
                    <p className="text-gray-500 max-w-2xl mx-auto text-lg">
                        Standartların ötesinde bir hizmet anlayışı ile yolculuğunuzu kusursuzleştiriyoruz.
                    </p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
                    {features.map((feature, index) => (
                        <div
                            key={index}
                            className="group p-8 rounded-3xl bg-gray-50 dark:bg-white/5 border border-gray-100 dark:border-white/5 hover:border-blue-500/30 transition-all hover:shadow-xl hover:shadow-blue-500/10 hover:-translate-y-1"
                        >
                            <div className="mb-6 p-4 rounded-2xl bg-white dark:bg-white/10 w-fit shadow-sm group-hover:scale-110 transition-transform duration-300">
                                {feature.icon}
                            </div>
                            <h3 className="text-xl font-bold mb-3">{feature.title}</h3>
                            <p className="text-gray-500 dark:text-gray-400 leading-relaxed">
                                {feature.description}
                            </p>
                        </div>
                    ))}
                </div>
            </div>
        </section>
    );
}
