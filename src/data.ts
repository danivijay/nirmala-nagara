import type { GarbageSize, Severity, Vehicle, WasteCategory, Analysis, Incident } from './types';

const STORAGE_KEY = 'nirmala_nagara_incidents';

export function getIncidents(): Incident[] {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    return raw ? JSON.parse(raw) : [];
  } catch {
    return [];
  }
}

export function saveIncident(incident: Incident): void {
  const incidents = getIncidents();
  incidents.unshift(incident);
  localStorage.setItem(STORAGE_KEY, JSON.stringify(incidents));
}

export function markResolved(id: string): void {
  const incidents = getIncidents();
  const idx = incidents.findIndex(i => i.id === id);
  if (idx !== -1) {
    incidents[idx].status = 'Resolved';
    localStorage.setItem(STORAGE_KEY, JSON.stringify(incidents));
  }
}

function getVehicle(size: GarbageSize): Vehicle {
  if (size === 'Small') return 'Handcart';
  if (size === 'Medium') return 'Mini pickup';
  return 'Tipper truck';
}

function getSeverity(size: GarbageSize): Severity {
  if (size === 'Small') return 'Low';
  if (size === 'Medium') return 'Medium';
  return 'High';
}

// Sample scenarios for demo mode
export const SAMPLE_SCENARIOS: {
  label: string;
  imageUrl: string;
  analysis: Analysis;
}[] = [
  {
    label: 'Roadside Plastic Bags',
    imageUrl: '/samples/sample1.svg',
    analysis: {
      garbageDetected: true,
      wasteCategory: 'Plastic/Dry Waste',
      size: 'Small',
      severity: 'Low',
      vehicle: 'Handcart',
      explanation: 'Small pile of plastic bags and wrappers detected near footpath. Can be cleared by a handcart operator.',
      isSimulated: true,
    },
  },
  {
    label: 'Mixed Waste Pile',
    imageUrl: '/samples/sample2.svg',
    analysis: {
      garbageDetected: true,
      wasteCategory: 'Mixed Waste',
      size: 'Medium',
      severity: 'Medium',
      vehicle: 'Mini pickup',
      explanation: 'Medium-sized mixed waste accumulation detected. Household garbage mixed with packaging material. Requires a mini pickup truck.',
      isSimulated: true,
    },
  },
  {
    label: 'Construction Debris',
    imageUrl: '/samples/sample3.svg',
    analysis: {
      garbageDetected: true,
      wasteCategory: 'Construction Debris',
      size: 'Large',
      severity: 'High',
      vehicle: 'Tipper truck',
      explanation: 'Large construction debris dump detected. Rubble, bricks and debris require heavy machinery for removal. Tipper truck dispatch recommended.',
      isSimulated: true,
    },
  },
];

export function analyzeUserImage(size: GarbageSize, wasteCategory: WasteCategory): Analysis {
  return {
    garbageDetected: true,
    wasteCategory,
    size,
    severity: getSeverity(size),
    vehicle: getVehicle(size),
    explanation: `${size} pile of ${wasteCategory.toLowerCase()} detected. ${
      size === 'Small'
        ? 'A handcart operator can clear this quickly.'
        : size === 'Medium'
        ? 'A mini pickup truck is needed to remove this waste.'
        : 'This large accumulation requires a tipper truck for safe removal.'
    }`,
    isSimulated: false,
  };
}

export const BENGALURU_LOCALITIES = [
  'Indiranagar', 'Koramangala', 'Whitefield', 'HSR Layout', 'Jayanagar',
  'Rajajinagar', 'Malleshwaram', 'Bellandur', 'Hebbal', 'Yeshwanthpur',
  'BTM Layout', 'Electronic City', 'Marathahalli', 'Sadashivanagar',
  'Basavanagudi', 'Yelahanka', 'JP Nagar', 'Banashankari', 'Vijayanagar',
  'KR Puram', 'Ulsoor', 'Shivajinagar', 'Frazer Town', 'Cox Town',
];
