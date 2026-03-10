/**
 * Lightweight request validation for auth endpoints.
 * Returns { valid: boolean, errors: string[] }
 */

const validateRegister = (body) => {
    const errors = [];

    if (!body.username || typeof body.username !== 'string') {
        errors.push('Username is required');
    } else if (body.username.trim().length < 3 || body.username.trim().length > 30) {
        errors.push('Username must be between 3 and 30 characters');
    }

    if (!body.password || typeof body.password !== 'string') {
        errors.push('Password is required');
    } else if (body.password.length < 6) {
        errors.push('Password must be at least 6 characters');
    }

    if (body.email && typeof body.email === 'string') {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(body.email)) {
            errors.push('Invalid email format');
        }
    }

    return { valid: errors.length === 0, errors };
};

const validateLogin = (body) => {
    const errors = [];

    if (!body.username || typeof body.username !== 'string') {
        errors.push('Username is required');
    }

    if (!body.password || typeof body.password !== 'string') {
        errors.push('Password is required');
    }

    return { valid: errors.length === 0, errors };
};

module.exports = { validateRegister, validateLogin };
