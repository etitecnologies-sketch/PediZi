'use client'

import { motion } from 'framer-motion'
import { Search, Plus, Ticket, Trash2, ToggleLeft, ToggleRight } from 'lucide-react'
import { formatCurrency } from '@/lib/utils'
import { useState } from 'react'

export const dynamic = 'force-dynamic'

const initialCoupons = [
  { id: '1', code: 'PEDIZI10', type: 'PERCENT', value: 10, minOrder: 30, uses: 128, maxUses: 500, active: true, expires: '31/12/2025' },
  { id: '2', code: 'FRETE0',   type: 'SHIPPING', value: 0,  minOrder: 25, uses: 84,  maxUses: 200, active: true, expires: '15/01/2026' },
  { id: '3', code: 'BEM5',     type: 'FIXED',   value: 5,  minOrder: 20, uses: 312, maxUses: 300, active: false, expires: '01/12/2025' },
  { id: '4', code: 'NATAL20',  type: 'PERCENT', value: 20, minOrder: 50, uses: 45,  maxUses: 100, active: true, expires: '25/12/2025' },
  { id: '5', code: 'DESCONTO8', type: 'FIXED',  value: 8,  minOrder: 35, uses: 67,  maxUses: 150, active: true, expires: '28/02/2026' },
]

const TYPE_LABELS: Record<string, string> = {
  PERCENT:  'Percentual',
  FIXED:    'Valor fixo',
  SHIPPING: 'Frete grátis',
}

export default function CouponsPage() {
  const [coupons, setCoupons] = useState(initialCoupons)
  const [search, setSearch] = useState('')

  function toggleCoupon(id: string) {
    setCoupons((prev) => prev.map((c) => c.id === id ? { ...c, active: !c.active } : c))
  }

  function removeCoupon(id: string) {
    setCoupons((prev) => prev.filter((c) => c.id !== id))
  }

  const filtered = coupons.filter((c) => search === '' || c.code.toLowerCase().includes(search.toLowerCase()))

  return (
    <div className="space-y-6 max-w-[1600px] mx-auto">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-white">Cupons</h1>
          <p className="text-sm text-gray-500 mt-0.5">{coupons.length} cupons cadastrados</p>
        </div>
        <button className="flex items-center gap-2 h-10 px-4 bg-[#FF1F24] hover:bg-[#FF1F24]/90 text-white text-sm font-semibold rounded-xl transition-all active:scale-95">
          <Plus className="w-4 h-4" />
          Novo cupom
        </button>
      </div>

      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        {[
          { label: 'Total', value: coupons.length, color: '#FF1F24' },
          { label: 'Ativos', value: coupons.filter((c) => c.active).length, color: '#22C55E' },
          { label: 'Inativos', value: coupons.filter((c) => !c.active).length, color: '#6B7280' },
          { label: 'Usos totais', value: coupons.reduce((acc, c) => acc + c.uses, 0), color: '#8B5CF6' },
        ].map((s, i) => (
          <motion.div
            key={s.label}
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.07 }}
            className="bg-[#161616] border border-white/5 rounded-2xl p-4 flex items-center gap-3"
          >
            <div className="w-9 h-9 rounded-xl flex items-center justify-center" style={{ backgroundColor: `${s.color}15` }}>
              <Ticket className="w-4 h-4" style={{ color: s.color }} />
            </div>
            <div>
              <p className="text-xl font-bold text-white">{s.value}</p>
              <p className="text-xs text-gray-500">{s.label}</p>
            </div>
          </motion.div>
        ))}
      </div>

      <div className="relative max-w-sm">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500" />
        <input
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="Buscar cupom..."
          className="w-full h-10 bg-[#161616] border border-white/8 rounded-xl pl-9 pr-4 text-sm text-white placeholder:text-gray-600 focus:outline-none focus:ring-1 focus:ring-[#FF1F24]/40 transition-all"
        />
      </div>

      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        className="bg-[#161616] border border-white/5 rounded-2xl overflow-hidden"
      >
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-white/5">
                {['Código', 'Tipo', 'Desconto', 'Pedido mín.', 'Usos', 'Validade', 'Status', 'Ações'].map((h) => (
                  <th key={h} className="text-left text-xs font-medium text-gray-500 px-5 py-3">{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {filtered.map((c, i) => (
                <motion.tr
                  key={c.id}
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: i * 0.03 }}
                  className="border-b border-white/[0.04] hover:bg-white/[0.02] transition-colors"
                >
                  <td className="px-5 py-3.5 font-mono font-bold text-[#FF1F24]">{c.code}</td>
                  <td className="px-5 py-3.5 text-gray-400 text-xs">{TYPE_LABELS[c.type]}</td>
                  <td className="px-5 py-3.5 text-white font-semibold">
                    {c.type === 'SHIPPING' ? 'Frete grátis' : c.type === 'PERCENT' ? `${c.value}%` : formatCurrency(c.value)}
                  </td>
                  <td className="px-5 py-3.5 text-gray-400">{formatCurrency(c.minOrder)}</td>
                  <td className="px-5 py-3.5">
                    <div className="flex items-center gap-2">
                      <div className="w-20 h-1.5 bg-white/10 rounded-full overflow-hidden">
                        <div
                          className="h-full bg-[#FF1F24] rounded-full"
                          style={{ width: `${Math.min((c.uses / c.maxUses) * 100, 100)}%` }}
                        />
                      </div>
                      <span className="text-xs text-gray-500">{c.uses}/{c.maxUses}</span>
                    </div>
                  </td>
                  <td className="px-5 py-3.5 text-gray-400 text-xs">{c.expires}</td>
                  <td className="px-5 py-3.5">
                    <span className={`inline-flex px-2.5 py-1 rounded-full text-xs font-medium ${c.active ? 'text-green-400 bg-green-400/10' : 'text-gray-400 bg-gray-400/10'}`}>
                      {c.active ? 'Ativo' : 'Inativo'}
                    </span>
                  </td>
                  <td className="px-5 py-3.5">
                    <div className="flex items-center gap-2">
                      <button
                        onClick={() => toggleCoupon(c.id)}
                        className={`p-1.5 rounded-lg transition-all ${c.active ? 'text-green-400 hover:bg-green-400/10' : 'text-gray-500 hover:bg-white/5'}`}
                      >
                        {c.active ? <ToggleRight className="w-4 h-4" /> : <ToggleLeft className="w-4 h-4" />}
                      </button>
                      <button
                        onClick={() => removeCoupon(c.id)}
                        className="p-1.5 rounded-lg text-gray-500 hover:text-red-400 hover:bg-red-400/5 transition-all"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </td>
                </motion.tr>
              ))}
            </tbody>
          </table>
        </div>
      </motion.div>
    </div>
  )
}
