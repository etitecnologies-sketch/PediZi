'use client'

import { useState } from 'react'
import { motion } from 'framer-motion'
import { ArrowLeft, MapPin, CreditCard, Smartphone, Wallet, CheckCircle } from 'lucide-react'
import Link from 'next/link'

const cartItems = [
  { name: 'Classic Burguer', qty: 2, price: 32.90 },
  { name: 'Refrigerante Lata', qty: 2, price: 6.00 },
]

const subtotal = cartItems.reduce((s, i) => s + i.price * i.qty, 0)
const deliveryFee = 5.00
const discount = 0
const total = subtotal + deliveryFee - discount

const paymentMethods = [
  { id: 'PIX', label: 'PIX', icon: Smartphone, description: 'Aprovação instantânea' },
  { id: 'CREDIT_CARD', label: 'Cartão de Crédito', icon: CreditCard, description: 'Até 12x sem juros' },
  { id: 'CASH', label: 'Dinheiro', icon: Wallet, description: 'Pague na entrega' },
]

export default function CheckoutPage() {
  const [payment, setPayment] = useState('PIX')
  const [coupon, setCoupon] = useState('')
  const [loading, setLoading] = useState(false)
  const [success, setSuccess] = useState(false)

  async function handleOrder() {
    setLoading(true)
    await new Promise((r) => setTimeout(r, 2000))
    setSuccess(true)
    setLoading(false)
  }

  if (success) {
    return (
      <div className="min-h-screen bg-[#0D0D0D] flex items-center justify-center px-4">
        <motion.div
          initial={{ scale: 0.8, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          className="text-center max-w-sm"
        >
          <div className="w-20 h-20 bg-[#22C55E]/15 rounded-full flex items-center justify-center mx-auto mb-6">
            <CheckCircle className="w-10 h-10 text-[#22C55E]" />
          </div>
          <h2 className="text-2xl font-bold text-white">Pedido realizado!</h2>
          <p className="text-gray-400 mt-2">Seu pedido foi confirmado e está sendo preparado.</p>
          <p className="text-[#FF1F24] font-bold text-lg mt-4">Tempo estimado: 30-40 min</p>
          <Link href="/">
            <button className="mt-8 w-full h-12 bg-[#FF1F24] text-white font-semibold rounded-xl hover:bg-[#FF1F24]/90 transition-all">
              Acompanhar pedido
            </button>
          </Link>
        </motion.div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-[#0D0D0D]">
      <header className="sticky top-0 z-50 bg-[#0D0D0D]/90 backdrop-blur-sm border-b border-white/5 px-4 h-16 flex items-center gap-3">
        <Link href="javascript:history.back()" className="p-2 rounded-xl text-gray-400 hover:text-white hover:bg-white/5 transition-all">
          <ArrowLeft className="w-5 h-5" />
        </Link>
        <h1 className="font-bold text-white">Finalizar Pedido</h1>
      </header>

      <div className="max-w-xl mx-auto px-4 py-6 space-y-4">
        {/* Endereço */}
        <div className="bg-[#161616] border border-white/5 rounded-2xl p-5">
          <div className="flex items-center gap-2 mb-3">
            <MapPin className="w-4 h-4 text-[#FF1F24]" />
            <h3 className="font-semibold text-white text-sm">Endereço de entrega</h3>
          </div>
          <p className="text-gray-300 text-sm">Rua das Flores, 123 — Centro</p>
          <p className="text-gray-500 text-xs mt-0.5">Franca - SP, 14400-000</p>
          <button className="text-[#FF1F24] text-xs font-medium mt-3 hover:underline">Trocar endereço</button>
        </div>

        {/* Resumo */}
        <div className="bg-[#161616] border border-white/5 rounded-2xl p-5">
          <h3 className="font-semibold text-white text-sm mb-4">Resumo do pedido</h3>
          <div className="space-y-3">
            {cartItems.map((item) => (
              <div key={item.name} className="flex items-center justify-between text-sm">
                <span className="text-gray-300">{item.qty}x {item.name}</span>
                <span className="text-white font-medium">R$ {(item.price * item.qty).toFixed(2)}</span>
              </div>
            ))}
          </div>

          <div className="border-t border-white/5 mt-4 pt-4 space-y-2 text-sm">
            <div className="flex justify-between text-gray-400">
              <span>Subtotal</span>
              <span>R$ {subtotal.toFixed(2)}</span>
            </div>
            <div className="flex justify-between text-gray-400">
              <span>Taxa de entrega</span>
              <span>R$ {deliveryFee.toFixed(2)}</span>
            </div>
            {discount > 0 && (
              <div className="flex justify-between text-[#22C55E]">
                <span>Desconto</span>
                <span>-R$ {discount.toFixed(2)}</span>
              </div>
            )}
            <div className="flex justify-between font-bold text-white text-base pt-1">
              <span>Total</span>
              <span>R$ {total.toFixed(2)}</span>
            </div>
          </div>
        </div>

        {/* Cupom */}
        <div className="bg-[#161616] border border-white/5 rounded-2xl p-5">
          <h3 className="font-semibold text-white text-sm mb-3">Cupom de desconto</h3>
          <div className="flex gap-2">
            <input
              value={coupon}
              onChange={(e) => setCoupon(e.target.value.toUpperCase())}
              placeholder="PEDIZI10"
              className="flex-1 h-10 bg-white/5 border border-white/10 rounded-xl px-3 text-sm text-white placeholder:text-gray-600 focus:outline-none focus:ring-1 focus:ring-[#FF1F24]/40"
            />
            <button className="px-4 h-10 bg-white/5 border border-white/10 rounded-xl text-sm text-gray-300 hover:border-[#FF1F24]/50 hover:text-[#FF1F24] transition-all">
              Aplicar
            </button>
          </div>
        </div>

        {/* Pagamento */}
        <div className="bg-[#161616] border border-white/5 rounded-2xl p-5">
          <h3 className="font-semibold text-white text-sm mb-4">Forma de pagamento</h3>
          <div className="space-y-2">
            {paymentMethods.map((m) => (
              <button
                key={m.id}
                onClick={() => setPayment(m.id)}
                className={`w-full flex items-center gap-3 p-3.5 rounded-xl border transition-all ${payment === m.id ? 'border-[#FF1F24]/50 bg-[#FF1F24]/5' : 'border-white/8 hover:border-white/20'}`}
              >
                <div className={`w-9 h-9 rounded-xl flex items-center justify-center ${payment === m.id ? 'bg-[#FF1F24]/15' : 'bg-white/5'}`}>
                  <m.icon className={`w-4.5 h-4.5 ${payment === m.id ? 'text-[#FF1F24]' : 'text-gray-400'}`} />
                </div>
                <div className="text-left">
                  <p className={`text-sm font-medium ${payment === m.id ? 'text-white' : 'text-gray-300'}`}>{m.label}</p>
                  <p className="text-xs text-gray-500">{m.description}</p>
                </div>
                <div className={`ml-auto w-4 h-4 rounded-full border-2 flex items-center justify-center ${payment === m.id ? 'border-[#FF1F24]' : 'border-gray-600'}`}>
                  {payment === m.id && <div className="w-2 h-2 bg-[#FF1F24] rounded-full" />}
                </div>
              </button>
            ))}
          </div>
        </div>

        {/* Botão confirmar */}
        <button
          onClick={handleOrder}
          disabled={loading}
          className="w-full h-14 bg-[#FF1F24] hover:bg-[#FF1F24]/90 text-white font-bold rounded-2xl transition-all active:scale-98 disabled:opacity-60 shadow-lg shadow-[#FF1F24]/20 flex items-center justify-center gap-2"
        >
          {loading ? (
            <>
              <svg className="animate-spin h-5 w-5" viewBox="0 0 24 24" fill="none">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
              </svg>
              Processando...
            </>
          ) : (
            `Confirmar pedido • R$ ${total.toFixed(2)}`
          )}
        </button>
      </div>
    </div>
  )
}
