'use client'

import { motion } from 'framer-motion'
import { TrendingUp, TrendingDown, Minus } from 'lucide-react'
import { cn, formatCurrency, formatNumber, formatPercent } from '@/lib/utils'

interface KpiCardProps {
  title: string
  value: number
  format?: 'currency' | 'number' | 'raw'
  suffix?: string
  change?: number
  icon: React.ReactNode
  color?: string
  index?: number
}

export function KpiCard({
  title,
  value,
  format = 'number',
  suffix,
  change,
  icon,
  color = '#FF1F24',
  index = 0,
}: KpiCardProps) {
  const displayValue =
    format === 'currency'
      ? formatCurrency(value)
      : format === 'number'
        ? formatNumber(value)
        : String(value)

  const trend = change === undefined ? null : change > 0 ? 'up' : change < 0 ? 'down' : 'neutral'

  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, delay: index * 0.07 }}
      whileHover={{ y: -2, transition: { duration: 0.15 } }}
      className="relative bg-[#161616] border border-white/5 rounded-2xl p-5 overflow-hidden group cursor-default"
    >
      {/* Glow sutil no hover */}
      <div
        className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-300 rounded-2xl"
        style={{ background: `radial-gradient(ellipse at top left, ${color}10 0%, transparent 60%)` }}
      />

      <div className="relative flex items-start justify-between gap-3">
        <div className="min-w-0">
          <p className="text-xs font-medium text-gray-500 uppercase tracking-wider truncate">{title}</p>
          <p className="text-2xl font-bold text-white mt-1.5 tabular-nums">
            {displayValue}
            {suffix && <span className="text-sm text-gray-400 font-normal ml-1">{suffix}</span>}
          </p>

          {/* Variação */}
          {trend !== null && (
            <div
              className={cn(
                'flex items-center gap-1 mt-2 text-xs font-medium',
                trend === 'up' && 'text-[#22C55E]',
                trend === 'down' && 'text-[#EF4444]',
                trend === 'neutral' && 'text-gray-500',
              )}
            >
              {trend === 'up' && <TrendingUp className="w-3.5 h-3.5" />}
              {trend === 'down' && <TrendingDown className="w-3.5 h-3.5" />}
              {trend === 'neutral' && <Minus className="w-3.5 h-3.5" />}
              <span>{formatPercent(change ?? 0)} vs mês anterior</span>
            </div>
          )}
        </div>

        {/* Ícone */}
        <div
          className="w-10 h-10 rounded-xl flex items-center justify-center shrink-0"
          style={{ backgroundColor: `${color}15` }}
        >
          <div style={{ color }}>{icon}</div>
        </div>
      </div>
    </motion.div>
  )
}
