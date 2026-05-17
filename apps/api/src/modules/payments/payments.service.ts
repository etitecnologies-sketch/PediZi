import {
  Injectable,
  NotFoundException,
  BadRequestException,
  Logger,
  UnauthorizedException,
} from '@nestjs/common'
import { ConfigService } from '@nestjs/config'
import { PrismaService } from '../../infra/database/prisma/prisma.service'
import { RealtimeService } from '../../infra/realtime/realtime.service'
type PaymentMethod = 'PIX' | 'CREDIT_CARD' | 'DEBIT_CARD' | 'CASH'
import axios from 'axios'
import * as crypto from 'crypto'

interface MercadoPagoPixResponse {
  id: number
  status: string
  point_of_interaction: {
    transaction_data: {
      qr_code: string
      qr_code_base64: string
    }
  }
  date_of_expiration: string
}

@Injectable()
export class PaymentsService {
  private readonly logger = new Logger(PaymentsService.name)
  private readonly mpAccessToken: string
  private readonly mpWebhookSecret: string
  private readonly mpBaseUrl = 'https://api.mercadopago.com'

  constructor(
    private readonly prisma: PrismaService,
    private readonly realtime: RealtimeService,
    private readonly configService: ConfigService,
  ) {
    this.mpAccessToken = configService.get<string>('MERCADOPAGO_ACCESS_TOKEN', '')
    this.mpWebhookSecret = configService.get<string>('MERCADOPAGO_WEBHOOK_SECRET', '')
  }

  // ── PIX com Mercado Pago ────────────────────────────────
  async createPixPayment(orderId: string) {
    const order = await this.prisma.order.findUnique({
      where: { id: orderId },
      include: {
        restaurant: true,
        client: { select: { name: true, email: true } },
      },
    })
    if (!order) throw new NotFoundException('Pedido não encontrado')
    if (order.status === 'CANCELLED') throw new BadRequestException('Pedido cancelado')

    const existingPayment = await this.prisma.payment.findUnique({ where: { orderId } })
    if (existingPayment?.status === 'PAID') throw new BadRequestException('Pedido já pago')

    const platformFee = order.total * (order.restaurant.commission / 100)
    const restaurantAmount = order.total - platformFee

    // Se não tem token Mercado Pago configurado, usa mock
    if (!this.mpAccessToken || this.mpAccessToken.startsWith('APP_USR-TEST')) {
      return this.createMockPixPayment(orderId, order.total, platformFee, restaurantAmount)
    }

    try {
      const pixData = await this.callMercadoPago<MercadoPagoPixResponse>(
        'POST',
        '/v1/payments',
        {
          transaction_amount: order.total,
          description: `PEDIZI - Pedido #${order.code} - ${order.restaurant.name}`,
          payment_method_id: 'pix',
          payer: {
            email: order.client.email,
            first_name: order.client.name.split(' ')[0],
            last_name: order.client.name.split(' ').slice(1).join(' ') || 'Cliente',
          },
          notification_url: `${this.configService.get('APP_URL')}/api/v1/payments/webhooks/mercadopago`,
          date_of_expiration: new Date(Date.now() + 30 * 60 * 1000).toISOString(),
          metadata: { order_id: orderId, order_code: order.code },
        },
      )

      const payment = await this.prisma.payment.upsert({
        where: { orderId },
        create: {
          orderId,
          amount: order.total,
          status: 'PENDING',
          method: 'PIX',
          gateway: 'MERCADOPAGO',
          gatewayId: String(pixData.id),
          pixCode: pixData.point_of_interaction.transaction_data.qr_code,
          pixQrCode: pixData.point_of_interaction.transaction_data.qr_code_base64,
          pixExpiration: new Date(pixData.date_of_expiration),
          platformFee,
          restaurantAmount,
        },
        update: {
          gatewayId: String(pixData.id),
          pixCode: pixData.point_of_interaction.transaction_data.qr_code,
          pixQrCode: pixData.point_of_interaction.transaction_data.qr_code_base64,
          pixExpiration: new Date(pixData.date_of_expiration),
        },
      })

      return {
        paymentId: payment.id,
        pixCode: payment.pixCode,
        pixQrCode: payment.pixQrCode,
        expiresAt: payment.pixExpiration,
        amount: payment.amount,
      }
    } catch (error) {
      this.logger.error('Erro ao criar PIX Mercado Pago:', error)
      // Fallback para mock em caso de erro
      return this.createMockPixPayment(orderId, order.total, platformFee, restaurantAmount)
    }
  }

  // ── PIX Mock (desenvolvimento/teste) ──────────────────
  private async createMockPixPayment(orderId: string, amount: number, platformFee: number, restaurantAmount: number) {
    const pixCode = `00020126580014br.gov.bcb.pix0136pedizi-${Date.now()}-${orderId.slice(0, 8)}5204000053039865802BR5925PEDIZI DELIVERY LTDA6009SAO PAULO62070503***6304ABCD`
    const pixExpiration = new Date(Date.now() + 30 * 60 * 1000)

    await this.prisma.payment.upsert({
      where: { orderId },
      create: { orderId, amount, status: 'PENDING', method: 'PIX', pixCode, pixExpiration, platformFee, restaurantAmount },
      update: { pixCode, pixExpiration },
    })

    return {
      paymentId: `mock_${orderId}`,
      pixCode,
      pixQrCode: null,
      expiresAt: pixExpiration,
      amount,
      isMock: true,
    }
  }

  // ── Webhook Mercado Pago ───────────────────────────────
  async handleMercadoPagoWebhook(
    data: Record<string, unknown>,
    signature?: string,
    requestId?: string,
  ) {
    // Valida assinatura do webhook (segurança)
    if (this.mpWebhookSecret && signature) {
      const isValid = this.validateWebhookSignature(signature, requestId ?? '', data)
      if (!isValid) throw new UnauthorizedException('Assinatura de webhook inválida')
    }

    const type = data['type'] as string
    const paymentId = (data['data'] as Record<string, string>)?.['id']

    if (type !== 'payment' || !paymentId) return { received: true }

    try {
      const mpPayment = await this.callMercadoPago<{ status: string; metadata: { order_id: string } }>(
        'GET',
        `/v1/payments/${paymentId}`,
      )

      const { status, metadata } = mpPayment
      const orderId = metadata?.order_id

      if (!orderId) return { received: true }

      await this.processPaymentStatus(orderId, paymentId, status, data)
    } catch (error) {
      this.logger.error('Erro ao processar webhook MP:', error)
    }

    return { received: true }
  }

  // ── Processar status do pagamento ──────────────────────
  private async processPaymentStatus(
    orderId: string,
    gatewayId: string,
    mpStatus: string,
    webhookData: unknown,
  ) {
    const payment = await this.prisma.payment.findUnique({ where: { orderId } })
    if (!payment) return

    let newStatus: 'PAID' | 'FAILED' | 'REFUNDED' = 'PAID'
    if (['rejected', 'cancelled', 'refunded'].includes(mpStatus)) {
      newStatus = mpStatus === 'refunded' ? 'REFUNDED' : 'FAILED'
    } else if (mpStatus !== 'approved') {
      return // Status intermediário, aguarda
    }

    await this.prisma.payment.update({
      where: { orderId },
      data: {
        status: newStatus,
        gatewayId,
        paidAt: newStatus === 'PAID' ? new Date() : undefined,
        refundedAt: newStatus === 'REFUNDED' ? new Date() : undefined,
        webhookData: webhookData as any,
      },
    })

    if (newStatus === 'PAID') {
      const order = await this.prisma.order.findUnique({
        where: { id: orderId },
        include: { items: true },
      })
      if (!order) return

      await this.prisma.order.update({ where: { id: orderId }, data: { status: 'CONFIRMED' } })

      // Cria registro de entrega
      await this.prisma.delivery.upsert({
        where: { orderId },
        create: { orderId, status: 'WAITING_COURIER' },
        update: {},
      })

      // Notificações realtime
      this.realtime.notifyOrderStatusChange(orderId, 'CONFIRMED', order)
      this.realtime.notifyUser(order.clientId, 'payment:approved', { orderId, orderCode: order.code })
      this.realtime.notifyNewOrder(order.restaurantId, order)
      this.realtime.notifyAdminDashboard('order:new', { orderId, total: order.total })

      this.logger.log(`✅ Pagamento aprovado: Pedido #${order.code} (R$ ${order.total})`)
    }
  }

  // ── Estorno ───────────────────────────────────────────
  async refund(paymentId: string, reason?: string) {
    const payment = await this.prisma.payment.findUnique({ where: { id: paymentId } })
    if (!payment) throw new NotFoundException('Pagamento não encontrado')
    if (payment.status !== 'PAID') throw new BadRequestException('Apenas pagamentos aprovados podem ser estornados')

    // Estorno no Mercado Pago
    if (payment.gatewayId && this.mpAccessToken) {
      try {
        await this.callMercadoPago('POST', `/v1/payments/${payment.gatewayId}/refunds`, {
          amount: payment.amount,
        })
      } catch (error) {
        this.logger.error('Erro ao estornar no MP:', error)
      }
    }

    const updated = await this.prisma.payment.update({
      where: { id: paymentId },
      data: { status: 'REFUNDED', refundedAt: new Date() },
    })

    // Atualiza pedido
    await this.prisma.order.update({ where: { id: payment.orderId }, data: { status: 'REFUNDED' } })

    return updated
  }

  // ── Consultar pagamento ───────────────────────────────
  async getByOrder(orderId: string) {
    return this.prisma.payment.findUnique({ where: { orderId } })
  }

  // ── Simular pagamento aprovado (dev/testes) ───────────
  async simulateApproval(orderId: string) {
    if (this.configService.get('NODE_ENV') === 'production') {
      throw new BadRequestException('Não disponível em produção')
    }
    await this.processPaymentStatus(orderId, `sim_${Date.now()}`, 'approved', { simulated: true })
    return { success: true, message: 'Pagamento simulado com sucesso' }
  }

  // ── Helpers ───────────────────────────────────────────
  private async callMercadoPago<T>(method: 'GET' | 'POST', path: string, body?: unknown): Promise<T> {
    const response = await axios({
      method,
      url: `${this.mpBaseUrl}${path}`,
      headers: {
        Authorization: `Bearer ${this.mpAccessToken}`,
        'Content-Type': 'application/json',
        'X-Idempotency-Key': `pedizi-${Date.now()}-${Math.random().toString(36).slice(2)}`,
      },
      data: body,
    })
    return response.data
  }

  private validateWebhookSignature(signature: string, requestId: string, data: unknown): boolean {
    try {
      const manifest = `id:${(data as any).data?.id};request-id:${requestId};ts:${(data as any).ts};`
      const expected = crypto
        .createHmac('sha256', this.mpWebhookSecret)
        .update(manifest)
        .digest('hex')
      return signature === expected
    } catch {
      return false
    }
  }
}
