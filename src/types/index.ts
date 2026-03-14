export type Theme = 'history' | 'ghosts' | 'harry_potter' | 'nature' | 'food' | 'literature';
  
export interface ThemeDetail {
  id: Theme;
  label: string;
  description: string;
  emoji: string;
  highlights: string[];
  duration: string;
  bestTime: string;
}

export interface Location {
  id: string;
  name: string;
  lat: number;
  lng: number;
  description: string;
  themes: Theme[];
}

export interface TourPreferences {
  startPoint: string;
  theme: Theme;
  durationHours: number;
  pace: 'relaxed' | 'moderate' | 'brisk';
  date: string;
}

export interface ItineraryItem {
  location: Location;
  estimatedTimeMin: number;
  weatherAdvice?: string;
  crowdAdvice?: string;
}

export interface Tour {
  id: string;
  itinerary: ItineraryItem[];
  totalDistanceKm: number;
  totalDurationMin: number;
  theme: Theme;
  date: string;
  chosenWeather?: string;
  chosenCrowds?: string;
}
