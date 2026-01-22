import apiClient from './client';
import { Workout, Exercise, WorkoutPlan, ApiResponse, PaginatedResponse } from '../types';

export const workoutsAPI = {
  // Get all workouts
  getWorkouts: async (
    page = 1, 
    limit = 20, 
    filters?: { category?: string; difficulty?: string }
  ): Promise<PaginatedResponse<Workout>> => {
    const params = new URLSearchParams();
    params.append('page', page.toString());
    params.append('limit', limit.toString());
    
    if (filters?.category) params.append('category', filters.category);
    if (filters?.difficulty) params.append('difficulty', filters.difficulty);

    const response = await apiClient.get<PaginatedResponse<Workout>>(
      `/workouts?${params.toString()}`
    );
    return response.data;
  },
  
  // Get workout by ID
  getWorkoutById: async (id: string): Promise<Workout> => {
    const response = await apiClient.get<Workout>(`/workouts/${id}`);
    return response.data;
  },
  
  // Create workout
  createWorkout: async (workoutData: Partial<Workout>): Promise<Workout> => {
    const response = await apiClient.post<Workout>('/workouts', workoutData);
    return response.data;
  },
  
  // Update workout
  updateWorkout: async (id: string, workoutData: Partial<Workout>): Promise<Workout> => {
    const response = await apiClient.put<Workout>(`/workouts/${id}`, workoutData);
    return response.data;
  },
  
  // Delete workout
  deleteWorkout: async (id: string): Promise<ApiResponse<{ deleted: boolean }>> => {
    const response = await apiClient.delete<ApiResponse<{ deleted: boolean }>>(`/workouts/${id}`);
    return response.data;
  },
  
  // Search workouts
  searchWorkouts: async (query: string, page = 1, limit = 20): Promise<PaginatedResponse<Workout>> => {
    const response = await apiClient.get<PaginatedResponse<Workout>>(
      `/workouts/search?query=${query}&page=${page}&limit=${limit}`
    );
    return response.data;
  },
  
  // Filter workouts
  filterWorkouts: async (filters: {
    category?: string;
    difficulty?: string;
    durationMin?: number;
    durationMax?: number;
    caloriesMin?: number;
    caloriesMax?: number;
  }): Promise<Workout[]> => {
    const params = new URLSearchParams();
    
    if (filters.category) params.append('category', filters.category);
    if (filters.difficulty) params.append('difficulty', filters.difficulty);
    if (filters.durationMin) params.append('durationMin', filters.durationMin.toString());
    if (filters.durationMax) params.append('durationMax', filters.durationMax.toString());
    if (filters.caloriesMin) params.append('caloriesMin', filters.caloriesMin.toString());
    if (filters.caloriesMax) params.append('caloriesMax', filters.caloriesMax.toString());

    const response = await apiClient.get<Workout[]>(`/workouts/filter?${params.toString()}`);
    return response.data;
  },
  
  // Get featured workouts
  getFeaturedWorkouts: async (): Promise<Workout[]> => {
    const response = await apiClient.get<Workout[]>('/workouts/featured');
    return response.data;
  },
  
  // Get trending workouts
  getTrendingWorkouts: async (): Promise<Workout[]> => {
    const response = await apiClient.get<Workout[]>('/workouts/trending');
    return response.data;
  },
  
  // Get exercises
  getExercises: async (): Promise<Exercise[]> => {
    const response = await apiClient.get<Exercise[]>('/exercises');
    return response.data;
  },
  
  // Get exercise by ID
  getExerciseById: async (id: string): Promise<Exercise> => {
    const response = await apiClient.get<Exercise>(`/exercises/${id}`);
    return response.data;
  },
  
  // Start workout session
  startWorkout: async (workoutId: string): Promise<{ sessionId: string }> => {
    const response = await apiClient.post<{ sessionId: string }>(
      `/workouts/${workoutId}/sessions`
    );
    return response.data;
  },
  
  // Update workout session
  updateWorkoutSession: async (
    sessionId: string, 
    data: { completed: boolean; notes?: string; duration?: number }
  ): Promise<ApiResponse<{ updated: boolean }>> => {
    const response = await apiClient.put<ApiResponse<{ updated: boolean }>>(
      `/workouts/sessions/${sessionId}`,
      data
    );
    return response.data;
  },
  
  // Complete workout session
  completeWorkout: async (
    sessionId: string, 
    data: { 
      completedExercises: { exerciseId: string; setsCompleted: number }[];
      duration: number;
      calories?: number;
      notes?: string;
    }
  ): Promise<ApiResponse<{ completed: boolean }>> => {
    const response = await apiClient.post<ApiResponse<{ completed: boolean }>>(
      `/workouts/sessions/${sessionId}/complete`,
      data
    );
    return response.data;
  },
  
  // Get workout history
  getWorkoutHistory: async (page = 1, limit = 20): Promise<PaginatedResponse<any>> => {
    const response = await apiClient.get<PaginatedResponse<any>>(
      `/workouts/history?page=${page}&limit=${limit}`
    );
    return response.data;
  },
  
  // Get workout plans
  getWorkoutPlans: async (): Promise<WorkoutPlan[]> => {
    const response = await apiClient.get<WorkoutPlan[]>('/workouts/plans');
    return response.data;
  },
  
  // Get workout plan by ID
  getWorkoutPlanById: async (id: string): Promise<WorkoutPlan> => {
    const response = await apiClient.get<WorkoutPlan>(`/workouts/plans/${id}`);
    return response.data;
  },
  
  // Enroll in workout plan
  enrollInPlan: async (planId: string): Promise<ApiResponse<{ enrolled: boolean }>> => {
    const response = await apiClient.post<ApiResponse<{ enrolled: boolean }>>(
      `/workouts/plans/${planId}/enroll`
    );
    return response.data;
  },
  
  // Get user's workout plans
  getUserWorkoutPlans: async (): Promise<WorkoutPlan[]> => {
    const response = await apiClient.get<WorkoutPlan[]>('/workouts/user/plans');
    return response.data;
  },
  
  // Get workout analytics
  getWorkoutAnalytics: async (
    period: 'week' | 'month' | 'year' = 'month'
  ): Promise<any> => {
    const response = await apiClient.get<any>(`/workouts/analytics?period=${period}`);
    return response.data;
  },
};
