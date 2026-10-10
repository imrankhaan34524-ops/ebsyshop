'use client'
// components/SellerPopup.jsx
// Small "create your own store" card. Home page only, after a short delay.
// Shown once per visit, and hidden for 3 days after the visitor closes it.
import { useEffect, useState } from 'react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { X, Check, Rocket, Store } from 'lucide-react'

const KEY = 'ebsy_seller_popup'
const HIDE_DAYS = 3
const DELAY_MS = 7000

const POINTS = [
    'Set up your store in a few minutes',
    'Your own seller dashboard and order tracking',
    'Get paid with JazzCash, Easypaisa, bank or COD',
]

export default function SellerPopup() {
    const pathname = usePathname()
    const [mounted, setMounted] = useState(false) // in the page
    const [shown, setShown] = useState(false)     // slid into view

    useEffect(() => {
        if (pathname !== '/') return

        try {
            const last = Number(localStorage.getItem(KEY) || 0)
            if (Date.now() - last < HIDE_DAYS * 24 * 60 * 60 * 1000) return
            if (sessionStorage.getItem(KEY)) return
        } catch {}

        let tries = 0
        let timer

        const open = () => {
            // If the "install app" card is on screen, wait a little so they never overlap
            if (document.querySelector('[data-pwa-card]') && tries < 3) {
                tries++
                timer = setTimeout(open, 8000)
                return
            }
            setMounted(true)
            requestAnimationFrame(() => requestAnimationFrame(() => setShown(true)))
            try { sessionStorage.setItem(KEY, '1') } catch {}
        }

        timer = setTimeout(open, DELAY_MS)
        return () => clearTimeout(timer)
    }, [pathname])

    const close = () => {
        setShown(false)
        setTimeout(() => setMounted(false), 300)
        try { localStorage.setItem(KEY, String(Date.now())) } catch {}
    }

    useEffect(() => {
        if (!mounted) return
        const onKey = (e) => e.key === 'Escape' && close()
        document.addEventListener('keydown', onKey)
        return () => document.removeEventListener('keydown', onKey)
    }, [mounted])

    if (!mounted || pathname !== '/') return null

    return (
        <div
            role='dialog'
            aria-label='Create your own store'
            className={`fixed z-50 left-4 right-4 bottom-20 sm:left-6 sm:right-auto sm:bottom-6 sm:w-[340px] transition-all duration-300
            ${shown ? 'translate-y-0 opacity-100' : 'translate-y-4 opacity-0'}`}
        >
            <div className='relative overflow-hidden rounded-2xl border border-slate-200 bg-[#ffffff] dark:bg-[#0e1512] shadow-2xl text-slate-500'>
                {/* Brand gradient strip */}
                <div className='h-1.5 bg-gradient-to-r from-[#22c55e] via-[#8b5cf6] to-[#e0734f]' />

                <button
                    type='button'
                    onClick={close}
                    aria-label='Close'
                    className='absolute top-3.5 right-3 size-7 rounded-full flex items-center justify-center text-slate-500 hover:text-slate-800 hover:bg-black/5 dark:hover:bg-white/10 transition'
                >
                    <X size={16} />
                </button>

                <div className='p-5'>
                    <span className='inline-flex items-center gap-1.5 text-[11px] font-medium px-2.5 py-1 rounded-full bg-[#22c55e]/15 text-[#16a34a] dark:text-[#86efac]'>
                        <Rocket size={12} /> Sellers wanted
                    </span>

                    <h3 className='mt-3 text-lg font-semibold text-slate-700 leading-snug pr-6'>
                        Turn your products into a business
                    </h3>
                    <p className='mt-1 text-xs'>
                        Be one of our first sellers. Open your own store on EbsyStore and start getting orders.
                    </p>

                    <ul className='mt-3 space-y-1.5'>
                        {POINTS.map((point) => (
                            <li key={point} className='flex items-start gap-2 text-xs'>
                                <span className='mt-0.5 size-4 shrink-0 rounded-full bg-[#22c55e]/15 flex items-center justify-center'>
                                    <Check size={10} className='text-[#16a34a] dark:text-[#86efac]' />
                                </span>
                                {point}
                            </li>
                        ))}
                    </ul>

                    <Link
                        href='/create-store'
                        onClick={close}
                        className='mt-4 w-full py-2.5 rounded-xl text-sm font-semibold text-white bg-gradient-to-r from-[#22c55e] to-[#16a34a] shadow-lg shadow-[#22c55e]/20 flex items-center justify-center gap-2 active:scale-[0.98] transition'
                    >
                        <Store size={15} /> Create my store
                    </Link>
                    <button type='button' onClick={close} className='mt-2 w-full text-xs hover:text-slate-700 transition'>
                        Maybe later
                    </button>
                </div>
            </div>
        </div>
    )
}
