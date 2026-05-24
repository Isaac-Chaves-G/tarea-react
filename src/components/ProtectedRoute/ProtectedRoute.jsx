import { Navigate, Outlet, useLocation } from 'react-router-dom';
import { usePermission } from '../../hooks/usePermission';

export default function ProtectedRoute() {
  const location = useLocation();
  const { isAuthenticated } = usePermission();

  if (!isAuthenticated) {
    return <Navigate to="/login" replace state={{ from: location }} />;
  }

  return <Outlet />;
}
