const express = require('express');
const session = require('express-session');
const bodyParser = require('body-parser');
const path = require('path');
const pool = require('./db');

const app = express();

app.use(session({
  secret: 'secret-key',
  resave: false,
  saveUninitialized: true
}));

app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static('public'));

app.set('view engine', 'ejs'); 
app.set('views', path.join(__dirname, 'views'));

// Login page
app.get('/', (req, res) => {
  res.render('login'); // views/login.ejs
});

// Handle login
app.post('/login', async (req, res) => {
  const { username, password } = req.body;

  try {
    const [rows] = await pool.query(
      'SELECT * FROM users WHERE username = ?',
      [username]
    );

    const user = rows[0];

    if (user && password === user.password_hash) {
      req.session.user = {
        id: user.user_id,
        username: user.username,
        role: user.role
      };

      if (user.role === 'owner') {
        res.redirect('/owner/dashboard');
      } else if (user.role === 'walker') {
        res.redirect('/walker/dashboard');
      } else {
        res.status(400).send('Unknown role.');
      }
    } else {
      res.status(401).send('Invalid username or password');
    }

  } catch (err) {
    console.error('Login error:', err);
    res.status(500).send('Server error');
  }
});

// Owner dashboard
app.get('/owner/dashboard', (req, res) => {
  if (req.session.user?.role === 'owner') {
    res.send(`Welcome to Owner Dashboard, ${req.session.user.username}`);
  } else {
    res.redirect('/');
  }
});

// Walker dashboard
app.get('/walker/dashboard', (req, res) => {
  if (req.session.user?.role === 'walker') {
    res.send(`Welcome to Walker Dashboard, ${req.session.user.username}`);
  } else {
    res.redirect('/');
  }
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`Server running at http://localhost:${PORT}`));
