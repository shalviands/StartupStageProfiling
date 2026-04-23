import type { Metadata } from 'next'
import { Montserrat } from 'next/font/google'
import './globals.css'
import Providers from '@/components/layout/Providers'

const montserrat = Montserrat({ 
  subsets: ['latin'],
  weight: ['300', '400', '500', '600', '700', '800', '900']
})

export const metadata: Metadata = {
  title: 'Startup Stage Profiler — InUnity',
  description: 'Startup stage profiling and analysis tool by InUnity Private Limited',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={`${montserrat.className} antialiased bg-slate-50 text-slate-900 min-h-screen overflow-x-hidden transition-colors duration-300`}>
        <Providers>{children}</Providers>
      </body>
    </html>
  )
}
