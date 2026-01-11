const helpers = {
  // Format date to YYYY-MM-DD
  formatDate: (date) => {
    return new Date(date).toISOString().split('T')[0];
  },

  // Calculate age from birth date
  calculateAge: (birthDate) => {
    const today = new Date();
    const birth = new Date(birthDate);
    let age = today.getFullYear() - birth.getFullYear();
    const monthDiff = today.getMonth() - birth.getMonth();
    
    if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birth.getDate())) {
      age--;
    }
    
    return age;
  },

  // Calculate BMI
  calculateBMI: (weight, height) => {
    if (!weight || !height) return null;
    return (weight / ((height / 100) ** 2)).toFixed(1);
  },

  // Generate random workout name
  generateWorkoutName: () => {
    const adjectives = ['Powerful', 'Intense', 'Dynamic', 'Extreme', 'Ultimate'];
    const nouns = ['Workout', 'Session', 'Routine', 'Challenge', 'Training'];
    const times = ['Morning', 'Afternoon', 'Evening', 'Daily', 'Weekly'];
    
    const randomAdjective = adjectives[Math.floor(Math.random() * adjectives.length)];
    const randomNoun = nouns[Math.floor(Math.random() * nouns.length)];
    const randomTime = times[Math.floor(Math.random() * times.length)];
    
    return `${randomTime} ${randomAdjective} ${randomNoun}`;
  },

  // Validate email format
  isValidEmail: (email) => {
    const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return re.test(email);
  },

  // Paginate array
  paginate: (array, page, limit) => {
    const startIndex = (page - 1) * limit;
    const endIndex = page * limit;
    
    return {
      data: array.slice(startIndex, endIndex),
      pagination: {
        page,
        limit,
        total: array.length,
        totalPages: Math.ceil(array.length / limit)
      }
    };
  }
};

module.exports = helpers;