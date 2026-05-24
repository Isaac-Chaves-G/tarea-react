export const APP_BASENAME = '/iaslab/compu2/AMB';

export const API_BASE_URL =
  import.meta.env.VITE_API_BASE_URL?.replace(/\/$/, '') || 'http://localhost:8080/auth';
