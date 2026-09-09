import { useQuery } from '@tanstack/react-query';
import { sensorService } from '@/services/sensorService';

export function useSensors() {
  return useQuery({
    queryKey: ['sensors'],
    queryFn: () => sensorService.getSensors(),
    staleTime: 10000,
    refetchInterval: 15000,
  });
}

export function useSensorById(id: string | null) {
  return useQuery({
    queryKey: ['sensor', id],
    queryFn: () => sensorService.getSensorById(id!),
    enabled: !!id,
    staleTime: 10000,
  });
}

export function useSensorHistory(sensorId: string | null) {
  return useQuery({
    queryKey: ['sensor', 'history', sensorId],
    queryFn: () => sensorService.getSensorHistory(sensorId!),
    enabled: !!sensorId,
    staleTime: 60000,
  });
}
