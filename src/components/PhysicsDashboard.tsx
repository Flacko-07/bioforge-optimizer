import React from 'react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, AreaChart, Area } from 'recharts';
import { SimulationResult } from '../types';
import { Flame, Weight, Shield, Wind, Trash2, Timer, TrendingDown } from 'lucide-react';
import { motion } from 'motion/react';

interface Props {
  result: SimulationResult;
}

export const PhysicsDashboard: React.FC<Props> = ({ result }) => {
  const chartData = result.timePoints.map((t, i) => ({
    time: t,
    moisture: result.moistureCurve[i],
  }));

  const props = result.finalProperties;

  const PropertyCard = ({ icon: Icon, label, value, unit, color, delay }: any) => (
    <motion.div 
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay }}
      className="bg-white/5 p-5 rounded-2xl border border-white/5 flex flex-col justify-between hover:bg-white/[0.08] transition-colors group"
    >
      <div className="flex items-center justify-between mb-4">
        <div className={`p-2 rounded-xl bg-opacity-10 ${color.replace('text-', 'bg-')}`}>
          <Icon size={18} className={color} />
        </div>
        <div className="text-[10px] font-bold uppercase tracking-widest text-zinc-500 group-hover:text-zinc-400 transition-colors">
          {label}
        </div>
      </div>
      <div className="flex items-baseline gap-1.5">
        <span className={`text-2xl font-mono font-bold tracking-tight ${color}`}>{value.toFixed(1)}</span>
        <span className="text-[10px] font-bold text-zinc-600 uppercase tracking-wider">{unit}</span>
      </div>
    </motion.div>
  );

  return (
    <div className="space-y-8">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-emerald-500/10 rounded-xl flex items-center justify-center border border-emerald-500/20">
            <TrendingDown className="text-emerald-500" size={20} />
          </div>
          <div>
            <h3 className="text-sm font-bold text-zinc-100">Simulation Analysis</h3>
            <p className="text-[10px] text-zinc-500 font-medium uppercase tracking-wider">Physics-Informed Neural Network Output</p>
          </div>
        </div>
        <div className="flex gap-2">
          <div className="px-3 py-1 bg-white/5 rounded-full border border-white/10 text-[10px] font-bold text-zinc-400">
            SOLVER: RADIAL_DIFF_V2
          </div>
        </div>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
        <PropertyCard icon={Weight} label="Density" value={props.density} unit="kg/m³" color="text-zinc-100" delay={0.1} />
        <PropertyCard icon={Flame} label="Calorific" value={props.calorificValue} unit="MJ/kg" color="text-orange-400" delay={0.2} />
        <PropertyCard icon={Shield} label="Strength" value={props.strength} unit="/10" color="text-blue-400" delay={0.3} />
        <PropertyCard icon={Timer} label="Burn Time" value={props.burnTime} unit="min" color="text-emerald-400" delay={0.4} />
        <PropertyCard icon={Trash2} label="Ash Content" value={props.ashContent} unit="%" color="text-zinc-400" delay={0.5} />
        <PropertyCard icon={Wind} label="Smoke Rating" value={props.smokeRating} unit="/10" color="text-zinc-500" delay={0.6} />
      </div>

      <div className="bg-black/20 p-8 rounded-3xl border border-white/5 h-[350px] relative overflow-hidden group">
        <div className="absolute top-0 left-0 w-full h-full bg-gradient-to-b from-emerald-500/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none" />
        
        <div className="flex items-center justify-between mb-8 relative z-10">
          <div>
            <h3 className="text-xs font-bold uppercase tracking-widest text-zinc-400">Drying Kinetics</h3>
            <p className="text-[10px] text-zinc-600 font-medium">Moisture Content vs. Time (Hours)</p>
          </div>
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-2">
              <div className="w-2 h-2 rounded-full bg-emerald-500" />
              <span className="text-[10px] font-bold text-zinc-500 uppercase">Moisture %</span>
            </div>
          </div>
        </div>

        <div className="h-[220px] w-full relative z-10">
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={chartData}>
              <defs>
                <linearGradient id="colorMoisture" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#10b981" stopOpacity={0.3}/>
                  <stop offset="95%" stopColor="#10b981" stopOpacity={0}/>
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="#ffffff05" vertical={false} />
              <XAxis 
                dataKey="time" 
                stroke="#52525b" 
                fontSize={10} 
                tickFormatter={(t) => `${t}h`}
                axisLine={false}
                tickLine={false}
              />
              <YAxis 
                stroke="#52525b" 
                fontSize={10} 
                tickFormatter={(v) => `${v}%`}
                axisLine={false}
                tickLine={false}
              />
              <Tooltip 
                contentStyle={{ 
                  backgroundColor: '#1a1a1a', 
                  border: '1px solid rgba(255,255,255,0.1)', 
                  borderRadius: '12px',
                  fontSize: '10px', 
                  fontFamily: 'monospace',
                  boxShadow: '0 10px 15px -3px rgba(0,0,0,0.5)'
                }}
                itemStyle={{ color: '#10b981' }}
                cursor={{ stroke: '#10b981', strokeWidth: 1, strokeDasharray: '4 4' }}
              />
              <Area 
                type="monotone" 
                dataKey="moisture" 
                stroke="#10b981" 
                strokeWidth={3} 
                fillOpacity={1} 
                fill="url(#colorMoisture)" 
                animationDuration={1500}
              />
            </AreaChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  );
};
