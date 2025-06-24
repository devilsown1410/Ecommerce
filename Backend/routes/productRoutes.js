import express from "express";
import { getAllProducts, getProductById } from "../controllers/product.js";
import authMiddleware from "../middlewares/auth.js";

const router = express.Router();

router.get("/", authMiddleware, getAllProducts);

router.get("/:id", authMiddleware, getProductById);

export default router;
