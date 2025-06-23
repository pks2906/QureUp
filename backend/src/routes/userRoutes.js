import express from 'express';
import { registerUser, getAllUsers } from '../controllers/userController.js';

const router = express.Router();

router.post('/users', registerUser);
router.get('/users', getAllUsers);

export default router;
