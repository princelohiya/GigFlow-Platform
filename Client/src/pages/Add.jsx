import React, { useState } from "react";
import newRequest from "../utils/newRequest";
import { useNavigate } from "react-router-dom";

const Add = () => {
  const [state, setState] = useState({
    title: "",
    description: "",
    budget: 0,
    // If you add categories later to your schema, add them here
  });

  const [error, setError] = useState(null);
  const navigate = useNavigate();

  const handleChange = (e) => {
    setState((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      // Backend handles ownerId via the cookie, and status defaults to "open"
      await newRequest.post("/gigs", state);
      navigate("/gigs");
    } catch (err) {
      setError(err.response?.data || "Failed to post gig");
    }
  };

  return (
    <div className="flex justify-center py-10 px-5 bg-gray-100 min-h-screen">
      <div className="w-full max-w-2xl bg-white rounded-lg shadow-lg p-8">
        <h1 className="text-2xl font-bold text-gray-700 mb-6">
          Post a New Gig
        </h1>

        <form onSubmit={handleSubmit} className="flex flex-col gap-6">
          {/* Title */}
          <div className="flex flex-col gap-2">
            <label className="text-gray-600 font-medium">Job Title</label>
            <input
              type="text"
              name="title"
              placeholder="e.g. I need a logo design for my bakery"
              className="p-3 border border-gray-300 rounded focus:outline-none focus:border-green-500"
              onChange={handleChange}
              required
            />
          </div>

          {/* Budget */}
          <div className="flex flex-col gap-2">
            <label className="text-gray-600 font-medium">Budget ($)</label>
            <input
              type="number"
              name="budget"
              min="1"
              placeholder="100"
              className="p-3 border border-gray-300 rounded focus:outline-none focus:border-green-500"
              onChange={handleChange}
              required
            />
          </div>

          {/* Description */}
          <div className="flex flex-col gap-2">
            <label className="text-gray-600 font-medium">Description</label>
            <textarea
              name="description"
              cols="30"
              rows="10"
              placeholder="Describe your project details, requirements, and timeline..."
              className="p-3 border border-gray-300 rounded focus:outline-none focus:border-green-500 resize-none"
              onChange={handleChange}
              required
            ></textarea>
          </div>

          {/* Submit Button */}
          <button
            type="submit"
            className="bg-green-500 text-white font-bold p-4 rounded hover:bg-green-600 transition duration-200"
          >
            Publish Gig
          </button>

          {error && <span className="text-red-500 text-center">{error}</span>}
        </form>
      </div>
    </div>
  );
};

export default Add;
