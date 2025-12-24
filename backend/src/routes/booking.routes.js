import express from "express";
import {
  createBooking,
  getMyBookings,
  getBooking,
  getAllBookings,
} from "../controllers/booking.controller.js";
import { protect, admin } from "../middleware/authMiddleware.js";

const router = express.Router();

router
  .route("/")
  .post(protect, createBooking)
  .get(protect, admin, getAllBookings);

router.get("/me", protect, getMyBookings);

router.get("/:id", protect, getBooking);

export default router;
