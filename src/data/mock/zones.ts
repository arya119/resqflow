import type { Zone } from '@/types';

export const MOCK_ZONES: Zone[] = [
  {
    id: 'ZONE-FL-01',
    name: 'Riverfront Embankment Lowland (Zone 1)',
    type: 'flood_plain',
    polygon: [
      { lat: 27.4950, lng: 94.8850 },
      { lat: 27.4850, lng: 94.9100 },
      { lat: 27.4720, lng: 94.8920 },
      { lat: 27.4800, lng: 94.8750 },
    ],
    population: 14500,
    riskLevel: 'critical',
    floodProbability: 92,
    status: 'danger',
  },
  {
    id: 'ZONE-FL-02',
    name: 'Maijan–Chiring Flood Inundation Belt (Zone 2)',
    type: 'vulnerable',
    polygon: [
      { lat: 27.5100, lng: 94.9350 },
      { lat: 27.4950, lng: 94.9600 },
      { lat: 27.4820, lng: 94.9350 },
      { lat: 27.4920, lng: 94.9200 },
    ],
    population: 22000,
    riskLevel: 'high',
    floodProbability: 78,
    status: 'warning',
  },
  {
    id: 'ZONE-FL-03',
    name: 'Naliapool–South Low Basin (Zone 3)',
    type: 'evacuation',
    polygon: [
      { lat: 27.4600, lng: 94.8850 },
      { lat: 27.4520, lng: 94.9080 },
      { lat: 27.4410, lng: 94.8950 },
      { lat: 27.4480, lng: 94.8720 },
    ],
    population: 18500,
    riskLevel: 'high',
    floodProbability: 65,
    status: 'watch',
  },
];
