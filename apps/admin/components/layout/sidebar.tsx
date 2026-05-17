'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { motion } from 'framer-motion'
import {
  LayoutDashboard,
  ShoppingBag,
  Store,
  Truck,
  Users,
  CreditCard,
  Ticket,
  BarChart3,
  Settings,
  Zap,
  ChevronLeft,
} from 'lucide-react'
import { cn } from '@/lib/utils'
import { useState } from 'react'

const navItems = [
  { href: '/dashboard', icon: LayoutDashboard, label: 'Dashboard' },
  { href: '/dashboard/orders', icon: ShoppingBag, label: 'Pedidos' },
  { href: '/dashboard/restaurants', icon: Store, label: 'Restaurantes' },
  { href: '/dashboard/deliveries', icon: Truck, label: 'Entregas' },
  { href: '/dashboard/users', icon: Users, label: 'Clientes' },
  { href: '/dashboard/financial', icon: CreditCard, label: 'Financeiro' },
  { href: '/dashboard/coupons', icon: Ticket, label: 'Cupons' },
  { href: '/dashboard/analytics', icon: BarChart3, label: 'Relatórios' },
  { href: '/dashboard/settings', icon: Settings, label: 'Configurações' },
]

export function Sidebar() {
  const pathname = usePathname()
  const [collapsed, setCollapsed] = useState(false)

  return (
    <motion.aside
      animate={{ width: collapsed ? 72 : 240 }}
      transition={{ duration: 0.2, ease: 'easeInOut' }}
      className="flex flex-col bg-[#111111] border-r border-white/5 overflow-hidden shrink-0"
    >
      {/* Logo */}
      <div className="flex items-center gap-3 px-4 py-5 border-b border-white/5">
        <div className="w-9 h-9 bg-[#FF1F24] rounded-xl flex items-center justify-center shrink-0">
          <Zap className="w-5 h-5 text-white fill-white" />
        </div>
        {!collapsed && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="overflow-hidden"
          >
            <div className="font-bold text-lg tracking-tight leading-none">PEDIZI</div>
            <div className="text-[10px] text-gray-500 tracking-wider uppercase">Admin</div>
          </motion.div>
        )}
        <button
          onClick={() => setCollapsed(!collapsed)}
          className={cn('ml-auto p-1 rounded-lg text-gray-500 hover:text-white hover:bg-white/5 transition-all', collapsed && 'mx-auto')}
        >
          <ChevronLeft className={cn('w-4 h-4 transition-transform', collapsed && 'rotate-180')} />
        </button>
      </div>

      {/* Nav */}
      <nav className="flex-1 p-2 space-y-0.5 overflow-y-auto">
        {navItems.map((item) => {
          const isActive = pathname === item.href || (item.href !== '/dashboard' && pathname.startsWith(item.href))
          return (
            <Link key={item.href} href={item.href}>
              <motion.div
                whileHover={{ x: collapsed ? 0 : 2 }}
                className={cn(
                  'flex items-center gap-3 px-3 py-2.5 rounded-xl transition-all duration-150 group',
                  isActive
                    ? 'bg-[#FF1F24]/10 text-[#FF1F24]'
                    : 'text-gray-400 hover:text-white hover:bg-white/5',
                  collapsed && 'justify-center px-2',
                )}
              >
                <item.icon className={cn('w-5 h-5 shrink-0', isActive && 'text-[#FF1F24]')} />
                {!collapsed && (
                  <span className="text-sm font-medium truncate">{item.label}</span>
                )}
                {!collapsed && isActive && (
                  <div className="ml-auto w-1.5 h-1.5 bg-[#FF1F24] rounded-full" />
                )}
              </motion.div>
            </Link>
          )
        })}
      </nav>

      {/* Footer */}
      <div className="p-3 border-t border-white/5">
        <div className={cn('flex items-center gap-2', collapsed && 'justify-center')}>
          <div className="w-8 h-8 bg-gradient-to-br from-[#FF1F24] to-orange-500 rounded-full flex items-center justify-center text-xs font-bold shrink-0">
            A
          </div>
          {!collapsed && (
            <div className="overflow-hidden">
              <div className="text-sm font-medium truncate">Admin</div>
              <div className="text-xs text-gray-500 truncate">admin@pedizi.com.br</div>
            </div>
          )}
        </div>
      </div>
    </motion.aside>
  )
}
