'use client'

import { motion } from 'framer-motion'
import { Search, Truck, MapPin, Clock } from 'lucide-react'
import { cn, formatCurrency } from '@/lib/utils'
import { useState } from 'react'

export const dynamic = 'force-dynamic'

const STATUS_CONFIG = {
  ASSIGNED:   { label: 'Atribuído',   color: 'text-blue-400 bg-blue-400/10' },
  PICKED_UP:  { label: 'Coletado',    color: 'text-orange-400 bg-orange-400/10' },
  DELIVERING: { label: 'Em rota',     color: 'text-purple-400 bg-purple-400/10' },
  DELIVERED:  { label: 'Entregue',    color: 'text-green-400 bg-green-400/10' },
  FAILED:     { label: 'Falhou',      color: 'text-red-400 bg-red-400/10' },
} as const

const deliveries = Array.from({ length: 18 }, (_, i) => ({
  id: `ENT${Math.random().toString(36).substring(2, 7).toUpperCase()}`,
  order: `PD${Math.random().toString(36).substring(2, 8).toUpperCase()}`,
  courier: ['Lucas Pereira', 'Marcos Silva', 'Rafael Costa', 'Diego Alves', 'Bruno Lima'][i % 5],
  client: ['João Silva', 'Maria Santos', 'Pedro Costa', 'Ana Lima', 'Carlos Mendes'][i % 5],
  restaurant: ['Burguer House', 'Pizza Palace', 'Açaí do Norte', 'Marmita Fit', 'Lanche Feliz'][i % 5],
  address: ['Rua das Flores, 123', 'Av. Brasil, 456', 'Rua Boa Vista, 789', 'Rua São Paulo, 321'][i % 4],
  fee: parseFloat((Math.random() * 8 + 3).toFixed(2)),
  status: Object.keys(STATUS_CONFIG)[i % 5] as keyof typeof STATUS_CONFIG,
  time: `${Math.floor(Math.random() * 40 + 10)} min`,
}))

const statuses = ['Todos', ...Object.keys(STATUS_CONFIG)]

export default function DeliveriesPage() {
  const [search, setSearch] = useState('')
  const [activeStatus, setActiveStatus] = useState('Todos')

  const filtered = deliveries.filter((d) => {
    const matchSearch = search === '' || d.courier.toLowerCase().includes(search.toLowerCase()) || d.order.includes(search.toUpperCase())
    const matchStatus = activeStatus === 'Todos' || d.status === activeStatus
    return matchSearch && matchStatus
  })

  const stats = [
    { label: 'Em rota agora', value: deliveries.filter((d) => d.status === 'DELIVERING').length, color: '#8B5CF6' },
    { label: 'Entregues hoje', value: deliveries.filter((d) => d.status === 'DELIVERED').length, color: '#22C55E' },
    { label: 'Coletados', value: deliveries.filter((d) => d.status === 'PICKED_UP').length, color: '#F59E0B' },
    { label: 'Falhas', value: deliveries.filter((d) => d.status === 'FAILED').length, color: '#EF4444' },
  ]

  return (
    <div className="space-y-6 max-w-[1600px] mx-auto">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-white">Entregas</h1>
          <p className="text-sm text-gray-500 mt-0.5">{deliveries.length} entregas registradas</p>
        </div>
        <Truck className="w-5 h-5 text-[#FF1F24]" />
      </div>

      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        {stats.map((s, i) => (
          <motion.div
            key={s.label}
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.07 }}
            className="bg-[#161616] border border-white/5 rounded-2xl p-4 flex items-center gap-3"
          >
            <div className="w-9 h-9 rounded-xl flex items-center justify-center" style={{ backgroundColor: `${s.color}15` }}>
              <Truck className="w-4 h-4" style={{ color: s.color }} />
            </div>
            <div>
              <p className="text-xl font-bold text-white">{s.value}</p>
              <p className="text-xs text-gray-500">{s.label}</p>
            </div>
          </motion.div>
        ))}
      </div>

      <div className="flex flex-col sm:flex-row gap-3">
        <div className="relative flex-1 max-w-sm">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500" />
          <input
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Buscar por entregador ou pedido..."
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

      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        className="bg-[#161616] border border-white/5 rounded-2xl overflow-hidden"
      >
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-white/5">
                {['Pedido', 'Entregador', 'Cliente', 'Restaurante', 'Endereço', 'Taxa', 'Tempo', 'Status'].map((h) => (
                  <th key={h} className="text-left text-xs font-medium text-gray-500 px-5 py-3">{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {filtered.map((d, i) => {
                const status = STATUS_CONFIG[d.status]
                return (
                  <motion.tr
                    key={d.id}
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: i * 0.02 }}
                    className="border-b border-white/[0.04] hover:bg-white/[0.02] transition-colors"
                  >
                    <td className="px-5 py-3.5 font-mono text-xs text-gray-400">#{d.order}</td>
                    <td className="px-5 py-3.5 text-white font-medium">{d.courier}</td>
                    <td className="px-5 py-3.5 text-gray-400">{d.client}</td>
                    <td className="px-5 py-3.5 text-gray-400">{d.restaurant}</td>
                    <td className="px-5 py-3.5">
                      <div className="flex items-center gap-1 text-gray-400 text-xs">
                        <MapPin className="w-3 h-3 shrink-0" />
                        {d.address}
                      </div>
                    </td>
                    <td className="px-5 py-3.5 text-white tabular-nums">{formatCurrency(d.fee)}</td>
                    <td className="px-5 py-3.5">
                      <div className="flex items-center gap-1 text-gray-400 text-xs">
                        <Clock className="w-3 h-3" />
                        {d.time}
                      </div>
                    </td>
                    <td className="px-5 py-3.5">
                      <span className={cn('inline-flex px-2.5 py-1 rounded-full text-xs font-medium', status.color)}>
                        {status.label}
                      </span>
                    </td>
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
