import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import { PrismaClient } from '@prisma/client';
import userRoutes from './routes/userRoutes.js';
import clinicRoutes from './routes/clinicRoutes.js';
import appointmentRoutes from './routes/appointmentRoutes.js';
import queueRoutes from './routes/queueRoutes.js';


//46a2d4df-6afa-4c9b-947b-c0e0ebd8b2a2 - clinic id
//0682afd7-ae7d-4f35-a436-2f63990e8700 - user id
dotenv.config();
const app = express();
const prisma = new PrismaClient();

app.use(cors());
app.use(express.json());
app.use('/api', userRoutes);
app.use('/api', clinicRoutes);
app.use('/api', appointmentRoutes);
app.use('/api', queueRoutes);


app.get('/', (req, res) => {
  res.send('QureUp Backend is running!');
});

app.get('/test-db', async (req, res) => {
  try {
    const users = await prisma.user.findMany();
    res.json({ users });
  } catch (err) {
    res.status(500).json({ error: 'DB error', details: err.message });
  }
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(` Server running on http://localhost:${PORT}`);
});
