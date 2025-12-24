import { useEffect, useState } from "react";
import {
  Ticket,
  Calendar,
  MapPin,
  User,
  DollarSign,
  Search,
  Filter,
} from "lucide-react";
import { toast } from "react-toastify";
import axios from "../../api/axios";

const AdminBookings = () => {
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");

  useEffect(() => {
    fetchAllBookings();
  }, []);

  const fetchAllBookings = async () => {
    try {
      const response = await axios.get("/bookings");
      setBookings(response.data);
    } catch (error) {
      toast.error("Failed to fetch bookings");
    } finally {
      setLoading(false);
    }
  };

  const filteredBookings = bookings.filter((booking) => {
    const matchesSearch =
      booking.eventId?.title
        ?.toLowerCase()
        .includes(searchTerm.toLowerCase()) ||
      booking.userId?.name?.toLowerCase().includes(searchTerm.toLowerCase());

    const matchesStatus =
      statusFilter === "all" || booking.status === statusFilter;

    return matchesSearch && matchesStatus;
  });

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <div className="animate-spin rounded-full h-16 w-16 border-t-4 border-b-4 border-primary-600"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900">
      <div className="container mx-auto px-4 py-8">
        <div className="mb-8">
          <h1 className="text-5xl font-black gradient-text mb-2">
            All Bookings
          </h1>
          <p className="text-gray-400 text-lg">
            Monitor and manage all customer bookings
          </p>
        </div>

        {/* Filters */}
        <div className="mb-8 bg-white rounded-2xl shadow-lg p-6 border border-gray-100">
          <div className="flex flex-col md:flex-row gap-4">
            <div className="flex-1 relative">
              <Search
                className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400"
                size={20}
              />
              <input
                type="text"
                placeholder="Search by event or user name..."
                className="w-full pl-12 pr-4 py-3 border-2 border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent transition-all"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
            <select
              className="md:w-56 px-4 py-3 border-2 border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent transition-all font-medium text-gray-700"
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
            >
              <option value="all">All Status</option>
              <option value="confirmed">Confirmed</option>
              <option value="pending">Pending</option>
              <option value="cancelled">Cancelled</option>
            </select>
          </div>
        </div>

        {/* Summary Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <div className="bg-white rounded-xl shadow-lg p-6 border-l-4 border-green-500">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-500 text-sm font-medium mb-1">
                  Total Bookings
                </p>
                <h3 className="text-3xl font-bold text-gray-800">
                  {bookings.length}
                </h3>
              </div>
              <div className="p-4 bg-green-50 rounded-full">
                <Ticket size={32} className="text-green-500" />
              </div>
            </div>
          </div>

          <div className="bg-white rounded-xl shadow-lg p-6 border-l-4 border-blue-500">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-500 text-sm font-medium mb-1">
                  Confirmed
                </p>
                <h3 className="text-3xl font-bold text-gray-800">
                  {bookings.filter((b) => b.status === "confirmed").length}
                </h3>
              </div>
              <div className="p-4 bg-blue-50 rounded-full">
                <Ticket size={32} className="text-blue-500" />
              </div>
            </div>
          </div>

          <div className="bg-white rounded-xl shadow-lg p-6 border-l-4 border-purple-500">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-500 text-sm font-medium mb-1">
                  Total Revenue
                </p>
                <h3 className="text-3xl font-bold text-gray-800">
                  $
                  {bookings
                    .reduce((sum, b) => sum + (b.totalAmount || 0), 0)
                    .toFixed(2)}
                </h3>
              </div>
              <div className="p-4 bg-purple-50 rounded-full">
                <DollarSign size={32} className="text-purple-500" />
              </div>
            </div>
          </div>
        </div>

        {/* Bookings List */}
        <div className="bg-white rounded-xl shadow-lg overflow-hidden">
          {filteredBookings.length === 0 ? (
            <div className="text-center py-16">
              <Ticket size={64} className="mx-auto text-gray-300 mb-4" />
              <p className="text-gray-500 text-xl font-medium">
                No bookings found
              </p>
              <p className="text-gray-400 mt-2">Try adjusting your filters</p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-gradient-to-r from-primary-600 to-primary-700 text-white">
                  <tr>
                    <th className="px-6 py-4 text-left text-xs font-semibold uppercase">
                      Event
                    </th>
                    <th className="px-6 py-4 text-left text-xs font-semibold uppercase">
                      User
                    </th>
                    <th className="px-6 py-4 text-left text-xs font-semibold uppercase">
                      Date
                    </th>
                    <th className="px-6 py-4 text-left text-xs font-semibold uppercase">
                      Seats
                    </th>
                    <th className="px-6 py-4 text-left text-xs font-semibold uppercase">
                      Total Price
                    </th>
                    <th className="px-6 py-4 text-left text-xs font-semibold uppercase">
                      Status
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200">
                  {filteredBookings.map((booking) => (
                    <tr
                      key={booking._id}
                      className="hover:bg-gray-50 transition-colors"
                    >
                      <td className="px-6 py-4">
                        <div className="flex items-center space-x-3">
                          <div className="p-2 bg-primary-100 rounded-lg">
                            <Calendar size={20} className="text-primary-600" />
                          </div>
                          <div>
                            <div className="font-semibold text-gray-800">
                              {booking.eventId?.title || "N/A"}
                            </div>
                            <div className="text-sm text-gray-500 flex items-center">
                              <MapPin size={14} className="mr-1" />
                              {booking.eventId?.location || "N/A"}
                            </div>
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex items-center space-x-2">
                          <User size={18} className="text-gray-400" />
                          <span className="text-gray-700">
                            {booking.userId?.name || "N/A"}
                          </span>
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <div className="text-sm text-gray-600">
                          {new Date(booking.bookingTime).toLocaleDateString()}
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex flex-wrap gap-1">
                          {booking.selectedSeats
                            ?.slice(0, 3)
                            .map((seat, idx) => (
                              <span
                                key={idx}
                                className="bg-blue-100 text-blue-800 text-xs px-2 py-1 rounded-full font-medium"
                              >
                                {seat}
                              </span>
                            ))}
                          {booking.selectedSeats?.length > 3 && (
                            <span className="bg-gray-100 text-gray-600 text-xs px-2 py-1 rounded-full font-medium">
                              +{booking.selectedSeats.length - 3}
                            </span>
                          )}
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex items-center text-gray-800 font-bold">
                          <DollarSign size={16} className="text-green-600" />
                          {booking.totalAmount?.toFixed(2) || "0.00"}
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <span
                          className={`px-3 py-1 rounded-full text-xs font-semibold ${
                            booking.status === "confirmed"
                              ? "bg-green-100 text-green-800"
                              : booking.status === "pending"
                              ? "bg-yellow-100 text-yellow-800"
                              : "bg-red-100 text-red-800"
                          }`}
                        >
                          {booking.status}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default AdminBookings;
