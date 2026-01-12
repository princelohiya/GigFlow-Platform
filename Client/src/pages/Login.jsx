import React, { useState } from "react";
import newRequest from "../utils/newRequest";
import { useNavigate, Link } from "react-router-dom";

export const Login = () => {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState(null);

  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const res = await newRequest.post("/auth/login", {
        email: username,
        password,
      });
      localStorage.setItem("currentUser", JSON.stringify(res.data));
      navigate("/");
      alert("Login Successful");
    } catch (err) {
      setError(err.response?.data || "Something went wrong");
    }
  };

  return (
    <div className="flex items-center justify-center h-screen bg-gray-100">
      <form
        onSubmit={handleSubmit}
        className="flex flex-col gap-5 p-10 bg-white rounded-lg shadow-xl w-96"
      >
        <h1 className="text-2xl font-bold text-gray-700 mb-2">Sign in</h1>

        <div className="flex flex-col gap-2">
          <label className="text-gray-600 text-sm font-medium">Username</label>
          <input
            name="username"
            type="text"
            placeholder="johndoe"
            className="p-3 border border-gray-300 rounded focus:outline-none focus:border-green-500"
            onChange={(e) => setUsername(e.target.value)}
          />
        </div>

        <div className="flex flex-col gap-2">
          <label className="text-gray-600 text-sm font-medium">Password</label>
          <input
            name="password"
            type="password"
            className="p-3 border border-gray-300 rounded focus:outline-none focus:border-green-500"
            onChange={(e) => setPassword(e.target.value)}
          />
        </div>

        <button
          type="submit"
          className="bg-green-500 hover:bg-green-600 text-white font-bold p-3 rounded cursor-pointer transition-colors"
        >
          Login
        </button>

        {error && (
          <span className="text-red-500 text-sm text-center">{error}</span>
        )}

        <p className="text-sm text-gray-500 text-center">
          Don't have an account?{" "}
          <Link to="/register" className="text-green-500 hover:underline">
            Register
          </Link>
        </p>
      </form>
    </div>
  );
};

export default Login;
