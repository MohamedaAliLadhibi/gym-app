import { apiClient} from './client';
import { Workout, PaginatedResponse } from '../types';

export const workoutsAPI = {
  // ✅ Create workout - POST /api/workouts
  createWorkout: (data: any) => apiClient.post('/workouts', data),

  // ✅ Get user workouts - GET /api/workouts
  getWorkouts: (page = 1, limit = 20, filters?: any) => {
    const params: any = { page, limit };
    if (filters?.startDate) params.startDate = filters.startDate;
    if (filters?.endDate) params.endDate = filters.endDate;
    if (filters?.category) params.category = filters.category;
    return apiClient.get('/workouts', { params });
  },

  // ✅ Get workout by ID - GET /api/workouts/:id
  getWorkoutById: (id: string) => apiClient.get(`/workouts/${id}`),

  // ✅ Update workout - PUT /api/workouts/:id
  updateWorkout: (id: string, data: any) => apiClient.put(`/workouts/${id}`, data),

  // ✅ Delete workout - DELETE /api/workouts/:id
  deleteWorkout: (id: string) => apiClient.delete(`/workouts/${id}`),

  // ✅ Get workout statistics - GET /api/workouts/statistics
  getStatistics: (period = 'month') => 
    apiClient.get('/workouts/statistics', { params: { period } }),

  // ❌ REMOVE THIS - You don't have featured_workouts endpoint
  // getFeaturedWorkouts: () => apiClient.get('/workouts/featured'),

  // ✅ Use getWorkouts for "featured" (just get latest)
  getRecentWorkouts: (limit = 3) => 
    apiClient.get('/workouts', { params: { page: 1, limit } }),

  // ✅ Use getWorkouts for history
  getWorkoutHistory: (page = 1, limit = 5) => 
    apiClient.get('/workouts', { params: { page, limit } }),

  // ❌ REMOVE or keep for later - You don't have search endpoint
  // searchWorkouts: (query: string) => 
  //   apiClient.get('/workouts/search', { params: { query } }),
};