import express from 'express';
import cors from 'cors';
import { setupDatabase } from './database/setup';
import { errorHandler } from './middleware/errorHandler';

// Import routes
import playerRoutes from './routes/players';
import matchRoutes from './routes/matches';
import statsRoutes from './routes/stats';

const PORT = process.env.PORT || 3000;

// Async function to start the server
async function startServer() {
  try {
    // Initialize database
    await setupDatabase();

    // Create Express app
    const app = express();

    // Middleware
    app.use(cors()); // Enable CORS for frontend
    app.use(express.json()); // Parse JSON bodies

    // API Routes
    app.use('/api/players', playerRoutes);
    app.use('/api/matches', matchRoutes);
    app.use('/api/stats', statsRoutes);

    // Health check endpoint
    app.get('/health', (req, res) => {
      res.json({ status: 'ok', message: 'Football Recorder API is running' });
    });

    // Error handling middleware
    app.use(errorHandler);

    // Start server
    app.listen(PORT, () => {
      console.log(`\n🚀 Server running on http://localhost:${PORT}`);
      console.log(`📊 API endpoints:`);
      console.log(`   - GET    http://localhost:${PORT}/api/players`);
      console.log(`   - POST   http://localhost:${PORT}/api/players`);
      console.log(`   - GET    http://localhost:${PORT}/api/matches`);
      console.log(`   - POST   http://localhost:${PORT}/api/matches`);
      console.log(`   - GET    http://localhost:${PORT}/api/stats`);
      console.log(`   - GET    http://localhost:${PORT}/health\n`);
    });
  } catch (error) {
    console.error('❌ Failed to start server:', error);
    process.exit(1);
  }
}

// Start the server
startServer();
