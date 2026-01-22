// Basic types
export interface ApiResponse<T> {
  success: boolean;
  data: T;
  message?: string;
  error?: string;
}

export interface PaginatedResponse<T> {
  data: T[];
  total: number;
  page: number;
  limit: number;
  totalPages: number;
}

// User Types
export interface User {
  id: string;
  name: string;
  email: string;
  avatar?: string;
  weight?: number;
  height?: number;
  age?: number;
  gender?: 'male' | 'female' | 'other';
  fitnessLevel?: 'beginner' | 'intermediate' | 'advanced';
  createdAt: string;
  updatedAt: string;
}

// Auth Types
export interface LoginData {
  email: string;
  password: string;
}

export interface RegisterData {
  name: string;
  email: string;
  password: string;
}

export interface AuthResponse {
  token: string;
  refreshToken: string;
  user: User;
}

// Workout Types (simplified for now)
export interface Workout {
  id: string;
  title: string;
  description: string;
  duration: number;
  difficulty: 'beginner' | 'intermediate' | 'advanced';
  category: 'strength' | 'cardio' | 'hiit' | 'flexibility';
  exercises: Exercise[];
  caloriesBurned: number;
  createdAt: string;
}

export interface Exercise {
  id: string;
  name: string;
  description: string;
  muscleGroup: string[];
  sets: number;
  reps: number;
  restTime: number;
}

// Nutrition Types (simplified)
export interface Meal {
  id: string;
  name: string;
  calories: number;
  protein: number;
  carbs: number;
  fat: number;
  time: string;
  type: 'breakfast' | 'lunch' | 'dinner' | 'snack';
}

export interface NutritionPlan {
  id: string;
  title: string;
  dailyCalories: number;
  dailyProtein: number;
  dailyCarbs: number;
  dailyFat: number;
}

// Calendar Types
export interface CalendarEvent {
  id: string;
  title: string;
  description: string;
  startTime: string;
  endTime: string;
  type: 'workout' | 'meal' | 'measurement' | 'reminder';
  completed: boolean;
}