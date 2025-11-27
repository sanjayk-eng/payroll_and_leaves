import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { leaveService, ApplyLeaveRequest, AdminAddLeaveRequest, LeaveActionRequest } from '@/services';
import { toast } from 'sonner';

export const useLeavePolicies = () => {
  const queryClient = useQueryClient();

  const { data: policies = [], isLoading, error } = useQuery({
    queryKey: ['leavePolicies'],
    queryFn: () => leaveService.getAllPolicies(),
  });

  const addPolicyMutation = useMutation({
    mutationFn: (data: { name: string; is_paid: boolean; default_entitlement: number }) => leaveService.addPolicy(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['leavePolicies'] });
      toast.success('Leave policy added successfully');
    },
    onError: (error: any) => {
      toast.error(error.message || 'Failed to add leave policy');
    },
  });

  return {
    policies,
    isLoading,
    error,
    addPolicy: addPolicyMutation.mutate,
    isAdding: addPolicyMutation.isPending,
  };
};

export const useLeaves = () => {
  const queryClient = useQueryClient();

  const { data, isLoading, error } = useQuery({
    queryKey: ['leaves'],
    queryFn: () => leaveService.getAll(),
  });

  const applyMutation = useMutation({
    mutationFn: (data: ApplyLeaveRequest) => leaveService.apply(data),
    onSuccess: (response) => {
      queryClient.invalidateQueries({ queryKey: ['leaves'] });
      queryClient.invalidateQueries({ queryKey: ['leaveBalances'] });
      toast.success(response.message || 'Leave applied successfully');
    },
    onError: (error: any) => {
      toast.error(error.message || 'Failed to apply leave');
    },
  });

  const adminAddMutation = useMutation({
    mutationFn: (data: AdminAddLeaveRequest) => leaveService.adminAdd(data),
    onSuccess: (response) => {
      queryClient.invalidateQueries({ queryKey: ['leaves'] });
      queryClient.invalidateQueries({ queryKey: ['leaveBalances'] });
      toast.success(response.message || 'Leave added successfully');
    },
    onError: (error: any) => {
      toast.error(error.message || 'Failed to add leave');
    },
  });

  const actionMutation = useMutation({
    mutationFn: ({ id, action }: { id: string; action: LeaveActionRequest }) => {
      console.log('Processing leave action:', { id, action });
      console.log('API endpoint:', `/leaves/${id}/action`);
      return leaveService.action(id, action);
    },
    onSuccess: (response) => {
      queryClient.invalidateQueries({ queryKey: ['leaves'] });
      queryClient.invalidateQueries({ queryKey: ['leaveBalances'] });
      toast.success(response.message);
    },
    onError: (error: any) => {
      console.error('Leave action error:', error);
      toast.error(error.message || 'Failed to process leave');
    },
  });

  return {
    leaves: data?.data || [],
    total: data?.total || 0,
    isLoading,
    error,
    applyLeave: applyMutation.mutate,
    isApplying: applyMutation.isPending,
    adminAddLeave: adminAddMutation.mutate,
    isAdminAdding: adminAddMutation.isPending,
    processLeave: actionMutation.mutate,
    isProcessing: actionMutation.isPending,
  };
};
