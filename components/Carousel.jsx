'use client'
// components/Carousel.jsx
// Smooth swipe carousel with arrows (desktop) and gentle auto-scroll.
// Auto-scroll pauses on hover and touch, and is off for people who prefer reduced motion.
import { Children, useCallback, useEffect, useRef, useState } from 'react'
import { ChevronLeft, ChevronRight } from 'lucide-react'

export default function Carousel({ children, itemClass = '', interval = 3500, autoPlay = true }) {
    const ref = useRef(null)
    const resumeTimer = useRef(null)
    const [paused, setPaused] = useState(false)
    const [canPrev, setCanPrev] = useState(false)
    const [canNext, setCanNext] = useState(false)
    const count = Children.count(children)

    const update = useCallback(() => {
        const el = ref.current
        if (!el) return
        setCanPrev(el.scrollLeft > 4)
        setCanNext(el.scrollLeft + el.clientWidth < el.scrollWidth - 4)
    }, [])

    const scrollByCard = useCallback((dir) => {
        const el = ref.current
        if (!el || !el.firstElementChild) return
        const step = el.firstElementChild.getBoundingClientRect().width + 16
        el.scrollBy({ left: dir * step, behavior: 'smooth' })
    }, [])

    useEffect(() => {
        update()
        const el = ref.current
        if (!el) return
        el.addEventListener('scroll', update, { passive: true })
        window.addEventListener('resize', update)
        return () => {
            el.removeEventListener('scroll', update)
            window.removeEventListener('resize', update)
        }
    }, [update, count])

    // Auto-scroll: moves one card at a time, then returns to the start
    useEffect(() => {
        if (!autoPlay || paused || count < 2) return
        if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return

        const id = setInterval(() => {
            const el = ref.current
            if (!el || el.scrollWidth <= el.clientWidth + 4) return
            const atEnd = el.scrollLeft + el.clientWidth >= el.scrollWidth - 4
            if (atEnd) el.scrollTo({ left: 0, behavior: 'smooth' })
            else scrollByCard(1)
        }, interval)

        return () => clearInterval(id)
    }, [autoPlay, paused, interval, count, scrollByCard])

    useEffect(() => () => clearTimeout(resumeTimer.current), [])

    const arrowClass =
        'hidden sm:flex absolute top-1/2 -translate-y-1/2 z-10 size-10 rounded-full bg-[#ffffff] dark:bg-[#141a2e] border border-slate-200 shadow-lg items-center justify-center text-slate-700 hover:border-[#22c55e] hover:text-[#16a34a] active:scale-95 transition'

    return (
        <div
            className='relative'
            onMouseEnter={() => setPaused(true)}
            onMouseLeave={() => setPaused(false)}
            onTouchStart={() => { clearTimeout(resumeTimer.current); setPaused(true) }}
            onTouchEnd={() => { resumeTimer.current = setTimeout(() => setPaused(false), 5000) }}
        >
            {canPrev && (
                <button type='button' aria-label='Previous' onClick={() => scrollByCard(-1)} className={`${arrowClass} -left-3`}>
                    <ChevronLeft size={20} />
                </button>
            )}
            {canNext && (
                <button type='button' aria-label='Next' onClick={() => scrollByCard(1)} className={`${arrowClass} -right-3`}>
                    <ChevronRight size={20} />
                </button>
            )}

            <div
                ref={ref}
                className='no-scrollbar [scrollbar-width:none] flex gap-4 overflow-x-auto snap-x snap-mandatory scroll-smooth mx-auto w-fit max-w-full px-1 pb-3'
            >
                {Children.map(children, (child) => (
                    <div className={`snap-start shrink-0 ${itemClass}`}>{child}</div>
                ))}
            </div>
        </div>
    )
}
