// components/SellerBanner.jsx
// A full section for the home page that promotes "Create your store".
import Link from 'next/link'
import { Store, ClipboardCheck, PackagePlus, ArrowRight } from 'lucide-react'

const STEPS = [
    { Icon: Store, title: 'Create your store', text: 'Add your store name, logo and contact details.' },
    { Icon: ClipboardCheck, title: 'Get approved', text: 'We review your details and approve your store.' },
    { Icon: PackagePlus, title: 'List and sell', text: 'Add products and manage orders from your dashboard.' },
]

const SellerBanner = () => {
    return (
        <section className='px-6 my-30 max-w-6xl mx-auto' aria-labelledby='sell-heading'>
            <div className='relative overflow-hidden rounded-3xl bg-gradient-to-br from-[#052e16] via-[#14532d] to-[#1e1b4b] text-white p-8 sm:p-12'>
                {/* soft glows */}
                <div className='pointer-events-none absolute -top-24 -right-24 size-72 rounded-full bg-[#22c55e]/25 blur-3xl' />
                <div className='pointer-events-none absolute -bottom-24 -left-24 size-72 rounded-full bg-[#8b5cf6]/25 blur-3xl' />

                <div className='relative flex flex-col lg:flex-row items-center justify-between gap-10'>
                    <div className='max-w-lg text-center lg:text-left'>
                        <span className='inline-block text-xs font-semibold px-3 py-1 rounded-full bg-[#22c55e] text-white'>For sellers</span>
                        <h2 id='sell-heading' className='text-2xl sm:text-4xl font-semibold mt-4 leading-tight text-white'>
                            Own a gadget business? Open your store on EbsyStore.
                        </h2>
                        <p className='text-sm sm:text-base text-[#d1fae5] mt-4'>
                            Reach buyers looking for phones, audio and accessories. Set up in minutes and manage everything from your own seller dashboard.
                        </p>
                        <Link
                            href='/create-store'
                            className='inline-flex items-center gap-2 mt-7 px-8 py-3 rounded-full bg-[#22c55e] hover:bg-[#16a34a] text-white text-sm font-semibold shadow-lg shadow-black/20 active:scale-95 transition'
                        >
                            Create your store <ArrowRight size={16} />
                        </Link>
                    </div>

                    <ol className='w-full lg:max-w-sm space-y-3'>
                        {STEPS.map(({ Icon, title, text }, index) => (
                            <li key={title} className='flex items-start gap-4 rounded-2xl bg-white/10 border border-white/15 p-4'>
                                <span className='size-10 shrink-0 rounded-xl bg-[#22c55e]/25 text-[#86efac] flex items-center justify-center'>
                                    <Icon size={20} />
                                </span>
                                <div>
                                    <p className='text-sm font-semibold text-white'>{index + 1}. {title}</p>
                                    <p className='text-xs text-[#d1fae5] mt-0.5'>{text}</p>
                                </div>
                            </li>
                        ))}
                    </ol>
                </div>
            </div>
        </section>
    )
}

export default SellerBanner
