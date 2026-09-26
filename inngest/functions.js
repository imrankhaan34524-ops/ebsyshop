import { inngest } from './client'
import { deleteClerkUser, syncClerkUser } from '@/lib/clerk-user-sync'


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