import { useMutation } from '@tanstack/react-query';
import { useNavigate } from 'react-router-dom';
import { authService, LoginRequest } from '@/services';
import { toast } from 'sonner';
import { getCurrentUser } from '@/lib/api';

export const useAuth = () => {
  const navigate = useNavigate();

  const loginMutation = useMutation({
    mutationFn: (credentials: LoginRequest) => authService.login(credentials),
    onSuccess: (data) => {
      toast.success(data.message || 'Login successful!');
      navigate('/dashboard');
    },
    onError: (error: any) => {
      toast.error(error.message || 'Login failed');
    },
  });

  const logout = () => {
    authService.logout();
    toast.success('Logged out successfully');
    navigate('/');
  };

  const currentUser = getCurrentUser();

  return {
    login: loginMutation.mutate,
    isLoggingIn: loginMutation.isPending,
    logout,
    currentUser,
    isAuthenticated: !!currentUser,
  };
};
