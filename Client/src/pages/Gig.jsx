import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import newRequest from "../utils/newRequest";
import BidList from "../components/BidList"; // <--- Import the new component

const Gig = () => {
  const { id } = useParams();
  const [gig, setGig] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  // For Freelancer Bid Form
  const [bidPrice, setBidPrice] = useState("");
  const [bidMessage, setBidMessage] = useState("");
  const [bidSuccess, setBidSuccess] = useState(false);

  const currentUser = JSON.parse(localStorage.getItem("currentUser"));

  // Fetch Gig Data
  useEffect(() => {
    const fetchGig = async () => {
      try {
        const res = await newRequest.get(`/gigs/single/${id}`);
        setGig(res.data);
      } catch (err) {
        console.log(err);
      } finally {
        setIsLoading(false);
      }
    };
    fetchGig();
  }, [id]);

  const handleBidSubmit = async (e) => {
    e.preventDefault();
    try {
      await newRequest.post("/bids", {
        gigId: gig._id,
        price: bidPrice,
        message: bidMessage,
      });
      setBidSuccess(true);
    } catch (err) {
      alert(err.response?.data || "Error submitting bid");
    }
  };

  if (isLoading) return <div className="pt-20 text-center">Loading...</div>;
  if (!gig) return <div className="pt-20 text-center">Gig not found</div>;

  // Check if current user is the owner
  // DEBUGGING: Uncomment these lines to see exactly what is confusing the code
  // console.log("Current User ID:", currentUser._id);
  // console.log("Gig Owner ID:", gig.ownerId);

  // If gig.ownerId is an object (populated), use ._id. If it's a string, use it directly.
  const gigOwnerId = gig.ownerId?._id || gig.ownerId;

  // Ensure we compare strings to strings
  const isOwner = currentUser?._id === gigOwnerId;

  return (
    <div className="flex justify-center py-10 px-5 bg-white min-h-screen">
      <div className="w-full max-w-6xl grid grid-cols-1 md:grid-cols-3 gap-10">
        {/* LEFT COLUMN */}
        <div className="md:col-span-2 flex flex-col gap-8">
          <h1 className="text-3xl font-bold text-gray-800">{gig.title}</h1>

          {/* Gig Description */}
          <div className="border p-5 rounded bg-gray-50">
            <h2 className="font-bold text-lg mb-4">About This Job</h2>
            <p className="text-gray-600 leading-7">{gig.description}</p>
          </div>

          {/* --- THE NEW BIDS SECTION (Only visible to Owner) --- */}
          {isOwner && (
            <div className="mt-8 border-t pt-8">
              <BidList
                gigId={id}
                onHireComplete={() => window.location.reload()}
              />
            </div>
          )}
        </div>

        {/* RIGHT COLUMN (Sidebar) */}
        <div className="md:col-span-1">
          <div className="border border-gray-300 rounded-md p-6 sticky top-24 shadow-lg flex flex-col gap-4">
            <div className="flex justify-between items-end">
              <span className="font-medium text-gray-500">Budget</span>
              <span className="text-3xl font-bold text-gray-800">
                ${gig.budget}
              </span>
            </div>

            <div className="mt-2">
              <span
                className={`px-3 py-1 rounded text-sm font-bold ${
                  gig.status === "open"
                    ? "bg-green-100 text-green-700"
                    : "bg-gray-200 text-gray-600"
                }`}
              >
                Status: {gig.status.toUpperCase()}
              </span>
            </div>

            {/* Freelancer Bid Form (Hidden for Owner) */}
            {!isOwner && gig.status === "open" && (
              <form
                onSubmit={handleBidSubmit}
                className="flex flex-col gap-3 mt-4"
              >
                {!bidSuccess ? (
                  <>
                    <input
                      type="number"
                      placeholder="Price"
                      className="border p-2 rounded"
                      onChange={(e) => setBidPrice(e.target.value)}
                      required
                    />
                    <textarea
                      placeholder="Cover letter"
                      className="border p-2 rounded"
                      onChange={(e) => setBidMessage(e.target.value)}
                      required
                    />
                    <button className="bg-green-500 text-white font-bold py-2 rounded">
                      Submit Bid
                    </button>
                  </>
                ) : (
                  <div className="text-green-600 font-bold text-center bg-green-50 p-3 rounded">
                    Bid Sent Successfully!
                  </div>
                )}
              </form>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Gig;
