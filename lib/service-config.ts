// Service duration configuration

export interface ServiceConfig {
  name: string;
  duration: 1 | 2; // hours
}

export const SERVICES: ServiceConfig[] = [
  // 1 hour services (60 minutes)
  { name: 'Präventive Kosmetische Fußpflege', duration: 1 },
  { name: 'Smart Pediküre', duration: 1 },
  { name: 'Klassische Fachfußpflege mit Peeling', duration: 1 },
  { name: 'Fußreflexzonenmassage', duration: 1 },
  { name: 'Kosmetische Nagelkorrektur', duration: 1 },
  { name: 'Shellac nur entfernen', duration: 1 },
  { name: 'Kosmetische Paraffinbehandlung', duration: 1 },

  // 2 hour service (120 minutes) - ONLY THIS ONE!
  { name: 'Nagelmodellage mit Gel', duration: 2 },
];

// Get service duration by name
export function getServiceDuration(serviceName: string): 1 | 2 {
  const service = SERVICES.find(s => s.name === serviceName);
  return service?.duration || 1; // default to 1 hour
}

// Get all 1-hour services
export function getOneHourServices(): string[] {
  return SERVICES.filter(s => s.duration === 1).map(s => s.name);
}

// Get all 2-hour services
export function getTwoHourServices(): string[] {
  return SERVICES.filter(s => s.duration === 2).map(s => s.name);
}

// Check if service is manicure (2 hours)
export function isManicureService(serviceName: string): boolean {
  return getServiceDuration(serviceName) === 2;
}
