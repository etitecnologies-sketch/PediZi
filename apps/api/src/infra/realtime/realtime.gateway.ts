import {
  WebSocketGateway,
  WebSocketServer,
  SubscribeMessage,
  OnGatewayConnection,
  OnGatewayDisconnect,
  OnGatewayInit,
  ConnectedSocket,
  MessageBody,
} from '@nestjs/websockets'
import { Server, Socket } from 'socket.io'
import { Logger, UseGuards } from '@nestjs/common'

@WebSocketGateway({
  cors: {
    origin: ['http://localhost:3000', 'http://localhost:3001', 'http://localhost:3002'],
    credentials: true,
  },
  namespace: '/',
})
export class RealtimeGateway implements OnGatewayInit, OnGatewayConnection, OnGatewayDisconnect {
  @WebSocketServer()
  server: Server

  private readonly logger = new Logger(RealtimeGateway.name)

  afterInit(server: Server) {
    this.logger.log('🔌 Gateway WebSocket inicializado')
  }

  handleConnection(client: Socket) {
    this.logger.log(`Cliente conectado: ${client.id}`)
  }

  handleDisconnect(client: Socket) {
    this.logger.log(`Cliente desconectado: ${client.id}`)
  }

  // Entrar numa sala específica (ex: sala do pedido #123)
  @SubscribeMessage('join:room')
  handleJoinRoom(@ConnectedSocket() client: Socket, @MessageBody() room: string) {
    client.join(room)
    this.logger.log(`${client.id} entrou na sala: ${room}`)
  }

  // Sair de uma sala
  @SubscribeMessage('leave:room')
  handleLeaveRoom(@ConnectedSocket() client: Socket, @MessageBody() room: string) {
    client.leave(room)
  }

  // Entregador atualiza localização em tempo real
  @SubscribeMessage('courier:update_location')
  handleCourierLocation(
    @ConnectedSocket() client: Socket,
    @MessageBody() data: { courierId: string; latitude: number; longitude: number; orderId?: string },
  ) {
    // Emite para todos na sala do pedido e na sala do restaurante
    if (data.orderId) {
      this.server.to(`order:${data.orderId}`).emit('courier:location_updated', data)
    }
    this.server.emit('courier:location_updated', data)
  }
}
