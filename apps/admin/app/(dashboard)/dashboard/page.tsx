import {
  DollarSign,
  ShoppingBag,
  Store,
  Truck,
  Users,
  TrendingUp,
} from 'lucide-react'
import { KpiCard } from '@/components/dashboard/kpi-card'
import { RevenueChart } from '@/components/dashboard/revenue-chart'
import { OrdersTable } from '@/components/dashboard/orders-table'
import { TopRestaurants } from '@/components/dashboard/top-restaurants'
import { ActiveDeliveries } from '@/components/dashboard/active-deliveries'

export const metadata = { title: 'Dashboard' }

const kpis = [
  {
    title: 'Receita do Mês',
    value: 52000,
    format: 'currency' as const,
    change: 13.5,
    icon: <DollarSign className="w-5 h-5" />,
    color: '#FF1F24',
  },
  {
    title: 'Pedidos Hoje',
    value: 1012,
    format: 'number' as const,
    change: 8.2,
    icon: <ShoppingBag className="w-5 h-5" />,
    color: '#8B5CF6',
  },
  {
    title: 'Restaurantes Ativos',
    value: 47,
    format: 'number' as const,
    change: 4.4,
    icon: <Store className="w-5 h-5" />,
    color: '#06B6D4',
  },
  {
    title: 'Entregas em Andamento',
    value: 23,
    format: 'number' as const,
    icon: <Truck className="w-5 h-5" />,
    color: '#F59E0B',
  },
  {
    title: 'Usuários Ativos',
    value: 3847,
    format: 'number' as const,
    change: 21.0,
    icon: <Users className="w-5 h-5" />,
    color: '#22C55E',
  },
  {
    title: 'Ticket Médio',
    value: 51.38,
    format: 'currency' as const,
    change: 5.1,
    icon: <TrendingUp className="w-5 h-5" />,
    color: '#EC4899',
  },
]

export default function DashboardPage() {
  return (
    <div className="space-y-6 max-w-[1600px] mx-auto">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold text-white">Dashboard</h1>
        <p className="text-sm text-gray-500 mt-0.5">Visão geral da plataforma PEDIZI em tempo real</p>
      </div>

      {/* KPIs */}
      <div className="grid grid-cols-2 sm:grid-cols-3 xl:grid-cols-6 gap-4">
        {kpis.map((kpi, i) => (
          <KpiCard key={kpi.title} {...kpi} index={i} />
        ))}
      </div>

      {/* Gráfico de receita */}
      <RevenueChart />

      {/* Grid inferior */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2">
          <OrdersTable />
        </div>
        <div className="space-y-6">
          <TopRestaurants />
          <ActiveDeliveries />
        </div>
      </div>
    </div>
  )
}
