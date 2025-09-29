import 'dotenv/config';
import express from 'express';
import cors from 'cors';
import connectDB from './config/dbConnection.config.js';
connectDB();
import userRoutes from '../Backend/routes/user.routes.js'
import profileRoutes from '../Backend/routes/profile.routes.js';
import healthRoutes from '../Backend/routes/healthRoutine.routes.js';
import medicationRoutes from '../Backend/routes/medication.routes.js';
import dashboardRoutes from '../Backend/routes/dashboard.routes.js';
import careGiverRoutes from '../Backend/routes/careGiver.routes.js';

const app = express();
app.use(cors({
    origin: 'http://localhost:5173',
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization'],
    credentials: true
}));

app.use("/uploads", express.static("uploads"));

app.use(express.json());
app.use(express.urlencoded({extended:true}));
app.use('/users', userRoutes);
app.use('/profile',profileRoutes);
app.use('/health',healthRoutes);
app.use('/medication',medicationRoutes);
app.use('/dashboard',dashboardRoutes);
app.use('/careGiver',careGiverRoutes);







export default app;
