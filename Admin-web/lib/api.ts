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
// In your lib/api.ts file, update the usersAPI object:
// In your lib/api.ts
export const usersAPI = {
  getAll: () => api.get<User[]>('/users'),
  getById: (id: string) => api.get<User>(`/users/${id}`),
  create: (userData: Partial<User>) => api.post<User>('/users/register', userData),
  
  // Add detailed logging
  update: (id: string, userData: Partial<User>) => {
    console.log('🔍 API UPDATE CALLED:');
    console.log('  - Method: PUT');
    console.log('  - Full URL:', `${API_BASE_URL}/users/${id}`);
    console.log('  - User ID:', id);
    console.log('  - Data being sent:', JSON.stringify(userData, null, 2));
    
    return api.put<User>(`/users/${id}`, userData);
  },
  
  delete: (id: string) => api.delete<void>(`/users/${id}`),
};
export const exercisesAPI = {
  getAll: () => api.get<Exercise[]>('/exercises'),  // FIXED: Use axios to match others
  
  getById: (id: string) => 
    fetch(`${API_BASE_URL}/exercises/${id}`).then(res => {
      if (!res.ok) throw new Error(`HTTP error! status: ${res.status}`);
      return res.json();
    }),

  create: (data: any) => 
    fetch(`${API_BASE_URL}/exercises`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data),
    }).then(res => {
      if (!res.ok) throw new Error(`HTTP error! status: ${res.status}`);
      return res.json();
    }),

  update: (id: string, data: any) => 
    fetch(`${API_BASE_URL}/exercises/${id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data),
    }).then(res => {
      if (!res.ok) throw new Error(`HTTP error! status: ${res.status}`);
      return res.json();
    }),

  delete: (id: string) => 
    fetch(`${API_BASE_URL}/exercises/${id}`, {
      method: 'DELETE',
    }).then(res => {
      if (!res.ok) throw new Error(`HTTP error! status: ${res.status}`);
      return res.json();
    }),
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
    try {
      // Fetch all data and calculate stats
      const [usersRes, exercisesRes, membershipsRes] = await Promise.all([
        usersAPI.getAll(),
        exercisesAPI.getAll(),  // Now returns { data: Exercise[] }
        membershipsAPI.getAll()
      ]);

      // Access the data property from each response
      const users = usersRes.data;
      const exercises = exercisesRes.data;  // This should now be defined
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
          totalExercises: exercises.length,  // Line 111 - Should work now
          activeMemberships: paidMemberships,
          monthlyRevenue,
          userGrowth: '+12%', // You can calculate from timestamps
          exerciseGrowth: '+8%',
          membershipGrowth: '+5%',
          revenueGrowth: '+15%'
        }
      };
    } catch (error) {
      console.error('Error fetching dashboard stats:', error);
      // Return default values to prevent UI crash
      return {
        data: {
          totalUsers: 0,
          totalExercises: 0,
          activeMemberships: 0,
          monthlyRevenue: 0,
          userGrowth: '0%',
          exerciseGrowth: '0%',
          membershipGrowth: '0%',
          revenueGrowth: '0%'
        }
      };
    }
  },

  getRecentActivity: async (): Promise<{ data: Activity[] }> => {
    try {
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
    } catch (error) {
      console.error('Error fetching recent activity:', error);
      return {
        data: []
      };
    }
  }
};

export default api;