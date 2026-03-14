import type { Tour, TourPreferences, ItineraryItem, Location } from '../types';
import { EDINBURGH_LOCATIONS } from '../data/mockData';

const getDistance = (lat1: number, lon1: number, lat2: number, lon2: number) => {
  const R = 6371; // Radius of the earth in km
  const dLat = (lat2 - lat1) * (Math.PI / 180);
  const dLon = (lon2 - lon1) * (Math.PI / 180);
  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos(lat1 * (Math.PI / 180)) * Math.cos(lat2 * (Math.PI / 180)) * Math.sin(dLon / 2) * Math.sin(dLon / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  return R * c;
};

const generateNarrative = (location: Location, theme: string): string => {
  const narratives: Record<string, string[]> = {
    history: [
      `As you approach ${location.name}, you can feel the weight of centuries of Scottish history. This site has witnessed countless events that shaped the nation.`,
      `The stone walls of ${location.name} tell a story of power, resilience, and the enduring spirit of Edinburgh.`,
    ],
    ghosts: [
      `Keep your eyes peeled at ${location.name}. Legends say that some former inhabitants never truly left, and cold spots are often reported here.`,
      `The dark corners of ${location.name} hide secrets from Edinburgh's more macabre past. Listen closely for whispers from the beyond.`,
    ],
    harry_potter: [
      `Fans of the wizarding world might find ${location.name} strangely familiar. It's easy to see how this atmosphere inspired tales of magic and wonder.`,
      `Look closely at the details of ${location.name} - you might spot a direct connection to a certain boy wizard's adventures.`,
    ],
    nature: [
      `${location.name} offers a breath of fresh air amidst the city. Take a moment to appreciate the natural beauty that coexists with Edinburgh's urban landscape.`,
      `The greenery and tranquility of ${location.name} provide a perfect escape from the bustling Royal Mile.`,
    ],
    food: [
      `${location.name} is a cornerstone of Edinburgh's culinary scene. Here, tradition meets modern flavor in the most delicious way.`,
      `Prepare your taste buds for what ${location.name} has to offer - it's a true highlight for any food lover in the city.`,
    ],
    literature: [
      `${location.name} has served as both an inspiration and a meeting place for some of Scotland's greatest literary minds.`,
      `Walk the same paths as the authors who immortalized Edinburgh in their books while exploring ${location.name}.`,
    ],
  };

  const selectedNarratives = narratives[theme] || narratives.history;
  return selectedNarratives[Math.floor(Math.random() * selectedNarratives.length)];
};

export const generateTour = (preferences: TourPreferences): Tour => {
  // Filter locations by theme
  let filteredLocations = EDINBURGH_LOCATIONS.filter(loc => loc.themes.includes(preferences.theme));
  
  // If not enough locations, add some general history ones
  if (filteredLocations.length < 3) {
    const historyLocs = EDINBURGH_LOCATIONS.filter(loc => loc.themes.includes('history') && !filteredLocations.includes(loc));
    filteredLocations = [...filteredLocations, ...historyLocs].slice(0, 5);
  }

  // Simple greedy algorithm to order locations by distance from start
  // (In a real app, we'd use a more sophisticated TSP solver or routing API)
  const startLocation = EDINBURGH_LOCATIONS.find(loc => loc.id === preferences.startPoint) || EDINBURGH_LOCATIONS[0];
  
  const unvisited = [...filteredLocations.filter(loc => loc.id !== startLocation.id)];
  const itinerary: ItineraryItem[] = [{
    location: startLocation,
    estimatedTimeMin: 30,
    narrative: generateNarrative(startLocation, preferences.theme)
  }];

  let currentLoc = startLocation;
  let totalDistance = 0;
  
  // Limit itinerary based on duration (very roughly: 45 mins per stop + travel)
  const maxStops = Math.floor(preferences.durationHours * 60 / 45);

  while (unvisited.length > 0 && itinerary.length < maxStops) {
    let nearestIdx = 0;
    let minSourceDist = Infinity;

    for (let i = 0; i < unvisited.length; i++) {
      const dist = getDistance(currentLoc.lat, currentLoc.lng, unvisited[i].lat, unvisited[i].lng);
      if (dist < minSourceDist) {
        minSourceDist = dist;
        nearestIdx = i;
      }
    }

    const nextLoc = unvisited.splice(nearestIdx, 1)[0];
    totalDistance += minSourceDist;
    itinerary.push({
      location: nextLoc,
      estimatedTimeMin: 30,
      narrative: generateNarrative(nextLoc, preferences.theme)
    });
    currentLoc = nextLoc;
  }

  return {
    id: Math.random().toString(36).substr(2, 9),
    itinerary,
    totalDistanceKm: Number(totalDistance.toFixed(2)),
    totalDurationMin: itinerary.length * 45, // Rough estimate
    theme: preferences.theme
  };
};
