const User = require('./User.js');

describe('User model', () => {
  it('validates good User', async () => {
    const user = User.build({
      email: 'good@email.com',
      password: 'goodpassword',
      avatar: 'https://server.com/avatar.jpg',
    });

    const valid = await user.validate();
    expect(valid).toBeTruthy();
  });

  it('validates required user fields', async () => {
    const user = User.build({});

    expect.assertions(1);

    try {
      await user.validate();
    } catch (err) {
      const errors = err.errors.map((e) => e.message);
      expect(errors).toMatchInlineSnapshot(`
        Array [
          "user.email cannot be null",
          "user.passwordHash cannot be null",
        ]
      `);
    }
  });

  it('validates User', async () => {
    const user = User.build({
      email: 'notanemail',
      password: 'short',
      avatar: 'badurl:/',
    });

    expect.assertions(1);

    try {
      await user.validate();
    } catch (err) {
      const errors = err.errors.map((e) => e.message);
      expect(errors).toMatchInlineSnapshot(`
        Array [
          "Not a valid email",
          "Password must be at least 6 characters",
        ]
      `);
    }
  });
});
