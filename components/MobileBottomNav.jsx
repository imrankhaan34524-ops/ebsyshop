'use client'
// components/MobileBottomNav.jsx
import Link from 'next/link'
import { usePathname, useRouter } from 'next/navigation'
import { Home, Store, ShoppingCart, User, PackageIcon } from 'lucide-react'
import { Show, SignInButton, UserButton } from '@clerk/nextjs'
import { useSelector } from 'react-redux'

const TABS = [
    { href: '/', label: 'Home', Icon: Home },
    { href: '/shop', label: 'Shop', Icon: Store },
    { href: '/cart', label: 'Cart', Icon: ShoppingCart },
]

const MobileBottomNav = () => {
    const pathname = usePathname()
    const router = useRouter()
    const cartCount = useSelector((state) => state.cart.total)

    const isActive = (href) => (href === '/' ? pathname === '/' : pathname.startsWith(href))

    return (
        <nav
            aria-label='Main'
            className='sm:hidden fixed bottom-0 inset-x-0 z-40 bg-[#ffffff]/95 dark:bg-[#0a0f0d]/95 backdrop-blur border-t border-slate-200'
            style={{ paddingBottom: 'env(safe-area-inset-bottom)' }}
        >
            <div className='grid grid-cols-4 h-16'>
                {TABS.map(({ href, label, Icon }) => {
                    const active = isActive(href)
                    return (
                        <Link
                            key={href}
                            href={href}
                            className={`relative flex flex-col items-center justify-center gap-1 text-[11px] font-medium transition
                            ${active ? 'text-[#16a34a] dark:text-[#4ade80]' : 'text-slate-500'}`}
                        >
                            <span className='relative'>
                                <Icon size={21} strokeWidth={active ? 2.4 : 2} />
                                {href === '/cart' && cartCount > 0 && (
                                    <span className='absolute -top-1.5 -right-2.5 min-w-4 h-4 px-1 rounded-full bg-[#22c55e] text-white text-[10px] flex items-center justify-center'>
                                        {cartCount}
                                    </span>
                                )}
                            </span>
                            {label}
                            {active && <span className='absolute top-0 h-0.5 w-8 rounded-full bg-[#22c55e]' />}
                        </Link>
                    )
                })}

                {/* Account */}
                <div className='flex flex-col items-center justify-center gap-1 text-[11px] font-medium text-slate-500'>
                    <Show when='signed-out'>
                        <SignInButton mode='modal'>
                            <button type='button' className='flex flex-col items-center gap-1'>
                                <User size={21} />
                                Sign in
                            </button>
                        </SignInButton>
                    </Show>
                    <Show when='signed-in'>
                        <UserButton afterSignOutUrl='/'>
                            <UserButton.MenuItems>
                                <UserButton.Action
                                    label='My Orders'
                                    labelIcon={<PackageIcon size={16} />}
                                    onClick={() => router.push('/orders')}
                                />
                            </UserButton.MenuItems>
                        </UserButton>
                        Account
                    </Show>
                </div>
            </div>
        </nav>
    )
}

export default MobileBottomNav
