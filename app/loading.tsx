
export default function Loading() {
    return (
        <div className="flex items-center justify-center min-h-[50vh]">
            <div className="relative w-24 h-24">
                {/* Outer Ring */}
                <div className="absolute inset-0 border-4 border-gray-200 dark:border-white/10 rounded-full"></div>

                {/* Spinning Ring */}
                <div className="absolute inset-0 border-4 border-blue-600 rounded-full border-t-transparent animate-spin"></div>

                {/* Inner Icon */}
                <div className="absolute inset-0 flex items-center justify-center animate-pulse">
                    <div className="w-10 h-10 bg-gradient-to-tr from-blue-600 to-indigo-600 rounded-xl flex items-center justify-center text-white font-bold text-xl shadow-lg shadow-blue-500/30">
                        C
                    </div>
                </div>
            </div>
        </div>
    );
}
