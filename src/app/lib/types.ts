export type TransactionType = 'consumption' | 'addition' | 'adjustment';

export interface Material {
  id: string;
  name: string;
  project: string;
  lotNumber: string;
  storageLocations: string[];
  concentration: string;
  submissionDate: string;
  storageCondition: string;
  submittedVolume: number;
  unit: 'mL' | 'L' | 'mg' | 'g' | 'kg' | 'units' | 'µL' | 'vials' | 'bottles';
  currentQuantity: number;
  labelInfo: string;
  notes: string;
}

export interface Transaction {
  id: string;
  materialId: string;
  materialName: string;
  type: TransactionType;
  quantity: number;
  unit: string;
  timestamp: string;
  notes: string;
}
