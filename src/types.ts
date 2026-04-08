export type BiomassType = 'dung' | 'sawdust' | 'straw';

export interface Recipe {
  dung: number; // percentage 0-100
  sawdust: number; // percentage 0-100
  straw: number; // percentage 0-100
  initialMoisture: number; // percentage 0-100
}

export interface BriquetteProperties {
  density: number; // kg/m3
  calorificValue: number; // MJ/kg
  strength: number; // 0-10 scale
  ashContent: number; // percentage
  burnTime: number; // minutes
  smokeRating: number; // 0-10 scale (lower is better)
}

export interface SimulationResult {
  timePoints: number[];
  moistureCurve: number[];
  temperatureCurve: number[];
  finalProperties: BriquetteProperties;
}

export type ApplicationType = 'cremation' | 'cooking' | 'boiler' | 'ritual';

export interface ApplicationTarget {
  id: ApplicationType;
  name: string;
  description: string;
  priorities: {
    burnTime: number;
    strength: number;
    heat: number;
    lowSmoke: number;
    lowAsh: number;
  };
}

export interface OrderRecord {
  id: string;
  createdAt: string;
  status: 'pending' | 'confirmed' | 'fulfilled';
  recipe: Recipe;
  application: ApplicationType;
  customer: {
    fullName: string;
    phone: string;
    organization?: string;
    location: string;
  };
  quantityKg: number;
  notes?: string;
}

export const APPLICATIONS: ApplicationTarget[] = [
  {
    id: 'cremation',
    name: 'Cremation',
    description: 'Requires long burn time and high structural strength. Ash is less critical.',
    priorities: { burnTime: 1.0, strength: 0.8, heat: 0.7, lowSmoke: 0.3, lowAsh: 0.1 }
  },
  {
    id: 'cooking',
    name: 'Cooking/Domestic',
    description: 'Requires low smoke, stable flame, and moderate ash.',
    priorities: { burnTime: 0.5, strength: 0.4, heat: 0.6, lowSmoke: 1.0, lowAsh: 0.8 }
  },
  {
    id: 'boiler',
    name: 'Industrial Boiler',
    description: 'High calorific value and low ash to prevent slagging.',
    priorities: { burnTime: 0.4, strength: 0.3, heat: 1.0, lowSmoke: 0.5, lowAsh: 0.9 }
  },
  {
    id: 'ritual',
    name: 'Ritual/Havan',
    description: 'Clean burning, traditional materials (high dung%), low smoke.',
    priorities: { burnTime: 0.3, strength: 0.2, heat: 0.4, lowSmoke: 0.9, lowAsh: 0.5 }
  }
];
