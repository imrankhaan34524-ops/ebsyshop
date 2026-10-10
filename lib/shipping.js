// lib/shipping.js
// One place for the shipping rule, used by the checkout screen AND the order API.
export const FREE_SHIPPING_THRESHOLD = 2000 // free shipping at or above this subtotal
export const SHIPPING_FEE = 199

export const getShippingFee = (subtotal, isPlusMember) =>
    isPlusMember || subtotal >= FREE_SHIPPING_THRESHOLD ? 0 : SHIPPING_FEE