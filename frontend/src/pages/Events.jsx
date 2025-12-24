import { useState, useEffect } from "react";
import { Search, Calendar, Filter } from "lucide-react";
import EventCard from "../components/EventCard";
import api from "../api/axios";
import { toast } from "react-toastify";

const Events = () => {
  const [events, setEvents] = useState([]);
  const [filteredEvents, setFilteredEvents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [categoryFilter, setCategoryFilter] = useState("all");

  useEffect(() => {
    fetchEvents();
  }, []);

  useEffect(() => {
    filterEvents();
  }, [searchTerm, categoryFilter, events]);

  const fetchEvents = async () => {
    try {
      const response = await api.get("/events");
      setEvents(response.data);
      setFilteredEvents(response.data);
      setLoading(false);
    } catch (error) {
      console.error("Error fetching events:", error);
      toast.error("Failed to load events");
      setLoading(false);
    }
  };

  const filterEvents = () => {
    let filtered = events;

    // Filter by search term
    if (searchTerm) {
      filtered = filtered.filter(
        (event) =>
          event.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
          event.location.toLowerCase().includes(searchTerm.toLowerCase()) ||
          event.description.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    // Filter by category
    if (categoryFilter !== "all") {
      filtered = filtered.filter((event) => event.category === categoryFilter);
    }

    setFilteredEvents(filtered);
  };

  if (loading) {
    return (
      <div className="flex flex-col justify-center items-center min-h-screen bg-stone-50">
        <div className="animate-spin rounded-full h-16 w-16 border-t-2 border-b-2 border-stone-900 mb-4"></div>
        <p className="text-stone-600 font-medium">Loading events...</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-stone-50">
      {/* Page Header */}
      <div className="bg-gradient-to-r from-stone-900 to-stone-800 py-16">
        <div className="container mx-auto px-4">
          <div className="max-w-3xl">
            <h1 className="text-5xl font-bold text-white mb-4">
              Browse All Events
            </h1>
            <p className="text-stone-300 text-lg">
              Discover and book tickets for amazing events happening near you
            </p>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 py-12">
        {/* Search and Filters */}
        <div className="mb-10 bg-white rounded-xl shadow-sm p-6 border border-stone-200">
          <div className="flex flex-col lg:flex-row gap-4">
            {/* Search */}
            <div className="flex-1 relative">
              <Search
                className="absolute left-4 top-1/2 transform -translate-y-1/2 text-stone-400"
                size={20}
              />
              <input
                type="text"
                placeholder="Search events by name, location, or description..."
                className="w-full px-12 py-3 border border-stone-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-stone-400 focus:border-transparent text-stone-900"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>

            {/* Category filter */}
            <div className="relative lg:w-64">
              <Filter
                className="absolute left-4 top-1/2 transform -translate-y-1/2 text-stone-400"
                size={20}
              />
              <select
                className="w-full px-12 py-3 border border-stone-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-stone-400 focus:border-transparent text-stone-900 cursor-pointer bg-white"
                value={categoryFilter}
                onChange={(e) => setCategoryFilter(e.target.value)}
              >
                <option value="all">All Categories</option>
                <option value="concert">Concert</option>
                <option value="sports">Sports</option>
                <option value="theater">Theater</option>
                <option value="conference">Conference</option>
                <option value="other">Other</option>
              </select>
            </div>
          </div>

          {/* Active filters display */}
          {(searchTerm || categoryFilter !== "all") && (
            <div className="mt-4 flex items-center gap-2 flex-wrap">
              <span className="text-sm text-stone-600">Active filters:</span>
              {searchTerm && (
                <span className="px-3 py-1 bg-stone-100 text-stone-700 rounded-full text-sm flex items-center gap-2">
                  Search: "{searchTerm}"
                  <button
                    onClick={() => setSearchTerm("")}
                    className="hover:text-stone-900"
                  >
                    ×
                  </button>
                </span>
              )}
              {categoryFilter !== "all" && (
                <span className="px-3 py-1 bg-stone-100 text-stone-700 rounded-full text-sm flex items-center gap-2">
                  Category:{" "}
                  {categoryFilter.charAt(0).toUpperCase() +
                    categoryFilter.slice(1)}
                  <button
                    onClick={() => setCategoryFilter("all")}
                    className="hover:text-stone-900"
                  >
                    ×
                  </button>
                </span>
              )}
              <button
                onClick={() => {
                  setSearchTerm("");
                  setCategoryFilter("all");
                }}
                className="text-sm text-stone-600 hover:text-stone-900 underline"
              >
                Clear all
              </button>
            </div>
          )}
        </div>

        {/* Results count */}
        <div className="mb-6">
          <p className="text-stone-600">
            Showing{" "}
            <span className="font-semibold text-stone-900">
              {filteredEvents.length}
            </span>{" "}
            of{" "}
            <span className="font-semibold text-stone-900">
              {events.length}
            </span>{" "}
            events
          </p>
        </div>

        {/* Events grid */}
        {filteredEvents.length === 0 ? (
          <div className="text-center py-20 bg-white rounded-2xl shadow-sm border border-stone-200">
            <Calendar size={64} className="mx-auto text-stone-300 mb-4" />
            <p className="text-stone-900 text-xl font-semibold mb-2">
              No events found
            </p>
            <p className="text-stone-500 mb-6">
              Try adjusting your search or filters
            </p>
            <button
              onClick={() => {
                setSearchTerm("");
                setCategoryFilter("all");
              }}
              className="btn-primary"
            >
              Clear Filters
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredEvents.map((event) => (
              <EventCard key={event._id} event={event} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default Events;
