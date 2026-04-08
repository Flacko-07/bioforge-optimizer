/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { useState, useEffect } from 'react';
import { Recipe, ApplicationType, SimulationResult, OrderRecord } from './types';
import { PhysicsEngine } from './lib/physics';
import { RecipeEditor } from './components/RecipeEditor';
import { PhysicsDashboard } from './components/PhysicsDashboard';
import { OptimizerPanel } from './components/OptimizerPanel';
import { OrderForm, type OrderInput } from './components/OrderForm';
import { Cpu, Activity, Settings, Info, Sparkles } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

export default function App() {
  const [recipe, setRecipe] = useState<Recipe>({
    dung: 40,
    sawdust: 40,
    straw: 20,
    initialMoisture: 45,
  });

  const [selectedApp, setSelectedApp] = useState<ApplicationType>('cremation');
  const [simulation, setSimulation] = useState<SimulationResult | null>(null);

  useEffect(() => {
    const result = PhysicsEngine.simulateDrying(recipe);
    setSimulation(result);
  }, [recipe]);

  const handleOptimize = () => {
    const optimal = PhysicsEngine.optimize(selectedApp);
    setRecipe(optimal);
  };

  const handleSubmitOrder = async (input: OrderInput) => {
    const order: OrderRecord = {
      id: crypto.randomUUID(),
      createdAt: new Date().toISOString(),
      status: 'pending',
      recipe,
      application: input.application,
      customer: {
        fullName: input.fullName,
        phone: input.phone,
        organization: input.organization || undefined,
        location: input.location,
      },
      quantityKg: input.quantityKg,
      notes: input.notes || undefined,
    };

    try {
      const res = await fetch('/api/orders', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(order),
      });

      if (!res.ok) {
        console.error('[BioForge] Order API failed', await res.text());
      }
    } catch (err) {
      console.error('[BioForge] Network error sending order', err);
    }
  };

  return (
    <div className="min-h-screen flex flex-col selection:bg-blue-500/30">
      {/* GNOME Headerbar - Refined */}
      <header className="header-bar">
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 bg-blue-500 rounded-lg flex items-center justify-center shadow-lg shadow-blue-500/20">
              <Cpu className="text-white" size={18} />
            </div>
            <div className="hidden sm:block">
              <h1 className="text-sm font-bold tracking-tight">BioForge</h1>
              <span className="text-[10px] text-zinc-500 font-medium block -mt-1">Optimizer Pro</span>
            </div>
          </div>
        </div>

        <div className="absolute left-1/2 -translate-x-1/2 flex flex-col items-center">
          <div className="flex items-center gap-2 px-4 py-1.5 bg-white/5 rounded-full border border-white/10">
            <Sparkles size={12} className="text-blue-400" />
            <span className="text-[11px] font-bold uppercase tracking-wider text-zinc-300">BioForge Optimizer</span>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <div className="hidden md:flex items-center gap-2 px-3 py-1.5 bg-emerald-500/10 rounded-full border border-emerald-500/20">
            <Activity size={12} className="text-emerald-500" />
            <span className="text-[10px] font-bold uppercase text-emerald-500">System Ready</span>
          </div>
          <button className="gnome-btn gnome-btn-secondary !p-2.5">
            <Settings size={18} />
          </button>
          <button className="gnome-btn gnome-btn-secondary !p-2.5">
            <Info size={18} />
          </button>
        </div>
      </header>

      <main className="flex-1 p-6 lg:p-10 max-w-[1600px] mx-auto w-full">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          {/* Left Column - Controls */}
          <motion.aside
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            className="lg:col-span-4 space-y-8"
          >
            <div className="gnome-card">
              <RecipeEditor recipe={recipe} onChange={setRecipe} />
            </div>

            <div className="gnome-card">
              <OptimizerPanel
                selectedApp={selectedApp}
                onSelect={setSelectedApp}
                onOptimize={handleOptimize}
              />
            </div>

            <div className="gnome-card">
              <OrderForm recipe={recipe} application={selectedApp} onSubmit={handleSubmitOrder} />
            </div>
          </motion.aside>

          {/* Right Column - Results */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="lg:col-span-8"
          >
            <AnimatePresence mode="wait">
              <motion.div
                key={JSON.stringify(recipe)}
                initial={{ opacity: 0, scale: 0.98 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 1.02 }}
                transition={{ duration: 0.3 }}
                className="gnome-card min-h-[600px]"
              >
                {simulation && <PhysicsDashboard result={simulation} />}
              </motion.div>
            </AnimatePresence>
          </motion.div>
        </div>
      </main>

      {/* GNOME Status Bar - Refined */}
      <footer className="h-10 bg-black/20 backdrop-blur-sm border-t border-white/5 flex items-center justify-between px-8 text-[11px] font-medium text-zinc-500">
        <div className="flex gap-6 items-center">
          <div className="flex items-center gap-2">
            <span className="w-1.5 h-1.5 rounded-full bg-blue-500 shadow-[0_0_8px_rgba(53,132,228,0.5)]" />
            <span>BioForge v2.1.4</span>
          </div>
          <span className="text-zinc-800">|</span>
          <div className="flex items-center gap-2">
            <span className="text-zinc-400">Motor Load</span>
            <div className="w-24 h-1 bg-white/5 rounded-full overflow-hidden">
              <motion.div
                className="h-full bg-blue-500"
                animate={{ width: ['40%', '45%', '42%'] }}
                transition={{ duration: 2, repeat: Infinity }}
              />
            </div>
          </div>
        </div>
        <div className="flex gap-6 items-center">
          <span className="text-zinc-600">UTC: {new Date().toISOString().split('T')[1].split('.')[0]}</span>
          <div className="flex gap-1.5">
            <div className="w-1 h-3 bg-emerald-500/40 rounded-full" />
            <div className="w-1 h-3 bg-emerald-500/60 rounded-full" />
            <div className="w-1 h-3 bg-emerald-500 rounded-full" />
          </div>
        </div>
      </footer>
    </div>
  );
}
