import { Link, useNavigate } from "react-router-dom";
import { Ticket, User, LogOut, Calendar, LayoutDashboard } from "lucide-react";
import useAuthStore from "../store/authStore";

const Navbar = () => {
  const { user, isAuthenticated, logout } = useAuthStore();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  const isAdmin = user?.role === "admin";

  return (
    <nav className="bg-white border-b border-stone-200 sticky top-0 z-50 shadow-sm">
      <div className="container mx-auto px-4">
        <div className="flex justify-between items-center h-16">
          <Link to="/" className="group">
            <span className="text-stone-900 font-bold text-2xl tracking-tight hover:text-stone-700 transition-colors">
              TicketHub
            </span>
          </Link>

          <div className="flex items-center space-x-6">
            <Link
              to="/"
              className="flex items-center space-x-2 text-stone-600 hover:text-stone-900 transition-colors font-medium"
            >
              <Calendar size={18} />
              <span>Home</span>
            </Link>

            <Link
              to="/events"
              className="flex items-center space-x-2 text-stone-600 hover:text-stone-900 transition-colors font-medium"
            >
              <Ticket size={18} />
              <span>Events</span>
            </Link>

            {isAuthenticated ? (
              <>
                <Link
                  to="/my-bookings"
                  className="flex items-center space-x-2 text-stone-600 hover:text-stone-900 transition-colors font-medium"
                >
                  <Ticket size={18} />
                  <span>My Bookings</span>
                </Link>

                {isAdmin && (
                  <Link
                    to="/admin/dashboard"
                    className="flex items-center space-x-2 bg-stone-900 text-white px-4 py-2 rounded-lg hover:bg-stone-800 transition-colors font-medium shadow-sm"
                  >
                    <LayoutDashboard size={18} />
                    <span>Admin</span>
                  </Link>
                )}

                <div className="flex items-center space-x-4 border-l border-stone-200 pl-6">
                  <div className="flex items-center space-x-2 text-stone-700">
                    <div className="w-8 h-8 bg-stone-900 rounded-full flex items-center justify-center">
                      <User size={16} className="text-white" />
                    </div>
                    <span className="font-medium">{user?.name}</span>
                    {isAdmin && (
                      <span className="text-xs bg-stone-900 text-white px-2 py-0.5 rounded font-medium">
                        Admin
                      </span>
                    )}
                  </div>
                  <button
                    onClick={handleLogout}
                    className="flex items-center space-x-2 text-stone-500 hover:text-red-500 transition-colors font-medium"
                  >
                    <LogOut size={18} />
                    <span>Logout</span>
                  </button>
                </div>
              </>
            ) : (
              <>
                <Link
                  to="/login"
                  className="text-stone-600 hover:text-stone-900 transition-colors font-medium"
                >
                  Login
                </Link>
                <Link to="/register" className="btn-primary">
                  Register
                </Link>
              </>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
