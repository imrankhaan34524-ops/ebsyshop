'use client'
import Link from 'next/link'
import { Show } from '@clerk/nextjs'
import { Truck, BadgePercent, Star } from 'lucide-react'

const MembershipBanner = () => {
    return (
        <div className='px-6 my-30 max-w-6xl mx-auto'>
            <div className='rounded-2xl bg-gradient-to-r from-[#1e293b] to-[#334155] dark:from-[#0f1a16] dark:to-[#1a1f45] dark:border dark:border-white/10 text-white p-8 sm:p-12 flex flex-col lg:flex-row items-center justify-between gap-8'>
                <div className='max-w-lg text-center lg:text-left'>
                    <p className='inline-block text-xs font-semibold px-3 py-1 rounded-full bg-[#22c55e] text-white'>plus</p>
                    <h2 className='text-2xl sm:text-3xl font-semibold mt-4 text-white'>Become a Plus member</h2>
                    <p className='text-sm text-[#cbd5e1] dark:text-[#e2e8f0] mt-3'>Unlock free shipping on every order and coupons made only for members.</p>
                    <Show when={{ plan: 'members' }} fallback={
                        <Link href='/pricing' className='inline-block mt-6 px-8 py-2.5 rounded-full bg-[#22c55e] hover:bg-[#16a34a] text-white transition text-sm font-medium'>Join Plus</Link>
                    }>
                        <p className='mt-6 text-sm text-green-400 font-medium'>You are a Plus member. Enjoy your benefits!</p>
                    </Show>
                </div>
                <div className='grid grid-cols-1 sm:grid-cols-3 lg:grid-cols-1 gap-4 text-sm text-white'>
                    <div className='flex items-center gap-3'><Truck size={20} className='text-green-400' /> Free shipping on all orders</div>
                    <div className='flex items-center gap-3'><BadgePercent size={20} className='text-green-400' /> Member only coupons</div>
                    <div className='flex items-center gap-3'><Star size={20} className='text-green-400' /> Plus badge on your account</div>
                </div>
            </div>
        </div>
    )
}

export default MembershipBanner