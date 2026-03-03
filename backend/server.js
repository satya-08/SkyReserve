import express from 'express';
import mongoose from 'mongoose';
import cors from 'cors';
import dotenv from 'dotenv';
import path from 'path';

// Load environment variables *before* db connect
dotenv.config();

import connectDB from './config/db.js';
import userRoutes from './routes/userRoutes.js';
import flightRoutes from './routes/flightRoutes.js';
import bookingRoutes from './routes/bookingRoutes.js';

connectDB();

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors({
  origin: ['http://localhost:5173', 'https://sky-reserve-h35u.vercel.app'],
  methods: ['GET', 'POST', 'PUT', 'DELETE'],
  credentials: true
}));
app.use(express.json());

const __dirname = path.resolve();

if (process.env.NODE_ENV === 'production') {
  app.use(express.static(path.join(__dirname, '../frontend/dist')));

  app.get('*', (req, res) =>
    res.sendFile(path.resolve(__dirname, '../frontend', 'dist', 'index.html'))
  );
} else {
  app.get('/', (req, res) => {
    res.send('SkyReserve API is running');
  });
}

// API Routes
app.use('/api/users', userRoutes);
app.use('/api/flights', flightRoutes);
app.use('/api/bookings', bookingRoutes);

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
