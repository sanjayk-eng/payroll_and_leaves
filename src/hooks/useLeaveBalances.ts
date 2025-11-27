import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { leaveBalanceService, AdjustLeaveBalanceRequest } from '@/services';
import { toast } from 'sonner';

export const useLeaveBalances = (employeeId: string) => {
  const queryClient = useQueryClient();

  const { data, isLoading, error } = useQuery({
    queryKey: ['leaveBalances', employeeId],
    queryFn: () => leaveBalanceService.getByEmployee(employeeId),
    enabled: !!employeeId,
  });

  const adjustMutation = useMutation({
    mutationFn: (adjustData: AdjustLeaveBalanceRequest) =>
      leaveBalanceService.adjust(employeeId, adjustData),
    onSuccess: (response) => {
      queryClient.invalidateQueries({ queryKey: ['leaveBalances', employeeId] });
      toast.success(response.message || 'Leave balance adjusted successfully');
    },
    onError: (error: any) => {
      toast.error(error.message || 'Failed to adjust leave balance');
    },
  });

  return {
    balances: data?.balances || [],
    employeeId: data?.employee_id,
    isLoading,
    error,
    adjustBalance: adjustMutation.mutate,
    isAdjusting: adjustMutation.isPending,
  };
};
