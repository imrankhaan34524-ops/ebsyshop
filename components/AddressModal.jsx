'use client'
import { useAuth } from "@clerk/nextjs"
import { XIcon, Loader2 } from "lucide-react"
import { useEffect, useState } from "react"
import { toast } from "react-hot-toast"
import { useDispatch } from "react-redux"
import axios from "axios"
import { addAddress } from "@/lib/features/address/addressSlice"

const inputClass =
    "w-full p-2.5 px-4 text-sm bg-transparent border border-slate-300 rounded-lg outline-none " +
    "focus:border-[#22c55e] focus:ring-1 focus:ring-[#22c55e]/40 transition"

const AddressModal = ({ setShowAddressModal }) => {

    const {getToken} =useAuth()
    const dispatch = useDispatch()

    const [saving, setSaving] = useState(false)
    const [address, setAddress] = useState({
        name: '',
        email: '',
        street: '',
        city: '',
        state: '',
        zip: '',
        country: 'Pakistan',
        phone: ''
    })

    // Close with the Escape key, and stop the page behind from scrolling
    useEffect(() => {
        const onKey = (e) => e.key === 'Escape' && setShowAddressModal(false)
        document.addEventListener('keydown', onKey)
        const previous = document.body.style.overflow
        document.body.style.overflow = 'hidden'
        return () => {
            document.removeEventListener('keydown', onKey)
            document.body.style.overflow = previous
        }
    }, [setShowAddressModal])

    const handleAddressChange = (e) => {
        setAddress({
            ...address,
            [e.target.name]: e.target.value
        })
    }

    const handleSubmit = async (e) => {
        e.preventDefault()
        setSaving(true)
        try {
            const token = await getToken()
            const { data } = await axios.post('/api/address', {address}, {headers:
            { Authorization: `Bearer ${token}` } })
            dispatch(addAddress(data.newAddress))
            toast.success(data.message)
            setShowAddressModal(false)
        } catch (error) {
            console.log(error)
            toast.error(error?.response?.data?.error || error?.response?.data?.message || error.message)
            setSaving(false)
        }
    }

    return (
        // Dark overlay: click outside the card to close
        <div
            className="fixed inset-0 z-[100] bg-black/60 backdrop-blur-sm overflow-y-auto"
            onClick={(e) => e.target === e.currentTarget && setShowAddressModal(false)}
        >
            <div className="min-h-full flex items-center justify-center p-4" onClick={(e) => e.target === e.currentTarget && setShowAddressModal(false)}>
                <form
                    onSubmit={handleSubmit}
                    className="relative w-full max-w-md rounded-2xl bg-[#ffffff] dark:bg-[#0e1512] border border-slate-200 shadow-2xl p-6 sm:p-7 text-slate-700"
                >
                    <button
                        type="button"
                        onClick={() => setShowAddressModal(false)}
                        aria-label="Close"
                        className="absolute top-4 right-4 size-8 rounded-full flex items-center justify-center text-slate-500 hover:text-slate-800 hover:bg-black/5 dark:hover:bg-white/10 transition"
                    >
                        <XIcon size={20} />
                    </button>

                    <h2 className="text-2xl">Add New <span className="font-semibold">Address</span></h2>
                    <p className="text-xs text-slate-500 mt-1 mb-5">We will deliver your order to this address.</p>

                    <div className="flex flex-col gap-3.5">
                        <input name="name" autoComplete="name" onChange={handleAddressChange} value={address.name} className={inputClass} type="text" placeholder="Full name" required />
                        <input name="email" autoComplete="email" onChange={handleAddressChange} value={address.email} className={inputClass} type="email" placeholder="Email address" required />
                        <input name="street" autoComplete="street-address" onChange={handleAddressChange} value={address.street} className={inputClass} type="text" placeholder="Street and house number" required />
                        <div className="flex gap-3">
                            <input name="city" autoComplete="address-level2" onChange={handleAddressChange} value={address.city} className={inputClass} type="text" placeholder="City" required />
                            <input name="state" autoComplete="address-level1" onChange={handleAddressChange} value={address.state} className={inputClass} type="text" placeholder="State / Province" required />
                        </div>
                        <div className="flex gap-3">
                            <input name="zip" autoComplete="postal-code" inputMode="numeric" onChange={handleAddressChange} value={address.zip} className={inputClass} type="text" placeholder="Zip code" required />
                            <input name="country" autoComplete="country-name" onChange={handleAddressChange} value={address.country} className={inputClass} type="text" placeholder="Country" required />
                        </div>
                        <input name="phone" autoComplete="tel" inputMode="tel" onChange={handleAddressChange} value={address.phone} className={inputClass} type="tel" placeholder="Phone number" required />
                    </div>

                    <button
                        disabled={saving}
                        className="mt-6 w-full py-3 rounded-xl text-sm font-semibold text-white bg-gradient-to-r from-[#22c55e] to-[#16a34a] shadow-lg shadow-[#22c55e]/20 flex items-center justify-center gap-2 active:scale-[0.98] transition disabled:opacity-60 disabled:cursor-not-allowed"
                    >
                        {saving ? <><Loader2 size={16} className="animate-spin" /> Saving...</> : 'Save address'}
                    </button>
                </form>
            </div>
        </div>
    )
}

export default AddressModal