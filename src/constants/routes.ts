export const ROUTES = {
  home: '/',
  login: '/login',
  register: '/register',
  client: {
    dashboard: '/dashboard',
    properties: '/properties',
    propertyAdd: '/properties/add',
    property: (id: string) => `/properties/${id}`,
    subscriptions: '/subscriptions',
    subscriptionNew: '/subscriptions/new',
    requests: '/requests',
    requestNew: '/requests/new',
    request: (id: string) => `/requests/${id}`,
  },
  employee: {
    dashboard: '/dashboard',
    requests: '/requests',
    request: (id: string) => `/requests/${id}`,
    subscriptions: '/subscriptions',
    properties: '/properties',
  },
} as const;

export const PUBLIC_ROUTES = ['/', '/login', '/register'] as const;
export const AUTH_ROUTES = ['/login', '/register'] as const;
