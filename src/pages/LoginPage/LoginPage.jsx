import { useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import LockOutlinedIcon from '@mui/icons-material/LockOutlined';
import {
  Alert,
  Avatar,
  Box,
  Button,
  CircularProgress,
  Container,
  Paper,
  Stack,
  TextField,
  Typography,
} from '@mui/material';
import { useAuthContext } from '../../hooks/useAuthContext';

const initialForm = {
  username: '',
  password: '',
};

export default function LoginPage() {
  const [form, setForm] = useState(initialForm);
  const [error, setError] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const { login } = useAuthContext();
  const navigate = useNavigate();
  const location = useLocation();

  const from = location.state?.from?.pathname || '/courses';
  const isFormValid = form.username.trim() && form.password.trim();

  const handleChange = (event) => {
    const { name, value } = event.target;
    setForm((current) => ({ ...current, [name]: value }));
  };

  const handleSubmit = async (event) => {
    event.preventDefault();

    if (!isFormValid) {
      setError('Ingresa usuario y contrasena.');
      return;
    }

    setSubmitting(true);
    setError('');

    try {
      await login({
        username: form.username.trim(),
        password: form.password,
      });
      navigate(from, { replace: true });
    } catch (err) {
      setError(err.message || 'No fue posible iniciar sesion.');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <Box className="login-shell">
      <Container maxWidth="xs">
        <Paper elevation={3} className="login-panel">
          <Stack spacing={3} alignItems="stretch">
            <Stack spacing={1.5} alignItems="center">
              <Avatar sx={{ bgcolor: 'primary.main' }}>
                <LockOutlinedIcon />
              </Avatar>
              <Typography variant="h4" component="h1" textAlign="center">
                Gestion de cursos
              </Typography>
              <Typography variant="body2" color="text.secondary" textAlign="center">
                Inicio de sesion
              </Typography>
            </Stack>

            {error ? <Alert severity="error">{error}</Alert> : null}

            <Box component="form" onSubmit={handleSubmit} noValidate>
              <Stack spacing={2.25}>
                <TextField
                  autoFocus
                  fullWidth
                  required
                  label="Usuario"
                  name="username"
                  value={form.username}
                  onChange={handleChange}
                  autoComplete="username"
                  disabled={submitting}
                />
                <TextField
                  fullWidth
                  required
                  label="Contrasena"
                  name="password"
                  type="password"
                  value={form.password}
                  onChange={handleChange}
                  autoComplete="current-password"
                  disabled={submitting}
                />
                <Button
                  fullWidth
                  size="large"
                  type="submit"
                  variant="contained"
                  disabled={!isFormValid || submitting}
                  startIcon={submitting ? <CircularProgress color="inherit" size={18} /> : null}
                >
                  {submitting ? 'Ingresando' : 'Ingresar'}
                </Button>
              </Stack>
            </Box>
          </Stack>
        </Paper>
      </Container>
    </Box>
  );
}
