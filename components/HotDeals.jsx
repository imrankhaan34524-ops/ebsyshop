'use client'
// components/HotDeals.jsx
// Products that are on sale (and whose sale has not ended). Hides itself when there are none.
import { useMemo } from 'react'
import { useSelector } from 'react-redux'
import Link from 'next/link'
import { Flame } from 'lucide-react'
import Carousel from './Carousel'
import ProductCard from './ProductCard'

export default function HotDeals() {
    const products = useSelector((state) => state.product.list)

    const deals = useMemo(() => {
        const now = Date.now()
        return products
            .filter((p) =>
                Number(p.mrp) > Number(p.price) &&
                (!p.saleEndsAt || new Date(p.saleEndsAt).getTime() > now)
            )
            // biggest discount first
            .sort((a, b) => (b.mrp - b.price) / b.mrp - (a.mrp - a.price) / a.mrp)
            .slice(0, 12)
    }, [products])

    if (deals.length === 0) return null

    return (
        <section className='px-6 my-30 max-w-7xl mx-auto' aria-labelledby='hot-deals-heading'>
            <div className='text-center'>
                <h2 id='hot-deals-heading' className='text-2xl font-semibold text-slate-700 flex items-center justify-center gap-2'>
                    <Flame size={24} className='text-[#f97316]' /> Hot Deals
                </h2>
                <p className='text-sm text-slate-500 mt-1'>
                    Limited-time offers, grab them before the timer ends.{' '}
                    <Link href='/shop' className='text-green-500 hover:underline'>View all →</Link>
                </p>
            </div>

            <div className='mt-10'>
                <Carousel itemClass='w-44 sm:w-60'>
                    {deals.map((product) => (
                        <ProductCard key={product.id} product={product} />
                    ))}
                </Carousel>
            </div>
        </section>
    )
}
