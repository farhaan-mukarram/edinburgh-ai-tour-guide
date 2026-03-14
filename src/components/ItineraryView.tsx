import React from 'react';
import type { Tour } from '../types';
import { Clock, Map as MapIcon, ChevronRight, Cloud, Users } from 'lucide-react';
import { motion } from 'framer-motion';

interface ItineraryViewProps {
  tour: Tour;
}

export const ItineraryView: React.FC<ItineraryViewProps> = ({ tour }) => {
  const formatDuration = (mins: number) => {
    if (mins < 60) return `${mins} mins`;
    const h = Math.floor(mins / 60);
    const m = mins % 60;
    return m > 0 ? `${h}h ${m}m` : `${h}h`;
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between bg-blue-50 p-4 rounded-xl border border-blue-100">
        <div className="flex items-center gap-2 text-blue-700">
          <Clock size={18} />
          <span className="font-semibold text-sm">~{formatDuration(tour.totalDurationMin)} total</span>
        </div>
        <div className="flex items-center gap-2 text-blue-700">
          <MapIcon size={18} />
          <span className="font-semibold text-sm">{tour.totalDistanceKm} km walk</span>
        </div>
      </div>

      <div className="relative">
        <div className="absolute left-6 top-0 bottom-0 w-0.5 bg-gray-100" />
        
        <div className="space-y-8">
          {tour.itinerary.map((item, index) => (
            <motion.div
              key={item.location.id}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: index * 0.1 }}
              className="relative flex gap-6"
            >
              <div className="z-10 flex-shrink-0 w-12 h-12 rounded-full bg-white border-4 border-blue-500 flex items-center justify-center font-bold text-blue-600 shadow-sm">
                {index + 1}
              </div>
              
              <div className="flex-grow pt-1 pb-2">
                <h3 className="text-lg font-bold text-gray-800 flex items-center gap-2">
                  {item.location.name}
                  <ChevronRight size={16} className="text-gray-300" />
                </h3>
                <div className="flex items-center gap-1.5 text-xs font-medium text-blue-600 mb-2">
                  <Clock size={14} />
                  <span>{formatDuration(item.estimatedTimeMin)}</span>
                </div>
                <p className="text-gray-500 text-sm mb-3">{item.location.description}</p>
                
                <div className="bg-gradient-to-br from-amber-50 to-orange-50 p-4 rounded-xl border border-amber-100 relative overflow-hidden group">
                  <div className="absolute top-0 right-0 p-2 opacity-10 group-hover:scale-110 transition-transform">
                    <span className="text-4xl italic font-serif">"</span>
                  </div>
                  <p className="text-gray-700 text-sm leading-relaxed relative italic mb-3">
                    {item.narrative}
                  </p>
                  
                  <div className="flex flex-wrap gap-4 mt-2 pt-2 border-t border-amber-100">
                    {item.weatherAdvice && (
                      <div className="flex items-center gap-2 text-[11px] font-bold text-amber-700 uppercase tracking-tighter">
                        <Cloud size={14} className="text-amber-500" />
                        <span>Weather: {item.weatherAdvice}</span>
                      </div>
                    )}
                    {item.crowdAdvice && (
                      <div className="flex items-center gap-2 text-[11px] font-bold text-amber-700 uppercase tracking-tighter">
                        <Users size={14} className="text-amber-500" />
                        <span>Crowds: {item.crowdAdvice}</span>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </div>
  );
};
