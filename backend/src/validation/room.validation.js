/**
 * Lightweight validation for room endpoints.
 */

const validateRoom = (body) => {
    const errors = [];

    if (!body.name || typeof body.name !== 'string') {
        errors.push('Room name is required');
    } else if (body.name.trim().length < 2 || body.name.trim().length > 50) {
        errors.push('Room name must be between 2 and 50 characters');
    }

    if (body.description && typeof body.description === 'string') {
        if (body.description.length > 200) {
            errors.push('Description must be at most 200 characters');
        }
    }

    return { valid: errors.length === 0, errors };
};

module.exports = { validateRoom };
