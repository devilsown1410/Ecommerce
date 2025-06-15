import express from 'express';
import bodyParser from 'body-parser';
import cors from 'cors';
import dotenv from 'dotenv';
import connectDB from './config/db.js';
import helmet from 'helmet';
import authRoutes from './routes/authRoutes.js';
dotenv.config();

const app = express();
const PORT = process.env.PORT || 3000;
app.use(cors(
  {
    origin: 'http://localhost:5173',
    methods: ['GET', 'POST', 'PUT', 'DELETE'], // Allowed HTTP methods
    credentials: true, // Allow credentials (cookies, authorization headers, etc.)
  }
));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(helmet());

// Import routes
app.use('/auth', authRoutes);

connectDB();
app.get('/', (req, res) => {
  res.send('Welcome to the Backend Server!');
});
app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});