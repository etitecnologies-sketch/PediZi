import { Controller, Get, Put, Post, Delete, Body, Param, Query, UseGuards, Request } from '@nestjs/common'
import { ApiTags, ApiOperation, ApiBearerAuth } from '@nestjs/swagger'
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard'
import { UsersService } from './users.service'

@ApiTags('users')
@UseGuards(JwtAuthGuard)
@ApiBearerAuth('JWT')
@Controller({ path: 'users', version: '1' })
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Get('me')
  @ApiOperation({ summary: 'Meu perfil' })
  getMe(@Request() req: { user: { sub: string } }) {
    return this.usersService.findById(req.user.sub)
  }

  @Put('me')
  @ApiOperation({ summary: 'Atualizar meu perfil' })
  updateMe(@Request() req: { user: { sub: string } }, @Body() body: { name?: string; phone?: string }) {
    return this.usersService.update(req.user.sub, body)
  }

  @Get('me/addresses')
  @ApiOperation({ summary: 'Listar meus endereços' })
  getAddresses(@Request() req: { user: { sub: string } }) {
    return this.usersService.getAddresses(req.user.sub)
  }

  @Post('me/addresses')
  @ApiOperation({ summary: 'Adicionar endereço' })
  createAddress(@Request() req: { user: { sub: string } }, @Body() body: {
    label?: string; street: string; number: string; complement?: string
    neighborhood: string; city: string; state: string; zipCode: string
    latitude?: number; longitude?: number; isDefault?: boolean
  }) {
    return this.usersService.createAddress(req.user.sub, body)
  }

  @Delete('me/addresses/:id')
  @ApiOperation({ summary: 'Remover endereço' })
  deleteAddress(@Request() req: { user: { sub: string } }, @Param('id') id: string) {
    return this.usersService.deleteAddress(req.user.sub, id)
  }
}
