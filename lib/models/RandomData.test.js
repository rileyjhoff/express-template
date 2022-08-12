const RandomData = require('./RandomData.js');

describe('RandomData model', () => {
  it('validates good piece of random data', async () => {
    const randomData = RandomData.build({
      name: 'hunter',
      age: 26,
    });

    const valid = await randomData.validate();
    expect(valid.active).toBe(false);
  });

  it('validates required random data fields', async () => {
    const randomData = RandomData.build({});

    expect.assertions(1);

    try {
      await randomData.validate();
    } catch (err) {
      const errors = err.errors.map((e) => e.message);
      expect(errors).toMatchInlineSnapshot(`
        Array [
          "random_data.name cannot be null",
        ]
      `);
    }
  });

  it('validates piece of random data', async () => {
    const randomData = RandomData.build({
      name: 'winston',
      age: 1,
    });

    expect.assertions(1);

    try {
      await randomData.validate();
    } catch (err) {
      const errors = err.errors.map((e) => e.message);
      expect(errors).toMatchInlineSnapshot(`
        Array [
          "Quantity (age) cannot be less than 18",
        ]
      `);
    }
  });
});
