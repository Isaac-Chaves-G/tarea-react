import { request } from './client';

export async function getCourses() {
  return request('/api/courses');
}

export async function createCourse(course) {
  return request('/api/courses', {
    method: 'POST',
    body: JSON.stringify(course),
  });
}
