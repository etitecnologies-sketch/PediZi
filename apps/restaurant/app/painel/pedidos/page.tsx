'use client'

import { motion } from 'framer-motion'
import { ShoppingBag, Clock, CheckCircle, XCircle } from 'lucide-react'
import { formatCurrency } from '@/lib/utils'
import { useState } from 'react'
import { cn } from '@/lib/utils'

const STATUS_CONFIG = {
  PENDING:    { label: 'Aguardando', color: 'text-yellow-400 bg-yellow-400/10', action: 'Confirmar' },
  CONFIRMED:  { label: 'Confirmado', color: 'text-blue-400 bg-blue-400/10',     action: 'Preparar' },
  PREPARING:  { label: 'Preparando', color: 'text-orange-400 bg-orange-400/10', action: 'Pronto' },
  READY:      { label: 'Pronto',     color: 'text-cyan-400 bg-cyan-400/10',     action: null },
  DELIVERING: { label: 'Em rota',    color: 'text-purple-400 bg-purple-400/10', action: null },
  DELIVERED:  { label: 'Entregue',   color: 'text-green-400 bg-green-400/10',   action: null },
  CANCELLED:  { label: 'Cancelado',  color: 'text-red-400 bg-red-400/10',       action: null },
} as const

const STATUS_FLOW: Record<string, keyof typeof STATUS_CONFIG> = {
  PENDING: 'CONFIRMED',
  CONFIRMED: 'PREPARING',
  PREPARING: 'READY',
}

const initialOrders = Array.from({ length: 12 }, (_, i) => ({
  id: `PD${Math.random().toString(36).substring(2, 8).toUpperCase()}`,
  client: ['João Silva', 'Maria Santos', 'Pedro Costa', 'Ana Lima', 'Carlos Mendes'][i % 5],
  items: [
    ['Classic Burguer', 'Combo Classic', 'BBQ Smash'][i % 3],
  ],
  total: parseFloat((Math.random() * 70 + 20).toFixed(2)),
  status: Object.keys(STATUS_CONFIG)[i % 5] as keyof typeof STATUS_CONFIG,
  time: `${Math.floor(Math.random() * 30 + 5)} min`,
  paymentMethod: ['PIX', 'Cartão', 'Dinheiro'][i % 3],
}))

export default function PedidosPage() {
  const [orders, setOrders] = useState(initialOrders)
  const [activeStatus, setActiveStatus] = useState('Todos')

  function advanceStatus(id: string, current: keyof typeof STATUS_CONFIG) {
    const next = STATUS_FLOW[current]
    if (!next) return
    setOrders((prev) => prev.map((o) => o.id === id ? { ...o, status: next } : o))
  }

  function cancelOrder(id: string) {
    setOrders((prev) => prev.map((o) => o.id === id ? { ...o, status: 'CANCELLED' } : o))
  }

  const filtered = activeStatus === 'Todos' ? orders : orders.filter((o) => o.status === activeStatus)

  const counts = {
    pending: orders.filter((o) => o.status === 'PENDING').length,
    active: orders.filter((o) => ['CONFIRMED', 'PREPARING', 'READY'].includes(o.status)).length,
    done: orders.filter((o) => o.status === 'DELIVERED').length,
  }

  return (
    <div className="space-y-6 max-w-4xl mx-auto">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-white">Pedidos</h1>
          <p className="text-sm text-gray-500 mt-0.5">{orders.length} pedidos hoje</p>
        </div>
        <ShoppingBag className="w-5 h-5 text-[#FF1F24]" />
      </div>

      <div className="grid grid-cols-3 gap-4">
        {[
          { label: 'Aguardando', value: counts.pending, color: '#F59E0B', icon: <Clock className="w-4 h-4" /> },
          { label: 'Em andamento', value: counts.active, color: '#8B5CF6', icon: <ShoppingBag className="w-4 h-4" /> },
          { label: 'Entregues', value: counts.done, color: '#22C55E', icon: <CheckCircle className="w-4 h-4" /> },
        ].map((s, i) => (
          <motion.div
            key={s.label}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.07 }}
            className="bg-[#161616] border border-white/5 rounded-2xl p-4 flex items-center gap-3"
          >
            <div className="w-9 h-9 rounded-xl flex items-center justify-center" style={{ backgroundColor: `${s.color}15`, color: s.color }}>
              {s.icon}
            </div>
            <div>
              <p className="text-xl font-bold text-white">{s.value}</p>
              <p className="text-xs text-gray-500">{s.label}</p>
            </div>
          </motion.div>
        ))}
      </div>

      <div className="flex gap-2 overflow-x-auto pb-1">
        {['Todos', ...Object.keys(STATUS_CONFIG)].map((s) => (
          <button
            key={s}
            onClick={() => setActiveStatus(s)}
            className={cn(
              'px-3 py-1.5 rounded-lg text-xs font-medium whitespace-nowrap transition-all',
              activeStatus === s
                ? 'bg-[#FF1F24] text-white'
                : 'bg-[#161616] text-gray-400 border border-white/8 hover:text-white',
            )}
          >
            {STATUS_CONFIG[s as keyof typeof STATUS_CONFIG]?.label ?? s}
          </button>
        ))}
      </div>

      <div className="space-y-3">
        {filtered.map((order, i) => {
          const status = STATUS_CONFIG[order.status]
          const nextAction = STATUS_CONFIG[order.status].action
          return (
            <motion.div
              key={order.id}
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.04 }}
              className="bg-[#161616] border border-white/5 rounded-2xl p-4 flex items-center gap-4"
            >
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 flex-wrap">
                  <span className="font-mono text-xs text-gray-500">#{order.id}</span>
                  <span className={cn('inline-flex px-2 py-0.5 rounded-full text-xs font-medium', status.color)}>{status.label}</span>
                </div>
                <p className="text-white font-semibold mt-1">{order.client}</p>
                <p className="text-xs text-gray-500 mt-0.5">{order.items.join(', ')} · {order.paymentMethod}</p>
              </div>

              <div className="text-right shrink-0">
                <p className="text-white font-bold">{formatCurrency(order.total)}</p>
                <p className="text-xs text-gray-500 mt-0.5 flex items-center gap-1 justify-end">
                  <Clock className="w-3 h-3" />{order.time}
                </p>
              </div>

              <div className="flex gap-2 shrink-0">
                {nextAction && (
                  <button
                    onClick={() => advanceStatus(order.id, order.status)}
                    className="h-8 px-3 bg-[#FF1F24] hover:bg-[#FF1F24]/90 text-white text-xs font-semibold rounded-xl transition-all active:scale-95"
                  >
                    {nextAction}
                  </button>
                )}
                {['PENDING', 'CONFIRMED'].includes(order.status) && (
                  <button
                    onClick={() => cancelOrder(order.id)}
                    className="h-8 w-8 flex items-center justify-center rounded-xl text-gray-500 hover:text-red-400 hover:bg-red-400/5 transition-all"
                  >
                    <XCircle className="w-4 h-4" />
                  </button>
                )}
              </div>
            </motion.div>
          )
        })}
      </div>
    </div>
  )
}
