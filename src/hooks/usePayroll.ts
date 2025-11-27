import { useMutation, useQueryClient } from '@tanstack/react-query';
import { payrollService, RunPayrollRequest } from '@/services';
import { toast } from 'sonner';

export const usePayroll = () => {
  const queryClient = useQueryClient();

  const runMutation = useMutation({
    mutationFn: (data: RunPayrollRequest) => payrollService.run(data),
    onSuccess: () => {
      toast.success('Payroll preview generated successfully');
    },
    onError: (error: any) => {
      toast.error(error.message || 'Failed to run payroll');
    },
  });

  const finalizeMutation = useMutation({
    mutationFn: (payrollRunId: string) => payrollService.finalize(payrollRunId),
    onSuccess: (response) => {
      queryClient.invalidateQueries({ queryKey: ['payslips'] });
      toast.success(response.message || 'Payroll finalized successfully');
    },
    onError: (error: any) => {
      toast.error(error.message || 'Failed to finalize payroll');
    },
  });

  const downloadPayslip = async (payslipId: string) => {
    try {
      await payrollService.downloadPayslipPdf(payslipId);
      toast.success('Payslip downloaded successfully');
    } catch (error: any) {
      toast.error(error.message || 'Failed to download payslip');
    }
  };

  return {
    runPayroll: runMutation.mutate,
    isRunning: runMutation.isPending,
    payrollPreview: runMutation.data,
    finalizePayroll: finalizeMutation.mutate,
    isFinalizing: finalizeMutation.isPending,
    downloadPayslip,
  };
};
