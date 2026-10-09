'use client'
import Image from "next/image";
import { DotIcon } from "lucide-react";
import { useSelector } from "react-redux";
import Rating from "./Rating";
import { useState } from "react";
import RatingModal from "./RatingModal";
import OrderTracker from "./OrderTracker";

const PAYMENT_LABELS = {
    COD: 'Cash on Delivery',
    STRIPE: 'Card',
    JAZZCASH: 'JazzCash',
    EASYPAISA: 'Easypaisa',
    BANK_TRANSFER: 'Bank Transfer',
}

const STATUS_STYLES = {
    ORDER_PLACED: 'text-[#475569] bg-[#e2e8f0] dark:text-[#e2e8f0] dark:bg-white/10',
    PROCESSING: 'text-[#a16207] bg-[#fef9c3] dark:text-[#fde047] dark:bg-[#facc15]/15',
    SHIPPED: 'text-[#1d4ed8] bg-[#dbeafe] dark:text-[#93c5fd] dark:bg-[#3b82f6]/15',
    DELIVERED: 'text-[#15803d] bg-[#dcfce7] dark:text-[#86efac] dark:bg-[#22c55e]/15',
}

const OrderItem = ({ order }) => {

    const currency = process.env.NEXT_PUBLIC_CURRENCY_SYMBOL || '$';
    const [ratingModal, setRatingModal] = useState(null);

    const { ratings } = useSelector(state => state.rating);

    const statusText = order.status.split('_').join(' ').toLowerCase()
    const statusStyle = STATUS_STYLES[order.status] || STATUS_STYLES.ORDER_PLACED

    // Payment line under the status
    const isManual = ['JAZZCASH', 'EASYPAISA', 'BANK_TRANSFER'].includes(order.paymentMethod)
    const paymentLabel = PAYMENT_LABELS[order.paymentMethod] || order.paymentMethod
    const paymentState = order.isPaid
        ? 'Paid'
        : isManual
            ? 'Verifying payment'
            : order.paymentMethod === 'COD'
                ? 'Pay on delivery'
                : 'Payment pending'

    const findRating = (productId) =>
        ratings.find(rating => order.id === rating.orderId && productId === rating.productId)

    return (
        <>
            <tr className="text-sm">
                <td className="text-left">
                    <div className="flex flex-col gap-6">
                        {order.orderItems.map((item, index) => {
                            const existing = findRating(item.product.id)

                            return (
                                <div key={index} className="flex items-center gap-4">
                                    <div className="w-20 aspect-square bg-slate-100 flex items-center justify-center rounded-md">
                                        <Image
                                            className="h-14 w-auto"
                                            src={item.product.images[0]}
                                            alt="product_img"
                                            width={50}
                                            height={50}
                                        />
                                    </div>
                                    <div className="flex flex-col justify-center text-sm">
                                        <p className="font-medium text-slate-600 text-base">{item.product.name}</p>
                                        <p>{currency}{item.price} Qty : {item.quantity} </p>
                                        <p className="mb-1">{new Date(order.createdAt).toDateString()}</p>
                                        <div>
                                            {existing
                                                ? <Rating value={existing.rating} />
                                                : <button onClick={() => setRatingModal({ orderId: order.id, productId: item.product.id })} className={`text-green-500 hover:bg-green-50 transition ${order.status !== "DELIVERED" && 'hidden'}`}>Rate Product</button>
                                            }
                                        </div>
                                    </div>
                                </div>
                            )
                        })}
                    </div>
                </td>

                <td className="text-center max-md:hidden">{currency}{order.total}</td>

                <td className="text-left max-md:hidden">
                    <p>{order.address.name}, {order.address.street},</p>
                    <p>{order.address.city}, {order.address.state}, {order.address.zip}, {order.address.country},</p>
                    <p>{order.address.phone}</p>
                </td>

                <td className="text-left space-y-2 text-sm max-md:hidden">
                    <div className={`flex items-center justify-center gap-1 rounded-full p-1 ${statusStyle}`}>
                        <DotIcon size={10} className="scale-250" />
                        {statusText}
                    </div>
                    <p className="text-xs text-center">{paymentLabel}</p>
                    <p className={`text-xs text-center font-medium ${order.isPaid ? 'text-[#16a34a] dark:text-[#86efac]' : 'text-[#d97706] dark:text-[#fcd34d]'}`}>{paymentState}</p>
                </td>
            </tr>

            {/* Mobile */}
            <tr className="md:hidden">
                <td colSpan={5}>
                    <p>{order.address.name}, {order.address.street}</p>
                    <p>{order.address.city}, {order.address.state}, {order.address.zip}, {order.address.country}</p>
                    <p>{order.address.phone}</p>
                    <p className="mt-2">Total: {currency}{order.total}</p>
                    <p className="text-xs mt-1">{paymentLabel} · {paymentState}</p>
                    <br />
                    <div className="flex items-center">
                        <span className={`text-center mx-auto px-6 py-1.5 rounded ${statusStyle}`}>
                            {statusText}
                        </span>
                    </div>
                </td>
            </tr>

            {/* Order tracking */}
            <tr>
                <td colSpan={5}>
                    <OrderTracker order={order} />
                </td>
            </tr>

            <tr>
                <td colSpan={4}>
                    <div className="border-b border-slate-300 w-6/7 mx-auto" />
                </td>
            </tr>

            {ratingModal && <RatingModal ratingModal={ratingModal} setRatingModal={setRatingModal} />}
        </>
    )
}

export default OrderItem
