import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { settingsService, UpdateSettingsRequest, AddHolidayRequest } from '@/services';
import { toast } from 'sonner';

export const useSettings = () => {
  const queryClient = useQueryClient();

  const { data, isLoading, error } = useQuery({
    queryKey: ['settings'],
    queryFn: () => settingsService.get(),
  });

  const updateMutation = useMutation({
    mutationFn: (data: UpdateSettingsRequest) => settingsService.update(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['settings'] });
      toast.success('Settings updated successfully');
    },
    onError: (error: any) => {
      toast.error(error.message || 'Failed to update settings');
    },
  });

  return {
    settings: data?.settings,
    isLoading,
    error,
    updateSettings: updateMutation.mutate,
    isUpdating: updateMutation.isPending,
  };
};

export const useHolidays = () => {
  const queryClient = useQueryClient();

  const { data: holidays = [], isLoading, error } = useQuery({
    queryKey: ['holidays'],
    queryFn: async () => {
      try {
        const data = await settingsService.getHolidays();
        return Array.isArray(data) ? data : [];
      } catch (error) {
        console.error('Error fetching holidays:', error);
        return [];
      }
    },
  });

  const addMutation = useMutation({
    mutationFn: (data: AddHolidayRequest) => settingsService.addHoliday(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['holidays'] });
      toast.success('Holiday added successfully');
    },
    onError: (error: any) => {
      toast.error(error.message || 'Failed to add holiday');
    },
  });

  const deleteMutation = useMutation({
    mutationFn: (id: string) => settingsService.deleteHoliday(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['holidays'] });
      toast.success('Holiday deleted successfully');
    },
    onError: (error: any) => {
      toast.error(error.message || 'Failed to delete holiday');
    },
  });

  return {
    holidays,
    isLoading,
    error,
    addHoliday: addMutation.mutate,
    isAdding: addMutation.isPending,
    deleteHoliday: deleteMutation.mutate,
    isDeleting: deleteMutation.isPending,
  };
};
