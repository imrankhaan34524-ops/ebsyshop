'use client'
import { assets } from "@/assets/assets"
import Image from "next/image"
import { useState } from "react"
import { toast } from "react-hot-toast"
import { useAuth } from "@clerk/nextjs"
import axios from "axios"

// Shrinks the photo before it is sent to the AI, so the request is much smaller
const compressImage = (file, maxSize = 800, quality = 0.7) =>
    new Promise((resolve, reject) => {
        const img = new window.Image()
        const url = URL.createObjectURL(file)
        img.onload = () => {
            const scale = Math.min(1, maxSize / Math.max(img.width, img.height))
            const canvas = document.createElement("canvas")
            canvas.width = Math.round(img.width * scale)
            canvas.height = Math.round(img.height * scale)
            canvas.getContext("2d").drawImage(img, 0, 0, canvas.width, canvas.height)
            URL.revokeObjectURL(url)
            resolve(canvas.toDataURL("image/jpeg", quality).split(",")[1])
        }
        img.onerror = reject
        img.src = url
    })

export default function StoreAddProduct() {

    const currency = process.env.NEXT_PUBLIC_CURRENCY_SYMBOL || '$'

    const categories = ['Electronics', 'Clothing', 'Home & Kitchen', 'Beauty & Health', 'Toys & Games', 'Sports & Outdoors', 'Books & Media', 'Food & Drink', 'Hobbies & Crafts', 'Others']

    const [images, setImages] = useState({ 1: null, 2: null, 3: null, 4: null })
    const [productInfo, setProductInfo] = useState({
        name: "",
        description: "",
        mrp: 0,
        price: 0,
        category: "",
        saleEndsAt: "",
    })
    const [loading, setLoading] = useState(false)
    const [aiUsed, setAiUsed] = useState(false)

    const { getToken } = useAuth()


    const onChangeHandler = (e) => {
        setProductInfo({ ...productInfo, [e.target.name]: e.target.value })
    }

    const handleImageUpload = async (key, file) => {
        setImages(prev => ({ ...prev, [key]: file }))

        if (key === "1" && file && !aiUsed) {
            try {
                const base64String = await compressImage(file)
                const token = await getToken()

                await toast.promise(
                    axios.post('/api/store/ai', { base64Image: base64String, mimeType: "image/jpeg" },
                        { headers: { Authorization: `Bearer ${token}` } }),
                    {
                        loading: "Analyzing image with AI...",
                        success: (res) => {
                            const data = res.data
                            if (data.name && data.description) {
                                setProductInfo(prev => ({
                                    ...prev,
                                    name: data.name,
                                    description: data.description
                                }))
                                setAiUsed(true)
                                return "AI filled product info 🎉"
                            }
                            return "AI could not analyze the image"
                        },
                        error: (err) => err?.response?.data?.error || err.message
                    }
                )
            } catch (error) {
                console.error(error)
            }
        }
    }

    const onSubmitHandler = async (e) => {
        e.preventDefault()
        try {
            //  if no images are uploaded then return
            if (!images[1] && !images[2] && !images[3] && !images[4]) {
                return toast.error('Please upload at least one image')
            }

            // Sale end date checks (the field is optional)
            if (productInfo.saleEndsAt) {
                if (Number(productInfo.mrp) <= Number(productInfo.price)) {
                    return toast.error('For a sale, Actual Price must be higher than Offer Price')
                }
                if (new Date(productInfo.saleEndsAt) <= new Date()) {
                    return toast.error('Sale end date must be in the future')
                }
            }

            setLoading(true)

            const formData = new FormData()
            formData.append('name', productInfo.name)
            formData.append('description', productInfo.description)
            formData.append('mrp', productInfo.mrp)
            formData.append('price', productInfo.price)
            formData.append('category', productInfo.category)

            // datetime-local gives local time, so convert it to a real date before sending
            if (productInfo.saleEndsAt) {
                formData.append('saleEndsAt', new Date(productInfo.saleEndsAt).toISOString())
            }

            // Adding Images to FormData
            Object.keys(images).forEach((key) => {
                images[key] && formData.append('images', images[key])
            })

            const token = await getToken()
            const { data } = await axios.post('/api/store/create/product', formData, {
                headers: { Authorization: `Bearer ${token}` }
            })
            toast.success(data.message)

            // reset form
            setProductInfo({
                name: "",
                description: "",
                mrp: 0,
                price: 0,
                category: "",
                saleEndsAt: "",
            })
            // reset images
            setImages({ 1: null, 2: null, 3: null, 4: null })
        } catch (error) {
            toast.error(error?.response?.data?.error || error.message)
        }
        finally {
            setLoading(false)
        }
    }

    return (
        <form onSubmit={e => toast.promise(onSubmitHandler(e), { loading: "Adding Product..." })} className="text-slate-500 mb-28">
            <h1 className="text-2xl">Add New <span className="text-slate-800 font-medium">Products</span></h1>
            <p className="mt-7">Product Images</p>

            <div htmlFor="" className="flex gap-3 mt-4">
                {Object.keys(images).map((key) => (
                    <label key={key} htmlFor={`images${key}`}>
                        <Image width={300} height={300} className='h-15 w-auto border border-slate-200 rounded cursor-pointer' src={images[key] ? URL.createObjectURL(images[key]) : assets.upload_area} alt="" />
                        <input type="file" accept='image/*' id={`images${key}`} onChange={e => handleImageUpload(key, e.target.files[0])} hidden />
                    </label>
                ))}
            </div>

            <label htmlFor="" className="flex flex-col gap-2 my-6 ">
                Name
                <input type="text" name="name" onChange={onChangeHandler} value={productInfo.name} placeholder="Enter product name" className="w-full max-w-sm p-2 px-4 outline-none border border-slate-200 rounded" required />
            </label>

            <label htmlFor="" className="flex flex-col gap-2 my-6 ">
                Description
                <textarea name="description" onChange={onChangeHandler} value={productInfo.description} placeholder="Enter product description" rows={5} className="w-full max-w-sm p-2 px-4 outline-none border border-slate-200 rounded resize-none" required />
            </label>

            <div className="flex gap-5">
                <label htmlFor="" className="flex flex-col gap-2 ">
                    Actual Price ({currency})
                    <input type="number" name="mrp" onChange={onChangeHandler} value={productInfo.mrp} placeholder="0" rows={5} className="w-full max-w-45 p-2 px-4 outline-none border border-slate-200 rounded resize-none" required />
                </label>
                <label htmlFor="" className="flex flex-col gap-2 ">
                    Offer Price ({currency})
                    <input type="number" name="price" onChange={onChangeHandler} value={productInfo.price} placeholder="0" rows={5} className="w-full max-w-45 p-2 px-4 outline-none border border-slate-200 rounded resize-none" required />
                </label>
            </div>

            <label htmlFor="" className="flex flex-col gap-2 my-6">
                Sale ends at <span className="text-xs text-slate-400">Optional. Shows a countdown timer. Needs Actual Price higher than Offer Price.</span>
                <input type="datetime-local" name="saleEndsAt" onChange={onChangeHandler} value={productInfo.saleEndsAt} className="w-full max-w-sm p-2 px-4 outline-none border border-slate-200 rounded" />
            </label>

            <select onChange={e => setProductInfo({ ...productInfo, category: e.target.value })} value={productInfo.category} className="w-full max-w-sm p-2 px-4 my-6 outline-none border border-slate-200 rounded" required>
                <option value="">Select a category</option>
                {categories.map((category) => (
                    <option key={category} value={category}>{category}</option>
                ))}
            </select>

            <br />

            <button disabled={loading} className="bg-slate-800 text-white px-6 mt-7 py-2 hover:bg-slate-900 rounded transition">Add Product</button>
        </form>
    )
}