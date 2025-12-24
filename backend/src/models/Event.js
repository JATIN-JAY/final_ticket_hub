import mongoose from "mongoose";

const eventSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: [true, "Please provide event title"],
      trim: true,
    },
    description: {
      type: String,
      required: [true, "Please provide event description"],
    },
    location: {
      type: String,
      required: [true, "Please provide event location"],
    },
    venue: {
      type: String,
      required: false,
    },
    date: {
      type: Date,
      required: [true, "Please provide event date"],
    },
    time: {
      type: String,
      required: [true, "Please provide event time"],
    },
    posterImage: {
      type: String,
      default: "https://via.placeholder.com/400x300?text=Event+Poster",
    },
    totalSeats: {
      type: Number,
      required: [true, "Please provide total seats"],
    },
    availableSeats: {
      type: Number,
      required: true,
    },
    pricePerSeat: {
      type: Number,
      required: [true, "Please provide price per seat"],
      min: 0,
    },
    seatMap: {
      type: [[String]], // 2D array representing seat layout
      required: true,
    },
    rows: {
      type: Number,
      required: true,
    },
    columns: {
      type: Number,
      required: true,
    },
    category: {
      type: String,
      enum: ["concert", "sports", "theater", "conference", "other"],
      default: "other",
    },
    sections: {
      type: [
        {
          id: Number,
          name: String,
          price: Number,
          color: String,
          shape: String,
        },
      ],
      default: [],
    },
    status: {
      type: String,
      enum: ["upcoming", "ongoing", "completed", "cancelled"],
      default: "upcoming",
    },
  },
  {
    timestamps: true,
  }
);

// Method to check seat availability
eventSchema.methods.isSeatAvailable = function (seatId) {
  const [row, col] = this.parseSeatId(seatId);
  return this.seatMap[row][col] === "available";
};

// Method to parse seat ID (e.g., "A1" -> [0, 0])
eventSchema.methods.parseSeatId = function (seatId) {
  const row = seatId.charCodeAt(0) - 65; // A -> 0, B -> 1, etc.
  const col = parseInt(seatId.slice(1)) - 1;
  return [row, col];
};

// Method to book seats
eventSchema.methods.bookSeats = function (seatIds) {
  seatIds.forEach((seatId) => {
    const [row, col] = this.parseSeatId(seatId);
    if (this.seatMap[row][col] === "available") {
      this.seatMap[row][col] = "booked";
      this.availableSeats -= 1;
    }
  });
};

const Event = mongoose.model("Event", eventSchema);

export default Event;
