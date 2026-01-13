import React from "react";
import { Link } from "react-router-dom";

const GigCard = ({ item }) => {
  return (
    <Link to={`/gig/${item._id}`} className="block">
      <div className="w-full h-full border border-gray-300 rounded-md overflow-hidden hover:shadow-lg transition-shadow bg-white flex flex-col">
        {/* We don't have images in the schema yet, so we use a placeholder color or pattern */}
        <div className="h-40 bg-gray-200 flex items-center justify-center text-gray-400">
          <span className="text-4xl font-bold opacity-20">GIG</span>
        </div>

        <div className="p-5 flex flex-col gap-4 flex-grow">
          {/* User Info */}
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-full bg-green-500 flex items-center justify-center text-white font-bold text-xs">
              {/* Extract first letter of owner ID or fetch owner name via populate if available */}
              U
            </div>
            <div className="flex flex-col ">
              <span className="font-bold text-sm">
                Username : {item.ownerId.username || "Unknown"}
              </span>

              <span className=" text-sm">
                {/* User ID: {item.ownerId._id.substring(0, 10)}... */}
              </span>
            </div>
          </div>

          {/* Title */}
          <p className="text-gray-800 font-medium text-lg leading-snug line-clamp-2">
            {item.title}
          </p>

          {/* Star Rating (Static for now) */}
          <div className="flex items-center gap-1 text-yellow-500 font-bold">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 24 24"
              fill="currentColor"
              className="w-4 h-4"
            >
              <path
                fillRule="evenodd"
                d="M10.788 3.21c.448-1.077 1.976-1.077 2.424 0l2.082 5.007 5.404.433c1.164.093 1.636 1.545.749 2.305l-4.117 3.527 1.257 5.273c.271 1.136-.964 2.033-1.96 1.425L12 18.354 7.373 21.18c-.996.608-2.231-.29-1.96-1.425l1.257-5.273-4.117-3.527c-.887-.76-.415-2.212.749-2.305l5.404-.433 2.082-5.006z"
                clipRule="evenodd"
              />
            </svg>
            <span>5.0</span>
            <span className="text-gray-400 font-normal">(New)</span>
          </div>
        </div>

        {/* Footer: Price */}
        <div className="p-4 border-t border-gray-200 flex items-center justify-between">
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
              d="M21 8.25c0-2.485-2.099-4.5-4.688-4.5-1.935 0-3.597 1.126-4.312 2.733-.715-1.607-2.377-2.733-4.313-2.733C5.1 3.75 3 5.765 3 8.25c0 7.22 9 12 9 12s9-4.78 9-12z"
            />
          </svg>
          <div className="text-right">
            <span className="text-gray-400 text-xs font-semibold block uppercase">
              Starting At
            </span>
            <span className="text-gray-900 text-lg font-bold">
              ${item.budget}
            </span>
          </div>
        </div>
      </div>
    </Link>
  );
};

export default GigCard;
