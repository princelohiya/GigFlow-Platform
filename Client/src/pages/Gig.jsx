import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import newRequest from "../utils/newRequest";

const Gig = () => {
  const { id } = useParams(); // Get the Gig ID from URL
  const [gig, setGig] = useState(null);
  const [bids, setBids] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  // For the Bid Form (Freelancers)
  const [bidPrice, setBidPrice] = useState("");
  const [bidMessage, setBidMessage] = useState("");
  const [bidError, setBidError] = useState(null);
  const [bidSuccess, setBidSuccess] = useState(false);

  // Get current user from LocalStorage to check permissions
  const currentUser = JSON.parse(localStorage.getItem("currentUser"));

  // 1. Fetch Gig Details
  useEffect(() => {
    const fetchGig = async () => {
      try {
        const res = await newRequest.get(`/gigs?search=${id}`); // Or create a specific GET /gigs/:id endpoint
        // Since our search API returns an array, we grab the first one if we used search,
        // BUT strictly speaking, you should have a router.get("/:id") in backend.
        // For now, let's assume we filter the array or you implemented GET /:id.
        // Let's assume you added a specific GET /api/gigs/single/:id route or similar.
        // If not, we filter client side from the search result for now:
        const foundGig = res.data.find((g) => g._id === id) || res.data[0];
        setGig(foundGig);

        // 2. If User is Owner, Fetch Bids
        if (currentUser && foundGig && currentUser._id === foundGig.ownerId) {
          const bidsRes = await newRequest.get(`/bids/${id}`);
          setBids(bidsRes.data);
        }
      } catch (err) {
        console.log(err);
      } finally {
        setIsLoading(false);
      }
    };
    fetchGig();
  }, [id, currentUser._id]);

  // Handle Bid Submission (Freelancer)
  const handleBidSubmit = async (e) => {
    e.preventDefault();
    setBidError(null);
    try {
      await newRequest.post("/bids", {
        gigId: gig._id,
        price: bidPrice,
        message: bidMessage,
      });
      setBidSuccess(true);
      setBidPrice("");
      setBidMessage("");
    } catch (err) {
      setBidError(err.response?.data || "Failed to submit bid");
    }
  };

  // Handle Hiring (Owner)
  const handleHire = async (bidId) => {
    try {
      await newRequest.patch(`/bids/${bidId}/hire`);
      // Refresh page or update state locally to show "Hired"
      window.location.reload();
    } catch (err) {
      alert("Error hiring freelancer");
    }
  };

  if (isLoading) return <div className="pt-20 text-center">Loading...</div>;
  if (!gig) return <div className="pt-20 text-center">Gig not found</div>;

  const isOwner = currentUser?._id === gig.ownerId;

  return (
    <div className="flex justify-center py-10 px-5 bg-white min-h-screen">
      <div className="w-full max-w-6xl grid grid-cols-1 md:grid-cols-3 gap-10">
        {/* LEFT COLUMN: Gig Details */}
        <div className="md:col-span-2 flex flex-col gap-8">
          <h1 className="text-3xl font-bold text-gray-800 break-words">
            {gig.title}
          </h1>

          <div className="flex items-center gap-4">
            <img
              className="w-10 h-10 rounded-full object-cover"
              src="https://images.pexels.com/photos/1181686/pexels-photo-1181686.jpeg?auto=compress&cs=tinysrgb&w=1600"
              alt=""
            />
            <div className="flex flex-col">
              <span className="font-bold text-gray-700">
                Client ID: {gig.ownerId}
              </span>
              <span className="text-gray-400 text-sm">Posted 2 days ago</span>
            </div>
          </div>

          <div className="border p-5 rounded bg-gray-50">
            <h2 className="font-bold text-lg mb-4">About This Job</h2>
            <p className="text-gray-600 leading-7">{gig.description}</p>
          </div>

          {/* If Owner: Show Bids List */}
          {isOwner && (
            <div className="mt-8">
              <h2 className="text-2xl font-bold mb-4">
                Received Bids ({bids.length})
              </h2>
              <div className="flex flex-col gap-4">
                {bids.map((bid) => (
                  <div
                    key={bid._id}
                    className={`border p-4 rounded flex justify-between items-center ${
                      bid.status === "rejected"
                        ? "opacity-50 bg-gray-100"
                        : "bg-white shadow-sm"
                    }`}
                  >
                    <div>
                      <h3 className="font-bold text-gray-800">
                        Freelancer:{" "}
                        {bid.freelancerId.username || bid.freelancerId}
                      </h3>
                      <p className="text-gray-600 text-sm mt-1">
                        {bid.message}
                      </p>
                      <div className="mt-2 text-green-600 font-bold">
                        ${bid.price}
                      </div>
                    </div>
                    <div>
                      {bid.status === "pending" && gig.status === "open" && (
                        <button
                          onClick={() => handleHire(bid._id)}
                          className="bg-black text-white px-4 py-2 rounded font-bold hover:bg-gray-800"
                        >
                          Hire
                        </button>
                      )}
                      {bid.status === "hired" && (
                        <span className="bg-green-100 text-green-700 px-3 py-1 rounded font-bold border border-green-300">
                          HIRED
                        </span>
                      )}
                      {bid.status === "rejected" && (
                        <span className="text-red-500 font-bold text-sm">
                          Rejected
                        </span>
                      )}
                    </div>
                  </div>
                ))}
                {bids.length === 0 && (
                  <p className="text-gray-400">No bids yet.</p>
                )}
              </div>
            </div>
          )}
        </div>

        {/* RIGHT COLUMN: Action Box */}
        <div className="md:col-span-1">
          <div className="border border-gray-300 rounded-md p-6 sticky top-24 shadow-lg flex flex-col gap-4">
            <div className="flex justify-between items-end">
              <span className="font-medium text-gray-500">Budget</span>
              <span className="text-3xl font-bold text-gray-800">
                ${gig.budget}
              </span>
            </div>

            <p className="text-gray-500 text-sm">
              {gig.status === "open"
                ? "This job is open for bidding."
                : "This job is already assigned."}
            </p>

            {/* If Freelancer: Show Bid Form */}
            {!isOwner && gig.status === "open" && (
              <div className="flex flex-col gap-3 mt-4">
                {!bidSuccess ? (
                  <>
                    <input
                      type="number"
                      placeholder="Your Price ($)"
                      className="border p-2 rounded"
                      value={bidPrice}
                      onChange={(e) => setBidPrice(e.target.value)}
                    />
                    <textarea
                      placeholder="Why should they hire you?"
                      className="border p-2 rounded h-24 resize-none"
                      value={bidMessage}
                      onChange={(e) => setBidMessage(e.target.value)}
                    />
                    <button
                      onClick={handleBidSubmit}
                      className="bg-green-500 text-white font-bold py-3 rounded hover:bg-green-600 transition"
                    >
                      Submit Proposal
                    </button>
                    {bidError && (
                      <span className="text-red-500 text-sm">{bidError}</span>
                    )}
                  </>
                ) : (
                  <div className="bg-green-100 text-green-700 p-4 rounded text-center">
                    <b>Bid Sent!</b> <br /> The client will review your offer.
                  </div>
                )}
              </div>
            )}

            {/* Closed State */}
            {gig.status === "assigned" && !isOwner && (
              <div className="bg-gray-200 text-gray-600 p-4 rounded text-center font-bold">
                Job Closed
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Gig;
