'use client'

import { useState, useEffect } from 'react'
import { useSocket } from './use-socket'

export interface OrderTrackingState {
  status: string
  courierLocation: { latitude: number; longitude: number } | null
  estimatedMinutes: number | null
  lastUpdated: Date | null
}

export function useOrderTracking(orderId: string | null) {
  const { joinRoom, leaveRoom, on } = useSocket()

  const [tracking, setTracking] = useState<OrderTrackingState>({
    status: 'PENDING',
    courierLocation: null,
    estimatedMinutes: null,
    lastUpdated: null,
  })

  useEffect(() => {
    if (!orderId) return

    const room = `order:${orderId}`
    joinRoom(room)

    // Atualização de status do pedido
    const offStatus = on<{ status: string; data: unknown }>('order:status_changed', (data) => {
      setTracking((prev) => ({ ...prev, status: data.status, lastUpdated: new Date() }))
    })

    // Atualização de localização do entregador
    const offLocation = on<{ latitude: number; longitude: number; courierId: string }>(
      'courier:location_updated',
      (data) => {
        setTracking((prev) => ({
          ...prev,
          courierLocation: { latitude: data.latitude, longitude: data.longitude },
          lastUpdated: new Date(),
        }))
      },
    )

    return () => {
      leaveRoom(room)
      offStatus()
      offLocation()
    }
  }, [orderId, joinRoom, leaveRoom, on])

  return tracking
}
