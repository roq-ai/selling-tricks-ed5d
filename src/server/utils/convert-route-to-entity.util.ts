const mapping: Record<string, string> = {
  'automation-features': 'automation_feature',
  companies: 'company',
  'performance-evaluations': 'performance_evaluation',
  'time-trackings': 'time_tracking',
  users: 'user',
};

export function convertRouteToEntityUtil(route: string) {
  return mapping[route] || route;
}
