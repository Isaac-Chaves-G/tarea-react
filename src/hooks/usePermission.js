import { useAuthContext } from './useAuthContext';

export function usePermission() {
  const { isAuthenticated } = useAuthContext();

  return {
    isAuthorized: isAuthenticated,
    isAuthenticated,
  };
}
