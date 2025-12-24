import mongoose from 'mongoose';

const bookingSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    eventId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Event',
      required: true,
    },
    selectedSeats: {
      type: [String],
      required: [true, 'Please select at least one seat'],
      validate: {
        validator: function (seats) {
          return seats.length > 0;
        },
        message: 'At least one seat must be selected',
      },
    },
    totalSeats: {
      type: Number,
      required: true,
    },
    totalAmount: {
      type: Number,
      required: true,
      min: 0,
    },
    bookingTime: {
      type: Date,
      default: Date.now,
    },
    status: {
      type: String,
      enum: ['confirmed', 'cancelled'],
      default: 'confirmed',
    },
  },
  {
    timestamps: true,
  }
);

// Index for faster queries
bookingSchema.index({ userId: 1, eventId: 1 });

const Booking = mongoose.model('Booking', bookingSchema);

export default Booking;
