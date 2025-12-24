import Event from "../models/Event.js";

// Helper function to generate seat map
const generateSeatMap = (rows, columns) => {
  const seatMap = [];
  for (let i = 0; i < rows; i++) {
    const row = [];
    for (let j = 0; j < columns; j++) {
      row.push("available");
    }
    seatMap.push(row);
  }
  return seatMap;
};

// @desc    Get all events
// @route   GET /api/events
// @access  Public
export const getAllEvents = async (req, res) => {
  try {
    const events = await Event.find().sort({ date: 1 });

    // Calculate available seats for each event
    const eventsWithSeats = events.map((event) => {
      const eventObj = event.toObject();
      const totalSeats = eventObj.seatMap.flat().length;
      const bookedSeats = eventObj.seatMap
        .flat()
        .filter((seat) => seat === "booked").length;
      eventObj.availableSeats = totalSeats - bookedSeats;
      eventObj.totalSeats = totalSeats;
      return eventObj;
    });

    res.json(eventsWithSeats);
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// @desc    Get single event
// @route   GET /api/events/:id
// @access  Public
export const getEvent = async (req, res) => {
  try {
    const event = await Event.findById(req.params.id);

    if (!event) {
      return res.status(404).json({
        success: false,
        message: "Event not found",
      });
    }

    const eventObj = event.toObject();
    const totalSeats = eventObj.seatMap.flat().length;
    const bookedSeats = eventObj.seatMap
      .flat()
      .filter((seat) => seat === "booked").length;
    eventObj.availableSeats = totalSeats - bookedSeats;
    eventObj.totalSeats = totalSeats;

    res.json(eventObj);
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// @desc    Create new event
// @route   POST /api/events
// @access  Private/Admin
export const createEvent = async (req, res) => {
  try {
    const {
      title,
      description,
      location,
      venue,
      date,
      time,
      posterImage,
      rows,
      columns,
      pricePerSeat,
      category,
      customSeatMap,
      sections,
    } = req.body;

    let seatMap;
    let totalSeats;

    // If custom seat map is provided, use it and calculate total seats
    if (customSeatMap && Array.isArray(customSeatMap)) {
      seatMap = customSeatMap;
      // Count only non-null seats and non-stage seats as available
      totalSeats = customSeatMap
        .flat()
        .filter((seat) => seat !== null && seat !== "stage").length;
    } else {
      // Generate standard grid layout
      totalSeats = rows * columns;
      seatMap = generateSeatMap(rows, columns);
    }

    const event = await Event.create({
      title,
      description,
      location,
      venue,
      date,
      time,
      posterImage,
      totalSeats,
      availableSeats: totalSeats,
      pricePerSeat,
      seatMap,
      rows,
      columns,
      category,
      sections: sections || [],
    });

    res.status(201).json({
      success: true,
      data: event,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// @desc    Update event
// @route   PUT /api/events/:id
// @access  Private/Admin
export const updateEvent = async (req, res) => {
  try {
    let event = await Event.findById(req.params.id);

    if (!event) {
      return res.status(404).json({
        success: false,
        message: "Event not found",
      });
    }

    // If rows or columns changed, regenerate seat map
    if (req.body.rows || req.body.columns) {
      const rows = req.body.rows || event.rows;
      const columns = req.body.columns || event.columns;
      req.body.seatMap = generateSeatMap(rows, columns);
      req.body.totalSeats = rows * columns;
      req.body.availableSeats = rows * columns;
    }

    event = await Event.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true,
    });

    res.json({
      success: true,
      data: event,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// @desc    Delete event
// @route   DELETE /api/events/:id
// @access  Private/Admin
export const deleteEvent = async (req, res) => {
  try {
    const event = await Event.findById(req.params.id);

    if (!event) {
      return res.status(404).json({
        success: false,
        message: "Event not found",
      });
    }

    await event.deleteOne();

    res.json({
      success: true,
      message: "Event deleted successfully",
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// @desc    Get event seat map
// @route   GET /api/events/:id/seats
// @access  Public
export const getEventSeats = async (req, res) => {
  try {
    const event = await Event.findById(req.params.id).select(
      "seatMap rows columns"
    );

    if (!event) {
      return res.status(404).json({
        success: false,
        message: "Event not found",
      });
    }

    res.json({
      success: true,
      data: {
        seatMap: event.seatMap,
        rows: event.rows,
        columns: event.columns,
      },
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};
