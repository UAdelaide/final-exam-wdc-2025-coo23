// Route: /api/walkrequests/open
app.get('/api/walkrequests/open', async (req, res) => {
    try {
      const result = await pool.query(`
        SELECT 
          wr.id AS request_id,
          d.name AS dog_name,
          wr.datetime AS requested_time,
          wr.duration_minutes,
          wr.location,
          u.username AS owner_username
        FROM walk_requests wr
        JOIN dogs d ON wr.dog_id = d.id
        JOIN users u ON d.owner_id = u.id
        WHERE wr.status = 'open';
      `);
  
      res.json(result.rows);
    } catch (error) {
      console.error('Error fetching open walk requests:', error);
      res.status(500).json({ error: 'Failed to fetch open walk requests' });
    }
  });
  