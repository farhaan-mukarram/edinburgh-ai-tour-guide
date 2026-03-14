import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Sparkles, Compass, Map, Search, BookOpen, Clock } from 'lucide-react';
import type { Theme } from '../types';

interface LoadingScreenProps {
  theme: Theme;
}

const THEME_MESSAGES: Record<Theme, string[]> = {
  history: [
    "Scanning the Royal Mile's ancient wynds...",
    "Consulting the royal archives...",
    "Unearthing medieval secrets...",
    "Tracing the footsteps of monarchs...",
    "Polishing the Honours of Scotland..."
  ],
  ghosts: [
    "Summoning the spirits of Greyfriars...",
    "Lighting a lantern for the vaults...",
    "Listening for echoes in the closes...",
    "Checking for dark deeds in the shadows...",
    "Consulting the city's spectral residents..."
  ],
  harry_potter: [
    "Waving a wand over Victoria Street...",
    "Checking the names in Greyfriars...",
    "Looking for the secret entrance to Diagon Alley...",
    "Brewing a potion for the perfect route...",
    "Consulting the Sorting Hat for your itinerary..."
  ],
  nature: [
    "Checking the wind atop Arthur's Seat...",
    "Mapping the green paths of Holyrood...",
    "Finding the best sunrise spots...",
    "Exploring the hills of the capital...",
    "Studying the city's volcanic terrain..."
  ],
  food: [
    "Checking the day's best haggis spots...",
    "Sniffing out the freshest shortbread...",
    "Locating hidden whisky cellars...",
    "Mapping a path for your palate...",
    "Sourcing local ingredients for your journey..."
  ],
  literature: [
    "Turning the pages of history...",
    "Tracing the lines of Scott and Stevenson...",
    "Visiting the UNESCO City of Literature archives...",
    "Ink-staining the map of your journey...",
    "Finding the prose in every close..."
  ]
};

const COMMON_MESSAGES = [
  "Calculating walking distances...",
  "Checking local crowd levels...",
  "Consulting the unpredictable Scottish weather...",
  "Optimizing your time-aware route...",
  "Ensuring your journey fits the schedule..."
];

export const LoadingScreen: React.FC<LoadingScreenProps> = ({ theme }) => {
  const [messageIndex, setMessageIndex] = useState(0);
  const themeMessages = THEME_MESSAGES[theme] || THEME_MESSAGES.history;
  const allMessages = [...themeMessages, ...COMMON_MESSAGES];

  useEffect(() => {
    const interval = setInterval(() => {
      setMessageIndex((prev) => (prev + 1) % allMessages.length);
    }, 2500);
    return () => clearInterval(interval);
  }, [allMessages.length]);

  const IconComponent = () => {
    const icons = [Sparkles, Compass, Map, Search, BookOpen, Clock];
    const Icon = icons[messageIndex % icons.length];
    return <Icon className="text-royal-blue" size={40} />;
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="absolute inset-0 bg-stone/95 backdrop-blur-md rounded-2xl flex flex-col items-center justify-center text-center p-8 z-50 border-2 border-royal-blue/10 overflow-hidden"
    >
      {/* Background Decorative Elements */}
      <div className="absolute top-0 left-0 w-full h-full opacity-[0.03] pointer-events-none">
        <div className="absolute top-10 left-10"><Compass size={200} /></div>
        <div className="absolute bottom-10 right-10"><Map size={200} /></div>
      </div>

      <div className="relative z-10 max-w-md w-full">
        <div className="relative mb-12 flex justify-center">
          {/* Main Spinner Ring */}
          <motion.div 
            animate={{ rotate: 360 }}
            transition={{ duration: 4, repeat: Infinity, ease: "linear" }}
            className="w-32 h-32 border-4 border-royal-blue/10 border-t-royal-blue border-r-thistle-purple rounded-full shadow-lg" 
          />
          
          {/* Inner Pulsing Icon */}
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 bg-white p-4 rounded-full shadow-inner border border-stone-200">
            <AnimatePresence mode="wait">
              <motion.div
                key={messageIndex}
                initial={{ scale: 0.5, opacity: 0, rotate: -45 }}
                animate={{ scale: 1, opacity: 1, rotate: 0 }}
                exit={{ scale: 1.5, opacity: 0, rotate: 45 }}
                transition={{ duration: 0.5 }}
              >
                <IconComponent />
              </motion.div>
            </AnimatePresence>
          </div>

          {/* Orbiting Dots */}
          {[0, 1, 2].map((i) => (
            <motion.div
              key={i}
              className="absolute w-3 h-3 bg-gold rounded-full"
              animate={{
                rotate: 360,
                scale: [1, 1.2, 1],
              }}
              transition={{
                rotate: { duration: 3, repeat: Infinity, ease: "linear", delay: i * 1 },
                scale: { duration: 2, repeat: Infinity, ease: "easeInOut", delay: i * 0.5 }
              }}
              style={{
                top: '50%',
                left: '50%',
                marginTop: '-6px',
                marginLeft: '-6px',
                transformOrigin: `${60 + (i * 10)}px center`,
              }}
            />
          ))}
        </div>

        <div className="space-y-4">
          <motion.h3 
            className="text-3xl font-serif font-black text-royal-blue tracking-tight"
            animate={{ opacity: [0.7, 1, 0.7] }}
            transition={{ duration: 2, repeat: Infinity }}
          >
            Crafting Your Itinerary
          </motion.h3>
          
          <div className="h-12 flex items-center justify-center">
            <AnimatePresence mode="wait">
              <motion.p
                key={messageIndex}
                initial={{ y: 10, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                exit={{ y: -10, opacity: 0 }}
                className="text-slate-600 font-medium italic text-lg"
              >
                {allMessages[messageIndex]}
              </motion.p>
            </AnimatePresence>
          </div>

          {/* Progress Bar Emulation */}
          <div className="mt-8 w-full h-1 bg-stone-200 rounded-full overflow-hidden max-w-[200px] mx-auto">
            <motion.div 
              className="h-full bg-gradient-to-r from-royal-blue to-thistle-purple"
              animate={{ 
                width: ["0%", "100%"],
                left: ["-100%", "100%"]
              }}
              transition={{ 
                duration: 2.5, 
                repeat: Infinity,
                ease: "easeInOut"
              }}
            />
          </div>
        </div>
      </div>

      <div className="mt-12 pt-6 border-t border-royal-blue/10 opacity-40">
        <span className="font-serif text-sm italic">EdinGuide AI • Est. 2026</span>
      </div>
    </motion.div>
  );
};
