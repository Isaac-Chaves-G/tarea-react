import { useCallback, useEffect, useMemo, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import LogoutIcon from '@mui/icons-material/Logout';
import RefreshIcon from '@mui/icons-material/Refresh';
import SchoolIcon from '@mui/icons-material/School';
import {
  Alert,
  AppBar,
  Box,
  Button,
  Card,
  CardContent,
  Chip,
  CircularProgress,
  Container,
  Divider,
  IconButton,
  Stack,
  Toolbar,
  Tooltip,
  Typography,
} from '@mui/material';
import { getCourses } from '../services/courseService';
import { useAuthContext } from '../hooks/useAuthContext';
import CourseForm from '../components/CourseForm/CourseForm';

function normalizeCourses(payload) {
  if (Array.isArray(payload)) {
    return payload;
  }

  if (Array.isArray(payload?.content)) {
    return payload.content;
  }

  if (Array.isArray(payload?.data)) {
    return payload.data;
  }

  if (Array.isArray(payload?.courses)) {
    return payload.courses;
  }

  return [];
}

function getCourseTitle(course) {
  return course.name || 'Curso sin nombre';
}

function getCourseDescription(course) {
  return course.description || 'Sin descripcion disponible.';
}

function getTeacherName(course) {
  if (course.teacherName) {
    return course.teacherName;
  }

  if (typeof course.teacher === 'string') {
    return course.teacher;
  }

  if (course.teacher?.firstName || course.teacher?.lastName) {
    return `${course.teacher.firstName || ''} ${course.teacher.lastName || ''}`.trim();
  }

  if (course.teacher?.username) {
    return course.teacher.username;
  }

  return '';
}

export default function CoursesPage() {
  const [courses, setCourses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [refreshing, setRefreshing] = useState(false);
  const { logout } = useAuthContext();
  const navigate = useNavigate();

  const courseCountLabel = useMemo(() => {
    if (courses.length === 1) {
      return '1 curso';
    }

    return `${courses.length} cursos`;
  }, [courses.length]);

  const loadCourses = useCallback(
    async ({ silent = false } = {}) => {
      if (silent) {
        setRefreshing(true);
      } else {
        setLoading(true);
      }

      setError('');

      try {
        const payload = await getCourses();
        setCourses(normalizeCourses(payload));
      } catch (err) {
        if (err.status === 401) {
          logout();
          navigate('/login', { replace: true });
          return;
        }

        setError(err.message || 'No fue posible cargar los cursos.');
      } finally {
        setLoading(false);
        setRefreshing(false);
      }
    },
    [logout, navigate],
  );

  useEffect(() => {
    loadCourses();
  }, [loadCourses]);

  const handleLogout = () => {
    logout();
    navigate('/login', { replace: true });
  };

  return (
    <Box className="app-shell">
      <AppBar position="static" color="default" elevation={1}>
        <Toolbar className="app-toolbar">
          <Stack direction="row" spacing={1.5} alignItems="center">
            <SchoolIcon color="primary" />
            <Typography variant="h6" component="h1">
              Cursos
            </Typography>
            <Chip size="small" label={courseCountLabel} />
          </Stack>

          <Stack direction="row" spacing={1}>
            <Tooltip title="Actualizar cursos">
              <span>
                <IconButton
                  aria-label="Actualizar cursos"
                  color="primary"
                  onClick={() => loadCourses({ silent: true })}
                  disabled={loading || refreshing}
                >
                  {refreshing ? <CircularProgress size={22} /> : <RefreshIcon />}
                </IconButton>
              </span>
            </Tooltip>
            <Button color="inherit" startIcon={<LogoutIcon />} onClick={handleLogout}>
              Salir
            </Button>
          </Stack>
        </Toolbar>
      </AppBar>

      <Container maxWidth="lg" className="content-container">
        <Box className="courses-layout">
          <Stack spacing={2.5} className="courses-list">
            <Box>
              <Typography variant="h4" component="h2">
                Listado de cursos
              </Typography>
              <Typography color="text.secondary">
                Consulta los cursos registrados y agrega nuevos cursos al backend Spring Boot.
              </Typography>
            </Box>

            {error ? <Alert severity="error">{error}</Alert> : null}

            {loading ? (
              <Box className="state-box">
                <CircularProgress />
                <Typography color="text.secondary">Cargando cursos...</Typography>
              </Box>
            ) : courses.length === 0 ? (
              <Box className="state-box">
                <Typography variant="h6">No hay cursos registrados</Typography>
                <Typography color="text.secondary">
                  Crea el primer curso desde el formulario.
                </Typography>
              </Box>
            ) : (
              <Stack spacing={2}>
                {courses.map((course, index) => (
                  <Card key={course.id || course.code || `${getCourseTitle(course)}-${index}`}>
                    <CardContent>
                      <Stack spacing={1.25}>
                        <Stack
                          direction={{ xs: 'column', sm: 'row' }}
                          spacing={1}
                          justifyContent="space-between"
                          alignItems={{ xs: 'flex-start', sm: 'center' }}
                        >
                          <Typography variant="h6" component="h3">
                            {getCourseTitle(course)}
                          </Typography>
                          {course.credits ? (
                            <Chip
                              color="secondary"
                              size="small"
                              label={`${course.credits} creditos`}
                            />
                          ) : null}
                        </Stack>
                        {course.code ? (
                          <Typography variant="body2" color="primary">
                            Codigo: {course.code}
                          </Typography>
                        ) : null}
                        <Typography color="text.secondary">{getCourseDescription(course)}</Typography>
                        {getTeacherName(course) ? (
                          <>
                            <Divider />
                            <Typography variant="body2">
                              Profesor: {getTeacherName(course)}
                            </Typography>
                          </>
                        ) : null}
                      </Stack>
                    </CardContent>
                  </Card>
                ))}
              </Stack>
            )}
          </Stack>

          <CourseForm onCreated={() => loadCourses({ silent: true })} />
        </Box>
      </Container>
    </Box>
  );
}