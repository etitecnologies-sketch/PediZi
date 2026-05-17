'use client'

import { useEffect, useRef, useCallback } from 'react'
import { io, Socket } from 'socket.io-client'

const WS_URL = process.env.NEXT_PUBLIC_WS_URL ?? 'http://localhost:3333'

let globalSocket: Socket | null = null

export function useSocket() {
  const socketRef = useRef<Socket | null>(null)

  useEffect(() => {
    if (!globalSocket) {
      globalSocket = io(WS_URL, {
        autoConnect: true,
        reconnection: true,
        reconnectionAttempts: 5,
        reconnectionDelay: 2000,
        transports: ['websocket', 'polling'],
      })
    }
    socketRef.current = globalSocket

    return () => {
      // Não desconecta ao desmontar (conexão global)
    }
  }, [])

  const joinRoom = useCallback((room: string) => {
    socketRef.current?.emit('join:room', room)
  }, [])

  const leaveRoom = useCallback((room: string) => {
    socketRef.current?.emit('leave:room', room)
  }, [])

  const on = useCallback(<T>(event: string, handler: (data: T) => void) => {
    socketRef.current?.on(event, handler)
    return () => { socketRef.current?.off(event, handler) }
  }, [])

  const emit = useCallback((event: string, data: unknown) => {
    socketRef.current?.emit(event, data)
  }, [])

  return { socket: socketRef.current, joinRoom, leaveRoom, on, emit }
}
