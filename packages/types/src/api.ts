export interface ApiResponse<T = unknown> {
  success: boolean
  data?: T
  message?: string
  error?: string
  statusCode: number
}

export interface PaginatedResponse<T> {
  data: T[]
  meta: {
    total: number
    page: number
    limit: number
    totalPages: number
    hasNextPage: boolean
    hasPrevPage: boolean
  }
}

export interface PaginationQuery {
  page?: number
  limit?: number
  search?: string
  sortBy?: string
  sortOrder?: 'asc' | 'desc'
}

export interface GeoLocation {
  latitude: number
  longitude: number
}

export interface SocketEvents {
  ORDER_CREATED: 'order:created'
  ORDER_UPDATED: 'order:updated'
  ORDER_STATUS_CHANGED: 'order:status_changed'
  DELIVERY_LOCATION_UPDATED: 'delivery:location_updated'
  COURIER_LOCATION_UPDATED: 'courier:location_updated'
  NOTIFICATION_SENT: 'notification:sent'
  RESTAURANT_STATUS_CHANGED: 'restaurant:status_changed'
}

export const SOCKET_EVENTS: SocketEvents = {
  ORDER_CREATED: 'order:created',
  ORDER_UPDATED: 'order:updated',
  ORDER_STATUS_CHANGED: 'order:status_changed',
  DELIVERY_LOCATION_UPDATED: 'delivery:location_updated',
  COURIER_LOCATION_UPDATED: 'courier:location_updated',
  NOTIFICATION_SENT: 'notification:sent',
  RESTAURANT_STATUS_CHANGED: 'restaurant:status_changed',
}
