# GigFlow - Freelance Marketplace

GigFlow is a full-stack MERN application where clients can post jobs (Gigs) and freelancers can apply for them (Bids). It features real-time notifications using Socket.io and atomic hiring transactions.

## Features

- **Authentication:** JWT-based auth with HttpOnly cookies.
- **Gig Management:** Post, search, and delete gigs.
- **Bidding System:** Freelancers can bid; Clients can review and hire.
- **Real-time Notifications:** Freelancers get instant alerts when hired (Socket.io).
- **Atomic Transactions:** Ensures a gig cannot be double-booked.

## Tech Stack

- **Frontend:** React (Vite), Tailwind CSS
- **Backend:** Node.js, Express.js
- **Database:** MongoDB (Mongoose)
- **Real-time:** Socket.io

## Environment Variables

Create a `.env` file in the `server` folder using `.env.example` as a reference:

- `MONGO_URI`: Your MongoDB connection string.
- `JWT_SECRET`: A secret string for signing tokens.

## Installation & Run

### 1. Backend

```bash
cd server
npm install
npm start
# Server runs on http://localhost:3000
```

### 2. Frontend

cd client
npm install
npm run dev

# Client runs on http://localhost:5173

Demo Credentials (Seeded)

Client: client@test.com / 123456
Freelancer: jane@test.com / 123456
