import express from 'express';
import bodyParser from 'body-parser';
import cors from 'cors';
import dotenv from 'dotenv';
import connectDB from './config/db.js';
import helmet from 'helmet';
import authRoutes from './routes/authRoutes.js';
import cookieParser from 'cookie-parser';
import sellerRoutes from './routes/sellerRoutes.js'
import productRoutes from './routes/productRoutes.js';
dotenv.config();

const app = express();
const PORT = process.env.PORT || 8080;
app.use(cookieParser());
app.use(cors(
  {
    origin: 'http://localhost:5173', // Frontend origin
    methods: ['GET', 'POST', 'PUT', 'DELETE'], // Allowed HTTP methods
    credentials: true, // Allow cookies to be sent
  }
));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(helmet());

// Import routes
app.use('/auth', authRoutes);
app.use('/seller', sellerRoutes); 
app.use('/products', productRoutes); // Assuming you want to use the same routes for products

connectDB();
app.get('/', (req, res) => {
  res.send('Welcome to the Backend Server!');
});
app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});