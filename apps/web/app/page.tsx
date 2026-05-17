'use client'

import { useState } from 'react'
import { motion } from 'framer-motion'
import { Search, MapPin, Star, Clock, ChevronRight, Zap, ShoppingBag, Bike, Shield } from 'lucide-react'
import Link from 'next/link'

const categories = [
  { name: 'Hambúrgueres', emoji: '🍔' },
  { name: 'Pizzas', emoji: '🍕' },
  { name: 'Açaí', emoji: '🫐' },
  { name: 'Marmitas', emoji: '🥗' },
  { name: 'Japonesa', emoji: '🍣' },
  { name: 'Bebidas', emoji: '🥤' },
  { name: 'Tapioca', emoji: '🫓' },
  { name: 'Sorvetes', emoji: '🍦' },
]

const restaurants = [
  { id: '1', slug: 'burguer-house', name: 'Burguer House', category: 'Hambúrgueres', rating: 4.8, reviews: 342, deliveryTime: '25-35 min', deliveryFee: 5.00, minOrder: 25, isOpen: true, badge: 'Mais Pedido' },
  { id: '2', slug: 'pizza-palace', name: 'Pizza Palace', category: 'Pizzas', rating: 4.7, reviews: 218, deliveryTime: '30-45 min', deliveryFee: 0, minOrder: 40, isOpen: true, badge: 'Frete Grátis' },
  { id: '3', slug: 'acai-do-norte', name: 'Açaí do Norte', category: 'Açaí', rating: 4.9, reviews: 521, deliveryTime: '15-25 min', deliveryFee: 3.50, minOrder: 20, isOpen: true, badge: 'Mais Avaliado' },
  { id: '4', slug: 'marmita-fit', name: 'Marmita Fit', category: 'Marmitas', rating: 4.6, reviews: 189, deliveryTime: '20-30 min', deliveryFee: 4.00, minOrder: 30, isOpen: false, badge: null },
  { id: '5', slug: 'lanche-feliz', name: 'Lanche Feliz', category: 'Lanches', rating: 4.5, reviews: 267, deliveryTime: '20-35 min', deliveryFee: 6.00, minOrder: 20, isOpen: true, badge: null },
  { id: '6', slug: 'sushi-express', name: 'Sushi Express', category: 'Japonesa', rating: 4.8, reviews: 134, deliveryTime: '35-50 min', deliveryFee: 8.00, minOrder: 50, isOpen: true, badge: 'Novo' },
]

function RestaurantCard({ r, index }: { r: typeof restaurants[0]; index: number }) {
  const colors = ['from-orange-500', 'from-red-500', 'from-purple-600', 'from-green-600', 'from-yellow-500', 'from-blue-600']
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.06 }}
      whileHover={{ y: -4, transition: { duration: 0.15 } }}
    >
      <Link href={`/restaurante/${r.slug}`}>
        <div className={`relative rounded-2xl overflow-hidden bg-[#161616] border border-white/5 cursor-pointer group ${!r.isOpen && 'opacity-60'}`}>
          {/* Banner colorido */}
          <div className={`h-40 bg-gradient-to-br ${colors[index % colors.length]} to-black/60 flex items-center justify-center relative`}>
            <span className="text-5xl">{categories.find((c) => c.name === r.category)?.emoji ?? '🍽️'}</span>
            {r.badge && (
              <span className="absolute top-3 left-3 bg-[#FF1F24] text-white text-xs font-bold px-2.5 py-1 rounded-full">
                {r.badge}
              </span>
            )}
            {!r.isOpen && (
              <div className="absolute inset-0 bg-black/50 flex items-center justify-center">
                <span className="text-white font-semibold text-sm bg-black/70 px-4 py-1.5 rounded-full">Fechado</span>
              </div>
            )}
          </div>

          <div className="p-4">
            <h3 className="font-semibold text-white text-base group-hover:text-[#FF1F24] transition-colors">{r.name}</h3>
            <p className="text-xs text-gray-500 mt-0.5">{r.category}</p>

            <div className="flex items-center gap-3 mt-3 text-xs text-gray-400">
              <span className="flex items-center gap-1">
                <Star className="w-3.5 h-3.5 text-yellow-400 fill-yellow-400" />
                <span className="text-white font-medium">{r.rating}</span>
                <span>({r.reviews})</span>
              </span>
              <span className="flex items-center gap-1">
                <Clock className="w-3.5 h-3.5" />
                {r.deliveryTime}
              </span>
              <span className="ml-auto font-medium">
                {r.deliveryFee === 0 ? <span className="text-[#22C55E]">Grátis</span> : `R$ ${r.deliveryFee.toFixed(2)}`}
              </span>
            </div>
          </div>
        </div>
      </Link>
    </motion.div>
  )
}

export default function HomePage() {
  const [search, setSearch] = useState('')
  const [activeCategory, setActiveCategory] = useState<string | null>(null)

  const filtered = restaurants.filter((r) => {
    const matchSearch = search === '' || r.name.toLowerCase().includes(search.toLowerCase())
    const matchCat = activeCategory === null || r.category === activeCategory
    return matchSearch && matchCat
  })

  return (
    <div className="min-h-screen bg-[#0D0D0D]">
      {/* Header */}
      <header className="sticky top-0 z-50 bg-[#0D0D0D]/90 backdrop-blur-sm border-b border-white/5">
        <div className="max-w-6xl mx-auto px-4 h-16 flex items-center gap-4">
          <Link href="/" className="flex items-center gap-2 shrink-0">
            <div className="w-8 h-8 bg-[#FF1F24] rounded-lg flex items-center justify-center">
              <Zap className="w-4.5 h-4.5 text-white fill-white" />
            </div>
            <span className="font-bold text-lg tracking-tight">PEDIZI</span>
          </Link>

          <div className="flex items-center gap-1.5 text-sm text-gray-400 ml-4 hidden sm:flex">
            <MapPin className="w-3.5 h-3.5 text-[#FF1F24]" />
            <span>Franca, SP</span>
          </div>

          <div className="ml-auto flex items-center gap-3">
            <Link href="/login" className="text-sm text-gray-400 hover:text-white transition-colors">Entrar</Link>
            <Link href="/cadastro" className="h-8 px-4 bg-[#FF1F24] hover:bg-[#FF1F24]/90 text-white text-sm font-semibold rounded-xl transition-all active:scale-95">
              Cadastrar
            </Link>
          </div>
        </div>
      </header>

      {/* Hero */}
      <section className="relative overflow-hidden py-20 px-4">
        <div className="absolute inset-0">
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-[#FF1F24]/8 rounded-full blur-[100px]" />
        </div>

        <div className="relative max-w-3xl mx-auto text-center">
          <motion.h1
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-4xl sm:text-5xl md:text-6xl font-extrabold leading-tight tracking-tight"
          >
            O delivery da{' '}
            <span className="text-[#FF1F24]">sua cidade.</span>
          </motion.h1>
          <motion.p
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="mt-4 text-gray-400 text-lg max-w-xl mx-auto"
          >
            Peça dos melhores restaurantes locais. Rápido, seguro e com as melhores taxas.
          </motion.p>

          {/* Busca */}
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="relative mt-8 max-w-xl mx-auto"
          >
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-500" />
            <input
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Buscar restaurante ou prato..."
              className="w-full h-14 bg-[#161616] border border-white/10 rounded-2xl pl-12 pr-4 text-base text-white placeholder:text-gray-600 focus:outline-none focus:ring-2 focus:ring-[#FF1F24]/40 shadow-xl transition-all"
            />
          </motion.div>

          {/* Props */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.3 }}
            className="flex items-center justify-center gap-6 mt-8 text-xs text-gray-500"
          >
            {[
              { icon: ShoppingBag, text: 'Pedido em minutos' },
              { icon: Bike, text: 'Entrega rápida' },
              { icon: Shield, text: '100% seguro' },
            ].map((p) => (
              <span key={p.text} className="flex items-center gap-1.5">
                <p.icon className="w-3.5 h-3.5 text-[#FF1F24]" />
                {p.text}
              </span>
            ))}
          </motion.div>
        </div>
      </section>

      {/* Categorias */}
      <section className="px-4 max-w-6xl mx-auto">
        <div className="flex items-center gap-3 overflow-x-auto pb-2 scrollbar-none">
          <button
            onClick={() => setActiveCategory(null)}
            className={`flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-medium whitespace-nowrap transition-all shrink-0 ${activeCategory === null ? 'bg-[#FF1F24] text-white' : 'bg-[#161616] text-gray-400 border border-white/8 hover:text-white'}`}
          >
            Todos
          </button>
          {categories.map((c) => (
            <button
              key={c.name}
              onClick={() => setActiveCategory(activeCategory === c.name ? null : c.name)}
              className={`flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-medium whitespace-nowrap transition-all shrink-0 ${activeCategory === c.name ? 'bg-[#FF1F24] text-white' : 'bg-[#161616] text-gray-400 border border-white/8 hover:text-white'}`}
            >
              <span>{c.emoji}</span>
              {c.name}
            </button>
          ))}
        </div>
      </section>

      {/* Restaurantes */}
      <section className="px-4 max-w-6xl mx-auto py-8">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-xl font-bold text-white">
            {activeCategory ?? 'Restaurantes próximos'}
            <span className="text-sm text-gray-500 font-normal ml-2">({filtered.length})</span>
          </h2>
          <button className="flex items-center gap-1 text-sm text-gray-400 hover:text-white transition-colors">
            Ver todos <ChevronRight className="w-4 h-4" />
          </button>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {filtered.map((r, i) => (
            <RestaurantCard key={r.id} r={r} index={i} />
          ))}
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-white/5 py-8 mt-12 text-center text-xs text-gray-600">
        <div className="flex items-center justify-center gap-2 mb-2">
          <Zap className="w-3.5 h-3.5 text-[#FF1F24]" />
          <span className="font-bold text-gray-400">PEDIZI</span>
        </div>
        <p>O delivery da sua cidade © {new Date().getFullYear()}</p>
      </footer>
    </div>
  )
}
