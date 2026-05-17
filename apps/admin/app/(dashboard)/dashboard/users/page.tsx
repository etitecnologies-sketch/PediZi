'use client'

import { motion } from 'framer-motion'
import { Search, Users, UserCheck, ShieldCheck, Bike } from 'lucide-react'
import { cn } from '@/lib/utils'
import { useState } from 'react'

const ROLE_CONFIG = {
  CLIENT:           { label: 'Cliente',   color: 'text-blue-400 bg-blue-400/10' },
  RESTAURANT_OWNER: { label: 'Dono',      color: 'text-orange-400 bg-orange-400/10' },
  COURIER:          { label: 'Entregador',color: 'text-purple-400 bg-purple-400/10' },
  ADMIN:            { label: 'Admin',     color: 'text-[#FF1F24] bg-[#FF1F24]/10' },
}

const users = Array.from({ length: 25 }, (_, i) => ({
  id: `U${String(i + 1).padStart(5, '0')}`,
  name: ['João Silva', 'Maria Santos', 'Pedro Costa', 'Ana Lima', 'Carlos Mendes', 'Fernanda Reis', 'Lucas Alves', 'Juliana Nunes'][i % 8],
  email: `user${i + 1}@exemplo.com`,
  phone: `119${String(Math.floor(Math.random() * 90000000 + 10000000))}`,
  role: Object.keys(ROLE_CONFIG)[i % 4] as keyof typeof ROLE_CONFIG,
  isActive: i % 8 !== 0,
  orders: Math.floor(Math.random() * 50),
  joined: new Date(Date.now() - Math.random() * 86400000 * 365).toLocaleDateString('pt-BR'),
}))

export default function UsersPage() {
  const [search, setSearch] = useState('')
  const [role, setRole] = useState('Todos')

  const filtered = users.filter((u) => {
    const matchSearch = search === '' || u.name.toLowerCase().includes(search.toLowerCase()) || u.email.includes(search)
    const matchRole = role === 'Todos' || u.role === role
    return matchSearch && matchRole
  })

  return (
    <div className="space-y-6 max-w-[1600px] mx-auto">
      <div>
        <h1 className="text-2xl font-bold text-white">Usuários</h1>
        <p className="text-sm text-gray-500 mt-0.5">{users.length} usuários cadastrados</p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        {[
          { label: 'Clientes', value: users.filter((u) => u.role === 'CLIENT').length, icon: Users, color: '#3B82F6' },
          { label: 'Donos', value: users.filter((u) => u.role === 'RESTAURANT_OWNER').length, icon: UserCheck, color: '#F97316' },
          { label: 'Entregadores', value: users.filter((u) => u.role === 'COURIER').length, icon: Bike, color: '#8B5CF6' },
          { label: 'Admins', value: users.filter((u) => u.role === 'ADMIN').length, icon: ShieldCheck, color: '#FF1F24' },
        ].map((s) => (
          <div key={s.label} className="bg-[#161616] border border-white/5 rounded-2xl p-4 flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl flex items-center justify-center" style={{ backgroundColor: `${s.color}15` }}>
              <s.icon className="w-4 h-4" style={{ color: s.color }} />
            </div>
            <div>
              <p className="text-xl font-bold text-white">{s.value}</p>
              <p className="text-xs text-gray-500">{s.label}</p>
            </div>
          </div>
        ))}
      </div>

      {/* Filtros */}
      <div className="flex gap-3 flex-wrap">
        <div className="relative flex-1 min-w-[200px] max-w-sm">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500" />
          <input
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Buscar usuário..."
            className="w-full h-10 bg-[#161616] border border-white/8 rounded-xl pl-9 pr-4 text-sm text-white placeholder:text-gray-600 focus:outline-none focus:ring-1 focus:ring-[#FF1F24]/40 transition-all"
          />
        </div>
        {['Todos', ...Object.keys(ROLE_CONFIG)].map((r) => (
          <button
            key={r}
            onClick={() => setRole(r)}
            className={cn('px-3 py-1.5 rounded-lg text-xs font-medium transition-all', role === r ? 'bg-[#FF1F24] text-white' : 'bg-[#161616] text-gray-400 border border-white/8 hover:text-white')}
          >
            {ROLE_CONFIG[r as keyof typeof ROLE_CONFIG]?.label ?? r}
          </button>
        ))}
      </div>

      {/* Tabela */}
      <div className="bg-[#161616] border border-white/5 rounded-2xl overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-white/5">
                {['Usuário', 'E-mail', 'Telefone', 'Função', 'Pedidos', 'Status', 'Entrou'].map((h) => (
                  <th key={h} className="text-left text-xs font-medium text-gray-500 px-5 py-3">{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {filtered.map((u, i) => {
                const roleConf = ROLE_CONFIG[u.role]
                return (
                  <motion.tr
                    key={u.id}
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: i * 0.02 }}
                    className="border-b border-white/[0.04] hover:bg-white/[0.02]"
                  >
                    <td className="px-5 py-3.5">
                      <div className="flex items-center gap-2.5">
                        <div className="w-7 h-7 rounded-full bg-gradient-to-br from-[#FF1F24] to-orange-500 flex items-center justify-center text-xs font-bold shrink-0">
                          {u.name[0]}
                        </div>
                        <span className="text-white font-medium">{u.name}</span>
                      </div>
                    </td>
                    <td className="px-5 py-3.5 text-gray-400 text-xs">{u.email}</td>
                    <td className="px-5 py-3.5 text-gray-400 text-xs">{u.phone}</td>
                    <td className="px-5 py-3.5">
                      <span className={cn('inline-flex px-2.5 py-1 rounded-full text-xs font-medium', roleConf.color)}>{roleConf.label}</span>
                    </td>
                    <td className="px-5 py-3.5 text-white tabular-nums">{u.orders}</td>
                    <td className="px-5 py-3.5">
                      <span className={cn('inline-flex px-2.5 py-1 rounded-full text-xs font-medium', u.isActive ? 'text-green-400 bg-green-400/10' : 'text-red-400 bg-red-400/10')}>
                        {u.isActive ? 'Ativo' : 'Inativo'}
                      </span>
                    </td>
                    <td className="px-5 py-3.5 text-gray-500 text-xs">{u.joined}</td>
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
