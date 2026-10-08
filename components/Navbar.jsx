'use client'
import { Show, SignInButton, SignUpButton, UserButton } from "@clerk/nextjs";
import { PackageIcon, Search, ShoppingCart } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { useSelector } from "react-redux";
import { useUser, useClerk } from "@clerk/nextjs"
import ThemeToggle from "@/components/ThemeToggle";

const Navbar = () => {

    const router = useRouter()
    const { user } = useUser()
    const { openSignIn } = useClerk();

    const [search, setSearch] = useState('')
    const cartCount = useSelector(state => state.cart.total)

    const handleSearch = (e) => {
        e.preventDefault()
        router.push(`/shop?search=${search}`)
    }

    return (
        <nav className="relative bg-white dark:bg-slate-900 transition-colors">
            <div className="mx-6">
                <div className="flex items-center justify-between max-w-7xl mx-auto py-4  transition-all">

                    <Link href="/" className="relative text-4xl font-semibold text-slate-700 dark:text-slate-100">
                        <span className="text-green-600">Ebsy</span>Store<span className="text-green-600 text-5xl leading-0">.</span>
                        <Show when={{ plan: 'members' }}><p className="absolute text-xs font-semibold -top-1 -right-8 px-3 p-0.5 rounded-full flex items-center gap-2 text-white bg-green-500">
                            plus
                        </p></Show>
                    </Link>

                    {/* Desktop Menu */}
                    <div className="hidden sm:flex items-center gap-4 lg:gap-8 text-slate-600 dark:text-slate-300">
                        <Link href="/">Home</Link>
                        <Link href="/shop">Shop</Link>
                        <Link href="/about">About</Link>
                        <Link href="/contact">Contact</Link>

                        <form onSubmit={handleSearch} className="hidden xl:flex items-center w-xs text-sm gap-2 bg-slate-100 dark:bg-slate-800 px-4 py-3 rounded-full">
                            <Search size={18} className="text-slate-600 dark:text-slate-300" />
                            <input className="w-full bg-transparent outline-none placeholder-slate-600 dark:placeholder-slate-400" type="text" placeholder="Search products" value={search} onChange={(e) => setSearch(e.target.value)} required />
                        </form>

                        <Link href="/cart" className="relative flex items-center gap-2 text-slate-600 dark:text-slate-300">
                            <ShoppingCart size={18} />
                            Cart
                            <button className="absolute -top-1 left-3 text-[8px] text-white bg-slate-600 size-3.5 rounded-full">{cartCount}</button>
                        </Link>

                        {/* Day / Night toggle */}
                        <ThemeToggle />

                        <Show when="signed-out">
                            <div className="flex items-center gap-2">
                                <SignInButton mode="modal">
                                    <button className="px-5 py-2 text-slate-600 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white transition">
                                        Sign in
                                    </button>
                                </SignInButton>
                                <SignUpButton mode="modal">
                                    <button className="px-6 py-2 bg-indigo-500 hover:bg-indigo-600 transition text-white rounded-full">
                                        Sign up
                                    </button>
                                </SignUpButton>
                            </div>
                        </Show>
                        <Show when="signed-in">
                            <UserButton afterSignOutUrl="/">
                                <UserButton.MenuItems>
                                    <UserButton.Action
                                        label="My Orders"
                                        labelIcon={<PackageIcon size={16} />}
                                        onClick={() => router.push('/orders')}
                                    />
                                </UserButton.MenuItems>
                            </UserButton>
                        </Show>

                    </div>

                    {/* Mobile User Button  */}
                    <div className="sm:hidden flex items-center gap-3">
                        <ThemeToggle />
                        <Show when="signed-out">
                            <SignInButton mode="modal">
                                <button className="px-7 py-1.5 bg-indigo-500 hover:bg-indigo-600 text-sm transition text-white rounded-full">
                                    Sign in
                                </button>
                            </SignInButton>
                        </Show>
                        <Show when="signed-in">
                            <UserButton afterSignOutUrl="/">
                                <UserButton.MenuItems>
                                    <UserButton.Action
                                        label="My Orders"
                                        labelIcon={<PackageIcon size={16} />}
                                        onClick={() => router.push('/orders')}
                                    />
                                </UserButton.MenuItems>
                            </UserButton>
                        </Show>
                    </div>
                </div>
            </div>
            <hr className="border-gray-300 dark:border-slate-700" />
        </nav>
    )
}

export default Navbar