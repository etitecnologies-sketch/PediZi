import { IsEmail, IsString, MinLength, IsOptional, IsIn } from 'class-validator'
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger'

const USER_ROLES = ['CLIENT', 'RESTAURANT_OWNER', 'COURIER', 'ADMIN'] as const
type UserRole = typeof USER_ROLES[number]

export class RegisterDto {
  @ApiProperty({ example: 'João Silva' })
  @IsString()
  name: string

  @ApiProperty({ example: 'joao@email.com' })
  @IsEmail({}, { message: 'E-mail inválido' })
  email: string

  @ApiProperty({ example: 'senha123' })
  @IsString()
  @MinLength(6, { message: 'A senha deve ter no mínimo 6 caracteres' })
  password: string

  @ApiPropertyOptional({ example: '11999999999' })
  @IsString()
  @IsOptional()
  phone?: string

  @ApiPropertyOptional({ enum: USER_ROLES, default: 'CLIENT' })
  @IsIn(USER_ROLES)
  @IsOptional()
  role?: UserRole
}
