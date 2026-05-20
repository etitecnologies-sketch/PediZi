'use client'

import { motion } from 'framer-motion'
import { BarChart3, TrendingUp, ShoppingBag, Users, Star } from 'lucide-react'
import {
  AreaChart, Area, BarChart, Bar, XAxis, YAxis, CartesianGrid,
  Tooltip, ResponsiveContainer, PieChart, Pie, Cell,
} from 'recharts'
import { formatCurrency } from '@/lib/utils'

export const dynamic = 'force-dynamic'

const dailyOrders = [
  { day: 'Seg', orders: 48, revenue: 2340 },
  { day: 'Ter', orders: 61, revenue: 3120 },
  { day: 'Qua', orders: 55, revenue: 2780 },
  { day: 'Qui', orders: 74, revenue: 3850 },
  { day: 'Sex', orders: 92, revenue: 4920 },
  { day: 'Sáb', orders: 118, revenue: 6100 },
  { day: 'Dom', orders: 103, revenue: 5480 },
]

const categoryData = [
  { name: 'Hambúrgueres', value: 35, color: '#FF1F24' },
  { name: 'Pizzas', value: 22, color: '#8B5CF6' },
  { name: 'Açaí', value: 18, color: '#22C55E' },
  { name: 'Marmitas', value: 14, color: '#F59E0B' },
  { name: 'Outros', value: 11, color: '#6B7280' },
]

const topRestaurants = [
  { name: 'Burguer House', orders: 342, revenue: 17800, rating: 4.8 },
  { name: 'Pizza Palace',  orders: 218, revenue: 14200, rating: 4.7 },
  { name: 'Açaí do Norte', orders: 521, revenue: 10400, rating: 4.9 },
  { name: 'Marmita Fit',   orders: 189, revenue: 8900,  rating: 4.6 },
  { name: 'Lanche Feliz',  orders: 267, revenue: 7400,  rating: 4.5 },
]

const kpis = [
  { title: 'Pedidos esta semana', value: '551',         sub: '+12% vs semana anterior', icon: <ShoppingBag className="w-5 h-5" />, color: '#FF1F24', up: true },
  { title: 'Receita esta semana', value: 'R$ 28.590',   sub: '+8.4% vs semana anterior', icon: <TrendingUp className="w-5 h-5" />, color: '#22C55E', up: true },
  { title: 'Novos usuários',      value: '84',          sub: '+5% vs semana anterior',  icon: <Users className="w-5 h-5" />, color: '#8B5CF6', up: true },
  { title: 'Avaliação média',     value: '4.72 ★',      sub: 'Baseado em 1.340 avaliações', icon: <Star className="w-5 h-5" />, color: '#F59E0B', up: true },
]

export default function AnalyticsPage() {
  return (
    <div className="space-y-6 max-w-[1600px] mx-auto">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-white">Relatórios</h1>
          <p className="text-sm text-gray-500 mt-0.5">Análises e métricas da plataforma</p>
        </div>
        <BarChart3 className="w-5 h-5 text-[#FF1F24]" />
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {kpis.map((kpi, i) => (
          <motion.div
            key={kpi.title}
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.08 }}
            className="bg-[#161616] border border-white/5 rounded-2xl p-5"
          >
            <div className="flex items-start justify-between mb-3">
              <p className="text-xs text-gray-500 font-medium uppercase tracking-wider">{kpi.title}</p>
              <div className="w-8 h-8 rounded-lg flex items-center justify-center" style={{ backgroundColor: `${kpi.color}15`, color: kpi.color }}>
                {kpi.icon}
              </div>
            </div>
            <p className="text-2xl font-bold text-white tabular-nums">{kpi.value}</p>
            <p className="text-xs mt-1 font-medium text-[#22C55E]">{kpi.sub}</p>
          </motion.div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="lg:col-span-2 bg-[#161616] border border-white/5 rounded-2xl p-6"
        >
          <h3 className="text-sm font-semibold text-white mb-6">Pedidos e receita — últimos 7 dias</h3>
          <ResponsiveContainer width="100%" height={220}>
            <AreaChart data={dailyOrders}>
              <defs>
                <linearGradient id="colorRevenue" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#FF1F24" stopOpacity={0.2} />
                  <stop offset="95%" stopColor="#FF1F24" stopOpacity={0} />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.04)" />
              <XAxis dataKey="day" tick={{ fontSize: 11, fill: '#666' }} axisLine={false} tickLine={false} />
              <YAxis tick={{ fontSize: 11, fill: '#666' }} axisLine={false} tickLine={false} />
              <Tooltip
                contentStyle={{ backgroundColor: '#1a1a1a', border: '1px solid rgba(255,255,255,0.1)', borderRadius: 12, fontSize: 12 }}
                formatter={(value: number, name: string) => [name === 'revenue' ? formatCurrency(value) : value, name === 'revenue' ? 'Receita' : 'Pedidos']}
              />
              <Area type="monotone" dataKey="revenue" stroke="#FF1F24" strokeWidth={2} fill="url(#colorRevenue)" />
            </AreaChart>
          </ResponsiveContainer>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.35 }}
          className="bg-[#161616] border border-white/5 rounded-2xl p-6"
        >
          <h3 className="text-sm font-semibold text-white mb-6">Pedidos por categoria</h3>
          <ResponsiveContainer width="100%" height={160}>
            <PieChart>
              <Pie data={categoryData} cx="50%" cy="50%" innerRadius={45} outerRadius={70} dataKey="value" strokeWidth={0}>
                {categoryData.map((entry, index) => (
                  <Cell key={index} fill={entry.color} />
                ))}
              </Pie>
            </PieChart>
          </ResponsiveContainer>
          <div className="space-y-2 mt-3">
            {categoryData.map((c) => (
              <div key={c.name} className="flex items-center justify-between text-xs">
                <div className="flex items-center gap-2">
                  <div className="w-2 h-2 rounded-full" style={{ backgroundColor: c.color }} />
                  <span className="text-gray-400">{c.name}</span>
                </div>
                <span className="text-white font-medium">{c.value}%</span>
              </div>
            ))}
          </div>
        </motion.div>
      </div>

      <motion.div
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.4 }}
        className="bg-[#161616] border border-white/5 rounded-2xl p-6"
      >
        <h3 className="text-sm font-semibold text-white mb-5">Pedidos por dia da semana</h3>
        <ResponsiveContainer width="100%" height={180}>
          <BarChart data={dailyOrders} barGap={4}>
            <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.04)" />
            <XAxis dataKey="day" tick={{ fontSize: 11, fill: '#666' }} axisLine={false} tickLine={false} />
            <YAxis tick={{ fontSize: 11, fill: '#666' }} axisLine={false} tickLine={false} />
            <Tooltip
              contentStyle={{ backgroundColor: '#1a1a1a', border: '1px solid rgba(255,255,255,0.1)', borderRadius: 12, fontSize: 12 }}
            />
            <Bar dataKey="orders" name="Pedidos" fill="#FF1F24" radius={[4, 4, 0, 0]} />
          </BarChart>
        </ResponsiveContainer>
      </motion.div>

      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.45 }}
        className="bg-[#161616] border border-white/5 rounded-2xl overflow-hidden"
      >
        <div className="flex items-center gap-2 p-5 border-b border-white/5">
          <TrendingUp className="w-4 h-4 text-[#FF1F24]" />
          <h3 className="text-sm font-semibold text-white">Top Restaurantes</h3>
        </div>
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-white/5">
              {['#', 'Restaurante', 'Pedidos', 'Receita', 'Avaliação'].map((h) => (
                <th key={h} className="text-left text-xs font-medium text-gray-500 px-5 py-3">{h}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {topRestaurants.map((r, i) => (
              <motion.tr
                key={r.name}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.45 + i * 0.04 }}
                className="border-b border-white/[0.04] hover:bg-white/[0.02]"
              >
                <td className="px-5 py-3.5 text-gray-600 font-mono text-xs">{i + 1}</td>
                <td className="px-5 py-3.5 text-white font-medium">{r.name}</td>
                <td className="px-5 py-3.5 text-gray-400 tabular-nums">{r.orders}</td>
                <td className="px-5 py-3.5 text-white font-semibold tabular-nums">{formatCurrency(r.revenue)}</td>
                <td className="px-5 py-3.5">
                  <span className="flex items-center gap-1 text-yellow-400 text-sm font-semibold">★ {r.rating}</span>
                </td>
              </motion.tr>
            ))}
          </tbody>
        </table>
      </motion.div>
    </div>
  )
}
