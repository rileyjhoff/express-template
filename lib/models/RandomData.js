const pool = require('../utils/pool');

module.exports = class RandomData {
  id;
  name;
  age;
  user_id;
  active;

  constructor(row) {
    this.id = row.id;
    this.name = row.name;
    this.age = row.age;
    this.user_id = row.user_id;
    this.active = row.active;
  }

  static async insert({ name, age, user_id }) {
    const { rows } = await pool.query(
      `
      INSERT INTO random_data (name, age, user_id)
      VALUES ($1, $2, $3)
      RETURNING *;
    `,
      [name, age, user_id]
    );

    return new RandomData(rows[0]);
  }

  static async updateById(id, user_id, attrs) {
    const randomData = await RandomData.getById(id);
    if (!randomData) return null;
    const { name, age, active } = { ...randomData, ...attrs };
    const { rows } = await pool.query(
      `
      UPDATE random_data 
      SET    name=$3, age=$4, active=$5 
      WHERE  id=$1 
      AND    user_id=$2
      RETURNING *;
    `,
      [id, user_id, name, age, active]
    );
    return new RandomData(rows[0]);
  }

  static async getById(id) {
    const { rows } = await pool.query(
      `
      SELECT *
      FROM   random_data
      WHERE  id=$1
    `,
      [id]
    );

    if (!rows[0]) {
      return null;
    }
    return new RandomData(rows[0]);
  }

  static async getAll(user_id) {
    const { rows } = await pool.query(
      `
      SELECT * 
      FROM  random_data 
      WHERE user_id = $1 
      ORDER BY created_at DESC
    `,
      [user_id]
    );
    return rows.map((randomData) => new RandomData(randomData));
  }

  static async delete(id) {
    const { rows } = await pool.query(
      `
      DELETE FROM random_data 
      WHERE id = $1 
      RETURNING *
    `,
      [id]
    );
    return new RandomData(rows[0]);
  }
};
