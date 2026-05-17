'use client'

import { useEffect, useState } from 'react'
import { motion } from 'framer-motion'
import {
  MapPin, Clock, CheckCircle, ChefHat, Bike, Package, Phone, ArrowLeft,
} from 'lucide-react'
import Link from 'next/link'
import { useOrderTracking } from '@/hooks/use-order-tracking'
import { ordersApi } from '@/lib/api'

const STATUS_STEPS = [
  { key: 'PENDING',    label: 'Aguardando confirmação', icon: Clock },
  { key: 'CONFIRMED',  label: 'Pedido confirmado',      icon: CheckCircle },
  { key: 'PREPARING',  label: 'Preparando seu pedido',  icon: ChefHat },
  { key: 'READY',      label: 'Pronto para entrega',    icon: Package },
  { key: 'DELIVERING', label: 'Saiu para entrega!',     icon: Bike },
  { key: 'DELIVERED',  label: 'Entregue! 🎉',           icon: CheckCircle },
]

export default function TrackingPage({ params }: { params: { orderId: string } }) {
  const [order, setOrder] = useState<any>(null)
  const tracking = useOrderTracking(params.orderId)

  useEffect(() => {
    ordersApi.getById(params.orderId).then(setOrder).catch(() => {})
  }, [params.orderId])

  const currentStepIdx = STATUS_STEPS.findIndex((s) => s.key === (tracking.status || order?.status))
  const isDelivered = tracking.status === 'DELIVERED' || order?.status === 'DELIVERED'

  return (
    <div className="min-h-screen bg-[#0D0D0D]">
      {/* Header */}
      <header className="sticky top-0 z-50 bg-[#0D0D0D]/90 backdrop-blur-sm border-b border-white/5 px-4 h-16 flex items-center gap-3">
        <Link href="/historico" className="p-2 rounded-xl text-gray-400 hover:text-white transition-all">
          <ArrowLeft className="w-5 h-5" />
        </Link>
        <div>
          <h1 className="font-bold text-white">Rastreamento</h1>
          {order && <p className="text-xs text-gray-500">Pedido #{order.code}</p>}
        </div>
        <div className="ml-auto flex items-center gap-1.5 text-xs text-[#22C55E]">
          <span className="w-1.5 h-1.5 bg-[#22C55E] rounded-full animate-pulse" />
          Ao vivo
        </div>
      </header>

      <div className="max-w-lg mx-auto px-4 py-6 space-y-5">
        {/* Mapa (placeholder — em produção usar Google Maps ou Mapbox) */}
        <div className="relative bg-[#161616] border border-white/5 rounded-2xl overflow-hidden h-56 flex items-center justify-center">
          <div className="absolute inset-0 bg-gradient-to-br from-[#1a1a2e] to-[#161616]" />

          {tracking.courierLocation ? (
            <motion.div
              className="relative z-10 flex flex-col items-center gap-2"
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
            >
              <div className="w-12 h-12 bg-[#FF1F24] rounded-full flex items-center justify-center shadow-lg shadow-[#FF1F24]/40">
                <Bike className="w-6 h-6 text-white" />
              </div>
              <p className="text-xs text-gray-400">
                {tracking.courierLocation.latitude.toFixed(4)}, {tracking.courierLocation.longitude.toFixed(4)}
              </p>
            </motion.div>
          ) : (
            <div className="relative z-10 text-center">
              <MapPin className="w-8 h-8 text-gray-600 mx-auto mb-2" />
              <p className="text-xs text-gray-500">
                {currentStepIdx < 4 ? 'Entregador ainda não saiu' : 'Acompanhe aqui'}
              </p>
            </div>
          )}

          {/* Grade decorativa */}
          <div className="absolute inset-0 opacity-10" style={{ backgroundImage: 'linear-gradient(rgba(255,255,255,.1) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,.1) 1px, transparent 1px)', backgroundSize: '32px 32px' }} />
        </div>

        {/* Status steps */}
        <div className="bg-[#161616] border border-white/5 rounded-2xl p-5 space-y-0">
          {STATUS_STEPS.map((step, i) => {
            const isDone = i < currentStepIdx
            const isCurrent = i === currentStepIdx
            const isLast = i === STATUS_STEPS.length - 1

            return (
              <div key={step.key} className="flex gap-4">
                <div className="flex flex-col items-center">
                  <motion.div
                    animate={isCurrent ? { scale: [1, 1.15, 1] } : {}}
                    transition={{ repeat: Infinity, duration: 2 }}
                    className={`w-8 h-8 rounded-full flex items-center justify-center shrink-0 ${
                      isDone || isCurrent ? 'bg-[#FF1F24]' : 'bg-white/5'
                    }`}
                  >
                    <step.icon className={`w-4 h-4 ${isDone || isCurrent ? 'text-white' : 'text-gray-600'}`} />
                  </motion.div>
                  {!isLast && (
                    <div className={`w-0.5 h-8 mt-0.5 transition-colors ${isDone ? 'bg-[#FF1F24]' : 'bg-white/5'}`} />
                  )}
                </div>

                <div className="pb-5 pt-1.5 flex-1">
                  <p className={`text-sm font-medium ${isCurrent ? 'text-white' : isDone ? 'text-gray-400' : 'text-gray-600'}`}>
                    {step.label}
                  </p>
                  {isCurrent && (
                    <motion.p
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      className="text-xs text-[#FF1F24] mt-0.5"
                    >
                      Atualizado agora
                    </motion.p>
                  )}
                </div>
              </div>
            )
          })}
        </div>

        {/* Info pedido */}
        {order && (
          <div className="bg-[#161616] border border-white/5 rounded-2xl p-5 space-y-3">
            <h3 className="font-semibold text-white text-sm">Detalhes do pedido</h3>
            <div className="space-y-2">
              {order.items?.map((item: any) => (
                <div key={item.id} className="flex justify-between text-sm">
                  <span className="text-gray-400">{item.quantity}x {item.name}</span>
                  <span className="text-white">R$ {(item.price * item.quantity).toFixed(2)}</span>
                </div>
              ))}
            </div>
            <div className="border-t border-white/5 pt-3 flex justify-between font-bold text-white">
              <span>Total</span>
              <span>R$ {order.total?.toFixed(2)}</span>
            </div>
          </div>
        )}

        {/* Entregou? Avalie! */}
        {isDelivered && (
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-[#22C55E]/10 border border-[#22C55E]/20 rounded-2xl p-5 text-center"
          >
            <p className="text-[#22C55E] font-semibold mb-3">Pedido entregue! Como foi?</p>
            <Link href={`/avaliar/${params.orderId}`}>
              <button className="h-10 px-6 bg-[#22C55E] text-white font-semibold rounded-xl hover:bg-[#22C55E]/90 transition-all">
                Avaliar pedido
              </button>
            </Link>
          </motion.div>
        )}
      </div>
    </div>
  )
}
