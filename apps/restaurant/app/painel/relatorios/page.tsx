'use client'

import { motion } from 'framer-motion'
import { BarChart3, TrendingUp, ShoppingBag, Star } from 'lucide-react'
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

const maxPedidos = Math.max(...weeklyData.map((d) => d.pedidos))
const maxReceita = Math.max(...weeklyData.map((d) => d.receita))

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

      {/* KPIs */}
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

      {/* Gráfico de receita — barras CSS */}
      <motion.div
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3 }}
        className="bg-[#161616] border border-white/5 rounded-2xl p-6"
      >
        <h3 className="text-sm font-semibold text-white mb-6">Receita — últimos 7 dias</h3>
        <div className="flex items-end gap-3 h-40">
          {weeklyData.map((d, i) => (
            <div key={d.day} className="flex-1 flex flex-col items-center gap-2">
              <span className="text-[10px] text-gray-500 tabular-nums">
                {formatCurrency(d.receita)}
              </span>
              <motion.div
                initial={{ height: 0 }}
                animate={{ height: `${(d.receita / maxReceita) * 100}%` }}
                transition={{ delay: 0.3 + i * 0.05, duration: 0.4 }}
                className="w-full rounded-t-lg bg-[#FF1F24] min-h-[4px]"
                style={{ maxHeight: '120px' }}
              />
              <span className="text-xs text-gray-500">{d.day}</span>
            </div>
          ))}
        </div>
      </motion.div>

      {/* Gráfico de pedidos — barras CSS */}
      <motion.div
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.35 }}
        className="bg-[#161616] border border-white/5 rounded-2xl p-6"
      >
        <h3 className="text-sm font-semibold text-white mb-6">Pedidos por dia</h3>
        <div className="flex items-end gap-3 h-36">
          {weeklyData.map((d, i) => (
            <div key={d.day} className="flex-1 flex flex-col items-center gap-2">
              <span className="text-[10px] text-gray-500">{d.pedidos}</span>
              <motion.div
                initial={{ height: 0 }}
                animate={{ height: `${(d.pedidos / maxPedidos) * 100}%` }}
                transition={{ delay: 0.35 + i * 0.05, duration: 0.4 }}
                className="w-full rounded-t-lg bg-[#FF1F24]/60 min-h-[4px]"
                style={{ maxHeight: '100px' }}
              />
              <span className="text-xs text-gray-500">{d.day}</span>
            </div>
          ))}
        </div>
      </motion.div>

      {/* Top itens */}
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
        <div className="divide-y divide-white/[0.04]">
          {topItems.map((item, i) => (
            <motion.div
              key={item.name}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.4 + i * 0.04 }}
              className="flex items-center gap-4 px-5 py-3.5 hover:bg-white/[0.02] transition-colors"
            >
              <span className="text-xs text-gray-600 font-mono w-4">{i + 1}</span>
              <div className="flex-1 min-w-0">
                <p className="text-sm text-white font-medium">{item.name}</p>
                <div className="flex items-center gap-2 mt-1">
                  <div className="flex-1 h-1 bg-white/10 rounded-full overflow-hidden max-w-[120px]">
                    <div
                      className="h-full bg-[#FF1F24] rounded-full"
                      style={{ width: `${(item.sold / topItems[0].sold) * 100}%` }}
                    />
                  </div>
                  <span className="text-xs text-gray-500">{item.sold} vendidos</span>
                </div>
              </div>
              <span className="text-sm text-white font-semibold tabular-nums">{formatCurrency(item.revenue)}</span>
            </motion.div>
          ))}
        </div>
      </motion.div>
    </div>
  )
}
