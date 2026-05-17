import {
  UserRole,
  OrderStatus,
  PaymentStatus,
  PaymentMethod,
  DeliveryStatus,
  RestaurantStatus,
  CourierStatus,
  SubscriptionPlan,
  SubscriptionStatus,
  CouponType,
  NotificationType,
  DayOfWeek,
} from './enums'

export interface User {
  id: string
  name: string
  email: string
  phone?: string
  avatarUrl?: string
  role: UserRole
  isEmailVerified: boolean
  isActive: boolean
  createdAt: Date
  updatedAt: Date
}

export interface Address {
  id: string
  userId: string
  label?: string
  street: string
  number: string
  complement?: string
  neighborhood: string
  city: string
  state: string
  zipCode: string
  latitude?: number
  longitude?: number
  isDefault: boolean
  createdAt: Date
  updatedAt: Date
}

export interface Restaurant {
  id: string
  ownerId: string
  name: string
  slug: string
  description?: string
  logoUrl?: string
  coverUrl?: string
  phone: string
  email: string
  document: string
  status: RestaurantStatus
  isOpen: boolean
  deliveryFee: number
  minOrderValue: number
  estimatedDeliveryTime: number
  maxDeliveryRadius: number
  commission: number
  latitude: number
  longitude: number
  address: Omit<Address, 'id' | 'userId' | 'isDefault' | 'createdAt' | 'updatedAt' | 'label'>
  subscriptionPlan: SubscriptionPlan
  createdAt: Date
  updatedAt: Date
}

export interface MenuCategory {
  id: string
  restaurantId: string
  name: string
  description?: string
  imageUrl?: string
  sortOrder: number
  isActive: boolean
  createdAt: Date
  updatedAt: Date
}

export interface MenuItem {
  id: string
  restaurantId: string
  categoryId: string
  name: string
  description?: string
  price: number
  imageUrl?: string
  isAvailable: boolean
  sortOrder: number
  preparationTime: number
  createdAt: Date
  updatedAt: Date
}

export interface Order {
  id: string
  code: string
  clientId: string
  restaurantId: string
  addressId: string
  status: OrderStatus
  subtotal: number
  deliveryFee: number
  discount: number
  total: number
  paymentMethod: PaymentMethod
  notes?: string
  estimatedDeliveryTime?: number
  createdAt: Date
  updatedAt: Date
}

export interface OrderItem {
  id: string
  orderId: string
  menuItemId: string
  name: string
  price: number
  quantity: number
  notes?: string
  subtotal: number
}

export interface Payment {
  id: string
  orderId: string
  amount: number
  status: PaymentStatus
  method: PaymentMethod
  gateway?: string
  gatewayId?: string
  pixCode?: string
  pixExpiration?: Date
  paidAt?: Date
  createdAt: Date
  updatedAt: Date
}

export interface Delivery {
  id: string
  orderId: string
  courierId?: string
  status: DeliveryStatus
  pickupLatitude?: number
  pickupLongitude?: number
  deliveryLatitude?: number
  deliveryLongitude?: number
  pickedUpAt?: Date
  deliveredAt?: Date
  createdAt: Date
  updatedAt: Date
}

export interface Courier {
  id: string
  userId: string
  document: string
  vehicleType: string
  vehiclePlate?: string
  status: CourierStatus
  currentLatitude?: number
  currentLongitude?: number
  totalDeliveries: number
  rating: number
  createdAt: Date
  updatedAt: Date
}

export interface Review {
  id: string
  orderId: string
  clientId: string
  restaurantId: string
  courierId?: string
  restaurantRating: number
  courierRating?: number
  comment?: string
  createdAt: Date
  updatedAt: Date
}

export interface Coupon {
  id: string
  restaurantId?: string
  code: string
  type: CouponType
  value: number
  minOrderValue?: number
  maxDiscount?: number
  usageLimit?: number
  usageCount: number
  isActive: boolean
  expiresAt?: Date
  createdAt: Date
  updatedAt: Date
}

export interface Notification {
  id: string
  userId: string
  type: NotificationType
  title: string
  message: string
  data?: Record<string, unknown>
  isRead: boolean
  createdAt: Date
}

export interface Subscription {
  id: string
  restaurantId: string
  plan: SubscriptionPlan
  status: SubscriptionStatus
  currentPeriodStart: Date
  currentPeriodEnd: Date
  cancelledAt?: Date
  createdAt: Date
  updatedAt: Date
}

export interface BusinessHour {
  id: string
  restaurantId: string
  dayOfWeek: DayOfWeek
  openTime: string
  closeTime: string
  isOpen: boolean
}
