'use client'

import { motion } from 'framer-motion'
import { Search, Filter, ShoppingBag } from 'lucide-react'
import { cn, formatCurrency } from '@/lib/utils'
import { useState } from 'react'

export const dynamic = 'force-dynamic'

const STATUS_CONFIG = {
  PENDING:    { label: 'Aguardando', color: 'text-yellow-400 bg-yellow-400/10' },
  CONFIRMED:  { label: 'Confirmado', color: 'text-blue-400 bg-blue-400/10' },
  PREPARING:  { label: 'Preparando', color: 'text-orange-400 bg-orange-400/10' },
  READY:      { label: 'Pronto',     color: 'text-cyan-400 bg-cyan-400/10' },
  DELIVERING: { label: 'Em rota',   color: 'text-purple-400 bg-purple-400/10' },
  DELIVERED:  { label: 'Entregue',  color: 'text-green-400 bg-green-400/10' },
  CANCELLED:  { label: 'Cancelado', color: 'text-red-400 bg-red-400/10' },
} as const

const orders = Array.from({ length: 20 }, (_, i) => ({
  id: `PD${Math.random().toString(36).substring(2, 8).toUpperCase()}`,
  client: ['João Silva', 'Maria Santos', 'Pedro Costa', 'Ana Lima', 'Carlos Mendes'][i % 5],
  restaurant: ['Burguer House', 'Pizza Palace', 'Açaí do Norte', 'Marmita Fit', 'Lanche Feliz'][i % 5],
  total: parseFloat((Math.random() * 80 + 20).toFixed(2)),
  status: Object.keys(STATUS_CONFIG)[i % 7] as keyof typeof STATUS_CONFIG,
  date: new Date(Date.now() - Math.random() * 86400000 * 3).toLocaleDateString('pt-BR'),
  paymentMethod: ['PIX', 'Cartão', 'Dinheiro'][i % 3],
}))

const statuses = ['Todos', ...Object.keys(STATUS_CONFIG)]

export default function OrdersPage() {
  const [search, setSearch] = useState('')
  const [activeStatus, setActiveStatus] = useState('Todos')

  const filtered = orders.filter((o) => {
    const matchSearch = search === '' || o.client.toLowerCase().includes(search.toLowerCase()) || o.id.includes(search.toUpperCase())
    const matchStatus = activeStatus === 'Todos' || o.status === activeStatus
    return matchSearch && matchStatus
  })

  return (
    <div className="space-y-6 max-w-[1600px] mx-auto">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-white">Pedidos</h1>
          <p className="text-sm text-gray-500 mt-0.5">{orders.length} pedidos no total</p>
        </div>
        <div className="flex items-center gap-2">
          <ShoppingBag className="w-5 h-5 text-[#FF1F24]" />
        </div>
      </div>

      {/* Filtros */}
      <div className="flex flex-col sm:flex-row gap-3">
        <div className="relative flex-1 max-w-sm">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500" />
          <input
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Buscar por cliente ou código..."
            className="w-full h-10 bg-[#161616] border border-white/8 rounded-xl pl-9 pr-4 text-sm text-white placeholder:text-gray-600 focus:outline-none focus:ring-1 focus:ring-[#FF1F24]/40 transition-all"
          />
        </div>
        <div className="flex gap-2 overflow-x-auto pb-1">
          {statuses.map((s) => (
            <button
              key={s}
              onClick={() => setActiveStatus(s)}
              className={cn(
                'px-3 py-1.5 rounded-lg text-xs font-medium whitespace-nowrap transition-all',
                activeStatus === s
                  ? 'bg-[#FF1F24] text-white'
                  : 'bg-[#161616] text-gray-400 border border-white/8 hover:border-white/20 hover:text-white',
              )}
            >
              {STATUS_CONFIG[s as keyof typeof STATUS_CONFIG]?.label ?? s}
            </button>
          ))}
        </div>
      </div>

      {/* Tabela */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        className="bg-[#161616] border border-white/5 rounded-2xl overflow-hidden"
      >
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-white/5">
                {['Pedido', 'Cliente', 'Restaurante', 'Total', 'Pagamento', 'Status', 'Data'].map((h) => (
                  <th key={h} className="text-left text-xs font-medium text-gray-500 px-5 py-3">{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {filtered.map((order, i) => {
                const status = STATUS_CONFIG[order.status]
                return (
                  <motion.tr
                    key={order.id}
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: i * 0.02 }}
                    className="border-b border-white/[0.04] hover:bg-white/[0.02] transition-colors"
                  >
                    <td className="px-5 py-3.5 font-mono text-xs text-gray-400">#{order.id}</td>
                    <td className="px-5 py-3.5 text-white font-medium">{order.client}</td>
                    <td className="px-5 py-3.5 text-gray-400">{order.restaurant}</td>
                    <td className="px-5 py-3.5 text-white font-semibold tabular-nums">{formatCurrency(order.total)}</td>
                    <td className="px-5 py-3.5 text-gray-400 text-xs">{order.paymentMethod}</td>
                    <td className="px-5 py-3.5">
                      <span className={cn('inline-flex px-2.5 py-1 rounded-full text-xs font-medium', status.color)}>
                        {status.label}
                      </span>
                    </td>
                    <td className="px-5 py-3.5 text-gray-500 text-xs">{order.date}</td>
                  </motion.tr>
                )
              })}
            </tbody>
          </table>
        </div>
      </motion.div>
    </div>
  )
}
