import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { alertService } from '@/services/alertService';
import { AlertFilters } from '@/types';
import { useAuth } from '@/contexts/AuthContext';

export function useAlerts(filters?: AlertFilters) {
  return useQuery({
    queryKey: ['alerts', filters],
    queryFn: () => alertService.getAlerts(filters),
    staleTime: 15000,
  });
}

export function useAcknowledgeAlert() {
  const queryClient = useQueryClient();
  const { user } = useAuth();
  return useMutation({
    mutationFn: (alertId: string) => alertService.acknowledgeAlert(alertId, user?.email ?? 'unknown'),
    onSuccess: () => { queryClient.invalidateQueries({ queryKey: ['alerts'] }); },
  });
}

export function useResolveAlert() {
  const queryClient = useQueryClient();
  const { user } = useAuth();
  return useMutation({
    mutationFn: (alertId: string) => alertService.resolveAlert(alertId, user?.email ?? 'unknown'),
    onSuccess: () => { queryClient.invalidateQueries({ queryKey: ['alerts'] }); },
  });
}
