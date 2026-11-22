import type { GarbageSize, Severity, Vehicle, WasteCategory, Analysis, Incident } from './types';

export const STORAGE_KEY = 'nirmala_nagara_incidents';

export function getIncidents(): Incident[] {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    return raw ? JSON.parse(raw) : [];
  } catch {
    return [];
  }
}

/** Returns false if the browser refused to store it (e.g. storage quota exceeded). */
export function saveIncident(incident: Incident): boolean {
  const incidents = getIncidents();
  incidents.unshift(incident);
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(incidents));
    return true;
  } catch {
    return false;
  }
}

export function markResolved(id: string): void {
  const incidents = getIncidents();
  const idx = incidents.findIndex(i => i.id === id);
  if (idx !== -1) {
    incidents[idx].status = 'Resolved';
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(incidents));
    } catch {
      // ignore storage failures; the UI re-reads from storage
    }
  }
}

export function getVehicle(size: GarbageSize): Vehicle {
  if (size === 'Small') return 'Handcart';
  if (size === 'Medium') return 'Mini pickup';
  return 'Tipper truck';
}

export function getSeverity(size: GarbageSize): Severity {
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
    imageUrl: `${import.meta.env.BASE_URL}samples/sample1.svg`,
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
    imageUrl: `${import.meta.env.BASE_URL}samples/sample2.svg`,
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
    imageUrl: `${import.meta.env.BASE_URL}samples/sample3.svg`,
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

export function buildExplanation(size: GarbageSize, wasteCategory: WasteCategory): string {
  return `${size} pile of ${wasteCategory.toLowerCase()} detected. ${
    size === 'Small'
      ? 'A handcart operator can clear this quickly.'
      : size === 'Medium'
      ? 'A mini pickup truck is needed to remove this waste.'
      : 'This large accumulation requires a tipper truck for safe removal.'
  }`;
}

export function analyzeUserImage(size: GarbageSize, wasteCategory: WasteCategory): Analysis {
  return {
    garbageDetected: true,
    wasteCategory,
    size,
    severity: getSeverity(size),
    vehicle: getVehicle(size),
    explanation: buildExplanation(size, wasteCategory),
    isSimulated: false,
  };
}

/** Re-derive severity/vehicle/notes after the citizen corrects size or category. */
export function reclassify(analysis: Analysis, size: GarbageSize, wasteCategory: WasteCategory): Analysis {
  return {
    ...analysis,
    size,
    wasteCategory,
    severity: getSeverity(size),
    vehicle: getVehicle(size),
    explanation: buildExplanation(size, wasteCategory),
  };
}

/** Downscale a photo so it fits in localStorage (phone photos are several MB). */
export function compressImage(dataUrl: string, maxDim = 800, quality = 0.7): Promise<string> {
  return new Promise((resolve) => {
    const img = new Image();
    img.onload = () => {
      const scale = Math.min(1, maxDim / Math.max(img.width, img.height));
      const canvas = document.createElement('canvas');
      canvas.width = Math.round(img.width * scale);
      canvas.height = Math.round(img.height * scale);
      const ctx = canvas.getContext('2d');
      if (!ctx) return resolve(dataUrl);
      ctx.drawImage(img, 0, 0, canvas.width, canvas.height);
      resolve(canvas.toDataURL('image/jpeg', quality));
    };
    img.onerror = () => resolve(dataUrl);
    img.src = dataUrl;
  });
}

export const BENGALURU_LOCALITIES = [
  'Indiranagar', 'Koramangala', 'Whitefield', 'HSR Layout', 'Jayanagar',
  'Rajajinagar', 'Malleshwaram', 'Bellandur', 'Hebbal', 'Yeshwanthpur',
  'BTM Layout', 'Electronic City', 'Marathahalli', 'Sadashivanagar',
  'Basavanagudi', 'Yelahanka', 'JP Nagar', 'Banashankari', 'Vijayanagar',
  'KR Puram', 'Ulsoor', 'Shivajinagar', 'Frazer Town', 'Cox Town',
];
