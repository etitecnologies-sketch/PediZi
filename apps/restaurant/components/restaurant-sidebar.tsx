'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { LayoutDashboard, ShoppingBag, UtensilsCrossed, BarChart3, Ticket, Settings, Zap, Power } from 'lucide-react'
import { cn } from '@/lib/utils'
import { useState } from 'react'

const nav = [
  { href: '/painel', icon: LayoutDashboard, label: 'Dashboard' },
  { href: '/painel/pedidos', icon: ShoppingBag, label: 'Pedidos' },
  { href: '/painel/cardapio', icon: UtensilsCrossed, label: 'Cardápio' },
  { href: '/painel/relatorios', icon: BarChart3, label: 'Relatórios' },
  { href: '/painel/cupons', icon: Ticket, label: 'Cupons' },
  { href: '/painel/configuracoes', icon: Settings, label: 'Configurações' },
]

export function RestaurantSidebar() {
  const pathname = usePathname()
  const [isOpen, setIsOpen] = useState(true)

  return (
    <aside className="w-56 bg-[#111111] border-r border-white/5 flex flex-col shrink-0">
      <div className="flex items-center gap-2 px-4 py-5 border-b border-white/5">
        <div className="w-8 h-8 bg-[#FF1F24] rounded-lg flex items-center justify-center shrink-0">
          <Zap className="w-4 h-4 text-white fill-white" />
        </div>
        <div>
          <div className="text-xs font-bold text-white">Burguer House</div>
          <div className="text-[10px] text-gray-500">Parceiro PEDIZI</div>
        </div>
      </div>

      {/* Status aberto/fechado */}
      <div className="px-3 py-2 border-b border-white/5">
        <button
          onClick={() => setIsOpen(!isOpen)}
          className={cn('w-full flex items-center gap-2 px-3 py-2 rounded-xl text-xs font-semibold transition-all', isOpen ? 'bg-[#22C55E]/10 text-[#22C55E]' : 'bg-[#EF4444]/10 text-[#EF4444]')}
        >
          <Power className="w-3.5 h-3.5" />
          {isOpen ? 'Restaurante Aberto' : 'Restaurante Fechado'}
        </button>
      </div>

      <nav className="flex-1 p-2 space-y-0.5">
        {nav.map((item) => {
          const isActive = pathname === item.href || (item.href !== '/painel' && pathname.startsWith(item.href))
          return (
            <Link key={item.href} href={item.href}>
              <div className={cn('flex items-center gap-2.5 px-3 py-2.5 rounded-xl text-sm transition-all', isActive ? 'bg-[#FF1F24]/10 text-[#FF1F24] font-medium' : 'text-gray-400 hover:text-white hover:bg-white/5')}>
                <item.icon className="w-4 h-4 shrink-0" />
                {item.label}
              </div>
            </Link>
          )
        })}
      </nav>

      <div className="p-3 border-t border-white/5">
        <div className="flex items-center gap-2 px-2">
          <div className="w-7 h-7 bg-gradient-to-br from-[#FF1F24] to-orange-500 rounded-full flex items-center justify-center text-xs font-bold">C</div>
          <div>
            <p className="text-xs font-medium text-white">Carlos Burguer</p>
            <p className="text-[10px] text-gray-500">Dono</p>
          </div>
        </div>
      </div>
    </aside>
  )
}
