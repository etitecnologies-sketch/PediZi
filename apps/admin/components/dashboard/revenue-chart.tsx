'use client'

import { motion } from 'framer-motion'
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from 'recharts'
import { formatCurrency } from '@/lib/utils'

const mockData = [
  { month: 'Jan', revenue: 18500, orders: 342 },
  { month: 'Fev', revenue: 21000, orders: 410 },
  { month: 'Mar', revenue: 19800, orders: 387 },
  { month: 'Abr', revenue: 24500, orders: 478 },
  { month: 'Mai', revenue: 28000, orders: 521 },
  { month: 'Jun', revenue: 31200, orders: 612 },
  { month: 'Jul', revenue: 27800, orders: 543 },
  { month: 'Ago', revenue: 33500, orders: 654 },
  { month: 'Set', revenue: 36000, orders: 702 },
  { month: 'Out', revenue: 41200, orders: 798 },
  { month: 'Nov', revenue: 45800, orders: 891 },
  { month: 'Dez', revenue: 52000, orders: 1012 },
]

function CustomTooltip({ active, payload, label }: any) {
  if (!active || !payload?.length) return null
  return (
    <div className="bg-[#1a1a1a] border border-white/10 rounded-xl p-3 shadow-2xl">
      <p className="text-xs text-gray-400 mb-2">{label}</p>
      <p className="text-sm font-semibold text-white">{formatCurrency(payload[0]?.value)}</p>
      <p className="text-xs text-gray-400">{payload[1]?.value} pedidos</p>
    </div>
  )
}

export function RevenueChart() {
  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.3 }}
      className="bg-[#161616] border border-white/5 rounded-2xl p-6"
    >
      <div className="flex items-center justify-between mb-6">
        <div>
          <h3 className="text-sm font-semibold text-white">Receita Mensal</h3>
          <p className="text-xs text-gray-500 mt-0.5">Crescimento dos últimos 12 meses</p>
        </div>
        <div className="flex items-center gap-4 text-xs text-gray-500">
          <span className="flex items-center gap-1.5">
            <span className="w-2 h-2 bg-[#FF1F24] rounded-full" />
            Receita
          </span>
          <span className="flex items-center gap-1.5">
            <span className="w-2 h-2 bg-[#FF1F24]/30 rounded-full" />
            Pedidos
          </span>
        </div>
      </div>

      <ResponsiveContainer width="100%" height={240}>
        <AreaChart data={mockData} margin={{ top: 5, right: 5, left: -20, bottom: 0 }}>
          <defs>
            <linearGradient id="colorRevenue" x1="0" y1="0" x2="0" y2="1">
              <stop offset="5%" stopColor="#FF1F24" stopOpacity={0.3} />
              <stop offset="95%" stopColor="#FF1F24" stopOpacity={0} />
            </linearGradient>
          </defs>
          <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.04)" />
          <XAxis dataKey="month" tick={{ fontSize: 11, fill: '#666' }} axisLine={false} tickLine={false} />
          <YAxis tick={{ fontSize: 11, fill: '#666' }} axisLine={false} tickLine={false} tickFormatter={(v) => `R$${(v / 1000).toFixed(0)}k`} />
          <Tooltip content={<CustomTooltip />} />
          <Area type="monotone" dataKey="revenue" stroke="#FF1F24" strokeWidth={2} fill="url(#colorRevenue)" dot={false} activeDot={{ r: 4, fill: '#FF1F24' }} />
        </AreaChart>
      </ResponsiveContainer>
    </motion.div>
  )
}
