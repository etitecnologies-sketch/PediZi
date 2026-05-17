import { create } from 'zustand'
import { persist } from 'zustand/middleware'

interface CartItem {
  menuItemId: string
  name: string
  price: number
  quantity: number
  notes?: string
}

interface CartState {
  items: CartItem[]
  restaurantId: string | null
  restaurantName: string | null

  addItem: (restaurantId: string, restaurantName: string, item: Omit<CartItem, 'quantity'>) => void
  removeItem: (menuItemId: string) => void
  updateQuantity: (menuItemId: string, quantity: number) => void
  clearCart: () => void

  subtotal: () => number
  totalItems: () => number
}

export const useCartStore = create<CartState>()(
  persist(
    (set, get) => ({
      items: [],
      restaurantId: null,
      restaurantName: null,

      addItem: (restaurantId, restaurantName, item) => {
        const { items, restaurantId: currentRestaurant } = get()

        // Se mudar de restaurante, limpa o carrinho
        if (currentRestaurant && currentRestaurant !== restaurantId) {
          set({ items: [{ ...item, quantity: 1 }], restaurantId, restaurantName })
          return
        }

        const existing = items.find((i) => i.menuItemId === item.menuItemId)
        if (existing) {
          set({ items: items.map((i) => i.menuItemId === item.menuItemId ? { ...i, quantity: i.quantity + 1 } : i) })
        } else {
          set({ items: [...items, { ...item, quantity: 1 }], restaurantId, restaurantName })
        }
      },

      removeItem: (menuItemId) => {
        const { items } = get()
        const existing = items.find((i) => i.menuItemId === menuItemId)
        if (!existing) return

        if (existing.quantity === 1) {
          const newItems = items.filter((i) => i.menuItemId !== menuItemId)
          set({ items: newItems, restaurantId: newItems.length === 0 ? null : get().restaurantId })
        } else {
          set({ items: items.map((i) => i.menuItemId === menuItemId ? { ...i, quantity: i.quantity - 1 } : i) })
        }
      },

      updateQuantity: (menuItemId, quantity) => {
        if (quantity <= 0) {
          get().removeItem(menuItemId)
          return
        }
        set({ items: get().items.map((i) => i.menuItemId === menuItemId ? { ...i, quantity } : i) })
      },

      clearCart: () => set({ items: [], restaurantId: null, restaurantName: null }),

      subtotal: () => get().items.reduce((s, i) => s + i.price * i.quantity, 0),
      totalItems: () => get().items.reduce((s, i) => s + i.quantity, 0),
    }),
    { name: 'pedizi:cart' },
  ),
)
