import express from 'express';
import authMiddleware from '../middlewares/auth.js';
import { addProduct, removeProduct, updateProduct,getProducts } from '../controllers/seller.js'
import validateProduct from '../validation/seller.js';
const router = express.Router();

router.get('/', authMiddleware, getProducts);
router.post('/', authMiddleware, validateProduct, addProduct);
router.delete('/:id', authMiddleware, removeProduct);
router.put('/:id', authMiddleware, validateProduct, updateProduct);

export default router;
