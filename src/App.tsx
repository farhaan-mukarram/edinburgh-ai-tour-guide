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
    <div className="min-h-screen bg-stone font-sans text-royal-blue flex flex-col">
      {/* Header */}
      <header className="bg-white border-b border-stone-200 sticky top-0 z-50 shadow-sm">
        <div className="max-w-6xl mx-auto px-4 py-4 flex items-center justify-between">
          <div className="flex items-center gap-2 cursor-pointer" onClick={handleNewTour}>
            <div className="bg-royal-blue p-2 rounded text-stone">
              <Compass size={24} />
            </div>
            <h1 className="text-2xl font-serif font-bold text-royal-blue tracking-tight">
              EdinGuide AI
            </h1>
          </div>
          <nav className="hidden md:flex items-center gap-8 text-sm font-semibold uppercase tracking-wider text-slate-600">
            <button
              onClick={() => setView("form")}
              className={`hover:text-royal-blue transition-colors relative pb-1 ${view === "form" ? "text-royal-blue after:absolute after:bottom-0 after:left-0 after:w-full after:h-0.5 after:bg-royal-blue" : ""}`}
            >
              Tours
            </button>
            <button
              onClick={() => setView("about")}
              className={`hover:text-royal-blue transition-colors relative pb-1 ${view === "about" ? "text-royal-blue after:absolute after:bottom-0 after:left-0 after:w-full after:h-0.5 after:bg-royal-blue" : ""}`}
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
              <div className="text-center space-y-6 mb-12">
                <h2 className="text-5xl md:text-7xl font-serif font-black tracking-tight leading-tight text-royal-blue">
                  Discover <span className="italic text-thistle-purple underline decoration-gold/30">Edinburgh</span> <br />
                  with AI precision.
                </h2>
                <p className="text-xl text-slate-700 leading-relaxed max-w-2xl mx-auto font-medium">
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
                    className="absolute inset-0 bg-stone/90 backdrop-blur-sm rounded-2xl flex flex-col items-center justify-center text-center p-8 z-10 border-2 border-royal-blue/10"
                  >
                    <div className="relative mb-6">
                      <div className="w-20 h-20 border-4 border-royal-blue/10 border-t-royal-blue rounded-full animate-spin" />
                      <Sparkles
                        className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 text-royal-blue animate-pulse"
                        size={32}
                      />
                    </div>
                    <h3 className="text-3xl font-serif font-bold text-royal-blue">Crafting your itinerary...</h3>
                    <p className="text-slate-600 mt-2 font-medium">Connecting history, lore, and secret paths.</p>
                  </motion.div>
                )}
              </div>

              <div className="bg-white p-6 rounded-xl border border-royal-blue/10 shadow-sm flex gap-4 items-start max-w-2xl mx-auto">
                <Info className="text-thistle-purple shrink-0 mt-1" size={24} />
                <p className="text-royal-blue/80 italic leading-relaxed font-serif text-lg">
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
                  <TourMap 
                    tour={tour} 
                  />
                </div>

                {/* Right side: Itinerary - Scrollable */}
                <div className="w-full lg:w-1/2 bg-white p-6 md:p-12 lg:h-[calc(100vh-73.5px)] overflow-y-auto">
                  <div className="max-w-2xl mx-auto space-y-8">
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-stone-200 pb-8">
                      <div className="space-y-2">
                        <span className="px-3 py-1 bg-thistle-purple text-stone rounded text-xs font-bold uppercase tracking-widest">
                          {tour.theme.replace("_", " ")}
                        </span>
                        <h3 className="text-4xl font-serif font-black text-royal-blue">Your Custom Itinerary</h3>
                      </div>
                      <button 
                        onClick={handleNewTour}
                        className="px-6 py-3 bg-royal-blue text-stone rounded-lg font-bold hover:bg-royal-blue/90 transition-all text-sm whitespace-nowrap"
                      >
                        New Tour
                      </button>
                    </div>

                    <ItineraryView tour={tour} />
                  </div>
                </div>
              </motion.div>
            )
          )}
        </AnimatePresence>
      </main>

      {/* Footer - Only show on form and about pages */}
      {(view === "form" || view === "about") && (
        <footer className="bg-royal-blue text-stone py-16">
          <div className="max-w-6xl mx-auto px-4 text-center space-y-6">
            <div className="flex items-center justify-center gap-2 opacity-80">
              <Compass size={24} className="text-gold" />
              <span className="font-serif text-2xl font-bold tracking-tight">EdinGuide AI</span>
            </div>
            <p className="text-sm text-stone/60 font-medium uppercase tracking-widest">
              Built for the modern traveler. Explore Scotland responsibly.
            </p>
          </div>
        </footer>
      )}
    </div>
  );
}

export default App;
