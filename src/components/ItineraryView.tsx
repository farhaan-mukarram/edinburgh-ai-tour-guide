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
      <div className="flex flex-col gap-4">
        <div className="flex items-center justify-between bg-blue-50 p-4 rounded-xl border border-blue-100 shadow-sm">
          <div className="flex items-center gap-2 text-blue-700">
            <Clock size={18} />
            <span className="font-semibold text-sm">~{formatDuration(tour.totalDurationMin)} total</span>
          </div>
          <div className="flex items-center gap-2 text-blue-700">
            <MapIcon size={18} />
            <span className="font-semibold text-sm">{tour.totalDistanceKm} km walk</span>
          </div>
        </div>

        {(tour.chosenWeather || tour.chosenCrowds) && (
          <div className="flex items-center justify-between bg-indigo-50 p-4 rounded-xl border border-indigo-100 shadow-sm">
            {tour.chosenWeather && (
              <div className="flex items-center gap-2 text-indigo-700">
                <Cloud size={18} className="text-indigo-500" />
                <span className="font-semibold text-sm capitalize">{tour.chosenWeather}</span>
              </div>
            )}
            {tour.chosenCrowds && (
              <div className="flex items-center gap-2 text-indigo-700">
                <Users size={18} className="text-indigo-500" />
                <span className="font-semibold text-sm capitalize">{tour.chosenCrowds}</span>
              </div>
            )}
          </div>
        )}
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
                  
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mt-4 pt-4 border-t border-amber-100">
                    {item.weatherAdvice && (
                      <div className="flex flex-col gap-1 p-2 rounded-lg bg-blue-50/50 border border-blue-100">
                        <div className="flex items-center gap-2 text-[10px] font-black text-blue-600 uppercase tracking-wider">
                          <Cloud size={12} />
                          <span>Weather Tip</span>
                        </div>
                        <p className="text-gray-700 text-xs leading-snug">
                          {item.weatherAdvice}
                        </p>
                      </div>
                    )}
                    {item.crowdAdvice && (
                      <div className="flex flex-col gap-1 p-2 rounded-lg bg-purple-50/50 border border-purple-100">
                        <div className="flex items-center gap-2 text-[10px] font-black text-purple-600 uppercase tracking-wider">
                          <Users size={12} />
                          <span>Crowd Tip</span>
                        </div>
                        <p className="text-gray-700 text-xs leading-snug">
                          {item.crowdAdvice}
                        </p>
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
