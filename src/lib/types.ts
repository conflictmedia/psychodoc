// Psychoactive Substances Documentation - Type Definitions

export interface RouteDosageDuration {
  dosage: {
    threshold: string;
    light: string;
    common: string;
    strong: string;
    heavy: string;
  };
  duration: {
    onset: string;
    comeup: string;
    peak: string;
    offset: string;
    total: string;
  };
  notes?: string;
}

export interface Substance {
  id: string;
  name: string;
  commonNames: string[];
  categories: SubstanceCategory[];
  
  class: string;
  description: string;
  dosage?: {} 
  effects: {
    positive: string[];
    neutral: string[];
    negative: string[];
  };
  routeData?: Record<string, RouteDosageDuration>;
  interactions: string[];
  harmReduction: string[];
  legality: string;
  chemistry: {
    formula: string;
    molecularWeight: string;
    class: string;
  };
  history: string;
  routes?: string[];
  afterEffects: string;
  riskLevel: 'low' | 'moderate' | 'high' | 'very-high';
  aliases: string[];
}

export type SubstanceCategory = 
  | 'stimulants'
  | 'depressants'
  | 'hallucinogens'
  | 'dissociatives'
  | 'empathogens'
  | 'cannabinoids'
  | 'opioids'
  | 'deliriants'
  | 'nootropics'
  | 'other';

export interface CategoryInfo {
  id: SubstanceCategory;
  name: string;
  description: string;
  icon: string;
  color: string;
}
