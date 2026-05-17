import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import './globals.css'

const inter = Inter({ subsets: ['latin'] })

export const metadata: Metadata = {
  title: { default: 'PEDIZI Restaurante', template: '%s | PEDIZI Restaurante' },
  description: 'Painel de controle para restaurantes na plataforma PEDIZI.',
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="pt-BR" className={inter.className}>
      <body className="bg-[#0D0D0D] text-white antialiased min-h-screen">{children}</body>
    </html>
  )
}
