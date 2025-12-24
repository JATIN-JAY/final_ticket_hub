import Booking from "../models/Booking.js";
import Event from "../models/Event.js";
import mongoose from "mongoose";

// @desc    Create new booking
// @route   POST /api/bookings
// @access  Private
export const createBooking = async (req, res) => {
  const session = await mongoose.startSession();
  session.startTransaction();

  try {
    const { eventId, selectedSeats } = req.body;
    const userId = req.user._id;

    // Validate input
    if (!selectedSeats || selectedSeats.length === 0) {
      await session.abortTransaction();
      return res.status(400).json({
        success: false,
        message: "Please select at least one seat",
      });
    }

    // Get event with session for transaction
    const event = await Event.findById(eventId).session(session);

    if (!event) {
      await session.abortTransaction();
      return res.status(404).json({
        success: false,
        message: "Event not found",
      });
    }

    // Check if seats are available
    const unavailableSeats = [];
    selectedSeats.forEach((seatId) => {
      if (!event.isSeatAvailable(seatId)) {
        unavailableSeats.push(seatId);
      }
    });

    if (unavailableSeats.length > 0) {
      await session.abortTransaction();
      return res.status(400).json({
        success: false,
        message: "Some seats are already booked",
        unavailableSeats,
      });
    }

    // Book the seats
    event.bookSeats(selectedSeats);
    await event.save({ session });

    // Calculate total amount
    const totalAmount = selectedSeats.length * event.pricePerSeat;

    // Create booking
    const booking = await Booking.create(
      [
        {
          userId,
          eventId,
          selectedSeats,
          totalSeats: selectedSeats.length,
          totalAmount,
        },
      ],
      { session }
    );

    await session.commitTransaction();

    // Populate booking with event and user details
    const populatedBooking = await Booking.findById(booking[0]._id)
      .populate("eventId", "title location date time posterImage")
      .populate("userId", "name email");

    res.status(201).json({
      success: true,
      message: "Booking created successfully",
      data: populatedBooking,
    });
  } catch (error) {
    await session.abortTransaction();
    res.status(500).json({
      success: false,
      message: error.message,
    });
  } finally {
    session.endSession();
  }
};

// @desc    Get user bookings
// @route   GET /api/bookings/me
// @access  Private
export const getMyBookings = async (req, res) => {
  try {
    const bookings = await Booking.find({ userId: req.user._id })
      .populate(
        "eventId",
        "title location date time posterImage pricePerSeat venue category"
      )
      .sort({ bookingTime: -1 });

    res.json(bookings);
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// @desc    Get single booking
// @route   GET /api/bookings/:id
// @access  Private
export const getBooking = async (req, res) => {
  try {
    const booking = await Booking.findById(req.params.id)
      .populate("eventId", "title location date time posterImage pricePerSeat")
      .populate("userId", "name email phone");

    if (!booking) {
      return res.status(404).json({
        success: false,
        message: "Booking not found",
      });
    }

    // Make sure user owns booking or is admin
    if (
      booking.userId._id.toString() !== req.user._id.toString() &&
      req.user.role !== "admin"
    ) {
      return res.status(403).json({
        success: false,
        message: "Not authorized to access this booking",
      });
    }

    res.json({
      success: true,
      data: booking,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// @desc    Get all bookings (Admin)
// @route   GET /api/bookings
// @access  Private/Admin
export const getAllBookings = async (req, res) => {
  try {
    const bookings = await Booking.find()
      .populate(
        "eventId",
        "title location date time venue category pricePerSeat"
      )
      .populate("userId", "name email phone")
      .sort({ bookingTime: -1 });

    res.json(bookings);
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};
