import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import newRequest from "../utils/newRequest";
// 1. Import Socket Client
import { io } from "socket.io-client";

const Navbar = () => {
  const [open, setOpen] = useState(false);
  const navigate = useNavigate();
  const currentUser = JSON.parse(localStorage.getItem("currentUser"));

  // 2. Add Socket State
  const [socket, setSocket] = useState(null);
  const [notification, setNotification] = useState(null);

  // 3. Socket Logic: Connect & Listen
  useEffect(() => {
    if (currentUser) {
      // Connect to the Backend (ensure port matches your server, usually 3000)
      const url = "https://gigflow-api.onrender.com/api/";
      // const url = "http://localhost:3000";

      const newSocket = io(url);
      setSocket(newSocket);

      // Tell Backend "I am here"
      newSocket.emit("addUser", currentUser._id);

      // Listen for "You got hired!" messages
      newSocket.on("getNotification", (data) => {
        setNotification(data.message);
        // Hide alert after 5 seconds
        setTimeout(() => setNotification(null), 5000);
      });

      return () => newSocket.disconnect();
    }
  }, [currentUser?._id]);

  const handleLogout = async () => {
    try {
      await newRequest.post("/auth/logout");
      localStorage.removeItem("currentUser");
      // Disconnect socket manually on logout
      if (socket) socket.disconnect();
      navigate("/");
    } catch (err) {
      console.log(err);
    }
  };

  return (
    <div className="flex flex-col bg-white sticky top-0 z-50 transition-all duration-300 border-b border-gray-300">
      {/* 4. The Notification Banner (Only shows when message arrives) */}
      {notification && (
        <div className="bg-green-600 text-white text-center py-2 font-bold animate-pulse shadow-md">
          🔔 {notification}
        </div>
      )}

      <div className="max-w-7xl w-full mx-auto px-5 py-5 flex justify-between items-center">
        {/* LOGO */}
        <div className="font-bold text-3xl tracking-tighter cursor-pointer">
          <Link to="/">
            <span className="text-gray-900">Gig</span>
            <span className="text-green-500">Flow</span>
            <span className="text-green-500 text-4xl">.</span>
          </Link>
        </div>

        {/* LINKS */}
        <div className="flex items-center gap-6 font-medium text-gray-500">
          <Link to="/gigs" className=" hover:text-green-500 transition">
            Explore
          </Link>
          <Link to="/add" className="hidden sm:block hover:text-green-500">
            Add Gig
          </Link>

          {/* USER NOT LOGGED IN */}
          {!currentUser && (
            <>
              <Link to="/login" className="hover:text-green-500 transition">
                Sign in
              </Link>
              <Link to="/register">
                <button className="border border-green-500 text-green-500 px-5 py-2 rounded hover:bg-green-500 hover:text-white transition font-semibold">
                  Join
                </button>
              </Link>
            </>
          )}

          {/* USER LOGGED IN */}
          {currentUser && (
            <div
              className="relative flex items-center gap-3 cursor-pointer"
              onClick={() => setOpen(!open)}
            >
              <div className="w-8 h-8 rounded-full bg-gray-300 flex items-center justify-center text-gray-600 font-bold overflow-hidden">
                <img
                  src={
                    currentUser.img ||
                    "https://upload.wikimedia.org/wikipedia/commons/7/7c/Profile_avatar_placeholder_large.png?20150327203541"
                  }
                  alt=""
                  className="w-full h-full object-cover"
                />
              </div>
              <span className="font-bold text-gray-800">
                {currentUser?.username}
              </span>

              {/* DROPDOWN MENU */}
              {open && (
                <div className="absolute top-14 right-1 p-4 bg-white rounded-lg border border-gray-200 shadow-xl w-48 flex flex-col gap-3 text-gray-500 font-normal">
                  <Link to="/gigs" className=" hover:text-green-500 transition">
                    Explore
                  </Link>
                  <Link to="/add" className="hover:text-green-500">
                    Add New Gig
                  </Link>
                  <Link to="/messages" className="hover:text-green-500">
                    Messages
                  </Link>
                  <hr className="border-gray-200" />
                  <span
                    className="cursor-pointer text-red-500 hover:text-red-600 font-medium"
                    onClick={handleLogout}
                  >
                    Logout
                  </span>
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Navbar;
