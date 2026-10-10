import './globals.css'
import { ClerkProvider } from '@clerk/nextjs'
import StoreProvider from '@/app/StoreProvider'

export const metadata = {
    title: 'Ebsy Store',
    description: 'Gadgets you will love. Prices you will trust.',
}

export default function RootLayout({ children }) {
    return (
        <ClerkProvider>
            <html lang="en" suppressHydrationWarning>
                <body>
                    <StoreProvider>{children}</StoreProvider>
                </body>
            </html>
        </ClerkProvider>
    )
}