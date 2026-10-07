import { createAsyncThunk, createSlice } from '@reduxjs/toolkit'
import axios from 'axios'


let debounceTimer = null

// Upload cart to database
export const uploadCart = createAsyncThunk(
    'cart/uploadCart',
    async ({ getToken }, thunkAPI) => {
        try {
            clearTimeout(debounceTimer)

            return await new Promise((resolve, reject) => {
                debounceTimer = setTimeout(async () => {
                    try {
                        const { cartItems } = thunkAPI.getState().cart
                        const token = await getToken()

                        const { data } = await axios.post(
                            '/api/cart',
                            {
                                cart: cartItems,
                            },
                            {
                                headers: {
                                    Authorization: `Bearer ${token}`,
                                },
                            }
                        )

                        resolve(data)
                    } catch (error) {
                        reject(
                            error.response?.data || {
                                message: error.message,
                            }
                        )
                    }
                }, 1000)
            })
        } catch (error) {
            return thunkAPI.rejectWithValue(
                error.response?.data || {
                    message: error.message,
                }
            )
        }
    }
)

// Fetch cart from database
export const fetchCart = createAsyncThunk(
    'cart/fetchCart',
    async ({ getToken }, thunkAPI) => {
        try {
            const token = await getToken()

            const { data } = await axios.get('/api/cart', {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            })

            return data
        } catch (error) {
            return thunkAPI.rejectWithValue(
                error.response?.data || {
                    message: error.message,
                }
            )
        }
    }
)

const cartSlice = createSlice({
    name: 'cart',

    initialState: {
        total: 0,
        cartItems: {},
    },

    reducers: {
        addToCart: (state, action) => {
            const { productId } = action.payload

            if (state.cartItems[productId]) {
                state.cartItems[productId] += 1
            } else {
                state.cartItems[productId] = 1
            }

            state.total += 1
        },

        removeFromCart: (state, action) => {
            const { productId } = action.payload

            if (state.cartItems[productId]) {
                state.cartItems[productId] -= 1
                state.total -= 1

                if (state.cartItems[productId] === 0) {
                    delete state.cartItems[productId]
                }
            }
        },

        deleteItemFromCart: (state, action) => {
            const { productId } = action.payload

            if (state.cartItems[productId]) {
                state.total -= state.cartItems[productId]
                delete state.cartItems[productId]
            }
        },

        clearCart: (state) => {
            state.cartItems = {}
            state.total = 0
        },
    },

    extraReducers: (builder) => {
        builder.addCase(fetchCart.fulfilled, (state, action) => {
            const cart = action.payload?.cart || {}

            state.cartItems = cart

            state.total = Object.values(cart).reduce(
                (acc, item) => acc + item,
                0
            )
        })
    },
})

export const {
    addToCart,
    removeFromCart,
    clearCart,
    deleteItemFromCart,
} = cartSlice.actions

export default cartSlice.reducer