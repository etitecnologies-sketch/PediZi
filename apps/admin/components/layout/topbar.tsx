'use client'

import { Bell, Search, RefreshCw } from 'lucide-react'
import { useState } from 'react'
import dayjs from 'dayjs'
import 'dayjs/locale/pt-br'
dayjs.locale('pt-br')

export function Topbar() {
  const [search, setSearch] = useState('')

  return (
    <header className="h-16 border-b border-white/5 bg-[#111111]/80 backdrop-blur-sm flex items-center gap-4 px-6 shrink-0">
      {/* Busca global */}
      <div className="relative flex-1 max-w-sm">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500" />
        <input
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="Buscar pedidos, restaurantes..."
          className="w-full h-9 bg-white/5 border border-white/8 rounded-xl pl-9 pr-4 text-sm text-white placeholder:text-gray-600 focus:outline-none focus:ring-1 focus:ring-[#FF1F24]/40 transition-all"
        />
      </div>

      <div className="ml-auto flex items-center gap-2">
        {/* Data e hora */}
        <span className="text-xs text-gray-500 hidden md:block">
          {dayjs().format('ddd, DD MMM YYYY')}
        </span>

        {/* Atualizar */}
        <button className="p-2 rounded-xl text-gray-500 hover:text-white hover:bg-white/5 transition-all">
          <RefreshCw className="w-4 h-4" />
        </button>

        {/* Notificações */}
        <button className="relative p-2 rounded-xl text-gray-500 hover:text-white hover:bg-white/5 transition-all">
          <Bell className="w-4 h-4" />
          <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-[#FF1F24] rounded-full" />
        </button>

        {/* Avatar */}
        <div className="w-8 h-8 bg-gradient-to-br from-[#FF1F24] to-orange-500 rounded-full flex items-center justify-center text-xs font-bold cursor-pointer">
          A
        </div>
      </div>
    </header>
  )
}
