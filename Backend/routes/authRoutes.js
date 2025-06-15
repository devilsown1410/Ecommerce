import express from 'express';
import { validateLogin,validateRegister } from '../validation/auth.js';
import { handleLogin, handleRegister } from '../controllers/auth.js';
const router = express.Router();

router.post('/login', validateLogin, handleLogin);
router.post('/register', validateRegister, handleRegister);

export default router;