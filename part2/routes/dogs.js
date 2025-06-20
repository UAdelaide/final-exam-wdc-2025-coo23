const express = require('express');
const { Pool } = require('pg');
const app = express();
const port = 3000;

// PostgreSQL connection setup
const pool = new Pool({
  user: 'your_db_user',
  host: 'localhost',
  database: 'your_db_name',
  password: 'your_db_password',
  port: 5432,
});

// Insert sample data at startup
async function insertSampleData() {
  try {
    // Check if users already exist
    const { rowCount } = await pool.query('SELECT 1 FROM users LIMIT 1');
    if (rowCount > 0) return;

    // Insert Users
    await pool.query(`
      INSERT INTO users (username, email, password_hash, role) VALUES
      ('alice123', 'alice@example.com', 'hashed123', 'owner'),
      ('bobwalker', 'bob@example.com', 'hashed456', 'walker'),
      ('carol123', 'carol@example.com', 'hashed789', 'owner'),
      ('davey', 'davey@example.com', 'hashed000', 'owner'),
      ('evewalker', 'eve@example.com', 'hashed999', 'walker');
    `);

    // Insert Dogs
    await pool.query(`
      INSERT INTO dogs (name, size, owner_id) VALUES
      ('Max', 'medium', (SELECT id FROM users WHERE username = 'alice123')),
      ('Bella', 'small', (SELECT id FROM users WHERE username = 'carol123')),
      ('Rocky', 'large', (SELECT id FROM users WHERE username = 'davey')),
      ('Luna', 'medium', (SELECT id FROM users WHERE username = 'alice123')),
      ('Milo', 'small', (SELECT id FROM users WHERE username = 'carol123'));
    `);

    // Insert Walk Requests
    await pool.query(`
      INSERT INTO walk_requests (dog_id, datetime, duration_minutes, location, status) VALUES
      ((SELECT id FROM dogs WHERE name = 'Max'), '2025-06-10 08:00:00', 30, 'Parklands', 'open'),
      ((SELECT id FROM dogs WHERE name = 'Bella'), '2025-06-10 09:30:00', 45, 'Beachside Ave', 'accepted'),
      ((SELECT id FROM dogs WHERE name = 'Rocky'), '2025-06-11 10:00:00', 60, 'Riverbank Trail', 'open'),
      ((SELECT id FROM dogs WHERE name = 'Luna'), '2025-06-11 11:30:00', 30, 'Central Park', 'pending'),
      ((SELECT id FROM dogs WHERE name = 'Milo'), '2025-06-12 07:45:00', 20, 'Sunnyvale Park', 'cancelled');
    `);
    console.log('Sample data inserted');
  } catch (err) {
    console.error('Error inserting sample data:', err);
  }
}

// Route: /api/dogs
app.get('/api/dogs', async (req, res) => {
  try {
    const result = await pool.query(`
      SELECT dogs.name AS dog_name, dogs.size, users.username AS owner_username
      FROM dogs
      JOIN users ON dogs.owner_id = users.id;
    `);
    res.json(result.rows);
  } catch (error) {
    console.error('Error fetching dogs:', error);
    res.status(500).json({ error: 'Failed to fetch dogs' });
  }
});

// Start server and insert data
app.listen(port, async () => {
  console.log(`Server running at http://localhost:${port}`);
  await insertSampleData();
});
