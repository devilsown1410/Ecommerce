import express from "express";
import {
  addAddress,
  getAddresses,
  updateAddress,
  deleteAddress,
} from "../controllers/address.js";
import authmiddleware from "../middlewares/auth.js";

const router = express.Router();

// Route to get all addresses for a user
router.get("/", authmiddleware, getAddresses);

// Route to add a new address for a user
router.post("/", authmiddleware, addAddress);

router.put("/:id", authmiddleware, updateAddress);

router.delete("/:id", authmiddleware, deleteAddress);

export default router;
