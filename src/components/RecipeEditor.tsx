import React from 'react';
import { Recipe } from '../types';
import { Droplets, TreePine, Wheat, Zap } from 'lucide-react';
import { motion } from 'motion/react';

interface Props {
  recipe: Recipe;
  onChange: (recipe: Recipe) => void;
}

export const RecipeEditor: React.FC<Props> = ({ recipe, onChange }) => {
  const updateField = (field: keyof Recipe, value: number) => {
    const newRecipe = { ...recipe, [field]: value };
    
    if (field === 'dung' || field === 'sawdust' || field === 'straw') {
      const otherFields = (['dung', 'sawdust', 'straw'] as const).filter(f => f !== field);
      const currentSum = newRecipe[field];
      const remaining = 100 - currentSum;
      const otherSum = recipe[otherFields[0]] + recipe[otherFields[1]];
      
      if (otherSum === 0) {
        newRecipe[otherFields[0]] = remaining / 2;
        newRecipe[otherFields[1]] = remaining / 2;
      } else {
        newRecipe[otherFields[0]] = (recipe[otherFields[0]] / otherSum) * remaining;
        newRecipe[otherFields[1]] = (recipe[otherFields[1]] / otherSum) * remaining;
      }
    }
    
    onChange(newRecipe);
  };

  const IngredientSlider = ({ icon: Icon, label, field, color, value }: any) => (
    <div className="space-y-3 group">
      <div className="flex justify-between items-center">
        <div className="flex items-center gap-2">
          <div className={`p-1.5 rounded-lg ${color} bg-opacity-10 text-opacity-100`}>
            <Icon size={14} className={color.replace('bg-', 'text-')} />
          </div>
          <span className="text-[11px] font-bold uppercase tracking-wider text-zinc-400 group-hover:text-zinc-200 transition-colors">
            {label}
          </span>
        </div>
        <span className="text-xs font-mono font-bold text-zinc-100">{value.toFixed(1)}%</span>
      </div>
      <input 
        type="range" 
        min="0" max="100" step="0.5"
        value={value}
        onChange={(e) => updateField(field, parseFloat(e.target.value))}
        className="w-full"
      />
    </div>
  );

  return (
    <div className="space-y-8">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Zap size={16} className="text-blue-400" />
          <h3 className="text-xs font-bold uppercase tracking-widest text-zinc-200">Material Composition</h3>
        </div>
        <div className="px-2 py-0.5 bg-white/5 rounded text-[10px] font-mono text-zinc-500">
          NORMALIZED
        </div>
      </div>

      <div className="space-y-6">
        <IngredientSlider 
          icon={Zap} 
          label="Cow Dung" 
          field="dung" 
          color="bg-emerald-500" 
          value={recipe.dung} 
        />
        <IngredientSlider 
          icon={TreePine} 
          label="Sawdust" 
          field="sawdust" 
          color="bg-blue-500" 
          value={recipe.sawdust} 
        />
        <IngredientSlider 
          icon={Wheat} 
          label="Straw / Husk" 
          field="straw" 
          color="bg-amber-500" 
          value={recipe.straw} 
        />

        <div className="pt-6 border-t border-white/5">
          <IngredientSlider 
            icon={Droplets} 
            label="Initial Moisture" 
            field="initialMoisture" 
            color="bg-cyan-500" 
            value={recipe.initialMoisture} 
          />
        </div>
      </div>

      <div className="grid grid-cols-3 gap-2">
        {(['dung', 'sawdust', 'straw'] as const).map(f => (
          <motion.div 
            key={f}
            className="h-1 rounded-full bg-zinc-800 overflow-hidden"
          >
            <motion.div 
              className={`h-full ${f === 'dung' ? 'bg-emerald-500' : f === 'sawdust' ? 'bg-blue-500' : 'bg-amber-500'}`}
              animate={{ width: `${recipe[f]}%` }}
            />
          </motion.div>
        ))}
      </div>
    </div>
  );
};
