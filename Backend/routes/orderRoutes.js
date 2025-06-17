import express from 'express';
import { createOrder,getOrdersByUser,cancelOrder, editOrder } from "../controllers/order.js";
import validateOrder from '../validation/order.js'
import authMiddleware from '../middlewares/auth.js';
const router= express.Router();

router.post('/', authMiddleware, validateOrder, createOrder);
router.get('/', authMiddleware, getOrdersByUser);
router.put('/cancel/:id', authMiddleware, cancelOrder);
router.put('/:id', authMiddleware, editOrder);

export default router;