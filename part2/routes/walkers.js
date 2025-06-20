app.get('/api/walkers/summary', async (req, res) => {
    try {
      const result = await pool.query(`
        SELECT 
          u.username AS walker_username,
          COUNT(r.rating) AS total_ratings,
          ROUND(AVG(r.rating)::numeric, 2) AS average_rating,
          COUNT(CASE WHEN wr.status = 'completed' THEN 1 END) AS completed_walks
        FROM users u
        LEFT JOIN walk_requests wr ON u.id = wr.walker_id
        LEFT JOIN ratings r ON wr.id = r.walk_request_id
        WHERE u.role = 'walker'
        GROUP BY u.username
        ORDER BY u.username;
      `);
  
      res.json(result.rows);
    } catch (error) {
      console.error('Error fetching walker summary:', error);
      res.status(500).json({ error: 'Failed to fetch walker summary' });
    }
  });
  