import React, { useState } from "react";
import { useNavigate } from "react-router-dom";

const Home = () => {
  const [input, setInput] = useState("");
  const navigate = useNavigate();

  const handleSearch = () => {
    if (input.trim()) {
      navigate(`/gigs?search=${input}`);
    }
  };

  const handleEnter = (e) => {
    if (e.key === "Enter") handleSearch();
  };

  return (
    <div className="flex flex-col items-center justify-center bg-green-900 text-white min-h-[600px] w-full">
      <div className="flex flex-col gap-6 items-start max-w-5xl w-full px-5">
        {/* Hero Text */}
        <h1 className="text-5xl font-bold leading-tight">
          Find the perfect <span className="italic font-light">freelance</span>{" "}
          <br />
          services for your business
        </h1>

        {/* Search Bar */}
        <div className="bg-white rounded flex items-center justify-between w-full max-w-2xl h-12 overflow-hidden mt-4">
          <div className="flex items-center gap-2 pl-4 w-full">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              strokeWidth={1.5}
              stroke="gray"
              className="w-6 h-6"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M21 21l-5.197-5.197m0 0A7.5 7.5 0 105.196 5.196a7.5 7.5 0 0010.607 10.607z"
              />
            </svg>
            <input
              type="text"
              placeholder="Try 'building mobile app'"
              className="border-none outline-none text-gray-700 w-full h-full"
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={handleEnter}
            />
          </div>
          <button
            onClick={handleSearch}
            className="bg-green-500 text-white font-semibold h-full px-8 hover:bg-green-600 transition-colors"
          >
            Search
          </button>
        </div>

        {/* Popular Tags */}
        <div className="flex gap-4 items-center text-sm font-semibold mt-2">
          <span>Popular:</span>
          <button className="border border-white rounded-full px-3 py-1 hover:bg-white hover:text-green-900 transition">
            Web Design
          </button>
          <button className="border border-white rounded-full px-3 py-1 hover:bg-white hover:text-green-900 transition">
            WordPress
          </button>
          <button className="border border-white rounded-full px-3 py-1 hover:bg-white hover:text-green-900 transition">
            Logo Design
          </button>
          <button className="border border-white rounded-full px-3 py-1 hover:bg-white hover:text-green-900 transition">
            AI Services
          </button>
        </div>
      </div>
    </div>
  );
};

export default Home;
