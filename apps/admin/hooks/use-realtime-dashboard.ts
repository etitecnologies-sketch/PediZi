'use client'

import { useEffect, useRef, useState } from 'react'
import { io, Socket } from 'socket.io-client'

const WS_URL = process.env.NEXT_PUBLIC_WS_URL ?? 'http://localhost:3333'

interface RealtimeEvent {
  type: 'order:new' | 'order:status_changed' | 'notification:sent'
  data: unknown
  timestamp: Date
}

export function useRealtimeDashboard() {
  const socketRef = useRef<Socket | null>(null)
  const [isConnected, setIsConnected] = useState(false)
  const [events, setEvents] = useState<RealtimeEvent[]>([])
  const [newOrderCount, setNewOrderCount] = useState(0)

  useEffect(() => {
    socketRef.current = io(WS_URL, {
      reconnection: true,
      transports: ['websocket', 'polling'],
    })

    const socket = socketRef.current

    socket.on('connect', () => {
      setIsConnected(true)
      socket.emit('join:room', 'admin:dashboard')
    })

    socket.on('disconnect', () => setIsConnected(false))

    socket.on('order:new', (data: unknown) => {
      setNewOrderCount((n) => n + 1)
      addEvent('order:new', data)
    })

    socket.on('order:status_changed', (data: unknown) => addEvent('order:status_changed', data))

    return () => {
      socket.emit('leave:room', 'admin:dashboard')
      socket.disconnect()
    }
  }, [])

  function addEvent(type: RealtimeEvent['type'], data: unknown) {
    setEvents((prev) => [{ type, data, timestamp: new Date() }, ...prev].slice(0, 50))
  }

  function clearNewOrderCount() {
    setNewOrderCount(0)
  }

  return { isConnected, events, newOrderCount, clearNewOrderCount }
}
