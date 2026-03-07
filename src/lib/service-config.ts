// Service duration configuration

export interface ServiceConfig {
  name: string;
  duration: 1 | 2; // hours
}

export const SERVICES: ServiceConfig[] = [
  // 1 hour services
  { name: 'Smart Pediküre', duration: 1 },
  { name: 'Klassische Fußpflege', duration: 1 },
  { name: 'Verwöhnpaket', duration: 1 },
  { name: 'Kosmetische Nagelkorrektur', duration: 1 },
  { name: 'Maniküre', duration: 1 },
  { name: 'Japanische Maniküre', duration: 1 },

  // 2 hour services
  { name: 'Neumodellage / Gel / Tips', duration: 2 },
  { name: 'Auffüllen / Refill bis 4 Wochen', duration: 2 },
  { name: 'Auffüllen / Refill ab 5 Wochen', duration: 2 },
  { name: 'Mehrere Leistungen', duration: 2 },
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
