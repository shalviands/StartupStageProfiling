import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import './globals.css'
import Providers from '@/components/layout/Providers'

const inter = Inter({ subsets: ['latin'] })

export const metadata: Metadata = {
  title: 'Startup Diagnosis Profiler — InUnity',
  description: 'Startup diagnosis and profiling tool by InUnity Private Limited',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body className={`${inter.className} antialiased bg-smoke text-navy`}>
        <Providers>{children}</Providers>
      </body>
    </html>
  )
}
