const db = require('../configs/db');


const User = {

  findAll: async () => {
    const result = await db.query('SELECT id, name, email, created_at FROM users ORDER BY id ASC');
    return result.rows;
  },

  /**
   * Find a user by ID
   */
  findById: async (id) => {
    const result = await db.query('SELECT id, name, email, created_at FROM users WHERE id = $1', [id]);
    return result.rows[0] || null;
  },

  /**
   * Find a user by Email (Useful for Auth)
   */
  findByEmail: async (email) => {
    const result = await db.query('SELECT * FROM users WHERE email = $1', [email]);
    return result.rows[0] || null;
  },

  /**
   * Create a new user
   */
  create: async ({ name, email, password_hash }) => {
    const result = await db.query(
      'INSERT INTO users (name, email, password_hash) VALUES ($1, $2, $3) RETURNING id, name, email, created_at',
      [name, email, password_hash]
    );
    return result.rows[0];
  },

  /**
   * Update a user
   */
  update: async (id, { name, email }) => {
    const result = await db.query(
      'UPDATE users SET name = $1, email = $2 WHERE id = $3 RETURNING id, name, email, created_at',
      [name, email, id]
    );
    return result.rows[0] || null;
  },

  /**
   * Delete a user
   */
  delete: async (id) => {
    const result = await db.query('DELETE FROM users WHERE id = $1 RETURNING id', [id]);
    return result.rows[0] || null;
  },
};

module.exports = User;
