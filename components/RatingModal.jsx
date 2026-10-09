'use client'

import { Star, ImagePlus } from 'lucide-react';
import React, { useState } from 'react'
import { XIcon } from 'lucide-react';
import toast from 'react-hot-toast';
import { useAuth } from '@clerk/nextjs';
import { useDispatch } from 'react-redux';
import { addRating } from '@/lib/features/rating/ratingSlice';
import axios from 'axios';

const MAX_PHOTOS = 3

// Shrinks a photo before upload so it is fast on mobile data
const compressToBlob = (file, maxSize = 1200, quality = 0.8) =>
    new Promise((resolve, reject) => {
        const img = new window.Image()
        const url = URL.createObjectURL(file)
        img.onload = () => {
            const scale = Math.min(1, maxSize / Math.max(img.width, img.height))
            const canvas = document.createElement('canvas')
            canvas.width = Math.round(img.width * scale)
            canvas.height = Math.round(img.height * scale)
            canvas.getContext('2d').drawImage(img, 0, 0, canvas.width, canvas.height)
            URL.revokeObjectURL(url)
            canvas.toBlob((blob) => (blob ? resolve(blob) : reject(new Error('Image error'))), 'image/jpeg', quality)
        }
        img.onerror = reject
        img.src = url
    })

const RatingModal = ({ ratingModal, setRatingModal }) => {

    const {getToken} = useAuth();
    const dispatch = useDispatch(); 

    const [rating, setRating] = useState(0);
    const [review, setReview] = useState('');
    const [photos, setPhotos] = useState([]); // array of File

    const addPhotos = (fileList) => {
        const picked = Array.from(fileList || []).filter((f) => f.type.startsWith('image/'))
        const next = [...photos, ...picked].slice(0, MAX_PHOTOS)
        if (photos.length + picked.length > MAX_PHOTOS) {
            toast(`You can add up to ${MAX_PHOTOS} photos`)
        }
        setPhotos(next)
    }

    const removePhoto = (index) => setPhotos(photos.filter((_, i) => i !== index))

    const handleSubmit = async () => {
        if (rating < 1 || rating > 5) {
            return toast('Please select a rating');
        }
        if (review.length < 5) {
            return toast('write a short review');
        }
        try {
            const token = await getToken()

            // 1) Upload the photos first (if any)
            let images = []
            if (photos.length > 0) {
                const formData = new FormData()
                for (const photo of photos) {
                    const blob = await compressToBlob(photo)
                    formData.append('images', blob, `review-${Date.now()}.jpg`)
                }
                const upload = await axios.post('/api/rating/upload', formData, {
                    headers: { Authorization: `Bearer ${token}` }
                })
                images = upload.data.images
            }

            // 2) Save the rating together with the photo links
            const { data } = await axios.post('/api/rating', {
                productId: ratingModal.productId,
                orderId: ratingModal.orderId,
                rating,
                review,
                images
            }, {
                headers: { Authorization: `Bearer ${token}` }
            })
            dispatch(addRating(data.rating))
            toast.success(data.message)
            setRatingModal(null);
        } catch (error) {
            toast.error(error?.response?.data?.error || error.message)
        }
    }

    return (
        <div className='fixed inset-0 z-120 flex items-center justify-center bg-black/10'>
            <div className='bg-white p-8 rounded-lg shadow-lg w-96 relative'>
                <button onClick={() => setRatingModal(null)} className='absolute top-3 right-3 text-gray-500 hover:text-gray-700'>
                    <XIcon size={20} />
                </button>
                <h2 className='text-xl font-medium text-slate-600 mb-4'>Rate Product</h2>
                <div className='flex items-center justify-center mb-4'>
                    {Array.from({ length: 5 }, (_, i) => (
                        <Star
                            key={i}
                            className={`size-8 cursor-pointer ${rating > i ? "text-green-400 fill-current" : "text-gray-300"}`}
                            onClick={() => setRating(i + 1)}
                        />
                    ))}
                </div>
                <textarea
                    className='w-full p-2 border border-gray-300 rounded-md mb-4 focus:outline-none focus:ring-2 focus:ring-green-400'
                    placeholder='Write your review'
                    rows='4'
                    value={review}
                    onChange={(e) => setReview(e.target.value)}
                ></textarea>

                {/* Photos */}
                <p className='text-xs text-slate-500 mb-2'>Add photos (optional, up to {MAX_PHOTOS})</p>
                <div className='flex gap-2 mb-4'>
                    {photos.map((photo, index) => (
                        <div key={index} className='relative size-16 rounded-md overflow-hidden border border-gray-300'>
                            {/* eslint-disable-next-line @next/next/no-img-element */}
                            <img src={URL.createObjectURL(photo)} alt='' className='size-full object-cover' />
                            <button
                                type='button'
                                onClick={() => removePhoto(index)}
                                aria-label='Remove photo'
                                className='absolute top-0.5 right-0.5 size-4 rounded-full bg-black/70 text-white flex items-center justify-center'
                            >
                                <XIcon size={10} />
                            </button>
                        </div>
                    ))}
                    {photos.length < MAX_PHOTOS && (
                        <label className='size-16 rounded-md border border-dashed border-gray-400 flex items-center justify-center cursor-pointer text-slate-400 hover:text-green-500 hover:border-green-400 transition'>
                            <ImagePlus size={20} />
                            <input type='file' accept='image/*' multiple hidden onChange={(e) => { addPhotos(e.target.files); e.target.value = '' }} />
                        </label>
                    )}
                </div>

                <button onClick={e => toast.promise(handleSubmit(), { loading: 'Submitting...' })} className='w-full bg-green-500 text-white py-2 rounded-md hover:bg-green-600 transition'>
                    Submit Rating
                </button>
            </div>
        </div>
    )
}

export default RatingModal