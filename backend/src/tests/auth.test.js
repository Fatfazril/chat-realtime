const { validateRegister, validateLogin } = require('../validation/auth.validation');

describe('Auth Validation', () => {
    describe('validateRegister', () => {
        it('should require username', () => {
            const result = validateRegister({ password: 'password123' });
            expect(result.valid).toBe(false);
            expect(result.errors).toContain('Username is required');
        });

        it('should require minimum username length', () => {
            const result = validateRegister({ username: 'ab', password: 'password123' });
            expect(result.valid).toBe(false);
            expect(result.errors).toContain('Username must be between 3 and 30 characters');
        });

        it('should validate correctly for valid data', () => {
            const result = validateRegister({ username: 'testuser', password: 'password123', email: 'test@example.com' });
            expect(result.valid).toBe(true);
            expect(result.errors.length).toBe(0);
        });
    });

    describe('validateLogin', () => {
        it('should require username and password', () => {
            const result = validateLogin({});
            expect(result.valid).toBe(false);
            expect(result.errors).toContain('Username is required');
            expect(result.errors).toContain('Password is required');
        });

        it('should pass with valid creds layout', () => {
            const result = validateLogin({ username: 'testname', password: 'mypassword' });
            expect(result.valid).toBe(true);
        });
    });
});
