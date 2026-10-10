'use client'
// components/FeaturedStores.jsx
// Carousel of approved stores: logo, name, newest products, and a link to the store page.
// New stores show up automatically, and the last card invites visitors to open their own store.
import { useEffect, useState } from 'react'
import Link from 'next/link'
import { Store, ArrowRight, Sparkles, PackageOpen } from 'lucide-react'
import Carousel from './Carousel'

const currency = process.env.NEXT_PUBLIC_CURRENCY_SYMBOL || 'Rs.'
const NEW_DAYS = 14

const StoreCard = ({ store }) => {
    const isNew = Date.now() - new Date(store.createdAt).getTime() < NEW_DAYS * 24 * 60 * 60 * 1000
    const latest = store.products[0]
    const slots = [0, 1, 2]

    return (
        <Link
            href={`/shop/${store.username}`}
            className='group block w-72 sm:w-80 h-full rounded-2xl border border-slate-200 bg-[#ffffff] dark:bg-white/5 p-5 hover:border-[#22c55e] hover:shadow-lg transition'
        >
            {/* Logo and name */}
            <div className='flex items-center gap-3'>
                {store.logo ? (
                    // eslint-disable-next-line @next/next/no-img-element
                    <img src={store.logo} alt={`${store.name} logo`} loading='lazy' className='size-14 shrink-0 rounded-full object-cover border border-slate-200 bg-slate-100' />
                ) : (
                    <span className='size-14 shrink-0 rounded-full bg-[#22c55e]/15 text-[#16a34a] dark:text-[#4ade80] text-xl font-semibold flex items-center justify-center'>
                        {store.name?.[0]?.toUpperCase() || 'S'}
                    </span>
                )}
                <div className='min-w-0 flex-1'>
                    <div className='flex items-center gap-2'>
                        <p className='font-semibold text-slate-700 truncate'>{store.name}</p>
                        {isNew && (
                            <span className='shrink-0 flex items-center gap-1 text-[10px] font-semibold px-2 py-0.5 rounded-full bg-[#22c55e] text-white'>
                                <Sparkles size={10} /> New
                            </span>
                        )}
                    </div>
                    <p className='text-xs text-slate-500 truncate'>@{store.username}</p>
                </div>
            </div>

            <p className='mt-3 text-xs text-slate-500 line-clamp-2 min-h-8'>{store.description}</p>

            {/* Newest products */}
            {store.products.length > 0 ? (
                <>
                    <div className='mt-4 grid grid-cols-3 gap-2'>
                        {slots.map((i) => {
                            const p = store.products[i]
                            return p ? (
                                <div key={p.id} className='aspect-square rounded-lg bg-slate-100 flex items-center justify-center overflow-hidden'>
                                    {/* eslint-disable-next-line @next/next/no-img-element */}
                                    <img src={p.image} alt={p.name} loading='lazy' className='max-h-full max-w-full object-contain p-1 group-hover:scale-105 transition duration-300' />
                                </div>
                            ) : (
                                <div key={i} className='aspect-square rounded-lg border border-dashed border-slate-300' />
                            )
                        })}
                    </div>
                    <p className='mt-2 text-xs text-slate-500 truncate'>
                        Latest: <span className='text-slate-700 font-medium'>{latest.name}</span> · {currency}{latest.price}
                    </p>
                </>
            ) : (
                <div className='mt-4 h-[5.5rem] rounded-lg border border-dashed border-slate-300 flex flex-col items-center justify-center gap-1 text-xs text-slate-500'>
                    <PackageOpen size={18} />
                    New store, products coming soon
                </div>
            )}

            <div className='mt-4 flex items-center justify-between text-sm'>
                <span className='text-xs text-slate-500'>{store.productCount} {store.productCount === 1 ? 'product' : 'products'}</span>
                <span className='flex items-center gap-1 font-medium text-[#16a34a] dark:text-[#4ade80] group-hover:gap-2 transition-all'>
                    Visit store <ArrowRight size={15} />
                </span>
            </div>
        </Link>
    )
}

const SellCard = () => (
    <Link
        href='/create-store'
        className='group flex flex-col items-center justify-center text-center w-72 sm:w-80 h-full min-h-[18rem] rounded-2xl border-2 border-dashed border-[#22c55e]/50 bg-[#22c55e]/5 p-6 hover:bg-[#22c55e]/10 transition'
    >
        <span className='size-14 rounded-full bg-gradient-to-br from-[#22c55e] to-[#16a34a] text-white flex items-center justify-center shadow-lg shadow-[#22c55e]/25'>
            <Store size={26} />
        </span>
        <p className='mt-4 font-semibold text-slate-700'>Your store could be here</p>
        <p className='mt-1 text-xs text-slate-500'>Open your store in minutes and get featured to every visitor.</p>
        <span className='mt-4 flex items-center gap-1 text-sm font-medium text-[#16a34a] dark:text-[#4ade80] group-hover:gap-2 transition-all'>
            Create your store <ArrowRight size={15} />
        </span>
    </Link>
)

const SkeletonCard = () => (
    <div className='w-72 sm:w-80 h-[18rem] rounded-2xl border border-slate-200 p-5 animate-pulse'>
        <div className='flex items-center gap-3'>
            <div className='size-14 rounded-full bg-black/10 dark:bg-white/10' />
            <div className='flex-1 space-y-2'>
                <div className='h-3 w-2/3 rounded bg-black/10 dark:bg-white/10' />
                <div className='h-3 w-1/3 rounded bg-black/10 dark:bg-white/10' />
            </div>
        </div>
        <div className='mt-6 grid grid-cols-3 gap-2'>
            {[0, 1, 2].map((i) => <div key={i} className='aspect-square rounded-lg bg-black/10 dark:bg-white/10' />)}
        </div>
    </div>
)

export default function FeaturedStores() {
    const [stores, setStores] = useState(null) // null = still loading

    useEffect(() => {
        let cancelled = false
        fetch('/api/store/featured')
            .then((res) => res.json())
            .then((data) => { if (!cancelled) setStores(data.stores || []) })
            .catch(() => { if (!cancelled) setStores([]) })
        return () => { cancelled = true }
    }, [])

    return (
        <section className='px-6 my-30 max-w-7xl mx-auto' aria-labelledby='featured-stores-heading'>
            <div className='text-center'>
                <h2 id='featured-stores-heading' className='text-2xl font-semibold text-slate-700'>Featured Stores</h2>
                <p className='text-sm text-slate-500 mt-1'>Shop from our sellers, with new stores added all the time.</p>
            </div>

            <div className='mt-10'>
                {stores === null ? (
                    <Carousel autoPlay={false}>
                        <SkeletonCard />
                        <SkeletonCard />
                        <SkeletonCard />
                    </Carousel>
                ) : (
                    <Carousel itemClass='self-stretch' interval={4000}>
                        {[
                            ...stores.map((store) => <StoreCard key={store.id} store={store} />),
                            <SellCard key='sell' />,
                        ]}
                    </Carousel>
                )}
            </div>
        </section>
    )
}