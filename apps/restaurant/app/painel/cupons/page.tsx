'use client'

import { motion } from 'framer-motion'
import { Plus, Ticket, Trash2, ToggleLeft, ToggleRight } from 'lucide-react'
import { formatCurrency } from '@/lib/utils'
import { useState } from 'react'

export const dynamic = 'force-dynamic'

const TYPE_LABELS: Record<string, string> = {
  PERCENT:  'Percentual',
  FIXED:    'Valor fixo',
  SHIPPING: 'Frete grátis',
}

const initialCoupons = [
  { id: '1', code: 'BURGUER10', type: 'PERCENT', value: 10, minOrder: 30, uses: 45,  maxUses: 100, active: true, expires: '31/01/2026' },
  { id: '2', code: 'PRIMEIROPED', type: 'FIXED', value: 8, minOrder: 25,  uses: 112, maxUses: 200, active: true, expires: '28/02/2026' },
  { id: '3', code: 'FRETEGRATIS', type: 'SHIPPING', value: 0, minOrder: 40, uses: 28, maxUses: 50, active: false, expires: '15/12/2025' },
]

export default function CuponsPage() {
  const [coupons, setCoupons] = useState(initialCoupons)

  function toggleCoupon(id: string) {
    setCoupons((prev) => prev.map((c) => c.id === id ? { ...c, active: !c.active } : c))
  }

  function removeCoupon(id: string) {
    setCoupons((prev) => prev.filter((c) => c.id !== id))
  }

  return (
    <div className="space-y-6 max-w-3xl mx-auto">
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

      <div className="space-y-3">
        {coupons.map((c, i) => (
          <motion.div
            key={c.id}
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.07 }}
            className={`bg-[#161616] border rounded-2xl p-5 transition-all ${c.active ? 'border-white/5' : 'border-white/5 opacity-60'}`}
          >
            <div className="flex items-start justify-between gap-4">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-[#FF1F24]/10 rounded-xl flex items-center justify-center">
                  <Ticket className="w-5 h-5 text-[#FF1F24]" />
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <span className="font-mono font-bold text-[#FF1F24] text-base">{c.code}</span>
                    <span className={`text-xs px-2 py-0.5 rounded-full font-medium ${c.active ? 'bg-green-400/10 text-green-400' : 'bg-gray-400/10 text-gray-400'}`}>
                      {c.active ? 'Ativo' : 'Inativo'}
                    </span>
                  </div>
                  <p className="text-xs text-gray-500 mt-0.5">
                    {TYPE_LABELS[c.type]} ·{' '}
                    {c.type === 'SHIPPING' ? 'Frete grátis' : c.type === 'PERCENT' ? `${c.value}% de desconto` : `${formatCurrency(c.value)} de desconto`}
                    {' '}· Pedido mín. {formatCurrency(c.minOrder)}
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-2 shrink-0">
                <button
                  onClick={() => toggleCoupon(c.id)}
                  className={`p-2 rounded-xl transition-all ${c.active ? 'text-green-400 hover:bg-green-400/10' : 'text-gray-500 hover:bg-white/5'}`}
                >
                  {c.active ? <ToggleRight className="w-5 h-5" /> : <ToggleLeft className="w-5 h-5" />}
                </button>
                <button
                  onClick={() => removeCoupon(c.id)}
                  className="p-2 rounded-xl text-gray-500 hover:text-red-400 hover:bg-red-400/5 transition-all"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            </div>

            <div className="mt-4 flex items-center gap-4 text-xs text-gray-500">
              <div className="flex items-center gap-2 flex-1">
                <div className="flex-1 h-1.5 bg-white/10 rounded-full overflow-hidden">
                  <div
                    className="h-full bg-[#FF1F24] rounded-full transition-all"
                    style={{ width: `${Math.min((c.uses / c.maxUses) * 100, 100)}%` }}
                  />
                </div>
                <span>{c.uses}/{c.maxUses} usos</span>
              </div>
              <span>Validade: {c.expires}</span>
            </div>
          </motion.div>
        ))}
      </div>

      {coupons.length === 0 && (
        <div className="text-center py-16 text-gray-600">
          <Ticket className="w-10 h-10 mx-auto mb-3 opacity-40" />
          <p>Nenhum cupom cadastrado</p>
          <p className="text-sm mt-1">Crie um cupom para atrair mais clientes</p>
        </div>
      )}
    </div>
  )
}
