import express from 'express';
import { bookAppointment, getAllAppointments, updateAppointmentStatus } from '../controllers/appointmentController.js';

const router = express.Router();

router.post('/appointments', bookAppointment);
router.get('/appointments', getAllAppointments);
router.put('/appointments/:id/status', updateAppointmentStatus);

export default router;
