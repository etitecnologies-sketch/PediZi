import { Injectable } from '@nestjs/common'
import { RealtimeGateway } from './realtime.gateway'

@Injectable()
export class RealtimeService {
  constructor(private readonly gateway: RealtimeGateway) {}

  // Emite evento para uma sala específica
  emitToRoom(room: string, event: string, data: unknown) {
    this.gateway.server.to(room).emit(event, data)
  }

  // Emite evento para todos os conectados
  emitToAll(event: string, data: unknown) {
    this.gateway.server.emit(event, data)
  }

  // Notifica sobre mudança no status do pedido
  notifyOrderStatusChange(orderId: string, status: string, data: unknown) {
    this.emitToRoom(`order:${orderId}`, 'order:status_changed', { orderId, status, data })
  }

  // Notifica restaurante sobre novo pedido
  notifyNewOrder(restaurantId: string, order: unknown) {
    this.emitToRoom(`restaurant:${restaurantId}`, 'order:created', order)
  }

  // Notifica entregador sobre nova corrida
  notifyCourierNewDelivery(courierId: string, delivery: unknown) {
    this.emitToRoom(`courier:${courierId}`, 'delivery:new', delivery)
  }

  // Notifica usuário
  notifyUser(userId: string, event: string, data: unknown) {
    this.emitToRoom(`user:${userId}`, event, data)
  }

  // Atualiza dashboard admin em tempo real
  notifyAdminDashboard(event: string, data: unknown) {
    this.emitToRoom('admin:dashboard', event, data)
  }
}
