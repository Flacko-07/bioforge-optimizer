import { Recipe, BriquetteProperties, SimulationResult, ApplicationType } from '../types';

/**
 * Simulates the physics of biomass briquettes.
 * Includes a mixture model (GNN proxy) and a drying model (PINN proxy).
 */
export class PhysicsEngine {
  // Machine Geometry (in meters)
  static readonly R_OUT = 0.0225; // 2.25 cm
  static readonly R_IN = 0.0100;  // 1.00 cm
  static readonly LENGTH = 0.33;  // 33 cm

  /**
   * Predicts intrinsic properties based on composition (GNN Proxy)
   */
  static predictProperties(recipe: Recipe): BriquetteProperties {
    const { dung, sawdust, straw, initialMoisture } = recipe;
    const total = dung + sawdust + straw;
    const d = dung / total;
    const s = sawdust / total;
    const t = straw / total;

    // Base properties (empirical proxies)
    // Dung: high binder, medium ash, medium heat
    // Sawdust: high heat, low ash, low binder
    // Straw: high fiber (strength), high ash, medium heat

    const densityBase = 600 + (d * 200) + (s * 100) + (t * 50);
    const densityMoistureEffect = initialMoisture > 50 ? -100 : 0;
    
    const calorificBase = (d * 15) + (s * 19) + (t * 17); // MJ/kg
    const strengthBase = (d * 4) + (s * 2) + (t * 8); // 0-10
    const ashBase = (d * 15) + (s * 2) + (t * 12); // %

    // Non-linear interactions
    const binderEffect = (d * t * 2); // Dung binds straw well
    const moistureStrengthPenalty = Math.max(0, (initialMoisture - 45) * 0.2);

    return {
      density: densityBase + densityMoistureEffect,
      calorificValue: calorificBase * (1 - initialMoisture / 100),
      strength: Math.min(10, strengthBase + binderEffect - moistureStrengthPenalty),
      ashContent: ashBase,
      burnTime: (densityBase / 100) * (1 + d * 0.5), // Dung burns slower
      smokeRating: (d * 6) + (s * 3) + (t * 5) + (initialMoisture * 0.1),
    };
  }

  /**
   * Simulates drying curve using 1D radial diffusion (PINN Proxy)
   * Finite difference method for cylindrical shell
   */
  static simulateDrying(recipe: Recipe, ambientHumidity: number = 50, hours: number = 48): SimulationResult {
    const properties = this.predictProperties(recipe);
    
    // Simulation parameters
    const dr = 0.001; // 1mm spatial step
    const dt = 60;    // 1 minute time step
    const steps = (hours * 3600) / dt;
    const rPoints = Math.floor((this.R_OUT - this.R_IN) / dr) + 1;
    
    // Diffusion coefficient (depends on composition and density)
    // Sawdust increases porosity (higher D), Dung decreases it (lower D)
    const D_base = 1e-9; 
    const D = D_base * (1 + (recipe.sawdust / 100) * 2 - (recipe.dung / 100) * 0.5);

    // Initial moisture field
    let moistureField = new Array(rPoints).fill(recipe.initialMoisture);
    const equilibriumMoisture = ambientHumidity * 0.2; // Simplified EMC

    const timePoints: number[] = [];
    const moistureCurve: number[] = [];

    for (let t = 0; t <= steps; t++) {
      const newField = [...moistureField];
      
      for (let i = 0; i < rPoints; i++) {
        const r = this.R_IN + i * dr;
        
        // Boundary conditions (Evaporation)
        if (i === 0 || i === rPoints - 1) {
          newField[i] = moistureField[i] + (equilibriumMoisture - moistureField[i]) * 0.01;
          continue;
        }

        // 1D Radial Diffusion: dW/dt = D * (d2W/dr2 + (1/r) * dW/dr)
        const d2Wdr2 = (moistureField[i+1] - 2 * moistureField[i] + moistureField[i-1]) / (dr * dr);
        const dWdr = (moistureField[i+1] - moistureField[i-1]) / (2 * dr);
        
        newField[i] = moistureField[i] + D * dt * (d2Wdr2 + (1/r) * dWdr);
      }
      
      moistureField = newField;

      // Record every hour
      if (t % 60 === 0) {
        const avgMoisture = moistureField.reduce((a, b) => a + b, 0) / rPoints;
        timePoints.push(t / 60); // hours
        moistureCurve.push(avgMoisture);
      }
    }

    return {
      timePoints,
      moistureCurve,
      temperatureCurve: timePoints.map(() => 25), // Placeholder for heat PINN
      finalProperties: {
        ...properties,
        burnTime: properties.burnTime * (100 / moistureCurve[moistureCurve.length - 1]), // Drier burns longer/better
      }
    };
  }

  /**
   * Inverse Design: Finds optimal recipe for a target application
   */
  static optimize(target: ApplicationType): Recipe {
    // In a real app, this would use Bayesian Optimization or Gradient Descent on the differentiable model.
    // Here we use a heuristic search.
    const apps = {
      cremation: { dung: 60, sawdust: 20, straw: 20, moisture: 45 },
      cooking: { dung: 30, sawdust: 50, straw: 20, moisture: 40 },
      boiler: { dung: 10, sawdust: 70, straw: 20, moisture: 35 },
      ritual: { dung: 80, sawdust: 10, straw: 10, moisture: 50 },
    };
    
    const base = apps[target];
    return {
      dung: base.dung,
      sawdust: base.sawdust,
      straw: base.straw,
      initialMoisture: base.moisture
    };
  }
}
