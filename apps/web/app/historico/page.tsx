'use client'

import { motion } from 'framer-motion'
import { Zap, ShoppingBag, Clock, ChevronRight, ArrowLeft, Star } from 'lucide-react'
import Link from 'next/link'

const STATUS_CONFIG = {
  DELIVERED:  { label: 'Entregue',  color: 'text-green-400 bg-green-400/10' },
  CANCELLED:  { label: 'Cancelado', color: 'text-red-400 bg-red-400/10' },
  DELIVERING: { label: 'Em rota',   color: 'text-purple-400 bg-purple-400/10' },
} as const

const orders = [
  {
    id: 'PDA7F2K1',
    restaurant: 'Burguer House',
    emoji: '🍔',
    items: ['1x Classic Burguer', '1x Refrigerante Lata'],
    total: 38.90,
    date: '20/05/2026',
    status: 'DELIVERED' as const,
    rated: false,
  },
  {
    id: 'PDB3M9X2',
    restaurant: 'Açaí do Norte',
    emoji: '🫐',
    items: ['2x Açaí 500ml', '1x Granola Extra'],
    total: 46.50,
    date: '18/05/2026',
    status: 'DELIVERED' as const,
    rated: true,
  },
  {
    id: 'PDC5R1T3',
    restaurant: 'Pizza Palace',
    emoji: '🍕',
    items: ['1x Pizza Calabresa M', '1x Coca-Cola 2L'],
    total: 68.00,
    date: '15/05/2026',
    status: 'CANCELLED' as const,
    rated: false,
  },
  {
    id: 'PDD8K4Z4',
    restaurant: 'Marmita Fit',
    emoji: '🥗',
    items: ['1x Marmita Frango Grelhado', '1x Suco Natural'],
    total: 32.00,
    date: '12/05/2026',
    status: 'DELIVERED' as const,
    rated: true,
  },
  {
    id: 'PDE2V7L5',
    restaurant: 'Lanche Feliz',
    emoji: '🥪',
    items: ['2x X-Burguer', '2x Batata Frita P'],
    total: 54.80,
    date: '08/05/2026',
    status: 'DELIVERED' as const,
    rated: false,
  },
]

export default function HistoricoPage() {
  return (
    <div className="min-h-screen bg-[#0D0D0D]">
      <header className="sticky top-0 z-50 bg-[#0D0D0D]/90 backdrop-blur-sm border-b border-white/5">
        <div className="max-w-2xl mx-auto px-4 h-16 flex items-center gap-3">
          <Link href="/" className="p-2 rounded-xl text-gray-400 hover:text-white transition-all">
            <ArrowLeft className="w-5 h-5" />
          </Link>
          <div className="flex items-center gap-2">
            <div className="w-7 h-7 bg-[#FF1F24] rounded-lg flex items-center justify-center">
              <Zap className="w-4 h-4 text-white fill-white" />
            </div>
            <h1 className="font-bold text-white">Meus pedidos</h1>
          </div>
        </div>
      </header>

      <div className="max-w-2xl mx-auto px-4 py-6 space-y-3">
        {orders.length === 0 && (
          <div className="text-center py-20 text-gray-600">
            <ShoppingBag className="w-12 h-12 mx-auto mb-3 opacity-30" />
            <p className="font-medium">Nenhum pedido ainda</p>
            <p className="text-sm mt-1">Seus pedidos aparecerão aqui</p>
            <Link href="/">
              <button className="mt-6 h-10 px-6 bg-[#FF1F24] text-white font-semibold rounded-xl text-sm">
                Fazer primeiro pedido
              </button>
            </Link>
          </div>
        )}

        {orders.map((order, i) => {
          const status = STATUS_CONFIG[order.status]
          return (
            <motion.div
              key={order.id}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.06 }}
              className="bg-[#161616] border border-white/5 rounded-2xl p-4"
            >
              <div className="flex items-start gap-3">
                <div className="w-12 h-12 bg-gradient-to-br from-orange-500/20 to-transparent rounded-xl flex items-center justify-center text-2xl shrink-0">
                  {order.emoji}
                </div>

                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between gap-2 flex-wrap">
                    <h3 className="font-semibold text-white">{order.restaurant}</h3>
                    <span className={`text-xs px-2.5 py-0.5 rounded-full font-medium ${status.color}`}>
                      {status.label}
                    </span>
                  </div>

                  <p className="text-xs text-gray-500 mt-0.5">{order.items.join(' · ')}</p>

                  <div className="flex items-center justify-between mt-3">
                    <div className="flex items-center gap-3 text-xs text-gray-500">
                      <span className="flex items-center gap-1">
                        <Clock className="w-3 h-3" />
                        {order.date}
                      </span>
                      <span className="font-semibold text-white">R$ {order.total.toFixed(2)}</span>
                    </div>

                    <div className="flex items-center gap-2">
                      {order.status === 'DELIVERED' && !order.rated && (
                        <Link href={`/avaliar/${order.id}`}>
                          <button className="flex items-center gap-1 text-xs text-yellow-400 hover:text-yellow-300 font-medium transition-colors">
                            <Star className="w-3.5 h-3.5" />
                            Avaliar
                          </button>
                        </Link>
                      )}
                      <Link href={`/rastreamento/${order.id}`}>
                        <button className="p-1 rounded-lg text-gray-500 hover:text-white transition-colors">
                          <ChevronRight className="w-4 h-4" />
                        </button>
                      </Link>
                    </div>
                  </div>
                </div>
              </div>
            </motion.div>
          )
        })}
      </div>
    </div>
  )
}
