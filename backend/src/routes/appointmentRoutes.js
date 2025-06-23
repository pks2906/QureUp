import express from 'express';
import { bookAppointment, getAllAppointments } from '../controllers/appointmentController.js';

const router = express.Router();

router.post('/appointments', bookAppointment);
router.get('/appointments', getAllAppointments);

export default router;
