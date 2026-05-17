import { PaymentMethod, UserRole } from './enums'

export interface LoginDto {
  email: string
  password: string
}

export interface RegisterDto {
  name: string
  email: string
  password: string
  phone?: string
  role?: UserRole
}

export interface AuthTokensDto {
  accessToken: string
  refreshToken: string
  expiresIn: number
}

export interface CreateOrderDto {
  restaurantId: string
  addressId: string
  items: Array<{
    menuItemId: string
    quantity: number
    notes?: string
    variations?: string[]
    additionals?: string[]
  }>
  paymentMethod: PaymentMethod
  couponCode?: string
  notes?: string
}

export interface UpdateOrderStatusDto {
  status: string
  reason?: string
}

export interface CreateRestaurantDto {
  name: string
  description?: string
  phone: string
  email: string
  document: string
  deliveryFee: number
  minOrderValue: number
  estimatedDeliveryTime: number
  maxDeliveryRadius: number
  street: string
  number: string
  complement?: string
  neighborhood: string
  city: string
  state: string
  zipCode: string
  latitude: number
  longitude: number
}

export interface UpdateCourierLocationDto {
  latitude: number
  longitude: number
}
