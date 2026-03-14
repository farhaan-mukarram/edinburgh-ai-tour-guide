import React from 'react';
import type { Tour } from '../types';
import { Clock, Map as MapIcon, Cloud, Users, Calendar } from 'lucide-react';
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

  const formatDate = (dateStr: string) => {
    return new Date(dateStr).toLocaleDateString('en-GB', {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    });
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-4">
        <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between bg-royal-blue p-4 rounded-lg border border-royal-blue shadow-md gap-y-3">
          <div className="flex items-center gap-2 text-stone border-b sm:border-b-0 border-stone/20 pb-2 sm:pb-0">
            <Calendar size={18} className="text-gold" />
            <span className="font-bold text-sm tracking-wide uppercase">{formatDate(tour.date)}</span>
          </div>
          <div className="flex items-center justify-between sm:justify-end gap-4 md:gap-6">
            <div className="flex items-center gap-2 text-stone">
              <Clock size={16} className="text-gold" />
              <span className="font-bold text-[11px] md:text-sm tracking-wide">~{formatDuration(tour.totalDurationMin)}</span>
            </div>
            <div className="flex items-center gap-2 text-stone">
              <MapIcon size={16} className="text-gold" />
              <span className="font-bold text-[11px] md:text-sm tracking-wide">{tour.totalDistanceKm} KM</span>
            </div>
          </div>
        </div>

        {(tour.chosenWeather || tour.chosenCrowds) && (
          <div className="flex items-center justify-between bg-stone-100 p-5 rounded-xl border border-royal-blue/10 shadow-sm">
            {tour.chosenWeather && (
              <div className="flex items-center gap-3 text-royal-blue">
                <Cloud size={20} className="text-thistle-purple" />
                <div className="flex flex-col">
                  <span className="text-[10px] font-black uppercase tracking-widest text-royal-blue/50">Current Weather</span>
                  <span className="font-bold text-sm uppercase tracking-wider">{tour.chosenWeather}</span>
                </div>
              </div>
            )}
            {tour.chosenCrowds && (
              <div className="flex items-center gap-3 text-royal-blue text-right">
                <div className="flex flex-col items-end">
                  <span className="text-[10px] font-black uppercase tracking-widest text-royal-blue/50">Crowd Level</span>
                  <span className="font-bold text-sm uppercase tracking-wider">{tour.chosenCrowds}</span>
                </div>
                <Users size={20} className="text-thistle-purple" />
              </div>
            )}
          </div>
        )}
      </div>

      <div className="relative">
        <div className="absolute left-6 top-0 bottom-0 w-0.5 bg-stone-300" />
        
        <div className="space-y-10 md:space-y-12">
          {tour.itinerary.map((item, index) => (
            <motion.div
              key={item.location.id}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: index * 0.1 }}
              className="relative flex gap-4 sm:gap-8 itinerary-card"
            >
              <div className="z-10 flex-shrink-0 w-10 h-10 sm:w-12 sm:h-12 rounded-full bg-royal-blue border-4 border-stone flex items-center justify-center font-serif font-black text-stone shadow-lg text-sm sm:text-base">
                {index + 1}
              </div>
              
              <div className="flex-grow pt-1 pb-4 border-b border-stone-200">
                <h3 className="text-xl sm:text-2xl font-serif font-black text-royal-blue flex items-center gap-2 mb-1">
                  {item.location.name}
                </h3>
                <div className="flex items-center gap-1.5 text-[10px] sm:text-xs font-black text-thistle-purple mb-3 uppercase tracking-widest">
                  <Clock size={12} />
                  <span>{formatDuration(item.estimatedTimeMin)} duration</span>
                </div>
                <p className="text-slate-700 text-sm sm:text-base leading-relaxed mb-6 font-medium italic">{item.location.description}</p>
                
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
                  {item.weatherAdvice && (
                    <div className="flex flex-col gap-2 p-4 rounded-lg bg-royal-blue/5 border border-royal-blue/10 shadow-sm">
                      <div className="flex items-center gap-2 text-xs font-bold text-royal-blue uppercase tracking-wider">
                        <Cloud size={14} className="text-thistle-purple" />
                        <span>Weather Insight</span>
                      </div>
                      <p className="text-slate-800 text-sm leading-relaxed font-medium">
                        {item.weatherAdvice}
                      </p>
                    </div>
                  )}
                  {item.crowdAdvice && (
                    <div className="flex flex-col gap-2 p-4 rounded-lg bg-royal-blue/5 border border-royal-blue/10 shadow-sm">
                      <div className="flex items-center gap-2 text-xs font-bold text-royal-blue uppercase tracking-wider">
                        <Users size={14} className="text-thistle-purple" />
                        <span>Crowd Insight</span>
                      </div>
                      <p className="text-slate-800 text-sm leading-relaxed font-medium">
                        {item.crowdAdvice}
                      </p>
                    </div>
                  )}
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </div>
  );
};
