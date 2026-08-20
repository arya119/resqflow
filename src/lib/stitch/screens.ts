import { stitchClient } from './client';
import type { StitchScreen, StitchListScreensResponse } from './types';

// Fallback metadata for screens in case the Stitch API is queried without API keys
export const STATIC_STITCH_SCREENS: StitchScreen[] = [
  {
    name: 'projects/13255571167516538126/screens/2264e2267ee142b9ad02ee9166938743',
    title: 'ResQFlow | Operational Overview',
    deviceType: 'DESKTOP',
    width: '2560',
    height: '2096',
  },
  {
    name: 'projects/13255571167516538126/screens/21972db4bf5e45b68f3ebd5474ce2160',
    title: 'ResQFlow | Live Incidents',
    deviceType: 'DESKTOP',
    width: '2560',
    height: '2048',
  },
  {
    name: 'projects/13255571167516538126/screens/13dd348321bc495fb6e590a6de70367d',
    title: 'ResQFlow | Fleet & Mobility',
    deviceType: 'DESKTOP',
    width: '2560',
    height: '2048',
  },
  {
    name: 'projects/13255571167516538126/screens/9d6a0b67252c44c7a30a8585eeaf2d54',
    title: 'ResQFlow | Hospitals & Relief Centers',
    deviceType: 'DESKTOP',
    width: '2560',
    height: '2048',
  },
  {
    name: 'projects/13255571167516538126/screens/3aa8f577ff6f46998974eefeaae13209',
    title: 'ResQFlow | Warehouses',
    deviceType: 'DESKTOP',
    width: '2560',
    height: '2048',
  },
  {
    name: 'projects/13255571167516538126/screens/7004db213d5d405c955bfdf30e90b035',
    title: 'ResQFlow | Simulate Disruption',
    deviceType: 'DESKTOP',
    width: '2560',
    height: '2048',
  },
  {
    name: 'projects/13255571167516538126/screens/ee42f422e0db48e0aac19cdf4ca01dea',
    title: 'ResQFlow | Operational Reports',
    deviceType: 'DESKTOP',
    width: '2560',
    height: '2760',
  },
  {
    name: 'projects/13255571167516538126/screens/d0ad8b373c19415dbc3a99096f62d1c4',
    title: 'ResQFlow Dashboard',
    deviceType: 'DESKTOP',
    width: '1280',
    height: '1024',
  },
];

export async function listProjectScreens(projectId?: string): Promise<StitchScreen[]> {
  const targetProject = projectId || stitchClient.configuredProjectId;
  
  if (!stitchClient.isConfigured) {
    return STATIC_STITCH_SCREENS;
  }

  try {
    const data = await stitchClient.fetchStitch<StitchListScreensResponse>(
      `projects/${targetProject}/screens`
    );
    return data.screens || STATIC_STITCH_SCREENS;
  } catch (error) {
    console.warn('[Stitch API] Failed to fetch live screens, falling back to static reference:', error);
    return STATIC_STITCH_SCREENS;
  }
}
