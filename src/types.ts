export type CountryCode = 'KE' | 'UG' | 'NG';

export type RoadClass = 'national' | 'urban' | 'rural' | 'local';

export interface RoadAuthority {
  code: string;
  name: string;
  shortName: string;
  roadClass: RoadClass;
  mandate: string;
  oversightBody: string;
  fundingMechanism: string;
  structuralNote?: string;
}

export interface ComplaintsBody {
  name: string;
  shortName: string;
  mandate: string;
  address: string;
  phones: string[];
  tollFree?: string;
  whatsapp?: string;
  email: string;
  website: string;
  feeNotice: string;
}

export interface CountryInfo {
  code: CountryCode;
  name: string;
  demonym: string;
  currency: string;
  currencySymbol: string;
  fxRateToUsd: number; // e.g. 129 KES per USD
  fxNote: string;
  flagColors: {
    stripe1: string;
    stripe2: string;
    stripe3: string;
  };
  nationalMotto?: string;
  authorities: Record<RoadClass, RoadAuthority>;
  complaintsBody: ComplaintsBody;
  governanceInsight: {
    title: string;
    summary: string;
    oversightStructure: string;
  };
}

export type ProjectStatus = 'completed' | 'under_construction' | 'delayed' | 'stalled';

export interface RoadProject {
  id: string;
  countryCode: CountryCode;
  name: string;
  roadClass: RoadClass;
  lengthKm: number;
  budgetLocal: number; // In base local currency units (e.g. 17,300,000,000 for KES 17.3B)
  budgetDisplay: string;
  fundingSource: string;
  contractorOrPartner?: string;
  awardYear?: number;
  targetCompletionYear?: number;
  status: ProjectStatus;
  statusNotes: string;
  isFlagshipReal: boolean; // true = real publicly documented project; false = illustrative demo
  sourceCitation: string;
  delayAlert?: string;
}

export interface BenchmarkBand {
  minUsdPerKm: number; // in USD (not millions)
  maxUsdPerKm: number;
  label: string;
  description: string;
}

export type CostVerdict = 'normal' | 'above_typical' | 'below_typical';

export interface BenchmarkAnalysis {
  costPerKmLocal: number;
  costPerKmUsd: number;
  band: BenchmarkBand;
  verdict: CostVerdict;
  verdictTitle: string;
  verdictExplanation: string;
  ratioToBandMin: number;
  ratioToBandMax: number;
  percentInBand: number; // 0 to 100 or >100
  isAnomalous: boolean;
  hasDeliveryDelay: boolean;
  delayNotice?: string;
}

export type CitizenVerdict = 'matches' | 'partial' | 'not_done';

export interface CitizenReport {
  id: string;
  projectId: string;
  countryCode: CountryCode;
  roadName: string;
  verdict: CitizenVerdict;
  note?: string;
  reporterLocation?: string;
  timestamp: number;
}

export interface ProjectTally {
  matches: number;
  partial: number;
  notDone: number;
  total: number;
  confidenceScore: number; // 0 - 100%
}
