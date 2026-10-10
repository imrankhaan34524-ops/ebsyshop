'use client'
import { useEffect, useRef } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useAuth, useUser } from "@clerk/nextjs";
import { fetchProducts } from "@/lib/features/product/productSlice";
import { fetchCart, uploadCart } from "@/lib/features/cart/cartSlice";
import { fetchAddress } from "@/lib/features/address/addressSlice";
import { fetchUserRatings } from "@/lib/features/rating/ratingSlice";
import Banner from "@/components/Banner";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import MobileBottomNav from "@/components/MobileBottomNav";
import SellerCTA from "@/components/SellerCTA";
import ChatWidget from "@/components/ChatWidget";

export default function PublicLayout({ children }) {

    const dispatch = useDispatch()
    const { user } = useUser()
    const { getToken } = useAuth()
    const { cartItems } = useSelector((state) => state.cart)
    const cartLoaded = useRef(false)

    useEffect(() => {
        dispatch(fetchProducts({}))
    }, [dispatch])

    useEffect(() => {
        if (user) {
            Promise.resolve(dispatch(fetchCart({ getToken }))).finally(() => {
                cartLoaded.current = true
            })
            dispatch(fetchAddress({ getToken }))
            dispatch(fetchUserRatings({ getToken }))
        }
    }, [user])

    useEffect(() => {
        if (user && cartLoaded.current) {
            dispatch(uploadCart({ getToken }))
        }
    }, [cartItems])

    return (
        <>
            {/* pb-16 keeps content clear of the mobile bottom bar */}
            <div className="pb-16 sm:pb-0">
                <Banner />
                <Navbar />
                {children}
                <Footer />
            </div>
            <MobileBottomNav />
            <SellerCTA />
            <ChatWidget />
        </>
    );
}