export function dashboardPathFor(role: string | undefined): string {
  if (role === 'employee' || role === 'admin') return '/employee/dashboard';
  return '/dashboard';
}
