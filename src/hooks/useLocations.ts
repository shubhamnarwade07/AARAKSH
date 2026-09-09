import { useQuery } from '@tanstack/react-query';
import { locationService } from '@/services/locationService';
import { useAuth } from '@/contexts/AuthContext';

export function useLocations() {
  return useQuery({
    queryKey: ['locations'],
    queryFn: () => locationService.getAll(),
    staleTime: 60000,
  });
}

export function useLocationById(id: string | null) {
  return useQuery({
    queryKey: ['location', id],
    queryFn: () => locationService.getById(id!),
    enabled: !!id,
    staleTime: 60000,
  });
}

export function useSavedLocations() {
  const { user } = useAuth();
  return useQuery({
    queryKey: ['savedLocations', user?.id],
    queryFn: () => locationService.getSavedLocations(user!.id),
    enabled: !!user,
    staleTime: 60000,
  });
}
