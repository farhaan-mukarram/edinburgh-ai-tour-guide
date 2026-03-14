import React from 'react';
import { THEMES, EDINBURGH_LOCATIONS } from '../data/mockData';
import { motion } from 'framer-motion';
import { Info, Sparkles, MapPin, Clock, Calendar, CheckCircle2 } from 'lucide-react';

export const About: React.FC = () => {
  return (
    <motion.div 
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="space-y-12 pb-12"
    >
      <div className="text-center space-y-4 max-w-2xl mx-auto">
        <h2 className="text-4xl font-black tracking-tight">Our Tour Themes</h2>
        <p className="text-lg text-slate-600 leading-relaxed">
          EdinGuide AI crafts custom itineraries based on your interests. Explore the different facets of Edinburgh through our curated themes.
        </p>
      </div>

      <div className="grid lg:grid-cols-2 gap-8">
        {THEMES.map((theme) => {
          const matchingLocations = EDINBURGH_LOCATIONS.filter(loc => loc.themes.includes(theme.id)).slice(0, 3);
          
          return (
            <div 
              key={theme.id}
              className="bg-white rounded-3xl shadow-xl border border-slate-100 hover:border-blue-200 transition-all flex flex-col overflow-hidden group"
            >
              <div className="p-8 space-y-6">
                <div className="flex items-center justify-between">
                  <div className="text-4xl bg-slate-50 w-16 h-16 flex items-center justify-center rounded-2xl group-hover:scale-110 transition-transform">
                    {theme.emoji}
                  </div>
                  <span className="px-3 py-1 bg-blue-100 text-blue-700 rounded-full text-xs font-bold uppercase tracking-wider">
                    {theme.id.replace('_', ' ')}
                  </span>
                </div>
                
                <div className="space-y-2">
                  <h3 className="text-2xl font-bold">{theme.label}</h3>
                  <p className="text-slate-600 leading-relaxed">
                    {theme.description}
                  </p>
                </div>

                <div className="grid grid-cols-2 gap-4 py-4 border-y border-slate-50">
                  <div className="flex items-center gap-2 text-slate-600">
                    <Clock size={18} className="text-blue-500" />
                    <span className="text-sm font-medium">{theme.duration}</span>
                  </div>
                  <div className="flex items-center gap-2 text-slate-600">
                    <Calendar size={18} className="text-blue-500" />
                    <span className="text-sm font-medium">{theme.bestTime}</span>
                  </div>
                </div>

                <div className="space-y-3">
                  <h4 className="text-sm font-bold text-slate-400 uppercase tracking-widest">Key Highlights</h4>
                  <ul className="grid grid-cols-1 gap-2">
                    {theme.highlights.map((highlight, idx) => (
                      <li key={idx} className="flex items-center gap-2 text-slate-700">
                        <CheckCircle2 size={16} className="text-green-500" />
                        <span className="text-sm">{highlight}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                {matchingLocations.length > 0 && (
                  <div className="space-y-3">
                    <h4 className="text-sm font-bold text-slate-400 uppercase tracking-widest">Featured Stops</h4>
                    <div className="flex flex-wrap gap-2">
                      {matchingLocations.map(loc => (
                        <span key={loc.id} className="px-3 py-1 bg-slate-50 text-slate-600 rounded-lg text-xs font-medium border border-slate-100">
                          {loc.name}
                        </span>
                      ))}
                    </div>
                  </div>
                )}
              </div>

              <div className="bg-slate-50 px-8 py-4 mt-auto border-t border-slate-100">
                <div className="flex items-center gap-2 text-sm text-slate-500 font-medium">
                  <Sparkles size={16} className="text-blue-500" />
                  <span>AI-Generated Experience</span>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      <div className="bg-indigo-600 rounded-3xl p-8 md:p-12 text-white overflow-hidden relative">
        <div className="relative z-10 space-y-6 max-w-xl">
          <div className="flex items-center gap-3">
            <Info size={24} className="text-indigo-200" />
            <h3 className="text-2xl font-bold">How it works</h3>
          </div>
          <p className="text-indigo-100 text-lg leading-relaxed">
            Our AI engine combines historical data, local insights, and real-time mapping to create a route that fits your schedule and physical pace. Each stop is selected to complement your chosen theme, ensuring a cohesive and immersive story.
          </p>
          <div className="flex gap-4 pt-4">
             <div className="flex items-center gap-2">
                <MapPin size={18} className="text-indigo-300" />
                <span className="text-sm font-semibold">Verified Locations</span>
             </div>
             <div className="flex items-center gap-2">
                <Sparkles size={18} className="text-indigo-300" />
                <span className="text-sm font-semibold">Unique Narratives</span>
             </div>
          </div>
        </div>
        <div className="absolute top-0 right-0 -mr-20 -mt-20 opacity-10">
          <Sparkles size={300} />
        </div>
      </div>
    </motion.div>
  );
};
