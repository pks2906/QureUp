import express from 'express';
import { getClinicQueue } from '../controllers/queueController.js';

const router = express.Router();

router.get('/queue/:clinicId', getClinicQueue);

export default router;
