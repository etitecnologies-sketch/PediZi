import { Controller, Post, Get, Body, Param, Headers, UseGuards, RawBodyRequest, Req } from '@nestjs/common'
import { ApiTags, ApiOperation, ApiBearerAuth, ApiBody } from '@nestjs/swagger'
import { Request } from 'express'
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard'
import { PaymentsService } from './payments.service'

@ApiTags('payments')
@Controller({ path: 'payments', version: '1' })
export class PaymentsController {
  constructor(private readonly paymentsService: PaymentsService) {}

  @Post('pix')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth('JWT')
  @ApiOperation({ summary: 'Gerar PIX via Mercado Pago (QR Code + código copia-e-cola)' })
  @ApiBody({ schema: { type: 'object', properties: { orderId: { type: 'string' } } } })
  createPix(@Body() body: { orderId: string }) {
    return this.paymentsService.createPixPayment(body.orderId)
  }

  @Get('order/:orderId')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth('JWT')
  @ApiOperation({ summary: 'Consultar pagamento do pedido' })
  getByOrder(@Param('orderId') orderId: string) {
    return this.paymentsService.getByOrder(orderId)
  }

  @Post('refund/:paymentId')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth('JWT')
  @ApiOperation({ summary: 'Estornar pagamento' })
  refund(@Param('paymentId') paymentId: string, @Body() body: { reason?: string }) {
    return this.paymentsService.refund(paymentId, body.reason)
  }

  // ── Endpoints de simulação (apenas dev) ──────────────
  @Post('simulate/approve/:orderId')
  @ApiOperation({ summary: '[DEV] Simular aprovação de pagamento' })
  simulateApprove(@Param('orderId') orderId: string) {
    return this.paymentsService.simulateApproval(orderId)
  }

  // ── Webhooks ─────────────────────────────────────────
  @Post('webhooks/mercadopago')
  @ApiOperation({ summary: 'Webhook Mercado Pago (não requer auth)' })
  webhookMercadoPago(
    @Body() data: Record<string, unknown>,
    @Headers('x-signature') signature: string,
    @Headers('x-request-id') requestId: string,
  ) {
    return this.paymentsService.handleMercadoPagoWebhook(data, signature, requestId)
  }
}
