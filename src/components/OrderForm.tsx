import { useState, type FormEvent } from 'react';
import type { ApplicationType, Recipe } from '../types';
import { ClipboardList, Send, User, Phone, MapPin, Package } from 'lucide-react';

export interface OrderFormProps {
  recipe: Recipe;
  application: ApplicationType;
  onSubmit: (order: OrderInput) => void;
}

export interface OrderInput {
  fullName: string;
  phone: string;
  organization?: string;
  location: string;
  quantityKg: number;
  application: ApplicationType;
  notes?: string;
}

export function OrderForm({ recipe, application, onSubmit }: OrderFormProps) {
  const [form, setForm] = useState<OrderInput>({
    fullName: '',
    phone: '',
    organization: '',
    location: '',
    quantityKg: 50,
    application,
    notes: '',
  });
  const [submitted, setSubmitted] = useState(false);

  const handleChange = (field: keyof OrderInput, value: string | number) => {
    setForm(prev => ({ ...prev, [field]: value }));
    if (submitted) setSubmitted(false);
  };

  const handleSubmit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!form.fullName.trim() || !form.phone.trim() || !form.location.trim()) {
      alert('Please fill in name, phone, and location to place an order.');
      return;
    }
    onSubmit(form);
    setSubmitted(true);
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between gap-2">
        <div>
          <h3 className="text-xs font-semibold text-zinc-200 tracking-wide uppercase flex items-center gap-2">
            <ClipboardList className="w-3.5 h-3.5 text-blue-400" />
            Order Request
          </h3>
          <p className="text-[11px] text-zinc-500 mt-1">
            Capture field orders for this optimized briquette composition.
          </p>
        </div>
        <span className="inline-flex items-center rounded-full bg-zinc-900/60 border border-zinc-700/60 px-2 py-0.5 text-[10px] text-zinc-400 font-medium">
          {Math.round(recipe.dung)}% dung · {Math.round(recipe.sawdust)}% sawdust · {Math.round(recipe.straw)}% straw
        </span>
      </div>

      <form onSubmit={handleSubmit} className="space-y-3">
        <div className="grid grid-cols-1 gap-3">
          <label className="flex flex-col gap-1.5 text-[11px] text-zinc-400">
            <span className="flex items-center gap-1.5">
              <User className="w-3.5 h-3.5" />
              Full name
            </span>
            <input
              type="text"
              value={form.fullName}
              onChange={e => handleChange('fullName', e.target.value)}
              className="gnome-input"
              placeholder="Shri Ram Kishan"
              required
            />
          </label>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <label className="flex flex-col gap-1.5 text-[11px] text-zinc-400">
              <span className="flex items-center gap-1.5">
                <Phone className="w-3.5 h-3.5" />
                Phone / WhatsApp
              </span>
              <input
                type="tel"
                value={form.phone}
                onChange={e => handleChange('phone', e.target.value)}
                className="gnome-input"
                placeholder="+91-98xxxxxx"
                required
              />
            </label>

            <label className="flex flex-col gap-1.5 text-[11px] text-zinc-400">
              <span>Organization (optional)</span>
              <input
                type="text"
                value={form.organization}
                onChange={e => handleChange('organization', e.target.value)}
                className="gnome-input"
                placeholder="Goshala / Crematorium / Boiler plant"
              />
            </label>
          </div>

          <label className="flex flex-col gap-1.5 text-[11px] text-zinc-400">
            <span className="flex items-center gap-1.5">
              <MapPin className="w-3.5 h-3.5" />
              Location
            </span>
            <input
              type="text"
              value={form.location}
              onChange={e => handleChange('location', e.target.value)}
              className="gnome-input"
              placeholder="Village / City, District, State"
              required
            />
          </label>

          <div className="grid grid-cols-2 gap-3">
            <label className="flex flex-col gap-1.5 text-[11px] text-zinc-400">
              <span className="flex items-center gap-1.5">
                <Package className="w-3.5 h-3.5" />
                Quantity (kg)
              </span>
              <input
                type="number"
                min={10}
                step={10}
                value={form.quantityKg}
                onChange={e => handleChange('quantityKg', Number(e.target.value) || 0)}
                className="gnome-input"
              />
            </label>

            <label className="flex flex-col gap-1.5 text-[11px] text-zinc-400">
              <span>Target application</span>
              <select
                value={form.application}
                onChange={e => handleChange('application', e.target.value as ApplicationType)}
                className="gnome-input"
              >
                <option value="cremation">Cremation</option>
                <option value="cooking">Cooking / Domestic</option>
                <option value="boiler">Industrial boiler</option>
                <option value="ritual">Ritual / Havan</option>
              </select>
            </label>
          </div>

          <label className="flex flex-col gap-1.5 text-[11px] text-zinc-400">
            <span>Notes (optional)</span>
            <textarea
              rows={3}
              value={form.notes}
              onChange={e => handleChange('notes', e.target.value)}
              className="gnome-input resize-none"
              placeholder="Logistics constraints, preferred delivery window, special requirements..."
            />
          </label>
        </div>

        <button
          type="submit"
          className="gnome-btn gnome-btn-primary w-full flex items-center justify-center gap-2 mt-1"
        >
          <Send className="w-3.5 h-3.5" />
          Submit order request
        </button>
      </form>

      {submitted && (
        <p className="text-[11px] text-emerald-400 mt-1 text-center">
          Order received, thank you.
        </p>
      )}
    </div>
  );
}
