import { Controller, Get, Patch, Param, Query, UseGuards, Request } from '@nestjs/common'
import { ApiTags, ApiOperation, ApiBearerAuth } from '@nestjs/swagger'
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard'
import { NotificationsService } from './notifications.service'

@ApiTags('notifications')
@UseGuards(JwtAuthGuard)
@ApiBearerAuth('JWT')
@Controller({ path: 'notifications', version: '1' })
export class NotificationsController {
  constructor(private readonly notificationsService: NotificationsService) {}

  @Get()
  @ApiOperation({ summary: 'Minhas notificações' })
  findMyNotifications(
    @Request() req: { user: { sub: string } },
    @Query('page') page = 1,
    @Query('limit') limit = 20,
  ) {
    return this.notificationsService.findByUser(req.user.sub, { page: Number(page), limit: Number(limit) })
  }

  @Patch('read-all')
  @ApiOperation({ summary: 'Marcar todas como lidas' })
  markAllRead(@Request() req: { user: { sub: string } }) {
    return this.notificationsService.markAsRead(req.user.sub)
  }

  @Patch(':id/read')
  @ApiOperation({ summary: 'Marcar notificação como lida' })
  markRead(@Request() req: { user: { sub: string } }, @Param('id') id: string) {
    return this.notificationsService.markAsRead(req.user.sub, id)
  }
}
