import express from 'express';
import { registerClinic, getAllClinics } from '../controllers/clinicController.js';

const router = express.Router();

router.post('/clinics', registerClinic);
router.get('/clinics', getAllClinics); 

export default router;
