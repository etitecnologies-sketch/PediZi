'use client'

import { motion } from 'framer-motion'
import { Search, Store, CheckCircle, XCircle, Clock, Star } from 'lucide-react'
import { cn, formatCurrency } from '@/lib/utils'
import { useState } from 'react'

const STATUS_CONFIG = {
  ACTIVE:           { label: 'Ativo',      color: 'text-green-400 bg-green-400/10' },
  PENDING_APPROVAL: { label: 'Pendente',   color: 'text-yellow-400 bg-yellow-400/10' },
  INACTIVE:         { label: 'Inativo',    color: 'text-gray-400 bg-gray-400/10' },
  SUSPENDED:        { label: 'Suspenso',   color: 'text-red-400 bg-red-400/10' },
}

const restaurants = Array.from({ length: 15 }, (_, i) => ({
  id: `R${String(i + 1).padStart(4, '0')}`,
  name: ['Burguer House', 'Pizza Palace', 'Açaí do Norte', 'Marmita Fit', 'Lanche Feliz', 'Churrascaria Boa Vista', 'Sushi Express', 'Tapiocaria', 'Pastelaria Popular', 'Sorvetes & Cia'][i % 10],
  owner: ['Carlos Silva', 'Maria Costa', 'João Alves', 'Ana Lima', 'Pedro Santos'][i % 5],
  city: 'Franca - SP',
  plan: ['FREE', 'STARTER', 'PROFESSIONAL', 'ENTERPRISE'][i % 4],
  status: Object.keys(STATUS_CONFIG)[i % 4] as keyof typeof STATUS_CONFIG,
  orders: Math.floor(Math.random() * 2000 + 100),
  revenue: parseFloat((Math.random() * 80000 + 5000).toFixed(2)),
  rating: parseFloat((Math.random() * 1.5 + 3.5).toFixed(1)),
}))

export default function RestaurantsPage() {
  const [search, setSearch] = useState('')
  const [activeStatus, setActiveStatus] = useState<string>('Todos')

  const filtered = restaurants.filter((r) => {
    const matchSearch = search === '' || r.name.toLowerCase().includes(search.toLowerCase())
    const matchStatus = activeStatus === 'Todos' || r.status === activeStatus
    return matchSearch && matchStatus
  })

  return (
    <div className="space-y-6 max-w-[1600px] mx-auto">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-white">Restaurantes</h1>
          <p className="text-sm text-gray-500 mt-0.5">{restaurants.length} estabelecimentos cadastrados</p>
        </div>
      </div>

      {/* Stats rápidas */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        {[
          { label: 'Total', value: restaurants.length, icon: Store, color: '#FF1F24' },
          { label: 'Ativos', value: restaurants.filter((r) => r.status === 'ACTIVE').length, icon: CheckCircle, color: '#22C55E' },
          { label: 'Pendentes', value: restaurants.filter((r) => r.status === 'PENDING_APPROVAL').length, icon: Clock, color: '#F59E0B' },
          { label: 'Suspensos', value: restaurants.filter((r) => r.status === 'SUSPENDED').length, icon: XCircle, color: '#EF4444' },
        ].map((stat) => (
          <div key={stat.label} className="bg-[#161616] border border-white/5 rounded-2xl p-4 flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl flex items-center justify-center" style={{ backgroundColor: `${stat.color}15` }}>
              <stat.icon className="w-4.5 h-4.5" style={{ color: stat.color }} />
            </div>
            <div>
              <p className="text-xl font-bold text-white">{stat.value}</p>
              <p className="text-xs text-gray-500">{stat.label}</p>
            </div>
          </div>
        ))}
      </div>

      {/* Filtros */}
      <div className="flex gap-3">
        <div className="relative flex-1 max-w-sm">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500" />
          <input
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Buscar restaurante..."
            className="w-full h-10 bg-[#161616] border border-white/8 rounded-xl pl-9 pr-4 text-sm text-white placeholder:text-gray-600 focus:outline-none focus:ring-1 focus:ring-[#FF1F24]/40 transition-all"
          />
        </div>
        {['Todos', ...Object.keys(STATUS_CONFIG)].map((s) => (
          <button
            key={s}
            onClick={() => setActiveStatus(s)}
            className={cn(
              'px-3 py-1.5 rounded-lg text-xs font-medium transition-all',
              activeStatus === s ? 'bg-[#FF1F24] text-white' : 'bg-[#161616] text-gray-400 border border-white/8 hover:text-white',
            )}
          >
            {STATUS_CONFIG[s as keyof typeof STATUS_CONFIG]?.label ?? s}
          </button>
        ))}
      </div>

      {/* Tabela */}
      <div className="bg-[#161616] border border-white/5 rounded-2xl overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-white/5">
                {['Restaurante', 'Dono', 'Plano', 'Pedidos', 'Receita', 'Nota', 'Status', 'Ações'].map((h) => (
                  <th key={h} className="text-left text-xs font-medium text-gray-500 px-5 py-3">{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {filtered.map((r, i) => {
                const status = STATUS_CONFIG[r.status]
                const planColors: Record<string, string> = { FREE: 'text-gray-400', STARTER: 'text-blue-400', PROFESSIONAL: 'text-purple-400', ENTERPRISE: 'text-yellow-400' }
                return (
                  <motion.tr
                    key={r.id}
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: i * 0.02 }}
                    className="border-b border-white/[0.04] hover:bg-white/[0.02] transition-colors"
                  >
                    <td className="px-5 py-3.5">
                      <div>
                        <p className="text-white font-medium">{r.name}</p>
                        <p className="text-xs text-gray-500">{r.city}</p>
                      </div>
                    </td>
                    <td className="px-5 py-3.5 text-gray-400">{r.owner}</td>
                    <td className="px-5 py-3.5"><span className={cn('text-xs font-semibold', planColors[r.plan])}>{r.plan}</span></td>
                    <td className="px-5 py-3.5 text-white tabular-nums">{r.orders}</td>
                    <td className="px-5 py-3.5 text-white font-semibold tabular-nums">{formatCurrency(r.revenue)}</td>
                    <td className="px-5 py-3.5">
                      <div className="flex items-center gap-1">
                        <Star className="w-3 h-3 text-yellow-400 fill-yellow-400" />
                        <span className="text-white">{r.rating}</span>
                      </div>
                    </td>
                    <td className="px-5 py-3.5">
                      <span className={cn('inline-flex px-2.5 py-1 rounded-full text-xs font-medium', status.color)}>{status.label}</span>
                    </td>
                    <td className="px-5 py-3.5">
                      <div className="flex gap-2">
                        {r.status === 'PENDING_APPROVAL' && (
                          <button className="text-xs text-green-400 hover:text-green-300 font-medium">Aprovar</button>
                        )}
                        <button className="text-xs text-gray-500 hover:text-white">Ver</button>
                      </div>
                    </td>
                  </motion.tr>
                )
              })}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  )
}
