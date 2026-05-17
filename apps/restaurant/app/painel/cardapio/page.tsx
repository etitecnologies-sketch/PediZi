'use client'

import { motion } from 'framer-motion'
import { Plus, Pencil, Trash2, ToggleLeft, ToggleRight, UtensilsCrossed } from 'lucide-react'
import { formatCurrency } from '@/lib/utils'
import { useState } from 'react'

const initialMenu = [
  { id: '1', category: 'Hambúrgueres', name: 'Classic Burguer', description: 'Pão brioche, blend 180g, cheddar, alface, tomate e molho especial', price: 32.90, available: true },
  { id: '2', category: 'Hambúrgueres', name: 'BBQ Smash', description: 'Dois smash burgers 90g, bacon, queijo americano e molho BBQ', price: 42.90, available: true },
  { id: '3', category: 'Hambúrgueres', name: 'Frango Crispy', description: 'Frango empanado, queijo prato, maionese de ervas e rúcula', price: 34.90, available: false },
  { id: '4', category: 'Combos', name: 'Combo Classic', description: 'Classic + Batata Frita + Refrigerante', price: 52.90, available: true },
  { id: '5', category: 'Bebidas', name: 'Refrigerante Lata', description: 'Coca, Guaraná ou Sprite 350ml', price: 6.00, available: true },
  { id: '6', category: 'Bebidas', name: 'Suco Natural', description: 'Laranja, limão ou maracujá 400ml', price: 9.00, available: true },
]

export default function CardapioPage() {
  const [items, setItems] = useState(initialMenu)

  function toggleAvailability(id: string) {
    setItems((prev) => prev.map((item) => item.id === id ? { ...item, available: !item.available } : item))
  }

  const categories = [...new Set(items.map((i) => i.category))]

  return (
    <div className="space-y-6 max-w-4xl mx-auto">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-white">Cardápio</h1>
          <p className="text-sm text-gray-500 mt-0.5">{items.length} itens cadastrados</p>
        </div>
        <button className="flex items-center gap-2 h-10 px-4 bg-[#FF1F24] hover:bg-[#FF1F24]/90 text-white text-sm font-semibold rounded-xl transition-all active:scale-95">
          <Plus className="w-4 h-4" />
          Novo item
        </button>
      </div>

      {categories.map((cat) => (
        <div key={cat}>
          <div className="flex items-center gap-2 mb-4">
            <UtensilsCrossed className="w-4 h-4 text-[#FF1F24]" />
            <h2 className="text-base font-bold text-white">{cat}</h2>
            <span className="text-xs text-gray-600">({items.filter((i) => i.category === cat).length})</span>
          </div>

          <div className="space-y-3">
            {items.filter((i) => i.category === cat).map((item, idx) => (
              <motion.div
                key={item.id}
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: idx * 0.05 }}
                className={`bg-[#161616] border rounded-2xl p-4 flex gap-4 transition-all ${item.available ? 'border-white/5' : 'border-white/5 opacity-60'}`}
              >
                <div className="w-16 h-16 bg-gradient-to-br from-orange-500/20 to-transparent rounded-xl flex items-center justify-center text-3xl shrink-0">
                  🍔
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2">
                    <h3 className="font-semibold text-white">{item.name}</h3>
                    {!item.available && (
                      <span className="text-xs bg-red-400/10 text-red-400 px-2 py-0.5 rounded-full">Indisponível</span>
                    )}
                  </div>
                  <p className="text-xs text-gray-500 mt-0.5 line-clamp-1">{item.description}</p>
                  <p className="text-[#FF1F24] font-bold mt-2">{formatCurrency(item.price)}</p>
                </div>

                <div className="flex items-center gap-2 shrink-0">
                  <button
                    onClick={() => toggleAvailability(item.id)}
                    className={`p-2 rounded-xl transition-all ${item.available ? 'text-[#22C55E] hover:bg-[#22C55E]/10' : 'text-gray-500 hover:bg-white/5'}`}
                    title={item.available ? 'Desativar' : 'Ativar'}
                  >
                    {item.available ? <ToggleRight className="w-5 h-5" /> : <ToggleLeft className="w-5 h-5" />}
                  </button>
                  <button className="p-2 rounded-xl text-gray-500 hover:text-white hover:bg-white/5 transition-all">
                    <Pencil className="w-4 h-4" />
                  </button>
                  <button className="p-2 rounded-xl text-gray-500 hover:text-red-400 hover:bg-red-400/5 transition-all">
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      ))}
    </div>
  )
}
