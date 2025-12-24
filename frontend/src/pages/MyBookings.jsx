import { useState, useEffect } from "react";
import { Calendar, MapPin, Ticket, DollarSign } from "lucide-react";
import api from "../api/axios";
import { toast } from "react-toastify";

const MyBookings = () => {
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchBookings();
  }, []);

  const fetchBookings = async () => {
    try {
      const response = await api.get("/bookings/me");
      setBookings(response.data);
      setLoading(false);
    } catch (error) {
      console.error("Error fetching bookings:", error);
      toast.error("Failed to load bookings");
      setLoading(false);
    }
  };

  const formatDate = (date) => {
    return new Date(date).toLocaleDateString("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  };

  const formatBookingTime = (date) => {
    return new Date(date).toLocaleString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-screen bg-stone-50">
        <div className="animate-spin rounded-full h-16 w-16 border-t-2 border-b-2 border-stone-900"></div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8 min-h-screen bg-stone-50">
      <div className="mb-8">
        <h1 className="text-4xl font-bold text-stone-900 mb-2">My Bookings</h1>
        <p className="text-stone-600">View all your event bookings</p>
      </div>

      {bookings.length === 0 ? (
        <div className="bg-white rounded-xl shadow-sm p-16 border border-stone-200 text-center">
          <Ticket size={64} className="mx-auto text-stone-300 mb-4" />
          <p className="text-stone-600 text-lg mb-4">No bookings yet</p>
          <a href="/" className="btn-primary inline-block">
            Browse Events
          </a>
        </div>
      ) : (
        <div className="space-y-6">
          {bookings.map((booking) => (
            <div
              key={booking._id}
              className="bg-white rounded-xl shadow-sm p-6 border border-stone-200 hover:shadow-md transition-shadow"
            >
              <div className="flex flex-col md:flex-row gap-6">
                {/* Event Poster */}
                <div className="md:w-48 flex-shrink-0">
                  <img
                    src={booking.eventId.posterImage}
                    alt={booking.eventId.title}
                    className="w-full h-48 object-cover rounded-lg border border-stone-200"
                  />
                </div>

                {/* Booking Details */}
                <div className="flex-1">
                  <div className="flex justify-between items-start mb-4">
                    <div>
                      <h3 className="text-2xl font-bold text-stone-900 mb-2">
                        {booking.eventId.title}
                      </h3>
                      <span
                        className={`inline-block px-3 py-1 rounded-full text-xs font-semibold ${
                          booking.status === "confirmed"
                            ? "bg-green-100 text-green-800"
                            : "bg-red-100 text-red-800"
                        }`}
                      >
                        {booking.status.toUpperCase()}
                      </span>
                    </div>
                    <div className="text-right">
                      <p className="text-sm text-stone-600">Booking ID</p>
                      <p className="text-xs font-mono text-stone-900">
                        {booking._id}
                      </p>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                    <div className="flex items-start space-x-3">
                      <Calendar size={20} className="text-stone-500 mt-1" />
                      <div>
                        <p className="font-semibold text-stone-900">
                          Event Date
                        </p>
                        <p className="text-sm text-stone-600">
                          {formatDate(booking.eventId.date)} at{" "}
                          {booking.eventId.time}
                        </p>
                      </div>
                    </div>

                    <div className="flex items-start space-x-3">
                      <MapPin size={20} className="text-stone-500 mt-1" />
                      <div>
                        <p className="font-semibold text-stone-900">Location</p>
                        <p className="text-sm text-stone-600">
                          {booking.eventId.location}
                        </p>
                      </div>
                    </div>

                    <div className="flex items-start space-x-3">
                      <Ticket size={20} className="text-stone-500 mt-1" />
                      <div>
                        <p className="font-semibold text-stone-900">Seats</p>
                        <p className="text-sm text-stone-600">
                          {booking.selectedSeats.join(", ")} (
                          {booking.totalSeats} seats)
                        </p>
                      </div>
                    </div>

                    <div className="flex items-start space-x-3">
                      <span className="text-stone-500 mt-1 text-xl">₹</span>
                      <div>
                        <p className="font-semibold text-stone-900">
                          Total Amount
                        </p>
                        <p className="text-lg font-bold text-stone-900">
                          {booking.totalAmount}
                        </p>
                      </div>
                    </div>
                  </div>

                  <div className="border-t border-stone-200 pt-3">
                    <p className="text-xs text-stone-500">
                      Booked on: {formatBookingTime(booking.bookingTime)}
                    </p>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default MyBookings;
