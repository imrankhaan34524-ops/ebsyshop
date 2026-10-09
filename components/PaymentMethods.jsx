'use client'
// components/PaymentMethods.jsx  (compact version)
import { useState } from 'react'
import { Banknote, CreditCard, Smartphone, Landmark, Copy, Check, CircleCheck } from 'lucide-react'
import toast from 'react-hot-toast'

export const MANUAL_METHODS = ['JAZZCASH', 'EASYPAISA', 'BANK_TRANSFER']

// Account details come from your .env file
const ACCOUNTS = {
    JAZZCASH: {
        title: process.env.NEXT_PUBLIC_JAZZCASH_NAME,
        number: process.env.NEXT_PUBLIC_JAZZCASH_NUMBER,
        numberLabel: 'Number',
        app: 'JazzCash',
    },
    EASYPAISA: {
        title: process.env.NEXT_PUBLIC_EASYPAISA_NAME,
        number: process.env.NEXT_PUBLIC_EASYPAISA_NUMBER,
        numberLabel: 'Number',
        app: 'Easypaisa',
    },
    BANK_TRANSFER: {
        title: process.env.NEXT_PUBLIC_BANK_ACCOUNT_TITLE,
        number: process.env.NEXT_PUBLIC_BANK_IBAN,
        numberLabel: 'IBAN',
        bank: process.env.NEXT_PUBLIC_BANK_NAME,
        app: 'your banking app',
    },
}

const OPTIONS = [
    { id: 'COD', label: 'Cash on Delivery', short: 'Cash', Icon: Banknote, color: '#94a3b8' },
    { id: 'STRIPE', label: 'Card', short: 'Card', Icon: CreditCard, color: '#818cf8' },
    { id: 'JAZZCASH', label: 'JazzCash', short: 'JazzCash', Icon: Smartphone, color: '#f87171' },
    { id: 'EASYPAISA', label: 'Easypaisa', short: 'Easypaisa', Icon: Smartphone, color: '#4ade80' },
    { id: 'BANK_TRANSFER', label: 'Bank Transfer', short: 'Bank', Icon: Landmark, color: '#60a5fa' },
]

const CopyButton = ({ text, label }) => {
    const [done, setDone] = useState(false)

    const copy = async () => {
        try {
            await navigator.clipboard.writeText(String(text))
            setDone(true)
            toast.success('Copied')
            setTimeout(() => setDone(false), 1500)
        } catch {
            toast.error('Could not copy')
        }
    }

    return (
        <button
            type='button'
            onClick={copy}
            aria-label={`Copy ${label}`}
            className='shrink-0 h-6 px-2 rounded-md border border-slate-300 flex items-center gap-1 text-[11px] hover:border-[#22c55e] transition'
        >
            {done ? <Check size={12} className='text-[#22c55e]' /> : <Copy size={12} />}
            {done ? 'Done' : 'Copy'}
        </button>
    )
}

const DetailRow = ({ label, value, copy }) => (
    <div className='flex items-center justify-between gap-2 py-1.5 border-t border-slate-200 first:border-0'>
        <div className='min-w-0'>
            <span className='text-[11px] opacity-70 mr-2'>{label}</span>
            <span className='text-xs font-medium text-slate-700 break-all'>{value}</span>
        </div>
        <CopyButton text={copy ?? value} label={label} />
    </div>
)

const PaymentMethods = ({
    value,
    onChange,
    amount,
    currency,
    reference,
    onReferenceChange,
    sender,
    onSenderChange,
}) => {
    // Only show manual methods that are set up in .env
    const options = OPTIONS.filter((o) => !MANUAL_METHODS.includes(o.id) || ACCOUNTS[o.id]?.number)
    const account = ACCOUNTS[value]
    const isManual = MANUAL_METHODS.includes(value)
    const referenceOk = reference.trim().length >= 6
    const amountText = `${currency}${Number(amount).toLocaleString('en-PK', { maximumFractionDigits: 2 })}`
    const amountRaw = String(Number(Number(amount).toFixed(2)))

    return (
        <div>
            {/* Compact 2-column chips */}
            <div className='grid grid-cols-2 gap-2'>
                {options.map(({ id, label, Icon, color }) => {
                    const selected = value === id
                    return (
                        <button
                            key={id}
                            type='button'
                            onClick={() => onChange(id)}
                            aria-pressed={selected}
                            className={`relative flex items-center gap-2 text-left rounded-lg border px-2.5 py-2 transition [&:last-child:nth-child(odd)]:col-span-2
                            ${selected ? 'border-[#22c55e] bg-[#22c55e]/10 ring-1 ring-[#22c55e]/40' : 'border-slate-300 hover:border-slate-400'}`}
                        >
                            <span
                                className='size-7 shrink-0 rounded-md flex items-center justify-center'
                                style={{ backgroundColor: `${color}26`, color }}
                            >
                                <Icon size={15} />
                            </span>
                            <span className='text-xs font-medium text-slate-700 leading-tight'>{label}</span>
                            {selected && <Check size={14} className='absolute top-1.5 right-1.5 text-[#22c55e]' />}
                        </button>
                    )
                })}
            </div>

            {/* One-line caption for simple methods */}
            {value === 'COD' && <p className='mt-2 text-xs opacity-70'>Pay in cash when your order arrives.</p>}
            {value === 'STRIPE' && <p className='mt-2 text-xs opacity-70'>You will be taken to a secure card checkout.</p>}

            {/* Manual payment: compact box */}
            {isManual && account && (
                <div className='mt-3 rounded-xl border border-[#22c55e]/30 bg-[#22c55e]/5 p-3 text-xs'>
                    <p className='font-medium text-slate-700'>
                        Send {amountText} from {account.app}
                    </p>

                    <div className='mt-2 rounded-lg bg-black/5 dark:bg-white/5 px-3'>
                        <DetailRow label='Amount' value={amountText} copy={amountRaw} />
                        {account.bank && <DetailRow label='Bank' value={account.bank} />}
                        <DetailRow label='Title' value={account.title || '-'} />
                        <DetailRow label={account.numberLabel} value={account.number} />
                    </div>

                    <div className='relative mt-3'>
                        <input
                            type='text'
                            value={reference}
                            onChange={(e) => onReferenceChange(e.target.value)}
                            placeholder='Paste Transaction ID (TID)'
                            autoComplete='off'
                            className='border border-slate-300 bg-transparent p-2 pr-8 rounded-lg w-full outline-none focus:border-[#22c55e] transition text-xs'
                        />
                        {referenceOk && <CircleCheck size={15} className='absolute right-2.5 top-1/2 -translate-y-1/2 text-[#22c55e]' />}
                    </div>
                    <input
                        type='tel'
                        inputMode='tel'
                        value={sender}
                        onChange={(e) => onSenderChange(e.target.value)}
                        placeholder='Your number (optional)'
                        autoComplete='off'
                        className='border border-slate-300 bg-transparent p-2 rounded-lg w-full outline-none focus:border-[#22c55e] transition text-xs mt-2'
                    />
                    <p className='mt-2 text-[11px] opacity-70'>The TID is in your confirmation SMS. We confirm the order after verifying it.</p>
                </div>
            )}
        </div>
    )
}

export default PaymentMethods