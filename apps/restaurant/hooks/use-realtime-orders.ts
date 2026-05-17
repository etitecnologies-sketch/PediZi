'use client'

import { useEffect, useRef, useState, useCallback } from 'react'
import { io, Socket } from 'socket.io-client'

const WS_URL = process.env.NEXT_PUBLIC_WS_URL ?? 'http://localhost:3333'

interface IncomingOrder {
  id: string
  code: string
  total: number
  clientId: string
  items: Array<{ name: string; quantity: number }>
  receivedAt: Date
}

export function useRealtimeOrders(restaurantId: string | null) {
  const socketRef = useRef<Socket | null>(null)
  const [isConnected, setIsConnected] = useState(false)
  const [incomingOrders, setIncomingOrders] = useState<IncomingOrder[]>([])
  const [pendingCount, setPendingCount] = useState(0)
  const audioRef = useRef<HTMLAudioElement | null>(null)

  useEffect(() => {
    if (typeof window !== 'undefined') {
      audioRef.current = new Audio('/sounds/new-order.mp3')
    }
  }, [])

  useEffect(() => {
    if (!restaurantId) return

    socketRef.current = io(WS_URL, {
      reconnection: true,
      transports: ['websocket', 'polling'],
    })

    const socket = socketRef.current

    socket.on('connect', () => {
      setIsConnected(true)
      socket.emit('join:room', `restaurant:${restaurantId}`)
    })

    socket.on('disconnect', () => setIsConnected(false))

    socket.on('order:created', (order: any) => {
      const incoming: IncomingOrder = {
        id: order.id,
        code: order.code,
        total: order.total,
        clientId: order.clientId,
        items: order.items,
        receivedAt: new Date(),
      }
      setIncomingOrders((prev) => [incoming, ...prev])
      setPendingCount((n) => n + 1)

      // Toca som de novo pedido
      audioRef.current?.play().catch(() => {})

      // Notificação do browser
      if (Notification.permission === 'granted') {
        new Notification(`🍔 Novo pedido! #${order.code}`, {
          body: `R$ ${order.total.toFixed(2)} — ${order.items.length} iten(s)`,
          icon: '/icon-192x192.png',
        })
      }
    })

    return () => {
      socket.emit('leave:room', `restaurant:${restaurantId}`)
      socket.disconnect()
    }
  }, [restaurantId])

  const clearOrder = useCallback((orderId: string) => {
    setIncomingOrders((prev) => prev.filter((o) => o.id !== orderId))
    setPendingCount((n) => Math.max(0, n - 1))
  }, [])

  const requestNotificationPermission = useCallback(async () => {
    if ('Notification' in window && Notification.permission !== 'granted') {
      await Notification.requestPermission()
    }
  }, [])

  return { isConnected, incomingOrders, pendingCount, clearOrder, requestNotificationPermission }
}
