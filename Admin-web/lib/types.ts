// User Types - Based on your API
export interface MembershipType {
  id: string;
  name: string;
  description: string;
  price: number;
  duration_days: number | null;
  features: string[];
  created_at: string;
}

export interface User {
  id: string;
  full_name: string;
  email: string;
  password_hash: string;
  phone: string;
  gender: 'male' | 'female' | 'other';
  birth_date: string | null;
  height: number | null;
  weight: number | null;
  description: string | null;
  avatar_url: string | null;
  role: 'user' | 'admin' | 'trainer';
  membership_type_id: string;
  created_at: string;
  updated_at: string;
  membership_types: MembershipType;
}

// Exercise Types - Based on your API
export interface Exercise {
  id: string;
  name: string;
  description: string;
  category: string;
  muscle_group: string;
  difficulty: 'beginner' | 'intermediate' | 'advanced';
  equipment: string;
  img_url: string | null;
  video_url: string | null;
  instructions: string | null;
  sets_reps_default: string | null;
  created_at: string;
  updated_at: string;
}

// Membership Types - Based on your API
export interface Membership {
  id: string;
  name: string;
  description: string;
  price: number;
  duration_days: number | null;
  features: string[];
  created_at: string;
}

// Activity for dashboard
export interface Activity {
  id: string; // Change _id to id to match your API
  type: 'user_registered' | 'membership_purchased' | 'error' | 'warning' | 'info';
  title: string;
  description: string;
  status: 'success' | 'error' | 'warning';
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