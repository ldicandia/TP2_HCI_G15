import express from 'express';
import cors from 'cors';
import cookieParser from 'cookie-parser';
import morgan from 'morgan';

// Import routes
import apiEndpoints from './utils/endpoints';
import userRoutes from './routes/user.routes';
import accountRoutes from './routes/account.routes';
import cardRoutes from './routes/card.routes';
import investmentRoutes from './routes/investment.routes';
import paymentRoutes from './routes/payment.routes';

const app = express();

// Middleware
app.use(cors());
app.use(express.json());
app.use(cookieParser());
app.use(morgan('dev'));

// Routes
app.use(apiEndpoints.USER, userRoutes);
app.use(apiEndpoints.ACCOUNT, accountRoutes);
app.use(apiEndpoints.CARD, cardRoutes);
app.use(apiEndpoints.INVESTMENT, investmentRoutes);
app.use(apiEndpoints.PAYMENT, paymentRoutes);

export { app };
