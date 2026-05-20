'use client'

import { motion } from 'framer-motion'
import { BarChart3, TrendingUp, ShoppingBag, Star } from 'lucide-react'
import {
  AreaChart, Area, BarChart, Bar, XAxis, YAxis, CartesianGrid,
  Tooltip, ResponsiveContainer,
} from 'recharts'
import { formatCurrency } from '@/lib/utils'

export const dynamic = 'force-dynamic'

const weeklyData = [
  { day: 'Seg', pedidos: 18, receita: 890 },
  { day: 'Ter', pedidos: 24, receita: 1230 },
  { day: 'Qua', pedidos: 21, receita: 1050 },
  { day: 'Qui', pedidos: 31, receita: 1580 },
  { day: 'Sex', pedidos: 42, receita: 2140 },
  { day: 'Sáb', pedidos: 58, receita: 2960 },
  { day: 'Dom', pedidos: 49, receita: 2490 },
]

const topItems = [
  { name: 'Classic Burguer', sold: 87,  revenue: 2863.30 },
  { name: 'Combo Classic',   sold: 64,  revenue: 3385.60 },
  { name: 'BBQ Smash',       sold: 51,  revenue: 2187.90 },
  { name: 'Frango Crispy',   sold: 38,  revenue: 1326.20 },
  { name: 'Refrigerante',    sold: 112, revenue: 672.00 },
]

const kpis = [
  { title: 'Receita esta semana', value: formatCurrency(12340),  sub: '+18% vs semana passada', color: '#FF1F24', icon: <TrendingUp className="w-5 h-5" /> },
  { title: 'Pedidos esta semana', value: '243',                  sub: '+12% vs semana passada', color: '#8B5CF6', icon: <ShoppingBag className="w-5 h-5" /> },
  { title: 'Ticket médio',        value: formatCurrency(50.78),  sub: '+5% vs semana passada',  color: '#22C55E', icon: <BarChart3 className="w-5 h-5" /> },
  { title: 'Avaliação média',     value: '4.8 ★',                sub: 'Baseado em 312 avaliações', color: '#F59E0B', icon: <Star className="w-5 h-5" /> },
]

export default function RelatoriosPage() {
  return (
    <div className="space-y-6 max-w-4xl mx-auto">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-white">Relatórios</h1>
          <p className="text-sm text-gray-500 mt-0.5">Desempenho do seu restaurante</p>
        </div>
        <BarChart3 className="w-5 h-5 text-[#FF1F24]" />
      </div>

      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {kpis.map((kpi, i) => (
          <motion.div
            key={kpi.title}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.08 }}
            className="bg-[#161616] border border-white/5 rounded-2xl p-4"
          >
            <div className="flex items-start justify-between mb-2">
              <p className="text-xs text-gray-500 leading-tight">{kpi.title}</p>
              <div className="w-7 h-7 rounded-lg flex items-center justify-center shrink-0" style={{ backgroundColor: `${kpi.color}15`, color: kpi.color }}>
                {kpi.icon}
              </div>
            </div>
            <p className="text-xl font-bold text-white tabular-nums">{kpi.value}</p>
            <p className="text-xs mt-1 text-[#22C55E] font-medium">{kpi.sub}</p>
          </motion.div>
        ))}
      </div>

      <motion.div
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3 }}
        className="bg-[#161616] border border-white/5 rounded-2xl p-6"
      >
        <h3 className="text-sm font-semibold text-white mb-5">Receita — últimos 7 dias</h3>
        <ResponsiveContainer width="100%" height={200}>
          <AreaChart data={weeklyData}>
            <defs>
              <linearGradient id="colorReceita" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#FF1F24" stopOpacity={0.2} />
                <stop offset="95%" stopColor="#FF1F24" stopOpacity={0} />
              </linearGradient>
            </defs>
            <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.04)" />
            <XAxis dataKey="day" tick={{ fontSize: 11, fill: '#666' }} axisLine={false} tickLine={false} />
            <YAxis tick={{ fontSize: 11, fill: '#666' }} axisLine={false} tickLine={false} tickFormatter={(v) => `R$${(v / 1000).toFixed(1)}k`} />
            <Tooltip
              contentStyle={{ backgroundColor: '#1a1a1a', border: '1px solid rgba(255,255,255,0.1)', borderRadius: 12, fontSize: 12 }}
              formatter={(value: number) => [formatCurrency(value), 'Receita']}
            />
            <Area type="monotone" dataKey="receita" stroke="#FF1F24" strokeWidth={2} fill="url(#colorReceita)" />
          </AreaChart>
        </ResponsiveContainer>
      </motion.div>

      <motion.div
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.35 }}
        className="bg-[#161616] border border-white/5 rounded-2xl p-6"
      >
        <h3 className="text-sm font-semibold text-white mb-5">Pedidos por dia</h3>
        <ResponsiveContainer width="100%" height={160}>
          <BarChart data={weeklyData}>
            <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.04)" />
            <XAxis dataKey="day" tick={{ fontSize: 11, fill: '#666' }} axisLine={false} tickLine={false} />
            <YAxis tick={{ fontSize: 11, fill: '#666' }} axisLine={false} tickLine={false} />
            <Tooltip
              contentStyle={{ backgroundColor: '#1a1a1a', border: '1px solid rgba(255,255,255,0.1)', borderRadius: 12, fontSize: 12 }}
            />
            <Bar dataKey="pedidos" name="Pedidos" fill="#FF1F24" radius={[4, 4, 0, 0]} />
          </BarChart>
        </ResponsiveContainer>
      </motion.div>

      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.4 }}
        className="bg-[#161616] border border-white/5 rounded-2xl overflow-hidden"
      >
        <div className="flex items-center gap-2 p-5 border-b border-white/5">
          <ShoppingBag className="w-4 h-4 text-[#FF1F24]" />
          <h3 className="text-sm font-semibold text-white">Itens mais vendidos</h3>
        </div>
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-white/5">
              {['#', 'Item', 'Vendidos', 'Receita'].map((h) => (
                <th key={h} className="text-left text-xs font-medium text-gray-500 px-5 py-3">{h}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {topItems.map((item, i) => (
              <motion.tr
                key={item.name}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.4 + i * 0.04 }}
                className="border-b border-white/[0.04] hover:bg-white/[0.02]"
              >
                <td className="px-5 py-3.5 text-gray-600 font-mono text-xs">{i + 1}</td>
                <td className="px-5 py-3.5 text-white font-medium">{item.name}</td>
                <td className="px-5 py-3.5 text-gray-400 tabular-nums">{item.sold}</td>
                <td className="px-5 py-3.5 text-white font-semibold tabular-nums">{formatCurrency(item.revenue)}</td>
              </motion.tr>
            ))}
          </tbody>
        </table>
      </motion.div>
    </div>
  )
}
