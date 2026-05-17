'use client'

import { motion } from 'framer-motion'
import { MapPin, Clock, Bike } from 'lucide-react'

const deliveries = [
  { id: 'PD1A2B3C', courier: 'Rodrigo M.', from: 'Burguer House', to: 'Rua das Flores, 123', eta: '8 min', status: 'Em rota' },
  { id: 'PD7G8H9I', courier: 'Lucas S.', from: 'Pizza Palace', to: 'Av. Central, 456', eta: '14 min', status: 'Coletando' },
  { id: 'PDXYZ123', courier: 'Felipe R.', from: 'Açaí do Norte', to: 'Rua Verde, 789', eta: '5 min', status: 'Em rota' },
]

export function ActiveDeliveries() {
  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.45 }}
      className="bg-[#161616] border border-white/5 rounded-2xl p-6"
    >
      <div className="flex items-center gap-2 mb-5">
        <Bike className="w-4 h-4 text-[#FF1F24]" />
        <h3 className="text-sm font-semibold text-white">Entregas Ativas</h3>
        <span className="ml-auto text-xs bg-[#FF1F24]/10 text-[#FF1F24] px-2 py-0.5 rounded-full font-medium">
          {deliveries.length} em andamento
        </span>
      </div>

      <div className="space-y-3">
        {deliveries.map((d, i) => (
          <motion.div
            key={d.id}
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5 + i * 0.08 }}
            className="p-3.5 rounded-xl bg-white/[0.02] border border-white/5 hover:border-white/10 transition-all"
          >
            <div className="flex items-center justify-between mb-2.5">
              <div className="flex items-center gap-2">
                <div className="w-7 h-7 bg-[#FF1F24]/15 rounded-full flex items-center justify-center">
                  <Bike className="w-3.5 h-3.5 text-[#FF1F24]" />
                </div>
                <div>
                  <p className="text-xs font-semibold text-white">{d.courier}</p>
                  <p className="text-[10px] text-gray-500">{d.status}</p>
                </div>
              </div>
              <div className="flex items-center gap-1 text-[#22C55E]">
                <Clock className="w-3 h-3" />
                <span className="text-xs font-semibold">{d.eta}</span>
              </div>
            </div>

            <div className="space-y-1.5 pl-2 border-l border-white/8">
              <div className="flex items-start gap-2">
                <div className="w-1.5 h-1.5 bg-[#FF1F24] rounded-full mt-1 shrink-0" />
                <p className="text-xs text-gray-400">{d.from}</p>
              </div>
              <div className="flex items-start gap-2">
                <MapPin className="w-3 h-3 text-[#22C55E] shrink-0 mt-0.5" />
                <p className="text-xs text-gray-300">{d.to}</p>
              </div>
            </div>
          </motion.div>
        ))}
      </div>
    </motion.div>
  )
}
