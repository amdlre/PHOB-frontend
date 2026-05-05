export const ENDPOINTS = {
  auth: {
    login: '/auth/login',
    register: '/auth/register',
    logout: '/auth/logout',
    refresh: '/auth/refresh',
    me: '/auth/me',
  },
  properties: {
    list: '/properties',
    create: '/properties',
    detail: (id: string) => `/properties/${id}`,
    update: (id: string) => `/properties/${id}`,
    delete: (id: string) => `/properties/${id}`,
  },
  subscriptions: {
    list: '/subscriptions',
    create: '/subscriptions',
    detail: (id: string) => `/subscriptions/${id}`,
    update: (id: string) => `/subscriptions/${id}`,
    delete: (id: string) => `/subscriptions/${id}`,
    byProperty: (propertyId: string) => `/subscriptions/property/${propertyId}/active`,
  },
  requests: {
    list: '/requests',
    create: '/requests',
    detail: (id: string) => `/requests/${id}`,
    update: (id: string) => `/requests/${id}`,
    delete: (id: string) => `/requests/${id}`,
    updateStatus: (id: string) => `/requests/${id}/status`,
    confirmGuest: (id: string) => `/requests/${id}/confirm-guest`,
  },
  reports: {
    upload: (requestId: string) => `/reports/requests/${requestId}/report`,
    get: (requestId: string) => `/reports/requests/${requestId}/report`,
  },
  notifications: {
    list: '/notifications',
    markRead: (id: string) => `/notifications/${id}/read`,
  },
} as const;
