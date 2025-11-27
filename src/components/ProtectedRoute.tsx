import { Navigate } from 'react-router-dom';
import { getCurrentUser } from '@/lib/api';

interface ProtectedRouteProps {
  children: React.ReactNode;
}

export const ProtectedRoute = ({ children }: ProtectedRouteProps) => {
  const user = getCurrentUser();

  if (!user) {
    return <Navigate to="/" replace />;
  }

  return <>{children}</>;
};
