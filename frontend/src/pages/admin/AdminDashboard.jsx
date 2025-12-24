import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import {
  Calendar,
  Users,
  Ticket,
  DollarSign,
  TrendingUp,
  Activity,
} from "lucide-react";
import axios from "../../api/axios";

const AdminDashboard = () => {
  const [stats, setStats] = useState({
    totalEvents: 0,
    totalBookings: 0,
    totalRevenue: 0,
    activeEvents: 0,
    recentBookings: [],
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchDashboardStats();
  }, []);

  const fetchDashboardStats = async () => {
    try {
      const [eventsRes, bookingsRes] = await Promise.all([
        axios.get("/events"),
        axios.get("/bookings"),
      ]);

      const events = eventsRes.data;
      const bookings = bookingsRes.data;

      const now = new Date();
      const activeEvents = events.filter(
        (event) => new Date(event.date) >= now
      );
      const totalRevenue = bookings.reduce(
        (sum, booking) => sum + booking.totalAmount,
        0
      );

      setStats({
        totalEvents: events.length,
        totalBookings: bookings.length,
        totalRevenue: totalRevenue,
        activeEvents: activeEvents.length,
        recentBookings: bookings.slice(0, 5),
      });
    } catch (error) {
      console.error("Failed to fetch dashboard stats:", error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <div className="animate-spin rounded-full h-16 w-16 border-t-4 border-b-4 border-primary-600"></div>
      </div>
    );
  }

  const StatCard = ({ icon: Icon, title, value, color, trend }) => (
    <div
      className="glass-effect rounded-2xl shadow-2xl p-6 border-l-4 hover:scale-105 transition-all duration-300"
      style={{ borderColor: color }}
    >
      <div className="flex items-center justify-between">
        <div>
          <p className="text-gray-400 text-sm font-medium mb-1">{title}</p>
          <h3 className="text-4xl font-black text-gray-100">{value}</h3>
          {trend && (
            <div className="flex items-center mt-2 text-green-600 text-sm">
              <TrendingUp size={16} className="mr-1" />
              <span>{trend}</span>
            </div>
          )}
        </div>
        <div
          className="p-4 rounded-full"
          style={{ backgroundColor: `${color}15` }}
        >
          <Icon size={32} style={{ color }} />
        </div>
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900">
      <div className="container mx-auto px-4 py-8">
        <div className="mb-8">
          <h1 className="text-5xl font-black gradient-text mb-2">
            Admin Dashboard
          </h1>
          <p className="text-gray-400 text-lg">
            Overview of your event booking platform
          </p>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <StatCard
            icon={Calendar}
            title="Total Events"
            value={stats.totalEvents}
            color="#6366f1"
            trend="+12% this month"
          />
          <StatCard
            icon={Activity}
            title="Active Events"
            value={stats.activeEvents}
            color="#10b981"
          />
          <StatCard
            icon={Ticket}
            title="Total Bookings"
            value={stats.totalBookings}
            color="#f59e0b"
            trend="+23% this week"
          />
          <StatCard
            icon={DollarSign}
            title="Total Revenue"
            value={`₹${stats.totalRevenue.toFixed(2)}`}
            color="#ef4444"
            trend="+18% this month"
          />
        </div>

        {/* Quick Actions */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <Link
            to="/admin/events"
            className="bg-gradient-to-r from-primary-600 to-primary-700 text-white p-6 rounded-xl shadow-lg hover:shadow-xl transition-all transform hover:scale-105"
          >
            <Calendar size={32} className="mb-3" />
            <h3 className="text-xl font-bold mb-1">Manage Events</h3>
            <p className="text-primary-100">Create, edit, and delete events</p>
          </Link>

          <Link
            to="/admin/bookings"
            className="bg-gradient-to-r from-green-600 to-green-700 text-white p-6 rounded-xl shadow-lg hover:shadow-xl transition-all transform hover:scale-105"
          >
            <Ticket size={32} className="mb-3" />
            <h3 className="text-xl font-bold mb-1">View Bookings</h3>
            <p className="text-green-100">Monitor all customer bookings</p>
          </Link>

          <div className="bg-gradient-to-r from-purple-600 to-purple-700 text-white p-6 rounded-xl shadow-lg">
            <Users size={32} className="mb-3" />
            <h3 className="text-xl font-bold mb-1">User Analytics</h3>
            <p className="text-purple-100">Coming soon...</p>
          </div>
        </div>

        {/* Recent Bookings */}
        <div className="bg-white rounded-xl shadow-lg p-6">
          <h2 className="text-2xl font-bold text-gray-800 mb-4">
            Recent Bookings
          </h2>
          {stats.recentBookings.length === 0 ? (
            <p className="text-gray-500 text-center py-8">No bookings yet</p>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-gray-50 border-b-2 border-gray-200">
                  <tr>
                    <th className="px-4 py-3 text-left text-xs font-semibold text-gray-600 uppercase">
                      Event
                    </th>
                    <th className="px-4 py-3 text-left text-xs font-semibold text-gray-600 uppercase">
                      Seats
                    </th>
                    <th className="px-4 py-3 text-left text-xs font-semibold text-gray-600 uppercase">
                      Total Price
                    </th>
                    <th className="px-4 py-3 text-left text-xs font-semibold text-gray-600 uppercase">
                      Status
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200">
                  {stats.recentBookings.map((booking) => (
                    <tr
                      key={booking._id}
                      className="hover:bg-gray-50 transition-colors"
                    >
                      <td className="px-4 py-3 text-sm text-gray-800">
                        {booking.eventId?.title || "N/A"}
                      </td>
                      <td className="px-4 py-3 text-sm text-gray-600">
                        {booking.selectedSeats?.length || 0} seats
                      </td>
                      <td className="px-4 py-3 text-sm font-semibold text-gray-800">
                        ₹{booking.totalAmount?.toFixed(2) || "0.00"}
                      </td>
                      <td className="px-4 py-3">
                        <span
                          className={`px-3 py-1 rounded-full text-xs font-semibold ${
                            booking.status === "confirmed"
                              ? "bg-green-100 text-green-800"
                              : "bg-yellow-100 text-yellow-800"
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

export default AdminDashboard;
