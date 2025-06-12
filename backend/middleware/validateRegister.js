// import modules
const { check, validationResult } = require('express-validator');

// user registration validation
exports.validateRegister = [
    check('username')
        .isLength({ min: 5 })
        .withMessage('Username must be at least 5 characters'),

    check('email')
        .isEmail()
        .withMessage('Must be a valid email'),

    check('password')
        .isStrongPassword({
            minLength: 8,
            minLowercase: 1,
            minUppercase: 1,
            minNumbers: 1,
            minSymbols: 1,
            returnScore: false
        })
        .withMessage('Password must be strong (min 8 chars, upper, lower, number, special)'),

    (req, res, next) => {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({ status: 'error', payload: errors.array()[0].msg });
        }
        next();
    },
];