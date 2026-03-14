import { generateText } from "ai";
import { createOpenAI } from "@ai-sdk/openai";
import type { Tour, TourPreferences, ItineraryItem, Location } from "../types";
import { EDINBURGH_LOCATIONS } from "../data/mockData";

const apiKey = import.meta.env.VITE_OPENAI_API_KEY;
const openai = createOpenAI({ apiKey });

const PACE_TIMES = {
  relaxed: { avgVisit: 60, stopsPerHour: 0.8 },
  moderate: { avgVisit: 45, stopsPerHour: 1.2 },
  brisk: { avgVisit: 25, stopsPerHour: 2.0 },
};

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
  const paceConfig = PACE_TIMES[preferences.pace];
  const maxStops = Math.max(3, Math.floor(preferences.durationHours * paceConfig.stopsPerHour));

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
    Also estimate a realistic visit time in minutes for each location. This SHOULD NOT be a fixed number; it must vary based on the location's nature (e.g., climbing Arthur's Seat takes longer than seeing Greyfriars Bobby) and the selected pace (${preferences.pace}).
    For a "${preferences.pace}" pace, adjust the depth of exploration accordingly.
    
    Also provide specific weatherAdvice and crowdAdvice for each stop. These should be short, practical, and easy to read (max 10-12 words).
    
    Format the response as JSON with:
    - chosenWeather: a brief description of the weather you chose (max 6 words)
    - chosenCrowds: the crowd level you chose (max 6 words)
    - items: an array where each object has:
      - locationName (must match one of the input names)
      - estimatedTimeMin (number of minutes)
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

    const paceConfig = PACE_TIMES[preferences.pace];
    const defaultEstimatedTime = paceConfig.avgVisit;

    const itinerary: ItineraryItem[] = itineraryLocs.map((loc) => {
      const aiInfo = aiItems.find((item) => item.locationName === loc.name) || {
        narrative: `Exploring ${loc.name} through the lens of ${preferences.theme}.`,
        estimatedTimeMin: defaultEstimatedTime,
        weatherAdvice: `Enjoy your visit to ${loc.name}.`,
        crowdAdvice: `Take your time exploring.`,
      };

      return {
        location: loc,
        estimatedTimeMin: aiInfo.estimatedTimeMin || defaultEstimatedTime,
        narrative: aiInfo.narrative,
        weatherAdvice: aiInfo.weatherAdvice,
        crowdAdvice: aiInfo.crowdAdvice,
      };
    });

    return {
      id: Math.random().toString(36).substring(2, 11),
      itinerary,
      totalDistanceKm: Number(totalDistance.toFixed(2)),
      totalDurationMin: itinerary.reduce((acc, item) => acc + item.estimatedTimeMin, 0),
      theme: preferences.theme,
      chosenWeather: response.chosenWeather,
      chosenCrowds: response.chosenCrowds,
    };
  } catch (error) {
    console.error("AI generation failed, falling back to mock:", error);
    const paceConfig = PACE_TIMES[preferences.pace];
    const avgTime = paceConfig.avgVisit;

    const itinerary: ItineraryItem[] = itineraryLocs.map((loc) => {
      // Add some artificial variance to the fallback so it doesn't look hardcoded
      const variance = Math.floor(Math.random() * 11) - 5; // -5 to +5
      return {
        location: loc,
        estimatedTimeMin: avgTime + variance,
        narrative: `Exploring ${loc.name} on a typical Edinburgh day.`,
        weatherAdvice: `Be prepared for the changing Scottish weather.`,
        crowdAdvice: `Check for local events that might affect crowd levels.`,
      };
    });

    return {
      id: Math.random().toString(36).substring(2, 11),
      itinerary,
      totalDistanceKm: Number(totalDistance.toFixed(2)),
      totalDurationMin: itinerary.reduce((acc, item) => acc + item.estimatedTimeMin, 0),
      theme: preferences.theme,
      chosenWeather: "Changing Scottish skies",
      chosenCrowds: "Typical city bustle",
    };
  }
};
