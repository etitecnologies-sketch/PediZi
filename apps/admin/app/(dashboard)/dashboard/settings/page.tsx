'use client'

import { motion } from 'framer-motion'
import { Settings, Bell, Shield, CreditCard, Globe, Save } from 'lucide-react'
import { useState } from 'react'

export const dynamic = 'force-dynamic'

export default function SettingsPage() {
  const [platformName, setPlatformName] = useState('PEDIZI')
  const [commissionRate, setCommissionRate] = useState('12')
  const [deliveryFeeBase, setDeliveryFeeBase] = useState('3.50')
  const [minOrderValue, setMinOrderValue] = useState('15')
  const [emailNotif, setEmailNotif] = useState(true)
  const [smsNotif, setSmsNotif] = useState(false)
  const [maintenanceMode, setMaintenanceMode] = useState(false)
  const [saved, setSaved] = useState(false)

  function handleSave() {
    setSaved(true)
    setTimeout(() => setSaved(false), 2000)
  }

  const sections = [
    {
      icon: <Globe className="w-4 h-4" />,
      title: 'Configurações Gerais',
      color: '#FF1F24',
      content: (
        <div className="space-y-4">
          <div>
            <label className="text-xs text-gray-500 font-medium block mb-1.5">Nome da plataforma</label>
            <input
              value={platformName}
              onChange={(e) => setPlatformName(e.target.value)}
              className="w-full max-w-sm h-10 bg-[#0D0D0D] border border-white/10 rounded-xl px-3 text-sm text-white focus:outline-none focus:ring-1 focus:ring-[#FF1F24]/40 transition-all"
            />
          </div>
          <div className="flex items-center justify-between max-w-sm">
            <div>
              <p className="text-sm text-white font-medium">Modo manutenção</p>
              <p className="text-xs text-gray-500">Exibe página de manutenção para usuários</p>
            </div>
            <button
              onClick={() => setMaintenanceMode(!maintenanceMode)}
              className={`w-11 h-6 rounded-full transition-all relative ${maintenanceMode ? 'bg-[#FF1F24]' : 'bg-white/10'}`}
            >
              <span className={`absolute top-0.5 w-5 h-5 bg-white rounded-full shadow transition-all ${maintenanceMode ? 'left-5' : 'left-0.5'}`} />
            </button>
          </div>
        </div>
      ),
    },
    {
      icon: <CreditCard className="w-4 h-4" />,
      title: 'Taxas e Financeiro',
      color: '#22C55E',
      content: (
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          {[
            { label: 'Comissão da plataforma (%)', value: commissionRate, onChange: setCommissionRate, suffix: '%' },
            { label: 'Taxa de entrega base (R$)', value: deliveryFeeBase, onChange: setDeliveryFeeBase, suffix: 'R$' },
            { label: 'Pedido mínimo (R$)', value: minOrderValue, onChange: setMinOrderValue, suffix: 'R$' },
          ].map((field) => (
            <div key={field.label}>
              <label className="text-xs text-gray-500 font-medium block mb-1.5">{field.label}</label>
              <div className="relative">
                <input
                  value={field.value}
                  onChange={(e) => field.onChange(e.target.value)}
                  type="number"
                  className="w-full h-10 bg-[#0D0D0D] border border-white/10 rounded-xl px-3 text-sm text-white focus:outline-none focus:ring-1 focus:ring-[#FF1F24]/40 transition-all"
                />
              </div>
            </div>
          ))}
        </div>
      ),
    },
    {
      icon: <Bell className="w-4 h-4" />,
      title: 'Notificações',
      color: '#8B5CF6',
      content: (
        <div className="space-y-4">
          {[
            { label: 'Notificações por e-mail', desc: 'Receba alertas de novos pedidos e restaurantes por e-mail', value: emailNotif, onChange: setEmailNotif },
            { label: 'Notificações por SMS', desc: 'Receba alertas urgentes via SMS', value: smsNotif, onChange: setSmsNotif },
          ].map((notif) => (
            <div key={notif.label} className="flex items-center justify-between max-w-lg">
              <div>
                <p className="text-sm text-white font-medium">{notif.label}</p>
                <p className="text-xs text-gray-500">{notif.desc}</p>
              </div>
              <button
                onClick={() => notif.onChange(!notif.value)}
                className={`w-11 h-6 rounded-full transition-all relative shrink-0 ${notif.value ? 'bg-[#FF1F24]' : 'bg-white/10'}`}
              >
                <span className={`absolute top-0.5 w-5 h-5 bg-white rounded-full shadow transition-all ${notif.value ? 'left-5' : 'left-0.5'}`} />
              </button>
            </div>
          ))}
        </div>
      ),
    },
    {
      icon: <Shield className="w-4 h-4" />,
      title: 'Segurança',
      color: '#F59E0B',
      content: (
        <div className="space-y-3">
          <p className="text-sm text-gray-400">Configurações de segurança e acesso administrativo.</p>
          <div className="flex gap-3">
            <button className="h-9 px-4 bg-[#161616] border border-white/10 text-white text-sm rounded-xl hover:border-white/20 transition-all">
              Alterar senha
            </button>
            <button className="h-9 px-4 bg-[#161616] border border-white/10 text-white text-sm rounded-xl hover:border-white/20 transition-all">
              Gerenciar sessões
            </button>
          </div>
        </div>
      ),
    },
  ]

  return (
    <div className="space-y-6 max-w-4xl mx-auto">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-white">Configurações</h1>
          <p className="text-sm text-gray-500 mt-0.5">Gerencie as configurações da plataforma</p>
        </div>
        <Settings className="w-5 h-5 text-[#FF1F24]" />
      </div>

      <div className="space-y-4">
        {sections.map((section, i) => (
          <motion.div
            key={section.title}
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.08 }}
            className="bg-[#161616] border border-white/5 rounded-2xl overflow-hidden"
          >
            <div className="flex items-center gap-2.5 p-5 border-b border-white/5">
              <div className="w-7 h-7 rounded-lg flex items-center justify-center" style={{ backgroundColor: `${section.color}15`, color: section.color }}>
                {section.icon}
              </div>
              <h3 className="text-sm font-semibold text-white">{section.title}</h3>
            </div>
            <div className="p-5">{section.content}</div>
          </motion.div>
        ))}
      </div>

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
