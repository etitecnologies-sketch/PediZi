'use client'

import { motion } from 'framer-motion'
import { Settings, Clock, MapPin, Phone, Save, Bell } from 'lucide-react'
import { useState } from 'react'

export const dynamic = 'force-dynamic'

const DAYS = ['Segunda', 'Terça', 'Quarta', 'Quinta', 'Sexta', 'Sábado', 'Domingo']

export default function ConfiguracoesPage() {
  const [restaurantName, setRestaurantName] = useState('Burguer House')
  const [phone, setPhone] = useState('(16) 99999-0001')
  const [address, setAddress] = useState('Rua das Flores, 123 - Centro, Franca - SP')
  const [deliveryTime, setDeliveryTime] = useState('25-35')
  const [minOrder, setMinOrder] = useState('25')
  const [deliveryFee, setDeliveryFee] = useState('5.00')
  const [openDays, setOpenDays] = useState([true, true, true, true, true, true, true])
  const [openTime, setOpenTime] = useState('11:00')
  const [closeTime, setCloseTime] = useState('23:00')
  const [orderNotif, setOrderNotif] = useState(true)
  const [saved, setSaved] = useState(false)

  function toggleDay(i: number) {
    setOpenDays((prev) => prev.map((d, idx) => idx === i ? !d : d))
  }

  function handleSave() {
    setSaved(true)
    setTimeout(() => setSaved(false), 2000)
  }

  return (
    <div className="space-y-6 max-w-2xl mx-auto">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-white">Configurações</h1>
          <p className="text-sm text-gray-500 mt-0.5">Informações e preferências do seu restaurante</p>
        </div>
        <Settings className="w-5 h-5 text-[#FF1F24]" />
      </div>

      {/* Informações básicas */}
      <motion.div
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-[#161616] border border-white/5 rounded-2xl overflow-hidden"
      >
        <div className="flex items-center gap-2.5 p-5 border-b border-white/5">
          <div className="w-7 h-7 rounded-lg bg-[#FF1F24]/15 flex items-center justify-center">
            <Settings className="w-4 h-4 text-[#FF1F24]" />
          </div>
          <h3 className="text-sm font-semibold text-white">Informações do restaurante</h3>
        </div>
        <div className="p-5 space-y-4">
          <div>
            <label className="text-xs text-gray-500 font-medium block mb-1.5">Nome do restaurante</label>
            <input
              value={restaurantName}
              onChange={(e) => setRestaurantName(e.target.value)}
              className="w-full h-10 bg-[#0D0D0D] border border-white/10 rounded-xl px-3 text-sm text-white focus:outline-none focus:ring-1 focus:ring-[#FF1F24]/40 transition-all"
            />
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="text-xs text-gray-500 font-medium block mb-1.5">
                <span className="flex items-center gap-1"><Phone className="w-3 h-3" /> Telefone</span>
              </label>
              <input
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                className="w-full h-10 bg-[#0D0D0D] border border-white/10 rounded-xl px-3 text-sm text-white focus:outline-none focus:ring-1 focus:ring-[#FF1F24]/40 transition-all"
              />
            </div>
            <div>
              <label className="text-xs text-gray-500 font-medium block mb-1.5">
                <span className="flex items-center gap-1"><MapPin className="w-3 h-3" /> Cidade</span>
              </label>
              <input
                value="Franca - SP"
                readOnly
                className="w-full h-10 bg-[#0D0D0D] border border-white/10 rounded-xl px-3 text-sm text-gray-500 cursor-not-allowed"
              />
            </div>
          </div>
          <div>
            <label className="text-xs text-gray-500 font-medium block mb-1.5">Endereço completo</label>
            <input
              value={address}
              onChange={(e) => setAddress(e.target.value)}
              className="w-full h-10 bg-[#0D0D0D] border border-white/10 rounded-xl px-3 text-sm text-white focus:outline-none focus:ring-1 focus:ring-[#FF1F24]/40 transition-all"
            />
          </div>
        </div>
      </motion.div>

      {/* Entrega */}
      <motion.div
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.08 }}
        className="bg-[#161616] border border-white/5 rounded-2xl overflow-hidden"
      >
        <div className="flex items-center gap-2.5 p-5 border-b border-white/5">
          <div className="w-7 h-7 rounded-lg bg-[#22C55E]/15 flex items-center justify-center">
            <MapPin className="w-4 h-4 text-[#22C55E]" />
          </div>
          <h3 className="text-sm font-semibold text-white">Entrega</h3>
        </div>
        <div className="p-5 grid grid-cols-3 gap-4">
          {[
            { label: 'Tempo estimado (min)', value: deliveryTime, onChange: setDeliveryTime, placeholder: '25-35' },
            { label: 'Pedido mínimo (R$)', value: minOrder, onChange: setMinOrder, placeholder: '25' },
            { label: 'Taxa de entrega (R$)', value: deliveryFee, onChange: setDeliveryFee, placeholder: '5.00' },
          ].map((field) => (
            <div key={field.label}>
              <label className="text-xs text-gray-500 font-medium block mb-1.5">{field.label}</label>
              <input
                value={field.value}
                onChange={(e) => field.onChange(e.target.value)}
                placeholder={field.placeholder}
                className="w-full h-10 bg-[#0D0D0D] border border-white/10 rounded-xl px-3 text-sm text-white focus:outline-none focus:ring-1 focus:ring-[#FF1F24]/40 transition-all"
              />
            </div>
          ))}
        </div>
      </motion.div>

      {/* Horários */}
      <motion.div
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.16 }}
        className="bg-[#161616] border border-white/5 rounded-2xl overflow-hidden"
      >
        <div className="flex items-center gap-2.5 p-5 border-b border-white/5">
          <div className="w-7 h-7 rounded-lg bg-[#8B5CF6]/15 flex items-center justify-center">
            <Clock className="w-4 h-4 text-[#8B5CF6]" />
          </div>
          <h3 className="text-sm font-semibold text-white">Horário de funcionamento</h3>
        </div>
        <div className="p-5 space-y-4">
          <div className="flex flex-wrap gap-2">
            {DAYS.map((day, i) => (
              <button
                key={day}
                onClick={() => toggleDay(i)}
                className={`px-3 py-1.5 rounded-xl text-xs font-medium transition-all ${openDays[i] ? 'bg-[#FF1F24] text-white' : 'bg-[#0D0D0D] border border-white/10 text-gray-500'}`}
              >
                {day.slice(0, 3)}
              </button>
            ))}
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="text-xs text-gray-500 font-medium block mb-1.5">Abre às</label>
              <input
                type="time"
                value={openTime}
                onChange={(e) => setOpenTime(e.target.value)}
                className="w-full h-10 bg-[#0D0D0D] border border-white/10 rounded-xl px-3 text-sm text-white focus:outline-none focus:ring-1 focus:ring-[#FF1F24]/40 transition-all"
              />
            </div>
            <div>
              <label className="text-xs text-gray-500 font-medium block mb-1.5">Fecha às</label>
              <input
                type="time"
                value={closeTime}
                onChange={(e) => setCloseTime(e.target.value)}
                className="w-full h-10 bg-[#0D0D0D] border border-white/10 rounded-xl px-3 text-sm text-white focus:outline-none focus:ring-1 focus:ring-[#FF1F24]/40 transition-all"
              />
            </div>
          </div>
        </div>
      </motion.div>

      {/* Notificações */}
      <motion.div
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.24 }}
        className="bg-[#161616] border border-white/5 rounded-2xl overflow-hidden"
      >
        <div className="flex items-center gap-2.5 p-5 border-b border-white/5">
          <div className="w-7 h-7 rounded-lg bg-[#F59E0B]/15 flex items-center justify-center">
            <Bell className="w-4 h-4 text-[#F59E0B]" />
          </div>
          <h3 className="text-sm font-semibold text-white">Notificações</h3>
        </div>
        <div className="p-5">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-white font-medium">Novos pedidos</p>
              <p className="text-xs text-gray-500">Receber alerta sonoro ao chegar um pedido novo</p>
            </div>
            <button
              onClick={() => setOrderNotif(!orderNotif)}
              className={`w-11 h-6 rounded-full transition-all relative ${orderNotif ? 'bg-[#FF1F24]' : 'bg-white/10'}`}
            >
              <span className={`absolute top-0.5 w-5 h-5 bg-white rounded-full shadow transition-all ${orderNotif ? 'left-5' : 'left-0.5'}`} />
            </button>
          </div>
        </div>
      </motion.div>

      <div className="flex justify-end">
        <button
          onClick={handleSave}
          className={`flex items-center gap-2 h-10 px-6 rounded-xl text-sm font-semibold transition-all active:scale-95 ${saved ? 'bg-[#22C55E] text-white' : 'bg-[#FF1F24] hover:bg-[#FF1F24]/90 text-white'}`}
        >
          <Save className="w-4 h-4" />
          {saved ? 'Salvo!' : 'Salvar alterações'}
        </button>
      </div>
    </div>
  )
}
