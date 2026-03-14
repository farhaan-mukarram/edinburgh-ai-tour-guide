import React from 'react';
import type { TourPreferences } from '../types';
import { THEMES, EDINBURGH_LOCATIONS } from '../data/mockData';
import { Clock, MapPin, Sparkles, Footprints } from 'lucide-react';

interface TourFormProps {
  onGenerate: (prefs: TourPreferences) => void;
}

export const TourForm: React.FC<TourFormProps> = ({ onGenerate }) => {
  const [prefs, setPrefs] = React.useState<TourPreferences>({
    startPoint: EDINBURGH_LOCATIONS[0].id,
    theme: 'history',
    durationHours: 2,
    pace: 'moderate',
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onGenerate(prefs);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6 bg-white p-6 rounded-2xl shadow-xl border border-gray-100">
      <div className="space-y-2">
        <label className="flex items-center gap-2 text-sm font-semibold text-gray-700">
          <MapPin size={18} className="text-blue-500" />
          Starting Point
        </label>
        <select
          value={prefs.startPoint}
          onChange={(e) => setPrefs({ ...prefs, startPoint: e.target.value })}
          className="w-full p-3 rounded-lg border border-gray-200 focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all"
        >
          {EDINBURGH_LOCATIONS.map((loc) => (
            <option key={loc.id} value={loc.id}>
              {loc.name}
            </option>
          ))}
        </select>
      </div>

      <div className="space-y-2">
        <label className="flex items-center gap-2 text-sm font-semibold text-gray-700">
          <Sparkles size={18} className="text-amber-500" />
          Tour Theme
        </label>
        <div className="grid grid-cols-2 gap-3">
          {THEMES.map((theme) => (
            <button
              key={theme.id}
              type="button"
              onClick={() => setPrefs({ ...prefs, theme: theme.id })}
              className={`p-3 rounded-xl border text-left transition-all ${
                prefs.theme === theme.id
                  ? 'border-blue-500 bg-blue-50 ring-1 ring-blue-500'
                  : 'border-gray-100 hover:border-blue-200 hover:bg-gray-50'
              }`}
            >
              <div className="text-2xl mb-1">{theme.emoji}</div>
              <div className="font-bold text-sm">{theme.label}</div>
              <div className="text-xs text-gray-500 line-clamp-1">{theme.description}</div>
            </button>
          ))}
        </div>
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div className="space-y-2">
          <label className="flex items-center gap-2 text-sm font-semibold text-gray-700">
            <Clock size={18} className="text-emerald-500" />
            Duration
          </label>
          <select
            value={prefs.durationHours}
            onChange={(e) => setPrefs({ ...prefs, durationHours: Number(e.target.value) })}
            className="w-full p-3 rounded-lg border border-gray-200 focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all"
          >
            {[1, 2, 3, 4, 6].map((h) => (
              <option key={h} value={h}>
                {h} {h === 1 ? 'hour' : 'hours'}
              </option>
            ))}
          </select>
        </div>

        <div className="space-y-2">
          <label className="flex items-center gap-2 text-sm font-semibold text-gray-700">
            <Footprints size={18} className="text-orange-500" />
            Pace
          </label>
          <select
            value={prefs.pace}
            onChange={(e) => setPrefs({ ...prefs, pace: e.target.value as any })}
            className="w-full p-3 rounded-lg border border-gray-200 focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all"
          >
            <option value="relaxed">☕ Relaxed</option>
            <option value="moderate">🚶 Moderate</option>
            <option value="brisk">🏃 Brisk</option>
          </select>
        </div>
      </div>

      <button
        type="submit"
        className="w-full py-4 bg-gradient-to-r from-blue-600 to-indigo-600 text-white rounded-xl font-bold shadow-lg shadow-blue-200 hover:scale-[1.02] active:scale-[0.98] transition-all flex items-center justify-center gap-2"
      >
        <Sparkles size={20} />
        Generate My Tour
      </button>
    </form>
  );
};
