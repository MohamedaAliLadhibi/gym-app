// services/api/index.ts
export { authAPI } from './auth';
export { userAPI } from './user';
export { workoutsAPI } from './workouts';
export { calendarAPI } from './calendar';

// Export apiClient
export { apiClient } from './client';

// Export types
export type { User, LoginData, RegisterData, AuthResponse } from '../types';
export type { Workout, Exercise } from '../types';
export type { Meal, NutritionPlan } from '../types';