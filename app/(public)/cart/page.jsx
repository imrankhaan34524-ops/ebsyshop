'use client'
import Counter from "@/components/Counter";
import OrderSummary from "@/components/OrderSummary";
import PageTitle from "@/components/PageTitle";
import Loading from "@/components/Loading";
import { deleteItemFromCart } from "@/lib/features/cart/cartSlice";
import { Trash2Icon } from "lucide-react";
import Image from "next/image";
import { useMemo } from "react";
import { useDispatch, useSelector } from "react-redux";

export default function Cart() {

    const currency = process.env.NEXT_PUBLIC_CURRENCY_SYMBOL || '$';
    
    const { cartItems } = useSelector(state => state.cart);
    const products = useSelector(state => state.product.list);

    const dispatch = useDispatch();

    // Cart lines and the total are worked out directly from the cart and product list
    const cartArray = useMemo(() => {
        const lines = [];
        for (const [key, value] of Object.entries(cartItems)) {
            const product = products.find(product => product.id === key);
            if (product) {
                lines.push({ ...product, quantity: value });
            }
        }
        return lines;
    }, [cartItems, products]);

    const totalPrice = useMemo(
        () => cartArray.reduce((sum, item) => sum + item.price * item.quantity, 0),
        [cartArray]
    );

    const handleDeleteItemFromCart = (productId) => {
        dispatch(deleteItemFromCart({ productId }))
    }

    // Products are still loading, so do not flash "cart is empty"
    if (products.length === 0 && Object.keys(cartItems).length > 0) {
        return <Loading />
    }

    return cartArray.length > 0 ? (
        <div className="min-h-screen mx-4 sm:mx-6 text-slate-800 pb-16">

            <div className="max-w-5xl mx-auto">
                {/* Title */}
                <PageTitle heading="My Cart" text="items in your cart" linkText="Add more" />

                {/* Cart items */}
                <div className="rounded-2xl border border-slate-200 bg-[#ffffff] dark:bg-white/5 divide-y divide-slate-200 overflow-hidden shadow-sm">
                    {cartArray.map((item) => (
                        <div key={item.id} className="flex flex-wrap items-center gap-x-4 gap-y-3 p-4">
                            <div className="flex items-center justify-center bg-slate-100 size-18 rounded-md shrink-0">
                                <Image src={item.images[0]} className="h-14 w-auto" alt="" width={45} height={45} />
                            </div>

                            <div className="flex-1 min-w-[140px]">
                                <p className="text-sm sm:text-base font-medium text-slate-700">{item.name}</p>
                                <p className="text-xs text-slate-500">{item.category}</p>
                                <p className="text-sm text-slate-600">{currency}{item.price}</p>
                            </div>

                            <div className="flex items-center gap-4 ml-auto">
                                <Counter productId={item.id} />
                                <p className="w-24 text-right font-medium text-slate-700">
                                    {currency}{(item.price * item.quantity).toLocaleString()}
                                </p>
                                <button
                                    onClick={() => handleDeleteItemFromCart(item.id)}
                                    aria-label={`Remove ${item.name}`}
                                    className="text-red-500 hover:bg-red-50 p-2.5 rounded-full active:scale-95 transition-all"
                                >
                                    <Trash2Icon size={18} />
                                </button>
                            </div>
                        </div>
                    ))}
                </div>

                {/* Checkout below the items */}
                <div className="mt-8">
                    <OrderSummary layout="wide" totalPrice={totalPrice} items={cartArray} />
                </div>
            </div>
        </div>
    ) : (
        <div className="min-h-[80vh] mx-6 flex items-center justify-center text-slate-400">
            <h1 className="text-2xl sm:text-4xl font-semibold">Your cart is empty</h1>
        </div>
    )
}