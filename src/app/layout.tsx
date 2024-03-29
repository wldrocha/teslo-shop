import type { Metadata } from 'next'

import './globals.css'
import { inter } from '@/config/font'
import { Providers } from '@/components'

export const metadata: Metadata = {
  title: {
    template: '%s - Teslo | shop',
    default: 'Home - Teslo | shop'
  },
  description: 'Virtual shop'
}

export default function RootLayout({
  children
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang='en'>
      <body className={inter.className}>
        <Providers>{children}</Providers>
      </body>
    </html>
  )
}
