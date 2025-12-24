import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import {
  Search,
  Calendar,
  MapPin,
  Sparkles,
  TrendingUp,
  Users,
  Star,
  ArrowRight,
  Ticket,
} from "lucide-react";
import EventCard from "../components/EventCard";
import api from "../api/axios";
import { toast } from "react-toastify";

const Home = () => {
  const navigate = useNavigate();
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");

  useEffect(() => {
    fetchEvents();
  }, []);

  const fetchEvents = async () => {
    try {
      const response = await api.get("/events");
      setEvents(response.data);
      setLoading(false);
    } catch (error) {
      console.error("Error fetching events:", error);
      toast.error("Failed to load events");
      setLoading(false);
    }
  };

  const handleSearch = (e) => {
    e.preventDefault();
    if (searchTerm.trim()) {
      navigate(`/events?search=${encodeURIComponent(searchTerm)}`);
    } else {
      navigate("/events");
    }
  };

  if (loading) {
    return (
      <div className="flex flex-col justify-center items-center min-h-screen bg-stone-50">
        <div className="animate-spin rounded-full h-16 w-16 border-t-2 border-b-2 border-stone-900 mb-4"></div>
        <p className="text-stone-600 font-medium">Loading events...</p>
      </div>
    );
  }

  const featuredEvents = events.slice(0, 6);

  return (
    <div className="min-h-screen bg-gradient-to-b from-stone-50 to-white">
      {/* Hero Section */}
      <div className="relative overflow-hidden bg-gradient-to-br from-stone-900 via-stone-800 to-stone-900">
        <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjAiIGhlaWdodD0iNjAiIHZpZXdCb3g9IjAgMCA2MCA2MCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48ZyBmaWxsPSJub25lIiBmaWxsLXJ1bGU9ImV2ZW5vZGQiPjxnIGZpbGw9IiNmZmYiIGZpbGwtb3BhY2l0eT0iMC4wNSI+PHBhdGggZD0iTTM2IDE2YzAgMi4yMS0xLjc5IDQtNCA0cy00LTEuNzktNC00IDEuNzktNCA0LTQgNCAxLjc5IDQgNHptLTE2IDBjMCAyLjIxLTEuNzkgNC00IDRzLTQtMS43OS00LTQgMS43OS00IDQtNCA0IDEuNzkgNCA0eiIvPjwvZz48L2c+PC9zdmc+')] opacity-40"></div>
        <div className="container mx-auto px-4 py-20 md:py-28 relative z-10">
          <div className="max-w-4xl mx-auto text-center">
            <div className="inline-flex items-center space-x-2 bg-white/10 backdrop-blur-sm px-4 py-2 rounded-full mb-6">
              <Sparkles className="text-yellow-400" size={20} />
              <span className="text-white text-sm font-medium">
                Discover Amazing Events
              </span>
            </div>
            <h1 className="text-5xl md:text-7xl font-bold text-white mb-6 leading-tight">
              Book Your Next
              <span className="block bg-gradient-to-r from-yellow-400 to-orange-500 bg-clip-text text-transparent">
                Unforgettable Experience
              </span>
            </h1>
            <p className="text-xl text-stone-300 mb-10 max-w-2xl mx-auto">
              From concerts to conferences, find and book tickets to the world's
              best events all in one place.
            </p>

            {/* Hero Search */}
            <form
              onSubmit={handleSearch}
              className="max-w-2xl mx-auto bg-white rounded-2xl shadow-2xl p-2 flex flex-col md:flex-row gap-2"
            >
              <div className="flex-1 relative">
                <Search
                  className="absolute left-4 top-1/2 transform -translate-y-1/2 text-stone-400"
                  size={20}
                />
                <input
                  type="text"
                  placeholder="Search for events, artists, venues..."
                  className="w-full px-12 py-4 rounded-xl border-0 focus:outline-none focus:ring-2 focus:ring-stone-300 text-stone-900"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
              </div>
              <button
                type="submit"
                className="bg-stone-900 text-white px-8 py-4 rounded-xl hover:bg-stone-800 transition-colors font-semibold flex items-center justify-center space-x-2"
              >
                <Search size={20} />
                <span>Search</span>
              </button>
            </form>

            {/* Stats */}
            <div className="grid grid-cols-3 gap-8 mt-16 max-w-3xl mx-auto">
              <div className="text-center">
                <div className="text-4xl font-bold text-white mb-2">
                  {events.length}+
                </div>
                <div className="text-stone-400">Events</div>
              </div>
              <div className="text-center">
                <div className="text-4xl font-bold text-white mb-2">50K+</div>
                <div className="text-stone-400">Happy Customers</div>
              </div>
              <div className="text-center">
                <div className="text-4xl font-bold text-white mb-2">100+</div>
                <div className="text-stone-400">Venues</div>
              </div>
            </div>
          </div>
        </div>
        <div className="absolute bottom-0 left-0 right-0 h-20 bg-gradient-to-t from-stone-50 to-transparent"></div>
      </div>

      {/* Features Section */}
      <div className="container mx-auto px-4 py-20">
        <div className="text-center mb-16">
          <h2 className="text-4xl font-bold text-stone-900 mb-4">
            Why Choose EventBook?
          </h2>
          <p className="text-stone-600 text-lg max-w-2xl mx-auto">
            The easiest way to discover and book tickets for amazing events
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div className="bg-white rounded-2xl p-8 shadow-sm border border-stone-200 hover:shadow-lg transition-shadow">
            <div className="w-14 h-14 bg-stone-900 rounded-xl flex items-center justify-center mb-6">
              <Ticket className="text-white" size={28} />
            </div>
            <h3 className="text-xl font-bold text-stone-900 mb-3">
              Easy Booking
            </h3>
            <p className="text-stone-600">
              Book tickets in seconds with our streamlined checkout process. No
              hassle, just fun.
            </p>
          </div>

          <div className="bg-white rounded-2xl p-8 shadow-sm border border-stone-200 hover:shadow-lg transition-shadow">
            <div className="w-14 h-14 bg-stone-900 rounded-xl flex items-center justify-center mb-6">
              <Star className="text-white" size={28} />
            </div>
            <h3 className="text-xl font-bold text-stone-900 mb-3">
              Best Events
            </h3>
            <p className="text-stone-600">
              Curated selection of the most exciting events from concerts to
              conferences.
            </p>
          </div>

          <div className="bg-white rounded-2xl p-8 shadow-sm border border-stone-200 hover:shadow-lg transition-shadow">
            <div className="w-14 h-14 bg-stone-900 rounded-xl flex items-center justify-center mb-6">
              <Users className="text-white" size={28} />
            </div>
            <h3 className="text-xl font-bold text-stone-900 mb-3">
              Trusted Platform
            </h3>
            <p className="text-stone-600">
              Join thousands of happy customers who trust us for their event
              ticketing needs.
            </p>
          </div>
        </div>
      </div>

      {/* Featured Events Section */}
      {featuredEvents.length > 0 && (
        <div className="bg-white py-20">
          <div className="container mx-auto px-4">
            <div className="flex items-center justify-between mb-12">
              <div>
                <h2 className="text-4xl font-bold text-stone-900 mb-3 flex items-center">
                  <Star className="text-yellow-500 mr-3" size={36} />
                  Featured Events
                </h2>
                <p className="text-stone-600 text-lg">
                  Don't miss out on these trending events
                </p>
              </div>
              <button
                onClick={() => navigate("/events")}
                className="hidden md:flex items-center space-x-2 text-stone-700 hover:text-stone-900 font-semibold"
              >
                <span>View All</span>
                <ArrowRight size={20} />
              </button>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {featuredEvents.map((event) => (
                <EventCard key={event._id} event={event} />
              ))}
            </div>
            <div className="text-center mt-10">
              <button
                onClick={() => navigate("/events")}
                className="btn-primary inline-flex items-center space-x-2"
              >
                <span>Explore All Events</span>
                <ArrowRight size={20} />
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Categories Section */}
      <div className="container mx-auto px-4 py-20">
        <div className="text-center mb-12">
          <h2 className="text-4xl font-bold text-stone-900 mb-4">
            Browse by Category
          </h2>
          <p className="text-stone-600 text-lg">
            Find events that match your interests
          </p>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
          {[
            {
              name: "Concert",
              emoji: "🎵",
              color: "from-purple-500 to-purple-600",
            },
            {
              name: "Sports",
              emoji: "⚽",
              color: "from-green-500 to-green-600",
            },
            {
              name: "Theater",
              emoji: "🎭",
              color: "from-orange-500 to-orange-600",
            },
            {
              name: "Conference",
              emoji: "💼",
              color: "from-blue-500 to-blue-600",
            },
            { name: "Other", emoji: "🎪", color: "from-pink-500 to-pink-600" },
          ].map((category) => (
            <button
              key={category.name}
              onClick={() =>
                navigate(`/events?category=${category.name.toLowerCase()}`)
              }
              className={`bg-gradient-to-br ${category.color} rounded-2xl p-8 text-center hover:scale-105 transition-transform shadow-lg`}
            >
              <div className="text-5xl mb-3">{category.emoji}</div>
              <div className="text-white font-bold text-lg">
                {category.name}
              </div>
            </button>
          ))}
        </div>
      </div>

      {/* CTA Section */}
      <div className="bg-gradient-to-r from-stone-900 to-stone-800 py-20">
        <div className="container mx-auto px-4 text-center">
          <Calendar className="mx-auto text-white mb-6" size={64} />
          <h2 className="text-4xl font-bold text-white mb-4">
            Ready to Experience Something Amazing?
          </h2>
          <p className="text-stone-300 text-lg mb-8 max-w-2xl mx-auto">
            Join thousands of event-goers and start discovering incredible
            experiences today.
          </p>
          <button
            onClick={() => navigate("/events")}
            className="bg-white text-stone-900 px-8 py-4 rounded-xl font-semibold hover:bg-stone-100 transition-colors inline-flex items-center space-x-2"
          >
            <Ticket size={20} />
            <span>Browse All Events</span>
            <ArrowRight size={20} />
          </button>
        </div>
      </div>
    </div>
  );
};

export default Home;
