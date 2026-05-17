'use client'

import { motion } from 'framer-motion'
import { Star, TrendingUp } from 'lucide-react'
import { formatCurrency } from '@/lib/utils'

const restaurants = [
  { rank: 1, name: 'Burguer House', orders: 1234, revenue: 62800, rating: 4.8 },
  { rank: 2, name: 'Pizza Palace', orders: 987, revenue: 54200, rating: 4.7 },
  { rank: 3, name: 'Açaí do Norte', orders: 876, revenue: 39600, rating: 4.9 },
  { rank: 4, name: 'Marmita Fit', orders: 743, revenue: 28900, rating: 4.6 },
  { rank: 5, name: 'Lanche Feliz', orders: 621, revenue: 24100, rating: 4.5 },
]

const RANK_COLORS = ['#FFD700', '#C0C0C0', '#CD7F32', '#666', '#666']

export function TopRestaurants() {
  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.4 }}
      className="bg-[#161616] border border-white/5 rounded-2xl p-6"
    >
      <div className="flex items-center gap-2 mb-5">
        <TrendingUp className="w-4 h-4 text-[#FF1F24]" />
        <h3 className="text-sm font-semibold text-white">Ranking Restaurantes</h3>
      </div>

      <div className="space-y-3">
        {restaurants.map((r, i) => (
          <motion.div
            key={r.rank}
            initial={{ opacity: 0, x: 12 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.4 + i * 0.07 }}
            className="flex items-center gap-3 p-3 rounded-xl hover:bg-white/[0.03] transition-colors group"
          >
            <span
              className="w-6 h-6 flex items-center justify-center text-xs font-bold rounded-full shrink-0"
              style={{ color: RANK_COLORS[i], backgroundColor: `${RANK_COLORS[i]}15` }}
            >
              {r.rank}
            </span>

            <div className="flex-1 min-w-0">
              <p className="text-sm font-medium text-white truncate">{r.name}</p>
              <p className="text-xs text-gray-500">{r.orders} pedidos</p>
            </div>

            <div className="text-right shrink-0">
              <p className="text-sm font-semibold text-white tabular-nums">{formatCurrency(r.revenue)}</p>
              <div className="flex items-center justify-end gap-0.5">
                <Star className="w-3 h-3 text-yellow-400 fill-yellow-400" />
                <span className="text-xs text-gray-400">{r.rating}</span>
              </div>
            </div>
          </motion.div>
        ))}
      </div>
    </motion.div>
  )
}
