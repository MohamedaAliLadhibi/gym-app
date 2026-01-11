const { body } = require('express-validator');

const validationMiddleware = {
  validateRegister: [
    body('email').isEmail().normalizeEmail(),
    body('password').isLength({ min: 6 }),
    body('full_name').trim().notEmpty().isLength({ max: 255 }),
    body('phone').optional().isMobilePhone(),
    body('gender').optional().isIn(['male', 'female', 'other']),
    body('birth_date').optional().isDate(),
    body('height').optional().isFloat({ min: 50, max: 250 }),
    body('weight').optional().isFloat({ min: 20, max: 300 })
  ],

  validateLogin: [
    body('email').isEmail().normalizeEmail(),
    body('password').notEmpty()
  ],

  validateUpdateProfile: [
    body('full_name').optional().trim().isLength({ max: 255 }),
    body('phone').optional().isMobilePhone(),
    body('height').optional().isFloat({ min: 50, max: 250 }),
    body('weight').optional().isFloat({ min: 20, max: 300 }),
    body('description').optional().trim().isLength({ max: 1000 })
  ],

  validateWorkout: [
    body('name').trim().notEmpty().isLength({ max: 255 }),
    body('description').optional().trim().isLength({ max: 1000 }),
    body('workout_date').optional().isDate(),
    body('exercises').optional().isArray(),
    body('exercises.*.exercise_id').isUUID(),
    body('exercises.*.sets').optional().isInt({ min: 1 }),
    body('exercises.*.reps').optional().isInt({ min: 1 }),
    body('exercises.*.weight').optional().isFloat({ min: 0 })
  ],

  validateExercise: [
    body('name').trim().notEmpty().isLength({ max: 255 }),
    body('description').trim().notEmpty(),
    body('category').optional().isString(),
    body('muscle_group').optional().isString(),
    body('difficulty').optional().isIn(['beginner', 'intermediate', 'advanced']),
    body('equipment').optional().isString()
  ]
};

module.exports = validationMiddleware;