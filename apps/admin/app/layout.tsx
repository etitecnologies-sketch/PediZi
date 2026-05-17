import type { Metadata, Viewport } from 'next'
import { Inter } from 'next/font/google'
import { Providers } from './providers'
import './globals.css'

const inter = Inter({ subsets: ['latin'], variable: '--font-inter' })

export const metadata: Metadata = {
  title: { default: 'PEDIZI Admin', template: '%s | PEDIZI Admin' },
  description: 'Painel administrativo PEDIZI — O delivery da sua cidade.',
  icons: { icon: '/favicon.ico' },
}

export const viewport: Viewport = {
  themeColor: '#0D0D0D',
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="pt-BR" className={`${inter.variable} h-full`} suppressHydrationWarning>
      <body className="min-h-full bg-[#0D0D0D] text-white antialiased">
        <Providers>{children}</Providers>
      </body>
    </html>
  )
}
