import React, { useEffect, useState } from "react";
import newRequest from "../utils/newRequest";
import { useLocation } from "react-router-dom";
import GigCard from "../Components/Gigcard";

const Gigs = () => {
  const [data, setData] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  // Hook to get the query string (e.g., "?search=web")
  const { search } = useLocation();

  useEffect(() => {
    const fetchData = async () => {
      setIsLoading(true);
      try {
        // Appends the search query directly to the API call
        const res = await newRequest.get(`/gigs${search}`);
        setData(res.data);
      } catch (err) {
        setError("Failed to load gigs.");
        console.error(err);
      } finally {
        setIsLoading(false);
      }
    };

    fetchData();
  }, [search]); // Re-run whenever the URL search params change

  return (
    <div className="flex justify-center py-10 px-5 bg-white min-h-screen">
      <div className="w-full max-w-7xl flex flex-col gap-6">
        {/* Breadcrumb / Title */}
        <div className="flex flex-col gap-2">
          <h1 className="text-3xl font-bold text-gray-800">
            {search ? `Results for "${search.split("=")[1]}"` : "All Gigs"}
          </h1>
          <p className="text-gray-500">
            Explore the boundaries of art and technology with GigFlow's
            freelancers.
          </p>
        </div>
        {/* Search Bar */}
        <div className="w-full">
          <input
            type="text"
            placeholder="Search for gigs..."
            className="w-full border border-slate-300 rounded p-3 focus:outline-none focus:ring-2 focus:ring-blue-500"
            onKeyDown={(e) => {
              if (e.key === "Enter") {
                const query = e.target.value;
                window.location.href = `/gigs?search=${encodeURIComponent(
                  query
                )}`;
              }
            }}
          />
        </div>

        {/* Grid Display */}
        {isLoading ? (
          <div className="text-center text-2xl py-20 text-gray-400">
            Loading gigs...
          </div>
        ) : error ? (
          <div className="text-center text-red-500 py-20">{error}</div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
            {data.map((gig) => (
              <GigCard key={gig._id} item={gig} />
            ))}
          </div>
        )}

        {/* Empty State */}
        {!isLoading && data.length === 0 && (
          <div className="text-center py-20">
            <h2 className="text-2xl font-bold text-gray-300">No gigs found.</h2>
            <p className="text-gray-400">Try searching for something else!</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default Gigs;
