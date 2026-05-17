'use client'

import { motion } from 'framer-motion'
import { formatCurrency } from '@/lib/utils'
import { cn } from '@/lib/utils'

const STATUS_CONFIG = {
  PENDING:    { label: 'Aguardando', color: 'text-yellow-400 bg-yellow-400/10' },
  CONFIRMED:  { label: 'Confirmado', color: 'text-blue-400 bg-blue-400/10' },
  PREPARING:  { label: 'Preparando', color: 'text-orange-400 bg-orange-400/10' },
  READY:      { label: 'Pronto',     color: 'text-cyan-400 bg-cyan-400/10' },
  DELIVERING: { label: 'Em rota',   color: 'text-purple-400 bg-purple-400/10' },
  DELIVERED:  { label: 'Entregue',  color: 'text-green-400 bg-green-400/10' },
  CANCELLED:  { label: 'Cancelado', color: 'text-red-400 bg-red-400/10' },
} as const

const mockOrders = [
  { id: 'PD1A2B3C', client: 'João Silva', restaurant: 'Burguer House', total: 52.90, status: 'DELIVERING', time: '12 min' },
  { id: 'PD4D5E6F', client: 'Maria Santos', restaurant: 'Pizza Palace', total: 78.50, status: 'PREPARING', time: '8 min' },
  { id: 'PD7G8H9I', client: 'Pedro Alves', restaurant: 'Açaí do Norte', total: 34.00, status: 'CONFIRMED', time: '2 min' },
  { id: 'PDABCDEF', client: 'Ana Lima', restaurant: 'Marmita Fit', total: 29.90, status: 'DELIVERED', time: '45 min' },
  { id: 'PDGHIJKL', client: 'Carlos Costa', restaurant: 'Burguer House', total: 67.80, status: 'PENDING', time: 'agora' },
  { id: 'PDMNOPQR', client: 'Fernanda Reis', restaurant: 'Lanche Feliz', total: 43.50, status: 'CANCELLED', time: '20 min' },
]

export function OrdersTable() {
  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.35 }}
      className="bg-[#161616] border border-white/5 rounded-2xl overflow-hidden"
    >
      <div className="flex items-center justify-between p-6 border-b border-white/5">
        <div>
          <h3 className="text-sm font-semibold text-white">Pedidos em Tempo Real</h3>
          <p className="text-xs text-gray-500 mt-0.5">Atualizando automaticamente</p>
        </div>
        <div className="flex items-center gap-1.5">
          <span className="w-2 h-2 bg-[#22C55E] rounded-full animate-pulse" />
          <span className="text-xs text-[#22C55E]">Ao vivo</span>
        </div>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-white/5">
              <th className="text-left text-xs font-medium text-gray-500 px-6 py-3">PEDIDO</th>
              <th className="text-left text-xs font-medium text-gray-500 px-4 py-3">CLIENTE</th>
              <th className="text-left text-xs font-medium text-gray-500 px-4 py-3 hidden md:table-cell">RESTAURANTE</th>
              <th className="text-right text-xs font-medium text-gray-500 px-4 py-3">TOTAL</th>
              <th className="text-center text-xs font-medium text-gray-500 px-4 py-3">STATUS</th>
              <th className="text-right text-xs font-medium text-gray-500 px-6 py-3 hidden sm:table-cell">HÁ</th>
            </tr>
          </thead>
          <tbody>
            {mockOrders.map((order, i) => {
              const status = STATUS_CONFIG[order.status as keyof typeof STATUS_CONFIG]
              return (
                <motion.tr
                  key={order.id}
                  initial={{ opacity: 0, x: -8 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: i * 0.05 }}
                  className="border-b border-white/5 hover:bg-white/[0.02] transition-colors group"
                >
                  <td className="px-6 py-3.5">
                    <span className="font-mono text-xs text-gray-400">#{order.id}</span>
                  </td>
                  <td className="px-4 py-3.5">
                    <span className="text-white font-medium text-sm">{order.client}</span>
                  </td>
                  <td className="px-4 py-3.5 hidden md:table-cell">
                    <span className="text-gray-400 text-sm">{order.restaurant}</span>
                  </td>
                  <td className="px-4 py-3.5 text-right">
                    <span className="text-white font-semibold tabular-nums">{formatCurrency(order.total)}</span>
                  </td>
                  <td className="px-4 py-3.5 text-center">
                    <span className={cn('inline-flex px-2.5 py-1 rounded-full text-xs font-medium', status.color)}>
                      {status.label}
                    </span>
                  </td>
                  <td className="px-6 py-3.5 text-right hidden sm:table-cell">
                    <span className="text-xs text-gray-500">{order.time}</span>
                  </td>
                </motion.tr>
              )
            })}
          </tbody>
        </table>
      </div>
    </motion.div>
  )
}
