'use client'

import { QRCodeSVG } from 'qrcode.react'

export default function QRGenerator({ value }: { value: string }) {
    return (
        <div className="bg-white p-4 rounded-xl shadow-sm border border-gray-100 inline-block">
            <QRCodeSVG
                value={value}
                size={200}
                level="H"
                includeMargin={true}
            />
            <p className="text-center text-xs text-gray-500 mt-2 font-mono break-all max-w-[200px] mx-auto">
                {value.slice(0, 8)}...
            </p>
        </div>
    )
}
