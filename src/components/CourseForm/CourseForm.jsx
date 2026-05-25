import { useState } from 'react';
import AddIcon from '@mui/icons-material/Add';
import {
  Alert,
  Box,
  Button,
  CircularProgress,
  Paper,
  Stack,
  TextField,
  Typography,
} from '@mui/material';
import { createCourse } from '../../services/courseService';

const initialForm = {
  name: '',
  description: '',
  code: '',
  credits: '',
  teacherId: '2',
};

export default function CourseForm({ onCreated }) {
  const [form, setForm] = useState(initialForm);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  const isValid =
    form.name.trim() &&
    form.description.trim() &&
    form.code.trim() &&
    Number(form.credits) > 0 &&
    Number(form.teacherId) > 0;

  const handleChange = (event) => {
    const { name, value } = event.target;
    setForm((current) => ({ ...current, [name]: value }));
  };

  const handleSubmit = async (event) => {
    event.preventDefault();

    if (!isValid) {
      setError('Completa todos los campos requeridos.');
      return;
    }

    setSubmitting(true);
    setError('');
    setSuccess('');

    try {
      await createCourse({
        name: form.name.trim(),
        description: form.description.trim(),
        code: form.code.trim(),
        credits: Number(form.credits),
        teacherId: Number(form.teacherId),
      });

      setForm(initialForm);
      setSuccess('Curso creado correctamente.');
      await onCreated?.();
    } catch (err) {
      setError(err.message || 'No fue posible crear el curso.');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <Paper elevation={2} className="course-form-panel">
      <Stack spacing={2.25}>
        <Box>
          <Typography variant="h5" component="h2">
            Agregar curso
          </Typography>
          <Typography variant="body2" color="text.secondary">
            El backend del profesor requiere codigo, creditos y teacherId.
          </Typography>
        </Box>

        {error ? <Alert severity="error">{error}</Alert> : null}
        {success ? <Alert severity="success">{success}</Alert> : null}

        <Box component="form" onSubmit={handleSubmit} noValidate>
          <Stack spacing={2}>
            <TextField
              required
              fullWidth
              label="Nombre"
              name="name"
              value={form.name}
              onChange={handleChange}
              disabled={submitting}
            />
            <TextField
              required
              fullWidth
              label="Codigo"
              name="code"
              value={form.code}
              onChange={handleChange}
              disabled={submitting}
            />
            <TextField
              required
              fullWidth
              multiline
              minRows={3}
              label="Descripcion"
              name="description"
              value={form.description}
              onChange={handleChange}
              disabled={submitting}
            />
            <TextField
              required
              fullWidth
              label="Creditos"
              name="credits"
              type="number"
              inputProps={{ min: 1 }}
              value={form.credits}
              onChange={handleChange}
              disabled={submitting}
            />
            <TextField
              required
              fullWidth
              label="ID del profesor"
              name="teacherId"
              type="number"
              helperText="En los datos iniciales del backend, profesor suele tener ID 2."
              inputProps={{ min: 1 }}
              value={form.teacherId}
              onChange={handleChange}
              disabled={submitting}
            />
            <Button
              type="submit"
              variant="contained"
              size="large"
              disabled={!isValid || submitting}
              startIcon={submitting ? <CircularProgress color="inherit" size={18} /> : <AddIcon />}
            >
              {submitting ? 'Creando' : 'Crear curso'}
            </Button>
          </Stack>
        </Box>
      </Stack>
    </Paper>
  );
}
