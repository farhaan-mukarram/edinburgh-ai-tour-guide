import React from 'react';
import { TourForm } from './components/TourForm';
import { TourMap } from './components/TourMap';
import { ItineraryView } from './components/ItineraryView';
import type { Tour, TourPreferences } from './types';
import { generateTour } from './utils/tourGenerator';
import { Sparkles, Compass, History, Info } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

function App() {
  const [tour, setTour] = React.useState<Tour | null>(null);
  const [isGenerating, setIsGenerating] = React.useState(false);

  const handleGenerate = (prefs: TourPreferences) => {
    setIsGenerating(true);
    // Simulate AI generation time
    setTimeout(() => {
      const newTour = generateTour(prefs);
      setTour(newTour);
      setIsGenerating(false);
      
      // Scroll to results
      document.getElementById('tour-results')?.scrollIntoView({ behavior: 'smooth' });
    }, 1500);
  };

  return (
    <div className="min-h-screen bg-slate-50 font-sans text-slate-900">
      {/* Header */}
      <header className="bg-white border-b border-slate-200 sticky top-0 z-50">
        <div className="max-w-6xl mx-auto px-4 py-4 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="bg-blue-600 p-2 rounded-lg text-white">
              <Compass size={24} />
            </div>
            <h1 className="text-xl font-bold bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent">
              EdinGuide AI
            </h1>
          </div>
          <nav className="hidden md:flex items-center gap-6 text-sm font-medium text-slate-600">
            <a href="#" className="hover:text-blue-600 transition-colors">Tours</a>
            <a href="#" className="hover:text-blue-600 transition-colors">About</a>
            <a href="#" className="hover:text-blue-600 transition-colors flex items-center gap-1">
              <History size={16} />
              Recent
            </a>
          </nav>
        </div>
      </header>

      <main className="max-w-6xl mx-auto px-4 py-8 md:py-12">
        <div className="grid lg:grid-cols-12 gap-12 items-start">
          {/* Left Column - Intro & Form */}
          <div className="lg:col-span-5 space-y-8">
            <div className="space-y-4">
              <h2 className="text-4xl md:text-5xl font-black tracking-tight leading-tight">
                Discover <span className="text-blue-600">Edinburgh</span> with AI precision.
              </h2>
              <p className="text-lg text-slate-600 leading-relaxed">
                Choose your vibe, and let our AI craft a personalised walking tour through the historic streets of Scotland's capital.
              </p>
            </div>

            <TourForm onGenerate={handleGenerate} />

            <div className="bg-blue-50 p-4 rounded-xl border border-blue-100 flex gap-3 items-start">
              <Info className="text-blue-500 shrink-0 mt-0.5" size={20} />
              <p className="text-sm text-blue-800 italic">
                Our AI considers current events, historical significance, and local secrets to build your unique itinerary.
              </p>
            </div>
          </div>

          {/* Right Column - Results */}
          <div className="lg:col-span-7 space-y-8 min-h-[600px]" id="tour-results">
            <AnimatePresence mode="wait">
              {isGenerating ? (
                <motion.div
                  key="loading"
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 1.05 }}
                  className="bg-white p-12 rounded-3xl shadow-xl border border-slate-100 flex flex-col items-center justify-center text-center space-y-6 h-full min-h-[500px]"
                >
                  <div className="relative">
                    <div className="w-20 h-20 border-4 border-blue-100 border-t-blue-600 rounded-full animate-spin" />
                    <Sparkles className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 text-blue-600 animate-pulse" size={32} />
                  </div>
                  <div>
                    <h3 className="text-2xl font-bold">Crafting your story...</h3>
                    <p className="text-slate-500 mt-2">Connecting history, lore, and secret paths.</p>
                  </div>
                </motion.div>
              ) : tour ? (
                <motion.div
                  key="results"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="space-y-8"
                >
                  <div className="bg-white rounded-3xl shadow-xl border border-slate-100 overflow-hidden">
                    <TourMap tour={tour} />
                    <div className="p-8">
                      <div className="flex items-center gap-3 mb-6">
                        <span className="px-3 py-1 bg-blue-100 text-blue-700 rounded-full text-xs font-bold uppercase tracking-wider">
                          {tour.theme.replace('_', ' ')}
                        </span>
                        <h3 className="text-2xl font-black">Your Custom Itinerary</h3>
                      </div>
                      <ItineraryView tour={tour} />
                    </div>
                  </div>

                  <div className="flex gap-4">
                    <button className="flex-1 py-4 px-6 bg-slate-900 text-white rounded-xl font-bold hover:bg-slate-800 transition-all">
                      Save to Mobile
                    </button>
                    <button className="flex-1 py-4 px-6 bg-white text-slate-900 border-2 border-slate-200 rounded-xl font-bold hover:border-slate-300 transition-all">
                      Share Tour
                    </button>
                  </div>
                </motion.div>
              ) : (
                <div className="bg-slate-100/50 rounded-3xl border-2 border-dashed border-slate-200 h-full min-h-[500px] flex flex-col items-center justify-center p-12 text-center text-slate-400">
                  <div className="bg-white p-6 rounded-full shadow-sm mb-6">
                    <Compass size={64} className="text-slate-200" />
                  </div>
                  <h3 className="text-xl font-semibold text-slate-600">No tour generated yet</h3>
                  <p className="max-w-xs mt-2">Fill out the form to start your personalised adventure in Edinburgh.</p>
                </div>
              )}
            </AnimatePresence>
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="bg-white border-t border-slate-200 py-12 mt-20">
        <div className="max-w-6xl mx-auto px-4 text-center space-y-4">
          <div className="flex items-center justify-center gap-2 opacity-50">
            <Compass size={20} />
            <span className="font-bold">EdinGuide AI</span>
          </div>
          <p className="text-sm text-slate-500">
            Built for the modern traveler. Explore responsibly.
          </p>
        </div>
      </footer>
    </div>
  );
}

export default App;
