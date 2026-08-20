/**
 * Stitch API Client (Server-side only)
 * Never import or expose credentials in client components.
 */

const STITCH_BASE_URL = 'https://stitch.googleapis.com/v1';

export class StitchClient {
  private apiKey: string | undefined;
  private projectId: string | undefined;

  constructor() {
    this.apiKey = process.env.STITCH_API_KEY;
    this.projectId = process.env.STITCH_PROJECT_ID || '13255571167516538126';
  }

  get isConfigured(): boolean {
    return Boolean(this.apiKey);
  }

  get configuredProjectId(): string {
    return this.projectId || '13255571167516538126';
  }

  async fetchStitch<T>(endpoint: string, options?: RequestInit): Promise<T> {
    if (!this.apiKey) {
      throw new Error('STITCH_API_KEY is not set in environment variables');
    }

    const separator = endpoint.includes('?') ? '&' : '?';
    const url = `${STITCH_BASE_URL}/${endpoint}${separator}key=${this.apiKey}`;

    const res = await fetch(url, {
      ...options,
      headers: {
        'Content-Type': 'application/json',
        ...options?.headers,
      },
    });

    if (!res.ok) {
      throw new Error(`Stitch API error: ${res.status} ${res.statusText}`);
    }

    return res.json() as Promise<T>;
  }
}

export const stitchClient = new StitchClient();
