'use client'
// components/SaleCountdown.jsx
// <SaleCountdown endsAt={product.saleEndsAt} />
import { useEffect, useState } from 'react'
import { Timer } from 'lucide-react'

const pad = (n) => String(n).padStart(2, '0')

const SaleCountdown = ({ endsAt, className = '' }) => {
    const [left, setLeft] = useState(null) // null until mounted (avoids hydration mismatch)

    useEffect(() => {
        if (!endsAt) return
        const end = new Date(endsAt).getTime()
        const tick = () => setLeft(Math.max(0, end - Date.now()))
        tick()
        const id = setInterval(tick, 1000)
        return () => clearInterval(id)
    }, [endsAt])

    if (!endsAt || left === null || left <= 0) return null

    const totalSec = Math.floor(left / 1000)
    const days = Math.floor(totalSec / 86400)
    const hours = Math.floor((totalSec % 86400) / 3600)
    const mins = Math.floor((totalSec % 3600) / 60)
    const secs = totalSec % 60

    return (
        <div className={`inline-flex items-center gap-2 text-xs font-medium px-3 py-1.5 rounded-full bg-[#ef4444]/15 text-[#ef4444] ${className}`}>
            <Timer size={14} />
            <span>
                Deal ends in {days > 0 && `${days}d `}
                {pad(hours)}:{pad(mins)}:{pad(secs)}
            </span>
        </div>
    )
}

export default SaleCountdown
