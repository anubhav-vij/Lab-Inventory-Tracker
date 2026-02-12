export type TransactionType = 'consumption' | 'addition' | 'adjustment';

export type MaterialUnit = 'mL' | 'L' | 'mg' | 'g' | 'kg' | 'units' | 'µL' | 'vials' | 'bottles';

export interface Aliquot {
  id: string;
  count: number;
  size: number;
  unit: MaterialUnit;
}

export interface StorageEntry {
  id: string;
  location: string;
  aliquots: Aliquot[];
}

export interface Material {
  id: string;
  name: string;
  project: string;
  lotNumber: string;
  storageEntries: StorageEntry[];
  concentration: string;
  submissionDate: string;
  storageCondition: string;
  submittedVolume: number;
  unit: MaterialUnit;
  retainAmount: number;
  retainUnit: MaterialUnit;
  currentQuantity: number;
  labelInfo: string;
  notes: string;
}

export interface Transaction {
  id: string;
  materialId: string;
  materialName: string;
  lotNumber: string;
  type: TransactionType;
  quantity: number;
  unit: string;
  timestamp: string; // User-selected transaction date
  recordedAt: string; // System time
  recipient: string;
  aliquots: Aliquot[];
  notes: string;
}
