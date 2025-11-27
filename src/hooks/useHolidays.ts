import { useQuery } from '@tanstack/react-query';
import { holidayService } from '@/services/holidayService';

export const useHolidays = () => {
  const { data: holidays = [], isLoading, error } = useQuery({
    queryKey: ['holidays', 'calendar'], // Different key to avoid conflict with settings holidays
    queryFn: async () => {
      try {
        console.log('🎯 useHolidays: Calling holidayService.getAll()...');
        const data = await holidayService.getAll();
        console.log('🎯 useHolidays: Received data:', data);
        const result = Array.isArray(data) ? data : [];
        console.log('🎯 useHolidays: Returning holidays:', result.length, 'items');
        return result;
      } catch (error) {
        console.error('🎯 useHolidays: Error caught:', error);
        return [];
      }
    },
    retry: false, // Don't retry on failure
    staleTime: 5 * 60 * 1000, // Cache for 5 minutes
  });

  console.log('🎯 useHolidays hook state:', {
    holidaysCount: holidays.length,
    isLoading,
    hasError: !!error,
    error
  });

  return {
    holidays,
    isLoading,
    error,
  };
};
