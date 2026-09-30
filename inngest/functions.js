import { inngest } from './client'
import { deleteClerkUser, syncClerkUser } from '@/lib/clerk-user-sync'
import { prisma } from '@/lib/prisma'


// Inngest Function to save user data to a database
export const syncUserCreation = inngest.createFunction(
    {
        id: 'sync-user-create',
        triggers: { event: 'clerk/user.created' },
    },
    async ({ event }) => {
        await syncClerkUser(event.data)
    }
)

// Inngest Function to update user data in database
export const syncUserUpdation = inngest.createFunction(
    {
        id: 'sync-user-update',
        triggers: { event: 'clerk/user.updated' },
    },
    async ({ event }) => {
        await syncClerkUser(event.data)
    }
)

// Inngest Function to delete user from database
export const syncUserDeletion = inngest.createFunction(
    {
        id: 'sync-user-delete',
        triggers: { event: 'clerk/user.deleted' },
    },
    async ({ event }) => {
        await deleteClerkUser(event.data.id)
    }
)

// Inngest Function to delete coupon on expiry
export const deleteCouponOnExpiry = inngest.createFunction(
    {
        id: 'delete-coupon-on-expiry',
        triggers: { event: 'app/coupon.expired' }
    },
    async ({ event, step }) => {
        const { data } = event
        const expiryDate = new Date(data.expires_at)
        await step.sleepUntil('wait-for-expiry', expiryDate)

        await step.run('delete-coupon-from-database', async () => {
            await prisma.coupon.delete({
                where: { code: data.code }
            })
        })
    }
)