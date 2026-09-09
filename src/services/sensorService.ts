import { Sensor, SensorHistory, SensorReading } from '@/types';
import { MOCK_SENSORS } from '@/data/mockSensors';

// Future: replace with MQTT/API data provider
export const sensorService = {
  async getSensors(): Promise<Sensor[]> {
    await delay(300);
    return MOCK_SENSORS;
  },

  async getSensorById(id: string): Promise<Sensor | null> {
    await delay(200);
    return MOCK_SENSORS.find(s => s.id === id) ?? null;
  },

  async getSensorHistory(sensorId: string): Promise<SensorHistory> {
    await delay(250);
    const sensor = MOCK_SENSORS.find(s => s.id === sensorId);
    const baseValue = sensor?.lastReading.value ?? 50;
    const unit = sensor?.lastReading.unit ?? 'unit';
    const readings: SensorReading[] = [];
    const now = Date.now();
    for (let i = 23; i >= 0; i--) {
      const t = now - i * 3600000;
      const variance = Math.sin(i * 0.5) * (baseValue * 0.15);
      const value = Math.max(0, baseValue - (i * 0.8) + variance);
      readings.push({
        sensorId,
        value: parseFloat(value.toFixed(2)),
        unit,
        timestamp: new Date(t).toISOString(),
        isSimulated: true,
      });
    }
    return { sensorId, readings };
  },
};

function delay(ms: number) {
  return new Promise(r => setTimeout(r, ms));
}
