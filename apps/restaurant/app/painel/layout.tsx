import { RestaurantSidebar } from '@/components/restaurant-sidebar'

export default function PainelLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex h-screen bg-[#0D0D0D] overflow-hidden">
      <RestaurantSidebar />
      <main className="flex-1 overflow-y-auto p-6">{children}</main>
    </div>
  )
}
