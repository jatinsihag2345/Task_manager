const express = require('express');
const cors = require('cors');
const { connectDB, sequelize } = require('./config/db');
const authRoutes = require('./routes/auth');
const projectRoutes = require('./routes/projects');
const taskRoutes = require('./routes/tasks');
const path = require('path');

require('dotenv').config();

const app = express();

// Middleware
app.use(cors());
app.use(express.json());

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/projects', projectRoutes);
app.use('/api/tasks', taskRoutes);

// Health Check
app.get('/health', (req, res) => res.send('API is running...'));

// Serve the built client in production (single-service deploy).
if (process.env.NODE_ENV === 'production') {
  const clientDistPath = path.join(__dirname, '..', 'client', 'dist');
  app.use(express.static(clientDistPath));

  // Express 5 + path-to-regexp does not accept bare "*" routes.
  // Use a regex fallback for SPA routes (and keep /api/* handled above).
  app.get(/^(?!\/api).*/, (req, res) => {
    res.sendFile(path.join(clientDistPath, 'index.html'));
  });
}

const PORT = process.env.PORT || 5001;

const startServer = async () => {
  const dbReady = await connectDB();

  if (dbReady) {
    await sequelize.sync({ alter: true });
    console.log('Database synced.');
  } else {
    console.warn('Starting server without a database connection. API routes will return 503 until DB is available.');
    app.use('/api', (req, res) => {
      res.status(503).json({ message: 'Database unavailable. Configure DB_URL / DB_SOCKET_PATH and restart.' });
    });
  }

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`Server running on port ${PORT}`);
  });
};

startServer();
