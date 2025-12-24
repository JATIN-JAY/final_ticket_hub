import { useNavigate } from "react-router-dom";
import { Calendar, MapPin, DollarSign, Users } from "lucide-react";

const EventCard = ({ event }) => {
  const navigate = useNavigate();

  const formatDate = (date) => {
    return new Date(date).toLocaleDateString("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  };

  const availabilityPercent = (event.availableSeats / event.totalSeats) * 100;

  const getCategoryColor = (category) => {
    const colors = {
      concert: "bg-purple-600",
      sports: "bg-green-600",
      theater: "bg-orange-600",
      conference: "bg-blue-600",
      other: "bg-indigo-600",
    };
    return colors[category] || "bg-indigo-600";
  };

  return (
    <div
      className="bg-white rounded-xl overflow-hidden cursor-pointer transition-all duration-300 hover:shadow-xl border border-stone-200 group"
      onClick={() => navigate(`/events/${event._id}`)}
    >
      {/* Image/Header Section */}
      <div className="h-48 relative overflow-hidden">
        {event.posterImage ? (
          <img
            src={event.posterImage}
            alt={event.title}
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
          />
        ) : (
          <div
            className={`${getCategoryColor(event.category)} w-full h-full`}
          ></div>
        )}
        <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/30 to-transparent"></div>
        <div className="absolute inset-0 p-6 flex flex-col justify-between">
          <div className="flex items-center justify-between">
            <span className="px-3 py-1 rounded-full text-xs font-semibold bg-white/90 text-stone-900 backdrop-blur-sm uppercase tracking-wide">
              {event.category}
            </span>
            <span className="px-3 py-1 rounded-full text-xs font-semibold bg-white/90 text-stone-900 backdrop-blur-sm">
              {event.availableSeats > 0
                ? `${event.availableSeats} left`
                : "Sold Out"}
            </span>
          </div>
          <h3 className="text-2xl font-bold text-white line-clamp-2 drop-shadow-lg">
            {event.title}
          </h3>
        </div>
      </div>

      {/* Card Body */}
      <div className="p-6">
        <div className="space-y-3 mb-5">
          <p className="text-stone-600 text-sm line-clamp-2 leading-relaxed">
            {event.description}
          </p>

          <div className="flex items-center text-stone-700 text-sm">
            <Calendar size={16} className="mr-2 text-stone-500 flex-shrink-0" />
            <span>
              {formatDate(event.date)} at {event.time}
            </span>
          </div>

          <div className="flex items-center text-stone-700 text-sm">
            <MapPin size={16} className="mr-2 text-stone-500 flex-shrink-0" />
            <span className="line-clamp-1">{event.location}</span>
          </div>

          <div className="flex items-center justify-between pt-3 border-t border-stone-200">
            <div className="flex items-center text-stone-700">
              <span className="text-green-600 font-bold text-lg mr-1">₹</span>
              <span className="font-bold text-stone-900 text-lg">
                {event.pricePerSeat}
              </span>
              <span className="text-sm text-stone-500 ml-1">/ seat</span>
            </div>
            <div className="flex items-center text-stone-600 text-sm">
              <Users size={16} className="mr-1.5 text-stone-500" />
              <span>
                {event.availableSeats} / {event.totalSeats}
              </span>
            </div>
          </div>
        </div>

        {/* Progress bar */}
        <div className="mb-5">
          <div className="flex items-center justify-between text-xs text-stone-600 mb-1.5">
            <span className="font-medium">Availability</span>
            <span className="font-semibold">
              {availabilityPercent.toFixed(0)}%
            </span>
          </div>
          <div className="w-full bg-stone-200 rounded-full h-2 overflow-hidden">
            <div
              className="bg-stone-900 h-full rounded-full transition-all duration-500"
              style={{ width: `${availabilityPercent}%` }}
            ></div>
          </div>
        </div>

        <button
          className={`btn-primary w-full ${
            event.availableSeats === 0
              ? "!bg-stone-300 !text-stone-500 cursor-not-allowed"
              : ""
          }`}
          disabled={event.availableSeats === 0}
        >
          {event.availableSeats > 0 ? "Book Now" : "Sold Out"}
        </button>
      </div>
    </div>
  );
};

export default EventCard;
