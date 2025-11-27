import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { employeeService, CreateEmployeeRequest } from '@/services';
import { toast } from 'sonner';

export const useEmployees = () => {
  const queryClient = useQueryClient();

  const { data: employees = [], isLoading, error } = useQuery({
    queryKey: ['employees'],
    queryFn: () => employeeService.getAll(),
  });

  const createMutation = useMutation({
    mutationFn: (data: CreateEmployeeRequest) => employeeService.create(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['employees'] });
      toast.success('Employee created successfully');
    },
    onError: (error: any) => {
      toast.error(error.message || 'Failed to create employee');
    },
  });

  const updateRoleMutation = useMutation({
    mutationFn: ({ id, role }: { id: string; role: string }) =>
      employeeService.updateRole(id, { role }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['employees'] });
      toast.success('Role updated successfully');
    },
    onError: (error: any) => {
      toast.error(error.message || 'Failed to update role');
    },
  });

  const updateManagerMutation = useMutation({
    mutationFn: ({ id, manager_id }: { id: string; manager_id: string }) =>
      employeeService.updateManager(id, { manager_id }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['employees'] });
      toast.success('Manager updated successfully');
    },
    onError: (error: any) => {
      toast.error(error.message || 'Failed to update manager');
    },
  });

  const deactivateMutation = useMutation({
    mutationFn: (id: string) => employeeService.deactivate(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['employees'] });
      toast.success('Employee status updated successfully');
    },
    onError: (error: any) => {
      toast.error(error.message || 'Failed to update employee status');
    },
  });

  return {
    employees,
    isLoading,
    error,
    createEmployee: createMutation.mutate,
    isCreating: createMutation.isPending,
    updateRole: updateRoleMutation.mutate,
    updateManager: updateManagerMutation.mutate,
    deactivateEmployee: deactivateMutation.mutate,
    isDeactivating: deactivateMutation.isPending,
  };
};
