
"use client";

import { ArrowRight, Star } from "lucide-react";
import Link from "next/link";

export default function Hero() {
    return (
        <section className="relative min-h-[90vh] flex items-center justify-center overflow-hidden bg-black text-white">
            {/* Background Image with Overlay */}
            <div className="absolute inset-0 z-0">
                <img
                    src="https://images.unsplash.com/photo-1503376763036-066120622c74?q=80&w=2070&auto=format&fit=crop"
                    alt="Luxury Car Background"
                    className="w-full h-full object-cover opacity-60"
                />
                <div className="absolute inset-0 bg-gradient-to-b from-black/70 via-black/40 to-black" />
            </div>

            {/* Content */}
            <div className="relative z-10 container mx-auto px-4 text-center mt-20">
                <div className="inline-flex items-center gap-2 px-6 py-2 rounded-full bg-white/10 border border-white/20 backdrop-blur-md mb-8 animate-in fade-in slide-in-from-bottom-5 duration-700">
                    <Star className="w-4 h-4 text-yellow-500 fill-yellow-500" />
                    <span className="text-sm font-medium tracking-wide">Premium Araç Kiralama Deneyimi</span>
                </div>

                <h1 className="text-5xl md:text-7xl lg:text-8xl font-black tracking-tighter mb-6 leading-[1.1] animate-in fade-in slide-in-from-bottom-10 duration-1000 delay-200">
                    Yolculuğun <br />
                    <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-indigo-500">
                        Zirvesi.
                    </span>
                </h1>

                <p className="text-lg md:text-xl text-gray-300 max-w-2xl mx-auto mb-10 leading-relaxed animate-in fade-in slide-in-from-bottom-10 duration-1000 delay-300">
                    Sıradan bir kiralama değil, bir yaşam tarzı. En seçkin araç filosu ile konforu ve performansı yeniden tanımlıyoruz.
                </p>

                <div className="flex flex-col md:flex-row gap-4 justify-center items-center animate-in fade-in slide-in-from-bottom-10 duration-1000 delay-500">
                    <Link
                        href="/dashboard"
                        className="group relative px-8 py-4 bg-white text-black rounded-full font-bold text-lg transition-all hover:scale-105 active:scale-95 flex items-center gap-2 overflow-hidden"
                    >
                        <span className="relative z-10">Filoyu Keşfet</span>
                        <ArrowRight className="w-5 h-5 relative z-10 group-hover:translate-x-1 transition-transform" />
                        <div className="absolute inset-0 bg-gradient-to-r from-blue-100 to-indigo-100 opacity-0 group-hover:opacity-100 transition-opacity" />
                    </Link>
                    <Link
                        href="/dashboard?category=suv"
                        className="px-8 py-4 bg-white/5 border border-white/10 text-white rounded-full font-medium text-lg backdrop-blur-sm transition-all hover:bg-white/10 hover:border-white/30"
                    >
                        Özel Teklifler
                    </Link>
                </div>
            </div>

            {/* Scroll Indicator */}
            <div className="absolute bottom-10 left-1/2 -translate-x-1/2 animate-bounce opacity-50">
                <div className="w-6 h-10 border-2 border-white/30 rounded-full flex justify-center pt-2">
                    <div className="w-1 h-2 bg-white rounded-full" />
                </div>
            </div>
        </section>
    );
}
