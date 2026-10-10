'use client'
import { FREE_SHIPPING_THRESHOLD, SHIPPING_FEE } from '@/lib/shipping'

const currency = process.env.NEXT_PUBLIC_CURRENCY_SYMBOL || 'Rs.'

const faqs = [
    {
        q: 'How long does delivery take?',
        a: 'Orders usually arrive within 3 to 7 working days, depending on your city and the seller.',
    },
    {
        q: 'Is shipping free?',
        a: `Shipping is free on orders of ${currency}${FREE_SHIPPING_THRESHOLD.toLocaleString('en-PK')} or more, and always free for Plus members. Otherwise a flat ${currency}${SHIPPING_FEE} shipping fee applies.`,
    },
    {
        q: 'Which payment methods do you accept?',
        a: 'You can pay with Cash on Delivery, JazzCash, Easypaisa, bank transfer, or a credit or debit card.',
    },
    {
        q: 'How do JazzCash, Easypaisa and bank payments work?',
        a: 'Choose the method at checkout, send the exact amount to the account shown, then enter the Transaction ID (TID) from your confirmation message. We confirm your order after we verify the payment.',
    },
    {
        q: 'Can I track my order?',
        a: 'Yes. Open My Orders to see a progress tracker (placed, processing, shipped, delivered). Once your order ships, the courier name and tracking ID appear there too.',
    },
    {
        q: 'Can I return a product?',
        a: 'Yes. You can return any item within 7 days if you change your mind. See our Returns and Refunds policy for details.',
    },
    {
        q: 'What do I get with a Plus membership?',
        a: 'Free shipping on every order and access to coupons made only for members.',
    },
    {
        q: 'How do I sell on EbsyStore?',
        a: 'Create an account, choose Create Your Store, and send us your store details. After we approve your store, you get your own seller dashboard to add products and manage orders.',
    },
]

const FAQ = () => {

    // Helps Google show these answers directly in search results
    const jsonLd = {
        '@context': 'https://schema.org',
        '@type': 'FAQPage',
        mainEntity: faqs.map((item) => ({
            '@type': 'Question',
            name: item.q,
            acceptedAnswer: { '@type': 'Answer', text: item.a },
        })),
    }

    return (
        <div className='px-6 my-30 max-w-3xl mx-auto'>
            <script type='application/ld+json' dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />
            <div className='text-center'>
                <h2 className='text-2xl font-semibold text-slate-800'>Frequently Asked Questions</h2>
                <p className='text-sm text-slate-600 mt-2'>Quick answers to common questions.</p>
            </div>
            <div className='mt-12 flex flex-col gap-3'>
                {faqs.map((item, index) => (
                    <details key={index} className='group rounded-lg border border-slate-200 bg-slate-50 p-5'>
                        <summary className='cursor-pointer list-none flex items-center justify-between text-sm font-medium text-slate-800'>
                            {item.q}
                            <span className='text-green-500 text-xl group-open:rotate-45 transition'>+</span>
                        </summary>
                        <p className='text-sm text-slate-600 mt-3'>{item.a}</p>
                    </details>
                ))}
            </div>
        </div>
    )
}

export default FAQ