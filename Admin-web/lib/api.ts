import axios from 'axios';
import { User, Exercise, Membership, DashboardStats, Activity } from './types';

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000/api';

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Add auth token if needed
api.interceptors.request.use(
  (config) => {
    if (typeof window !== 'undefined') {
      const token = localStorage.getItem('authToken');
      if (token) {
        config.headers.Authorization = `Bearer ${token}`;
      }
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// YOUR REAL APIS - All return arrays directly
export const usersAPI = {
  getAll: () => api.get<User[]>('/users'),  // Returns array of users
  getById: (id: string) => api.get<User>(`/users/${id}`),
  create: (userData: Partial<User>) => api.post<User>('/users', userData),
  update: (id: string, userData: Partial<User>) => api.put<User>(`/users/${id}`, userData),
  delete: (id: string) => api.delete<void>(`/users/${id}`),
};

export const exercisesAPI = {
  getAll: () => api.get<Exercise[]>('/exercises'),  // Returns array of exercises
  getById: (id: string) => api.get<Exercise>(`/exercises/${id}`),
  create: (exerciseData: Partial<Exercise>) => api.post<Exercise>('/exercises', exerciseData),
  update: (id: string, exerciseData: Partial<Exercise>) => api.put<Exercise>(`/exercises/${id}`, exerciseData),
  delete: (id: string) => api.delete<void>(`/exercises/${id}`),
};

export const membershipsAPI = {
  getAll: () => api.get<Membership[]>('/memberships'),  // Returns array of memberships
  getById: (id: string) => api.get<Membership>(`/memberships/${id}`),
  create: (membershipData: Partial<Membership>) => api.post<Membership>('/memberships', membershipData),
  update: (id: string, membershipData: Partial<Membership>) => api.put<Membership>(`/memberships/${id}`, membershipData),
  delete: (id: string) => api.delete<void>(`/memberships/${id}`),
};

// Dashboard stats from your existing data
export const dashboardAPI = {
  getStats: async (): Promise<{ data: DashboardStats }> => {
    // Fetch all data and calculate stats
    const [usersRes, exercisesRes, membershipsRes] = await Promise.all([
      usersAPI.getAll(),
      exercisesAPI.getAll(),
      membershipsAPI.getAll()
    ]);

    const users = usersRes.data;
    const exercises = exercisesRes.data;
    const memberships = membershipsRes.data;

    // Calculate monthly revenue (sum of membership prices)
    const monthlyRevenue = memberships.reduce((sum, membership) => sum + membership.price, 0);
    
    // Count users with non-free memberships
    const paidMemberships = users.filter(user => 
      user.membership_types.name !== 'free'
    ).length;

    return {
      data: {
        totalUsers: users.length,
        totalExercises: exercises.length,
        activeMemberships: paidMemberships,
        monthlyRevenue,
        userGrowth: '+12%', // You can calculate from timestamps
        exerciseGrowth: '+8%',
        membershipGrowth: '+5%',
        revenueGrowth: '+15%'
      }
    };
  },

  getRecentActivity: async (): Promise<{ data: Activity[] }> => {
    const [usersRes, membershipsRes] = await Promise.all([
      usersAPI.getAll(),
      membershipsAPI.getAll()
    ]);

    const users = usersRes.data;
    const memberships = membershipsRes.data;

    // Create activity from recent users
    const userActivities: Activity[] = users
      .slice(0, 3)
      .sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime())
      .map(user => ({
        id: user.id,
        type: 'user_registered' as const,
        title: 'New User Registration',
        description: `${user.full_name} registered`,
        status: 'success' as const,
        timestamp: user.created_at,
        user_id: user.id
      }));

    // Create activity from recent memberships
    const membershipActivities: Activity[] = memberships
      .slice(0, 2)
      .map(membership => ({
        id: membership.id,
        type: 'membership_purchased' as const,
        title: 'Membership Created',
        description: `New ${membership.name} membership created`,
        status: 'success' as const,
        timestamp: membership.created_at
      }));

    // Combine and sort by timestamp
    const activities = [...userActivities, ...membershipActivities]
      .sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime())
      .slice(0, 5);

    return {
      data: activities
    };
  }
};

export default api;