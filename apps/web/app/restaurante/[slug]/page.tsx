'use client'

import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { ArrowLeft, Star, Clock, MapPin, Minus, Plus, ShoppingCart, Zap } from 'lucide-react'
import Link from 'next/link'

const restaurant = {
  name: 'Burguer House',
  category: 'Hambúrgueres',
  rating: 4.8,
  reviews: 342,
  deliveryTime: '25-35 min',
  deliveryFee: 5.00,
  minOrder: 25,
  description: 'Os melhores hambúrgueres artesanais da cidade!',
}

const menuCategories = [
  {
    name: 'Hambúrgueres',
    items: [
      { id: '1', name: 'Classic Burguer', description: 'Pão brioche, blend 180g, queijo cheddar, alface, tomate e molho especial', price: 32.90 },
      { id: '2', name: 'BBQ Smash', description: 'Dois smash burgers 90g, bacon crocante, queijo americano e molho BBQ', price: 42.90 },
      { id: '3', name: 'Frango Crispy', description: 'Frango empanado crocante, queijo prato, maionese de ervas e rúcula', price: 34.90 },
    ],
  },
  {
    name: 'Combos',
    items: [
      { id: '4', name: 'Combo Classic', description: 'Classic Burguer + Batata Frita + Refrigerante 350ml', price: 52.90 },
      { id: '5', name: 'Combo BBQ', description: 'BBQ Smash + Batata Frita + Refrigerante 350ml', price: 62.90 },
    ],
  },
  {
    name: 'Bebidas',
    items: [
      { id: '6', name: 'Refrigerante Lata', description: 'Coca-Cola, Guaraná ou Sprite 350ml', price: 6.00 },
      { id: '7', name: 'Suco Natural', description: 'Laranja, limão ou maracujá 400ml', price: 9.00 },
    ],
  },
]

type CartItem = { id: string; name: string; price: number; qty: number }

export default function RestaurantePage({ params }: { params: { slug: string } }) {
  const [cart, setCart] = useState<CartItem[]>([])
  const [showCart, setShowCart] = useState(false)

  const totalItems = cart.reduce((s, i) => s + i.qty, 0)
  const totalValue = cart.reduce((s, i) => s + i.price * i.qty, 0)

  function addToCart(item: { id: string; name: string; price: number }) {
    setCart((prev) => {
      const existing = prev.find((c) => c.id === item.id)
      if (existing) return prev.map((c) => c.id === item.id ? { ...c, qty: c.qty + 1 } : c)
      return [...prev, { ...item, qty: 1 }]
    })
  }

  function removeFromCart(id: string) {
    setCart((prev) => {
      const existing = prev.find((c) => c.id === id)
      if (!existing) return prev
      if (existing.qty === 1) return prev.filter((c) => c.id !== id)
      return prev.map((c) => c.id === id ? { ...c, qty: c.qty - 1 } : c)
    })
  }

  function getQty(id: string) {
    return cart.find((c) => c.id === id)?.qty ?? 0
  }

  return (
    <div className="min-h-screen bg-[#0D0D0D]">
      {/* Header do restaurante */}
      <div className="relative h-52 bg-gradient-to-br from-orange-600 to-black/60 flex items-center justify-center">
        <span className="text-7xl">🍔</span>
        <Link href="/" className="absolute top-4 left-4 w-10 h-10 bg-black/50 backdrop-blur-sm rounded-full flex items-center justify-center text-white hover:bg-black/70 transition-all">
          <ArrowLeft className="w-5 h-5" />
        </Link>
      </div>

      <div className="max-w-3xl mx-auto px-4">
        {/* Info restaurante */}
        <div className="bg-[#161616] border border-white/5 rounded-2xl p-5 -mt-6 relative z-10 mb-6">
          <div className="flex items-start justify-between gap-4">
            <div>
              <h1 className="text-xl font-bold text-white">{restaurant.name}</h1>
              <p className="text-sm text-gray-500 mt-0.5">{restaurant.description}</p>
            </div>
            <span className="bg-[#22C55E]/10 text-[#22C55E] text-xs font-semibold px-2.5 py-1 rounded-full shrink-0">Aberto</span>
          </div>

          <div className="flex items-center gap-4 mt-4 text-sm text-gray-400">
            <span className="flex items-center gap-1">
              <Star className="w-4 h-4 text-yellow-400 fill-yellow-400" />
              <span className="text-white font-medium">{restaurant.rating}</span>
              <span>({restaurant.reviews})</span>
            </span>
            <span className="flex items-center gap-1">
              <Clock className="w-4 h-4" />
              {restaurant.deliveryTime}
            </span>
            <span className="flex items-center gap-1">
              <MapPin className="w-4 h-4" />
              Franca - SP
            </span>
            <span className="ml-auto text-[#FF1F24] font-semibold">
              Entrega: R$ {restaurant.deliveryFee.toFixed(2)}
            </span>
          </div>
        </div>

        {/* Cardápio */}
        <div className="space-y-8 pb-32">
          {menuCategories.map((cat) => (
            <div key={cat.name}>
              <h2 className="text-lg font-bold text-white mb-4">{cat.name}</h2>
              <div className="space-y-3">
                {cat.items.map((item) => {
                  const qty = getQty(item.id)
                  return (
                    <motion.div
                      key={item.id}
                      layout
                      className="bg-[#161616] border border-white/5 rounded-2xl p-4 flex gap-4 hover:border-white/10 transition-all"
                    >
                      <div className="w-20 h-20 bg-gradient-to-br from-orange-500/20 to-transparent rounded-xl flex items-center justify-center text-3xl shrink-0">
                        🍔
                      </div>
                      <div className="flex-1 min-w-0">
                        <h3 className="font-semibold text-white">{item.name}</h3>
                        <p className="text-xs text-gray-500 mt-1 line-clamp-2">{item.description}</p>
                        <div className="flex items-center justify-between mt-3">
                          <span className="text-[#FF1F24] font-bold">R$ {item.price.toFixed(2)}</span>
                          <div className="flex items-center gap-2">
                            {qty > 0 && (
                              <>
                                <button onClick={() => removeFromCart(item.id)} className="w-7 h-7 bg-white/10 rounded-full flex items-center justify-center hover:bg-white/20 transition-all">
                                  <Minus className="w-3.5 h-3.5" />
                                </button>
                                <span className="text-white font-bold w-5 text-center">{qty}</span>
                              </>
                            )}
                            <button onClick={() => addToCart(item)} className="w-7 h-7 bg-[#FF1F24] rounded-full flex items-center justify-center hover:bg-[#FF1F24]/80 transition-all active:scale-90">
                              <Plus className="w-3.5 h-3.5" />
                            </button>
                          </div>
                        </div>
                      </div>
                    </motion.div>
                  )
                })}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Carrinho flutuante */}
      <AnimatePresence>
        {totalItems > 0 && (
          <motion.div
            initial={{ y: 100, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            exit={{ y: 100, opacity: 0 }}
            className="fixed bottom-6 left-4 right-4 max-w-3xl mx-auto z-50"
          >
            <Link href="/checkout">
              <button className="w-full h-14 bg-[#FF1F24] hover:bg-[#FF1F24]/90 text-white font-semibold rounded-2xl flex items-center px-5 shadow-2xl shadow-[#FF1F24]/30 transition-all active:scale-98">
                <span className="bg-white/20 rounded-xl w-7 h-7 flex items-center justify-center text-sm font-bold mr-3">
                  {totalItems}
                </span>
                <span>Ver carrinho</span>
                <ShoppingCart className="w-5 h-5 ml-2" />
                <span className="ml-auto font-bold">R$ {totalValue.toFixed(2)}</span>
              </button>
            </Link>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}
