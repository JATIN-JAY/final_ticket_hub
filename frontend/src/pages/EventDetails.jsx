import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { Calendar, MapPin, DollarSign, Users, ArrowLeft } from "lucide-react";
import api from "../api/axios";
import useAuthStore from "../store/authStore";
import { toast } from "react-toastify";

const EventDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { isAuthenticated } = useAuthStore();
  const [event, setEvent] = useState(null);
  const [loading, setLoading] = useState(true);

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

  const handleBookSeats = () => {
    if (!isAuthenticated) {
      toast.error("Please login to book seats");
      navigate("/login");
      return;
    }
    navigate(`/events/${id}/seats`);
  };

  const formatDate = (date) => {
    return new Date(date).toLocaleDateString("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  };

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
          onClick={() => navigate("/")}
          className="inline-flex items-center space-x-2 text-sm font-medium text-stone-600 hover:text-stone-900 mb-6 transition-colors"
        >
          <ArrowLeft size={20} />
          <span>Back to Events</span>
        </button>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Event Image */}
          <div>
            <img
              src={event.posterImage}
              alt={event.title}
              className="w-full h-96 object-cover rounded-xl shadow-md border border-stone-200"
            />
          </div>

          {/* Event Details */}
          <div className="bg-white rounded-xl shadow-sm p-8 border border-stone-200">
            <span className="inline-block px-3 py-1 bg-stone-100 text-stone-900 rounded-full text-xs font-medium uppercase mb-4">
              {event.category}
            </span>

            <h1 className="text-4xl font-bold text-stone-900 mb-4">
              {event.title}
            </h1>

            <p className="text-stone-600 mb-6 text-lg">{event.description}</p>

            <div className="space-y-4 mb-6">
              <div className="flex items-center">
                <Calendar size={24} className="mr-3 text-stone-500" />
                <div>
                  <p className="font-semibold text-stone-900 text-sm">
                    Date & Time
                  </p>
                  <p className="text-stone-600">
                    {formatDate(event.date)} at {event.time}
                  </p>
                </div>
              </div>

              <div className="flex items-center">
                <MapPin size={24} className="mr-3 text-stone-500" />
                <div>
                  <p className="font-semibold text-stone-900 text-sm">
                    Location
                  </p>
                  <p className="text-stone-600">{event.location}</p>
                </div>
              </div>

              <div className="flex items-center">
                <span className="text-3xl mr-3 text-stone-500">₹</span>
                <div>
                  <p className="font-semibold text-stone-900 text-sm">
                    Price per Seat
                  </p>
                  <p className="text-2xl font-bold text-stone-900">
                    {event.pricePerSeat}
                  </p>
                </div>
              </div>

              <div className="flex items-center">
                <Users size={24} className="mr-3 text-stone-500" />
                <div>
                  <p className="font-semibold text-stone-900 text-sm">
                    Availability
                  </p>
                  <p className="text-stone-600">
                    {event.availableSeats} of {event.totalSeats} seats available
                  </p>
                </div>
              </div>
            </div>

            <button
              onClick={handleBookSeats}
              disabled={event.availableSeats === 0}
              className="btn-primary w-full py-4 text-lg"
            >
              {event.availableSeats > 0 ? "Book Seats" : "Sold Out"}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default EventDetails;
