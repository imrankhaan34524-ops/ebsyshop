// components/OrderTracker.jsx
import { Check } from 'lucide-react'

const STEPS = [
    { key: 'ORDER_PLACED', label: 'Order placed' },
    { key: 'PROCESSING', label: 'Processing' },
    { key: 'SHIPPED', label: 'Shipped' },
    { key: 'DELIVERED', label: 'Delivered' },
]

const formatDate = (date) =>
    date
        ? new Date(date).toLocaleDateString('en-PK', { day: 'numeric', month: 'short' })
        : null

const OrderTracker = ({ order }) => {
    const currentIndex = Math.max(0, STEPS.findIndex((s) => s.key === order.status))

    // Date shown under each step (only when we have it)
    const dates = [
        formatDate(order.createdAt),
        formatDate(order.processingAt),
        formatDate(order.shippedAt),
        formatDate(order.deliveredAt),
    ]

    return (
        <div className='w-full max-w-2xl mx-auto'>
            <div className='flex items-start'>
                {STEPS.map((step, index) => {
                    const done = index <= currentIndex
                    const isLast = index === STEPS.length - 1

                    return (
                        <div key={step.key} className={`flex flex-col items-center ${isLast ? '' : 'flex-1'}`}>
                            <div className='flex items-center w-full'>
                                {/* Circle */}
                                <div
                                    className={`size-7 shrink-0 rounded-full flex items-center justify-center text-xs font-semibold
                                    ${done ? 'bg-[#22c55e] text-white' : 'bg-[#cbd5e1] dark:bg-[#334155] text-[#64748b] dark:text-[#cbd5e1]'}`}
                                >
                                    {done ? <Check size={14} /> : index + 1}
                                </div>
                                {/* Line to next step */}
                                {!isLast && (
                                    <div className={`h-1 flex-1 mx-1 rounded-full ${index < currentIndex ? 'bg-[#22c55e]' : 'bg-[#cbd5e1] dark:bg-[#334155]'}`} />
                                )}
                            </div>
                            <p className={`mt-2 text-xs text-center ${done ? 'font-medium' : 'opacity-70'}`}>{step.label}</p>
                            {done && dates[index] && <p className='text-[11px] opacity-70'>{dates[index]}</p>}
                        </div>
                    )
                })}
            </div>

            {(order.courier || order.trackingId) && (
                <p className='mt-4 text-xs text-center'>
                    {order.courier && <>Courier: <span className='font-medium'>{order.courier}</span></>}
                    {order.courier && order.trackingId && ' · '}
                    {order.trackingId && <>Tracking ID: <span className='font-medium select-all'>{order.trackingId}</span></>}
                </p>
            )}
        </div>
    )
}

export default OrderTracker
