'use client'
import { Show, SignInButton, SignUpButton, UserButton } from "@clerk/nextjs";
import { PackageIcon, Search, ShoppingCart, Store, Menu, X, Crown, LayoutDashboard, ShieldCheck, Clock } from "lucide-react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import ThemeToggle from "@/components/ThemeToggle";
import useDashboardInfo from "@/lib/useDashboardInfo";

const LINKS = [
    { href: '/', label: 'Home' },
    { href: '/shop', label: 'Shop' },
    { href: '/about', label: 'About' },
    { href: '/contact', label: 'Contact' },
]

const GREEN = 'bg-gradient-to-r from-[#22c55e] to-[#16a34a] shadow-md shadow-[#22c55e]/25'
const AMBER = 'bg-gradient-to-r from-[#f59e0b] to-[#d97706] shadow-md shadow-[#f59e0b]/25'
const RED = 'bg-gradient-to-r from-[#ef4444] to-[#dc2626] shadow-md shadow-[#ef4444]/25'

const Navbar = () => {

    const router = useRouter()
    const pathname = usePathname()
    const dash = useDashboardInfo()

    const [search, setSearch] = useState('')
    const [menuOpen, setMenuOpen] = useState(false)
    const cartCount = useSelector(state => state.cart.total)

    const isActive = (href) => (href === '/' ? pathname === '/' : pathname.startsWith(href))

    // What the seller button should be for this visitor
    const approved = dash.hasStore && dash.status === 'approved'
    const rejected = dash.hasStore && dash.status === 'rejected'
    const pending = dash.hasStore && !approved && !rejected

    const seller = approved
        ? { href: '/store', short: 'Store', long: 'My Store', Icon: LayoutDashboard, style: GREEN }
        : pending
            ? { href: '/create-store', short: 'Pending', long: 'Store pending', Icon: Clock, style: AMBER }
            : rejected
                ? { href: '/create-store', short: 'Rejected', long: 'Store rejected', Icon: X, style: RED }
                : { href: '/create-store', short: 'Sell', long: 'Start selling', Icon: Store, style: GREEN }

    const handleSearch = (e) => {
        e.preventDefault()
        setMenuOpen(false)
        router.push(`/shop?search=${encodeURIComponent(search)}`)
    }

    // Close the mobile menu when the page changes or Escape is pressed
    useEffect(() => { setMenuOpen(false) }, [pathname])
    useEffect(() => {
        if (!menuOpen) return
        const onKey = (e) => e.key === 'Escape' && setMenuOpen(false)
        document.addEventListener('keydown', onKey)
        return () => document.removeEventListener('keydown', onKey)
    }, [menuOpen])

    const linkClass = (href) =>
        isActive(href)
            ? 'text-[#16a34a] dark:text-[#4ade80] font-medium'
            : 'text-slate-600 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white'

    // Items inside the profile (avatar) menu
    const userMenu = (
        <UserButton.MenuItems>
            <UserButton.Action
                label="My Orders"
                labelIcon={<PackageIcon size={16} />}
                onClick={() => router.push('/orders')}
            />
            {approved && (
                <UserButton.Action
                    label="My Store Dashboard"
                    labelIcon={<LayoutDashboard size={16} />}
                    onClick={() => router.push('/store')}
                />
            )}
            {dash.isAdmin && (
                <UserButton.Action
                    label="Admin Dashboard"
                    labelIcon={<ShieldCheck size={16} />}
                    onClick={() => router.push('/admin')}
                />
            )}
        </UserButton.MenuItems>
    )

    return (
        <nav className="site-navbar sticky top-0 z-40 bg-white dark:bg-slate-900 backdrop-blur-md transition-colors">
            <div className="mx-4 sm:mx-6">
                <div className="flex items-center justify-between gap-4 max-w-7xl mx-auto py-3 lg:py-4">

                    {/* Logo */}
                    <Link href="/" className="relative shrink-0 text-3xl lg:text-4xl font-semibold text-slate-700 dark:text-slate-100">
                        <span className="text-green-600">Ebsy</span>Store<span className="text-green-600 text-4xl lg:text-5xl leading-0">.</span>
                        <Show when={{ plan: 'members' }}>
                            <p className="absolute text-xs font-semibold -top-2 -right-9 px-3 p-0.5 rounded-full text-white bg-green-500">
                                plus
                            </p>
                        </Show>
                    </Link>

                    {/* ---------- Desktop (large screens) ---------- */}
                    <div className="hidden lg:flex flex-1 items-center justify-center gap-6 xl:gap-8 text-sm xl:text-base">
                        {LINKS.map(({ href, label }) => (
                            <Link key={href} href={href} className={`whitespace-nowrap transition ${linkClass(href)}`}>{label}</Link>
                        ))}
                    </div>

                    <form onSubmit={handleSearch} className="hidden xl:flex items-center w-44 2xl:w-72 text-sm gap-2 bg-slate-100 dark:bg-slate-800 px-4 py-2.5 rounded-full shrink-0">
                        <Search size={16} className="shrink-0 text-slate-600 dark:text-slate-300" />
                        <input className="w-full min-w-0 bg-transparent outline-none placeholder-slate-600 dark:placeholder-slate-400" type="text" placeholder="Search products" value={search} onChange={(e) => setSearch(e.target.value)} required />
                    </form>

                    <div className="hidden lg:flex items-center gap-3 xl:gap-4 shrink-0">
                        <Link href="/cart" className="relative flex items-center gap-1.5 text-slate-600 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white transition whitespace-nowrap text-sm xl:text-base">
                            <ShoppingCart size={18} />
                            Cart
                            {cartCount > 0 && (
                                <span className="absolute -top-2 left-3 min-w-4 h-4 px-1 text-[10px] leading-4 text-center text-white bg-[#22c55e] rounded-full">{cartCount}</span>
                            )}
                        </Link>

                        <ThemeToggle />

                        {/* Seller button: Start selling / Store pending / My Store */}
                        {dash.loading ? (
                            <span className="h-9 w-24 rounded-full bg-black/5 dark:bg-white/10 animate-pulse" />
                        ) : (
                            <Link
                                href={seller.href}
                                className={`flex items-center gap-1.5 px-4 py-2 rounded-full text-sm font-semibold text-white hover:opacity-90 active:scale-95 transition whitespace-nowrap ${seller.style}`}
                            >
                                <seller.Icon size={15} />
                                <span className="xl:hidden">{seller.short}</span>
                                <span className="hidden xl:inline">{seller.long}</span>
                            </Link>
                        )}

                        {/* Admin button (only for you) */}
                        {dash.isAdmin && (
                            <Link
                                href="/admin"
                                title="Admin dashboard"
                                className="flex items-center gap-1.5 px-3 py-2 rounded-full text-sm font-medium border border-indigo-400 text-indigo-600 dark:text-indigo-300 hover:bg-indigo-500/10 active:scale-95 transition whitespace-nowrap"
                            >
                                <ShieldCheck size={15} />
                                <span className="hidden xl:inline">Admin</span>
                            </Link>
                        )}

                        <Show when="signed-out">
                            <div className="flex items-center gap-1">
                                <SignInButton mode="modal">
                                    <button className="px-3 py-2 text-sm xl:text-base whitespace-nowrap text-slate-600 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white transition">
                                        Sign in
                                    </button>
                                </SignInButton>
                                <SignUpButton mode="modal">
                                    <button className="px-5 py-2 text-sm xl:text-base whitespace-nowrap bg-indigo-500 hover:bg-indigo-600 transition text-white rounded-full">
                                        Sign up
                                    </button>
                                </SignUpButton>
                            </div>
                        </Show>
                        <Show when="signed-in">
                            <UserButton afterSignOutUrl="/">
                                {userMenu}
                            </UserButton>
                        </Show>
                    </div>

                    {/* ---------- Mobile and tablet ---------- */}
                    <div className="lg:hidden flex items-center gap-2 shrink-0">
                        {!dash.loading && (
                            <Link
                                href={seller.href}
                                className={`flex items-center gap-1 px-3 py-1.5 rounded-full text-xs font-semibold text-white whitespace-nowrap ${seller.style}`}
                            >
                                <seller.Icon size={13} /> {seller.short}
                            </Link>
                        )}
                        <ThemeToggle />
                        <Show when="signed-in">
                            <UserButton afterSignOutUrl="/">
                                {userMenu}
                            </UserButton>
                        </Show>
                        <button
                            type="button"
                            onClick={() => setMenuOpen((o) => !o)}
                            aria-label={menuOpen ? 'Close menu' : 'Open menu'}
                            aria-expanded={menuOpen}
                            className="size-9 rounded-lg flex items-center justify-center text-slate-700 dark:text-slate-200 hover:bg-black/5 dark:hover:bg-white/10 transition"
                        >
                            {menuOpen ? <X size={22} /> : <Menu size={22} />}
                        </button>
                    </div>
                </div>
            </div>
            <hr className="border-gray-300 dark:border-slate-700" />

            {/* ---------- Mobile menu panel ---------- */}
            {menuOpen && (
                <div className="lg:hidden absolute inset-x-0 top-full bg-[#ffffff] dark:bg-[#0b100e] border-b border-gray-300 dark:border-slate-700 shadow-xl max-h-[calc(100dvh-4rem)] overflow-y-auto">
                    <div className="mx-4 sm:mx-6 max-w-7xl py-4 flex flex-col gap-1">

                        <form onSubmit={handleSearch} className="flex items-center gap-2 bg-slate-100 dark:bg-slate-800 px-4 py-3 rounded-full mb-2">
                            <Search size={18} className="shrink-0 text-slate-600 dark:text-slate-300" />
                            <input className="w-full min-w-0 bg-transparent outline-none text-base placeholder-slate-600 dark:placeholder-slate-400" type="text" placeholder="Search products" value={search} onChange={(e) => setSearch(e.target.value)} required />
                        </form>

                        {LINKS.map(({ href, label }) => (
                            <Link
                                key={href}
                                href={href}
                                className={`px-4 py-3 rounded-xl text-base hover:bg-black/5 dark:hover:bg-white/10 transition ${linkClass(href)}`}
                            >
                                {label}
                            </Link>
                        ))}

                        <Link href="/cart" className={`px-4 py-3 rounded-xl text-base flex items-center justify-between hover:bg-black/5 dark:hover:bg-white/10 transition ${linkClass('/cart')}`}>
                            <span className="flex items-center gap-2"><ShoppingCart size={18} /> Cart</span>
                            {cartCount > 0 && <span className="min-w-5 h-5 px-1.5 text-xs leading-5 text-center text-white bg-[#22c55e] rounded-full">{cartCount}</span>}
                        </Link>

                        <Link href="/pricing" className={`px-4 py-3 rounded-xl text-base flex items-center gap-2 hover:bg-black/5 dark:hover:bg-white/10 transition ${linkClass('/pricing')}`}>
                            <Crown size={18} /> Become a Plus member
                        </Link>

                        {/* Seller row */}
                        {approved ? (
                            <Link href="/store" className="mt-1 px-4 py-3 rounded-xl text-base font-medium flex items-center gap-2 bg-[#22c55e]/10 text-[#16a34a] dark:text-[#4ade80]">
                                <LayoutDashboard size={18} /> My Store Dashboard
                            </Link>
                        ) : pending || rejected ? (
                            <Link href="/create-store" className="mt-1 px-4 py-3 rounded-xl text-base font-medium flex items-center gap-2 bg-[#f59e0b]/10 text-[#b45309] dark:text-[#fbbf24]">
                                <Clock size={18} /> {rejected ? 'Store rejected, view details' : 'Store pending approval'}
                            </Link>
                        ) : (
                            <Link href="/create-store" className="mt-1 px-4 py-3 rounded-xl text-base font-medium flex items-center gap-2 bg-[#22c55e]/10 text-[#16a34a] dark:text-[#4ade80]">
                                <Store size={18} /> Create your store
                            </Link>
                        )}

                        {dash.isAdmin && (
                            <Link href="/admin" className="px-4 py-3 rounded-xl text-base font-medium flex items-center gap-2 text-indigo-600 dark:text-indigo-300 hover:bg-indigo-500/10 transition">
                                <ShieldCheck size={18} /> Admin Dashboard
                            </Link>
                        )}

                        <Show when="signed-out">
                            <div className="grid grid-cols-2 gap-3 mt-3">
                                <SignInButton mode="modal">
                                    <button className="py-3 rounded-full border border-slate-300 dark:border-slate-600 text-base text-slate-700 dark:text-slate-200 whitespace-nowrap">
                                        Sign in
                                    </button>
                                </SignInButton>
                                <SignUpButton mode="modal">
                                    <button className="py-3 rounded-full bg-indigo-500 hover:bg-indigo-600 text-base text-white whitespace-nowrap">
                                        Sign up
                                    </button>
                                </SignUpButton>
                            </div>
                        </Show>
                        <Show when="signed-in">
                            <Link href="/orders" className={`mt-1 px-4 py-3 rounded-xl text-base flex items-center gap-2 hover:bg-black/5 dark:hover:bg-white/10 transition ${linkClass('/orders')}`}>
                                <PackageIcon size={18} /> My Orders
                            </Link>
                        </Show>
                    </div>
                </div>
            )}
        </nav>
    )
}

export default Navbar