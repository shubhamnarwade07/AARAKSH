import { Location, SavedLocation } from '@/types';
import { MOCK_LOCATIONS } from '@/data/mockLocations';

// Future: replace with ApiLocationProvider calling GET /locations, GET /locations/{id}
export const locationService = {
  async getAll(): Promise<Location[]> {
    await delay(300);
    return MOCK_LOCATIONS;
  },

  async getById(id: string): Promise<Location | null> {
    await delay(200);
    return MOCK_LOCATIONS.find(l => l.id === id) ?? null;
  },

  async getSavedLocations(_userId: string): Promise<SavedLocation[]> {
    await delay(200);
    // Demo: return two saved locations for any user
    return [
      { id: 'SL_001', userId: _userId, locationId: 'VLG_001', label: 'Home Village', createdAt: '2025-01-15T10:00:00Z' },
      { id: 'SL_002', userId: _userId, locationId: 'VLG_005', label: 'Workplace', createdAt: '2025-02-20T11:00:00Z' },
    ];
  },
};

function delay(ms: number) {
  return new Promise(r => setTimeout(r, ms));
}
