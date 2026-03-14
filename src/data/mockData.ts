import type { Location, Theme } from '../types';

export const THEMES: { id: Theme; label: string; description: string; emoji: string }[] = [
  { id: 'history', label: 'Royal Mile History', description: 'Explore the historic heart of the Old Town.', emoji: '🏰' },
  { id: 'ghosts', label: 'Dark Deeds & Ghosts', description: 'Hear the spooky tales of Edinburgh\'s past.', emoji: '👻' },
  { id: 'harry_potter', label: 'Wizarding Wonders', description: 'Visit the spots that inspired J.K. Rowling.', emoji: '🪄' },
  { id: 'nature', label: 'Parks & Peaks', description: 'Climb Arthur\'s Seat and visit the Meadows.', emoji: '⛰️' },
  { id: 'food', label: 'Foodie Trail', description: 'Sample the best haggis, shortbread, and whisky.', emoji: '🥘' },
  { id: 'literature', label: 'Literary Legends', description: 'Follow in the footsteps of Scott, Burns, and Stevenson.', emoji: '📚' },
];

export const EDINBURGH_LOCATIONS: Location[] = [
  {
    id: 'edinburgh-castle',
    name: 'Edinburgh Castle',
    lat: 55.9486,
    lng: -3.1999,
    description: 'A historic fortress which dominates the skyline of Edinburgh.',
    themes: ['history', 'ghosts']
  },
  {
    id: 'st-giles-cathedral',
    name: 'St Giles\' Cathedral',
    lat: 55.9495,
    lng: -3.1908,
    description: 'The historic City Church of Edinburgh with its famous crown spire.',
    themes: ['history', 'literature']
  },
  {
    id: 'holyrood-palace',
    name: 'Palace of Holyroodhouse',
    lat: 55.9527,
    lng: -3.1722,
    description: 'The official residence of the British monarch in Scotland.',
    themes: ['history']
  },
  {
    id: 'arthurs-seat',
    name: 'Arthur\'s Seat',
    lat: 55.9441,
    lng: -3.1618,
    description: 'An ancient volcano and the main peak of the group of hills in Edinburgh.',
    themes: ['nature']
  },
  {
    id: 'greyfriars-kirkyard',
    name: 'Greyfriars Kirkyard',
    lat: 55.9469,
    lng: -3.1923,
    description: 'A graveyard surrounding Greyfriars Kirk, famous for Greyfriars Bobby.',
    themes: ['ghosts', 'harry_potter', 'history']
  },
  {
    id: 'the-elephant-house',
    name: 'The Elephant House',
    lat: 55.9477,
    lng: -3.1920,
    description: 'A cafe where J.K. Rowling wrote parts of the Harry Potter books.',
    themes: ['harry_potter', 'literature', 'food']
  },
  {
    id: 'victoria-street',
    name: 'Victoria Street',
    lat: 55.9482,
    lng: -3.1932,
    description: 'A colorful, curved street said to be the inspiration for Diagon Alley.',
    themes: ['harry_potter', 'history']
  },
  {
    id: 'scott-monument',
    name: 'Scott Monument',
    lat: 55.9524,
    lng: -3.1933,
    description: 'A Victorian Gothic monument to Scottish author Sir Walter Scott.',
    themes: ['literature', 'history']
  },
  {
    id: 'grassmarket',
    name: 'Grassmarket',
    lat: 55.9475,
    lng: -3.1956,
    description: 'A historic marketplace with a dark history of executions and lively pubs.',
    themes: ['history', 'ghosts', 'food']
  },
  {
    id: 'royal-botanic-garden',
    name: 'Royal Botanic Garden',
    lat: 55.9653,
    lng: -3.2098,
    description: 'A world-renowned center for plant science and education.',
    themes: ['nature']
  }
];
