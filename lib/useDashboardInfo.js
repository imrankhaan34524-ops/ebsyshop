'use client'
// lib/useDashboardInfo.js
// Shared info about the logged in user: do they have a store, is it approved, are they admin.
// One request is shared by the navbar, the floating button and the mobile menu.
import { useEffect, useState } from 'react'
import { usePathname } from 'next/navigation'
import { useAuth, useUser } from '@clerk/nextjs'
import axios from 'axios'

const TTL = 10 * 1000 // refresh at most every 10 seconds when the page changes

const SIGNED_OUT = { loading: false, signedIn: false, hasStore: false, status: null, isActive: false, store: null, isAdmin: false }
const LOADING = { ...SIGNED_OUT, loading: true }

const cache = { userId: null, data: null, at: 0, promise: null }

export function clearDashboardInfo() {
    cache.data = null
    cache.at = 0
    cache.promise = null
}

function load(userId, getToken) {
    const fresh = cache.userId === userId && cache.data && Date.now() - cache.at < TTL
    if (fresh) return Promise.resolve(cache.data)
    if (cache.userId === userId && cache.promise) return cache.promise

    cache.userId = userId
    cache.promise = (async () => {
        try {
            const token = await getToken()
            const { data } = await axios.get('/api/me/dashboard', {
                headers: { Authorization: `Bearer ${token}` },
            })
            cache.data = { ...SIGNED_OUT, ...data, loading: false }
            cache.at = Date.now()
            return cache.data
        } catch {
            return cache.data || { ...SIGNED_OUT, signedIn: true }
        } finally {
            cache.promise = null
        }
    })()

    return cache.promise
}

export default function useDashboardInfo() {
    const { isLoaded, user } = useUser()
    const { getToken } = useAuth()
    const pathname = usePathname()
    const [info, setInfo] = useState(LOADING)

    useEffect(() => {
        if (!isLoaded) return

        if (!user) {
            clearDashboardInfo()
            setInfo(SIGNED_OUT)
            return
        }

        let cancelled = false
        load(user.id, getToken).then((data) => {
            if (!cancelled) setInfo(data)
        })
        return () => { cancelled = true }
        // pathname: check again when the visitor moves to another page (e.g. after creating a store)
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [isLoaded, user?.id, pathname])

    return info
}