import { PlusIcon, XIcon, MapPin, Check, Lock, Loader2, TicketPercent, Truck } from 'lucide-react';
import React, { useState } from 'react'
import AddressModal from './AddressModal';
import { useSelector } from 'react-redux';
import toast from 'react-hot-toast';
import { useRouter } from 'next/navigation';
import { Show, SignInButton, useAuth, useUser } from "@clerk/nextjs"
import axios from 'axios';
import PaymentMethods, { MANUAL_METHODS } from './PaymentMethods';

const StepTitle = ({ n, children }) => (
    <div className='flex items-center gap-2 mb-2'>
        <span className='size-5 rounded-full bg-[#22c55e] text-white text-[11px] font-semibold flex items-center justify-center'>{n}</span>
        <h3 className='text-xs font-semibold uppercase tracking-wide text-slate-700'>{children}</h3>
    </div>
)

// layout="side"  -> narrow column next to the cart items (default)
// layout="wide"  -> full width card placed below the cart items
const OrderSummary = ({ totalPrice, items, layout = 'side' }) => { 

    const wide = layout === 'wide'

    const {user}= useUser();
    const {getToken, has} = useAuth();
    const currency = process.env.NEXT_PUBLIC_CURRENCY_SYMBOL || 'Rs.';

    const router = useRouter();

    const addressList = useSelector(state => state.address.list);

    const [paymentMethod, setPaymentMethod] = useState('COD');
    const [paymentReference, setPaymentReference] = useState('');
    const [paymentSenderNumber, setPaymentSenderNumber] = useState('');
    const [selectedAddress, setSelectedAddress] = useState(null);
    const [showAddressModal, setShowAddressModal] = useState(false);
    const [couponCodeInput, setCouponCodeInput] = useState('');
    const [coupon, setCoupon] = useState('');
    const [showCoupon, setShowCoupon] = useState(false);
    const [placing, setPlacing] = useState(false);

    const isManual = MANUAL_METHODS.includes(paymentMethod)
    const isPlusMember = has ? has({ plan: 'members' }) : false

    // Amount the customer has to pay (same math as the server)
    const discountAmount = coupon ? (coupon.discount / 100) * totalPrice : 0
    const shipping = isPlusMember ? 0 : 199
    const payable = Math.max(0, totalPrice - discountAmount + shipping)
    const money = (n) => `${currency}${Number(n).toLocaleString('en-PK', { maximumFractionDigits: 2 })}`

    // What is still missing before the customer can order
    const missing = []
    if (!selectedAddress) missing.push('Choose a delivery address')
    if (isManual && paymentReference.trim().length < 6) missing.push('Enter your Transaction ID')
    const canOrder = missing.length === 0 && !placing

    const buttonLabel =
        paymentMethod === 'STRIPE' ? `Pay ${money(payable)}`
        : isManual ? `Confirm payment · ${money(payable)}`
        : `Place order · ${money(payable)}`

    const handleCouponCode = async (event) => {
        event.preventDefault();
        try {
            const token = await getToken();
            const { data } = await axios.post('/api/coupon', { code: couponCodeInput }, {
                headers: { Authorization: `Bearer ${token}` }
            })
            setCoupon(data.coupon)
            toast.success('Coupon Applied')
        } catch (error) {
            toast.error(error?.response?.data?.error || error.message)
        }
    }

    const handlePlaceOrder = async () => {
        if (!canOrder) return
        setPlacing(true)
        try {
            const token = await getToken();

            const orderData = {
                addressId: selectedAddress.id,
                items: items.map((item) => ({ id: item.id, quantity: item.quantity })),
                couponCode: coupon ? coupon.code : null,
                paymentMethod,
                paymentReference: isManual ? paymentReference.trim() : null,
                paymentSenderNumber: isManual ? paymentSenderNumber.trim() : null,
            }

            const { data } = await axios.post('/api/orders', orderData, {
                headers: { Authorization: `Bearer ${token}` }
            })

            if (paymentMethod === 'STRIPE') {
                window.location.href = data.session.url
                return
            }
            toast.success(data.message)
            router.push('/orders')
        } catch (error) {
            toast.error(error?.response?.data?.error || error.message)
            setPlacing(false)
        }
    }

    return (
        <div className={`w-full bg-[#ffffff] dark:bg-[#0e1512]/90 border border-slate-200 text-slate-500 text-sm rounded-2xl p-4 sm:p-5 shadow-sm
            ${wide ? 'max-w-none' : 'max-w-lg lg:max-w-[330px] lg:sticky lg:top-6'}`}>

            <h2 className='text-base font-semibold text-slate-700 mb-4'>Checkout</h2>

            <div className={wide ? 'grid md:grid-cols-[1fr_320px] gap-6 items-start' : 'space-y-5'}>

                {/* LEFT: address + payment */}
                <div className='space-y-5'>
                    {/* STEP 1: Address */}
                    <div>
                        <StepTitle n={1}>Delivery address</StepTitle>
                        <Show when='signed-out'>
                            <SignInButton mode='modal'>
                                <button type='button' className='w-full flex items-center justify-center gap-2 rounded-xl border border-dashed border-slate-400 py-3 text-xs hover:border-[#22c55e] hover:text-[#22c55e] transition'>
                                    <MapPin size={14} /> Sign in to choose your delivery address
                                </button>
                            </SignInButton>
                        </Show>
                        <Show when='signed-in'>
                        {selectedAddress ? (
                            <div className='flex items-center gap-2 rounded-xl border border-[#22c55e] bg-[#22c55e]/10 px-3 py-2'>
                                <MapPin size={15} className='shrink-0 text-[#22c55e]' />
                                <p className='flex-1 min-w-0 text-xs'>
                                    <span className='font-medium text-slate-700'>{selectedAddress.name}</span>
                                    <span className='block truncate'>{selectedAddress.street}, {selectedAddress.city}</span>
                                </p>
                                <button type='button' onClick={() => setSelectedAddress(null)} className='text-xs underline shrink-0'>Change</button>
                            </div>
                        ) : (
                            <div className='flex flex-col gap-2'>
                                {addressList.map((address, index) => (
                                    <button
                                        key={address.id || index}
                                        type='button'
                                        onClick={() => setSelectedAddress(address)}
                                        className='flex items-start gap-2 text-left rounded-xl border border-slate-300 hover:border-[#22c55e] px-3 py-2 transition'
                                    >
                                        <MapPin size={15} className='mt-0.5 shrink-0' />
                                        <span className='text-xs min-w-0'>
                                            <span className='block text-sm font-medium text-slate-700'>{address.name}</span>
                                            <span className='block'>{address.street}, {address.city}, {address.state}</span>
                                            <span className='block opacity-70'>{address.phone}</span>
                                        </span>
                                    </button>
                                ))}
                                <button type='button' onClick={() => setShowAddressModal(true)} className='flex items-center justify-center gap-1 rounded-xl border border-dashed border-slate-400 py-1.5 text-xs hover:border-[#22c55e] hover:text-[#22c55e] transition'>
                                    <PlusIcon size={13} /> Add new address
                                </button>
                            </div>
                        )}
                        </Show>
                    </div>

                    {/* STEP 2: Payment */}
                    <div>
                        <StepTitle n={2}>Payment method</StepTitle>
                        <PaymentMethods
                            value={paymentMethod}
                            onChange={setPaymentMethod}
                            amount={payable}
                            currency={currency}
                            reference={paymentReference}
                            onReferenceChange={setPaymentReference}
                            sender={paymentSenderNumber}
                            onSenderChange={setPaymentSenderNumber}
                        />
                    </div>
                </div>

                {/* RIGHT: review + pay */}
                <div>
                    <StepTitle n={3}>Review and pay</StepTitle>

                    <div className='rounded-xl bg-black/5 dark:bg-white/5 p-3 space-y-1.5 text-xs'>
                        <div className='flex justify-between'>
                            <span>Subtotal</span>
                            <span className='font-medium text-slate-700'>{money(totalPrice)}</span>
                        </div>
                        <div className='flex justify-between'>
                            <span className='flex items-center gap-1.5'><Truck size={13} /> Shipping</span>
                            <span className='font-medium text-slate-700'>
                                <Show when={{ plan: 'members' }} fallback={money(199)}>Free</Show>
                            </span>
                        </div>
                        {coupon && (
                            <div className='flex justify-between text-[#16a34a] dark:text-[#86efac]'>
                                <span className='flex items-center gap-1.5'>
                                    <TicketPercent size={13} /> {coupon.code.toUpperCase()}
                                    <XIcon size={13} onClick={() => setCoupon('')} className='cursor-pointer hover:opacity-70' />
                                </span>
                                <span className='font-medium'>-{money(discountAmount)}</span>
                            </div>
                        )}
                        <div className='flex justify-between pt-2 border-t border-slate-300 text-sm'>
                            <span className='font-semibold text-slate-700'>Total</span>
                            <span className='font-semibold text-slate-700'>{money(payable)}</span>
                        </div>
                    </div>

                    {/* Coupon */}
                    {!coupon && (
                        showCoupon ? (
                            <form onSubmit={e => toast.promise(handleCouponCode(e), { loading: 'Checking Coupon...' })} className='flex gap-2 mt-3'>
                                <input onChange={(e) => setCouponCodeInput(e.target.value)} value={couponCodeInput} type="text" placeholder='Coupon code' className='border border-slate-300 bg-transparent p-2 rounded-lg w-full outline-none focus:border-[#22c55e] transition text-xs' required />
                                <button className='bg-[#22c55e] hover:bg-[#16a34a] text-white px-3 text-xs rounded-lg active:scale-95 transition'>Apply</button>
                            </form>
                        ) : (
                            <button type='button' onClick={() => setShowCoupon(true)} className='mt-3 text-xs flex items-center gap-1.5 hover:text-[#22c55e] transition'>
                                <TicketPercent size={13} /> Have a coupon code?
                            </button>
                        )
                    )}

                    {/* The ONE main button */}
                    <div className='mt-4'>
                        <Show when='signed-out'>
                            <SignInButton mode='modal'>
                                <button type='button' className='w-full py-3 rounded-xl text-sm font-semibold text-white bg-gradient-to-r from-[#22c55e] to-[#16a34a] shadow-lg shadow-[#22c55e]/20 active:scale-[0.98] transition'>
                                    Sign in to place your order
                                </button>
                            </SignInButton>
                        </Show>
                        <Show when='signed-in'>
                            <button
                                type='button'
                                onClick={handlePlaceOrder}
                                disabled={!canOrder}
                                className='w-full py-3 rounded-xl text-sm font-semibold text-white bg-gradient-to-r from-[#22c55e] to-[#16a34a] shadow-lg shadow-[#22c55e]/20 flex items-center justify-center gap-2 active:scale-[0.98] transition disabled:opacity-50 disabled:cursor-not-allowed disabled:shadow-none'
                            >
                                {placing ? <><Loader2 size={16} className='animate-spin' /> Placing order...</> : <><Lock size={14} /> {buttonLabel}</>}
                            </button>

                            {missing.length > 0 && !placing && (
                                <ul className='mt-2 space-y-0.5 text-xs text-[#d97706] dark:text-[#fcd34d]'>
                                    {missing.map((m) => <li key={m}>• {m}</li>)}
                                </ul>
                            )}
                        </Show>
                        <p className='mt-3 text-[11px] text-center opacity-70'>Secure checkout · Easy returns</p>
                    </div>
                </div>
            </div>

            {showAddressModal && <AddressModal setShowAddressModal={setShowAddressModal} />}

        </div>
    )
}
 
export default OrderSummary