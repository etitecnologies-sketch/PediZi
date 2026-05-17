'use client'

import { motion } from 'framer-motion'
import { DollarSign, TrendingUp, ArrowDownRight, ArrowUpRight, CreditCard } from 'lucide-react'
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts'
import { formatCurrency } from '@/lib/utils'

const monthlyData = [
  { month: 'Jul', platform: 3800, restaurants: 24000 },
  { month: 'Ago', platform: 4200, restaurants: 29300 },
  { month: 'Set', platform: 4900, restaurants: 31100 },
  { month: 'Out', platform: 5600, restaurants: 35600 },
  { month: 'Nov', platform: 6200, restaurants: 39600 },
  { month: 'Dez', platform: 7400, restaurants: 44600 },
]

const transactions = [
  { id: 'PAY001', restaurant: 'Burguer House', amount: 62800, fee: 7536, payout: 55264, date: '15/12/2024', status: 'Pago' },
  { id: 'PAY002', restaurant: 'Pizza Palace', amount: 54200, fee: 6504, payout: 47696, date: '15/12/2024', status: 'Pago' },
  { id: 'PAY003', restaurant: 'Açaí do Norte', amount: 39600, fee: 4752, payout: 34848, date: '14/12/2024', status: 'Pendente' },
  { id: 'PAY004', restaurant: 'Marmita Fit', amount: 28900, fee: 3468, payout: 25432, date: '14/12/2024', status: 'Pago' },
  { id: 'PAY005', restaurant: 'Lanche Feliz', amount: 24100, fee: 2892, payout: 21208, date: '13/12/2024', status: 'Pendente' },
]

export default function FinancialPage() {
  return (
    <div className="space-y-6 max-w-[1600px] mx-auto">
      <div>
        <h1 className="text-2xl font-bold text-white">Financeiro</h1>
        <p className="text-sm text-gray-500 mt-0.5">Receitas, repasses e comissões da plataforma</p>
      </div>

      {/* KPIs financeiros */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {[
          { title: 'Receita Total (Dez)', value: 52000, change: 13.5, icon: <DollarSign className="w-5 h-5" />, color: '#FF1F24' },
          { title: 'Taxa Plataforma', value: 6240, change: 13.5, icon: <TrendingUp className="w-5 h-5" />, color: '#22C55E' },
          { title: 'Repasse Restaurantes', value: 45760, change: 13.2, icon: <ArrowUpRight className="w-5 h-5" />, color: '#8B5CF6' },
          { title: 'Estornos (Dez)', value: 1240, change: -4.2, icon: <ArrowDownRight className="w-5 h-5" />, color: '#EF4444' },
        ].map((kpi, i) => (
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
            <p className="text-2xl font-bold text-white tabular-nums">{formatCurrency(kpi.value)}</p>
            <p className={`text-xs mt-1 font-medium ${kpi.change > 0 ? 'text-[#22C55E]' : 'text-[#EF4444]'}`}>
              {kpi.change > 0 ? '+' : ''}{kpi.change}% vs mês anterior
            </p>
          </motion.div>
        ))}
      </div>

      {/* Gráfico receita x comissão */}
      <motion.div
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3 }}
        className="bg-[#161616] border border-white/5 rounded-2xl p-6"
      >
        <h3 className="text-sm font-semibold text-white mb-6">Receita vs Comissão (últimos 6 meses)</h3>
        <ResponsiveContainer width="100%" height={220}>
          <BarChart data={monthlyData} barGap={4}>
            <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.04)" />
            <XAxis dataKey="month" tick={{ fontSize: 11, fill: '#666' }} axisLine={false} tickLine={false} />
            <YAxis tick={{ fontSize: 11, fill: '#666' }} axisLine={false} tickLine={false} tickFormatter={(v) => `R$${(v / 1000).toFixed(0)}k`} />
            <Tooltip
              contentStyle={{ backgroundColor: '#1a1a1a', border: '1px solid rgba(255,255,255,0.1)', borderRadius: 12, fontSize: 12 }}
              formatter={(value: number) => [formatCurrency(value), '']}
            />
            <Bar dataKey="restaurants" name="Repasse Restaurantes" fill="#FF1F24" opacity={0.4} radius={[4, 4, 0, 0]} />
            <Bar dataKey="platform" name="Taxa Plataforma" fill="#FF1F24" radius={[4, 4, 0, 0]} />
          </BarChart>
        </ResponsiveContainer>
      </motion.div>

      {/* Tabela repasses */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.4 }}
        className="bg-[#161616] border border-white/5 rounded-2xl overflow-hidden"
      >
        <div className="flex items-center gap-2 p-6 border-b border-white/5">
          <CreditCard className="w-4 h-4 text-[#FF1F24]" />
          <h3 className="text-sm font-semibold text-white">Repasses Recentes</h3>
        </div>
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-white/5">
              {['ID', 'Restaurante', 'Faturamento', 'Taxa (12%)', 'Repasse', 'Data', 'Status'].map((h) => (
                <th key={h} className="text-left text-xs font-medium text-gray-500 px-5 py-3">{h}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {transactions.map((t, i) => (
              <motion.tr
                key={t.id}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.4 + i * 0.05 }}
                className="border-b border-white/[0.04] hover:bg-white/[0.02]"
              >
                <td className="px-5 py-3.5 font-mono text-xs text-gray-400">{t.id}</td>
                <td className="px-5 py-3.5 text-white">{t.restaurant}</td>
                <td className="px-5 py-3.5 text-white tabular-nums">{formatCurrency(t.amount)}</td>
                <td className="px-5 py-3.5 text-[#FF1F24] font-medium tabular-nums">{formatCurrency(t.fee)}</td>
                <td className="px-5 py-3.5 text-white font-semibold tabular-nums">{formatCurrency(t.payout)}</td>
                <td className="px-5 py-3.5 text-gray-400 text-xs">{t.date}</td>
                <td className="px-5 py-3.5">
                  <span className={`inline-flex px-2.5 py-1 rounded-full text-xs font-medium ${t.status === 'Pago' ? 'text-green-400 bg-green-400/10' : 'text-yellow-400 bg-yellow-400/10'}`}>
                    {t.status}
                  </span>
                </td>
              </motion.tr>
            ))}
          </tbody>
        </table>
      </motion.div>
    </div>
  )
}
