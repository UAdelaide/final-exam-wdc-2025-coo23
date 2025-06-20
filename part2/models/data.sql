-- Insert Users
INSERT INTO users (username, email, password_hash, role) VALUES
('alice123', 'alice@example.com', 'hashed123', 'owner'),
('bobwalker', 'bob@example.com', 'hashed456', 'walker'),
('carol123', 'carol@example.com', 'hashed789', 'owner'),
('davey', 'davey@example.com', 'hashed000', 'owner'),
('evewalker', 'eve@example.com', 'hashed999', 'walker');

-- Insert Dogs (with subquery to get owner_id from users table)
INSERT INTO dogs (name, size, owner_id) VALUES
('Max', 'medium', (SELECT id FROM users WHERE username = 'alice123')),
('Bella', 'small', (SELECT id FROM users WHERE username = 'carol123')),
('Rocky', 'large', (SELECT id FROM users WHERE username = 'davey')),
('Luna', 'medium', (SELECT id FROM users WHERE username = 'alice123')),
('Milo', 'small', (SELECT id FROM users WHERE username = 'carol123'));

-- Insert Walk Requests (with subquery to get dog_id from dogs table)
INSERT INTO walk_requests (dog_id, datetime, duration_minutes, location, status) VALUES
((SELECT id FROM dogs WHERE name = 'Max'), '2025-06-10 08:00:00', 30, 'Parklands', 'open'),
((SELECT id FROM dogs WHERE name = 'Bella'), '2025-06-10 09:30:00', 45, 'Beachside Ave', 'accepted'),
((SELECT id FROM dogs WHERE name = 'Rocky'), '2025-06-11 10:00:00', 60, 'Riverbank Trail', 'open'),
((SELECT id FROM dogs WHERE name = 'Luna'), '2025-06-11 11:30:00', 30, 'Central Park', 'pending'),
((SELECT id FROM dogs WHERE name = 'Milo'), '2025-06-12 07:45:00', 20, 'Sunnyvale Park', 'cancelled');
