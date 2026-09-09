import { DataSource, DataSourceType } from '@/types';

export const MOCK_DATA_SOURCES: DataSource[] = [
  {
    id: 'DS_001', name: 'IMD Rainfall API', type: 'WEATHER_API',
    description: 'India Meteorological Department rainfall and weather forecast API. Provides grid-level rainfall estimates and NWP model outputs.',
    coverage: 'Pan-India (0.25° grid)', updateFrequency: '3-hourly', provider: 'India Meteorological Department',
    status: 'PENDING', lastSync: null, dataQuality: 'High', isLive: false,
    notes: 'API integration planned. Requires IMD data sharing agreement.',
  },
  {
    id: 'DS_002', name: 'Bhuvana Satellite DEM', type: 'TERRAIN',
    description: 'Digital Elevation Model from ISRO Bhuvana platform. Used for terrain slope, aspect, and drainage network analysis.',
    coverage: 'All hilly states', updateFrequency: 'Static', provider: 'ISRO Bhuvana',
    status: 'ACTIVE', lastSync: '2024-12-01T00:00:00Z', dataQuality: 'High', isLive: false,
    notes: 'DEM data processed and stored in prototype database. Used for GIS feature engineering (demo mode uses pre-computed values).',
  },
  {
    id: 'DS_003', name: 'IoT Sensor Network', type: 'IOT',
    description: 'Planned IoT sensor network of rain gauges, soil moisture sensors, water level gauges, and slope sensors deployed in high-risk zones.',
    coverage: 'Prototype deployment — Rudraprayag district', updateFrequency: '5-minute intervals',
    status: 'PENDING', lastSync: null, dataQuality: 'Simulated', isLive: false,
    notes: 'Sensor hardware not yet procured. Demo uses simulated sensor values.',
  },
  {
    id: 'DS_004', name: 'SRTM Historical Events', type: 'HISTORICAL',
    description: 'Historical flood and landslide event records compiled from government disaster management reports and academic literature.',
    coverage: 'Uttarakhand, Sikkim, Himachal Pradesh', updateFrequency: 'Annual',
    status: 'ACTIVE', lastSync: '2024-10-15T00:00:00Z', dataQuality: 'Medium', isLive: false,
    notes: 'Curated dataset from NDMA reports, NDRF reports, and published research. Used for model training preparation.',
  },
  {
    id: 'DS_005', name: 'CWC River Level Gauges', type: 'HYDROLOGICAL',
    description: 'Central Water Commission river level gauging station data for major rivers.',
    coverage: 'Major rivers — Mandakini, Teesta, Beas', updateFrequency: 'Hourly',
    status: 'PENDING', lastSync: null, dataQuality: 'High', isLive: false,
    notes: 'Integration planned for Phase 2. Requires CWC data sharing MoU.',
  },
  {
    id: 'DS_006', name: 'Sentinel-1 SAR (ISRO)', type: 'SATELLITE',
    description: 'Sentinel-1 SAR data for soil moisture estimation and flood inundation mapping using change detection.',
    coverage: 'Hilly regions of India', updateFrequency: '6-12 days',
    status: 'PENDING', lastSync: null, dataQuality: 'High', isLive: false,
    notes: 'Integration with ISRO MOSDAC platform planned for Phase 3.',
  },
];
