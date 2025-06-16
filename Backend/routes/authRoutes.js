import express from 'express';
import { validateLogin,validateRegister } from '../validation/auth.js';
import { handleLogin, handleLogout, handleRegister } from '../controllers/auth.js';
import authMiddleware from '../middlewares/auth.js';
const router = express.Router();

router.post('/login', validateLogin, handleLogin);
router.post('/register', validateRegister, handleRegister);
router.post('/logout',authMiddleware,handleLogout);

export default router;