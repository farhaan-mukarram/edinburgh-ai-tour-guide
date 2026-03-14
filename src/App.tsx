import React from "react";
import { TourForm } from "./components/TourForm";
import { TourMap } from "./components/TourMap";
import { ItineraryView } from "./components/ItineraryView";
import { About } from "./components/About";
import type { Tour, TourPreferences } from "./types";
import { generateTourAI } from "./utils/tourGenerator";
import { Sparkles, Compass, Info } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

function App() {
  const [view, setView] = React.useState<"form" | "about" | "result">("form");
  const [tour, setTour] = React.useState<Tour | null>(null);
  const [isGenerating, setIsGenerating] = React.useState(false);

  const handleGenerate = async (prefs: TourPreferences) => {
    setIsGenerating(true);
    setView("form"); // Keep form view for loading overlay if needed, or switch to loading

    try {
      const newTour = await generateTourAI(prefs);
      setTour(newTour);
      setView("result");
    } catch (error) {
      console.error("Failed to generate tour:", error);
    } finally {
      setIsGenerating(false);
    }
  };

  const handleNewTour = () => {
    setTour(null);
    setView("form");
  };

  return (
    <div className="min-h-screen bg-slate-50 font-sans text-slate-900 flex flex-col">
      {/* Header */}
      <header className="bg-white border-b border-slate-200 sticky top-0 z-50">
        <div className="max-w-6xl mx-auto px-4 py-4 flex items-center justify-between">
          <div className="flex items-center gap-2 cursor-pointer" onClick={handleNewTour}>
            <div className="bg-blue-600 p-2 rounded-lg text-white">
              <Compass size={24} />
            </div>
            <h1 className="text-xl font-bold bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent">
              EdinGuide AI
            </h1>
          </div>
          <nav className="hidden md:flex items-center gap-6 text-sm font-medium text-slate-600">
            <button
              onClick={() => setView("form")}
              className={`hover:text-blue-600 transition-colors ${view === "form" ? "text-blue-600 font-bold" : ""}`}
            >
              Tours
            </button>
            <button
              onClick={() => setView("about")}
              className={`hover:text-blue-600 transition-colors ${view === "about" ? "text-blue-600 font-bold" : ""}`}
            >
              About
            </button>
          </nav>
        </div>
      </header>

      <main className="flex-grow">
        <AnimatePresence mode="wait">
          {view === "about" ? (
            <motion.div
              key="about"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              className="max-w-4xl mx-auto px-4 py-12"
            >
              <About />
            </motion.div>
          ) : view === "form" ? (
            <motion.div
              key="form"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className="max-w-3xl mx-auto px-4 py-12 space-y-8"
            >
              <div className="text-center space-y-4 mb-8">
                <h2 className="text-4xl md:text-6xl font-black tracking-tight leading-tight">
                  Discover <span className="text-blue-600">Edinburgh</span> <br />
                  with AI precision.
                </h2>
                <p className="text-xl text-slate-600 leading-relaxed max-w-2xl mx-auto">
                  Choose your vibe, and let our AI craft a personalised walking
                  tour through the historic streets of Scotland's capital.
                </p>
              </div>

              <div className="relative">
                <TourForm onGenerate={handleGenerate} />
                
                {isGenerating && (
                  <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    className="absolute inset-0 bg-white/80 backdrop-blur-sm rounded-2xl flex flex-col items-center justify-center text-center p-8 z-10"
                  >
                    <div className="relative mb-6">
                      <div className="w-20 h-20 border-4 border-blue-100 border-t-blue-600 rounded-full animate-spin" />
                      <Sparkles
                        className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 text-blue-600 animate-pulse"
                        size={32}
                      />
                    </div>
                    <h3 className="text-2xl font-bold">Crafting your story...</h3>
                    <p className="text-slate-500 mt-2">Connecting history, lore, and secret paths.</p>
                  </motion.div>
                )}
              </div>

              <div className="bg-blue-50 p-6 rounded-2xl border border-blue-100 flex gap-4 items-start max-w-2xl mx-auto">
                <Info className="text-blue-500 shrink-0 mt-1" size={24} />
                <p className="text-blue-800 italic leading-relaxed">
                  Our AI considers current events, historical significance, and
                  local secrets to build your unique itinerary.
                </p>
              </div>
            </motion.div>
          ) : (
            tour && (
              <motion.div
                key="result"
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 1.05 }}
                className="w-full h-full flex flex-col lg:flex-row min-h-[calc(100vh-73px)]"
              >
                {/* Left side: Map - Full height on desktop */}
                <div className="w-full lg:w-1/2 h-[calc(100vh-73.5px)] lg:h-auto lg:sticky lg:top-[73.5px] z-10 lg:z-0">
                  <TourMap tour={tour} />
                </div>

                {/* Right side: Itinerary - Scrollable */}
                <div className="w-full lg:w-1/2 bg-white p-6 md:p-12 lg:h-[calc(100vh-73.5px)] overflow-y-auto">
                  <div className="max-w-2xl mx-auto space-y-8">
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-100 pb-8">
                      <div className="space-y-2">
                        <span className="px-3 py-1 bg-blue-100 text-blue-700 rounded-full text-xs font-bold uppercase tracking-wider">
                          {tour.theme.replace("_", " ")}
                        </span>
                        <h3 className="text-3xl font-black">Your Custom Itinerary</h3>
                      </div>
                      <button 
                        onClick={handleNewTour}
                        className="px-6 py-3 bg-slate-100 text-slate-700 rounded-xl font-bold hover:bg-slate-200 transition-all text-sm whitespace-nowrap"
                      >
                        New Tour
                      </button>
                    </div>

                    <ItineraryView tour={tour} />

                    <div className="flex flex-col sm:flex-row gap-4 pt-12 border-t border-slate-100">
                      <button className="flex-1 py-4 px-6 bg-slate-900 text-white rounded-xl font-bold hover:bg-slate-800 transition-all">
                        Save to Mobile
                      </button>
                      <button className="flex-1 py-4 px-6 bg-white text-slate-900 border-2 border-slate-200 rounded-xl font-bold hover:border-slate-300 transition-all">
                        Share Tour
                      </button>
                    </div>
                  </div>
                </div>
              </motion.div>
            )
          )}
        </AnimatePresence>
      </main>

      {/* Footer - Only show on form and about pages */}
      {(view === "form" || view === "about") && (
        <footer className="bg-white border-t border-slate-200 py-12">
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
      )}
    </div>
  );
}

export default App;
