import { IsEmail, IsString, MinLength, IsOptional, IsEnum } from 'class-validator'
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger'
import { UserRole } from '@prisma/client'

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

  @ApiPropertyOptional({ enum: UserRole, default: UserRole.CLIENT })
  @IsEnum(UserRole)
  @IsOptional()
  role?: UserRole
}
