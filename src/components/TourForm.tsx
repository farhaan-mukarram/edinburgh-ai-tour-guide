import React, { useState } from 'react';
import type { TourPreferences, Theme } from '../types';
import { THEMES, EDINBURGH_LOCATIONS } from '../data/mockData';
import { Clock, MapPin, Sparkles, Footprints, ChevronDown, ChevronUp, Star, Sun, Calendar } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

interface TourFormProps {
  onGenerate: (prefs: TourPreferences) => void;
}

export const TourForm: React.FC<TourFormProps> = ({ onGenerate }) => {
  // Get tomorrow's date as default (YYYY-MM-DD)
  const tomorrow = new Date();
  tomorrow.setDate(tomorrow.getDate() + 1);
  const tomorrowStr = tomorrow.toISOString().split('T')[0];

  const [prefs, setPrefs] = React.useState<TourPreferences>({
    startPoint: EDINBURGH_LOCATIONS[0].id,
    theme: 'history',
    durationHours: 2,
    pace: 'moderate',
    date: tomorrowStr,
  });

  const [expandedTheme, setExpandedTheme] = useState<Theme | null>(null);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onGenerate(prefs);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6 bg-white p-8 rounded-xl shadow-2xl border border-stone-200">
      <div className="space-y-2">
        <label className="flex items-center gap-2 text-sm font-bold text-royal-blue uppercase tracking-wider">
          <MapPin size={18} className="text-thistle-purple" />
          Starting Point
        </label>
        <select
          value={prefs.startPoint}
          onChange={(e) => setPrefs({ ...prefs, startPoint: e.target.value })}
          className="w-full p-3 rounded-lg border border-stone-300 focus:ring-2 focus:ring-royal-blue focus:border-transparent outline-none transition-all font-serif text-lg bg-stone/20"
        >
          {EDINBURGH_LOCATIONS.map((loc) => (
            <option key={loc.id} value={loc.id}>
              {loc.name}
            </option>
          ))}
        </select>
      </div>

      <div className="space-y-2">
        <label className="flex items-center gap-2 text-sm font-bold text-royal-blue uppercase tracking-wider">
          <Sparkles size={18} className="text-gold" />
          Tour Theme
        </label>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 items-start">
          {THEMES.map((theme) => (
            <div
              key={theme.id}
              className={`rounded-lg border-2 transition-all overflow-hidden ${
                prefs.theme === theme.id
                  ? "border-royal-blue bg-stone/50 ring-1 ring-royal-blue"
                  : "border-stone-200 bg-white hover:border-royal-blue/30 hover:bg-stone/20"
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
                      <div className="pt-3 mt-3 border-t border-royal-blue/10 space-y-3">
                        <div className="space-y-1">
                          <div className="flex items-center gap-1 text-[10px] font-black text-royal-blue uppercase tracking-wider">
                            <Star size={10} className="text-gold" />
                            <span>Highlights</span>
                          </div>
                          <ul className="text-[11px] text-slate-700 space-y-0.5 font-medium">
                            {theme.highlights.map((h, i) => (
                              <li key={i} className="flex items-center gap-1">
                                <span className="w-1 h-1 bg-thistle-purple rounded-full" />
                                {h}
                              </li>
                            ))}
                          </ul>
                        </div>
                        <div className="grid grid-cols-2 gap-2">
                          <div className="space-y-0.5">
                            <div className="flex items-center gap-1 text-[10px] font-black text-royal-blue uppercase tracking-wider">
                              <Clock size={10} />
                              <span>Duration</span>
                            </div>
                            <div className="text-[11px] text-slate-600">
                              {theme.duration}
                            </div>
                          </div>
                          <div className="space-y-0.5">
                            <div className="flex items-center gap-1 text-[10px] font-black text-royal-blue uppercase tracking-wider">
                              <Sun size={10} className="text-gold" />
                              <span>Best Time</span>
                            </div>
                            <div className="text-[11px] text-slate-600">
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

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div className="space-y-2">
          <label className="flex items-center gap-2 text-sm font-bold text-royal-blue uppercase tracking-wider">
            <Calendar size={18} className="text-thistle-purple" />
            Tour Date
          </label>
          <input
            type="date"
            min={tomorrowStr}
            value={prefs.date}
            onChange={(e) => setPrefs({ ...prefs, date: e.target.value })}
            className="w-full p-3 rounded-lg border border-stone-300 focus:ring-2 focus:ring-royal-blue focus:border-transparent outline-none transition-all font-serif text-lg bg-stone/20 cursor-pointer"
          />
        </div>

        <div className="space-y-2">
          <label className="flex items-center gap-2 text-sm font-bold text-royal-blue uppercase tracking-wider">
            <Clock size={18} className="text-thistle-purple" />
            Duration
          </label>
          <select
            value={prefs.durationHours}
            onChange={(e) => setPrefs({ ...prefs, durationHours: Number(e.target.value) })}
            className="w-full p-3 rounded-lg border border-stone-300 focus:ring-2 focus:ring-royal-blue focus:border-transparent outline-none transition-all font-serif text-lg bg-stone/20 cursor-pointer"
          >
            {[1, 2, 3, 4, 6].map((h) => (
              <option key={h} value={h}>
                {h} {h === 1 ? 'hour' : 'hours'}
              </option>
            ))}
          </select>
        </div>
      </div>

      <div className="space-y-2">
        <label className="flex items-center gap-2 text-sm font-bold text-royal-blue uppercase tracking-wider">
          <Footprints size={18} className="text-moss-green" />
          Pace
        </label>
        <select
          value={prefs.pace}
          onChange={(e) => setPrefs({ ...prefs, pace: e.target.value as any })}
          className="w-full p-3 rounded-lg border border-stone-300 focus:ring-2 focus:ring-royal-blue focus:border-transparent outline-none transition-all font-serif text-lg bg-stone/20 cursor-pointer"
        >
          <option value="relaxed">☕ Relaxed</option>
          <option value="moderate">🚶 Moderate</option>
          <option value="brisk">🏃 Brisk</option>
        </select>
      </div>

      <button
        type="submit"
        className="w-full py-4 bg-royal-blue text-stone rounded-lg font-bold shadow-xl shadow-royal-blue/20 hover:bg-royal-blue/90 active:scale-[0.98] transition-all flex items-center justify-center gap-2 uppercase tracking-widest text-sm"
      >
        <Sparkles size={20} />
        Generate My Tour
      </button>
    </form>
  );
};
