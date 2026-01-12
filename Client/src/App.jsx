// src/App.jsx
import React from "react";
import {
  BrowserRouter,
  Routes,
  Route,
  Outlet,
  Navigate,
  Link,
} from "react-router-dom";
import Login from "./pages/login";
import Register from "./pages/Register";
import Home from "./pages/Home";
import Navbar from "./Components/Navbar";
import Gigs from "./pages/Gigs";
import Gig from "./pages/Gig";

// Placeholder components (We will replace these later)
const Footer = () => (
  <div className="p-4 bg-gray-800 text-white mt-auto">Footer Component</div>
);

// Import your pages
// import Home from "./pages/Home";
// import Login from "./pages/Login";
// import Register from "./pages/Register";
// import Gigs from "./pages/Gigs";
// import Gig from "./pages/Gig";

function App() {
  // Layout Wrapper: Adds Navbar and Footer to specific pages
  const Layout = () => {
    return (
      <div className="flex flex-col min-h-screen">
        <Navbar />
        {/* Outlet renders the child route's element (Home, Gigs, etc.) */}
        <div className="flex-grow">
          <Outlet />
        </div>
        <Footer />
      </div>
    );
  };

  const Placeholder = ({ title }) => (
    <div className="min-h-[60vh] flex flex-col items-center justify-center bg-gray-50 text-center p-6">
      <h1 className="text-4xl font-bold text-brand-blue mb-4">{title}</h1>
      <p className="text-gray-600">This page is under construction.</p>
      <Link to="/" className="mt-6 text-brand-accent hover:underline font-bold">
        Back to Home
      </Link>
    </div>
  );

  return (
    <BrowserRouter>
      <Routes>
        {/* Routes WITH Navbar & Footer */}
        <Route path="/" element={<Layout />}>
          <Route index element={<Home />} />
          <Route path="gigs" element={<Gigs />} />
          <Route path="gig/:id" element={<Gig />} />
        </Route>

        {/* Routes WITHOUT Navbar & Footer (Clean pages) */}
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />

        {/* Fallback for unknown routes */}
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
