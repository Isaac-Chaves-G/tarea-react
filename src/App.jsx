import { createBrowserRouter, Navigate, RouterProvider, useLocation } from 'react-router-dom';
import { CssBaseline, ThemeProvider, createTheme } from '@mui/material';
import ProtectedRoute from './components/ProtectedRoute/ProtectedRoute';
import AuthProvider from './context/AuthContext';
import { useAuthContext } from './hooks/useAuthContext';
import CoursesPage from './pages/CoursesPage';
import LoginPage from './pages/LoginPage/LoginPage';
import { APP_BASENAME } from './config';

const theme = createTheme({
  palette: {
    mode: 'light',
    primary: {
      main: '#1d5f8a',
    },
    secondary: {
      main: '#43745f',
    },
    background: {
      default: '#f4f7f9',
    },
  },
  shape: {
    borderRadius: 8,
  },
  typography: {
    fontFamily: ['Inter', 'Roboto', 'Arial', 'sans-serif'].join(','),
  },
});

function LoginRoute() {
  const { isAuthenticated } = useAuthContext();
  const location = useLocation();
  const from = location.state?.from?.pathname || '/courses';

  if (isAuthenticated) {
    return <Navigate to={from} replace />;
  }

  return <LoginPage />;
}

const routerBaseName = window.location.pathname.startsWith(APP_BASENAME)
  ? APP_BASENAME
  : undefined;

const router = createBrowserRouter(
  [
    {
      path: '/',
      element: <Navigate to="/courses" replace />,
    },
    {
      path: '/login',
      element: <LoginRoute />,
    },
    {
      element: <ProtectedRoute />,
      children: [
        {
          path: '/courses',
          element: <CoursesPage />,
        },
      ],
    },
    {
      path: '*',
      element: <Navigate to="/courses" replace />,
    },
  ],
  {
    basename: routerBaseName,
  },
);

export default function App() {
  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <AuthProvider>
        <RouterProvider router={router} />
      </AuthProvider>
    </ThemeProvider>
  );
}
