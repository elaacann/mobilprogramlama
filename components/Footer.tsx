
import Link from 'next/link';
import { Facebook, Twitter, Instagram, Linkedin, MapPin, Phone, Mail } from 'lucide-react';

export default function Footer() {
    return (
        <footer className="bg-gray-50 dark:bg-[#050505] border-t border-gray-200 dark:border-white/5 pt-16 pb-8">
            <div className="container mx-auto px-4">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12 mb-12">
                    {/* Brand Column */}
                    <div className="space-y-6">
                        <Link href="/" className="flex items-center gap-3">
                            <div className="w-10 h-10 bg-gradient-to-tr from-blue-600 to-indigo-600 rounded-xl flex items-center justify-center text-white font-bold text-xl shadow-lg shadow-blue-500/30">
                                C
                            </div>
                            <span className="text-xl font-bold tracking-tight text-gray-900 dark:text-white">
                                OtoKiralama
                            </span>
                        </Link>
                        <p className="text-gray-500 dark:text-gray-400 text-sm leading-relaxed">
                            Premium araç kiralama deneyimini yeniden tanımlıyoruz. Konfor, güvenlik ve stil bir arada.
                        </p>
                        <div className="flex gap-4">
                            <a href="#" className="p-2 rounded-lg bg-gray-100 dark:bg-white/5 text-gray-600 dark:text-gray-400 hover:bg-blue-50 dark:hover:bg-blue-900/20 hover:text-blue-600 transition-colors">
                                <Facebook size={18} />
                            </a>
                            <a href="#" className="p-2 rounded-lg bg-gray-100 dark:bg-white/5 text-gray-600 dark:text-gray-400 hover:bg-blue-50 dark:hover:bg-blue-900/20 hover:text-blue-400 transition-colors">
                                <Twitter size={18} />
                            </a>
                            <a href="#" className="p-2 rounded-lg bg-gray-100 dark:bg-white/5 text-gray-600 dark:text-gray-400 hover:bg-pink-50 dark:hover:bg-pink-900/20 hover:text-pink-600 transition-colors">
                                <Instagram size={18} />
                            </a>
                            <a href="#" className="p-2 rounded-lg bg-gray-100 dark:bg-white/5 text-gray-600 dark:text-gray-400 hover:bg-blue-50 dark:hover:bg-blue-900/20 hover:text-blue-700 transition-colors">
                                <Linkedin size={18} />
                            </a>
                        </div>
                    </div>

                    {/* Quick Links */}
                    <div>
                        <h3 className="font-bold text-gray-900 dark:text-white mb-6">Hızlı Bağlantılar</h3>
                        <ul className="space-y-4 text-sm text-gray-500 dark:text-gray-400">
                            <li>
                                <Link href="/dashboard" className="hover:text-blue-600 dark:hover:text-blue-400 transition-colors">Araçları İncele</Link>
                            </li>
                            <li>
                                <Link href="/about" className="hover:text-blue-600 dark:hover:text-blue-400 transition-colors">Hakkımızda</Link>
                            </li>
                            <li>
                                <Link href="/services" className="hover:text-blue-600 dark:hover:text-blue-400 transition-colors">Hizmetler</Link>
                            </li>
                            <li>
                                <Link href="/contact" className="hover:text-blue-600 dark:hover:text-blue-400 transition-colors">İletişim</Link>
                            </li>
                        </ul>
                    </div>

                    {/* Contact Info */}
                    <div>
                        <h3 className="font-bold text-gray-900 dark:text-white mb-6">İletişim</h3>
                        <ul className="space-y-4 text-sm text-gray-500 dark:text-gray-400">
                            <li className="flex items-start gap-3">
                                <MapPin className="w-5 h-5 text-blue-500 shrink-0" />
                                <span>Maslak Mah. Büyükdere Cad. No:123<br />Sarıyer, İstanbul</span>
                            </li>
                            <li className="flex items-center gap-3">
                                <Phone className="w-5 h-5 text-blue-500 shrink-0" />
                                <span>+90 (212) 555 0123</span>
                            </li>
                            <li className="flex items-center gap-3">
                                <Mail className="w-5 h-5 text-blue-500 shrink-0" />
                                <span>info@otokiralama.com</span>
                            </li>
                        </ul>
                    </div>

                    {/* Newsletter */}
                    <div>
                        <h3 className="font-bold text-gray-900 dark:text-white mb-6">Bülten</h3>
                        <p className="text-gray-500 dark:text-gray-400 text-sm mb-4">
                            En yeni araçlar ve özel kampanyalardan haberdar olun.
                        </p>
                        <form className="flex gap-2">
                            <input
                                type="email"
                                placeholder="E-posta adresi"
                                className="flex-1 bg-white dark:bg-white/5 border border-gray-200 dark:border-white/10 rounded-lg px-4 py-2 text-sm focus:outline-none focus:border-blue-500 transition-colors"
                            />
                            <button
                                type="submit"
                                className="bg-blue-600 text-white px-4 py-2 rounded-lg text-sm font-bold hover:bg-blue-700 transition-colors"
                            >
                                Kayıt Ol
                            </button>
                        </form>
                    </div>
                </div>

                <div className="border-t border-gray-200 dark:border-white/5 pt-8 flex flex-col md:flex-row justify-between items-center gap-4 text-xs text-gray-500 dark:text-gray-400">
                    <p>© {new Date().getFullYear()} OtoKiralama Premium. Tüm hakları saklıdır.</p>
                    <div className="flex gap-6">
                        <Link href="/privacy" className="hover:text-gray-900 dark:hover:text-white transition-colors">Gizlilik Politikası</Link>
                        <Link href="/terms" className="hover:text-gray-900 dark:hover:text-white transition-colors">Kullanım Şartları</Link>
                        <Link href="/cookies" className="hover:text-gray-900 dark:hover:text-white transition-colors">Çerezler</Link>
                    </div>
                </div>
            </div>
        </footer>
    );
}
