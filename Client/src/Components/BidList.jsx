import React, { useEffect, useState } from "react";
import newRequest from "../utils/newRequest";

const BidList = ({ gigId, onHireComplete }) => {
  const [bids, setBids] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  // API 1: Fetch all bids for this gig
  useEffect(() => {
    const fetchBids = async () => {
      try {
        const res = await newRequest.get(`/bids/${gigId}`);
        setBids(res.data);
        setIsLoading(false);
      } catch (err) {
        setError("Failed to load bids.");
        setIsLoading(false);
      }
    };
    fetchBids();
  }, [gigId]);

  // API 2: The Hiring Logic
  const handleHire = async (bidId) => {
    try {
      await newRequest.patch(`/bids/${bidId}/hire`);
      // Notify parent to refresh the Gig status (Open -> Assigned)
      onHireComplete();
    } catch (err) {
      alert(err.response?.data || "Error hiring freelancer");
    }
  };

  if (isLoading) return <p className="text-gray-500">Loading proposals...</p>;
  if (error) return <p className="text-red-500">{error}</p>;
  if (bids.length === 0)
    return <p className="text-gray-400 italic">No bids placed yet.</p>;

  return (
    <div className="flex flex-col gap-4 mt-4">
      <h3 className="font-bold text-xl text-gray-800">
        Proposals ({bids.length})
      </h3>

      {bids.map((bid) => (
        <div
          key={bid._id}
          className={`p-4 border rounded-md flex justify-between items-center ${
            bid.status === "rejected" ? "opacity-50 bg-gray-100" : "bg-white"
          }`}
        >
          {/* Freelancer Info */}
          <div>
            <div className="flex items-center gap-2 mb-1">
              <span className="font-bold text-gray-700">
                {/* Handle populated user object or fallback */}
                {bid.freelancerId.username || "Freelancer"}
              </span>
              <span className="text-xs text-gray-400">
                • {new Date(bid.createdAt).toLocaleDateString()}
              </span>
            </div>

            <p className="text-gray-600 text-sm italic">"{bid.message}"</p>
            <div className="mt-2 font-semibold text-green-600">
              Bid Amount: ${bid.price}
            </div>
          </div>

          {/* Action Buttons */}
          <div>
            {bid.status === "pending" && (
              <button
                onClick={() => handleHire(bid._id)}
                className="bg-black text-white px-4 py-2 rounded font-bold hover:bg-gray-800 transition shadow-md"
              >
                Hire
              </button>
            )}

            {bid.status === "hired" && (
              <span className="bg-green-100 text-green-700 px-3 py-1 rounded border border-green-300 font-bold text-sm">
                HIRED
              </span>
            )}

            {bid.status === "rejected" && (
              <span className="text-gray-400 font-medium text-sm border border-gray-300 px-2 py-1 rounded">
                Rejected
              </span>
            )}
          </div>
        </div>
      ))}
    </div>
  );
};

export default BidList;
