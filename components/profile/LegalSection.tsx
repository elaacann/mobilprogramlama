import { Shield, Lock, HelpCircle, ChevronRight } from 'lucide-react'

export default function LegalSection() {
    return (
        <div className="space-y-12 animate-fade-in-up">
            <section>
                <div className="flex items-center gap-3 mb-6">
                    <div className="p-3 bg-blue-500/10 rounded-2xl">
                        <Shield className="w-6 h-6 text-blue-600" />
                    </div>
                    <h3 className="text-2xl font-black text-foreground tracking-tight">Kullanım Koşulları</h3>
                </div>
                <div className="bg-surface-hover/30 p-8 rounded-[2rem] border border-border-subtle leading-relaxed">
                    <p className="text-gray-600 dark:text-gray-400 font-medium">
                        Hizmetimizi kullanarak, araçlara özenle davranmayı ve zamanında iade etmeyi kabul etmiş olursunuz.
                        Tüm kiralamalar sigorta doğrulamasına ve geçerli bir ehliyet kontrolüne tabidir.
                        Gecikmeli iadeler ek ücrete tabi olabilir. Firmamız, kural ihlali durumunda hizmeti sonlandırma hakkını saklı tutar.
                    </p>
                </div>
            </section>

            <section>
                <div className="flex items-center gap-3 mb-6">
                    <div className="p-3 bg-indigo-500/10 rounded-2xl">
                        <Lock className="w-6 h-6 text-indigo-600" />
                    </div>
                    <h3 className="text-2xl font-black text-foreground tracking-tight">Gizlilik Politikası</h3>
                </div>
                <div className="bg-surface-hover/30 p-8 rounded-[2rem] border border-border-subtle leading-relaxed">
                    <p className="text-gray-600 dark:text-gray-400 font-medium">
                        Gizliliğinize değer veriyoruz. Kişisel bilgileriniz güvenli bir şekilde saklanır ve yalnızca
                        rezervasyon süreçleri için kullanılır. Verilerinizi, yasal zorunluluklar dışında,
                        açık onayınız olmadan üçüncü taraflarla kesinlikle paylaşmıyoruz.
                    </p>
                </div>
            </section>

            <section>
                <div className="flex items-center gap-3 mb-8">
                    <div className="p-3 bg-emerald-500/10 rounded-2xl">
                        <HelpCircle className="w-6 h-6 text-emerald-600" />
                    </div>
                    <h3 className="text-2xl font-black text-foreground tracking-tight">SSS & Destek</h3>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {[
                        {
                            q: 'Rezervasyonumu nasıl iptal edebilirim?',
                            a: 'Rezervasyonunuzu alım saatinden 24 saat öncesine kadar hiçbir ek ücret ödemeden rezervasyon detay sayfasından iptal edebilirsiniz.'
                        },
                        {
                            q: 'Sigorta kapsamı neleri içerir?',
                            a: 'Tüm araçlarımızda temel kasko günlük ücrete dahildir. Lastik, cam ve far gibi ek teminatlar ofiste eklenebilir.'
                        }
                    ].map((faq, i) => (
                        <div key={i} className="group bg-surface border border-border-subtle p-8 rounded-3xl hover:border-blue-500/30 hover:shadow-xl hover:shadow-black/5 transition-all cursor-pointer">
                            <span className="font-black text-foreground block mb-3 text-lg leading-tight group-hover:text-blue-500 transition-colors">{faq.q}</span>
                            <span className="text-sm text-gray-500 dark:text-gray-400 font-bold leading-relaxed block">{faq.a}</span>
                        </div>
                    ))}
                </div>
            </section>
        </div>
    )
}
