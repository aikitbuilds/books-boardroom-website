import express from 'express';
import cors from 'cors';
import * as admin from 'firebase-admin';
import readyModeRoutes from './routes/readymode';

// Initialize Firebase Admin (make it optional)
try {
  if (!admin.apps.length) {
    // Only initialize if Firebase config is available
    if (process.env.FIREBASE_PROJECT_ID || process.env.GOOGLE_APPLICATION_CREDENTIALS) {
      admin.initializeApp();
      console.log('✅ Firebase Admin initialized');
    } else {
      console.log('⚠️  Firebase Admin not initialized (no config found)');
    }
  }
} catch (error) {
  console.warn('⚠️  Firebase Admin initialization failed:', error);
}

const app = express();
const PORT = process.env.PORT || 3001;

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Routes
app.use('/api/readymode', readyModeRoutes);

// Health check endpoint
app.get('/health', (req, res) => {
  res.json({ 
    status: 'OK', 
    timestamp: new Date().toISOString(),
    service: 'SPS MCP Server',
    firebase: admin.apps.length > 0 ? 'initialized' : 'not_configured'
  });
});

// Error handling middleware
app.use((error: Error, req: express.Request, res: express.Response, next: express.NextFunction) => {
  console.error('Server error:', error);
  res.status(500).json({
    error: 'Internal server error',
    message: error.message
  });
});

// Start server
app.listen(PORT, () => {
  console.log('🚀 SPS MCP Server starting...');
  console.log(`📍 Server running on port ${PORT}`);
  console.log(`🔍 Health check: http://localhost:${PORT}/health`);
  console.log(`🔗 ReadyMode API: http://localhost:${PORT}/api/readymode`);
  console.log('✅ Server ready for connections');
}).on('error', (error) => {
  console.error('❌ Server failed to start:', error);
  process.exit(1);
});

export default app; 