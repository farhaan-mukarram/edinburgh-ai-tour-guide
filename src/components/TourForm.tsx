import React, { useState } from 'react';
import type { TourPreferences, Theme } from '../types';
import { THEMES, EDINBURGH_LOCATIONS } from '../data/mockData';
import { Clock, MapPin, Sparkles, Footprints, ChevronDown, ChevronUp, Star, Sun } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

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

  const [expandedTheme, setExpandedTheme] = useState<Theme | null>(null);

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
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 items-start">
          {THEMES.map((theme) => (
            <div
              key={theme.id}
              className={`rounded-xl border transition-all overflow-hidden ${
                prefs.theme === theme.id
                  ? "border-blue-500 bg-blue-50 ring-1 ring-blue-500"
                  : "border-gray-100 bg-white hover:border-blue-200 hover:bg-gray-50"
              }`}
            >
              <div
                onClick={() => setPrefs({ ...prefs, theme: theme.id })}
                className="p-3 cursor-pointer flex flex-col"
              >
                <div className="flex justify-between items-start">
                  <div className="text-2xl mb-1">{theme.emoji}</div>
                  <button
                    type="button"
                    onClick={(e) => {
                      e.stopPropagation();
                      setExpandedTheme(expandedTheme === theme.id ? null : theme.id);
                    }}
                    className="p-1 hover:bg-blue-100 rounded-full transition-colors cursor-pointer text-blue-600"
                    title="View Details"
                  >
                    {expandedTheme === theme.id ? <ChevronUp size={18} /> : <ChevronDown size={18} />}
                  </button>
                </div>
                <div className="font-bold text-sm">{theme.label}</div>
                <div className="text-xs text-gray-500 line-clamp-2">
                  {theme.description}
                </div>

                <AnimatePresence>
                  {expandedTheme === theme.id && (
                    <motion.div
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: "auto", opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      className="overflow-hidden"
                    >
                      <div className="pt-3 mt-3 border-t border-blue-100 space-y-3">
                        <div className="space-y-1">
                          <div className="flex items-center gap-1 text-[10px] font-black text-blue-600 uppercase tracking-wider">
                            <Star size={10} />
                            <span>Highlights</span>
                          </div>
                          <ul className="text-[11px] text-gray-600 space-y-0.5">
                            {theme.highlights.map((h, i) => (
                              <li key={i} className="flex items-center gap-1">
                                <span className="w-1 h-1 bg-blue-400 rounded-full" />
                                {h}
                              </li>
                            ))}
                          </ul>
                        </div>
                        <div className="grid grid-cols-2 gap-2">
                          <div className="space-y-0.5">
                            <div className="flex items-center gap-1 text-[10px] font-black text-blue-600 uppercase tracking-wider">
                              <Clock size={10} />
                              <span>Duration</span>
                            </div>
                            <div className="text-[11px] text-gray-600">
                              {theme.duration}
                            </div>
                          </div>
                          <div className="space-y-0.5">
                            <div className="flex items-center gap-1 text-[10px] font-black text-blue-600 uppercase tracking-wider">
                              <Sun size={10} />
                              <span>Best Time</span>
                            </div>
                            <div className="text-[11px] text-gray-600">
                              {theme.bestTime}
                            </div>
                          </div>
                        </div>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            </div>
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
