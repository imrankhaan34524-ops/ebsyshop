'use client'

const faqs = [
    { q: 'How long does delivery take?', a: 'Orders usually arrive within 3 to 7 working days, depending on your city and the seller.' },
    { q: 'Can I return a product?', a: 'Yes. You can return any item within 7 days if you change your mind.' },
    { q: 'Which payment methods do you accept?', a: 'You can pay by cash on delivery or by card through Stripe.' },
    { q: 'What do I get with a Plus membership?', a: 'Free shipping on every order and access to coupons made only for members.' },
]

const FAQ = () => {
    return (
        <div className='px-6 my-30 max-w-3xl mx-auto'>
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