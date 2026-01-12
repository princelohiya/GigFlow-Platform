import React, { useState } from "react";
import newRequest from "../utils/newRequest";
import { useNavigate, Link } from "react-router-dom";

const Register = () => {
  const [user, setUser] = useState({
    username: "",
    email: "",
    password: "",
  });
  const [error, setError] = useState(null);

  const navigate = useNavigate();

  const handleChange = (e) => {
    setUser((prev) => {
      return { ...prev, [e.target.name]: e.target.value };
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null); // Clear previous errors
    try {
      await newRequest.post("/auth/register", user);
      navigate("/login");
    } catch (err) {
      setError(err.response?.data || "Something went wrong!");
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-100">
      <form
        onSubmit={handleSubmit}
        className="flex flex-col gap-6 p-8 bg-white rounded-lg shadow-xl w-full max-w-md"
      >
        <h1 className="text-3xl font-bold text-gray-800">Create an Account</h1>

        {/* Username */}
        <div className="flex flex-col gap-2">
          <label className="text-sm font-semibold text-gray-600">
            Username
          </label>
          <input
            name="username"
            type="text"
            placeholder="johndoe"
            className="p-3 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-green-500 transition-all"
            onChange={handleChange}
            required
          />
        </div>

        {/* Email */}
        <div className="flex flex-col gap-2">
          <label className="text-sm font-semibold text-gray-600">Email</label>
          <input
            name="email"
            type="email"
            placeholder="email@example.com"
            className="p-3 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-green-500 transition-all"
            onChange={handleChange}
            required
          />
        </div>

        {/* Password */}
        <div className="flex flex-col gap-2">
          <label className="text-sm font-semibold text-gray-600">
            Password
          </label>
          <input
            name="password"
            type="password"
            placeholder="••••••••"
            className="p-3 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-green-500 transition-all"
            onChange={handleChange}
            required
          />
        </div>

        {/* Action Buttons */}
        <button
          type="submit"
          className="mt-2 bg-green-500 hover:bg-green-600 text-white font-bold py-3 rounded transition-colors duration-200"
        >
          Register
        </button>

        {error && (
          <span className="text-red-500 text-sm font-medium text-center">
            {error}
          </span>
        )}

        <div className="text-center text-gray-500 text-sm">
          Already have an account?{" "}
          <Link
            to="/login"
            className="text-green-600 font-semibold hover:underline"
          >
            Login
          </Link>
        </div>
      </form>
    </div>
  );
};

export default Register;
