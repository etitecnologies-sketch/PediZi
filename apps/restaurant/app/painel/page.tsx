'use client'

import { motion } from 'framer-motion'
import { ShoppingBag, DollarSign, Star, Clock, TrendingUp, AlertCircle } from 'lucide-react'
import { formatCurrency } from '@/lib/utils'

const kpis = [
  { title: 'Pedidos Hoje', value: 47, icon: ShoppingBag, color: '#FF1F24', change: '+12%' },
  { title: 'Faturamento Hoje', value: 2438.30, isCurrency: true, icon: DollarSign, color: '#22C55E', change: '+8%' },
  { title: 'Avaliação Média', value: 4.8, suffix: '/ 5.0', icon: Star, color: '#F59E0B', change: '+0.2' },
  { title: 'Tempo Médio', value: 28, suffix: 'min', icon: Clock, color: '#8B5CF6', change: '-3min' },
]

const recentOrders = [
  { code: 'PD1A2B3C', client: 'João Silva', items: 'Classic Burguer x2', total: 65.80, status: 'PREPARING', time: '5 min' },
  { code: 'PD4D5E6F', client: 'Maria Santos', items: 'Combo BBQ x1', total: 62.90, status: 'CONFIRMED', time: '2 min' },
  { code: 'PD7G8H9I', client: 'Pedro Costa', items: 'Frango Crispy x1, Suco x1', total: 43.90, status: 'PENDING', time: 'agora' },
  { code: 'PDABCDEF', client: 'Ana Lima', items: 'Combo Classic x2', total: 105.80, status: 'READY', time: '12 min' },
]

const STATUS = {
  PENDING:   { label: 'Aguardando', color: 'text-yellow-400 bg-yellow-400/10', action: 'Confirmar' },
  CONFIRMED: { label: 'Confirmado', color: 'text-blue-400 bg-blue-400/10', action: 'Preparar' },
  PREPARING: { label: 'Preparando', color: 'text-orange-400 bg-orange-400/10', action: 'Pronto' },
  READY:     { label: 'Pronto',     color: 'text-cyan-400 bg-cyan-400/10', action: 'Despachar' },
}

export default function PainelPage() {
  return (
    <div className="space-y-6 max-w-5xl mx-auto">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-white">Dashboard</h1>
          <p className="text-sm text-gray-500 mt-0.5">Bem-vindo de volta, Carlos!</p>
        </div>
        <div className="flex items-center gap-2 text-xs bg-[#22C55E]/10 text-[#22C55E] px-3 py-1.5 rounded-full font-medium">
          <span className="w-1.5 h-1.5 bg-[#22C55E] rounded-full animate-pulse" />
          Restaurante Aberto
        </div>
      </div>

      {/* KPIs */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {kpis.map((k, i) => (
          <motion.div
            key={k.title}
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.07 }}
            className="bg-[#161616] border border-white/5 rounded-2xl p-5"
          >
            <div className="flex items-start justify-between mb-3">
              <p className="text-xs text-gray-500 font-medium">{k.title}</p>
              <div className="w-8 h-8 rounded-xl flex items-center justify-center" style={{ backgroundColor: `${k.color}15`, color: k.color }}>
                <k.icon className="w-4 h-4" />
              </div>
            </div>
            <p className="text-2xl font-bold text-white tabular-nums">
              {k.isCurrency ? formatCurrency(k.value as number) : k.value}
              {k.suffix && <span className="text-sm text-gray-500 ml-1">{k.suffix}</span>}
            </p>
            <p className="text-xs mt-1 text-[#22C55E]">{k.change} hoje</p>
          </motion.div>
        ))}
      </div>

      {/* Alerta pedidos pendentes */}
      {recentOrders.some((o) => o.status === 'PENDING') && (
        <motion.div
          initial={{ opacity: 0, scale: 0.98 }}
          animate={{ opacity: 1, scale: 1 }}
          className="flex items-center gap-3 bg-yellow-400/5 border border-yellow-400/20 rounded-2xl p-4"
        >
          <AlertCircle className="w-5 h-5 text-yellow-400 shrink-0" />
          <p className="text-sm text-yellow-300 font-medium">
            Você tem {recentOrders.filter((o) => o.status === 'PENDING').length} pedido(s) aguardando confirmação!
          </p>
        </motion.div>
      )}

      {/* Pedidos recentes */}
      <div className="bg-[#161616] border border-white/5 rounded-2xl overflow-hidden">
        <div className="flex items-center justify-between p-5 border-b border-white/5">
          <div className="flex items-center gap-2">
            <ShoppingBag className="w-4 h-4 text-[#FF1F24]" />
            <h3 className="text-sm font-semibold text-white">Pedidos em Tempo Real</h3>
          </div>
          <span className="flex items-center gap-1.5 text-xs text-[#22C55E]">
            <span className="w-1.5 h-1.5 bg-[#22C55E] rounded-full animate-pulse" />
            Ao vivo
          </span>
        </div>

        <div className="divide-y divide-white/[0.04]">
          {recentOrders.map((order, i) => {
            const st = STATUS[order.status as keyof typeof STATUS]
            return (
              <motion.div
                key={order.code}
                initial={{ opacity: 0, x: -8 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: i * 0.06 }}
                className="flex items-center gap-4 p-5 hover:bg-white/[0.02] transition-colors"
              >
                <div className="min-w-0 flex-1">
                  <div className="flex items-center gap-2 mb-1">
                    <span className="font-mono text-xs text-gray-500">#{order.code}</span>
                    <span className={`inline-flex px-2 py-0.5 rounded-full text-xs font-medium ${st.color}`}>{st.label}</span>
                    <span className="text-xs text-gray-600 ml-auto">{order.time}</span>
                  </div>
                  <p className="text-white font-medium text-sm">{order.client}</p>
                  <p className="text-xs text-gray-500 mt-0.5 truncate">{order.items}</p>
                </div>

                <div className="flex items-center gap-3 shrink-0">
                  <span className="font-bold text-white tabular-nums">{formatCurrency(order.total)}</span>
                  <button className="px-3 py-1.5 bg-[#FF1F24]/10 text-[#FF1F24] border border-[#FF1F24]/20 rounded-lg text-xs font-semibold hover:bg-[#FF1F24]/20 transition-all">
                    {st.action}
                  </button>
                </div>
              </motion.div>
            )
          })}
        </div>
      </div>
    </div>
  )
}
