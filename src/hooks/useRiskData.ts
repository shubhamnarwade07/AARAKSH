import { useQuery } from '@tanstack/react-query';
import { riskService } from '@/services/riskService';

export function useAllRisk() {
  return useQuery({
    queryKey: ['risk', 'all'],
    queryFn: () => riskService.getAllRisk(),
    staleTime: 30000,
  });
}

export function useLocationRisk(locationId: string | null) {
  return useQuery({
    queryKey: ['risk', locationId],
    queryFn: () => riskService.getRiskByLocation(locationId!),
    enabled: !!locationId,
    staleTime: 30000,
  });
}

export function useRiskHistory(locationId: string | null) {
  return useQuery({
    queryKey: ['risk', 'history', locationId],
    queryFn: () => riskService.getRiskHistory(locationId!),
    enabled: !!locationId,
    staleTime: 60000,
  });
}
