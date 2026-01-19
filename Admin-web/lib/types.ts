// lib/types.ts

// User Types - Based on your API
export interface MembershipType {
  id: string;
  name: string;
  description: string;
  price: number;
  duration_days: number | null;
  features: string[];
  created_at: string;
  updated_at?: string;
  category?: string;
  is_active?: boolean;
}

export interface User {
  id: string;
  full_name: string;
  email: string;
  password_hash: string;
  phone: string | null;
  gender: 'male' | 'female' | 'other' | 'prefer_not_to_say' | string;
  date_of_birth?: string | null;
  birth_date?: string | null;
  height: string | null;
  weight: string | null;
  description: string | null;
  avatar_url: string | null;
  role: 'user' | 'admin' | 'trainer' | string;
  membership_type_id: string | null;
  created_at: string;
  updated_at: string;
  membership_types: MembershipType;
  status: 'active' | 'inactive' | 'suspended' | string;
  address?: string | null;
  fitness_goal?: string | null;
  experience_level?: string | null;
}

// Exercise Types - Based on your API
export interface Exercise {
  id: string;
  name: string;
  description: string;
  category: string;
  muscle_group: string;
  difficulty: 'beginner' | 'intermediate' | 'advanced' | string;
  equipment: string;
  img_url: string | null;
  video_url: string | null;
  instructions: string | null;
  sets_reps_default: number | string | null;
  created_at: string;
  updated_at: string;
}

// Membership Types - Based on your API
export interface Membership {
  id: string;
  name: string;
  description?: string;
  price: number;
  duration_days?: number | null;
  features?: string[] | string | null;
  created_at: string;
  updated_at: string;
  category?: string;
  is_active?: boolean;
}

// Activity for dashboard
export interface Activity {
  id: string;
  type: 'user_registered' | 'membership_purchased' | 'error' | 'warning' | 'info' | string;
  title: string;
  description: string;
  status: 'success' | 'error' | 'warning' | 'info' | string;
  timestamp: string;
  user_id?: string;
}

// Dashboard Stats
export interface DashboardStats {
  totalUsers: number;
  totalExercises: number;
  activeMemberships: number;
  monthlyRevenue: number;
  userGrowth: string;
  exerciseGrowth: string;
  membershipGrowth: string;
  revenueGrowth: string;
}