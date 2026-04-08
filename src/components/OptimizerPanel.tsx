import React from 'react';
import { APPLICATIONS, ApplicationType } from '../types';
import { Target, Zap, ChevronRight } from 'lucide-react';
import { motion } from 'motion/react';

interface Props {
  selectedApp: ApplicationType;
  onSelect: (app: ApplicationType) => void;
  onOptimize: () => void;
}

export const OptimizerPanel: React.FC<Props> = ({ selectedApp, onSelect, onOptimize }) => {
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Target className="text-blue-500" size={18} />
          <h3 className="text-xs font-bold uppercase tracking-widest text-zinc-200">Application Optimizer</h3>
        </div>
        <div className="w-2 h-2 rounded-full bg-blue-500 animate-ping" />
      </div>

      <div className="grid grid-cols-1 gap-3">
        {APPLICATIONS.map((app, index) => (
          <motion.button
            key={app.id}
            initial={{ opacity: 0, x: -10 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: index * 0.05 }}
            onClick={() => onSelect(app.id)}
            className={`text-left p-4 rounded-2xl border transition-all relative overflow-hidden group ${
              selectedApp === app.id
                ? 'bg-blue-500/10 border-blue-500/40 shadow-lg shadow-blue-500/5'
                : 'bg-white/5 border-white/5 hover:border-white/10 hover:bg-white/[0.08]'
            }`}
          >
            {selectedApp === app.id && (
              <motion.div 
                layoutId="active-bg"
                className="absolute inset-0 bg-gradient-to-r from-blue-500/10 to-transparent pointer-events-none"
              />
            )}
            
            <div className="flex justify-between items-center mb-2 relative z-10">
              <span className={`text-[11px] font-bold uppercase tracking-wider ${
                selectedApp === app.id ? 'text-blue-400' : 'text-zinc-400 group-hover:text-zinc-300'
              }`}>
                {app.name}
              </span>
              <div className={`transition-transform duration-300 ${selectedApp === app.id ? 'translate-x-0 opacity-100' : '-translate-x-2 opacity-0 group-hover:translate-x-0 group-hover:opacity-100'}`}>
                <ChevronRight size={14} className={selectedApp === app.id ? 'text-blue-400' : 'text-zinc-500'} />
              </div>
            </div>
            <p className="text-[10px] text-zinc-500 leading-relaxed relative z-10 group-hover:text-zinc-400 transition-colors">
              {app.description}
            </p>
          </motion.button>
        ))}
      </div>

      <motion.button
        whileHover={{ scale: 1.02 }}
        whileTap={{ scale: 0.98 }}
        onClick={onOptimize}
        className="w-full py-4 bg-blue-600 hover:bg-blue-500 text-white font-bold text-[11px] uppercase tracking-[0.2em] rounded-2xl shadow-xl shadow-blue-600/20 transition-all flex items-center justify-center gap-3 group"
      >
        <Zap size={16} className="group-hover:animate-pulse" />
        Generate Optimal Mix
      </motion.button>
    </div>
  );
};
