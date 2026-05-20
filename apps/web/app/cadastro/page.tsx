'use client'

import { useState } from 'react'
import { motion } from 'framer-motion'
import { Zap, Mail, Lock, Eye, EyeOff, User, Phone, ArrowLeft } from 'lucide-react'
import Link from 'next/link'

export default function CadastroPage() {
  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [phone, setPhone] = useState('')
  const [password, setPassword] = useState('')
  const [showPassword, setShowPassword] = useState(false)
  const [loading, setLoading] = useState(false)

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setLoading(true)
    await new Promise((r) => setTimeout(r, 1200))
    setLoading(false)
  }

  return (
    <div className="min-h-screen bg-[#0D0D0D] flex flex-col">
      <header className="px-6 py-5">
        <Link href="/" className="inline-flex items-center gap-2 text-gray-400 hover:text-white transition-colors text-sm">
          <ArrowLeft className="w-4 h-4" />
          Voltar
        </Link>
      </header>

      <div className="flex-1 flex items-center justify-center px-4 pb-12">
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          className="w-full max-w-sm"
        >
          <div className="text-center mb-8">
            <Link href="/" className="inline-flex items-center gap-2 mb-6">
              <div className="w-10 h-10 bg-[#FF1F24] rounded-xl flex items-center justify-center">
                <Zap className="w-5 h-5 text-white fill-white" />
              </div>
              <span className="font-bold text-xl tracking-tight">PEDIZI</span>
            </Link>
            <h1 className="text-2xl font-bold text-white">Crie sua conta</h1>
            <p className="text-gray-500 text-sm mt-1">Peça nos melhores restaurantes da cidade</p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="text-xs text-gray-500 font-medium block mb-1.5">Nome completo</label>
              <div className="relative">
                <User className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500" />
                <input
                  type="text"
                  required
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="Seu nome"
                  className="w-full h-12 bg-[#161616] border border-white/10 rounded-xl pl-10 pr-4 text-sm text-white placeholder:text-gray-600 focus:outline-none focus:ring-2 focus:ring-[#FF1F24]/40 transition-all"
                />
              </div>
            </div>

            <div>
              <label className="text-xs text-gray-500 font-medium block mb-1.5">E-mail</label>
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500" />
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="seu@email.com"
                  className="w-full h-12 bg-[#161616] border border-white/10 rounded-xl pl-10 pr-4 text-sm text-white placeholder:text-gray-600 focus:outline-none focus:ring-2 focus:ring-[#FF1F24]/40 transition-all"
                />
              </div>
            </div>

            <div>
              <label className="text-xs text-gray-500 font-medium block mb-1.5">Telefone</label>
              <div className="relative">
                <Phone className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500" />
                <input
                  type="tel"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  placeholder="(00) 00000-0000"
                  className="w-full h-12 bg-[#161616] border border-white/10 rounded-xl pl-10 pr-4 text-sm text-white placeholder:text-gray-600 focus:outline-none focus:ring-2 focus:ring-[#FF1F24]/40 transition-all"
                />
              </div>
            </div>

            <div>
              <label className="text-xs text-gray-500 font-medium block mb-1.5">Senha</label>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500" />
                <input
                  type={showPassword ? 'text' : 'password'}
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Mínimo 6 caracteres"
                  minLength={6}
                  className="w-full h-12 bg-[#161616] border border-white/10 rounded-xl pl-10 pr-11 text-sm text-white placeholder:text-gray-600 focus:outline-none focus:ring-2 focus:ring-[#FF1F24]/40 transition-all"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-white transition-colors"
                >
                  {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full h-12 bg-[#FF1F24] hover:bg-[#FF1F24]/90 disabled:opacity-60 disabled:cursor-not-allowed text-white font-semibold rounded-xl transition-all active:scale-95 mt-2"
            >
              {loading ? 'Criando conta...' : 'Criar conta grátis'}
            </button>

            <p className="text-center text-xs text-gray-600">
              Ao criar uma conta você concorda com os{' '}
              <span className="text-gray-400 hover:text-white cursor-pointer transition-colors">Termos de Uso</span>
              {' '}e a{' '}
              <span className="text-gray-400 hover:text-white cursor-pointer transition-colors">Política de Privacidade</span>
            </p>
          </form>

          <p className="text-center text-sm text-gray-500 mt-6">
            Já tem uma conta?{' '}
            <Link href="/login" className="text-white font-medium hover:text-[#FF1F24] transition-colors">
              Entrar
            </Link>
          </p>
        </motion.div>
      </div>
    </div>
  )
}
