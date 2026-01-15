'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { Scanner } from '@yudiel/react-qr-scanner'
import { Loader2 } from 'lucide-react'

export default function AdminScanPage() {
    const router = useRouter()
    const [loading, setLoading] = useState(false)
    const [error, setError] = useState('')

    const handleScan = async (result: any) => {
        // result might be string or array depending on lib version. 
        // @yudiel/react-qr-scanner v2 returns array of objects usually or string.
        // Let's check docs or be defensive.
        // Usually { rawValue: string }[]

        const qrData = result?.[0]?.rawValue || result?.text || result

        if (!qrData || loading) return

        setLoading(true)
        setError('')

        try {
            // Verify
            const res = await fetch('/api/admin/verify', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ qrCodeData: qrData })
            })

            const json = await res.json()
            if (!res.ok) throw new Error(json.error || 'Invalid QR Code')

            // Redirect to reservation details (admin view)
            router.push(`/admin/reservations/${json.reservationId}`)
        } catch (err: any) {
            setError(err.message)
            setLoading(false)
            // Allow re-scan after error? 
            // usually scanner keeps running.
            // We pause or show error.
            setTimeout(() => setError(''), 3000)
        }
    }

    return (
        <div className="max-w-md mx-auto">
            <h1 className="text-2xl font-bold text-center mb-8">Scan Reservation QR</h1>

            <div className="bg-black rounded-2xl overflow-hidden aspect-square relative shadow-xl">
                {loading && (
                    <div className="absolute inset-0 z-20 bg-black/50 flex items-center justify-center text-white">
                        <Loader2 className="animate-spin w-10 h-10" />
                    </div>
                )}

                <Scanner
                    onScan={handleScan}
                    allowMultiple={true} // Keep scanning
                    scanDelay={2000} // Delay between scans
                    components={{
                        onOff: true,
                        torch: true,
                    }}
                />
            </div>

            {error && (
                <div className="mt-6 bg-red-100 text-red-700 p-4 rounded-xl text-center font-bold animate-pulse">
                    {error}
                </div>
            )}

            <p className="text-center text-gray-500 mt-8">
                Position the QR code within the frame to scan.
            </p>
        </div>
    )
}
