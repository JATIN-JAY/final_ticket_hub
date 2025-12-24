import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { ArrowLeft, ShoppingCart } from "lucide-react";
import SeatGrid from "../components/SeatGrid";
import api from "../api/axios";
import { toast } from "react-toastify";

const SeatSelection = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [event, setEvent] = useState(null);
  const [selectedSeats, setSelectedSeats] = useState([]);
  const [loading, setLoading] = useState(true);
  const [booking, setBooking] = useState(false);

  useEffect(() => {
    fetchEventDetails();
  }, [id]);

  const fetchEventDetails = async () => {
    try {
      const response = await api.get(`/events/${id}`);
      setEvent(response.data);
      setLoading(false);
    } catch (error) {
      console.error("Error fetching event details:", error);
      toast.error("Failed to load event details");
      setLoading(false);
    }
  };

  const handleSeatSelect = (seats) => {
    setSelectedSeats(seats);
  };

  const handleBooking = async () => {
    if (selectedSeats.length === 0) {
      toast.error("Please select at least one seat");
      return;
    }

    setBooking(true);

    try {
      const response = await api.post("/bookings", {
        eventId: id,
        selectedSeats,
      });

      toast.success("Booking successful!");
      navigate("/my-bookings");
    } catch (error) {
      console.error("Booking error:", error);
      const errorMessage = error.response?.data?.message || "Booking failed";
      toast.error(errorMessage);

      // If seats are unavailable, refresh event data
      if (error.response?.data?.unavailableSeats) {
        fetchEventDetails();
        setSelectedSeats([]);
      }
    } finally {
      setBooking(false);
    }
  };

  // Calculate total amount considering sections
  const calculateTotalAmount = () => {
    if (!event) return 0;

    // If event has sections with different prices
    if (event.sections && event.sections.length > 0) {
      return selectedSeats.reduce((total, seatId) => {
        const [row, col] = parseSeatId(seatId);
        const seatValue = event.seatMap[row]?.[col];

        // Find the section this seat belongs to
        const section = event.sections.find((s) => s.id === seatValue);
        const price = section
          ? parseFloat(section.price)
          : parseFloat(event.pricePerSeat);

        return total + price;
      }, 0);
    }

    // Default pricing
    return selectedSeats.length * parseFloat(event.pricePerSeat || 0);
  };

  const parseSeatId = (seatId) => {
    const row = seatId.charCodeAt(0) - 65;
    const col = parseInt(seatId.slice(1)) - 1;
    return [row, col];
  };

  const totalAmount = calculateTotalAmount();

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-screen bg-stone-50">
        <div className="animate-spin rounded-full h-16 w-16 border-t-2 border-b-2 border-stone-900"></div>
      </div>
    );
  }

  if (!event) {
    return (
      <div className="container mx-auto px-4 py-8 min-h-screen bg-stone-50">
        <p className="text-center text-stone-600">Event not found</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-stone-50">
      <div className="container mx-auto px-4 py-8">
        <button
          onClick={() => navigate(`/events/${id}`)}
          className="inline-flex items-center space-x-2 text-sm font-medium text-stone-600 hover:text-stone-900 mb-6 transition-colors"
        >
          <ArrowLeft size={20} />
          <span>Back to Event Details</span>
        </button>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Seat Map */}
          <div className="lg:col-span-2">
            <div className="bg-white rounded-xl shadow-sm p-6 border border-stone-200">
              <h2 className="text-2xl font-bold mb-6 text-stone-900">
                Select Your Seats
              </h2>
              <SeatGrid
                seatMap={event.seatMap}
                rows={event.rows}
                columns={event.columns}
                onSeatSelect={handleSeatSelect}
                selectedSeats={selectedSeats}
                sections={event.sections || []}
              />
            </div>
          </div>

          {/* Booking Summary */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-xl shadow-sm p-6 border border-stone-200 sticky top-24">
              <h3 className="text-xl font-bold mb-4 text-stone-900">
                Booking Summary
              </h3>

              <div className="mb-6">
                <h4 className="font-semibold text-stone-900 mb-2">
                  {event.title}
                </h4>
                <p className="text-sm text-stone-600">{event.location}</p>
                <p className="text-sm text-stone-600">
                  {new Date(event.date).toLocaleDateString()} at {event.time}
                </p>
              </div>

              <div className="border-t border-stone-200 pt-4 mb-4">
                <div className="flex justify-between mb-2">
                  <span className="text-stone-600">Selected Seats:</span>
                  <span className="font-semibold text-stone-900">
                    {selectedSeats.length}
                  </span>
                </div>
                {selectedSeats.length > 0 && (
                  <div className="mb-2">
                    <p className="text-sm text-stone-600">
                      {selectedSeats.join(", ")}
                    </p>
                  </div>
                )}
                <div className="flex justify-between mb-2">
                  <span className="text-stone-600">Price per Seat:</span>
                  <span className="font-semibold text-stone-900">
                    ₹{event.pricePerSeat}
                  </span>
                </div>
              </div>

              <div className="border-t border-stone-200 pt-4 mb-6">
                <div className="flex justify-between text-lg">
                  <span className="font-bold text-stone-900">
                    Total Amount:
                  </span>
                  <span className="font-bold text-stone-900">
                    ₹{totalAmount}
                  </span>
                </div>
              </div>

              <button
                onClick={handleBooking}
                disabled={selectedSeats.length === 0 || booking}
                className="btn-primary w-full py-3 flex items-center justify-center space-x-2"
              >
                <ShoppingCart size={20} />
                <span>{booking ? "Processing..." : "Confirm Booking"}</span>
              </button>

              {selectedSeats.length === 0 && (
                <p className="text-sm text-stone-500 text-center mt-4">
                  Please select seats to continue
                </p>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SeatSelection;
