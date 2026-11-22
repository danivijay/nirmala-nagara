export type Severity = 'Low' | 'Medium' | 'High';
export type GarbageSize = 'Small' | 'Medium' | 'Large';
export type Vehicle = 'Handcart' | 'Mini pickup' | 'Tipper truck';
export type WasteCategory = 'Mixed Waste' | 'Organic Waste' | 'Construction Debris' | 'Plastic/Dry Waste' | 'Bulky Waste';
export type ReportStatus = 'Pending' | 'Resolved';

export interface Analysis {
  garbageDetected: boolean;
  wasteCategory: WasteCategory;
  size: GarbageSize;
  severity: Severity;
  vehicle: Vehicle;
  explanation: string;
  isSimulated: boolean;
}

export interface Incident {
  id: string;
  imageDataUrl: string;
  location: string;
  analysis: Analysis;
  status: ReportStatus;
  createdAt: string;
}
