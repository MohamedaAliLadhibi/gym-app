module.exports = {
  // User roles
  ROLES: {
    USER: 'user',
    ADMIN: 'admin',
    TRAINER: 'trainer'
  },

  // Membership types
  MEMBERSHIP_TYPES: {
    FREE: 'free',
    PREMIUM: 'premium'
  },

  // Exercise categories
  EXERCISE_CATEGORIES: [
    'strength',
    'cardio',
    'flexibility',
    'balance',
    'core',
    'functional'
  ],

  // Muscle groups
  MUSCLE_GROUPS: [
    'chest',
    'back',
    'shoulders',
    'biceps',
    'triceps',
    'legs',
    'glutes',
    'abs',
    'calves',
    'forearms',
    'full_body'
  ],

  // Workout statuses
  WORKOUT_STATUS: {
    PLANNED: 'planned',
    IN_PROGRESS: 'in_progress',
    COMPLETED: 'completed',
    SKIPPED: 'skipped'
  },

  // Subscription statuses
  SUBSCRIPTION_STATUS: {
    ACTIVE: 'active',
    CANCELED: 'canceled',
    EXPIRED: 'expired',
    PAST_DUE: 'past_due'
  },

  // Pagination defaults
  PAGINATION: {
    DEFAULT_PAGE: 1,
    DEFAULT_LIMIT: 20,
    MAX_LIMIT: 100
  }
};