import { useState, useContext, useRef, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { AuthContext } from "./../../Context/AuthContext";
import { FaSignOutAlt, FaUser, FaCog, FaBars, FaTimes } from "react-icons/fa";
import { HiHome } from "react-icons/hi";
import { BsChatSquareText } from "react-icons/bs";
import { useQuery } from "@tanstack/react-query";
import axios from "axios";

export default function Navbar() {
  const [isOpen, setIsOpen] = useState(false);
  const [dropdownOpen, setDropdownOpen] = useState(false);

  const { userLogin, setuserLogin } = useContext(AuthContext);
  const navigate = useNavigate();

  const dropdownRef = useRef<HTMLDivElement>(null);

  // Get unread notifications count
  const { data: unreadCountData } = useQuery({
    queryKey: ["unreadNotificationsCount"],
    queryFn: () =>
      axios.get(
        "https://route-posts.routemisr.com/notifications/unread-count",
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("userToken")}`,
          },
        },
      ),
    enabled: !!userLogin,
    refetchInterval: 60000,
  });

  // Read count from API response
  const responseData = unreadCountData?.data?.data;

  const notificationsCount =
    typeof responseData === "number"
      ? responseData
      : (responseData?.unreadCount ??
        responseData?.count ??
        unreadCountData?.data?.unreadCount ??
        unreadCountData?.data?.count ??
        0);

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target as Node)
      ) {
        setDropdownOpen(false);
      }
    }

    document.addEventListener("mousedown", handleClickOutside);

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  function handleLogout() {
    localStorage.removeItem("userToken");
    setuserLogin(null);
    setDropdownOpen(false);
    setIsOpen(false);
    navigate("/login");
  }

  // Notifications link used on desktop and mobile
  function NotificationsLink({ onClick }: { onClick?: () => void }) {
    return (
      <Link
        to="/notifications"
        onClick={onClick}
        className="flex items-center gap-2 px-5 py-2 rounded-full text-gray-600 hover:bg-gray-100 hover:text-blue-600 font-medium transition-colors"
      >
        <span className="relative">
          <BsChatSquareText className="text-sm" />

          {notificationsCount > 0 && (
            <span className="absolute -top-3 -right-3 min-w-5 h-5 px-1 flex items-center justify-center rounded-full bg-red-500 text-white text-[10px] font-bold">
              {notificationsCount > 99 ? "99+" : notificationsCount}
            </span>
          )}
        </span>
        Notifications
      </Link>
    );
  }

  return (
    <nav className="bg-white border-b border-blue-200 shadow-sm fixed top-0 left-0 w-full z-50">
      <div className="max-w-7xl mx-auto px-6 py-2 flex items-center justify-between">
        {/* Logo */}
        <Link to="/" className="flex items-center gap-2 group">
          <img
            src={`${import.meta.env.BASE_URL}route.png`}
            alt="Route Posts Logo"
            className="w-11 h-11 rounded-2xl object-cover transition-transform duration-300 group-hover:scale-105"
          />

          <span className="text-2xl font-bold tracking-tight text-gray-800">
            Route <span className="text-blue-900">Posts</span>
          </span>
        </Link>

        {/* Desktop Links */}
        {userLogin ? (
          <>
            <div className="hidden md:flex items-center gap-1 border border-blue-200 rounded-3xl p-1.5 shadow-sm bg-white">
              <Link
                to="/"
                className="flex items-center gap-2 px-5 py-2 rounded-full bg-blue-50 text-blue-600 font-medium transition-colors"
              >
                <HiHome className="text-lg" />
                Feed
              </Link>

              <Link
                to="/profile"
                className="flex items-center gap-2 px-5 py-2 rounded-full text-gray-600 hover:bg-gray-100 hover:text-blue-600 font-medium transition-colors"
              >
                <FaUser className="text-sm" />
                Profile
              </Link>

              <NotificationsLink />
            </div>

            {/* User Profile Dropdown */}
            <div
              className="hidden md:flex items-center gap-2 relative border border-gray-200 rounded-full px-4 py-2 hover:border-blue-300 transition-colors"
              ref={dropdownRef}
            >
              <button
                onClick={() => setDropdownOpen(!dropdownOpen)}
                className="flex items-center gap-2 cursor-pointer focus:outline-none rounded-full hover:bg-gray-50"
              >
                <div className="w-9 h-9 rounded-full bg-gray-200 overflow-hidden flex items-center justify-center font-bold text-gray-700">
                  <FaUser />
                </div>

                <span className="font-medium text-gray-800">aya</span>

                <FaBars className="text-gray-500 text-sm ml-1" />
              </button>

              {dropdownOpen && (
                <div className="absolute right-0 top-14 w-56 bg-white border border-gray-100 rounded-2xl shadow-lg py-2 z-50">
                  <Link
                    to="/profile"
                    onClick={() => setDropdownOpen(false)}
                    className="flex items-center gap-3 px-4 py-2.5 text-gray-700 hover:bg-gray-50 transition-colors"
                  >
                    <FaUser className="text-gray-500" />
                    Profile
                  </Link>

                  <Link
                    to="/settings"
                    onClick={() => setDropdownOpen(false)}
                    className="flex items-center gap-3 px-4 py-2.5 text-gray-700 hover:bg-gray-50 transition-colors"
                  >
                    <FaCog className="text-gray-500" />
                    Settings
                  </Link>

                  <div className="border-t border-gray-100 my-1" />

                  <button
                    onClick={handleLogout}
                    className="w-full flex items-center gap-3 px-4 py-2.5 text-red-500 hover:bg-red-50 transition-colors cursor-pointer text-left"
                  >
                    <FaSignOutAlt />
                    Logout
                  </button>
                </div>
              )}
            </div>
          </>
        ) : (
          <div className="hidden md:flex items-center gap-4">
            <Link
              to="/register"
              className="font-medium text-gray-700 hover:text-blue-600 transition-colors px-4 py-2"
            >
              Register
            </Link>

            <Link
              to="/login"
              className="bg-blue-700 cursor-pointer text-white px-5 py-2.5 rounded-xl hover:bg-blue-800 transition-colors"
            >
              Login
            </Link>
          </div>
        )}

        {/* Mobile Hamburger */}
        <button
          onClick={() => setIsOpen(!isOpen)}
          className="md:hidden text-2xl text-gray-700 focus:outline-none"
          aria-label="Toggle menu"
        >
          {isOpen ? <FaTimes /> : <FaBars />}
        </button>
      </div>

      {/* Mobile Menu */}
      {isOpen && (
        <div className="md:hidden border-t border-gray-100 px-6 py-4 bg-white">
          <div className="flex flex-col gap-3">
            {userLogin ? (
              <>
                <Link
                  to="/"
                  onClick={() => setIsOpen(false)}
                  className="flex items-center gap-3 py-2 text-gray-700 font-medium"
                >
                  <HiHome /> Feed
                </Link>

                <Link
                  to="/profile"
                  onClick={() => setIsOpen(false)}
                  className="flex items-center gap-3 py-2 text-gray-700 font-medium"
                >
                  <FaUser /> Profile
                </Link>

                <NotificationsLink onClick={() => setIsOpen(false)} />

                <Link
                  to="/settings"
                  onClick={() => setIsOpen(false)}
                  className="flex items-center gap-3 py-2 text-gray-700 font-medium"
                >
                  <FaCog /> Settings
                </Link>

                <div className="border-t border-gray-100 my-2" />

                <button
                  onClick={handleLogout}
                  className="flex items-center cursor-pointer justify-center gap-2 bg-red-500 text-white px-5 py-2.5 rounded-xl hover:bg-red-600 transition-colors"
                >
                  <FaSignOutAlt />
                  Logout
                </button>
              </>
            ) : (
              <>
                <Link
                  to="/register"
                  onClick={() => setIsOpen(false)}
                  className="py-2 text-gray-700 font-medium"
                >
                  Register
                </Link>

                <Link
                  to="/login"
                  onClick={() => setIsOpen(false)}
                  className="bg-blue-700 cursor-pointer text-white text-center px-5 py-2.5 rounded-xl"
                >
                  Login
                </Link>
              </>
            )}
          </div>
        </div>
      )}
    </nav>
  );
}
