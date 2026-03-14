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
      <div className="text-center space-y-4 max-w-2xl mx-auto px-4">
        <h2 className="text-4xl md:text-5xl font-serif font-black tracking-tight text-royal-blue">Our Tour Themes</h2>
        <p className="text-base md:text-lg text-slate-700 leading-relaxed font-medium italic">
          EdinGuide AI crafts custom itineraries based on your interests. Explore the different facets of Edinburgh through our curated themes.
        </p>
      </div>

      <div className="grid md:grid-cols-2 gap-6 lg:gap-8">
        {THEMES.map((theme) => {
          const matchingLocations = EDINBURGH_LOCATIONS.filter(loc => loc.themes.includes(theme.id)).slice(0, 3);
          
          return (
            <div 
              key={theme.id}
              className="bg-white rounded-xl shadow-2xl border border-stone-200 hover:border-royal-blue/30 transition-all flex flex-col overflow-hidden group"
            >
              <div className="p-6 sm:p-8 lg:p-10 space-y-6 sm:space-y-8">
                <div className="flex items-center justify-between">
                  <div className="text-4xl sm:text-5xl bg-stone/50 w-16 h-16 sm:w-20 sm:h-20 flex items-center justify-center rounded-lg group-hover:rotate-6 transition-transform">
                    {theme.emoji}
                  </div>
                  <span className="px-3 sm:px-4 py-1 bg-thistle-purple text-stone rounded text-[10px] font-black uppercase tracking-[0.2em]">
                    {theme.id.replace('_', ' ')}
                  </span>
                </div>
                
                <div className="space-y-3">
                  <h3 className="text-2xl sm:text-3xl font-serif font-black text-royal-blue">{theme.label}</h3>
                  <p className="text-sm sm:text-base text-slate-700 leading-relaxed font-medium">
                    {theme.description}
                  </p>
                </div>

                <div className="grid grid-cols-2 gap-4 sm:gap-6 py-4 sm:py-6 border-y border-stone-100">
                  <div className="flex items-center gap-2 text-royal-blue">
                    <Clock size={18} className="text-thistle-purple" />
                    <span className="text-sm font-bold uppercase tracking-widest">{theme.duration}</span>
                  </div>
                  <div className="flex items-center gap-2 text-royal-blue">
                    <Calendar size={18} className="text-thistle-purple" />
                    <span className="text-sm font-bold uppercase tracking-widest">{theme.bestTime}</span>
                  </div>
                </div>

                <div className="space-y-4">
                  <h4 className="text-[10px] font-black text-royal-blue/40 uppercase tracking-[0.3em]">Key Highlights</h4>
                  <ul className="grid grid-cols-1 gap-3">
                    {theme.highlights.map((highlight, idx) => (
                      <li key={idx} className="flex items-center gap-2 text-slate-800 font-serif italic text-base">
                        <CheckCircle2 size={16} className="text-moss-green" />
                        <span>{highlight}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                {matchingLocations.length > 0 && (
                  <div className="space-y-4">
                    <h4 className="text-[10px] font-black text-royal-blue/40 uppercase tracking-[0.3em]">Featured Stops</h4>
                    <div className="flex flex-wrap gap-2">
                      {matchingLocations.map(loc => (
                        <span key={loc.id} className="px-3 py-1 bg-stone text-royal-blue rounded border border-stone-300 text-[10px] font-black uppercase tracking-wider">
                          {loc.name}
                        </span>
                      ))}
                    </div>
                  </div>
                )}
              </div>

              <div className="bg-royal-blue px-10 py-5 mt-auto">
                <div className="flex items-center gap-2 text-xs text-stone font-black uppercase tracking-[0.2em] opacity-80">
                  <Sparkles size={16} className="text-gold" />
                  <span>AI-Generated Experience</span>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      <div className="bg-royal-blue rounded-xl p-10 md:p-16 text-stone overflow-hidden relative shadow-2xl">
        <div className="relative z-10 space-y-6 md:space-y-8 max-w-2xl">
          <div className="flex items-center gap-4 border-b border-stone/20 pb-4 md:pb-6">
            <Info size={28} className="text-gold" />
            <h3 className="text-3xl md:text-4xl font-serif font-black uppercase tracking-tight text-stone">Our Methodology</h3>
          </div>
          <p className="text-stone/90 text-lg md:text-xl leading-relaxed font-serif italic">
            "Our AI engine combines historical data, local insights, and real-time mapping to create a route that fits your schedule and physical pace. Each stop is selected to complement your chosen theme, ensuring a cohesive and immersive experience."
          </p>
          <div className="flex flex-wrap gap-8 pt-4">
             <div className="flex items-center gap-2">
                <MapPin size={18} className="text-thistle-purple" />
                <span className="text-sm font-semibold">Verified Locations</span>
             </div>
             <div className="flex items-center gap-2">
                <Sparkles size={18} className="text-gold" />
                <span className="text-sm font-semibold">Smart Pathfinding</span>
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
