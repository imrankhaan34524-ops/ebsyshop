'use client'
// components/ChatWidget.jsx
// Floating WhatsApp button + AI chat assistant (bottom right).
import { useEffect, useRef, useState } from 'react'
import Link from 'next/link'
import { X, Send } from 'lucide-react'
import { site } from '@/lib/siteConfig'

// WhatsApp number: use NEXT_PUBLIC_WHATSAPP_NUMBER in .env, or your site phone number
const rawNumber = process.env.NEXT_PUBLIC_WHATSAPP_NUMBER || site.phone || ''
let waDigits = String(rawNumber).replace(/\D/g, '')
if (waDigits.startsWith('0')) waDigits = '92' + waDigits.slice(1)
const WA_LINK = `https://wa.me/${waDigits}?text=${encodeURIComponent('Hi EbsyStore, I need some help.')}`

const WhatsAppIcon = ({ size = 28 }) => (
    <svg width={size} height={size} viewBox='0 0 24 24' fill='currentColor' aria-hidden='true'>
        <path d='M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413Z' />
    </svg>
)

const RobotIcon = ({ size = 30 }) => (
    <svg width={size} height={size} viewBox='0 0 32 32' fill='none' aria-hidden='true'>
        {/* antenna */}
        <line x1='16' y1='3.5' x2='16' y2='8' stroke='currentColor' strokeWidth='2' strokeLinecap='round' />
        <circle cx='16' cy='3.2' r='1.8' fill='#fde68a' />
        {/* ears */}
        <rect x='2' y='14' width='3.5' height='7' rx='1.75' fill='currentColor' opacity='0.85' />
        <rect x='26.5' y='14' width='3.5' height='7' rx='1.75' fill='currentColor' opacity='0.85' />
        {/* head and face screen */}
        <rect x='5' y='8' width='22' height='18' rx='7' fill='currentColor' />
        <rect x='8.5' y='11.5' width='15' height='11' rx='4.5' fill='#0b3d22' />
        {/* blinking eyes */}
        <ellipse cx='13' cy='16' rx='1.8' ry='1.8' fill='#4ade80'>
            <animate attributeName='ry' values='1.8;1.8;0.2;1.8;1.8' keyTimes='0;0.9;0.94;0.98;1' dur='4s' repeatCount='indefinite' />
        </ellipse>
        <ellipse cx='19' cy='16' rx='1.8' ry='1.8' fill='#4ade80'>
            <animate attributeName='ry' values='1.8;1.8;0.2;1.8;1.8' keyTimes='0;0.9;0.94;0.98;1' dur='4s' repeatCount='indefinite' />
        </ellipse>
        {/* smile */}
        <path d='M13.5 19.6c1.5 1.2 3.5 1.2 5 0' stroke='#4ade80' strokeWidth='1.4' strokeLinecap='round' />
    </svg>
)

const GREETING = 'Hi! I am the EbsyStore assistant. I can help with products, payments, shipping, orders and selling on EbsyStore. What would you like to know?'

const SUGGESTIONS = [
    'Which payment methods do you accept?',
    'How do I track my order?',
    'Is shipping free?',
    'How do I sell on EbsyStore?',
]

// Turns paths like /product/abc123 or /orders in the bot reply into real links
const LINK_RE = /(\/(?:product\/[A-Za-z0-9]+|shop(?:\?[^\s.,!)]*)?|orders|create-store|cart|pricing|contact|about))/g
const LABELS = {
    product: 'View product',
    shop: 'Open shop',
    orders: 'My Orders',
    'create-store': 'Create your store',
    cart: 'Open cart',
    pricing: 'See Plus plans',
    contact: 'Contact us',
    about: 'About us',
}

const renderText = (text) =>
    text.split(LINK_RE).map((part, i) => {
        if (i % 2 === 1) {
            const key = part.split('/')[1].split('?')[0]
            return (
                <Link key={i} href={part} className='underline font-medium text-[#16a34a] dark:text-[#4ade80]'>
                    {LABELS[key] || part}
                </Link>
            )
        }
        return part
    })

const STORAGE_KEY = 'ebsy_chat'

export default function ChatWidget() {
    const [open, setOpen] = useState(false)
    const [messages, setMessages] = useState([])
    const [input, setInput] = useState('')
    const [loading, setLoading] = useState(false)
    const bottomRef = useRef(null)
    const inputRef = useRef(null)

    // Keep the conversation while the visitor browses (cleared when the tab closes)
    useEffect(() => {
        try {
            const saved = sessionStorage.getItem(STORAGE_KEY)
            if (saved) setMessages(JSON.parse(saved))
        } catch {}
    }, [])

    useEffect(() => {
        try { sessionStorage.setItem(STORAGE_KEY, JSON.stringify(messages.slice(-30))) } catch {}
    }, [messages])

    useEffect(() => {
        if (open) {
            bottomRef.current?.scrollIntoView({ behavior: 'smooth', block: 'end' })
            inputRef.current?.focus()
        }
    }, [messages, loading, open])

    const send = async (text) => {
        const content = text.trim().slice(0, 500)
        if (!content || loading) return

        const next = [...messages, { role: 'user', content }]
        setMessages(next)
        setInput('')
        setLoading(true)

        try {
            const res = await fetch('/api/chat', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ messages: next.filter((m) => !m.error).slice(-10) }),
            })
            const data = await res.json()
            if (!res.ok) throw new Error(data.error || 'Something went wrong')
            setMessages([...next, { role: 'assistant', content: data.reply }])
        } catch (error) {
            setMessages([
                ...next,
                { role: 'assistant', error: true, content: `${error.message || 'Sorry, something went wrong.'} You can also chat with us on WhatsApp.` },
            ])
        } finally {
            setLoading(false)
        }
    }

    // Closed: show the two floating buttons
    if (!open) {
        return (
            <>
                <a
                    href={WA_LINK}
                    target='_blank'
                    rel='noopener noreferrer'
                    aria-label='Chat on WhatsApp'
                    className='fixed z-40 right-4 bottom-[9.25rem] sm:right-6 sm:bottom-[6.25rem] size-12 rounded-full bg-[#25D366] text-white flex items-center justify-center shadow-lg shadow-[#25D366]/30 hover:scale-110 active:scale-95 transition'
                >
                    <WhatsAppIcon size={28} />
                </a>
                <button
                    type='button'
                    onClick={() => setOpen(true)}
                    aria-label='Open chat assistant'
                    className='group fixed z-40 right-4 bottom-20 sm:right-6 sm:bottom-6 size-14 rounded-full bg-gradient-to-br from-[#22c55e] to-[#16a34a] text-white flex items-center justify-center shadow-lg shadow-[#22c55e]/30 hover:scale-110 active:scale-95 transition'
                >
                    <RobotIcon size={34} />
                    {/* online dot */}
                    <span className='absolute top-0 right-0 flex size-3.5'>
                        <span className='absolute inline-flex h-full w-full rounded-full bg-[#4ade80] opacity-75 animate-ping' />
                        <span className='relative inline-flex size-3.5 rounded-full bg-[#4ade80] border-2 border-[#16a34a]' />
                    </span>
                    {/* label on desktop hover */}
                    <span className='pointer-events-none absolute right-full mr-3 hidden sm:block whitespace-nowrap rounded-lg bg-[#0f172a] text-white text-xs px-3 py-1.5 opacity-0 group-hover:opacity-100 transition'>
                        Ask our AI assistant
                    </span>
                </button>
            </>
        )
    }

    // Open: chat panel
    return (
        <div
            role='dialog'
            aria-label='EbsyStore assistant'
            className='fixed z-50 right-4 bottom-20 sm:right-6 sm:bottom-6 w-[calc(100vw-2rem)] sm:w-[380px] h-[min(560px,calc(100dvh-7rem))] flex flex-col rounded-2xl border border-slate-200 bg-[#ffffff] dark:bg-[#0e1512] shadow-2xl overflow-hidden text-slate-500'
        >
            {/* Header */}
            <div className='flex items-center gap-3 px-4 py-3 bg-gradient-to-r from-[#22c55e] to-[#16a34a] text-white'>
                <span className='size-10 rounded-full bg-white/20 flex items-center justify-center'><RobotIcon size={26} /></span>
                <div className='flex-1 min-w-0'>
                    <p className='text-sm font-semibold leading-tight'>EbsyStore Assistant</p>
                    <p className='text-[11px] opacity-90 flex items-center gap-1.5'>
                        <span className='size-1.5 rounded-full bg-white' /> Online, replies instantly
                    </p>
                </div>
                <button type='button' onClick={() => setOpen(false)} aria-label='Close chat' className='size-8 rounded-full hover:bg-white/20 flex items-center justify-center transition'>
                    <X size={18} />
                </button>
            </div>

            {/* Messages */}
            <div className='flex-1 overflow-y-auto px-4 py-4 space-y-3 text-sm'>
                <div className='max-w-[85%] rounded-2xl rounded-bl-sm bg-black/5 dark:bg-white/10 text-slate-700 px-3.5 py-2.5'>
                    {GREETING}
                </div>

                {messages.length === 0 && (
                    <div className='flex flex-wrap gap-2 pt-1'>
                        {SUGGESTIONS.map((s) => (
                            <button
                                key={s}
                                type='button'
                                onClick={() => send(s)}
                                className='text-xs px-3 py-1.5 rounded-full border border-slate-300 hover:border-[#22c55e] hover:text-[#16a34a] transition text-left'
                            >
                                {s}
                            </button>
                        ))}
                    </div>
                )}

                {messages.map((m, i) => (
                    <div key={i} className={m.role === 'user' ? 'flex justify-end' : 'flex justify-start'}>
                        <div
                            className={`max-w-[85%] px-3.5 py-2.5 whitespace-pre-wrap break-words
                            ${m.role === 'user'
                                ? 'rounded-2xl rounded-br-sm bg-gradient-to-br from-[#22c55e] to-[#16a34a] text-white'
                                : 'rounded-2xl rounded-bl-sm bg-black/5 dark:bg-white/10 text-slate-700'}`}
                        >
                            {m.role === 'user' ? m.content : renderText(m.content)}
                        </div>
                    </div>
                ))}

                {loading && (
                    <div className='flex justify-start'>
                        <div className='rounded-2xl rounded-bl-sm bg-black/5 dark:bg-white/10 px-4 py-3 flex gap-1'>
                            <span className='size-1.5 rounded-full bg-slate-400 animate-bounce' />
                            <span className='size-1.5 rounded-full bg-slate-400 animate-bounce [animation-delay:150ms]' />
                            <span className='size-1.5 rounded-full bg-slate-400 animate-bounce [animation-delay:300ms]' />
                        </div>
                    </div>
                )}
                <div ref={bottomRef} />
            </div>

            {/* Input */}
            <div className='border-t border-slate-200 p-3'>
                <form onSubmit={(e) => { e.preventDefault(); send(input) }} className='flex items-center gap-2'>
                    <input
                        ref={inputRef}
                        value={input}
                        onChange={(e) => setInput(e.target.value)}
                        maxLength={500}
                        placeholder='Type your question...'
                        className='flex-1 min-w-0 border border-slate-300 bg-transparent rounded-full px-4 py-2.5 text-base sm:text-sm outline-none focus:border-[#22c55e] transition'
                    />
                    <button
                        type='submit'
                        disabled={loading || !input.trim()}
                        aria-label='Send'
                        className='size-10 shrink-0 rounded-full bg-gradient-to-br from-[#22c55e] to-[#16a34a] text-white flex items-center justify-center active:scale-95 transition disabled:opacity-50 disabled:cursor-not-allowed'
                    >
                        <Send size={16} />
                    </button>
                </form>
                <a href={WA_LINK} target='_blank' rel='noopener noreferrer' className='mt-2 flex items-center justify-center gap-1.5 text-[11px] hover:text-[#25D366] transition'>
                    <WhatsAppIcon size={13} /> Prefer a person? Chat with us on WhatsApp
                </a>
            </div>
        </div>
    )
}