const { createClient } = require('@supabase/supabase-js');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

class SupabaseService {
  constructor() {
    this.client = createClient(
      process.env.SUPABASE_URL,
      process.env.SUPABASE_SERVICE_ROLE_KEY,
      {
        auth: {
          autoRefreshToken: false,
          persistSession: false
        },
        db: {
          schema: 'public'
        }
      }
    );
  }

  // User methods
  async createUser(userData) {
    const hashedPassword = await bcrypt.hash(userData.password_hash, 10);
    
    const { data, error } = await this.client
      .from('users')
      .insert([{
        ...userData,
        password_hash: hashedPassword,
        membership_type_id: await this.getFreeMembershipId()
      }])
      .select()
      .single();

    if (error) throw error;
    return data;
  }

  async getUserByEmail(email) {
    const { data, error } = await this.client
      .from('users')
      .select('*')
      .eq('email', email)
      .single();

    if (error && error.code !== 'PGRST116') throw error;
    return data;
  }

  async authenticateUser(email, password) {
    const user = await this.getUserByEmail(email);
    if (!user) return null;

    const isValid = await bcrypt.compare(password, user.password_hash);
    return isValid ? user : null;
  }

  generateToken(userId) {
    return jwt.sign(
      { userId },
      process.env.JWT_SECRET,
      { expiresIn: process.env.JWT_EXPIRES_IN || '7d' }
    );
  }

  // Exercise methods
  async getExercises(filters) {
    let query = this.client
      .from('exercises')
      .select('*', { count: 'exact' });

    // Apply filters
    Object.keys(filters).forEach(key => {
      if (filters[key] && key !== 'page' && key !== 'limit' && key !== 'search') {
        query = query.eq(key, filters[key]);
      }
    });

    if (filters.search) {
      query = query.ilike('name', `%${filters.search}%`);
    }

    // Pagination
    const page = filters.page || 1;
    const limit = filters.limit || 20;
    const from = (page - 1) * limit;
    const to = from + limit - 1;

    const { data, error, count } = await query
      .range(from, to)
      .order('name', { ascending: true });

    if (error) throw error;

    return {
      data,
      pagination: {
        page,
        limit,
        total: count,
        totalPages: Math.ceil(count / limit)
      }
    };
  }

  // Workout methods
  async createWorkout(workoutData) {
    const { exercises, ...workout } = workoutData;

    // Start transaction
    const { data: newWorkout, error: workoutError } = await this.client
      .from('workouts')
      .insert([workout])
      .select()
      .single();

    if (workoutError) throw workoutError;

    // Add exercises if provided
    if (exercises && exercises.length > 0) {
      const workoutExercises = exercises.map((ex, index) => ({
        workout_id: newWorkout.id,
        exercise_id: ex.exercise_id,
        exercise_order: index + 1,
        sets: ex.sets || 3,
        reps: ex.reps || 10,
        weight: ex.weight,
        duration_minutes: ex.duration_minutes,
        notes: ex.notes
      }));

      const { error: exercisesError } = await this.client
        .from('workout_exercises')
        .insert(workoutExercises);

      if (exercisesError) throw exercisesError;
    }

    return this.getWorkoutById(newWorkout.id, workout.user_id);
  }

  async getWorkoutById(workoutId, userId) {
    const { data, error } = await this.client
      .from('workouts')
      .select(`
        *,
        workout_exercises (
          *,
          exercises (*)
        )
      `)
      .eq('id', workoutId)
      .eq('user_id', userId)
      .single();

    if (error) throw error;
    return data;
  }

  // Helper methods
  async getFreeMembershipId() {
    const { data, error } = await this.client
      .from('membership_types')
      .select('id')
      .eq('name', 'free')
      .single();

    if (error) throw error;
    return data.id;
  }

  async getUserDashboard(userId) {
    // Implementation for dashboard data
    // This would combine multiple queries
    return {
      user: await this.getUserById(userId),
      recentWorkouts: await this.getRecentWorkouts(userId),
      statistics: await this.getUserStatistics(userId),
      upcomingWorkouts: await this.getUpcomingWorkouts(userId)
    };
  }
}

module.exports = new SupabaseService();