'use client'

import { useState } from 'react'
import { motion } from 'framer-motion'
import { Zap, Star, ArrowLeft, CheckCircle } from 'lucide-react'
import Link from 'next/link'

export default function AvaliarPage({ params }: { params: { orderId: string } }) {
  const [foodRating, setFoodRating] = useState(0)
  const [deliveryRating, setDeliveryRating] = useState(0)
  const [comment, setComment] = useState('')
  const [submitted, setSubmitted] = useState(false)
  const [loading, setLoading] = useState(false)

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    if (foodRating === 0 || deliveryRating === 0) return
    setLoading(true)
    await new Promise((r) => setTimeout(r, 1000))
    setLoading(false)
    setSubmitted(true)
  }

  if (submitted) {
    return (
      <div className="min-h-screen bg-[#0D0D0D] flex items-center justify-center px-4">
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          className="text-center max-w-sm"
        >
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ delay: 0.1, type: 'spring', stiffness: 200 }}
            className="w-20 h-20 bg-[#22C55E]/15 rounded-full flex items-center justify-center mx-auto mb-4"
          >
            <CheckCircle className="w-10 h-10 text-[#22C55E]" />
          </motion.div>
          <h2 className="text-2xl font-bold text-white">Obrigado!</h2>
          <p className="text-gray-400 mt-2">Sua avaliação ajuda outros clientes e melhora a qualidade do serviço.</p>
          <Link href="/historico">
            <button className="mt-8 h-12 px-8 bg-[#FF1F24] text-white font-semibold rounded-xl transition-all active:scale-95 hover:bg-[#FF1F24]/90">
              Ver meus pedidos
            </button>
          </Link>
        </motion.div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-[#0D0D0D]">
      <header className="sticky top-0 z-50 bg-[#0D0D0D]/90 backdrop-blur-sm border-b border-white/5">
        <div className="max-w-lg mx-auto px-4 h-16 flex items-center gap-3">
          <Link href="/historico" className="p-2 rounded-xl text-gray-400 hover:text-white transition-all">
            <ArrowLeft className="w-5 h-5" />
          </Link>
          <div className="flex items-center gap-2">
            <div className="w-7 h-7 bg-[#FF1F24] rounded-lg flex items-center justify-center">
              <Zap className="w-4 h-4 text-white fill-white" />
            </div>
            <h1 className="font-bold text-white">Avaliar pedido</h1>
          </div>
        </div>
      </header>

      <div className="max-w-lg mx-auto px-4 py-8">
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          className="space-y-5"
        >
          <div className="text-center pb-2">
            <p className="text-sm text-gray-500">Pedido #{params.orderId}</p>
            <h2 className="text-xl font-bold text-white mt-1">Como foi sua experiência?</h2>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            {/* Avaliação da comida */}
            <div className="bg-[#161616] border border-white/5 rounded-2xl p-5">
              <h3 className="text-sm font-semibold text-white mb-1">Qualidade da comida</h3>
              <p className="text-xs text-gray-500 mb-4">Como estava a comida?</p>
              <div className="flex gap-2">
                {[1, 2, 3, 4, 5].map((star) => (
                  <button
                    key={star}
                    type="button"
                    onClick={() => setFoodRating(star)}
                    className="transition-transform active:scale-90"
                  >
                    <Star
                      className={`w-9 h-9 transition-colors ${star <= foodRating ? 'text-yellow-400 fill-yellow-400' : 'text-gray-600'}`}
                    />
                  </button>
                ))}
              </div>
              {foodRating > 0 && (
                <motion.p
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  className="text-xs text-gray-500 mt-2"
                >
                  {['', 'Muito ruim', 'Ruim', 'Regular', 'Bom', 'Excelente!'][foodRating]}
                </motion.p>
              )}
            </div>

            {/* Avaliação da entrega */}
            <div className="bg-[#161616] border border-white/5 rounded-2xl p-5">
              <h3 className="text-sm font-semibold text-white mb-1">Entrega</h3>
              <p className="text-xs text-gray-500 mb-4">Como foi a entrega?</p>
              <div className="flex gap-2">
                {[1, 2, 3, 4, 5].map((star) => (
                  <button
                    key={star}
                    type="button"
                    onClick={() => setDeliveryRating(star)}
                    className="transition-transform active:scale-90"
                  >
                    <Star
                      className={`w-9 h-9 transition-colors ${star <= deliveryRating ? 'text-yellow-400 fill-yellow-400' : 'text-gray-600'}`}
                    />
                  </button>
                ))}
              </div>
              {deliveryRating > 0 && (
                <motion.p
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  className="text-xs text-gray-500 mt-2"
                >
                  {['', 'Muito ruim', 'Ruim', 'Regular', 'Boa', 'Excelente!'][deliveryRating]}
                </motion.p>
              )}
            </div>

            {/* Comentário */}
            <div className="bg-[#161616] border border-white/5 rounded-2xl p-5">
              <h3 className="text-sm font-semibold text-white mb-1">Comentário <span className="text-gray-500 font-normal">(opcional)</span></h3>
              <p className="text-xs text-gray-500 mb-3">Conta mais sobre sua experiência</p>
              <textarea
                value={comment}
                onChange={(e) => setComment(e.target.value)}
                placeholder="Ex: Comida chegou quente, embalagem boa, entregador educado..."
                rows={3}
                className="w-full bg-[#0D0D0D] border border-white/10 rounded-xl px-3 py-2.5 text-sm text-white placeholder:text-gray-600 focus:outline-none focus:ring-2 focus:ring-[#FF1F24]/40 transition-all resize-none"
              />
            </div>

            <button
              type="submit"
              disabled={loading || foodRating === 0 || deliveryRating === 0}
              className="w-full h-12 bg-[#FF1F24] hover:bg-[#FF1F24]/90 disabled:opacity-40 disabled:cursor-not-allowed text-white font-semibold rounded-xl transition-all active:scale-95"
            >
              {loading ? 'Enviando...' : 'Enviar avaliação'}
            </button>

            {(foodRating === 0 || deliveryRating === 0) && (
              <p className="text-center text-xs text-gray-600">Avalie a comida e a entrega para continuar</p>
            )}
          </form>
        </motion.div>
      </div>
    </div>
  )
}
