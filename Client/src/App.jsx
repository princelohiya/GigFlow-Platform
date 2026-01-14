// src/App.jsx
import {
  BrowserRouter,
  Routes,
  Route,
  Outlet,
  Navigate,
  Link,
} from "react-router-dom";
import Login from "./pages/Login";
import Register from "./pages/Register";
import Home from "./pages/Home";
import Navbar from "./Components/Navbar";
import Gigs from "./pages/Gigs";
import Gig from "./pages/Gig";
import Add from "./pages/Add";

// Placeholder components (We will replace these later)
const Footer = () => {
  return (
    <div className="bg-gray-900 py-8 text-gray-200 text-sm mt-auto border-t border-gray-800">
      <div className="max-w-7xl mx-auto px-5 flex flex-col sm:flex-row justify-between items-center gap-4">
        {/* Simple Brand Logo */}
        <div className="font-bold text-xl tracking-tighter">
          Gig<span className="text-green-500">Flow</span>.
        </div>

        {/* Copyright Text */}
        <div className="text-gray-400">
          © {new Date().getFullYear()} GigFlow International Ltd.
        </div>
      </div>
    </div>
  );
};

function App() {
  // Layout Wrapper: Adds Navbar and Footer to specific pages
  const Layout = () => {
    return (
      <div className="flex flex-col min-h-screen">
        <Navbar />
        {/* Outlet renders the child route's element (Home, Gigs, etc.) */}
        <div className="flex-1">
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
          <Route path="/add" element={<Add />} />
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
