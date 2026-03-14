import { generateText } from "ai";
import { createOpenAI } from "@ai-sdk/openai";
import type { Tour, TourPreferences, ItineraryItem, Location } from "../types";
import { EDINBURGH_LOCATIONS } from "../data/mockData";

const apiKey = import.meta.env.VITE_OPENAI_API_KEY;
const openai = createOpenAI({ apiKey });
const model = openai("gpt-5");

const getDistance = (
  lat1: number,
  lon1: number,
  lat2: number,
  lon2: number,
) => {
  const R = 6371; // Radius of the earth in km
  const dLat = (lat2 - lat1) * (Math.PI / 180);
  const dLon = (lon2 - lon1) * (Math.PI / 180);
  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos(lat1 * (Math.PI / 180)) *
      Math.cos(lat2 * (Math.PI / 180)) *
      Math.sin(dLon / 2) *
      Math.sin(dLon / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  return R * c;
};

// Simplified location picking logic
const getRoute = (preferences: TourPreferences) => {
  let filteredLocations = EDINBURGH_LOCATIONS.filter((loc) =>
    loc.themes.includes(preferences.theme),
  );

  if (filteredLocations.length < 3) {
    const historyLocs = EDINBURGH_LOCATIONS.filter(
      (loc) =>
        loc.themes.includes("history") && !filteredLocations.includes(loc),
    );
    filteredLocations = [...filteredLocations, ...historyLocs].slice(0, 5);
  }

  const startLocation =
    EDINBURGH_LOCATIONS.find((loc) => loc.id === preferences.startPoint) ||
    EDINBURGH_LOCATIONS[0];
  const unvisited = [
    ...filteredLocations.filter((loc) => loc.id !== startLocation.id),
  ];
  const itineraryLocs: Location[] = [startLocation];

  let currentLoc = startLocation;
  let totalDistance = 0;
  const maxStops = Math.floor((preferences.durationHours * 60) / 45);

  while (unvisited.length > 0 && itineraryLocs.length < maxStops) {
    let nearestIdx = 0;
    let minSourceDist = Infinity;

    for (let i = 0; i < unvisited.length; i++) {
      const dist = getDistance(
        currentLoc.lat,
        currentLoc.lng,
        unvisited[i].lat,
        unvisited[i].lng,
      );
      if (dist < minSourceDist) {
        minSourceDist = dist;
        nearestIdx = i;
      }
    }

    const nextLoc = unvisited.splice(nearestIdx, 1)[0];
    totalDistance += minSourceDist;
    itineraryLocs.push(nextLoc);
    currentLoc = nextLoc;
  }

  return { itineraryLocs, totalDistance };
};

export const generateTourAI = async (
  preferences: TourPreferences,
): Promise<Tour> => {
  const { itineraryLocs, totalDistance } = getRoute(preferences);

  const prompt = `
    Generate a personalized Edinburgh walking tour based on the following:
    Theme: ${preferences.theme}
    Locations: ${itineraryLocs.map((l) => l.name).join(", ")}
    Pace: ${preferences.pace}

    IMPORTANT: First, choose a realistic current weather condition and crowd level for Edinburgh (e.g., "drizzling and misty", "sunny but windy", "quiet and peaceful", or "busy with festival tourists").
    
    For each location, provide a creative narrative that takes these chosen weather and crowd conditions into account.
    Also provide specific weatherAdvice and crowdAdvice for each stop.
    
    Format the response as JSON with:
    - chosenWeather: a brief description of the weather you chose
    - chosenCrowds: the crowd level you chose
    - items: an array where each object has:
      - locationName (must match one of the input names)
      - narrative (a few sentences)
      - weatherAdvice (one sentence)
      - crowdAdvice (one sentence)
  `;

  try {
    const apiKey = import.meta.env.VITE_OPENAI_API_KEY;

    if (!apiKey) {
      throw new Error(
        "OpenAI API key is not defined in your environment (VITE_OPENAI_API_KEY).",
      );
    }

    const { text } = await generateText({
      model: openai("gpt-5"),
      prompt,
    });

    const jsonStr = text.substring(
      text.indexOf("{"),
      text.lastIndexOf("}") + 1,
    );
    const response = JSON.parse(jsonStr);
    const aiItems = response.items as any[];

    const itinerary: ItineraryItem[] = itineraryLocs.map((loc) => {
      const aiInfo = aiItems.find((item) => item.locationName === loc.name) || {
        narrative: `Exploring ${loc.name} through the lens of ${preferences.theme}.`,
        weatherAdvice: `Enjoy your visit to ${loc.name}.`,
        crowdAdvice: `Take your time exploring.`,
      };

      return {
        location: loc,
        estimatedTimeMin: 45,
        narrative: aiInfo.narrative,
        weatherAdvice: aiInfo.weatherAdvice,
        crowdAdvice: aiInfo.crowdAdvice,
      };
    });

    return {
      id: Math.random().toString(36).substring(2, 11),
      itinerary,
      totalDistanceKm: Number(totalDistance.toFixed(2)),
      totalDurationMin: itinerary.length * 45,
      theme: preferences.theme,
    };
  } catch (error) {
    console.error("AI generation failed, falling back to mock:", error);
    const itinerary: ItineraryItem[] = itineraryLocs.map((loc) => ({
      location: loc,
      estimatedTimeMin: 45,
      narrative: `Exploring ${loc.name} on a typical Edinburgh day.`,
      weatherAdvice: `Be prepared for the changing Scottish weather.`,
      crowdAdvice: `Check for local events that might affect crowd levels.`,
    }));

    return {
      id: Math.random().toString(36).substring(2, 11),
      itinerary,
      totalDistanceKm: Number(totalDistance.toFixed(2)),
      totalDurationMin: itinerary.length * 45,
      theme: preferences.theme,
    };
  }
};
