'use client'
import { StarIcon } from 'lucide-react'
import Image from 'next/image'
import Link from 'next/link'
import React from 'react'
import SaleBadge from '@/components/SaleBadge'
import SaleCountdown from '@/components/SaleCountdown'

const ProductCard = ({ product }) => {

    const currency = process.env.NEXT_PUBLIC_CURRENCY_SYMBOL || '$'

    // calculate the average rating of the product (0 when there are no ratings yet)
    const ratings = product.rating || []
    const rating = ratings.length
        ? Math.round(ratings.reduce((acc, curr) => acc + curr.rating, 0) / ratings.length)
        : 0

    const onSale = Number(product.mrp) > Number(product.price)

    return (
        <Link href={`/product/${product.id}`} className=' group max-xl:mx-auto'>
            <div className='relative bg-[#F5F5F5] h-40  sm:w-60 sm:h-68 rounded-lg flex items-center justify-center overflow-hidden'>
                <SaleBadge price={product.price} mrp={product.mrp} className='absolute top-2 left-2 z-10' />
                <Image width={500} height={500} className='max-h-30 sm:max-h-40 w-auto group-hover:scale-115 transition duration-300' src={product.images[0]} alt="" />
            </div>
            <div className='flex justify-between gap-3 text-sm text-slate-800 pt-2 max-w-60'>
                <div>
                    <p>{product.name}</p>
                    <div className='flex'>
                        {Array(5).fill('').map((_, index) => (
                            <StarIcon key={index} size={14} className='text-transparent mt-0.5' fill={rating >= index + 1 ? "#00C950" : "#D1D5DB"} />
                        ))}
                    </div>
                </div>
                <div className='text-right'>
                    <p>{currency}{product.price}</p>
                    {onSale && (
                        <p className='text-xs text-slate-400 line-through'>{currency}{product.mrp}</p>
                    )}
                </div>
            </div>
            <SaleCountdown endsAt={product.saleEndsAt} className='mt-2' />
        </Link>
    )
}

export default ProductCard