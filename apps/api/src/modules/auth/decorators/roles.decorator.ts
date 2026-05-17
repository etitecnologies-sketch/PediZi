import { SetMetadata } from '@nestjs/common'

export type UserRole = 'CLIENT' | 'RESTAURANT_OWNER' | 'COURIER' | 'ADMIN'
export const ROLES_KEY = 'roles'
export const Roles = (...roles: UserRole[]) => SetMetadata(ROLES_KEY, roles)
