'use client'
// components/PWAProvider.jsx
import { useEffect, useState } from 'react'
import { Download, X } from 'lucide-react'

const PWAProvider = () => {
    const [installEvent, setInstallEvent] = useState(null)
    const [dismissed, setDismissed] = useState(false)

    useEffect(() => {
        // Register the service worker (production only, so dev caching never confuses you)
        if ('serviceWorker' in navigator && process.env.NODE_ENV === 'production') {
            navigator.serviceWorker.register('/sw.js').catch(() => {})
        }

        const onPrompt = (e) => {
            e.preventDefault()
            setInstallEvent(e)
        }
        const onInstalled = () => setInstallEvent(null)

        window.addEventListener('beforeinstallprompt', onPrompt)
        window.addEventListener('appinstalled', onInstalled)
        return () => {
            window.removeEventListener('beforeinstallprompt', onPrompt)
            window.removeEventListener('appinstalled', onInstalled)
        }
    }, [])

    const install = async () => {
        if (!installEvent) return
        installEvent.prompt()
        await installEvent.userChoice
        setInstallEvent(null)
    }

    if (!installEvent || dismissed) return null

    return (
        <div className='fixed bottom-4 left-4 right-4 sm:left-auto sm:right-6 sm:w-80 z-50 flex items-center gap-3 rounded-2xl bg-[#141a2e] text-white p-4 shadow-xl border border-white/10'>
            <div className='flex-1'>
                <p className='text-sm font-semibold'>Install EbsyStore</p>
                <p className='text-xs text-[#cbd5e1]'>Faster shopping, right from your home screen.</p>
            </div>
            <button onClick={install} className='flex items-center gap-1.5 text-xs font-medium px-4 py-2 rounded-full bg-[#22c55e] hover:bg-[#16a34a] text-white transition'>
                <Download size={14} /> Install
            </button>
            <button onClick={() => setDismissed(true)} aria-label='Dismiss' className='text-[#cbd5e1] hover:text-white'>
                <X size={16} />
            </button>
        </div>
    )
}

export default PWAProvider
